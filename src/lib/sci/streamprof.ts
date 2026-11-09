// River long profiles from a DEM or a pasted table: pit filling (priority flood with a small step, Barnes et al. 2014),
// D8 steepest-descent flow and drainage area, tracing a channel from a source, slope-area fits (S = ks A^−θ),
// chi analysis (Perron and Royden 2013: χ = ∫ (A0/A)^θ dx, with z = z_b + ks/A0^θ · χ at steady state), the best θ by
// linearity of z against χ, and knickpoint hints from segmented fits of z against χ. Plain TypeScript, no DOM.

export type Grid = { w: number; h: number; z: Float64Array; dx: number; dy: number };

/** ESRI ASCII grid: header (ncols, nrows, xllcorner/xllcenter, yllcorner/yllcenter, cellsize, NODATA_value), then rows north to south. */
export function parseAsciiGrid(text: string): { w: number; h: number; z: Float64Array; cell: number; x0: number; y0: number } {
  const lines = text.replace(/\r/g, '').split('\n');
  const head: Record<string, number> = {};
  let i = 0;
  for (; i < lines.length && i < 10; i++) {
    const m = lines[i].trim().match(/^([a-zA-Z_]+)\s+(\S+)$/);
    if (!m) break;
    head[m[1].toLowerCase()] = Number(m[2]);
  }
  const w = head.ncols, h = head.nrows, cell = head.cellsize ?? head.dx;
  if (!(w > 0 && h > 0 && Number.isInteger(w) && Number.isInteger(h))) throw new Error('This is not an ASCII grid: ncols and nrows are missing.');
  if (!(cell > 0)) throw new Error('The ASCII grid has no cellsize.');
  if (w * h > 25e6) throw new Error(`The grid has ${w} × ${h} cells; the limit here is 25 million.`);
  const nd = head.nodata_value;
  const z = new Float64Array(w * h);
  let k = 0;
  for (; i < lines.length && k < w * h; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    for (const s of t.split(/\s+/)) { if (k >= w * h) break; const v = Number(s); z[k++] = !Number.isFinite(v) || v === nd ? NaN : v; }
  }
  if (k < w * h) throw new Error(`The grid should have ${w * h} values but has ${k}.`);
  const x0 = head.xllcorner ?? (head.xllcenter != null ? head.xllcenter - cell / 2 : 0), y0 = head.yllcorner ?? (head.yllcenter != null ? head.yllcenter - cell / 2 : 0);
  return { w, h, z, cell, x0, y0 };
}

// Neighbour order used everywhere (and in the tests): N, NE, E, SE, S, SW, W, NW.
const DI = [-1, -1, 0, 1, 1, 1, 0, -1], DJ = [0, 1, 1, 1, 0, -1, -1, -1];

/** A cell on the edge of the grid or next to a no-data cell: water leaves the grid there. */
function boundary(g: Grid, r: number, c: number) {
  if (r === 0 || c === 0 || r === g.h - 1 || c === g.w - 1) return true;
  for (let k = 0; k < 8; k++) if (Number.isNaN(g.z[(r + DI[k]) * g.w + c + DJ[k]])) return true;
  return false;
}

/**
 * Priority-flood pit filling with a small step (Barnes, Lehman and Mulla 2014, "+ε"): every cell drains to the edge
 * along a strictly falling path. Ties in the queue go first-in first-out, so the result does not depend on chance.
 */
