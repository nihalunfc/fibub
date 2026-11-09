// Slope stability of a simple slope on circular slip surfaces by the method of slices: Bishop's simplified method
// (iterated) and the ordinary (Fellenius) method, one or two horizontal soil layers, pore pressure from a pore
// pressure ratio ru or a piezometric line, and a grid search for the lowest factor of safety. Plain maths, no DOM.
// Coordinates: x to the right, y up, toe at (0, 0), slope rising to the crest at (H / tan β, H) on the right.

export type Soil = { c: number; phi: number; gamma: number };
export type Water = { kind: 'none' } | { kind: 'ru'; ru: number } | { kind: 'line'; yToe: number; yCrest: number };
export type Slope = { H: number; beta: number; top: Soil; bottom?: Soil; yi?: number; water: Water; gw?: number };
export type Circle = { xc: number; yc: number; R: number };
export type Slice = { x: number; b: number; yTop: number; yBase: number; alpha: number; W: number; u: number; l: number; soil: Soil; Nord: number; m: number };
export type Fos = { bishop: number; ordinary: number; slices: Slice[]; xL: number; xR: number; iterations: number; mMin: number; drive: number };

const rad = (d: number) => (d * Math.PI) / 180;
export const crestX = (s: Slope) => s.H / Math.tan(rad(s.beta));
export const ground = (s: Slope, x: number) => (x <= 0 ? 0 : x >= crestX(s) ? s.H : x * Math.tan(rad(s.beta)));
/** Piezometric line: yToe left of the toe, yCrest right of the crest, straight between; never above the ground. */
export function piezo(s: Slope, x: number): number {
  if (s.water.kind !== 'line') return -Infinity;
  const xc = crestX(s), { yToe, yCrest } = s.water;
  const y = x <= 0 ? yToe : x >= xc ? yCrest : yToe + ((yCrest - yToe) * x) / xc;
  return Math.min(y, ground(s, x));
}
const base = (c: Circle, x: number) => c.yc - Math.sqrt(Math.max(0, c.R * c.R - (x - c.xc) ** 2));

