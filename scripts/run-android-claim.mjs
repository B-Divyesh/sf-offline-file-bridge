import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  ANDROID_CLAIM_METHODS,
  ANDROID_TEST_CLASS,
  createLocalClaimResult,
  invariant,
  sha256,
  verifyAndroidClaimEvidence
} from "./android-claim-contract.mjs";
import { buildMetadata } from "./build-metadata.mjs";
import { verifyTagCommit } from "./release-contract.mjs";

const claim = process.argv[2];
if (!claim || !(claim in ANDROID_CLAIM_METHODS)) {
  throw new Error(`Choose one Android claim: ${Object.keys(ANDROID_CLAIM_METHODS).join(", ")}.`);
}

const selector = `${ANDROID_TEST_CLASS}#${ANDROID_CLAIM_METHODS[claim]}`;
const mode = process.env.ANDROID_CLAIM_MODE || "auto";
invariant(["auto", "local", "published"].includes(mode), "ANDROID_CLAIM_MODE must be auto, local, or published.");

function commandRuns(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  return result.status === 0 ? `${result.stdout || ""}${result.stderr || ""}` : "";
}

function hasConnectedAndroid() {
  if (!commandRuns("java", ["-version"])) return false;
  return /^\S+\s+device$/m.test(commandRuns("adb", ["devices"]));
}

async function filesBelow(directory) {
  if (!existsSync(directory)) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  }));
  return nested.flat();
}

async function newestPassingReport() {
  const root = resolve("android/app/build/outputs/androidTest-results/connected");
  const candidates = [];
  for (const path of (await filesBelow(root)).filter((file) => file.endsWith(".xml"))) {
    const xml = await readFile(path, "utf8");
    if (!xml.includes(ANDROID_CLAIM_METHODS[claim]) || !xml.includes(ANDROID_TEST_CLASS)) continue;
    candidates.push({ path, xml, modified: (await stat(path)).mtimeMs });
  }
  candidates.sort((left, right) => right.modified - left.modified);
  invariant(candidates.length > 0, `Gradle passed ${claim}, but its JUnit XML report is missing.`);
  return candidates[0];
}

async function runLocally() {
  const gradle = resolve("android/gradlew");
  invariant(existsSync(gradle), "Android Gradle wrapper is missing.");
  try {
    execFileSync(gradle, [
      "connectedReleaseAndroidTest",
      `-Pandroid.testInstrumentationRunnerArguments.class=${selector}`
    ], { cwd: resolve("android"), stdio: "inherit" });
  } catch (error) {
    throw new Error(`@claim:${claim} requires a connected Android emulator or device. ${error instanceof Error ? error.message : ""}`);
  }
  const report = await newestPassingReport();
  const result = createLocalClaimResult(claim, report.xml);
  const outputDirectory = resolve(process.env.ANDROID_CLAIM_RESULTS_DIR || ".android-claim-results");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, `${claim}.json`), `${JSON.stringify(result, null, 2)}\n`);
  console.log(`@claim:${claim} PASS installed release APK ${selector}`);
}

function githubHeaders() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "offline-file-bridge-verifier" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function getResponse(url) {
  const response = await fetch(url, { headers: githubHeaders() });
  invariant(response.ok, `Request failed (${response.status}): ${url}`);
  return response;
}

async function getAsset(release, name) {
  const asset = release.assets.find((candidate) => candidate.name === name);
  invariant(asset, `Release ${release.tag_name} is missing ${name}.`);
  const response = await getResponse(asset.browser_download_url);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (asset.digest) invariant(asset.digest === `sha256:${sha256(bytes)}`, `${name} does not match its GitHub digest.`);
  return { asset, bytes };
}

async function verifyPublishedResult() {
  const repository = "B-Divyesh/sf-offline-file-bridge";
  const tag = `v${buildMetadata.version}`;
  verifyTagCommit(tag, buildMetadata.commit);
  const release = await (await getResponse(`https://api.github.com/repos/${repository}/releases/latest`)).json();
  invariant(release.tag_name === tag, `Latest release ${release.tag_name} is not ${tag}.`);
  const apkAsset = release.assets.find((asset) => asset.name === `offline-file-bridge-${tag}.apk`);
  invariant(apkAsset?.digest?.startsWith("sha256:") && apkAsset.size > 1_000_000,
    `Release ${tag} has no checksummed installable APK.`);
  const [{ bytes: evidenceBytes }, { bytes: provenanceBytes }] = await Promise.all([
    getAsset(release, "ANDROID-CLAIMS.json"),
    getAsset(release, "BUILD-PROVENANCE.json")
  ]);
  const evidence = JSON.parse(evidenceBytes.toString("utf8"));
  const provenance = JSON.parse(provenanceBytes.toString("utf8"));
  invariant(provenance.product === "offline-file-bridge" && provenance.tag === tag,
    "Published APK provenance has the wrong product or tag.");
  invariant(provenance.version === buildMetadata.version && provenance.commit === buildMetadata.commit,
    "Published APK provenance does not match this candidate.");
  invariant(apkAsset.digest === `sha256:${provenance.apkSha256}`,
    "Published APK digest does not match its build provenance.");
  verifyAndroidClaimEvidence(evidence, claim, {
    tag,
    version: buildMetadata.version,
    commit: buildMetadata.commit,
    apkName: apkAsset.name,
    apkSha256: provenance.apkSha256,
    payloadTreeSha256: provenance.payloadTreeSha256
  });
  console.log(`@claim:${claim} PASS published installed-release evidence ${tag} ${selector}`);
}

const canRunLocally = hasConnectedAndroid();
if (mode === "local") invariant(canRunLocally, `@claim:${claim} local mode requires Java, ADB, and a connected Android device.`);
if (mode === "local" || (mode === "auto" && canRunLocally)) await runLocally();
else await verifyPublishedResult();
