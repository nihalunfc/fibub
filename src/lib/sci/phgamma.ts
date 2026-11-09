// Gamma-ray shielding: narrow-beam attenuation I = I0 e^(−μx), half- and tenth-value layers, optional buildup
// factor, and the thickness needed for a wanted transmission. Mass attenuation coefficients are a small rounded
// set (3 significant figures) from NIST XCOM / the NIST X-ray mass attenuation tables (US government work,
// public domain), interpolated log-log between 0.1 and 2 MeV. Teaching values, editable on the page. No DOM.

export const ENERGIES = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.25, 1.5, 2.0];
/** Mass attenuation coefficient μ/ρ (cm²/g, total with coherent scattering), rounded, at ENERGIES. */
export const MATERIALS: Record<string, { name: string; rho: number; mu: number[] }> = {
  lead: { name: 'Lead', rho: 11.35, mu: [5.55, 2.01, 0.999, 0.403, 0.232, 0.161, 0.125, 0.0887, 0.0710, 0.0588, 0.0522, 0.0461] },
  tungsten: { name: 'Tungsten', rho: 19.3, mu: [4.44, 1.58, 0.784, 0.324, 0.193, 0.138, 0.109, 0.0809, 0.0662, 0.0559, 0.0500, 0.0444] },
  iron: { name: 'Iron (steel)', rho: 7.87, mu: [0.372, 0.196, 0.146, 0.110, 0.0940, 0.0841, 0.0770, 0.0670, 0.0600, 0.0535, 0.0488, 0.0427] },
  aluminium: { name: 'Aluminium', rho: 2.70, mu: [0.170, 0.138, 0.122, 0.104, 0.0928, 0.0845, 0.0780, 0.0684, 0.0615, 0.0550, 0.0501, 0.0432] },
  concrete: { name: 'Concrete (ordinary)', rho: 2.30, mu: [0.169, 0.139, 0.124, 0.107, 0.0955, 0.0874, 0.0807, 0.0707, 0.0636, 0.0569, 0.0518, 0.0445] },
  water: { name: 'Water', rho: 1.00, mu: [0.171, 0.151, 0.137, 0.119, 0.106, 0.0969, 0.0896, 0.0787, 0.0707, 0.0632, 0.0575, 0.0494] },
};
/** Common gamma lines (MeV), general values. */
export const LINES: Record<string, { label: string; E: number }> = {
  tc99m: { label: 'Tc-99m (0.140 MeV)', E: 0.1405 },
  i131: { label: 'I-131 (0.364 MeV)', E: 0.364 },
  f18: { label: 'Annihilation, F-18 (0.511 MeV)', E: 0.511 },
  cs137: { label: 'Cs-137 (0.662 MeV)', E: 0.662 },
  co60: { label: 'Co-60 (1.25 MeV, average of 1.17 and 1.33)', E: 1.25 },
  na24: { label: 'Na-24 (1.37 MeV)', E: 1.369 },
};

/** μ/ρ (cm²/g) for a material at energy E (MeV), log-log interpolation; NaN outside 0.1 to 2 MeV. */
export function massAtten(mat: string, E: number): number {
  const m = MATERIALS[mat]; if (!m || !(E >= ENERGIES[0] && E <= ENERGIES[ENERGIES.length - 1])) return NaN;
  let i = 0; while (i < ENERGIES.length - 2 && E > ENERGIES[i + 1]) i++;
  const f = Math.log(E / ENERGIES[i]) / Math.log(ENERGIES[i + 1] / ENERGIES[i]);
  return Math.exp(Math.log(m.mu[i]) + f * (Math.log(m.mu[i + 1]) - Math.log(m.mu[i])));
}

export type Buildup = { kind: 'none' } | { kind: 'linear' } | { kind: 'berger'; a: number; b: number };
/** Buildup factor at mu·x (number of mean free paths). */
export function buildup(mux: number, B: Buildup): number {
  if (B.kind === 'linear') return 1 + mux;
  if (B.kind === 'berger') return 1 + B.a * mux * Math.exp(B.b * mux);
  return 1;
}
/** Transmitted fraction through x cm with linear attenuation coefficient mu (1/cm). */
export const transmission = (mu: number, x: number, B: Buildup = { kind: 'none' }) => buildup(mu * x, B) * Math.exp(-mu * x);
export const hvl = (mu: number) => Math.LN2 / mu;
export const tvl = (mu: number) => Math.LN10 / mu;

/** Thickness (cm) for a wanted transmitted fraction (0 < f < 1); null if it cannot be reached within 200 mean free paths. */
export function thicknessFor(mu: number, f: number, B: Buildup = { kind: 'none' }): number | null {
  if (!(f > 0 && f < 1 && mu > 0)) return null;
  if (B.kind === 'none') return -Math.log(f) / mu;
  // Find the first crossing by stepping in mean free paths, then bisect.
  const g = (n: number) => buildup(n, B) * Math.exp(-n) - f;
  let lo = 0, step = 0.05, hi = NaN;
  for (let n = step; n <= 200; n += step) { if (g(n) <= 0) { hi = n; lo = n - step; break; } }
  if (!Number.isFinite(hi)) return null;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (g(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2 / mu;
}
