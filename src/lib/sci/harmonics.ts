// Instrument harmonics: a windowed FFT spectrum (averaged over frames), peak picking with parabolic interpolation,
// the fundamental, harmonic amplitudes, inharmonicity (f_n = n f0 √(1 + B n²)) and the spectral centroid.
// Plain maths, no DOM: the page decodes the audio and passes samples in.

export type WindowKind = 'hann' | 'hamming' | 'blackman' | 'rect';
export function windowFn(kind: WindowKind, n: number): Float64Array {
  const w = new Float64Array(n), d = n; // periodic windows (DFT-even), as numpy/scipy get_window(fftbins=True)
  for (let i = 0; i < n; i++) {
    const x = (2 * Math.PI * i) / d;
    w[i] = kind === 'hann' ? 0.5 - 0.5 * Math.cos(x) : kind === 'hamming' ? 0.54 - 0.46 * Math.cos(x) : kind === 'blackman' ? 0.42 - 0.5 * Math.cos(x) + 0.08 * Math.cos(2 * x) : 1;
  }
  return w;
}

/** In-place radix-2 FFT of (re, im); length must be a power of two. */
export function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = (-2 * Math.PI) / len, wr = Math.cos(a), wi = Math.sin(a), h = len >> 1;
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < h; k++) {
        const p = i + k, q = p + h, tr = re[q] * cr - im[q] * ci, ti = re[q] * ci + im[q] * cr;
        re[q] = re[p] - tr; im[q] = im[p] - ti; re[p] += tr; im[p] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}

export type Spectrum = { fs: number; n: number; df: number; amp: Float64Array; frames: number };
/**
 * Amplitude spectrum (bins 0..n/2) of x from `start` for `length` samples, averaged over frames of n samples with
 * 50 % overlap (Welch, averaging power). Scaled so a sine of amplitude A shows A at its bin: 2|X| / Σw.
 */
export function spectrum(x: Float32Array | Float64Array | number[], fs: number, n: number, kind: WindowKind = 'hann', start = 0, length = x.length - start): Spectrum {
  const w = windowFn(kind, n), sw = w.reduce((s, v) => s + v, 0), half = n / 2 + 1, pow = new Float64Array(half);
  const end = Math.min(x.length, start + Math.max(length, n)), hop = n / 2, starts: number[] = [];
  for (let s = start; s + n <= end; s += hop) starts.push(s);
  if (!starts.length) starts.push(start);
  const re = new Float64Array(n), im = new Float64Array(n);
  for (const s of starts) {
    for (let i = 0; i < n; i++) { const v = s + i < x.length ? x[s + i] : 0; re[i] = v * w[i]; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k < half; k++) pow[k] += re[k] * re[k] + im[k] * im[k];
  }
  const frames = starts.length;
  const amp = new Float64Array(half);
  for (let k = 0; k < half; k++) amp[k] = (Math.sqrt(pow[k] / frames) * (k === 0 || k === n / 2 ? 1 : 2)) / sw;
  return { fs, n, df: fs / n, amp, frames };
}

export const db = (a: number) => 20 * Math.log10(Math.max(a, 1e-12));

export type Peak = { f: number; amp: number; db: number; bin: number };
/** Local maxima at least `floorDb` below the highest peak is the cut-off, refined by a parabola through the dB values of the 3 bins. */
export function peaks(s: Spectrum, o: { floorDb?: number; fMin?: number; fMax?: number; max?: number } = {}): Peak[] {
  const { amp, df } = s, L = Array.from(amp, db);
  const lo = Math.max(1, Math.ceil((o.fMin ?? 20) / df)), hi = Math.min(amp.length - 2, Math.floor((o.fMax ?? s.fs / 2) / df));
  let top = -Infinity; for (let k = lo; k <= hi; k++) top = Math.max(top, L[k]);
  const cut = top - (o.floorDb ?? 60), out: Peak[] = [];
  for (let k = lo; k <= hi; k++) {
    if (!(L[k] > L[k - 1] && L[k] >= L[k + 1] && L[k] > cut)) continue;
    const a = L[k - 1], b = L[k], c = L[k + 1], den = a - 2 * b + c, p = den ? (0.5 * (a - c)) / den : 0;
    const d = b - 0.25 * (a - c) * p;
    out.push({ f: (k + p) * df, db: d, amp: 10 ** (d / 20), bin: k });
  }
  out.sort((x, y) => y.amp - x.amp);
  return out.slice(0, o.max ?? 200);
}

/** The peak closest to f within ±tol (Hz), or null. */
const near = (ps: Peak[], f: number, tol: number) => { let best: Peak | null = null; for (const p of ps) if (Math.abs(p.f - f) <= tol && (!best || p.amp > best.amp)) best = p; return best; };

/**
 * Fundamental from the peaks: candidates are strong peaks divided by 1 to 6; each scores the summed amplitude of
 * peaks found near its first harmonics (within 3 %). The highest candidate scoring at least 90 % of the best wins,
 * so a sub-octave that matches the same peaks does not; peaks halfway between harmonics count against a candidate.
 */
