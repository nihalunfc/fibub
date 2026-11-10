// School maths: the area of a plot of land with straight sides (Class 9 perimeter and area, Class 11
// coordinates). The plot is split into triangles (ear clipping, so dents are fine), each triangle's area found by
// Heron's formula from its three sides, and the total checked against the shoelace (surveyor's) formula. No DOM.
import { heron } from './heron-school.ts';

export type Pt = [number, number];
const len = (p: Pt, q: Pt) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

/** Signed shoelace area (positive when the corners go anticlockwise in maths axes). */
export function shoelaceSigned(p: Pt[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; s += x1 * y2 - x2 * y1; }
  return s / 2;
}
export const shoelace = (p: Pt[]) => Math.abs(shoelaceSigned(p));
export const perimeter = (p: Pt[]) => p.reduce((t, q, i) => t + len(q, p[(i + 1) % p.length]), 0);

function segCross(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}
/** True when no two non-neighbouring sides cross and no corner repeats. */
export function isSimple(p: Pt[]): boolean {
  const n = p.length;
  if (n < 3) return false;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (len(p[i], p[j]) < 1e-9) return false;
    if (j === i + 1 || (i === 0 && j === n - 1)) continue;
    if (segCross(p[i], p[(i + 1) % n], p[j], p[(j + 1) % n])) return false;
  }
  return Math.abs(shoelaceSigned(p)) > 1e-9;
}

/** Split a simple polygon into n − 2 triangles (corner indices), by ear clipping. */
export function triangulate(p: Pt[]): [number, number, number][] {
  const idx = p.map((_, i) => i), out: [number, number, number][] = [];
  const sgn = Math.sign(shoelaceSigned(p)) || 1;
  const inside = (q: Pt, a: Pt, b: Pt, c: Pt) => { const s1 = cross(a, b, q) * sgn, s2 = cross(b, c, q) * sgn, s3 = cross(c, a, q) * sgn; return s1 >= -1e-12 && s2 >= -1e-12 && s3 >= -1e-12; };
  let guard = 0;
  while (idx.length > 3 && guard++ < 1000) {
    let cut = false;
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length];
      if (cross(p[i0], p[i1], p[i2]) * sgn <= 1e-12) continue; // reflex or flat corner
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(p[j], p[i0], p[i1], p[i2]))) continue;
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break;
    }
    if (!cut) break;
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]]);
  return out;
}

export type TriArea = { tri: [number, number, number]; sides: [number, number, number]; s: number; area: number };
/** Each triangle's sides and Heron area. */
export function triangleAreas(p: Pt[]): TriArea[] {
  return triangulate(p).map((t) => {
    const sides: [number, number, number] = [len(p[t[0]], p[t[1]]), len(p[t[1]], p[t[2]]), len(p[t[2]], p[t[0]])];
    const h = heron(...sides);
    return { tri: t, sides, s: h.s, area: Number.isFinite(h.area) ? h.area : 0 };
  });
}
