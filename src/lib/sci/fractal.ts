// Maths for the fractal explorer: escape-time Mandelbrot and Julia sets with smooth colouring,
// iterated function systems (Barnsley fern, Sierpinski triangle and carpet, Heighway dragon) by
// the chaos game, the similarity dimension from Moran's equation, and a box-counting estimate.
// Plain TypeScript, no DOM, so it also runs in a Web Worker.

export type Kind = 'mandelbrot' | 'julia';
export type Job = { kind: Kind; cx: number; cy: number; span: number; w: number; h: number; max: number; jr: number; ji: number };

/**
 * Iterate z → z² + c from z0 until |z| > bail or `max` steps. Returns the escape step n (the first
 * n with |z_n| > bail, z_0 being the start), or -1 if it never escapes.
 */
export function escapeCount(zx: number, zy: number, cx: number, cy: number, max: number, bail = 2): number {
  const b2 = bail * bail;
  let x = zx, y = zy;
  for (let n = 0; n < max; n++) {
    const x2 = x * x, y2 = y * y;
    if (x2 + y2 > b2) return n;
    y = 2 * x * y + cy; x = x2 - y2 + cx;
  }
  return x * x + y * y > b2 ? max : -1;
}
/** True for points of the main cardioid or the period-2 bulb, which are inside the Mandelbrot set. */
export function inBulbs(cx: number, cy: number): boolean {
  const xq = cx - 0.25, q = xq * xq + cy * cy;
  if (q * (q + xq) <= 0.25 * cy * cy) return true;
  return (cx + 1) * (cx + 1) + cy * cy <= 0.0625;
}
const LOG2 = Math.log(2), BAIL = 256;
/** Smooth (continuous) escape value n + 1 − log₂(log |z|), with a large bail-out radius so it varies smoothly; -1 inside. */
export function smooth(zx: number, zy: number, cx: number, cy: number, max: number): number {
  let x = zx, y = zy;
  for (let n = 0; n < max; n++) {
    const x2 = x * x, y2 = y * y, r2 = x2 + y2;
    if (r2 > BAIL * BAIL) return Math.max(0, n + 1 - Math.log(Math.log(r2) / 2) / LOG2);
    y = 2 * x * y + cy; x = x2 - y2 + cx;
  }
  return -1;
}
/** The point at pixel (i, j) of a job (pixel centres; j = 0 is the top row). */
export function pixel(job: Job, i: number, j: number): [number, number] {
  const k = job.span / job.w;
  return [job.cx + (i + 0.5 - job.w / 2) * k, job.cy - (j + 0.5 - job.h / 2) * k];
}
/** Fill out[(j − y0)·w + i] for rows y0 ≤ j < y1. */
export function renderRows(job: Job, y0: number, y1: number, out: Float32Array) {
  const k = job.span / job.w, x0 = job.cx + (0.5 - job.w / 2) * k;
  for (let j = y0; j < y1; j++) {
    const y = job.cy - (j + 0.5 - job.h / 2) * k, row = (j - y0) * job.w;
    for (let i = 0; i < job.w; i++) {
      const x = x0 + i * k;
      out[row + i] = job.kind === 'mandelbrot' ? (inBulbs(x, y) ? -1 : smooth(0, 0, x, y, job.max)) : smooth(x, y, job.jr, job.ji, job.max);
    }
  }
}
/** Smallest view width that double precision can still split into `w` distinct pixels around the centre. */
export function minSpan(cx: number, cy: number, w: number): number {
  return Math.max(Math.abs(cx), Math.abs(cy), 1) * 2 ** -52 * w * 16;
}
/** A sensible iteration limit for a view width: more detail needs more steps as you zoom in. */
export function autoIter(span: number, base = 3.6): number {
  const z = Math.max(1, base / span);
  return Math.min(20000, Math.round(200 + 120 * Math.log2(z)));
}

// ---------- Colour ----------
export type PaletteId = 'ocean' | 'fire' | 'grey' | 'red';
const STOPS: Record<PaletteId, [number, number, number][]> = {
  ocean: [[0, 7, 100], [32, 107, 203], [237, 255, 255], [255, 170, 0], [0, 2, 0]],
  fire: [[20, 0, 0], [140, 20, 0], [240, 110, 0], [255, 220, 90], [255, 255, 235]],
  grey: [[15, 15, 15], [90, 90, 90], [200, 200, 200], [250, 250, 250], [120, 120, 120]],
  red: [[0, 0, 0], [60, 0, 0], [163, 0, 0], [90, 0, 0], [20, 0, 0]],
};
/** RGB for a smooth escape value; `cycle` steps per trip round the palette. Inside points are black. */
export function colour(v: number, pal: PaletteId, cycle = 48): [number, number, number] {
  if (v < 0) return [0, 0, 0];
  const s = STOPS[pal], t = ((Math.sqrt(v) * 6) / Math.sqrt(cycle)) % 1, f = t * s.length, i = Math.floor(f), u = f - i;
  const a = s[i % s.length], b = s[(i + 1) % s.length];
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
}

