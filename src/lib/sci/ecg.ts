// ECG beat detection and heart rate variability. QRS detection follows Pan and Tompkins (1985): 5-15 Hz
// band-pass, derivative, squaring, 150 ms moving-window integration, adaptive signal and noise levels, a 200 ms
// refractory period, a T-wave slope test within 360 ms and a search back when no beat comes for 166 % of the
// average RR interval. HRV measures follow the 1996 Task Force definitions; the spectrum is a Lomb-Scargle
// periodogram of the uneven RR series (no resampling). The synthetic ECG is a sum of Gaussian waves per beat
// (P, Q, R, S, T), in the spirit of McSharry et al. (2003). For study and research, not for diagnosis. No DOM.
import { filtfilt, butterHigh, butterLow, seeded, bandIntegral } from './biosig.ts';
import { lombScargle } from './lombscargle.ts';

export type Polarity = 'auto' | 'up' | 'down';
export type Detection = { r: number[]; polarity: 'up' | 'down'; mwi: Float64Array; searchBack: number; tWaves: number };

const movAvg = (x: Float64Array, w: number) => {
  const n = x.length, c = new Float64Array(n + 1), out = new Float64Array(n), h = Math.floor(w / 2);
  for (let i = 0; i < n; i++) c[i + 1] = c[i] + x[i];
  for (let i = 0; i < n; i++) { const a = Math.max(0, i - h), b = Math.min(n, i - h + w); out[i] = (c[b] - c[a]) / w; }
  return out;
};

/**
 * Find the R peaks. `y` is the ECG to place the peaks on (normally the band-pass filtered trace); `raw` is the
 * signal Pan-Tompkins filters itself (5-15 Hz). Returns peak positions in samples, with sub-sample (parabola) refinement.
 */
export function panTompkins(raw: ArrayLike<number>, y: Float64Array, fs: number, polarity: Polarity = 'auto'): Detection {
  const n = y.length;
  if (n < fs * 2) throw new Error('The recording is shorter than 2 seconds.');
  const bp = filtfilt(raw, [butterHigh(5, fs), butterLow(Math.min(15, fs * 0.45), fs)]);
  const d = new Float64Array(n);
  for (let i = 2; i < n - 2; i++) d[i] = (2 * bp[i + 1] + bp[i + 2] - bp[i - 2] - 2 * bp[i - 1]) * fs / 8;
  const sq = d.map((v) => v * v), W = Math.max(3, Math.round(0.15 * fs)), mwi = movAvg(sq, W);
  const refr = Math.round(0.2 * fs);
  // Candidate peaks: local maxima of the integrated signal, at least 200 ms apart (the larger one wins).
  const cand: number[] = [];
  for (let i = 1; i < n - 1; i++) {
    if (!(mwi[i] > mwi[i - 1] && mwi[i] >= mwi[i + 1])) continue;
    const last = cand[cand.length - 1];
    if (last !== undefined && i - last < refr) { if (mwi[i] > mwi[last]) cand[cand.length - 1] = i; } else cand.push(i);
  }
  const L = Math.min(n, Math.round(2 * fs));
  let mx = 0, mean = 0;
  for (let i = 0; i < L; i++) { mx = Math.max(mx, mwi[i]); mean += mwi[i] / L; }
  let SPKI = mx / 3, NPKI = mean / 2, THR1 = NPKI + 0.25 * (SPKI - NPKI), THR2 = 0.5 * THR1;
  const slope = (c: number) => { let m = 0; for (let i = Math.max(0, c - W); i <= c; i++) m = Math.max(m, Math.abs(d[i])); return m; };
  const qrs: number[] = [], isQ = new Set<number>();
  let searchBack = 0, tWaves = 0;
  const rrAvg = () => { const k = qrs.length; if (k < 3) return Infinity; const m = Math.min(8, k - 1); return (qrs[k - 1] - qrs[k - 1 - m]) / m; };
  const upd = () => { THR1 = NPKI + 0.25 * (SPKI - NPKI); THR2 = 0.5 * THR1; };
  for (let ci = 0; ci < cand.length; ci++) {
    const c = cand[ci];
    // Search back for a missed beat when the gap since the last one is too long.
    for (let guard = 0; guard < 10; guard++) {
      const last = qrs[qrs.length - 1], avg = rrAvg();
      if (last === undefined || !(c - last > 1.66 * avg)) break;
      let best = -1;
      for (let j = 0; j < ci; j++) { const k = cand[j]; if (k > last + refr && k < c - refr && !isQ.has(k) && mwi[k] > THR2 && (best < 0 || mwi[k] > mwi[best])) best = k; }
      if (best < 0) break;
      qrs.push(best); isQ.add(best); SPKI = 0.25 * mwi[best] + 0.75 * SPKI; upd(); searchBack++;
    }
    const pk = mwi[c], last = qrs[qrs.length - 1];
    if (pk > THR1) {
      if (last !== undefined && c - last < 0.36 * fs && slope(c) < 0.5 * slope(last)) { NPKI = 0.125 * pk + 0.875 * NPKI; tWaves++; upd(); continue; }
      if (last !== undefined && c - last < refr) { NPKI = 0.125 * pk + 0.875 * NPKI; upd(); continue; }
      qrs.push(c); isQ.add(c); SPKI = 0.125 * pk + 0.875 * SPKI;
    } else NPKI = 0.125 * pk + 0.875 * NPKI;
    upd();
  }
  qrs.sort((a, b) => a - b);
  // Place each beat on the R wave of `y` within ±100 ms of the integrator peak.
  const h = Math.round(0.1 * fs), med = (a: number, b: number) => { const s = Array.from(y.subarray(a, b)).sort((p, q) => p - q); return s[Math.floor(s.length / 2)]; };
  let pol: 'up' | 'down' = polarity === 'down' ? 'down' : 'up';
  if (polarity === 'auto') {
    let up = 0, dn = 0;
    for (const c of qrs) { const a = Math.max(0, c - h), b = Math.min(n, c + h + 1), m = med(a, b); let hi = -Infinity, lo = Infinity; for (let i = a; i < b; i++) { hi = Math.max(hi, y[i]); lo = Math.min(lo, y[i]); } up += hi - m; dn += m - lo; }
    pol = dn > up * 1.15 ? 'down' : 'up';
  }
  const sgn = pol === 'up' ? 1 : -1, r: number[] = [];
  for (const c of qrs) {
    const a = Math.max(1, c - h), b = Math.min(n - 2, c + h);
    let k = a;
    for (let i = a; i <= b; i++) if (sgn * y[i] > sgn * y[k]) k = i;
    const y0 = y[k - 1], y1 = y[k], y2 = y[k + 1], den = y0 - 2 * y1 + y2;
    const off = den !== 0 ? (y0 - y2) / (2 * den) : 0;
    const pos = k + (Math.abs(off) < 1 ? off : 0);
    if (!r.length || pos - r[r.length - 1] >= refr) r.push(pos);
    else if (sgn * y1 > sgn * y[Math.round(r[r.length - 1])]) r[r.length - 1] = pos;
  }
  return { r, polarity: pol, mwi, searchBack, tWaves };
}

