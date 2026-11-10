// #1281 Statement and converse checker: "If P, then Q" statements from school geometry and numbers. For each
// direction we can make random examples where the "if" part holds and test the "then" part; one failure is a
// counterexample. Pure maths, no DOM.

export type Pt = [number, number];
export type Obj = { kind: 'quad'; p: Pt[] } | { kind: 'tri'; p: Pt[] } | { kind: 'num'; n: number };
export type Statement = {
  id: string; short: string; P: string; Q: string;
  genP: (r: () => number) => Obj; genQ: (r: () => number) => Obj;
  isP: (o: Obj) => boolean; isQ: (o: Obj) => boolean;
  statementTrue: boolean; converseTrue: boolean; whyS: string; whyC: string;
};

/** Small seeded random numbers (mulberry32) so tests can repeat. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const between = (r: () => number, lo: number, hi: number) => lo + (hi - lo) * r();
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const cross = (a: Pt, b: Pt) => a[0] * b[1] - a[1] * b[0];
const dot = (a: Pt, b: Pt) => a[0] * b[0] + a[1] * b[1];
const close = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const dir = (t: number): Pt => [Math.cos(t), Math.sin(t)];
const along = (o: Pt, d: Pt, s: number): Pt => [o[0] + d[0] * s, o[1] + d[1] * s];

/** Quadrilateral ABCD from its diagonals: they cross at O, AC along angle a1 and BD along a2, with lengths and splits. */
export function fromDiagonals(O: Pt, a1: number, a2: number, L1: number, L2: number, t: number, u: number): Pt[] {
  const e1 = dir(a1), e2 = dir(a2);
  return [along(O, e1, -t * L1), along(O, e2, -u * L2), along(O, e1, (1 - t) * L1), along(O, e2, (1 - u) * L2)];
}
export const sides = (p: Pt[]) => p.map((a, i) => dist(a, p[(i + 1) % p.length]));
export const diagonals = (p: Pt[]) => [dist(p[0], p[2]), dist(p[1], p[3])];
/** Interior angle at vertex i, degrees. */
export function angleAt(p: Pt[], i: number): number {
  const a = p[i], b = p[(i + p.length - 1) % p.length], c = p[(i + 1) % p.length];
  const u = sub(b, a), v = sub(c, a);
  return (Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (Math.hypot(...u) * Math.hypot(...v))))) * 180) / Math.PI;
}
const allEqual = (xs: number[], tol = 1e-6) => xs.every((x) => close(x, xs[0], tol));
export const isSquare = (p: Pt[]) => allEqual(sides(p)) && allEqual(diagonals(p));
export const isRhombus = (p: Pt[]) => allEqual(sides(p));
export const isParallelogram = (p: Pt[]) => { const [A, B, C, D] = p; const s = Math.max(...sides(p)) ** 2; return Math.abs(cross(sub(B, A), sub(C, D))) < 1e-6 * s && Math.abs(cross(sub(D, A), sub(C, B))) < 1e-6 * s; };
export const diagonalsBisect = (p: Pt[]) => { const [A, B, C, D] = p; const L = Math.max(...diagonals(p)); return Math.hypot((A[0] + C[0]) / 2 - (B[0] + D[0]) / 2, (A[1] + C[1]) / 2 - (B[1] + D[1]) / 2) < 1e-7 * L; };
export const diagonalsPerpendicular = (p: Pt[]) => { const [A, B, C, D] = p; const u = sub(C, A), v = sub(D, B); return Math.abs(dot(u, v)) < 1e-7 * Math.hypot(...u) * Math.hypot(...v); };
export const isPrime = (n: number) => { if (n < 2 || !Number.isInteger(n)) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };

const quad = (p: Pt[]): Obj => ({ kind: 'quad', p });
const tri = (p: Pt[]): Obj => ({ kind: 'tri', p });
const num = (n: number): Obj => ({ kind: 'num', n });
const P = (o: Obj) => (o.kind === 'num' ? [] : o.p);
const N = (o: Obj) => (o.kind === 'num' ? o.n : NaN);
const randAngle = (r: () => number) => between(r, 0, Math.PI);

