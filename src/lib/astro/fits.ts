// A small FITS reader for the browser: headers, 2D images (and 3-plane colour), simple TAN WCS.
// FITS files are 2880-byte blocks; a header is 80-character "cards" ending with END.
export type Card = { key: string; value: string; comment: string };
export type Header = { cards: Card[]; get: (k: string) => string | undefined; num: (k: string) => number | undefined; bytes: number };

const BLOCK = 2880;
const ascii = new TextDecoder('latin1');

export function parseHeader(buf: Uint8Array, offset = 0): Header | null {
  const cards: Card[] = [];
  let pos = offset, done = false;
  while (!done && pos + BLOCK <= buf.length) {
    const block = ascii.decode(buf.subarray(pos, pos + BLOCK));
    pos += BLOCK;
    for (let i = 0; i < 36; i++) {
      const c = block.slice(i * 80, i * 80 + 80);
      const key = c.slice(0, 8).trim();
      if (key === 'END') { done = true; break; }
      if (!key) continue;
      if (c.slice(8, 10) === '= ') {
        const rest = c.slice(10);
        let value = '', comment = '';
        const s = rest.trimStart();
        if (s.startsWith("'")) {
          let j = 1, v = '';
          while (j < s.length) { if (s[j] === "'") { if (s[j + 1] === "'") { v += "'"; j += 2; continue; } break; } v += s[j++]; }
          value = v.trimEnd();
          const k = s.indexOf('/', j); comment = k >= 0 ? s.slice(k + 1).trim() : '';
        } else {
          const k = s.indexOf('/');
          value = (k >= 0 ? s.slice(0, k) : s).trim(); comment = k >= 0 ? s.slice(k + 1).trim() : '';
        }
        cards.push({ key, value, comment });
      } else cards.push({ key, value: '', comment: c.slice(8).trim() });
    }
  }
  if (!done) return null;
  if (offset === 0 && cards[0]?.key !== 'SIMPLE') return null;
  const map = new Map<string, string>();
  for (const c of cards) if (c.value !== '' && !map.has(c.key)) map.set(c.key, c.value);
  return {
    cards, bytes: pos - offset,
    get: (k) => map.get(k),
    num: (k) => { const v = map.get(k); if (v == null) return undefined; const n = parseFloat(v.replace(/D/i, 'E')); return Number.isFinite(n) ? n : undefined; },
  };
}

/** Read just enough of a file to get its first header (headers are usually under 30 KB). */
export async function readHeader(file: Blob): Promise<Header | null> {
  let size = 28800;
  for (let i = 0; i < 6; i++) {
    const buf = new Uint8Array(await file.slice(0, size).arrayBuffer());
    const h = parseHeader(buf);
    if (h || buf.length < size) return h;
    size *= 4;
  }
  return null;
}

export type Image = { w: number; h: number; planes: Float32Array[]; header: Header; hdu: number; bitpix: number };

/** The first HDU that holds an image (2D, or 3D where the first plane, or three RGB planes, are used). */
export function readImage(buf: Uint8Array): Image {
  let off = 0, hdu = 0;
  while (off < buf.length) {
    const h = parseHeader(buf, off);
    if (!h) throw new Error(off === 0 ? 'This is not a FITS file (it does not start with SIMPLE).' : 'The file ends in the middle of a header.');
    const bitpix = h.num('BITPIX')!, naxis = h.num('NAXIS') ?? 0;
    const dims = Array.from({ length: naxis }, (_, i) => h.num(`NAXIS${i + 1}`) ?? 0);
    const pcount = h.num('PCOUNT') ?? 0, gcount = h.num('GCOUNT') ?? 1;
    const dataBytes = naxis ? (Math.abs(bitpix) / 8) * gcount * (pcount + dims.reduce((a, b) => a * b, 1)) : 0;
    const start = off + h.bytes;
    const xt = h.get('XTENSION');
    if (h.get('ZIMAGE') === 'T') throw new Error('This file uses tile compression (fpack). Unpack it with funpack first, then open it here.');
    if (naxis >= 2 && dims[0] > 0 && dims[1] > 0 && (!xt || xt === 'IMAGE')) {
      const [w, hh] = dims, nPlanes = naxis >= 3 && dims[2] === 3 ? 3 : 1;
      if (start + (Math.abs(bitpix) / 8) * w * hh * nPlanes > buf.length) throw new Error('The file is shorter than its header says. It may be cut off.');
      const scale = h.num('BSCALE') ?? 1, zero = h.num('BZERO') ?? 0;
      const dv = new DataView(buf.buffer, buf.byteOffset + start);
      const planes: Float32Array[] = [];
      const n = w * hh, bp = Math.abs(bitpix) / 8;
      for (let p = 0; p < nPlanes; p++) {
        const out = new Float32Array(n), base = p * n * bp;
        for (let i = 0; i < n; i++) {
          const o = base + i * bp;
          let v: number;
          switch (bitpix) {
            case 8: v = dv.getUint8(o); break;
            case 16: v = dv.getInt16(o); break;
            case 32: v = dv.getInt32(o); break;
            case -32: v = dv.getFloat32(o); break;
            case -64: v = dv.getFloat64(o); break;
            case 64: v = Number(dv.getBigInt64(o)); break;
            default: throw new Error(`Unsupported BITPIX ${bitpix}.`);
          }
          out[i] = v * scale + zero;
        }
        planes.push(out);
      }
      return { w, h: hh, planes, header: h, hdu, bitpix };
    }
    off = start + Math.ceil(dataBytes / BLOCK) * BLOCK;
    hdu++;
  }
  throw new Error('No image was found in this FITS file (it may hold only tables).');
}

