export type MirrorFile = {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  modifiedAt: number;
  blob?: Blob;
};

export type SyncEntry = {
  at: number;
  count: number;
  bytes: number;
  result: "ready" | "error";
};

export type Mirror = {
  id: string;
  name: string;
  source: string;
  createdAt: number;
  syncedAt: number | null;
  files: MirrorFile[];
  history: SyncEntry[];
  native?: boolean;
  handle?: FileSystemDirectoryHandle;
};

export type LicenseState = {
  token: string;
  valid: boolean;
  checkedAt: number;
};
