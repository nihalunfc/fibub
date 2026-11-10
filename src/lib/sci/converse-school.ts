// School maths: statements and their converses (Class 9). Each statement "if P then Q" is tested on random
// figures or numbers; the converse "if Q then P" too. A figure where the hypothesis holds and the conclusion
// fails is a counterexample. Shapes are checked by measuring (with a small tolerance), as a student would. No DOM.

export type Pt = [number, number];
export type Fig = { kind: 'quad'; pts: Pt[]; family: string } | { kind: 'tri'; pts: Pt[]; family: string } | { kind: 'num'; n: number; family: string }
  | { kind: 'angles'; a: number; b: number; family: string };

const TOL = 1e-6;
const eq = (a: number, b: number, tol = TOL) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const len = (p: Pt, q: Pt) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const dot = (u: Pt, v: Pt) => u[0] * v[0] + u[1] * v[1];
const vec = (p: Pt, q: Pt): Pt => [q[0] - p[0], q[1] - p[1]];
const cross = (u: Pt, v: Pt) => u[0] * v[1] - u[1] * v[0];

/** Side lengths AB, BC, CD, DA and diagonals AC, BD of quadrilateral ABCD. */
export function measures(p: Pt[]) {
  const [A, B, C, D] = p;
  return { s: [len(A, B), len(B, C), len(C, D), len(D, A)], d: [len(A, C), len(B, D)] };
}
/** Interior angle at vertex i of a polygon, in degrees. */
export function angleAt(p: Pt[], i: number): number {
  const n = p.length, a = vec(p[i], p[(i + n - 1) % n]), b = vec(p[i], p[(i + 1) % n]);
  return (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (Math.hypot(...a) * Math.hypot(...b))))) * 180) / Math.PI;
}
const parallel = (u: Pt, v: Pt) => Math.abs(cross(u, v)) <= 1e-6 * Math.hypot(...u) * Math.hypot(...v);

export const Q = {
  oppSidesEqual: (p: Pt[]) => { const { s } = measures(p); return eq(s[0], s[2]) && eq(s[1], s[3]); },
  parallelogram: (p: Pt[]) => parallel(vec(p[0], p[1]), vec(p[3], p[2])) && parallel(vec(p[1], p[2]), vec(p[0], p[3])),
  allSidesEqual: (p: Pt[]) => { const { s } = measures(p); return s.every((x) => eq(x, s[0])); },
  rightAngles: (p: Pt[]) => [0, 1, 2, 3].every((i) => eq(angleAt(p, i), 90)),
  diagonalsEqual: (p: Pt[]) => { const { d } = measures(p); return eq(d[0], d[1]); },
  diagonalsPerp: (p: Pt[]) => Math.abs(dot(vec(p[0], p[2]), vec(p[1], p[3]))) <= 1e-6 * len(p[0], p[2]) * len(p[1], p[3]),
  diagonalsBisect: (p: Pt[]) => { const m1: Pt = [(p[0][0] + p[2][0]) / 2, (p[0][1] + p[2][1]) / 2], m2: Pt = [(p[1][0] + p[3][0]) / 2, (p[1][1] + p[3][1]) / 2]; return len(m1, m2) <= 1e-6 * Math.max(1, len(p[0], p[2])); },
};
export const square = (p: Pt[]) => Q.allSidesEqual(p) && Q.rightAngles(p);
export const rectangle = (p: Pt[]) => Q.rightAngles(p);
export const rhombus = (p: Pt[]) => Q.allSidesEqual(p);

/** Triangle facts: AB = AC (isosceles at A), base angles B and C equal, right angle at A, a² + b² = c² style. */
export const T = {
  isosceles: (p: Pt[]) => eq(len(p[0], p[1]), len(p[0], p[2])),
  baseAnglesEqual: (p: Pt[]) => eq(angleAt(p, 1), angleAt(p, 2)),
  rightAtA: (p: Pt[]) => eq(angleAt(p, 0), 90),
  pythag: (p: Pt[]) => eq(len(p[0], p[1]) ** 2 + len(p[0], p[2]) ** 2, len(p[1], p[2]) ** 2),
  equilateral: (p: Pt[]) => eq(len(p[0], p[1]), len(p[1], p[2])) && eq(len(p[1], p[2]), len(p[2], p[0])),
  allAngles60: (p: Pt[]) => [0, 1, 2].every((i) => eq(angleAt(p, i), 60)),
};

export type Statement = {
  id: string; kind: Fig['kind']; text: string; converse: string;
  P: (f: Fig) => boolean; Qc: (f: Fig) => boolean; statementTrue: boolean; converseTrue: boolean; why: string;
};

const q = (fn: (p: Pt[]) => boolean) => (f: Fig) => (f.kind === 'quad' || f.kind === 'tri') && fn(f.pts);
const nm = (fn: (n: number) => boolean) => (f: Fig) => f.kind === 'num' && fn(f.n);

