// Pick's theorem on a dot grid: for a simple polygon with corners on grid points, area = I + B/2 − 1, where I counts
// grid points strictly inside and B grid points on the edges. Points are counted directly (not from the formula),
// so the page can show the theorem agreeing with the shoelace area. Plain TypeScript, no DOM.

export type P = [number, number];

const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

/** Shoelace area (positive). */
export function shoelace(p: P[]): number {
  let t = 0;
  for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; t += x1 * y2 - x2 * y1; }
  return Math.abs(t) / 2;
}

/** Grid points on the edges: each edge has gcd(|dx|, |dy|) steps. */
export function boundaryCount(p: P[]): number {
  let n = 0;
  for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; n += gcd(x2 - x1, y2 - y1); }
  return n;
}

/** Is q on the segment a–b (exactly, integer points)? */
export function onSeg(q: P, a: P, b: P): boolean {
  const cross = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
  return cross === 0 && Math.min(a[0], b[0]) <= q[0] && q[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= q[1] && q[1] <= Math.max(a[1], b[1]);
}

/** Ray casting: is q strictly inside? (Call only for points not on an edge.) */
export function inside(q: P, p: P[]): boolean {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

const orient = (a: P, b: P, c: P) => Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
function segsCross(a: P, b: P, c: P, d: P): boolean {
  const o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
  if (o1 !== o2 && o3 !== o4) return true;
  return (o1 === 0 && onSeg(c, a, b)) || (o2 === 0 && onSeg(d, a, b)) || (o3 === 0 && onSeg(a, c, d)) || (o4 === 0 && onSeg(b, c, d));
}

/** A simple polygon: at least 3 corners, no repeated corner, no edges crossing or touching except neighbours at their shared corner, area > 0. */
export function problem(p: P[]): string | null {
  if (p.length < 3) return 'Tap at least three dots.';
  const keys = new Set(p.map((q) => q.join(',')));
  if (keys.size !== p.length) return 'A dot is used twice.';
  const n = p.length;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const a = p[i], b = p[(i + 1) % n], c = p[j], d = p[(j + 1) % n];
    if (j === i + 1 || (i === 0 && j === n - 1)) {
      // Neighbours share one corner; they may not fold back over each other.
      const shared = j === i + 1 ? b : a, other1 = j === i + 1 ? a : b, other2 = j === i + 1 ? d : c;
      if (orient(other1, shared, other2) === 0 && (onSeg(other1, shared, other2) || onSeg(other2, shared, other1))) return 'Two edges fold back over each other.';
      continue;
    }
    if (segsCross(a, b, c, d)) return 'Edges cross. Pick\'s theorem needs a shape whose edges don\'t cross.';
  }
  if (shoelace(p) === 0) return 'The shape has no area.';
  return null;
}

/** Count interior and boundary grid points directly, and compare Pick's area with the shoelace area. */
export function count(p: P[]): { I: number; B: number; inner: P[]; edge: P[]; pick: number; area: number } {
  const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
  const inner: P[] = [], edge: P[] = [];
  for (let x = Math.min(...xs); x <= Math.max(...xs); x++) for (let y = Math.min(...ys); y <= Math.max(...ys); y++) {
    const q: P = [x, y];
    let on = false;
    for (let i = 0; i < p.length && !on; i++) if (onSeg(q, p[i], p[(i + 1) % p.length])) on = true;
    if (on) edge.push(q); else if (inside(q, p)) inner.push(q);
  }
  return { I: inner.length, B: edge.length, inner, edge, pick: inner.length + edge.length / 2 - 1, area: shoelace(p) };
}

export const PRESETS: Record<string, P[]> = {
  rect: [[1, 1], [6, 1], [6, 4], [1, 4]],
  tri: [[1, 1], [8, 2], [3, 6]],
  ell: [[1, 1], [7, 1], [7, 3], [3, 3], [3, 7], [1, 7]],
  arrow: [[1, 3], [5, 3], [5, 1], [9, 4], [5, 7], [5, 5], [1, 5]],
};
