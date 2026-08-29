export function verifySourceVersion(tag: string): Promise<{ version: string; versionCode: number }>;
export function verifyTagCommit(tag: string, commit: string, resolve?: (tag: string) => string): string;
export function verifyReleaseCandidate(tag: string, commit: string, resolve?: (tag: string) => string): Promise<{ version: string; versionCode: number; commit: string }>;
export function verifyApk(options: {
  apkPath: string;
  tag: string;
  commit: string;
  provenancePath: string;
}): Promise<Record<string, unknown>>;
export function payloadManifest(directory: string): Promise<{ files: string[]; sha256: string }>;
export function writeReleaseNotes(provenancePath: string, notesPath: string): Promise<void>;
