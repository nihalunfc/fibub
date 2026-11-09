// Ground-penetrating radar (GPR) profiles: read SEG-Y (rev 0 and 1; IBM float, IEEE float, 32/16/8-bit integers;
// big- or little-endian) and simple GSSI DZT files (1024-byte header blocks, 8/16-bit unsigned or 32-bit signed
// samples), then process: time-zero shift, dewow (running-mean removal), background removal (mean trace),
// gain (linear, exponential, AGC), and a hyperbola fit for velocity, t² = a x² + b x + c with v = 2/√a.
// Plain TypeScript, no DOM. Data are trace-major: sample j of trace i is data[i * ns + j].

export type Radargram = {
  nt: number; // traces
  ns: number; // samples per trace
  dt: number; // time step (ns)
  dx: number; // trace spacing (m); NaN when unknown
  data: Float32Array;
  info: [string, string][];
  dtNote?: string;
  rawDt?: number; // the sample interval field as stored (SEG-Y)
  text?: string; // SEG-Y text header
};

// ---------- SEG-Y ----------
const BPS: Record<number, number> = { 1: 4, 2: 4, 3: 2, 5: 4, 8: 1 };
const FMT: Record<number, string> = { 1: '4-byte IBM float', 2: '4-byte integer', 3: '2-byte integer', 5: '4-byte IEEE float', 8: '1-byte integer' };

/** IBM System/360 single-precision float from its 32-bit pattern. */
export function ibm2num(u: number): number {
  const sign = u >>> 31 ? -1 : 1, exp = (u >>> 24) & 0x7f, frac = u & 0xffffff;
  if (!frac) return 0;
  return sign * (frac / 0x1000000) * 16 ** (exp - 64);
}

const EBC: Record<number, string> = { 0x40: ' ', 0x4b: '.', 0x4c: '<', 0x4d: '(', 0x4e: '+', 0x4f: '|', 0x50: '&', 0x5a: '!', 0x5b: '$', 0x5c: '*', 0x5d: ')', 0x5e: ';', 0x60: '-', 0x61: '/', 0x6b: ',', 0x6c: '%', 0x6d: '_', 0x6e: '>', 0x6f: '?', 0x7a: ':', 0x7b: '#', 0x7c: '@', 0x7d: "'", 0x7e: '=', 0x7f: '"' };
const ebcChar = (b: number) => {
  if (EBC[b]) return EBC[b];
  for (const [lo, base] of [[0x81, 97], [0x91, 106], [0xc1, 65], [0xd1, 74]] as const) if (b >= lo && b < lo + 9) return String.fromCharCode(base + b - lo);
  if (b >= 0xa2 && b <= 0xa9) return String.fromCharCode(115 + b - 0xa2);
  if (b >= 0xe2 && b <= 0xe9) return String.fromCharCode(83 + b - 0xe2);
  if (b >= 0xf0 && b <= 0xf9) return String(b - 0xf0);
  return ' ';
};
/** The 3200-byte text header as 40 lines of 80 characters (EBCDIC or ASCII). */
export function textHeader(b: Uint8Array): string {
  const h = b.subarray(0, 3200);
  let ebc = 0, asc = 0;
  for (const x of h) { if (x === 0x40) ebc++; if (x === 0x20) asc++; }
  const s = Array.from(h, (x) => (ebc > asc ? ebcChar(x) : x >= 32 && x < 127 ? String.fromCharCode(x) : ' ')).join('');
  const lines: string[] = [];
  for (let i = 0; i < 3200; i += 80) lines.push(s.slice(i, i + 80).trimEnd());
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  return lines.join('\n');
}

/** Pick the unit of the stored sample interval that gives a GPR-like time window (5 to 5000 ns): ps, then ns, then µs. */
export function guessDt(raw: number, ns: number): { dt: number; unit: string } {
  for (const [unit, f] of [['ps', 1e-3], ['ns', 1], ['µs', 1e3]] as const) { const w = raw * f * ns; if (w >= 5 && w <= 5000) return { dt: raw * f, unit }; }
  return { dt: raw * 1e3, unit: 'µs' };
}

