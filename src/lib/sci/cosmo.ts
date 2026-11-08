// Cosmological distances and times for a Friedmann-Lemaitre-Robertson-Walker universe with matter,
// radiation, curvature and a cosmological constant (Hogg 1999, "Distance measures in cosmology").

export const C_KMS = 299792.458;
/** Gyr per (km/s/Mpc)^-1: 1 Mpc / (1 km/s) in Gyr. */
const MPC_KM = 3.0856775814913673e19, GYR_S = 3.15576e16, HUBBLE_GYR = MPC_KM / GYR_S;

export type Cosmo = { H0: number; Om: number; OL: number; Or: number };

/** Radiation density (photons and neutrinos) from the CMB temperature and Neff, as Planck reports it. */
export function omegaR(H0: number, Tcmb = 2.7255, Neff = 3.046) {
  const h = H0 / 100, ogh2 = 2.4728e-5 * (Tcmb / 2.7255) ** 4;
  return (ogh2 * (1 + 0.22711 * Neff)) / (h * h);
}

/** Simpson's rule with n (even) intervals. */
function simpson(f: (x: number) => number, a: number, b: number, n = 4000) {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

export const E = (c: Cosmo, z: number) => { const Ok = 1 - c.Om - c.OL - c.Or, x = 1 + z; return Math.sqrt(c.Or * x ** 4 + c.Om * x ** 3 + Ok * x * x + c.OL); };

export function cosmology(c: Cosmo, z: number) {
  if (!(c.H0 > 0)) throw new Error('H0 must be above zero');
  if (!(z >= 0)) throw new Error('Redshift must be zero or more');
  const Ok = 1 - c.Om - c.OL - c.Or, a = 1 / (1 + z);
  // Check the expansion rate stays real between now and z (no bounce or recollapse in range).
  for (let i = 0; i <= 200; i++) { const zz = (z * i) / 200; const e2 = c.Or * (1 + zz) ** 4 + c.Om * (1 + zz) ** 3 + Ok * (1 + zz) ** 2 + c.OL; if (!(e2 > 0)) throw new Error('This universe has no Big Bang or turns around before that redshift: check Ωm and ΩΛ'); }
  // In a = 1/(1+z), with a = u² so the integrands are smooth at a = 0.
  const tInt = (u: number) => { const aa = u * u; if (aa === 0) return 0; return (2 * u) / Math.sqrt(c.Or / (aa * aa) + c.Om / aa + Ok + c.OL * aa * aa) ; };
  const ageAt = (aa: number) => (HUBBLE_GYR / c.H0) * simpson(tInt, 0, Math.sqrt(aa));
  const age0 = ageAt(1), ageZ = ageAt(a);
  const dc = (C_KMS / c.H0) * simpson((aa) => 1 / Math.sqrt(c.Or + c.Om * aa + Ok * aa * aa + c.OL * aa ** 4), a, 1);
  const DH = C_KMS / c.H0, s = Math.sqrt(Math.abs(Ok));
  const dm = Ok > 1e-9 ? (DH / s) * Math.sinh((s * dc) / DH) : Ok < -1e-9 ? (DH / s) * Math.sin((s * dc) / DH) : dc;
  const dl = (1 + z) * dm, da = dm / (1 + z);
  // Comoving volume out to z (Hogg eq. 29), in Gpc³.
  let vc: number;
  if (Math.abs(Ok) <= 1e-9) vc = (4 * Math.PI / 3) * dm ** 3;
  else { const r = dm / DH, sq = Math.sqrt(1 + Ok * r * r); vc = ((4 * Math.PI * DH ** 3) / (2 * Ok)) * (r * sq - (Ok > 0 ? Math.asinh(s * r) : Math.asin(s * r)) / s); }
  return {
    Ok, age0, ageZ, lookback: age0 - ageZ, dc, dm, da, dl, vcGpc3: vc / 1e9,
    kpcPerArcsec: (da * 1000 * Math.PI) / (180 * 3600),
    distMod: z > 0 ? 5 * Math.log10(dl * 1e6 / 10) : NaN,
    Hz: c.H0 * E(c, z), T: 2.7255 * (1 + z),
    vRel: C_KMS * (((1 + z) ** 2 - 1) / ((1 + z) ** 2 + 1)), vCz: C_KMS * z,
  };
}
export const presets: Record<string, { name: string; H0: number; Om: number; flat: true; note: string }> = {
  planck18: { name: 'Planck 2018', H0: 67.66, Om: 0.3111, flat: true, note: 'TT,TE,EE+lowE+lensing+BAO (Planck Collaboration 2020, Table 2)' },
  wmap9: { name: 'WMAP 9-year', H0: 69.32, Om: 0.2865, flat: true, note: 'WMAP+eCMB+BAO+H0 (Hinshaw et al. 2013)' },
  round: { name: 'Round numbers', H0: 70, Om: 0.3, flat: true, note: 'H0 = 70, Ωm = 0.3, common in textbooks' },
};
