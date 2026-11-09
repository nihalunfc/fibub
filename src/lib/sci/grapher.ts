// Maths for the graphing calculator: reads a curve typed the way people write it (y = …, an equation
// in x and y, r = … in θ, or a pair (x(t), y(t))), samples it into polylines that break at
// asymptotes and domain edges, traces implicit curves with marching squares, and finds roots,
// turning points and crossings. Plain TypeScript, no DOM.
import { parse, compile, variables, ExprError, type Node } from './expr.ts';

export type Kind = 'explicit' | 'implicit' | 'polar' | 'parametric';
export type Pt = [number, number];
export type Piece = Pt[];
export const KIND_LABEL: Record<Kind, string> = { explicit: 'y = f(x)', implicit: 'Equation in x and y', polar: 'Polar r(θ)', parametric: 'Parametric (x(t), y(t))' };

export type Fns = { f?: (x: number) => number; F?: (x: number, y: number) => number; r?: (th: number) => number; px?: (t: number) => number; py?: (t: number) => number };
export type CurveSpec = { kind: Kind; params: string[]; make: (p: Record<string, number>) => Fns };
export type SurfaceSpec = { params: string[]; make: (p: Record<string, number>) => (x: number, y: number) => number };

const THETA = new Set(['θ', 'theta']);
/** Split at commas that are not inside brackets. */
function topSplit(s: string, ch: string): string[] {
  const out: string[] = []; let depth = 0, last = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(' || c === '[') depth++; else if (c === ')' || c === ']') depth--;
    else if (c === ch && depth === 0) { out.push(s.slice(last, i)); last = i + 1; }
  }
  out.push(s.slice(last)); return out;
}
/** True when the whole string is one bracketed group "( … )". */
function wrapped(s: string): boolean {
  if (!s.startsWith('(') || !s.endsWith(')')) return false;
  let depth = 0;
  for (let i = 0; i < s.length; i++) { if (s[i] === '(') depth++; else if (s[i] === ')') { depth--; if (depth === 0 && i < s.length - 1) return false; } }
  return true;
}
const P = (s: string, where = '') => { try { return parse(s); } catch (e) { if (e instanceof ExprError) throw new ExprError(e.message + where, e.at); throw e; } };

/** Free names that are neither the curve's own variables nor e: one-letter parameters (sliders). */
function paramsOf(nodes: Node[], own: string[]): string[] {
  const out: string[] = [];
  for (const n of nodes) for (const v of variables(n)) {
    if (own.includes(v) || v === 'e' || out.includes(v)) continue;
    if (THETA.has(v)) throw new ExprError('θ only belongs in a polar curve, r = …', 0);
    if (v.length > 1) throw new ExprError(`"${v}" is not a name this tool knows. Write functions with brackets, like sin(x), and put * between letters, like a*x`, 0);
    out.push(v);
  }
  if (out.length > 4) throw new ExprError('Use at most 4 slider letters (such as a, b, c, k)', 0);
  return out;
}
/** Compile with the curve's variables first, then e and the parameters. */
function fn(n: Node, own: string[], params: string[]) {
  const names = [...own, 'e', ...params];
  const g = compile(n, names);
  return (p: Record<string, number>) => {
    const v = new Float64Array(names.length); v[own.length] = Math.E;
    params.forEach((k, i) => (v[own.length + 1 + i] = p[k] ?? 1));
    return { g, v, k: own.length };
  };
}
const thetaName = (n: Node[]) => { for (const x of n) for (const v of variables(x)) if (THETA.has(v)) return v; return 'θ'; };

