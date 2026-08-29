import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

function currentCommit(version) {
  const supplied = process.env.BUILD_COMMIT;
  if (supplied) return supplied.trim().toLowerCase();
  try {
    return execFileSync("git", ["rev-parse", `v${version}^{commit}`], { encoding: "utf8" }).trim().toLowerCase();
  } catch {
    // A release tag does not exist during the first candidate build.
  }
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.trim().toLowerCase();
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim().toLowerCase();
  } catch {
    return "unknown";
  }
}

export const buildMetadata = Object.freeze({
  product: "offline-file-bridge",
  version: packageJson.version,
  commit: currentCommit(packageJson.version)
});
