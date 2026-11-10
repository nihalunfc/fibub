// A hydraulic lift for the school hydraulic-lift tool: Pascal's law (the same extra pressure everywhere in the
// liquid), the force multiplied by the area ratio and the distance divided by it, with the work the same on
// both sides. Plain TypeScript, no DOM.
import { type Question, pick, one, n } from './h4quiz.ts';

export const G = 9.8;
/** Area (m²) of a piston of diameter d (m). */
export const pistonArea = (d: number) => (Math.PI * d * d) / 4;

/** Small piston diameter d1, big d2 (m), load mass on the big piston (kg), small piston pushed down x1 (m). */
export function lift(d1: number, d2: number, mass: number, x1: number) {
  const a1 = pistonArea(d1), a2 = pistonArea(d2), ratio = a2 / a1;
  const load = mass * G, effort = load / ratio, p = effort / a1, x2 = x1 / ratio;
  return { a1, a2, ratio, load, effort, p, x2, workIn: effort * x1, workOut: load * x2 };
}
/** Strokes of length s (m) on the small piston needed to raise the load by h (m) (the pump refills between strokes). */
export const strokes = (d1: number, d2: number, s: number, h: number) => Math.ceil((h * pistonArea(d2)) / (s * pistonArea(d1)) - 1e-9);

export type Preset = { id: string; name: string; d1: number; d2: number; mass: number };
export const PRESETS: Preset[] = [
  { id: 'garage', name: 'Garage car lift', d1: 0.04, d2: 0.4, mass: 1200 },
  { id: 'jack', name: 'Bottle jack', d1: 0.015, d2: 0.05, mass: 1000 },
  { id: 'press', name: 'Hydraulic press', d1: 0.02, d2: 0.3, mass: 5000 },
];

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const a1 = pick(rng, 2, 10), k = one(rng, [10, 20, 25, 50]), f1 = pick(rng, 2, 9) * 10;
    qs.push({ text: `A hydraulic lift has a small piston of area ${a1} cm² and a big piston of area ${a1 * k} cm². A force of ${f1} N pushes the small piston. What force does the big piston give?`, ans: f1 * k, unit: 'N', work: `Pressure is the same on both: F₂ = F₁ × A₂/A₁ = ${f1} × ${a1 * k}/${a1} = ${f1 * k} N.`, tol: 0.5 }); }
  { const r = one(rng, [10, 20, 40, 50]), x1 = pick(rng, 2, 10) * 10;
    qs.push({ text: `The big piston has ${r} times the area of the small one. The small piston is pushed down ${x1} cm. How far does the big piston rise, in cm?`, ans: x1 / r, unit: 'cm', work: `The liquid pushed out of the small cylinder fills the big one: A₁x₁ = A₂x₂, so x₂ = ${x1} ÷ ${r} = ${n(x1 / r, 2)} cm.`, tol: 0.01 }); }
  { const m = pick(rng, 8, 20) * 100, d1 = one(rng, [2, 4, 5]), d2 = one(rng, [20, 25, 40]), f = (m * G * d1 * d1) / (d2 * d2);
    qs.push({ text: `A ${m} kg car sits on a piston ${d2} cm across. The small piston is ${d1} cm across. What force on the small piston holds the car up? (g = 9.8 m/s²)`, ans: f, unit: 'N', work: `Areas go as diameter²: F₁ = m g × (${d1}/${d2})² = ${n(m * G, 0)} × ${n((d1 * d1) / (d2 * d2), 5)} = ${n(f, 1)} N.`, tol: Math.max(0.5, f * 0.01) }); }
  { const f = pick(rng, 2, 9) * 50, a = one(rng, [5, 10, 20, 25]), p = f / (a * 1e-4) / 1000;
    qs.push({ text: `A force of ${f} N acts on a piston of area ${a} cm². What is the pressure in the liquid, in kPa?`, ans: p, unit: 'kPa', work: `p = F/A = ${f} ÷ ${a} × 10⁻⁴ m² = ${n(p * 1000, 0)} Pa = ${n(p, 1)} kPa.`, tol: Math.max(0.1, p * 0.01) }); }
  return qs;
}
