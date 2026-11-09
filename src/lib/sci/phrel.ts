// Special-relativistic kinematics in natural units (c = 1, energies, momenta and masses in the same unit, e.g. MeV):
// invariant mass of a set of particles, two-body decays, Lorentz boosts and reaction thresholds. No DOM.

export type Four = { E: number; px: number; py: number; pz: number };
export const pAbs = (v: Four) => Math.hypot(v.px, v.py, v.pz);
/** Invariant mass, with a small negative m² (rounding) treated as 0 and a clearly negative one returned as NaN. */
export function mass(v: Four): number {
  const p = pAbs(v), m2 = (v.E - p) * (v.E + p);
  if (m2 >= 0) return Math.sqrt(m2);
  return -m2 < 1e-9 * v.E * v.E ? 0 : NaN;
}
export const fourFrom = (m: number, px: number, py: number, pz: number): Four => ({ E: Math.sqrt(m * m + px * px + py * py + pz * pz), px, py, pz });
export const add = (vs: Four[]): Four => vs.reduce((a, v) => ({ E: a.E + v.E, px: a.px + v.px, py: a.py + v.py, pz: a.pz + v.pz }), { E: 0, px: 0, py: 0, pz: 0 });

/** Properties of a four-vector: mass, |p|, β, γ, rapidity along z, polar angle (deg) and pseudorapidity. */
export function describe(v: Four) {
  const p = pAbs(v), M = mass(v), beta = p / v.E, gamma = M > 0 ? v.E / M : Infinity;
  const y = 0.5 * Math.log((v.E + v.pz) / (v.E - v.pz));
  const theta = p > 0 ? (Math.acos(Math.max(-1, Math.min(1, v.pz / p))) * 180) / Math.PI : NaN;
  const eta = p > 0 ? 0.5 * Math.log((p + v.pz) / (p - v.pz)) : NaN;
  return { E: v.E, p, M, beta, gamma, y, theta, eta, pT: Math.hypot(v.px, v.py), T: v.E - (Number.isFinite(M) ? M : 0) };
}

/** Lorentz boost of v into a frame moving with velocity b = (bx, by, bz) (|b| < 1). */
export function boost(v: Four, bx: number, by: number, bz: number): Four {
  const b2 = bx * bx + by * by + bz * bz;
  if (b2 === 0) return { ...v };
  const g = 1 / Math.sqrt(1 - b2), bp = bx * v.px + by * v.py + bz * v.pz, k = ((g - 1) * bp) / b2 - g * v.E;
  return { E: g * (v.E - bp), px: v.px + k * bx, py: v.py + k * by, pz: v.pz + k * bz };
}
/** The boost velocity that takes a system to its rest frame. */
export const restBeta = (v: Four): [number, number, number] => [v.px / v.E, v.py / v.E, v.pz / v.E];

/** Källén function λ(a, b, c) = a² + b² + c² − 2ab − 2bc − 2ca. */
export const kallen = (a: number, b: number, c: number) => a * a + b * b + c * c - 2 * a * b - 2 * b * c - 2 * c * a;

/** Two-body decay M → m1 + m2 in the parent's rest frame; null if M < m1 + m2. */
export function twoBody(M: number, m1: number, m2: number) {
  if (!(M > 0) || m1 < 0 || m2 < 0 || M < m1 + m2) return null;
  const p = Math.sqrt(Math.max(0, kallen(M * M, m1 * m1, m2 * m2))) / (2 * M);
  const E1 = (M * M + m1 * m1 - m2 * m2) / (2 * M), E2 = (M * M + m2 * m2 - m1 * m1) / (2 * M);
  return { p, E1, E2, T1: E1 - m1, T2: E2 - m2, beta1: p / E1, beta2: p / E2, Q: M - m1 - m2 };
}

/**
 * Lab view of a two-body decay when the parent moves with momentum P: the range of each daughter's energy and,
 * when the parent moves faster than the daughter does in the rest frame, the largest lab angle (deg).
 */
export function twoBodyLab(M: number, m1: number, m2: number, P: number) {
  const d = twoBody(M, m1, m2); if (!d) return null;
  const E = Math.sqrt(M * M + P * P), g = E / M, b = P / E;
  const range = (Ei: number, mi: number) => ({ min: g * (Ei - b * d.p), max: g * (Ei + b * d.p), thetaMax: mi > 0 && b > d.p / Ei ? (Math.asin(Math.min(1, (d.p / mi) / (b * g))) * 180) / Math.PI : null });
  return { gamma: g, beta: b, d1: range(d.E1, m1), d2: range(d.E2, m2) };
}

/**
 * Threshold for a + b → products of total mass Msum, with b at rest (fixed target): the beam's total energy,
 * kinetic energy and momentum, and √s at threshold. Also the energy per beam for equal-mass head-on beams.
 */
export function threshold(ma: number, mb: number, Msum: number) {
  if (!(mb > 0) || ma < 0 || !(Msum > 0)) return null;
  const s = Msum * Msum, below = Msum <= ma + mb;
  const E = (s - ma * ma - mb * mb) / (2 * mb);
  const Ea = below ? ma : E, T = Ea - ma, p = Math.sqrt(Math.max(0, Ea * Ea - ma * ma));
  return { E: Ea, T, p, sqrtS: Msum, below, collider: Math.max(Msum / 2, ma) };
}

/** √s for a beam of total energy E (mass ma) on a target of mass mb at rest. */
export const sqrtSFixed = (ma: number, E: number, mb: number) => Math.sqrt(ma * ma + mb * mb + 2 * E * mb);

/** Particle masses (MeV), rounded general values (PDG-style), so names can be typed instead of numbers. */
export const MASSES: Record<string, number> = {
  'γ': 0, gamma: 0, photon: 0, nu: 0, 'ν': 0, neutrino: 0, g: 0, gluon: 0,
  e: 0.51100, electron: 0.51100, positron: 0.51100, 'e-': 0.51100, 'e+': 0.51100,
  mu: 105.658, muon: 105.658, 'μ': 105.658, tau: 1776.9, 'τ': 1776.9,
  'pi+': 139.570, 'pi-': 139.570, 'π+': 139.570, 'π-': 139.570, pi: 139.570, 'π': 139.570, pi0: 134.977, 'π0': 134.977,
  'k+': 493.677, 'k-': 493.677, k: 493.677, k0: 497.611, eta: 547.86, 'η': 547.86, rho: 775.3, 'ρ': 775.3, omega: 782.66, 'ω': 782.66,
  p: 938.272, proton: 938.272, pbar: 938.272, n: 939.565, neutron: 939.565, lambda: 1115.68, 'Λ': 1115.68,
  d: 1875.613, deuteron: 1875.613, alpha: 3727.379, 'α': 3727.379,
  'j/psi': 3096.9, jpsi: 3096.9, upsilon: 9460.3, w: 80370, z: 91188, h: 125200, higgs: 125200, top: 172600, t: 172600,
};
/** A mass (MeV) from a number or a particle name; NaN if neither. */
export function massOf(s: string): number {
  const t = s.trim().toLowerCase().replace(/\s+/g, '');
  if (t in MASSES) return MASSES[t];
  const k = Object.keys(MASSES).find((x) => x.toLowerCase() === t);
  if (k) return MASSES[k];
  const v = Number(t.replace(/[−–]/g, '-').replace(',', '.'));
  return t !== '' && Number.isFinite(v) ? v : NaN;
}
