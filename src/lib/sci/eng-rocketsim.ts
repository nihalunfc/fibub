// One-dimensional vertical flight of a model rocket: a thrust curve, mass falling as propellant burns (in step with
// the impulse delivered), quadratic drag in air whose density follows the standard atmosphere, and gravity.
// Integrated with fourth-order Runge-Kutta. Plain TypeScript, no DOM.
import { atmosphere, R_AIR, GAMMA } from './eng-atmos.ts';

export const G = 9.80665;
export type Curve = { t: number[]; F: number[] };

/** Read "time thrust" pairs (any separator). Lines whose first two fields are not numbers (headers, RASP .eng
 * header lines, comments starting with ;) are skipped. Adds a (0, 0) point if the curve does not start at 0. */
export function readCurve(text: string): { curve: Curve; skipped: number; error?: string } {
  const t: number[] = [], F: number[] = [];
  let skipped = 0;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(';') || line.startsWith('#')) continue;
    const f = line.split(/[\s,;\t]+/).map(Number);
    if (f.length < 2 || !Number.isFinite(f[0]) || !Number.isFinite(f[1])) { skipped++; continue; }
    t.push(f[0]); F.push(f[1]);
  }
  if (t.length < 2) return { curve: { t, F }, skipped, error: 'Give at least two time and thrust pairs, one per line.' };
  for (let i = 1; i < t.length; i++) if (!(t[i] > t[i - 1])) return { curve: { t, F }, skipped, error: `The times must go up line by line (check ${t[i]} s).` };
  if (t[0] < 0 || F.some((x) => x < 0)) return { curve: { t, F }, skipped, error: 'Times and thrusts cannot be negative.' };
  if (t[0] > 0) { t.unshift(0); F.unshift(0); }
  return { curve: { t, F }, skipped };
}

/** A made-up thrust curve of a given total impulse (N·s) and burn time (s). */
export function shapeCurve(shape: 'flat' | 'spike' | 'regressive', I: number, tb: number): Curve {
  const rel: [number, number][] = shape === 'flat' ? [[0, 0], [0.03, 1], [0.95, 1], [1, 0]]
    : shape === 'spike' ? [[0, 0], [0.08, 3], [0.2, 1], [0.85, 1], [1, 0]]
    : [[0, 0], [0.04, 1.6], [0.9, 0.5], [1, 0]];
  const area = rel.slice(1).reduce((s, [x, y], i) => s + ((x - rel[i][0]) * (y + rel[i][1])) / 2, 0);
  const k = I / (area * tb);
  return { t: rel.map(([x]) => x * tb), F: rel.map(([, y]) => y * k) };
}

export function thrustAt(c: Curve, t: number) {
  const n = c.t.length;
  if (t <= c.t[0] || t >= c.t[n - 1]) return t === c.t[0] ? c.F[0] : 0;
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c.t[m] <= t) lo = m; else hi = m; }
  return c.F[lo] + ((c.F[hi] - c.F[lo]) * (t - c.t[lo])) / (c.t[hi] - c.t[lo]);
}
/** Impulse delivered from 0 to t (exact for the piecewise-linear curve). */
export function impulseTo(c: Curve, t: number) {
  let s = 0;
  for (let i = 1; i < c.t.length; i++) {
    const a = c.t[i - 1], b = Math.min(c.t[i], t);
    if (b <= a) break;
    s += ((b - a) * (c.F[i - 1] + thrustAt(c, b))) / 2;
  }
  return s;
}
export const totalImpulse = (c: Curve) => impulseTo(c, c.t[c.t.length - 1]);
/** Motor class letter from total impulse: A up to 2.5 N·s, each letter doubling. */
export function motorClass(I: number) {
  if (I <= 0.3125) return '1/8A'; if (I <= 0.625) return '1/4A'; if (I <= 1.25) return '1/2A';
  const n = Math.max(0, Math.ceil(Math.log2(I / 2.5) - 1e-12));
  return n < 26 ? String.fromCharCode(65 + n) : '>Z';
}

export type Rocket = { mass: number; prop: number; d: number; cd: number; curve: Curve; elev?: number; dT?: number; rod?: number; delay?: number; dt?: number };
export type Sample = { t: number; h: number; v: number; a: number; m: number; F: number; D: number; rho: number };

