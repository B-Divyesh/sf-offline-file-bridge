export const buildMetadata: Readonly<{
  product: string;
  version: string;
  commit: string;
}>;
export const buildContext: Readonly<{
  head: string;
  tag: string;
  tagCommit: string;
  commit: string;
  releaseEquivalent: boolean;
  changedFiles: string[];
}>;
export function isPostReleaseEvidencePath(path: string): boolean;
export function selectBuildCommit(input: {
  head: string;
  tagCommit: string;
  tagIsAncestor: boolean;
  changedFiles: string[];
}): { commit: string; releaseEquivalent: boolean; changedFiles: string[] };
