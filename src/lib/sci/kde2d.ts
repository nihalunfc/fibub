// Two-dimensional kernel density estimation for point events (hot spots), bandwidth rules, a marching-squares
// contour tracer and the Clark–Evans nearest-neighbour index. Plain maths, no DOM.
import { normCdf } from './stats.ts';

export type XY = { x: number; y: number; w?: number };
export type Kernel = 'quartic' | 'gaussian';
export const R_EARTH = 6371008.8;

/** Latitude/longitude (degrees) to local east/north metres around (lat0, lon0) (equirectangular). */
export function toLocal(lat: number, lon: number, lat0: number, lon0: number): [number, number] {
  const k = Math.PI / 180;
  return [R_EARTH * (lon - lon0) * k * Math.cos(lat0 * k), R_EARTH * (lat - lat0) * k];
}
export function fromLocal(x: number, y: number, lat0: number, lon0: number): [number, number] {
  const k = Math.PI / 180;
  return [lat0 + y / (R_EARTH * k), lon0 + x / (R_EARTH * k * Math.cos(lat0 * k))];
}

/** Kernel value at distance² d2 for bandwidth h; each kernel integrates to 1 over the plane. */
export function kernel(kind: Kernel, d2: number, h: number): number {
  if (kind === 'gaussian') return Math.exp(-d2 / (2 * h * h)) / (2 * Math.PI * h * h);
  const u = d2 / (h * h);
  return u < 1 ? (3 / (Math.PI * h * h)) * (1 - u) ** 2 : 0;
}

const median = (a: number[]) => { const s = [...a].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** Spread measures used by the bandwidth rules. */
export function spread(p: XY[]) {
  const n = p.length, mx = p.reduce((s, q) => s + q.x, 0) / n, my = p.reduce((s, q) => s + q.y, 0) / n;
  const vx = p.reduce((s, q) => s + (q.x - mx) ** 2, 0) / (n - 1), vy = p.reduce((s, q) => s + (q.y - my) ** 2, 0) / (n - 1);
  const sd = Math.sqrt(p.reduce((s, q) => s + (q.x - mx) ** 2 + (q.y - my) ** 2, 0) / n);
  const dm = median(p.map((q) => Math.hypot(q.x - mx, q.y - my)));
  return { mx, my, sx: Math.sqrt(vx), sy: Math.sqrt(vy), sd, dm };
}

/** Scott's rule for two dimensions: h = σ̄ n^(−1/6), σ̄ = √((σx² + σy²)/2). */
export function scott(p: XY[]) { const s = spread(p); return Math.sqrt((s.sx ** 2 + s.sy ** 2) / 2) * p.length ** (-1 / 6); }
/** Silverman-type spatial rule: h = 0.9 min(SD, √(1/ln 2) Dm) n^(−0.2), SD the standard distance, Dm the median distance to the mean centre. */
export function spatialRule(p: XY[]) { const s = spread(p); return 0.9 * Math.min(s.sd, Math.sqrt(1 / Math.LN2) * s.dm) * p.length ** -0.2; }

export type Grid = { x0: number; y0: number; cell: number; cols: number; rows: number; z: Float64Array };

/**
 * Intensity on a grid: Σ wᵢ K(dᵢ) at each cell centre (events per unit area; divide by Σw for a probability
 * density). Cell (c, r) has its centre at (x0 + (c + ½) cell, y0 + (r + ½) cell). The Gaussian is cut at `cut` × h.
 */
export function kdeGrid(p: XY[], kind: Kernel, h: number, cell: number, bounds: { x0: number; y0: number; x1: number; y1: number }, cut = 5): Grid {
  const cols = Math.max(1, Math.ceil((bounds.x1 - bounds.x0) / cell)), rows = Math.max(1, Math.ceil((bounds.y1 - bounds.y0) / cell));
  const z = new Float64Array(cols * rows), R = kind === 'quartic' ? h : cut * h, R2 = R * R;
  for (const q of p) {
    const w = q.w ?? 1;
    const c0 = Math.max(0, Math.floor((q.x - R - bounds.x0) / cell)), c1 = Math.min(cols - 1, Math.floor((q.x + R - bounds.x0) / cell));
    const r0 = Math.max(0, Math.floor((q.y - R - bounds.y0) / cell)), r1 = Math.min(rows - 1, Math.floor((q.y + R - bounds.y0) / cell));
    for (let r = r0; r <= r1; r++) {
      const dy = bounds.y0 + (r + 0.5) * cell - q.y;
      for (let c = c0; c <= c1; c++) {
        const dx = bounds.x0 + (c + 0.5) * cell - q.x, d2 = dx * dx + dy * dy;
        if (d2 <= R2) z[r * cols + c] += w * kernel(kind, d2, h);
      }
    }
  }
  return { x0: bounds.x0, y0: bounds.y0, cell, cols, rows, z };
}

/** Intensity at one place (no cut-off). */
export const kdeAt = (p: XY[], kind: Kernel, h: number, x: number, y: number) => p.reduce((s, q) => s + (q.w ?? 1) * kernel(kind, (q.x - x) ** 2 + (q.y - y) ** 2, h), 0);

/** The k highest cells, best first. */
export function topCells(g: Grid, k: number) {
  const idx = Array.from(g.z.keys()).sort((a, b) => g.z[b] - g.z[a]).slice(0, k);
  return idx.map((i) => ({ col: i % g.cols, row: Math.floor(i / g.cols), x: g.x0 + ((i % g.cols) + 0.5) * g.cell, y: g.y0 + (Math.floor(i / g.cols) + 0.5) * g.cell, z: g.z[i] }));
}

/** Contour segments at `level` by marching squares over cell centres (in data units). */
export function contour(g: Grid, level: number): [number, number, number, number][] {
  const out: [number, number, number, number][] = [], { cols, rows, z, cell } = g;
  const X = (c: number) => g.x0 + (c + 0.5) * cell, Y = (r: number) => g.y0 + (r + 0.5) * cell;
  const lerp = (a: number, b: number) => (level - a) / (b - a);
  for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols - 1; c++) {
    const a = z[r * cols + c], b = z[r * cols + c + 1], d = z[(r + 1) * cols + c], e = z[(r + 1) * cols + c + 1];
    const k = (a >= level ? 1 : 0) | (b >= level ? 2 : 0) | (e >= level ? 4 : 0) | (d >= level ? 8 : 0);
    if (k === 0 || k === 15) continue;
    // Edge crossings: bottom (a-b), right (b-e), top (d-e), left (a-d).
    const bot: [number, number] = [X(c) + lerp(a, b) * cell, Y(r)], rig: [number, number] = [X(c + 1), Y(r) + lerp(b, e) * cell];
    const top: [number, number] = [X(c) + lerp(d, e) * cell, Y(r + 1)], lef: [number, number] = [X(c), Y(r) + lerp(a, d) * cell];
    const seg = (p: [number, number], q: [number, number]) => out.push([p[0], p[1], q[0], q[1]]);
    switch (k) {
      case 1: case 14: seg(lef, bot); break;
      case 2: case 13: seg(bot, rig); break;
      case 3: case 12: seg(lef, rig); break;
      case 4: case 11: seg(rig, top); break;
      case 6: case 9: seg(bot, top); break;
      case 7: case 8: seg(lef, top); break;
      case 5: seg(lef, top); seg(bot, rig); break;
      case 10: seg(lef, bot); seg(rig, top); break;
    }
  }
  return out;
}

