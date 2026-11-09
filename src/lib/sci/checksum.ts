// Checksums for files: MD5 (RFC 1321) and CRC-32 (the ISO-HDLC / zlib polynomial) written here and fed in chunks,
// SHA-1, SHA-256 and SHA-512 from the browser's own Web Crypto. Manifests in the GNU coreutils "sha256sum" format,
// the BSD tag format ("SHA256 (file) = ...") and BagIt (RFC 8493) payload manifests, and checking files against
// a manifest. No DOM here; Web Crypto is also in Node.

export type Alg = 'sha256' | 'sha1' | 'sha512' | 'md5' | 'crc32';
export const ALGS: Alg[] = ['sha256', 'sha1', 'sha512', 'md5', 'crc32'];
export const ALG_NAME: Record<Alg, string> = { sha256: 'SHA-256', sha1: 'SHA-1', sha512: 'SHA-512', md5: 'MD5', crc32: 'CRC32' };
export const HEX_LEN: Record<Alg, number> = { sha256: 64, sha1: 40, sha512: 128, md5: 32, crc32: 8 };
/** Web Crypto digests need the whole file in memory; above this, only MD5 and CRC32 (streamed) are offered. */
export const SHA_MAX = 2 * 1024 ** 3;
export const CHUNK = 8 * 1024 * 1024;

const hex = (u: Uint8Array) => Array.from(u, (b) => b.toString(16).padStart(2, '0')).join('');

