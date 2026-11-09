// Gait and cadence from accelerometer data: magnitude, Butterworth low-pass (zero phase, as scipy filtfilt),
// step detection by peak finding (as scipy.signal.find_peaks with height and distance), cadence, step-time
// variability and a spectrum. Plain maths, no DOM.

export type Accel = { t: number[]; ax: number[]; ay: number[]; az: number[]; unitNote: string };

const median = (v: number[]) => { const s = [...v].sort((a, b) => a - b), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };

/** Rows of t, ax, ay, az (a header row is optional). Times in ms are turned into seconds (median step over 0.5). */
export function parseAccel(text: string): Accel {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const t: number[] = [], ax: number[] = [], ay: number[] = [], az: number[] = [];
  lines.forEach((l, i) => {
    const c = l.split(/[\t,; ]+/).filter(Boolean);
    if (i === 0 && c.some((x) => /[a-z]/i.test(x) && !/^[-+]?\d/.test(x))) return;
    if (c.length < 4) throw new Error(`Line ${i + 1}: need 4 numbers: t, ax, ay, az.`);
    const v = c.slice(0, 4).map(Number);
    if (v.some((x) => !Number.isFinite(x))) throw new Error(`Line ${i + 1}: "${l.slice(0, 40)}" has something that is not a number.`);
    t.push(v[0]); ax.push(v[1]); ay.push(v[2]); az.push(v[3]);
  });
  if (t.length < 20) throw new Error('Need at least 20 samples (rows).');
  for (let i = 1; i < t.length; i++) if (!(t[i] > t[i - 1])) throw new Error(`Line ${i + 1}: the time must rise from row to row.`);
  const dt = median(t.slice(1).map((x, i) => x - t[i]));
  let unitNote = 'Times read as seconds.';
  if (dt > 0.5) { for (let i = 0; i < t.length; i++) t[i] /= 1000; unitNote = 'Times read as milliseconds.'; }
  const t0 = t[0];
  for (let i = 0; i < t.length; i++) t[i] -= t0;
  return { t, ax, ay, az, unitNote };
}

/** The sampling rate (Hz) from the median time step. */
export const sampleRate = (t: number[]) => 1 / median(t.slice(1).map((x, i) => x - t[i]));

/** Linear interpolation of (t, y) onto t = 0, 1/fs, 2/fs, … up to the last time (as numpy.interp). */
export function resample(t: number[], y: number[], fs: number): { t: number[]; y: number[] } {
  const n = Math.floor(t[t.length - 1] * fs + 1e-9) + 1, tt: number[] = [], yy: number[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const x = i / fs;
    while (j < t.length - 2 && t[j + 1] < x) j++;
    const f = (x - t[j]) / (t[j + 1] - t[j]);
    tt.push(x); yy.push(x <= t[0] ? y[0] : x >= t[t.length - 1] ? y[y.length - 1] : y[j] + Math.max(0, Math.min(1, f)) * (y[j + 1] - y[j]));
  }
  return { t: tt, y: yy };
}

