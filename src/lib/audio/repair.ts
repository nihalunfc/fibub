// Sound repair for Audio repair (#T1020): noise reduction, hum notches, click removal, clipping repair.
// Plain TypeScript, no DOM, so it runs in a Web Worker; checks in tests/audio-dsp.mjs.
// - Noise reduction: power spectral subtraction with a learned noise profile (S. F. Boll, "Suppression of acoustic noise
//   in speech using spectral subtraction", IEEE Trans. ASSP 27(2), 1979) with over-subtraction, a gain floor and
//   smoothing of the gains over time and frequency to keep "musical noise" down (Berouti, Schwartz and Makhoul, ICASSP 1979).
// - Hum: second-order notch filters (R. Bristow-Johnson, "Audio EQ Cookbook") at the mains frequency and its harmonics,
//   run forwards and backwards so nothing is delayed.
// - Clicks: samples that a short linear-prediction (AR) model cannot explain are marked and filled in by predicting
//   forwards from the left and backwards from the right, cross-faded (after S. Godsill and P. Rayner, "Digital Audio
//   Restoration", Springer, 1998, ch. 5).
// - Clipping: runs of samples stuck at the clip level are redrawn with a cubic through the two samples each side.
import { stft, istft, chunked } from './stft.ts';

// ---------- Noise reduction ----------

/** Start (in samples) of the quietest stretch of `secs` seconds, ignoring digital silence. */
export function quietest(chans: Float32Array[], rate: number, secs = 0.5): number {
  const len = chans[0].length, win = Math.min(len, Math.round(rate * secs)), step = Math.max(1, Math.round(rate * 0.05));
  let best = Infinity, at = 0, bestAny = Infinity, atAny = 0;
  for (let s = 0; s + win <= len; s += step) {
    let e = 0;
    for (const c of chans) for (let i = s; i < s + win; i += 4) e += c[i] * c[i];
    const rms = Math.sqrt(e / ((win / 4) * chans.length));
    if (rms < bestAny) { bestAny = rms; atAny = s; }
    if (rms > 1e-5 && rms < best) { best = rms; at = s; }
  }
  return isFinite(best) ? at : atAny;
}

/** Noise profile: mean power per FFT bin over a stretch of the sound (all channels together). */
export function noiseProfile(chans: Float32Array[], start: number, end: number, n = 2048): Float32Array {
  const part = chans.map((c) => c.subarray(Math.max(0, start), Math.min(c.length, end)));
  const specs = stft(part, n, n / 4), { frames, bins } = specs[0], p = new Float32Array(bins);
  // Leave out the first and last frames, which hang over the edge of the stretch.
  const t0 = frames > 4 ? 2 : 0, t1 = frames > 4 ? frames - 2 : frames;
  for (const S of specs) for (let t = t0; t < t1; t++) for (let k = 0; k < bins; k++) { const i = t * bins + k; p[k] += S.re[i] * S.re[i] + S.im[i] * S.im[i]; }
  const cnt = Math.max(1, (t1 - t0) * specs.length);
  for (let k = 0; k < bins; k++) p[k] /= cnt;
  return p;
}

export type DenoiseOptions = { reduceDb?: number; smoothing?: number; over?: number; onProgress?: (f: number) => void };

