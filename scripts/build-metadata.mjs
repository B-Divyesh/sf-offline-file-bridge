import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

function currentCommit() {
  const supplied = process.env.BUILD_COMMIT;
  if (supplied) return supplied.trim().toLowerCase();
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
  // A candidate always identifies the commit that actually built it. A tag is
  // only an external release reference and must never override newer source.
  commit: currentCommit()
});
