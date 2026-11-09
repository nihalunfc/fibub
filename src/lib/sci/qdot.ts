// Quantum dot size and band gap from the Brus equation (effective-mass approximation for a spherical dot):
// E(R) = Eg + ħ²π²/(2R²)·(1/mₑ* + 1/mₕ*) − 1.786 e²/(4πε₀εR) [− 0.248 E*Ry], and its inverse by bisection on the
// strong-confinement branch. Plus a user-supplied polynomial sizing curve D(λ). R in nm, energies in eV.

const HBAR = 1.054571817e-34, M0 = 9.1093837015e-31, E = 1.602176634e-19, EPS0 = 8.8541878128e-12;
export const HC = 1239.8419843320026; // eV·nm
const RY = 13.605693122994; // eV
const A0 = 0.0529177210903; // nm

export type Material = { Eg: number; me: number; mh: number; eps: number };
export const PRESETS: { id: string; name: string; m: Material }[] = [
  { id: 'cdse', name: 'CdSe-like (rounded)', m: { Eg: 1.74, me: 0.13, mh: 0.45, eps: 10.6 } },
  { id: 'cds', name: 'CdS-like (rounded)', m: { Eg: 2.42, me: 0.2, mh: 0.7, eps: 8.9 } },
  { id: 'pbs', name: 'PbS-like (rounded)', m: { Eg: 0.41, me: 0.09, mh: 0.09, eps: 17 } },
];

export type Terms = { E: number; conf: number; coul: number; pol: number };
/** Reduced mass (in m0). */
export const mu = (m: Material) => 1 / (1 / m.me + 1 / m.mh);
/** Exciton Bohr radius ε·(m0/μ)·a0 in nm. */
export const bohr = (m: Material) => (m.eps * A0) / mu(m);
/** Effective Rydberg 13.6 eV · μ/ε². */
export const rydberg = (m: Material) => (RY * mu(m)) / (m.eps * m.eps);

/** The Brus energy at radius R (nm), with its three terms. */
export function brus(R: number, m: Material, polar = false): Terms {
  const r = R * 1e-9;
  const conf = ((HBAR * HBAR * Math.PI * Math.PI) / (2 * r * r * M0)) * (1 / m.me + 1 / m.mh) / E;
  const coul = (1.786 * E) / (4 * Math.PI * EPS0 * m.eps * r);
  const pol = polar ? 0.248 * rydberg(m) : 0;
  return { E: m.Eg + conf - coul - pol, conf, coul, pol };
}

/** Radius (nm) of the minimum of E(R): R* = 2A/B, where the strong-confinement branch ends. */
export function branchEnd(m: Material): number {
  const A = brus(1, m).conf, B = brus(1, m).coul; // conf = A/R², coul = B/R with R in nm
  return (2 * A) / B;
}

/** Radius (nm) giving energy Etarget on the confinement branch (0, R*], or NaN if Etarget is below E(R*). */
export function radiusFor(Etarget: number, m: Material, polar = false): number {
  const Rmax = branchEnd(m);
  if (!(Etarget > brus(Rmax, m, polar).E)) return NaN;
  let lo = 1e-4, hi = Rmax;
  for (let i = 0; i < 200 && hi - lo > 1e-14; i++) { const mid = (lo + hi) / 2; if (brus(mid, m, polar).E > Etarget) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}

/** Evaluate a polynomial c0 + c1 x + c2 x² + … (Horner). */
export const poly = (c: number[], x: number) => c.reduceRight((s, ci) => s * x + ci, 0);

/** Parse "c0, c1, c2 …" (commas, spaces or semicolons; e-notation fine). Empty → []. */
export function parseCoeffs(s: string): number[] | string {
  const t = s.trim();
  if (!t) return [];
  const parts = t.split(/[;,\s]+/).filter(Boolean);
  const c = parts.map((p) => Number(p.replace(/[−–]/g, '-')));
  if (c.some((x) => !Number.isFinite(x))) return 'Coefficients are numbers separated by commas, c0 first (for example 1.5, 2e-3, -4e-6).';
  if (c.length > 8) return 'Up to 8 coefficients (a 7th-order polynomial).';
  return c;
}