export type Stretch = 'linear' | 'sqrt' | 'log' | 'asinh';
/** Values at the given fractions (0..1), from a sample of up to ~400k finite pixels. */
export function percentiles(data: Float32Array, fr: number[]) {
  const step = Math.max(1, Math.floor(data.length / 400000));
  const s: number[] = [];
  for (let i = 0; i < data.length; i += step) { const v = data[i]; if (Number.isFinite(v)) s.push(v); }
  s.sort((a, b) => a - b);
  return fr.map((f) => (s.length ? s[Math.min(s.length - 1, Math.max(0, Math.floor(f * (s.length - 1))))] : 0));
}
export function stretchFn(kind: Stretch, lo: number, hi: number) {
  const span = hi - lo || 1;
  const f = kind === 'linear' ? (x: number) => x : kind === 'sqrt' ? Math.sqrt : kind === 'log' ? (x: number) => Math.log10(1 + 1000 * x) / 3 : (x: number) => Math.asinh(10 * x) / Math.asinh(10);
  return (v: number) => { const x = (v - lo) / span; return x <= 0 || !Number.isFinite(x) ? 0 : x >= 1 ? 255 : Math.round(f(x) * 255); };
}

/** Pixel (1-based FITS) to RA/Dec in degrees with a TAN (gnomonic) projection, or null without WCS. */
export function wcs(h: Header) {
  const t1 = h.get('CTYPE1') ?? '', t2 = h.get('CTYPE2') ?? '';
  if (!/RA---TAN/.test(t1) || !/DEC--TAN/.test(t2)) return null;
  const crval1 = h.num('CRVAL1')!, crval2 = h.num('CRVAL2')!, crpix1 = h.num('CRPIX1')!, crpix2 = h.num('CRPIX2')!;
  let cd11 = h.num('CD1_1'), cd12 = h.num('CD1_2') ?? 0, cd21 = h.num('CD2_1') ?? 0, cd22 = h.num('CD2_2');
  if (cd11 == null || cd22 == null) {
    const c1 = h.num('CDELT1'), c2 = h.num('CDELT2'); if (c1 == null || c2 == null) return null;
    const pc11 = h.num('PC1_1') ?? 1, pc12 = h.num('PC1_2') ?? 0, pc21 = h.num('PC2_1') ?? 0, pc22 = h.num('PC2_2') ?? 1;
    const rot = ((h.num('CROTA2') ?? 0) * Math.PI) / 180;
    if (h.num('PC1_1') != null) { cd11 = c1 * pc11; cd12 = c1 * pc12; cd21 = c2 * pc21; cd22 = c2 * pc22; }
    else { cd11 = c1 * Math.cos(rot); cd12 = -c2 * Math.sin(rot); cd21 = c1 * Math.sin(rot); cd22 = c2 * Math.cos(rot); }
  }
  if ([crval1, crval2, crpix1, crpix2].some((v) => v == null)) return null;
  const r = Math.PI / 180, a0 = crval1 * r, d0 = crval2 * r;
  const scale = Math.sqrt(Math.abs(cd11 * cd22 - cd12 * cd21)) * 3600;
  return {
    scale, // arcsec per pixel
    toSky(px: number, py: number) {
      const dx = px - crpix1, dy = py - crpix2;
      const x = (cd11! * dx + cd12 * dy) * r, y = (cd21 * dx + cd22! * dy) * r;
      const rho = Math.hypot(x, y), c = Math.atan(rho);
      const dec = rho === 0 ? d0 : Math.asin(Math.cos(c) * Math.sin(d0) + (y * Math.sin(c) * Math.cos(d0)) / rho);
      const ra = a0 + Math.atan2(x * Math.sin(c), rho * Math.cos(d0) * Math.cos(c) - y * Math.sin(d0) * Math.sin(c));
      return { ra: (((ra / r) % 360) + 360) % 360, dec: dec / r };
    },
  };
}

export const SUMMARY_KEYS = ['OBJECT', 'DATE-OBS', 'IMAGETYP', 'FILTER', 'EXPTIME', 'CCD-TEMP', 'GAIN', 'OFFSET', 'XBINNING', 'AIRMASS', 'TELESCOP', 'INSTRUME'];
