// Social network analysis for survey name lists or edge lists: a directed (or undirected) graph, degree,
// betweenness, closeness and eigenvector centrality, density, reciprocity, components, Louvain communities
// and a seeded force-directed layout. Definitions and normalisations follow networkx. Plain functions, no DOM.
import type { Painter } from './plot.ts';

export type Graph = { names: string[]; directed: boolean; out: number[][]; inn: number[][]; m: number; selfLoops: number; duplicates: number };

/** Build a graph from pairs (from → to). Self-ties are dropped and repeated ties counted once. */
export function buildGraph(pairs: [string, string][], directed: boolean, extraNodes: string[] = []): Graph {
  const idx = new Map<string, number>(), names: string[] = [];
  const id = (s: string) => { let i = idx.get(s); if (i === undefined) { i = names.length; idx.set(s, i); names.push(s); } return i; };
  for (const [a, b] of pairs) { id(a); id(b); }
  for (const s of extraNodes) id(s);
  const seen = new Set<string>(), out: number[][] = names.map(() => []), inn: number[][] = names.map(() => []);
  let selfLoops = 0, duplicates = 0, m = 0;
  for (const [a0, b0] of pairs) {
    const a = idx.get(a0)!, b = idx.get(b0)!;
    if (a === b) { selfLoops++; continue; }
    const key = directed ? `${a}>${b}` : `${Math.min(a, b)}-${Math.max(a, b)}`;
    if (seen.has(key)) { duplicates++; continue; }
    seen.add(key); m++;
    out[a].push(b); inn[b].push(a);
    if (!directed) { out[b].push(a); inn[a].push(b); }
  }
  return { names, directed, out, inn, m, selfLoops, duplicates };
}

/** Read "respondent, named person 1, named person 2, ..." rows (name lists) or "source, target" rows (edge list). */
export function pairsFromRows(rows: string[][], kind: 'names' | 'edges') {
  const pairs: [string, string][] = [], nodes: string[] = [];
  for (const r of rows) {
    const c = r.map((x) => x.trim());
    if (!c[0]) continue;
    nodes.push(c[0]);
    if (kind === 'edges') { if (c[1]) pairs.push([c[0], c[1]]); }
    else for (const t of c.slice(1)) if (t) pairs.push([c[0], t]);
  }
  return { pairs, nodes };
}

export const density = (g: Graph) => { const n = g.names.length; return n < 2 ? 0 : (g.directed ? 1 : 2) * g.m / (n * (n - 1)); };
/** Share of directed ties that are returned (networkx reciprocity). */
export function reciprocity(g: Graph) {
  if (!g.directed || !g.m) return NaN;
  let r = 0;
  g.out.forEach((o, a) => { for (const b of o) if (g.out[b].includes(a)) r++; });
  return r / g.m;
}

/** Breadth-first distances from s along `adj`. */
function bfs(adj: number[][], s: number) {
  const d = new Array(adj.length).fill(-1), queue = [s];
  d[s] = 0;
  for (let h = 0; h < queue.length; h++) { const v = queue[h]; for (const w of adj[v]) if (d[w] < 0) { d[w] = d[v] + 1; queue.push(w); } }
  return d;
}

/** Betweenness centrality by Brandes' algorithm, normalised as networkx does. */
export function betweenness(g: Graph) {
  const n = g.names.length, cb = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    const S: number[] = [], P: number[][] = Array.from({ length: n }, () => []), sigma = new Array(n).fill(0), d = new Array(n).fill(-1);
    sigma[s] = 1; d[s] = 0;
    const Q = [s];
    for (let h = 0; h < Q.length; h++) {
      const v = Q[h]; S.push(v);
      for (const w of g.out[v]) {
        if (d[w] < 0) { Q.push(w); d[w] = d[v] + 1; }
        if (d[w] === d[v] + 1) { sigma[w] += sigma[v]; P[w].push(v); }
      }
    }
    const delta = new Array(n).fill(0);
    while (S.length) { const w = S.pop()!; for (const v of P[w]) delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]); if (w !== s) cb[w] += delta[w]; }
  }
  // networkx: directed scale 1/((n−1)(n−2)); undirected halves the double count, giving 2/((n−1)(n−2)).
  const scale = n > 2 ? 1 / ((n - 1) * (n - 2)) : 1;
  return cb.map((x) => x * scale);
}

