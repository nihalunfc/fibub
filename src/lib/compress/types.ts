// Shared types for the file compressors in this folder. Everything runs in the browser.

/** How hard to compress. "light" never changes how a file looks or behaves. */
export type Level = 'light' | 'recommended' | 'smallest';

/** The way a file is compressed. The UI picks one from the file type; people can change it. */
export type Method = 'pdf' | 'image' | 'office' | 'zip';

/** Progress: `fraction` is 0..1, or null when the length of the job is unknown. */
export type Progress = (p: { fraction: number | null; label: string }) => void;

export interface Output {
  bytes: Uint8Array;
  name: string;      // download file name
  mime: string;
  /** "original" means nothing made the file smaller, so it is handed back unchanged. */
  outcome: 'smaller' | 'original';
  /** One plain sentence on what was done, shown under the result. */
  note: string;
}

export class EncryptedPdfError extends Error {
  name = 'EncryptedPdfError';
}
export class UnsupportedError extends Error {
  name = 'UnsupportedError';
}
