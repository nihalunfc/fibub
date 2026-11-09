// Flow cytometry FCS files: read the HEADER, TEXT and DATA segments of FCS 2.0, 3.0, 3.1 and 3.2 list-mode files
// (integers of 8 to 32 bits, 32-bit and 64-bit floats, or ASCII; either byte order), the spillover matrix and its
// compensation, axis scales (linear, log and arcsinh with a cofactor), 1D and 2D binning, gates (range, rectangle,
// polygon, quadrants) nested inside each other with counts and percentages, and a writer for FCS 3.1 files. A made-up
// example sample is drawn here too. No DOM.

export type Channel = {
  /** $PnN, the short name such as FSC-A. */ n: string;
  /** $PnS, the stain or marker, if any. */ s: string;
  bits: number; range: number;
  /** $PnE: decades and offset for log-amplified integer data ([0, 0] = linear). */ amp: [number, number];
  gain: number;
};
export type Spill = { names: string[]; idx: number[]; m: number[][]; key: string };
export type Fcs = {
  version: string; text: Record<string, string>; channels: Channel[]; events: number;
  /** One array per channel, in the file's own units (after $PnE for log-amplified integers). */ data: Float64Array[];
  datatype: 'I' | 'F' | 'D' | 'A'; byteOrder: string; spill: Spill | null; warnings: string[];
};

const ascii = (b: Uint8Array, a: number, z: number) => { let s = ''; for (let i = a; i < z && i < b.length; i++) s += String.fromCharCode(b[i]); return s; };
function decode(b: Uint8Array): string {
  try { return new TextDecoder('utf-8', { fatal: true }).decode(b); } catch { let s = ''; for (const c of b) s += String.fromCharCode(c); return s; }
}

/** Split a TEXT segment into keyword/value pairs. The first byte is the delimiter; a doubled delimiter is a literal one. */
export function parseText(seg: Uint8Array): Record<string, string> {
  const out: Record<string, string> = {};
  if (seg.length < 2) return out;
  const d = seg[0], toks: string[] = [];
  let cur: number[] = [];
  for (let i = 1; i < seg.length; i++) {
    if (seg[i] === d) {
      if (i + 1 < seg.length && seg[i + 1] === d) { cur.push(d); i++; continue; }
      toks.push(decode(Uint8Array.from(cur))); cur = [];
    } else cur.push(seg[i]);
  }
  if (cur.length && cur.some((c) => c > 32)) toks.push(decode(Uint8Array.from(cur)));
  for (let i = 0; i + 1 < toks.length; i += 2) {
    const k = toks[i].trim().toUpperCase();
    if (k && !(k in out)) out[k] = toks[i + 1].trim();
  }
  return out;
}

const int = (s: string | undefined) => { const v = Number(String(s ?? '').trim()); return Number.isFinite(v) ? Math.trunc(v) : NaN; };