/** Gains for one piece: sqrt(1 - over * noise / power), not below the floor, then averaged over nearby frames and bins. */
function denoisePart(chans: Float32Array[], profile: Float32Array, n: number, o: DenoiseOptions): Float32Array[] {
  const specs = stft(chans, n, n / 4), { frames, bins } = specs[0];
  const floor = Math.pow(10, -(o.reduceDb ?? 18) / 20), over = o.over ?? 2, sm = Math.max(0, Math.round(o.smoothing ?? 2));
  const g = new Float32Array(frames * bins);
  for (let i = 0; i < g.length; i++) {
    let pw = 0;
    for (const S of specs) pw += S.re[i] * S.re[i] + S.im[i] * S.im[i];
    pw /= specs.length;
    const v = pw > 0 ? 1 - (over * profile[i % bins]) / pw : 0;
    g[i] = Math.max(floor, Math.sqrt(Math.max(0, v)));
  }
  let G = g;
  if (sm > 0) {
    // Box average: 2·sm frames each way in time, sm bins each way in frequency.
    const rt = 2 * sm, rf = sm, tmp = new Float32Array(g.length);
    for (let t = 0; t < frames; t++) for (let k = 0; k < bins; k++) {
      let s = 0, c = 0;
      for (let u = Math.max(0, t - rt); u <= Math.min(frames - 1, t + rt); u++) { s += g[u * bins + k]; c++; }
      tmp[t * bins + k] = s / c;
    }
    G = new Float32Array(g.length);
    for (let t = 0; t < frames; t++) for (let k = 0; k < bins; k++) {
      let s = 0, c = 0;
      for (let u = Math.max(0, k - rf); u <= Math.min(bins - 1, k + rf); u++) { s += tmp[t * bins + u]; c++; }
      G[t * bins + k] = s / c;
    }
  }
  for (const S of specs) for (let i = 0; i < G.length; i++) { S.re[i] *= G[i]; S.im[i] *= G[i]; }
  return istft(specs, chans[0].length);
}

/** Reduce steady background noise using a profile from noiseProfile (same n). */
export function denoise(chans: Float32Array[], rate: number, profile: Float32Array, o: DenoiseOptions = {}): Float32Array[] {
  const n = (profile.length - 1) * 2, hop = n / 4, sm = Math.round(o.smoothing ?? 2);
  return chunked(chans, (p) => denoisePart(p, profile, n, o), { core: Math.max(rate * 15, 4 * n), margin: n + (2 * sm + 2) * hop, fade: n, onProgress: o.onProgress });
}

// ---------- Hum ----------

type Bq = [number, number, number, number, number];
/** RBJ cookbook notch at f (Hz) with quality Q, normalised [b0, b1, b2, a1, a2]. */
export function notch(f: number, rate: number, q: number): Bq {
  const w = (2 * Math.PI * f) / rate, al = Math.sin(w) / (2 * q), cw = Math.cos(w), a0 = 1 + al;
  return [1 / a0, (-2 * cw) / a0, 1 / a0, (-2 * cw) / a0, (1 - al) / a0];
}

function runBq(x: Float64Array, c: Bq): void {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const [b0, b1, b2, a1, a2] = c;
  for (let i = 0; i < x.length; i++) { const v = x[i], y = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = v; y2 = y1; y1 = y; x[i] = y; }
}

/** Notch out mains hum at `base` Hz (50 or 60) and its first `harmonics` multiples, each `widthHz` wide, with no delay. */
export function removeHum(chans: Float32Array[], rate: number, base: number, harmonics = 8, widthHz = 4): Float32Array[] {
  const filters: Bq[] = [];
  for (let h = 1; h <= harmonics; h++) { const f = base * h; if (f < rate * 0.45) filters.push(notch(f, rate, f / widthHz)); }
  return chans.map((c) => {
    const x = Float64Array.from(c);
    for (const q of filters) runBq(x, q);
    x.reverse();
    for (const q of filters) runBq(x, q);
    x.reverse();
    return Float32Array.from(x);
  });
}

/** Power at frequency f over x (Goertzel), per sample. */
function goertzelPower(x: Float32Array, f: number, rate: number): number {
  const w = (2 * Math.PI * f) / rate, c = 2 * Math.cos(w);
  let s1 = 0, s2 = 0;
  for (let i = 0; i < x.length; i++) { const s = x[i] + c * s1 - s2; s2 = s1; s1 = s; }
  return (s1 * s1 + s2 * s2 - c * s1 * s2) / (x.length * x.length);
}

/**
 * Is there mains hum, and at 50 or 60 Hz? Compares the power at the first 4 harmonics with the power a little to
 * each side (±7 to ±13 Hz), over up to 20 s from the quietest part. Returns the base and how far it stands out (dB).
 */
