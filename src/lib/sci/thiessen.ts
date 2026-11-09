// Areal rainfall from a rain gauge network by Thiessen polygons: each gauge stands for the part of the catchment that is
// closer to it than to any other gauge. Each cell is the catchment polygon clipped by the perpendicular bisectors to every
// other gauge (Sutherland–Hodgman against half-planes; the shoelace area stays right even for a concave catchment).
// Plane coordinates in any one length unit. No DOM.

export type Pt = [number, number];

/** Signed shoelace area (positive when the vertices run anticlockwise). */
export function signedArea(p: Pt[]) {
  let s = 0;
  for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; s += x1 * y2 - x2 * y1; }
  return s / 2;
}
export const area = (p: Pt[]) => Math.abs(signedArea(p));

/** Area-weighted centre of a polygon. */
export function centroid(p: Pt[]): Pt {
  let cx = 0, cy = 0, a = 0;
  for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length], c = x1 * y2 - x2 * y1; a += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c; }
  return a ? [cx / (3 * a), cy / (3 * a)] : p[0];
}

/** Keep the part of polygon p where n · x ≤ c. */
export function clipHalf(p: Pt[], n: Pt, c: number): Pt[] {
  const out: Pt[] = [], f = (q: Pt) => n[0] * q[0] + n[1] * q[1] - c;
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length], fa = f(a), fb = f(b);
    if (fa <= 0) out.push(a);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) { const t = fa / (fa - fb); out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]); }
  }
  return out;
}

/** Thiessen cell of each gauge inside the catchment, with its area and weight. Gauges at the same spot share a cell. */
export function cells(poly: Pt[], gauges: Pt[]) {
  const total = area(poly);
  const res = gauges.map((g, i) => {
    let c = poly;
    for (let j = 0; j < gauges.length && c.length; j++) {
      if (j === i) continue;
      const h = gauges[j], n: Pt = [h[0] - g[0], h[1] - g[1]];
      if (!n[0] && !n[1]) { if (j < i) c = []; continue; } // duplicate position: the first one keeps the cell
      c = clipHalf(c, n, (h[0] * h[0] + h[1] * h[1] - g[0] * g[0] - g[1] * g[1]) / 2);
    }
    const a = c.length >= 3 ? area(c) : 0;
    return { poly: c, area: a, weight: total ? a / total : 0 };
  });
  return { cells: res, total };
}

/** Is the point inside the polygon (ray casting)? */
export function inside(p: Pt[], q: Pt) {
  let r = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) r = !r;
  }
  return r;
}

/** Does the polygon cross itself? (any two non-adjacent edges intersect) */
export function selfCrossing(p: Pt[]) {
  const n = p.length, cross = (a: Pt, b: Pt, c: Pt) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (j === i + 1 || (i === 0 && j === n - 1)) continue;
    const a = p[i], b = p[(i + 1) % n], c = p[j], d = p[(j + 1) % n];
    if (cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0) return true;
  }
  return false;
}

/** Longitude/latitude (degrees) to km on a local flat projection centred on the mean point. */
export function lonLatToKm(pts: Pt[], centre?: Pt): { pts: Pt[]; centre: Pt } {
  const c: Pt = centre ?? [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const kx = 111.32 * Math.cos((c[1] * Math.PI) / 180), ky = 110.574;
  return { pts: pts.map(([lo, la]) => [(lo - c[0]) * kx, (la - c[1]) * ky]), centre: c };
}

/** Areal mean for one set of readings: gauges with no reading (NaN) are left out and the cells redrawn. */
export function arealMean(poly: Pt[], gauges: Pt[], values: number[]) {
  const use = values.map((v, i) => (Number.isFinite(v) ? i : -1)).filter((i) => i >= 0);
  const { cells: cs, total } = cells(poly, use.map((i) => gauges[i]));
  const weights = new Array(gauges.length).fill(0);
  use.forEach((g, k) => { weights[g] = cs[k].weight; });
  const mean = use.reduce((s, g) => s + weights[g] * values[g], 0), arith = use.reduce((s, g) => s + values[g], 0) / (use.length || 1);
  const inUse = use.filter((g) => inside(poly, gauges[g]));
  const arithIn = inUse.length ? inUse.reduce((s, g) => s + values[g], 0) / inUse.length : NaN;
  return { mean, arith, arithIn, weights, used: use.length, total, cells: cs, useIdx: use };
}