export function fillPits(g: Grid, eps = 1e-4): Float64Array {
  const n = g.w * g.h, zf = new Float64Array(n).fill(NaN), done = new Uint8Array(n);
  // Binary heap on (elevation, insertion number).
  let size = 0, seq = 0;
  const hk = new Float64Array(n), hs = new Float64Array(n), hv = new Int32Array(n);
  const less = (a: number, b: number) => hk[a] < hk[b] || (hk[a] === hk[b] && hs[a] < hs[b]);
  const swap = (a: number, b: number) => { let t = hk[a]; hk[a] = hk[b]; hk[b] = t; t = hs[a]; hs[a] = hs[b]; hs[b] = t; const u = hv[a]; hv[a] = hv[b]; hv[b] = u; };
  const push = (key: number, v: number) => { let i = size++; hk[i] = key; hs[i] = seq++; hv[i] = v; while (i > 0) { const p = (i - 1) >> 1; if (!less(i, p)) break; swap(i, p); i = p; } };
  const pop = () => { const v = hv[0]; size--; if (size > 0) { hk[0] = hk[size]; hs[0] = hs[size]; hv[0] = hv[size]; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < size && less(l, m)) m = l; if (r < size && less(r, m)) m = r; if (m === i) break; swap(i, m); i = m; } } return v; };
  for (let r = 0; r < g.h; r++) for (let c = 0; c < g.w; c++) {
    const i = r * g.w + c;
    if (!Number.isNaN(g.z[i]) && boundary(g, r, c)) { zf[i] = g.z[i]; done[i] = 1; push(g.z[i], i); }
  }
  while (size > 0) {
    const i = pop(), r = Math.floor(i / g.w), c = i - r * g.w;
    for (let k = 0; k < 8; k++) {
      const rr = r + DI[k], cc = c + DJ[k];
      if (rr < 0 || cc < 0 || rr >= g.h || cc >= g.w) continue;
      const j = rr * g.w + cc;
      if (done[j] || Number.isNaN(g.z[j])) continue;
      done[j] = 1; zf[j] = Math.max(g.z[j], zf[i] + eps); push(zf[j], j);
    }
  }
  return zf;
}

/** D8 receivers on the filled surface: the neighbour with the steepest drop (first in N…NW order on a tie); −1 where water leaves. */
export function d8(g: Grid, zf: Float64Array): Int32Array {
  const rcv = new Int32Array(g.w * g.h).fill(-1), dd = Math.hypot(g.dx, g.dy);
  for (let r = 0; r < g.h; r++) for (let c = 0; c < g.w; c++) {
    const i = r * g.w + c;
    if (Number.isNaN(zf[i]) || boundary(g, r, c)) continue;
    let best = 0, b = -1;
    for (let k = 0; k < 8; k++) {
      const j = (r + DI[k]) * g.w + c + DJ[k], d = DI[k] && DJ[k] ? dd : DI[k] ? g.dy : g.dx, s = (zf[i] - zf[j]) / d;
      if (s > best) { best = s; b = j; }
    }
    rcv[i] = b;
  }
  return rcv;
}

/** Drainage area of every cell (cells draining through it, itself included, times the cell area). */
export function drainageArea(g: Grid, rcv: Int32Array, zf: Float64Array): Float64Array {
  const n = g.w * g.h, acc = new Float64Array(n), indeg = new Int32Array(n), cellA = g.dx * g.dy;
  for (let i = 0; i < n; i++) { if (!Number.isNaN(zf[i])) acc[i] = cellA; if (rcv[i] >= 0) indeg[rcv[i]]++; }
  const stack: number[] = [];
  for (let i = 0; i < n; i++) if (!Number.isNaN(zf[i]) && indeg[i] === 0) stack.push(i);
  while (stack.length) {
    const i = stack.pop()!, j = rcv[i];
    if (j < 0) continue;
    acc[j] += acc[i];
    if (--indeg[j] === 0) stack.push(j);
  }
  return acc;
}

/** Cells from a source down to where water leaves the grid. */
export function trace(rcv: Int32Array, start: number): number[] {
  const path = [start], seen = new Set([start]);
  let i = start;
  while (rcv[i] >= 0) { i = rcv[i]; if (seen.has(i)) break; seen.add(i); path.push(i); }
  return path;
}

export type Profile = { x: number[]; z: number[]; A: number[] };

