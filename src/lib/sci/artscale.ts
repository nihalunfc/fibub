// Measuring an object on a photo with a scale bar in the picture: pixels to millimetres, lengths, angles and
// polygon areas, a rough click uncertainty, and simple checks for perspective (a second, crossing scale) and for
// measurements that stretch the scale too far. Plain geometry, no DOM.

export type Pt = [number, number];
export type Scale = { a: Pt; b: Pt; mm: number };

export const dist = (p: Pt, q: Pt) => Math.hypot(q[0] - p[0], q[1] - p[1]);
/** Pixels per millimetre from a scale bar of known length. */
export const pxPerMm = (s: Scale) => dist(s.a, s.b) / s.mm;

/** Length in mm of a line between two clicks. */
export const lengthMm = (p: Pt, q: Pt, s: Scale) => dist(p, q) / pxPerMm(s);

/** Angle at the middle point (vertex) between the arms to a and b, in degrees (0 to 180). Scale-free. */
export function angleDeg(a: Pt, vertex: Pt, b: Pt): number {
  const u = [a[0] - vertex[0], a[1] - vertex[1]], v = [b[0] - vertex[0], b[1] - vertex[1]];
  return (Math.atan2(Math.abs(u[0] * v[1] - u[1] * v[0]), u[0] * v[0] + u[1] * v[1]) * 180) / Math.PI;
}

/** Area of a simple polygon in px² (shoelace formula, absolute value). */
export function polygonAreaPx(pts: Pt[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += x1 * y2 - x2 * y1; }
  return Math.abs(s) / 2;
}
export const perimeterPx = (pts: Pt[]) => pts.reduce((s, p, i) => s + dist(p, pts[(i + 1) % pts.length]), 0);
export const polygonAreaMm2 = (pts: Pt[], s: Scale) => polygonAreaPx(pts) / pxPerMm(s) ** 2;

/** True when two edges of the polygon cross (the outline was clicked out of order); the area is then wrong. */
export function selfIntersects(pts: Pt[]): boolean {
  const n = pts.length;
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const hit = (p1: Pt, p2: Pt, p3: Pt, p4: Pt) => {
    const d1 = cross(p3, p4, p1), d2 = cross(p3, p4, p2), d3 = cross(p1, p2, p3), d4 = cross(p1, p2, p4);
    return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
  };
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
    if (i === 0 && j === n - 1) continue; // neighbours through the closing edge
    if (hit(pts[i], pts[(i + 1) % n], pts[j], pts[(j + 1) % n])) return true;
  }
  return false;
}

/**
 * Standard uncertainty of a length from click placement: each click is off by about `r` px along the line, at both
 * ends of the measured line and of the scale bar. Relative: √((√2·r/L)² + (√2·r/S)²), with L and S in px.
 */
export function lengthUncertaintyMm(p: Pt, q: Pt, s: Scale, r = 1): number {
  const L = dist(p, q), S = dist(s.a, s.b);
  if (!(L > 0) || !(S > 0)) return NaN;
  return (L / pxPerMm(s)) * Math.hypot((Math.SQRT2 * r) / L, (Math.SQRT2 * r) / S);
}
/** Relative uncertainty of an area from the scale bar alone (area goes with scale²): 2·√2·r/S. */
export const areaScaleRelU = (s: Scale, r = 1) => (2 * Math.SQRT2 * r) / dist(s.a, s.b);

/** Percentage difference between the pixels per mm of two scale bars (0 when the photo is square-on). */
export function scaleMismatchPct(s1: Scale, s2: Scale): number {
  const a = pxPerMm(s1), b = pxPerMm(s2);
  return (Math.abs(a - b) / ((a + b) / 2)) * 100;
}
/** Angle between two scale bars, 0 to 90 degrees. A good perspective check uses two bars at about 90°. */
export function barAngle(s1: Scale, s2: Scale): number {
  const a = Math.atan2(s1.b[1] - s1.a[1], s1.b[0] - s1.a[0]), b = Math.atan2(s2.b[1] - s2.a[1], s2.b[0] - s2.a[0]);
  let d = Math.abs(((a - b) * 180) / Math.PI) % 180; if (d > 90) d = 180 - d;
  return d;
}

/** Plain warnings for one measurement, from the shape of the photo. `diag` is the image diagonal in px. */
export function measureNotes(pts: Pt[], s: Scale, diag: number): string[] {
  const out: string[] = [], S = dist(s.a, s.b);
  let span = 0; for (const p of pts) for (const q of pts) span = Math.max(span, dist(p, q));
  if (span > 3 * S) out.push(`spans ${(span / S).toFixed(1)}× the scale bar: small clicking errors on the bar grow`);
  const mid: Pt = [(s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2];
  const c: Pt = [pts.reduce((t, p) => t + p[0], 0) / pts.length, pts.reduce((t, p) => t + p[1], 0) / pts.length];
  if (dist(mid, c) > 0.45 * diag) out.push('far from the scale bar: lens distortion and tilt matter more here');
  return out;
}

/** The made-up example "photo" (drawn by the page): a leaf-shaped point with an L-shaped scale, 8 px per mm. */
export const EXAMPLE = {
  w: 1200, h: 800,
  scale: { a: [100, 700] as Pt, b: [500, 700] as Pt, mm: 50 },
  check: { a: [100, 700] as Pt, b: [100, 500] as Pt, mm: 25 },
  outline: [[600, 120], [680, 330], [660, 560], [600, 620], [540, 560], [520, 330]] as Pt[],
  length: [[600, 120], [600, 620]] as Pt[],
  angle: [[520, 330], [600, 120], [680, 330]] as Pt[],
};
