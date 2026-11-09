// 2D electrostatics: electrodes on a square grid, Laplace's equation solved by successive over-relaxation,
// then the field, the charge on each electrode (from the discrete Gauss law) and the capacitance per metre.
// Positions in metres from the centre of a square of side L; n × n nodes, spacing h = L/(n − 1). No DOM.
import { EPS0 } from './ph-capind.ts';

export type Shape =
  | { kind: 'circle'; x: number; y: number; r: number; v: number }
  | { kind: 'ring'; x: number; y: number; r: number; v: number }
  | { kind: 'rect'; x1: number; y1: number; x2: number; y2: number; v: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; v: number };
export type Grid = { n: number; L: number; h: number; fixed: Uint8Array; val: Float64Array };

export const nodeX = (g: { n: number; L: number }, i: number) => -g.L / 2 + (i * g.L) / (g.n - 1);

function segDist(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2)) : 0;
  return Math.hypot(px - x1 - t * dx, py - y1 - t * dy);
}

/** Does node (x, y) belong to the shape? Thin shapes (ring, line) take every node within 0.75 h, so they are closed on the grid. */
export function inShape(s: Shape, x: number, y: number, h: number): boolean {
  const w = 0.75 * h, e = 1e-9 * h; // e: so that rounding never makes a shape lopsided
  switch (s.kind) {
    case 'circle': return Math.hypot(x - s.x, y - s.y) <= Math.max(s.r, w) + e;
    case 'ring': return Math.abs(Math.hypot(x - s.x, y - s.y) - s.r) <= w + e;
    case 'rect': return x >= Math.min(s.x1, s.x2) - 1e-12 && x <= Math.max(s.x1, s.x2) + 1e-12 && y >= Math.min(s.y1, s.y2) - 1e-12 && y <= Math.max(s.y1, s.y2) + 1e-12;
    case 'line': return segDist(x, y, s.x1, s.y1, s.x2, s.y2) <= w + e;
  }
}

/** A grid with the shapes' nodes held at their voltages (later shapes win where they overlap). */
export function rasterize(shapes: Shape[], n: number, L: number): Grid {
  const h = L / (n - 1), fixed = new Uint8Array(n * n), val = new Float64Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = -L / 2 + i * h, y = -L / 2 + j * h;
    for (const s of shapes) if (inShape(s, x, y, h)) { fixed[j * n + i] = 1; val[j * n + i] = s.v; }
  }
  return { n, L, h, fixed, val };
}

/**
 * Solve ∇²V = 0 between the fixed nodes by SOR. Boundary 'ground': the outer edge is held at 0 V;
 * 'open': no field crosses the edge (∂V/∂n = 0), a rough stand-in for open space when the box is large.
 * Stops when the largest change in a sweep is below tol × the voltage range.
 */
export function solve(g: Grid, boundary: 'ground' | 'open', tol = 1e-9, maxIter = 50000): { V: Float64Array; iters: number; change: number } {
  const { n, fixed, val } = g, V = new Float64Array(val);
  const edge = (i: number, j: number) => i === 0 || j === 0 || i === n - 1 || j === n - 1;
  let vmin = 0, vmax = 0;
  for (let k = 0; k < n * n; k++) if (fixed[k]) { vmin = Math.min(vmin, val[k]); vmax = Math.max(vmax, val[k]); }
  const range = vmax - vmin || 1;
  if (boundary === 'ground') { for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) if (edge(i, j) && !fixed[j * n + i]) V[j * n + i] = 0; }
  else { const mid = (vmin + vmax) / 2; for (let k = 0; k < n * n; k++) if (!fixed[k]) V[k] = mid; }
  const w = 2 / (1 + Math.sin(Math.PI / (n - 1)));
  let iters = 0, change = Infinity;
  for (; iters < maxIter && change > tol * range; iters++) {
    change = 0;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const k = j * n + i;
      if (fixed[k]) continue;
      let s: number;
      if (edge(i, j)) {
        if (boundary === 'ground') continue;
        // Mirror the missing neighbour (zero normal derivative).
        const l = i > 0 ? V[k - 1] : V[k + 1], r = i < n - 1 ? V[k + 1] : V[k - 1], d = j > 0 ? V[k - n] : V[k + n], u = j < n - 1 ? V[k + n] : V[k - n];
        s = (l + r + d + u) / 4;
      } else s = (V[k - 1] + V[k + 1] + V[k - n] + V[k + n]) / 4;
      const dv = w * (s - V[k]);
      V[k] += dv;
      if (Math.abs(dv) > change) change = Math.abs(dv);
    }
  }
  return { V, iters, change };
}

