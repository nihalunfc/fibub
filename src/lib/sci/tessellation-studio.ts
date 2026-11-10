// Tessellations and symmetry (school maths, geometric themes): interior angles of regular polygons, which ones
// fit around a point with no gap, mixes of polygons at a vertex, and the symmetry of a pattern repeated k times
// with or without mirrors. Plain TypeScript, no DOM.

/** Interior angle of a regular n-gon in degrees: 180(n − 2)/n. */
export const interior = (n: number) => (180 * (n - 2)) / n;

/** How many regular n-gons fit around a point, and the angle left over (0 = they tile). */
export function aroundPoint(n: number): { count: number; left: number } {
  const a = interior(n), count = Math.floor(360 / a + 1e-9);
  const left = 360 - count * a;
  return { count, left: Math.abs(left) < 1e-9 ? 0 : left };
}

/** Sum of the interior angles of the polygons meeting at one vertex. */
export const vertexSum = (ns: number[]) => ns.reduce((s, n) => s + interior(n), 0);

/** 'closes' when the angles add to exactly 360°, 'gap' below, 'overlap' above. */
export function vertexFit(ns: number[]): 'closes' | 'gap' | 'overlap' {
  const s = vertexSum(ns);
  return Math.abs(s - 360) < 1e-9 ? 'closes' : s < 360 ? 'gap' : 'overlap';
}

/**
 * Every multiset of regular polygons (sides from 3 up) whose angles add to exactly 360° at a point, smallest
 * first. Up to 6 polygons can meet (six triangles), and no polygon above 42 sides can be part of one.
 */
export function vertexTypes(): number[][] {
  const out: number[][] = [];
  const go = (list: number[], from: number, sum: number) => {
    if (Math.abs(sum - 360) < 1e-9) { out.push(list); return; }
    if (sum > 360 || list.length === 6) return;
    for (let n = from; n <= 42; n++) go([...list, n], n, sum + interior(n));
  };
  go([], 3, 0);
  return out;
}

/** Symmetry of a pattern drawn once and repeated k times by turning (and mirrored too, if `mirror`). */
export const symmetry = (k: number, mirror: boolean) => ({ order: k, lines: mirror ? k : 0, angle: 360 / k });

/** Vertices of a regular n-gon with one corner at (x, y), first side along `dir` degrees, going anticlockwise. */
export function polygonAt(n: number, x: number, y: number, dir: number, side: number): [number, number][] {
  const pts: [number, number][] = [[x, y]];
  for (let i = 0; i < n - 1; i++) {
    const t = ((dir + (i * 360) / n) * Math.PI) / 180;
    const [px, py] = pts[pts.length - 1];
    pts.push([px + side * Math.cos(t), py + side * Math.sin(t)]);
  }
  return pts;
}
