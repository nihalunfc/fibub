// Molar conductivity and Kohlrausch's law (school level, Class 12 electrochemistry): Λm against √c for strong
// electrolytes (Λm = Λ°m − A√c) and weak ones (Λm = αΛ°m with α from Ostwald's dilution law), Kohlrausch's law of
// independent migration of ions, conductivity κ = Λm c / 1000, and a straight-line fit to extrapolate Λ°m.
// Pure functions, no DOM.

/** Limiting molar conductivities of ions at 298 K, S cm² mol⁻¹, rounded to whole numbers (typical values). */
export const IONS: Record<string, { name: string; z: number; lambda: number }> = {
  'H+': { name: 'H⁺', z: 1, lambda: 350 }, 'Li+': { name: 'Li⁺', z: 1, lambda: 39 }, 'Na+': { name: 'Na⁺', z: 1, lambda: 50 },
  'K+': { name: 'K⁺', z: 1, lambda: 74 }, 'NH4+': { name: 'NH₄⁺', z: 1, lambda: 74 }, 'Ag+': { name: 'Ag⁺', z: 1, lambda: 62 },
  'Mg2+': { name: 'Mg²⁺', z: 2, lambda: 106 }, 'Ca2+': { name: 'Ca²⁺', z: 2, lambda: 119 }, 'Ba2+': { name: 'Ba²⁺', z: 2, lambda: 127 },
  'Cl-': { name: 'Cl⁻', z: -1, lambda: 76 }, 'Br-': { name: 'Br⁻', z: -1, lambda: 78 }, 'NO3-': { name: 'NO₃⁻', z: -1, lambda: 71 },
  'OH-': { name: 'OH⁻', z: -1, lambda: 199 }, 'Ac-': { name: 'CH₃COO⁻', z: -1, lambda: 41 }, 'SO42-': { name: 'SO₄²⁻', z: -2, lambda: 160 },
};

export type Electrolyte = { id: string; name: string; cation: string; anion: string; weak?: { K: number } };
/** Ka of ethanoic acid and Kb of ammonia, both about 1.8 × 10⁻⁵ at 298 K. */
export const ELECTROLYTES: Electrolyte[] = [
  { id: 'kcl', name: 'KCl', cation: 'K+', anion: 'Cl-' },
  { id: 'nacl', name: 'NaCl', cation: 'Na+', anion: 'Cl-' },
  { id: 'hcl', name: 'HCl', cation: 'H+', anion: 'Cl-' },
  { id: 'naoh', name: 'NaOH', cation: 'Na+', anion: 'OH-' },
  { id: 'agno3', name: 'AgNO₃', cation: 'Ag+', anion: 'NO3-' },
  { id: 'naac', name: 'CH₃COONa', cation: 'Na+', anion: 'Ac-' },
  { id: 'mgcl2', name: 'MgCl₂', cation: 'Mg2+', anion: 'Cl-' },
  { id: 'hac', name: 'CH₃COOH (weak)', cation: 'H+', anion: 'Ac-', weak: { K: 1.8e-5 } },
  { id: 'nh4oh', name: 'NH₄OH (weak)', cation: 'NH4+', anion: 'OH-', weak: { K: 1.8e-5 } },
];

/** How many cations and anions one formula unit gives, from the charges. */
export function stoich(cation: string, anion: string): { nPlus: number; nMinus: number } {
  const zp = IONS[cation]?.z, zm = IONS[anion]?.z;
  if (!(zp > 0) || !(zm < 0)) throw new Error('Pick one cation and one anion.');
  const g = gcd(zp, -zm);
  return { nPlus: -zm / g, nMinus: zp / g };
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Kohlrausch's law: Λ°m = ν₊λ°₊ + ν₋λ°₋ (S cm² mol⁻¹). */
export function limiting(cation: string, anion: string): number {
  const { nPlus, nMinus } = stoich(cation, anion);
  return nPlus * IONS[cation].lambda + nMinus * IONS[anion].lambda;
}

/** Debye-Hückel-Onsager slope A for a strong electrolyte; teaching values by charge type. */
export function slopeA(cation: string, anion: string): number {
  const zz = IONS[cation].z * -IONS[anion].z;
  return zz === 1 ? 95 : zz === 2 ? 200 : 400;
}

/** Degree of dissociation from Ostwald's law K = cα²/(1 − α), solved exactly. */
export function alphaOstwald(K: number, c: number): number {
  if (!(K > 0) || !(c > 0)) throw new Error('K and c must be above zero.');
  return (-K + Math.sqrt(K * K + 4 * K * c)) / (2 * c);
}

/** Molar conductivity Λm (S cm² mol⁻¹) at concentration c (mol/L). */
export function molarConductivity(e: Electrolyte, c: number): number {
  if (!(c > 0)) throw new Error('The concentration must be above zero.');
  const L0 = limiting(e.cation, e.anion);
  if (e.weak) return alphaOstwald(e.weak.K, c) * L0;
  return L0 - slopeA(e.cation, e.anion) * Math.sqrt(c);
}

/** Conductivity κ (S cm⁻¹) from Λm and c (mol/L): κ = Λm × c / 1000. */
export const kappa = (lm: number, c: number) => (lm * c) / 1000;

/** Least-squares straight line y = a + b x; returns intercept a, slope b and r². */
export function fitLine(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n < 2) throw new Error('Need at least two points.');
  const mx = xs.reduce((s, x) => s + x, 0) / n, my = ys.reduce((s, y) => s + y, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
  const b = sxy / sxx, a = my - b * mx;
  return { a, b, r2: syy ? (sxy * sxy) / (sxx * syy) : 1 };
}
