// School maths: similar triangles (Class 10 triangles): the basic proportionality theorem, the AA, SSS and SAS
// similarity tests, shadows, and areas of similar triangles. Angles in degrees. No DOM.
export type P = [number, number];

export const dist = (p: P, q: P) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const lerp = (p: P, q: P, t: number): P => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

/** Angles (degrees) opposite sides a, b, c by the cosine rule. NaN if the sides do not make a triangle. */
export function anglesFromSides(a: number, b: number, c: number): [number, number, number] {
  if (!(a > 0 && b > 0 && c > 0) || a + b <= c || a + c <= b || b + c <= a) return [NaN, NaN, NaN];
  const ang = (x: number, y: number, z: number) => (Math.acos(Math.max(-1, Math.min(1, (y * y + z * z - x * x) / (2 * y * z)))) * 180) / Math.PI;
  return [ang(a, b, c), ang(b, a, c), ang(c, a, b)];
}

/** Sides of triangle ABC: a = BC, b = CA, c = AB; angles at A, B, C. */
export function triangle(A: P, B: P, C: P) {
  const a = dist(B, C), b = dist(C, A), c = dist(A, B);
  const [angA, angB, angC] = anglesFromSides(a, b, c);
  return { a, b, c, angA, angB, angC };
}

/**
 * Basic proportionality theorem: a line through D on AB at AD/AB = t, parallel to BC, meets AC at E with
 * AE/AC = t. Returns D, E and the two ratios AD/DB and AE/EC (equal).
 */
export function bpt(A: P, B: P, C: P, t: number) {
  const D = lerp(A, B, t), E = lerp(A, C, t);
  return { D, E, AD: dist(A, D), DB: dist(D, B), AE: dist(A, E), EC: dist(E, C), r1: dist(A, D) / dist(D, B), r2: dist(A, E) / dist(E, C), DE: dist(D, E), BC: dist(B, C) };
}

const close = (x: number, y: number, tol: number) => Math.abs(x - y) <= tol * Math.max(1, Math.abs(x), Math.abs(y));

/** SSS: sort both sets of sides; similar when the three ratios agree. */
export function sss(s1: number[], s2: number[], tol = 1e-3) {
  const p = [...s1].sort((x, y) => x - y), q = [...s2].sort((x, y) => x - y);
  const r = p.map((x, i) => x / q[i]);
  return { ratios: r, similar: close(r[0], r[1], tol) && close(r[1], r[2], tol), k: r[0] };
}

/** AA: two angles of one triangle equal two of the other (in any order). Both must be valid triangles. */
export function aa(a1: [number, number], a2: [number, number], tol = 1e-3) {
  const t1 = [a1[0], a1[1], 180 - a1[0] - a1[1]].sort((x, y) => x - y), t2 = [a2[0], a2[1], 180 - a2[0] - a2[1]].sort((x, y) => x - y);
  const valid = [...t1, ...t2].every((x) => x > 0);
  return { valid, similar: valid && t1.every((x, i) => close(x, t2[i], tol)), third: [180 - a1[0] - a1[1], 180 - a2[0] - a2[1]] };
}

/** SAS: the included angles are equal and the sides around them are in the same ratio. */
export function sas(p1: number, q1: number, ang1: number, p2: number, q2: number, ang2: number, tol = 1e-3) {
  const r1 = p1 / p2, r2 = q1 / q2;
  return { r1, r2, similar: close(ang1, ang2, tol) && close(r1, r2, tol) };
}

/** Same sun, same time: height / shadow is the same for every upright object. */
export const shadowHeight = (h1: number, s1: number, s2: number) => (h1 * s2) / s1;
