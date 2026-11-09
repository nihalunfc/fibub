// Watersheds from a DEM: fill depressions (Priority-Flood with an epsilon gradient, Barnes et al. 2014), D8 flow
// directions (O'Callaghan and Mark 1984), flow accumulation, stream network by threshold with Strahler order,
// pour-point snapping, the catchment of a point and its outline. No DOM. Cells are indexed row * w + col from the
// top-left; grids come from dem.ts.
import { rowSizes, type Grid } from './dem.ts';

export const MAX_CELLS = 1e6; // 1000 × 1000
// D8 neighbours in the order N, NE, E, SE, S, SW, W, NW, with their ESRI direction codes.
export const DR = [-1, -1, 0, 1, 1, 1, 0, -1], DC = [0, 1, 1, 1, 0, -1, -1, -1];
export const ESRI = [64, 128, 1, 2, 4, 8, 16, 32];
const OUTLET = -1, NODATA = -2;

/** The next float64 above x. */
export function nextUp(x: number) {
  if (Number.isNaN(x) || x === Infinity) return x;
  if (x === 0) return Number.MIN_VALUE;
  const b = new DataView(new ArrayBuffer(8)); b.setFloat64(0, x);
  let hi = b.getUint32(0), lo = b.getUint32(4);
  if (x > 0) { lo = (lo + 1) >>> 0; if (lo === 0) hi++; } else { if (lo === 0) hi--; lo = (lo - 1) >>> 0; }
  b.setUint32(0, hi); b.setUint32(4, lo); return b.getFloat64(0);
}

/** A binary min-heap of cell indices keyed by value, ties broken by insertion order (so results are repeatable). */
class Heap {
  k: number[] = []; i: number[] = []; s: number[] = []; n = 0;
  push(key: number, idx: number) {
    let j = this.k.length; this.k.push(key); this.i.push(idx); this.s.push(this.n++);
    while (j > 0) { const p = (j - 1) >> 1; if (this.less(j, p)) { this.swap(j, p); j = p; } else break; }
  }
  less(a: number, b: number) { return this.k[a] < this.k[b] || (this.k[a] === this.k[b] && this.s[a] < this.s[b]); }
  swap(a: number, b: number) { [this.k[a], this.k[b]] = [this.k[b], this.k[a]]; [this.i[a], this.i[b]] = [this.i[b], this.i[a]]; [this.s[a], this.s[b]] = [this.s[b], this.s[a]]; }
  pop() {
    const top = this.i[0], last = this.k.length - 1;
    this.swap(0, last); this.k.pop(); this.i.pop(); this.s.pop();
    let j = 0; const n = this.k.length;
    for (;;) { const l = 2 * j + 1, r = l + 1; let m = j; if (l < n && this.less(l, m)) m = l; if (r < n && this.less(r, m)) m = r; if (m === j) break; this.swap(j, m); j = m; }
    return top;
  }
  get size() { return this.k.length; }
}

/**
 * Priority-Flood depression filling. Cells on the grid edge or next to missing data are outlets. With eps (the
 * default) every filled cell is raised just above the cell it drains to, so flats drain too; without eps,
 * depressions are filled exactly flat (as most GIS "fill" tools do).
 */
export function fill(g: Grid, eps = true): { z: Float64Array; filled: number; maxDepth: number; volume: number } {
  const { w, h } = g, n = w * h, z = Float64Array.from(g.z), closed = new Uint8Array(n), open = new Heap(), pit: number[] = [];
  const { dxm, dym } = rowSizes(g);
  for (let i = 0; i < n; i++) {
    if (Number.isNaN(z[i])) { closed[i] = 1; continue; }
    const r = (i / w) | 0, c = i - r * w;
    let edge = r === 0 || c === 0 || r === h - 1 || c === w - 1;
    if (!edge) for (let k = 0; k < 8; k++) if (Number.isNaN(z[(r + DR[k]) * w + c + DC[k]])) { edge = true; break; }
    if (edge) { closed[i] = 1; open.push(z[i], i); }
  }
  let filled = 0, maxDepth = 0, volume = 0, pi = 0;
  while (open.size || pi < pit.length) {
    const c0 = pi < pit.length ? pit[pi++] : open.pop();
    if (pi > 4096 && pi === pit.length) { pit.length = 0; pi = 0; }
    const r = (c0 / w) | 0, c = c0 - r * w;
    for (let k = 0; k < 8; k++) {
      const rr = r + DR[k], cc = c + DC[k];
      if (rr < 0 || rr >= h || cc < 0 || cc >= w) continue;
      const j = rr * w + cc;
      if (closed[j]) continue;
      closed[j] = 1;
      const floor = eps ? nextUp(z[c0]) : z[c0];
      if (z[j] <= floor) {
        if (z[j] < floor) { const d = floor - z[j]; if (d > 1e-9 * Math.max(1, Math.abs(floor))) { filled++; volume += d * dxm[rr] * dym[rr]; if (d > maxDepth) maxDepth = d; } z[j] = floor; }
        pit.push(j);
      } else open.push(z[j], j);
    }
  }
  return { z, filled, maxDepth, volume };
}