/** Read one typed curve. Throws ExprError with a plain message when it cannot. */
export function readCurve(src: string): CurveSpec {
  const s = src.trim().replace(/\s+$/, '');
  if (!s) throw new ExprError('Type a formula', 0);
  if (wrapped(s)) {
    const parts = topSplit(s.slice(1, -1), ',');
    if (parts.length === 2) {
      const a = P(parts[0], ' (in x(t))'), b = P(parts[1], ' (in y(t))');
      for (const v of [...variables(a), ...variables(b)]) if (v === 'x' || v === 'y') throw new ExprError('A pair (x(t), y(t)) uses t, not x or y', 0);
      const params = paramsOf([a, b], ['t']), ma = fn(a, ['t'], params), mb = fn(b, ['t'], params);
      return { kind: 'parametric', params, make: (p) => { const A = ma(p), B = mb(p); return { px: (t) => { A.v[0] = t; return A.g(A.v); }, py: (t) => { B.v[0] = t; return B.g(B.v); } }; } };
    }
  }
  const sides = topSplit(s, '=');
  if (sides.length > 2) throw new ExprError('Use one = sign', s.lastIndexOf('='));
  if (sides.length === 2 && (!sides[0].trim() || !sides[1].trim())) throw new ExprError('Something is missing on one side of the = sign', s.indexOf('='));
  const lhs = sides[0].trim(), rhs = sides.length === 2 ? sides[1].trim() : null;
  const explicit = (body: string): CurveSpec => {
    const n = P(body); const vs = variables(n);
    if (vs.includes('y')) throw new ExprError('y appears on both sides: that is an equation, so write it without "y =" in front, for example x^2 + y^2 = 4', 0);
    const params = paramsOf([n], ['x']), m = fn(n, ['x'], params);
    return { kind: 'explicit', params, make: (p) => { const A = m(p); return { f: (x) => { A.v[0] = x; return A.g(A.v); } }; } };
  };
  if (rhs === null) {
    const n = P(lhs);
    if (!variables(n).includes('y')) return explicit(lhs);
    return implicitOf(n, null);
  }
  const hasY = (t: string) => variables(P(t)).includes('y');
  if (lhs === 'y' && !hasY(rhs)) return explicit(rhs);
  if (rhs === 'y' && !hasY(lhs)) return explicit(lhs);
  if (lhs === 'r') {
    const n = P(rhs); const vs = variables(n);
    if (vs.includes('x') || vs.includes('y')) throw new ExprError('A polar curve r = … uses θ (type theta), not x or y', 0);
    const th = thetaName([n]);
    const params = paramsOf([n], [th, ...THETA, 'r'].filter((v, i, a) => a.indexOf(v) === i)), m = fn(n, [th], params);
    return { kind: 'polar', params, make: (p) => { const A = m(p); return { r: (t) => { A.v[0] = t; return A.g(A.v); } }; } };
  }
  return implicitOf(P(lhs), P(rhs));
}
function implicitOf(a: Node, b: Node | null): CurveSpec {
  const n: Node = b ? { t: 'bin', op: '-', a, b } : a;
  const vs = variables(n);
  if (!vs.includes('x') && !vs.includes('y')) throw new ExprError('The equation needs x or y in it', 0);
  const params = paramsOf([n], ['x', 'y']), m = fn(n, ['x', 'y'], params);
  return { kind: 'implicit', params, make: (p) => { const A = m(p); return { F: (x, y) => { A.v[0] = x; A.v[1] = y; return A.g(A.v); } }; } };
}

/** Read a surface "z = f(x, y)" (the "z =" is optional). */
export function readSurface(src: string): SurfaceSpec {
  let s = src.trim();
  const m = /^z\s*=(.*)$/s.exec(s); if (m) s = m[1];
  if (!s.trim()) throw new ExprError('Type a formula in x and y', 0);
  const n = P(s);
  if (variables(n).includes('z')) throw new ExprError('Write z = a formula in x and y, with no z on the right', 0);
  const params = paramsOf([n], ['x', 'y']), mk = fn(n, ['x', 'y'], params);
  return { params, make: (p) => { const A = mk(p); return (x, y) => { A.v[0] = x; A.v[1] = y; return A.g(A.v); }; } };
}

/** A constant typed in a box, such as "2pi" or "-3.5". NaN when it is not one. */
export function constant(s: string): number {
  try { const n = parse(s); const vs = variables(n).filter((v) => v !== 'e'); if (vs.length) return NaN; return compile(n, ['e'])([Math.E]); } catch { return NaN; }
}

const fin = Number.isFinite;
/** Does the function really jump between x0 and x1 (an asymptote or a step), or is it just steep? */
function jumps(f: (x: number) => number, x0: number, y0: number, x1: number, y1: number, tol: number): boolean {
  for (let k = 0; k < 48; k++) {
    const xm = (x0 + x1) / 2, ym = f(xm);
    if (!fin(ym)) return true;
    if (Math.abs(ym - y0) >= Math.abs(y1 - ym)) { x1 = xm; y1 = ym; } else { x0 = xm; y0 = ym; }
    if (Math.abs(y1 - y0) < tol) return false;
    if (x1 - x0 <= Math.abs(x0) * 4e-16) break;
  }
  return Math.abs(y1 - y0) >= tol;
}
/** The last x where f is still defined, between a defined point a and an undefined point b. */
function edge(f: (x: number) => number, a: number, b: number): number {
  for (let k = 0; k < 60; k++) { const m = (a + b) / 2; if (m === a || m === b) break; if (fin(f(m))) a = m; else b = m; }
  return a;
}

