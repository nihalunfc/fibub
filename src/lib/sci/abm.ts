// Agent-based models for the playground tool: boids flocking (Reynolds' separation, alignment and cohesion),
// Schelling's segregation model and an SIR epidemic on a grid. Every model is driven by a seeded random number
// generator, so a run can be repeated exactly. Plain TypeScript, no DOM.

/** mulberry32: a small, fast, seeded generator returning numbers in [0, 1). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function shuffle<T>(a: T[], r: () => number) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ---------- Schelling ----------
export interface SchellingParams { w: number; h: number; empty: number; shareA: number; threshold: number; wrap: boolean; seed: number }
export interface Schelling { p: SchellingParams; grid: Uint8Array; r: () => number; t: number; moved: number }
/** Make the starting grid: 0 empty, 1 group A, 2 group B, placed at random. */
export function schellingInit(p: SchellingParams): Schelling {
  const N = p.w * p.h, r = rng(p.seed), nE = Math.round(N * p.empty), nA = Math.round((N - nE) * p.shareA);
  const cells: number[] = []; for (let i = 0; i < N; i++) cells.push(i < nA ? 1 : i < N - nE ? 2 : 0);
  shuffle(cells, r);
  return { p, grid: Uint8Array.from(cells), r, t: 0, moved: 0 };
}
/** Same-group and other-group counts among the 8 neighbours of cell i. */
export function neighbours(s: Schelling, i: number): [number, number] {
  const { w, h, wrap } = s.p, x = i % w, y = (i - x) / w, g = s.grid[i];
  let same = 0, other = 0;
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    if (!dx && !dy) continue;
    let X = x + dx, Y = y + dy;
    if (wrap) { X = (X + w) % w; Y = (Y + h) % h; } else if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
    const v = s.grid[Y * w + X];
    if (v) { if (v === g) same++; else other++; }
  }
  return [same, other];
}
export const unhappy = (s: Schelling, i: number) => { if (!s.grid[i]) return false; const [a, b] = neighbours(s, i); return a + b > 0 && a / (a + b) < s.p.threshold; };
/** One step: every agent unhappy now (in random order) moves to a random empty cell. Returns how many moved. */
export function schellingStep(s: Schelling): number {
  const N = s.grid.length, movers: number[] = [], empties: number[] = [];
  for (let i = 0; i < N; i++) { if (!s.grid[i]) empties.push(i); else if (unhappy(s, i)) movers.push(i); }
  shuffle(movers, s.r);
  if (empties.length) for (const i of movers) {
    const k = Math.floor(s.r() * empties.length), d = empties[k];
    s.grid[d] = s.grid[i]; s.grid[i] = 0; empties[k] = i;
  }
  s.t++; s.moved = empties.length ? movers.length : 0;
  return s.moved;
}
/** Share of agents unhappy, and the average share of same-group neighbours (agents with at least one neighbour). */
export function schellingStats(s: Schelling): { unhappy: number; similar: number } {
  let n = 0, u = 0, sim = 0, ns = 0;
  for (let i = 0; i < s.grid.length; i++) if (s.grid[i]) {
    n++; const [a, b] = neighbours(s, i);
    if (a + b > 0) { sim += a / (a + b); ns++; if (a / (a + b) < s.p.threshold) u++; }
  }
  return { unhappy: n ? u / n : 0, similar: ns ? sim / ns : 0 };
}

// ---------- SIR on a grid ----------
export interface SIRParams { w: number; h: number; beta: number; gamma: number; initial: number; moore: boolean; wrap: boolean; seed: number }
export interface SIR { p: SIRParams; grid: Uint8Array; r: () => number; t: number }
/** 0 susceptible, 1 infected, 2 recovered. `initial` infected cells are picked at random. */
export function sirInit(p: SIRParams): SIR {
  const N = p.w * p.h, r = rng(p.seed), grid = new Uint8Array(N);
  const idx = shuffle(Array.from({ length: N }, (_, i) => i), r);
  for (let k = 0; k < Math.min(N, p.initial); k++) grid[idx[k]] = 1;
  return { p, grid, r, t: 0 };
}
const VN = [[0, -1], [-1, 0], [1, 0], [0, 1]], MOORE = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
/** One synchronous step: each infected cell infects each susceptible neighbour with chance β, then recovers with chance γ. */
export function sirStep(s: SIR) {
  const { w, h, wrap, moore, beta, gamma } = s.p, g = s.grid, next = g.slice(), nb = moore ? MOORE : VN;
  for (let i = 0; i < g.length; i++) {
    if (g[i] !== 1) continue;
    const x = i % w, y = (i - x) / w;
    for (const [dx, dy] of nb) {
      let X = x + dx, Y = y + dy;
      if (wrap) { X = (X + w) % w; Y = (Y + h) % h; } else if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
      const j = Y * w + X;
      if (g[j] === 0 && s.r() < beta) next[j] = 1;
    }
    if (s.r() < gamma) next[i] = 2;
  }
  s.grid = next; s.t++;
}
export function sirCounts(s: SIR): [number, number, number] { const c: [number, number, number] = [0, 0, 0]; for (const v of s.grid) c[v]++; return c; }

