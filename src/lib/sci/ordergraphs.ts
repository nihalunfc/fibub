// Order of reaction graphs (school level): integrated rate laws for zero, first and second order (one reactant,
// rate = k[A]^n), half-lives, the three straight-line tests, and the Arrhenius equation with a catalyst.
// Pure functions, no DOM.

export const R = 8.314462618; // J/(mol K), CODATA
export type Order = 0 | 1 | 2;

/** [A] at time t (mol/L); zero order stops at 0. */
export function conc(n: Order, A0: number, k: number, t: number): number {
  if (!(A0 > 0) || !(k > 0) || !(t >= 0)) throw new Error('[A]₀ and k must be above zero and t not negative.');
  if (n === 0) return Math.max(0, A0 - k * t);
  if (n === 1) return A0 * Math.exp(-k * t);
  return A0 / (1 + k * A0 * t);
}

/** Half-life: [A]₀/2k, ln 2/k, 1/(k[A]₀). */
export function halfLife(n: Order, A0: number, k: number): number {
  return n === 0 ? A0 / (2 * k) : n === 1 ? Math.LN2 / k : 1 / (k * A0);
}

/** Time for [A] to fall from A0 to A. */
export function timeTo(n: Order, A0: number, k: number, A: number): number {
  if (!(A > 0 && A <= A0)) { if (n === 0 && A === 0) return A0 / k; throw new Error('[A] must be between 0 and [A]₀.'); }
  return n === 0 ? (A0 - A) / k : n === 1 ? Math.log(A0 / A) / k : (1 / A - 1 / A0) / k;
}

/** Units of k for each order with time in seconds. */
export const kUnits = (n: Order) => (n === 0 ? 'mol L⁻¹ s⁻¹' : n === 1 ? 's⁻¹' : 'L mol⁻¹ s⁻¹');

/** Which plot is a straight line for each order, and its slope. */
export const straight = (n: Order) => (n === 0 ? { plot: '[A] against t', slope: '−k' } : n === 1 ? { plot: 'ln[A] against t', slope: '−k' } : { plot: '1/[A] against t', slope: '+k' });

/** Least-squares straightness (R²) of y against x, used to show which plot is straight. */
export function r2(x: number[], y: number[]): number {
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
}

/** Arrhenius: k = A e^(−Ea/RT), Ea in kJ/mol. */
export const arrhenius = (A: number, Ea: number, T: number) => A * Math.exp((-Ea * 1000) / (R * T));
/** k₂/k₁ between two temperatures: log(k₂/k₁) = Ea/(2.303 R) (1/T₁ − 1/T₂). */
export const ratio = (Ea: number, T1: number, T2: number) => Math.exp(((Ea * 1000) / R) * (1 / T1 - 1 / T2));
/** Fraction of collisions with at least Ea of energy: e^(−Ea/RT). */
export const fraction = (Ea: number, T: number) => Math.exp((-Ea * 1000) / (R * T));
/** Activation energy from rate constants at two temperatures (kJ/mol). */
export const eaFrom = (k1: number, T1: number, k2: number, T2: number) => (R * Math.log(k2 / k1)) / (1 / T1 - 1 / T2) / 1000;