/** Sample y = f(x) across [xa, xb] into pieces, cut at asymptotes, jumps and the edges of its domain. `span` is the height of the view. */
export function sampleExplicit(f: (x: number) => number, xa: number, xb: number, span: number, n = 1600): Piece[] {
  const out: Piece[] = []; let cur: Piece = [];
  const end = () => { if (cur.length > 1) out.push(cur); else if (cur.length === 1) out.push(cur); cur = []; };
  let px = xa, py = f(xa);
  if (fin(py)) cur.push([px, py]);
  for (let i = 1; i <= n; i++) {
    const x = xa + ((xb - xa) * i) / n, y = f(x);
    if (fin(py) && fin(y)) {
      if (Math.abs(y - py) > span * 0.05 && jumps(f, px, py, x, y, span * 0.02)) { end(); cur.push([x, y]); }
      else cur.push([x, y]);
    } else if (fin(py) && !fin(y)) { const e = edge(f, px, x); if (e !== px) cur.push([e, f(e)]); end(); }
    else if (!fin(py) && fin(y)) { const e = edge(f, x, px); if (e !== x) cur.push([e, f(e)]); cur.push([x, y]); }
    px = x; py = y;
  }
  end();
  return out.filter((p) => p.length > 1);
}

/** Sample a curve (x(t), y(t)) for t in [t0, t1]; `span` is the size of the view, used to find breaks. */
export function sampleParametric(px: (t: number) => number, py: (t: number) => number, t0: number, t1: number, span: number, n = 2400): Piece[] {
  const out: Piece[] = []; let cur: Piece = [];
  const end = () => { if (cur.length > 1) out.push(cur); cur = []; };
  const d = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const at = (t: number): Pt => [px(t), py(t)];
  const ok = (p: Pt) => fin(p[0]) && fin(p[1]);
  const jump = (ta: number, a: Pt, tb: number, b: Pt) => {
    for (let k = 0; k < 48; k++) {
      const tm = (ta + tb) / 2, m = at(tm);
      if (!ok(m)) return true;
      if (d(a, m) >= d(m, b)) { tb = tm; b = m; } else { ta = tm; a = m; }
      if (d(a, b) < span * 0.02) return false;
    }
    return d(a, b) >= span * 0.02;
  };
  let tp = t0, p = at(t0);
  if (ok(p)) cur.push(p);
  for (let i = 1; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n, q = at(t);
    if (ok(p) && ok(q)) { if (d(p, q) > span * 0.05 && jump(tp, p, t, q)) end(); cur.push(q); }
    else if (ok(q)) cur.push(q);
    else end();
    tp = t; p = q;
  }
  end();
  return out;
}
export function samplePolar(r: (th: number) => number, t0: number, t1: number, span: number, n = 2400): Piece[] {
  return sampleParametric((t) => r(t) * Math.cos(t), (t) => r(t) * Math.sin(t), t0, t1, span, n);
}

/**
 * Trace F(x, y) = 0 over the box with marching squares on an nx × ny grid. Each crossing is
 * placed by bisection along the cell edge, and crossings where |F| blows up (a pole, as in
 * 1/x = y written as x·y = 1's cousin 1/(x - y) = 0) are dropped.
 */
