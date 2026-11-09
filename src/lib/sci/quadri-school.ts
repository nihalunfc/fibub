// School maths: quadrilaterals (Class 8 "Understanding quadrilaterals", Class 9 "Quadrilaterals"). Sides, interior
// angles (including a reflex angle in a concave shape), diagonals, area by the shoelace formula, the family name
// (square, rectangle, rhombus, parallelogram, kite, trapezium) and the midpoint (Varignon) parallelogram. No DOM.
export type Pt = [number, number];

const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const cross = (u: Pt, v: Pt) => u[0] * v[1] - u[1] * v[0];
const dot = (u: Pt, v: Pt) => u[0] * v[0] + u[1] * v[1];
const len = (u: Pt) => Math.hypot(u[0], u[1]);
const EPS = 1e-9;

/** Side lengths AB, BC, CD, DA. */
export const sides = (P: Pt[]) => P.map((p, i) => len(sub(P[(i + 1) % 4], p)));

/** Signed area (shoelace); positive when A, B, C, D run anticlockwise in maths axes. */
export function signedArea(P: Pt[]) { let s = 0; for (let i = 0; i < 4; i++) s += cross(P[i], P[(i + 1) % 4]); return s / 2; }
export const area = (P: Pt[]) => Math.abs(signedArea(P));

/** Do segments p1p2 and p3p4 cross (touching counts)? */
function meet(p1: Pt, p2: Pt, p3: Pt, p4: Pt) {
  const d1 = cross(sub(p2, p1), sub(p3, p1)), d2 = cross(sub(p2, p1), sub(p4, p1)), d3 = cross(sub(p4, p3), sub(p1, p3)), d4 = cross(sub(p4, p3), sub(p2, p3));
  if (((d1 > EPS && d2 < -EPS) || (d1 < -EPS && d2 > EPS)) && ((d3 > EPS && d4 < -EPS) || (d3 < -EPS && d4 > EPS))) return true;
  const on = (a: Pt, b: Pt, c: Pt) => Math.abs(cross(sub(b, a), sub(c, a))) < EPS && Math.min(a[0], b[0]) - EPS <= c[0] && c[0] <= Math.max(a[0], b[0]) + EPS && Math.min(a[1], b[1]) - EPS <= c[1] && c[1] <= Math.max(a[1], b[1]) + EPS;
  return on(p1, p2, p3) || on(p1, p2, p4) || on(p3, p4, p1) || on(p3, p4, p2);
}

/** 'simple' (an ordinary quadrilateral), 'crossed' (sides cross, like a bow tie) or 'degenerate' (points repeat, three in a line, zero area). */
export function shapeType(P: Pt[]): 'simple' | 'crossed' | 'degenerate' {
  for (let i = 0; i < 4; i++) { const a = P[(i + 3) % 4], b = P[i], c = P[(i + 1) % 4]; if (Math.abs(cross(sub(b, a), sub(c, b))) < EPS) return 'degenerate'; }
  if (meet(P[0], P[1], P[2], P[3]) || meet(P[1], P[2], P[3], P[0])) return 'crossed';
  return 'simple';
}

/** Interior angles at A, B, C, D in degrees (a simple quadrilateral; a reflex angle is over 180°). They add to 360°. */
export function angles(P: Pt[]) {
  const s = Math.sign(signedArea(P)) || 1;
  return P.map((b, i) => {
    const a = P[(i + 3) % 4], c = P[(i + 1) % 4], e1 = sub(b, a), e2 = sub(c, b);
    const turn = (Math.atan2(cross(e1, e2), dot(e1, e2)) * 180) / Math.PI;
    return 180 - s * turn;
  });
}

export const convex = (P: Pt[]) => shapeType(P) === 'simple' && angles(P).every((x) => x < 180 - 1e-6);

const parallel = (u: Pt, v: Pt) => Math.abs(cross(u, v)) < 1e-9 * Math.max(1, len(u) * len(v));
const near = (x: number, y: number) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));

/** Diagonal facts: lengths AC and BD, whether they bisect each other, are perpendicular or equal. */
export function diagonals(P: Pt[]) {
  const ac = sub(P[2], P[0]), bd = sub(P[3], P[1]);
  const m1: Pt = [(P[0][0] + P[2][0]) / 2, (P[0][1] + P[2][1]) / 2], m2: Pt = [(P[1][0] + P[3][0]) / 2, (P[1][1] + P[3][1]) / 2];
  return { AC: len(ac), BD: len(bd), bisect: len(sub(m1, m2)) < 1e-9, perpendicular: Math.abs(dot(ac, bd)) < 1e-9 * Math.max(1, len(ac) * len(bd)), equal: near(len(ac), len(bd)) };
}

export type Family = 'square' | 'rectangle' | 'rhombus' | 'parallelogram' | 'kite' | 'trapezium' | 'isosceles trapezium' | 'quadrilateral' | 'crossed' | 'degenerate';

/** The most special name, plus every family the shape belongs to (a square is also a rectangle, a rhombus, ...). */
export function classify(P: Pt[]) {
  const t = shapeType(P);
  if (t !== 'simple') return { name: t as Family, also: [] as string[], parallelPairs: 0, kite: false };
  const [ab, bc, cd, da] = sides(P), A = angles(P);
  const p1 = parallel(sub(P[1], P[0]), sub(P[2], P[3])), p2 = parallel(sub(P[2], P[1]), sub(P[3], P[0]));
  const allEq = near(ab, bc) && near(bc, cd) && near(cd, da), right = A.every((x) => Math.abs(x - 90) < 1e-6);
  const kite = (near(ab, bc) && near(cd, da)) || (near(ab, da) && near(bc, cd));
  const pp = Number(p1) + Number(p2);
  let name: Family;
  if (pp === 2) name = allEq && right ? 'square' : allEq ? 'rhombus' : right ? 'rectangle' : 'parallelogram';
  else if (pp === 1) name = (p1 ? near(bc, da) : near(ab, cd)) ? 'isosceles trapezium' : 'trapezium';
  else name = kite ? 'kite' : 'quadrilateral';
  const also: string[] = [];
  if (pp >= 1) also.push('trapezium');
  if (pp === 2) also.push('parallelogram');
  if (pp === 2 && right) also.push('rectangle');
  if (allEq) also.push('rhombus');
  if (allEq && right) also.push('square');
  if (kite) also.push('kite');
  return { name, also, parallelPairs: pp, kite };
}

/** Midpoints of AB, BC, CD, DA: they always form a parallelogram (Varignon). */
export const midpoints = (P: Pt[]): Pt[] => P.map((p, i) => [(p[0] + P[(i + 1) % 4][0]) / 2, (p[1] + P[(i + 1) % 4][1]) / 2]);

export const PRESETS: Record<string, Pt[]> = {
  square: [[2, 1], [6, 1], [6, 5], [2, 5]],
  rectangle: [[1, 1], [7, 1], [7, 4], [1, 4]],
  rhombus: [[1, 1], [6, 1], [9, 5], [4, 5]],
  parallelogram: [[1, 1], [7, 1], [9, 4], [3, 4]],
  kite: [[5, 7], [7, 4], [5, 0], [3, 4]],
  trapezium: [[1, 1], [9, 1], [7, 4], [2, 4]],
  dart: [[2, 1], [6, 3], [2, 5], [3, 3]],
};