// ---------- Iterated function systems ----------
/** A map (x, y) → (a x + b y + e, c x + d y + f), chosen with probability p. */
export type Affine = { a: number; b: number; c: number; d: number; e: number; f: number; p: number };
export type IfsDef = { name: string; maps: Affine[]; ratios?: number[]; about: string };
const sim = (r: number, e: number, f: number, p: number): Affine => ({ a: r, b: 0, c: 0, d: r, e, f, p });
const rot = (r: number, deg: number, e: number, f: number, p: number): Affine => {
  const t = (deg * Math.PI) / 180; return { a: r * Math.cos(t), b: -r * Math.sin(t), c: r * Math.sin(t), d: r * Math.cos(t), e, f, p };
};
export const IFS: Record<string, IfsDef> = {
  fern: {
    name: 'Barnsley fern', about: 'Four affine maps (Barnsley, 1988): the stem, the main frond copy, and the two lowest leaves.',
    maps: [
      { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, p: 0.01 },
      { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, p: 0.85 },
      { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, p: 0.07 },
      { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, p: 0.07 },
    ],
  },
  sierpinski: { name: 'Sierpinski triangle', about: 'Three copies at half size, one at each corner.', maps: [sim(0.5, 0, 0, 1 / 3), sim(0.5, 0.5, 0, 1 / 3), sim(0.5, 0.25, Math.sqrt(3) / 4, 1 / 3)], ratios: [0.5, 0.5, 0.5] },
  carpet: {
    name: 'Sierpinski carpet', about: 'Eight copies at a third of the size: the square with its middle ninth removed, again and again.',
    maps: [0, 1, 2].flatMap((i) => [0, 1, 2].filter((j) => !(i === 1 && j === 1)).map((j) => sim(1 / 3, i / 3, j / 3, 1 / 8))), ratios: Array(8).fill(1 / 3),
  },
  dragon: { name: 'Heighway dragon', about: 'Two copies shrunk by 1/√2 and turned by 45° and 135°.', maps: [rot(Math.SQRT1_2, 45, 0, 0, 0.5), rot(Math.SQRT1_2, 135, 1, 0, 0.5)], ratios: [Math.SQRT1_2, Math.SQRT1_2] },
};

/** A small seeded random number generator (mulberry32), so a picture is the same every time. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** The chaos game: n points [x0, y0, x1, y1, …] after 50 warm-up steps. */
export function chaos(maps: Affine[], n: number, seed = 1): Float64Array {
  const r = rng(seed), cum: number[] = []; let s = 0;
  for (const m of maps) { s += m.p; cum.push(s); }
  const out = new Float64Array(2 * n);
  let x = 0, y = 0;
  for (let k = -50; k < n; k++) {
    const u = r() * s; let i = 0; while (i < cum.length - 1 && u >= cum[i]) i++;
    const m = maps[i], nx = m.a * x + m.b * y + m.e; y = m.c * x + m.d * y + m.f; x = nx;
    if (k >= 0) { out[2 * k] = x; out[2 * k + 1] = y; }
  }
  return out;
}
/** Similarity dimension: the D with Σ rᵢ^D = 1 (Moran's equation), by bisection. */
export function moranDim(r: number[]): number {
  const g = (D: number) => r.reduce((s, x) => s + x ** D, 0) - 1;
  let a = 0, b = 10;
  for (let k = 0; k < 200; k++) { const m = (a + b) / 2; if (g(m) > 0) a = m; else b = m; }
  return (a + b) / 2;
}
export function bounds(pts: Float64Array): [number, number, number, number] {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i < pts.length; i += 2) { const x = pts[i], y = pts[i + 1]; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return [x0, x1, y0, y1];
}
/**
 * Box-counting dimension estimate: count the boxes of side 2^-k (of the bounding square) that hold
 * a point, for every k where the boxes are still well filled (fewer boxes than n/30), and fit the
 * slope of log N against k·log 2 by least squares. Returns the estimate and the levels used.
 */
export function boxDim(pts: Float64Array): { dim: number; levels: [number, number][] } {
  const [x0, x1, y0, y1] = bounds(pts), side = Math.max(x1 - x0, y1 - y0) * (1 + 1e-9) || 1, n = pts.length / 2;
  const levels: [number, number][] = [];
  for (let k = 1; k <= 12; k++) {
    const m = 2 ** k, seen = new Set<number>();
    for (let i = 0; i < pts.length; i += 2) seen.add(Math.floor(((pts[i] - x0) / side) * m) * m + Math.floor(((pts[i + 1] - y0) / side) * m));
    if (seen.size > n / 30) break;
    levels.push([k, seen.size]);
  }
  const use = levels.filter(([k]) => k >= 2);
  if (use.length < 2) return { dim: NaN, levels };
  const xs = use.map(([k]) => k * LOG2), ys = use.map(([, c]) => Math.log(c));
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; });
  return { dim: sxy / sxx, levels };
}
