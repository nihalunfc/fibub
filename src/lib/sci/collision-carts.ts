// Collision carts for the school collision-carts tool: two carts on a straight track (elastic, sticky or any
// coefficient of restitution e), and recoil (gun and bullet, cannon, a jump from a boat). Plain TypeScript, no DOM.
import type { QuizQuestion } from '../school-quiz-b';

export type Coll = { v1: number; v2: number; pBefore: number; pAfter: number; keBefore: number; keAfter: number; impulse: number };

/** Velocities after a head-on collision with restitution e (1 elastic, 0 sticky). Momentum is always kept. */
export function collide(m1: number, u1: number, m2: number, u2: number, e: number): Coll {
  const M = m1 + m2, P = m1 * u1 + m2 * u2;
  const v1 = (P + m2 * e * (u2 - u1)) / M, v2 = (P + m1 * e * (u1 - u2)) / M;
  return {
    v1, v2, pBefore: P, pAfter: m1 * v1 + m2 * v2,
    keBefore: 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2, keAfter: 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2,
    impulse: m2 * (v2 - u2),
  };
}

/** Time until the carts touch: x1 < x2 are their centres, w the sum of their half-lengths. Infinity if they never meet. */
export function meetTime(x1: number, u1: number, x2: number, u2: number, w: number) {
  const gap = x2 - x1 - w, close = u1 - u2;
  if (gap <= 0) return 0;
  return close > 1e-12 ? gap / close : Infinity;
}

/** Recoil: a body of mass M fires (or pushes off) a mass m at speed v; both start at rest. */
export function recoil(M: number, m: number, v: number) {
  const V = (-m * v) / M;
  return { V, pBody: M * V, pShot: m * v, total: M * V + m * v, keShot: 0.5 * m * v * v, keBody: 0.5 * M * V * V };
}

const pick = (r: () => number, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const n = (x: number, d = 3) => { const r = Math.round(x * 10 ** d) / 10 ** d; return String(Object.is(r, -0) ? 0 : r); };

export function questions(level: 9 | 11, r: () => number = Math.random): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  { const m1 = pick(r, 1, 6), u = pick(r, 2, 8), m2 = pick(r, 1, 6), v = (m1 * u) / (m1 + m2);
    qs.push({ text: `A ${m1} kg cart moving at ${u} m/s hits a ${m2} kg cart at rest and they stick together. How fast do they move off?`, ans: v, unit: 'm/s', work: `Momentum before = ${m1} × ${u} + ${m2} × 0 = ${m1 * u} kg m/s. After, both move together: (${m1} + ${m2}) × v = ${m1 * u}, so v = ${m1 * u} ÷ ${m1 + m2} = ${n(v)} m/s.` }); }
  { const M = pick(r, 2, 6), m = pick(r, 5, 30), v = pick(r, 20, 60) * 10, V = (m / 1000 * v) / M;
    qs.push({ text: `A ${M} kg gun fires a ${m} g bullet at ${v} m/s. What is the speed of the gun's recoil?`, ans: V, unit: 'm/s', work: `Before firing the total momentum is 0. Bullet: ${n(m / 1000)} × ${v} = ${n(m / 1000 * v)} kg m/s forwards. The gun must have the same backwards: ${M} × V = ${n(m / 1000 * v)}, V = ${n(V)} m/s backwards.` }); }
  { const m = pick(r, 2, 12) * 50, v = pick(r, 2, 20);
    qs.push({ text: `What is the momentum of a ${m} kg car at ${v} m/s?`, ans: m * v, unit: 'kg m/s', work: `p = m × v = ${m} × ${v} = ${m * v} kg m/s.` }); }
  { const m = pick(r, 1, 5), u = pick(r, 2, 9);
    qs.push({ text: `Two identical ${m} kg carts collide elastically. One moves at ${u} m/s, the other is at rest. How fast does the second cart move afterwards?`, ans: u, unit: 'm/s', work: `In an elastic collision between equal masses the velocities swap: the first cart stops and the second moves off at ${u} m/s. Check: momentum ${m} × ${u} before and after; kinetic energy the same too.` }); }
  if (level === 11) {
    const m1 = pick(r, 1, 5), u = pick(r, 2, 8), m2 = pick(r, 1, 5), v = (m1 * u) / (m1 + m2), lost = 0.5 * m1 * u * u - 0.5 * (m1 + m2) * v * v;
    qs.push({ text: `A ${m1} kg cart at ${u} m/s sticks to a ${m2} kg cart at rest. How much kinetic energy is lost (to heat and sound)?`, ans: lost, unit: 'J', work: `v = ${m1 * u} ÷ ${m1 + m2} = ${n(v)} m/s. KE before = ½ × ${m1} × ${u}² = ${n(0.5 * m1 * u * u)} J. KE after = ½ × ${m1 + m2} × ${n(v)}² = ${n(0.5 * (m1 + m2) * v * v)} J. Lost = ${n(lost)} J.` });
  }
  return qs;
}
