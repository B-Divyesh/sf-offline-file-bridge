import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const claim = process.argv[2];
const testClass = "in.sociobot.offline_file_bridge.OfflineBridgeInstrumentedTest";
const methods = {
  "scoped-folder-access": "installedApkUsesScopedFolderPickerAndNoBroadStoragePermission",
  "native-refresh-safety": "failedRefreshKeepsPreviousReadyFolderMirrorAndCompletedRefreshReplacesIt",
  "consent-removal": "removalDeletesFolderMirrorFilesAndReleasesFolderAccess",
  "native-handoff": "readyPrivateFileUsesSystemChooserAndReadOnlyFileProviderUri"
};

if (!claim || !(claim in methods)) {
  throw new Error(`Choose one Android claim: ${Object.keys(methods).join(", ")}.`);
}

const gradle = resolve("android/gradlew");
if (!existsSync(gradle)) throw new Error("Android Gradle wrapper is missing.");

const selector = `${testClass}#${methods[claim]}`;
try {
  execFileSync(gradle, [
    "connectedReleaseAndroidTest",
    `-Pandroid.testInstrumentationRunnerArguments.class=${selector}`
  ], { cwd: resolve("android"), stdio: "inherit" });
  console.log(`@claim:${claim} PASS installed release APK ${selector}`);
} catch (error) {
  throw new Error(`@claim:${claim} requires a connected Android emulator or device. ${error instanceof Error ? error.message : ""}`);
}