/** Second-order Butterworth low-pass coefficients (as scipy.signal.butter(2, fc, fs=fs)). */
export function butter2(fc: number, fs: number): { b: number[]; a: number[] } {
  const K = Math.tan((Math.PI * fc) / fs), K2 = K * K, n = 1 / (1 + Math.SQRT2 * K + K2);
  const b0 = K2 * n;
  return { b: [b0, 2 * b0, b0], a: [1, 2 * (K2 - 1) * n, (1 - Math.SQRT2 * K + K2) * n] };
}
function lfilter(b: number[], a: number[], x: number[], zi: [number, number]): number[] {
  let z0 = zi[0], z1 = zi[1];
  const y = new Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const yi = b[0] * x[i] + z0;
    z0 = b[1] * x[i] - a[1] * yi + z1;
    z1 = b[2] * x[i] - a[2] * yi;
    y[i] = yi;
  }
  return y;
}
/** Steady-state initial conditions for a step input (as scipy.signal.lfilter_zi), for order 2. */
function lfilterZi(b: number[], a: number[]): [number, number] {
  // Solve (I − Aᵀ) zi = B with A the companion matrix of a, B = b[1:] − a[1:] b[0].
  const B1 = b[1] - a[1] * b[0], B2 = b[2] - a[2] * b[0];
  // I − Aᵀ = [[1 + a1, −1], [a2, 1]]
  const det = (1 + a[1]) + a[2];
  return [(B1 + B2) / det, (-a[2] * B1 + (1 + a[1]) * B2) / det];
}
/** Zero-phase filtering (as scipy.signal.filtfilt with its default odd padding of 3 × max(len(a), len(b)) samples). */
export function filtfilt(b: number[], a: number[], x: number[]): number[] {
  const pad = 3 * Math.max(a.length, b.length);
  if (x.length <= pad) throw new Error(`Need more than ${pad} samples to filter.`);
  const ext = [...Array.from({ length: pad }, (_, i) => 2 * x[0] - x[pad - i]), ...x, ...Array.from({ length: pad }, (_, i) => 2 * x[x.length - 1] - x[x.length - 2 - i])];
  const zi = lfilterZi(b, a);
  let y = lfilter(b, a, ext, [zi[0] * ext[0], zi[1] * ext[0]]);
  y.reverse();
  y = lfilter(b, a, y, [zi[0] * y[0], zi[1] * y[0]]);
  y.reverse();
  return y.slice(pad, pad + x.length);
}

/** Peaks as scipy.signal.find_peaks(x, height=h, distance=d): local maxima (plateau middles), at least h, at least d samples apart (higher peaks win). */
export function findPeaks(x: number[], height: number, distance: number): number[] {
  const peaks: number[] = [];
  const n = x.length;
  let i = 1;
  while (i < n - 1) {
    if (x[i - 1] < x[i]) {
      let ia = i + 1;
      while (ia < n - 1 && x[ia] === x[i]) ia++;
      if (x[ia] < x[i]) { peaks.push(Math.floor((i + ia - 1) / 2)); i = ia; }
    }
    i++;
  }
  const hp = peaks.filter((p) => x[p] >= height);
  const d = Math.ceil(distance);
  if (d <= 1) return hp;
  const keep = hp.map(() => true);
  const order = hp.map((_, k) => k).sort((p, q) => x[hp[p]] - x[hp[q]]);
  for (let o = order.length - 1; o >= 0; o--) {
    const j = order[o];
    if (!keep[j]) continue;
    for (let k = j - 1; k >= 0 && hp[j] - hp[k] < d; k--) keep[k] = false;
    for (let k = j + 1; k < hp.length && hp[k] - hp[j] < d; k++) keep[k] = false;
  }
  return hp.filter((_, k) => keep[k]);
}

/** Amplitude spectrum of x (mean removed, zero-padded to a power of two): frequencies (Hz) and |X|·2/n. */
export function spectrum(x: number[], fs: number): { f: number[]; a: number[] } {
  const n = x.length, m = x.reduce((p, q) => p + q, 0) / n;
  let N = 1; while (N < n) N *= 2;
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < n; i++) re[i] = x[i] - m;
  // iterative radix-2 FFT
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < N; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
  const f: number[] = [], a: number[] = [];
  for (let k = 0; k <= N / 2; k++) { f.push((k * fs) / N); a.push((Math.hypot(re[k], im[k]) * 2) / n); }
  return { f, a };
}

export type GaitOpts = { fc: number; minStep: number; k: number };
export type Gait = {
  fs: number; t: number[]; mag: number[]; filt: number[]; peaks: number[]; stepTimes: number[]; intervals: number[];
  steps: number; duration: number; cadence: number; meanStep: number; sdStep: number; cvStep: number;
  strides: number[]; meanStride: number; cvStride: number; spec: { f: number[]; a: number[] }; domF: number; specCadence: number; threshold: number;
};
const meanSd = (v: number[]) => { const n = v.length, m = v.reduce((a, b) => a + b, 0) / n; return { m, sd: n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)) : NaN }; };

