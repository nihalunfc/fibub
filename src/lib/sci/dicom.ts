// DICOM reader and writer, written for fibub (no outside DICOM library). Reads Part 10 files (with the 128-byte
// preamble and "DICM") and bare data sets, in implicit or explicit VR little endian, explicit VR big endian and
// deflated explicit VR little endian. Uncompressed pixel data, 8, 16 or 32 bits, signed or unsigned, MONOCHROME1,
// MONOCHROME2, RGB and YBR_FULL, one or many frames. Compressed (encapsulated) pixel data is recognised and kept
// as it is, but not decoded: the tools say so plainly. Plain TypeScript, no DOM: used by the viewer, the
// anonymiser and the tests. The rules follow the DICOM standard, PS3.5 (data encoding) and PS3.3 (image pixels).
import { inflateSync, deflateSync } from 'fflate';
import { DICT } from './dicomdict.ts';

export type Element = {
  tag: number; vr: string; value: Uint8Array;
  /** Sequence items (VR SQ, or UN with undefined length). */
  items?: Element[][];
  /** Encapsulated (compressed) pixel data: the basic offset table first, then the fragments. */
  fragments?: Uint8Array[];
};
export type Dicom = {
  meta: Element[]; elements: Element[];
  ts: string; explicit: boolean; little: boolean; deflated: boolean; preamble: boolean;
  /** Character set used for text: 'utf-8' or 'latin1'. */
  charset: string;
  warnings: string[];
};

export const TS = {
  implicitLE: '1.2.840.10008.1.2', explicitLE: '1.2.840.10008.1.2.1', deflatedLE: '1.2.840.10008.1.2.1.99', explicitBE: '1.2.840.10008.1.2.2',
};
const TS_NAMES: Record<string, string> = {
  [TS.implicitLE]: 'Implicit VR little endian', [TS.explicitLE]: 'Explicit VR little endian', [TS.deflatedLE]: 'Deflated explicit VR little endian',
  [TS.explicitBE]: 'Explicit VR big endian', '1.2.840.10008.1.2.5': 'RLE lossless', '1.2.840.10008.1.2.4.50': 'JPEG baseline',
  '1.2.840.10008.1.2.4.51': 'JPEG extended', '1.2.840.10008.1.2.4.57': 'JPEG lossless', '1.2.840.10008.1.2.4.70': 'JPEG lossless (first order)',
  '1.2.840.10008.1.2.4.80': 'JPEG-LS lossless', '1.2.840.10008.1.2.4.81': 'JPEG-LS near-lossless', '1.2.840.10008.1.2.4.90': 'JPEG 2000 lossless',
  '1.2.840.10008.1.2.4.91': 'JPEG 2000', '1.2.840.10008.1.2.4.201': 'HTJ2K lossless', '1.2.840.10008.1.2.4.203': 'HTJ2K',
  '1.2.840.10008.1.2.4.100': 'MPEG-2 video', '1.2.840.10008.1.2.4.102': 'MPEG-4 video', '1.2.840.10008.1.2.4.110': 'JPEG XL lossless',
};
export const tsName = (uid: string) => TS_NAMES[uid] ?? `Transfer syntax ${uid}`;
/** True when pixel data in this transfer syntax is stored uncompressed (natively). */
export const nativeTs = (uid: string) => uid === TS.implicitLE || uid === TS.explicitLE || uid === TS.explicitBE || uid === TS.deflatedLE;

export const T = {
  PixelData: 0x7fe00010, Item: 0xfffee000, ItemEnd: 0xfffee00d, SeqEnd: 0xfffee0dd,
};
// VRs whose explicit encoding has 2 reserved bytes and a 32-bit length.
const LONG = new Set(['OB', 'OD', 'OF', 'OL', 'OV', 'OW', 'SQ', 'SV', 'UC', 'UN', 'UR', 'UT', 'UV']);
const TEXT = new Set(['AE', 'AS', 'CS', 'DA', 'DS', 'DT', 'IS', 'LO', 'LT', 'PN', 'SH', 'ST', 'TM', 'UC', 'UI', 'UR', 'UT']);
const NUMSIZE: Record<string, number> = { US: 2, SS: 2, UL: 4, SL: 4, FL: 4, FD: 8, SV: 8, UV: 8, AT: 4, OW: 2, OF: 4, OD: 8, OL: 4, OV: 8 };

export const hex4 = (n: number) => n.toString(16).toUpperCase().padStart(4, '0');
export const tagStr = (tag: number) => `(${hex4(tag >>> 16)},${hex4(tag & 0xffff)})`;
export const isPrivate = (tag: number) => ((tag >>> 16) & 1) === 1;

