// School vectors and 3D lines (Class 12 maths): sum, dot and cross products, projections, direction
// cosines, the angle between vectors, and the shortest distance between two lines in space (skew,
// parallel or meeting). Plain TypeScript, no DOM.

export type V3 = [number, number, number];
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a: V3) => Math.hypot(a[0], a[1], a[2]);
/** Angle between a and b in degrees (NaN if either is zero). */
export function angle(a: V3, b: V3): number {
  const n = norm(a) * norm(b); if (n === 0) return NaN;
  return (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / n))) * 180) / Math.PI;
}
/** Scalar projection of b on a (b · â) and the vector projection. */
export function projection(b: V3, a: V3): { length: number; vector: V3 } {
  const n = norm(a); if (n === 0) return { length: NaN, vector: [NaN, NaN, NaN] };
  const l = dot(a, b) / n; return { length: l, vector: scale(a, l / n) };
}
/** Direction cosines l, m, n of a. */
export const dirCos = (a: V3): V3 => { const n = norm(a); return [a[0] / n, a[1] / n, a[2] / n]; };

/** Two lines r = p1 + s d1 and r = p2 + t d2: how they sit, the angle between them and the shortest distance. */
export function lines(p1: V3, d1: V3, p2: V3, d2: V3) {
  const c = cross(d1, d2), nc = norm(c), w = sub(p2, p1), scaleN = norm(d1) * norm(d2);
  const ang = angle(d1, d2), acute = ang > 90 ? 180 - ang : ang;
  if (nc <= 1e-12 * Math.max(1, scaleN)) {
    const dist = norm(cross(w, d1)) / norm(d1);
    return { kind: dist < 1e-12 ? 'same' as const : 'parallel' as const, dist, angle: 0, s: NaN, t: NaN };
  }
  const dist = Math.abs(dot(w, c)) / nc;
  // Closest points: solve for s, t with (p1 + s d1 − p2 − t d2) square to both directions.
  const a = dot(d1, d1), b = dot(d1, d2), e = dot(d2, d2), f = dot(d1, w), g = dot(d2, w), den = a * e - b * b;
  const s = (f * e - b * g) / den, t = (b * f - a * g) / den;
  return { kind: dist < 1e-9 ? 'meet' as const : 'skew' as const, dist, angle: acute, s, t };
}
