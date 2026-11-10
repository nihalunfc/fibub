// Pulling a wire for the school stress-strain-test tool: a teaching stress-strain curve for a few materials
// (made-up, rounded values that behave like the named material), the strain under a hanging load, the
// permanent stretch after unloading, and Searle's experiment (load against extension, Young's modulus from the
// slope). Plain TypeScript, no DOM.
import { type Question, pick, one, n } from './h4quiz.ts';

export const G = 9.8;
export type Material = {
  id: string; name: string; kind: 'metal' | 'rubber';
  E: number;      // Young's modulus, Pa (for rubber: the small-strain modulus)
  sy: number;     // yield (elastic limit), Pa
  su: number;     // ultimate (greatest) stress, Pa
  eu: number;     // strain at the greatest stress
  ef: number;     // strain at fracture
  sf: number;     // stress at fracture, Pa
};
const GPa = 1e9, MPa = 1e6;
// Rounded teaching values, not data for any real grade of metal or rubber.
export const MATERIALS: Material[] = [
  { id: 'steel', name: 'Steel', kind: 'metal', E: 200 * GPa, sy: 250 * MPa, su: 420 * MPa, eu: 0.15, ef: 0.25, sf: 340 * MPa },
  { id: 'copper', name: 'Copper', kind: 'metal', E: 120 * GPa, sy: 70 * MPa, su: 220 * MPa, eu: 0.3, ef: 0.45, sf: 180 * MPa },
  { id: 'aluminium', name: 'Aluminium', kind: 'metal', E: 70 * GPa, sy: 100 * MPa, su: 150 * MPa, eu: 0.12, ef: 0.2, sf: 120 * MPa },
  { id: 'rubber', name: 'Rubber', kind: 'rubber', E: 2 * MPa, sy: Infinity, su: (2 * MPa / 3) * (6 - 1 / 36), eu: 5, ef: 5, sf: (2 * MPa / 3) * (6 - 1 / 36) },
];
export const material = (id: string) => MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
/** A mystery metal wire for Searle's experiment, Young's modulus E (Pa). */
export const mystery = (E: number): Material => ({ id: 'mystery', name: 'Mystery wire', kind: 'metal', E, sy: 200 * MPa, su: 350 * MPa, eu: 0.15, ef: 0.25, sf: 290 * MPa });

/** Engineering stress (Pa) at strain e; NaN past fracture. */
export function stressAt(m: Material, e: number): number {
  if (e < 0) return NaN;
  if (m.kind === 'rubber') { if (e > m.ef) return NaN; const l = 1 + e; return (m.E / 3) * (l - 1 / (l * l)); }
  const ey = m.sy / m.E;
  if (e <= ey) return m.E * e;
  if (e <= m.eu) { const t = (e - ey) / (m.eu - ey); return m.sy + (m.su - m.sy) * (1 - (1 - t) ** 2); }
  if (e <= m.ef) { const t = (e - m.eu) / (m.ef - m.eu); return m.su - (m.su - m.sf) * t * t; }
  return NaN;
}
export const yieldStrain = (m: Material) => (m.kind === 'rubber' ? Infinity : m.sy / m.E);

/** Strain under a steady stress s (Pa) from a hanging load, on the rising part of the curve; null if the wire breaks. */
export function strainUnder(m: Material, s: number): number | null {
  if (s < 0) return null;
  if (s > m.su + 1e-6) return null;
  if (m.kind === 'rubber') { // solve (E/3)(l − 1/l²) = s for l ≥ 1 by Newton's method
    let l = 1 + (3 * s) / m.E; for (let i = 0; i < 60; i++) { const f = (m.E / 3) * (l - 1 / (l * l)) - s, d = (m.E / 3) * (1 + 2 / (l * l * l)); l -= f / d; if (Math.abs(f) < 1e-9) break; }
    return l - 1;
  }
  if (s <= m.sy) return s / m.E;
  const ey = m.sy / m.E, u = Math.min(1, (s - m.sy) / (m.su - m.sy));
  return ey + (1 - Math.sqrt(1 - u)) * (m.eu - ey);
}

/** Stretch left after the load comes off, from the greatest strain reached (metals unload along a line of slope E). */
export function permanentSet(m: Material, eMax: number): number {
  if (m.kind === 'rubber' || eMax <= yieldStrain(m)) return 0;
  return Math.max(0, eMax - stressAt(m, eMax) / m.E);
}

