// Particle size from a micrograph. No DOM. Threshold, fill holes, connected components, an optional watershed on the
// distance map to split touching particles, then per-particle measures: area, equivalent circle diameter, perimeter
// (scikit-image's 4-neighbour weighted estimate), circularity 4πA/P², Feret maximum and minimum (calipers of the
// convex hull of the pixel outline), ellipse axes from the second moments and their ratio, and whether a particle
// touches the edge of the area. D10, D50 and D90 of the diameters, by number or by area.
import { label, fillHoles, edt, distPeaks, watershed, threshold, rng, gauss, drawBar, type Rect } from './micro.ts';

export type Particle = {
  id: number; area: number; cx: number; cy: number; d: number; perim: number; circ: number;
  feretMax: number; feretMin: number; feretAngle: number; major: number; minor: number; ar: number;
  x0: number; y0: number; x1: number; y1: number; edge: boolean;
};

/** Binary mask of particles inside the area: grey above t (bright particles) or at or below it (dark), holes filled
 *  if asked, specks under minArea pixels removed. */
export function particleMask(g: ArrayLike<number>, w: number, h: number, R: Rect, t: number, dark: boolean, fill: boolean, minArea = 0): Uint8Array {
  let m = threshold(g, w, h, t, dark, R);
  if (fill) { m = fillHoles(m, w, h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x < R.x0 || x >= R.x1 || y < R.y0 || y >= R.y1) m[y * w + x] = 0; }
  if (minArea > 1) {
    const { lab, n } = label(m, w, h, 8), a = new Int32Array(n + 1);
    for (let i = 0; i < lab.length; i++) a[lab[i]]++;
    for (let i = 0; i < lab.length; i++) if (lab[i] && a[lab[i]] < minArea) m[i] = 0;
  }
  return m;
}

/** Labels of the particles: 8-connected components, or with split > 0 a watershed of the distance map from
 *  markers at its peaks that stand at least `split` pixels above the saddle to a neighbour (h-maxima). */
export function particleLabels(m: Uint8Array, w: number, h: number, split = 0): { lab: Int32Array; n: number } {
  if (!(split > 0)) return label(m, w, h, 8);
  const d = edt(m, w, h), { mk, n } = distPeaks(d, m, w, h, split), neg = new Float32Array(d.length);
  for (let i = 0; i < d.length; i++) neg[i] = -d[i];
  const ws = watershed(neg, mk, m, w, h);
  // Any part a marker could not reach (none in practice) keeps its own label.
  const rest = new Uint8Array(m.length); let any = false;
  for (let i = 0; i < m.length; i++) if (m[i] && !ws[i]) { rest[i] = 1; any = true; }
  if (!any) return { lab: ws, n };
  const r = label(rest, w, h, 8);
  for (let i = 0; i < m.length; i++) if (r.lab[i]) ws[i] = n + r.lab[i];
  return { lab: ws, n: n + r.n };
}

/** Convex hull (Andrew's monotone chain), counter-clockwise, no repeated end point. */
export function hull(pts: [number, number][]): [number, number][] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [], up: [number, number][] = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  lo.pop(); up.pop();
  return lo.concat(up);
}

/** Feret (caliper) diameters of a convex polygon: the largest distance between two vertices, its angle (degrees,
 *  0 = along x, counter-clockwise with y up), and the smallest width over all directions (rotating calipers: the
 *  minimum is always found with one side of the polygon flat on a caliper). */
