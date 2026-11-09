// The equations of motion for steady (uniform) acceleration in a straight line, for the school
// equations-of-motion tool: v = u + at, s = ut + ½at², v² = u² + 2as and s = ½(u + v)t.
// Solve for any two of u, v, a, s, t from the other three; stopping distance; v-t graph areas.
// Plain TypeScript, no DOM.

export type Known = Partial<Record<'u' | 'v' | 'a' | 's' | 't', number>>;
export type Full = { u: number; v: number; a: number; s: number; t: number };
export type Solved = { ok: true; sols: Full[]; used: string } | { ok: false; msg: string };

const fin = (x: number | undefined): x is number => typeof x === 'number' && Number.isFinite(x);
const E = 1e-12;

/** Solve from exactly three known values. Returns every physical answer (t ≥ 0); some cases have two. */
export function solve(k: Known): Solved {
  const keys = (['u', 'v', 'a', 's', 't'] as const).filter((x) => fin(k[x]));
  if (keys.length !== 3) return { ok: false, msg: `Give exactly three of u, v, a, s and t (you gave ${keys.length}).` };
  const { u, v, a, s, t } = k as Required<Known>;
  const has = (x: string) => keys.includes(x as never);
  if (has('t') && t < 0) return { ok: false, msg: 'Time t cannot be negative.' };
  let sols: Full[] = [], used = '';
  const keep = (c: Full) => { if (c.t >= -E && [c.u, c.v, c.a, c.s, c.t].every(Number.isFinite)) sols.push({ ...c, t: Math.max(0, c.t) }); };
  if (has('u') && has('v') && has('a')) {
    used = 'v = u + at gives t; v² = u² + 2as gives s';
    if (Math.abs(a) < E) { if (Math.abs(v - u) < E) return { ok: false, msg: 'With a = 0 and v = u, the time and distance could be anything. Give t or s instead.' }; return { ok: false, msg: 'With no acceleration the velocity cannot change, so v must equal u.' }; }
    keep({ u, v, a, t: (v - u) / a, s: (v * v - u * u) / (2 * a) });
    if (!sols.length) return { ok: false, msg: 'That never happens: with this acceleration the velocity moves away from v, so t would be negative.' };
  } else if (has('u') && has('v') && has('s')) {
    used = 's = ½(u + v)t gives t; v² = u² + 2as gives a';
    if (Math.abs(u + v) < E) return { ok: false, msg: 'With v = −u the time cannot be found from s alone. Give t or a instead.' };
    const tt = (2 * s) / (u + v);
    if (Math.abs(s) < E) { if (Math.abs(v - u) > E) return { ok: false, msg: 'With s = 0 and v ≠ u, give a or t instead.' }; return { ok: false, msg: 'With s = 0 and v = u nothing is fixed. Give a or t.' }; }
    keep({ u, v, s, t: tt, a: (v * v - u * u) / (2 * s) });
    if (!sols.length) return { ok: false, msg: 'No answer: the displacement has the wrong sign for these velocities (t would be negative).' };
  } else if (has('u') && has('v') && has('t')) {
    used = 'a = (v − u) ÷ t; s = ½(u + v)t';
    if (t < E) return { ok: false, msg: 'Time t must be greater than 0 here.' };
    keep({ u, v, t, a: (v - u) / t, s: ((u + v) * t) / 2 });
  } else if (has('u') && has('a') && has('t')) {
    used = 'v = u + at; s = ut + ½at²';
    keep({ u, a, t, v: u + a * t, s: u * t + 0.5 * a * t * t });
  } else if (has('u') && has('a') && has('s')) {
    used = 'v² = u² + 2as gives v; v = u + at gives t';
    const v2 = u * u + 2 * a * s;
    if (v2 < -E) return { ok: false, msg: 'It never gets that far: u² + 2as is negative, so it stops and turns back before reaching s.' };
    const r = Math.sqrt(Math.max(0, v2));
    if (Math.abs(a) < E) { if (Math.abs(u) < E) return { ok: false, msg: 'With u = 0 and a = 0 it never moves.' }; keep({ u, a, s, v: u, t: s / u }); }
    else for (const vv of r < E ? [0] : [r, -r]) keep({ u, a, s, v: vv, t: (vv - u) / a });
    if (!sols.length) return { ok: false, msg: 'No answer with t ≥ 0 for these values.' };
  } else if (has('u') && has('s') && has('t')) {
    used = 's = ut + ½at² gives a; s = ½(u + v)t gives v';
    if (t < E) return { ok: false, msg: 'Time t must be greater than 0 here.' };
    keep({ u, s, t, a: (2 * (s - u * t)) / (t * t), v: (2 * s) / t - u });
  } else if (has('v') && has('a') && has('s')) {
    used = 'v² = u² + 2as gives u; v = u + at gives t';
    const u2 = v * v - 2 * a * s;
    if (u2 < -E) return { ok: false, msg: 'No starting velocity fits: v² − 2as is negative.' };
    const r = Math.sqrt(Math.max(0, u2));
    if (Math.abs(a) < E) { if (Math.abs(v) < E) return { ok: false, msg: 'With v = 0 and a = 0 it never moves.' }; keep({ v, a, s, u: v, t: s / v }); }
    else for (const uu of r < E ? [0] : [r, -r]) keep({ v, a, s, u: uu, t: (v - uu) / a });
    if (!sols.length) return { ok: false, msg: 'No answer with t ≥ 0 for these values.' };
  } else if (has('v') && has('a') && has('t')) {
    used = 'u = v − at; s = vt − ½at²';
    keep({ v, a, t, u: v - a * t, s: v * t - 0.5 * a * t * t });
  } else if (has('v') && has('s') && has('t')) {
    used = 's = ½(u + v)t gives u; v = u + at gives a';
    if (t < E) return { ok: false, msg: 'Time t must be greater than 0 here.' };
    const uu = (2 * s) / t - v;
    keep({ v, s, t, u: uu, a: (v - uu) / t });
  } else {
    used = 's = ut + ½at² and v = u + at together';
    if (t < E) return { ok: false, msg: 'Time t must be greater than 0 here.' };
    keep({ a, s, t, u: s / t - (a * t) / 2, v: s / t + (a * t) / 2 });
  }
  // the same answer twice (e.g. v = 0 roots) is shown once
  sols = sols.filter((c, i) => sols.findIndex((d) => Math.abs(d.u - c.u) + Math.abs(d.v - c.v) + Math.abs(d.t - c.t) < 1e-9) === i);
  return { ok: true, sols, used };
}

