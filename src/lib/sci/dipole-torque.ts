// An electric dipole in a uniform field (school level): dipole moment, torque, potential energy and the work
// needed to turn it. q in C, d in m, E in N/C, angles in degrees between p and E. No DOM.
import { pick, type Question } from './elec-quiz.ts';
import { n3 } from './em-p34.ts';

const rad = (d: number) => (d * Math.PI) / 180;

export function dipole(q: number, d: number, E: number, thetaDeg: number) {
  const p = q * d, th = rad(thetaDeg);
  return {
    p, F: q * E, // force on each end, equal and opposite, so the net force is zero
    torque: p * E * Math.sin(th), // turns p towards E
    U: -p * E * Math.cos(th), // zero when p is at right angles to E
    W0: p * E * (1 - Math.cos(th)), // work to turn it from θ = 0 (stable) to θ
    tmax: p * E,
  };
}
/** Work needed to turn the dipole slowly from θ1 to θ2 (degrees): pE (cos θ1 − cos θ2). */
export const workTurn = (p: number, E: number, t1: number, t2: number) => p * E * (Math.cos(rad(t1)) - Math.cos(rad(t2)));

/** One time step of a swinging dipole for the animation: θ'' = −(pE/I) sin θ − c θ'. Angles in radians. */
export function swingStep(th: number, w: number, k: number, damp: number, dt: number) {
  // Semi-implicit Euler with small sub-steps keeps the swing stable.
  const n = 8, h = dt / n;
  for (let i = 0; i < n; i++) { w += (-k * Math.sin(th) - damp * w) * h; th += w * h; }
  return [th, w];
}

export function questions(rng: () => number = Math.random): Question[] {
  const q = pick(rng, [1, 2, 4, 5]), d = pick(rng, [1, 2, 4]), p = q * 1e-6 * d * 1e-2;
  const E = pick(rng, [1, 2, 5]) * 1e4, th = pick(rng, [30, 60, 90]), tq = p * E * Math.sin(rad(th));
  const p2 = pick(rng, [2, 4, 5]) * 1e-8, E2 = pick(rng, [1, 3, 5]) * 1e5;
  const t1 = pick(rng, [0, 60]), t2 = pick(rng, [90, 180]), W = workTurn(p2, E2, t1, t2);
  return [
    { text: `A dipole has charges ±${q} µC, ${d} cm apart. What is its dipole moment, in C m?`, answer: p, unit: 'C m', tol: 0.02,
      steps: ['p = q × d', `p = ${q} × 10⁻⁶ × ${d / 100} = ${n3(p)} C m`] },
    { text: `That dipole (p = ${n3(p)} C m) sits at ${th}° to a field of ${E} N/C. What torque acts on it, in N m?`, answer: tq, unit: 'N m', tol: 0.02,
      steps: ['τ = p E sin θ', `τ = ${n3(p)} × ${E} × sin ${th}° = ${n3(tq)} N m`] },
    { text: `How much work turns a dipole of ${n3(p2)} C m in a field of ${n3(E2)} N/C from ${t1}° to ${t2}°, in joules?`, answer: W, unit: 'J', tol: 0.02,
      steps: ['W = p E (cos θ₁ − cos θ₂)', `W = ${n3(p2)} × ${n3(E2)} × (cos ${t1}° − cos ${t2}°) = ${n3(W)} J`] },
    { text: `What is the largest torque on a dipole of ${n3(p2)} C m in a field of ${n3(E2)} N/C, in N m?`, answer: p2 * E2, unit: 'N m', tol: 0.02,
      steps: ['The torque is largest at 90°, where sin θ = 1: τ = p E.', `τ = ${n3(p2)} × ${n3(E2)} = ${n3(p2 * E2)} N m`] },
  ];
}
