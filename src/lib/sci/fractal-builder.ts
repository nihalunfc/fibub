// Fractal builder (school maths, geometric themes): the Koch snowflake and the Sierpinski triangle step by step,
// with the numbers that make them strange: the snowflake's perimeter grows without end while its area stays
// below 8/5 of the first triangle; the Sierpinski triangle's area shrinks to nothing. Plain TypeScript, no DOM.

export type P = [number, number];
export const triArea = (s: number) => (Math.sqrt(3) / 4) * s * s;

/** Corners of an equilateral triangle with side s, base along the bottom, pointing up (y up). */
export const triangle = (s: number): P[] => [[0, 0], [s, 0], [s / 2, (Math.sqrt(3) / 2) * s]];

/** Koch snowflake after n steps, as a closed list of corners (no repeated last point). */
export function koch(n: number, s = 1): P[] {
  // Start pointing down so the bumps go outwards when the corners run clockwise.
  let pts: P[] = [[0, 0], [s / 2, (Math.sqrt(3) / 2) * s], [s, 0]];
  for (let k = 0; k < n; k++) {
    const next: P[] = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
      const dx = (bx - ax) / 3, dy = (by - ay) / 3;
      const p1: P = [ax + dx, ay + dy], p3: P = [ax + 2 * dx, ay + 2 * dy];
      // Turn the middle third by +60° so the bump points outwards (corners run clockwise, the outside is on the left).
      const c = 0.5, sn = Math.sqrt(3) / 2;
      const p2: P = [p1[0] + dx * c - dy * sn, p1[1] + dx * sn + dy * c];
      next.push([ax, ay], p1, p2, p3);
    }
    pts = next;
  }
  return pts;
}

/** Number of sides, side length, perimeter and area of the snowflake after n steps (first side s). */
export function kochStats(n: number, s = 1) {
  const sides = 3 * 4 ** n, side = s / 3 ** n, A0 = triArea(s);
  return { sides, side, perimeter: sides * side, area: A0 * (1 + 0.6 * (1 - (4 / 9) ** n)), limitArea: 1.6 * A0 };
}

/** Sierpinski triangle after n steps: the list of small upright triangles (bottom-left corner and side). */
export function sierpinski(n: number, s = 1): { x: number; y: number; s: number }[] {
  let list = [{ x: 0, y: 0, s }];
  for (let k = 0; k < n; k++) {
    list = list.flatMap((t) => { const h = t.s / 2; return [{ x: t.x, y: t.y, s: h }, { x: t.x + h, y: t.y, s: h }, { x: t.x + h / 2, y: t.y + (Math.sqrt(3) / 2) * h, s: h }]; });
  }
  return list;
}

/** Count, side, total perimeter of all the small triangles and the area left after n steps. */
export function sierpinskiStats(n: number, s = 1) {
  const count = 3 ** n, side = s / 2 ** n;
  return { count, side, perimeter: count * 3 * side, area: triArea(s) * (3 / 4) ** n };
}

/** Shoelace area and perimeter of a closed polygon. */
export function polygonMeasure(pts: P[]) {
  let a = 0, p = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1; p += Math.hypot(x2 - x1, y2 - y1);
  }
  return { area: Math.abs(a) / 2, perimeter: p };
}
