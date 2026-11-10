// Points in space for school (Class 11 introduction to three-dimensional geometry): distance, octants, the section
// formula and a simple turnable view (yaw about the z axis, then tilt). Plain TypeScript, no DOM.

export type P3 = [number, number, number];

export const dist = (P: P3, Q: P3) => Math.hypot(Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]);

/**
 * Octant number 1 to 8 (I to VIII) in the usual school order: I (+, +, +), II (−, +, +), III (−, −, +),
 * IV (+, −, +), then V to VIII the same with z < 0. 0 when the point is on a coordinate plane.
 */
export function octant(P: P3): number {
  const [x, y, z] = P;
  if (x === 0 || y === 0 || z === 0) return 0;
  const q = x > 0 ? (y > 0 ? 1 : 4) : y > 0 ? 2 : 3;
  return z > 0 ? q : q + 4;
}
export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/** Which coordinate planes or axes a point lies on, in words ("" if none). */
export function onWhat(P: P3): string {
  const zeros = P.map((v) => v === 0);
  const n = zeros.filter(Boolean).length;
  if (n === 3) return 'the origin';
  if (n === 2) return `the ${['x', 'y', 'z'][zeros.indexOf(false)]} axis`;
  if (n === 1) return `the ${['yz', 'zx', 'xy'][zeros.indexOf(true)]} plane`;
  return '';
}

/** The point dividing PQ in m : n (internally, or externally when `ext`). */
export function section(P: P3, Q: P3, m: number, n: number, ext = false): P3 {
  const k = ext ? -n : n, s = m + k;
  return [0, 1, 2].map((i) => (m * Q[i] + k * P[i]) / s + 0) as P3;
}
export const midpoint = (P: P3, Q: P3) => section(P, Q, 1, 1);

/**
 * Screen position for a view turned by `yaw` degrees about the z axis and tilted down by `pitch` degrees.
 * Returns [h, v, depth]: h to the right, v up, depth toward the viewer.
 */
export function view(P: P3, yaw: number, pitch: number): [number, number, number] {
  const a = (yaw * Math.PI) / 180, e = (pitch * Math.PI) / 180;
  const h = -P[0] * Math.sin(a) + P[1] * Math.cos(a);
  const d = P[0] * Math.cos(a) + P[1] * Math.sin(a);
  return [h, P[2] * Math.cos(e) - d * Math.sin(e), d * Math.cos(e) + P[2] * Math.sin(e)];
}
