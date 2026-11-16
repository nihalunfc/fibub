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

/** The equation shapes a student can type numbers into (Solve my numbers). */
export type ConicForm = 'circle-general' | 'ellipse' | 'hyperbola-x' | 'hyperbola-y' | 'parabola-x' | 'parabola-y';
export type ConicSolution = { conic?: Conic; sentence: string; steps: string[]; tip: string; error?: string };

const g3 = (x: number) => n(x);
const pt = (p: Pt) => `(${g3(p[0])}, ${g3(p[1])})`;

/**
 * Solve a conic from the numbers in its equation, with the working an exam expects.
 *   circle-general: x² + y² + Dx + Ey + F = 0   v = [D, E, F]
 *   ellipse: x²/A + y²/B = 1                     v = [A, B]  (A, B are the denominators, i.e. a² and b²)
 *   hyperbola-x: x²/A − y²/B = 1, hyperbola-y: y²/A − x²/B = 1   v = [A, B]
 *   parabola-x: y² = Lx, parabola-y: x² = Ly     v = [L]  (negative L opens left or down)
 */
export function solveConic(form: ConicForm, v: number[]): ConicSolution {
  const bad = (error: string): ConicSolution => ({ sentence: error, steps: [], tip: '', error });
  if (v.some((x) => !Number.isFinite(x))) return bad('Type a number in every box to see the answer.');
  if (form === 'circle-general') {
    const [D, E, F] = v, h = -D / 2, k = -E / 2, r2 = h * h + k * k - F;
    const steps = [`Compare with x² + y² + 2gx + 2fy + c = 0: g = D/2 = ${g3(D / 2)}, f = E/2 = ${g3(E / 2)}, c = ${g3(F)}.`, `Centre = (−g, −f) = ${pt([h, k])}.`, `r² = g² + f² − c = ${g3(h * h)} + ${g3(k * k)} − (${g3(F)}) = ${g3(r2)}.`];
    if (r2 < -1e-12) return { sentence: `r² = ${g3(r2)} is negative, so no real circle has this equation.`, steps, tip: 'A circle needs g² + f² − c to be positive.', error: 'negative' };
    if (Math.abs(r2) <= 1e-12) return { sentence: `r² = 0, so this is just the single point ${pt([h, k])} (a point-circle).`, steps, tip: 'A radius of 0 is a point, not a circle you can draw.', error: 'point' };
    const r = Math.sqrt(r2);
    return { conic: circle(h, k, r), sentence: `Circle with centre ${pt([h, k])} and radius ${g3(r)}.`, steps: [...steps, `r = √${g3(r2)} = ${g3(r)}.`], tip: 'Common mistake: the centre is (−D/2, −E/2), so the signs flip.' };
  }
  if (form === 'parabola-x' || form === 'parabola-y') {
    const L = v[0];
    if (L === 0) return bad('L = 0 gives a straight line, not a parabola. Type a number that is not 0.');
    const a = Math.abs(L) / 4, dir = form === 'parabola-x' ? (L > 0 ? 'right' : 'left') : (L > 0 ? 'up' : 'down'), C = parabola(a, dir as 'right');
    const open = { right: 'to the right', left: 'to the left', up: 'upwards', down: 'downwards' }[dir];
    const sq2 = form === 'parabola-x' ? 'y²' : 'x²', lin = form === 'parabola-x' ? 'x' : 'y';
    return { conic: C, sentence: `Parabola opening ${open}: a = ${g3(a)}, focus ${pt(C.foci[0])}, directrix ${C.directrices[0].x !== undefined ? 'x' : 'y'} = ${g3(C.directrices[0].x ?? C.directrices[0].y!)}, latus rectum ${g3(4 * a)}.`,
      steps: [`Compare ${sq2} = ${g3(L)}${lin} with ${sq2} = ±4a${lin}: 4a = ${g3(Math.abs(L))}, so a = ${g3(a)}.`, `The sign of L (${L > 0 ? '+' : '−'}) shows it opens ${open}.`, `Focus ${pt(C.foci[0])}; directrix is the line ${C.directrices[0].x !== undefined ? 'x' : 'y'} = ${g3(C.directrices[0].x ?? C.directrices[0].y!)}; latus rectum = 4a = ${g3(4 * a)}.`],
      tip: 'Common mistake: the number in front of x is 4a, not a. Divide by 4 first.' };
  }
  const [A, B] = v;
  if (A <= 0 || B <= 0) return bad('Both denominators must be positive numbers (they are a² and b²).');
  const a = Math.sqrt(A), b = Math.sqrt(B);
  if (form === 'ellipse') {
    const C = ellipse(a, b), M = Math.max(A, B), m = Math.min(A, B), axis = B > A ? 'y' : 'x';
    const steps = [`Denominators: ${g3(A)} under x², ${g3(B)} under y². The larger (${g3(M)}) is a², so the major axis lies along the ${axis}-axis.`, `a = √${g3(M)} = ${g3(C.a)}, b = √${g3(m)} = ${g3(C.b)}.`];
    if (C.e === 0) return { conic: C, sentence: `Both denominators are ${g3(A)}: this is a circle of radius ${g3(a)}, centre (0, 0).`, steps: [...steps, 'a = b, so c = 0 and e = 0.'], tip: 'x²/r² + y²/r² = 1 is the circle x² + y² = r².' };
    return { conic: C, sentence: `Ellipse with a = ${g3(C.a)}, b = ${g3(C.b)}, e = ${g3(C.e)}, foci ${C.foci.map(pt).join(' and ')}, latus rectum ${g3(C.latus)}.`,
      steps: [...steps, `c² = a² − b² = ${g3(M)} − ${g3(m)} = ${g3(M - m)}, so c = ${g3(C.c)}.`, `e = c/a = ${g3(C.c)}/${g3(C.a)} = ${g3(C.e)}; foci ${C.foci.map(pt).join(' and ')}.`, `Latus rectum = 2b²/a = 2 × ${g3(m)} / ${g3(C.a)} = ${g3(C.latus)}; directrices ${C.directrices.map((d) => `${d.x !== undefined ? 'x' : 'y'} = ${g3(d.x ?? d.y!)}`).join(', ')}.`],
      tip: 'Common mistake: the denominators are a² and b², so take the square root before using a and b.' };
  }
  const vert = form === 'hyperbola-y', C = hyperbola(a, b, vert);
  return { conic: C, sentence: `Hyperbola with a = ${g3(a)}, b = ${g3(b)}, e = ${g3(C.e)}, foci ${C.foci.map(pt).join(' and ')}, latus rectum ${g3(C.latus)}.`,
    steps: [`The ${vert ? 'y²' : 'x²'} term is positive, so the branches open ${vert ? 'up and down' : 'left and right'}, and a² = ${g3(A)}, b² = ${g3(B)}.`, `a = ${g3(a)}, b = ${g3(b)}; c² = a² + b² = ${g3(A)} + ${g3(B)} = ${g3(A + B)}, so c = ${g3(C.c)}.`, `e = c/a = ${g3(C.c)}/${g3(a)} = ${g3(C.e)}; foci ${C.foci.map(pt).join(' and ')}.`, `Latus rectum = 2b²/a = 2 × ${g3(B)} / ${g3(a)} = ${g3(C.latus)}; asymptotes y = ±${g3(vert ? a / b : b / a)}x.`],
    tip: 'Common mistake: for a hyperbola c² = a² + b² (plus), for an ellipse c² = a² − b² (minus).' };
}