export function readSegy(buf: ArrayBuffer): Radargram {
  const b = new Uint8Array(buf), dv = new DataView(buf);
  if (b.length < 3600 + 240) throw new Error('This file is too short to be SEG-Y (it needs a 3600-byte header and at least one trace).');
  const tryEnd = (le: boolean) => {
    const fmt = dv.getUint16(3224, le), ns = dv.getUint16(3220, le), dt = dv.getUint16(3216, le);
    const rev = dv.getUint16(3500, le), next = dv.getInt16(3504, le), fixed = dv.getUint16(3502, le);
    const ok = BPS[fmt] !== undefined;
    let score = ok ? 1 : 0;
    if (ok && ns > 0) { const start = 3600 + ((rev >= 256 || rev === 1) && next > 0 ? next * 3200 : 0), tl = 240 + ns * BPS[fmt]; if ((b.length - start) % tl === 0) score += 2; if (dv.getUint16(start + 114, le) === ns) score += 1; }
    return { le, fmt, ns, dt, rev, next, fixed, score };
  };
  const be = tryEnd(false), le = tryEnd(true), h = le.score > be.score ? le : be;
  if (!h.score) throw new Error(`Unknown sample format code (${be.fmt} read big-endian, ${le.fmt} little-endian). This reader supports codes 1, 2, 3, 5 and 8.`);
  const bps = BPS[h.fmt], isRev1 = h.rev >= 256 || h.rev === 1; // rev 1 is stored as 0x0100 (some writers put 1)
  let p = 3600 + (isRev1 && h.next > 0 ? h.next * 3200 : 0);
  const traces: Float32Array[] = [], xy: [number, number][] = [];
  let maxNs = 0, trDt = 0;
  while (p + 240 <= b.length) {
    let ns = dv.getUint16(p + 114, h.le);
    if (!ns || (isRev1 && h.fixed === 1)) ns = h.ns;
    if (!ns) throw new Error('The file gives no number of samples per trace.');
    if (!trDt) trDt = dv.getUint16(p + 116, h.le);
    if (p + 240 + ns * bps > b.length) break; // a cut-off last trace is dropped
    const sc = dv.getInt16(p + 70, h.le), f = sc > 0 ? sc : sc < 0 ? -1 / sc : 1;
    xy.push([dv.getInt32(p + 72, h.le) * f, dv.getInt32(p + 76, h.le) * f]);
    const t = new Float32Array(ns), q = p + 240;
    for (let j = 0; j < ns; j++) {
      const o = q + j * bps;
      t[j] = h.fmt === 1 ? ibm2num(dv.getUint32(o, h.le)) : h.fmt === 2 ? dv.getInt32(o, h.le) : h.fmt === 3 ? dv.getInt16(o, h.le) : h.fmt === 5 ? dv.getFloat32(o, h.le) : dv.getInt8(o);
    }
    traces.push(t); maxNs = Math.max(maxNs, ns); p = q + ns * bps;
  }
  if (!traces.length) throw new Error('No complete traces were found after the headers.');
  const nt = traces.length, data = new Float32Array(nt * maxNs);
  traces.forEach((t, i) => data.set(t, i * maxNs));
  const raw = h.dt || trDt, g = guessDt(raw, maxNs);
  // trace spacing from source coordinates when they move steadily
  let dx = NaN;
  if (nt > 1) { const d = xy.slice(1).map((c, i) => Math.hypot(c[0] - xy[i][0], c[1] - xy[i][1])); const m = d.reduce((s, x) => s + x, 0) / d.length; if (m > 0 && d.every((x) => Math.abs(x - m) < 0.05 * m)) dx = m; }
  return { nt, ns: maxNs, dt: g.dt, dx, data, rawDt: raw, dtNote: `stored sample interval ${raw}, read as ${g.unit}`, text: textHeader(b),
    info: [['Format', `SEG-Y rev ${isRev1 ? 1 : 0}, ${FMT[h.fmt]}, ${h.le ? 'little' : 'big'}-endian`], ['Traces', String(nt)], ['Samples per trace', String(maxNs)], ['Sample interval in the file', `${raw} (read as ${g.unit})`]] };
}