/**
 * The whole analysis: magnitude √(ax² + ay² + az²) per sample, resampled to the median rate, mean removed,
 * low-passed at fc Hz, then peaks at least k × SD above the mean and at least minStep seconds apart are steps.
 */
export function analyse(d: Accel, o: GaitOpts): Gait {
  const fs = sampleRate(d.t);
  if (!(o.fc > 0 && o.fc < fs / 2)) throw new Error(`The filter cut-off must be between 0 and ${+(fs / 2).toFixed(1)} Hz (half the sampling rate).`);
  const raw = d.t.map((_, i) => Math.hypot(d.ax[i], d.ay[i], d.az[i]));
  const r = resample(d.t, raw, fs);
  const m = r.y.reduce((a, b) => a + b, 0) / r.y.length, mag = r.y.map((v) => v - m);
  const { b, a } = butter2(o.fc, fs);
  const filt = filtfilt(b, a, mag);
  const sd = Math.sqrt(filt.reduce((p, v) => p + v * v, 0) / filt.length);
  const threshold = o.k * sd;
  const peaks = findPeaks(filt, threshold, o.minStep * fs);
  const stepTimes = peaks.map((p) => r.t[p]);
  const intervals = stepTimes.slice(1).map((x, i) => x - stepTimes[i]);
  const st = intervals.length ? meanSd(intervals) : { m: NaN, sd: NaN };
  const strides = stepTimes.slice(2).map((x, i) => x - stepTimes[i]);
  const sr = strides.length ? meanSd(strides) : { m: NaN, sd: NaN };
  const spec = spectrum(mag, fs);
  let bi = -1;
  for (let k = 0; k < spec.f.length; k++) if (spec.f[k] >= 0.5 && spec.f[k] <= 4 && (bi < 0 || spec.a[k] > spec.a[bi])) bi = k;
  const domF = bi >= 0 ? spec.f[bi] : NaN;
  const span = stepTimes.length > 1 ? stepTimes[stepTimes.length - 1] - stepTimes[0] : NaN;
  return {
    fs, t: r.t, mag, filt, peaks, stepTimes, intervals, steps: peaks.length, duration: r.t[r.t.length - 1],
    cadence: (60 * (peaks.length - 1)) / span, meanStep: st.m, sdStep: st.sd, cvStep: (100 * st.sd) / st.m,
    strides, meanStride: sr.m, cvStride: (100 * sr.sd) / sr.m, spec, domF, specCadence: domF * 60, threshold,
  };
}

/** A made-up walk for the example: fs Hz for secs seconds at stepHz steps a second, with a little jitter and noise. */
export function syntheticWalk(fs = 50, secs = 20, stepHz = 1.85, seed = 7): string {
  let s = seed >>> 0;
  const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
  const rows = ['t,ax,ay,az'];
  let phase = 0;
  for (let i = 0; i < fs * secs; i++) {
    const t = i / fs;
    phase += (2 * Math.PI * stepHz * (1 + 0.03 * Math.sin(2 * Math.PI * 0.11 * t))) / fs;
    const v = 2.4 * Math.sin(phase) + 0.7 * Math.sin(2 * phase + 0.6);
    const ax = 0.9 * Math.sin(phase / 2) + 0.25 * gauss(), ay = 0.3 * Math.sin(phase + 1) + 0.2 * gauss(), az = 9.81 + v + 0.35 * gauss();
    rows.push(`${t.toFixed(3)},${ax.toFixed(3)},${ay.toFixed(3)},${az.toFixed(3)}`);
  }
  return rows.join('\n') + '\n';
}
