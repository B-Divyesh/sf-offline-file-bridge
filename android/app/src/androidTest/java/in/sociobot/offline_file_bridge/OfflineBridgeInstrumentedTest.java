package in.sociobot.offline_file_bridge;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Runs on the installed APK in CI. These checks exercise the same private
 * storage, FileProvider and Android intent surfaces used by the Capacitor
 * plugin, rather than source-text matching.
 */
@RunWith(AndroidJUnit4.class)
public class OfflineBridgeInstrumentedTest {
    private Context context;
    private File root;

    @Before
    public void setUp() throws Exception {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        root = new File(context.getFilesDir(), "offline_bridge/instrumented-fixture");
        MirrorTransaction.deleteTree(root);
        assertTrue(root.mkdirs());
    }

    @After
    public void tearDown() throws Exception {
        MirrorTransaction.deleteTree(root);
    }

    @Test
    public void installedApkUsesScopedFolderPickerAndNoBroadStoragePermission() throws Exception {
        assertEquals("in.sociobot.offline_file_bridge", context.getPackageName());
        Intent picker = OfflineBridgePlugin.createFolderPickerIntent();
        assertEquals(Intent.ACTION_OPEN_DOCUMENT_TREE, picker.getAction());
        assertTrue((picker.getFlags() & Intent.FLAG_GRANT_READ_URI_PERMISSION) != 0);
        assertTrue((picker.getFlags() & Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION) != 0);

        PackageInfo info = context.getPackageManager().getPackageInfo(context.getPackageName(), PackageManager.GET_PERMISSIONS);
        String[] permissions = info.requestedPermissions == null ? new String[0] : info.requestedPermissions;
        for (String permission : permissions) {
            assertFalse("APK must not request broad storage: " + permission,
                "android.permission.READ_EXTERNAL_STORAGE".equals(permission)
                    || "android.permission.MANAGE_EXTERNAL_STORAGE".equals(permission));
        }
    }

    @Test
    public void failedRefreshKeepsPreviousPrivateMirrorAndCompletedRefreshReplacesIt() throws Exception {
        File completed = new File(root, "folder");
        assertTrue(completed.mkdirs());
        write(new File(completed, "ready.txt"), "previous ready copy");

        File failedStaging = MirrorTransaction.createStagingDirectory(completed);
        write(new File(failedStaging, "ready.txt"), "incomplete replacement");
        MirrorTransaction.deleteTree(failedStaging);
        assertArrayEquals(bytes("previous ready copy"), java.nio.file.Files.readAllBytes(new File(completed, "ready.txt").toPath()));

        File completedStaging = MirrorTransaction.createStagingDirectory(completed);
        write(new File(completedStaging, "ready.txt"), "fresh private copy");
        MirrorTransaction.replaceCompletedMirror(completed, completedStaging);
        assertArrayEquals(bytes("fresh private copy"), java.nio.file.Files.readAllBytes(new File(completed, "ready.txt").toPath()));
    }

    @Test
    public void readyPrivateCopyUsesSystemChooserAndReadOnlyFileProviderUri() throws Exception {
        File ready = new File(root, "ready.txt");
        write(ready, "ready for another app");
        Intent chooser = OfflineBridgePlugin.createOpenFileChooser(context, ready, "text/plain");
        assertEquals(Intent.ACTION_CHOOSER, chooser.getAction());
        assertTrue((chooser.getFlags() & Intent.FLAG_ACTIVITY_NEW_TASK) != 0);
        Intent open = chooser.getParcelableExtra(Intent.EXTRA_INTENT);
        assertNotNull(open);
        assertEquals(Intent.ACTION_VIEW, open.getAction());
        assertEquals("text/plain", open.getType());
        assertTrue((open.getFlags() & Intent.FLAG_GRANT_READ_URI_PERMISSION) != 0);
        Uri uri = open.getData();
        assertNotNull(uri);
        assertEquals("content", uri.getScheme());
        assertEquals(context.getPackageName() + ".fileprovider", uri.getAuthority());
    }

    @Test
    public void removalDeletesPrivateCopyAndForgetsTheExactFolderConsent() throws Exception {
        String id = "remove-fixture";
        File mirror = new File(new File(context.getFilesDir(), "offline_bridge"), id);
        assertTrue(mirror.mkdirs());
        write(new File(mirror, "ready.txt"), "delete me");
        SharedPreferences preferences = context.getSharedPreferences("offline_bridge_instrumented", Context.MODE_PRIVATE);
        preferences.edit().putString(id + ":uri", "content://missing-provider/tree/test").putString(id + ":name", "Test folder").commit();

        OfflineBridgePlugin.removeMirrorFromDevice(context, preferences, id);

        assertFalse(mirror.exists());
        assertFalse(preferences.contains(id + ":uri"));
        assertFalse(preferences.contains(id + ":name"));
    }

    private void write(File file, String text) throws Exception {
        try (FileOutputStream stream = new FileOutputStream(file)) {
            stream.write(bytes(text));
        }
    }

    private byte[] bytes(String text) {
        return text.getBytes(StandardCharsets.UTF_8);
    }
}
