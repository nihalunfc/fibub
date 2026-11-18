// Browser side of the music tag kit: read a file's tags without loading all of it, walk a folder the visitor picked,
// and a small CSV reader. Nothing is uploaded.
import { readTags, bytesNeeded, type ReadResult } from './tags.ts';

export const MUSIC_EXT = /\.(mp3|flac|m4a|mp4|aac|alac|wav|wave|ogg|oga|opus)$/i;

/** Tags and audio facts from a File. MP3 and FLAC read only the start (and last 128 bytes); others the whole file. */
export async function readFileTags(f: Blob & { size: number }): Promise<ReadResult> {
  let head = new Uint8Array(await f.slice(0, Math.min(f.size, 262144)).arrayBuffer());
  for (let i = 0; i < 6; i++) {
    const need = Math.min(f.size, bytesNeeded(head, f.size));
    if (need <= head.length) break;
    if (need > 600e6) throw new Error('too big');
    head = new Uint8Array(await f.slice(0, need).arrayBuffer());
  }
  const tail = f.size > head.length ? new Uint8Array(await f.slice(Math.max(0, f.size - 128)).arrayBuffer()) : undefined;
  return readTags(head, { fileSize: f.size, tail });
}

export type DirEntry = { path: string; handle: FileSystemFileHandle; dir: FileSystemDirectoryHandle };
/** Every music file under a folder picked with showDirectoryPicker (sub-folders too). */
export async function walkDir(dir: FileSystemDirectoryHandle, prefix = '', out: DirEntry[] = []): Promise<DirEntry[]> {
  // @ts-ignore values() is in Chromium's File System Access API
  for await (const h of dir.values()) {
    if (h.kind === 'file' && MUSIC_EXT.test(h.name)) out.push({ path: prefix + h.name, handle: h, dir });
    else if (h.kind === 'directory') await walkDir(h, prefix + h.name + '/', out);
  }
  return out;
}

/** Rows of a CSV (quotes and commas inside quotes handled; ; or tab separators too). */
export function parseCsv(text: string): string[][] {
  const first = text.split(/\r?\n/, 1)[0], sep = (first.match(/\t/g)?.length ?? 0) > (first.match(/,/g)?.length ?? 0) ? '\t' : (first.match(/;/g)?.length ?? 0) > (first.match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = []; let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

/** A CSV cell, quoted when it needs to be. */
export const csvCell = (v: unknown) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