/** Distance actually travelled in time t (differs from s when the velocity changes sign). */
export function pathLength(u: number, a: number, t: number): number {
  const x = (tt: number) => u * tt + 0.5 * a * tt * tt;
  if (Math.abs(a) > E) { const tz = -u / a; if (tz > 0 && tz < t) return Math.abs(x(tz)) + Math.abs(x(t) - x(tz)); }
  return Math.abs(x(t));
}

/** Stopping distance: thinking distance (speed × reaction time) plus braking distance v²/2a. Speed in km/h. */
export function stopping(kmh: number, reaction: number, decel: number) {
  const v = kmh / 3.6, think = v * reaction, brake = (v * v) / (2 * decel);
  return { v, think, brake, total: think + brake, tBrake: v / decel, tTotal: reaction + v / decel };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(level: 9 | 11, rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const u = pick(rng, 0, 10), a = pick(rng, 1, 6) / 2, t = pick(rng, 2, 10), v = u + a * t;
    qs.push({ text: `A scooter starts at ${u} m/s and speeds up at ${n(a)} m/s² for ${t} s. What is its final velocity v?`, ans: v, unit: 'm/s', work: `v = u + at = ${u} + ${n(a)} × ${t} = ${n(v)} m/s.` }); }
  { const u = pick(rng, 0, 8), a = pick(rng, 1, 4), t = pick(rng, 2, 8), s = u * t + 0.5 * a * t * t;
    qs.push({ text: `A trolley starts at ${u} m/s and accelerates at ${a} m/s². How far does it go in ${t} s?`, ans: s, unit: 'm', work: `s = ut + ½at² = ${u} × ${t} + ½ × ${a} × ${t}² = ${n(u * t)} + ${n(0.5 * a * t * t)} = ${n(s)} m.` }); }
  { const u = pick(rng, 2, 6) * 5, s = pick(rng, 2, 10) * 10, a = (u * u) / (2 * s);
    qs.push({ text: `A train moving at ${u} m/s brakes steadily and stops in ${s} m. What is its deceleration (the size of a)?`, ans: a, unit: 'm/s²', work: `v² = u² + 2as with v = 0: 0 = ${u}² + 2 × a × ${s}, so a = −${u * u} ÷ ${2 * s} = −${n(a)} m/s². The deceleration is ${n(a)} m/s².` }); }
  if (level === 9) {
    const kmh = pick(rng, 4, 12) * 9, v = kmh / 3.6, tr = pick(rng, 5, 15) / 10, think = v * tr;
    qs.push({ text: `A driver going at ${kmh} km/h takes ${n(tr)} s to react before braking. How far does the car go while the driver reacts (the thinking distance)?`, ans: think, unit: 'm', work: `${kmh} km/h = ${kmh} ÷ 3.6 = ${n(v)} m/s. Thinking distance = speed × time = ${n(v)} × ${n(tr)} = ${n(think)} m.` });
  } else {
    const u = pick(rng, 10, 30), g = 9.8, h = (u * u) / (2 * g);
    qs.push({ text: `A ball is thrown straight up at ${u} m/s. Taking g = 9.8 m/s², how high does it rise?`, ans: h, unit: 'm', work: `At the top v = 0. v² = u² + 2as with a = −9.8: 0 = ${u}² − 2 × 9.8 × s, so s = ${u * u} ÷ 19.6 = ${n(h)} m.` });
  }
  return qs;
}
