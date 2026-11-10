// Bernoulli's principle for the school bernoulli-flow tool: a Venturi tube (continuity A₁v₁ = A₂v₂ and the
// pressure drop ½ρ(v₂² − v₁²)), the Venturi meter run backwards, and Torricelli's tank (speed of efflux √(2gh),
// where the jet lands, and the time to drain). Ideal fluid: no viscosity, steady flow. Plain TypeScript, no DOM.
import { type Question, pick, one, n } from './h4quiz.ts';

export const G = 9.8;
export type Fluid = { id: string; name: string; rho: number };
export const FLUIDS: Fluid[] = [
  { id: 'water', name: 'Water', rho: 1000 },
  { id: 'air', name: 'Air', rho: 1.2 },
];
const area = (d: number) => (Math.PI * d * d) / 4;

/** Venturi tube: wide part d1, throat d2 (m), speed v1 (m/s) in the wide part, fluid density rho. Heights h are of
 *  a water column (manometer or open tubes) that would show the pressure drop. */
export function venturi(d1: number, d2: number, v1: number, rho: number) {
  const a1 = area(d1), a2 = area(d2), v2 = (v1 * a1) / a2, dp = 0.5 * rho * (v2 * v2 - v1 * v1);
  return { a1, a2, v2, dp, q: a1 * v1, hWater: dp / (1000 * G) };
}
/** Venturi meter: the flow (m³/s) from a measured pressure drop dp (Pa). */
export function flowFromDrop(d1: number, d2: number, dp: number, rho: number) {
  const a1 = area(d1), a2 = area(d2);
  return a1 * a2 * Math.sqrt((2 * dp) / (rho * (a1 * a1 - a2 * a2)));
}

/** Torricelli: water h (m) above a hole that is y (m) above the ground; tank diameter D, hole diameter d (m). */
export function torricelli(h: number, y: number, D: number, d: number) {
  const v = Math.sqrt(2 * G * h), tFall = Math.sqrt((2 * y) / G);
  return { v, range: v * tFall, rangeCheck: 2 * Math.sqrt(h * y), drain: (area(D) / area(d)) * Math.sqrt((2 * h) / G), flow: area(d) * v };
}
/** Water depth above the hole after time t (s) of draining, from h0 (m). */
export const levelAfter = (h0: number, t: number, D: number, d: number) => { const k = (area(d) / area(D)) * Math.sqrt(G / 2); return Math.max(0, Math.sqrt(h0) - k * t) ** 2; };

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const d1 = one(rng, [4, 6, 8, 10]), k = one(rng, [2, 2, 4]), v1 = pick(rng, 1, 4) / 2, v2 = v1 * k * k;
    qs.push({ text: `Water flows at ${v1} m/s in a pipe ${d1} cm across. The pipe narrows to ${d1 / k} cm across. How fast is the water in the narrow part?`, ans: v2, unit: 'm/s', work: `A₁v₁ = A₂v₂ and area goes as diameter², so v₂ = ${v1} × (${d1}/${d1 / k})² = ${v1} × ${k * k} = ${n(v2)} m/s.`, tol: 0.01 }); }
  { const v1 = pick(rng, 1, 3), v2 = v1 + pick(rng, 2, 6), dp = 0.5 * 1000 * (v2 * v2 - v1 * v1);
    qs.push({ text: `Water speeds up from ${v1} m/s to ${v2} m/s in a level pipe. By how much does its pressure drop, in kPa?`, ans: dp / 1000, unit: 'kPa', work: `Δp = ½ρ(v₂² − v₁²) = ½ × 1000 × (${v2 * v2} − ${v1 * v1}) = ${n(dp, 0)} Pa = ${n(dp / 1000, 2)} kPa.`, tol: 0.05 }); }
  { const h = one(rng, [0.2, 0.45, 0.8, 1.25, 1.8, 5]), v = Math.sqrt(2 * G * h);
    qs.push({ text: `A tank has water ${h} m above a small hole in its side. How fast does the water come out? (g = 9.8 m/s²)`, ans: v, unit: 'm/s', work: `Torricelli: v = √(2gh) = √(2 × 9.8 × ${h}) = ${n(v, 2)} m/s, as fast as a stone dropped from ${h} m.`, tol: 0.02 }); }
  { const h = pick(rng, 2, 9) / 10, y = pick(rng, 2, 9) / 10, x = 2 * Math.sqrt(h * y);
    qs.push({ text: `Water stands ${h} m above a hole, and the hole is ${y} m above the floor. How far from the tank does the jet hit the floor, in m?`, ans: x, unit: 'm', work: `v = √(2gh); it falls ${y} m in t = √(2y/g); distance = v t = 2√(h y) = 2√(${h} × ${y}) = ${n(x, 3)} m.`, tol: 0.01 }); }
  return qs;
}