/** Distance from each point to its nearest other point (sweep along x). */
export function nearestDistances(p: XY[]): number[] {
  const o = p.map((q, i) => i).sort((a, b) => p[a].x - p[b].x), d = new Array(p.length).fill(Infinity);
  for (let k = 0; k < o.length; k++) {
    const a = p[o[k]];
    for (const dir of [-1, 1]) for (let j = k + dir; j >= 0 && j < o.length; j += dir) {
      const b = p[o[j]], dx = b.x - a.x;
      if (dx * dx >= d[o[k]] ** 2) break;
      const dd = Math.hypot(dx, b.y - a.y);
      if (dd < d[o[k]]) d[o[k]] = dd;
    }
  }
  return d;
}

/** Clark–Evans ratio R = observed mean nearest-neighbour distance / 0.5 √(A/n), with z = (r̄o − r̄e) / (0.26136 / √(n²/A)). */
export function clarkEvans(p: XY[], area: number) {
  const n = p.length, nn = nearestDistances(p), ro = nn.reduce((s, v) => s + v, 0) / n;
  const re = 0.5 / Math.sqrt(n / area), se = 0.26136 / Math.sqrt((n * n) / area), z = (ro - re) / se;
  return { n, area, ro, re, R: ro / re, se, z, p: 2 * normCdf(-Math.abs(z)) };
}

/** Separate peaks: cells higher than all 8 neighbours (ties broken by position), highest first. */
export function localPeaks(g: Grid, k: number) {
  const { cols, rows, z } = g, out: number[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, v = z[i];
    if (!(v > 0)) continue;
    let peak = true;
    for (let dr = -1; dr <= 1 && peak; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr, cc = c + dc;
      if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
      const j = rr * cols + cc;
      if (z[j] > v || (z[j] === v && j < i)) { peak = false; break; }
    }
    if (peak) out.push(i);
  }
  return out.sort((a, b) => z[b] - z[a]).slice(0, k).map((i) => ({ col: i % cols, row: Math.floor(i / cols), x: g.x0 + ((i % cols) + 0.5) * g.cell, y: g.y0 + (Math.floor(i / cols) + 0.5) * g.cell, z: z[i] }));
}
