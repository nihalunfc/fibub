// Figure checker maths: read the pixel size and the stored resolution (DPI) of an image file, work out its print
// size, check it against column widths and a minimum DPI, rewrite the stored DPI, and simulate colour vision
// deficiency and greyscale printing. Plain TypeScript, no DOM.
import { readTags } from './tiff.ts';

export type Meta = {
  format: 'PNG' | 'JPEG' | 'TIFF' | 'GIF' | 'WebP' | 'BMP' | 'SVG' | 'PDF';
  width: number; height: number; // pixels (0 for a vector file with no pixel size)
  dpiX?: number; dpiY?: number; dpiFrom?: string; // the stored resolution and where it came from
  colour?: string; bits?: number; alpha?: boolean;
  vector?: boolean; widthMm?: number; heightMm?: number; // vector files: page or drawing size
  notes: string[];
};

const ascii = (b: Uint8Array, o: number, n: number) => String.fromCharCode(...b.subarray(o, o + n));
const r1 = (x: number) => Math.round(x * 10) / 10;

/** Recognise the file and read its size and stored resolution. Throws a plain-English error for other files. */
export function readMeta(b: Uint8Array): Meta {
  if (b.length >= 8 && b[0] === 0x89 && ascii(b, 1, 3) === 'PNG') return png(b);
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) return jpeg(b);
  if (b.length >= 8 && (ascii(b, 0, 2) === 'II' || ascii(b, 0, 2) === 'MM')) return tiff(b);
  if (b.length >= 10 && ascii(b, 0, 3) === 'GIF') {
    const dv = new DataView(b.buffer, b.byteOffset);
    return { format: 'GIF', width: dv.getUint16(6, true), height: dv.getUint16(8, true), colour: 'Palette (up to 256 colours)', bits: 8, notes: ['GIF files do not store a resolution. Journals rarely accept GIF; save the figure as TIFF or PNG.'] };
  }
  if (b.length >= 30 && ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 4) === 'WEBP') return webp(b);
  if (b.length >= 54 && ascii(b, 0, 2) === 'BM') {
    const dv = new DataView(b.buffer, b.byteOffset);
    const w = dv.getInt32(18, true), h = Math.abs(dv.getInt32(22, true)), ppm = dv.getInt32(38, true), ppmy = dv.getInt32(42, true);
    return { format: 'BMP', width: w, height: h, bits: dv.getUint16(28, true), ...(ppm > 0 ? { dpiX: ppm * 0.0254, dpiY: (ppmy > 0 ? ppmy : ppm) * 0.0254, dpiFrom: 'BMP header (pixels per metre)' } : {}), notes: ['BMP is not a journal format; save the figure as TIFF or PNG.'] };
  }
  const head = new TextDecoder().decode(b.subarray(0, Math.min(b.length, 4096)));
  if (head.startsWith('%PDF')) return pdf(b);
  if (/<svg[\s>]/i.test(head)) return svg(new TextDecoder().decode(b.subarray(0, Math.min(b.length, 200000))));
  throw new Error('This file is not a PNG, JPEG, TIFF, GIF, WebP, BMP, SVG or PDF figure.');
}

function png(b: Uint8Array): Meta {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (ascii(b, 12, 4) !== 'IHDR') throw new Error('This PNG file is damaged (no IHDR chunk).');
  const w = dv.getUint32(16), h = dv.getUint32(20), depth = b[24], ct = b[25];
  const colours: Record<number, string> = { 0: 'Greyscale', 2: 'RGB colour', 3: 'Palette colour', 4: 'Greyscale with transparency', 6: 'RGB colour with transparency' };
  const m: Meta = { format: 'PNG', width: w, height: h, colour: colours[ct] ?? `Colour type ${ct}`, bits: depth, alpha: ct === 4 || ct === 6, notes: [] };
  let p = 8, profile = '';
  while (p + 12 <= b.length) {
    const len = dv.getUint32(p), type = ascii(b, p + 4, 4);
    if (type === 'pHYs' && len >= 9) {
      const x = dv.getUint32(p + 8), y = dv.getUint32(p + 12), unit = b[p + 16];
      if (unit === 1) { m.dpiX = x * 0.0254; m.dpiY = y * 0.0254; m.dpiFrom = 'PNG pHYs chunk (pixels per metre)'; }
      else m.notes.push('The pHYs chunk gives only the pixel shape, not a resolution.');
    }
    if (type === 'tRNS') m.alpha = true;
    if (type === 'iCCP') profile = 'an embedded ICC colour profile';
    if (type === 'sRGB') profile = 'the sRGB colour space';
    if (type === 'IEND') break;
    p += 12 + len;
  }
  if (profile) m.notes.push(`Colour: tagged with ${profile}.`);
  return m;
}

