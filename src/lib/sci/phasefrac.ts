// Phase (area) fractions from a micrograph. No DOM. Pixels inside the area are put in up to 4 phases by grey-level
// thresholds (typed, Otsu or multi-level Otsu) or by the nearest of up to 4 picked colours (CIELAB distance). The area
// fraction of each phase is its share of the classified pixels. Two error estimates: a point count on a regular grid
// (binomial standard error √(P(1 − P) / N)) and the spread between fields (tiles), with a Student-t interval, in the
// manner of ASTM E562.
import { tInv } from './stats.ts';
import { rng, gauss, drawBar, type Rect } from './micro.ts';

export const OUT = 255; // outside the area
export const NONE = 254; // inside the area but matched no colour

/** Class of every pixel inside the area: the number of thresholds its grey level is above (0 = darkest phase). */
export function segmentGrey(g: ArrayLike<number>, w: number, h: number, R: Rect, ts: number[]): Uint8Array {
  const c = new Uint8Array(w * h).fill(OUT), t = [...ts].sort((a, b) => a - b);
  for (let y = R.y0; y < R.y1; y++) for (let x = R.x0; x < R.x1; x++) {
    const i = y * w + x, v = Math.round(g[i]); let k = 0;
    for (const s of t) if (v > s) k++;
    c[i] = k;
  }
  return c;
}

/** sRGB (0–255) to CIELAB (D65). */
export function lab(r: number, g: number, b: number): [number, number, number] {
  const f = (u: number) => { u /= 255; return u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4; };
  const R = f(r), G = f(g), B = f(b);
  const X = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047, Y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B, Z = (0.0193339 * R + 0.119192 * G + 0.9503041 * B) / 1.08883;
  const k = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = k(X), fy = k(Y), fz = k(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** Class of every pixel inside the area: the nearest picked colour (CIELAB ΔE*ab), or NONE when that is further than
 *  tol (Infinity: every pixel gets a phase). */
export function segmentColour(rgba: ArrayLike<number>, w: number, h: number, R: Rect, refs: [number, number, number][], tol = Infinity): Uint8Array {
  const c = new Uint8Array(w * h).fill(OUT), L = refs.map((r) => lab(r[0], r[1], r[2])), cache = new Map<number, number>();
  for (let y = R.y0; y < R.y1; y++) for (let x = R.x0; x < R.x1; x++) {
    const i = y * w + x, key = (rgba[4 * i] << 16) | (rgba[4 * i + 1] << 8) | rgba[4 * i + 2];
    let k = cache.get(key);
    if (k === undefined) {
      const p = lab(rgba[4 * i], rgba[4 * i + 1], rgba[4 * i + 2]); let best = Infinity; k = NONE;
      L.forEach((q, j) => { const d = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); if (d < best) { best = d; k = j; } });
      if (best > tol) k = NONE;
      cache.set(key, k);
    }
    c[i] = k;
  }
  return c;
}

/** Pixel counts and area fractions of phases 0..k−1 among the classified pixels (unmatched ones left out). */
export function fractions(c: Uint8Array, k: number) {
  const n = new Array(k).fill(0); let none = 0;
  for (let i = 0; i < c.length; i++) { const v = c[i]; if (v < k) n[v]++; else if (v === NONE) none++; }
  const total = n.reduce((s, x) => s + x, 0);
  return { n, total, none, f: n.map((x) => (total ? x / total : NaN)) };
}

/** Point count: an nx × ny grid of points at the centres of equal cells of the area. Each phase's point fraction
 *  P_P = hits / points and its binomial standard error √(P_P (1 − P_P) / N). */
export function pointCount(c: Uint8Array, w: number, R: Rect, k: number, nx: number, ny: number) {
  const hits = new Array(k).fill(0); let N = 0;
  const pts: [number, number, number][] = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = Math.floor(R.x0 + ((i + 0.5) * (R.x1 - R.x0)) / nx), y = Math.floor(R.y0 + ((j + 0.5) * (R.y1 - R.y0)) / ny), v = c[y * w + x];
    pts.push([x, y, v]);
    if (v < k) { hits[v]++; N++; }
  }
  const p = hits.map((x) => x / N);
  return { hits, N, p, se: p.map((x) => Math.sqrt((x * (1 - x)) / N)), pts };
}

