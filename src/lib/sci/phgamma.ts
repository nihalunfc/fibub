// Gamma-ray shielding: narrow-beam attenuation I = I0 e^(−μx), half- and tenth-value layers, optional buildup
// factor, and the thickness needed for a wanted transmission. The built-in mass attenuation coefficients are not a
// table: the page works them out from formulas, element by element, as
//   μ/ρ = Σ (N_A w_i / A_i) [ Z_i σ_KN(E) + σ_photo(Z_i, E) + σ_pair(Z_i, E) ],
// with the exact Klein-Nishina Compton cross-section, a textbook scaling law for the photoelectric part (the
// geometric mean of the non-relativistic and extreme-relativistic Born limits, which go as Z⁵/E^3.5 and Z⁵/E), and a
// near-threshold Born form for pair production above 1.022 MeV (good only to about 3 MeV). Coherent (Rayleigh)
// scattering and electron binding are left out. It is an approximate model for teaching and rough screening, not reference data: see ACCURACY.
// Nothing is copied from any table. No DOM.
import { ELEMENT_ROWS } from './elements.ts';

export const NA = 6.02214076e23, RE = 2.8179403262e-13, ALPHA = 7.2973525693e-3, ME = 0.51099895;
const S_TH = (8 / 3) * Math.PI * RE * RE;              // Thomson cross-section, cm²
const weight = (Z: number) => ELEMENT_ROWS[Z - 1][2];  // standard atomic weight (IUPAC), from the periodic table
/** How far the model can be out, in plain words; shown on the page and in the guide. */
export const ACCURACY = 'The built-in coefficients are worked out from approximate formulas, not looked up in a table. Above about 0.5 MeV they are usually within roughly 20 %; below that they read low for heavy materials, by up to about 2.5 times for lead and tungsten at 0.1 MeV, because the photoelectric formula is only a scaling law. Check them against NIST XCOM, and for real work type the XCOM value into the box.';
/** The model is only used between these energies (MeV); above about 3 MeV pair production needs the full
 * Bethe-Heitler treatment, which this page does not do. */
export const RANGE: [number, number] = [0.01, 3];

/** Klein-Nishina total cross-section per free electron (cm²) at photon energy E (MeV). */
export function kleinNishina(E: number): number {
  const k = E / ME;
  // Below k = 0.02 the closed form cancels badly in floating point; use its series, σ_Th(1 − 2k + 26k²/5 − 133k³/10).
  if (k < 0.02) return S_TH * (1 - 2 * k + (26 * k * k) / 5 - (133 * k * k * k) / 10);
  const a = ((1 + k) / (k * k)) * ((2 * (1 + k)) / (1 + 2 * k) - Math.log(1 + 2 * k) / k) + Math.log(1 + 2 * k) / (2 * k) - (1 + 3 * k) / (1 + 2 * k) ** 2;
  return 2 * Math.PI * RE * RE * a;
}
/**
 * Photoelectric cross-section per atom (cm²), a rough scaling law: the geometric mean of the two Born limits,
 * σ_nr = 4√2 α⁴ Z⁵ σ_Th (E/mc²)^(−7/2) and σ_er = 1.5 α⁴ Z⁵ σ_Th (E/mc²)^(−1), which between them give the familiar
 * "about Z⁴ to Z⁵ over E³" behaviour. Order of magnitude only (see ACCURACY); no shell structure, no edges.
 */
export function photoelectric(Z: number, E: number): number {
  const eps = E / ME, c = S_TH * ALPHA ** 4 * Z ** 5;
  return Math.sqrt(c * 4 * Math.SQRT2 * Math.pow(eps, -3.5) * ((c * 1.5) / eps));
}
/** Pair production in the nuclear field (cm² per atom), near-threshold Born form; zero below 2 mc² = 1.022 MeV. */
export function pairProduction(Z: number, E: number): number {
  const eps = E / ME;
  return eps <= 2 ? 0 : (2 * Math.PI / 3) * ALPHA * RE * RE * Z * Z * Math.pow((eps - 2) / eps, 3);
}

/** A material: its name, density (rounded, editable on the page) and composition as weight fractions by element. */
export type Material = { name: string; rho: number; comp: [number, number][] };
/** Weight fractions from a chemical formula given as [atomic number, number of atoms]. */
export function fromFormula(atoms: [number, number][]): [number, number][] {
  const total = atoms.reduce((s, [Z, n]) => s + n * weight(Z), 0);
  return atoms.map(([Z, n]) => [Z, (n * weight(Z)) / total] as [number, number]);
}
/** Weight fractions of a mixture of parts, each with its own weight fraction. */
export function mix(parts: [number, [number, number][]][]): [number, number][] {
  const m = new Map<number, number>();
  for (const [f, comp] of parts) for (const [Z, w] of comp) m.set(Z, (m.get(Z) ?? 0) + f * w);
  const total = [...m.values()].reduce((a, b) => a + b, 0);
  return [...m].map(([Z, w]) => [Z, w / total] as [number, number]).sort((a, b) => a[0] - b[0]);
}
const el = (Z: number): [number, number][] => [[Z, 1]];
// Air by volume: 78.08 % N₂, 20.95 % O₂, 0.93 % Ar (the usual rounded figures), turned into weight fractions.
const airComp = mix([[0.7808 * 28.014, el(7)], [0.2095 * 31.998, el(8)], [0.0093 * 39.95, el(18)]]);
// Concrete is not one material: this is a simple made-up stand-in mix, by weight. Edit μ/ρ for your own concrete.
const concreteComp = mix([[0.6, fromFormula([[14, 1], [8, 2]])], [0.2, fromFormula([[20, 1], [8, 1]])], [0.05, fromFormula([[13, 2], [8, 3]])], [0.03, fromFormula([[26, 2], [8, 3]])], [0.12, fromFormula([[1, 2], [8, 1]])]]);

/** Densities are rounded, well-known values and can be changed on the page. */
export const MATERIALS: Record<string, Material> = {
  lead: { name: 'Lead', rho: 11.35, comp: el(82) },
  tungsten: { name: 'Tungsten', rho: 19.3, comp: el(74) },
  iron: { name: 'Iron (steel)', rho: 7.87, comp: el(26) },
  aluminium: { name: 'Aluminium', rho: 2.70, comp: el(13) },
  concrete: { name: 'Concrete (simple mix)', rho: 2.30, comp: concreteComp },
  water: { name: 'Water', rho: 1.00, comp: fromFormula([[1, 2], [8, 1]]) },
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

/** Electrons per gram × the electron charge number: Σ w_i Z_i / A_i. */
export const zOverA = (comp: [number, number][]) => comp.reduce((s, [Z, w]) => s + (w * Z) / weight(Z), 0);

/** The three parts of μ/ρ (cm²/g) for a composition at energy E (MeV). */
export function parts(comp: [number, number][], E: number) {
  let compton = 0, photo = 0, pair = 0;
  for (const [Z, w] of comp) {
    const n = (NA * w) / weight(Z);
    compton += n * Z * kleinNishina(E);
    photo += n * photoelectric(Z, E);
    pair += n * pairProduction(Z, E);
  }
  return { compton, photo, pair, total: compton + photo + pair };
}
/** μ/ρ (cm²/g) for a built-in material at energy E (MeV); NaN outside 0.01 to 20 MeV or for an unknown material. */
export function massAtten(mat: string, E: number): number {
  const m = MATERIALS[mat];
  if (!m || !(E >= RANGE[0] && E <= RANGE[1])) return NaN;
  return parts(m.comp, E).total;
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