export function simulate(r: Rocket) {
  const A = (Math.PI * r.d * r.d) / 4, Itot = totalImpulse(r.curve), tb = r.curve.t[r.curve.t.length - 1];
  const elev = r.elev ?? 0, dT = r.dT ?? 0, dt = r.dt ?? 0.001, rod = r.rod ?? 1;
  const mass = (t: number) => r.mass - (Itot > 0 ? (r.prop * impulseTo(r.curve, t)) / Itot : 0);
  const rhoAt = (h: number) => atmosphere(Math.min(85000, elev + Math.max(h, 0)), { dT }).rho;
  let lifted = false;
  const deriv = (t: number, h: number, v: number) => {
    const m = mass(t), F = thrustAt(r.curve, t), rho = rhoAt(h), D = 0.5 * rho * v * v * r.cd * A;
    let a = (F - Math.sign(v) * D - m * G) / m;
    if (!lifted && a <= 0) a = 0; // sits on the pad until thrust beats weight
    return { a, m, F, D, rho };
  };
  const out: Sample[] = [];
  let t = 0, h = 0, v = 0, tRod = NaN, vRod = NaN, apo: Sample | null = null, maxV = 0, maxA = 0;
  const ej = r.delay != null ? tb + r.delay : NaN;
  const push = () => { const d = deriv(t, h, v); out.push({ t, h, v, a: d.a, m: d.m, F: d.F, D: d.D, rho: d.rho }); return out[out.length - 1]; };
  push();
  const tEnd = Math.max(tb + 120, 600);
  while (t < tEnd) {
    // RK4 step for h' = v, v' = a(t, h, v).
    const k1 = deriv(t, h, v).a, k1h = v;
    const k2 = deriv(t + dt / 2, h + (dt / 2) * k1h, v + (dt / 2) * k1).a, k2h = v + (dt / 2) * k1;
    const k3 = deriv(t + dt / 2, h + (dt / 2) * k2h, v + (dt / 2) * k2).a, k3h = v + (dt / 2) * k2;
    const k4 = deriv(t + dt, h + dt * k3h, v + dt * k3).a, k4h = v + dt * k3;
    const v0 = v, h0 = h;
    v += (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4); h += (dt / 6) * (k1h + 2 * k2h + 2 * k3h + k4h); t += dt;
    if (!lifted && v > 0) lifted = true;
    if (lifted && h < 0) { h = 0; v = 0; }
    const s = push();
    if (Number.isNaN(tRod) && h >= rod && h0 < rod) { const f = (rod - h0) / (h - h0); tRod = t - dt + f * dt; vRod = v0 + f * (v - v0); }
    maxV = Math.max(maxV, v); maxA = Math.max(maxA, s.a);
    if (lifted && !apo && v0 > 0 && v <= 0) {
      // Interpolate the apogee inside the step.
      const f = v0 / (v0 - v);
      apo = { ...s, t: t - dt + f * dt, h: h0 + f * (h - h0), v: 0 };
    }
    if (apo && (h <= 0 || t >= Math.max(apo.t + 0.5, tb, Number.isNaN(ej) ? 0 : ej))) break;
    if (!lifted && t > tb) break;
  }
  const at = (tt: number) => { const i = Math.min(out.length - 1, Math.max(0, Math.round(tt / dt))); return out[i]; };
  const ejection = !Number.isNaN(ej) && apo ? at(ej) : null;
  const m0 = r.mass;
  return {
    samples: out, lifted, apogee: apo, burnout: at(tb), maxV, maxA, tRod, vRod, Itot, tb, avgF: Itot / tb, peakF: Math.max(...r.curve.F),
    tw0: Math.max(...r.curve.F) / (m0 * G), twAvg: Itot / tb / (m0 * G), bestDelay: apo ? apo.t - tb : NaN, ejection,
    maxMach: Math.max(...out.map((s) => Math.abs(s.v) / Math.sqrt(GAMMA * R_AIR * atmosphere(Math.min(85000, elev + Math.max(0, s.h)), { dT }).T))),
    motorClass: motorClass(Itot), A,
  };
}

// Made-up example: a small rocket on a made-up 9 N·s "C-class-like" motor shape (not a real motor).
export const EXAMPLE_CURVE = '0, 0\n0.05, 9\n0.12, 14\n0.2, 6\n0.5, 4.5\n1.2, 4.2\n1.6, 3.8\n1.75, 0';
