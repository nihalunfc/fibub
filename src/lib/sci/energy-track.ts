// A ball on a track for the school energy-track tool: a smooth track through movable points, motion
// along it by energy (KE + PE + heat stays equal to the starting energy), sliding friction that turns
// energy into heat, and the loop-the-loop condition. Plain TypeScript, no DOM.

export const G = 9.8; // m/s², rounded school value

export type Track = { x: number[]; y: number[]; s: number[]; L: number };

/** A smooth track through heights hs (m) spaced evenly from x = 0 to width (Catmull-Rom curve, clamped at 0). */
export function buildTrack(hs: number[], width = 10, n = 600): Track {
  const k = hs.length - 1, dx = width / k, x: number[] = [], y: number[] = [], s: number[] = [];
  const P = (i: number) => hs[Math.max(0, Math.min(k, i))];
  for (let j = 0; j <= n; j++) {
    const X = (width * j) / n, i = Math.min(k - 1, Math.floor(X / dx)), t = X / dx - i;
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const Y = 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
    x.push(X); y.push(Math.max(0, Y));
    s.push(j ? s[j - 1] + Math.hypot(X - x[j - 1], y[j] - y[j - 1]) : 0);
  }
  return { x, y, s, L: s[n] };
}

/** Position and slope on the track at arc length s. */
export function onTrack(tr: Track, s: number) {
  const n = tr.s.length - 1;
  let lo = 0, hi = n;
  const ss = Math.max(0, Math.min(tr.L, s));
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tr.s[mid] <= ss) lo = mid; else hi = mid; }
  const ds = tr.s[hi] - tr.s[lo] || 1e-12, f = (ss - tr.s[lo]) / ds;
  const sin = (tr.y[hi] - tr.y[lo]) / ds, cos = (tr.x[hi] - tr.x[lo]) / ds;
  return { x: tr.x[lo] + f * (tr.x[hi] - tr.x[lo]), y: tr.y[lo] + f * (tr.y[hi] - tr.y[lo]), sin, cos };
}

/** Arc length of the track point nearest to x. */
export function sAtX(tr: Track, x: number) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < tr.x.length; i++) { const d = Math.abs(tr.x[i] - x); if (d < bd) { bd = d; best = i; } }
  return tr.s[best];
}

export type Ball = { s: number; dir: 1 | -1; v: number; heat: number; stopped: boolean };

/** Start a ball at rest at arc length s. Energies are per kilogram until multiplied by the mass. */
export const startBall = (s: number): Ball => ({ s, dir: 1, v: 0, heat: 0, stopped: false });

/**
 * Move the ball on by time T in small steps h. Speed comes from energy: ½v² = e₀ − g y − heat (per kg), so
 * KE + PE + heat always equals the starting energy. Sliding friction μ g cosφ per metre adds to the heat.
 * Walls at both ends bounce the ball back with no loss.
 */
export function advance(tr: Track, b: Ball, e0: number, mu: number, T: number, h = 0.001, g = G): Ball {
  let { s, dir, v, heat, stopped } = b;
  const steps = Math.max(1, Math.round(T / h));
  for (let i = 0; i < steps && !stopped; i++) {
    const p = onTrack(tr, s);
    if (v < 1e-6) {
      // at rest: does gravity along the slope beat the friction grip?
      if (Math.abs(p.sin) <= mu * Math.abs(p.cos) + 1e-12) { stopped = true; v = 0; break; }
      dir = p.sin > 0 ? -1 : 1;
      const a = g * Math.abs(p.sin) - mu * g * Math.abs(p.cos), ds = 0.5 * a * h * h;
      heat += mu * g * Math.abs(p.cos) * ds; s += dir * ds;
    } else {
      const ds = v * h;
      heat += mu * g * Math.abs(p.cos) * ds; s += dir * ds;
    }
    if (s <= 0) { s = -s; dir = 1; }
    if (s >= tr.L) { s = 2 * tr.L - s; dir = -1; }
    const y = onTrack(tr, s).y, k2 = 2 * (e0 - g * y - heat);
    if (k2 <= 0) {
      // ran out of energy part-way through the step: turn round here
      const back = onTrack(tr, s); heat = Math.min(heat, e0 - g * back.y); v = 0;
    } else v = Math.sqrt(k2);
  }
  return { s, dir, v, heat, stopped };
}