type ExifRes = { x?: number; y?: number; unit: number; orient?: number; spots: { tag: number; off: number }[]; le: boolean; base: number };
/** Resolution and orientation from an EXIF block (a TIFF header at `base`). Offsets are kept so the DPI can be rewritten. */
function exif(b: Uint8Array, base: number, end: number): ExifRes | null {
  if (base + 8 > end) return null;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const le = ascii(b, base, 2) === 'II';
  if (!le && ascii(b, base, 2) !== 'MM') return null;
  const ifd = base + dv.getUint32(base + 4, le);
  if (ifd + 2 > end) return null;
  const n = dv.getUint16(ifd, le), out: ExifRes = { unit: 2, spots: [], le, base };
  for (let k = 0; k < n; k++) {
    const e = ifd + 2 + 12 * k; if (e + 12 > end) break;
    const tag = dv.getUint16(e, le), type = dv.getUint16(e + 2, le);
    if ((tag === 0x011a || tag === 0x011b) && type === 5) {
      const off = base + dv.getUint32(e + 8, le); if (off + 8 > end) continue;
      const den = dv.getUint32(off + 4, le), v = den ? dv.getUint32(off, le) / den : NaN;
      if (tag === 0x011a) out.x = v; else out.y = v;
      out.spots.push({ tag, off });
    }
    if (tag === 0x0128 && type === 3) { out.unit = dv.getUint16(e + 8, le); out.spots.push({ tag, off: e + 8 }); }
    if (tag === 0x0112 && type === 3) out.orient = dv.getUint16(e + 8, le);
  }
  return out;
}

type JpegParts = { jfif?: { off: number; units: number; x: number; y: number }; exif?: ExifRes | null; sof?: { w: number; h: number; comps: number; bits: number; progressive: boolean }; adobe?: boolean };
function jpegParts(b: Uint8Array): JpegParts {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength), out: JpegParts = {};
  let p = 2;
  while (p + 4 <= b.length) {
    if (b[p] !== 0xff) { p++; continue; }
    const mk = b[p + 1];
    if (mk === 0xff) { p++; continue; }
    if (mk === 0xd8 || (mk >= 0xd0 && mk <= 0xd7) || mk === 0x01) { p += 2; continue; }
    if (mk === 0xd9 || mk === 0xda) break;
    const len = dv.getUint16(p + 2), s = p + 4, end = Math.min(b.length, p + 2 + len);
    if (mk === 0xe0 && ascii(b, s, 5) === 'JFIF\0' && !out.jfif) out.jfif = { off: s + 7, units: b[s + 7], x: dv.getUint16(s + 8), y: dv.getUint16(s + 10) };
    if (mk === 0xe1 && ascii(b, s, 6) === 'Exif\0\0' && out.exif === undefined) out.exif = exif(b, s + 6, end);
    if (mk === 0xee && ascii(b, s, 5) === 'Adobe') out.adobe = true;
    if (mk >= 0xc0 && mk <= 0xcf && mk !== 0xc4 && mk !== 0xc8 && mk !== 0xcc && !out.sof)
      out.sof = { bits: b[s], h: dv.getUint16(s + 1), w: dv.getUint16(s + 3), comps: b[s + 5], progressive: mk === 0xc2 || mk === 0xc6 || mk === 0xca || mk === 0xce };
    p = p + 2 + len;
  }
  return out;
}

