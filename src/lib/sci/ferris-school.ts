// School maths: a Ferris wheel seat's height as the wheel turns (Class 9 rotations, bridge to Class 10/11 trig).
// The seat starts at the bottom; after turning θ degrees its height is h = H − r cos θ, where H is the height of
// the hub and r the radius. One full turn is 360°; turns add up past 360. No DOM.

const rad = (d: number) => (d * Math.PI) / 180;

/** Height of the seat (same units as r and hub) after turning `deg` degrees from the bottom. */
export const height = (deg: number, r: number, hub: number) => hub - r * Math.cos(rad(deg));

/** Angle turned after `t` seconds when one turn takes `period` seconds. */
export const angleAt = (t: number, period: number) => (period > 0 ? (360 * t) / period : 0);

/** Split a total angle into whole turns and the rest: 450° → { turns: 1, rest: 90 }. Works for negative angles. */
export function turns(deg: number): { turns: number; rest: number } {
  const n = Math.floor(deg / 360);
  let rest = deg - 360 * n;
  if (Math.abs(rest - 360) < 1e-9) { rest = 0; return { turns: n + 1, rest }; }
  return { turns: n, rest: Math.abs(rest) < 1e-9 ? 0 : rest };
}

/** Angles in the first turn [0, 360) where the seat is at height h, smallest first ([] if never). */
export function anglesAtHeight(h: number, r: number, hub: number): number[] {
  if (r <= 0) return [];
  const c = (hub - h) / r;
  if (c > 1 + 1e-12 || c < -1 - 1e-12) return [];
  const a = (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
  if (a < 1e-9) return [0];
  if (Math.abs(a - 180) < 1e-9) return [180];
  return [a, 360 - a];
}

/** Share of each turn the seat spends above height h (0 to 1). */
export function shareAbove(h: number, r: number, hub: number): number {
  if (h <= hub - r) return 1;
  if (h >= hub + r) return 0;
  const [a] = anglesAtHeight(h, r, hub);
  return (360 - 2 * a) / 360;
}