export const STATEMENTS: Statement[] = [
  {
    id: 'square', short: 'Square and its diagonals', P: 'a quadrilateral is a square', Q: 'its diagonals are equal',
    genP: (r) => { const L = between(r, 4, 8), a = randAngle(r); return quad(fromDiagonals([0, 0], a, a + Math.PI / 2, L, L, 0.5, 0.5)); },
    genQ: (r) => { const L = between(r, 4, 8), a = randAngle(r); return quad(fromDiagonals([0, 0], a, a + between(r, 0.4, 2.7), L, L, between(r, 0.2, 0.8), between(r, 0.2, 0.8))); },
    isP: (o) => isSquare(P(o)), isQ: (o) => allEqual(diagonals(P(o))),
    statementTrue: true, converseTrue: false,
    whyS: 'A square is a rectangle, and the two diagonals of a rectangle cut it into two congruent right triangles (SAS), so they are equal.',
    whyC: 'Equal diagonals are not enough: a rectangle that is not square, or an isosceles trapezium, also has equal diagonals.',
  },
  {
    id: 'para', short: 'Parallelogram and its diagonals', P: 'a quadrilateral is a parallelogram', Q: 'its diagonals bisect each other',
    genP: (r) => { const A: Pt = [between(r, -3, 0), between(r, -3, 0)], u = along([0, 0], dir(between(r, -0.3, 0.3)), between(r, 3, 6)), v = along([0, 0], dir(between(r, 0.6, 2.4)), between(r, 2, 5)); return quad([A, [A[0] + u[0], A[1] + u[1]], [A[0] + u[0] + v[0], A[1] + u[1] + v[1]], [A[0] + v[0], A[1] + v[1]]]); },
    genQ: (r) => { const a = randAngle(r); return quad(fromDiagonals([0, 0], a, a + between(r, 0.4, 2.7), between(r, 4, 9), between(r, 3, 8), 0.5, 0.5)); },
    isP: (o) => isParallelogram(P(o)), isQ: (o) => diagonalsBisect(P(o)),
    statementTrue: true, converseTrue: true,
    whyS: 'In a parallelogram the triangles on opposite sides of the crossing point are congruent (ASA, using alternate angles), so each diagonal is cut into equal halves.',
    whyC: 'If the diagonals bisect each other, the opposite triangles are congruent (SAS with vertically opposite angles), so alternate angles are equal and opposite sides are parallel.',
  },
  {
    id: 'rhombus', short: 'Rhombus and its diagonals', P: 'a quadrilateral is a rhombus', Q: 'its diagonals are perpendicular',
    genP: (r) => { const a = randAngle(r); return quad(fromDiagonals([0, 0], a, a + Math.PI / 2, between(r, 4, 9), between(r, 3, 8), 0.5, 0.5)); },
    genQ: (r) => { const a = randAngle(r); return quad(fromDiagonals([0, 0], a, a + Math.PI / 2, between(r, 4, 9), between(r, 3, 8), between(r, 0.2, 0.8), between(r, 0.2, 0.8))); },
    isP: (o) => isRhombus(P(o)), isQ: (o) => diagonalsPerpendicular(P(o)),
    statementTrue: true, converseTrue: false,
    whyS: 'In a rhombus the diagonals bisect each other and all four sides are equal, so the four small triangles are congruent (SSS) and the angles at the centre are equal: 4 × 90°.',
    whyC: 'A kite also has perpendicular diagonals, and so does any quadrilateral whose diagonals cross at right angles off-centre. Their sides need not be equal.',
  },
  {
    id: 'iso', short: 'Isosceles triangle', P: 'two sides of a triangle are equal (CA = CB)', Q: 'the angles opposite them are equal (∠A = ∠B)',
    genP: (r) => { const s = between(r, 4, 8), m = between(r, 0.3, 1.3), b = between(r, -0.3, 0.3); const C: Pt = [0, 0]; return tri([along(C, dir(-Math.PI / 2 + b - m), s), along(C, dir(-Math.PI / 2 + b + m), s), C]); },
    genQ: (r) => { const c = between(r, 4, 8), t = between(r, 0.2, 1.4), h = (c / 2) * Math.tan(t), sk = between(r, -0.4, 0.4); const A: Pt = [0, 0], B: Pt = [c, 0]; const C: Pt = [c / 2, h]; const rot = (q: Pt): Pt => [q[0] * Math.cos(sk) - q[1] * Math.sin(sk), q[0] * Math.sin(sk) + q[1] * Math.cos(sk)]; return tri([rot(A), rot(B), rot(C)]); },
    isP: (o) => close(dist(P(o)[2], P(o)[0]), dist(P(o)[2], P(o)[1])), isQ: (o) => close(angleAt(P(o), 0), angleAt(P(o), 1)),
    statementTrue: true, converseTrue: true,
    whyS: 'Draw the bisector of ∠C. The two halves are congruent (SAS), so ∠A = ∠B.',
    whyC: 'Draw the bisector of ∠C. Now the halves have two equal angles and a shared side (AAS), so CA = CB.',
  },
  {
    id: 'pyth', short: 'Pythagoras', P: 'a triangle has a right angle at C', Q: 'a² + b² = c² (c is the side opposite C)',
    genP: (r) => { const C: Pt = [0, 0], t = randAngle(r) * 2; return tri([along(C, dir(t), between(r, 3, 8)), along(C, dir(t + Math.PI / 2), between(r, 3, 8)), C]); },
    genQ: (r) => { const a = between(r, 3, 8), b = between(r, 3, 8), c = Math.hypot(a, b); const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x)); return tri([[0, 0], [c, 0], [x, y]]); },
    isP: (o) => close(angleAt(P(o), 2), 90, 1e-7), isQ: (o) => { const [A, B, C] = P(o); return close(dist(B, C) ** 2 + dist(A, C) ** 2, dist(A, B) ** 2); },
    statementTrue: true, converseTrue: true,
    whyS: 'This is Pythagoras\' theorem: the squares on the two shorter sides fill the square on the longest side.',
    whyC: 'Build a right triangle with legs a and b. Its third side is √(a² + b²) = c, so it is congruent to yours (SSS), and your angle C is 90° too.',
  },
  {
    id: 'four', short: 'Multiples of 4', P: 'a whole number is divisible by 4', Q: 'it is even',
    genP: (r) => num(4 * Math.floor(between(r, 1, 50))), genQ: (r) => num(2 * Math.floor(between(r, 1, 100))),
    isP: (o) => N(o) % 4 === 0, isQ: (o) => N(o) % 2 === 0,
    statementTrue: true, converseTrue: false,
    whyS: 'If n = 4k then n = 2 × (2k), so n is even.',
    whyC: 'Even numbers like 6, 10 and 14 are 2 × an odd number, so they are not divisible by 4.',
  },
  {
    id: 'prime', short: 'Primes and odd numbers', P: 'a number is a prime bigger than 2', Q: 'it is odd',
    genP: (r) => { for (;;) { const n = 3 + Math.floor(between(r, 0, 197)); if (isPrime(n)) return num(n); } }, genQ: (r) => num(2 * Math.floor(between(r, 1, 100)) + 1),
    isP: (o) => isPrime(N(o)) && N(o) > 2, isQ: (o) => N(o) % 2 === 1,
    statementTrue: true, converseTrue: false,
    whyS: 'An even number bigger than 2 has 2 as a factor, so it is not prime. Every prime bigger than 2 must be odd.',
    whyC: 'Odd numbers like 9, 15 and 21 are not prime.',
  },
  {
    id: 'zero', short: 'Ends in 0', P: 'a whole number ends in 0', Q: 'it is divisible by 5',
    genP: (r) => num(10 * Math.floor(between(r, 1, 100))), genQ: (r) => num(5 * Math.floor(between(r, 1, 200))),
    isP: (o) => N(o) % 10 === 0, isQ: (o) => N(o) % 5 === 0,
    statementTrue: true, converseTrue: false,
    whyS: 'A number ending in 0 is a multiple of 10, and 10 = 2 × 5.',
    whyC: 'Multiples of 5 can end in 5, like 25 or 135.',
  },
];

