import { describe, expect, test } from "vitest";
import {
  ANDROID_CLAIM_METHODS,
  ANDROID_TEST_CLASS,
  createLocalClaimResult,
  parsePassingJUnit,
  verifyAndroidClaimEvidence
} from "../scripts/android-claim-contract.mjs";

function junit(method: string, result = ""): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="${ANDROID_TEST_CLASS}" tests="1" skipped="0" failures="0" errors="0" timestamp="2026-08-29T16:00:00Z">
  <testcase name="${method}" classname="${ANDROID_TEST_CLASS}" time="0.2">${result}</testcase>
</testsuite>`;
}

function releaseEvidence() {
  const claims = Object.fromEntries(Object.entries(ANDROID_CLAIM_METHODS).map(([claim, method]) => [
    claim,
    createLocalClaimResult(claim, junit(method), "2026-08-29T16:00:00.000Z", "b".repeat(64))
  ]));
  return {
    schema: 1,
    product: "offline-file-bridge",
    tag: "v0.1.10",
    version: "0.1.10",
    commit: "a".repeat(40),
    packageId: "in.sociobot.offline_file_bridge",
    buildType: "release",
    androidApi: 35,
    apk: { name: "offline-file-bridge-v0.1.10.apk", sha256: "b".repeat(64) },
    payloadTreeSha256: "c".repeat(64),
    claims
  };
}

const expected = {
  tag: "v0.1.10",
  version: "0.1.10",
  commit: "a".repeat(40),
  apkName: "offline-file-bridge-v0.1.10.apk",
  apkSha256: "b".repeat(64),
  payloadTreeSha256: "c".repeat(64)
};

describe("portable installed-APK claim evidence", () => {
  test.each(Object.entries(ANDROID_CLAIM_METHODS))("accepts only the named passing JUnit case for %s", (claim, method) => {
    expect(parsePassingJUnit(junit(method), claim)).toMatchObject({ tests: 1, failures: 0, method });
    expect(verifyAndroidClaimEvidence(releaseEvidence(), claim, expected)).toMatchObject({ claim, status: "passed", method });
  });

  test("rejects failed or substituted Android tests", () => {
    expect(() => parsePassingJUnit(junit(ANDROID_CLAIM_METHODS["native-handoff"], "<failure/>"), "native-handoff"))
      .toThrow("non-passing result");
    expect(() => parsePassingJUnit(junit("aDifferentTest"), "native-handoff"))
      .toThrow("does not contain");
  });

  test("rejects evidence from a different APK or candidate", () => {
    expect(() => verifyAndroidClaimEvidence(releaseEvidence(), "consent-removal", { ...expected, apkSha256: "d".repeat(64) }))
      .toThrow("different APK digest");
    expect(() => verifyAndroidClaimEvidence(releaseEvidence(), "consent-removal", { ...expected, commit: "e".repeat(40) }))
      .toThrow("commit does not match");
  });

  test("rejects JUnit evidence recorded for a different signed release APK", () => {
    const evidence = releaseEvidence();
    evidence.claims["native-handoff"].releaseApkSha256 = "d".repeat(64);
    expect(() => verifyAndroidClaimEvidence(evidence, "native-handoff", expected))
      .toThrow("was not run against this release APK digest");
  });
});