export type Hrv = {
  rr: number[]; tBeat: number[]; keep: boolean[]; nn: number[]; removed: number;
  meanRR: number; meanHR: number; minHR: number; maxHR: number; sdnn: number; rmssd: number; sdsd: number; nn50: number; pnn50: number; nDiff: number;
  sd1: number; sd2: number; poincare: [number, number][];
};

/**
 * Time-domain HRV from beat times in seconds. An RR interval is set aside when it lies outside 250-2500 ms or
 * differs by more than `tol` (fraction; 0 = off) from the median of the 11 intervals around it. Successive
 * differences use only neighbouring intervals that were both kept. SD = sample standard deviation (n − 1).
 */
export function hrvTime(beats: number[], tol = 0.2): Hrv {
  const rr = beats.slice(1).map((b, i) => (b - beats[i]) * 1000), tBeat = beats.slice(1);
  if (rr.length < 3) throw new Error('Fewer than 4 beats were found, too few for heart rate variability.');
  const keep = rr.map((v, i) => {
    if (v < 250 || v > 2500) return false;
    if (!(tol > 0)) return true;
    const w = rr.slice(Math.max(0, i - 5), i + 6).sort((a, b) => a - b), m = w[Math.floor(w.length / 2)];
    return Math.abs(v - m) <= tol * m;
  });
  const nn = rr.filter((_, i) => keep[i]);
  if (nn.length < 3) throw new Error('Too few intervals are left after removing the irregular ones.');
  const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
  const sd = (a: number[]) => { const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };
  const diffs: number[] = [], poincare: [number, number][] = [];
  for (let i = 1; i < rr.length; i++) if (keep[i] && keep[i - 1]) { diffs.push(rr[i] - rr[i - 1]); poincare.push([rr[i - 1], rr[i]]); }
  const meanRR = mean(nn), sdnn = sd(nn);
  const rmssd = diffs.length ? Math.sqrt(mean(diffs.map((v) => v * v))) : NaN;
  const sdsd = diffs.length > 1 ? sd(diffs) : NaN;
  const nn50 = diffs.filter((v) => Math.abs(v) > 50).length;
  const hr = nn.map((v) => 60000 / v);
  const sd1 = sdsd / Math.SQRT2, sd2 = Math.sqrt(2 * sdnn * sdnn - sd1 * sd1);
  return { rr, tBeat, keep, nn, removed: rr.length - nn.length, meanRR, meanHR: mean(hr), minHR: Math.min(...hr), maxHR: Math.max(...hr), sdnn, rmssd, sdsd, nn50, pnn50: diffs.length ? 100 * nn50 / diffs.length : NaN, nDiff: diffs.length, sd1, sd2, poincare };
}

