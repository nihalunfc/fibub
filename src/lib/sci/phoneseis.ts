// Phone seismometer: turn accelerometer readings (arriving at uneven times) into an evenly sampled three-component
// record, remove gravity with a Butterworth highpass, and measure peak ground acceleration and the amplitude spectrum.
// Plain maths, no DOM. Filters and spectra come from dsp.ts.
import { butter, sosfiltfilt, detrend, taper, amplitudeSpectrum, dominant } from './dsp.ts';
import { numericColumns } from './num.ts';

export const G0 = 9.80665;
export type Rec = { fs: number; x: Float64Array; y: Float64Array; z: Float64Array; start: number; name?: string };

/** Sampling rate from timestamps (s): samples per second over the whole span. */
export function rateOf(t: ArrayLike<number>): number { return (t.length - 1) / (t[t.length - 1] - t[0]); }

/** Spread of the sample intervals: mean and standard deviation in seconds. */
export function jitter(t: ArrayLike<number>) {
  const d: number[] = []; for (let i = 1; i < t.length; i++) d.push(t[i] - t[i - 1]);
  const m = d.reduce((s, v) => s + v, 0) / d.length, sd = Math.sqrt(d.reduce((s, v) => s + (v - m) ** 2, 0) / Math.max(1, d.length - 1));
  return { mean: m, sd, max: Math.max(...d) };
}

/** Linear interpolation of v(t) onto t0 + i/fs, i = 0 .. n−1 (as numpy.interp). t must increase. */
export function interp(t: ArrayLike<number>, v: ArrayLike<number>, t0: number, fs: number, n: number): Float64Array {
  const out = new Float64Array(n);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const ti = t0 + i / fs;
    while (j < t.length - 2 && t[j + 1] <= ti) j++;
    if (ti <= t[0]) out[i] = v[0];
    else if (ti >= t[t.length - 1]) out[i] = v[t.length - 1];
    else { const f = (ti - t[j]) / (t[j + 1] - t[j]); out[i] = v[j] + f * (v[j + 1] - v[j]); }
  }
  return out;
}

/** Even record from uneven readings: rate = round(average rate) unless given; times in s. */
export function uniform(t: ArrayLike<number>, x: ArrayLike<number>, y: ArrayLike<number>, z: ArrayLike<number>, fs?: number): Rec {
  if (t.length < 8) throw new Error('Too few readings: record for at least a second');
  for (let i = 1; i < t.length; i++) if (!(t[i] > t[i - 1])) throw new Error(`Times must increase: reading ${i + 1} is not after reading ${i}`);
  const rate = fs ?? Math.max(1, Math.round(rateOf(t)));
  const n = Math.floor((t[t.length - 1] - t[0]) * rate) + 1;
  return { fs: rate, x: interp(t, x, t[0], rate, n), y: interp(t, y, t[0], rate, n), z: interp(t, z, t[0], rate, n), start: t[0] };
}

/**
 * Read a recording from text: columns time (s), x, y, z; or x, y, z with the sampling rate given. A time column
 * named with "ms" is in milliseconds. Returns the uneven times and values.
 */
export function parseRecording(text: string, fsGiven?: number) {
  const tab = numericColumns(text);
  if (tab.cols.length < 3) throw new Error(`Need columns time, x, y, z (or x, y, z and a sampling rate). Found ${tab.cols.length} column${tab.cols.length === 1 ? '' : 's'}`);
  const rows: number[][] = [];
  for (let i = 0; i < tab.rows; i++) { const r = tab.cols.slice(0, 4).map((c) => c[i]); if (r.every(Number.isFinite)) rows.push(r); }
  if (rows.length < 8) throw new Error('Fewer than 8 complete rows of numbers');
  if (tab.cols.length >= 4) {
    const ms = /ms|milli/i.test(tab.headers[0] ?? '');
    return { t: rows.map((r) => (ms ? r[0] / 1000 : r[0])), x: rows.map((r) => r[1]), y: rows.map((r) => r[2]), z: rows.map((r) => r[3]), timed: true };
  }
  if (!(fsGiven && fsGiven > 0)) throw new Error('Three columns (x, y, z) need the sampling rate: type it in Hz');
  return { t: rows.map((_, i) => i / fsGiven), x: rows.map((r) => r[0]), y: rows.map((r) => r[1]), z: rows.map((r) => r[2]), timed: false };
}