/** Closeness (networkx, Wasserman-Faust form for disconnected graphs; directed uses distances to the node). */
export function closeness(g: Graph) {
  const n = g.names.length, adj = g.directed ? g.inn : g.out;
  return g.names.map((_, u) => {
    const d = bfs(adj, u);
    let tot = 0, r = 0;
    for (const x of d) if (x > 0) { tot += x; r++; }
    if (!tot || n < 2) return 0;
    return (r / tot) * (r / (n - 1));
  });
}

/** Eigenvector centrality by power iteration exactly as networkx (in-ties for directed graphs), up to 1000 steps. */
export function eigenvector(g: Graph, maxIter = 1000, tol = 1e-6) {
  const n = g.names.length;
  if (!n) return { x: [], converged: true, iterations: 0 };
  let x = new Array(n).fill(1 / n);
  for (let it = 1; it <= maxIter; it++) {
    const last = x; x = last.slice();
    for (let v = 0; v < n; v++) for (const w of g.out[v]) x[w] += last[v];
    let norm = Math.hypot(...x);
    if (norm === 0) norm = 1;
    x = x.map((v) => v / norm);
    if (x.reduce((s, v, i) => s + Math.abs(v - last[i]), 0) < n * tol) return { x, converged: true, iterations: it };
  }
  return { x, converged: false, iterations: maxIter };
}

/** Connected components: weak (ignoring direction) and, for directed graphs, strong (Tarjan). Largest first. */
export function components(g: Graph) {
  const n = g.names.length, und = g.names.map((_, i) => [...new Set([...g.out[i], ...g.inn[i]])]);
  const comp = new Array(n).fill(-1), weak: number[][] = [];
  for (let s = 0; s < n; s++) if (comp[s] < 0) { const d = bfs(und, s), c: number[] = []; d.forEach((x, i) => { if (x >= 0) { comp[i] = weak.length; c.push(i); } }); weak.push(c); }
  let strong: number[][] = weak;
  if (g.directed) {
    strong = []; let index = 0;
    const idx = new Array(n).fill(-1), low = new Array(n).fill(0), on = new Array(n).fill(false), st: number[] = [];
    // Iterative Tarjan so long chains do not overflow the call stack.
    for (let s = 0; s < n; s++) {
      if (idx[s] >= 0) continue;
      const work: [number, number][] = [[s, 0]];
      while (work.length) {
        const top = work[work.length - 1], v = top[0];
        if (top[1] === 0) { idx[v] = low[v] = index++; st.push(v); on[v] = true; }
        if (top[1] < g.out[v].length) {
          const w = g.out[v][top[1]++];
          if (idx[w] < 0) work.push([w, 0]); else if (on[w]) low[v] = Math.min(low[v], idx[w]);
        } else {
          work.pop();
          if (work.length) { const u = work[work.length - 1][0]; low[u] = Math.min(low[u], low[v]); }
          if (low[v] === idx[v]) { const c: number[] = []; let w: number; do { w = st.pop()!; on[w] = false; c.push(w); } while (w !== v); strong.push(c); }
        }
      }
    }
  }
  const by = (a: number[][]) => a.map((c) => c.sort((x, y) => x - y)).sort((a2, b2) => b2.length - a2.length || a2[0] - b2[0]);
  return { weak: by(weak), strong: by(strong) };
}

/** Undirected weighted adjacency (a tie in either direction counts once) used for communities. */
function undirectedWeights(g: Graph) {
  const W: Map<number, number>[] = g.names.map(() => new Map());
  g.out.forEach((o, a) => { for (const b of o) { W[a].set(b, 1); W[b].set(a, 1); } });
  return W;
}

