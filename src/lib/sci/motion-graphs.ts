// Motion along a straight line for the school motion-graphs tool: stories made of steady-acceleration
// phases, position/velocity/acceleration at any time, displacement and distance (area under the v-t
// graph), average velocity, a slider "drive" step and a score for the match-the-graph challenge.
// Plain TypeScript, no DOM.

export type Phase = { dur: number; a: number };
export type Story = { x0: number; v0: number; phases: Phase[] };
export type State = { x: number; v: number; a: number };

export const total = (s: Story) => s.phases.reduce((t, p) => t + p.dur, 0);

/** Position, velocity and acceleration at time t (s), from x = x₀ + ut + ½at² and v = u + at in each phase. */
export function at(s: Story, t: number): State {
  let x = s.x0, v = s.v0, t0 = 0;
  for (let i = 0; i < s.phases.length; i++) {
    const p = s.phases[i];
    const last = i === s.phases.length - 1;
    if (t <= t0 + p.dur || last) {
      const d = Math.max(0, Math.min(t - t0, p.dur));
      return { x: x + v * d + 0.5 * p.a * d * d, v: v + p.a * d, a: p.a };
    }
    x += v * p.dur + 0.5 * p.a * p.dur * p.dur; v += p.a * p.dur; t0 += p.dur;
  }
  return { x, v, a: 0 };
}

/** Displacement from t1 to t2: the signed area under the v-t graph. */
export const displacement = (s: Story, t1: number, t2: number) => at(s, t2).x - at(s, t1).x;

/** Distance travelled from t1 to t2: the area under |v|, split where the velocity changes sign. */
export function distance(s: Story, t1: number, t2: number): number {
  const cuts = new Set<number>([t1, t2]);
  let t0 = 0, v = s.v0;
  for (const p of s.phases) {
    if (p.a !== 0) { const tz = t0 - v / p.a; if (tz > t0 && tz < t0 + p.dur) cuts.add(tz); }
    t0 += p.dur; cuts.add(t0); v += p.a * p.dur;
  }
  const ts = [...cuts].filter((t) => t >= t1 && t <= t2).sort((a, b) => a - b);
  let d = 0;
  for (let i = 1; i < ts.length; i++) d += Math.abs(at(s, ts[i]).x - at(s, ts[i - 1]).x);
  return d;
}

/** Average velocity between two times: displacement ÷ time (the slope of the chord on the x-t graph). */
export const averageVelocity = (s: Story, t1: number, t2: number) => (t2 === t1 ? at(s, t1).v : displacement(s, t1, t2) / (t2 - t1));

/** n+1 evenly spaced samples from 0 to the end of the story. */
export function sample(s: Story, n = 240) {
  const T = total(s), t: number[] = [], x: number[] = [], v: number[] = [], a: number[] = [];
  for (let i = 0; i <= n; i++) { const ti = (T * i) / n, st = at(s, ti); t.push(ti); x.push(st.x); v.push(st.v); a.push(st.a); }
  return { t, x, v, a };
}

/** Ready-made motions, 12 s each. Made-up, round numbers. */
export const STORIES: Record<string, { name: string; story: Story }> = {
  steady: { name: 'Steady walk', story: { x0: 0, v0: 1.5, phases: [{ dur: 12, a: 0 }] } },
  speeding: { name: 'Speeding up', story: { x0: 0, v0: 0, phases: [{ dur: 12, a: 0.5 }] } },
  braking: { name: 'Braking to a stop', story: { x0: 0, v0: 6, phases: [{ dur: 8, a: -0.75 }, { dur: 4, a: 0 }] } },
  stopgo: { name: 'Stop and go', story: { x0: 0, v0: 0, phases: [{ dur: 2, a: 1.5 }, { dur: 4, a: 0 }, { dur: 2, a: -1.5 }, { dur: 4, a: 0 }] } },
  outback: { name: 'Out and back', story: { x0: 0, v0: 6, phases: [{ dur: 12, a: -1 }] } },
};

/** One step of slider driving: the car changes its velocity towards the slider's value, at most maxA m/s² (s). */
export function driveStep(st: State, target: number, dt: number, maxA = 2): State {
  const dv = target - st.v, a = Math.abs(dv) <= maxA * dt ? dv / dt : Math.sign(dv) * maxA;
  const v = st.v + a * dt;
  return { x: st.x + 0.5 * (st.v + v) * dt, v, a: Math.abs(a) < 1e-9 ? 0 : a };
}

