// Habitat connectivity on a small raster: habitat patches (8-connected), least-cost distances between them over
// a resistance surface (Dijkstra on the 8-neighbour grid, a step costs its length × the mean resistance of the two
// cells, as scikit-image's MCP_Geometric), links under a dispersal threshold, components, the integral index of
// connectivity (IIC) and probability of connectivity (PC) of Pascual-Hortal & Saura (2006) and Saura &
// Pascual-Hortal (2007), and each patch's importance (dIIC, dPC). Plain TypeScript, no DOM.

export type LandClass = { code: number; name: string; habitat: boolean; resistance: number; colour: string };
export type Landscape = { w: number; h: number; cls: Int32Array; classes: LandClass[]; cell: number };
export type Patch = { id: number; cells: number[]; area: number; cx: number; cy: number };

const SQ2 = Math.SQRT2;
const NB: [number, number, number][] = [[-1, 0, 1], [1, 0, 1], [0, -1, 1], [0, 1, 1], [-1, -1, SQ2], [1, -1, SQ2], [-1, 1, SQ2], [1, 1, SQ2]];

/** Habitat patches: 8-connected groups of habitat cells with at least minCells cells. Area in hectares. */
export function findPatches(L: Landscape, minCells = 1): { label: Int32Array; patches: Patch[] } {
  const { w, h } = L, label = new Int32Array(w * h).fill(-1), hab = L.classes.map((c) => c.habitat);
  const patches: Patch[] = [];
  const seen = new Uint8Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (seen[s] || !hab[L.cls[s]]) continue;
    const cells: number[] = [s]; seen[s] = 1;
    for (let k = 0; k < cells.length; k++) {
      const c = cells[k], x = c % w, y = (c / w) | 0;
      for (const [dx, dy] of NB) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const n = ny * w + nx; if (!seen[n] && hab[L.cls[n]]) { seen[n] = 1; cells.push(n); } }
    }
    if (cells.length < minCells) continue;
    const id = patches.length;
    let sx = 0, sy = 0; for (const c of cells) { label[c] = id; sx += c % w; sy += (c / w) | 0; }
    patches.push({ id, cells, area: (cells.length * L.cell * L.cell) / 1e4, cx: sx / cells.length + 0.5, cy: sy / cells.length + 0.5 });
  }
  return { label, patches };
}

/** Resistance of every cell from its class. */
export const resistanceOf = (L: Landscape) => Float64Array.from(L.cls, (c) => L.classes[c].resistance);

/**
 * Accumulated least cost from a set of start cells (cost 0 there). A step to a neighbour costs its length
 * (cell size, or √2 × cell size diagonally) × the mean of the two cells' resistances. Returns the cost and the
 * cell each was reached from.
 */
export function costDistance(w: number, h: number, res: Float64Array, starts: number[], cell = 1): { cost: Float64Array; from: Int32Array } {
  const n = w * h, cost = new Float64Array(n).fill(Infinity), from = new Int32Array(n).fill(-1);
  const heap: number[] = [], hc: number[] = [];
  const push = (i: number, c: number) => { heap.push(i); hc.push(c); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (hc[p] <= hc[k]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; [hc[p], hc[k]] = [hc[k], hc[p]]; k = p; } };
  const pop = () => { const top = heap[0], tc = hc[0], li = heap.pop()!, lc = hc.pop()!; if (heap.length) { heap[0] = li; hc[0] = lc; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && hc[l] < hc[m]) m = l; if (r < heap.length && hc[r] < hc[m]) m = r; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; [hc[m], hc[k]] = [hc[k], hc[m]]; k = m; } } return [top, tc]; };
  for (const s of starts) { cost[s] = 0; push(s, 0); }
  while (heap.length) {
    const [c, cc] = pop();
    if (cc > cost[c]) continue;
    const x = c % w, y = (c / w) | 0;
    for (const [dx, dy, len] of NB) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const nb = ny * w + nx, nc = cc + len * cell * (res[c] + res[nb]) / 2;
      if (nc < cost[nb]) { cost[nb] = nc; from[nb] = c; push(nb, nc); }
    }
  }
  return { cost, from };
}

/** Least-cost distance between every pair of patches (edge to edge: the cheapest cell of patch j from all of patch i). */
export function patchDistances(L: Landscape, patches: Patch[]): number[][] {
  const res = resistanceOf(L), n = patches.length;
  const D = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    const { cost } = costDistance(L.w, L.h, res, patches[i].cells, L.cell);
    for (let j = 0; j < n; j++) if (j !== i) D[i][j] = Math.min(...patches[j].cells.map((c) => cost[c]));
  }
  // The grid costs are symmetric; average away rounding so the matrix is exactly symmetric.
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const m = (D[i][j] + D[j][i]) / 2; D[i][j] = D[j][i] = m; }
  return D;
}

/** The least-cost path (cell indices) from patch a to the nearest cell of patch b. */
export function leastCostPath(L: Landscape, a: Patch, b: Patch): { cells: number[]; cost: number } {
  const { cost, from } = costDistance(L.w, L.h, resistanceOf(L), a.cells, L.cell);
  let end = b.cells[0];
  for (const c of b.cells) if (cost[c] < cost[end]) end = c;
  const cells: number[] = [];
  for (let c = end; c >= 0; c = from[c]) cells.push(c);
  return { cells: cells.reverse(), cost: cost[end] };
}

/** Connected components of the link graph (links where distance ≤ threshold); returns each node's component number. */
export function components(n: number, links: [number, number][]): number[] {
  const p = Array.from({ length: n }, (_, i) => i);
  const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x])));
  for (const [a, b] of links) p[f(a)] = f(b);
  const ids = new Map<number, number>();
  return p.map((_, i) => { const r = f(i); if (!ids.has(r)) ids.set(r, ids.size); return ids.get(r)!; });
}

