// School maths: algebraic identities as area (and volume) models (Class 8 algebraic expressions and identities;
// Class 9 polynomials). Each model is a list of labelled rectangles or blocks whose areas add up to the
// identity's two sides. No DOM.

export type Rect = { x: number; y: number; w: number; h: number; label: string; tone: number; sign?: 1 | -1 };
export type Model = { id: string; lhs: string; rhs: string; rects: Rect[]; total: number; terms: [string, number][] };

/** (a + b)² = a² + 2ab + b²: a square of side a + b cut into four pieces. */
export function sqSum(a: number, b: number): Model {
  return {
    id: 'sum', lhs: '(a + b)²', rhs: 'a² + 2ab + b²', total: (a + b) ** 2,
    rects: [{ x: 0, y: 0, w: a, h: a, label: 'a²', tone: 0 }, { x: a, y: 0, w: b, h: a, label: 'ab', tone: 1 }, { x: 0, y: a, w: a, h: b, label: 'ab', tone: 1 }, { x: a, y: a, w: b, h: b, label: 'b²', tone: 2 }],
    terms: [['a²', a * a], ['2ab', 2 * a * b], ['b²', b * b]],
  };
}

/** (a − b)² = a² − 2ab + b²: from the square a², take away two a × b strips; the corner b² was taken twice. */
export function sqDiff(a: number, b: number): Model {
  const d = a - b;
  return {
    id: 'diff', lhs: '(a − b)²', rhs: 'a² − 2ab + b²', total: d * d,
    rects: [{ x: 0, y: 0, w: d, h: d, label: '(a − b)²', tone: 0 }, { x: d, y: 0, w: b, h: a, label: 'ab', tone: 1, sign: -1 }, { x: 0, y: d, w: a, h: b, label: 'ab', tone: 1, sign: -1 }, { x: d, y: d, w: b, h: b, label: 'b²', tone: 2 }],
    terms: [['a²', a * a], ['−2ab', -2 * a * b], ['b²', b * b]],
  };
}

/** (a + b)(a − b) = a² − b²: cut b² from the corner of a²; the strip that is left over moves to make a rectangle. */
export function diffSquares(a: number, b: number): Model {
  const d = a - b;
  return {
    id: 'dsq', lhs: '(a + b)(a − b)', rhs: 'a² − b²', total: (a + b) * d,
    rects: [{ x: 0, y: 0, w: a, h: d, label: 'a(a − b)', tone: 0 }, { x: a, y: 0, w: b, h: d, label: 'b(a − b)', tone: 1 }],
    terms: [['a²', a * a], ['−b²', -b * b]],
  };
}

/** (x + a)(x + b) = x² + (a + b)x + ab. */
export function xPlus(x: number, a: number, b: number): Model {
  return {
    id: 'xab', lhs: '(x + a)(x + b)', rhs: 'x² + (a + b)x + ab', total: (x + a) * (x + b),
    rects: [{ x: 0, y: 0, w: x, h: x, label: 'x²', tone: 0 }, { x: x, y: 0, w: a, h: x, label: 'ax', tone: 1 }, { x: 0, y: x, w: x, h: b, label: 'bx', tone: 1 }, { x: x, y: x, w: a, h: b, label: 'ab', tone: 2 }],
    terms: [['x²', x * x], ['(a + b)x', (a + b) * x], ['ab', a * b]],
  };
}

/** (a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca: a 3 × 3 grid of pieces. */
export function sqTriple(a: number, b: number, c: number): Model {
  const s = [a, b, c], n = ['a', 'b', 'c'], at = [0, a, a + b];
  const rects: Rect[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) rects.push({ x: at[j], y: at[i], w: s[j], h: s[i], label: i === j ? `${n[i]}²` : [n[i], n[j]].sort().join(''), tone: i === j ? i * 2 % 3 : 1 });
  return { id: 'abc', lhs: '(a + b + c)²', rhs: 'a² + b² + c² + 2ab + 2bc + 2ca', total: (a + b + c) ** 2, rects, terms: [['a²', a * a], ['b²', b * b], ['c²', c * c], ['2ab', 2 * a * b], ['2bc', 2 * b * c], ['2ca', 2 * c * a]] };
}

export type Block = { x: number; y: number; z: number; w: number; d: number; h: number; label: string; tone: number };

/** (a + b)³ = a³ + 3a²b + 3ab² + b³: a cube of side a + b cut into eight blocks (x across, y back, z up). */
export function cubeBlocks(a: number, b: number): Block[] {
  const out: Block[] = [];
  for (const [i, x, w] of [[0, 0, a], [1, a, b]] as const) for (const [j, y, d] of [[0, 0, a], [1, a, b]] as const) for (const [k, z, h] of [[0, 0, a], [1, a, b]] as const) {
    const nb = i + j + k;
    out.push({ x, y, z, w, d, h, label: nb === 0 ? 'a³' : nb === 1 ? 'a²b' : nb === 2 ? 'ab²' : 'b³', tone: nb });
  }
  return out;
}

/** Isometric projection of a point (x across, y back, z up) to the page (y down). */
export const iso = (x: number, y: number, z: number): [number, number] => [(x - y) * Math.cos(Math.PI / 6), (x + y) * 0.5 - z];

export const area = (m: Model) => m.rects.reduce((s, r) => s + (r.sign ?? 1) * r.w * r.h, 0);
export const termSum = (m: Model) => m.terms.reduce((s, [, v]) => s + v, 0);
