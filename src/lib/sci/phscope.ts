// Oscilloscope trace measurements: levels (histogram top and base, as IEEE 181 describes), frequency and period from
// mid-level crossings, 10-90 % rise and fall times, duty cycle, RMS, and the delay and phase between two channels
// (from edges and from the fundamental's DFT). Plain TypeScript, no DOM.
import { parseTable, num } from './num.ts';
import { rng } from './phct.ts';

export type Trace = { name: string; y: number[] };
export type Scope = { t: number[]; channels: Trace[]; dt: number; header: string[]; skipped: number; timeFromColumn: boolean };

/**
 * Read a scope export: finds the longest block of rows that are all numbers (skipping metadata lines such as
 * "Record Length,2500"), uses the last text line above it as the header, and takes the first column as time when
 * it rises evenly. Otherwise every column is a channel and time comes from the sample interval dt.
 */
export function parseScope(text: string, dtFallback = 0): Scope {
  const rows = parseTable(text);
  let best = [0, 0], start = -1, width = 0;
  const numericRow = (r: string[]) => r.length >= 1 && r.every((c) => c !== '' && Number.isFinite(num(c)));
  for (let i = 0; i <= rows.length; i++) {
    const ok = i < rows.length && numericRow(rows[i]) && (start < 0 || rows[i].length === width);
    if (ok && start < 0) { start = i; width = rows[i].length; }
    if (!ok && start >= 0) { if (i - start > best[1] - best[0]) best = [start, i]; start = -1; if (i < rows.length && numericRow(rows[i])) { start = i; width = rows[i].length; } }
  }
  const [a, b] = best;
  if (b - a < 4) throw new Error('No block of at least 4 rows of numbers was found');
  const block = rows.slice(a, b).map((r) => r.map(num)), nc = block[0].length;
  let header: string[] = [];
  for (let i = a - 1; i >= 0; i--) if (rows[i].length === nc && rows[i].some((c) => !Number.isFinite(num(c)))) { header = rows[i]; break; }
  const col = (j: number) => block.map((r) => r[j]);
  const c0 = col(0), st = (c0[c0.length - 1] - c0[0]) / (c0.length - 1);
  const even = nc > 1 && st > 0 && c0.every((v, i) => i === 0 || Math.abs(v - c0[i - 1] - st) <= Math.abs(st) * 0.01 + 1e-15);
  const named = (j: number) => header[j]?.trim() || `CH${even ? j : j + 1}`;
  if (even) return { t: c0, channels: Array.from({ length: nc - 1 }, (_, k) => ({ name: named(k + 1), y: col(k + 1) })), dt: st, header, skipped: rows.length - (b - a), timeFromColumn: true };
  if (!(dtFallback > 0)) throw new Error('The first column is not an evenly rising time column: give the sample interval');
  return { t: c0.map((_, i) => i * dtFallback), channels: Array.from({ length: nc }, (_, k) => ({ name: named(k), y: col(k) })), dt: dtFallback, header, skipped: rows.length - (b - a), timeFromColumn: false };
}

export type Levels = { min: number; max: number; base: number; top: number; amplitude: number; pp: number; mean: number; rms: number; acRms: number };
/** Top and base as the most common values (mean of the modal histogram bin) in the upper and lower halves (falls back to max and min). */
export function levels(y: number[], bins = 200): Levels {
  let min = Infinity, max = -Infinity, s = 0, s2 = 0;
  for (const v of y) { if (v < min) min = v; if (v > max) max = v; s += v; s2 += v * v; }
  const n = y.length, mean = s / n, rms = Math.sqrt(s2 / n), acRms = Math.sqrt(Math.max(0, s2 / n - mean * mean));
  const w = (max - min) / bins || 1, h = new Array(bins).fill(0);
  for (const v of y) h[Math.min(bins - 1, Math.floor((v - min) / w))]++;
  const half = bins / 2;
  let lo = 0, hi = bins - 1;
  for (let i = 0; i < half; i++) if (h[i] > h[lo]) lo = i;
  for (let i = bins - 1; i >= half; i--) if (h[i] > h[hi]) hi = i;
  // A mode only counts if it holds a real share of the samples (a square wave); otherwise use the extremes (a sine).
  const share = (i: number) => h[i] / n;
  const inBin = (k: number) => { let a = 0, c = 0; for (const v of y) if (Math.min(bins - 1, Math.floor((v - min) / w)) === k) { a += v; c++; } return a / c; };
  const base = share(lo) > 0.05 ? inBin(lo) : min, top = share(hi) > 0.05 ? inBin(hi) : max;
  return { min, max, base, top, amplitude: top - base, pp: max - min, mean, rms, acRms };
}

/** Times where y crosses `level` going up (dir 1) or down (dir −1), with hysteresis h, interpolated linearly. */
export function crossings(t: number[], y: number[], level: number, h: number, dir: 1 | -1): number[] {
  const out: number[] = [];
  let armed = dir === 1 ? y[0] < level - h : y[0] > level + h;
  for (let i = 1; i < y.length; i++) {
    const v = dir * (y[i] - level);
    if (!armed) { if (v < -h) armed = true; continue; }
    if (v >= h) {
      let j = i; while (j > 0 && !(dir * (y[j - 1] - level) < 0 && dir * (y[j] - level) >= 0)) j--;
      if (j > 0) { const f = (level - y[j - 1]) / (y[j] - y[j - 1]); out.push(t[j - 1] + f * (t[j] - t[j - 1])); }
      armed = false;
    }
  }
  return out;
}
const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;

