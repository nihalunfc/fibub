// Polygon angle sum (#1238): interior and turning (exterior) angles of a simple polygon, a check that the sides do
// not cross, and a split into n − 2 triangles by ear clipping (works for concave shapes too). Plain TypeScript.

export type Pt = { x: number; y: number };

/** Signed area (shoelace); positive when the corners go anticlockwise in maths axes (y up). */
export function signedArea(p: Pt[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a.x * b.y - b.x * a.y; }
  return s / 2;
}

const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

function segmentsCross(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

/** True when no two non-neighbouring sides cross and no corner sits on a straight line or on top of another. */
export function isSimple(p: Pt[]): boolean {
  const n = p.length;
  if (n < 3 || Math.abs(signedArea(p)) < 1e-9) return false;
  for (let i = 0; i < n; i++) {
    const a = p[i], b = p[(i + 1) % n];
    if (Math.hypot(a.x - b.x, a.y - b.y) < 1e-9) return false;
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (segmentsCross(a, b, p[j], p[(j + 1) % n])) return false;
    }
  }
  return true;
}

/** Interior angles in degrees (a reflex corner gives more than 180°). Assumes a simple polygon. */
export function interiorAngles(p: Pt[]): number[] {
  const n = p.length, ccw = signedArea(p) > 0;
  return p.map((b, i) => {
    const a = p[(i + n - 1) % n], c = p[(i + 1) % n];
    // Turning angle at b, signed, in (−180, 180).
    const t1 = Math.atan2(b.y - a.y, b.x - a.x), t2 = Math.atan2(c.y - b.y, c.x - b.x);
    let turn = ((t2 - t1) * 180) / Math.PI;
    while (turn <= -180) turn += 360;
    while (turn > 180) turn -= 360;
    return 180 - (ccw ? turn : -turn);
  });
}

/** Exterior (turning) angles: 180° − interior. Negative at a reflex corner. They add to 360°. */
export const exteriorAngles = (p: Pt[]) => interiorAngles(p).map((a) => 180 - a);

/** Split a simple polygon into n − 2 triangles (indices into p) by ear clipping. */
export function triangulate(p: Pt[]): [number, number, number][] {
  const ccw = signedArea(p) > 0, idx = p.map((_, i) => i), out: [number, number, number][] = [];
  const convex = (a: Pt, b: Pt, c: Pt) => (ccw ? cross(a, b, c) : -cross(a, b, c)) > 1e-12;
  const inside = (q: Pt, a: Pt, b: Pt, c: Pt) => { const s = ccw ? 1 : -1; return s * cross(a, b, q) >= 0 && s * cross(b, c, q) >= 0 && s * cross(c, a, q) >= 0; };
  let guard = 0;
  while (idx.length > 3 && guard++ < 1000) {
    let cut = false;
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length];
      if (!convex(p[i0], p[i1], p[i2])) continue;
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(p[j], p[i0], p[i1], p[i2]))) continue;
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break;
    }
    if (!cut) break;
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]]);
  return out;
}

/** Corners of a regular n-gon of radius r around (cx, cy), first corner at the top. */
export const regular = (n: number, cx: number, cy: number, r: number): Pt[] =>
  Array.from({ length: n }, (_, i) => ({ x: cx + r * Math.sin((2 * Math.PI * i) / n), y: cy - r * Math.cos((2 * Math.PI * i) / n) }));

/** Angle sum of an n-sided polygon: (n − 2) × 180°. */
export const angleSum = (n: number) => (n - 2) * 180;
