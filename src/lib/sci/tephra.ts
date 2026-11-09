// Tephra (fall deposit) volume from isopach data: thickness T against the square root of the area A it encloses,
// x = √A. Three standard models, each integrated as V = ∫ T(x) 2x dx (since A = x²):
//  - exponential, one or more straight segments on ln T against x (Pyle 1989; Fierstein and Nathenson 1992;
//    Bonadonna and Houghton 2005), segments joined where their lines cross;
//  - power law T = Tpl x^(−m) between a proximal limit B and a distal limit C (Bonadonna and Houghton 2005);
//  - Weibull T = θ (x/λ)^(n−2) exp(−(x/λ)^n), volume 2θλ²/n (Bonadonna and Costa 2012), fitted here by least squares
//    on ln T.
// Thickness and x in km inside this file, so volumes come out in km³. No DOM.

export type Pt = { x: number; T: number };
export type Line = { a: number; b: number; r2: number }; // y = a + b·x

export function linfit(xs: number[], ys: number[]): Line {
  const n = xs.length, mx = xs.reduce((s, v) => s + v, 0) / n, my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); syy += (ys[i] - my) ** 2; }
  const b = sxy / sxx, a = my - b * mx;
  return { a, b, r2: syy > 0 ? (sxy * sxy) / (sxx * syy) : 1 };
}

/** ∫_a^b T0 e^(−kx) 2x dx, with b possibly Infinity. */
export function expPiece(T0: number, k: number, a: number, b: number): number {
  const F = (x: number) => (x === Infinity ? 0 : (1 + k * x) * Math.exp(-k * x));
  return ((2 * T0) / (k * k)) * (F(a) - F(b));
}

export type ExpSeg = { T0: number; k: number; from: number; to: number; r2: number; idx: [number, number]; vol: number; bt: number };

/** Exponential fit with the given segments (index ranges into points sorted by x, each at least 2 points). */
export function expFit(pts: Pt[], cuts: number[]): { segs: ExpSeg[]; vol: number; sse: number; ok: boolean; why?: string } {
  const bounds = [0, ...cuts, pts.length];
  const segs: ExpSeg[] = [];
  let sse = 0;
  for (let s = 0; s + 1 < bounds.length; s++) {
    const p = pts.slice(bounds[s], bounds[s + 1]);
    const L = linfit(p.map((q) => q.x), p.map((q) => Math.log(q.T)));
    for (const q of p) sse += (Math.log(q.T) - (L.a + L.b * q.x)) ** 2;
    segs.push({ T0: Math.exp(L.a), k: -L.b, from: 0, to: Infinity, r2: L.r2, idx: [bounds[s], bounds[s + 1] - 1], vol: 0, bt: Math.LN2 / (-L.b * Math.sqrt(Math.PI)) });
  }
  for (let s = 0; s + 1 < segs.length; s++) {
    const A = segs[s], B = segs[s + 1];
    const x = (Math.log(A.T0) - Math.log(B.T0)) / (A.k - B.k);
    A.to = B.from = x;
  }
  const last = segs[segs.length - 1];
  if (!(last.k > 0)) return { segs, vol: NaN, sse, ok: false, why: 'the outermost segment does not thin away from the vent, so the volume has no limit' };
  for (const s of segs) s.vol = expPiece(s.T0, s.k, s.from, s.to);
  const ordered = segs.every((s) => s.to > s.from && Number.isFinite(s.from));
  return { segs, vol: segs.reduce((v, s) => v + s.vol, 0), sse, ok: ordered, why: ordered ? undefined : 'segment lines cross in the wrong order; try fewer segments' };
}

/** Best cut points for `n` exponential segments (each at least 2 points), by least squares on ln T. */
export function bestCuts(pts: Pt[], n: number): number[] | null {
  if (n <= 1) return [];
  let best: number[] | null = null, bestSse = Infinity;
  const rec = (start: number, left: number, acc: number[]) => {
    if (left === 1) { if (pts.length - start < 2) return; const f = expFit(pts, acc); if (f.ok && f.sse < bestSse) { bestSse = f.sse; best = acc.slice(); } return; }
    for (let c = start + 2; c <= pts.length - 2 * (left - 1); c++) rec(c, left - 1, [...acc, c]);
  };
  rec(0, n, []);
  return best;
}

/** Power law fit T = Tpl x^(−m) (least squares on ln T against ln x) and its volume between B and C (km). */
export function powerFit(pts: Pt[], B: number, C: number) {
  const L = linfit(pts.map((p) => Math.log(p.x)), pts.map((p) => Math.log(p.T)));
  const Tpl = Math.exp(L.a), m = -L.b;
  const vol = powerVol(Tpl, m, B, C);
  let sse = 0; for (const p of pts) sse += (Math.log(p.T) - (L.a + L.b * Math.log(p.x))) ** 2;
  return { Tpl, m, r2: L.r2, vol, sse };
}
export function powerVol(Tpl: number, m: number, B: number, C: number) {
  return Math.abs(m - 2) < 1e-12 ? 2 * Tpl * Math.log(C / B) : ((2 * Tpl) / (2 - m)) * (Math.pow(C, 2 - m) - Math.pow(B, 2 - m));
}

