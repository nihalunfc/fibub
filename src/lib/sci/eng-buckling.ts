// Column buckling: section properties, Euler's critical load with an effective length factor, and the
// Johnson parabola for intermediate columns. Units are the user's own, consistent set (e.g. mm, N/mm² = MPa, N).

export type Section =
  | { kind: 'rect'; b: number; h: number }
  | { kind: 'circle'; d: number }
  | { kind: 'tube'; D: number; t: number }
  | { kind: 'ibeam'; d: number; bf: number; tf: number; tw: number };

export type Props = { A: number; Ix: number; Iy: number; rx: number; ry: number; Imin: number; rmin: number; axis: 'x' | 'y' | 'any' };

export function sectionProps(s: Section): Props {
  let A: number, Ix: number, Iy: number;
  if (s.kind === 'rect') { A = s.b * s.h; Ix = (s.b * s.h ** 3) / 12; Iy = (s.h * s.b ** 3) / 12; }
  else if (s.kind === 'circle') { A = (Math.PI * s.d ** 2) / 4; Ix = Iy = (Math.PI * s.d ** 4) / 64; }
  else if (s.kind === 'tube') { const d = s.D - 2 * s.t; A = (Math.PI * (s.D ** 2 - d ** 2)) / 4; Ix = Iy = (Math.PI * (s.D ** 4 - d ** 4)) / 64; }
  else { const hw = s.d - 2 * s.tf; A = 2 * s.bf * s.tf + hw * s.tw; Ix = (s.bf * s.d ** 3 - (s.bf - s.tw) * hw ** 3) / 12; Iy = (2 * s.tf * s.bf ** 3) / 12 + (hw * s.tw ** 3) / 12; }
  const rx = Math.sqrt(Ix / A), ry = Math.sqrt(Iy / A), Imin = Math.min(Ix, Iy);
  return { A, Ix, Iy, rx, ry, Imin, rmin: Math.sqrt(Imin / A), axis: Math.abs(Ix - Iy) < 1e-9 * Ix ? 'any' : Ix < Iy ? 'x' : 'y' };
}

/** Euler critical load π² E I / (K L)². */
export const eulerLoad = (E: number, I: number, K: number, L: number) => (Math.PI ** 2 * E * I) / (K * L) ** 2;

/** Slenderness at which the Johnson parabola meets the Euler curve (σ = σy / 2): Cc = √(2π²E / σy). */
export const transition = (E: number, fy: number) => Math.sqrt((2 * Math.PI ** 2 * E) / fy);

/** Critical stress at slenderness λ = KL/r: Johnson parabola below Cc, Euler above. */
export function criticalStress(lambda: number, E: number, fy: number): { sigma: number; mode: 'johnson' | 'euler' } {
  const Cc = transition(E, fy);
  if (lambda < Cc) return { sigma: fy - (fy ** 2 / (4 * Math.PI ** 2 * E)) * lambda ** 2, mode: 'johnson' };
  return { sigma: (Math.PI ** 2 * E) / lambda ** 2, mode: 'euler' };
}

export type Result = Props & { KL: number; lambda: number; Cc: number; sigmaE: number; PE: number; sigma: number; Pcr: number; mode: 'johnson' | 'euler'; Py: number };

export function column(s: Section, L: number, K: number, E: number, fy: number): Result {
  const p = sectionProps(s), KL = K * L, lambda = KL / p.rmin, Cc = transition(E, fy);
  const sigmaE = (Math.PI ** 2 * E) / lambda ** 2, c = criticalStress(lambda, E, fy);
  return { ...p, KL, lambda, Cc, sigmaE, PE: sigmaE * p.A, sigma: c.sigma, Pcr: c.sigma * p.A, mode: c.mode, Py: fy * p.A };
}
