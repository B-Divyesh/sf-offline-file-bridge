package in.sociobot.offline_file_bridge;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.provider.Settings;
import android.webkit.MimeTypeMap;

import androidx.activity.result.ActivityResult;
import androidx.core.content.FileProvider;
import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

@CapacitorPlugin(name = "OfflineBridge")
public class OfflineBridgePlugin extends Plugin {
    private static final String PREFS = "offline_bridge_folders";

    @PluginMethod
    public void chooseFolder(PluginCall call) {
        startActivityForResult(call, createFolderPickerIntent(), "folderChosen");
    }

    @ActivityCallback
    private void folderChosen(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("No folder was chosen.");
            return;
        }
        Uri uri = result.getData().getData();
        boolean hadSavedGrant = uri.toString().equals(getPrefs().getString(Integer.toUnsignedString(uri.toString().hashCode(), 36) + ":uri", null));
        try {
            getContext().getContentResolver().takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
            String id = Integer.toUnsignedString(uri.toString().hashCode(), 36);
            DocumentFile folder = DocumentFile.fromTreeUri(getContext(), uri);
            if (folder == null || !folder.isDirectory()) throw new IOException("Android could not open that folder.");
            JSObject copied = sync(id, folder);
            getPrefs().edit().putString(id + ":uri", uri.toString()).putString(id + ":name", safeDisplayName(folder.getName())).apply();
            call.resolve(copied);
        } catch (Exception error) {
            if (!hadSavedGrant) releaseFolderGrant(getContext(), uri);
            call.reject("The folder could not be copied. Choose it again and allow access.", error);
        }
    }

    @PluginMethod
    public void syncFolder(PluginCall call) {
        String id = call.getString("id");
        if (id == null || !id.matches("[a-z0-9]+")) {
            call.reject("The folder id is missing.");
            return;
        }
        String uriValue = getPrefs().getString(id + ":uri", null);
        if (uriValue == null) {
            call.reject("Folder access is no longer available. Choose the folder again.");
            return;
        }
        try {
            DocumentFile folder = DocumentFile.fromTreeUri(getContext(), Uri.parse(uriValue));
            if (folder == null || !folder.canRead()) throw new IOException("Android cannot read that folder now.");
            call.resolve(sync(id, folder));
        } catch (Exception error) {
            call.reject("Refresh failed. Reconnect the source folder, then try again.", error);
        }
    }

    @PluginMethod
    public void openFile(PluginCall call) {
        String id = call.getString("id");
        String path = call.getString("path");
        if (id == null || path == null || !id.matches("[a-z0-9]+")) {
            call.reject("The file path is missing.");
            return;
        }
        try {
            File root = mirrorDirectory(id).getCanonicalFile();
            File file = new File(root, path).getCanonicalFile();
            if (!file.getPath().startsWith(root.getPath() + File.separator) || !file.isFile()) {
                call.reject("The local file is missing. Refresh the folder, then try again.");
                return;
            }
            getContext().startActivity(createOpenFileChooser(getContext(), file, mimeFor(file.getName())));
            call.resolve();
        } catch (ActivityNotFoundException error) {
            call.reject("No installed app can open this file type.", error);
        } catch (Exception error) {
            call.reject("Android could not open the local copy.", error);
        }
    }

    @PluginMethod
    public void removeFolder(PluginCall call) {
        String id = call.getString("id");
        if (id == null || !id.matches("[a-z0-9]+")) {
            call.reject("The folder id is missing.");
            return;
        }
        try {
            removeMirrorFromDevice(getContext(), getPrefs(), id);
            call.resolve();
        } catch (Exception error) {
            call.reject("The local mirror could not be removed. Try again.", error);
        }
    }

    private JSObject sync(String id, DocumentFile source) throws IOException {
        File destination = mirrorDirectory(id);
        File staging = MirrorTransaction.createStagingDirectory(destination);
        JSArray files = new JSArray();
        try {
            copyChildren(source, staging, "", files);
            MirrorTransaction.replaceCompletedMirror(destination, staging);
        } catch (IOException error) {
            MirrorTransaction.deleteTree(staging);
            throw error;
        } catch (RuntimeException error) {
            try { MirrorTransaction.deleteTree(staging); } catch (IOException ignored) { }
            throw error;
        }
        JSObject result = new JSObject();
        result.put("id", id);
        result.put("name", safeDisplayName(source.getName()));
        result.put("syncedAt", System.currentTimeMillis());
        result.put("files", files);
        return result;
    }

    private void copyChildren(DocumentFile source, File destination, String prefix, JSArray files) throws IOException {
        for (DocumentFile child : source.listFiles()) {
            String name = safeFileName(child.getName());
            String relative = prefix.isEmpty() ? name : prefix + "/" + name;
            File output = new File(destination, name);
            if (child.isDirectory()) {
                if (!output.mkdirs() && !output.isDirectory()) throw new IOException("A local folder could not be created.");
                copyChildren(child, output, relative, files);
            } else if (child.isFile()) {
                try (InputStream input = getContext().getContentResolver().openInputStream(child.getUri())) {
                    if (input == null) throw new IOException("A source file could not be read.");
                    try (FileOutputStream stream = new FileOutputStream(output)) {
                    byte[] buffer = new byte[32768];
                    int count;
                    while ((count = input.read(buffer)) != -1) stream.write(buffer, 0, count);
                    }
                }
                JSObject file = new JSObject();
                file.put("id", relative);
                file.put("name", name);
                file.put("path", relative);
                file.put("size", output.length());
                file.put("type", child.getType() == null ? mimeFor(name) : child.getType());
                file.put("modifiedAt", child.lastModified());
                files.put(file);
            }
        }
    }

    private File mirrorDirectory(String id) {
        return new File(new File(getContext().getFilesDir(), "offline_bridge"), id);
    }

    static void removeMirrorFromDevice(android.content.Context context, SharedPreferences preferences, String id) throws IOException {
        String uriValue = preferences.getString(id + ":uri", null);
        MirrorTransaction.deleteTree(new File(new File(context.getFilesDir(), "offline_bridge"), id));
        if (uriValue != null) releaseFolderGrant(context, Uri.parse(uriValue));
        preferences.edit().remove(id + ":uri").remove(id + ":name").apply();
    }

    private static void releaseFolderGrant(android.content.Context context, Uri uri) {
        try {
            context.getContentResolver().releasePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } catch (SecurityException ignored) {
            // Android may already have revoked this grant in Settings. Removal still clears local state.
        }
    }

    static Intent createFolderPickerIntent() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        return intent;
    }

    static Intent createOpenFileChooser(android.content.Context context, File file, String mimeType) {
        Uri contentUri = FileProvider.getUriForFile(context, context.getPackageName() + ".fileprovider", file);
        Intent open = new Intent(Intent.ACTION_VIEW);
        open.setDataAndType(contentUri, mimeType);
        open.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
        return Intent.createChooser(open, "Open " + file.getName()).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }

    private SharedPreferences getPrefs() {
        return getContext().getSharedPreferences(PREFS, Activity.MODE_PRIVATE);
    }

    private String safeDisplayName(String name) {
        return name == null || name.trim().isEmpty() ? "Approved folder" : name.trim();
    }

    private String safeFileName(String name) {
        String safe = safeDisplayName(name).replace('/', '_').replace('\\', '_').replace('\0', '_');
        return safe.equals(".") || safe.equals("..") ? "file" : safe;
    }

    private String mimeFor(String name) {
        int dot = name.lastIndexOf('.');
        String extension = dot >= 0 ? name.substring(dot + 1).toLowerCase(Locale.ROOT) : "";
        String mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        return mime == null ? "application/octet-stream" : mime;
    }

}
