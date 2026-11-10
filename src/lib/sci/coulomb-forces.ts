// Coulomb's law and superposition for a few point charges on a board (school level). Positions in cm, charges in
// µC, forces in newtons. The angle of a force is measured anticlockwise from the +x direction (right), y upwards.
import { K } from './em-p34.ts';
import { pick, r3, type Question } from './elec-quiz.ts';

export type Charge = { q: number; x: number; y: number };

/** Force on charge a due to charge b (N). Positive F means repulsion. */
export function pairForce(a: Charge, b: Charge) {
  const dx = (a.x - b.x) / 100, dy = (a.y - b.y) / 100, r = Math.hypot(dx, dy);
  const F = (K * a.q * 1e-6 * b.q * 1e-6) / (r * r); // signed: + pushes a away from b
  return { r, F, fx: (F * dx) / r, fy: (F * dy) / r };
}

/** Every force on charge i and their vector sum. */
export function netForce(cs: Charge[], i: number) {
  const parts = cs.map((b, j) => ({ j, ...pairForce(cs[i], b) })).filter((p) => p.j !== i && p.r > 0);
  const fx = parts.reduce((s, p) => s + p.fx, 0), fy = parts.reduce((s, p) => s + p.fy, 0);
  return { parts, fx, fy, F: Math.hypot(fx, fy), angle: (Math.atan2(fy, fx) * 180) / Math.PI };
}

/** Direction in degrees, 0 to 360, anticlockwise from +x. */
export const deg360 = (a: number) => ((a % 360) + 360) % 360;

export function questions(rng: () => number = Math.random): Question[] {
  const q1 = pick(rng, [1, 2, 3, 4, 5]), q2 = pick(rng, [1, 2, 4, 6, 8]), r = pick(rng, [10, 20, 30, 50]);
  const F1 = (K * q1 * q2 * 1e-12) / (r / 100) ** 2;
  const F0 = pick(rng, [0.4, 0.9, 1.6, 3.6, 8.1]), n = pick(rng, [2, 3, 0.5]);
  const qa = pick(rng, [2, 3, 4]), qm = pick(rng, [1, 2]), d1 = pick(rng, [10, 20]), d2 = pick(rng, [10, 20, 30]);
  let qb = pick(rng, [1, 2, 5]);
  // Middle charge +qm between +qa on its left (d1 away) and +qb on its right (d2 away): both repel.
  if (Math.abs(qa / d1 ** 2 - qb / d2 ** 2) < 1e-9) qb = qb === 5 ? 1 : 5;
  const Fl = (K * qa * qm * 1e-12) / (d1 / 100) ** 2, Fr = (K * qb * qm * 1e-12) / (d2 / 100) ** 2, Fm = Math.abs(Fl - Fr);
  const Fa = pick(rng, [3, 6, 5, 9]), Fb = pick(rng, [4, 8, 12]);
  return [
    { text: `Two charges of +${q1} µC and +${q2} µC are ${r} cm apart. What is the force between them, in newtons?`, answer: F1, unit: 'N', tol: 0.02,
      steps: ['F = k q₁ q₂ / r², with k = 8.99 × 10⁹ N m²/C²', `F = 8.99 × 10⁹ × ${q1} × 10⁻⁶ × ${q2} × 10⁻⁶ / ${r / 100}² = ${r3(F1)} N (repulsion)`] },
    { text: `Two charges push each other apart with ${F0} N. The distance between them is multiplied by ${n}. What is the new force, in newtons?`, answer: F0 / (n * n), unit: 'N', tol: 0.02,
      steps: ['F ∝ 1 / r², so multiplying r by n divides F by n²', `F = ${F0} / ${n}² = ${r3(F0 / (n * n))} N`] },
    { text: `A +${qm} µC charge sits on a line, with +${qa} µC ${d1} cm to its left and +${qb} µC ${d2} cm to its right. What is the size of the net force on it, in newtons?`, answer: Fm, unit: 'N', tol: 0.02,
      steps: ['Both push it away, in opposite directions, so subtract.', `From the left: ${r3(Fl)} N to the right; from the right: ${r3(Fr)} N to the left.`, `Net = |${r3(Fl)} − ${r3(Fr)}| = ${r3(Fm)} N`] },
    { text: `Two forces of ${Fa} N and ${Fb} N act on a charge at right angles to each other. What is the size of the net force, in newtons?`, answer: Math.hypot(Fa, Fb), unit: 'N', tol: 0.02,
      steps: ['Forces add as vectors: at 90° use Pythagoras.', `F = √(${Fa}² + ${Fb}²) = ${r3(Math.hypot(Fa, Fb))} N`] },
  ];
}
