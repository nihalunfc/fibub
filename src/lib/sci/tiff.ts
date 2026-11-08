// A small baseline TIFF / GeoTIFF reader and a float32 GeoTIFF writer. No DOM.
// Reads: classic TIFF (not BigTIFF), little or big endian; strips or tiles; chunky or planar bands; 8, 16 and
// 32-bit unsigned or signed integers and 32 or 64-bit floats; no compression, LZW, Deflate (zlib) or PackBits;
// horizontal (2) and floating-point (3) predictors. Not read: JPEG and other compressions, 1-bit or 12-bit data.
import { unzlibSync, zlibSync } from 'fflate';

export type Tag = { type: number; count: number; values: number[] | string };
export type GeoInfo = {
  scale?: [number, number]; tie?: [number, number, number, number]; // pixel (i, j) → model (x, y)
  model?: number; epsg?: number; linearUnit?: number; angularUnit?: number; nodata?: number;
};
export type Raster = { width: number; height: number; bands: Float32Array[]; bits: number; format: number; compression: number; geo: GeoInfo; geoTags: Map<number, Tag> };

const SIZES: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8, 16: 8 };
const GEO_TAGS = [33550, 33922, 34264, 34735, 34736, 34737];

/** All tags of the first image (IFD) as numbers or text. */
export function readTags(buf: ArrayBuffer) {
  const dv = new DataView(buf);
  if (buf.byteLength < 8) throw new Error('This file is too short to be a TIFF.');
  const bo = dv.getUint16(0);
  if (bo !== 0x4949 && bo !== 0x4d4d) throw new Error('This is not a TIFF file.');
  const le = bo === 0x4949, magic = dv.getUint16(2, le);
  if (magic === 43) throw new Error('BigTIFF files are not supported yet; save the image as a classic GeoTIFF (under 4 GB).');
  if (magic !== 42) throw new Error('This is not a TIFF file.');
  const ifd = dv.getUint32(4, le), n = dv.getUint16(ifd, le), tags = new Map<number, Tag>();
  for (let k = 0; k < n; k++) {
    const e = ifd + 2 + k * 12, id = dv.getUint16(e, le), type = dv.getUint16(e + 2, le), count = dv.getUint32(e + 4, le);
    const size = (SIZES[type] ?? 1) * count, off = size <= 4 ? e + 8 : dv.getUint32(e + 8, le);
    if (off + size > buf.byteLength) continue;
    if (type === 2) { tags.set(id, { type, count, values: new TextDecoder().decode(new Uint8Array(buf, off, count)).replace(/\0+$/, '') }); continue; }
    const v: number[] = [];
    for (let i = 0; i < count; i++) {
      const p = off + i * (SIZES[type] ?? 1);
      switch (type) {
        case 1: case 7: v.push(dv.getUint8(p)); break;
        case 6: v.push(dv.getInt8(p)); break;
        case 3: v.push(dv.getUint16(p, le)); break;
        case 8: v.push(dv.getInt16(p, le)); break;
        case 4: v.push(dv.getUint32(p, le)); break;
        case 9: v.push(dv.getInt32(p, le)); break;
        case 5: v.push(dv.getUint32(p, le) / dv.getUint32(p + 4, le)); break;
        case 10: v.push(dv.getInt32(p, le) / dv.getInt32(p + 4, le)); break;
        case 11: v.push(dv.getFloat32(p, le)); break;
        case 12: v.push(dv.getFloat64(p, le)); break;
        default: v.push(NaN);
      }
    }
    tags.set(id, { type, count, values: v });
  }
  return { tags, le };
}