export type Opts = { hp: number; lp?: number; order: number; taper?: number };

/** Remove gravity and drift: linear detrend, taper, Butterworth highpass (or bandpass with lp), zero phase. */
export function clean(v: ArrayLike<number>, fs: number, o: Opts): Float64Array {
  let x = detrend(v);
  x = taper(x, o.taper ?? 0.05);
  const lp = o.lp && o.lp < fs / 2 ? o.lp : undefined;
  if (o.hp > 0) x = sosfiltfilt(butter(o.order, lp ? [o.hp, lp] : o.hp, lp ? 'bandpass' : 'highpass', fs), x);
  else if (lp) x = sosfiltfilt(butter(o.order, lp, 'lowpass', fs), x);
  return x;
}

/** Peak absolute value and where it is (sample index). */
export function peak(v: ArrayLike<number>) { let k = 0; for (let i = 1; i < v.length; i++) if (Math.abs(v[i]) > Math.abs(v[k])) k = i; return { a: Math.abs(v[k]), i: k }; }

/** Analyse a record: cleaned components, PGA per component and of the 3-D vector, spectra and dominant frequencies. */
export function analyse(r: Rec, o: Opts) {
  const comps = { x: clean(r.x, r.fs, o), y: clean(r.y, r.fs, o), z: clean(r.z, r.fs, o) };
  const n = r.x.length, vec = new Float64Array(n), hor = new Float64Array(n);
  for (let i = 0; i < n; i++) { vec[i] = Math.hypot(comps.x[i], comps.y[i], comps.z[i]); hor[i] = Math.hypot(comps.x[i], comps.y[i]); }
  const fmin = Math.max(o.hp, (2 * r.fs) / n);
  const per = (['x', 'y', 'z'] as const).map((k) => { const sp = amplitudeSpectrum(comps[k], r.fs); return { k, pga: peak(comps[k]), sp, dom: dominant(sp, fmin) }; });
  return { comps, per, vec: peak(vec), hor: peak(hor), fmin };
}

/** Rough felt-shaking words for a peak acceleration (fraction of g), only as a guide for scale. */
export function feel(pgaG: number): string {
  if (pgaG < 0.0005) return 'not felt by people (tiny)';
  if (pgaG < 0.003) return 'barely felt, if at all';
  if (pgaG < 0.03) return 'felt as light shaking';
  if (pgaG < 0.1) return 'strong shaking';
  return 'very strong: check your recording (a knock or a fall?)';
}

/** A made-up recording: phone flat on a table (gravity on z), quiet background, a passing lorry and a door slam. */
export function demo(): { t: number[]; x: number[]; y: number[]; z: number[] } {
  let s = 885; const rnd = () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296 - 0.5; };
  const t: number[] = [], x: number[] = [], y: number[] = [], z: number[] = [];
  let tt = 0;
  while (tt < 30) {
    t.push(+tt.toFixed(4));
    // Lorry: 12 Hz hum from 8 to 16 s, rising and falling. Door: a 3.2 Hz knock at 21 s, decaying.
    const lorry = tt > 8 && tt < 16 ? 0.035 * Math.sin((Math.PI * (tt - 8)) / 8) ** 2 * Math.sin(2 * Math.PI * 12 * tt) : 0;
    const door = tt > 21 ? 0.42 * Math.exp(-(tt - 21) / 0.35) * Math.sin(2 * Math.PI * 3.2 * (tt - 21)) : 0;
    x.push(0.12 + 0.004 * rnd() + 0.6 * door + 0.5 * lorry);
    y.push(-0.08 + 0.004 * rnd() + 0.3 * door + lorry);
    z.push(9.79 + 0.005 * rnd() + door + 0.3 * lorry);
    tt += 0.016 + 0.0008 * Math.sin(tt * 7) + 0.0006 * rnd(); // about 62 readings a second, a little uneven like a phone
  }
  return { t, x, y, z };
}
