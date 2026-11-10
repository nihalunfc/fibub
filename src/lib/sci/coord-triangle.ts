// Triangles from coordinates (Class 10 and 11 coordinate geometry): side lengths by the distance formula, area by
// the vertex formula, collinearity, and the type by sides (equilateral, isosceles, scalene) and by angles (right,
// acute, obtuse, from the converse of Pythagoras). Slopes for the Class 11 view. No DOM.

export type Pt = [number, number];
const EPS = 1e-9;
const same = (a: number, b: number) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));

/** Squared distance between two points. */
export const d2 = (P: Pt, Q: Pt) => (P[0] - Q[0]) ** 2 + (P[1] - Q[1]) ** 2;

/** Twice the signed area: x1(y2 − y3) + x2(y3 − y1) + x3(y1 − y2). */
export const area2 = (A: Pt, B: Pt, C: Pt) => A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]);

/** Slope of PQ, or Infinity for a vertical line. */
export const slope = (P: Pt, Q: Pt) => (same(P[0], Q[0]) ? Infinity : (Q[1] - P[1]) / (Q[0] - P[0]));

/** √n in simplest surd form for a whole number n: 20 → "2√5", 16 → "4", 7 → "√7". Null if n is not whole. */
export function surd(n: number): string | null {
  const r = Math.round(n);
  if (Math.abs(n - r) > 1e-9 || r < 0) return null;
  if (r === 0) return '0';
  let out = 1, rest = r;
  for (let p = 2; p * p <= rest; p++) while (rest % (p * p) === 0) { out *= p; rest /= p * p; }
  return rest === 1 ? String(out) : `${out === 1 ? '' : out}√${rest}`;
}

export type Kind = {
  sides: [number, number, number];   // AB², BC², CA²
  area: number;                      // ½|area2|
  collinear: boolean;
  middle: 'A' | 'B' | 'C' | null;    // for collinear points, the one that lies between the other two
  same: 0 | 1 | 2 | 3;               // 0 none, 1 two points coincide, 2 two points coincide twice, 3 all the same
  bySides: 'equilateral' | 'isosceles' | 'scalene' | null;
  equalPairs: ('AB' | 'BC' | 'CA')[]; // the sides that are equal to another side
  byAngles: 'right' | 'acute' | 'obtuse' | null;
  at: 'A' | 'B' | 'C' | null;        // vertex of the right or obtuse angle
};

export function classify(A: Pt, B: Pt, C: Pt): Kind {
  const s: [number, number, number] = [d2(A, B), d2(B, C), d2(C, A)];
  const zero = s.filter((x) => x < EPS).length as 0 | 1 | 2 | 3;
  const area = Math.abs(area2(A, B, C)) / 2;
  const scale = Math.max(1, ...s);
  const collinear = Math.abs(area2(A, B, C)) <= 1e-9 * scale;
  const k: Kind = { sides: s, area, collinear, middle: null, same: zero, bySides: null, equalPairs: [], byAngles: null, at: null };
  if (collinear) {
    if (!zero) {
      // The point opposite the longest side lies between the other two.
      const i = s.indexOf(Math.max(...s));
      k.middle = (['C', 'A', 'B'] as const)[i];
    }
    return k;
  }
  const names = ['AB', 'BC', 'CA'] as const;
  const eq = (i: number, j: number) => same(s[i], s[j]);
  const pairs = new Set<'AB' | 'BC' | 'CA'>();
  for (const [i, j] of [[0, 1], [1, 2], [2, 0]]) if (eq(i, j)) { pairs.add(names[i]); pairs.add(names[j]); }
  k.equalPairs = [...pairs];
  k.bySides = pairs.size === 3 ? 'equilateral' : pairs.size === 2 ? 'isosceles' : 'scalene';
  const i = s.indexOf(Math.max(...s)), big = s[i], others = s[0] + s[1] + s[2] - big;
  k.at = (['C', 'A', 'B'] as const)[i];             // opposite AB is C, opposite BC is A, opposite CA is B
  k.byAngles = same(big, others) ? 'right' : big > others ? 'obtuse' : 'acute';
  if (k.byAngles === 'acute') k.at = null;
  return k;
}

/** The angle at each vertex in degrees (law of cosines), [A, B, C]. */
export function angles(A: Pt, B: Pt, C: Pt): [number, number, number] {
  const [c2, a2, b2] = [d2(A, B), d2(B, C), d2(C, A)];
  const ang = (opp: number, x: number, y: number) => (Math.acos(Math.max(-1, Math.min(1, (x + y - opp) / (2 * Math.sqrt(x * y))))) * 180) / Math.PI;
  return [ang(a2, b2, c2), ang(b2, a2, c2), ang(c2, a2, b2)];
}