/** VR and keyword from the short dictionary, or a sensible guess. */
export function lookup(tag: number): [string, string] {
  const d = DICT.get(tag >>> 0);
  if (d) return d;
  const g = tag >>> 16, e = tag & 0xffff;
  if ((g & 0xff00) === 0x6000 && (g & 1) === 0) { const o = DICT.get((0x6000 << 16 | e) >>> 0); if (o) return o; }
  if (e === 0) return ['UL', 'GroupLength'];
  if (g & 1) return e >= 0x10 && e <= 0xff ? ['LO', 'PrivateCreator'] : ['UN', 'Private'];
  return ['UN', ''];
}
/** "PatientName" → "Patient Name". */
export const words = (kw: string) => kw.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

class Reader {
  b: Uint8Array; dv: DataView; pos: number; little: boolean; lastDelim = 0;
  constructor(b: Uint8Array, pos: number, little: boolean) { this.b = b; this.dv = new DataView(b.buffer, b.byteOffset, b.byteLength); this.pos = pos; this.little = little; }
  u16() { const v = this.dv.getUint16(this.pos, this.little); this.pos += 2; return v; }
  u32() { const v = this.dv.getUint32(this.pos, this.little); this.pos += 4; return v; }
  tag() { const g = this.u16(), e = this.u16(); return ((g << 16) | e) >>> 0; }
  need(n: number) { if (this.pos + n > this.b.length) throw new Error('The file ends in the middle of an element: it may be cut short or damaged.'); }
}
const isVR = (a: number, b: number) => a >= 65 && a <= 90 && b >= 65 && b <= 90;

/** Read one element at r.pos; returns null for a delimiter (its tag is then in r.lastDelim). */
function readElement(r: Reader, explicit: boolean, depth: number): Element | null {
  const start = r.pos;
  r.need(8);
  const tag = r.tag();
  if (tag === T.ItemEnd || tag === T.SeqEnd) { r.u32(); r.lastDelim = tag; return null; }
  let vr: string, len: number;
  const ex = explicit && tag !== T.Item && isVR(r.b[r.pos], r.b[r.pos + 1]);
  if (ex) {
    vr = String.fromCharCode(r.b[r.pos], r.b[r.pos + 1]); r.pos += 2;
    if (LONG.has(vr)) { r.pos += 2; r.need(4); len = r.u32(); } else len = r.u16();
  } else { vr = lookup(tag)[0]; len = r.u32(); }
  const el: Element = { tag, vr, value: new Uint8Array(0) };
  if (len === 0xffffffff) {
    if (tag === T.PixelData) {
      el.fragments = []; el.vr = 'OB';
      for (;;) {
        r.need(8);
        const t = r.tag(), l = r.u32();
        if (t === T.SeqEnd) break;
        if (t !== T.Item) throw new Error('Encapsulated pixel data has an unexpected element.');
        r.need(l); el.fragments.push(r.b.subarray(r.pos, r.pos + l)); r.pos += l;
      }
    } else {
      // A sequence of undefined length (SQ, or UN which is then implicit VR little endian inside).
      const un = vr === 'UN';
      el.items = readItems(r, r.b.length, un ? false : explicit, true, depth, un ? true : r.little);
      el.vr = 'SQ';
    }
  } else {
    if (r.pos + len > r.b.length) {
      if (tag === T.PixelData) len = r.b.length - r.pos;
      else throw new Error(`Element ${tagStr(tag)} says it is ${len} bytes long, past the end of the file. The file may be cut short or damaged.`);
    }
    if (vr === 'SQ') { const e = r.pos + len; el.items = readItems(r, e, explicit, false, depth, r.little); r.pos = e; }
    else { el.value = r.b.subarray(r.pos, r.pos + len); r.pos += len; }
  }
  if (r.pos <= start) throw new Error('The file could not be read: the parser made no progress.');
  return el;
}
function readElements(r: Reader, end: number, explicit: boolean, stopAt: number | null, depth = 0): Element[] {
  const out: Element[] = [];
  if (depth > 32) throw new Error('Sequences are nested too deeply.');
  while (r.pos + 8 <= end) {
    const el = readElement(r, explicit, depth);
    if (!el) { if (stopAt === r.lastDelim) return out; continue; }
    out.push(el);
  }
  return out;
}
function readItems(r: Reader, end: number, explicit: boolean, undef: boolean, depth: number, little: boolean): Element[][] {
  const items: Element[][] = [], keep = r.little;
  r.little = little;
  while (r.pos + 8 <= end) {
    const t = r.tag(), l = r.u32();
    if (t === T.SeqEnd) break;
    if (t !== T.Item) throw new Error(`A sequence has an unexpected element ${tagStr(t)} where an item should be.`);
    if (l === 0xffffffff) items.push(readElements(r, r.b.length, explicit, T.ItemEnd, depth + 1));
    else { const e = r.pos + l; items.push(readElements(r, e, explicit, null, depth + 1)); r.pos = e; }
    if (!undef && r.pos >= end) break;
  }
  r.little = keep;
  return items;
}

