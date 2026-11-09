// Conformations of ethane and butane about the central C–C bond: a simple torsional energy model (a short cosine
// series through rounded teaching values), the name of each conformation, and the energy at any dihedral angle.
// Plain maths, no DOM. Used by the #1105 Newman projection spinner.

export type Mol = 'ethane' | 'butane';
// Rounded teaching values in kJ/mol (general chemistry): ethane eclipsed about 12.5 above staggered; butane
// gauche about 3.8, eclipsed (CH₃ past H) about 16 and fully eclipsed (CH₃ past CH₃) about 19 above anti.
export const LEVELS = { ethaneBarrier: 12.5, gauche: 3.8, eclipsed: 16, syn: 19 };

/** Cosine-series coefficients a0..a3 so that E(φ) = a0 + a1 cos φ + a2 cos 2φ + a3 cos 3φ passes through the butane values. */
export function butaneCoeffs(v = LEVELS) {
  // φ = 0 (syn), 60 (gauche), 120 (eclipsed), 180 (anti) give four linear equations.
  const A = [[1, 1, 1, 1], [1, 0.5, -0.5, -1], [1, -0.5, -0.5, 1], [1, -1, 1, -1]], y = [v.syn, v.gauche, v.eclipsed, 0];
  // Gaussian elimination (4×4).
  const M = A.map((r, i) => [...r, y[i]]);
  for (let c = 0; c < 4; c++) {
    let p = c; for (let r = c + 1; r < 4; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 4; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k < 5; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[4] / r[i]);
}

const rad = (d: number) => (d * Math.PI) / 180;
export const norm = (d: number) => ((d % 360) + 360) % 360;

/** Torsional energy (kJ/mol, relative to the most stable conformation) at dihedral angle φ in degrees. For butane φ is the C1–C2–C3–C4 angle; for ethane any H–C–C–H angle. */
export function energy(mol: Mol, phi: number) {
  const p = rad(phi);
  if (mol === 'ethane') return (LEVELS.ethaneBarrier / 2) * (1 + Math.cos(3 * p));
  const [a0, a1, a2, a3] = butaneCoeffs();
  return a0 + a1 * Math.cos(p) + a2 * Math.cos(2 * p) + a3 * Math.cos(3 * p);
}

/** Name of the conformation at φ (within 0.5° of a special angle), e.g. "staggered (anti)". */
export function nameAt(mol: Mol, phi: number) {
  const d = norm(phi), near = (a: number) => Math.min(Math.abs(d - a), 360 - Math.abs(d - a)) < 0.5;
  if (mol === 'ethane') {
    if ([60, 180, 300].some(near)) return 'staggered';
    if ([0, 120, 240].some(near)) return 'eclipsed';
    return 'skew (in between)';
  }
  if (near(180)) return 'anti (staggered)';
  if (near(60) || near(300)) return 'gauche (staggered)';
  if (near(0)) return 'fully eclipsed (syn)';
  if (near(120) || near(240)) return 'eclipsed';
  return 'skew (in between)';
}

export const NAMES: Record<Mol, string[]> = {
  ethane: ['staggered', 'eclipsed', 'skew (in between)'],
  butane: ['anti (staggered)', 'gauche (staggered)', 'eclipsed', 'fully eclipsed (syn)', 'skew (in between)'],
};

/** Share of molecules in a staggered well at temperature T (K): Boltzmann weights over the three wells (butane: anti vs two gauche). */
export function antiShare(T: number, v = LEVELS) {
  const R = 8.314462618e-3; // kJ/(mol K), CODATA
  const g = Math.exp(-v.gauche / (R * T));
  return 1 / (1 + 2 * g);
}
