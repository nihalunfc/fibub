// School maths (Class 9 quadrilaterals): the mid-point theorem, its converse and Varignon's theorem (the mid-points
// of any quadrilateral make a parallelogram), with the measurements that show them. No DOM.

export type P = [number, number];

export const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
export const dist = (a: P, b: P) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const cross = (u: P, v: P) => u[0] * v[1] - u[1] * v[0];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];

/** Angle between the lines a1→a2 and b1→b2 in degrees, 0 to 90 (0 means parallel). */
export function lineAngle(a1: P, a2: P, b1: P, b2: P): number {
  const u = sub(a2, a1), v = sub(b2, b1);
  const t = Math.abs(Math.atan2(cross(u, v), u[0] * v[0] + u[1] * v[1])) * 180 / Math.PI;
  return t > 90 ? 180 - t : t;
}

/** Angle at vertex V between rays V→A and V→B, in degrees (0 to 180). */
export function angleAt(V: P, A: P, B: P): number {
  const u = sub(A, V), v = sub(B, V);
  return Math.abs(Math.atan2(cross(u, v), u[0] * v[0] + u[1] * v[1])) * 180 / Math.PI;
}

/** Twice the signed area: 0 when the three points are in a line. */
export const area2 = (a: P, b: P, c: P) => cross(sub(b, a), sub(c, a));

/** Mid-point theorem: D, E mid-points of AB and AC; DE ∥ BC and DE = BC / 2. */
export function midpointTheorem(A: P, B: P, C: P) {
  const D = mid(A, B), E = mid(A, C);
  return { D, E, DE: dist(D, E), BC: dist(B, C), angle: lineAngle(D, E, B, C), ADE: angleAt(D, A, E), ABC: angleAt(B, A, C) };
}

/** Converse: the line through D (mid-point of AB) parallel to BC meets AC at F; F is the mid-point of AC. */
export function converse(A: P, B: P, C: P) {
  const D = mid(A, B), d = sub(C, B), w = sub(C, A);
  // Solve D + s·d = A + t·w for t.
  const den = cross(w, d);
  const t = cross(sub(D, A), d) / den;
  const F: P = [A[0] + t * w[0], A[1] + t * w[1]];
  return { D, F, AF: dist(A, F), FC: dist(F, C), t };
}

/** Varignon: mid-points P, Q, R, S of AB, BC, CD, DA form a parallelogram with sides half the diagonals. */
export function varignon(A: P, B: P, C: P, D: P) {
  const Pm = mid(A, B), Q = mid(B, C), R = mid(C, D), Sm = mid(D, A);
  return {
    pts: [Pm, Q, R, Sm] as P[],
    PQ: dist(Pm, Q), QR: dist(Q, R), RS: dist(R, Sm), SP: dist(Sm, Pm),
    AC: dist(A, C), BD: dist(B, D),
    perimeter: dist(Pm, Q) + dist(Q, R) + dist(R, Sm) + dist(Sm, Pm),
    area: Math.abs(area2(Pm, Q, R) + area2(Pm, R, Sm)) / 2,
    quadArea: Math.abs(area2(A, B, C) + area2(A, C, D)) / 2,
  };
}
