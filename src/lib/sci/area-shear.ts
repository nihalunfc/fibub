// Shear and area: a parallelogram, triangle or trapezium on a unit grid whose top can slide sideways (a shear).
// The area depends only on the base(s) and the height. Also the "cut and slide" pieces that turn a parallelogram
// into a rectangle. Plain TypeScript, no DOM.

export type Pt = [number, number];
export type Shape = 'para' | 'tri' | 'trap';

/** Corners of the shape: base from (0, 0) to (b, 0); the top starts at x = s, height h; `a` is the trapezium's top. */
export function corners(shape: Shape, b: number, h: number, s: number, a = 0): Pt[] {
  if (shape === 'tri') return [[0, 0], [b, 0], [s, h]];
  if (shape === 'trap') return [[0, 0], [b, 0], [s + a, h], [s, h]];
  return [[0, 0], [b, 0], [b + s, h], [s, h]];
}

/** Shoelace area of a polygon (positive). */
export function polyArea(p: Pt[]): number {
  let t = 0;
  for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; t += x1 * y2 - x2 * y1; }
  return Math.abs(t) / 2;
}

/** The formula's area. */
export const formulaArea = (shape: Shape, b: number, h: number, a = 0) => (shape === 'para' ? b * h : shape === 'tri' ? 0.5 * b * h : 0.5 * (a + b) * h);

/** Length of a slanted side from (0,0) to (s,h). */
export const slant = (s: number, h: number) => Math.hypot(s, h);

/**
 * Cut and slide for a parallelogram: the triangle cut off one end moves along by b. `t` from 0 (not moved) to 1
 * (moved: the shape is now a b × h rectangle). Works with one cut when |s| ≤ b; returns null otherwise.
 */
export function cutSlide(b: number, h: number, s: number, t: number): { rest: Pt[]; piece: Pt[] } | null {
  if (Math.abs(s) > b + 1e-9) return null;
  const d = b * Math.max(0, Math.min(1, t));
  if (s >= 0) {
    const piece: Pt[] = [[0 + d, 0], [s + d, 0], [s + d, h]];
    return { rest: [[s, 0], [b, 0], [b + s, h], [s, h]], piece };
  }
  const piece: Pt[] = [[0 + d, 0], [0 + d, h], [s + d, h]];
  return { rest: [[0, 0], [b, 0], [b + s, h], [0, h]], piece };
}

/** The second copy (turned half a turn) that makes a triangle or trapezium into a parallelogram. */
export function copyFor(shape: Shape, b: number, h: number, s: number, a = 0): Pt[] {
  if (shape === 'tri') return [[b, 0], [b + s, h], [s, h]];
  if (shape === 'trap') return [[b, 0], [b + a, 0], [s + a + b, h], [s + a, h]];
  return [];
}
