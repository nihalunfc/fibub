// #1411 Internal resistance and terminal voltage: I = E / (R + r), V = E − I r, power in the load and the
// maximum power transfer at R = r; a straight-line fit of V against I to find E and r from readings. No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

/** A cell of emf E and internal resistance r driving a load R (R = Infinity for an open circuit). */
export function circuit(E: number, r: number, R: number) {
  const I = Number.isFinite(R) ? E / (R + r) : 0, V = E - I * r;
  return { I, V, lost: I * r, Pload: I * V, Pcell: E * I, Pr: I * I * r, eff: E > 0 ? V / E : 0 };
}
/** The largest power the load can take, at R = r: E² / (4 r). */
export const maxPower = (E: number, r: number) => (E * E) / (4 * r);

/** Least-squares line V = a + b I through readings; E = a, r = −b. Needs two different currents. */
export function fitLine(points: { I: number; V: number }[]) {
  const n = points.length;
  if (n < 2) return null;
  const mi = points.reduce((s, p) => s + p.I, 0) / n, mv = points.reduce((s, p) => s + p.V, 0) / n;
  const sxx = points.reduce((s, p) => s + (p.I - mi) ** 2, 0), sxy = points.reduce((s, p) => s + (p.I - mi) * (p.V - mv), 0);
  if (sxx < 1e-18) return null;
  const b = sxy / sxx, a = mv - b * mi;
  return { E: a, r: -b, shortCircuit: a / -b };
}

export function questions(rng: () => number = Math.random): Question[] {
  const E = pick(rng, [1.5, 2, 6, 9, 12]), r = pick(rng, [0.5, 1, 2]), R = pick(rng, [4, 5, 10, 11]);
  const I = E / (R + r), V = E - I * r;
  const E2 = pick(rng, [1.5, 2, 3]), V2 = Number((E2 * pick(rng, [0.8, 0.9, 0.75])).toFixed(2)), R2 = pick(rng, [5, 10, 15]);
  const r2 = (R2 * (E2 - V2)) / V2;
  const E3 = pick(rng, [6, 12]), r3v = pick(rng, [0.5, 1, 2]), Pm = (E3 * E3) / (4 * r3v);
  return [
    { text: `A cell of emf ${E} V and internal resistance ${r} Ω is connected to a ${R} Ω resistor. What is the terminal voltage, in volts?`, answer: V, unit: 'V', tol: 0.02,
      steps: ['I = E / (R + r), then V = E − I r (or V = I R)', `I = ${E} / (${R} + ${r}) = ${r3(I)} A`, `V = ${r3(I)} × ${R} = ${r3(V)} V`] },
    { text: `A cell has emf ${E2} V on open circuit. With a ${R2} Ω resistor across it the voltmeter reads ${V2} V. What is its internal resistance, in ohms?`, answer: r2, unit: 'Ω', tol: 0.02,
      steps: ['r = R (E − V) / V', `r = ${R2} × (${E2} − ${V2}) / ${V2} = ${r3(r2)} Ω`] },
    { text: `What is the most power a ${E3} V battery with internal resistance ${r3v} Ω can deliver to an external resistor, in watts?`, answer: Pm, unit: 'W', tol: 0.02,
      steps: ['Maximum when R = r: P = E² / (4 r)', `P = ${E3}² / (4 × ${r3v}) = ${r3(Pm)} W`] },
    { text: `For that battery, what resistance (in ohms) gives that maximum power?`, answer: r3v, unit: 'Ω', tol: 0.02,
      steps: ['The load takes the most power when its resistance equals the internal resistance.', `R = r = ${r3(r3v)} Ω`] },
  ];
}
