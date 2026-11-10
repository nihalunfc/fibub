// School maths (Class 9, linear equations in two variables): ax + by = c, its solutions as points, the line they
// make, intercepts, the whole-number solutions in a window, and a check of any point. No DOM.

export type Eq = { a: number; b: number; c: number };

export type Kind = 'line' | 'vertical' | 'horizontal' | 'everything' | 'nothing';

export function kind({ a, b, c }: Eq): Kind {
  if (a === 0 && b === 0) return c === 0 ? 'everything' : 'nothing';
  if (b === 0) return 'vertical';
  if (a === 0) return 'horizontal';
  return 'line';
}

/** The value a·x + b·y, and whether the point solves the equation. */
export function test(e: Eq, x: number, y: number) {
  const lhs = e.a * x + e.b * y;
  return { lhs, ok: Math.abs(lhs - e.c) < 1e-9 * Math.max(1, Math.abs(e.c)) };
}

/** y for a given x (null when b = 0). */
export const yAt = (e: Eq, x: number) => (e.b === 0 ? null : (e.c - e.a * x) / e.b);
/** x for a given y (null when a = 0). */
export const xAt = (e: Eq, y: number) => (e.a === 0 ? null : (e.c - e.b * y) / e.a);

/** Where the line crosses the axes (null if it is parallel to that axis or is the axis... handled by kind). */
export function intercepts(e: Eq) {
  return { x: xAt(e, 0), y: yAt(e, 0) };
}

/** Every whole-number solution with −R ≤ x, y ≤ R. */
export function wholeSolutions(e: Eq, R = 10): [number, number][] {
  const out: [number, number][] = [];
  for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) if (e.a * x + e.b * y === e.c) out.push([x, y]);
  return out;
}

/** Text of the equation, e.g. "2x + 3y = 12", "x − y = 0", "y = 4". */
export function eqText({ a, b, c }: Eq): string {
  const term = (k: number, v: string, first: boolean) => {
    if (k === 0) return '';
    const s = k < 0 ? (first ? '−' : ' − ') : first ? '' : ' + ';
    const m = Math.abs(k) === 1 ? '' : String(Math.abs(k));
    return s + m + v;
  };
  const left = (term(a, 'x', true) + term(b, 'y', a === 0)) || '0';
  return `${left} = ${String(c).replace('-', '−')}`;
}

/** The two points where the line leaves the square −R..R (for drawing), or null. */
export function clip(e: Eq, R: number): [[number, number], [number, number]] | null {
  const k = kind(e);
  if (k === 'vertical') { const x = e.c / e.a; return Math.abs(x) <= R ? [[x, -R], [x, R]] : null; }
  if (k === 'horizontal') { const y = e.c / e.b; return Math.abs(y) <= R ? [[-R, y], [R, y]] : null; }
  if (k !== 'line') return null;
  const pts: [number, number][] = [];
  for (const x of [-R, R]) { const y = yAt(e, x)!; if (Math.abs(y) <= R + 1e-9) pts.push([x, y]); }
  for (const y of [-R, R]) { const x = xAt(e, y)!; if (Math.abs(x) <= R + 1e-9) pts.push([x, y]); }
  if (pts.length < 2) return null;
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  return [pts[0], pts.at(-1)!];
}
