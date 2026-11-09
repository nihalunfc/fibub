// Grain size by the line-intercept (Heyn) method. No DOM. Test lines (horizontal, vertical or three concentric
// circles) are laid over the area; the grey profile along each line is read and every grain boundary it crosses is
// counted (a dark or light boundary line, or a step in shade between grains). The mean lineal intercept is the total
// line length over the total count, and the ASTM grain size number G follows from the ASTM E112 relation
// G = −6.6457 log10(ℓ in mm) − 3.298. The spread between lines gives a Student-t confidence interval.
import { tInv } from './stats.ts';
import { rng, gauss, drawBar, type Rect } from './micro.ts';

export type Pattern = 'h' | 'v' | 'hv' | 'circles';
export type TLine = { circle: false; x0: number; y0: number; x1: number; y1: number; len: number } | { circle: true; cx: number; cy: number; r: number; len: number };
export type Mark = { s: number; w: number; manual?: boolean }; // position along the line (px) and weight (1, or ½ at a line end)
export type Detect = { mode: 'dark' | 'light' | 'edge'; t: number; gap: number };

/** Test lines over the area: n evenly spaced horizontal and/or vertical lines (inset 2 % from the area's edges, on
 *  whole pixels), or
 *  three concentric circles with radii in the ratio 3 : 2 : 1, the largest 46 % of the shorter side. */
export function testLines(R: Rect, p: Pattern, n: number): TLine[] {
  const W = R.x1 - R.x0, H = R.y1 - R.y0, out: TLine[] = [];
  if (p === 'circles') {
    const cx = (R.x0 + R.x1) / 2, cy = (R.y0 + R.y1) / 2, r = 0.46 * Math.min(W, H);
    for (const k of [1, 2 / 3, 1 / 3]) out.push({ circle: true, cx, cy, r: r * k, len: 2 * Math.PI * r * k });
    return out;
  }
  // Straight lines run along pixel centres (whole numbers), so every pixel they pass is read.
  const xa = Math.round(R.x0 + 0.02 * W), xb = Math.round(R.x1 - 1 - 0.02 * W), ya = Math.round(R.y0 + 0.02 * H), yb = Math.round(R.y1 - 1 - 0.02 * H);
  if (p === 'h' || p === 'hv') for (let i = 0; i < n; i++) { const y = Math.floor(R.y0 + ((i + 0.5) * H) / n); out.push({ circle: false, x0: xa, y0: y, x1: xb, y1: y, len: xb - xa }); }
  if (p === 'v' || p === 'hv') for (let i = 0; i < n; i++) { const x = Math.floor(R.x0 + ((i + 0.5) * W) / n); out.push({ circle: false, x0: x, y0: ya, x1: x, y1: yb, len: yb - ya }); }
  return out;
}

/** The point at distance s (px) along a test line; circles start at 3 o'clock and run clockwise on screen. */
export function pointAt(L: TLine, s: number): [number, number] {
  if (L.circle) { const a = s / L.r; return [L.cx + L.r * Math.cos(a), L.cy + L.r * Math.sin(a)]; }
  const f = s / L.len; return [L.x0 + f * (L.x1 - L.x0), L.y0 + f * (L.y1 - L.y0)];
}

/** Grey profile along a line: the nearest pixel at every step of at most 1 px (the last sample is the line's end;
 *  circles do not repeat their start). Nearest pixels, not blended ones, so a boundary one pixel wide is never
 *  averaged away; with steps of 1 px or less, a path from one grain into the next always meets a boundary pixel. */
export function profile(g: ArrayLike<number>, w: number, h: number, L: TLine): Float32Array {
  const n = L.circle ? Math.max(8, Math.ceil(L.len)) : Math.max(2, Math.round(L.len) + 1), step = L.circle ? L.len / n : L.len / (n - 1), out = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    const [x, y] = pointAt(L, k * step), i = Math.max(0, Math.min(w - 1, Math.round(x))), j = Math.max(0, Math.min(h - 1, Math.round(y)));
    out[k] = g[j * w + i];
  }
  return out;
}
export const stepOf = (L: TLine, n: number) => (L.circle ? L.len / n : L.len / (n - 1));

/** Boundary crossings along a profile. Dark or light mode: each run of samples at or below (dark) or above (light)
 *  the threshold is one boundary; runs closer than `gap` samples are merged. Edge mode: each run where the change in
 *  shade between neighbouring samples (smoothed a little) is above the threshold is one boundary, at its steepest
 *  point. On a straight line a boundary cut by the line's end counts ½; circles wrap round. */