export function fundamental(ps: Peak[], o: { fMin?: number; fMax?: number; harmonics?: number } = {}): number {
  const fMin = o.fMin ?? 25, fMax = o.fMax ?? 4200, H = o.harmonics ?? 10;
  const strong = ps.slice(0, 12), cands: number[] = [];
  for (const p of strong) for (let d = 1; d <= 6; d++) { const f = p.f / d; if (f >= fMin && f <= fMax) cands.push(f); }
  if (!cands.length) return NaN;
  // Peaks between the harmonics, at (h + ½) f0, count against a candidate: they mean the true fundamental is lower.
  const score = (f0: number) => {
    let s = 0;
    for (let h = 1; h <= H; h++) {
      const m = near(ps, h * f0, 0.03 * h * f0); if (m) s += m.amp;
      const b = near(ps, (h - 0.5) * f0, 0.03 * h * f0); if (b && h > 1) s -= b.amp;
    }
    return s;
  };
  const sc = cands.map((f) => ({ f, s: score(f) })), best = Math.max(...sc.map((c) => c.s));
  const ok = sc.filter((c) => c.s >= 0.9 * best).sort((a, b) => b.f - a.f)[0];
  // Refine: a weighted mean of matched harmonics' f/h for the lowest few harmonics.
  let num = 0, den = 0;
  for (let h = 1; h <= 4; h++) { const m = near(ps, h * ok.f, 0.03 * h * ok.f); if (m) { num += (m.f / h) * m.amp; den += m.amp; } }
  return den ? num / den : ok.f;
}

export type Harmonic = { n: number; f: number | null; db: number | null; rel: number | null; cents: number | null };
export type HarmonicFit = { f0: number; B: number; harmonics: Harmonic[]; found: number };
/**
 * Harmonic n is the strongest peak within ±f0/4 of where it is expected, following any stretching found so far.
 * Inharmonicity B and f0 come from the straight line (f_n / n)² = f0² + f0² B n² through the found harmonics.
 */
export function harmonicSeries(ps: Peak[], f0: number, count = 16, fsHalf = Infinity): HarmonicFit {
  const out: Harmonic[] = [];
  let B = 0, f = f0;
  const xs: number[] = [], ys: number[] = [];
  for (let n = 1; n <= count; n++) {
    const expect = n * f * Math.sqrt(1 + B * n * n);
    if (expect > fsHalf) { out.push({ n, f: null, db: null, rel: null, cents: null }); continue; }
    const m = near(ps, expect, f0 / 4);
    if (!m) { out.push({ n, f: null, db: null, rel: null, cents: null }); continue; }
    out.push({ n, f: m.f, db: m.db, rel: 0, cents: 1200 * Math.log2(m.f / (n * f0)) });
    xs.push(n * n); ys.push((m.f / n) ** 2);
    if (xs.length >= 3) { const fit = line(xs, ys); if (fit.a > 0) { f = Math.sqrt(fit.a); B = Math.max(0, fit.b / fit.a); } }
  }
  let F0 = f0, Bf = 0;
  if (xs.length >= 3) { const fit = line(xs, ys); if (fit.a > 0) { F0 = Math.sqrt(fit.a); Bf = fit.b / fit.a; } } else if (xs.length) F0 = Math.sqrt(ys[0]);
  const top = Math.max(...out.map((h) => h.db ?? -Infinity));
  for (const h of out) if (h.db != null) { h.rel = h.db - top; h.cents = 1200 * Math.log2(h.f! / (h.n * F0)); }
  return { f0: F0, B: Bf, harmonics: out, found: xs.length };
}
function line(x: number[], y: number[]): { a: number; b: number } {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; }
  const b = sxx ? sxy / sxx : 0; return { a: my - b * mx, b };
}

/** Spectral centroid (Hz): the amplitude-weighted mean frequency between fMin and fMax. */
export function centroid(s: Spectrum, fMin = 20, fMax = s.fs / 2): number {
  let num = 0, den = 0;
  for (let k = 0; k < s.amp.length; k++) { const f = k * s.df; if (f < fMin || f > fMax) continue; num += f * s.amp[k]; den += s.amp[k]; }
  return den ? num / den : NaN;
}

/** Note name and cents off 12-TET (A4 = ref) for a frequency. */
export function noteOf(f: number, ref = 440): { name: string; cents: number } {
  const N = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
  const m = 69 + 12 * Math.log2(f / ref), r = Math.round(m);
  return { name: `${N[((r % 12) + 12) % 12]}${Math.floor(r / 12) - 1}`, cents: 100 * (m - r) };
}

/** A test tone: partials n = 1..count at n f0 √(1 + B n²) with amplitude amp(n), plus optional noise from a seed. */
export function synth(fs: number, seconds: number, f0: number, o: { B?: number; count?: number; amp?: (n: number) => number; noise?: number; seed?: number } = {}): Float64Array {
  const N = Math.round(fs * seconds), x = new Float64Array(N), B = o.B ?? 0, amp = o.amp ?? ((n: number) => 1 / n);
  for (let n = 1; n <= (o.count ?? 10); n++) {
    const f = n * f0 * Math.sqrt(1 + B * n * n); if (f >= fs / 2) break;
    const a = amp(n), w = 2 * Math.PI * f / fs, ph = 0.3 * n;
    for (let i = 0; i < N; i++) x[i] += a * Math.sin(w * i + ph);
  }
  if (o.noise) { let s = o.seed ?? 1; for (let i = 0; i < N; i++) { s = (s * 16807) % 2147483647; x[i] += o.noise * (s / 2147483647 - 0.5); } }
  return x;
}
