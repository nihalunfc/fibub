// School maths: Heron's formula (Class 9). Area of a triangle from its three sides, the triangle inequality,
// the kind of triangle, and the height on a chosen base for the ½ × base × height check. No DOM.

export type Kind = { bySides: 'equilateral' | 'isosceles' | 'scalene'; byAngles: 'acute' | 'right' | 'obtuse' };

export function valid(a: number, b: number, c: number): boolean {
  return a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a;
}

/** Heron: s = (a + b + c)/2, area = √[s(s − a)(s − b)(s − c)]. Uses a stable ordering for thin triangles. */
export function heron(a: number, b: number, c: number) {
  const s = (a + b + c) / 2;
  if (!valid(a, b, c)) return { s, area: NaN, product: s * (s - a) * (s - b) * (s - c) };
  // Kahan's stable form with x ≥ y ≥ z.
  const [x, y, z] = [a, b, c].sort((p, q) => q - p);
  const area = 0.25 * Math.sqrt((x + (y + z)) * (z - (x - y)) * (z + (x - y)) * (x + (y - z)));
  return { s, area, product: s * (s - a) * (s - b) * (s - c) };
}

export function kind(a: number, b: number, c: number, tol = 1e-9): Kind {
  const eq = (p: number, q: number) => Math.abs(p - q) <= tol * Math.max(p, q);
  const bySides = eq(a, b) && eq(b, c) ? 'equilateral' : eq(a, b) || eq(b, c) || eq(a, c) ? 'isosceles' : 'scalene';
  const [x, y, z] = [a, b, c].sort((p, q) => q - p), d = x * x - (y * y + z * z);
  const byAngles = Math.abs(d) <= tol * x * x ? 'right' : d > 0 ? 'obtuse' : 'acute';
  return { bySides, byAngles };
}

/** Corner positions with side c = AB on the x axis from (0, 0): A, B, C (C above the axis). a = BC, b = CA. */
export function place(a: number, b: number, c: number): [[number, number], [number, number], [number, number]] {
  const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x));
  return [[0, 0], [c, 0], [x, y]];
}

/** Height on base c (= AB): 2 × area / c. */
export const heightOn = (base: number, area: number) => (2 * area) / base;

/** The three angles in degrees (A opposite a, B opposite b, C opposite c) by the cosine rule; NaN for an impossible triangle. */
export function angles(a: number, b: number, c: number): [number, number, number] {
  if (!valid(a, b, c)) return [NaN, NaN, NaN];
  const ang = (x: number, y: number, z: number) => (Math.acos(Math.max(-1, Math.min(1, (y * y + z * z - x * x) / (2 * y * z)))) * 180) / Math.PI;
  const A = ang(a, b, c), B = ang(b, a, c);
  return [A, B, 180 - A - B];
}
/** The three heights (on a, on b, on c) from the area. */
export const heights = (a: number, b: number, c: number, area: number): [number, number, number] => [(2 * area) / a, (2 * area) / b, (2 * area) / c];
/** Radius of the inscribed circle: area / s. */
export const inradius = (a: number, b: number, c: number, area: number) => area / ((a + b + c) / 2);
/** Radius of the circle through the three corners: abc / (4 area). */
export const circumradius = (a: number, b: number, c: number, area: number) => (a * b * c) / (4 * area);
