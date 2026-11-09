// Thermal processing sums: D-value from survivor counts, z-value from D-values at several temperatures,
// the F needed for a log reduction, lethal rates and F by the general method (trapezoid rule over a measured
// time-temperature profile). For study; a real process must be set by a process authority.
import { fitLine } from './fit.ts';

export type Line = { a: number; b: number; r2: number; n: number };
function line(x: number[], y: number[]): Line {
  if (x.length === 2) { const b = (y[1] - y[0]) / (x[1] - x[0]); return { a: y[0] - b * x[0], b, r2: 1, n: 2 }; }
  const f = fitLine(x, y); return { a: f.intercept, b: f.slope, r2: f.r2, n: x.length };
}

/** D-value (time for a 90 % kill) from survivor counts at times t: least squares on log10 N against t. */
export function dValue(pts: { t: number; N: number }[]): { D: number; logN0: number; fit: Line } {
  if (pts.length < 2) throw new Error('Give at least two survivor counts.');
  if (pts.some((p) => !(p.N > 0))) throw new Error('Every count must be more than 0 (a log of 0 is not defined).');
  if (new Set(pts.map((p) => p.t)).size < 2) throw new Error('Use at least two different times.');
  const fit = line(pts.map((p) => p.t), pts.map((p) => Math.log10(p.N)));
  if (!(fit.b < 0)) throw new Error('The counts do not fall with time, so there is no D-value.');
  return { D: -1 / fit.b, logN0: fit.a, fit };
}

/** z-value (°C rise for a tenfold drop in D) from D-values at several temperatures: least squares on log10 D against T. */
export function zValue(pts: { T: number; D: number }[]): { z: number; fit: Line; dAt: (T: number) => number } {
  if (pts.length < 2) throw new Error('Give D-values at two or more temperatures.');
  if (pts.some((p) => !(p.D > 0))) throw new Error('Every D-value must be more than 0.');
  if (new Set(pts.map((p) => p.T)).size < 2) throw new Error('Use at least two different temperatures.');
  const fit = line(pts.map((p) => p.T), pts.map((p) => Math.log10(p.D)));
  if (!(fit.b < 0)) throw new Error('D does not fall as temperature rises, so there is no z-value.');
  return { z: -1 / fit.b, fit, dAt: (T) => Math.pow(10, fit.a + fit.b * T) };
}

/** F (minutes at the reference temperature) for a reduction from log N0 to log N: F = D · (log N0 − log N). */
export const fNeeded = (D: number, logN0: number, logN: number) => D * (logN0 - logN);

/** Lethal rate at T: L = 10^((T − Tref)/z), minutes at Tref per minute at T. */
export const lethalRate = (T: number, Tref: number, z: number) => Math.pow(10, (T - Tref) / z);

export type Profile = { t: number[]; T: number[]; L: number[]; F: number[]; total: number; peak: number; peakAt: number };

/** F by the general method: lethal rates over the profile, added up with the trapezoid rule. Times in minutes, in order. */
export function fProfile(pts: { t: number; T: number }[], Tref: number, z: number): Profile {
  if (pts.length < 2) throw new Error('Give at least two time-temperature readings.');
  if (!(z > 0)) throw new Error('z must be more than 0.');
  for (let i = 1; i < pts.length; i++) if (!(pts[i].t > pts[i - 1].t)) throw new Error(`Times must increase: ${pts[i].t} comes after ${pts[i - 1].t}.`);
  const t = pts.map((p) => p.t), T = pts.map((p) => p.T), L = T.map((x) => lethalRate(x, Tref, z));
  const F = [0];
  for (let i = 1; i < t.length; i++) F.push(F[i - 1] + ((L[i] + L[i - 1]) / 2) * (t[i] - t[i - 1]));
  const k = T.indexOf(Math.max(...T));
  return { t, T, L, F, total: F[F.length - 1], peak: T[k], peakAt: t[k] };
}

/** Made-up example data (not from any study): counts in CFU/g, times and D in minutes, temperatures in °C. */
export const EXAMPLE_SURVIVORS = `Time (min), Survivors (per g)
0, 1000000
2, 210000
4, 44000
6, 9000
8, 2000`;
export const EXAMPLE_D = `Temperature (°C), D (min)
110, 20
115, 6.5
120, 2
125, 0.62`;
export const EXAMPLE_PROFILE = `Time (min), Temperature (°C)
0, 40
5, 70
10, 95
15, 110
20, 117
25, 120
30, 121
35, 121.5
40, 121.5
45, 121
50, 110
55, 90
60, 60`;