/** Field-to-field spread: the area is cut into nx × ny tiles; each phase's fraction in each tile gives a mean, a
 *  standard deviation s, a Student-t interval ± t s / √n and the relative accuracy (interval ÷ mean, %). */
export function fieldStats(c: Uint8Array, w: number, R: Rect, k: number, nx: number, ny: number, conf = 0.95) {
  const per: number[][] = Array.from({ length: k }, () => []);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x0 = Math.round(R.x0 + (i * (R.x1 - R.x0)) / nx), x1 = Math.round(R.x0 + ((i + 1) * (R.x1 - R.x0)) / nx);
    const y0 = Math.round(R.y0 + (j * (R.y1 - R.y0)) / ny), y1 = Math.round(R.y0 + ((j + 1) * (R.y1 - R.y0)) / ny);
    const n = new Array(k).fill(0); let tot = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const v = c[y * w + x]; if (v < k) { n[v]++; tot++; } }
    if (tot) n.forEach((v, p) => per[p].push(v / tot));
  }
  const m = per[0]?.length ?? 0, t = m > 1 ? tInv(0.5 + conf / 2, m - 1) : NaN;
  return per.map((a) => {
    const mean = a.reduce((s, x) => s + x, 0) / a.length;
    const sd = a.length > 1 ? Math.sqrt(a.reduce((s, x) => s + (x - mean) ** 2, 0) / (a.length - 1)) : NaN;
    const ci = (t * sd) / Math.sqrt(a.length);
    return { fields: a.length, mean, sd, ci, ra: (100 * ci) / mean, values: a };
  });
}

/** A made-up two-phase micrograph with pores: Voronoi grains, each light (grey ~200) or dark (~110) with chance
 *  pDark, and round black pores (~25). Returns RGBA (grey, slight noise) and the true class of every pixel
 *  (0 pore, 1 dark, 2 light) for checking. */
export function examplePhases(w: number, h: number, grains: number, pDark: number, pores: number, seed: number, bar?: { px: number; label: string }) {
  const r = rng(seed), sx: number[] = [], sy: number[] = [], dark: boolean[] = [];
  for (let k = 0; k < grains; k++) { sx.push(r() * w); sy.push(r() * h); dark.push(r() < pDark); }
  const cls = new Uint8Array(w * h);
  const cs = Math.max(8, Math.sqrt((w * h) / grains)), gw = Math.ceil(w / cs), gh = Math.ceil(h / cs), cells: number[][] = Array.from({ length: gw * gh }, () => []);
  sx.forEach((x, k) => cells[Math.min(gh - 1, Math.floor(sy[k] / cs)) * gw + Math.min(gw - 1, Math.floor(x / cs))].push(k));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const cx = Math.floor(x / cs), cy = Math.floor(y / cs); let best = Infinity, bk = 0;
    for (let rr = 0; rr < 5; rr++) {
      for (let j = cy - rr; j <= cy + rr; j++) for (let i = cx - rr; i <= cx + rr; i++) {
        if (i < 0 || j < 0 || i >= gw || j >= gh || (Math.abs(i - cx) !== rr && Math.abs(j - cy) !== rr)) continue;
        for (const k of cells[j * gw + i]) { const d = (sx[k] - x) ** 2 + (sy[k] - y) ** 2; if (d < best) { best = d; bk = k; } }
      }
      if (best < (rr * cs) ** 2) break;
    }
    cls[y * w + x] = dark[bk] ? 1 : 2;
  }
  for (let p = 0; p < pores; p++) {
    const px = r() * w, py = r() * h, rad = 3 + 7 * r();
    for (let y = Math.max(0, Math.floor(py - rad)); y <= Math.min(h - 1, Math.ceil(py + rad)); y++) for (let x = Math.max(0, Math.floor(px - rad)); x <= Math.min(w - 1, Math.ceil(px + rad)); x++) if ((x - px) ** 2 + (y - py) ** 2 <= rad * rad) cls[y * w + x] = 0;
  }
  const px = new Uint8ClampedArray(w * h * 4), lvl = [25, 110, 200];
  for (let i = 0; i < w * h; i++) { const v = lvl[cls[i]] + 9 * gauss(r); px[4 * i] = px[4 * i + 1] = px[4 * i + 2] = v; px[4 * i + 3] = 255; }
  if (bar) drawBar(px, w, h, bar.px, bar.label);
  return { px, w, h, cls };
}
