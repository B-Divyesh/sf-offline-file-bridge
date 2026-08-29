import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import { buildMetadata } from "../scripts/build-metadata.mjs";
import { verifySourceVersion } from "../scripts/release-contract.mjs";

describe("Android release identity contract", () => {
  test("docs-only commits keep the immutable version tag as build identity", () => {
    const releaseCommit = execFileSync("git", ["rev-parse", "v0.1.2^{commit}"], { encoding: "utf8" }).trim();
    expect(buildMetadata.commit).toBe(releaseCommit);
  });

  test("accepts only the source version's unique release tag", async () => {
    await expect(verifySourceVersion("v0.1.2")).resolves.toEqual({ version: "0.1.2", versionCode: 2 });
    await expect(verifySourceVersion("v0.1.1")).rejects.toThrow("does not match package version v0.1.2");
  });

  test("the release job verifies the packaged web payload before publishing", async () => {
    const workflow = await readFile(".github/workflows/android.yml", "utf8");
    expect(workflow).toContain('release-contract.mjs source "$GITHUB_REF_NAME"');
    expect(workflow).toContain('release-contract.mjs artifact "release/offline-file-bridge-v${VERSION}.apk" "$GITHUB_REF_NAME" "$GITHUB_SHA" "release/BUILD-PROVENANCE.json"');
    expect(workflow.indexOf("release-contract.mjs artifact")).toBeLessThan(workflow.indexOf("softprops/action-gh-release"));
    expect(workflow).toContain("release/BUILD-PROVENANCE.json");
  });

  test("the updated service worker replaces old caches and takes control", async () => {
    const worker = await readFile("public/sw.js", "utf8");
    expect(worker).toContain('const CACHE = "offline-file-bridge-v3"');
    expect(worker).toContain("self.skipWaiting()");
    expect(worker).toContain("self.clients.claim()");
    expect(worker).toContain("key !== CACHE");
  });
});