export function crossings(p: ArrayLike<number>, closed: boolean, d: Detect): Mark[] {
  const n = p.length, on = new Uint8Array(n);
  let score: Float64Array | null = null;
  if (d.mode === 'edge') {
    score = gradient(p, closed);
    for (let i = 0; i < n; i++) on[i] = score[i] > d.t ? 1 : 0;
  } else for (let i = 0; i < n; i++) on[i] = (d.mode === 'dark' ? p[i] <= d.t : p[i] > d.t) ? 1 : 0;
  // Runs [a, b] inclusive.
  let runs: [number, number][] = [];
  for (let i = 0; i < n;) { if (!on[i]) { i++; continue; } let j = i; while (j + 1 < n && on[j + 1]) j++; runs.push([i, j]); i = j + 1; }
  if (!runs.length) return [];
  const gap = Math.max(0, Math.round(d.gap));
  const merged: [number, number][] = [runs[0]];
  for (let k = 1; k < runs.length; k++) { const last = merged[merged.length - 1]; if (runs[k][0] - last[1] - 1 < gap) last[1] = runs[k][1]; else merged.push(runs[k]); }
  runs = merged;
  if (closed && runs.length > 1) {
    const f = runs[0], l = runs[runs.length - 1];
    if (f[0] + (n - 1 - l[1]) < Math.max(1, gap)) { runs.pop(); runs[0] = [l[0] - n, f[1]]; }
  }
  if (closed && runs.length === 1 && runs[0][0] === 0 && runs[0][1] === n - 1) return []; // all boundary: nothing to count
  return runs.map(([a, b]) => {
    let s = (a + b) / 2;
    if (score) { let best = -1; for (let i = a; i <= b; i++) { const v = score[(i + n) % n]; if (v > best) { best = v; s = i; } } }
    if (closed) s = ((s % n) + n) % n;
    const end = !closed && (a === 0 || b === n - 1);
    return { s, w: end ? 0.5 : 1 };
  }).sort((x, y) => x.s - y.s);
}

/** Change in shade per pixel along a profile (smoothed with a small Gaussian, σ = 1 px, then a central
 *  difference), used by the edge mode. */
export function gradient(p: ArrayLike<number>, closed: boolean): Float64Array {
  const n = p.length, sm = smooth(p, closed), gr = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = closed ? sm[(i - 1 + n) % n] : sm[Math.max(0, i - 1)], b = closed ? sm[(i + 1) % n] : sm[Math.min(n - 1, i + 1)];
    gr[i] = Math.abs(b - a) / (closed || (i > 0 && i < n - 1) ? 2 : 1);
  }
  return gr;
}

function smooth(p: ArrayLike<number>, closed: boolean): Float64Array {
  const n = p.length, k = [0.0044, 0.054, 0.242, 0.399, 0.242, 0.054, 0.0044], s = k.reduce((a, b) => a + b, 0), out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let v = 0;
    for (let j = -3; j <= 3; j++) { const t = i + j; v += k[j + 3] * p[closed ? (t + n) % n : Math.max(0, Math.min(n - 1, t))]; }
    out[i] = v / s;
  }
  return out;
}

/** ASTM grain size number G from the mean lineal intercept in millimetres (ASTM E112 relation). */
export const astmG = (lmm: number) => -6.6457 * Math.log10(lmm) - 3.298;
/** Mean lineal intercept (mm) for a grain size number G (the same relation turned round). */
export const lFromG = (G: number) => 10 ** (-(G + 3.298) / 6.6457);

export type Stats = {
  n: number; LT: number; PT: number; lbar: number; PL: number[]; meanPL: number; sdPL: number; ciPL: number; ra: number;
  lLo: number; lHi: number; G: number; GLo: number; GHi: number;
};
/** Statistics over the lines. len: each line's length (any unit), P: its count of boundary crossings. The mean
 *  intercept is ΣL / ΣP; the confidence interval is Student's t on the per-line crossings per unit length P_L
 *  (as ASTM E112 treats fields), turned into an interval on ℓ. G uses ℓ in mm when mmPerUnit is given. */
export function interceptStats(lines: { len: number; P: number }[], conf = 0.95, mmPerUnit = NaN): Stats {
  const n = lines.length, LT = lines.reduce((s, l) => s + l.len, 0), PT = lines.reduce((s, l) => s + l.P, 0);
  const PL = lines.map((l) => l.P / l.len), meanPL = PL.reduce((s, x) => s + x, 0) / n;
  const sdPL = n > 1 ? Math.sqrt(PL.reduce((s, x) => s + (x - meanPL) ** 2, 0) / (n - 1)) : NaN;
  const ciPL = n > 1 ? tInv(0.5 + conf / 2, n - 1) * sdPL / Math.sqrt(n) : NaN;
  const lbar = PT > 0 ? LT / PT : NaN, PLp = PT / LT;
  const lLo = PLp + ciPL > 0 ? 1 / (PLp + ciPL) : NaN, lHi = PLp - ciPL > 0 ? 1 / (PLp - ciPL) : Infinity;
  const g = (l: number) => (Number.isFinite(mmPerUnit) && l > 0 && Number.isFinite(l) ? astmG(l * mmPerUnit) : NaN);
  return { n, LT, PT, lbar, PL, meanPL, sdPL, ciPL, ra: (100 * ciPL) / meanPL, lLo, lHi, G: g(lbar), GLo: g(lHi), GHi: g(lLo) };
}

