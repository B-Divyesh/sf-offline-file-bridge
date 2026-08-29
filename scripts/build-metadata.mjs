import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const releaseJson = JSON.parse(readFileSync(new URL("../.factory/release.json", import.meta.url), "utf8"));

export function isPostReleaseEvidencePath(path) {
  return path === ".factory/handoff.md" ||
    /^\.factory\/polish-\d+\.md$/.test(path) ||
    /^\.factory\/verification-\d+\.md$/.test(path) ||
    path.startsWith(".factory/verification-artifacts/") ||
    path.startsWith("verification-artifacts/");
}

export function selectBuildCommit({ head, tagCommit, tagIsAncestor, changedFiles }) {
  if (!tagCommit || !tagIsAncestor) return { commit: head, releaseEquivalent: false, changedFiles };
  if (head === tagCommit) return { commit: tagCommit, releaseEquivalent: true, changedFiles: [] };
  const evidenceOnly = changedFiles.length > 0 && changedFiles.every(isPostReleaseEvidencePath);
  return { commit: evidenceOnly ? tagCommit : head, releaseEquivalent: evidenceOnly, changedFiles };
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().toLowerCase();
}

function checkoutIdentity() {
  let head = "unknown";
  try {
    head = git(["rev-parse", "HEAD"]);
    const tagCommit = git(["rev-parse", `${releaseJson.tag}^{commit}`]);
    let tagIsAncestor = true;
    try { execFileSync("git", ["merge-base", "--is-ancestor", tagCommit, head], { stdio: "ignore" }); }
    catch { tagIsAncestor = false; }
    const changedFiles = tagIsAncestor && head !== tagCommit
      ? git(["diff", "--name-only", `${tagCommit}..${head}`]).split("\n").filter(Boolean)
      : [];
    return { head, tag: releaseJson.tag, tagCommit, ...selectBuildCommit({ head, tagCommit, tagIsAncestor, changedFiles }) };
  } catch {
    return { head, tag: releaseJson.tag, tagCommit: "", commit: head, releaseEquivalent: false, changedFiles: [] };
  }
}

function currentCommit() {
  const supplied = process.env.BUILD_COMMIT;
  if (supplied) return supplied.trim().toLowerCase();
  return buildContext.commit;
}

if (releaseJson.version !== packageJson.version || releaseJson.tag !== `v${packageJson.version}`) {
  throw new Error(".factory/release.json must match the package version and release tag.");
}

export const buildContext = Object.freeze(checkoutIdentity());

export const buildMetadata = Object.freeze({
  product: "offline-file-bridge",
  version: packageJson.version,
  // A post-release evidence commit can rebuild the exact tagged product. Any
  // product, claim, test, README, or configuration change identifies HEAD and
  // therefore requires a new Android release.
  commit: currentCommit()
});