/** Read a DICOM file. Throws an Error with a plain message when the bytes are not DICOM. */
export function parse(bytes: Uint8Array): Dicom {
  const warnings: string[] = [];
  let pos = 0, preamble = false;
  const at = (p: number, s: string) => [...s].every((c, i) => bytes[p + i] === c.charCodeAt(0));
  if (bytes.length >= 132 && at(128, 'DICM')) { pos = 132; preamble = true; }
  else if (at(0, 'DICM')) pos = 4;
  if (bytes.length < pos + 8) throw new Error('This file is too short to be a DICOM file.');
  // File meta information: always explicit VR little endian, group 0002.
  let meta: Element[] = [];
  const r = new Reader(bytes, pos, true);
  if (bytes[pos] === 2 && bytes[pos + 1] === 0) {
    const explicitMeta = isVR(bytes[pos + 4], bytes[pos + 5]);
    while (r.pos + 8 <= bytes.length && r.dv.getUint16(r.pos, true) === 2) {
      const el = readElement(r, explicitMeta, 0);
      if (el) meta.push(el);
    }
  } else if (!preamble) {
    // No file meta: guess the encoding from the first element (old files are usually implicit VR little endian).
    const g = bytes[0] | (bytes[1] << 8);
    if (!(g === 0x0008 || g === 0x0010 || g === 0x0018 || g === 0x0020 || g === 0x0028 || g === 0x0800)) throw new Error('This does not look like a DICOM file: it has no "DICM" marker and does not start with a DICOM element.');
  }
  const tsEl = meta.find((e) => e.tag === 0x00020010);
  let ts = tsEl ? str(tsEl, 'latin1') : '';
  const body = r.pos;
  if (!ts) {
    // Guess: explicit if a VR follows the first tag; big endian if the group reads as 0x0800.
    const be = bytes[body] === 0 && bytes[body + 1] === 8;
    ts = isVR(bytes[body + 4], bytes[body + 5]) ? (be ? TS.explicitBE : TS.explicitLE) : TS.implicitLE;
    if (!meta.length) warnings.push(`No file meta information: read as ${tsName(ts).toLowerCase()} (a guess from the first bytes).`);
  }
  const explicit = ts !== TS.implicitLE, little = ts !== TS.explicitBE, deflated = ts === TS.deflatedLE;
  let data = bytes, start = body;
  if (deflated) { data = inflateSync(bytes.subarray(body)); start = 0; }
  const dr = new Reader(data, start, little);
  let elements: Element[];
  try { elements = readElements(dr, data.length, explicit, null); }
  catch (e) { throw new Error(`${(e as Error).message}`); }
  if (dr.pos < data.length && data.subarray(dr.pos).some((v) => v !== 0)) warnings.push('The file ends part-way through an element: it may be cut short.');
  if (!elements.length && !meta.length) throw new Error('This does not look like a DICOM file.');
  const cs = elements.find((e) => e.tag === 0x00080005);
  const charset = cs && /ISO_IR 192/i.test(str(cs, 'latin1')) ? 'utf-8' : 'latin1';
  if (cs && !/^(ISO_IR (100|192|6)|)$/i.test(str(cs, 'latin1').split('\\')[0].trim())) warnings.push(`Character set ${str(cs, 'latin1')}: text is shown as Latin-1 and may look wrong.`);
  return { meta, elements, ts, explicit, little, deflated, preamble, charset, warnings };
}
// ---------- Values ----------
const dec = new Map<string, TextDecoder>();
export function str(el: Element | undefined, charset = 'latin1'): string {
  if (!el || !el.value.length) return '';
  let d = dec.get(charset); if (!d) { d = new TextDecoder(charset); dec.set(charset, d); }
  return d.decode(el.value).replace(/[\0 ]+$/, '').replace(/^ +/, '');
}
/** Numbers in an element: binary VRs read with the file's byte order, IS and DS split on backslashes. */
export function nums(el: Element | undefined, little = true): number[] {
  if (!el) return [];
  if (el.vr === 'IS' || el.vr === 'DS') return str(el).split('\\').map((s) => (s.trim() === '' ? NaN : Number(s.trim())));
  const size = NUMSIZE[el.vr]; if (!size) return [];
  const dv = new DataView(el.value.buffer, el.value.byteOffset, el.value.byteLength), out: number[] = [];
  for (let o = 0; o + size <= el.value.length; o += size) {
    switch (el.vr) {
      case 'US': case 'OW': out.push(dv.getUint16(o, little)); break;
      case 'SS': out.push(dv.getInt16(o, little)); break;
      case 'UL': case 'OL': out.push(dv.getUint32(o, little)); break;
      case 'SL': out.push(dv.getInt32(o, little)); break;
      case 'FL': case 'OF': out.push(dv.getFloat32(o, little)); break;
      case 'FD': case 'OD': out.push(dv.getFloat64(o, little)); break;
      case 'SV': out.push(Number(dv.getBigInt64(o, little))); break;
      case 'UV': case 'OV': out.push(Number(dv.getBigUint64(o, little))); break;
      case 'AT': out.push(((dv.getUint16(o, little) << 16) | dv.getUint16(o + 2, little)) >>> 0); break;
    }
  }
  return out;
}
/** Byte order of an element: the file meta group is always little endian. */
const leOf = (e: Element, little: boolean) => ((e.tag >>> 16) === 2 ? true : little);
export const find = (els: Element[], tag: number) => els.find((e) => e.tag === tag);
/** Accessors bound to one file. */
export function getter(d: Dicom) {
  const map = new Map<number, Element>();
  for (const e of d.meta) map.set(e.tag, e);
  for (const e of d.elements) map.set(e.tag, e);
  return {
    el: (tag: number) => map.get(tag),
    s: (tag: number) => str(map.get(tag), d.charset),
    n: (tag: number) => { const e = map.get(tag); return e ? nums(e, leOf(e, d.little)) : []; },
    n1: (tag: number) => { const e = map.get(tag), v = e ? nums(e, leOf(e, d.little))[0] : NaN; return Number.isFinite(v) ? v : undefined; },
  };
}

