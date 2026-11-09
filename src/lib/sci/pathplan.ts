// Path planning on an occupancy grid: A* and Dijkstra (4- or 8-connected, no cutting past blocked corners), and
// RRT in continuous space with the same blocked cells as square obstacles. Plain maths, no DOM.
import { rng } from './kalman.ts';

export type Grid = { w: number; h: number; wall: Uint8Array };
export type Cell = [number, number];
export type GridResult = { path: Cell[]; length: number; expanded: number; order: number[]; found: boolean };

export const makeGrid = (w: number, h: number): Grid => ({ w, h, wall: new Uint8Array(w * h) });
export const free = (g: Grid, x: number, y: number) => x >= 0 && y >= 0 && x < g.w && y < g.h && !g.wall[y * g.w + x];

/** Parse rows of text: '#' (or 1) is a wall, anything else is free; 'S' and 'G' mark start and goal. */
export function parseGrid(rows: string[]): { g: Grid; start: Cell | null; goal: Cell | null } {
  const h = rows.length, w = Math.max(...rows.map((r) => r.length)), g = makeGrid(w, h);
  let start: Cell | null = null, goal: Cell | null = null;
  rows.forEach((r, y) => { for (let x = 0; x < w; x++) { const c = r[x] ?? '.'; if (c === '#' || c === '1') g.wall[y * w + x] = 1; if (c === 'S') start = [x, y]; if (c === 'G') goal = [x, y]; } });
  return { g, start, goal };
}

/** A* (or Dijkstra with useH = false). Moves cost 1 straight and √2 diagonally; a diagonal needs both side cells free. */
export function astar(g: Grid, s: Cell, t: Cell, eight: boolean, useH = true): GridResult {
  const N = g.w * g.h, id = (x: number, y: number) => y * g.w + x;
  const G = new Float64Array(N).fill(Infinity), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
  const D = Math.SQRT2;
  const h = (x: number, y: number) => {
    if (!useH) return 0;
    const dx = Math.abs(x - t[0]), dy = Math.abs(y - t[1]);
    return eight ? Math.max(dx, dy) + (D - 1) * Math.min(dx, dy) : dx + dy;
  };
  // Binary heap of [f, h, seq, node].
  const heap: [number, number, number, number][] = [];
  const less = (a: [number, number, number, number], b: [number, number, number, number]) => a[0] < b[0] - 1e-12 || (Math.abs(a[0] - b[0]) <= 1e-12 && (a[1] < b[1] - 1e-12 || (Math.abs(a[1] - b[1]) <= 1e-12 && a[2] < b[2])));
  const push = (e: [number, number, number, number]) => { heap.push(e); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (!less(heap[i], heap[p])) break; [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop()!; if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && less(heap[l], heap[m])) m = l; if (r < heap.length && less(heap[r], heap[m])) m = r; if (m === i) break; [heap[i], heap[m]] = [heap[m], heap[i]]; i = m; } } return top; };
  const moves: [number, number, number][] = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1]];
  if (eight) moves.push([1, 1, D], [1, -1, D], [-1, 1, D], [-1, -1, D]);
  const order: number[] = [];
  let seq = 0;
  if (!free(g, ...s) || !free(g, ...t)) return { path: [], length: NaN, expanded: 0, order, found: false };
  G[id(...s)] = 0; push([h(...s), h(...s), seq++, id(...s)]);
  const goal = id(...t);
  while (heap.length) {
    const [, , , u] = pop();
    if (closed[u]) continue;
    closed[u] = 1; order.push(u);
    if (u === goal) break;
    const ux = u % g.w, uy = (u - ux) / g.w;
    for (const [dx, dy, c] of moves) {
      const x = ux + dx, y = uy + dy;
      if (!free(g, x, y)) continue;
      if (dx && dy && (!free(g, ux + dx, uy) || !free(g, ux, uy + dy))) continue;
      const v = id(x, y), ng = G[u] + c;
      if (ng < G[v] - 1e-12) { G[v] = ng; came[v] = u; const hv = h(x, y); push([ng + hv, hv, seq++, v]); }
    }
  }
  if (!closed[goal]) return { path: [], length: NaN, expanded: order.length, order, found: false };
  const path: Cell[] = [];
  for (let v = goal; v !== -1; v = came[v]) path.push([v % g.w, Math.floor(v / g.w)]);
  path.reverse();
  return { path, length: G[goal], expanded: order.length, order, found: true };
}