/** Number of links on the topological shortest path between every pair (Infinity when not connected). */
function linkSteps(n: number, links: [number, number][], alive: boolean[]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of links) if (alive[a] && alive[b]) { adj[a].push(b); adj[b].push(a); }
  return Array.from({ length: n }, (_, s) => {
    const d = new Array<number>(n).fill(Infinity); if (!alive[s]) return d;
    d[s] = 0; const qu = [s];
    for (let k = 0; k < qu.length; k++) for (const v of adj[qu[k]]) if (d[v] === Infinity) { d[v] = d[qu[k]] + 1; qu.push(v); }
    return d;
  });
}
/** Maximum-product probabilities p*ij: p = exp(−k·d) on every pair, best path by Floyd-Warshall on k·d. */
function bestProb(D: number[][], k: number, alive: boolean[]): number[][] {
  const n = D.length, S = D.map((r, i) => r.map((d, j) => (alive[i] && alive[j] ? (i === j ? 0 : d) : Infinity)));
  for (let m = 0; m < n; m++) { if (!alive[m]) continue; const Sm = S[m]; for (let i = 0; i < n; i++) { const Sim = S[i][m]; if (Sim === Infinity) continue; const Si = S[i]; for (let j = 0; j < n; j++) { const v = Sim + Sm[j]; if (v < Si[j]) Si[j] = v; } } }
  return S.map((r) => r.map((s) => (s === Infinity ? 0 : Math.exp(-k * s))));
}

export type Indices = { iic: number; pc: number };
/**
 * IIC = Σi Σj ai·aj / (1 + nlij) / AL² (unconnected pairs add 0) and PC = Σi Σj ai·aj·p*ij / AL², where
 * pij = exp(−k·dij) with k chosen so that p = pAt at the threshold distance.
 */
export function indices(area: number[], D: number[][], threshold: number, pAt: number, AL: number, alive = area.map(() => true)): Indices {
  const n = area.length, links: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (D[i][j] <= threshold) links.push([i, j]);
  const nl = linkSteps(n, links, alive), P = bestProb(D, -Math.log(pAt) / threshold, alive);
  let iic = 0, pc = 0;
  for (let i = 0; i < n; i++) { if (!alive[i]) continue; for (let j = 0; j < n; j++) { if (!alive[j]) continue; if (nl[i][j] < Infinity) iic += (area[i] * area[j]) / (1 + nl[i][j]); pc += area[i] * area[j] * P[i][j]; } }
  return { iic: iic / (AL * AL), pc: pc / (AL * AL) };
}
/** Importance of each patch: dI = 100 × (I − I without the patch) / I. */
export function importance(area: number[], D: number[][], threshold: number, pAt: number, AL: number): { dIIC: number[]; dPC: number[]; all: Indices } {
  const all = indices(area, D, threshold, pAt, AL);
  const dIIC: number[] = [], dPC: number[] = [];
  for (let k = 0; k < area.length; k++) {
    const alive = area.map((_, i) => i !== k), r = indices(area, D, threshold, pAt, AL, alive);
    dIIC.push((100 * (all.iic - r.iic)) / all.iic); dPC.push((100 * (all.pc - r.pc)) / all.pc);
  }
  return { dIIC, dPC, all };
}

export const DEFAULT_CLASSES: LandClass[] = [
  { code: 1, name: 'Forest', habitat: true, resistance: 1, colour: '#2f7d32' },
  { code: 2, name: 'Grassland', habitat: false, resistance: 5, colour: '#b9d98c' },
  { code: 3, name: 'Farmland', habitat: false, resistance: 10, colour: '#f1e3a6' },
  { code: 4, name: 'River', habitat: false, resistance: 30, colour: '#5fa8e6' },
  { code: 5, name: 'Road', habitat: false, resistance: 60, colour: '#6d6d6d' },
  { code: 6, name: 'Town', habitat: false, resistance: 100, colour: '#c9c2bb' },
];

/** The made-up example map, 48 × 32 cells: forest patches in farmland with grassland, a river, a road and a town. */
export function exampleLandscape(): Landscape {
  const w = 48, h = 32, cls = new Int32Array(w * h).fill(2); // farmland (index 2)
  const set = (x: number, y: number, k: number) => { if (x >= 0 && y >= 0 && x < w && y < h) cls[y * w + x] = k; };
  // grassland strips
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if ((x + 2 * y) % 23 < 4 || (x > 30 && y < 10)) set(x, y, 1);
  // forest blobs (ellipses)
  const blob = (cx: number, cy: number, rx: number, ry: number) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) set(x, y, 0); };
  blob(7, 7, 5, 4); blob(18, 5, 3, 2.5); blob(36, 6, 4, 3); blob(6, 23, 4, 5); blob(20, 20, 6, 4); blob(33, 22, 2.5, 2.5); blob(42, 27, 3.5, 3); blob(27, 12, 1.6, 1.6);
  // river: a meander from top to bottom
  for (let y = 0; y < h; y++) { const x = Math.round(28 + 4 * Math.sin(y / 5)); set(x, y, 3); set(x + 1, y, 3); }
  // road across the map and a town
  for (let x = 0; x < w; x++) set(x, 15, 4);
  for (let y = 25; y < 32; y++) for (let x = 24; x < 31; x++) set(x, y, 5);
  return { w, h, cls, classes: DEFAULT_CLASSES.map((c) => ({ ...c })), cell: 100 };
}