/** D8 flow direction (0–7 as N, NE, E, SE, S, SW, W, NW; −1 outlet; −2 no data): steepest drop per metre of distance. */
export function d8(z: Float64Array, g: Grid): Int8Array {
  const { w, h } = g, dir = new Int8Array(w * h);
  const { dxm, dym } = rowSizes(g);
  for (let r = 0; r < h; r++) {
    const dx = dxm[r], dy = dym[r], dd = Math.hypot(dx, dy), dist = [dy, dd, dx, dd, dy, dd, dx, dd];
    for (let c = 0; c < w; c++) {
      const i = r * w + c, e = z[i];
      if (Number.isNaN(e)) { dir[i] = NODATA; continue; }
      let best = OUTLET, bs = 0;
      for (let k = 0; k < 8; k++) {
        const rr = r + DR[k], cc = c + DC[k];
        if (rr < 0 || rr >= h || cc < 0 || cc >= w) continue;
        const v = z[rr * w + cc];
        if (Number.isNaN(v)) continue;
        const s = (e - v) / dist[k];
        if (s > bs) { bs = s; best = k; }
      }
      dir[i] = best;
    }
  }
  return dir;
}
export const downstream = (dir: Int8Array, w: number, i: number) => (dir[i] < 0 ? -1 : i + DR[dir[i]] * w + DC[dir[i]]);

/** Number of cells draining through each cell, itself included (0 for no data). */
export function accumulate(dir: Int8Array, w: number): Float64Array {
  const n = dir.length, acc = new Float64Array(n), indeg = new Int32Array(n);
  for (let i = 0; i < n; i++) { if (dir[i] === NODATA) continue; acc[i] = 1; const d = downstream(dir, w, i); if (d >= 0) indeg[d]++; }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (dir[i] !== NODATA && indeg[i] === 0) q.push(i);
  for (let qi = 0; qi < q.length; qi++) { const i = q[qi], d = downstream(dir, w, i); if (d >= 0) { acc[d] += acc[i]; if (--indeg[d] === 0) q.push(d); } }
  return acc;
}

/** Strahler order of each stream cell (0 off the network). */
export function strahler(dir: Int8Array, w: number, stream: Uint8Array): Uint8Array {
  const n = dir.length, order = new Uint8Array(n), indeg = new Int32Array(n), maxIn = new Uint8Array(n), nMax = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (stream[i]) { const d = downstream(dir, w, i); if (d >= 0 && stream[d]) indeg[d]++; }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (stream[i] && indeg[i] === 0) { order[i] = 1; q.push(i); }
  for (let qi = 0; qi < q.length; qi++) {
    const i = q[qi], d = downstream(dir, w, i);
    if (d < 0 || !stream[d]) continue;
    if (order[i] > maxIn[d]) { maxIn[d] = order[i]; nMax[d] = 1; } else if (order[i] === maxIn[d]) nMax[d]++;
    if (--indeg[d] === 0) { order[d] = nMax[d] > 1 ? maxIn[d] + 1 : maxIn[d]; q.push(d); }
  }
  return order;
}

/** Stream cells as polylines (cell index lists), each from a channel head or junction down to the next junction or outlet. */
export function streamLines(dir: Int8Array, w: number, stream: Uint8Array, order: Uint8Array) {
  const n = dir.length, ups = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (stream[i]) { const d = downstream(dir, w, i); if (d >= 0 && stream[d]) ups[d]++; }
  const lines: { cells: number[]; order: number }[] = [];
  for (let i = 0; i < n; i++) {
    if (!stream[i] || ups[i] === 1) continue; // start at heads (0 upstream) and junctions (2 or more)
    let cur = i; const cells = [cur];
    for (;;) {
      const d = downstream(dir, w, cur);
      if (d < 0 || !stream[d]) break;
      cells.push(d);
      if (ups[d] !== 1) break; // reached a junction: the next line starts there
      cur = d;
    }
    if (cells.length > 1) lines.push({ cells, order: order[i] });
  }
  return lines;
}

/** The cell with the largest accumulation within radius cells of (r, c), the nearest one on ties. */
export function snap(acc: Float64Array, w: number, h: number, r: number, c: number, radius: number) {
  let best = r * w + c, ba = -1, bd = Infinity;
  for (let rr = Math.max(0, r - radius); rr <= Math.min(h - 1, r + radius); rr++) for (let cc = Math.max(0, c - radius); cc <= Math.min(w - 1, c + radius); cc++) {
    const d = (rr - r) ** 2 + (cc - c) ** 2; if (d > radius * radius) continue;
    const a = acc[rr * w + cc];
    if (a > ba || (a === ba && d < bd)) { ba = a; bd = d; best = rr * w + cc; }
  }
  return best;
}