export function contour(F: (x: number, y: number) => number, xa: number, xb: number, ya: number, yb: number, nx: number, ny: number): Piece[] {
  const W = nx + 1, xs = new Float64Array(W), ys = new Float64Array(ny + 1), v = new Float64Array(W * (ny + 1));
  for (let i = 0; i <= nx; i++) xs[i] = xa + ((xb - xa) * i) / nx;
  for (let j = 0; j <= ny; j++) ys[j] = ya + ((yb - ya) * j) / ny;
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) v[j * W + i] = F(xs[i], ys[j]);
  const pos = (z: number) => z > 0;
  const pts = new Map<number, Pt | null>();
  // Edge ids: horizontal edge (i, j)→(i+1, j) is 2·(j·W + i), vertical (i, j)→(i, j+1) is 2·(j·W + i) + 1.
  const cross = (id: number): Pt | null => {
    if (pts.has(id)) return pts.get(id)!;
    const k = id >> 1, i = k % W, j = (k - i) / W, vert = id & 1;
    let ax = xs[i], ay = ys[j], bx = vert ? xs[i] : xs[i + 1], by = vert ? ys[j + 1] : ys[j];
    let fa = v[k]; const fb = vert ? v[k + W] : v[k + 1];
    const big = Math.max(Math.abs(fa), Math.abs(fb));
    const sa = pos(fa);
    for (let s = 0; s < 40; s++) {
      const mx = (ax + bx) / 2, my = (ay + by) / 2, fm = F(mx, my);
      if (!fin(fm)) { pts.set(id, null); return null; }
      if (pos(fm) === sa) { ax = mx; ay = my; fa = fm; } else { bx = mx; by = my; }
    }
    const x = (ax + bx) / 2, y = (ay + by) / 2, fx = F(x, y);
    const p: Pt | null = fin(fx) && Math.abs(fx) <= big ? [x, y] : null;
    pts.set(id, p); return p;
  };
  const segs: [number, number][] = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const k = j * W + i, a = v[k], b = v[k + 1], c = v[k + W + 1], dd = v[k + W];
    if (!fin(a) || !fin(b) || !fin(c) || !fin(dd)) continue;
    const idx = (pos(a) ? 1 : 0) | (pos(b) ? 2 : 0) | (pos(c) ? 4 : 0) | (pos(dd) ? 8 : 0);
    if (idx === 0 || idx === 15) continue;
    const S = 2 * k, E = 2 * (k + 1) + 1, N = 2 * (k + W), Wv = 2 * k + 1; // bottom, right, top, left edges
    const add = (p: number, q: number) => segs.push([p, q]);
    switch (idx) {
      case 1: case 14: add(S, Wv); break;
      case 2: case 13: add(S, E); break;
      case 3: case 12: add(Wv, E); break;
      case 4: case 11: add(E, N); break;
      case 6: case 9: add(S, N); break;
      case 7: case 8: add(Wv, N); break;
      case 5: case 10: {
        const mid = F((xs[i] + xs[i + 1]) / 2, (ys[j] + ys[j + 1]) / 2), mpos = pos(mid);
        // Corners a and c share a sign; the centre decides whether they connect.
        if ((idx === 5) === mpos) { add(S, E); add(N, Wv); } else { add(S, Wv); add(E, N); }
        break;
      }
    }
  }
  // Join segments into polylines.
  const adj = new Map<number, number[]>();
  const live = segs.filter(([p, q]) => cross(p) && cross(q));
  live.forEach(([p, q], s) => { for (const e of [p, q]) { const l = adj.get(e); if (l) l.push(s); else adj.set(e, [s]); } });
  const used = new Uint8Array(live.length), out: Piece[] = [];
  const walk = (start: number, from: number, line: number[]) => {
    let s = start, e = from;
    while (s >= 0 && !used[s]) {
      used[s] = 1;
      const [p, q] = live[s]; const nxt = p === e ? q : p;
      line.push(nxt); e = nxt;
      s = (adj.get(e) ?? []).find((t) => !used[t]) ?? -1;
    }
  };
  // Start at open ends first so open curves come out in one piece.
  const order = [...adj.entries()].sort((A, B) => A[1].length - B[1].length).map(([e]) => e);
  for (const e of order) for (const s of adj.get(e)!) {
    if (used[s]) continue;
    const line = [e]; walk(s, e, line);
    out.push(line.map((id) => cross(id)!));
  }
  return out;
}

// ---------- Key points ----------
/** A root of f between a and b (f(a), f(b) of opposite signs), by bisection to full precision. */
export function bisect(f: (x: number) => number, a: number, b: number): number {
  let fa = f(a);
  for (let k = 0; k < 200; k++) {
    const m = (a + b) / 2; if (m === a || m === b) break;
    const fm = f(m); if (fm === 0) return m;
    if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m;
  }
  return (a + b) / 2;
}
/** Minimum of f on [a, b] by golden-section search (f unimodal there), then a parabola step. */
function golden(f: (x: number) => number, a: number, b: number): number {
  const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a), d = a + g * (b - a), fc = f(c), fd = f(d);
  for (let k = 0; k < 120 && Math.abs(b - a) > 1e-15 * (Math.abs(a) + Math.abs(b) + 1e-300); k++) {
    if (fc < fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = f(c); } else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = f(d); }
  }
  return (a + b) / 2;
}