/** Newman's modularity of a partition of the undirected version of the graph. */
export function modularity(g: Graph, community: number[]) {
  const W = undirectedWeights(g), k = W.map((m) => [...m.values()].reduce((s, x) => s + x, 0)), m2 = k.reduce((s, x) => s + x, 0);
  if (!m2) return 0;
  let q = 0;
  const tot = new Map<number, number>(), inside = new Map<number, number>();
  W.forEach((m, a) => { tot.set(community[a], (tot.get(community[a]) ?? 0) + k[a]); for (const [b, w] of m) if (community[a] === community[b]) inside.set(community[a], (inside.get(community[a]) ?? 0) + w); });
  for (const [c, t] of tot) q += (inside.get(c) ?? 0) / m2 - (t / m2) ** 2;
  return q;
}

/**
 * Louvain communities (Blondel et al. 2008) on the undirected version of the graph, resolution 1, deterministic:
 * nodes are visited in order and a node moves to the neighbouring community with the largest gain.
 */
export function louvain(g: Graph) {
  const n = g.names.length;
  let W = undirectedWeights(g);
  let member = g.names.map((_, i) => i); // original node → current super-node
  for (let level = 0; level < 50; level++) {
    const N = W.length, k = W.map((m) => [...m.values()].reduce((s, x) => s + x, 0)), m2 = k.reduce((s, x) => s + x, 0);
    if (!m2) break;
    const com = W.map((_, i) => i), tot = k.slice();
    let moved = false, improved = true, guard = 0;
    while (improved && guard++ < 100) {
      improved = false;
      for (let v = 0; v < N; v++) {
        const cv = com[v], links = new Map<number, number>();
        for (const [u, w] of W[v]) if (u !== v) links.set(com[u], (links.get(com[u]) ?? 0) + w);
        tot[cv] -= k[v];
        let best = cv, gain = (links.get(cv) ?? 0) - (tot[cv] * k[v]) / m2;
        for (const [c, w] of links) { const gn = w - (tot[c] * k[v]) / m2; if (gn > gain + 1e-12) { gain = gn; best = c; } }
        tot[best] += k[v];
        if (best !== cv) { com[v] = best; improved = true; moved = true; }
      }
    }
    if (!moved) break;
    const ids = new Map<number, number>();
    com.forEach((c) => { if (!ids.has(c)) ids.set(c, ids.size); });
    const W2: Map<number, number>[] = Array.from({ length: ids.size }, () => new Map());
    W.forEach((m, a) => { for (const [b, w] of m) { const A = ids.get(com[a])!, B = ids.get(com[b])!; W2[A].set(B, (W2[A].get(B) ?? 0) + w); } });
    member = member.map((s) => ids.get(com[s])!);
    W = W2;
  }
  // Number communities by size, largest first.
  const size = new Map<number, number>();
  member.forEach((c) => size.set(c, (size.get(c) ?? 0) + 1));
  const order = [...size.keys()].sort((a, b) => size.get(b)! - size.get(a)! || member.indexOf(a) - member.indexOf(b));
  const relabel = new Map(order.map((c, i) => [c, i]));
  const community = member.map((c) => relabel.get(c)!);
  return { community, count: order.length, modularity: n ? modularity(g, community) : 0 };
}

export type Measures = {
  name: string; inDeg: number; outDeg: number; degree: number; degreeC: number; inC: number; outC: number;
  betweenness: number; closeness: number; eigenvector: number; community: number; component: number;
};
export function measures(g: Graph) {
  const n = g.names.length, s = n > 1 ? 1 / (n - 1) : 0;
  const bt = betweenness(g), cl = closeness(g), ev = eigenvector(g), lv = louvain(g), cc = components(g);
  const compOf = new Array(n).fill(0); cc.weak.forEach((c, i) => c.forEach((v) => (compOf[v] = i + 1)));
  const rows: Measures[] = g.names.map((name, i) => {
    const inDeg = g.directed ? g.inn[i].length : g.out[i].length, outDeg = g.out[i].length, degree = g.directed ? inDeg + outDeg : outDeg;
    return { name, inDeg, outDeg, degree, degreeC: degree * s, inC: inDeg * s, outC: outDeg * s, betweenness: bt[i], closeness: cl[i], eigenvector: ev.x[i], community: lv.community[i] + 1, component: compOf[i] };
  });
  return { rows, eigenConverged: ev.converged, communities: lv.count, modularity: lv.modularity, components: cc, density: density(g), reciprocity: reciprocity(g) };
}