/** Energies in joules for mass m at the ball's place. */
export function energies(tr: Track, b: Ball, e0: number, m: number, g = G) {
  const y = onTrack(tr, b.s).y, pe = m * g * y, ke = 0.5 * m * b.v * b.v, heat = m * b.heat;
  return { y, ke, pe, heat, total: ke + pe + heat, start: m * e0 };
}

/** Loop the loop from height h (m) on a frictionless track into a loop of radius r. */
export function loop(h: number, r: number, g = G) {
  const vBottom = Math.sqrt(2 * g * h), hMin = 2.5 * r, vNeedTop = Math.sqrt(g * r);
  if (h >= hMin - 1e-12) return { result: 'round' as const, vBottom, hMin, vNeedTop, vTop: Math.sqrt(2 * g * (h - 2 * r)), leaveDeg: NaN, leaveHeight: NaN };
  if (h <= r) return { result: 'back' as const, vBottom, hMin, vNeedTop, vTop: NaN, leaveDeg: (Math.acos(1 - h / r) * 180) / Math.PI, leaveHeight: h };
  const c = (-2 * (h - r)) / (3 * r), th = Math.acos(c);
  return { result: 'falls' as const, vBottom, hMin, vNeedTop, vTop: NaN, leaveDeg: (th * 180) / Math.PI, leaveHeight: r * (1 - c), vLeave: Math.sqrt(2 * g * (h - r * (1 - c))) };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(level: 9 | 11, rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const m = pick(rng, 1, 20), v = pick(rng, 2, 12), ke = 0.5 * m * v * v; qs.push({ text: `A ${m} kg ball rolls at ${v} m/s. What is its kinetic energy?`, ans: ke, unit: 'J', work: `KE = ½mv² = ½ × ${m} × ${v}² = ${n(ke)} J.` }); }
  { const m = pick(rng, 1, 20), h = pick(rng, 2, 30), pe = m * 9.8 * h; qs.push({ text: `A ${m} kg box is lifted ${h} m. How much potential energy does it gain? (g = 9.8 m/s²)`, ans: pe, unit: 'J', work: `PE = mgh = ${m} × 9.8 × ${h} = ${n(pe)} J.` }); }
  { const h = pick(rng, 1, 20) * 0.5 + 0.5, v = Math.sqrt(2 * 9.8 * h); qs.push({ text: `A ball starts at rest ${n(h)} m up a smooth (frictionless) track. How fast is it moving at the bottom? (g = 9.8 m/s²)`, ans: v, unit: 'm/s', work: `All the PE becomes KE: mgh = ½mv², so v = √(2gh) = √(2 × 9.8 × ${n(h)}) = ${n(v)} m/s. The mass cancels.` }); }
  if (level === 9) {
    const m = pick(rng, 1, 10), h1 = pick(rng, 5, 10), h2 = pick(rng, 1, h1 - 2), heat = m * 9.8 * (h1 - h2);
    qs.push({ text: `A ${m} kg ball starts at rest ${h1} m up a rough track and comes to rest at the top of a ${h2} m hump. How much energy turned into heat? (g = 9.8 m/s²)`, ans: heat, unit: 'J', work: `It starts and ends at rest, so the lost PE became heat: mg(h₁ − h₂) = ${m} × 9.8 × (${h1} − ${h2}) = ${n(heat)} J.` });
  } else {
    const r = pick(rng, 2, 12) * 0.5; qs.push({ text: `What is the lowest starting height for a ball to get round a smooth loop of radius ${n(r)} m (no friction)?`, ans: 2.5 * r, unit: 'm', work: `At the top it needs v² ≥ gr. Energy: g h = g(2r) + ½v² ≥ 2gr + ½gr, so h ≥ 2.5r = 2.5 × ${n(r)} = ${n(2.5 * r)} m.` });
  }
  return qs;
}
