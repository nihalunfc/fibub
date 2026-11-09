// Readers for scientific data files, written for fibub with no outside libraries:
// - NetCDF "classic" (CDF-1), "64-bit offset" (CDF-2) and "64-bit data" (CDF-5), following the NetCDF file format
//   specification (Unidata, "The NetCDF Classic Format Specification"). Big-endian, header then data; record
//   variables are interleaved one record at a time.
// - FITS images, binary tables (BINTABLE, with variable-length P/Q arrays) and ASCII tables (TABLE), following the
//   FITS Standard 4.0. Header cards are read with the shared parser in ../astro/fits.ts.
// - CSV / Excel tables are handed over by the page as plain tables (fromTables).
// It also writes small NetCDF classic files (writeNetcdf), used for the page's made-up example and the tests.
// HDF5 (and so NetCDF-4) and Parquet are recognised by their signatures and refused with a plain message.
import { parseHeader, type Header } from '../astro/fits.ts';

export type Cell = number | bigint | string | boolean | null | Cell[];
export type Attr = { name: string; type: string; value: string | number[] | bigint[] };
export type Item = {
  name: string;
  kind: 'variable' | 'image' | 'table';
  type: string; // data type in words (NetCDF type, FITS BITPIX or "table")
  dims: string[]; // dimension names (variables, images) or [] for tables
  shape: number[]; // sizes, slowest first; tables: [rows]
  columns?: { name: string; type: string; unit: string; repeat: number }[];
  attrs: [string, string][];
  note?: string;
};
export type Dataset = {
  format: string;
  dims: { name: string; size: number; unlimited: boolean }[];
  globals: [string, string][];
  items: Item[];
  notes: string[];
};
export type Options = { scale?: boolean; layout?: 'long' | 'grid'; maxValues?: number };
type Reader = { ds: Dataset; table: (i: number, o: Options) => string[][]; json: (i: number, o: Options) => unknown };

export const MAX_VALUES = 5_000_000;

// ---------- shared helpers ----------
const pad4 = (n: number) => (n + 3) & ~3;
const prod = (a: number[]) => a.reduce((x, y) => x * y, 1);
const utf8 = new TextDecoder('utf-8');
const latin1 = new TextDecoder('latin1');

/** Shortest decimal text that reads back as the same 32-bit float. */
export function f32(v: number): string {
  if (!Number.isFinite(v)) return String(v);
  for (let p = 1; p <= 9; p++) { const s = String(Number(v.toPrecision(p))); if (Math.fround(Number(s)) === v) return s; }
  return String(v);
}
/** A cell as CSV text. */
export function cellText(v: Cell, float32 = false): string {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map((x) => cellText(x, float32)).join(' ');
  if (typeof v === 'number') return float32 ? f32(v) : String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}
/** A cell as a JSON value (big integers outside the safe range become text). */
export function cellJson(v: Cell, float32 = false): unknown {
  if (v == null) return null;
  if (Array.isArray(v)) return v.map((x) => cellJson(x, float32));
  if (typeof v === 'bigint') return v >= BigInt(Number.MIN_SAFE_INTEGER) && v <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(v) : v.toString();
  if (typeof v === 'number') return Number.isFinite(v) ? (float32 ? Number(f32(v)) : v) : String(v);
  return v;
}
/** Nest a flat list into arrays of the given shape (slowest first). */
export function nest<T>(flat: T[], shape: number[]): unknown {
  if (shape.length === 0) return flat[0];
  if (shape.length === 1) return flat;
  const inner = prod(shape.slice(1)), out: unknown[] = [];
  for (let i = 0; i < shape[0]; i++) out.push(nest(flat.slice(i * inner, (i + 1) * inner), shape.slice(1)));
  return out;
}
const tooBig = (n: number, max: number) => {
  if (n > max) throw new Error(`That is ${n.toLocaleString('en')} values; this page exports up to ${max.toLocaleString('en')} at a time, to keep your browser responsive.`);
};

/** What kind of file the first bytes say this is. */
export function sniff(b: Uint8Array): 'netcdf' | 'fits' | 'hdf5' | 'parquet' | 'xlsx' | 'xls' | 'text' | 'unknown' {
  const s = latin1.decode(b.subarray(0, 8));
  if (s.startsWith('CDF') && [1, 2, 5].includes(b[3])) return 'netcdf';
  if (s.startsWith('SIMPLE  ') || s.startsWith('SIMPLE =')) return 'fits';
  if (b[0] === 0x89 && s.slice(1, 4) === 'HDF') return 'hdf5';
  // HDF5 may also start at 512, 1024, 2048 ... bytes in.
  for (let o = 512; o + 8 <= b.length && o <= 1 << 20; o *= 2) if (b[o] === 0x89 && latin1.decode(b.subarray(o + 1, o + 4)) === 'HDF') return 'hdf5';
  if (s.startsWith('PAR1')) return 'parquet';
  if (s.startsWith('PK')) return 'xlsx';
  if (b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) return 'xls';
  const head = b.subarray(0, 4096);
  if (head.length && !head.includes(0)) return 'text';
  return 'unknown';
}

export const UNSUPPORTED: Record<string, string> = {
  hdf5: 'This is an HDF5 file (NetCDF-4 files are HDF5 inside). This page reads only NetCDF classic and 64-bit offset files, because reading HDF5 needs a large library. If you have the netCDF tools, convert it first: nccopy -k classic in.nc out.nc (or -k 64-bit-offset for big files).',
  parquet: 'This is a Parquet file. This page does not read Parquet (it needs a large library). Save it as CSV first, for example with pandas: pd.read_parquet("file.parquet").to_csv("file.csv").',
  xls: 'This is an old Excel (.xls) file. Save it as .xlsx or CSV first (File, Save as).',
  unknown: 'This file is not one this page reads. It opens NetCDF classic or 64-bit offset (.nc), FITS (.fits, .fit, .fts), CSV, TSV and Excel (.xlsx).',
};