export const STATEMENTS: Statement[] = [
  { id: 'sq-diag', kind: 'quad', text: 'If a quadrilateral is a square, then its diagonals are equal.', converse: 'If a quadrilateral has equal diagonals, then it is a square.',
    P: q(square), Qc: q(Q.diagonalsEqual), statementTrue: true, converseTrue: false, why: 'A rectangle, or an isosceles trapezium, has equal diagonals but is not a square.' },
  { id: 'pgram-sides', kind: 'quad', text: 'If a quadrilateral is a parallelogram, then its opposite sides are equal.', converse: 'If both pairs of opposite sides of a quadrilateral are equal, then it is a parallelogram.',
    P: q(Q.parallelogram), Qc: q(Q.oppSidesEqual), statementTrue: true, converseTrue: true, why: 'Both directions can be proved with congruent triangles (SSS for the converse), so this is an "if and only if".' },
  { id: 'rh-perp', kind: 'quad', text: 'If a quadrilateral is a rhombus, then its diagonals are perpendicular.', converse: 'If the diagonals of a quadrilateral are perpendicular, then it is a rhombus.',
    P: q(rhombus), Qc: q(Q.diagonalsPerp), statementTrue: true, converseTrue: false, why: 'A kite has perpendicular diagonals without all four sides equal.' },
  { id: 'rect-bisect', kind: 'quad', text: 'If a quadrilateral is a rectangle, then its diagonals bisect each other.', converse: 'If the diagonals of a quadrilateral bisect each other, then it is a rectangle.',
    P: q(rectangle), Qc: q(Q.diagonalsBisect), statementTrue: true, converseTrue: false, why: 'Every parallelogram has diagonals that bisect each other, and most parallelograms are not rectangles.' },
  { id: 'pgram-bisect', kind: 'quad', text: 'If a quadrilateral is a parallelogram, then its diagonals bisect each other.', converse: 'If the diagonals of a quadrilateral bisect each other, then it is a parallelogram.',
    P: q(Q.parallelogram), Qc: q(Q.diagonalsBisect), statementTrue: true, converseTrue: true, why: 'Both directions hold (vertically opposite angles and SAS congruence), so it is an "if and only if".' },
  { id: 'iso-base', kind: 'tri', text: 'If two sides of a triangle are equal (AB = AC), then the angles opposite them are equal (∠B = ∠C).', converse: 'If two angles of a triangle are equal (∠B = ∠C), then the sides opposite them are equal (AB = AC).',
    P: q(T.isosceles), Qc: q(T.baseAnglesEqual), statementTrue: true, converseTrue: true, why: 'Both are standard theorems about isosceles triangles.' },
  { id: 'pythag', kind: 'tri', text: 'If ∠A of triangle ABC is a right angle, then AB² + AC² = BC².', converse: 'If AB² + AC² = BC² in triangle ABC, then ∠A is a right angle.',
    P: q(T.rightAtA), Qc: q(T.pythag), statementTrue: true, converseTrue: true, why: 'Pythagoras\' theorem and its converse are both true.' },
  { id: 'equi-60', kind: 'tri', text: 'If a triangle is equilateral, then each angle is 60°.', converse: 'If each angle of a triangle is 60°, then it is equilateral.',
    P: q(T.equilateral), Qc: q(T.allAngles60), statementTrue: true, converseTrue: true, why: 'Equal sides give equal angles and equal angles give equal sides.' },
  { id: 'vert-opp', kind: 'angles', text: 'If two angles are vertically opposite, then they are equal.', converse: 'If two angles are equal, then they are vertically opposite.',
    P: (f) => f.kind === 'angles' && f.family === 'vertical', Qc: (f) => f.kind === 'angles' && eq(f.a, f.b), statementTrue: true, converseTrue: false, why: 'Two equal angles can sit in different places, for example two 40° corners of two separate triangles.' },
  { id: 'div6', kind: 'num', text: 'If a whole number is divisible by 6, then it is divisible by 3.', converse: 'If a whole number is divisible by 3, then it is divisible by 6.',
    P: nm((n) => n % 6 === 0), Qc: nm((n) => n % 3 === 0), statementTrue: true, converseTrue: false, why: '9 is divisible by 3 but not by 6.' },
  { id: 'even-sq', kind: 'num', text: 'If a whole number n is even, then n² is even.', converse: 'If n² is even, then n is even.',
    P: nm((n) => n % 2 === 0), Qc: nm((n) => (n * n) % 2 === 0), statementTrue: true, converseTrue: true, why: 'An odd number times an odd number is odd, so n² even forces n even.' },
  { id: 'prime-odd', kind: 'num', text: 'If a whole number greater than 2 is prime, then it is odd.', converse: 'If a whole number greater than 2 is odd, then it is prime.',
    P: nm((n) => n > 2 && isPrime(n)), Qc: nm((n) => n > 2 && n % 2 === 1), statementTrue: true, converseTrue: false, why: '9 and 15 are odd but not prime.' },
];

export function isPrime(n: number): boolean {
  if (n < 2 || !Number.isInteger(n)) return false;
  for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
  return true;
}

