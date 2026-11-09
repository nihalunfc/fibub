// Optical tweezers calibration: trap stiffness from the power spectrum of a trapped bead's position (Lorentzian or
// aliased Lorentzian fit, Stokes drag with Faxén's correction) and from equipartition. Plain TypeScript, no DOM.
import { fft } from './phmri.ts';
import { levenbergMarquardt } from './fit.ts';
import { rng } from './phct.ts';

export const KB = 1.380649e-23; // J/K, exact (SI 2019)

/** Stokes drag γ = 6πηr (N·s/m) for viscosity η (Pa·s) and radius r (m); with height h (m) of the bead centre above a surface, Faxén's correction. */
export function drag(eta: number, r: number, h?: number): number {
  const g0 = 6 * Math.PI * eta * r;
  if (!h) return g0;
  const a = r / h;
  return g0 / (1 - (9 / 16) * a + (1 / 8) * a ** 3 - (45 / 256) * a ** 4 - (1 / 16) * a ** 5);
}

/**
 * Averaged one-sided periodogram (Welch with a rectangular window, no overlap, each segment's mean removed):
 * P_k = 2Δt/L |Σ x e^(−2πikn/L)|², averaged over segments. DC and Nyquist bins are left out.
 */
export function psd(x: ArrayLike<number>, fs: number, L: number): { f: number[]; P: number[]; segments: number } {
  const n = Math.floor(x.length / L);
  if (n < 1) throw new Error(`Need at least ${L} points for one segment`);
  const acc = new Float64Array(L / 2);
  const re = new Float64Array(L), im = new Float64Array(L);
  for (let s = 0; s < n; s++) {
    let m = 0; for (let i = 0; i < L; i++) m += x[s * L + i]; m /= L;
    for (let i = 0; i < L; i++) { re[i] = x[s * L + i] - m; im[i] = 0; }
    fft(re, im);
    for (let k = 1; k < L / 2; k++) acc[k] += (re[k] ** 2 + im[k] ** 2);
  }
  const f: number[] = [], P: number[] = [];
  for (let k = 1; k < L / 2; k++) { f.push((k * fs) / L); P.push((2 / (fs * L)) * acc[k] / n); }
  return { f, P, segments: n };
}
/** Average neighbouring frequency bins in blocks of b (the last partial block is dropped). */
export function block(f: number[], P: number[], b: number) {
  if (b <= 1) return { f: f.slice(), P: P.slice() };
  const F: number[] = [], Q: number[] = [];
  for (let i = 0; i + b <= f.length; i += b) { let sf = 0, sp = 0; for (let j = i; j < i + b; j++) { sf += f[j]; sp += P[j]; } F.push(sf / b); Q.push(sp / b); }
  return { f: F, P: Q };
}

/** Lorentzian one-sided PSD D / (π² (fc² + f²)). */
export const lorentz = (f: number, fc: number, D: number) => D / (Math.PI ** 2 * (fc * fc + f * f));
/** PSD of the same motion sampled every 1/fs (exact for a discretely sampled Ornstein-Uhlenbeck process). */
export function lorentzAliased(f: number, fc: number, D: number, fs: number) {
  const dt = 1 / fs, c = Math.exp(-2 * Math.PI * fc * dt), s2 = D / (2 * Math.PI * fc);
  return (2 * dt * s2 * (1 - c * c)) / (1 + c * c - 2 * c * Math.cos(2 * Math.PI * f * dt));
}

export type PsdFit = { fc: number; D: number; seFc: number; seD: number; chi2: number; dof: number; used: number };
/**
 * Fit fc and D to the spectrum between fmin and fmax. Starts from the analytical straight-line fit of 1/P against f²
 * (Berg-Sørensen and Flyvbjerg 2004), then Levenberg-Marquardt with weights 1/P_model², reweighted three times.
 * chi2 uses the expected relative scatter 1/√(segments × block) of an averaged spectrum.
 */
export function fitPsd(f: number[], P: number[], opts: { fmin: number; fmax: number; aliased?: boolean; fs?: number; nAvg: number }): PsdFit {
  const F: number[] = [], Y: number[] = [];
  f.forEach((v, i) => { if (v >= opts.fmin && v <= opts.fmax && P[i] > 0) { F.push(v); Y.push(P[i]); } });
  if (F.length < 5) throw new Error('Fewer than 5 spectrum points in the fit range');
  // 1/P = (fc² + f²) π² / D: straight line in f², weighted by P².
  let sw = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
  F.forEach((v, i) => { const w = Y[i] ** 2, X = v * v, yy = 1 / Y[i]; sw += w; sx += w * X; sy += w * yy; sxx += w * X * X; sxy += w * X * yy; });
  const b = (sw * sxy - sx * sy) / (sw * sxx - sx * sx), a = (sy - b * sx) / sw;
  let fc0 = a > 0 && b > 0 ? Math.sqrt(a / b) : F[Math.floor(F.length / 2)], D0 = b > 0 ? Math.PI ** 2 / b : Y[0] * Math.PI ** 2 * fc0 ** 2;
  const model = opts.aliased && opts.fs ? (x: number, p: number[]) => lorentzAliased(x, Math.abs(p[0]), p[1], opts.fs!) : (x: number, p: number[]) => lorentz(x, p[0], p[1]);
  let p = [fc0, D0], fit = null as ReturnType<typeof levenbergMarquardt> | null;
  for (let it = 0; it < 4; it++) {
    const w = F.map((x) => 1 / model(x, p) ** 2);
    fit = levenbergMarquardt(model, F, Y, p, { w });
    p = [Math.abs(fit.p[0]), fit.p[1]];
  }
  const chi2 = F.reduce((s, x, i) => s + ((Y[i] - model(x, p)) / (model(x, p) / Math.sqrt(opts.nAvg))) ** 2, 0);
  // Standard errors from the expected scatter (not the residuals), as Berg-Sørensen and Flyvbjerg recommend.
  const scale = Math.sqrt(1 / opts.nAvg) / fit!.s;
  return { fc: p[0], D: p[1], seFc: fit!.se[0] * scale, seD: fit!.se[1] * scale, chi2, dof: F.length - 2, used: F.length };
}

/** Variance (after removing the mean) and the equipartition stiffness k = kBT / ⟨x²⟩ for x in metres. */
export function equipartition(x: ArrayLike<number>, T: number) {
  let m = 0; for (let i = 0; i < x.length; i++) m += x[i]; m /= x.length;
  let v = 0; for (let i = 0; i < x.length; i++) v += (x[i] - m) ** 2; v /= x.length - 1;
  return { mean: m, variance: v, k: (KB * T) / v };
}

/** A made-up trapped-bead record: exact discrete Ornstein-Uhlenbeck steps (positions in nm). */
export function simulateBead(k: number, gamma: number, T: number, fs: number, n: number, seed = 11, scale = 1): number[] {
  const g = rng(seed), dt = 1 / fs, c = Math.exp(-(k / gamma) * dt), sd = Math.sqrt((KB * T) / k) * 1e9;
  const out = new Array<number>(n);
  let x = sd * g.n();
  for (let i = 0; i < n; i++) { out[i] = x * scale; x = c * x + sd * Math.sqrt(1 - c * c) * g.n(); }
  return out;
}