/** Electric field at node (i, j) by central differences (one-sided at the edge), V/m. */
export function fieldAt(V: Float64Array, g: Grid, i: number, j: number): [number, number] {
  const { n, h } = g, k = j * n + i;
  const ex = i === 0 ? -(V[k + 1] - V[k]) / h : i === n - 1 ? -(V[k] - V[k - 1]) / h : -(V[k + 1] - V[k - 1]) / (2 * h);
  const ey = j === 0 ? -(V[k + n] - V[k]) / h : j === n - 1 ? -(V[k] - V[k - n]) / h : -(V[k + n] - V[k - n]) / (2 * h);
  return [ex, ey];
}

/** Potential and field at any point: bilinear interpolation of V and of the nodal (central-difference) field. */
export function probe(V: Float64Array, g: Grid, x: number, y: number): { v: number; ex: number; ey: number } {
  const { n, L, h } = g, fx = (x + L / 2) / h, fy = (y + L / 2) / h;
  const i = Math.max(0, Math.min(n - 2, Math.floor(fx))), j = Math.max(0, Math.min(n - 2, Math.floor(fy))), u = Math.max(0, Math.min(1, fx - i)), t = Math.max(0, Math.min(1, fy - j));
  const wts = [(1 - u) * (1 - t), u * (1 - t), (1 - u) * t, u * t], nodes: [number, number][] = [[i, j], [i + 1, j], [i, j + 1], [i + 1, j + 1]];
  let v = 0, ex = 0, ey = 0;
  nodes.forEach(([a, b], k) => { const e = fieldAt(V, g, a, b); v += wts[k] * V[b * n + a]; ex += wts[k] * e[0]; ey += wts[k] * e[1]; });
  return { v, ex, ey };
}

/**
 * Charge per metre on the nodes held at each voltage, from the discrete Gauss law: q = ε0 εr (4V − ΣV_neighbours)
 * at every fixed node (in 2D the grid spacing cancels). Edge nodes of a grounded box are counted as "box".
 */
export function charges(V: Float64Array, g: Grid, boundary: 'ground' | 'open', er = 1): { byVolt: Map<number, number>; box: number } {
  const { n, fixed } = g, byVolt = new Map<number, number>();
  let box = 0;
  const get = (i: number, j: number) => V[j * n + i];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const k = j * n + i, edge = i === 0 || j === 0 || i === n - 1 || j === n - 1;
    if (!fixed[k] && !(edge && boundary === 'ground')) continue;
    let s = 0;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = i + di, b = j + dj;
      // A neighbour outside the grid: 0 V beyond a grounded box; the mirror image for an open edge.
      if (a < 0 || b < 0 || a >= n || b >= n) s += boundary === 'open' ? get(i - di, j - dj) : 0;
      else s += get(a, b);
    }
    const q = EPS0 * er * (4 * V[k] - s);
    if (fixed[k]) byVolt.set(V[k], (byVolt.get(V[k]) ?? 0) + q); else box += q;
  }
  return { byVolt, box };
}

/** Field energy per metre, ½ ε0 εr Σ |E|² h², summed over the cells (central differences at cell centres). */
export function energy(V: Float64Array, g: Grid, er = 1): number {
  const { n, h } = g;
  let s = 0;
  for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) {
    const a = V[j * n + i], b = V[j * n + i + 1], c = V[(j + 1) * n + i], d = V[(j + 1) * n + i + 1];
    const ex = ((b - a) + (d - c)) / (2 * h), ey = ((c - a) + (d - b)) / (2 * h);
    s += ex * ex + ey * ey;
  }
  return 0.5 * EPS0 * er * s * h * h;
}
