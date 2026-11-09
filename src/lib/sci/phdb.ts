// Decibels over distance: geometric spreading from a point, line or plane source, atmospheric absorption from the
// ISO 9613-1 formula (phair.ts), A-weighting from the IEC 61672 analytic formula, and adding, averaging and
// subtracting levels. No DOM.
import { airAbsorption, dbSum } from './phair.ts';
export { dbSum };

export type SourceKind = 'point' | 'line' | 'plane';
export const OCTAVES = [63, 125, 250, 500, 1000, 2000, 4000, 8000];

/** Drop from geometric spreading between distances r1 and r2 (dB): 20 lg, 10 lg or 0 for point, line, plane. */
export const spreading = (kind: SourceKind, r1: number, r2: number) => (kind === 'point' ? 20 : kind === 'line' ? 10 : 0) * Math.log10(r2 / r1);

export type Air = { tC: number; rh: number; pKPa: number; on: boolean };

/** Level at r2 of a pure tone (or one band, at its centre frequency) that is L1 at r1, with extra losses in dB. */
export function levelAt(L1: number, r1: number, r2: number, f: number, kind: SourceKind, air: Air, extra = 0) {
  const a = air.on ? airAbsorption(f, air.tC, air.rh, air.pKPa).alpha : 0;
  const sp = spreading(kind, r1, r2), ab = a * (r2 - r1);
  return { L2: L1 - sp - ab - extra, spread: sp, absorb: ab, alpha: a };
}

/** A-weighting (dB) from the analytic formula of IEC 61672-1 (normalised to 0 dB at 1 kHz). */
export function aWeight(f: number) {
  const f2 = f * f;
  const ra = (12194 ** 2 * f2 * f2) / ((f2 + 20.6 ** 2) * Math.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2)) * (f2 + 12194 ** 2));
  return 20 * Math.log10(ra) + 2.0;
}

/**
 * Distance at which the level falls to `target` (dB), searching r1 to 1000 km (the level falls steadily with distance).
 * Returns NaN when the level is already at or below the target at r1, or never gets there within the range.
 */
export function distanceFor(target: number, L1: number, r1: number, fn: (r: number) => number, rMax = 1e6) {
  if (fn(r1) <= target) return NaN;
  if (fn(rMax) > target) return NaN;
  let lo = r1, hi = rMax;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (fn(mid) > target) lo = mid; else hi = mid;
    if (hi / lo - 1 < 1e-12) break;
  }
  return Math.sqrt(lo * hi);
}

/** Energy average of levels: 10 lg(mean of 10^(L/10)). */
export const dbMean = (L: number[]) => 10 * Math.log10(L.reduce((s, x) => s + Math.pow(10, x / 10), 0) / L.length);

/** Level of a source alone from the total with it on and the background alone. NaN when total ≤ background. */
export const dbSubtract = (total: number, background: number) => (total > background ? 10 * Math.log10(Math.pow(10, total / 10) - Math.pow(10, background / 10)) : NaN);
