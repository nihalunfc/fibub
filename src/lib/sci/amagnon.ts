// Chiral magnons of a 2D altermagnet in linear spin-wave theory. Square checkerboard of two sublattices A (spin up) and
// B (spin down), spin length S:
//   H = J1 Σ⟨AB⟩ Si·Sj − Σ same-sublattice J2 Si·Sj − K Σ (Siᶻ)²
// J1 > 0 couples each atom antiferromagnetically to its 4 neighbours of the other sublattice (bonds along the
// diagonals of the cell). Same-sublattice neighbours one cell away are coupled ferromagnetically (J2 > 0): along x with Ja
// and along y with Jb on A, swapped on B, so only a 90° rotation maps A onto B (the d-wave altermagnet). K > 0 is an
// easy axis along the moments. With Holstein–Primakoff bosons a (on A) and b (on B):
//   H = Σk [ AA(k) a†a + AB(k) b†b + B(k) (a b + a† b†) ]
//   AA = S [4J1 + 2K + 2Ja (1 − cos kx) + 2Jb (1 − cos ky)],  AB = the same with Ja and Jb swapped,
//   B = 4 S J1 cos(kx/2) cos(ky/2)
// and the Bogoliubov transformation gives two modes of opposite chirality (they lower Sᶻ by 1 or raise it by 1):
//   ωα,β(k) = √(((AA + AB)/2)² − B²) ± (AA − AB)/2,   AA − AB = 2S (Ja − Jb)(cos ky − cos kx).
// Energies in the units of the couplings (times S). No DOM.

export type Mag = { J1: number; Ja: number; Jb: number; K: number; S: number };

export function coeffs(m: Mag, kx: number, ky: number) {
  const base = 4 * m.J1 + 2 * m.K;
  const AA = m.S * (base + 2 * m.Ja * (1 - Math.cos(kx)) + 2 * m.Jb * (1 - Math.cos(ky)));
  const AB = m.S * (base + 2 * m.Jb * (1 - Math.cos(kx)) + 2 * m.Ja * (1 - Math.cos(ky)));
  const B = 4 * m.S * m.J1 * Math.cos(kx / 2) * Math.cos(ky / 2);
  return { AA, AB, B };
}

/** The two magnon energies [α, β] at k: α lowers Sᶻ (lives mostly on the spin-up sublattice A), β raises it. NaN if unstable. */
export function modes(m: Mag, kx: number, ky: number): [number, number] {
  const { AA, AB, B } = coeffs(m, kx, ky), mid = (AA + AB) / 2, d = mid * mid - B * B;
  if (d < -1e-12 || mid < 0) return [NaN, NaN];
  const r = Math.sqrt(Math.max(0, d)), h = (AA - AB) / 2;
  return [r + h, r - h];
}

/** Gap at Γ: 2S √(K (4J1 + K)) for this model. */
export const gapGamma = (m: Mag) => modes(m, 0, 0)[0];

/** Checks the classical state is stable: every mode real and ≥ 0 on a grid. Returns the most negative energy found. */
export function stability(m: Mag, n = 64) {
  let lo = Infinity, at = [0, 0];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const kx = -Math.PI + (2 * Math.PI * i) / n, ky = -Math.PI + (2 * Math.PI * j) / n, [a, b] = modes(m, kx, ky);
    for (const e of [a, b]) { const v = Number.isNaN(e) ? -Infinity : e; if (v < lo) { lo = v; at = [kx, ky]; } }
  }
  return { min: lo, kx: at[0], ky: at[1], stable: lo > -1e-9 };
}

/** Largest chirality splitting ωα − ωβ over the zone (on a grid that includes X and Y), and where. */
export function maxSplit(m: Mag, n = 120) {
  let best = { d: 0, kx: 0, ky: 0 };
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
    const kx = -Math.PI + (2 * Math.PI * i) / n, ky = -Math.PI + (2 * Math.PI * j) / n, [a, b] = modes(m, kx, ky), d = a - b;
    if (Math.abs(d) > Math.abs(best.d) + 1e-12) best = { d, kx, ky };
  }
  return best;
}
