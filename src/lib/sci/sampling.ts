// Field sampling planner: how many samples (to estimate a mean, or to compare a mean with an action level), how far
// apart grid nodes must be to hit a circular hot spot (Gilbert's geometry, exact for circles), and sample points on a
// polygon by simple random, systematic grid (square or triangular, random start) or stratified random (one random point
// per grid cell). Plane coordinates in one length unit. No DOM.
import { normInv, tInv } from './stats.ts';
import { area, inside, type Pt } from './thiessen.ts';
import { rng } from './floodfreq.ts';

export type Grid = 'square' | 'tri';

/** Area of the lens where two circles of radius r, d apart, overlap. */
export const lens = (r: number, d: number) => (d >= 2 * r ? 0 : 2 * r * r * Math.acos(d / (2 * r)) - (d / 2) * Math.sqrt(4 * r * r - d * d));

/** Area of the plane each grid node stands for. */
export const cellArea = (G: number, grid: Grid) => (grid === 'square' ? G * G : (Math.sqrt(3) / 2) * G * G);

/** Chance that a circular hot spot of radius r, dropped at random, contains at least one grid node at spacing G. */
export function hotspotP(r: number, G: number, grid: Grid) {
  if (!(r > 0 && G > 0)) return 0;
  // Full cover once r reaches the farthest point from any node: half the square's diagonal, or the triangle's circumradius.
  if (r >= (grid === 'square' ? G / Math.SQRT2 : G / Math.sqrt(3))) return 1;
  // Below that, at most two discs overlap anywhere; each node has 4 (square) or 6 (triangular) neighbours at distance G.
  const covered = Math.PI * r * r - (grid === 'square' ? 2 : 3) * lens(r, G);
  return Math.min(1, covered / cellArea(G, grid));
}

/** Widest grid spacing that still hits the hot spot with probability P (bisection; P falls as spacing grows). */
export function spacingFor(r: number, P: number, grid: Grid) {
  if (P >= 1) return grid === 'square' ? r * Math.SQRT2 : r * Math.sqrt(3);
  let lo = r * 1e-6, hi = r * 1e4;
  for (let i = 0; i < 100; i++) { const m = Math.sqrt(lo * hi); if (hotspotP(r, m, grid) >= P) lo = m; else hi = m; }
  return lo;
}

/** Grid spacing that puts about n nodes on an area A. */
export const spacingForN = (A: number, n: number, grid: Grid) => Math.sqrt(A / (n * (grid === 'square' ? 1 : Math.sqrt(3) / 2)));

/** Samples to estimate the mean within ±relErr (fraction) at a confidence level, given the coefficient of variation. */
export function nForMean(cv: number, relErr: number, conf: number) {
  const a = 1 - conf;
  let n = Math.max(2, Math.ceil(((normInv(1 - a / 2) * cv) / relErr) ** 2));
  for (let i = 0; i < 100; i++) { const m = Math.max(2, Math.ceil(((tInv(1 - a / 2, n - 1) * cv) / relErr) ** 2)); if (m === n) break; n = m; }
  return n;
}

/** Samples for a one-sample t test of the mean against an action level (normal approximation plus the usual ½ z² term). */
export function nForAction(sd: number, delta: number, alpha: number, beta: number) {
  const za = normInv(1 - alpha), zb = normInv(1 - beta);
  return Math.ceil((((za + zb) * sd) / delta) ** 2 + 0.5 * za * za);
}

const bbox = (p: Pt[]) => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of p) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { x0, y0, x1, y1 }; };

/** n points uniformly at random inside the polygon (rejection from the bounding box). */
export function randomPoints(poly: Pt[], n: number, seed: number): Pt[] {
  const R = rng(seed), b = bbox(poly), out: Pt[] = [];
  for (let k = 0; out.length < n && k < n * 10000; k++) { const q: Pt = [b.x0 + R() * (b.x1 - b.x0), b.y0 + R() * (b.y1 - b.y0)]; if (inside(poly, q)) out.push(q); }
  return out;
}

/** Grid nodes inside the polygon, with the grid shifted by a random start. Triangular rows are G·√3/2 apart. */
export function gridPoints(poly: Pt[], G: number, grid: Grid, seed: number): Pt[] {
  const R = rng(seed), b = bbox(poly), dy = grid === 'square' ? G : (G * Math.sqrt(3)) / 2, ox = R() * G, oy = R() * dy, out: Pt[] = [];
  for (let j = 0, y = b.y0 + oy - dy; y <= b.y1 + dy; j++, y += dy) {
    const sx = grid === 'tri' && j % 2 ? G / 2 : 0;
    for (let x = b.x0 + ox + sx - G; x <= b.x1 + G; x += G) if (inside(poly, [x, y])) out.push([x, y]);
  }
  return out;
}

/** One random point in each square cell of a grid with a random start; points falling outside the polygon are dropped. */
export function stratifiedPoints(poly: Pt[], G: number, seed: number): Pt[] {
  const R = rng(seed), b = bbox(poly), ox = R() * G, oy = R() * G, out: Pt[] = [];
  for (let y = b.y0 + oy - G; y <= b.y1; y += G) for (let x = b.x0 + ox - G; x <= b.x1; x += G) { const q: Pt = [x + R() * G, y + R() * G]; if (inside(poly, q)) out.push(q); }
  return out;
}

export { area, inside };