export function detectHum(chans: Float32Array[], rate: number): { hz: 50 | 60 | null; db: number; db50: number; db60: number } {
  const len = chans[0].length, take = Math.min(len, rate * 20), s = Math.max(0, Math.min(len - take, quietest(chans, rate, Math.min(take / rate, 2)) - Math.round(take / 2)));
  const x = new Float32Array(take);
  for (const c of chans) for (let i = 0; i < take; i++) x[i] += c[s + i] / chans.length;
  const score = (base: number) => {
    let on = 0, off = 0;
    for (let h = 1; h <= 4; h++) {
      const f = base * h;
      on += goertzelPower(x, f, rate);
      off += (goertzelPower(x, f - 7, rate) + goertzelPower(x, f + 7, rate) + goertzelPower(x, f - 13, rate) + goertzelPower(x, f + 13, rate)) / 4;
    }
    return 10 * Math.log10((on + 1e-20) / (off + 1e-20));
  };
  const db50 = score(50), db60 = score(60), best = db50 >= db60 ? 50 : 60, db = Math.max(db50, db60);
  return { hz: db >= 10 ? best : null, db, db50, db60 };
}

// ---------- Clicks ----------

/** Linear prediction coefficients a[1..p] (x[n] ≈ Σ a[k] x[n-k]) by autocorrelation and Levinson-Durbin. */
export function lpc(x: Float32Array | Float64Array, p: number): Float64Array {
  const n = x.length, r = new Float64Array(p + 1);
  for (let k = 0; k <= p; k++) { let s = 0; for (let i = k; i < n; i++) s += x[i] * x[i - k]; r[k] = s; }
  r[0] *= 1 + 1e-9; r[0] += 1e-12;
  const a = new Float64Array(p + 1), tmp = new Float64Array(p + 1);
  let e = r[0];
  for (let i = 1; i <= p; i++) {
    let acc = r[i];
    for (let j = 1; j < i; j++) acc -= a[j] * r[i - j];
    const k = acc / e;
    tmp.set(a);
    a[i] = k;
    for (let j = 1; j < i; j++) a[j] = tmp[j] - k * tmp[i - j];
    e *= 1 - k * k;
    if (e <= 0) break;
  }
  return a;
}

export type DeclickOptions = { sensitivity?: number; order?: number; maxGapMs?: number };

/**
 * Find and repair clicks in one channel. sensitivity is how many times the typical prediction error a sample must be
 * off to count as a click (lower finds more). Returns the repaired copy and how many clicks were fixed.
 */
export function declick(x: Float32Array, rate: number, o: DeclickOptions = {}): { out: Float32Array; clicks: number } {
  const p = o.order ?? 24, sens = o.sensitivity ?? 8, maxGap = Math.max(4, Math.round(((o.maxGapMs ?? 2) * rate) / 1000));
  const out = Float32Array.from(x), block = 4096, len = x.length;
  let clicks = 0;
  const hw = new Float64Array(block);
  for (let i = 0; i < block; i++) hw[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * (i + 0.5)) / block);
  const err = new Float64Array(block), absErr = new Float64Array(block);
  for (let b0 = 0; b0 < len; b0 += block) {
    const b1 = Math.min(len, b0 + block), m = b1 - b0;
    if (m <= 2 * p) break;
    const seg = new Float64Array(m);
    for (let i = 0; i < m; i++) seg[i] = x[b0 + i] * hw[Math.floor((i * block) / m)];
    const a = lpc(seg, p);
    for (let i = 0; i < m; i++) {
      const n = b0 + i;
      let pr = 0;
      for (let k = 1; k <= p; k++) pr += a[k] * (n - k >= 0 ? out[n - k] : 0);
      err[i] = x[n] - pr; absErr[i] = Math.abs(err[i]);
    }
    const sorted = absErr.slice(0, m).sort(), mad = sorted[m >> 1] * 1.4826;
    let peak = 0; for (let i = 0; i < m; i++) peak = Math.max(peak, Math.abs(x[b0 + i]));
    const thr = Math.max(sens * mad, 1e-4 * Math.max(peak, 1e-3), 1e-5);
    let i = p;
    while (i < m) {
      if (absErr[i] <= thr) { i++; continue; }
      // The click: from here until the error has been small for p samples (the spike also spoils the next predictions).
      let j = i, quiet = 0;
      while (j < m && quiet < 4) { if (absErr[j] > thr) quiet = 0; else quiet++; j++; }
      const s = b0 + i - 1, e = Math.min(len, b0 + j - 3); // gap [s, e)
      if (e - s <= maxGap && s - p >= 0 && e + p <= len) { fillGap(out, s, e, a, p); clicks++; }
      i = j;
    }
  }
  return { out, clicks };
}