/** TIFF LZW (MSB-first codes, early change). */
export function lzwDecode(src: Uint8Array, expected: number) {
  const out = new Uint8Array(expected);
  let o = 0, bitPos = 0, width = 9, prev: Uint8Array | null = null;
  let dict: Uint8Array[] = [];
  const reset = () => { dict = []; for (let i = 0; i < 256; i++) dict.push(Uint8Array.of(i)); dict.push(new Uint8Array(0), new Uint8Array(0)); width = 9; prev = null; };
  reset();
  const total = src.length * 8;
  while (bitPos + width <= total && o < expected) {
    let code = 0;
    for (let b = 0; b < width; b++) { code = (code << 1) | ((src[(bitPos + b) >> 3] >> (7 - ((bitPos + b) & 7))) & 1); }
    bitPos += width;
    if (code === 256) { reset(); continue; }
    if (code === 257) break;
    let entry: Uint8Array;
    if (code < dict.length) { entry = dict[code]; if (prev) { const ne = new Uint8Array(prev.length + 1); ne.set(prev); ne[prev.length] = entry[0]; dict.push(ne); } }
    else if (prev && code === dict.length) { entry = new Uint8Array(prev.length + 1); entry.set(prev); entry[prev.length] = prev[0]; dict.push(entry); }
    else throw new Error('This LZW data is damaged.');
    out.set(entry.subarray(0, Math.min(entry.length, expected - o)), o); o += entry.length;
    prev = entry;
    if (dict.length + 1 >= 1 << width && width < 12) width++;
  }
  return out;
}

/** PackBits run-length decoding. */
export function packbitsDecode(src: Uint8Array, expected: number) {
  const out = new Uint8Array(expected);
  let i = 0, o = 0;
  while (i < src.length && o < expected) {
    const n = (src[i++] << 24) >> 24;
    if (n >= 0) { out.set(src.subarray(i, i + n + 1).subarray(0, expected - o), o); o += n + 1; i += n + 1; }
    else if (n !== -128) { out.fill(src[i++], o, Math.min(expected, o - n + 1)); o += -n + 1; }
  }
  return out;
}

const first = (t: Map<number, Tag>, id: number, d?: number) => { const v = t.get(id)?.values; return Array.isArray(v) && v.length ? v[0] : d; };
const arr = (t: Map<number, Tag>, id: number) => { const v = t.get(id)?.values; return Array.isArray(v) ? v : []; };

/** GeoTIFF georeferencing from the tags: pixel size, tie point, model type, EPSG code, units and no-data value. */
export function geoFromTags(t: Map<number, Tag>): GeoInfo {
  const g: GeoInfo = {};
  const sc = arr(t, 33550), tp = arr(t, 33922);
  if (sc.length >= 2) g.scale = [sc[0], sc[1]];
  if (tp.length >= 6) g.tie = [tp[0], tp[1], tp[3], tp[4]];
  const mt = arr(t, 34264); // ModelTransformation: a pure scale and offset is turned into scale and tie point
  if (!g.scale && mt.length >= 16 && mt[1] === 0 && mt[4] === 0) { g.scale = [mt[0], -mt[5]]; g.tie = [0, 0, mt[3], mt[7]]; }
  const keys = arr(t, 34735);
  for (let k = 4; k + 3 < keys.length; k += 4) {
    const [id, loc, , val] = keys.slice(k, k + 4);
    if (loc !== 0) continue;
    if (id === 1024) g.model = val; else if (id === 3072 || id === 2048) g.epsg = val; else if (id === 3076) g.linearUnit = val; else if (id === 2054) g.angularUnit = val;
  }
  const nd = t.get(42113)?.values;
  if (typeof nd === 'string' && nd.trim()) g.nodata = Number(nd.trim());
  return g;
}

