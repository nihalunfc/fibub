// Newton's laws for the school newtons-laws tool: a trolley pushed along a track with friction
// (static up to μs·mg, then kinetic μk·mg), two trolleys pushing apart (third law, momentum) and
// catching a ball (impulse = change in momentum). Plain TypeScript, no DOM.

export const G = 9.8; // m/s², rounded school value

export type Trolley = { x: number; v: number };
export type StepOut = Trolley & { a: number; fric: number; moving: boolean };

/** Friction on the trolley for push F (N). At rest it matches the push up to μs·mg; moving it is μk·mg against the motion. */
export function friction(F: number, m: number, v: number, mus: number, muk: number, g = G): number {
  if (Math.abs(v) > 1e-9) return -Math.sign(v) * muk * m * g;
  if (Math.abs(F) <= mus * m * g) return -F;
  return -Math.sign(F) * muk * m * g;
}

/** One time step dt of the trolley. Friction never reverses the motion: a trolley that would stop inside the step stops. */
export function step(s: Trolley, F: number, m: number, mus: number, muk: number, dt: number, g = G): StepOut {
  const fr = friction(F, m, s.v, mus, muk, g), a = (F + fr) / m;
  let v = s.v + a * dt, x = s.x;
  if (Math.abs(s.v) > 1e-9 && Math.sign(v) !== Math.sign(s.v) && Math.abs(F) <= mus * m * g) {
    // stops part-way through the step
    const tStop = -s.v / a;
    x += s.v * tStop + 0.5 * a * tStop * tStop;
    return { x, v: 0, a: 0, fric: -F, moving: false };
  }
  x += s.v * dt + 0.5 * a * dt * dt;
  return { x, v, a, fric: fr, moving: Math.abs(v) > 1e-9 };
}

/** Push with force F for time T from rest, then let go: speed at let-go and how far it coasts (closed form). */
export function pushAndCoast(F: number, m: number, T: number, mus: number, muk: number, g = G) {
  if (F <= mus * m * g) return { moves: false, vEnd: 0, pushDist: 0, coastDist: 0, coastTime: 0, a: 0 };
  const a = (F - muk * m * g) / m, vEnd = a * T, pushDist = 0.5 * a * T * T;
  const d = muk * g;
  return { moves: true, a, vEnd, pushDist, coastDist: d > 0 ? (vEnd * vEnd) / (2 * d) : Infinity, coastTime: d > 0 ? vEnd / d : Infinity };
}

/** Two trolleys pushing apart with force F for time T (third law: equal and opposite forces, no friction). */
export function pushApart(m1: number, m2: number, F: number, T: number) {
  const v1 = -(F * T) / m1, v2 = (F * T) / m2;
  return { a1: -F / m1, a2: F / m2, v1, v2, p1: m1 * v1, p2: m2 * v2, total: m1 * v1 + m2 * v2, impulse: F * T };
}

/** Catching a ball of mass m (kg) moving at v (m/s) over a stopping time t (s): impulse and average force. */
export function catchBall(m: number, v: number, t: number) {
  const dp = m * v;
  return { p: dp, impulse: dp, force: dp / t };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(level: 8 | 9 | 11, rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const F1 = pick(rng, 5, 30), F2 = pick(rng, 2, F1 - 1);
    qs.push({ text: `Two children push a box from opposite sides: one with ${F1} N, the other with ${F2} N. What is the size of the net (unbalanced) force?`, ans: F1 - F2, unit: 'N', work: `The forces act in opposite directions, so subtract: ${F1} − ${F2} = ${F1 - F2} N, towards the bigger push. The box speeds up that way.` }); }
  { const m = pick(rng, 2, 20), a = pick(rng, 1, 8) / 2, F = m * a;
    qs.push({ text: `A force of ${n(F)} N pushes a ${m} kg trolley on a smooth floor. What is its acceleration?`, ans: a, unit: 'm/s²', work: `a = F ÷ m = ${n(F)} ÷ ${m} = ${n(a)} m/s².` }); }
  if (level === 8) {
    const m = pick(rng, 2, 60);
    qs.push({ text: `What is the weight (the pull of gravity) on a ${m} kg bag? Take g = 9.8 N per kg.`, ans: m * 9.8, unit: 'N', work: `Weight = mass × g = ${m} × 9.8 = ${n(m * 9.8)} N.` });
  } else {
    const m = pick(rng, 2, 8) * 10, v = pick(rng, 2, 10);
    qs.push({ text: `A ${m} kg cyclist with bike rides at ${v} m/s. What is the momentum?`, ans: m * v, unit: 'kg m/s', work: `p = m × v = ${m} × ${v} = ${m * v} kg m/s.` });
  }
  { const m = pick(rng, 1, 4) * 0.05 + 0.05, v = pick(rng, 10, 30), t = pick(rng, 1, 6) / 10, F = (m * v) / t;
    qs.push({ text: `A ${n(m)} kg ball arrives at ${v} m/s and a fielder stops it in ${n(t)} s. What is the average force on the hands?`, ans: F, unit: 'N', work: `Change in momentum = m × v = ${n(m)} × ${v} = ${n(m * v)} kg m/s. Force = change in momentum ÷ time = ${n(m * v)} ÷ ${n(t)} = ${n(F)} N. Pulling the hands back makes the time longer and the force smaller.` }); }
  if (level === 11) {
    const m = pick(rng, 2, 10), mu = pick(rng, 1, 4) / 10, F = Math.ceil(mu * m * 9.8) + pick(rng, 2, 20), a = (F - mu * m * 9.8) / m;
    qs.push({ text: `A ${m} kg block is pulled along a floor with ${F} N. The kinetic friction coefficient is ${n(mu)}. Taking g = 9.8 m/s², what is its acceleration?`, ans: a, unit: 'm/s²', work: `Friction = μ m g = ${n(mu)} × ${m} × 9.8 = ${n(mu * m * 9.8)} N. Net force = ${F} − ${n(mu * m * 9.8)} = ${n(F - mu * m * 9.8)} N. a = net force ÷ m = ${n(a)} m/s².` });
  }
  return qs;
}
