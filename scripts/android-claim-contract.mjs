import { createHash } from "node:crypto";

export const ANDROID_TEST_CLASS = "in.sociobot.offline_file_bridge.OfflineBridgeInstrumentedTest";

export const ANDROID_CLAIM_METHODS = Object.freeze({
  "scoped-folder-access": "installedApkUsesScopedFolderPickerAndNoBroadStoragePermission",
  "native-refresh-safety": "failedRefreshKeepsPreviousReadyFolderMirrorAndCompletedRefreshReplacesIt",
  "consent-removal": "removalDeletesFolderMirrorFilesAndReleasesFolderAccess",
  "native-handoff": "readyPrivateFileUsesSystemChooserAndReadOnlyFileProviderUri"
});

export function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function xmlAttribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

export function parsePassingJUnit(xml, claim) {
  const method = ANDROID_CLAIM_METHODS[claim];
  invariant(method, `Unknown Android claim ${claim}.`);
  const suiteTag = xml.match(/<testsuite\b[^>]*>/)?.[0];
  invariant(suiteTag, `Android claim ${claim} has no JUnit test suite.`);
  const count = (name) => Number(xmlAttribute(suiteTag, name) ?? Number.NaN);
  invariant(count("tests") === 1, `Android claim ${claim} must run exactly one installed-APK test.`);
  invariant(count("failures") === 0 && count("errors") === 0 && count("skipped") === 0,
    `Android claim ${claim} did not pass its installed-APK test.`);

  const testCases = [...xml.matchAll(/<testcase\b[^>]*>/g)].map((match) => match[0]);
  const exactCase = testCases.find((tag) =>
    xmlAttribute(tag, "classname") === ANDROID_TEST_CLASS && xmlAttribute(tag, "name") === method
  );
  invariant(exactCase, `Android claim ${claim} JUnit report does not contain ${ANDROID_TEST_CLASS}#${method}.`);
  invariant(!/<(?:failure|error|skipped)\b/.test(xml), `Android claim ${claim} JUnit report contains a non-passing result.`);
  return { tests: 1, failures: 0, errors: 0, skipped: 0, testClass: ANDROID_TEST_CLASS, method };
}

export function createLocalClaimResult(claim, junitXml, executedAt = new Date().toISOString(), releaseApkSha256) {
  const parsed = parsePassingJUnit(junitXml, claim);
  if (releaseApkSha256 !== undefined) {
    invariant(/^[0-9a-f]{64}$/.test(releaseApkSha256), "Installed release APK digest is invalid.");
  }
  return {
    claim,
    status: "passed",
    selector: `${parsed.testClass}#${parsed.method}`,
    ...parsed,
    executedAt,
    junitSha256: sha256(junitXml),
    junitXml,
    ...(releaseApkSha256 === undefined ? {} : { releaseApkSha256 })
  };
}

export function verifyAndroidClaimEvidence(evidence, claim, expected) {
  const method = ANDROID_CLAIM_METHODS[claim];
  invariant(method, `Unknown Android claim ${claim}.`);
  invariant(evidence?.schema === 1, "Android claim evidence has an unsupported schema.");
  invariant(evidence.product === "offline-file-bridge", "Android claim evidence has the wrong product.");
  invariant(evidence.packageId === "in.sociobot.offline_file_bridge", "Android claim evidence has the wrong package id.");
  invariant(evidence.buildType === "release", "Android claims were not run against a release build.");
  invariant(evidence.androidApi === 35, "Android claims were not run on the required Android 35 emulator.");
  for (const field of ["tag", "version", "commit"]) {
    invariant(evidence[field] === expected[field], `Android claim evidence ${field} does not match this candidate.`);
  }
  invariant(evidence.apk?.name === expected.apkName, "Android claim evidence names a different APK.");
  invariant(evidence.apk?.sha256 === expected.apkSha256, "Android claim evidence has a different APK digest.");
  invariant(evidence.payloadTreeSha256 === expected.payloadTreeSha256,
    "Android claim evidence has a different web payload fingerprint.");

  const result = evidence.claims?.[claim];
  invariant(result?.claim === claim && result?.status === "passed", `Android claim ${claim} has no passing release result.`);
  invariant(result.selector === `${ANDROID_TEST_CLASS}#${method}`, `Android claim ${claim} ran the wrong test selector.`);
  invariant(result.junitSha256 === sha256(result.junitXml || ""), `Android claim ${claim} JUnit digest is invalid.`);
  invariant(result.releaseApkSha256 === expected.apkSha256,
    `Android claim ${claim} was not run against this release APK digest.`);
  const parsed = parsePassingJUnit(result.junitXml, claim);
  for (const field of ["tests", "failures", "errors", "skipped", "testClass", "method"]) {
    invariant(result[field] === parsed[field], `Android claim ${claim} has inconsistent ${field} evidence.`);
  }
  return result;
}
