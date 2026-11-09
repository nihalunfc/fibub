// Gaussian wave packet hitting a barrier: time evolution by the split-step Fourier method (Strang splitting,
// exp(-iVdt/2ħ) exp(-iTdt/ħ) exp(-iVdt/2ħ)), with absorbing edges, and stationary transmission T(E) from the
// transfer-matrix method for any piecewise-constant potential (smooth potentials are cut into thin steps).
import { fft, type C, cadd, csub, cmul, cdiv, csqrt, cexp, cabs } from './phq.ts';

/** ħ in eV fs (CODATA 2018, rounded). */
export const HBAR_EV_FS = 0.6582119569;

export type Seg = { x0: number; x1: number; V: number };
export type BarrierId = 'rect' | 'step' | 'double' | 'well' | 'gauss';
export type Barrier = { id: BarrierId; V0: number; a: number; d: number };

/** The potential as a function of x, and its piecewise-constant pieces when it has them (barrier centred at 0). */
export function barrierV(b: Barrier): { V: (x: number) => number; segs: Seg[] | null; lo: number; hi: number } {
  const { V0, a, d } = b;
  switch (b.id) {
    case 'rect': return { V: (x) => (Math.abs(x) < a / 2 ? V0 : 0), segs: [{ x0: -a / 2, x1: a / 2, V: V0 }], lo: -a / 2, hi: a / 2 };
    case 'well': return { V: (x) => (Math.abs(x) < a / 2 ? -Math.abs(V0) : 0), segs: [{ x0: -a / 2, x1: a / 2, V: -Math.abs(V0) }], lo: -a / 2, hi: a / 2 };
    case 'step': return { V: (x) => (x > 0 ? V0 : 0), segs: [{ x0: 0, x1: Infinity, V: V0 }], lo: 0, hi: 0 };
    case 'double': { const h = d / 2; return { V: (x) => (Math.abs(x) >= h && Math.abs(x) < h + a ? V0 : 0), segs: [{ x0: -h - a, x1: -h, V: V0 }, { x0: h, x1: h + a, V: V0 }], lo: -h - a, hi: h + a }; }
    case 'gauss': return { V: (x) => V0 * Math.exp(-(x * x) / (2 * a * a)), segs: null, lo: -3.5 * a, hi: 3.5 * a };
  }
}

/** Plane-wave transmission probability at energy E through a potential that is 0 on the far left. c = ħ²/2m. */
export function transmission(E: number, segs: Seg[], c: number): number {
  // Regions: 0 (left, V = 0), then each segment, gaps of V = 0 between them, and the region after the last.
  const regions: { V: number; x: number }[] = []; // V of the region that starts at boundary x
  segs.forEach((s, i) => {
    regions.push({ V: s.V, x: s.x0 });
    const nx = segs[i + 1];
    if (Number.isFinite(s.x1) && !(nx && Math.abs(nx.x0 - s.x1) < 1e-12 * Math.max(1, Math.abs(s.x1)))) regions.push({ V: 0, x: s.x1 });
  });
  const kOf = (V: number): C => { let e = E - V; if (Math.abs(e) < 1e-12 * Math.max(1, Math.abs(E))) e = 1e-12 * Math.max(1, Math.abs(E)); return csqrt([e / c, 0]); };
  // Transfer from the right: start with (A, B) = (1, 0) in the last region and step leftwards.
  let A: C = [1, 0], B: C = [0, 0];
  let kR = kOf(regions.length ? regions[regions.length - 1].V : 0);
  const kLast = kR;
  for (let r = regions.length - 1; r >= 0; r--) {
    const x = regions[r].x, kL = kOf(r ? regions[r - 1].V : 0);
    // ψ = A e^{ikR x} + B e^{-ikR x} on the right of x; match ψ and ψ' to A' e^{ikL x} + B' e^{-ikL x}.
    const ep = cexp(cmul([0, 1], cmul(kR, [x, 0]))), em = cexp(cmul([0, -1], cmul(kR, [x, 0])));
    const psi = cadd(cmul(A, ep), cmul(B, em)), dpsi = cmul(cmul([0, 1], kR), csub(cmul(A, ep), cmul(B, em)));
    const lp = cexp(cmul([0, 1], cmul(kL, [x, 0]))), lm = cexp(cmul([0, -1], cmul(kL, [x, 0])));
    const t = cdiv(dpsi, cmul([0, 1], kL));
    A = cdiv(cmul([0.5, 0], cadd(psi, t)), lp); B = cdiv(cmul([0.5, 0], csub(psi, t)), lm);
    kR = kL;
  }
  const k0 = kOf(0);
  if (Math.abs(kLast[1]) > 1e-12 * cabs(kLast) || kLast[0] <= 0) return 0; // evanescent on the right: nothing gets through
  return (kLast[0] / k0[0]) / (A[0] * A[0] + A[1] * A[1]);
}