/** A random target for match-the-graph: three 4-second parts at steady velocities vs, starting at x0. */
export function randomTarget(rng: () => number = Math.random): { x0: number; vs: number[] } {
  const all = [-2, -1, 0, 1, 2];
  for (;;) {
    const vs = [0, 1, 2].map(() => all[Math.floor(rng() * all.length)]);
    if (vs[0] === vs[1] || vs[1] === vs[2]) continue;
    // Keep the whole path between 0 and 20 m, starting from a whole number of metres.
    let lo = 0, hi = 0, x = 0;
    for (const v of vs) { x += v * 4; lo = Math.min(lo, x); hi = Math.max(hi, x); }
    if (hi - lo > 20) continue;
    return { x0: Math.round(-lo + (20 - (hi - lo)) / 2), vs };
  }
}

/** Position on a target made of steady-velocity parts (velocities vs, each lasting dur s). */
export function targetX(x0: number, vs: number[], t: number, dur = 4): number {
  let x = x0;
  for (let i = 0; i < vs.length; i++) {
    const d = Math.max(0, Math.min(t - i * dur, dur));
    x += vs[i] * d;
  }
  return x;
}

/** How well a recorded drive (times ts, positions xs) follows the target: root-mean-square gap in metres, and a 0-100 score. */
export function matchScore(x0: number, vs: number[], ts: number[], xs: number[]) {
  if (!ts.length) return { rms: NaN, score: 0 };
  let s = 0;
  for (let i = 0; i < ts.length; i++) s += (xs[i] - targetX(x0, vs, ts[i])) ** 2;
  const rms = Math.sqrt(s / ts.length);
  return { rms, score: Math.max(0, Math.round(100 - 25 * rms)) };
}

// ---- Check yourself: fresh questions with random numbers -------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(level: 9 | 11, rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const A = pick(rng, 0, 10), T = pick(rng, 2, 8), v = pick(rng, 1, 5) * (rng() < 0.3 ? -1 : 1), B = A + v * T;
    qs.push({ text: `An x-t graph is a straight line from x = ${n(A)} m at t = 0 to x = ${n(B)} m at t = ${T} s. What is the velocity?`, ans: v, unit: 'm/s',
      work: `Velocity = slope = Δx ÷ Δt = (${n(B)} − ${n(A)}) ÷ ${T} = ${n(v)} m/s.` }); }
  { const u = pick(rng, 0, 10), T = pick(rng, 2, 6), a = pick(rng, 1, 8) / 2 * (rng() < 0.35 ? -1 : 1), v = u + a * T;
    qs.push({ text: `A v-t graph is a straight line from ${n(u)} m/s at t = 0 to ${n(v)} m/s at t = ${T} s. What is the acceleration?`, ans: a, unit: 'm/s²',
      work: `Acceleration = slope of the v-t graph = (${n(v)} − ${n(u)}) ÷ ${T} = ${n(a)} m/s².` }); }
  { const u = pick(rng, 0, 8), v = u + pick(rng, 2, 12), T = pick(rng, 2, 10), s = ((u + v) / 2) * T;
    qs.push({ text: `A cart's velocity rises steadily from ${u} m/s to ${v} m/s in ${T} s. How far does it go (the area under the v-t graph)?`, ans: s, unit: 'm',
      work: `The area is a trapezium: ½ × (${u} + ${v}) × ${T} = ${n(s)} m.` }); }
  if (level === 9) {
    const d = pick(rng, 2, 9) * 100, T = pick(rng, 4, 12) * 10, sp = d / T;
    qs.push({ text: `A cyclist rides ${d} m in ${T} s at a steady speed. On the x-t graph, what is the slope of the line?`, ans: sp, unit: 'm/s',
      work: `Slope = rise ÷ run = ${d} m ÷ ${T} s = ${n(sp)} m/s, which is the speed.` });
  } else {
    const u = pick(rng, 4, 10), a = -pick(rng, 1, 2), T = Math.ceil(-u / a) + pick(rng, 1, 3);
    const s: Story = { x0: 0, v0: u, phases: [{ dur: T, a }] }, dist = distance(s, 0, T), disp = displacement(s, 0, T);
    const tStop = -u / a;
    qs.push({ text: `A ball rolls up a slope at ${u} m/s and slows at ${-a} m/s², then rolls back. What distance does it travel in the first ${T} s?`, ans: dist, unit: 'm',
      work: `It stops after ${n(tStop)} s, having gone u²/2|a| = ${n(u * u / (2 * -a))} m up. In the last ${n(T - tStop)} s it rolls back ½|a|t² = ${n(0.5 * -a * (T - tStop) ** 2)} m. Distance = ${n(dist)} m (the displacement is only ${n(disp)} m).` });
  }
  return qs;
}