/** Reads the first image of a TIFF into one Float32Array per band. maxSamples guards memory. */
export function readTiff(buf: ArrayBuffer, maxSamples = 80e6): Raster {
  const { tags: t, le } = readTags(buf);
  const W = first(t, 256)!, H = first(t, 257)!, spp = first(t, 277, 1)!, bits = first(t, 258, 1)!, comp = first(t, 259, 1)!;
  const fmt = first(t, 339, 1)!, planar = first(t, 284, 1)!, pred = first(t, 317, 1)!;
  if (!(W > 0 && H > 0)) throw new Error('The image has no width or height.');
  if (W * H * spp > maxSamples) throw new Error(`The image is ${W} × ${H} pixels with ${spp} bands, which is too large for the browser here (limit ${Math.round(maxSamples / 1e6)} million values).`);
  if (![8, 16, 32, 64].includes(bits) || (bits === 64 && fmt !== 3)) throw new Error(`${bits}-bit samples are not supported (8, 16 or 32-bit integers and 32 or 64-bit floats are).`);
  if (![1, 5, 8, 32946, 32773].includes(comp)) throw new Error(`This TIFF uses compression type ${comp} (${comp === 7 ? 'JPEG' : 'not supported'}). Save it uncompressed, LZW or Deflate.`);
  const tiled = t.has(322);
  const tw = tiled ? first(t, 322)! : W, th = tiled ? first(t, 323)! : first(t, 278, H)!;
  const offs = arr(t, tiled ? 324 : 273), cnts = arr(t, tiled ? 325 : 279);
  if (!offs.length) throw new Error('The image has no pixel data.');
  const bps = bits / 8, chunkSpp = planar === 2 ? 1 : spp;
  const across = Math.ceil(W / tw), down = Math.ceil(H / th), perPlane = across * down;
  const bands = Array.from({ length: spp }, () => new Float32Array(W * H));
  const src = new Uint8Array(buf);
  for (let c = 0; c < offs.length; c++) {
    const plane = planar === 2 ? Math.floor(c / perPlane) : 0, idx = c % perPlane;
    const cx = (idx % across) * tw, cy = Math.floor(idx / across) * th;
    const rows = tiled ? th : Math.min(th, H - cy), cols = tiled ? tw : W;
    const expected = rows * cols * chunkSpp * bps;
    const raw = src.subarray(offs[c], offs[c] + (cnts[c] ?? expected));
    let data: Uint8Array;
    if (comp === 1) data = raw;
    else if (comp === 5) data = lzwDecode(raw, expected);
    else if (comp === 32773) data = packbitsDecode(raw, expected);
    else data = unzlibSync(raw);
    if (data.length < expected) { const d2 = new Uint8Array(expected); d2.set(data); data = d2; }
    // Undo the predictor, row by row.
    const rowBytes = cols * chunkSpp * bps;
    if (pred === 3) {
      const tmp = new Uint8Array(rowBytes), out = new Uint8Array(expected);
      for (let r = 0; r < rows; r++) {
        const row = data.slice(r * rowBytes, (r + 1) * rowBytes);
        for (let i = chunkSpp; i < rowBytes; i++) row[i] = (row[i] + row[i - chunkSpp]) & 255;
        const n = cols * chunkSpp;
        for (let i = 0; i < n; i++) for (let b = 0; b < bps; b++) tmp[i * bps + (le ? bps - 1 - b : b)] = row[b * n + i];
        out.set(tmp, r * rowBytes);
      }
      data = out;
    }
    const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const ple = pred === 3 ? le : le;
    for (let r = 0; r < rows; r++) {
      const y = cy + r; if (y >= H) break;
      const acc = new Array<number>(chunkSpp).fill(0);
      for (let cc = 0; cc < cols; cc++) {
        const x = cx + cc;
        for (let s = 0; s < chunkSpp; s++) {
          const p = ((r * cols + cc) * chunkSpp + s) * bps;
          let v: number;
          if (fmt === 3) v = bps === 4 ? dv.getFloat32(p, ple) : dv.getFloat64(p, ple);
          else if (bps === 1) v = fmt === 2 ? dv.getInt8(p) : dv.getUint8(p);
          else if (bps === 2) v = fmt === 2 ? dv.getInt16(p, le) : dv.getUint16(p, le);
          else v = fmt === 2 ? dv.getInt32(p, le) : dv.getUint32(p, le);
          if (pred === 2) {
            acc[s] = cc === 0 ? v : acc[s] + v;
            const m = 2 ** bits; let w = acc[s] % m; if (w < 0) w += m;
            if (fmt === 2 && w >= m / 2) w -= m;
            acc[s] = w; v = w;
          }
          if (x < W) bands[planar === 2 ? plane : s][y * W + x] = v;
        }
      }
    }
  }
  const geo = geoFromTags(t), geoTags = new Map<number, Tag>();
  for (const id of GEO_TAGS) if (t.has(id)) geoTags.set(id, t.get(id)!);
  if (geo.nodata !== undefined && Number.isFinite(geo.nodata)) for (const b of bands) for (let i = 0; i < b.length; i++) if (b[i] === geo.nodata) b[i] = NaN;
  return { width: W, height: H, bands, bits, format: fmt, compression: comp, geo, geoTags };
}