export type HrvFreq = { f: Float64Array; psd: Float64Array; vlf: number; lf: number; hf: number; total: number; lfhf: number; lfnu: number; hfnu: number; peakLF: number; peakHF: number };
export const BANDS = { vlf: [0.003, 0.04], lf: [0.04, 0.15], hf: [0.15, 0.4] } as const;

/**
 * Frequency-domain HRV: Lomb-Scargle periodogram of the kept RR intervals (ms) at their beat times (s), on a
 * 0.0005 Hz grid up to 0.5 Hz. The normalised power is scaled to a density in ms²/Hz as p(f) × variance × record
 * length, so a sine of amplitude A ms adds about A²/2 ms² to its band. Band powers by the trapezoid rule.
 */
export function hrvFreq(t: number[], rr: number[], detrend = true): HrvFreq {
  if (rr.length < 10) throw new Error('At least 10 intervals are needed for the spectrum.');
  let y = rr.slice();
  if (detrend) {
    const n = t.length, mt = t.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
    let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (t[i] - mt) * (y[i] - my); sxx += (t[i] - mt) ** 2; }
    const b = sxx > 0 ? sxy / sxx : 0; y = y.map((v, i) => v - b * (t[i] - mt));
  }
  const df = 0.0005, nf = 1000, p = lombScargle(t, y, null, df, df * nf, nf);
  const n = y.length, m = y.reduce((s, v) => s + v, 0) / n, varPop = y.reduce((s, v) => s + (v - m) ** 2, 0) / n;
  const T = p.span, psd = p.power.map((v) => v * varPop * T);
  const vlf = bandIntegral(p.freq, psd, ...BANDS.vlf), lf = bandIntegral(p.freq, psd, ...BANDS.lf), hf = bandIntegral(p.freq, psd, ...BANDS.hf);
  const peak = (lo: number, hi: number) => { let k = -1; for (let i = 0; i < nf; i++) if (p.freq[i] >= lo && p.freq[i] <= hi && (k < 0 || psd[i] > psd[k])) k = i; return k < 0 ? NaN : p.freq[k]; };
  return { f: p.freq, psd, vlf, lf, hf, total: vlf + lf + hf, lfhf: lf / hf, lfnu: 100 * lf / (lf + hf), hfnu: 100 * hf / (lf + hf), peakLF: peak(...BANDS.lf), peakHF: peak(...BANDS.hf) };
}

export type SynthOpts = { fs: number; dur: number; hr: number; lfAmp: number; hfAmp: number; lfFreq: number; hfFreq: number; jitter: number; noise: number; wander: number; mains: number; mainsFreq: number; seed: number };
export const SYNTH: SynthOpts = { fs: 250, dur: 180, hr: 68, lfAmp: 40, hfAmp: 30, lfFreq: 0.1, hfFreq: 0.25, jitter: 8, noise: 0.03, wander: 0.15, mains: 0.04, mainsFreq: 50, seed: 7 };

/**
 * A made-up single-lead ECG (mV): each beat is five Gaussian waves (P, Q, R, S, T) placed around its R time; RR
 * intervals swing with a slow (LF) and a breathing (HF) rhythm plus random jitter (amplitudes in ms). Baseline
 * wander, mains hum and white noise are added. Returns the samples and the true R times in seconds.
 */
export function synthEcg(o: Partial<SynthOpts> = {}) {
  const s = { ...SYNTH, ...o }, rnd = seeded(s.seed), n = Math.round(s.fs * s.dur), x = new Float64Array(n);
  const beats: number[] = [];
  for (let t = 0.4; t < s.dur - 0.4;) {
    beats.push(t);
    const rr = 60 / s.hr + (s.lfAmp * Math.sin(2 * Math.PI * s.lfFreq * t) + s.hfAmp * Math.sin(2 * Math.PI * s.hfFreq * t) + s.jitter * rnd.g()) / 1000;
    t += Math.max(0.3, rr);
  }
  const waves = (rr: number) => { const q = Math.sqrt(rr); return [[-0.2 * q, 0.15, 0.025], [-0.03, -0.12, 0.01], [0, 1.2, 0.01], [0.03, -0.25, 0.01], [0.28 * q, 0.3, 0.06 * q]]; };
  beats.forEach((tb, k) => {
    const rr = k + 1 < beats.length ? beats[k + 1] - tb : beats[k] - beats[k - 1];
    for (const [dt, a, w] of waves(rr)) {
      const c = tb + dt, i0 = Math.max(0, Math.floor((c - 5 * w) * s.fs)), i1 = Math.min(n - 1, Math.ceil((c + 5 * w) * s.fs));
      for (let i = i0; i <= i1; i++) { const u = (i / s.fs - c) / w; x[i] += a * Math.exp(-0.5 * u * u); }
    }
  });
  for (let i = 0; i < n; i++) { const t = i / s.fs; x[i] += s.wander * Math.sin(2 * Math.PI * 0.3 * t + 0.5) + s.mains * Math.sin(2 * Math.PI * s.mainsFreq * t) + s.noise * rnd.g(); }
  return { x, beats, fs: s.fs };
}