// ---------- NetCDF ----------
const NC_TYPES: Record<number, [string, number]> = { 1: ['byte', 1], 2: ['char', 1], 3: ['short', 2], 4: ['int', 4], 5: ['float', 4], 6: ['double', 8], 7: ['ubyte', 1], 8: ['ushort', 2], 9: ['uint', 4], 10: ['int64', 8], 11: ['uint64', 8] };
const NC_CODE: Record<string, number> = Object.fromEntries(Object.entries(NC_TYPES).map(([k, v]) => [v[0], Number(k)]));
// Default fill values (netcdf.h), used when a variable has no _FillValue.
const NC_FILL: Record<string, number | bigint> = { byte: -127, short: -32767, int: -2147483647, float: 9.969209968386869e36, double: 9.969209968386869e36, ubyte: 255, ushort: 65535, uint: 4294967295, int64: -9223372036854775806n, uint64: 18446744073709551614n };

export type NcVar = { name: string; dimids: number[]; attrs: Attr[]; type: string; size: number; begin: number; record: boolean };
export type NcFile = { version: 1 | 2 | 5; numrecs: number; dims: { name: string; size: number; unlimited: boolean }[]; attrs: Attr[]; vars: NcVar[]; recsize: number };

function getVal(dv: DataView, o: number, type: string): number | bigint {
  switch (type) {
    case 'byte': return dv.getInt8(o);
    case 'char': case 'ubyte': return dv.getUint8(o);
    case 'short': return dv.getInt16(o);
    case 'ushort': return dv.getUint16(o);
    case 'int': return dv.getInt32(o);
    case 'uint': return dv.getUint32(o);
    case 'float': return dv.getFloat32(o);
    case 'double': return dv.getFloat64(o);
    case 'int64': return dv.getBigInt64(o);
    case 'uint64': return dv.getBigUint64(o);
  }
  throw new Error(`Unknown type ${type}`);
}
const attrText = (a: Attr) => (typeof a.value === 'string' ? a.value : a.value.map((v) => (a.type === 'float' ? f32(Number(v)) : String(v))).join(', '));