export type Trial = { obj: Obj; holds: boolean };
/** Test one direction `count` times: make random examples where the "if" part is true and check the "then" part. */
export function test(s: Statement, which: 'statement' | 'converse', count: number, r: () => number): { trials: Trial[]; counter: Obj | null } {
  const trials: Trial[] = [];
  for (let i = 0; i < count; i++) {
    const obj = which === 'statement' ? s.genP(r) : s.genQ(r);
    trials.push({ obj, holds: which === 'statement' ? s.isQ(obj) : s.isP(obj) });
  }
  return { trials, counter: trials.find((t) => !t.holds)?.obj ?? null };
}

/** Plain-words description of an object, for the page. */
export function describe(o: Obj, dp = 2): string {
  const f = (x: number) => x.toFixed(dp).replace(/\.?0+$/, '');
  if (o.kind === 'num') return `n = ${o.n}`;
  if (o.kind === 'tri') { const [A, B, C] = o.p; return `sides CA = ${f(dist(C, A))}, CB = ${f(dist(C, B))}, AB = ${f(dist(A, B))}; angles A = ${f(angleAt(o.p, 0))}°, B = ${f(angleAt(o.p, 1))}°, C = ${f(angleAt(o.p, 2))}°`; }
  const s = sides(o.p), d = diagonals(o.p);
  return `sides ${s.map(f).join(', ')}; diagonals ${f(d[0])} and ${f(d[1])}; angles ${o.p.map((_, i) => `${f(angleAt(o.p, i))}°`).join(', ')}`;
}