/** Thin-step version of any V(x) between lo and hi, for transfer-matrix transmission of smooth barriers. */
export function staircase(V: (x: number) => number, lo: number, hi: number, n = 2000): Seg[] {
  const h = (hi - lo) / n, out: Seg[] = [];
  for (let i = 0; i < n; i++) out.push({ x0: lo + i * h, x1: lo + (i + 1) * h, V: V(lo + (i + 0.5) * h) });
  return out;
}

/** Transmission averaged over the packet's momentum spread: Σ |φ(k)|² T(E(k)) over k > 0 (k < 0 parts move left). */
export function packetT(segs: Seg[], c: number, k0: number, sigma: number): number {
  const sk = 1 / (2 * sigma), n = 801, lo = Math.max(1e-9, k0 - 8 * sk), hi = k0 + 8 * sk;
  let s = 0, w = 0;
  for (let i = 0; i < n; i++) { const k = lo + ((hi - lo) * i) / (n - 1), wt = Math.exp(-((k - k0) ** 2) / (2 * sk * sk)) * (i === 0 || i === n - 1 ? 0.5 : 1); s += wt * transmission(c * k * k, segs, c); w += wt; }
  // weight of k < 0 (moving left from the start) counts as not transmitted
  const norm = 0.5 * (1 + erf(k0 / (sk * Math.SQRT2)));
  return (s / w) * norm;
}
function erf(x: number) { // Abramowitz and Stegun 7.1.26 is not accurate enough; use a series/continued fraction via erfc.
  const t = Math.abs(x);
  if (t > 6) return Math.sign(x);
  let sum = t, term = t; for (let n = 1; n < 200; n++) { term *= -(t * t) / n; const add = term / (2 * n + 1); sum += add; if (Math.abs(add) < 1e-17) break; }
  return Math.sign(x) * Math.min(1, (2 / Math.sqrt(Math.PI)) * sum);
}

export type SimIn = { x0: number; x1: number; N: number; c: number; hbar: number; V: (x: number) => number; xc: number; sigma: number; k0: number; tEnd: number; dt: number; frames: number; split: number };
export type SimOut = { x: Float64Array; Vx: Float64Array; frames: { t: number; prob: Float64Array; re: Float64Array }[]; R: number; T: number; left: number; right: number; absL: number; absR: number; norm0: number; steps: number };