/** Read an FCS file. Throws an Error with a plain-English message when the file cannot be read. */
export function parseFcs(buf: Uint8Array, opts: { maxEvents?: number } = {}): Fcs {
  if (buf.length < 58) throw new Error('This file is too short to be an FCS file.');
  const version = ascii(buf, 0, 6);
  if (!/^FCS[23]\.\d$/.test(version)) throw new Error('This is not an FCS file: it should start with "FCS2.0", "FCS3.0" or "FCS3.1".');
  const off = [10, 18, 26, 34, 42, 50].map((p) => int(ascii(buf, p, p + 8)) || 0);
  const [ts, te] = off; let [, , ds, de] = off;
  if (!(ts > 0 && te > ts && te < buf.length)) throw new Error('The HEADER does not point to a TEXT segment inside the file. The file may be damaged or cut short.');
  const text = parseText(buf.subarray(ts, te + 1));
  const warnings: string[] = [];
  // Supplemental TEXT (FCS 3.x), when it is somewhere else.
  const ss = int(text.$BEGINSTEXT), se = int(text.$ENDSTEXT);
  if (ss > 0 && se > ss && se < buf.length && (ss < ts || ss > te)) {
    const sup = parseText(buf.subarray(ss, se + 1));
    for (const [k, v] of Object.entries(sup)) if (!(k in text)) text[k] = v;
  }
  if (!ds && !de) { ds = int(text.$BEGINDATA) || 0; de = int(text.$ENDDATA) || 0; }
  const mode = (text.$MODE ?? 'L').toUpperCase();
  if (mode !== 'L') throw new Error(`This file stores histograms ($MODE ${mode}), not single events. Only list-mode files ($MODE L) can be plotted and gated.`);
  const P = int(text.$PAR);
  if (!(P >= 1 && P <= 1000)) throw new Error('The file does not say how many channels it has ($PAR).');
  const dt = (text.$DATATYPE ?? '').toUpperCase() as Fcs['datatype'];
  if (!['I', 'F', 'D', 'A'].includes(dt)) throw new Error(`Unknown data type $DATATYPE "${text.$DATATYPE ?? ''}". It should be I, F, D or A.`);
  const mixed = Object.keys(text).find((k) => /^\$P\d+DATATYPE$/.test(k) && text[k].toUpperCase() !== dt);
  if (mixed) throw new Error(`This FCS 3.2 file mixes data types (${mixed} ${text[mixed]}), which this page cannot read yet.`);
  const channels: Channel[] = [];
  for (let i = 1; i <= P; i++) {
    const bRaw = (text[`$P${i}B`] ?? '').trim();
    let bits = bRaw === '*' ? 0 : int(bRaw);
    if (dt === 'F') bits = 32; else if (dt === 'D') bits = 64;
    if (dt === 'I' && !(bits > 0 && bits % 8 === 0 && bits <= 32)) throw new Error(`Channel ${i} uses ${bRaw || 'no'} bits ($P${i}B). Integer channels of 8, 16, 24 or 32 bits can be read.`);
    const e = (text[`$P${i}E`] ?? '0,0').split(',').map((v) => Number(v.trim()));
    let amp: [number, number] = [Number.isFinite(e[0]) ? e[0] : 0, Number.isFinite(e[1]) ? e[1] : 0];
    if (amp[0] > 0 && amp[1] === 0) amp = [amp[0], 1];
    if (amp[0] > 0 && dt !== 'I') { warnings.push(`Channel ${i} says it is log-amplified ($P${i}E ${text[`$P${i}E`]}) but holds ${dt === 'A' ? 'text' : 'floats'}; the values are used as they are.`); amp = [0, 0]; }
    const g = Number(text[`$P${i}G`]);
    channels.push({ n: text[`$P${i}N`] || `P${i}`, s: text[`$P${i}S`] ?? '', bits, range: Number(text[`$P${i}R`]) || 0, amp, gain: Number.isFinite(g) && g > 0 ? g : 1 });
  }
  if (Number(text.$NEXTDATA) > 0) warnings.push('This file holds more than one data set; the first one is shown.');

  // Byte order.
  const bo = (text.$BYTEORD ?? '1,2,3,4').split(',').map((v) => int(v));
  const asc = bo.every((v, i) => v === i + 1), desc = bo.every((v, i) => v === bo.length - i);
  if (dt !== 'A' && !asc && !desc && !(bo.length === 4 && [...bo].sort().join() === '1,2,3,4')) throw new Error(`The byte order $BYTEORD "${text.$BYTEORD}" is not one this page knows.`);
  const little = asc || (!desc && bo[0] === 1);
  const byteOrder = asc ? 'little-endian' : desc ? 'big-endian' : `mixed (${bo.join(',')})`;

  if (!(ds > 0 && de >= ds)) throw new Error('The file does not say where its DATA segment is.');
  const avail = Math.min(de, buf.length - 1) - ds + 1;
  let n = int(text.$TOT);
  const perEvent = channels.reduce((t, c) => t + c.bits / 8, 0);
  if (dt !== 'A') {
    const fit = Math.floor(avail / perEvent);
    if (!(n >= 0)) { n = fit; warnings.push('The file does not give the number of events ($TOT); it was worked out from the DATA size.'); }
    if (n > fit) {
      if (de >= buf.length) throw new Error(`The file is cut short: it should hold ${n.toLocaleString('en')} events but has room for ${fit.toLocaleString('en')}. Copy it again from the cytometer.`);
      throw new Error(`The DATA segment holds ${fit.toLocaleString('en')} events, but $TOT says ${n.toLocaleString('en')}.`);
    }
  }
  const max = opts.maxEvents ?? Infinity;
  if (n > max) throw new Error(`This file has ${n.toLocaleString('en')} events. Up to ${max.toLocaleString('en')} can be opened on this page.`);

  const data: Float64Array[] = [];
  const dv = new DataView(buf.buffer, buf.byteOffset + ds, avail);
  if (dt === 'A') {
    const str = decode(buf.subarray(ds, ds + avail));
    if (channels.every((c) => c.bits === 0)) {
      const vals = str.split(/[\s,]+/).filter(Boolean).map(Number);
      if (!(n >= 0)) n = Math.floor(vals.length / P);
      if (vals.length < n * P) throw new Error('The ASCII DATA segment has fewer values than events × channels.');
      for (let c = 0; c < P; c++) { const a = new Float64Array(n); for (let e = 0; e < n; e++) a[e] = vals[e * P + c]; data.push(a); }
    } else {
      const w = channels.reduce((t, c) => t + c.bits, 0);
      if (!(n >= 0)) n = Math.floor(str.length / w);
      if (str.length < n * w) throw new Error('The ASCII DATA segment is shorter than events × the field widths.');
      for (let c = 0; c < P; c++) data.push(new Float64Array(n));
      for (let e = 0, p = 0; e < n; e++) for (let c = 0; c < P; c++) { data[c][e] = Number(str.slice(p, p + channels[c].bits)); p += channels[c].bits; }
    }
  } else {
    for (let c = 0; c < P; c++) data.push(new Float64Array(n));
    const width = channels.map((c) => c.bits / 8);
    const perm = !asc && !desc;
    const tmp = new DataView(new ArrayBuffer(8));
    const mask = channels.map((c) => { if (dt !== 'I' || !(c.range > 0)) return 0; const m = 2 ** Math.ceil(Math.log2(c.range)); return m < 2 ** c.bits ? m : 0; });
    let p = 0;
    for (let e = 0; e < n; e++) {
      for (let c = 0; c < P; c++) {
        const w = width[c]; let v: number;
        if (perm && w === bo.length) {
          for (let k = 0; k < w; k++) tmp.setUint8(bo[k] - 1, dv.getUint8(p + k));
          v = dt === 'F' ? tmp.getFloat32(0, true) : dt === 'D' ? tmp.getFloat64(0, true) : (w === 4 ? tmp.getUint32(0, true) : tmp.getUint16(0, true));
        } else if (dt === 'F') v = dv.getFloat32(p, little);
        else if (dt === 'D') v = dv.getFloat64(p, little);
        else if (w === 1) v = dv.getUint8(p);
        else if (w === 2) v = dv.getUint16(p, little);
        else if (w === 4) v = dv.getUint32(p, little);
        else { v = 0; for (let k = 0; k < w; k++) v += dv.getUint8(p + k) * 256 ** (little ? k : w - 1 - k); }
        if (mask[c]) v %= mask[c];
        data[c][e] = v; p += w;
      }
    }
    channels.forEach((ch, c) => {
      if (dt !== 'I' || !(ch.amp[0] > 0)) return;
      const R = ch.range > 0 ? ch.range : 2 ** ch.bits, a = data[c];
      for (let e = 0; e < n; e++) a[e] = ch.amp[1] * 10 ** ((ch.amp[0] * a[e]) / R);
    });
  }
  const sp = findSpill(text, channels);
  if (typeof sp === 'string') warnings.push(sp);
  return { version, text, channels, events: n, data, datatype: dt, byteOrder: dt === 'A' ? 'text' : byteOrder, spill: typeof sp === 'string' ? null : sp, warnings };
}

