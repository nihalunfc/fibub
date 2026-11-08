// Black bodies and stars: Planck's law, Wien's peak, Stefan-Boltzmann, colour-temperature and bolometric corrections.

export const H = 6.62607015e-34, C = 2.99792458e8, KB = 1.380649e-23, SIGMA = 5.670374419e-8;
export const WIEN_LAM = 2.897771955e-3; // m K, peak of B_λ
export const WIEN_NU = 5.878925757e10; // Hz/K, peak of B_ν
export const L_SUN = 3.828e26, R_SUN = 6.957e8, T_SUN = 5772, MBOL_SUN = 4.74, PC = 3.0856775814913673e16;

/** Spectral radiance B_λ in W m⁻² sr⁻¹ m⁻¹ at wavelength λ (m). */
export const planckLam = (lam: number, T: number) => (2 * H * C * C) / lam ** 5 / Math.expm1((H * C) / (lam * KB * T));
/** Spectral radiance B_ν in W m⁻² sr⁻¹ Hz⁻¹. */
export const planckNu = (nu: number, T: number) => (2 * H * nu ** 3) / (C * C) / Math.expm1((H * nu) / (KB * T));

/** Share of a black body's power between two wavelengths (m), by numerical integration in x = hc/λkT. */
export function bandFraction(l1: number, l2: number, T: number) {
  // Beyond x = 80 the integrand is below 1e-29 of its peak, so the range is clipped there.
  const x1 = Math.min(80, (H * C) / (l2 * KB * T)), x2 = Math.min(80, (H * C) / (l1 * KB * T)), n = 4000, f = (x: number) => (x === 0 ? 0 : x ** 3 / Math.expm1(x));
  if (x2 <= x1) return 0;
  let s = f(x1) + f(x2);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(x1 + ((x2 - x1) * i) / n);
  return ((s * (x2 - x1)) / (3 * n)) * (15 / Math.PI ** 4);
}

/** Bolometric correction BC_V from effective temperature: Flower (1996) as corrected by Torres (2010, AJ 140, 1158). */
export function bcV(T: number) {
  const x = Math.log10(T);
  const c = x < 3.7 ? [-0.190537291496456e5, 0.155144866764412e5, -0.421278819301717e4, 0.381476328422343e3]
    : x < 3.9 ? [-0.370510203809015e5, 0.385672629965804e5, -0.150651486316025e5, 0.261724637119416e4, -0.170623810323864e3]
    : [-0.118115450538963e6, 0.137145973583929e6, -0.636233812100225e5, 0.147412923260986e5, -0.170587278406872e4, 0.788731721804990e2];
  return c.reduce((s, k, i) => s + k * x ** i, 0);
}
/** Effective temperature from B − V for main-sequence-like stars (Ballesteros 2012, EPL 97, 34008). */
export const tFromBV = (bv: number) => 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62));

/** A star of temperature T (K) and radius R (solar radii), optionally at a distance (pc). */
export function star(T: number, R: number, dPc?: number) {
  const L = 4 * Math.PI * (R * R_SUN) ** 2 * SIGMA * T ** 4;
  const Mbol = MBOL_SUN - 2.5 * Math.log10(L / L_SUN), bc = bcV(T), Mv = Mbol - bc;
  const out = { L, Lsun: L / L_SUN, Mbol, bc, Mv, mV: NaN, mBol: NaN, fluxEarth: NaN };
  if (dPc && dPc > 0) { const mu = 5 * Math.log10(dPc) - 5; out.mV = Mv + mu; out.mBol = Mbol + mu; out.fluxEarth = L / (4 * Math.PI * (dPc * PC) ** 2); }
  return out;
}