export function feret(H: [number, number][]): { max: number; min: number; angle: number } {
  const n = H.length;
  if (n === 0) return { max: 0, min: 0, angle: 0 };
  let max = 0, angle = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const d = Math.hypot(H[j][0] - H[i][0], H[j][1] - H[i][1]); if (d > max) { max = d; angle = (Math.atan2(-(H[j][1] - H[i][1]), H[j][0] - H[i][0]) * 180) / Math.PI; } }
  if (angle < 0) angle += 180; if (angle >= 180) angle -= 180;
  let min = Infinity;
  if (n < 3) min = 0;
  else for (let i = 0; i < n; i++) {
    const a = H[i], b = H[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (!L) continue;
    let far = 0; for (const p of H) { const dd = Math.abs((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) / L; if (dd > far) far = dd; }
    if (far < min) min = far;
  }
  return { max, min, angle };
}

const W8 = (() => { const w = new Float64Array(50); [5, 7, 15, 17, 25, 27].forEach((i) => (w[i] = 1)); [21, 33].forEach((i) => (w[i] = Math.SQRT2)); [13, 23].forEach((i) => (w[i] = (1 + Math.SQRT2) / 2)); return w; })();

/** Measures every labelled particle. Lengths in pixels (multiply by the pixel size), areas in pixels². */
export function measure(lab: Int32Array, n: number, w: number, h: number, R: Rect): Particle[] {
  const A = new Float64Array(n + 1), sx = new Float64Array(n + 1), sy = new Float64Array(n + 1), sxx = new Float64Array(n + 1), syy = new Float64Array(n + 1), sxy = new Float64Array(n + 1);
  const bx0 = new Int32Array(n + 1).fill(w), by0 = new Int32Array(n + 1).fill(h), bx1 = new Int32Array(n + 1).fill(-1), by1 = new Int32Array(n + 1).fill(-1), edge = new Uint8Array(n + 1);
  const per = new Float64Array(n + 1), pts: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : lab[y * w + x]);
  const border = (x: number, y: number, l: number) => at(x, y) === l && (at(x - 1, y) !== l || at(x + 1, y) !== l || at(x, y - 1) !== l || at(x, y + 1) !== l);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const l = lab[y * w + x]; if (!l) continue;
    A[l]++; sx[l] += x; sy[l] += y; sxx[l] += x * x; syy[l] += y * y; sxy[l] += x * y;
    if (x < bx0[l]) bx0[l] = x; if (x > bx1[l]) bx1[l] = x; if (y < by0[l]) by0[l] = y; if (y > by1[l]) by1[l] = y;
    if (x <= R.x0 || y <= R.y0 || x >= R.x1 - 1 || y >= R.y1 - 1) edge[l] = 1;
    if (!border(x, y, l)) continue;
    // Perimeter as scikit-image: code = 1 + 2 × (4-neighbour border pixels) + 10 × (diagonal border pixels).
    let code = 1;
    if (border(x - 1, y, l)) code += 2; if (border(x + 1, y, l)) code += 2; if (border(x, y - 1, l)) code += 2; if (border(x, y + 1, l)) code += 2;
    if (border(x - 1, y - 1, l)) code += 10; if (border(x + 1, y - 1, l)) code += 10; if (border(x - 1, y + 1, l)) code += 10; if (border(x + 1, y + 1, l)) code += 10;
    per[l] += W8[code] ?? 0;
    // Outline points: the middle of each pixel side that faces outside the particle.
    if (at(x - 1, y) !== l) pts[l].push([x - 0.5, y]); if (at(x + 1, y) !== l) pts[l].push([x + 0.5, y]);
    if (at(x, y - 1) !== l) pts[l].push([x, y - 0.5]); if (at(x, y + 1) !== l) pts[l].push([x, y + 0.5]);
  }
  const out: Particle[] = [];
  for (let l = 1; l <= n; l++) {
    if (!A[l]) continue;
    const a = A[l], cx = sx[l] / a, cy = sy[l] / a;
    const vxx = sxx[l] / a - cx * cx, vyy = syy[l] / a - cy * cy, vxy = sxy[l] / a - cx * cy;
    const tr = (vxx + vyy) / 2, dt = Math.sqrt(Math.max(0, ((vxx - vyy) / 2) ** 2 + vxy * vxy)), l1 = tr + dt, l2 = Math.max(0, tr - dt);
    const f = feret(hull(pts[l].length ? pts[l] : [[cx, cy]]));
    const major = 4 * Math.sqrt(l1), minor = 4 * Math.sqrt(l2);
    out.push({
      id: l, area: a, cx, cy, d: Math.sqrt((4 * a) / Math.PI), perim: per[l], circ: per[l] > 0 ? (4 * Math.PI * a) / per[l] ** 2 : NaN,
      feretMax: f.max, feretMin: f.min, feretAngle: f.angle, major, minor, ar: minor > 0 ? major / minor : NaN,
      x0: bx0[l], y0: by0[l], x1: bx1[l], y1: by1[l], edge: !!edge[l],
    });
  }
  return out;
}