/** A value as display text (shortened for long binary values). */
export function display(el: Element, d: Pick<Dicom, 'little' | 'charset'>, max = 120): string {
  if (el.items) return `${el.items.length} item${el.items.length === 1 ? '' : 's'}`;
  if (el.fragments) return `compressed pixel data, ${el.fragments.length - 1} fragment${el.fragments.length === 2 ? '' : 's'}`;
  let s: string;
  const little = leOf(el, d.little);
  if (TEXT.has(el.vr)) s = str(el, d.charset);
  else if (el.vr === 'AT') s = nums(el, little).map(tagStr).join('\\');
  else if (['US', 'SS', 'UL', 'SL', 'FL', 'FD', 'SV', 'UV'].includes(el.vr)) s = nums(el, little).map((v) => (Number.isInteger(v) ? String(v) : String(+v.toPrecision(8)))).join('\\');
  else {
    const n = el.value.length;
    s = `${n.toLocaleString('en')} bytes` + (n && n <= 16 ? `: ${[...el.value].map((b) => b.toString(16).padStart(2, '0')).join(' ')}` : '');
  }
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}
export type TagRow = { depth: number; tag: string; vr: string; name: string; value: string; private: boolean };
/** Every element as a row for a header table, with sequence items indented. */
export function tagRows(d: Dicom): TagRow[] {
  const rows: TagRow[] = [];
  const walk = (els: Element[], depth: number) => {
    for (const e of els) {
      const [, kw] = lookup(e.tag);
      rows.push({ depth, tag: tagStr(e.tag), vr: e.vr, name: words(kw), value: display(e, d), private: isPrivate(e.tag) });
      if (e.items) e.items.forEach((it, i) => { rows.push({ depth: depth + 1, tag: '', vr: '', name: `Item ${i + 1}`, value: '', private: isPrivate(e.tag) }); walk(it, depth + 2); });
    }
  };
  walk(d.meta, 0); walk(d.elements, 0);
  return rows;
}

