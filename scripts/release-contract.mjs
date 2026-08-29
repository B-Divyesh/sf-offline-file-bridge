import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function filesBelow(directory, prefix = "") {
  const entries = await readdir(join(directory, prefix), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const name = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(directory, name));
    else if (entry.isFile()) files.push(name.replaceAll("\\", "/"));
  }
  return files.sort();
}

export async function verifySourceVersion(tag) {
  const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  const gradle = await readFile(join(root, "android/app/build.gradle"), "utf8");
  const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
  const versionCode = Number(gradle.match(/versionCode\s+(\d+)/)?.[1]);
  invariant(tag === `v${packageJson.version}`, `Release tag ${tag} does not match package version v${packageJson.version}.`);
  invariant(versionName === packageJson.version, `Android version ${versionName} does not match package version ${packageJson.version}.`);
  invariant(Number.isInteger(versionCode) && versionCode > 1, "Android versionCode must increase beyond the published v0.1.1 build.");
  return { version: packageJson.version, versionCode };
}

export async function verifyApk({ apkPath, tag, commit, provenancePath }) {
  const { version, versionCode } = await verifySourceVersion(tag);
  invariant(/^[0-9a-f]{40}$/.test(commit), `Expected a full commit SHA, received ${commit}.`);
  const apk = resolve(root, apkPath);
  const entries = new Set(execFileSync("unzip", ["-Z1", apk], { encoding: "utf8" }).trim().split("\n"));
  const dist = join(root, "dist");
  const webFiles = await filesBelow(dist);
  const treeLines = [];

  for (const file of webFiles) {
    const entry = `assets/public/${file}`;
    invariant(entries.has(entry), `APK is missing built web file ${entry}.`);
    const localBytes = await readFile(join(dist, file));
    const packagedBytes = execFileSync("unzip", ["-p", apk, entry], { maxBuffer: 50 * 1024 * 1024 });
    invariant(localBytes.equals(packagedBytes), `APK web file differs from dist: ${file}.`);
    treeLines.push(`${digest(localBytes)}  ${file}`);
  }

  const identity = JSON.parse(execFileSync("unzip", ["-p", apk, "assets/public/build-identity.json"], { encoding: "utf8" }));
  invariant(identity.product === "offline-file-bridge", "APK build identity has the wrong product.");
  invariant(identity.version === version, `APK version ${identity.version} does not match ${version}.`);
  invariant(identity.commit === commit, `APK commit ${identity.commit} does not match ${commit}.`);

  const apkBytes = await readFile(apk);
  const provenance = {
    product: identity.product,
    tag,
    version,
    versionCode,
    commit,
    apk: basename(apk),
    apkSha256: digest(apkBytes),
    webFileCount: webFiles.length,
    webTreeSha256: digest(`${treeLines.join("\n")}\n`)
  };
  await mkdir(dirname(resolve(root, provenancePath)), { recursive: true });
  await writeFile(resolve(root, provenancePath), `${JSON.stringify(provenance, null, 2)}\n`);
  return provenance;
}

async function main() {
  const [mode, ...args] = process.argv.slice(2);
  if (mode === "source" && args.length === 1) {
    console.log(JSON.stringify(await verifySourceVersion(args[0])));
    return;
  }
  if (mode === "artifact" && args.length === 4) {
    console.log(JSON.stringify(await verifyApk({ apkPath: args[0], tag: args[1], commit: args[2], provenancePath: args[3] })));
    return;
  }
  throw new Error("Usage: release-contract.mjs source <tag> | artifact <apk> <tag> <commit> <provenance-output>");
}

if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  await main();
}