/** D10, D50 and D90 (or any percentiles p in 0..1). By number: linear interpolation between sorted values (as
 *  numpy.percentile). By area: each diameter weighted by its particle's area; the smallest diameter at which the
 *  running share of area reaches p. */
export function dValues(d: number[], ps: number[], areas?: number[]): number[] {
  if (!d.length) return ps.map(() => NaN);
  const idx = d.map((_, i) => i).sort((a, b) => d[a] - d[b]);
  if (!areas) return ps.map((p) => { const hh = (d.length - 1) * p, i = Math.floor(hh); return i + 1 < d.length ? d[idx[i]] + (hh - i) * (d[idx[i + 1]] - d[idx[i]]) : d[idx[d.length - 1]]; });
  const W = idx.reduce((s, i) => s + areas[i], 0);
  return ps.map((p) => { let c = 0; for (const i of idx) { c += areas[i]; if (c / W >= p - 1e-12) return d[i]; } return d[idx[idx.length - 1]]; });
}

/** Histogram counts in equal bins from lo to hi. */
export function bins(v: number[], lo: number, hi: number, n: number): number[] {
  const c = new Array(n).fill(0);
  for (const x of v) { if (!(x >= lo && x <= hi)) continue; c[Math.min(n - 1, Math.floor(((x - lo) / (hi - lo)) * n))]++; }
  return c;
}

/** A made-up micrograph of bright round particles on a dark background, sizes log-normal around d0 pixels (σ of
 *  ln d = s), some touching and some cut by the edges. Returns RGBA, the true discs and the 0/1 truth mask. */
export function exampleParticles(w: number, h: number, count: number, d0: number, s: number, seed: number, bar?: { px: number; label: string }) {
  const r = rng(seed), discs: { x: number; y: number; r: number }[] = [];
  let tries = 0;
  while (discs.length < count && tries++ < count * 200) {
    const rad = (d0 * Math.exp(s * gauss(r))) / 2, x = r() * w, y = r() * (h - 40);
    // Allow touching (a little overlap) now and then, but no particle swallowed by another.
    const ok = discs.every((q) => { const dd = Math.hypot(q.x - x, q.y - y); return dd > q.r + rad + 2 || (dd > 0.8 * (q.r + rad) && r() < 0.5); });
    if (ok) discs.push({ x, y, r: rad });
  }
  const mask = new Uint8Array(w * h), px = new Uint8ClampedArray(w * h * 4);
  for (const q of discs) for (let y = Math.max(0, Math.floor(q.y - q.r)); y <= Math.min(h - 1, Math.ceil(q.y + q.r)); y++) for (let x = Math.max(0, Math.floor(q.x - q.r)); x <= Math.min(w - 1, Math.ceil(q.x + q.r)); x++) if ((x - q.x) ** 2 + (y - q.y) ** 2 <= q.r * q.r) mask[y * w + x] = 1;
  for (let i = 0; i < w * h; i++) { const v = (mask[i] ? 205 : 45) + 10 * gauss(r); px[4 * i] = px[4 * i + 1] = px[4 * i + 2] = v; px[4 * i + 3] = 255; }
  if (bar) drawBar(px, w, h, bar.px, bar.label);
  return { px, w, h, discs, mask };
}
