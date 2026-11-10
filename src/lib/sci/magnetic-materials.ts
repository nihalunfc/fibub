// #1410 Dia-, para- and ferromagnetism: a teaching model. Dia and para are linear (M = χH, Curie's law χ = C/T for
// para); ferro is a Preisach model (many small "hysterons" that flip up or down at their own switching fields), which
// gives a hysteresis loop with remanence, coercivity and minor loops; above the Curie temperature it turns
// paramagnetic (Curie–Weiss). All material numbers are rounded, made-up teaching values. No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export const MU0 = 1.25663706127e-6; // N/A², CODATA 2022
export const K_B = 1.380649e-23;

/** Rounded teaching values. chi300: susceptibility at 300 K. */
export const DIA = { chi: -1.7e-4 }; // about bismuth's size
export const PARA = { C: 0.09 }; // Curie constant (K): χ = C / T, about 3 × 10⁻⁴ at 300 K
export const FERRO = { Ms: 1.7e6, Tc: 1043, soft: 0.5e-3, hard: 10e-3 }; // Ms in A/m (about iron's), Tc of iron (K); coercive B₀ in T

/** Langevin function L(x) = coth x − 1/x, the average alignment of free dipoles. */
export const langevin = (x: number) => (Math.abs(x) < 1e-4 ? x / 3 : 1 / Math.tanh(x) - 1 / x);
export const curieChi = (T: number) => PARA.C / T;
/** Fraction of the low-temperature magnetisation left at T (a simple critical-law fit, 0 above Tc). */
export const msFraction = (T: number) => (T >= FERRO.Tc ? 0 : Math.pow(1 - T / FERRO.Tc, 0.36));
/** Above Tc a ferromagnet is paramagnetic: Curie–Weiss χ = C' / (T − Tc), with a made-up C' of 1 K. */
export const curieWeiss = (T: number) => 1 / Math.max(T - FERRO.Tc, 1);

/** Preisach model: hysterons with up-switch field a ≥ down-switch field b (in tesla of applied B₀), weights w. */
export type Hyst = { a: number; b: number; w: number; s: number };
export function makeHysterons(hc: number, n = 20): Hyst[] {
  const out: Hyst[] = [], spread = hc * 0.6, inter = hc * 0.5;
  // Grid in (coercive field c = (a − b)/2, bias u = (a + b)/2) with Gaussian weights.
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const c = hc + spread * (((i + 0.5) / n) * 4 - 2), u = inter * (((j + 0.5) / n) * 4 - 2);
    if (c <= 0) continue;
    const w = Math.exp(-0.5 * (((c - hc) / spread) ** 2 + (u / inter) ** 2));
    out.push({ a: u + c, b: u - c, w, s: (i + j) % 2 ? 1 : -1 }); // demagnetised start: half up, half down
  }
  const tot = out.reduce((t, h) => t + h.w, 0); for (const h of out) h.w /= tot;
  return out;
}
/** Applies field B0 (T) to the hysterons (in place) and returns M / Ms. */
export function applyField(hs: Hyst[], B0: number) {
  let m = 0;
  for (const h of hs) { if (B0 >= h.a) h.s = 1; else if (B0 <= h.b) h.s = -1; m += h.w * h.s; }
  return m;
}
/** The magnetisation as a fraction of Ms right now. */
export const magnetisation = (hs: Hyst[]) => hs.reduce((t, h) => t + h.w * h.s, 0);

/** Major loop: remanence (M/Ms at B₀ = 0 coming down from saturation) and coercivity (B₀ where M = 0). */
export function majorLoop(hc: number) {
  const hs = makeHysterons(hc); applyField(hs, 10 * hc);
  const rem = applyField(hs, 0);
  let lo = -10 * hc, hi = 0; // M(B0) on the way down is monotonic: bisect for M = 0
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2, t = makeHysterons(hc); applyField(t, 10 * hc); if (applyField(t, mid) > 0) hi = mid; else lo = mid; }
  return { remanence: rem, coercive: -(lo + hi) / 2 };
}

/** Linear materials: M = χ H with H = B₀ / μ₀; B inside = μ₀ (H + M) = (1 + χ) B₀. */
export function linear(chi: number, B0: number) {
  const H = B0 / MU0, M = chi * H;
  return { H, M, mur: 1 + chi, B: MU0 * (H + M) };
}

export function questions(rng: () => number = Math.random): Question[] {
  const cd = pick(rng, [1.2, 1.7, 2.2]), Bd = pick(rng, [0.5, 1, 2]), drop = cd * 1e-4 * Bd * 1000;
  const chi2 = pick(rng, [1, 2, 3]) * 1e-4, B0 = pick(rng, [0.1, 0.2, 0.5]), M2 = (chi2 * B0) / (4 * Math.PI * 1e-7);
  const T1 = pick(rng, [200, 300, 400]), T2 = pick(rng, [100, 150, 600, 800]), x1 = pick(rng, [2, 3, 4]) * 1e-4, x2 = (x1 * T1) / T2;
  const n = pick(rng, [500, 1000, 2000]), I = pick(rng, [0.5, 1, 2]), mr = pick(rng, [400, 800, 1000]), Bc = 4 * Math.PI * 1e-7 * mr * n * I;
  return [
    { text: `A diamagnetic rod has χ = −${cd} × 10⁻⁴ and sits in a field B₀ = ${Bd} T. By how much is the field inside it lower than B₀, in millitesla?`, answer: drop, unit: 'mT', tol: 0.02,
      steps: ['B inside = (1 + χ) B₀, so it is lower by |χ| B₀.', `|χ| B₀ = ${cd} × 10⁻⁴ × ${Bd} T = ${r3(drop)} mT`] },
    { text: `A paramagnetic sample with χ = ${chi2 * 1e4} × 10⁻⁴ sits in a field B₀ = ${B0} T. What is its magnetisation M, in A/m? (μ₀ = 4π × 10⁻⁷ T m/A)`, answer: M2, unit: 'A/m', tol: 0.02,
      steps: ['H = B₀ / μ₀, then M = χ H', `M = ${chi2} × ${B0} / (4π × 10⁻⁷) = ${r3(M2)} A/m`] },
    { text: `A paramagnet obeys Curie's law and has χ = ${x1 * 1e4} × 10⁻⁴ at ${T1} K. What is χ at ${T2} K? (Answer in units of 10⁻⁴.)`, answer: x2 * 1e4, unit: '× 10⁻⁴', tol: 0.02,
      steps: ['Curie: χ = C / T, so χ T stays the same.', `χ = ${x1} × ${T1} / ${T2} = ${r3(x2 * 1e4)} × 10⁻⁴`] },
    { text: `A long solenoid with ${n} turns per metre carries ${I} A and is filled with iron of relative permeability ${mr}. What is B inside, in tesla?`, answer: Bc, unit: 'T', tol: 0.02,
      steps: ['B = μ₀ μᵣ n I', `B = 4π × 10⁻⁷ × ${mr} × ${n} × ${I} = ${r3(Bc)} T`] },
  ];
}
