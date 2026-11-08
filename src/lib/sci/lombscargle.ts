// Generalised Lomb-Scargle periodogram (Zechmeister and Kürster 2009): a floating mean and
// weights from the errors, normalised so a perfect sine gives 1. False alarm probabilities use
// Baluev's (2008) approximation, as in astropy's LombScargle.false_alarm_probability(method="baluev").
import { logGamma } from './stats.ts';

export type Periodogram = { freq: Float64Array; power: Float64Array; N: number; span: number };

export function lombScargle(t: number[], y: number[], dy: number[] | null, fmin: number, fmax: number, nf: number): Periodogram {
  const N = t.length;
  if (N < 5) throw new Error('Need at least 5 measurements');
  if (!(fmax > fmin && fmin > 0)) throw new Error('The shortest period must be below the longest');
  const w0 = dy ? dy.map((e) => 1 / (e * e)) : t.map(() => 1), W = w0.reduce((a, b) => a + b, 0), w = w0.map((x) => x / W);
  const Y = w.reduce((s, wi, i) => s + wi * y[i], 0), YY = w.reduce((s, wi, i) => s + wi * y[i] * y[i], 0) - Y * Y;
  if (!(YY > 0)) throw new Error('All the values are the same');
  const t0 = t[0];
  const C = new Float64Array(nf), S = new Float64Array(nf), YC = new Float64Array(nf), YS = new Float64Array(nf), CC = new Float64Array(nf), CS = new Float64Array(nf);
  const df = (fmax - fmin) / (nf - 1);
  for (let i = 0; i < N; i++) {
    const ti = t[i] - t0, wi = w[i], wy = wi * y[i];
    // Rotate (cos, sin) of 2π f t from one frequency to the next; re-anchor every 512 steps to stop drift.
    const dc = Math.cos(2 * Math.PI * df * ti), ds = Math.sin(2 * Math.PI * df * ti);
    let c = 0, s = 0;
    for (let k = 0; k < nf; k++) {
      if (k % 512 === 0) { const a = 2 * Math.PI * (fmin + k * df) * ti; c = Math.cos(a); s = Math.sin(a); }
      C[k] += wi * c; S[k] += wi * s; YC[k] += wy * c; YS[k] += wy * s; CC[k] += wi * c * c; CS[k] += wi * c * s;
      const c2 = c * dc - s * ds; s = s * dc + c * ds; c = c2;
    }
  }
  const freq = new Float64Array(nf), power = new Float64Array(nf);
  for (let k = 0; k < nf; k++) {
    const yc = YC[k] - Y * C[k], ys = YS[k] - Y * S[k], cc = CC[k] - C[k] * C[k], ss = 1 - CC[k] - S[k] * S[k], cs = CS[k] - C[k] * S[k];
    const D = cc * ss - cs * cs;
    freq[k] = fmin + k * df;
    power[k] = D > 1e-15 ? (ss * yc * yc + cc * ys * ys - 2 * cs * yc * ys) / (YY * D) : 0;
  }
  return { freq, power, N, span: Math.max(...t) - Math.min(...t) };
}

/** Probability that noise alone would give a peak this high somewhere up to fmax (Baluev 2008). */
export function falseAlarm(z: number, N: number, fmax: number, t: number[], dy: number[] | null) {
  if (!(z > 0)) return 1;
  if (z >= 1) return 0;
  const w0 = dy ? dy.map((e) => 1 / (e * e)) : t.map(() => 1), W = w0.reduce((a, b) => a + b, 0);
  const tm = t.reduce((s, x, i) => s + w0[i] * x, 0) / W, vt = t.reduce((s, x, i) => s + w0[i] * (x - tm) ** 2, 0) / W;
  const Teff = Math.sqrt(4 * Math.PI * vt), NH = N - 1, NK = N - 3;
  const gamma = Math.sqrt(2 / NH) * Math.exp(logGamma(NH / 2) - logGamma((NH - 1) / 2));
  const tau = gamma * fmax * Teff * (1 - z) ** (0.5 * (NK - 1)) * Math.sqrt(0.5 * NH * z);
  const cdf = 1 - (1 - z) ** (0.5 * NK);
  return Math.min(1, Math.max(0, 1 - cdf * Math.exp(-tau)));
}

/** The highest separate peaks: each must stand out from its neighbours by more than one peak width (1/span). */
export function peaks(p: Periodogram, n = 5) {
  const idx: number[] = [];
  for (let k = 1; k < p.power.length - 1; k++) if (p.power[k] >= p.power[k - 1] && p.power[k] >= p.power[k + 1]) idx.push(k);
  idx.sort((a, b) => p.power[b] - p.power[a]);
  const width = 1 / p.span, out: number[] = [];
  for (const k of idx) { if (out.every((j) => Math.abs(p.freq[j] - p.freq[k]) > width)) out.push(k); if (out.length >= n) break; }
  // Refine each peak with a parabola through its three samples.
  return out.map((k) => {
    const y0 = p.power[k - 1], y1 = p.power[k], y2 = p.power[k + 1], d = (y0 - y2) / (2 * (y0 - 2 * y1 + y2) || 1), df = p.freq[1] - p.freq[0];
    return { freq: p.freq[k] + (Math.abs(d) < 1 ? d * df : 0), power: y1 };
  });
}

/** Phase in [0, 1) of each time for a period, with phase 0 at epoch t0. */
export const phase = (t: number[], period: number, t0 = 0) => t.map((x) => { const f = (x - t0) / period; return f - Math.floor(f); });
