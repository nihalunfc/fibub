// School conic sections (Class 11 maths): standard circles, ellipses, parabolas and hyperbolas with their
// foci, directrices, eccentricity and latus rectum, points on each curve, and which conic a plane cuts from
// a double cone. Plain TypeScript, no DOM.

export type Pt = [number, number];
export type Conic = {
  kind: 'circle' | 'ellipse' | 'parabola' | 'hyperbola';
  equation: string; a: number; b: number; c: number; e: number;
  foci: Pt[]; vertices: Pt[]; directrices: { x?: number; y?: number }[]; latus: number; vertical: boolean;
  /** A point on the curve for parameter t (angle for circle/ellipse/hyperbola branch, slope-ish for parabola). */
  point: (t: number) => Pt;
};

const n = (x: number) => { const s = (Math.abs(x) < 1e-12 ? 0 : x).toFixed(3).replace(/\.?0+$/, ''); return s.replace('-', '−'); };
const sq = (x: number) => n(x * x);

/** Circle (x − h)² + (y − k)² = r². */
export function circle(h: number, k: number, r: number): Conic {
  const eq = `${h ? `(x ${h < 0 ? '+' : '−'} ${n(Math.abs(h))})²` : 'x²'} + ${k ? `(y ${k < 0 ? '+' : '−'} ${n(Math.abs(k))})²` : 'y²'} = ${sq(r)}`;
  return { kind: 'circle', equation: eq, a: r, b: r, c: 0, e: 0, foci: [[h, k]], vertices: [], directrices: [], latus: 2 * r, vertical: false, point: (t) => [h + r * Math.cos(t), k + r * Math.sin(t)] };
}
/** Ellipse x²/a² + y²/b² = 1 (major axis along x if a > b, along y if b > a). */
export function ellipse(a: number, b: number): Conic {
  const vertical = b > a, A = Math.max(a, b), B = Math.min(a, b), c = Math.sqrt(A * A - B * B), e = c / A;
  const foci: Pt[] = vertical ? [[0, c], [0, -c]] : [[c, 0], [-c, 0]];
  const vertices: Pt[] = vertical ? [[0, A], [0, -A]] : [[A, 0], [-A, 0]];
  const d = e > 0 ? A / e : Infinity;
  return { kind: 'ellipse', equation: `x²/${sq(a)} + y²/${sq(b)} = 1`, a: A, b: B, c, e, foci, vertices, directrices: e > 0 ? (vertical ? [{ y: d }, { y: -d }] : [{ x: d }, { x: -d }]) : [], latus: (2 * B * B) / A, vertical, point: (t) => [a * Math.cos(t), b * Math.sin(t)] };
}
/** Parabola with vertex at 0 and focus at distance a: y² = 4ax (opening right), or left, up, down. */
export function parabola(a: number, dir: 'right' | 'left' | 'up' | 'down'): Conic {
  const s = dir === 'right' || dir === 'up' ? 1 : -1, vertical = dir === 'up' || dir === 'down';
  const eq = vertical ? `x² = ${s < 0 ? '−' : ''}${n(4 * a)}y` : `y² = ${s < 0 ? '−' : ''}${n(4 * a)}x`;
  return { kind: 'parabola', equation: eq, a, b: NaN, c: a, e: 1, foci: [vertical ? [0, s * a] : [s * a, 0]], vertices: [[0, 0]], directrices: [vertical ? { y: -s * a } : { x: -s * a }], latus: 4 * a, vertical,
    point: (t) => { const u = 2 * a * t, v = s * a * t * t; return vertical ? [u, v] : [v, u]; } };
}
/** Hyperbola x²/a² − y²/b² = 1 (or y²/a² − x²/b² = 1 when vertical). */
export function hyperbola(a: number, b: number, vertical = false): Conic {
  const c = Math.sqrt(a * a + b * b), e = c / a, d = a / e;
  return { kind: 'hyperbola', equation: vertical ? `y²/${sq(a)} − x²/${sq(b)} = 1` : `x²/${sq(a)} − y²/${sq(b)} = 1`, a, b, c, e,
    foci: vertical ? [[0, c], [0, -c]] : [[c, 0], [-c, 0]], vertices: vertical ? [[0, a], [0, -a]] : [[a, 0], [-a, 0]],
    directrices: vertical ? [{ y: d }, { y: -d }] : [{ x: d }, { x: -d }], latus: (2 * b * b) / a, vertical,
    point: (t) => { const u = a * Math.cosh(t), v = b * Math.sinh(t); return vertical ? [v, u] : [u, v]; } };
}

export const dist = (p: Pt, q: Pt) => Math.hypot(p[0] - q[0], p[1] - q[1]);
/** Distance from p to a directrix line x = d or y = d. */
export const toLine = (p: Pt, l: { x?: number; y?: number }) => (l.x !== undefined ? Math.abs(p[0] - l.x) : Math.abs(p[1] - l.y!));

/**
 * A plane cuts a double cone whose sides make angle alpha with the axis; the plane makes angle beta with
 * the axis (degrees). beta = 90: circle; beta > alpha: ellipse; beta = alpha: parabola; beta < alpha:
 * hyperbola. The eccentricity of the cut is cos(beta) / cos(alpha).
 */
export function slice(alpha: number, beta: number): { kind: Conic['kind']; e: number } {
  const D = Math.PI / 180, e = Math.cos(beta * D) / Math.cos(alpha * D);
  const kind = Math.abs(beta - 90) < 1e-9 ? 'circle' : Math.abs(beta - alpha) < 1e-9 ? 'parabola' : beta > alpha ? 'ellipse' : 'hyperbola';
  return { kind, e: kind === 'circle' ? 0 : kind === 'parabola' ? 1 : e };
}