/** Where the circle cuts the ground: the slip mass lies between xL and xR. Null if it does not cut the slope. */
export function cut(s: Slope, c: Circle): { xL: number; xR: number } | null {
  const f = (x: number) => ground(s, x) - base(c, x);
  const a = c.xc - c.R, b = c.xc + c.R, N = 2000;
  let best: [number, number] | null = null, bestLen = 0, start: number | null = null;
  let prevX = a, prevF = f(a);
  for (let i = 1; i <= N; i++) {
    const x = a + ((b - a) * i) / N, fx = f(x);
    if (prevF <= 0 && fx > 0) start = bis(f, prevX, x);
    if (prevF > 0 && fx <= 0 && start != null) { const e = bis(f, prevX, x); if (e - start > bestLen) { best = [start, e]; bestLen = e - start; } start = null; }
    prevX = x; prevF = fx;
  }
  return best ? { xL: best[0], xR: best[1] } : null;
}
function bis(f: (x: number) => number, lo: number, hi: number) {
  const flo = f(lo) > 0;
  for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if ((f(m) > 0) === flo) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** Factors of safety for one circle with n slices of equal width. */
export function fos(s: Slope, c: Circle, n = 40): Fos | null {
  const k = cut(s, c);
  if (!k) return null;
  const { xL, xR } = k, b = (xR - xL) / n, gw = s.gw ?? 9.81, yi = s.bottom ? s.yi ?? -Infinity : -Infinity;
  const slices: Slice[] = [];
  for (let i = 0; i < n; i++) {
    const x = xL + b * (i + 0.5), yTop = ground(s, x), yBase = base(c, x);
    const h = yTop - yBase;
    if (h <= 0) continue;
    const t1 = Math.max(0, yTop - Math.max(yBase, yi)), t2 = h - t1;
    const W = b * (s.top.gamma * t1 + (s.bottom ? s.bottom.gamma * t2 : 0));
    const alpha = Math.asin(Math.max(-1, Math.min(1, (x - c.xc) / c.R)));
    const soil = s.bottom && yBase < yi ? s.bottom : s.top;
    const u = s.water.kind === 'ru' ? (s.water.ru * W) / b : s.water.kind === 'line' ? gw * Math.max(0, piezo(s, x) - yBase) : 0;
    const l = b / Math.cos(alpha);
    slices.push({ x, b, yTop, yBase, alpha, W, u, l, soil, Nord: 0, m: 0 });
  }
  const drive = slices.reduce((a, sl) => a + sl.W * Math.sin(sl.alpha), 0);
  if (!(drive > 1e-9)) return null;
  let resO = 0;
  for (const sl of slices) {
    const N = Math.max(0, sl.W * Math.cos(sl.alpha) - sl.u * sl.l);
    sl.Nord = N;
    resO += sl.soil.c * sl.l + N * Math.tan(rad(sl.soil.phi));
  }
  const ordinary = resO / drive;
  let F = ordinary > 0 ? ordinary : 1, it = 0, mMin = Infinity;
  for (; it < 200; it++) {
    let res = 0; mMin = Infinity;
    for (const sl of slices) {
      const t = Math.tan(rad(sl.soil.phi));
      const m = Math.cos(sl.alpha) + (Math.sin(sl.alpha) * t) / F;
      sl.m = m; mMin = Math.min(mMin, m);
      res += (sl.soil.c * sl.b + Math.max(0, sl.W - sl.u * sl.b) * t) / m;
    }
    const Fn = res / drive;
    if (Math.abs(Fn - F) < 1e-13 * Math.max(1, F)) { F = Fn; it++; break; }
    F = Fn;
  }
  return { bishop: F, ordinary, slices, xL, xR, iterations: it, mMin, drive };
}

export type Grid = { x0: number; x1: number; y0: number; y1: number; nx: number; ny: number; yLow: number; nR: number };
export type SearchOut = { best: { c: Circle; f: Fos } | null; grid: { c: Circle; f: Fos } | null; centres: { x: number; y: number; F: number }[]; tried: number; onEdge: boolean };

/** Grid search: every centre on the grid, with circles tangent to nR levels from yLow up to 0.8 H, plus the circle through the toe. Circles whose slip mass is very thin, or whose Bishop m(α) falls below 0.2, are skipped. */
export function search(s: Slope, g: Grid, n = 40): SearchOut {
  const centres: SearchOut['centres'] = [];
  let best: SearchOut['best'] = null, tried = 0;
  for (let i = 0; i < g.nx; i++) for (let j = 0; j < g.ny; j++) {
    const x = g.nx > 1 ? g.x0 + ((g.x1 - g.x0) * i) / (g.nx - 1) : g.x0, y = g.ny > 1 ? g.y0 + ((g.y1 - g.y0) * j) / (g.ny - 1) : g.y0;
    const radii: number[] = [Math.hypot(x, y)];
    for (let k = 0; k < g.nR; k++) { const yt = g.nR > 1 ? g.yLow + ((0.8 * s.H - g.yLow) * k) / (g.nR - 1) : g.yLow; if (y - yt > 0) radii.push(y - yt); }
    let cBest = Infinity;
    for (const R of radii) {
      tried++;
      const c = { xc: x, yc: y, R }, f = fos(s, c, n);
      if (!f || !(f.bishop > 0) || f.mMin < 0.2) continue;
      const depth = Math.max(...f.slices.map((sl) => sl.yTop - sl.yBase));
      if (depth < 0.02 * s.H) continue;
      if (f.bishop < cBest) cBest = f.bishop;
      if (!best || f.bishop < best.f.bishop) best = { c, f };
    }
    if (Number.isFinite(cBest)) centres.push({ x, y, F: cBest });
  }
  const grid = best;
  const ok = (c: Circle) => { const f = fos(s, c, n); if (!f || !(f.bishop > 0) || f.mMin < 0.2) return null; return Math.max(...f.slices.map((sl) => sl.yTop - sl.yBase)) < 0.02 * s.H ? null : f; };
  const onEdge = !!best && ((g.nx > 1 && (Math.abs(best.c.xc - g.x0) < 1e-9 || Math.abs(best.c.xc - g.x1) < 1e-9)) || (g.ny > 1 && (Math.abs(best.c.yc - g.y0) < 1e-9 || Math.abs(best.c.yc - g.y1) < 1e-9)));
  // Refine: a pattern search on centre and radius, starting at half the grid spacing.
  if (best) {
    let step = Math.max((g.x1 - g.x0) / Math.max(1, g.nx - 1), (g.y1 - g.y0) / Math.max(1, g.ny - 1), s.H / 20) / 2;
    for (let k = 0; k < 40 && step > s.H * 1e-4; k++) {
      let moved = false;
      for (const [dx, dy, dr] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
        const c = { xc: best.c.xc + dx * step, yc: best.c.yc + dy * step, R: best.c.R + dr * step };
        if (!(c.R > 0)) continue;
        tried++;
        const f = ok(c);
        if (f && f.bishop < best.f.bishop - 1e-12) { best = { c, f }; moved = true; }
      }
      if (!moved) step /= 2;
    }
  }
  return { best, grid, centres, tried, onEdge };
}
