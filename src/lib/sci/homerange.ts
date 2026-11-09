// Animal home ranges from GPS collar fixes (plain maths, no DOM): projection to local metres, minimum convex
// polygons (100 % and a percentage of fixes nearest the centre), kernel density home ranges with a bivariate
// normal kernel and the reference bandwidth (Worton 1989), and step lengths and turning angles.

export type Fix = { t: number; lat: number; lon: number };
export type XY = { x: number; y: number };

const A = 6378137, F = 1 / 298.257223563, E2 = F * (2 - F);
/**
 * Fixes to metres east (x) and north (y) of their mean position, using the WGS84 ellipsoid's radii of
 * curvature at the mean latitude (a local tangent-plane approximation; errors stay well under 0.1 % across
 * a few tens of kilometres).
 */
export function project(fixes: { lat: number; lon: number }[]): { pts: XY[]; lat0: number; lon0: number } {
  const lat0 = fixes.reduce((s, f) => s + f.lat, 0) / fixes.length, lon0 = fixes.reduce((s, f) => s + f.lon, 0) / fixes.length;
  const p = (lat0 * Math.PI) / 180, w = Math.sqrt(1 - E2 * Math.sin(p) ** 2);
  const N = A / w, M = (A * (1 - E2)) / w ** 3, r = Math.PI / 180;
  return { pts: fixes.map((f) => ({ x: N * Math.cos(p) * (f.lon - lon0) * r, y: M * (f.lat - lat0) * r })), lat0, lon0 };
}

/** Convex hull (Andrew's monotone chain), anticlockwise, without repeating the first point. */
export function hull(pts: XY[]): XY[] {
  const s = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  if (s.length < 3) return s;
  const cross = (o: XY, a: XY, b: XY) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo: XY[] = [], hi: XY[] = [];
  for (const p of s) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = s.length - 1; i >= 0; i--) { const p = s[i]; while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  return lo.slice(0, -1).concat(hi.slice(0, -1));
}
export function area(poly: XY[]): number {
  let s = 0;
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; s += a.x * b.y - b.x * a.y; }
  return Math.abs(s) / 2;
}
/** Linear-interpolation quantile (R type 7) of an unsorted list. */
export function quantile(v: number[], p: number): number {
  const s = [...v].sort((a, b) => a - b), h = (s.length - 1) * p, i = Math.floor(h);
  return i + 1 < s.length ? s[i] + (h - i) * (s[i + 1] - s[i]) : s[i];
}
/**
 * Minimum convex polygon around the `pct` % of fixes nearest the mean centre: fixes farther than the pct-th
 * percentile of distances to the centre are left out (as adehabitatHR's mcp() does).
 */
export function mcp(pts: XY[], pct = 100): { poly: XY[]; area: number; used: number } {
  let use = pts;
  if (pct < 100) {
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length, cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const d = pts.map((p) => Math.hypot(p.x - cx, p.y - cy)), lim = quantile(d, pct / 100);
    use = pts.filter((_, i) => d[i] <= lim + 1e-9 * Math.max(1, lim));
  }
  const poly = hull(use);
  return { poly, area: area(poly), used: use.length };
}

/** Reference bandwidth h_ref = sqrt((var x + var y) / 2) × n^(−1/6) (Worton 1989; adehabitatHR "href"). */
export function href(pts: XY[]): number {
  const n = pts.length;
  if (n < 2) return NaN;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n, my = pts.reduce((s, p) => s + p.y, 0) / n;
  const vx = pts.reduce((s, p) => s + (p.x - mx) ** 2, 0) / (n - 1), vy = pts.reduce((s, p) => s + (p.y - my) ** 2, 0) / (n - 1);
  return Math.sqrt((vx + vy) / 2) * n ** (-1 / 6);
}

export type KDE = { x0: number; y0: number; cell: number; nx: number; ny: number; dens: Float64Array; h: number };
/**
 * Fixed kernel density on a square grid: the sum of bivariate normal kernels with sd h, one per fix, scaled
 * to integrate to 1. The grid covers the fixes plus `pad` × h on every side, with `cells` cells along its
 * longer side.
 */