// ---------- GSSI DZT ----------
export function readDzt(buf: ArrayBuffer, channel = 0): Radargram & { nchan: number; zero: number } {
  const dv = new DataView(buf);
  if (buf.byteLength < 1024) throw new Error('This file is too short to be a DZT file (it needs a 1024-byte header).');
  const tag = dv.getUint16(0, true), rhData = dv.getInt16(2, true), ns = dv.getInt16(4, true), bits = dv.getInt16(6, true), zero = dv.getInt16(8, true);
  const spm = dv.getFloat32(14, true), range = dv.getFloat32(26, true), nchan = Math.max(1, dv.getInt16(52, true)), epsr = dv.getFloat32(54, true);
  if ((tag & 0xff) !== 0xff) throw new Error('This does not look like a GSSI DZT file (the header tag is wrong).');
  if (![8, 16, 32].includes(bits)) throw new Error(`This DZT file uses ${bits}-bit samples; only 8, 16 and 32 bits are read.`);
  if (!(ns > 0) || !(range > 0)) throw new Error('The DZT header has no samples per scan or no time range.');
  if (channel >= nchan) throw new Error(`This file has ${nchan} channel(s).`);
  const off = rhData < 1024 ? 1024 * rhData : 1024 * nchan, bps = bits / 8, scan = ns * nchan * bps;
  const nt = Math.floor((buf.byteLength - off) / scan);
  if (nt < 1) throw new Error('No complete scans were found after the header.');
  const data = new Float32Array(nt * ns), mid = bits === 32 ? 0 : 2 ** (bits - 1);
  for (let i = 0; i < nt; i++) {
    const base = off + i * scan + channel * ns * bps;
    for (let j = 0; j < ns; j++) {
      const o = base + j * bps;
      data[i * ns + j] = (bits === 8 ? dv.getUint8(o) : bits === 16 ? dv.getUint16(o, true) : dv.getInt32(o, true)) - mid;
    }
  }
  const dt = range / ns;
  return { nt, ns, dt, dx: spm > 0 ? 1 / spm : NaN, data, nchan, zero,
    info: [['Format', `GSSI DZT, ${bits}-bit, ${nchan} channel${nchan > 1 ? 's' : ''}${nchan > 1 ? ` (showing ${channel + 1})` : ''}`], ['Traces (scans)', String(nt)], ['Samples per trace', String(ns)], ['Time range', `${range} ns`], ['Scans per metre', spm > 0 ? String(+spm.toFixed(4)) : 'not set'], ...(epsr > 0 ? [['Dielectric constant in the header', String(+epsr.toFixed(3))] as [string, string]] : [])] };
}

/** DZT files start their scans with two marker words; blank them with the third sample. */
export function blankFirst(r: Radargram, k = 2) {
  for (let i = 0; i < r.nt; i++) for (let j = 0; j < Math.min(k, r.ns - 1); j++) r.data[i * r.ns + j] = r.data[i * r.ns + k];
}

// ---------- processing ----------
type Sec = { nt: number; ns: number; data: Float32Array };

/** Mean trace (average over all traces, sample by sample). */
export function meanTrace(s: Sec): Float64Array {
  const m = new Float64Array(s.ns);
  for (let i = 0; i < s.nt; i++) for (let j = 0; j < s.ns; j++) m[j] += s.data[i * s.ns + j];
  for (let j = 0; j < s.ns; j++) m[j] /= s.nt;
  return m;
}
/** Automatic time zero at the direct wave: from the first sample where the mean trace swings (from its first value)
 *  by `frac` of its largest swing, step on to the top of that peak. */