function jpeg(b: Uint8Array): Meta {
  const j = jpegParts(b);
  if (!j.sof) throw new Error('This JPEG file is damaged (no image size found).');
  const comps: Record<number, string> = { 1: 'Greyscale', 3: 'RGB colour (YCbCr)', 4: j.adobe ? 'CMYK colour' : 'Four-channel colour (probably CMYK)' };
  const m: Meta = { format: 'JPEG', width: j.sof.w, height: j.sof.h, colour: comps[j.sof.comps] ?? `${j.sof.comps} channels`, bits: j.sof.bits, notes: [] };
  const exifDpi = j.exif && j.exif.x && j.exif.unit !== 1 ? { x: j.exif.unit === 3 ? j.exif.x * 2.54 : j.exif.x, y: (j.exif.unit === 3 ? 2.54 : 1) * (j.exif.y ?? j.exif.x) } : null;
  if (j.jfif && j.jfif.units === 1 || j.jfif && j.jfif.units === 2) {
    const f = j.jfif.units === 2 ? 2.54 : 1;
    m.dpiX = j.jfif.x * f; m.dpiY = j.jfif.y * f; m.dpiFrom = `JFIF header (${j.jfif.units === 2 ? 'dots per cm' : 'dots per inch'})`;
    if (exifDpi && (Math.abs(exifDpi.x - m.dpiX) > 0.5)) m.notes.push(`The EXIF block says ${r1(exifDpi.x)} dpi, which disagrees with the JFIF header. Programs differ in which one they read; the button below sets both.`);
  } else if (exifDpi) { m.dpiX = exifDpi.x; m.dpiY = exifDpi.y; m.dpiFrom = `EXIF (${j.exif!.unit === 3 ? 'per cm' : 'per inch'})`; }
  if (j.sof.comps === 4) m.notes.push('This is a CMYK JPEG. Browsers may show its colours wrongly, so the previews here can be off; the size checks are fine.');
  if (j.exif?.orient && j.exif.orient >= 5) { m.notes.push('EXIF says the photo is turned a quarter turn, so it shows as ' + j.sof.h + ' × ' + j.sof.w + ' px; the sizes below use the turned shape.'); m.width = j.sof.h; m.height = j.sof.w; [m.dpiX, m.dpiY] = [m.dpiY, m.dpiX]; }
  m.notes.push('JPEG compression blurs lines and text. For graphs and line art, journals prefer TIFF, PNG, EPS or PDF.');
  return m;
}

function tiff(b: Uint8Array): Meta {
  const buf = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  const { tags } = readTags(buf);
  const one = (id: number, d?: number) => { const t = tags.get(id); return t && Array.isArray(t.values) ? (t.values[0] as number) : d; };
  const w = one(256) ?? 0, h = one(257) ?? 0, spp = one(277, 1)!, bits = one(258, 1)!, ph = one(262, spp >= 3 ? 2 : 1)!, unit = one(296, 2)!;
  const extra = tags.get(338), alpha = !!extra || (ph === 2 && spp === 4);
  const colours: Record<number, string> = { 0: 'Greyscale (white is zero)', 1: 'Greyscale', 2: 'RGB colour', 3: 'Palette colour', 5: 'CMYK colour', 6: 'YCbCr colour', 8: 'CIELAB colour' };
  const m: Meta = { format: 'TIFF', width: w, height: h, colour: bits === 1 && ph <= 1 ? 'Black and white (1-bit line art)' : colours[ph] ?? `Photometric ${ph}`, bits, alpha, notes: [] };
  const xr = one(282), yr = one(283);
  if (xr && unit !== 1) { const f = unit === 3 ? 2.54 : 1; m.dpiX = xr * f; m.dpiY = (yr ?? xr) * f; m.dpiFrom = `TIFF tags (${unit === 3 ? 'per cm' : 'per inch'})`; }
  else if (xr) m.notes.push('The TIFF gives a resolution with no unit, so it is not a DPI.');
  const comp = one(259, 1)!;
  const comps: Record<number, string> = { 1: 'none', 2: 'CCITT', 3: 'CCITT fax 3', 4: 'CCITT fax 4', 5: 'LZW', 7: 'JPEG', 8: 'Deflate', 32946: 'Deflate', 32773: 'PackBits' };
  m.notes.push(`Compression: ${comps[comp] ?? 'type ' + comp}${comp === 7 ? ' (lossy; many journals ask for LZW or none)' : ''}.`);
  return m;
}