/** A traced path as a profile from the outlet upstream: x is the distance upstream from the outlet. */
export function pathProfile(g: Grid, path: number[], zf: Float64Array, acc: Float64Array): Profile {
  const d: number[] = [0];
  for (let k = 1; k < path.length; k++) {
    const a = path[k - 1], b = path[k], dr = Math.floor(b / g.w) - Math.floor(a / g.w), dc = (b % g.w) - (a % g.w);
    d.push(d[k - 1] + Math.hypot(dr * g.dy, dc * g.dx));
  }
  const L = d[d.length - 1], o = path.map((_, k) => path.length - 1 - k);
  return { x: o.map((k) => L - d[k]), z: o.map((k) => zf[path[k]]), A: o.map((k) => acc[path[k]]) };
}

/** Sort a pasted profile so it runs from the outlet upstream (the end with the larger area is the outlet). */
export function orient(p: Profile): Profile {
  const idx = p.x.map((_, i) => i).sort((a, b) => p.x[a] - p.x[b]);
  let x = idx.map((i) => p.x[i]), z = idx.map((i) => p.z[i]), A = idx.map((i) => p.A[i]);
  if (A[0] < A[A.length - 1]) { const L = x[x.length - 1]; x = x.map((v) => L - v).reverse(); z = z.reverse(); A = A.reverse(); }
  else { const x0 = x[0]; x = x.map((v) => v - x0); }
  return { x, z, A };
}

/** χ at every node by the trapezium rule, from 0 at the outlet. */
export function chi(p: Profile, theta: number, A0 = 1): number[] {
  const out = [0];
  for (let i = 1; i < p.x.length; i++) out.push(out[i - 1] + 0.5 * ((A0 / p.A[i]) ** theta + (A0 / p.A[i - 1]) ** theta) * (p.x[i] - p.x[i - 1]));
  return out;
}

export type Fit = { slope: number; icpt: number; r2: number; n: number; sse: number };
export function lsq(x: number[], y: number[]): Fit {
  const n = x.length;
  let sx = 0, sy = 0; for (let i = 0; i < n; i++) { sx += x[i]; sy += y[i]; }
  const mx = sx / n, my = sy / n;
  let sxx = 0, sxy = 0, syy = 0; for (let i = 0; i < n; i++) { const a = x[i] - mx, b = y[i] - my; sxx += a * a; sxy += a * b; syy += b * b; }
  const slope = sxy / sxx, icpt = my - slope * mx, sse = Math.max(0, syy - slope * sxy);
  return { slope, icpt, r2: syy > 0 ? 1 - sse / syy : 1, n, sse };
}

/** Scan θ and keep the one that makes z against χ straightest (largest R²). */
export function bestTheta(p: Profile, A0 = 1, from = 0.05, to = 1.5, step = 0.01) {
  const scan: { theta: number; r2: number }[] = [];
  for (let k = 0; from + k * step <= to + 1e-9; k++) { const t = +(from + k * step).toFixed(10); scan.push({ theta: t, r2: lsq(chi(p, t, A0), p.z).r2 }); }
  let best = scan[0];
  for (const s of scan) if (s.r2 > best.r2) best = s;
  return { theta: best.theta, r2: best.r2, scan };
}

/** Local channel slope at each node: central difference, one-sided at the ends. */
export function slopes(p: Profile): number[] {
  const n = p.x.length;
  return p.x.map((_, i) => { const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1); return (p.z[b] - p.z[a]) / (p.x[b] - p.x[a]); });
}

/** Slope-area: log-binned means (perBin bins per decade of area, positive slopes only) and the fit log S = log ks − θ log A. */
export function slopeArea(p: Profile, perDecade = 10, minInBin = 1) {
  const S = slopes(p), bins = new Map<number, { la: number; ls: number; n: number }>();
  p.A.forEach((a, i) => {
    if (!(S[i] > 0 && a > 0)) return;
    const k = Math.floor(Math.log10(a) * perDecade + 1e-12), b = bins.get(k) ?? { la: 0, ls: 0, n: 0 };
    b.la += Math.log10(a); b.ls += Math.log10(S[i]); b.n++; bins.set(k, b);
  });
  const pts = [...bins.entries()].sort((a, b) => a[0] - b[0]).filter(([, b]) => b.n >= minInBin).map(([, b]) => ({ A: 10 ** (b.la / b.n), S: 10 ** (b.ls / b.n), n: b.n }));
  const f = pts.length >= 2 ? lsq(pts.map((q) => Math.log10(q.A)), pts.map((q) => Math.log10(q.S))) : null;
  return { S, bins: pts, fit: f ? { theta: -f.slope, ks: 10 ** f.icpt, r2: f.r2 } : null };
}