/** Fruchterman-Reingold layout, seeded, in the unit square. */
export function layout(g: Graph, seed = 1, iterations = 300): [number, number][] {
  const n = g.names.length;
  let a = seed >>> 0;
  const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const P: [number, number][] = g.names.map(() => [rnd(), rnd()]);
  if (n < 2) return n ? [[0.5, 0.5]] : [];
  const k = Math.sqrt(1 / n), E: [number, number][] = [];
  g.out.forEach((o, i) => o.forEach((j) => { if (g.directed || i < j) E.push([i, j]); }));
  let temp = 0.1;
  for (let it = 0; it < iterations; it++) {
    const D = P.map(() => [0, 0]);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], d2 = dx * dx + dy * dy;
      if (d2 < 1e-9) { dx = (rnd() - 0.5) * 1e-3; dy = (rnd() - 0.5) * 1e-3; d2 = dx * dx + dy * dy; }
      const f = (k * k) / d2;
      D[i][0] += dx * f; D[i][1] += dy * f; D[j][0] -= dx * f; D[j][1] -= dy * f;
    }
    for (const [i, j] of E) {
      const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], d = Math.hypot(dx, dy) || 1e-6, f = d / k;
      D[i][0] -= dx * f; D[i][1] -= dy * f; D[j][0] += dx * f; D[j][1] += dy * f;
    }
    // Weak pull to the centre keeps separate components on screen.
    for (let i = 0; i < n; i++) { D[i][0] += (0.5 - P[i][0]) * 0.05 * n * k; D[i][1] += (0.5 - P[i][1]) * 0.05 * n * k; }
    for (let i = 0; i < n; i++) { const d = Math.hypot(D[i][0], D[i][1]) || 1e-9, s = Math.min(d, temp) / d; P[i][0] += D[i][0] * s; P[i][1] += D[i][1] * s; }
    temp = Math.max(0.002, temp * 0.985);
  }
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  return P.map(([x, y]) => [(x - x0) / (x1 - x0 || 1), (y - y0) / (y1 - y0 || 1)]);
}

export const COMMUNITY_COLOURS = ['#0072B2', '#D55E00', '#009E73', '#CC79A7', '#E69F00', '#56B4E9', '#7f7f7f', '#8c564b', '#bcbd22', '#17becf'];

/** Draw the network: arrows for directed ties, node size by in-degree, colour by community. */
export function drawNetwork(Pt: Painter, o: { w: number; h: number; g: Graph; pos: [number, number][]; rows: Measures[]; ink: string; muted: string; line: string; labels: boolean; font?: number }) {
  const { w, h, g, pos, rows } = o, font = o.font ?? 12, pad = 28;
  const maxIn = Math.max(1, ...rows.map((r) => r.inDeg));
  const R = (i: number) => 4 + 8 * Math.sqrt(rows[i].inDeg / maxIn);
  const X = (i: number) => pad + pos[i][0] * (w - 2 * pad), Y = (i: number) => pad + pos[i][1] * (h - 2 * pad);
  g.out.forEach((outs, i) => outs.forEach((j) => {
    if (!g.directed && j < i) return;
    const x1 = X(i), y1 = Y(i), x2 = X(j), y2 = Y(j), d = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / d, uy = (y2 - y1) / d;
    const ex = x2 - ux * (R(j) + 2), ey = y2 - uy * (R(j) + 2);
    Pt.line([[x1 + ux * R(i), y1 + uy * R(i)], [ex, ey]], o.line, 1);
    if (g.directed) { const s = 6; Pt.poly([[ex, ey], [ex - ux * s - uy * s * 0.5, ey - uy * s + ux * s * 0.5], [ex - ux * s + uy * s * 0.5, ey - uy * s - ux * s * 0.5]], o.muted, null); }
  }));
  rows.forEach((r, i) => Pt.circle(X(i), Y(i), R(i), COMMUNITY_COLOURS[(r.community - 1) % COMMUNITY_COLOURS.length], o.ink, 0.8));
  if (o.labels) rows.forEach((r, i) => Pt.text(X(i) + R(i) + 2, Y(i), r.name, font, o.ink, 'start', 'middle'));
}