/** The spillover matrix from $SPILLOVER (FCS 3.1), SPILL or $SPILL: "n, names…, then n × n values row by row". */
export function findSpill(text: Record<string, string>, channels: Channel[]): Spill | null | string {
  const key = ['$SPILLOVER', 'SPILL', '$SPILL', 'SPILLOVER'].find((k) => text[k]);
  if (!key) return null;
  const t = text[key].split(',').map((s) => s.trim());
  const n = int(t[0]);
  if (!(n >= 1) || t.length < 1 + n + n * n) return `The spillover matrix (${key}) is not complete, so compensation is off.`;
  const names = t.slice(1, 1 + n), m: number[][] = [];
  for (let i = 0; i < n; i++) m.push(t.slice(1 + n + i * n, 1 + n + (i + 1) * n).map(Number));
  if (m.flat().some((v) => !Number.isFinite(v))) return `The spillover matrix (${key}) has a value that is not a number, so compensation is off.`;
  const idx = names.map((nm) => { const i = channels.findIndex((c) => c.n === nm); return i >= 0 ? i : channels.findIndex((c) => c.s && c.s === nm); });
  if (idx.some((i) => i < 0)) return `The spillover matrix names a channel that is not in the file (${names[idx.findIndex((i) => i < 0)]}), so compensation is off.`;
  return { names, idx, m, key };
}

