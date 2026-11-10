// Solubility product for school chemistry (Class 11 equilibrium): mix two solutions, compare the ionic product Q
// with Ksp, find how much solid forms, and the molar solubility with or without a common ion.
// Salt MₐXᵦ ⇌ a M + b X, Ksp = [M]^a [X]^b. Concentrations in mol/L, volumes in mL. Plain maths, no DOM.

export type Salt = { id: string; formula: string; cation: string; anion: string; a: number; b: number; ksp: number; colour: string; mFrom: string; xFrom: string };
/** Rounded typical Ksp values near 25 °C (they are editable on the page; books differ a little). */
export const SALTS: Salt[] = [
  { id: 'agcl', formula: 'AgCl', cation: 'Ag⁺', anion: 'Cl⁻', a: 1, b: 1, ksp: 1.8e-10, colour: 'white', mFrom: 'AgNO₃', xFrom: 'NaCl' },
  { id: 'baso4', formula: 'BaSO₄', cation: 'Ba²⁺', anion: 'SO₄²⁻', a: 1, b: 1, ksp: 1.1e-10, colour: 'white', mFrom: 'BaCl₂', xFrom: 'Na₂SO₄' },
  { id: 'caco3', formula: 'CaCO₃', cation: 'Ca²⁺', anion: 'CO₃²⁻', a: 1, b: 1, ksp: 3.3e-9, colour: 'white', mFrom: 'CaCl₂', xFrom: 'Na₂CO₃' },
  { id: 'pbi2', formula: 'PbI₂', cation: 'Pb²⁺', anion: 'I⁻', a: 1, b: 2, ksp: 7.1e-9, colour: 'yellow', mFrom: 'Pb(NO₃)₂', xFrom: 'KI' },
  { id: 'caf2', formula: 'CaF₂', cation: 'Ca²⁺', anion: 'F⁻', a: 1, b: 2, ksp: 3.9e-11, colour: 'white', mFrom: 'CaCl₂', xFrom: 'NaF' },
  { id: 'mgoh2', formula: 'Mg(OH)₂', cation: 'Mg²⁺', anion: 'OH⁻', a: 1, b: 2, ksp: 5.6e-12, colour: 'white', mFrom: 'MgCl₂', xFrom: 'NaOH' },
  { id: 'ag2cro4', formula: 'Ag₂CrO₄', cation: 'Ag⁺', anion: 'CrO₄²⁻', a: 2, b: 1, ksp: 1.1e-12, colour: 'red-brown', mFrom: 'AgNO₃', xFrom: 'K₂CrO₄' },
];

/** Ion concentrations just after mixing V1 mL of c1 M (cation source) with V2 mL of c2 M (anion source),
 *  each source giving `perM` cations and `perX` anions per formula unit (1 for all the sources on this page). */
export function mix(c1: number, v1: number, c2: number, v2: number, perM = 1, perX = 1) {
  const V = v1 + v2;
  return { M: (perM * c1 * v1) / V, X: (perX * c2 * v2) / V, V };
}

/** Ionic product Q = [M]^a [X]^b. */
export const ionicProduct = (M: number, X: number, a: number, b: number) => M ** a * X ** b;

/** Solve f(x) = 0 on [lo, hi] for an increasing or decreasing f by bisection (200 steps). */
function bisect(f: (x: number) => number, lo: number, hi: number) {
  let flo = f(lo);
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2, fm = f(mid); if (fm === 0) return mid; if (Math.sign(fm) === Math.sign(flo)) { lo = mid; flo = fm; } else hi = mid; }
  return (lo + hi) / 2;
}

/** How much solid forms, x mol/L of salt, so that (M − a x)^a (X − b x)^b = Ksp. 0 when Q ≤ Ksp.
 *  Returns x and the ion concentrations left in solution. */
export function precipitate(M: number, X: number, a: number, b: number, ksp: number) {
  if (ionicProduct(M, X, a, b) <= ksp) return { x: 0, M, X };
  const top = Math.min(M / a, X / b);
  // Work in logs so tiny Ksp values stay accurate.
  const g = (x: number) => a * Math.log(Math.max(M - a * x, 1e-300)) + b * Math.log(Math.max(X - b * x, 1e-300)) - Math.log(ksp);
  const x = bisect(g, 0, top);
  return { x, M: M - a * x, X: X - b * x };
}

/** Molar solubility s (mol/L) of MₐXᵦ in water that already holds cM of M and cX of X (common ions):
 *  (cM + a s)^a (cX + b s)^b = Ksp. With no common ion, s = (Ksp / (aᵃ bᵇ))^(1/(a+b)). */
export function solubility(a: number, b: number, ksp: number, cM = 0, cX = 0) {
  if (!cM && !cX) return (ksp / (a ** a * b ** b)) ** (1 / (a + b));
  const g = (s: number) => a * Math.log(cM + a * s || 1e-300) + b * Math.log(cX + b * s || 1e-300) - Math.log(ksp);
  const free = (ksp / (a ** a * b ** b)) ** (1 / (a + b));
  return bisect(g, 0, free);
}