/** Run the split-step simulation. `split` is the x where reflected and transmitted parts are told apart. */
export function simulate(p: SimIn): SimOut {
  const { N, c, hbar } = p, L = p.x1 - p.x0, dx = L / N;
  const x = new Float64Array(N), Vx = new Float64Array(N), re = new Float64Array(N), im = new Float64Array(N);
  // Each grid cell gets the average of V over the cell (16 samples), so sharp barrier edges fall between points smoothly.
  for (let i = 0; i < N; i++) { x[i] = p.x0 + i * dx; let s = 0; for (let j = 0; j < 16; j++) s += p.V(x[i] + ((j + 0.5) / 16 - 0.5) * dx); Vx[i] = s / 16; }
  // Initial Gaussian packet: |ψ|² has standard deviation sigma.
  let nrm = 0;
  for (let i = 0; i < N; i++) { const g = Math.exp(-((x[i] - p.xc) ** 2) / (4 * p.sigma * p.sigma)); re[i] = g * Math.cos(p.k0 * x[i]); im[i] = g * Math.sin(p.k0 * x[i]); nrm += g * g * dx; }
  const sn = 1 / Math.sqrt(nrm); for (let i = 0; i < N; i++) { re[i] *= sn; im[i] *= sn; }
  const steps = Math.max(1, Math.round(p.tEnd / p.dt)), dt = p.tEnd / steps;
  const vr = new Float64Array(N), vi = new Float64Array(N), kr = new Float64Array(N), ki = new Float64Array(N), mask = new Float64Array(N);
  for (let i = 0; i < N; i++) { const ph = (-Vx[i] * dt) / (2 * hbar); vr[i] = Math.cos(ph); vi[i] = Math.sin(ph); }
  for (let j = 0; j < N; j++) { const k = ((2 * Math.PI) / L) * (j < N / 2 ? j : j - N), ph = (-c * k * k * dt) / hbar; kr[j] = Math.cos(ph) / N; ki[j] = Math.sin(ph) / N; }
  // Absorbing edges: the outer 12 % on each side, a smooth cos^(1/8) mask (applied every step).
  const W = Math.floor(0.12 * N);
  for (let i = 0; i < N; i++) { const d = Math.min(i, N - 1 - i); mask[i] = d >= W ? 1 : Math.pow(Math.sin((Math.PI / 2) * (d / W)), 1 / 8); }
  let absL = 0, absR = 0;
  const frames: SimOut['frames'] = [];
  const snap = (t: number) => frames.push({ t, prob: Float64Array.from(re, (r, i) => r * r + im[i] * im[i]), re: Float64Array.from(re) });
  const every = Math.max(1, Math.round(steps / Math.max(1, p.frames)));
  snap(0);
  const half = (i: number) => { const a = re[i], b = im[i]; re[i] = a * vr[i] - b * vi[i]; im[i] = a * vi[i] + b * vr[i]; };
  for (let s = 1; s <= steps; s++) {
    for (let i = 0; i < N; i++) half(i);
    fft(re, im);
    for (let j = 0; j < N; j++) { const a = re[j], b = im[j]; re[j] = a * kr[j] - b * ki[j]; im[j] = a * ki[j] + b * kr[j]; }
    fft(re, im, true);
    for (let i = 0; i < N; i++) half(i);
    for (let i = 0; i < N; i++) if (mask[i] < 1) { const p0 = re[i] * re[i] + im[i] * im[i], m = mask[i]; re[i] *= m; im[i] *= m; const lost = p0 * (1 - m * m) * dx; if (i < N / 2) absL += lost; else absR += lost; }
    if (s % every === 0 || s === steps) snap(s * dt);
  }
  let left = 0, right = 0;
  for (let i = 0; i < N; i++) { const pr = (re[i] * re[i] + im[i] * im[i]) * dx; if (x[i] < p.split) left += pr; else right += pr; }
  return { x, Vx, frames, R: left + absL, T: right + absR, left, right, absL, absR, norm0: 1, steps };
}

/** Rectangular barrier transmission in closed form (for checking): E < V0 uses sinh, E > V0 uses sin. */
export function rectT(E: number, V0: number, a: number, c: number): number {
  if (E < V0) { const kap = Math.sqrt((V0 - E) / c); return 1 / (1 + (V0 * V0 * Math.sinh(kap * a) ** 2) / (4 * E * (V0 - E))); }
  if (E === V0) return 1 / (1 + (V0 * a * a) / (4 * c));
  const q = Math.sqrt((E - V0) / c); return 1 / (1 + (V0 * V0 * Math.sin(q * a) ** 2) / (4 * E * (E - V0)));
}
