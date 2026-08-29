import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import { buildMetadata } from "../scripts/build-metadata.mjs";
import { verifyReleaseCandidate, verifySourceVersion, verifyTagCommit } from "../scripts/release-contract.mjs";

describe("Android release identity contract", () => {
  test("a candidate build identifies HEAD instead of an older version tag", () => {
    const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const oldTag = execFileSync("git", ["rev-parse", "v0.1.2^{commit}"], { encoding: "utf8" }).trim();
    expect(buildMetadata.commit).toBe(head);
    expect(buildMetadata.commit).not.toBe(oldTag);
  });

  test("accepts only the source version's unique release tag", async () => {
    await expect(verifySourceVersion("v0.1.8")).resolves.toEqual({ version: "0.1.8", versionCode: 8 });
    await expect(verifySourceVersion("v0.1.7")).rejects.toThrow("does not match package version v0.1.8");
  });

  test("@regression:release-tag cannot reuse an older candidate commit", async () => {
    const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    await expect(verifyReleaseCandidate("v0.1.8", head, () => head)).resolves.toEqual({ version: "0.1.8", versionCode: 8, commit: head });
    expect(() => verifyTagCommit("v0.1.8", head, () => "e8debdc51c78ef81bb09a1f2c9b0c32b0eb0b951")).toThrow("not candidate");
  });

  test("the release job verifies the packaged web payload before publishing", async () => {
    const workflow = await readFile(".github/workflows/android.yml", "utf8");
    expect(workflow).toContain('git rev-parse "${GITHUB_REF_NAME}^{commit}"');
    expect(workflow).toContain('release-contract.mjs candidate "$GITHUB_REF_NAME" "$RELEASE_COMMIT"');
    expect(workflow).toContain('BUILD_COMMIT="$RELEASE_COMMIT" npm run build');
    expect(workflow).toContain('script: sh scripts/wait-for-android.sh && cd android && ./gradlew connectedReleaseAndroidTest');
    expect(workflow).toContain('api-level: 35');
    const androidWait = await readFile("scripts/wait-for-android.sh", "utf8");
    expect(androidWait).toContain('adb shell cmd package list packages android');
    expect(androidWait).toContain('Android Package Manager did not become ready.');
    expect(androidWait).toContain('while [ "$attempt" -le 90 ]');
    expect(androidWait).toContain('set -eu');
    expect(workflow).not.toContain('set -euo pipefail');
    expect(workflow).toContain('release-contract.mjs artifact "release/offline-file-bridge-v${VERSION}.apk" "$GITHUB_REF_NAME" "$RELEASE_COMMIT" "release/BUILD-PROVENANCE.json"');
    expect(workflow.indexOf("release-contract.mjs artifact")).toBeLessThan(workflow.indexOf("softprops/action-gh-release"));
    expect(workflow).toContain("release/BUILD-PROVENANCE.json");
    expect(workflow).toContain('release-contract.mjs notes "release/BUILD-PROVENANCE.json" "release/RELEASE-NOTES.md"');
    expect(workflow).toContain("body_path: release/RELEASE-NOTES.md");
  });

  test("the updated service worker replaces old caches and takes control", async () => {
    const worker = await readFile("public/sw.js", "utf8");
    expect(worker).toContain('const CACHE = "offline-file-bridge-v3"');
    expect(worker).toContain("self.skipWaiting()");
    expect(worker).toContain("self.clients.claim()");
    expect(worker).toContain("key !== CACHE");
  });
});