/** A small seeded random generator (mulberry32) so a hunt can be repeated. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const rot = (pts: Pt[], ang: number, cx: number, cy: number): Pt[] => pts.map(([x, y]) => [cx + x * Math.cos(ang) - y * Math.sin(ang), cy + x * Math.sin(ang) + y * Math.cos(ang)]);

export const QUAD_FAMILIES = ['square', 'rectangle', 'rhombus', 'parallelogram', 'kite', 'isosceles trapezium', 'trapezium', 'any quadrilateral'] as const;
export const TRI_FAMILIES = ['equilateral', 'isosceles', 'right-angled at A', 'right isosceles', 'scalene'] as const;

/** A random figure of the given kind, drawn from special families so the hypotheses come up often. */
export function randomFig(kind: Fig['kind'], r: () => number): Fig {
  const u = (lo: number, hi: number) => lo + (hi - lo) * r();
  if (kind === 'quad') {
    const family = QUAD_FAMILIES[Math.floor(r() * QUAD_FAMILIES.length)];
    const a = u(2, 4), b = u(1.2, 3.2), sk = u(0.6, 1.6), ang = u(0, Math.PI * 2);
    let pts: Pt[];
    switch (family) {
      case 'square': pts = [[0, 0], [a, 0], [a, a], [0, a]]; break;
      case 'rectangle': pts = [[0, 0], [a, 0], [a, b], [0, b]]; break;
      case 'rhombus': { const t = u(0.5, 1.2); pts = [[0, 0], [a, 0], [a + a * Math.cos(t), a * Math.sin(t)], [a * Math.cos(t), a * Math.sin(t)]]; break; }
      case 'parallelogram': pts = [[0, 0], [a, 0], [a + sk, b], [sk, b]]; break;
      case 'kite': { const w = u(0.8, 1.8); pts = [[0, 0], [w, u(0.6, 1.4)], [0, u(2.4, 3.8)], [-w, 0]]; pts[3] = [-w, pts[1][1]]; break; }
      case 'isosceles trapezium': pts = [[0, 0], [a, 0], [a - sk / 2, b], [sk / 2, b]]; break;
      case 'trapezium': pts = [[0, 0], [a, 0], [a - u(0.2, 1), b], [u(0.3, 1.2), b]]; break;
      default: pts = [[0, 0], [a, u(-0.5, 0.5)], [a + u(-0.8, 0.8), b + u(0, 1)], [u(-0.6, 0.6), b + u(-0.5, 0.5)]];
    }
    const cx = pts.reduce((s, p) => s + p[0], 0) / 4, cy = pts.reduce((s, p) => s + p[1], 0) / 4;
    return { kind, family, pts: rot(pts.map(([x, y]) => [x - cx, y - cy]), ang, 0, 0) };
  }
  if (kind === 'tri') {
    const family = TRI_FAMILIES[Math.floor(r() * TRI_FAMILIES.length)];
    const a = u(2, 4), t = u(0.4, 2.4), ang = u(0, Math.PI * 2);
    let pts: Pt[];
    switch (family) {
      case 'equilateral': pts = [[0, a * Math.sqrt(3) / 2], [-a / 2, 0], [a / 2, 0]]; break;
      case 'isosceles': pts = [[0, 0], [a * Math.cos(Math.PI / 2 + t / 2), -a * Math.sin(Math.PI / 2 + t / 2)], [a * Math.cos(Math.PI / 2 - t / 2), -a * Math.sin(Math.PI / 2 - t / 2)]]; break;
      case 'right-angled at A': pts = [[0, 0], [a, 0], [0, u(1.2, 3.5)]]; break;
      case 'right isosceles': pts = [[0, 0], [a, 0], [0, a]]; break;
      default: pts = [[0, 0], [a, u(-0.3, 0.3)], [u(-1, 2.5), u(1.4, 3.2)]];
    }
    const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
    return { kind, family, pts: rot(pts.map(([x, y]) => [x - cx, y - cy]), ang, 0, 0) };
  }
  if (kind === 'angles') {
    const fam = ['vertical', 'equal elsewhere', 'any two'][Math.floor(r() * 3)];
    const a = Math.round(u(20, 160));
    return { kind, family: fam, a, b: fam === 'any two' ? Math.round(u(20, 160)) : a };
  }
  return { kind: 'num', family: 'number', n: 3 + Math.floor(r() * 98) };
}

export type Hunt = { tried: number; hyp: number; held: number; counter: Fig | null; first: Fig | null };

/** Test "if H then C" on `count` random figures: how many meet H, how many of those also meet C, first failure. */
export function hunt(s: Statement, converse: boolean, count: number, r: () => number): Hunt {
  const H = converse ? s.Qc : s.P, C = converse ? s.P : s.Qc;
  const out: Hunt = { tried: 0, hyp: 0, held: 0, counter: null, first: null };
  for (let i = 0; i < count; i++) {
    const f = randomFig(s.kind, r); out.tried++;
    if (!H(f)) continue;
    out.hyp++; if (!out.first) out.first = f;
    if (C(f)) out.held++; else if (!out.counter) out.counter = f;
  }
  return out;
}