/** All cells that drain to cell `out` (1 in the mask). */
export function catchment(dir: Int8Array, w: number, h: number, out: number): Uint8Array {
  const m = new Uint8Array(dir.length); m[out] = 1;
  const st = [out];
  while (st.length) {
    const i = st.pop()!, r = (i / w) | 0, c = i - r * w;
    for (let k = 0; k < 8; k++) {
      const rr = r + DR[k], cc = c + DC[k];
      if (rr < 0 || rr >= h || cc < 0 || cc >= w) continue;
      const j = rr * w + cc;
      if (!m[j] && dir[j] === ((k + 4) & 7)) { m[j] = 1; st.push(j); }
    }
  }
  return m;
}

/**
 * Outline of a mask along cell edges, as closed rings of grid corner points [col, row] (row 0 is the top edge).
 * Outer rings run clockwise as drawn (rows going down), which is also clockwise on a north-up map (the shapefile
 * convention); holes run the other way.
 * Cells touching only at a corner make separate rings.
 */
export function outline(mask: Uint8Array, w: number, h: number): number[][][] {
  const at = (r: number, c: number) => r >= 0 && r < h && c >= 0 && c < w && mask[r * w + c] === 1;
  // Directed boundary edges with the inside on the right (screen coordinates, y down): from corner to corner.
  const next = new Map<number, number[]>(), W1 = w + 1, key = (c: number, r: number) => r * W1 + c;
  const add = (c0: number, r0: number, c1: number, r1: number) => { const k = key(c0, r0); const a = next.get(k); if (a) a.push(key(c1, r1)); else next.set(k, [key(c1, r1)]); };
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
    if (!at(r, c)) continue;
    if (!at(r - 1, c)) add(c, r, c + 1, r);       // top edge, going east
    if (!at(r, c + 1)) add(c + 1, r, c + 1, r + 1); // right edge, going south
    if (!at(r + 1, c)) add(c + 1, r + 1, c, r + 1); // bottom edge, going west
    if (!at(r, c - 1)) add(c, r + 1, c, r);       // left edge, going north
  }
  const rings: number[][][] = [];
  const pt = (k: number) => [k % W1, Math.floor(k / W1)];
  for (const [start, outs] of next) {
    while (outs.length) {
      const ring: number[][] = [pt(start)];
      let prev = start, cur = outs.pop()!;
      while (cur !== start) {
        ring.push(pt(cur));
        const opts = next.get(cur)!;
        let pick = 0;
        if (opts.length > 1) {
          // At a corner shared by two diagonal cells, turn right (keep the inside cell's own boundary).
          const [px, py] = pt(prev), [cx, cy] = pt(cur), inx = cx - px, iny = cy - py;
          pick = opts.findIndex((o) => { const [ox, oy] = pt(o); return ox - cx === -iny && oy - cy === inx; });
          if (pick < 0) pick = 0;
        }
        prev = cur; cur = opts.splice(pick, 1)[0];
      }
      ring.push(pt(start));
      // Drop points in the middle of straight runs.
      const simple = ring.filter((p, k) => k === 0 || k === ring.length - 1 || !((ring[k - 1][0] === p[0] && p[0] === ring[k + 1][0]) || (ring[k - 1][1] === p[1] && p[1] === ring[k + 1][1])));
      rings.push(simple);
    }
  }
  return rings;
}

/** Length of the longest D8 flow path inside the mask (m), ending at the outlet. */
export function longestFlowPath(dir: Int8Array, g: Grid, mask: Uint8Array, out: number) {
  const { w } = g, { dxm, dym } = rowSizes(g);
  // Distance to the outlet along the flow, cell by cell, walking each path once with memoising.
  const dist = new Float64Array(dir.length).fill(-1);
  dist[out] = 0;
  let best = 0;
  const stepLen = (i: number) => { const k = dir[i], r = (i / w) | 0; return k % 2 ? Math.hypot(dxm[r], dym[r]) : k === 0 || k === 4 ? dym[r] : dxm[r]; };
  for (let i = 0; i < dir.length; i++) {
    if (!mask[i] || dist[i] >= 0) continue;
    const path: number[] = [];
    let cur = i;
    while (dist[cur] < 0) { path.push(cur); cur = downstream(dir, w, cur); if (cur < 0) break; }
    let d = cur >= 0 ? dist[cur] : 0;
    for (let k = path.length - 1; k >= 0; k--) { d += stepLen(path[k]); dist[path[k]] = d; }
    if (dist[i] > best) best = dist[i];
  }
  return best;
}

/** Ground area of the masked cells (m²) and the summed area of every cell, row by row. */
export function maskArea(g: Grid, mask: Uint8Array) {
  const { dxm, dym } = rowSizes(g); let s = 0;
  for (let r = 0; r < g.h; r++) { let n = 0; for (let c = 0; c < g.w; c++) n += mask[r * g.w + c]; s += n * dxm[r] * dym[r]; }
  return s;
}
/** Cell area (m²) of each row, to turn a threshold in km² into cells. */
export const cellArea = (g: Grid, r: number) => { const { dxm, dym } = rowSizes(g); return dxm[r] * dym[r]; };