/** Fill out[s..e) by AR prediction forwards from the left and backwards from the right, cross-faded. */
function fillGap(y: Float32Array, s: number, e: number, a: Float64Array, p: number): void {
  const g = e - s, f = new Float64Array(g), b = new Float64Array(g);
  const left = new Float64Array(p + g), right = new Float64Array(p + g);
  for (let k = 0; k < p; k++) left[k] = y[s - p + k];
  for (let i = 0; i < g; i++) { let v = 0; for (let k = 1; k <= p; k++) v += a[k] * left[p + i - k]; left[p + i] = v; f[i] = v; }
  // Backwards: the same coefficients predict a stationary AR process run in reverse.
  for (let k = 0; k < p; k++) right[k] = y[e + p - 1 - k];
  for (let i = 0; i < g; i++) { let v = 0; for (let k = 1; k <= p; k++) v += a[k] * right[p + i - k]; right[p + i] = v; b[g - 1 - i] = v; }
  for (let i = 0; i < g; i++) { const w = (i + 1) / (g + 1); y[s + i] = (1 - w) * f[i] + w * b[i]; }
}

// ---------- Clipping ----------

/**
 * Redraw clipped runs (3 or more samples in a row within 0.1 % of the loudest level) with a cubic through the two good
 * samples on each side. The result can go past the old clip level, so it is turned down to peak at `ceiling`.
 */
export function declip(chans: Float32Array[], ceiling = 0.98): { chans: Float32Array[]; runs: number; gain: number } {
  let peak = 0;
  for (const c of chans) for (let i = 0; i < c.length; i++) peak = Math.max(peak, Math.abs(c[i]));
  const lvl = peak * 0.999;
  let runs = 0;
  const out = chans.map((c) => {
    const y = Float32Array.from(c), n = c.length;
    let i = 2;
    while (i < n - 2) {
      if (Math.abs(c[i]) < lvl) { i++; continue; }
      let j = i; const sg = Math.sign(c[i]);
      while (j < n && Math.abs(c[j]) >= lvl && Math.sign(c[j]) === sg) j++;
      if (j - i >= 3 && i >= 2 && j + 1 < n) {
        const xs = [i - 2, i - 1, j, j + 1], ys = xs.map((k) => c[k]);
        for (let k = i; k < j; k++) {
          let v = 0;
          for (let a = 0; a < 4; a++) { let l = 1; for (let b = 0; b < 4; b++) if (b !== a) l *= (k - xs[b]) / (xs[a] - xs[b]); v += ys[a] * l; }
          // Keep the arch on the clipped side and no more than twice the clip level.
          y[k] = sg * Math.min(2 * peak, Math.max(peak, sg * v));
        }
        runs++;
      }
      i = j;
    }
    return y;
  });
  let np = 0;
  for (const c of out) for (let i = 0; i < c.length; i++) np = Math.max(np, Math.abs(c[i]));
  const gain = runs && np > ceiling ? ceiling / np : 1;
  if (gain !== 1) for (const c of out) for (let i = 0; i < c.length; i++) c[i] *= gain;
  return { chans: out, runs, gain };
}