export function autoZero(s: Sec, frac = 0.5): number {
  const m = meanTrace(s), d = Array.from(m, (x) => Math.abs(x - m[0])), mx = Math.max(...d);
  let j = d.findIndex((x) => x >= frac * mx);
  if (j < 0) return 0;
  while (j + 1 < d.length && d[j + 1] >= d[j]) j++;
  return j;
}
/** Remove the first k samples of every trace. */
export function timeZero(s: Sec, k: number): Sec {
  k = Math.max(0, Math.min(s.ns - 2, Math.round(k)));
  const ns = s.ns - k, out = new Float32Array(s.nt * ns);
  for (let i = 0; i < s.nt; i++) out.set(s.data.subarray(i * s.ns + k, (i + 1) * s.ns), i * ns);
  return { nt: s.nt, ns, data: out };
}
/** Running mean of a 1-D signal over 2h+1 samples, the window shrinking at the ends. */
function runMean(x: ArrayLike<number>, h: number, sq = false): Float64Array {
  const n = x.length, c = new Float64Array(n + 1), out = new Float64Array(n);
  for (let j = 0; j < n; j++) c[j + 1] = c[j] + (sq ? x[j] * x[j] : x[j]);
  for (let j = 0; j < n; j++) { const a = Math.max(0, j - h), b = Math.min(n - 1, j + h); out[j] = (c[b + 1] - c[a]) / (b - a + 1); }
  return out;
}
/** Dewow: subtract a running mean over a window of w samples (made odd) from each trace. */
export function dewow(s: Sec, w: number): Sec {
  const h = Math.max(1, Math.floor(w / 2)), out = new Float32Array(s.data.length);
  for (let i = 0; i < s.nt; i++) { const tr = s.data.subarray(i * s.ns, (i + 1) * s.ns), m = runMean(tr, h); for (let j = 0; j < s.ns; j++) out[i * s.ns + j] = tr[j] - m[j]; }
  return { ...s, data: out };
}
/** Background removal: subtract the mean trace of all traces (window 0) or of a running window of w traces. */
export function background(s: Sec, w = 0): Sec {
  const out = new Float32Array(s.data.length);
  if (!w || w >= s.nt) {
    const m = meanTrace(s);
    for (let i = 0; i < s.nt; i++) for (let j = 0; j < s.ns; j++) out[i * s.ns + j] = s.data[i * s.ns + j] - m[j];
    return { ...s, data: out };
  }
  const h = Math.max(1, Math.floor(w / 2)), col = new Float64Array(s.nt);
  for (let j = 0; j < s.ns; j++) {
    for (let i = 0; i < s.nt; i++) col[i] = s.data[i * s.ns + j];
    const m = runMean(col, h);
    for (let i = 0; i < s.nt; i++) out[i * s.ns + j] = col[i] - m[i];
  }
  return { ...s, data: out };
}
export type Gain = { kind: 'none' } | { kind: 'linear'; a: number } | { kind: 'exp'; db: number } | { kind: 'agc'; w: number };
/** Gain curve for time-varying gains (t = j·dt in ns): linear 1 + a t, exponential 10^(dB·t/20). */
export function gainCurve(g: Gain, ns: number, dt: number): Float64Array {
  const c = new Float64Array(ns);
  for (let j = 0; j < ns; j++) { const t = j * dt; c[j] = g.kind === 'linear' ? 1 + g.a * t : g.kind === 'exp' ? 10 ** ((g.db * t) / 20) : 1; }
  return c;
}
/** Apply a gain. AGC divides each sample by the RMS amplitude in a window of w samples around it
 *  (plus 1e-6 × the RMS of the whole section, so silent parts do not blow up). */
export function applyGain(s: Sec, g: Gain, dt: number): Sec {
  const out = new Float32Array(s.data.length);
  if (g.kind !== 'agc') { const c = gainCurve(g, s.ns, dt); for (let i = 0; i < s.nt; i++) for (let j = 0; j < s.ns; j++) out[i * s.ns + j] = s.data[i * s.ns + j] * c[j]; return { ...s, data: out }; }
  let ss = 0; for (const x of s.data) ss += x * x;
  const eps = 1e-6 * Math.sqrt(ss / s.data.length), h = Math.max(1, Math.floor(g.w / 2));
  for (let i = 0; i < s.nt; i++) { const tr = s.data.subarray(i * s.ns, (i + 1) * s.ns), m = runMean(tr, h, true); for (let j = 0; j < s.ns; j++) out[i * s.ns + j] = tr[j] / (Math.sqrt(m[j]) + eps); }
  return { ...s, data: out };
}
/** The p-th percentile (0–100) of |amplitude|, from at most about 400 000 samples. */
export function clipLevel(d: Float32Array, p: number): number {
  const step = Math.max(1, Math.floor(d.length / 400000)), a: number[] = [];
  for (let i = 0; i < d.length; i += step) a.push(Math.abs(d[i]));
  a.sort((x, y) => x - y);
  return a[Math.min(a.length - 1, Math.floor((p / 100) * (a.length - 1)))] || 1;
}