// ---------- Pixels ----------
export type ImageInfo = {
  rows: number; cols: number; frames: number; spp: number; bitsAlloc: number; bitsStored: number; highBit: number; signed: boolean;
  photo: string; planar: number; slope: number; intercept: number; compressed: boolean; supported: boolean; why: string;
  wc: number[]; ww: number[]; wNames: string[];
  /** Row spacing and column spacing in mm (PixelSpacing, else ImagerPixelSpacing), or null. */
  spacing: [number, number] | null; spacingFrom: string;
  ipp: number[] | null; iop: number[] | null; thickness?: number; instance?: number; modality: string; units: string;
  float: boolean;
};
export function imageInfo(d: Dicom): ImageInfo {
  const g = getter(d);
  const pix = g.el(T.PixelData) ?? g.el(0x7fe00008) ?? g.el(0x7fe00009);
  const rows = g.n1(0x00280010) ?? 0, cols = g.n1(0x00280011) ?? 0;
  const frames = Math.max(1, Math.round(g.n1(0x00280008) ?? 1));
  const spp = g.n1(0x00280002) ?? 1, bitsAlloc = g.n1(0x00280100) ?? 0;
  const bitsStored = g.n1(0x00280101) ?? bitsAlloc, highBit = g.n1(0x00280102) ?? bitsStored - 1;
  const signed = (g.n1(0x00280103) ?? 0) === 1;
  const photo = g.s(0x00280004).toUpperCase() || (spp === 3 ? 'RGB' : 'MONOCHROME2');
  const planar = g.n1(0x00280006) ?? 0;
  const slope = g.n1(0x00281053) ?? 1, intercept = g.n1(0x00281052) ?? 0;
  const compressed = !!pix?.fragments;
  const ps = g.n(0x00280030), ips = g.n(0x00181164);
  const spacing: [number, number] | null = ps.length >= 2 && ps[0] > 0 && ps[1] > 0 ? [ps[0], ps[1]] : ips.length >= 2 && ips[0] > 0 && ips[1] > 0 ? [ips[0], ips[1]] : null;
  const modality = g.s(0x00080060).toUpperCase(), rt = g.s(0x00281054).toUpperCase();
  const units = rt ? (rt === 'HU' ? 'HU' : rt) : modality === 'CT' ? 'HU' : '';
  const ipp = g.n(0x00200032), iop = g.n(0x00200037);
  const wc = g.n(0x00281050).filter(Number.isFinite), ww = g.n(0x00281051).filter(Number.isFinite);
  const float = pix?.tag === 0x7fe00008 || pix?.tag === 0x7fe00009;
  let why = '';
  if (!pix) why = 'This file has no image (no pixel data). Its tags are listed below.';
  else if (compressed) why = `The pixel data is compressed (${tsName(d.ts)}). This viewer reads uncompressed images only, so it cannot show the picture; the tags are still listed. Ask for an uncompressed export (often called "explicit VR little endian" or "uncompressed") from the scanner or PACS.`;
  else if (!rows || !cols) why = 'The image size (Rows, Columns) is missing.';
  else if (!float && ![8, 16, 32].includes(bitsAlloc)) why = `${bitsAlloc}-bit pixels are not supported (8, 16 and 32-bit are).`;
  else if (!(spp === 1 && /^MONOCHROME[12]$/.test(photo)) && !(spp === 3 && (photo === 'RGB' || photo === 'YBR_FULL')))
    why = `The colour type ${photo} is not supported (MONOCHROME1, MONOCHROME2, RGB and YBR_FULL are).`;
  else if (spp === 3 && bitsAlloc !== 8) why = 'Colour images must be 8 bits per sample.';
  else {
    const need = rows * cols * spp * (float ? (pix.tag === 0x7fe00009 ? 8 : 4) : bitsAlloc / 8) * frames;
    if (pix.value.length < need) why = `The pixel data is shorter than the image size says (${pix.value.length.toLocaleString('en')} of ${need.toLocaleString('en')} bytes).`;
  }
  return {
    rows, cols, frames, spp, bitsAlloc, bitsStored, highBit, signed, photo, planar, slope, intercept, compressed, supported: !why, why,
    wc, ww, wNames: g.s(0x00281055).split('\\'), spacing, spacingFrom: ps.length >= 2 ? 'Pixel Spacing' : ips.length >= 2 ? 'Imager Pixel Spacing (at the detector)' : '',
    ipp: ipp.length === 3 && ipp.every(Number.isFinite) ? ipp : null, iop: iop.length === 6 && iop.every(Number.isFinite) ? iop : null,
    thickness: g.n1(0x00180050), instance: g.n1(0x00200013), modality, units, float,
  };
}
/** Stored pixel values of one grey frame (before the rescale), as numbers. */
export function storedFrame(d: Dicom, info: ImageInfo, f: number): Float64Array {
  const pix = getter(d).el(T.PixelData) ?? getter(d).el(0x7fe00008) ?? getter(d).el(0x7fe00009)!;
  const n = info.rows * info.cols, out = new Float64Array(n), b = pix.value;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (info.float) {
    const sz = pix.tag === 0x7fe00009 ? 8 : 4, o0 = f * n * sz;
    for (let i = 0; i < n; i++) out[i] = sz === 8 ? dv.getFloat64(o0 + i * 8, d.little) : dv.getFloat32(o0 + i * 4, d.little);
    return out;
  }
  const bytes = info.bitsAlloc / 8, o0 = f * n * bytes;
  const shift = info.highBit + 1 - info.bitsStored, mask = info.bitsStored >= 32 ? 0xffffffff : (2 ** info.bitsStored) - 1, sign = 2 ** (info.bitsStored - 1);
  // 8-bit data written as OW in big endian is byte-swapped in pairs.
  const swap8 = bytes === 1 && !d.little && pix.vr === 'OW';
  for (let i = 0; i < n; i++) {
    const o = o0 + i * bytes;
    let v = bytes === 1 ? b[swap8 ? o ^ 1 : o] : bytes === 2 ? dv.getUint16(o, d.little) : dv.getUint32(o, d.little);
    if (info.bitsStored < info.bitsAlloc) v = Math.floor(v / 2 ** shift) % (mask + 1);
    if (info.signed && v >= sign) v -= 2 * sign;
    out[i] = v;
  }
  return out;
}
/** One grey frame in modality units (Rescale Slope and Intercept applied), e.g. Hounsfield units for CT. */
export function frame(d: Dicom, info: ImageInfo, f = 0): Float32Array {
  if (!info.supported) throw new Error(info.why);
  if (info.spp !== 1) throw new Error('This is a colour image.');
  const s = storedFrame(d, info, f), out = new Float32Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s[i] * info.slope + info.intercept;
  return out;
}
/** One colour frame as interleaved 8-bit RGB. */
export function rgbFrame(d: Dicom, info: ImageInfo, f = 0): Uint8Array {
  if (!info.supported) throw new Error(info.why);
  const pix = getter(d).el(T.PixelData)!.value, n = info.rows * info.cols, o0 = f * n * 3, out = new Uint8Array(n * 3);
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) out[i * 3 + k] = info.planar === 1 ? pix[o0 + k * n + i] : pix[o0 + i * 3 + k];
  if (info.photo === 'YBR_FULL') {
    // PS3.3 C.7.6.3.1.2: YCbCr (full range) to RGB.
    for (let i = 0; i < n; i++) {
      const y = out[i * 3], cb = out[i * 3 + 1] - 128, cr = out[i * 3 + 2] - 128;
      const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
      out[i * 3] = cl(y + 1.402 * cr); out[i * 3 + 1] = cl(y - 0.344136 * cb - 0.714136 * cr); out[i * 3 + 2] = cl(y + 1.772 * cb);
    }
  }
  return out;
}

