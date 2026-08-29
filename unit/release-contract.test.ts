import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import { buildMetadata } from "../scripts/build-metadata.mjs";
import { verifyReleaseCandidate, verifySourceVersion, verifyTagCommit } from "../scripts/release-contract.mjs";

const releaseTag = `v${buildMetadata.version}`;

describe("Android release identity contract", () => {
  test("a candidate build identifies HEAD instead of an older version tag", () => {
    const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const oldTag = execFileSync("git", ["rev-parse", "v0.1.2^{commit}"], { encoding: "utf8" }).trim();
    expect(buildMetadata.commit).toBe(head);
    expect(buildMetadata.commit).not.toBe(oldTag);
  });

  test("accepts only the source version's unique release tag", async () => {
    await expect(verifySourceVersion(releaseTag)).resolves.toEqual({ version: buildMetadata.version, versionCode: 13 });
    await expect(verifySourceVersion("v0.1.11")).rejects.toThrow(`does not match package version ${releaseTag}`);
  });

  test("@regression:release-tag cannot reuse an older candidate commit", async () => {
    const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    await expect(verifyReleaseCandidate(releaseTag, head, () => head)).resolves.toEqual({ version: buildMetadata.version, versionCode: 13, commit: head });
    expect(() => verifyTagCommit(releaseTag, head, () => "e8debdc51c78ef81bb09a1f2c9b0c32b0eb0b951")).toThrow("not candidate");
  });

  test("the release job verifies the packaged web payload before publishing", async () => {
    const workflow = await readFile(".github/workflows/android.yml", "utf8");
    expect(workflow).toContain('git rev-parse "${GITHUB_REF_NAME}^{commit}"');
    expect(workflow).toContain('release-contract.mjs candidate "$GITHUB_REF_NAME" "$RELEASE_COMMIT"');
    expect(workflow).toContain('BUILD_COMMIT="$RELEASE_COMMIT" npm run build');
    expect(workflow.indexOf("Build the signed APK and app bundle to be tested")).toBeLessThan(
      workflow.indexOf("Run installed-APK Android instrumentation")
    );
    expect(workflow.indexOf("Run installed-APK Android instrumentation")).toBeLessThan(
      workflow.indexOf("Run Android unit tests without rebuilding the tested release")
    );
    const workflowAfterInstrumentation = workflow.slice(workflow.indexOf("Run Android unit tests without rebuilding the tested release"));
    expect(workflowAfterInstrumentation).not.toContain("assembleRelease");
    expect(workflowAfterInstrumentation).not.toContain("bundleRelease");
    expect(workflow).toContain('sh scripts/wait-for-android.sh &&');
    for (const claim of ["scoped-folder-access", "native-refresh-safety", "consent-removal", "native-handoff"]) {
      expect(workflow).toContain(`npm run test:android-claim -- ${claim}`);
    }
    expect(workflow).toContain('api-level: 35');
    const androidWait = await readFile("scripts/wait-for-android.sh", "utf8");
    expect(androidWait).toContain('adb shell cmd package list packages android');
    expect(androidWait).toContain('Android Package Manager did not become ready.');
    expect(androidWait).toContain('while [ "$attempt" -le 90 ]');
    expect(androidWait).toContain('set -eu');
    expect(workflow).not.toContain('set -euo pipefail');
    expect(workflow).toContain('release-contract.mjs artifact "release/offline-file-bridge-v${VERSION}.apk" "$GITHUB_REF_NAME" "$RELEASE_COMMIT" "release/BUILD-PROVENANCE.json"');
    expect(workflow).toContain('write-android-claim-evidence.mjs "release/BUILD-PROVENANCE.json" "release/ANDROID-CLAIMS.json"');
    expect(workflow).toContain("actions/attest-build-provenance@v2");
    expect(workflow).toContain("release/ANDROID-CLAIMS.json");
    expect(workflow).toContain("ANDROID_CLAIM_MODE: local");
    expect(workflow.indexOf("release-contract.mjs artifact")).toBeLessThan(workflow.indexOf("softprops/action-gh-release"));
    expect(workflow).toContain("release/BUILD-PROVENANCE.json");
    expect(workflow).toContain('release-contract.mjs notes "release/BUILD-PROVENANCE.json" "release/RELEASE-NOTES.md"');
    expect(workflow).toContain("body_path: release/RELEASE-NOTES.md");
  });

  test("the updated service worker replaces old caches and takes control", async () => {
    const worker = await readFile("public/sw.js", "utf8");
    expect(worker).toContain('const CACHE = "offline-file-bridge-v5"');
    expect(worker).toContain("self.skipWaiting()");
    expect(worker).toContain("self.clients.claim()");
    expect(worker).toContain("key !== CACHE");
  });

  test("the browser verifier uses one worker to avoid parallel Chromium teardown crashes", async () => {
    const config = await readFile("playwright.config.ts", "utf8");
    expect(config).toContain("fullyParallel: false");
    expect(config).toContain("workers: 1");
    expect(config).toContain("retries: 1");
    expect(config).toContain('args: ["--disable-dev-shm-usage", "--disable-gpu", "--disable-software-rasterizer"]');
  });
});