/** Inverse of a square matrix by Gauss-Jordan elimination with partial pivoting; null when singular. */
export function invert(a: number[][]): number[][] | null {
  const n = a.length, m = a.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
    if (Math.abs(m[p][c]) < 1e-12) return null;
    [m[c], m[p]] = [m[p], m[c]];
    const d = m[c][c]; for (let j = 0; j < 2 * n; j++) m[c][j] /= d;
    for (let r = 0; r < n; r++) if (r !== c && m[r][c]) { const f = m[r][c]; for (let j = 0; j < 2 * n; j++) m[r][j] -= f * m[c][j]; }
  }
  return m.map((r) => r.slice(n));
}

/** Compensated copies of the data: for each event, the spillover channels' row vector times the inverse of S. */
export function compensate(data: Float64Array[], sp: Spill): Float64Array[] {
  const inv = invert(sp.m);
  if (!inv) throw new Error('The spillover matrix cannot be inverted, so the data cannot be compensated.');
  const k = sp.idx.length, n = data[0]?.length ?? 0, out = data.slice(), cols = sp.idx.map(() => new Float64Array(n)), row = new Float64Array(k);
  for (let e = 0; e < n; e++) {
    for (let i = 0; i < k; i++) row[i] = data[sp.idx[i]][e];
    for (let j = 0; j < k; j++) { let s = 0; for (let i = 0; i < k; i++) s += row[i] * inv[i][j]; cols[j][e] = s; }
  }
  sp.idx.forEach((c, j) => { out[c] = cols[j]; });
  return out;
}

// ---------- Scales ----------
export type Scale = { kind: 'lin' | 'log' | 'asinh'; cof: number };
export const scaleKey = (s: Scale) => (s.kind === 'asinh' ? `asinh/${s.cof}` : s.kind);
export const sameScale = (a: Scale, b: Scale) => scaleKey(a) === scaleKey(b);
/** Value on the plot axis: linear, log10 (−Infinity for zero or less) or asinh(value / cofactor). */
export function fwd(s: Scale, v: number): number { return s.kind === 'lin' ? v : s.kind === 'log' ? (v > 0 ? Math.log10(v) : -Infinity) : Math.asinh(v / s.cof); }
export function inv(s: Scale, t: number): number { return s.kind === 'lin' ? t : s.kind === 'log' ? 10 ** t : Math.sinh(t) * s.cof; }
export function transform(a: Float64Array, s: Scale): Float64Array { const o = new Float64Array(a.length); for (let i = 0; i < a.length; i++) o[i] = fwd(s, a[i]); return o; }