/** Read a NetCDF classic / 64-bit offset / 64-bit data header. */
export function readNetcdf(b: Uint8Array): NcFile {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (latin1.decode(b.subarray(0, 3)) !== 'CDF') throw new Error('This is not a NetCDF classic file (it does not start with CDF).');
  const version = b[3] as 1 | 2 | 5;
  if (![1, 2, 5].includes(version)) throw new Error(`Unknown NetCDF version byte ${b[3]}.`);
  let p = 4;
  const big = version === 5;
  const u32 = () => { const v = dv.getUint32(p); p += 4; return v; };
  const u64 = () => { const v = dv.getBigUint64(p); p += 8; if (v > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('A size in the header is too large.'); return Number(v); };
  const nonneg = () => (big ? u64() : u32());
  const offset = () => (version === 1 ? u32() : u64());
  const name = () => { const n = nonneg(); if (p + n > b.length) throw new RangeError(); const s = utf8.decode(b.subarray(p, p + n)); p += pad4(n); return s; };
  const attrs = (): Attr[] => {
    const tag = u32(), n = nonneg();
    if (tag === 0 && n === 0) return [];
    if (tag !== 0x0c) throw new Error('The attribute list in the header is damaged.');
    const out: Attr[] = [];
    for (let i = 0; i < n; i++) {
      const nm = name(), code = u32(), cnt = nonneg(), t = NC_TYPES[code];
      if (!t) throw new Error(`Attribute ${nm} has an unknown type (${code}).`);
      const bytes = cnt * t[1];
      if (p + bytes > b.length) throw new RangeError();
      let value: Attr['value'];
      if (t[0] === 'char') value = utf8.decode(b.subarray(p, p + bytes)).replace(/\0+$/, '');
      else if (t[0] === 'int64' || t[0] === 'uint64') value = Array.from({ length: cnt }, (_, k) => getVal(dv, p + k * 8, t[0]) as bigint);
      else value = Array.from({ length: cnt }, (_, k) => getVal(dv, p + k * t[1], t[0]) as number);
      p += pad4(bytes);
      out.push({ name: nm, type: t[0], value });
    }
    return out;
  };
  try {
    let numrecs: number;
    const raw = big ? dv.getBigUint64(p) : BigInt(dv.getUint32(p));
    p += big ? 8 : 4;
    const streaming = raw === (big ? 0xffffffffffffffffn : 0xffffffffn);
    numrecs = streaming ? -1 : Number(raw);
    const dims: NcFile['dims'] = [];
    { const tag = u32(), n = nonneg();
      if (!(tag === 0 && n === 0)) {
        if (tag !== 0x0a) throw new Error('The dimension list in the header is damaged.');
        for (let i = 0; i < n; i++) { const nm = name(), size = nonneg(); dims.push({ name: nm, size, unlimited: size === 0 }); }
      } }
    const gatts = attrs();
    const vars: NcVar[] = [];
    { const tag = u32(), n = nonneg();
      if (!(tag === 0 && n === 0)) {
        if (tag !== 0x0b) throw new Error('The variable list in the header is damaged.');
        for (let i = 0; i < n; i++) {
          const nm = name(), nd = nonneg(), dimids = Array.from({ length: nd }, () => nonneg());
          if (dimids.some((d) => d >= dims.length)) throw new Error(`Variable ${nm} uses a dimension that is not in the file.`);
          const va = attrs(), code = u32(), t = NC_TYPES[code];
          if (!t) throw new Error(`Variable ${nm} has an unknown type (${code}).`);
          const vsize = nonneg(), begin = offset();
          vars.push({ name: nm, dimids, attrs: va, type: t[0], size: t[1], begin, record: nd > 0 && dims[dimids[0]].unlimited });
          void vsize; // recomputed below: vsize is not reliable for variables over 4 GiB
        }
      } }
    const slab = (v: NcVar) => v.size * prod(v.dimids.slice(v.record ? 1 : 0).map((d) => dims[d].size));
    const rec = vars.filter((v) => v.record);
    // One record variable: records are not padded; otherwise each variable's part of a record is padded to 4 bytes.
    const recsize = rec.length === 1 ? slab(rec[0]) : rec.reduce((s, v) => s + pad4(slab(v)), 0);
    if (streaming) numrecs = rec.length && recsize ? Math.floor((b.length - Math.min(...rec.map((v) => v.begin))) / recsize) : 0;
    for (const d of dims) if (d.unlimited) d.size = numrecs;
    return { version, numrecs, dims, attrs: gatts, vars, recsize };
  } catch (e) {
    if (e instanceof RangeError) throw new Error('The file ends in the middle of its header. It may be cut off, or it is not a NetCDF file.');
    throw e;
  }
}

/** Every value of a NetCDF variable, flat, slowest dimension first. */
export function ncValues(b: Uint8Array, f: NcFile, v: NcVar): (number | bigint)[] {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const shape = v.dimids.map((d) => f.dims[d].size);
  const n = prod(shape), out: (number | bigint)[] = new Array(n);
  if (v.record) {
    const per = prod(shape.slice(1));
    for (let r = 0; r < shape[0]; r++) {
      const base = v.begin + r * f.recsize;
      if (base + per * v.size > b.length) throw new Error(`The file is shorter than its header says (variable ${v.name}, record ${r + 1}). It may be cut off.`);
      for (let i = 0; i < per; i++) out[r * per + i] = getVal(dv, base + i * v.size, v.type);
    }
  } else {
    if (v.begin + n * v.size > b.length) throw new Error(`The file is shorter than its header says (variable ${v.name}). It may be cut off.`);
    for (let i = 0; i < n; i++) out[i] = getVal(dv, v.begin + i * v.size, v.type);
  }
  return out;
}

function ncDataset(b: Uint8Array): Reader {
  const f = readNetcdf(b);
  const label = { 1: 'NetCDF classic (CDF-1)', 2: 'NetCDF 64-bit offset (CDF-2)', 5: 'NetCDF 64-bit data (CDF-5)' }[f.version];
  const shapeOf = (v: NcVar) => v.dimids.map((d) => f.dims[d].size);
  const items: Item[] = f.vars.map((v) => {
    const shape = shapeOf(v), dims = v.dimids.map((d) => f.dims[d].name);
    return {
      name: v.name, kind: 'variable', type: v.type, dims, shape, attrs: v.attrs.map((a) => [a.name, attrText(a)] as [string, string]),
      note: v.type === 'char' && shape.length ? `Text: the last dimension (${dims[dims.length - 1]}) is the string length.` : undefined,
    };
  });
  const attr = (v: NcVar, k: string) => v.attrs.find((a) => a.name === k);
  const numAttr = (v: NcVar, k: string) => { const a = attr(v, k); return a && typeof a.value !== 'string' && a.value.length ? a.value : null; };
  // Values as cells: char variables joined into strings; scale_factor/add_offset applied and fill values blanked when asked.
  const cells = (i: number, o: Options): { cells: Cell[]; shape: number[]; dims: string[]; float32: boolean } => {
    const v = f.vars[i], shape = shapeOf(v), dims = v.dimids.map((d) => f.dims[d].name);
    tooBig(prod(shape), o.maxValues ?? MAX_VALUES);
    const raw = ncValues(b, f, v);
    if (v.type === 'char') {
      const len = shape.length ? shape[shape.length - 1] : 1, outer = shape.length ? shape.slice(0, -1) : [];
      const strs: Cell[] = [];
      for (let k = 0; k < raw.length; k += len) strs.push(utf8.decode(Uint8Array.from(raw.slice(k, k + len) as number[])).replace(/\0.*$/s, ''));
      return { cells: strs, shape: outer, dims: dims.slice(0, -1), float32: false };
    }
    if (!o.scale) return { cells: raw, shape, dims, float32: v.type === 'float' };
    const fills = [numAttr(v, '_FillValue'), numAttr(v, 'missing_value')].filter(Boolean).flatMap((a) => a as (number | bigint)[]);
    if (!attr(v, '_FillValue') && NC_FILL[v.type] !== undefined && v.type !== 'byte' && v.type !== 'ubyte') fills.push(NC_FILL[v.type]);
    const sf = numAttr(v, 'scale_factor'), ao = numAttr(v, 'add_offset');
    const scaled = !!(sf || ao);
    const s = sf ? Number(sf[0]) : 1, a0 = ao ? Number(ao[0]) : 0;
    const isFill = (x: number | bigint) => fills.some((fv) => (typeof x === typeof fv ? (typeof fv === 'number' && Number.isNaN(fv) ? Number.isNaN(x as number) : x === fv) : Number(x) === Number(fv)));
    // As NumPy (netCDF4-python, xarray) does it: packed 8- and 16-bit integers with float (32-bit) scale_factor and
    // add_offset unpack to 32-bit floats; anything else unpacks at double precision.
    const single = scaled && v.size <= 2 && [attr(v, 'scale_factor'), attr(v, 'add_offset')].every((a) => !a || a.type === 'float');
    const out = raw.map((x) => (isFill(x) ? null : !scaled ? x : single ? Math.fround(Math.fround(Number(x) * s) + a0) : Number(x) * s + a0));
    return { cells: out, shape, dims, float32: (v.type === 'float' && !scaled) || single };
  };
  // The values of the 1-D variable named after a dimension (a coordinate variable), or 0, 1, 2 ...
  const coord = (dim: string, o: Options): { cells: Cell[]; float32: boolean } | null => {
    const k = f.vars.findIndex((v) => v.name === dim && v.dimids.length === 1 && f.dims[v.dimids[0]].name === dim);
    return k >= 0 ? cells(k, o) : null;
  };
  const table = (i: number, o: Options): string[][] => {
    const c = cells(i, o), n = c.cells.length;
    const coords = c.dims.map((d, j) => coord(d, o) ?? { cells: Array.from({ length: c.shape[j] }, (_, k) => k), float32: false });
    const name = f.vars[i].name;
    if (o.layout === 'grid' && c.shape.length === 2) {
      const [ny, nx] = c.shape;
      return [[`${c.dims[0]} \\ ${c.dims[1]}`, ...coords[1].cells.map((x) => cellText(x, coords[1].float32))],
        ...Array.from({ length: ny }, (_, y) => [cellText(coords[0].cells[y], coords[0].float32), ...Array.from({ length: nx }, (_, x) => cellText(c.cells[y * nx + x], c.float32))])];
    }
    if (o.layout === 'grid' && c.shape.length !== 2) throw new Error(`The grid layout is for variables with two dimensions; ${name} has ${c.shape.length}. Use one row per value instead.`);
    const rows: string[][] = [[...c.dims, name]];
    const strides = c.shape.map((_, j) => prod(c.shape.slice(j + 1)));
    for (let k = 0; k < n; k++) rows.push([...c.shape.map((s, j) => cellText(coords[j].cells[Math.floor(k / strides[j]) % s], coords[j].float32)), cellText(c.cells[k], c.float32)]);
    return rows;
  };
  const json = (i: number, o: Options) => {
    const v = f.vars[i], c = cells(i, o);
    return { name: v.name, type: v.type, dimensions: c.dims, shape: c.shape, attributes: Object.fromEntries(v.attrs.map((a) => [a.name, typeof a.value === 'string' ? a.value : a.value.length === 1 ? cellJson(a.value[0], a.type === 'float') : a.value.map((x) => cellJson(x, a.type === 'float'))])), data: nest(c.cells.map((x) => cellJson(x, c.float32)), c.shape) };
  };
  const notes: string[] = [];
  if (f.numrecs >= 0 && f.dims.some((d) => d.unlimited)) notes.push(`${f.numrecs} record${f.numrecs === 1 ? '' : 's'} along the unlimited dimension.`);
  return { ds: { format: label, dims: f.dims, globals: f.attrs.map((a) => [a.name, attrText(a)]), items, notes }, table, json };
}

// ---------- NetCDF writer (classic or 64-bit offset), for examples and tests ----------
export type NcSpec = {
  version?: 1 | 2;
  dims: { name: string; size: number }[]; // size 0 = unlimited (give numrecs)
  numrecs?: number;
  attrs?: { name: string; type: string; value: string | number[] }[];
  vars: { name: string; dims: string[]; type: string; attrs?: { name: string; type: string; value: string | number[] }[]; data: number[] | string }[];
};
export function writeNetcdf(s: NcSpec): Uint8Array {
  const ver = s.version ?? 1, enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  let len = 0;
  const push = (u: Uint8Array) => { parts.push(u); len += u.length; };
  const i32 = (n: number) => { const u = new Uint8Array(4); new DataView(u.buffer).setUint32(0, n); push(u); };
  const off = (n: number) => { if (ver === 1) i32(n); else { const u = new Uint8Array(8); new DataView(u.buffer).setBigUint64(0, BigInt(n)); push(u); } };
  const bytesPad = (u: Uint8Array) => { push(u); if (u.length % 4) push(new Uint8Array(4 - (u.length % 4))); };
  const name = (t: string) => { const u = enc.encode(t); i32(u.length); bytesPad(u); };
  const values = (type: string, data: number[] | string): Uint8Array => {
    if (type === 'char') return typeof data === 'string' ? enc.encode(data) : Uint8Array.from(data);
    const sz = NC_TYPES[NC_CODE[type]][1], u = new Uint8Array(sz * data.length), dv = new DataView(u.buffer);
    (data as number[]).forEach((x, k) => {
      const o = k * sz;
      switch (type) { case 'byte': dv.setInt8(o, x); break; case 'short': dv.setInt16(o, x); break; case 'int': dv.setInt32(o, x); break; case 'float': dv.setFloat32(o, x); break; case 'double': dv.setFloat64(o, x); break; default: throw new Error(`Cannot write ${type}`); }
    });
    return u;
  };
  const attrs = (a: NcSpec['attrs']) => {
    if (!a?.length) { i32(0); i32(0); return; }
    i32(0x0c); i32(a.length);
    for (const x of a) { name(x.name); i32(NC_CODE[x.type]); const u = values(x.type, x.value); i32(x.type === 'char' ? u.length : (x.value as number[]).length); bytesPad(u); }
  };
  const dimIdx = (n: string) => { const k = s.dims.findIndex((d) => d.name === n); if (k < 0) throw new Error(`No dimension ${n}`); return k; };
  const numrecs = s.numrecs ?? 0;
  const isRec = (v: NcSpec['vars'][0]) => v.dims.length > 0 && s.dims[dimIdx(v.dims[0])].size === 0;
  const slab = (v: NcSpec['vars'][0]) => NC_TYPES[NC_CODE[v.type]][1] * prod(v.dims.slice(isRec(v) ? 1 : 0).map((d) => s.dims[dimIdx(d)].size));
  const recVars = s.vars.filter(isRec);
  const recsize = recVars.length === 1 ? slab(recVars[0]) : recVars.reduce((t, v) => t + pad4(slab(v)), 0);
  const header = (begins: number[]) => {
    parts.length = 0; len = 0;
    push(enc.encode('CDF')); push(Uint8Array.of(ver)); i32(numrecs);
    if (s.dims.length) { i32(0x0a); i32(s.dims.length); for (const d of s.dims) { name(d.name); i32(d.size); } } else { i32(0); i32(0); }
    attrs(s.attrs);
    if (s.vars.length) {
      i32(0x0b); i32(s.vars.length);
      s.vars.forEach((v, k) => { name(v.name); i32(v.dims.length); v.dims.forEach((d) => i32(dimIdx(d))); attrs(v.attrs); i32(NC_CODE[v.type]); i32(pad4(slab(v))); off(begins[k]); });
    } else { i32(0); i32(0); }
    return len;
  };
  const hlen = header(s.vars.map(() => 0));
  const begins: number[] = [];
  let pos = hlen;
  s.vars.forEach((v, k) => { if (!isRec(v)) { begins[k] = pos; pos += pad4(slab(v)); } });
  const recStart = pos;
  let rp = recStart;
  s.vars.forEach((v, k) => { if (isRec(v)) { begins[k] = rp; rp += recVars.length === 1 ? slab(v) : pad4(slab(v)); } });
  header(begins);
  const total = recStart + numrecs * recsize;
  const out = new Uint8Array(Math.max(total, pos));
  let at = 0;
  for (const u of parts) { out.set(u, at); at += u.length; }
  s.vars.forEach((v, k) => {
    const u = values(v.type, v.data);
    if (!isRec(v)) { if (u.length !== slab(v)) throw new Error(`${v.name}: expected ${slab(v)} bytes, got ${u.length}`); out.set(u, begins[k]); return; }
    const per = slab(v);
    if (u.length !== per * numrecs) throw new Error(`${v.name}: expected ${per * numrecs} bytes, got ${u.length}`);
    for (let r = 0; r < numrecs; r++) out.set(u.subarray(r * per, (r + 1) * per), begins[k] + r * recsize);
  });
  return out;
}

/** A small made-up NetCDF file: 3 days of a 4 × 5 temperature grid, packed as short integers. */
export function exampleNetcdf(): Uint8Array {
  const lat = [40, 42.5, 45, 47.5], lon = [-80, -77.5, -75, -72.5, -70], time = [0, 1, 2];
  const temp: number[] = [];
  for (const t of time) for (const la of lat) for (const lo of lon) temp.push(Math.round((20 - 0.8 * (la - 40) + 0.3 * (lo + 80) + 1.5 * t) * 100 - 1500));
  temp[7] = -32767; // one missing value
  return writeNetcdf({
    dims: [{ name: 'time', size: 0 }, { name: 'lat', size: 4 }, { name: 'lon', size: 5 }, { name: 'nchar', size: 8 }],
    numrecs: 3,
    attrs: [{ name: 'title', type: 'char', value: 'Example surface temperature (made-up data)' }, { name: 'Conventions', type: 'char', value: 'CF-1.8' }, { name: 'source', type: 'char', value: 'fibub example, not real measurements' }],
    vars: [
      { name: 'time', dims: ['time'], type: 'double', attrs: [{ name: 'units', type: 'char', value: 'days since 2026-01-01' }, { name: 'standard_name', type: 'char', value: 'time' }], data: time },
      { name: 'lat', dims: ['lat'], type: 'float', attrs: [{ name: 'units', type: 'char', value: 'degrees_north' }], data: lat },
      { name: 'lon', dims: ['lon'], type: 'float', attrs: [{ name: 'units', type: 'char', value: 'degrees_east' }], data: lon },
      { name: 'temperature', dims: ['time', 'lat', 'lon'], type: 'short', attrs: [{ name: 'long_name', type: 'char', value: 'Air temperature at 2 m' }, { name: 'units', type: 'char', value: 'degC' }, { name: 'scale_factor', type: 'float', value: [0.01] }, { name: 'add_offset', type: 'float', value: [15] }, { name: '_FillValue', type: 'short', value: [-32767] }], data: temp },
      { name: 'station', dims: ['nchar'], type: 'char', attrs: [{ name: 'long_name', type: 'char', value: 'Grid name' }], data: 'GRID-A\0\0' },
    ],
  });
}

// ---------- FITS ----------
const BLOCK = 2880;
type Col = { name: string; form: string; code: string; repeat: number; width: number; offset: number; unit: string; scale: number; zero: number; tnull: string | undefined; dispW?: number; tbcol?: number };
const BIN_W: Record<string, number> = { L: 1, B: 1, I: 2, J: 4, K: 8, A: 1, E: 4, D: 8, C: 8, M: 16, P: 8, Q: 16 };
const BIN_T: Record<string, string> = { L: 'logical', X: 'bits', B: 'uint8', I: 'int16', J: 'int32', K: 'int64', A: 'text', E: 'float32', D: 'float64', C: 'complex64', M: 'complex128' };

function fitsDataset(b: Uint8Array): Reader {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  type Hdu = { h: Header; start: number; bytes: number; item?: Item; read?: (o: Options) => { head: string[]; rows: Cell[][]; f32: boolean[]; shape?: number[] } };
  const hdus: Hdu[] = [];
  const notes: string[] = [];
  let off = 0;
  while (off + BLOCK <= b.length) {
    const h = parseHeader(b, off);
    if (!h) { if (off === 0) throw new Error('This is not a FITS file (it does not start with SIMPLE).'); notes.push('The file ends in the middle of a header; the rest was skipped.'); break; }
    const bitpix = h.num('BITPIX') ?? 8, naxis = h.num('NAXIS') ?? 0;
    const ax = Array.from({ length: naxis }, (_, i) => h.num(`NAXIS${i + 1}`) ?? 0);
    const pcount = h.num('PCOUNT') ?? 0, gcount = h.num('GCOUNT') ?? 1;
    const bytes = naxis ? (Math.abs(bitpix) / 8) * gcount * (pcount + prod(ax)) : 0;
    const start = off + h.bytes;
    hdus.push({ h, start, bytes });
    off = start + Math.ceil(bytes / BLOCK) * BLOCK;
    if (start + bytes > b.length) { notes.push(`HDU ${hdus.length - 1} is cut off: the file is shorter than its header says.`); break; }
  }
  const card = (h: Header): [string, string][] => h.cards.filter((c) => c.key && !['END'].includes(c.key)).map((c) => [c.key, c.value + (c.comment ? (c.value ? ' / ' : '') + c.comment : '')]);
  const items: Item[] = [], readers: NonNullable<Hdu['read']>[] = [], hdrs: Header[] = [];
  hdus.forEach((u, k) => {
    const h = u.h, xt = (h.get('XTENSION') ?? '').toUpperCase(), naxis = h.num('NAXIS') ?? 0;
    const ax = Array.from({ length: naxis }, (_, i) => h.num(`NAXIS${i + 1}`) ?? 0);
    const extname = h.get('EXTNAME');
    const label = (kind: string) => `HDU ${k}${extname ? ` ${extname}` : k === 0 ? ' (primary)' : ''}: ${kind}`;
    if (u.start + u.bytes > b.length) return;
    if (h.get('ZIMAGE') === 'T') { notes.push(`HDU ${k} is a tile-compressed image (fpack); unpack it with funpack first.`); return; }
    if ((!xt || xt === 'IMAGE') && naxis > 0 && ax.every((a) => a > 0) && !(k === 0 && h.get('GROUPS') === 'T')) {
      const bitpix = h.num('BITPIX')!, bp = Math.abs(bitpix) / 8, n = prod(ax);
      const bs = h.num('BSCALE') ?? 1, bz = h.num('BZERO') ?? 0, blank = h.get('BLANK');
      const type = { 8: 'uint8', 16: 'int16', 32: 'int32', 64: 'int64', [-32]: 'float32', [-64]: 'float64' }[bitpix] ?? `BITPIX ${bitpix}`;
      const unsigned = bs === 1 && ((bitpix === 16 && bz === 32768) || (bitpix === 32 && bz === 2147483648) || (bitpix === 8 && bz === -128));
      const dims = ax.map((_, i) => `NAXIS${i + 1}`).reverse(), shape = [...ax].reverse();
      hdrs.push(h);
      items.push({ name: label('image'), kind: 'image', type: unsigned ? `${type} (stored with BZERO ${bz}, so ${bitpix === 8 ? 'int8' : `uint${bitpix}`})` : type, dims, shape, attrs: card(h), note: 'Pixels are numbered from 1, as FITS does: x along NAXIS1, y along NAXIS2. Row y = 1 comes first.' });
      readers.push((o) => {
        tooBig(n, o.maxValues ?? MAX_VALUES);
        const vals: Cell[] = new Array(n), bl = blank !== undefined ? BigInt(blank) : null;
        for (let i = 0; i < n; i++) {
          const p = u.start + i * bp;
          let v: number | bigint;
          switch (bitpix) { case 8: v = dv.getUint8(p); break; case 16: v = dv.getInt16(p); break; case 32: v = dv.getInt32(p); break; case 64: v = dv.getBigInt64(p); break; case -32: v = dv.getFloat32(p); break; case -64: v = dv.getFloat64(p); break; default: throw new Error(`Unsupported BITPIX ${bitpix}.`); }
          if (bitpix > 0 && bl !== null && BigInt(v) === bl) { vals[i] = o.scale ? null : v; continue; }
          if (!o.scale || (bs === 1 && bz === 0)) { vals[i] = v; continue; }
          vals[i] = bitpix === 64 && bs === 1 && Number.isInteger(bz) ? (v as bigint) + BigInt(bz) : Number(v) * bs + bz;
        }
        const isF32 = bitpix === -32 && (!o.scale || (bs === 1 && bz === 0));
        return { head: [], rows: [vals], f32: [isF32], shape };
      });
      return;
    }
    if (xt === 'BINTABLE' || xt === 'TABLE') {
      const rowLen = ax[0], nrows = ax[1] ?? 0, nf = h.num('TFIELDS') ?? 0, heap = u.start + (h.num('THEAP') ?? rowLen * nrows);
      const cols: Col[] = [];
      let pos = 0;
      for (let j = 1; j <= nf; j++) {
        const form = (h.get(`TFORM${j}`) ?? '').trim().toUpperCase();
        const base = { name: h.get(`TTYPE${j}`)?.trim() || `col${j}`, form, unit: h.get(`TUNIT${j}`)?.trim() ?? '', scale: h.num(`TSCAL${j}`) ?? 1, zero: h.num(`TZERO${j}`) ?? 0, tnull: h.get(`TNULL${j}`)?.trim() };
        if (xt === 'TABLE') {
          const m = form.match(/^([AIFED])(\d+)(?:\.(\d+))?$/);
          if (!m) throw new Error(`Column ${j} has a format FITS ASCII tables do not allow (${form}).`);
          cols.push({ ...base, code: m[1], repeat: 1, width: Number(m[2]), offset: (h.num(`TBCOL${j}`) ?? 1) - 1 });
        } else {
          const m = form.match(/^(\d*)([LXBIJKAEDCMPQ])(.*)$/);
          if (!m) throw new Error(`Column ${j} has a format this page does not know (${form}).`);
          const r = m[1] === '' ? 1 : Number(m[1]), code = m[2];
          const width = code === 'X' ? Math.ceil(r / 8) : (code === 'P' || code === 'Q' ? BIN_W[code] * (r ? 1 : 0) : BIN_W[code] * r);
          const col: Col = { ...base, code, repeat: r, width, offset: pos };
          if (code === 'P' || code === 'Q') col.form = form;
          cols.push(col); pos += width;
        }
      }
      const vtype = (c: Col) => (xt === 'TABLE' ? { A: 'text', I: 'integer', F: 'real', E: 'real', D: 'real' }[c.code]! : c.code === 'P' || c.code === 'Q' ? `variable-length ${BIN_T[c.form.match(/^\d*[PQ]([A-Z])/)?.[1] ?? 'E'] ?? ''}` : BIN_T[c.code]);
      const scaledType = (c: Col) => (c.scale === 1 && c.code === 'I' && c.zero === 32768 ? 'uint16' : c.scale === 1 && c.code === 'J' && c.zero === 2147483648 ? 'uint32' : c.scale === 1 && c.code === 'K' && c.zero === 9223372036854775808 ? 'uint64' : c.scale === 1 && c.code === 'B' && c.zero === -128 ? 'int8' : '');
      hdrs.push(h);
      items.push({
        name: label(xt === 'TABLE' ? 'ASCII table' : 'binary table'), kind: 'table', type: 'table', dims: [], shape: [nrows],
        columns: cols.map((c) => ({ name: c.name, type: (c.code === 'A' && xt === 'BINTABLE' ? `text (${c.repeat} characters)` : (scaledType(c) || vtype(c)) + (c.repeat > 1 && c.code !== 'A' && c.code !== 'X' ? ` × ${c.repeat}` : '')) + (c.scale !== 1 || (c.zero !== 0 && !scaledType(c)) ? ` (scaled ×${c.scale} +${c.zero})` : ''), unit: c.unit, repeat: c.code === 'A' || c.code === 'P' || c.code === 'Q' ? 1 : c.repeat })),
        attrs: card(h),
      });
      readers.push((o) => {
        tooBig(nrows * Math.max(1, cols.length), o.maxValues ?? MAX_VALUES);
        const rows: Cell[][] = [];
        const num1 = (code: string, p: number): number | bigint => {
          switch (code) { case 'B': return dv.getUint8(p); case 'I': return dv.getInt16(p); case 'J': return dv.getInt32(p); case 'K': return dv.getBigInt64(p); case 'E': return dv.getFloat32(p); case 'D': return dv.getFloat64(p); }
          throw new Error(code);
        };
        const scaleV = (c: Col, v: number | bigint, raw: string): Cell => {
          if (c.tnull !== undefined && raw === c.tnull) return o.scale ? null : v;
          if (!o.scale || (c.scale === 1 && c.zero === 0)) return v;
          if (typeof v === 'bigint' && c.scale === 1) return v + BigInt(c.zero === 9223372036854775808 ? '9223372036854775808' : Math.round(c.zero));
          return Number(v) * c.scale + c.zero;
        };
        const readArr = (code: string, p: number, n: number, c: Col): Cell[] => {
          const out: Cell[] = [];
          const w = BIN_W[code] ?? 1;
          for (let q = 0; q < n; q++) {
            const at = p + q * w;
            if (code === 'L') { const ch = b[at]; out.push(ch === 84 ? true : ch === 70 ? false : null); }
            else if (code === 'C' || code === 'M') {
              // Complex numbers as text such as 1+2j (Python's notation), so they stay one value in CSV and JSON.
              const re = code === 'C' ? dv.getFloat32(at) : dv.getFloat64(at), im = code === 'C' ? dv.getFloat32(at + 4) : dv.getFloat64(at + 8);
              const t = (x: number) => (code === 'C' ? f32(x) : String(x));
              out.push(`${t(re)}${im < 0 || Object.is(im, -0) ? '-' : '+'}${t(Math.abs(im))}j`);
            }
            else { const v = num1(code, at); out.push(code === 'E' || code === 'D' ? (o.scale && (c.scale !== 1 || c.zero !== 0) ? Number(v) * c.scale + c.zero : v) : scaleV(c, v, String(v))); }
          }
          return out;
        };
        for (let r = 0; r < nrows; r++) {
          const rp = u.start + r * rowLen, row: Cell[] = [];
          for (const c of cols) {
            const p = rp + c.offset;
            if (xt === 'TABLE') {
              const s = latin1.decode(b.subarray(p, p + c.width));
              if (c.code === 'A') { row.push(s.replace(/\s+$/, '')); continue; }
              const t = s.trim();
              if (c.tnull !== undefined && t === c.tnull.trim()) { row.push(o.scale ? null : t); continue; }
              if (t === '') { row.push(null); continue; }
              const v = Number(t.replace(/D/i, 'E'));
              row.push(o.scale && (c.scale !== 1 || c.zero !== 0) ? v * c.scale + c.zero : v);
              continue;
            }
            if (c.code === 'A') { row.push(latin1.decode(b.subarray(p, p + c.repeat)).replace(/[\0 ]+$/, '').replace(/\0.*$/s, '')); continue; }
            if (c.code === 'X') { let bits = ''; for (let q = 0; q < c.repeat; q++) bits += (b[p + (q >> 3)] >> (7 - (q & 7))) & 1; row.push(bits); continue; }
            if (c.code === 'P' || c.code === 'Q') {
              const n = c.code === 'P' ? dv.getInt32(p) : Number(dv.getBigInt64(p)), o2 = c.code === 'P' ? dv.getInt32(p + 4) : Number(dv.getBigInt64(p + 8));
              const sub = c.form.match(/^\d*[PQ]([A-Z])/)?.[1] ?? 'E';
              if (sub === 'A') { row.push(latin1.decode(b.subarray(heap + o2, heap + o2 + n)).replace(/[\0 ]+$/, '')); continue; }
              row.push(readArr(sub, heap + o2, n, c));
              continue;
            }
            const arr = readArr(c.code, p, c.repeat, c);
            row.push(c.repeat === 1 ? arr[0] : arr);
          }
          rows.push(row);
        }
        const f32s = cols.map((c) => (c.code === 'E' || c.code === 'C' || (c.form.match(/^\d*[PQ]([EC])/) != null)) && !(o.scale && (c.scale !== 1 || c.zero !== 0)));
        return { head: cols.map((c) => c.name), rows, f32: f32s };
      });
    }
  });
  const primary = hdus[0]?.h;
  const tableOf = (i: number, o: Options): string[][] => {
    const it = items[i], r = readers[i](o);
    if (it.kind === 'image') {
      const vals = r.rows[0], shape = r.shape!, fl = r.f32[0];
      if (o.layout === 'grid' && shape.length === 2) {
        const [ny, nx] = shape;
        return [['y \\ x', ...Array.from({ length: nx }, (_, x) => String(x + 1))], ...Array.from({ length: ny }, (_, y) => [String(y + 1), ...Array.from({ length: nx }, (_, x) => cellText(vals[y * nx + x], fl))])];
      }
      if (o.layout === 'grid') throw new Error(`The grid layout is for images with two axes; this one has ${shape.length}. Use one row per value instead.`);
      const names = ['x', 'y', 'z', 'axis4', 'axis5', 'axis6'].slice(0, shape.length);
      const rows: string[][] = [[...names, 'value']];
      const ax = [...shape].reverse(); // NAXIS1 first
      for (let k = 0; k < vals.length; k++) { const idx: string[] = []; let rem = k; for (const a of ax) { idx.push(String((rem % a) + 1)); rem = Math.floor(rem / a); } rows.push([...idx, cellText(vals[k], fl)]); }
      return rows;
    }
    // Tables: a repeated column (vector) is split into name_1, name_2 ... when it has up to 50 values.
    const cols = it.columns!;
    const head: string[] = [];
    cols.forEach((c) => { if (c.repeat > 1 && c.repeat <= 50 && !/bits/.test(c.type)) for (let q = 1; q <= c.repeat; q++) head.push(`${c.name}_${q}`); else head.push(c.name); });
    const rows = r.rows.map((row) => row.flatMap((v, j) => (cols[j].repeat > 1 && cols[j].repeat <= 50 && Array.isArray(v) && !/bits/.test(cols[j].type) ? v.map((x) => cellText(x, r.f32[j])) : [cellText(v, r.f32[j])])));
    return [head, ...rows];
  };
  const jsonOf = (i: number, o: Options) => {
    const it = items[i], r = readers[i](o);
    const header = headerJson(hdrs[i]);
    if (it.kind === 'image') return { name: it.name, type: it.type, shape: r.shape, header, data: nest(r.rows[0].map((v) => cellJson(v, r.f32[0])), r.shape!) };
    return { name: it.name, columns: it.columns, header, rows: r.rows.map((row) => Object.fromEntries(row.map((v, j) => [r.head[j], cellJson(v, r.f32[j])]))) };
  };
  const nTables = items.filter((x) => x.kind === 'table').length, nImages = items.length - nTables;
  notes.unshift(`${hdus.length} HDU${hdus.length === 1 ? '' : 's'}: ${nImages} image${nImages === 1 ? '' : 's'} and ${nTables} table${nTables === 1 ? '' : 's'} with data.`);
  return { ds: { format: 'FITS', dims: [], globals: primary ? card(primary) : [], items, notes }, table: tableOf, json: jsonOf };
}

/** FITS header cards as a JSON object: numbers as numbers, T/F as true/false; COMMENT and HISTORY as lists. */
function headerJson(h: Header): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of h.cards) {
    if (!c.key) continue;
    if (c.key === 'COMMENT' || c.key === 'HISTORY') { ((out[c.key] ??= []) as string[]).push(c.comment); continue; }
    if (c.key in out) continue;
    const v = c.value, n = Number(v.replace(/D/i, 'E'));
    out[c.key] = v === 'T' ? true : v === 'F' ? false : v !== '' && Number.isFinite(n) && /^[+-]?[\d.]/.test(v) ? n : v;
  }
  return out;
}