function webp(b: Uint8Array): Meta {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength), kind = ascii(b, 12, 4);
  let w = 0, h = 0;
  if (kind === 'VP8X') { w = 1 + (b[24] | (b[25] << 8) | (b[26] << 16)); h = 1 + (b[27] | (b[28] << 8) | (b[29] << 16)); }
  else if (kind === 'VP8L') { const v = dv.getUint32(21, true); w = 1 + (v & 0x3fff); h = 1 + ((v >> 14) & 0x3fff); }
  else if (kind === 'VP8 ') { w = dv.getUint16(26, true) & 0x3fff; h = dv.getUint16(28, true) & 0x3fff; }
  return { format: 'WebP', width: w, height: h, notes: ['WebP files usually store no resolution, and journals do not accept WebP. Save the figure as TIFF or PNG.'] };
}

const UNIT_MM: Record<string, number> = { mm: 1, cm: 10, in: 25.4, pt: 25.4 / 72, pc: 25.4 / 6, px: 25.4 / 96, '': 25.4 / 96 };
/** An SVG length (such as "85mm", "3.5in" or "400") in mm; px and plain numbers are 1/96 inch, as in CSS. */
export function svgLengthMm(s: string | null | undefined): number | undefined {
  const m = s?.trim().match(/^([0-9.]+(?:e[+-]?\d+)?)\s*(mm|cm|in|pt|pc|px)?$/i);
  if (!m) return undefined;
  return Number(m[1]) * UNIT_MM[(m[2] ?? '').toLowerCase()];
}
function svg(t: string): Meta {
  const tag = t.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const attr = (n: string) => tag.match(new RegExp(`\\s${n}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1];
  let wm = svgLengthMm(attr('width')), hm = svgLengthMm(attr('height'));
  const vb = attr('viewBox')?.trim().split(/[\s,]+/).map(Number);
  const notes = ['SVG is a vector format: lines and text stay sharp at any size, so DPI does not apply. Only photos placed inside it have a resolution.'];
  if (wm === undefined && vb && vb.length === 4) { wm = (vb[2] * 25.4) / 96; hm = (vb[3] * 25.4) / 96; notes.push('No width or height is set, so the size is read from the viewBox at 96 units per inch.'); }
  if (/<image\b/i.test(t)) notes.push('It contains at least one embedded picture (an <image> element); check that picture\'s resolution too.');
  if (/<text\b/i.test(t) && !/font-family/i.test(t)) notes.push('It has text with no font named, so it may show in a different font on the journal\'s computer.');
  return { format: 'SVG', width: 0, height: 0, vector: true, widthMm: wm, heightMm: hm, notes };
}
function pdf(b: Uint8Array): Meta {
  const t = new TextDecoder('latin1').decode(b.subarray(0, Math.min(b.length, 2_000_000)));
  const mb = t.match(/\/MediaBox\s*\[\s*([-0-9.]+)\s+([-0-9.]+)\s+([-0-9.]+)\s+([-0-9.]+)\s*\]/);
  const pages = (t.match(/\/Type\s*\/Page\b/g) ?? []).length;
  const m: Meta = { format: 'PDF', width: 0, height: 0, vector: true, notes: ['PDF figures are usually vector: lines and text stay sharp at any size. Photos placed inside a PDF keep their own resolution, which this page cannot read; check them in the program that made the PDF.'] };
  if (mb) { const k = 25.4 / 72; m.widthMm = Math.abs(Number(mb[3]) - Number(mb[1])) * k; m.heightMm = Math.abs(Number(mb[4]) - Number(mb[2])) * k; }
  if (pages > 1) m.notes.push(`This PDF has ${pages} pages; the size is the first page's. Journals want one figure per file.`);
  return m;
}

// ---------- Print size and checks ----------
export const MM_PER_IN = 25.4;
/** Print size in mm of `px` pixels at `dpi`. */
export const printMm = (px: number, dpi: number) => (px / dpi) * MM_PER_IN;
/** The DPI a picture `px` pixels wide has when printed `mm` wide. */
export const dpiAt = (px: number, mm: number) => px / (mm / MM_PER_IN);
/** Pixels needed to print `mm` wide at `dpi`. */
export const pxFor = (mm: number, dpi: number) => Math.ceil((mm / MM_PER_IN) * dpi - 1e-9);

export type Target = { name: string; widthMm: number; maxHeightMm?: number };
export type TargetResult = Target & { dpi: number; heightMm: number; needPx: number; ok: boolean; tooTall: boolean };
/** Place the picture at each target width (keeping its shape) and compare the resulting DPI with `minDpi`. */
export function checkTargets(w: number, h: number, targets: Target[], minDpi: number): TargetResult[] {
  return targets.map((t) => {
    const dpi = dpiAt(w, t.widthMm), heightMm = (t.widthMm * h) / w;
    return { ...t, dpi, heightMm, needPx: pxFor(t.widthMm, minDpi), ok: dpi >= minDpi - 1e-9, tooTall: !!t.maxHeightMm && heightMm > t.maxHeightMm + 1e-9 };
  });
}

/** Read "name, width mm[, max height mm]" lines. Returns the targets or an error message naming the line. */
export function parseTargets(text: string): Target[] | string {
  const out: Target[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((s) => s.trim());
    const nums = parts.filter((p) => p !== '' && Number.isFinite(Number(p))).map(Number);
    const name = parts.find((p) => p !== '' && !Number.isFinite(Number(p))) || `Width ${i + 1}`;
    if (!nums.length || !(nums[0] > 0) || nums[0] > 2000) return `Line ${i + 1} (${name}): give a width in mm between 0 and 2000.`;
    if (nums.length > 1 && !(nums[1] > 0)) return `Line ${i + 1} (${name}): the maximum height must be above 0 mm.`;
    out.push({ name, widthMm: nums[0], ...(nums.length > 1 ? { maxHeightMm: nums[1] } : {}) });
  }
  if (!out.length) return 'Add at least one width, such as "Single column, 85".';
  if (out.length > 12) return 'Up to 12 widths, please.';
  return out;
}

// ---------- Rewrite the stored DPI ----------
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
export function crc32(b: Uint8Array) { let c = 0xffffffff; for (const v of b) c = CRC[(c ^ v) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

/** The same PNG with its pHYs chunk set to `dpi` (any old pHYs is dropped). Pixels are untouched. */
export function setPngDpi(b: Uint8Array, dpi: number): Uint8Array {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength), parts: Uint8Array[] = [b.subarray(0, 8)];
  const ppm = Math.round(dpi / 0.0254), ch = new Uint8Array(21), cv = new DataView(ch.buffer);
  cv.setUint32(0, 9); ch.set([0x70, 0x48, 0x59, 0x73], 4); cv.setUint32(8, ppm); cv.setUint32(12, ppm); ch[16] = 1; cv.setUint32(17, crc32(ch.subarray(4, 17)));
  let p = 8;
  while (p + 12 <= b.length) {
    const len = dv.getUint32(p), type = ascii(b, p + 4, 4), end = p + 12 + len;
    if (type !== 'pHYs') parts.push(b.subarray(p, end));
    if (type === 'IHDR') parts.push(ch);
    p = end;
    if (type === 'IEND') break;
  }
  const out = new Uint8Array(parts.reduce((s, x) => s + x.length, 0));
  let o = 0; for (const x of parts) { out.set(x, o); o += x.length; }
  return out;
}

/** The same JPEG with its JFIF density (added if missing) and any EXIF resolution set to `dpi`. No re-compression. */
export function setJpegDpi(b: Uint8Array, dpi: number): Uint8Array {
  const j = jpegParts(b), d = Math.max(1, Math.min(65535, Math.round(dpi)));
  let out: Uint8Array, shift = 0;
  if (j.jfif) { out = b.slice(); }
  else {
    const app0 = Uint8Array.of(0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 1, d >> 8, d & 255, d >> 8, d & 255, 0, 0);
    out = new Uint8Array(b.length + app0.length); out.set(b.subarray(0, 2)); out.set(app0, 2); out.set(b.subarray(2), 2 + app0.length);
    shift = app0.length;
  }
  const dv = new DataView(out.buffer);
  if (j.jfif) { out[j.jfif.off] = 1; dv.setUint16(j.jfif.off + 1, d); dv.setUint16(j.jfif.off + 3, d); }
  if (j.exif) for (const s of j.exif.spots) {
    const o = s.off + shift;
    if (s.tag === 0x0128) dv.setUint16(o, 2, j.exif.le);
    else { dv.setUint32(o, d, j.exif.le); dv.setUint32(o + 4, 1, j.exif.le); }
  }
  return out;
}

// ---------- Colour vision ----------
// sRGB (IEC 61966-2-1) linear RGB → XYZ, and XYZ → LMS cone space of Smith and Pokorny (1975) as used by
// Viénot, Brettel and Mollon (1999). A dichromat's colours are projected along the missing cone's axis onto the plane
// through black, white and two colours they still see: blue and yellow for protan and deutan, red and cyan for tritan.
export const XYZ_FROM_RGB = [[0.412456, 0.3575761, 0.1804375], [0.212672, 0.7151522, 0.072175], [0.019333, 0.119192, 0.9503041]];
export const LMS_FROM_XYZ = [[0.15514, 0.54312, -0.03286], [-0.15514, 0.45684, 0.03286], [0, 0, 0.01608]];
type M3 = number[][];
export const mul = (a: M3, b: M3): M3 => a.map((r) => [0, 1, 2].map((j) => r[0] * b[0][j] + r[1] * b[1][j] + r[2] * b[2][j]));
export const apply = (m: M3, v: number[]) => m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
export function inv(m: M3): M3 {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g, det = a * A + b * B + c * C;
  return [[A / det, -(b * i - c * h) / det, (b * f - c * e) / det], [B / det, (a * i - c * g) / det, -(a * f - c * d) / det], [C / det, -(a * h - b * g) / det, (a * e - b * d) / det]];
}
const cross = (u: number[], v: number[]) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];

export type Cvd = 'protan' | 'deutan' | 'tritan';
export const CVD_NAMES: Record<Cvd, string> = { protan: 'Protanopia (no red cones)', deutan: 'Deuteranopia (no green cones)', tritan: 'Tritanopia (no blue cones)' };
/** The 3 × 3 matrix taking linear sRGB to what a dichromat of this type sees, in linear sRGB. */
export function dichromatMatrix(type: Cvd): M3 {
  const lmsRgb = mul(LMS_FROM_XYZ, XYZ_FROM_RGB), rgbLms = inv(lmsRgb);
  const at = (rgb: number[]) => apply(lmsRgb, rgb);
  const n = type === 'tritan' ? cross(at([0, 1, 1]), at([1, 0, 0])) : cross(at([1, 1, 0]), at([0, 0, 1]));
  const P: M3 = type === 'protan' ? [[0, -n[1] / n[0], -n[2] / n[0]], [0, 1, 0], [0, 0, 1]]
    : type === 'deutan' ? [[1, 0, 0], [-n[0] / n[1], 0, -n[2] / n[1]], [0, 0, 1]]
      : [[1, 0, 0], [0, 1, 0], [-n[0] / n[2], -n[1] / n[2], 0]];
  return mul(rgbLms, mul(P, lmsRgb));
}
/** Severity 0..1: mixes normal and dichromat vision in linear light, a common stand-in for milder (anomalous) forms. */
export function cvdMatrix(type: Cvd, severity = 1): M3 {
  const D = dichromatMatrix(type), s = Math.max(0, Math.min(1, severity));
  return D.map((r, i) => r.map((v, j) => s * v + (1 - s) * (i === j ? 1 : 0)));
}

export const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const LIN = Float64Array.from({ length: 256 }, (_, i) => toLinear(i / 255));
const enc = (v: number) => Math.round(255 * toSrgb(Math.max(0, Math.min(1, v))));

/** Simulate colour vision deficiency on 8-bit RGBA pixels (alpha kept). */
export function simulate(px: Uint8ClampedArray, type: Cvd, severity = 1): Uint8ClampedArray {
  const m = cvdMatrix(type, severity), out = new Uint8ClampedArray(px.length);
  const cache = new Map<number, number>();
  for (let i = 0; i < px.length; i += 4) {
    const key = (px[i] << 16) | (px[i + 1] << 8) | px[i + 2];
    let v = cache.get(key);
    if (v === undefined) {
      const r = LIN[px[i]], g = LIN[px[i + 1]], b = LIN[px[i + 2]];
      v = (enc(m[0][0] * r + m[0][1] * g + m[0][2] * b) << 16) | (enc(m[1][0] * r + m[1][1] * g + m[1][2] * b) << 8) | enc(m[2][0] * r + m[2][1] * g + m[2][2] * b);
      if (cache.size < 200000) cache.set(key, v);
    }
    out[i] = v >> 16; out[i + 1] = (v >> 8) & 255; out[i + 2] = v & 255; out[i + 3] = px[i + 3];
  }
  return out;
}
/** Greyscale as a black-and-white printer would: relative luminance Y of linear sRGB, encoded back to sRGB. */
export function greyscale(px: Uint8ClampedArray): Uint8ClampedArray {
  const out = new Uint8ClampedArray(px.length), [ry, gy, by] = XYZ_FROM_RGB[1];
  for (let i = 0; i < px.length; i += 4) {
    const g = enc(ry * LIN[px[i]] + gy * LIN[px[i + 1]] + by * LIN[px[i + 2]]);
    out[i] = out[i + 1] = out[i + 2] = g; out[i + 3] = px[i + 3];
  }
  return out;
}
/** One colour as hex through a simulation (used for the legend swatches and tests). */
export function simulateHex(hex: string, type: Cvd, severity = 1): string {
  const h = hex.replace('#', ''), px = new Uint8ClampedArray([parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 255]);
  const o = simulate(px, type, severity);
  return '#' + [o[0], o[1], o[2]].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** An 8-bit RGBA preview from a TIFF raster (grey or RGB, 8 or 16 bit); null when the layout is not one we can show. */
export function tiffPreview(bands: Float32Array[], w: number, h: number, bits: number, whiteIsZero = false): Uint8ClampedArray | null {
  if (!bands.length) return null;
  const n = w * h, out = new Uint8ClampedArray(n * 4), max = bits === 16 ? 65535 : bits === 8 ? 255 : 0;
  let lo = 0, hi = max;
  if (!max) { lo = Infinity; hi = -Infinity; for (const b of bands.slice(0, 3)) for (let i = 0; i < n; i++) { const v = b[i]; if (v < lo) lo = v; if (v > hi) hi = v; } if (!(hi > lo)) hi = lo + 1; }
  const s = (v: number) => Math.round((255 * (v - lo)) / (hi - lo));
  const rgb = bands.length >= 3;
  for (let i = 0; i < n; i++) {
    const r = s(bands[0][i]), g = rgb ? s(bands[1][i]) : r, b = rgb ? s(bands[2][i]) : r;
    out[4 * i] = whiteIsZero ? 255 - r : r; out[4 * i + 1] = whiteIsZero ? 255 - g : g; out[4 * i + 2] = whiteIsZero ? 255 - b : b;
    out[4 * i + 3] = bands.length === 4 || bands.length === 2 ? s(bands[bands.length - 1][i]) : 255;
  }
  return out;
}