/** The DICOM linear VOI window (PS3.3 C.11.2.1.2.1): a value to a grey level 0 to 255. */
export function windowLevel(x: number, c: number, w: number): number {
  if (w < 1) w = 1;
  const lo = c - 0.5 - (w - 1) / 2, hi = c - 0.5 + (w - 1) / 2;
  if (x <= lo) return 0;
  if (x > hi) return 255;
  return ((x - (c - 0.5)) / (w - 1) + 0.5) * 255;
}
/** A window that spans the data (its 0.5th to 99.5th percentile). */
export function autoWindow(data: ArrayLike<number>): [number, number] {
  const step = Math.max(1, Math.floor(data.length / 200000)), s: number[] = [];
  for (let i = 0; i < data.length; i += step) s.push(data[i]);
  s.sort((a, b) => a - b);
  const lo = s[Math.floor(0.005 * (s.length - 1))], hi = s[Math.ceil(0.995 * (s.length - 1))];
  const w = Math.max(1, hi - lo);
  return [lo + w / 2, w];
}
/** Window presets (approximate, common starting points that vary between sites: adjust by eye). */
export const PRESETS: { name: string; c: number; w: number }[] = [
  { name: 'Soft tissue', c: 40, w: 400 }, { name: 'Lung', c: -600, w: 1500 }, { name: 'Bone', c: 400, w: 1800 },
  { name: 'Brain', c: 40, w: 80 }, { name: 'Liver', c: 60, w: 160 }, { name: 'Mediastinum', c: 50, w: 350 },
];

// ---------- Measurements ----------
/** Distance in mm between two pixel positions (x is the column, y the row); sp = [row spacing, column spacing]. */
export function distance(a: [number, number], b: [number, number], sp: [number, number]): number {
  return Math.hypot((b[0] - a[0]) * sp[1], (b[1] - a[1]) * sp[0]);
}
/** The angle at vertex v between rays to a and b, in degrees, in physical space. */
export function angle(a: [number, number], v: [number, number], b: [number, number], sp: [number, number] = [1, 1]): number {
  const ux = (a[0] - v[0]) * sp[1], uy = (a[1] - v[1]) * sp[0], wx = (b[0] - v[0]) * sp[1], wy = (b[1] - v[1]) * sp[0];
  const c = (ux * wx + uy * wy) / (Math.hypot(ux, uy) * Math.hypot(wx, wy));
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}
export type RoiStats = { n: number; mean: number; sd: number; min: number; max: number; area: number };
/** Statistics of the pixels whose centres fall in a rectangle or ellipse from (x0, y0) to (x1, y1) in pixel units. SD uses n − 1. */
export function roiStats(data: ArrayLike<number>, w: number, h: number, box: [number, number, number, number], ellipse: boolean, sp: [number, number] | null): RoiStats {
  const [ax, ay, bx, by] = box, x0 = Math.min(ax, bx), x1 = Math.max(ax, bx), y0 = Math.min(ay, by), y1 = Math.max(ay, by);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
  let n = 0, s = 0, s2 = 0, mn = Infinity, mx = -Infinity;
  const vals: number[] = [];
  for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(h - 1, Math.ceil(y1)); y++) for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(w - 1, Math.ceil(x1)); x++) {
    const px = x + 0.5, py = y + 0.5;
    if (px < x0 || px > x1 || py < y0 || py > y1) continue;
    if (ellipse && rx > 0 && ry > 0 && ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 > 1) continue;
    const v = data[y * w + x]; vals.push(v); n++; s += v; if (v < mn) mn = v; if (v > mx) mx = v;
  }
  const mean = n ? s / n : NaN;
  for (const v of vals) s2 += (v - mean) ** 2;
  return { n, mean, sd: n > 1 ? Math.sqrt(s2 / (n - 1)) : NaN, min: n ? mn : NaN, max: n ? mx : NaN, area: sp ? n * sp[0] * sp[1] : n };
}

