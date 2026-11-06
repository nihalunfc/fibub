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