export type KeyPoint = { what: 'root' | 'max' | 'min' | 'y-intercept' | 'crossing'; x: number; y: number };
/** Roots, turning points and the y-intercept of y = f(x) for x in [xa, xb]. */
export function keyPoints(f: (x: number) => number, xa: number, xb: number, n = 4000): KeyPoint[] {
  const out: KeyPoint[] = [], xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= n; i++) { const x = xa + ((xb - xa) * i) / n; xs.push(x); ys.push(f(x)); }
  const scale = Math.max(1e-300, ...ys.filter(fin).map(Math.abs));
  const roots = rootsOf(f, xs, ys);
  for (const x of roots) out.push({ what: 'root', x, y: 0 });
  const h = (xb - xa) / n;
  for (let i = 1; i < n; i++) {
    const a = ys[i - 1], b = ys[i], c = ys[i + 1];
    if (!fin(a) || !fin(b) || !fin(c)) continue;
    const isMax = b > a && b >= c && !(b === c && i + 2 <= n && ys[i + 2] > c), isMin = b < a && b <= c && !(b === c && i + 2 <= n && ys[i + 2] < c);
    if (!isMax && !isMin) continue;
    if (jumps(f, xs[i - 1], a, xs[i + 1], c, Math.max(Math.abs(b - a), Math.abs(b - c), 1e-300))) continue;
    const x = golden(isMax ? (t) => -f(t) : f, xs[i - 1], xs[i + 1]), y = f(x);
    if (x - xa < h * 0.01 || xb - x < h * 0.01) continue;
    out.push({ what: isMax ? 'max' : 'min', x, y });
    // A turning point that touches the axis is a (double) root too.
    if (Math.abs(y) <= 1e-12 * scale && !roots.some((r) => Math.abs(r - x) < h)) out.push({ what: 'root', x, y: 0 });
  }
  if (xa <= 0 && xb >= 0) { const y = f(0); if (fin(y)) out.push({ what: 'y-intercept', x: 0, y }); }
  return out.sort((p, q) => p.x - q.x);
}
/** Sign changes of sampled values, each refined by bisection; poles (where |f| grows instead of shrinking) are left out. */
export function rootsOf(f: (x: number) => number, xs: number[], ys: number[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < xs.length; i++) {
    if (ys[i] === 0) { if (!out.length || out[out.length - 1] !== xs[i]) out.push(xs[i]); continue; }
    if (i === 0) continue;
    const a = ys[i - 1], b = ys[i];
    if (!fin(a) || !fin(b) || a === 0 || (a > 0) === (b > 0)) continue;
    const r = bisect(f, xs[i - 1], xs[i]), fr = f(r);
    if (!fin(fr) || Math.abs(fr) > Math.max(Math.abs(a), Math.abs(b))) continue;
    out.push(r);
  }
  return out;
}
/** Where y = f(x) meets y = g(x), for x in [xa, xb]. */
export function crossings(f: (x: number) => number, g: (x: number) => number, xa: number, xb: number, n = 4000): KeyPoint[] {
  const h = (x: number) => f(x) - g(x), xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= n; i++) { const x = xa + ((xb - xa) * i) / n; xs.push(x); ys.push(h(x)); }
  return rootsOf(h, xs, ys).map((x) => ({ what: 'crossing' as const, x, y: f(x) }));
}
/** Where y = f(x) meets the curve F(x, y) = 0, for x in [xa, xb]. */
export function crossingsImplicit(f: (x: number) => number, F: (x: number, y: number) => number, xa: number, xb: number, n = 4000): KeyPoint[] {
  const h = (x: number) => F(x, f(x)), xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= n; i++) { const x = xa + ((xb - xa) * i) / n; xs.push(x); ys.push(h(x)); }
  return rootsOf(h, xs, ys).map((x) => ({ what: 'crossing' as const, x, y: f(x) }));
}

/** Length of a polyline. */
export const pieceLength = (p: Piece) => { let s = 0; for (let i = 1; i < p.length; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return s; };

// ---------- 3D surface ----------
export type Grid = { xs: number[]; ys: number[]; z: number[][]; zmin: number; zmax: number; bad: number };
export function surfaceGrid(f: (x: number, y: number) => number, xa: number, xb: number, ya: number, yb: number, n: number): Grid {
  const xs: number[] = [], ys: number[] = [], z: number[][] = [];
  for (let i = 0; i <= n; i++) { xs.push(xa + ((xb - xa) * i) / n); ys.push(ya + ((yb - ya) * i) / n); }
  let zmin = Infinity, zmax = -Infinity, bad = 0;
  for (let j = 0; j <= n; j++) { const row: number[] = []; for (let i = 0; i <= n; i++) { const v = f(xs[i], ys[j]); if (fin(v)) { zmin = Math.min(zmin, v); zmax = Math.max(zmax, v); } else bad++; row.push(v); } z.push(row); }
  return { xs, ys, z, zmin, zmax, bad };
}
/** Turn (azimuth, about the vertical) then tilt (elevation) and project orthographically. Returns screen x, screen y (up) and depth (larger is nearer). */
export function project(x: number, y: number, z: number, az: number, el: number): [number, number, number] {
  const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el);
  const X = x * ca - y * sa, Y = x * sa + y * ca;
  return [X, z * ce + Y * se, -Y * ce + z * se];
}
