package in.sociobot.offline_file_bridge;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * Keeps a completed mirror available until a replacement has been copied in
 * full. All paths live below the app's private files directory, so renameTo
 * is an atomic same-volume move on Android's app storage.
 */
final class MirrorTransaction {
    private MirrorTransaction() { }

    static File createStagingDirectory(File destination) throws IOException {
        File parent = destination.getParentFile();
        if (parent == null || (!parent.exists() && !parent.mkdirs())) {
            throw new IOException("Local storage could not be prepared.");
        }
        File staging = new File(parent, destination.getName() + ".pending-" + UUID.randomUUID());
        if (!staging.mkdirs()) throw new IOException("A temporary local mirror could not be prepared.");
        return staging;
    }

    static void replaceCompletedMirror(File destination, File staging) throws IOException {
        if (!staging.isDirectory()) throw new IOException("The replacement mirror is incomplete.");
        File parent = destination.getParentFile();
        if (parent == null) throw new IOException("Local storage could not be prepared.");
        File backup = new File(parent, destination.getName() + ".previous-" + UUID.randomUUID());
        boolean hadDestination = destination.exists();

        if (hadDestination && !destination.renameTo(backup)) {
            throw new IOException("The previous local mirror could not be protected.");
        }
        if (!staging.renameTo(destination)) {
            if (hadDestination && !backup.renameTo(destination)) {
                throw new IOException("The replacement failed and the previous local mirror needs recovery.");
            }
            throw new IOException("The replacement local mirror could not be saved.");
        }
        if (hadDestination) deleteTree(backup);
    }

    static void deleteTree(File file) throws IOException {
        if (!file.exists()) return;
        File[] children = file.listFiles();
        if (children != null) {
            for (File child : children) deleteTree(child);
        }
        if (!file.delete()) throw new IOException("A local mirror file could not be removed.");
    }
}