export const weibullT = (x: number, th: number, la: number, n: number) => th * Math.pow(x / la, n - 2) * Math.exp(-Math.pow(x / la, n));
export const weibullVol = (th: number, la: number, n: number) => (2 * th * la * la) / n;

/** Nelder–Mead minimisation in 2 dimensions. */
function nelderMead(f: (p: number[]) => number, x0: number[], step: number[], iters = 600) {
  let s = [x0, [x0[0] + step[0], x0[1]], [x0[0], x0[1] + step[1]]].map((p) => ({ p, v: f(p) }));
  for (let it = 0; it < iters; it++) {
    s.sort((a, b) => a.v - b.v);
    if (Math.abs(s[2].v - s[0].v) < 1e-15 * (1 + Math.abs(s[0].v)) && it > 50) break;
    const c = [(s[0].p[0] + s[1].p[0]) / 2, (s[0].p[1] + s[1].p[1]) / 2];
    const at = (t: number) => [c[0] + t * (s[2].p[0] - c[0]), c[1] + t * (s[2].p[1] - c[1])];
    const r = at(-1), fr = f(r);
    if (fr < s[0].v) { const e = at(-2), fe = f(e); s[2] = fe < fr ? { p: e, v: fe } : { p: r, v: fr }; }
    else if (fr < s[1].v) s[2] = { p: r, v: fr };
    else { const k = fr < s[2].v ? at(-0.5) : at(0.5), fk = f(k); if (fk < Math.min(fr, s[2].v)) s[2] = { p: k, v: fk }; else s = [s[0], ...s.slice(1).map((q) => { const p = [s[0].p[0] + 0.5 * (q.p[0] - s[0].p[0]), s[0].p[1] + 0.5 * (q.p[1] - s[0].p[1])]; return { p, v: f(p) }; })]; }
  }
  s.sort((a, b) => a.v - b.v);
  return s[0];
}

/**
 * Weibull fit by least squares on ln T over θ, λ and n. For fixed λ and n, ln θ is the mean residual, so only λ and n
 * are searched (from a grid of starting points, then Nelder–Mead on ln λ and ln n).
 */
export function weibullFit(pts: Pt[]) {
  const lx = pts.map((p) => p.x), ly = pts.map((p) => Math.log(p.T));
  const prof = (la: number, n: number) => {
    const g = lx.map((x) => (n - 2) * Math.log(x / la) - Math.pow(x / la, n));
    const lth = ly.reduce((s, y, i) => s + y - g[i], 0) / ly.length;
    let sse = 0; for (let i = 0; i < ly.length; i++) sse += (ly[i] - lth - g[i]) ** 2;
    return { lth, sse };
  };
  const f = (p: number[]) => { const la = Math.exp(p[0]), n = Math.exp(p[1]); if (!(n > 0.02 && n < 20 && la > 1e-6 && la < 1e6)) return 1e300; const v = prof(la, n).sse; return Number.isFinite(v) ? v : 1e300; };
  const xmax = Math.max(...lx), xmin = Math.min(...lx);
  let best = { p: [0, 0], v: Infinity };
  for (const la of [xmin, Math.sqrt(xmin * xmax), xmax, 2 * xmax, 5 * xmax]) for (const n of [0.3, 0.6, 1, 1.5, 2.5]) {
    const r = nelderMead(f, [Math.log(la), Math.log(n)], [0.3, 0.3]);
    if (r.v < best.v) best = r;
  }
  const r = nelderMead(f, best.p, [0.05, 0.05], 2000);
  if (r.v < best.v) best = r;
  const la = Math.exp(best.p[0]), n = Math.exp(best.p[1]), th = Math.exp(prof(la, n).lth);
  // With data that follow a straight line on log-log axes the best λ runs off towards infinity (the Weibull curve
  // becomes a power law) and the volume is not fixed by the data.
  const degenerate = la > 100 * xmax || n < 0.03 || n > 19;
  return { theta: th, lambda: la, n, sse: best.v, vol: weibullVol(th, la, n), degenerate };
}

/** VEI class from bulk tephra volume in m³ (Newhall and Self 1982 thresholds, powers of ten). */
export function vei(m3: number): number {
  if (!(m3 > 0)) return 0;
  if (m3 < 1e4) return 0;
  if (m3 < 1e6) return 1;
  return Math.min(8, Math.floor(Math.log10(m3)) - 4);
}