/** Axis range on the plot scale: the 0.1st to 99.9th percentile (lower method), padded by 5 %; starts at 0 for linear and arcsinh data that are all positive. */
export function autoRange(t: Float64Array): [number, number] {
  const f = Array.from(t).filter(Number.isFinite).sort((a, b) => a - b);
  if (!f.length) return [0, 1];
  const q = (p: number) => f[Math.floor(p * (f.length - 1))];
  let lo = q(0.001), hi = q(0.999);
  if (!(hi > lo)) { lo -= 1; hi += 1; }
  const pad = 0.05 * (hi - lo);
  return [lo - pad, hi + pad];
}
export function autoRangeFor(raw: Float64Array, t: Float64Array, s: Scale): [number, number] {
  let [lo, hi] = autoRange(t);
  if (s.kind !== 'log') { let mn = Infinity; for (const v of raw) if (v < mn) mn = v; if (mn >= 0) lo = 0; }
  return [lo, hi];
}

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const pow10 = (e: number) => (e === 0 ? '1' : e === 1 ? '10' : '10' + String(e).split('').map((c) => SUP[c] ?? c).join(''));
function kfmt(v: number): string {
  if (v === 0) return '0';
  const a = Math.abs(v), sg = v < 0 ? '−' : '';
  if (a >= 1e6) return sg + +(a / 1e6).toPrecision(4) + 'M';
  if (a >= 1e3) return sg + +(a / 1e3).toPrecision(4) + 'k';
  return sg + +a.toPrecision(4);
}
/** Ticks for an axis from lo to hi on the plot scale: { at (plot scale), label, major }. */
export function axisTicks(s: Scale, lo: number, hi: number, count = 6): { at: number; label: string; major: boolean }[] {
  const out: { at: number; label: string; major: boolean }[] = [];
  if (s.kind === 'lin') {
    const span = (hi - lo) / count, mag = 10 ** Math.floor(Math.log10(span || 1));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((x) => x >= span * 0.999)!;
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9 * step; v += step) out.push({ at: v, label: kfmt(+v.toPrecision(12)), major: true });
    return out;
  }
  if (s.kind === 'log') {
    for (let e = Math.floor(lo); e <= Math.ceil(hi); e++) {
      if (e >= lo && e <= hi) out.push({ at: e, label: pow10(e), major: true });
      for (let m = 2; m <= 9; m++) { const t = e + Math.log10(m); if (t > lo && t < hi && hi - lo < 7) out.push({ at: t, label: '', major: false }); }
    }
    return out;
  }
  // arcsinh: 0 and ±10^k, with minor ticks at ±m·10^k.
  const rlo = inv(s, lo), rhi = inv(s, hi);
  if (lo <= 0 && hi >= 0) out.push({ at: 0, label: '0', major: true });
  const top = Math.ceil(Math.log10(Math.max(Math.abs(rlo), Math.abs(rhi), 10)));
  let first = Infinity;
  for (let e = 0; e <= top; e++) for (const sg of [1, -1]) {
    const t = fwd(s, sg * 10 ** e);
    if (t >= lo && t <= hi) { out.push({ at: t, label: (sg < 0 ? '−' : '') + pow10(e), major: true }); first = Math.min(first, e); }
    for (let m = 2; m <= 9; m++) { const u = fwd(s, sg * m * 10 ** e); if (u > lo && u < hi && Math.abs(u - fwd(s, sg * (m - 1) * 10 ** e)) > (hi - lo) / 150) out.push({ at: u, label: '', major: false }); }
  }
  // Hide labels that crowd zero (10⁰, 10¹ … sit almost on top of 0 when the cofactor is large).
  const ps = (hi - lo) / 12;
  const maj = out.filter((t) => t.major).sort((a, b) => Math.abs(a.at) - Math.abs(b.at));
  const kept: number[] = [];
  for (const t of maj) { if (kept.some((k) => Math.abs(k - t.at) < ps)) { t.label = ''; t.major = false; } else kept.push(t.at); }
  return out.sort((a, b) => a.at - b.at);
}

