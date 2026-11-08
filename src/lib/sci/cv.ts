// Cyclic voltammetry: Randles–Sevcik equation, peak analysis of a measured voltammogram (peak potentials and
// currents with a baseline, ΔEp, E½, Nicholson's peak ratio), scan-rate studies, and a digital simulation of a
// reversible couple for examples and checks.
import { fitLine, type LineFit } from './fit.ts';

export const F = 96485.33212, R = 8.314462618;
/** Randles–Sevcik coefficient for a reversible couple: ip = 0.4463·nFAC·√(nFvD/RT). */
export const RS = 0.4463;

/** Peak current (A) from n, A (cm²), D (cm²/s), C (mol/L), v (V/s), T (K). */
export function randlesSevcik(n: number, A: number, D: number, C: number, v: number, T = 298.15): number {
  return RS * n * F * A * (C / 1000) * Math.sqrt((n * F * v * D) / (R * T));
}
/** The constant k in ip = k·n^1.5·A·√D·C·√v (C in mol/cm³), 2.69 × 10⁵ at 25 °C. */
export const rsConstant = (T = 298.15) => (RS * F ** 1.5) / Math.sqrt(R * T);
/** Diffusion coefficient (cm²/s) from a peak current. */
export function diffusionFromPeak(ip: number, n: number, A: number, C: number, v: number, T = 298.15): number {
  const k = RS * n * F * A * (C / 1000);
  return ((ip / k) ** 2 * R * T) / (n * F * v);
}
/** Concentration (mol/L) from a peak current. */
export const concFromPeak = (ip: number, n: number, A: number, D: number, v: number, T = 298.15) => ip / randlesSevcik(n, A, D, 1, v, T);

/**
 * Digital simulation (explicit finite differences, equal D for both forms) of a reversible n-electron couple
 * R ⇌ O + ne⁻ with only R in solution, swept from Ei to the switching potential Es and back. Currents are anodic
 * positive, in A. E0 and potentials in V.
 */
export function simulateCV(o: { E0: number; Ei: number; Es: number; v: number; n?: number; A: number; C: number; D: number; T?: number; points?: number }): { E: number[]; I: number[] } {
  const n = o.n ?? 1, T = o.T ?? 298.15, f = (n * F) / (R * T), pts = o.points ?? 600;
  const span = Math.abs(o.Es - o.Ei), tTotal = (2 * span) / o.v, sub = 40, steps = pts * 2 * sub, dt = tTotal / steps;
  const lam = 0.45, dx = Math.sqrt((o.D * dt) / lam), L = 6 * Math.sqrt(o.D * tTotal), nx = Math.ceil(L / dx) + 2;
  const Cb = o.C / 1000; // mol/cm³
  let c = new Float64Array(nx).fill(Cb), nxt = new Float64Array(nx);
  const E: number[] = [], I: number[] = [], dir = Math.sign(o.Es - o.Ei);
  for (let k = 1; k <= steps; k++) {
    const t = k * dt, half = tTotal / 2;
    const Ek = t <= half ? o.Ei + dir * o.v * t : o.Es - dir * o.v * (t - half);
    for (let j = 1; j < nx - 1; j++) nxt[j] = c[j] + lam * (c[j + 1] - 2 * c[j] + c[j - 1]);
    nxt[nx - 1] = Cb;
    nxt[0] = Cb / (1 + Math.exp(f * (Ek - o.E0))); // Nernst: [O]/[R] = exp(f(E − E0)), [O] + [R] = Cb
    [c, nxt] = [nxt, c];
    if (k % sub === 0) {
      const grad = (-3 * c[0] + 4 * c[1] - c[2]) / (2 * dx); // d[R]/dx at the surface
      E.push(Ek); I.push(n * F * o.A * o.D * grad);
    }
  }
  return { E, I };
}

const smooth = (y: number[], w = 2) => y.map((_, i) => { let s = 0, k = 0; for (let j = Math.max(0, i - w); j <= Math.min(y.length - 1, i + w); j++) { s += y[j]; k++; } return s / k; });

export type Peak = { index: number; E: number; I: number; raw: number; base: number };
export type CvAnalysis = {
  turn: number; Es: number; Isp: number; firstAnodic: boolean;
  forward: Peak | null; reverse: Peak | null;
  baseline: { slope: number; intercept: number; from: number; to: number } | null;
  dEp?: number; Ehalf?: number; ratio?: number; ipcRaw?: number;
};