export type Measure = Levels & { period: number; freq: number; periods: number; rise: number; fall: number; nRise: number; nFall: number; duty: number; mid: number; lo: number; hi: number; up: number[]; down: number[] };
/** Standard scope measurements on one trace. lowPct/highPct set the rise-time levels (10/90 or 20/80). */
export function measure(t: number[], y: number[], lowPct = 10, highPct = 90, hystPct = 5): Measure {
  const L = levels(y), A = L.amplitude, hy = (hystPct / 100) * A;
  const lo = L.base + (lowPct / 100) * A, hi = L.base + (highPct / 100) * A, mid = L.base + 0.5 * A;
  const up = crossings(t, y, mid, hy, 1), down = crossings(t, y, mid, hy, -1);
  const period = up.length > 1 ? (up[up.length - 1] - up[0]) / (up.length - 1) : NaN;
  const lU = crossings(t, y, lo, hy / 2, 1), hU = crossings(t, y, hi, hy / 2, 1), hD = crossings(t, y, hi, hy / 2, -1), lD = crossings(t, y, lo, hy / 2, -1);
  const lim = Number.isFinite(period) ? period / 2 : Infinity;
  const pair = (mids: number[], before: number[], after: number[]) => {
    const out: number[] = [];
    for (const m of mids) {
      const b = before.filter((x) => x <= m).pop(), a = after.find((x) => x >= m);
      if (b !== undefined && a !== undefined && m - b < lim && a - m < lim) out.push(a - b);
    }
    return out;
  };
  const rises = pair(up, lU, hU), falls = pair(down, hD, lD);
  // Duty cycle: high time from each rising mid crossing to the next falling one, over the period.
  const highs: number[] = [];
  for (const u of up) { const d = down.find((x) => x > u); if (d !== undefined && d - u < (Number.isFinite(period) ? period : Infinity)) highs.push(d - u); }
  return { ...L, period, freq: 1 / period, periods: Math.max(0, up.length - 1), rise: rises.length ? mean(rises) : NaN, fall: falls.length ? mean(falls) : NaN, nRise: rises.length, nFall: falls.length, duty: highs.length && Number.isFinite(period) ? mean(highs) / period : NaN, mid, lo, hi, up, down };
}

/**
 * Phase of channel b relative to a at frequency f, in degrees (positive when b lags a), from the fundamental's DFT
 * over a whole number of periods; and the delay between rising mid-level crossings.
 */
export function phase(t: number[], a: number[], b: number[], f: number, upA: number[], upB: number[]) {
  const T = 1 / f, n = Math.floor((t[t.length - 1] - t[0]) / T);
  let ra = 0, ia = 0, rb = 0, ib = 0, k = 0;
  if (n >= 1) {
    const end = t[0] + n * T;
    for (let i = 0; i < t.length && t[i] < end; i++) { const w = 2 * Math.PI * f * (t[i] - t[0]); ra += a[i] * Math.cos(w); ia -= a[i] * Math.sin(w); rb += b[i] * Math.cos(w); ib -= b[i] * Math.sin(w); k++; }
  }
  let dft = n >= 1 && k > 4 ? ((Math.atan2(ia, ra) - Math.atan2(ib, rb)) * 180) / Math.PI : NaN;
  if (Number.isFinite(dft)) dft = ((((dft + 180) % 360) + 360) % 360) - 180;
  const delays: number[] = [];
  for (const ta of upA) { const tb = upB.find((x) => x >= ta); if (tb !== undefined && tb - ta < T) delays.push(tb - ta); }
  const delay = delays.length ? mean(delays) : NaN;
  let edge = (delay / T) * 360; if (edge > 180) edge -= 360;
  return { dft, delay, edge, periods: n };
}

/** A made-up two-channel capture: a 1 kHz, 3.3 V logic square wave through an RC of time constant tau, and a 1 V sine lagging the square by lagDeg. */
export function exampleCapture(n = 4000, dt = 1e-6, tau = 10e-6, lagDeg = 45, noise = 0.005, seed = 5) {
  const g = rng(seed), f = 1000, per = Math.round(1 / f / dt), start = -Math.round(0.2e-3 / dt), t: number[] = [], c1: number[] = [], c2: number[] = [];
  const target = (k: number) => ((((k % per) + per) % per) < per / 2 ? 3.3 : 0); // the square switches exactly on samples
  let v = 0;
  for (let k = start - 20 * per; k < start + n; k++) {
    v = target(k - 1) + (v - target(k - 1)) * Math.exp(-dt / tau); // the RC output relaxes towards the level set one sample earlier
    if (k >= start) { const tt = k * dt; t.push(tt); c1.push(v + noise * 3.3 * g.n()); c2.push(Math.sin(2 * Math.PI * f * tt - (lagDeg * Math.PI) / 180) + noise * g.n()); }
  }
  return { t, c1, c2 };
}