// ---------- Binning ----------
const binOf = (t: number, lo: number, hi: number, n: number) => { if (!(t >= lo)) return 0; const b = Math.floor(((t - lo) / (hi - lo)) * n); return b >= n ? n - 1 : b; };
/** Counts in n equal bins from lo to hi (plot scale); values outside, or −Infinity, land in the end bins. */
export function hist1d(t: Float64Array, mask: Uint8Array | null, n: number, lo: number, hi: number): Uint32Array {
  const h = new Uint32Array(n);
  for (let i = 0; i < t.length; i++) if (!mask || mask[i]) { const v = t[i]; if (Number.isNaN(v)) continue; h[binOf(v, lo, hi, n)]++; }
  return h;
}
/** 2D counts, row-major from the bottom-left: h[iy * nx + ix]. Out-of-range values land on the edges. */
export function hist2d(tx: Float64Array, ty: Float64Array, mask: Uint8Array | null, nx: number, ny: number, xr: [number, number], yr: [number, number]): Uint32Array {
  const h = new Uint32Array(nx * ny);
  for (let i = 0; i < tx.length; i++) if (!mask || mask[i]) {
    const x = tx[i], y = ty[i]; if (Number.isNaN(x) || Number.isNaN(y)) continue;
    h[binOf(y, yr[0], yr[1], ny) * nx + binOf(x, xr[0], xr[1], nx)]++;
  }
  return h;
}

// ---------- Gates ----------
/**
 * A gate lives on the plot scales it was drawn on: points are in plot units of channel x (and y).
 * range: pts = [[lo, hi]] on x. rect: pts = two opposite corners. poly: the corners in order.
 */
export type Gate = { id: string; name: string; parent: string | null; kind: 'range' | 'rect' | 'poly'; x: number; y: number; sx: Scale; sy: Scale; pts: [number, number][] };

