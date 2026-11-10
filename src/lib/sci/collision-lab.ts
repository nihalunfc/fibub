// #1335 Collision lab: two bodies colliding in a line, or two balls at a glancing angle (ball 2 at rest), for
// any coefficient of restitution e from 0 (stick together) to 1 (elastic). Plain maths, no DOM. SI units.
const RAD = Math.PI / 180;

/** Head-on collision: velocities after, from momentum conservation and v2 − v1 = e (u1 − u2). */
export function collide1d(m1: number, u1: number, m2: number, u2: number, e: number) {
  const M = m1 + m2, P = m1 * u1 + m2 * u2;
  const v1 = (P - m2 * e * (u1 - u2)) / M, v2 = (P + m1 * e * (u1 - u2)) / M;
  const KE0 = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2, KE1 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  return { v1, v2, p0: P, p1: m1 * v1 + m2 * v2, KE0, KE1, lost: KE0 - KE1, impulse: m2 * (v2 - u2), approach: u1 > u2 };
}

/** Glancing collision of smooth balls: ball 1 (speed u along +x) hits ball 2 at rest. `offset` is the miss
 *  distance as a fraction of the sum of the radii (0 = head-on, 1 = just grazes); the line of centres then
 *  makes angle φ = asin(offset) with the x axis. Velocities along the line of centres collide as in 1D;
 *  across it they do not change. */
export function collide2d(m1: number, m2: number, u: number, e: number, offset: number) {
  const phi = Math.asin(Math.max(-1, Math.min(1, offset)));
  // Ball 1 passes above ball 2 when offset > 0, so the line of centres n points down-right; t is across it.
  const nx = Math.cos(phi), ny = -Math.sin(phi), tx = Math.sin(phi), ty = Math.cos(phi);
  const c = collide1d(m1, u * nx, m2, 0, e), uT = u * tx;
  const v1 = { x: c.v1 * nx + uT * tx, y: c.v1 * ny + uT * ty }, v2 = { x: c.v2 * nx, y: c.v2 * ny };
  const ang = (v: { x: number; y: number }) => (Math.hypot(v.x, v.y) < 1e-12 ? 0 : Math.atan2(v.y, v.x) / RAD);
  const s1 = Math.hypot(v1.x, v1.y), s2 = Math.hypot(v2.x, v2.y);
  const between = s1 < 1e-9 || s2 < 1e-9 ? NaN : Math.acos(Math.max(-1, Math.min(1, (v1.x * v2.x + v1.y * v2.y) / (s1 * s2)))) / RAD;
  const KE0 = 0.5 * m1 * u * u, KE1 = 0.5 * m1 * s1 * s1 + 0.5 * m2 * s2 * s2;
  return { v1, v2, s1, s2, a1: ang(v1), a2: ang(v2), between, phi: phi / RAD, px: m1 * v1.x + m2 * v2.x, py: m1 * v1.y + m2 * v2.y, KE0, KE1, lost: KE0 - KE1 };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string; tol?: number };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const m1 = pick(rng, 1, 6), m2 = pick(rng, 1, 6), u = pick(rng, 2, 10), v = (m1 * u) / (m1 + m2);
    qs.push({ text: `A ${m1} kg trolley moving at ${u} m/s hits a ${m2} kg trolley at rest and they stick together. How fast do they move off?`, ans: v, unit: 'm/s', work: `Momentum is kept: ${m1} × ${u} = (${m1} + ${m2}) v, so v = ${m1 * u} ÷ ${m1 + m2} = ${n(v)} m/s.` }); }
  { const m1 = pick(rng, 1, 6), m2 = pick(rng, 1, 6), u = pick(rng, 2, 10), v = (m1 * u) / (m1 + m2), lost = 0.5 * m1 * u * u - 0.5 * (m1 + m2) * v * v;
    qs.push({ text: `In the same kind of crash, a ${m1} kg trolley at ${u} m/s sticks to a ${m2} kg one at rest. How much kinetic energy is lost?`, ans: lost, unit: 'J', work: `Before: ½ × ${m1} × ${u}² = ${n(0.5 * m1 * u * u)} J. After: v = ${n(v)} m/s, ½ × ${m1 + m2} × ${n(v)}² = ${n(0.5 * (m1 + m2) * v * v)} J. Lost: ${n(lost)} J (to heat, sound and bending).` }); }
  { const m = pick(rng, 1, 5), M = m + pick(rng, 1, 5), u = pick(rng, 2, 10), v2 = (2 * m * u) / (m + M);
    qs.push({ text: `A ${m} kg ball at ${u} m/s hits a ${M} kg ball at rest head-on, perfectly elastically. How fast does the ${M} kg ball move off?`, ans: v2, unit: 'm/s', work: `For an elastic hit on a body at rest, v₂ = 2m₁u ÷ (m₁ + m₂) = 2 × ${m} × ${u} ÷ ${m + M} = ${n(v2)} m/s.` }); }
  { const u = pick(rng, 4, 20), v = pick(rng, 1, u - 2), e = v / u;
    qs.push({ text: `A ball hits a wall at ${u} m/s and bounces straight back at ${v} m/s. What is the coefficient of restitution?`, ans: e, unit: '', tol: 0.01, work: `e = speed of separation ÷ speed of approach = ${v} ÷ ${u} = ${n(e)}.` }); }
  return qs;
}