// ---------- Boids ----------
export interface BoidsParams { n: number; size: number; vision: number; separation: number; sepWeight: number; alignWeight: number; cohWeight: number; maxSpeed: number; minSpeed: number; noise: number; seed: number }
export interface Boids { p: BoidsParams; x: Float64Array; y: Float64Array; vx: Float64Array; vy: Float64Array; r: () => number; t: number }
export function boidsInit(p: BoidsParams): Boids {
  const r = rng(p.seed), n = p.n, b: Boids = { p, x: new Float64Array(n), y: new Float64Array(n), vx: new Float64Array(n), vy: new Float64Array(n), r, t: 0 };
  for (let i = 0; i < n; i++) { b.x[i] = r() * p.size; b.y[i] = r() * p.size; const a = r() * 2 * Math.PI, v = p.minSpeed + r() * (p.maxSpeed - p.minSpeed); b.vx[i] = v * Math.cos(a); b.vy[i] = v * Math.sin(a); }
  return b;
}
/** Shortest difference on a torus of the given size. */
export const wrapD = (d: number, L: number) => (d > L / 2 ? d - L : d < -L / 2 ? d + L : d);
/**
 * One synchronous step. Within `vision`: steer away from boids nearer than `separation` (sum of offsets),
 * towards the average heading of neighbours (alignment) and towards their centre (cohesion), each times its
 * weight; add noise; keep the speed between min and max; move, wrapping at the edges.
 */
export function boidsStep(b: Boids) {
  const { n, size: L, vision, separation, sepWeight, alignWeight, cohWeight, maxSpeed, minSpeed, noise } = b.p;
  const nvx = new Float64Array(n), nvy = new Float64Array(n), v2 = vision * vision, s2 = separation * separation;
  for (let i = 0; i < n; i++) {
    let sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0, k = 0;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const dx = wrapD(b.x[j] - b.x[i], L), dy = wrapD(b.y[j] - b.y[i], L), d2 = dx * dx + dy * dy;
      if (d2 > v2) continue;
      k++; ax += b.vx[j]; ay += b.vy[j]; cx += dx; cy += dy;
      if (d2 < s2) { sx -= dx; sy -= dy; }
    }
    let vx = b.vx[i], vy = b.vy[i];
    if (k) { vx += sepWeight * sx + alignWeight * (ax / k - b.vx[i]) + cohWeight * (cx / k); vy += sepWeight * sy + alignWeight * (ay / k - b.vy[i]) + cohWeight * (cy / k); }
    if (noise) { const a = (b.r() - 0.5) * 2 * noise, c = Math.cos(a), s = Math.sin(a); [vx, vy] = [vx * c - vy * s, vx * s + vy * c]; }
    const sp = Math.hypot(vx, vy);
    if (sp > maxSpeed) { vx *= maxSpeed / sp; vy *= maxSpeed / sp; } else if (sp < minSpeed) { if (sp > 0) { vx *= minSpeed / sp; vy *= minSpeed / sp; } else { vx = minSpeed; vy = 0; } }
    nvx[i] = vx; nvy[i] = vy;
  }
  for (let i = 0; i < n; i++) { b.vx[i] = nvx[i]; b.vy[i] = nvy[i]; b.x[i] = (((b.x[i] + nvx[i]) % L) + L) % L; b.y[i] = (((b.y[i] + nvy[i]) % L) + L) % L; }
  b.t++;
}
/** Polarisation (1 = all heading the same way, near 0 = random) and mean distance to the nearest boid. */
export function boidsStats(b: Boids): { order: number; nearest: number } {
  const n = b.p.n; let ox = 0, oy = 0, nn = 0;
  for (let i = 0; i < n; i++) {
    const s = Math.hypot(b.vx[i], b.vy[i]) || 1; ox += b.vx[i] / s; oy += b.vy[i] / s;
    let m = Infinity; for (let j = 0; j < n; j++) if (j !== i) { const dx = wrapD(b.x[j] - b.x[i], b.p.size), dy = wrapD(b.y[j] - b.y[i], b.p.size); m = Math.min(m, dx * dx + dy * dy); }
    if (n > 1) nn += Math.sqrt(m);
  }
  return { order: n ? Math.hypot(ox, oy) / n : 0, nearest: n > 1 ? nn / n : 0 };
}
