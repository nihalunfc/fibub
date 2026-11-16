// School maths: coordinate geometry (Class 10): distance formula, section formula (internal and external),
// midpoint, centroid, area of a triangle from its corners, and the ratio in which a point divides a segment. No DOM.
export type Pt = [number, number];

export const distance = (A: Pt, B: Pt) => Math.hypot(B[0] - A[0], B[1] - A[1]);

/** The point dividing AB internally in the ratio m : n (external when `external`, m ≠ n). */
export function section(A: Pt, B: Pt, m: number, n: number, external = false): Pt {
  const d = external ? m - n : m + n;
  if (d === 0) return [NaN, NaN];
  const s = external ? -1 : 1;
  return [(m * B[0] + s * n * A[0]) / d, (m * B[1] + s * n * A[1]) / d];
}

export const midpoint = (A: Pt, B: Pt): Pt => [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
export const centroid = (A: Pt, B: Pt, C: Pt): Pt => [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];

/** Area of triangle ABC: ½ |x1(y2 − y3) + x2(y3 − y1) + x3(y1 − y2)|. Zero means the points are collinear. */
export const triArea = (A: Pt, B: Pt, C: Pt) => Math.abs(A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])) / 2;

/** The ratio k : 1 in which the x axis (y = 0) divides AB: k = −y1 / y2. Positive k means between A and B. */
export const ratioOnXAxis = (A: Pt, B: Pt) => (B[1] === 0 ? NaN : -A[1] / B[1]);

/** The ratio in which P divides AB, when P is on line AB: m : n with P = (mB + nA)/(m + n). `external` when P is outside the segment. */
export function ratioDividing(A: Pt, B: Pt, P: Pt): { m: number; n: number; external: boolean } | { error: 'same' | 'offline' } {
  const dx = B[0] - A[0], dy = B[1] - A[1];
  if (dx === 0 && dy === 0) return { error: 'same' };
  const cross = dx * (P[1] - A[1]) - dy * (P[0] - A[0]);
  if (Math.abs(cross) > 1e-9 * Math.max(1, Math.hypot(dx, dy) * Math.hypot(P[0] - A[0], P[1] - A[1]))) return { error: 'offline' };
  const t = Math.abs(dx) >= Math.abs(dy) ? (P[0] - A[0]) / dx : (P[1] - A[1]) / dy;
  return { m: Math.abs(t), n: Math.abs(1 - t), external: t < 0 || t > 1 };
}

/** Where the x axis (axis 'x') or the y axis (axis 'y') cuts line AB: the ratio k : 1 from A (k < 0 means outside AB), and the point.
 *  Null when AB is parallel to that axis or lies on it; k = Infinity when B itself is on the axis. */
export function axisCut(A: Pt, B: Pt, axis: 'x' | 'y'): { k: number; P: Pt } | null {
  const i = axis === 'x' ? 1 : 0;
  if (A[i] === B[i]) return null;
  if (B[i] === 0) return { k: Infinity, P: [B[0], B[1]] };
  const k = -A[i] / B[i];
  return { k, P: section(A, B, k, 1) };
}