// ---------- velocity from a hyperbola ----------
/** Least-squares fit of t² = a x² + b x + c to picked points (x in m, two-way time t in ns after time zero).
 *  A point reflector at (x0, depth d) in a medium of speed v gives t = (2/v)√((x − x0)² + d²). */
export function fitHyperbola(pts: { x: number; t: number }[]) {
  if (pts.length < 3) return null;
  const S = Array.from({ length: 3 }, () => [0, 0, 0, 0]);
  for (const p of pts) { const r = [p.x * p.x, p.x, 1], y = p.t * p.t; for (let i = 0; i < 3; i++) { for (let j = 0; j < 3; j++) S[i][j] += r[i] * r[j]; S[i][3] += r[i] * y; } }
  for (let c = 0; c < 3; c++) { let m = c; for (let r = c + 1; r < 3; r++) if (Math.abs(S[r][c]) > Math.abs(S[m][c])) m = r; [S[c], S[m]] = [S[m], S[c]]; if (Math.abs(S[c][c]) < 1e-300) return null; for (let r = 0; r < 3; r++) if (r !== c) { const f = S[r][c] / S[c][c]; for (let k = c; k < 4; k++) S[r][k] -= f * S[c][k]; } }
  const a = S[0][3] / S[0][0], b = S[1][3] / S[1][1], c = S[2][3] / S[2][2];
  if (!(a > 0)) return { a, b, c, ok: false as const };
  const v = 2 / Math.sqrt(a), x0 = -b / (2 * a), t02 = c - (b * b) / (4 * a), t0 = t02 > 0 ? Math.sqrt(t02) : NaN, depth = (v * t0) / 2;
  const rms = Math.sqrt(pts.reduce((s, p) => s + (p.t - Math.sqrt(Math.max(0, a * p.x * p.x + b * p.x + c))) ** 2, 0) / pts.length);
  return { a, b, c, ok: true as const, v, x0, t0, depth, rms, eps: (0.299792458 / v) ** 2 };
}
/** Depth (m) of a two-way time (ns) at speed v (m/ns). */
export const depthOf = (t: number, v: number) => (v * t) / 2;
/** Relative permittivity from speed: ε = (c/v)². */
export const epsOf = (v: number) => (0.299792458 / v) ** 2;

// ---------- made-up example ----------
/** A made-up profile: 12 m, 241 traces at 5 cm, 0.125 ns steps over 60 ns, v = 0.1 m/ns, a 400 MHz Ricker wavelet;
 *  direct wave at 6 ns, a flat layer at 1.2 m, a dipping layer, two pipes (hyperbolas), wow, decay and noise. */
export function example(rand: () => number): Radargram {
  const nt = 241, ns = 480, dt = 0.125, dx = 0.05, v = 0.1, t0 = 6, f = 0.4, data = new Float32Array(nt * ns);
  const ricker = (t: number) => { const a = (Math.PI * f * t) ** 2; return (1 - 2 * a) * Math.exp(-a); };
  for (let i = 0; i < nt; i++) {
    const x = i * dx, ev: [number, number][] = [[t0, 1]];
    ev.push([t0 + (2 * 1.2) / v, 0.35]);
    ev.push([t0 + (2 * (0.5 + 0.1 * x)) / v, 0.25]);
    for (const [px, pd, A] of [[4, 0.7, 0.5], [8.5, 1.6, 0.45]]) ev.push([t0 + (2 * Math.hypot(x - px, pd)) / v, A]);
    for (let j = 0; j < ns; j++) {
      const t = j * dt; let s = 0;
      for (const [te, A] of ev) { const tau = t - te; if (Math.abs(tau) < 6) s += A * (te > t0 ? Math.exp(-(te - t0) / 10) : 1) * ricker(tau); }
      s += 0.4 * Math.exp(-(((t - 14) / 12) ** 2)) + 0.15; // wow: slow drift and offset
      s += (rand() - 0.5) * 0.004;
      data[i * ns + j] = s;
    }
  }
  return { nt, ns, dt, dx, data, info: [['Format', 'made-up example (no file)'], ['Traces', String(nt)], ['Samples per trace', String(ns)], ['Time step', `${dt} ns`], ['Trace spacing', `${dx} m`]] };
}
