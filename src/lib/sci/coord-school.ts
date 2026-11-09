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