// ---------- tables (CSV, Excel) ----------
function guessType(vals: string[]): string {
  const v = vals.filter((x) => x.trim() !== '');
  if (!v.length) return 'empty';
  if (v.every((x) => /^[+-]?\d+$/.test(x.trim()))) return 'integer';
  if (v.every((x) => Number.isFinite(Number(x.trim())))) return 'number';
  if (v.every((x) => /^\d{4}-\d{2}-\d{2}([T ][\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/.test(x.trim()))) return 'date';
  if (v.every((x) => /^(true|false)$/i.test(x.trim()))) return 'true/false';
  return 'text';
}
function tableDataset(sheets: { name: string; table: string[][] }[], format: string): Reader {
  const clean = sheets.map((s) => ({ name: s.name, table: s.table.filter((r) => r.some((c) => (c ?? '').trim() !== '')) })).filter((s) => s.table.length);
  if (!clean.length) throw new Error('The file has no data.');
  const items: Item[] = clean.map((s) => {
    const [head, ...rows] = s.table, w = Math.max(...s.table.map((r) => r.length));
    const names = Array.from({ length: w }, (_, j) => (head[j] ?? '').trim() || `column${j + 1}`);
    return { name: s.name, kind: 'table', type: 'table', dims: [], shape: [rows.length], columns: names.map((n, j) => ({ name: n, type: guessType(rows.map((r) => r[j] ?? '')), unit: '', repeat: 1 })), attrs: [] };
  });
  const table = (i: number) => { const t = clean[i].table, w = items[i].columns!.length; return [items[i].columns!.map((c) => c.name), ...t.slice(1).map((r) => Array.from({ length: w }, (_, j) => r[j] ?? ''))]; };
  const json = (i: number) => {
    const cols = items[i].columns!;
    return table(i).slice(1).map((r) => Object.fromEntries(cols.map((c, j) => { const v = r[j]; return [c.name, v === '' ? null : (c.type === 'integer' || c.type === 'number') ? Number(v) : c.type === 'true/false' ? /^true$/i.test(v) : v]; })));
  };
  return { ds: { format, dims: [], globals: [], items, notes: clean.length < sheets.length ? ['Empty sheets were left out.'] : [] }, table, json };
}

/** Open a NetCDF or FITS file from its bytes. Throws a plain Error for other kinds. */
export function openBinary(b: Uint8Array): Reader {
  const k = sniff(b);
  if (k === 'netcdf') return ncDataset(b);
  if (k === 'fits') return fitsDataset(b);
  throw new Error(UNSUPPORTED[k] ?? UNSUPPORTED.unknown);
}
/** Open tables the page has already read (CSV text parsed, or Excel sheets). */
export const openTables = tableDataset;
export type { Reader };