/** Strain now under stress s, given the greatest strain reached so far (loading past it follows the curve, below
 *  it the wire is elastic about its permanent set). null if the wire breaks. */
export function wireStrain(m: Material, s: number, eMax: number): { e: number; eMax: number } | null {
  const sMax = eMax > 0 ? stressAt(m, eMax) : 0;
  if (s > sMax) { const e = strainUnder(m, s); return e === null ? null : { e, eMax: e }; }
  if (m.kind === 'rubber') { const e = strainUnder(m, s)!; return { e, eMax }; }
  return { e: permanentSet(m, eMax) + s / m.E, eMax };
}

export const area = (dMm: number) => Math.PI * ((dMm / 1000) / 2) ** 2;
/** Load in kg that breaks a wire of diameter d (mm). */
export const breakingLoad = (m: Material, dMm: number) => (m.su * area(dMm)) / G;

/** Searle's experiment: extension (m) of a wire of length L (m), diameter d (mm), Young's modulus E (Pa) under M kg. */
export const searleExtension = (E: number, L: number, dMm: number, M: number) => (M * G * L) / (area(dMm) * E);
/** Least-squares slope through the origin of extension (m) against load (kg). */
export function slopeThroughOrigin(loads: number[], ext: number[]) {
  let sxy = 0, sxx = 0; for (let i = 0; i < loads.length; i++) { sxy += loads[i] * ext[i]; sxx += loads[i] * loads[i]; }
  return sxx > 0 ? sxy / sxx : NaN;
}
/** Young's modulus from the slope (m per kg): Y = g L / (A × slope). */
export const youngFromSlope = (slope: number, L: number, dMm: number) => (G * L) / (area(dMm) * slope);

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const M = pick(rng, 2, 10), d = one(rng, [0.5, 1, 2]), A = area(d), s = (M * G) / A / 1e6;
    qs.push({ text: `A wire ${d} mm across holds a ${M} kg load. What is the stress in it, in MPa? (g = 9.8 m/s²)`, ans: s, unit: 'MPa', work: `Area = π r² = π × (${d / 2} × 10⁻³ m)² = ${n(A * 1e6, 4)} × 10⁻⁶ m². Stress = F/A = ${n(M * G, 1)} N ÷ ${n(A * 1e6, 4)} × 10⁻⁶ m² = ${n(s, 1)} MPa.`, tol: Math.max(0.1, s * 0.01) }); }
  { const L = pick(rng, 1, 4), dl = pick(rng, 1, 9) / 10, e = (dl / 1000 / L) * 1e4;
    qs.push({ text: `A ${L} m wire stretches by ${dl} mm. What is the strain? Give it in units of 10⁻⁴.`, ans: e, unit: '× 10⁻⁴', work: `Strain = ΔL/L = ${dl} × 10⁻³ m ÷ ${L} m = ${n(e, 3)} × 10⁻⁴. It has no unit.`, tol: 0.01 }); }
  { const s = pick(rng, 5, 20) * 10, e = pick(rng, 5, 12) / 10; // s MPa over e × 10⁻³ gives Y in GPa
    qs.push({ text: `A stress of ${s} MPa gives a strain of ${e} × 10⁻³ in a wire. What is its Young's modulus in GPa?`, ans: s / e, unit: 'GPa', work: `Y = stress/strain = ${s} × 10⁶ ÷ ${e} × 10⁻³ = ${n(s / e, 1)} × 10⁹ Pa = ${n(s / e, 1)} GPa.`, tol: Math.max(0.2, (s / e) * 0.01) }); }
  { const L = 2, d = 0.5, M = pick(rng, 2, 8), ext = searleExtension(200e9, L, d, M) * 1000;
    qs.push({ text: `A steel wire (Y = 200 GPa) is ${L} m long and ${d} mm across. How much does a ${M} kg load stretch it, in mm? (g = 9.8 m/s²)`, ans: ext, unit: 'mm', work: `ΔL = F L / (A Y) = ${n(M * G, 1)} × ${L} ÷ (${n(area(d) * 1e6, 4)} × 10⁻⁶ × 200 × 10⁹) = ${n(ext, 3)} mm.`, tol: 0.01 }); }
  return qs;
}