/**
 * Peaks of one cycle. The data are split at the switching potential; the forward peak is the largest current in
 * the sweep direction (anodic for a positive sweep), measured from a straight baseline through the first part of the
 * sweep (`baseFrac` of its potential span). The reverse peak ratio uses Nicholson's (1966) formula, which needs no
 * reverse baseline: |ipr/ipf| = (ipr)₀/ipf + 0.485·(isp)₀/ipf + 0.086.
 */
export function analyseCV(E: number[], I: number[], baseFrac = 0.1): CvAnalysis {
  const n = E.length;
  if (n < 10) throw new Error('A voltammogram needs at least 10 points.');
  const up = E[Math.min(n - 1, 5)] > E[0];
  let turn = 0;
  for (let i = 1; i < n; i++) if (up ? E[i] > E[turn] : E[i] < E[turn]) turn = i;
  const s = smooth(I);
  const fwdIdx = Array.from({ length: turn + 1 }, (_, i) => i);
  // Baseline: line through the first baseFrac of the forward sweep's potential span.
  const span = Math.abs(E[turn] - E[0]), lim = baseFrac * span;
  const bi = fwdIdx.filter((i) => Math.abs(E[i] - E[0]) <= lim);
  let baseline: CvAnalysis['baseline'] = null;
  if (bi.length >= 3) { const fl = fitLine(bi.map((i) => E[i]), bi.map((i) => I[i])); baseline = { slope: fl.slope, intercept: fl.intercept, from: E[0], to: E[bi[bi.length - 1]] }; }
  const base = (e: number) => (baseline ? baseline.intercept + baseline.slope * e : 0);
  const sign = up ? 1 : -1;
  let forward: Peak | null = null;
  for (const i of fwdIdx) {
    if (bi.includes(i)) continue;
    const net = sign * (s[i] - base(E[i]));
    if (!forward || net > sign * (forward.I)) forward = { index: i, E: E[i], I: s[i] - base(E[i]), raw: s[i], base: base(E[i]) };
  }
  // A peak must be a real maximum, not just the switching end of a rising current.
  if (forward && (forward.index >= turn - 2 || sign * forward.I <= 0)) forward = null;
  let reverse: Peak | null = null;
  for (let i = turn + 1; i < n; i++) { if (!reverse || -sign * s[i] > -sign * reverse.raw) reverse = { index: i, E: E[i], I: s[i], raw: s[i], base: 0 }; }
  if (reverse && (reverse.index <= turn + 2 || reverse.index >= n - 2 || -sign * reverse.raw <= 0)) reverse = null;
  const out: CvAnalysis = { turn, Es: E[turn], Isp: s[turn], firstAnodic: up, forward, reverse, baseline };
  if (forward && reverse) {
    out.dEp = Math.abs(forward.E - reverse.E);
    out.Ehalf = (forward.E + reverse.E) / 2;
    const ipf = Math.abs(forward.I), ipr0 = Math.abs(reverse.raw), isp0 = sign * s[turn];
    out.ipcRaw = ipr0;
    out.ratio = ipr0 / ipf + (0.485 * isp0) / ipf + 0.086;
  }
  return out;
}

/** Reversible ΔEp (V) for n electrons at T: about 2.22·RT/nF (57 mV at 25 °C for n = 1). */
export const reversibleDeltaEp = (n = 1, T = 298.15) => (2.218 * R * T) / (n * F);

export type ScanStudy = { sqrtFit: LineFit; logFit: LineFit | null; D?: number };
/** ip against √v (and log ip against log v). v in V/s, ip in A. D from the √v slope when n, A and C are given. */
export function scanRateStudy(v: number[], ip: number[], n?: number, A?: number, C?: number, T = 298.15): ScanStudy {
  const sqrtFit = fitLine(v.map(Math.sqrt), ip.map(Math.abs));
  const pos = v.map((x, i) => [x, Math.abs(ip[i])]).filter(([x, y]) => x > 0 && y > 0);
  const logFit = pos.length >= 3 ? fitLine(pos.map(([x]) => Math.log10(x)), pos.map(([, y]) => Math.log10(y))) : null;
  let D: number | undefined;
  if (n && A && C) { const k = RS * n * F * A * (C / 1000) * Math.sqrt((n * F) / (R * T)); D = (sqrtFit.slope / k) ** 2; }
  return { sqrtFit, logFit, D };
}