/**
 * A float32 GeoTIFF (little endian, chunky bands, one strip per 16 rows, uncompressed or Deflate) carrying the given
 * georeferencing tags unchanged, with GDAL_NODATA "nan".
 */
export function writeTiff(width: number, height: number, bands: Float32Array[], geoTags: Map<number, Tag> = new Map(), deflate = false) {
  const spp = bands.length, rps = 16, nStrips = Math.ceil(height / rps);
  const strips: Uint8Array[] = [];
  for (let s = 0; s < nStrips; s++) {
    const rows = Math.min(rps, height - s * rps), a = new Float32Array(rows * width * spp);
    for (let r = 0; r < rows; r++) for (let x = 0; x < width; x++) for (let b = 0; b < spp; b++) a[(r * width + x) * spp + b] = bands[b][(s * rps + r) * width + x];
    const bytes = new Uint8Array(a.buffer);
    strips.push(deflate ? zlibSync(bytes) : bytes);
  }
  type E = { id: number; type: number; values: number[] | string };
  const ent: E[] = [
    { id: 256, type: 4, values: [width] }, { id: 257, type: 4, values: [height] }, { id: 258, type: 3, values: Array(spp).fill(32) },
    { id: 259, type: 3, values: [deflate ? 8 : 1] }, { id: 262, type: 3, values: [1] }, { id: 273, type: 4, values: Array(nStrips).fill(0) },
    { id: 277, type: 3, values: [spp] }, { id: 278, type: 4, values: [rps] }, { id: 279, type: 4, values: strips.map((s) => s.length) },
    { id: 284, type: 3, values: [1] }, { id: 339, type: 3, values: Array(spp).fill(3) },
  ];
  if (spp > 1) ent.push({ id: 338, type: 3, values: Array(spp - 1).fill(0) });
  for (const [id, tg] of geoTags) ent.push({ id, type: tg.type, values: tg.values });
  ent.push({ id: 42113, type: 2, values: 'nan' });
  ent.sort((a, b) => a.id - b.id);
  const enc = new TextEncoder();
  const payload = (e: E) => (typeof e.values === 'string' ? enc.encode(e.values + '\0') : null);
  const size = (e: E) => (typeof e.values === 'string' ? payload(e)!.length : e.values.length * SIZES[e.type]);
  const ifdSize = 2 + ent.length * 12 + 4;
  let extra = 0; for (const e of ent) { const s = size(e); if (s > 4) extra += s + (s & 1); }
  const dataStart = 8 + ifdSize + extra, total = dataStart + strips.reduce((s, x) => s + x.length, 0);
  // Strip offsets.
  let p = dataStart; (ent.find((e) => e.id === 273)!.values as number[]).forEach((_, i, a) => { a[i] = p; p += strips[i].length; });
  const out = new Uint8Array(total), dv = new DataView(out.buffer);
  out[0] = out[1] = 0x49; dv.setUint16(2, 42, true); dv.setUint32(4, 8, true);
  dv.setUint16(8, ent.length, true);
  let ext = 8 + ifdSize;
  ent.forEach((e, k) => {
    const at = 10 + k * 12, s = size(e), count = typeof e.values === 'string' ? s : e.values.length;
    dv.setUint16(at, e.id, true); dv.setUint16(at + 2, e.type, true); dv.setUint32(at + 4, count, true);
    const where = s > 4 ? ext : at + 8;
    if (s > 4) { dv.setUint32(at + 8, ext, true); ext += s + (s & 1); }
    if (typeof e.values === 'string') out.set(payload(e)!, where);
    else e.values.forEach((v, i) => {
      const q = where + i * SIZES[e.type];
      switch (e.type) { case 1: case 7: dv.setUint8(q, v); break; case 3: dv.setUint16(q, v, true); break; case 8: dv.setInt16(q, v, true); break; case 4: dv.setUint32(q, v, true); break; case 9: dv.setInt32(q, v, true); break; case 11: dv.setFloat32(q, v, true); break; case 12: dv.setFloat64(q, v, true); break; default: dv.setUint32(q, v, true); }
    });
  });
  dv.setUint32(8 + 2 + ent.length * 12, 0, true);
  strips.forEach((s, i) => out.set(s, (ent.find((e) => e.id === 273)!.values as number[])[i]));
  return out;
}