/** Even-odd ray casting (the classic point-in-polygon test). */
export function inPoly(x: number, y: number, p: [number, number][]): boolean {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
/** Tree order: each gate followed by the gates inside it (depth first, in the order drawn); gates whose parent is missing are dropped. */
export function gateOrder(gates: Gate[]): Gate[] {
  const out: Gate[] = [], seen = new Set<string>();
  const visit = (p: string | null) => { for (const g of gates) if (g.parent === p && !seen.has(g.id)) { seen.add(g.id); out.push(g); visit(g.id); } };
  visit(null);
  return out;
}
/** Each gate's events (1 = in): inside its own shape and inside its parent. `tv(channel, scale)` gives plot-scale values. */
export function gateMasks(gates: Gate[], n: number, tv: (c: number, s: Scale) => Float64Array): Map<string, Uint8Array> {
  const out = new Map<string, Uint8Array>();
  for (const g of gateOrder(gates)) {
    const m = new Uint8Array(n), par = g.parent ? out.get(g.parent)! : null, X = tv(g.x, g.sx);
    if (g.kind === 'range') {
      const lo = Math.min(g.pts[0][0], g.pts[0][1]), hi = Math.max(g.pts[0][0], g.pts[0][1]);
      for (let i = 0; i < n; i++) m[i] = (!par || par[i]) && X[i] >= lo && X[i] <= hi ? 1 : 0;
    } else {
      const Y = tv(g.y, g.sy);
      if (g.kind === 'rect') {
        const [[a, b], [c, d]] = g.pts, x0 = Math.min(a, c), x1 = Math.max(a, c), y0 = Math.min(b, d), y1 = Math.max(b, d);
        for (let i = 0; i < n; i++) m[i] = (!par || par[i]) && X[i] >= x0 && X[i] <= x1 && Y[i] >= y0 && Y[i] <= y1 ? 1 : 0;
      } else {
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const [x, y] of g.pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        for (let i = 0; i < n; i++) { const x = X[i], y = Y[i]; m[i] = (!par || par[i]) && x >= x0 && x <= x1 && y >= y0 && y <= y1 && inPoly(x, y, g.pts) ? 1 : 0; }
      }
    }
    out.set(g.id, m);
  }
  return out;
}
export const count = (m: Uint8Array | null, n: number) => { if (!m) return n; let c = 0; for (let i = 0; i < m.length; i++) c += m[i]; return c; };
export type GateStat = { id: string; name: string; parent: string; count: number; ofParent: number; ofAll: number; depth: number };
export function gateStats(gates: Gate[], masks: Map<string, Uint8Array>, n: number): GateStat[] {
  const byId = new Map(gates.map((g) => [g.id, g])), counts = new Map<string, number>();
  const depth = (g: Gate): number => (g.parent ? 1 + depth(byId.get(g.parent)!) : 0);
  return gateOrder(gates).map((g) => {
    const c = count(masks.get(g.id)!, n); counts.set(g.id, c);
    const pc = g.parent ? counts.get(g.parent)! : n;
    return { id: g.id, name: g.name, parent: g.parent ? byId.get(g.parent)!.name : 'All events', count: c, ofParent: pc ? (100 * c) / pc : NaN, ofAll: n ? (100 * c) / n : NaN, depth: depth(g) };
  });
}
/** Median (mean of the middle two for an even count, as NumPy does) and mean of the masked values. */
export function medianMean(a: Float64Array, m: Uint8Array | null): { median: number; mean: number } {
  const v: number[] = []; let s = 0;
  for (let i = 0; i < a.length; i++) if (!m || m[i]) { v.push(a[i]); s += a[i]; }
  if (!v.length) return { median: NaN, mean: NaN };
  const f = Float64Array.from(v).sort(), h = f.length >> 1;
  return { median: f.length % 2 ? f[h] : (f[h - 1] + f[h]) / 2, mean: s / v.length };
}
/** Four rectangles meeting at (x, y), extending without end: Q1 top left, Q2 top right, Q3 bottom right, Q4 bottom left. */
export function quadrants(x: number, y: number): [number, number][][] {
  const B = 1e300;
  return [[[-B, y], [x, B]], [[x, y], [B, B]], [[x, -B], [B, y]], [[-B, -B], [x, y]]];
}

// ---------- Writer ----------
/** An FCS 3.1 file: 32-bit floats, little-endian, list mode, "|" as the delimiter. */
export function writeFcs(o: { names: string[]; labels?: string[]; data: ArrayLike<number>[]; ranges?: number[]; text?: Record<string, string>; spill?: { names: string[]; m: number[][] } }): Uint8Array {
  const P = o.names.length, n = o.data[0]?.length ?? 0, enc = new TextEncoder();
  const kw: [string, string][] = [['$BYTEORD', '1,2,3,4'], ['$DATATYPE', 'F'], ['$MODE', 'L'], ['$NEXTDATA', '0'], ['$PAR', String(P)], ['$TOT', String(n)],
    ['$BEGINANALYSIS', '0'], ['$ENDANALYSIS', '0'], ['$BEGINSTEXT', '0'], ['$ENDSTEXT', '0']];
  for (let i = 0; i < P; i++) {
    kw.push([`$P${i + 1}B`, '32'], [`$P${i + 1}E`, '0,0'], [`$P${i + 1}N`, o.names[i]], [`$P${i + 1}R`, String(o.ranges?.[i] ?? 262144)]);
    if (o.labels?.[i]) kw.push([`$P${i + 1}S`, o.labels[i]]);
  }
  if (o.spill) kw.push(['$SPILLOVER', [o.spill.names.length, ...o.spill.names, ...o.spill.m.flat()].join(',')]);
  for (const [k, v] of Object.entries(o.text ?? {})) kw.push([k, v]);
  const esc = (s: string) => s.replace(/\|/g, '||');
  const textFor = (bd: number, ed: number) => enc.encode('|' + [...kw, ['$BEGINDATA', String(bd)], ['$ENDDATA', String(ed)]].map(([k, v]) => `${esc(k)}|${esc(v || ' ')}|`).join(''));
  const dlen = n * P * 4, ts = 58;
  let text = textFor(0, 0);
  for (let k = 0; k < 5; k++) { const ds = ts + text.length; const t2 = textFor(ds, ds + dlen - 1); if (t2.length === text.length) { text = t2; break; } text = t2; }
  const te = ts + text.length - 1, ds = te + 1, de = ds + dlen - 1;
  const fits = (v: number) => v <= 99999999;
  const head = 'FCS3.1    ' + [ts, te, fits(de) ? ds : 0, fits(de) ? de : 0, 0, 0].map((v) => String(v).padStart(8, ' ')).join('');
  const out = new Uint8Array(ds + dlen);
  out.set(enc.encode(head), 0); out.set(text, ts);
  const dv = new DataView(out.buffer, ds);
  for (let e = 0, p = 0; e < n; e++) for (let c = 0; c < P; c++, p += 4) dv.setFloat32(p, o.data[c][e], true);
  return out;
}

// ---------- The made-up example ----------
function rng(seed: number) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let spare: number | null = null;
  const g = () => { if (spare !== null) { const s = spare; spare = null; return s; } let x = 0; while (x <= 0) x = u(); const y = u(), r = Math.sqrt(-2 * Math.log(x)); spare = r * Math.sin(2 * Math.PI * y); return r * Math.cos(2 * Math.PI * y); };
  return { u, g };
}
/** Made-up spillover: 15 % of the FITC signal shows up in PE, 2 % of PE in FITC. */
export const EXAMPLE_SPILL = { names: ['FITC-A', 'PE-A'], m: [[1, 0.15], [0.02, 1]] };
/**
 * A made-up sample of 20,000 events: 12 % debris and 88 % cells. Of the cells, 50 % carry neither marker, 25 % marker
 * A only, 10 % both and 15 % marker B only. Marker A is read in FITC and marker B in PE, with the made-up spillover
 * above and some detector noise. All numbers are invented for the example.
 */