// ---------- Series and reslicing ----------
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** The plane an orientation's normal points along: Axial (head-foot), Coronal (front-back) or Sagittal (left-right). */
export function planeOf(normal: number[]): string {
  const a = normal.map(Math.abs), i = a.indexOf(Math.max(...a));
  return ['Sagittal', 'Coronal', 'Axial'][i];
}
export type SliceRef = { ipp: number[] | null; iop: number[] | null; instance?: number; rows: number; cols: number };
export type Stack = { order: number[]; regular: boolean; why: string; spacing: number; normal: number[] | null; positions: number[] };
/** Sort slices by their position along the slice normal (else by instance number) and check that they form a regular stack. */
export function sortSlices(sl: SliceRef[]): Stack {
  const iop = sl[0]?.iop;
  const normal = iop ? cross(iop.slice(0, 3), iop.slice(3)) : null;
  const havePos = !!normal && sl.every((s) => s.ipp && s.iop);
  const pos = sl.map((s, i) => (havePos ? dot(s.ipp!, normal!) : s.instance ?? i));
  const order = sl.map((_, i) => i).sort((a, b) => pos[a] - pos[b] || (sl[a].instance ?? 0) - (sl[b].instance ?? 0));
  const p = order.map((i) => pos[i]);
  let why = '', spacing = NaN;
  if (sl.length < 3) why = 'Reslicing needs at least 3 slices.';
  else if (!havePos) why = 'The slices have no position and orientation, so they cannot be stacked in space.';
  else if (sl.some((s) => s.rows !== sl[0].rows || s.cols !== sl[0].cols)) why = 'The slices are not all the same size.';
  else if (sl.some((s) => s.iop!.some((v, k) => Math.abs(v - iop![k]) > 1e-3))) why = 'The slices are not all at the same angle.';
  else {
    const gaps = p.slice(1).map((v, i) => v - p[i]);
    spacing = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    if (gaps.some((g) => g <= 1e-6)) why = 'Two or more slices sit at the same position (maybe two series mixed together).';
    else if (gaps.some((g) => Math.abs(g - spacing) > Math.max(0.01, 0.05 * spacing))) why = 'The gaps between slices are not even.';
    else {
      // The in-plane origin must line up: each step should move along the normal only.
      const o = order.map((i) => sl[i].ipp!);
      if (o.some((q, k) => k && Math.hypot(...[0, 1, 2].map((j) => q[j] - o[k - 1][j] - normal![j] * (p[k] - p[k - 1]))) > Math.max(0.05, 0.05 * spacing))) why = 'The slices are shifted sideways (a tilted gantry?).';
    }
  }
  return { order, regular: !why, why, spacing, normal, positions: p };
}
/**
 * A reslice through a stack of n slices (each rows × cols, first slice first), with the last slice drawn at the top.
 * 'row' fixes a row (image is cols wide, n tall); 'col' fixes a column (image is rows wide, n tall).
 */
export function reslice(vol: ArrayLike<number>[], rows: number, cols: number, by: 'row' | 'col', index: number): { w: number; h: number; data: Float32Array } {
  const n = vol.length, w = by === 'row' ? cols : rows, out = new Float32Array(w * n);
  for (let k = 0; k < n; k++) {
    const s = vol[k], y = n - 1 - k;
    for (let i = 0; i < w; i++) out[y * w + i] = by === 'row' ? s[index * cols + i] : s[i * cols + index];
  }
  return { w, h: n, data: out };
}

