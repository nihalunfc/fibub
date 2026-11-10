// #1279 Ferris wheel height: a seat on a wheel of radius R whose hub is H above the ground turns once every T
// (seconds or minutes). Starting from the bottom (plus an optional start angle), after time t it has turned
// θ = 360°·t/T + θ0 and its height is h = H − R cos θ. Pure maths, no DOM.

export type Wheel = { R: number; H: number; T: number; start?: number };   // start: degrees past the bottom at t = 0

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
/** Wrap an angle to [0, 360). */
export const wrap = (d: number) => ((d % 360) + 360) % 360;

/** Angle turned past the bottom (degrees, not wrapped) after time t. */
export const angleAt = (w: Wheel, t: number) => (360 * t) / w.T + (w.start ?? 0);
/** Height of the seat at angle θ (degrees past the bottom). */
export const heightAtAngle = (w: Wheel, th: number) => w.H - w.R * Math.cos(rad(th));
/** Height of the seat after time t. */
export const heightAt = (w: Wheel, t: number) => heightAtAngle(w, angleAt(w, t));
/** Lowest and highest point of the ride. */
export const range = (w: Wheel) => ({ low: w.H - w.R, high: w.H + w.R });
/** Is the wheel possible: radius and period above 0, and the bottom not below the ground. */
export const valid = (w: Wheel) => w.R > 0 && w.T > 0 && w.H >= w.R && Number.isFinite(w.R + w.H + w.T);

/** Angles in [0, 360) where the seat is at height h (0, 1 or 2 of them, smaller first). */
export function anglesAtHeight(w: Wheel, h: number): number[] {
  const c = (w.H - h) / w.R;
  if (c > 1 + 1e-12 || c < -1 - 1e-12) return [];
  const a = deg(Math.acos(Math.max(-1, Math.min(1, c))));
  return a < 1e-9 || Math.abs(a - 180) < 1e-9 ? [a] : [a, 360 - a];
}

/** Times in the first turn (0 ≤ t < T) when the seat is at height h, earliest first. */
export function timesAtHeight(w: Wheel, h: number): number[] {
  return anglesAtHeight(w, h).map((a) => (wrap(a - (w.start ?? 0)) * w.T) / 360).sort((x, y) => x - y);
}

/** Share of each turn (0 to 1) that the seat spends above height h. */
export function fractionAbove(w: Wheel, h: number): number {
  const c = (w.H - h) / w.R;
  if (c >= 1) return 1;
  if (c <= -1) return 0;
  return (360 - 2 * deg(Math.acos(c))) / 360;
}

/** Height table at every `step` degrees from 0 to 360. */
export const table = (w: Wheel, step = 30) => Array.from({ length: Math.round(360 / step) + 1 }, (_, i) => ({ angle: i * step, h: heightAtAngle(w, i * step) }));
