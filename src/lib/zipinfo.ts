// Reads a ZIP file's table of contents (its "central directory") without unpacking anything:
// each entry's name, sizes, compression method and whether it is password-protected.

export interface ZipEntry {
  name: string;
  method: number;          // 0 = stored (not compressed), 8 = deflate, others rare
  packed: number;          // bytes in the ZIP
  size: number;            // bytes when unpacked
  encrypted: boolean;
  dir: boolean;
}
export interface ZipInfo { entries: ZipEntry[]; zip64: boolean; comment: string }

export const METHOD_NAMES: Record<number, string> = { 0: 'Stored (not compressed)', 8: 'Deflate', 9: 'Deflate64', 12: 'BZIP2', 14: 'LZMA', 93: 'Zstandard', 95: 'XZ', 99: 'AES encrypted' };

export function readZipInfo(b: Uint8Array): ZipInfo {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  // Find the "end of central directory" record, searching back over a possible comment.
  let eocd = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 22 - 65535); i--) {
    if (v.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a zip');
  let count = v.getUint16(eocd + 10, true);
  let cdOffset = v.getUint32(eocd + 16, true);
  const commentLen = v.getUint16(eocd + 20, true);
  const comment = new TextDecoder().decode(b.subarray(eocd + 22, eocd + 22 + commentLen));
  let zip64 = false;
  if (count === 0xffff || cdOffset === 0xffffffff) {
    // ZIP64: the real numbers are in the ZIP64 end record, found through its locator.
    const loc = eocd - 20;
    if (loc >= 0 && v.getUint32(loc, true) === 0x07064b50) {
      const rec = Number(v.getBigUint64(loc + 8, true));
      if (v.getUint32(rec, true) === 0x06064b50) {
        count = Number(v.getBigUint64(rec + 32, true));
        cdOffset = Number(v.getBigUint64(rec + 48, true));
        zip64 = true;
      }
    }
  }
  const dec = new TextDecoder();
  const entries: ZipEntry[] = [];
  let p = cdOffset;
  for (let i = 0; i < count; i++) {
    if (p + 46 > b.length || v.getUint32(p, true) !== 0x02014b50) throw new Error('damaged zip');
    const flags = v.getUint16(p + 8, true);
    const method = v.getUint16(p + 10, true);
    let packed = v.getUint32(p + 20, true);
    let size = v.getUint32(p + 24, true);
    const nLen = v.getUint16(p + 28, true), xLen = v.getUint16(p + 30, true), cLen = v.getUint16(p + 32, true);
    const name = dec.decode(b.subarray(p + 46, p + 46 + nLen));
    // ZIP64 extra field holds the real sizes when the 32-bit ones are maxed out.
    let x = p + 46 + nLen;
    const xEnd = x + xLen;
    while (x + 4 <= xEnd) {
      const id = v.getUint16(x, true), len = v.getUint16(x + 2, true);
      if (id === 0x0001) {
        let q = x + 4;
        if (size === 0xffffffff) { size = Number(v.getBigUint64(q, true)); q += 8; }
        if (packed === 0xffffffff) { packed = Number(v.getBigUint64(q, true)); q += 8; }
        zip64 = true;
      }
      x += 4 + len;
    }
    entries.push({ name, method, packed, size, encrypted: (flags & 1) === 1 || method === 99, dir: name.endsWith('/') });
    p += 46 + nLen + xLen + cLen;
  }
  return { entries, zip64, comment };
}

/** File types that are already compressed inside, so packing them again gains almost nothing. */
export const ALREADY_COMPRESSED = /\.(jpe?g|png|gif|webp|avif|heic|mp3|m4a|aac|ogg|opus|flac|mp4|m4v|mov|mkv|webm|avi|zip|7z|rar|gz|bz2|xz|zst|docx|xlsx|pptx|odt|ods|odp|epub|jar|apk|pdf)$/i;

/** Things worth a look inside a ZIP before opening it. Plain sentences, most important first. */
export function zipWarnings(entries: ZipEntry[]): string[] {
  const files = entries.filter((e) => !e.dir), out: string[] = [];
  const unsafe = files.filter((e) => /(^|[\\/])\.\.([\\/]|$)/.test(e.name) || /^([\\/]|[A-Za-z]:)/.test(e.name));
  if (unsafe.length) out.push(`${unsafe.length} file${unsafe.length === 1 ? ' has' : 's have'} a path that points outside the folder it is unpacked into (such as ${unsafe[0].name}). Do not unpack this ZIP unless you trust whoever sent it.`);
  const prog = files.filter((e) => /\.(exe|msi|bat|cmd|com|scr|js|jse|vbs|vbe|wsf|ps1|jar|apk|dmg|pkg|sh|lnk|hta|dll)$/i.test(e.name));
  if (prog.length) out.push(`${prog.length} program or script file${prog.length === 1 ? '' : 's'} inside (such as ${prog[0].name}). Only open them if you know who made them.`);
  const dbl = files.filter((e) => /\.(pdf|docx?|xlsx?|jpe?g|png|txt)\.(exe|bat|cmd|scr|js|vbs|lnk)$/i.test(e.name));
  if (dbl.length) out.push(`${dbl.length} file${dbl.length === 1 ? ' looks' : 's look'} like a document but ${dbl.length === 1 ? 'is' : 'are'} really a program (such as ${dbl[0].name}).`);
  const seen = new Set<string>(), dup = new Set<string>();
  for (const e of files) { const k = e.name.toLowerCase(); if (seen.has(k)) dup.add(e.name); seen.add(k); }
  if (dup.size) out.push(`${dup.size} name${dup.size === 1 ? ' appears' : 's appear'} more than once (such as ${[...dup][0]}); unpacking will overwrite one with another.`);
  const junk = files.filter((e) => /(^|\/)(__MACOSX\/|\.DS_Store$|Thumbs\.db$|desktop\.ini$|\._)/i.test(e.name));
  if (junk.length) out.push(`${junk.length} hidden system file${junk.length === 1 ? '' : 's'} from a Mac or Windows computer (such as ${junk[0].name}). They are harmless; leaving them out makes the ZIP tidier.`);
  const ratio = files.filter((e) => e.packed > 0 && e.size / e.packed > 1000 && e.size > 50 * 1024 * 1024);
  if (ratio.length) out.push(`${ratio.length} file${ratio.length === 1 ? ' is' : 's are'} extremely compressed (over 1000 times, ${ratio[0].name}). That is a sign of a "zip bomb" that fills the disk when unpacked.`);
  return out;
}

/** Totals by file type (extension), biggest first. */
export function byType(entries: ZipEntry[]): { type: string; count: number; size: number; packed: number }[] {
  const m = new Map<string, { type: string; count: number; size: number; packed: number }>();
  for (const e of entries.filter((x) => !x.dir)) {
    const ext = (e.name.match(/\.([A-Za-z0-9]{1,6})$/)?.[1] ?? 'no extension').toLowerCase();
    const r = m.get(ext) ?? { type: ext, count: 0, size: 0, packed: 0 };
    r.count++; r.size += e.size; r.packed += e.packed; m.set(ext, r);
  }
  return [...m.values()].sort((a, b) => b.size - a.size);
}
