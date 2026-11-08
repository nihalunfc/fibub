// Porkchop plots: launch energy and arrival speed for transfers between planets, over a grid of dates.
import * as A from 'astronomy-engine';
import { lambert, type Vec } from '../sci/lambert.ts';

export const MU_SUN = 1.32712440018e11; // km³/s²
const AU_KM = 149597870.7, DAY = 86400;
// Ecliptic north in J2000 equatorial axes: transfers run prograde round it.
const ECL_N: Vec = [0, -0.397776995, 0.917482062];
export const PLANETS = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'] as const;

function state(body: string, ms: number) {
  const s = A.HelioState(body as A.Body, new Date(ms));
  return { r: [s.x * AU_KM, s.y * AU_KM, s.z * AU_KM] as Vec, v: [s.vx * AU_KM / DAY, s.vy * AU_KM / DAY, s.vz * AU_KM / DAY] as Vec };
}
const sub = (a: Vec, b: Vec) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export type Leg = { dep: number; tof: number; c3: number; vinfDep: number; vinfArr: number };
/** One transfer: depart `from` at `dep` (ms), arrive `to` after `tofDays`. Speeds in km/s, C3 in km²/s². */
export function leg(from: string, to: string, dep: number, tofDays: number): Leg | null {
  const a = state(from, dep), b = state(to, dep + tofDays * 864e5);
  try {
    const { v1, v2 } = lambert(a.r, b.r, tofDays * DAY, MU_SUN, ECL_N);
    const vd = sub(v1, a.v), va = sub(v2, b.v);
    return { dep, tof: tofDays, c3: vd * vd, vinfDep: vd, vinfArr: va };
  } catch { return null; }
}

/** A grid of transfers: departures every `depStep` days from `dep0`, flight times from tof0 to tof1. */
export function grid(from: string, to: string, dep0: number, depDays: number, tof0: number, tof1: number, n = 60) {
  const deps: number[] = [], tofs: number[] = [], cells: (Leg | null)[][] = [];
  for (let i = 0; i < n; i++) deps.push(dep0 + ((depDays * i) / (n - 1)) * 864e5);
  for (let j = 0; j < n; j++) tofs.push(tof0 + ((tof1 - tof0) * j) / (n - 1));
  for (let j = 0; j < n; j++) { const row: (Leg | null)[] = []; for (let i = 0; i < n; i++) row.push(leg(from, to, deps[i], tofs[j])); cells.push(row); }
  let best: Leg | null = null;
  for (const row of cells) for (const c of row) if (c && (!best || c.c3 < best.c3)) best = c;
  return { deps, tofs, cells, best };
}

/** Typical synodic period in days, to suggest a search window. */
export function synodicDays(a: string, b: string) {
  const P: Record<string, number> = { Mercury: 87.969, Venus: 224.701, Earth: 365.256, Mars: 686.98, Jupiter: 4332.59, Saturn: 10759.22 };
  return 1 / Math.abs(1 / P[a] - 1 / P[b]);
}

/** Mean orbit radius (AU) of each planet, for Hohmann estimates. */
export const A_AU: Record<string, number> = { Mercury: 0.387098, Venus: 0.723332, Earth: 1.000001, Mars: 1.523679, Jupiter: 5.2026, Saturn: 9.5549 };
/** Flight time of a Hohmann transfer between circular orbits, in days. */
export function hohmannDays(a: string, b: string) {
  const sma = ((A_AU[a] + A_AU[b]) / 2) * AU_KM;
  return (Math.PI * Math.sqrt(sma ** 3 / MU_SUN)) / DAY;
}
/** A sensible flight-time range for a pair: half to 1.6 times the Hohmann time. */
export function tofRange(a: string, b: string): [number, number] {
  const h = hohmannDays(a, b), r = (x: number) => Math.max(10, Math.round(x / 10) * 10);
  return [r(h * 0.5), r(h * 1.6)];
}
/** The launch window open now or next after `from` (ms): a coarse search over one synodic period, starting two months
 *  before `from` so a window at its best right now is still found, for the lowest C3. */
export function nextWindow(a: string, b2: string, from: number) {
  const syn = synodicDays(a, b2), [t0, t1] = tofRange(a, b2), span = Math.min(syn, 900), s0 = from - 60 * 864e5;
  // Lowest C3 for each departure date, then the first dip that is a real window (within twice the deepest).
  const cols: (Leg | null)[] = [];
  for (let i = 0; i <= 60; i++) {
    let b: Leg | null = null;
    for (let j = 0; j <= 8; j++) { const l = leg(a, b2, s0 + (span * i / 60) * 864e5, t0 + ((t1 - t0) * j) / 8); if (l && (!b || l.c3 < b.c3)) b = l; }
    cols.push(b);
  }
  const c = cols.map((l) => (l ? l.c3 : Infinity)), lo = Math.min(...c);
  let best: Leg | null = null;
  for (let i = 1; i < 60; i++) if (c[i] <= c[i - 1] && c[i] <= c[i + 1] && c[i] < 2 * lo && cols[i]!.dep >= from - 30 * 864e5) { best = cols[i]; break; }
  if (!best) best = cols[c.indexOf(lo)];
  const half = Math.min(syn * 0.18, 200);
  const start = best ? best.dep - half * 864e5 : from;
  return { start, days: Math.round(2 * half), tof: [t0, t1] as [number, number], best };
}

/** Planet gravitational parameters (km³/s²) and equatorial radii (km). */
export const BODY: Record<string, { mu: number; r: number }> = {
  Mercury: { mu: 22031.8, r: 2440.5 }, Venus: { mu: 324858.6, r: 6051.8 }, Earth: { mu: 398600.4, r: 6378.1 },
  Mars: { mu: 42828.4, r: 3396.2 }, Jupiter: { mu: 126686531, r: 71492 }, Saturn: { mu: 37931206, r: 60268 },
};
/** Burn needed to leave (or be captured into) a circular orbit at `alt` km with excess speed vinf: √(v∞² + 2μ/r) − √(μ/r). */
export function burnFromOrbit(body: string, vinf: number, alt = 200) {
  const { mu, r } = BODY[body], rr = r + alt;
  return Math.sqrt(vinf * vinf + (2 * mu) / rr) - Math.sqrt(mu / rr);
}