/** Nearest test line to a tap: its index, the position along it (px) and the distance from it (px). */
export function nearestLine(lines: TLine[], x: number, y: number): { i: number; s: number; d: number } {
  let best = { i: -1, s: 0, d: Infinity };
  lines.forEach((L, i) => {
    let s: number, d: number;
    if (L.circle) { const a = Math.atan2(y - L.cy, x - L.cx); s = ((a + 2 * Math.PI) % (2 * Math.PI)) * L.r; d = Math.abs(Math.hypot(x - L.cx, y - L.cy) - L.r); }
    else { const dx = L.x1 - L.x0, dy = L.y1 - L.y0, f = Math.max(0, Math.min(1, ((x - L.x0) * dx + (y - L.y0) * dy) / (L.len * L.len))); s = f * L.len; const [px, py] = pointAt(L, s); d = Math.hypot(x - px, y - py); }
    if (d < best.d) best = { i, s, d };
  });
  return best;
}

/** Adds a mark at position s, or removes the mark within tol of it. Returns the new list. */
export function toggleMark(marks: Mark[], s: number, tol: number, L: TLine): Mark[] {
  const dist = (a: number) => (L.circle ? Math.min(Math.abs(a - s), L.len - Math.abs(a - s)) : Math.abs(a - s));
  let k = -1, best = tol;
  marks.forEach((m, i) => { const d = dist(m.s); if (d <= best) { best = d; k = i; } });
  if (k >= 0) return marks.filter((_, i) => i !== k);
  return [...marks, { s, w: 1, manual: true }].sort((a, b) => a.s - b.s);
}

/** A made-up etched micrograph: a Voronoi grain structure (n seeds over the image, seeded) with dark boundaries a
 *  few pixels wide, grains in slightly different light greys and a little noise. Returns grey RGBA and the seed
 *  count per pixel², from which the expected mean intercept of a random Voronoi pattern is π / (4 √density). */
export function exampleGrains(w: number, h: number, n: number, seed: number, bar?: { px: number; label: string }) {
  const r = rng(seed), pad = 40, W = w + 2 * pad, H = h + 2 * pad, m = Math.round((n * W * H) / (w * h));
  const sx = new Float64Array(m), sy = new Float64Array(m), shade = new Float64Array(m);
  for (let k = 0; k < m; k++) { sx[k] = r() * W - pad; sy[k] = r() * H - pad; shade[k] = 175 + 50 * r(); }
  // Nearest seed via a bucket grid.
  const cs = Math.max(8, Math.sqrt((W * H) / m)), gw = Math.ceil(W / cs), gh = Math.ceil(H / cs), cells: number[][] = Array.from({ length: gw * gh }, () => []);
  for (let k = 0; k < m; k++) cells[Math.min(gh - 1, Math.floor((sy[k] + pad) / cs)) * gw + Math.min(gw - 1, Math.floor((sx[k] + pad) / cs))].push(k);
  const lab = new Int32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const cx = Math.floor((x + pad) / cs), cy = Math.floor((y + pad) / cs); let best = Infinity, bk = 0;
    for (let rr = 0; rr < 4; rr++) {
      for (let j = cy - rr; j <= cy + rr; j++) for (let i = cx - rr; i <= cx + rr; i++) {
        if (i < 0 || j < 0 || i >= gw || j >= gh || (Math.abs(i - cx) !== rr && Math.abs(j - cy) !== rr)) continue;
        for (const k of cells[j * gw + i]) { const d = (sx[k] - x) ** 2 + (sy[k] - y) ** 2; if (d < best) { best = d; bk = k; } }
      }
      if (best < (rr * cs) ** 2) break;
    }
    lab[y * w + x] = bk;
  }
  const px = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, l = lab[i];
    const edge = (x > 0 && lab[i - 1] !== l) || (y > 0 && lab[i - w] !== l) || (x < w - 1 && lab[i + 1] !== l) || (y < h - 1 && lab[i + w] !== l);
    const v = (edge ? 45 : shade[l]) + 6 * gauss(r);
    px[4 * i] = px[4 * i + 1] = px[4 * i + 2] = v; px[4 * i + 3] = 255;
  }
  if (bar) drawBar(px, w, h, bar.px, bar.label);
  return { px, w, h, density: m / (W * H), lab };
}
