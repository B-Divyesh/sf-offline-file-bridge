import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ANDROID_CLAIM_METHODS, sha256, verifyAndroidClaimEvidence } from "./android-claim-contract.mjs";
import { buildMetadata } from "./build-metadata.mjs";
import { verifyApk, verifyTagCommit } from "./release-contract.mjs";

const repository = "B-Divyesh/sf-offline-file-bridge";
const tag = `v${buildMetadata.version}`;

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  invariant(response.ok, `Request failed (${response.status}): ${url}`);
  return response.json();
}

const release = await getJson(`https://api.github.com/repos/${repository}/releases/latest`);
invariant(release.tag_name === tag, `Latest release ${release.tag_name} is not ${tag}.`);
verifyTagCommit(tag, buildMetadata.commit);
const apk = release.assets.find((asset) => asset.name === `offline-file-bridge-${tag}.apk`);
const provenanceAsset = release.assets.find((asset) => asset.name === "BUILD-PROVENANCE.json");
const claimsAsset = release.assets.find((asset) => asset.name === "ANDROID-CLAIMS.json");
invariant(apk && provenanceAsset && claimsAsset, "Release is missing the APK, build provenance, or Android claim evidence.");

const scratch = await mkdtemp(join(tmpdir(), "offline-file-bridge-release-"));
try {
  const apkResponse = await fetch(apk.browser_download_url);
  invariant(apkResponse.ok, `APK download failed (${apkResponse.status}).`);
  await writeFile(join(scratch, apk.name), Buffer.from(await apkResponse.arrayBuffer()));
  const provenanceResponse = await fetch(provenanceAsset.browser_download_url);
  invariant(provenanceResponse.ok, `Provenance download failed (${provenanceResponse.status}).`);
  const published = await provenanceResponse.json();
  const claimsResponse = await fetch(claimsAsset.browser_download_url);
  invariant(claimsResponse.ok, `Android claim evidence download failed (${claimsResponse.status}).`);
  const claimsBytes = Buffer.from(await claimsResponse.arrayBuffer());
  if (claimsAsset.digest) invariant(claimsAsset.digest === `sha256:${sha256(claimsBytes)}`, "Android claim evidence does not match its GitHub digest.");
  const androidEvidence = JSON.parse(claimsBytes.toString("utf8"));
  const checked = await verifyApk({
    apkPath: join(scratch, apk.name),
    tag,
    commit: buildMetadata.commit,
    provenancePath: join(scratch, "checked-provenance.json")
  });
  for (const field of ["product", "tag", "version", "commit", "apkSha256", "webFileCount", "webTreeSha256", "payloadFileCount", "payloadTreeSha256"]) {
    invariant(published[field] === checked[field], `Published provenance mismatch for ${field}.`);
  }
  for (const claim of Object.keys(ANDROID_CLAIM_METHODS)) {
    verifyAndroidClaimEvidence(androidEvidence, claim, {
      tag,
      version: buildMetadata.version,
      commit: buildMetadata.commit,
      apkName: apk.name,
      apkSha256: checked.apkSha256,
      payloadTreeSha256: checked.payloadTreeSha256
    });
  }
  console.log(`@claim:apk-payload-match PASS ${tag} ${checked.payloadTreeSha256}`);
} finally {
  await rm(scratch, { recursive: true, force: true });
}