// ---------- Writing ----------
const enc = new TextEncoder();
/** Text to an element value padded to even length (UI with a zero byte, others with a space). */
export function textValue(s: string, vr: string): Uint8Array {
  const b = enc.encode(s);
  if (b.length % 2 === 0) return b;
  const o = new Uint8Array(b.length + 1); o.set(b); o[b.length] = vr === 'UI' ? 0 : 0x20; return o;
}
class Writer {
  parts: Uint8Array[] = []; len = 0; little: boolean;
  constructor(little: boolean) { this.little = little; }
  push(b: Uint8Array) { this.parts.push(b); this.len += b.length; }
  u16(v: number) { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, v, this.little); this.push(b); }
  u32(v: number) { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, v, this.little); this.push(b); }
  tag(t: number) { this.u16(t >>> 16); this.u16(t & 0xffff); }
  bytes() { const o = new Uint8Array(this.len); let p = 0; for (const b of this.parts) { o.set(b, p); p += b.length; } return o; }
}
function writeElements(w: Writer, els: Element[], explicit: boolean) {
  for (const e of [...els].sort((a, b) => a.tag - b.tag)) {
    w.tag(e.tag);
    const undef = !!(e.items || e.fragments);
    let vr = e.vr; if (e.items) vr = 'SQ'; if (e.fragments) vr = 'OB';
    let v = e.value;
    if (!undef && v.length % 2) { const p = new Uint8Array(v.length + 1); p.set(v); p[v.length] = TEXT.has(vr) && vr !== 'UI' ? 0x20 : 0; v = p; }
    if (explicit) {
      let len16 = !LONG.has(vr);
      if (len16 && v.length > 0xffff) { vr = 'UN'; len16 = false; }
      w.push(enc.encode(vr));
      if (len16) w.u16(v.length); else { w.u16(0); w.u32(undef ? 0xffffffff : v.length); }
    } else w.u32(undef ? 0xffffffff : v.length);
    if (e.items) {
      for (const it of e.items) { w.tag(T.Item); w.u32(0xffffffff); writeElements(w, it, explicit); w.tag(T.ItemEnd); w.u32(0); }
      w.tag(T.SeqEnd); w.u32(0);
    } else if (e.fragments) {
      for (const f of e.fragments) { w.tag(T.Item); w.u32(f.length); w.push(f); }
      w.tag(T.SeqEnd); w.u32(0);
    } else w.push(v);
  }
}
/**
 * Write a Part 10 file (preamble, "DICM", file meta, data set) in the file's own transfer syntax; a deflated file
 * is written deflated again. The file meta group length is recomputed.
 */
/** fibub's implementation class UID (a UUID-derived 2.25 UID) and version name, written into files it makes. */
export const IMPL_UID = '2.25.188934582613373542870217651924316481024', IMPL_NAME = 'FIBUB_1';
export function write(d: Dicom): Uint8Array {
  const meta = d.meta.filter((e) => e.tag !== 0x00020000 && e.tag !== 0x00020010);
  const has = (t: number) => meta.some((e) => e.tag === t);
  const top = (t: number) => d.elements.find((e) => e.tag === t);
  if (!has(0x00020001)) meta.push({ tag: 0x00020001, vr: 'OB', value: new Uint8Array([0, 1]) });
  if (!has(0x00020002) && top(0x00080016)) meta.push({ tag: 0x00020002, vr: 'UI', value: top(0x00080016)!.value });
  if (!has(0x00020003) && top(0x00080018)) meta.push({ tag: 0x00020003, vr: 'UI', value: top(0x00080018)!.value });
  meta.push({ tag: 0x00020010, vr: 'UI', value: textValue(d.ts, 'UI') });
  if (!has(0x00020012)) meta.push({ tag: 0x00020012, vr: 'UI', value: textValue(IMPL_UID, 'UI') }, { tag: 0x00020013, vr: 'SH', value: textValue(IMPL_NAME, 'SH') });
  const mw = new Writer(true); writeElements(mw, meta, true);
  const mb = mw.bytes();
  const head = new Writer(true);
  head.push(new Uint8Array(128)); head.push(enc.encode('DICM'));
  head.tag(0x00020000); head.push(enc.encode('UL')); head.u16(4); head.u32(mb.length); head.push(mb);
  const dw = new Writer(d.little); writeElements(dw, d.elements, d.explicit);
  let body = dw.bytes();
  if (d.deflated) body = deflateSync(body);
  const o = new Uint8Array(head.len + body.length); o.set(head.bytes()); o.set(body, head.len);
  return o;
}
/** Make an element: text for string VRs, numbers for binary VRs (little endian), or raw bytes. */
export function makeElement(tag: number, vr: string, v: string | number[] | Uint8Array): Element {
  if (v instanceof Uint8Array) return { tag, vr, value: v };
  if (typeof v === 'string') return { tag, vr, value: textValue(v, vr) };
  const size = NUMSIZE[vr], b = new Uint8Array(v.length * size), dv = new DataView(b.buffer);
  v.forEach((x, i) => {
    const o = i * size;
    if (vr === 'US' || vr === 'OW') dv.setUint16(o, x, true); else if (vr === 'SS') dv.setInt16(o, x, true);
    else if (vr === 'UL') dv.setUint32(o, x, true); else if (vr === 'SL') dv.setInt32(o, x, true);
    else if (vr === 'FL') dv.setFloat32(o, x, true); else if (vr === 'FD') dv.setFloat64(o, x, true);
  });
  return { tag, vr, value: b };
}
/** Every element of a data set and its sequences, depth first, with a way to visit them. */
export function walk(els: Element[], fn: (e: Element, parent: Element[], depth: number) => void, depth = 0) {
  for (const e of [...els]) { fn(e, els, depth); if (e.items) for (const it of e.items) walk(it, fn, depth + 1); }
}