// ---------- CRC-32 ----------
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
export class Crc32 {
  private c = 0xffffffff;
  update(u: Uint8Array) { let c = this.c; for (let i = 0; i < u.length; i++) c = CRC_T[(c ^ u[i]) & 0xff] ^ (c >>> 8); this.c = c; return this; }
  digest() { return ((this.c ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0'); }
}

// ---------- MD5 ----------
const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
const K = Int32Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0);
export class Md5 {
  private h = Int32Array.of(0x67452301, 0xefcdab89 | 0, 0x98badcfe | 0, 0x10325476);
  private buf = new Uint8Array(64);
  private n = 0; // bytes in buf
  private len = 0; // total bytes
  private w = new Int32Array(16);
  private block(b: Uint8Array, o: number) {
    const w = this.w;
    for (let i = 0; i < 16; i++) w[i] = b[o + 4 * i] | (b[o + 4 * i + 1] << 8) | (b[o + 4 * i + 2] << 16) | (b[o + 4 * i + 3] << 24);
    let a = this.h[0], bb = this.h[1], c = this.h[2], d = this.h[3];
    for (let i = 0; i < 64; i++) {
      let f: number, g: number;
      if (i < 16) { f = (bb & c) | (~bb & d); g = i; }
      else if (i < 32) { f = (d & bb) | (~d & c); g = (5 * i + 1) & 15; }
      else if (i < 48) { f = bb ^ c ^ d; g = (3 * i + 5) & 15; }
      else { f = c ^ (bb | ~d); g = (7 * i) & 15; }
      const t = d; d = c; c = bb;
      const x = (a + f + K[i] + w[g]) | 0;
      bb = (bb + ((x << S[i]) | (x >>> (32 - S[i])))) | 0;
      a = t;
    }
    this.h[0] = (this.h[0] + a) | 0; this.h[1] = (this.h[1] + bb) | 0; this.h[2] = (this.h[2] + c) | 0; this.h[3] = (this.h[3] + d) | 0;
  }
  update(u: Uint8Array) {
    let i = 0;
    this.len += u.length;
    if (this.n) { const k = Math.min(64 - this.n, u.length); this.buf.set(u.subarray(0, k), this.n); this.n += k; i = k; if (this.n === 64) { this.block(this.buf, 0); this.n = 0; } }
    for (; i + 64 <= u.length; i += 64) this.block(u, i);
    if (i < u.length) { this.buf.set(u.subarray(i), 0); this.n = u.length - i; }
    return this;
  }
  digest() {
    const bits = this.len * 8, pad = new Uint8Array(((this.n < 56 ? 56 : 120) - this.n) + 8);
    pad[0] = 0x80;
    const dv = new DataView(pad.buffer);
    dv.setUint32(pad.length - 8, bits >>> 0, true); dv.setUint32(pad.length - 4, Math.floor(bits / 2 ** 32), true);
    const len = this.len; this.update(pad); this.len = len;
    const out = new Uint8Array(16), o = new DataView(out.buffer);
    for (let i = 0; i < 4; i++) o.setInt32(4 * i, this.h[i], true);
    return hex(out);
  }
}

const SUBTLE: Record<string, string> = { sha256: 'SHA-256', sha1: 'SHA-1', sha512: 'SHA-512' };
/** Hashes of a Blob (or File). MD5 and CRC32 are read in 8 MB chunks; SHA digests need the whole file at once. */
export async function hashBlob(blob: Blob, algs: Alg[], progress?: (done: number) => void): Promise<Partial<Record<Alg, string>>> {
  const out: Partial<Record<Alg, string>> = {};
  const sha = algs.filter((a) => a in SUBTLE), stream = algs.filter((a) => !(a in SUBTLE));
  if (sha.length && blob.size > SHA_MAX) throw new Error(`SHA checksums are made by the browser, which needs the whole file in memory; this page does them for files up to 2 GB. Use MD5 or CRC32 for this file.`);
  const md5 = stream.includes('md5') ? new Md5() : null, crc = stream.includes('crc32') ? new Crc32() : null;
  if (sha.length) {
    const buf = new Uint8Array(await blob.arrayBuffer());
    for (const a of sha) out[a] = hex(new Uint8Array(await crypto.subtle.digest(SUBTLE[a], buf)));
    for (let i = 0; i < buf.length; i += CHUNK) { const c = buf.subarray(i, i + CHUNK); md5?.update(c); crc?.update(c); progress?.(Math.min(buf.length, i + CHUNK)); }
  } else {
    for (let i = 0; i < blob.size; i += CHUNK) {
      const c = new Uint8Array(await blob.slice(i, i + CHUNK).arrayBuffer());
      md5?.update(c); crc?.update(c); progress?.(Math.min(blob.size, i + CHUNK));
    }
  }
  if (md5) out.md5 = md5.digest();
  if (crc) out.crc32 = crc.digest();
  return out;
}

// ---------- manifests ----------
export type Style = 'gnu' | 'bsd' | 'bagit';
export type Entry = { path: string; hash: string };
const BSD_TAG: Record<Alg, string> = { sha256: 'SHA256', sha1: 'SHA1', sha512: 'SHA512', md5: 'MD5', crc32: 'CRC32' };

/** One manifest, sorted by path. GNU style escapes backslashes and new lines as sha256sum does; BagIt
 * percent-encodes CR, LF and % (RFC 8493 section 2.1.3) and puts files under data/. */
export function makeManifest(entries: Entry[], alg: Alg, style: Style): string {
  const sorted = [...entries].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return sorted.map((e) => {
    const p = e.path;
    if (style === 'bagit') return `${e.hash} ${(p.startsWith('data/') ? p : `data/${p}`).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')}`;
    // coreutils: a name with a backslash or new line gets a leading backslash on the line and is escaped.
    const esc = /[\\\n\r]/.test(p), q = esc ? p.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r') : p;
    if (style === 'bsd') return `${esc ? '\\' : ''}${BSD_TAG[alg]} (${q}) = ${e.hash}`;
    return `${esc ? '\\' : ''}${e.hash}  ${q}`;
  }).join('\n') + (sorted.length ? '\n' : '');
}
export const manifestName = (alg: Alg, style: Style) => (style === 'bagit' ? `manifest-${alg}.txt` : style === 'bsd' ? `CHECKSUMS-${BSD_TAG[alg]}.txt` : `${BSD_TAG[alg]}SUMS.txt`);

export type Parsed = { alg: Alg | null; style: Style | 'bare'; entries: Entry[]; bad: number[]; algs: Alg[] };
/** Read a manifest in any of the three styles, or a bare checksum. The algorithm comes from a BSD tag, a BagIt file
 * name (manifest-md5.txt) or the length of the hex digest. Line numbers that could not be read go in `bad`. */
export function parseManifest(text: string, fileName = ''): Parsed {
  const entries: Entry[] = [], bad: number[] = [], algs = new Set<Alg>();
  let style: Parsed['style'] = 'gnu';
  const named = fileName.match(/manifest-(sha256|sha1|sha512|md5)\.txt$/i);
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const byLen = (h: string): Alg | null => (ALGS.find((a) => HEX_LEN[a] === h.length) ?? null);
  lines.forEach((raw, i) => {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim() || line.trimStart().startsWith('#')) return;
    const unesc = (t: string) => t.replace(/\\(\\|n|r)/g, (_, c) => (c === 'n' ? '\n' : c === 'r' ? '\r' : '\\'));
    let m = line.match(/^(\\?)(SHA256|SHA1|SHA512|MD5|CRC32|SHA-256|SHA-1|SHA-512)\s*\((.*)\)\s*=\s*([0-9a-fA-F]+)$/);
    if (m) { style = 'bsd'; const a = m[2].replace('-', '').toLowerCase() as Alg; algs.add(a); entries.push({ path: m[1] ? unesc(m[3]) : m[3], hash: m[4].toLowerCase() }); return; }
    m = line.match(/^(\\?)([0-9a-fA-F]{8,128})(?:\s+\*?|\s\*)(.+)$/);
    if (m) {
      let p = m[3];
      if (m[1]) p = unesc(p);
      // BagIt has a single space and data/ paths, percent-encoded.
      if (/^[0-9a-fA-F]+ data\//.test(line)) { style = 'bagit'; p = p.replace(/%0D/gi, '\r').replace(/%0A/gi, '\n').replace(/%25/g, '%'); }
      const a = byLen(m[2]); if (a) algs.add(a); else { bad.push(i + 1); return; }
      entries.push({ path: p, hash: m[2].toLowerCase() });
      return;
    }
    m = line.trim().match(/^([0-9a-fA-F]{8,128})$/);
    if (m && byLen(m[1])) { style = 'bare'; algs.add(byLen(m[1])!); entries.push({ path: '', hash: m[1].toLowerCase() }); return; }
    bad.push(i + 1);
  });
  if (named) { style = 'bagit'; algs.clear(); algs.add(named[1].toLowerCase() as Alg); }
  const list = [...algs];
  return { alg: list.length === 1 ? list[0] : list.includes('sha256') ? 'sha256' : list[0] ?? null, style, entries, bad, algs: list };
}

export type Status = 'match' | 'mismatch' | 'missing' | 'extra';
export type Row = { path: string; file: string; status: Status; expected: string; actual: string };
const norm = (p: string) => p.replace(/\\/g, '/').replace(/^\.\//, '');
/** Compare a manifest with the checksums of the files you have. A manifest path matches a file whose path is the
 * same, or ends with "/" + it (or the other way round, for a folder picked one level up or down); a bare checksum
 * matches the only file. Files not named in the manifest come back as "extra". */
export function verify(manifest: Entry[], files: Entry[]): Row[] {
  const used = new Set<number>(), rows: Row[] = [];
  const fp = files.map((f) => norm(f.path));
  for (const e of manifest) {
    const p = norm(e.path);
    let k = -1;
    if (!p) k = files.length === 1 ? 0 : -1;
    else {
      k = fp.findIndex((f, i) => !used.has(i) && f === p);
      if (k < 0) { const c = fp.map((f, i) => i).filter((i) => !used.has(i) && (fp[i].endsWith('/' + p) || p.endsWith('/' + fp[i]))); if (c.length === 1) k = c[0]; }
    }
    if (k < 0) { rows.push({ path: e.path || '(checksum only)', file: '', status: 'missing', expected: e.hash, actual: '' }); continue; }
    used.add(k);
    rows.push({ path: e.path || files[k].path, file: files[k].path, status: files[k].hash === e.hash ? 'match' : 'mismatch', expected: e.hash, actual: files[k].hash });
  }
  files.forEach((f, i) => { if (!used.has(i)) rows.push({ path: f.path, file: f.path, status: 'extra', expected: '', actual: f.hash }); });
  return rows;
}

/** BagIt's bag-info Payload-Oxum: total bytes and number of payload files. */
export const payloadOxum = (sizes: number[]) => `${sizes.reduce((a, b) => a + b, 0)}.${sizes.length}`;
