import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";

const pluginPath = "android/app/src/main/java/in/sociobot/offline_file_bridge/OfflineBridgePlugin.java";
const transactionPath = "android/app/src/main/java/in/sociobot/offline_file_bridge/MirrorTransaction.java";

async function pluginSource(): Promise<string> {
  return readFile(pluginPath, "utf8");
}

test("@claim:native-refresh-safety stages a complete copy before replacing the ready mirror", async () => {
  const source = await pluginSource();
  const sync = source.slice(source.indexOf("private JSObject sync"), source.indexOf("private void copyChildren"));
  expect(sync).toContain("File staging = MirrorTransaction.createStagingDirectory(destination);");
  expect(sync).toContain('copyChildren(source, staging, "", files);');
  expect(sync).toContain("MirrorTransaction.replaceCompletedMirror(destination, staging);");
  expect(sync).not.toContain("deleteTree(destination)");
  expect(sync.indexOf("copyChildren(source, staging")).toBeLessThan(sync.indexOf("replaceCompletedMirror(destination, staging)"));

  const transaction = await readFile(transactionPath, "utf8");
  expect(transaction).toContain("if (hadDestination && !destination.renameTo(backup))");
  expect(transaction).toContain("if (hadDestination && !backup.renameTo(destination))");
  expect(transaction).toContain("if (hadDestination) deleteTree(backup);");
});

test("@claim:consent-removal revokes the exact persisted SAF read grant after deleting a mirror", async () => {
  const source = await pluginSource();
  const removal = source.slice(source.indexOf("public void removeFolder"), source.indexOf("private JSObject sync"));
  expect(removal).toContain('String uriValue = getPrefs().getString(id + ":uri", null);');
  expect(removal).toContain("MirrorTransaction.deleteTree(mirrorDirectory(id));");
  expect(removal).toContain("releaseFolderGrant(Uri.parse(uriValue));");
  expect(removal).toContain('getPrefs().edit().remove(id + ":uri").remove(id + ":name").apply();');
  expect(removal.indexOf("deleteTree(mirrorDirectory(id))")).toBeLessThan(removal.indexOf("releaseFolderGrant(Uri.parse(uriValue))"));
  expect(removal.indexOf("releaseFolderGrant(Uri.parse(uriValue))")).toBeLessThan(removal.indexOf("getPrefs().edit().remove"));
  expect(source).toContain("releasePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)");
});

test("@claim:native-handoff exposes only private copies through Android's chooser", async () => {
  const [source, manifest] = await Promise.all([
    pluginSource(),
    readFile("android/app/src/main/AndroidManifest.xml", "utf8")
  ]);
  expect(source).toContain("FileProvider.getUriForFile");
  expect(source).toContain("Intent.ACTION_VIEW");
  expect(source).toContain("Intent.createChooser");
  expect(manifest).toContain("androidx.core.content.FileProvider");
  expect(manifest).toContain('android:grantUriPermissions="true"');
});
