// Ohm's law lab (school level): readings for a resistor, a filament bulb and a length of wire, the resistance of a
// wire from its resistivity, length and thickness, a best-fit line through V-I readings, and fresh practice questions.
// Plain maths, no DOM. Resistivities are rounded textbook values at about 20 °C.

import { pick, r3, type Question } from './elec-quiz.ts';

export type Part = 'resistor' | 'bulb' | 'wire';
export const MATERIALS: Record<string, { name: string; rho: number }> = {
  copper: { name: 'Copper', rho: 1.7e-8 },
  aluminium: { name: 'Aluminium', rho: 2.7e-8 },
  tungsten: { name: 'Tungsten', rho: 5.6e-8 },
  iron: { name: 'Iron', rho: 1.0e-7 },
  constantan: { name: 'Constantan', rho: 4.9e-7 },
  nichrome: { name: 'Nichrome', rho: 1.1e-6 },
};
/** Free electrons per cubic metre in copper (one per atom), for the drift speed at Class 12 level. */
export const N_COPPER = 8.5e28;
export const E_CHARGE = 1.602176634e-19;

/** Cross-section area (m²) of a round wire of diameter d (m). */
export const area = (d: number) => (Math.PI * d * d) / 4;
/** Resistance of a wire: R = ρL/A. */
export const wireR = (rho: number, L: number, d: number) => (rho * L) / area(d);
/** Drift speed v = I / (n e A). */
export const drift = (I: number, n: number, A: number) => I / (n * E_CHARGE * A);

/** A teaching model of a small torch bulb rated 6 V, 0.5 A. The filament's resistance grows as it heats, from
 * 2 Ω cold to 12 Ω at 6 V: R = 2 + 10 (V/6)^0.8 ohms. The power 0.8 keeps the current rising with the voltage. */
export const BULB = { V: 6, I: 0.5, cold: 2, p: 0.8 };
export const bulbR = (V: number) => BULB.cold + (BULB.V / BULB.I - BULB.cold) * Math.pow(Math.max(0, V) / BULB.V, BULB.p);
export const bulbI = (V: number) => (V <= 0 ? 0 : V / bulbR(V));

/** Current through the part for a voltage V across it. */
export function current(part: Part, V: number, R: number) {
  return part === 'bulb' ? bulbI(V) : V / R;
}

/** Least-squares straight line V = m I + c through the readings, and the line through the origin V = k I. */
export function fit(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return null;
  let si = 0, sv = 0, sii = 0, siv = 0, svv = 0;
  for (const [I, V] of pts) { si += I; sv += V; sii += I * I; siv += I * V; svv += V * V; }
  const d = n * sii - si * si;
  if (d <= 0) return null;
  const m = (n * siv - si * sv) / d, c = (sv - m * si) / n;
  const k = siv / sii;
  // r² of the free line, to tell a straight set of readings from a curved one.
  const ss = svv - (sv * sv) / n, res = pts.reduce((s, [I, V]) => s + (V - m * I - c) ** 2, 0);
  const r2 = ss > 0 ? 1 - res / ss : 1;
  return { m, c, k, r2 };
}

/** Rounds like a meter with a given step (e.g. 0.01 A). */
export const meter = (x: number, step: number) => Math.round(x / step) * step;

/** Fresh practice questions with random numbers. rng is Math.random on the page and a seeded one in tests. */
export function questions(rng: () => number = Math.random): Question[] {
  const V1 = pick(rng, [3, 4.5, 6, 9, 12, 24]), R1 = pick(rng, [4, 5, 8, 10, 12, 15, 20, 30]);
  const I1 = V1 / R1;
  const V2 = pick(rng, [1.5, 3, 6, 9, 12]), I2 = pick(rng, [0.2, 0.25, 0.3, 0.5, 0.6, 0.75]);
  const L = pick(rng, [0.5, 1, 1.5, 2, 3]), dmm = pick(rng, [0.2, 0.3, 0.4, 0.5]);
  const R3 = wireR(MATERIALS.nichrome.rho, L, dmm / 1000);
  const kL = pick(rng, [2, 3, 4]), kd = pick(rng, [2, 3]);
  return [
    { text: `A ${R1} Ω resistor is connected to a ${V1} V battery. What current flows?`, answer: I1, unit: 'A', tol: 0.02,
      steps: [`I = V / R`, `I = ${V1} V / ${R1} Ω = ${r3(I1)} A`] },
    { text: `A voltmeter reads ${V2} V across a wire and the ammeter reads ${I2} A. What is the wire's resistance?`, answer: V2 / I2, unit: 'Ω', tol: 0.02,
      steps: [`R = V / I`, `R = ${V2} V / ${I2} A = ${r3(V2 / I2)} Ω`] },
    { text: `A nichrome wire (ρ = 1.1 × 10⁻⁶ Ω m) is ${L} m long and ${dmm} mm thick. What is its resistance?`, answer: R3, unit: 'Ω', tol: 0.03,
      steps: [`A = π d² / 4 = π × (${dmm} × 10⁻³ m)² / 4 = ${r3(area(dmm / 1000))} m²`, `R = ρ L / A = 1.1 × 10⁻⁶ × ${L} / ${r3(area(dmm / 1000))} = ${r3(R3)} Ω`] },
    { text: `A wire has a resistance of ${R1} Ω. A second wire of the same metal is ${kL} times as long and ${kd} times as thick (diameter). What is its resistance?`,
      answer: (R1 * kL) / (kd * kd), unit: 'Ω', tol: 0.02,
      steps: [`R = ρ L / A, and the area A grows as d², so ${kd} times the diameter gives ${kd * kd} times the area.`, `R₂ = ${R1} Ω × ${kL} / ${kd * kd} = ${r3((R1 * kL) / (kd * kd))} Ω`] },
  ];
}