/** Does the segment (in cell units, cell (x, y) covers [x, x+1] × [y, y+1]) touch a blocked cell or leave the grid? */
export function segmentBlocked(g: Grid, ax: number, ay: number, bx: number, by: number): boolean {
  if ([ax, bx].some((v) => v < 0 || v > g.w) || [ay, by].some((v) => v < 0 || v > g.h)) return true;
  const x0 = Math.max(0, Math.floor(Math.min(ax, bx))), x1 = Math.min(g.w - 1, Math.floor(Math.max(ax, bx)));
  const y0 = Math.max(0, Math.floor(Math.min(ay, by))), y1 = Math.min(g.h - 1, Math.floor(Math.max(ay, by)));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!g.wall[y * g.w + x]) continue;
    // Slab test against the closed box [x, x+1] × [y, y+1].
    let t0 = 0, t1 = 1;
    const dx = bx - ax, dy = by - ay;
    let hit = true;
    for (const [p, d, lo, hi] of [[ax, dx, x, x + 1], [ay, dy, y, y + 1]] as [number, number, number, number][]) {
      if (Math.abs(d) < 1e-15) { if (p < lo || p > hi) { hit = false; break; } }
      else { let a = (lo - p) / d, b = (hi - p) / d; if (a > b) [a, b] = [b, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, b); if (t0 > t1) { hit = false; break; } }
    }
    if (hit) return true;
  }
  return false;
}

export type RrtOpts = { step: number; iters: number; bias: number; tol: number; seed: number; smooth: boolean };
export type RrtResult = { nodes: [number, number][]; parent: number[]; path: [number, number][]; raw: [number, number][]; length: number; rawLength: number; found: boolean; iterations: number };
const plen = (p: [number, number][]) => p.reduce((a, q, i) => (i ? a + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0);

/** Basic RRT from the centre of the start cell towards the centre of the goal cell, with goal bias and optional shortcut smoothing. */
export function rrt(g: Grid, s: Cell, t: Cell, o: RrtOpts): RrtResult {
  const r = rng(o.seed), S: [number, number] = [s[0] + 0.5, s[1] + 0.5], T: [number, number] = [t[0] + 0.5, t[1] + 0.5];
  const nodes: [number, number][] = [S], parent: number[] = [-1];
  let goalIdx = -1, it = 0;
  for (; it < o.iters && goalIdx < 0; it++) {
    const q: [number, number] = r.u() < o.bias ? T : [r.u() * g.w, r.u() * g.h];
    let best = 0, bd = Infinity;
    for (let i = 0; i < nodes.length; i++) { const d = (nodes[i][0] - q[0]) ** 2 + (nodes[i][1] - q[1]) ** 2; if (d < bd) { bd = d; best = i; } }
    const n = nodes[best], d = Math.sqrt(bd);
    if (d < 1e-12) continue;
    const k = Math.min(1, o.step / d), nw: [number, number] = [n[0] + (q[0] - n[0]) * k, n[1] + (q[1] - n[1]) * k];
    if (segmentBlocked(g, n[0], n[1], nw[0], nw[1])) continue;
    nodes.push(nw); parent.push(best);
    if (Math.hypot(nw[0] - T[0], nw[1] - T[1]) <= o.tol && !segmentBlocked(g, nw[0], nw[1], T[0], T[1])) { nodes.push(T); parent.push(nodes.length - 2); goalIdx = nodes.length - 1; }
  }
  if (goalIdx < 0) return { nodes, parent, path: [], raw: [], length: NaN, rawLength: NaN, found: false, iterations: it };
  const raw: [number, number][] = [];
  for (let v = goalIdx; v !== -1; v = parent[v]) raw.push(nodes[v]);
  raw.reverse();
  let path = raw;
  if (o.smooth) {
    // Greedy shortcut: from each kept point, jump to the furthest later point in plain sight.
    path = [raw[0]];
    let i = 0;
    while (i < raw.length - 1) { let j = raw.length - 1; while (j > i + 1 && segmentBlocked(g, raw[i][0], raw[i][1], raw[j][0], raw[j][1])) j--; path.push(raw[j]); i = j; }
  }
  return { nodes, parent, path, raw, length: plen(path), rawLength: plen(raw), found: true, iterations: it };
}