/**
 * Segmented straight-line fits of z against χ with 0, 1 or 2 breaks (each segment fitted on its own, at least
 * `minPts` nodes), choosing the number of breaks by BIC. Breaks are knickpoint hints.
 */
export function segments(c: number[], z: number[], minPts = 5, maxBreaks = 2) {
  const n = c.length, P = (a: number[]) => { const o = [0]; for (const v of a) o.push(o[o.length - 1] + v); return o; };
  const Sx = P(c), Sy = P(z), Sxx = P(c.map((v) => v * v)), Sxy = P(c.map((v, i) => v * z[i])), Syy = P(z.map((v) => v * v));
  // Fit on nodes [a, b): returns SSE and slope.
  const seg = (a: number, b: number) => {
    const m = b - a, sx = Sx[b] - Sx[a], sy = Sy[b] - Sy[a], sxx = Sxx[b] - Sxx[a] - (sx * sx) / m, sxy = Sxy[b] - Sxy[a] - (sx * sy) / m, syy = Syy[b] - Syy[a] - (sy * sy) / m;
    const slope = sxx > 0 ? sxy / sxx : 0;
    return { sse: Math.max(0, syy - slope * sxy), slope, icpt: (sy - slope * sx) / m };
  };
  const bic = (sse: number, k: number) => n * Math.log(Math.max(sse, 1e-300) / n) + k * Math.log(n);
  const cands: { breaks: number[]; sse: number; bic: number }[] = [];
  const s0 = seg(0, n).sse; cands.push({ breaks: [], sse: s0, bic: bic(s0, 2) });
  if (maxBreaks >= 1) {
    let best = { b: -1, sse: Infinity };
    for (let b = minPts; b <= n - minPts; b++) { const s = seg(0, b).sse + seg(b, n).sse; if (s < best.sse) best = { b, sse: s }; }
    if (best.b > 0) cands.push({ breaks: [best.b], sse: best.sse, bic: bic(best.sse, 5) });
  }
  if (maxBreaks >= 2) {
    let best = { a: -1, b: -1, sse: Infinity };
    for (let a = minPts; a <= n - 2 * minPts; a++) { const s1 = seg(0, a).sse; if (s1 >= best.sse) continue; for (let b = a + minPts; b <= n - minPts; b++) { const s = s1 + seg(a, b).sse + seg(b, n).sse; if (s < best.sse) best = { a, b, sse: s }; } }
    if (best.a > 0) cands.push({ breaks: [best.a, best.b], sse: best.sse, bic: bic(best.sse, 8) });
  }
  let pick = cands[0];
  for (const k of cands) if (k.bic < pick.bic - 1e-9) pick = k;
  const edges = [0, ...pick.breaks, n];
  const fits = edges.slice(0, -1).map((a, k) => ({ from: a, to: edges[k + 1], ...seg(a, edges[k + 1]) }));
  return { breaks: pick.breaks, fits, cands };
}

/** A made-up steady-state profile: Hack's law A = ka·(L − x)^h, S = ks·A^−θ, integrated exactly in χ. */
export function synthetic(n: number, L: number, ka: number, h: number, ks: number, theta: number, dHead = 0): Profile {
  const x = Array.from({ length: n }, (_, i) => (i * (L - dHead)) / (n - 1)), A = x.map((v) => ka * (L - v) ** h);
  const p: Profile = { x, z: x.map(() => 0), A };
  const c = chi(p, theta, 1);
  p.z = c.map((v) => ks * v);
  return p;
}
