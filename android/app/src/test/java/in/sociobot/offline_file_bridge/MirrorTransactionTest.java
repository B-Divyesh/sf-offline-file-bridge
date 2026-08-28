package in.sociobot.offline_file_bridge;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

public class MirrorTransactionTest {
    @Test
    public void failedStagingCopyLeavesCompletedMirrorUntouched() throws Exception {
        File root = Files.createTempDirectory("ofb-mirror").toFile();
        File completed = new File(root, "field-notes");
        assertTrue(completed.mkdirs());
        Files.writeString(new File(completed, "ready.txt").toPath(), "previous", StandardCharsets.UTF_8);
        File staging = MirrorTransaction.createStagingDirectory(completed);

        Files.writeString(new File(staging, "partial.txt").toPath(), "partial", StandardCharsets.UTF_8);
        MirrorTransaction.deleteTree(staging); // Simulates a source read failing before replacement.

        assertTrue(new File(completed, "ready.txt").isFile());
        assertEquals("previous", Files.readString(new File(completed, "ready.txt").toPath()));
        MirrorTransaction.deleteTree(root);
    }

    @Test
    public void completedStagingCopyReplacesPreviousMirrorOnlyAtCommit() throws Exception {
        File root = Files.createTempDirectory("ofb-mirror").toFile();
        File completed = new File(root, "field-notes");
        assertTrue(completed.mkdirs());
        Files.writeString(new File(completed, "ready.txt").toPath(), "previous", StandardCharsets.UTF_8);
        File staging = MirrorTransaction.createStagingDirectory(completed);
        Files.writeString(new File(staging, "ready.txt").toPath(), "replacement", StandardCharsets.UTF_8);

        MirrorTransaction.replaceCompletedMirror(completed, staging);

        assertFalse(staging.exists());
        assertEquals("replacement", Files.readString(new File(completed, "ready.txt").toPath()));
        MirrorTransaction.deleteTree(root);
    }
}
