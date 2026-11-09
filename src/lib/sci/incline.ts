// A block on a slope with friction, for the school friction-ramp tool: weight components, normal force,
// static friction (up to μs N) and kinetic friction (μk N), an applied push along the slope, whether
// the block moves, its acceleration and the angle at which it starts to slide. Plain TypeScript, no DOM.

export const G = 9.8; // m/s², rounded school value
const rad = (d: number) => (d * Math.PI) / 180;

export type Ramp = { m: number; angle: number; mus: number; muk: number; push: number; g?: number }; // push > 0 up the slope
export type RampResult = {
  weight: number; along: number; normal: number; maxStatic: number; kinetic: number;
  drive: number;      // push − mg sinθ: the net force along the slope before friction (+ = up)
  friction: number;   // friction force along the slope (+ = up)
  net: number; a: number; // along the slope (+ = up)
  state: 'still' | 'up' | 'down';
  pushToStartUp: number; pushToHold: number; pushToStartDown: number; repose: number;
};

export function ramp(r: Ramp): RampResult {
  const g = r.g ?? G, th = rad(r.angle);
  const weight = r.m * g, along = weight * Math.sin(th), normal = weight * Math.cos(th);
  const maxStatic = r.mus * normal, kinetic = r.muk * normal, drive = r.push - along;
  let friction: number, state: RampResult['state'];
  if (Math.abs(drive) <= maxStatic + 1e-12) { friction = -drive; state = 'still'; }
  else { state = drive > 0 ? 'up' : 'down'; friction = -Math.sign(drive) * kinetic; }
  const net = drive + friction;
  return {
    weight, along, normal, maxStatic, kinetic, drive, friction, net: state === 'still' ? 0 : net, a: state === 'still' ? 0 : net / r.m, state,
    pushToStartUp: along + maxStatic,
    pushToHold: Math.max(0, along - maxStatic),
    pushToStartDown: Math.max(0, maxStatic - along),
    repose: (Math.atan(r.mus) * 180) / Math.PI,
  };
}

/** Time to slide a distance d (m) from rest with acceleration a: d = ½at². */
export const slideTime = (a: number, d: number) => (a > 0 ? Math.sqrt((2 * d) / a) : Infinity);

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');
const ANG = [30, 37, 45, 53, 60];
const SIN: Record<number, number> = { 30: 0.5, 37: 0.6, 45: Math.SQRT1_2, 53: 0.8, 60: Math.sqrt(3) / 2 };

export function questions(level: 8 | 11, rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  if (level === 8) {
    { const m = pick(rng, 2, 50); qs.push({ text: `What is the weight of a ${m} kg box? Take g = 9.8 N per kg.`, ans: m * 9.8, unit: 'N', work: `Weight = m × g = ${m} × 9.8 = ${n(m * 9.8)} N.` }); }
    { const P = pick(rng, 20, 80), f = pick(rng, 5, P - 5); qs.push({ text: `You push a box along the floor with ${P} N and friction pulls back with ${f} N. What is the unbalanced force on it?`, ans: P - f, unit: 'N', work: `Unbalanced force = push − friction = ${P} − ${f} = ${P - f} N, in the direction of the push.` }); }
    { const m = pick(rng, 2, 10), mu = pick(rng, 2, 6) / 10, f = mu * m * 9.8; qs.push({ text: `A ${m} kg box rests on a flat floor. Friction can hold back at most ${n(mu)} times its weight. What is the smallest push that starts it moving? (g = 9.8 N per kg)`, ans: f, unit: 'N', work: `Weight = ${m} × 9.8 = ${n(m * 9.8)} N. Largest friction = ${n(mu)} × ${n(m * 9.8)} = ${n(f)} N, so a push just over ${n(f)} N starts it.` }); }
  } else {
    { const m = pick(rng, 2, 20), A = ANG[pick(rng, 0, 4)], s = SIN[A], c = Math.sqrt(1 - s * s);
      qs.push({ text: `A ${m} kg block sits on a ${A}° slope. Taking g = 9.8 m/s², what is the normal force on it?`, ans: m * 9.8 * c, unit: 'N', work: `N = mg cos θ = ${m} × 9.8 × cos ${A}° = ${n(m * 9.8 * c)} N.` }); }
    { const mu = [0.2, 0.25, 0.5, 0.75, 1][pick(rng, 0, 4)], th = (Math.atan(mu) * 180) / Math.PI;
      qs.push({ text: `The static friction coefficient between a coin and a book is ${mu}. At what angle (in degrees) does the coin start to slide as you tilt the book?`, ans: th, unit: '°', work: `It slides when mg sin θ = μs mg cos θ, so tan θ = μs = ${mu}, θ = ${n(th)}°. The mass cancels.` }); }
    { const A = ANG[pick(rng, 0, 4)], s = SIN[A], c = Math.sqrt(1 - s * s), mu = pick(rng, 1, 3) / 10, a = 9.8 * (s - mu * c);
      qs.push({ text: `A box slides down a ${A}° slope. The kinetic friction coefficient is ${mu}. Taking g = 9.8 m/s², what is its acceleration down the slope?`, ans: a, unit: 'm/s²', work: `a = g(sin θ − μk cos θ) = 9.8 × (${n(s)} − ${mu} × ${n(c)}) = ${n(a)} m/s². The mass cancels.` }); }
    { const m = pick(rng, 2, 10), A = ANG[pick(rng, 0, 2)], s = SIN[A], c = Math.sqrt(1 - s * s), mu = pick(rng, 1, 4) / 10, P = m * 9.8 * (s + mu * c);
      qs.push({ text: `What push along a ${A}° slope moves a ${m} kg crate up it at a steady speed, if μk = ${mu}? (g = 9.8 m/s²)`, ans: P, unit: 'N', work: `Steady speed means no net force: P = mg sin θ + μk mg cos θ = ${n(m * 9.8 * s)} + ${n(mu * m * 9.8 * c)} = ${n(P)} N.` }); }
  }
  return qs;
}