export function exampleFcs(seed = 2026, n = 20000): Uint8Array {
  const { u, g } = rng(seed);
  const fsc = new Float64Array(n), ssc = new Float64Array(n), fitc = new Float64Array(n), pe = new Float64Array(n);
  const pos = (med: number) => med * Math.exp(0.35 * g());
  const neg = () => 40 + 120 * g();
  for (let i = 0; i < n; i++) {
    let a = 0, b = 0;
    if (u() < 0.12) {
      fsc[i] = Math.max(200, 16000 + 7000 * g()); ssc[i] = Math.max(100, 9000 + 5000 * g());
      a = 60 + 150 * g(); b = 50 + 150 * g();
    } else {
      fsc[i] = 90000 + 14000 * g(); ssc[i] = 42000 + 9000 * g();
      const r = u(), A = r >= 0.5 && r < 0.85, B = r >= 0.75;
      a = A ? pos(8000) : neg(); b = B ? pos(5000) : neg();
    }
    const [[s11, s12], [s21, s22]] = EXAMPLE_SPILL.m;
    fitc[i] = a * s11 + b * s21 + 60 * g();
    pe[i] = a * s12 + b * s22 + 60 * g();
  }
  return writeFcs({
    names: ['FSC-A', 'SSC-A', 'FITC-A', 'PE-A'], labels: ['', '', 'Marker A', 'Marker B'], data: [fsc, ssc, fitc, pe],
    spill: EXAMPLE_SPILL, text: { $CYT: 'fibub made-up example', $FIL: 'fibub-example.fcs', $DATE: '09-NOV-2026', $SRC: 'Made-up sample' },
  });
}
const AS: Scale = { kind: 'asinh', cof: 150 }, LIN: Scale = { kind: 'lin', cof: 150 };
/** The example's gates: Cells on FSC/SSC, then marker A positive on FITC, then marker B positive inside those. */
export function exampleGates(): Gate[] {
  const t = (v: number) => Math.asinh(v / 150);
  return [
    { id: 'g1', name: 'Cells', parent: null, kind: 'poly', x: 0, y: 1, sx: LIN, sy: LIN, pts: [[50000, 15000], [130000, 15000], [140000, 60000], [120000, 80000], [60000, 75000], [45000, 40000]] },
    { id: 'g2', name: 'Marker A+', parent: 'g1', kind: 'range', x: 2, y: 3, sx: AS, sy: AS, pts: [[t(1500), t(262144)]] },
    { id: 'g3', name: 'Marker A+ B+', parent: 'g2', kind: 'rect', x: 2, y: 3, sx: AS, sy: AS, pts: [[t(1500), t(1000)], [t(262144), t(262144)]] },
  ];
}