export function kde(pts: XY[], h: number, cells = 200, pad = 4): KDE {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of pts) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  x0 -= pad * h; x1 += pad * h; y0 -= pad * h; y1 += pad * h;
  const cell = Math.max(x1 - x0, y1 - y0) / cells;
  const nx = Math.ceil((x1 - x0) / cell), ny = Math.ceil((y1 - y0) / cell);
  const dens = new Float64Array(nx * ny), wx = new Float64Array(nx), wy = new Float64Array(ny), k = 1 / (2 * h * h);
  for (const p of pts) {
    for (let i = 0; i < nx; i++) { const d = x0 + (i + 0.5) * cell - p.x; wx[i] = Math.exp(-d * d * k); }
    for (let j = 0; j < ny; j++) { const d = y0 + (j + 0.5) * cell - p.y; wy[j] = Math.exp(-d * d * k); }
    for (let j = 0; j < ny; j++) { const a = wy[j]; if (a < 1e-300) continue; const o = j * nx; for (let i = 0; i < nx; i++) dens[o + i] += a * wx[i]; }
  }
  const norm = 1 / (2 * Math.PI * h * h * pts.length);
  for (let i = 0; i < dens.length; i++) dens[i] *= norm;
  return { x0, y0, cell, nx, ny, dens, h };
}
/**
 * The smallest area holding `pct` % of the density (the pct % isopleth home range): cells are taken from
 * the densest down until their share of the grid's total reaches pct %. Returns the area and the density
 * at the edge (cells at or above it are inside).
 */
export function isopleth(k: KDE, pct: number): { area: number; level: number; cells: number } {
  const s = Float64Array.from(k.dens).sort().reverse();
  let tot = 0;
  for (const v of s) tot += v;
  const goal = (tot * pct) / 100;
  let c = 0, i = 0;
  for (; i < s.length; i++) { c += s[i]; if (c >= goal) break; }
  return { area: (i + 1) * k.cell * k.cell, level: s[Math.min(i, s.length - 1)], cells: i + 1 };
}

export type Step = { from: number; len: number; dt: number; speed: number; heading: number; turn: number };
/**
 * Steps between consecutive fixes (in the order given): length (m), time between fixes (s, NaN if unknown),
 * speed (m/s), compass heading (degrees from north) and turning angle (change of heading, −180 to 180;
 * NaN when this or the previous step has no length).
 */
export function steps(pts: XY[], t: number[]): Step[] {
  const out: Step[] = [];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x, dy = pts[i].y - pts[i - 1].y, len = Math.hypot(dx, dy);
    const dt = (t[i] - t[i - 1]) / 1000, heading = len > 0 ? ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360 : NaN;
    const prev = out[out.length - 1];
    let turn = NaN;
    if (prev && Number.isFinite(prev.heading) && Number.isFinite(heading)) { turn = heading - prev.heading; while (turn > 180) turn -= 360; while (turn <= -180) turn += 360; }
    out.push({ from: i - 1, len, dt, speed: dt > 0 ? len / dt : NaN, heading, turn });
  }
  return out;
}
/** Mean resultant length of angles in degrees: 1 = always the same, 0 = no preferred direction. */
export function resultant(deg: number[]): { r: number; mean: number } {
  const a = deg.filter(Number.isFinite);
  if (!a.length) return { r: NaN, mean: NaN };
  const c = a.reduce((s, d) => s + Math.cos((d * Math.PI) / 180), 0) / a.length, s = a.reduce((s2, d) => s2 + Math.sin((d * Math.PI) / 180), 0) / a.length;
  return { r: Math.hypot(c, s), mean: (Math.atan2(s, c) * 180) / Math.PI };
}

/** A collar time stamp: "2026-05-01 06:00[:00][Z]" (taken as UTC when no zone is given) or anything Date.parse reads. ms or NaN. */
export function readTime(s: string): number {
  const t = s.trim(), m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?)?\s*(Z|UTC)?$/i);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), 0) + 1000 * +(m[6] ?? 0);
  const v = Date.parse(t);
  return Number.isFinite(v) ? v : NaN;
}
