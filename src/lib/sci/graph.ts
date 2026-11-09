// Graph algorithms for the graph editor (#556) and the network metrics tool: reading an edge list, shortest paths
// (Dijkstra, Bellman-Ford), breadth- and depth-first search, minimum spanning trees (Kruskal, Prim), maximum flow
// (Edmonds-Karp) with a minimum cut, greedy and DSatur colouring, degree, betweenness and closeness centrality,
// topological order, and a force-directed layout. Plain TypeScript, no DOM. Conventions follow networkx (node order
// is the order names first appear; tie-breaking matches networkx where the result could differ), checked in
// tests/sci-tools/graph-algorithms.mjs.

export type Edge = { u: number; v: number; w: number };
export type Arc = { to: number; w: number; e: number };
export type Graph = {
  names: string[];
  edges: Edge[];
  directed: boolean;
  /** True when at least one line gave a weight. */
  weighted: boolean;
  /** Out-neighbours (all neighbours when undirected), in the order the edges were given. */
  adj: Arc[][];
  /** In-neighbours (same as adj when undirected). */
  radj: Arc[][];
  notes: string[];
};

const HEADER = /^(source|target|from|to|node|nodes|node1|node2|weight|start|end|capacity|cost|length|distance|edge)$/i;
const toNum = (s: string) => {
  const t = s.replace(/[−–]/g, '-');
  return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t) ? Number(t) : NaN;
};

/**
 * Read an edge list: one edge per line as "from to weight" (weight optional, default 1), separated by spaces, tabs,
 * commas or semicolons; "A -> B 3" and "A -- B" are fine too. A line with one name adds a node with no edges.
 * Lines starting with # are comments; a first line of words like "source,target,weight" is skipped as a header.
 * Throws an Error with a plain message on a bad line.
 */
export function parseGraph(text: string, directed: boolean, maxNodes = 5000, maxEdges = 50000): Graph {
  const names: string[] = [], index = new Map<string, number>(), notes: string[] = [];
  const id = (s: string) => {
    let k = index.get(s);
    if (k === undefined) {
      if (names.length >= maxNodes) throw new Error(`More than ${maxNodes.toLocaleString('en')} nodes; this tool's limit.`);
      k = names.length; names.push(s); index.set(s, k);
    }
    return k;
  };
  const edges: Edge[] = [], seen = new Map<string, number>();
  let weighted = false, loops = 0, repeats = 0, extra = 0;
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  let first = true;
  lines.forEach((raw, li) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const toks = line.replace(/\s*(->|-->|→|--|—)\s*/g, ' ').split(/[\s,;]+/).map((t) => t.replace(/^"(.*)"$/, '$1')).filter(Boolean);
    if (first) {
      first = false;
      if (toks.length >= 2 && toks.every((t) => HEADER.test(t))) return;
    }
    if (toks.length === 1) { id(toks[0]); return; }
    if (toks.length > 3) extra++;
    let w = 1;
    if (toks.length >= 3) {
      w = toNum(toks[2]);
      if (!Number.isFinite(w)) throw new Error(`Line ${li + 1}: "${toks[2]}" is not a number. Write each edge as: from to weight.`);
      weighted = true;
    }
    if (toks[0] === toks[1]) { loops++; id(toks[0]); return; }
    const u = id(toks[0]), v = id(toks[1]);
    const key = directed || u < v ? `${u} ${v}` : `${v} ${u}`;
    const k = seen.get(key);
    if (k !== undefined) { edges[k].w = w; repeats++; return; }
    if (edges.length >= maxEdges) throw new Error(`More than ${maxEdges.toLocaleString('en')} edges; this tool's limit.`);
    seen.set(key, edges.length); edges.push({ u, v, w });
  });
  if (loops) notes.push(`${loops} loop${loops > 1 ? 's' : ''} (an edge from a node to itself) left out.`);
  if (repeats) notes.push(`${repeats} repeated edge${repeats > 1 ? 's' : ''}: the last weight given is used.`);
  if (extra) notes.push(`Columns after the third (weight) are ignored.`);
  return build(names, edges, directed, weighted, notes);
}

/** A graph from names and edges (used after parsing, and for the undirected version of a directed graph). */
export function build(names: string[], edges: Edge[], directed: boolean, weighted: boolean, notes: string[] = []): Graph {
  const n = names.length, adj: Arc[][] = Array.from({ length: n }, () => []), radj: Arc[][] = directed ? Array.from({ length: n }, () => []) : adj;
  edges.forEach((ed, e) => {
    adj[ed.u].push({ to: ed.v, w: ed.w, e });
    if (directed) radj[ed.v].push({ to: ed.u, w: ed.w, e });
    else adj[ed.v].push({ to: ed.u, w: ed.w, e });
  });
  return { names, edges, directed, weighted, adj, radj, notes };
}

/** The edge list as text, one "from to weight" per line (nodes with no edges on their own line). */
export function toText(g: Graph): string {
  const used = new Set<number>(); g.edges.forEach((e) => { used.add(e.u); used.add(e.v); });
  const lines = g.edges.map((e) => (g.weighted ? `${g.names[e.u]} ${g.names[e.v]} ${e.w}` : `${g.names[e.u]} ${g.names[e.v]}`));
  g.names.forEach((s, i) => { if (!used.has(i)) lines.push(s); });
  return lines.join('\n');
}

/** The same graph with direction ignored (for colouring and spanning trees). Antiparallel arcs keep the smaller weight. */
export function undirected(g: Graph): Graph {
  if (!g.directed) return g;
  const seen = new Map<string, number>(), edges: Edge[] = [];
  for (const e of g.edges) {
    const key = e.u < e.v ? `${e.u} ${e.v}` : `${e.v} ${e.u}`, k = seen.get(key);
    if (k !== undefined) { edges[k].w = Math.min(edges[k].w, e.w); continue; }
    seen.set(key, edges.length); edges.push({ ...e });
  }
  return build(g.names, edges, false, g.weighted);
}

// ---------- a small binary heap ----------
class Heap {
  k: number[] = []; v: number[] = []; t: number[] = []; c = 0;
  push(key: number, val: number) {
    const { k, v, t } = this; let i = k.length; k.push(key); v.push(val); t.push(this.c++);
    while (i > 0) { const p = (i - 1) >> 1; if (k[p] < k[i] || (k[p] === k[i] && t[p] < t[i])) break; this.swap(i, p); i = p; }
  }
  pop(): [number, number] {
    const { k, v, t } = this, top: [number, number] = [k[0], v[0]], lk = k.pop()!, lv = v.pop()!, lt = t.pop()!;
    if (k.length) {
      k[0] = lk; v[0] = lv; t[0] = lt; let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        const less = (a: number, b: number) => k[a] < k[b] || (k[a] === k[b] && t[a] < t[b]);
        if (l < k.length && less(l, m)) m = l;
        if (r < k.length && less(r, m)) m = r;
        if (m === i) break; this.swap(i, m); i = m;
      }
    }
    return top;
  }
  get size() { return this.k.length; }
  private swap(a: number, b: number) { const { k, v, t } = this; [k[a], k[b]] = [k[b], k[a]]; [v[a], v[b]] = [v[b], v[a]]; [t[a], t[b]] = [t[b], t[a]]; }
}

// ---------- shortest paths ----------
export type Paths = { dist: number[]; prev: number[]; prevEdge: number[] };

/** Dijkstra from s. Throws if an edge weight is negative (use Bellman-Ford). */
export function dijkstra(g: Graph, s: number, adj = g.adj): Paths {
  if (g.edges.some((e) => e.w < 0)) throw new Error('Dijkstra needs weights of 0 or more. Use Bellman-Ford for negative weights.');
  const n = g.names.length, dist = new Array(n).fill(Infinity), prev = new Array(n).fill(-1), prevEdge = new Array(n).fill(-1), done = new Array(n).fill(false);
  const h = new Heap(); dist[s] = 0; h.push(0, s);
  while (h.size) {
    const [d, u] = h.pop(); if (done[u]) continue; done[u] = true;
    for (const a of adj[u]) { const nd = d + a.w; if (nd < dist[a.to]) { dist[a.to] = nd; prev[a.to] = u; prevEdge[a.to] = a.e; h.push(nd, a.to); } }
  }
  return { dist, prev, prevEdge };
}

/** Bellman-Ford from s. With a negative cycle reachable from s, `cycle` lists its nodes in order. */
export function bellmanFord(g: Graph, s: number): Paths & { cycle: number[] | null } {
  const n = g.names.length, dist = new Array(n).fill(Infinity), prev = new Array(n).fill(-1), prevEdge = new Array(n).fill(-1);
  const arcs: [number, number, number, number][] = [];
  g.edges.forEach((e, k) => { arcs.push([e.u, e.v, e.w, k]); if (!g.directed) arcs.push([e.v, e.u, e.w, k]); });
  dist[s] = 0;
  // Undirected: a negative edge reachable from s is itself a negative cycle (walk it there and back).
  if (!g.directed) {
    const reach = bfs(g, s).level;
    const bad = g.edges.findIndex((e) => e.w < 0 && reach[e.u] >= 0);
    if (bad >= 0) { const e = g.edges[bad]; return { dist, prev, prevEdge, cycle: [e.u, e.v] }; }
  }
  for (let it = 0; it < n - 1; it++) {
    let changed = false;
    for (const [u, v, w, k] of arcs) if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; prevEdge[v] = k; changed = true; }
    if (!changed) return { dist, prev, prevEdge, cycle: null };
  }
  for (const [u, v, w, k] of arcs) {
    if (dist[u] + w < dist[v]) {
      prev[v] = u; prevEdge[v] = k;
      let x = v; for (let i = 0; i < n; i++) x = prev[x];
      const cyc = [x]; for (let y = prev[x]; y !== x; y = prev[y]) cyc.push(y);
      return { dist, prev, prevEdge, cycle: cyc.reverse() };
    }
  }
  return { dist, prev, prevEdge, cycle: null };
}

/** The node path s → t from a predecessor list ([] when t cannot be reached). */
export function pathTo(p: { prev: number[]; dist: number[] }, s: number, t: number): number[] {
  if (!Number.isFinite(p.dist[t])) return [];
  const out = [t]; let x = t, guard = 0;
  while (x !== s && guard++ < p.prev.length) { x = p.prev[x]; if (x < 0) return []; out.push(x); }
  return out.reverse();
}

// ---------- traversals ----------
/** Breadth-first search from s: visiting order, level (edges from s, −1 if unreachable) and the tree edges. */
export function bfs(g: Graph, s: number) {
  const n = g.names.length, level = new Array(n).fill(-1), parent = new Array(n).fill(-1), treeEdges: number[] = [], order = [s];
  level[s] = 0;
  for (let i = 0; i < order.length; i++) {
    const u = order[i];
    for (const a of g.adj[u]) if (level[a.to] < 0) { level[a.to] = level[u] + 1; parent[a.to] = u; treeEdges.push(a.e); order.push(a.to); }
  }
  return { order, level, parent, treeEdges };
}

/** Depth-first search from s (preorder, as networkx dfs_preorder_nodes), with discovery and finish times and tree edges. */
export function dfs(g: Graph, s: number) {
  const n = g.names.length, seen = new Array(n).fill(false), parent = new Array(n).fill(-1), disc = new Array(n).fill(-1), fin = new Array(n).fill(-1);
  const order: number[] = [], post: number[] = [], treeEdges: number[] = [];
  let time = 0;
  const stack: [number, number][] = [[s, 0]]; seen[s] = true; disc[s] = time++; order.push(s);
  while (stack.length) {
    const top = stack[stack.length - 1], [u, i] = top;
    if (i < g.adj[u].length) {
      top[1]++;
      const a = g.adj[u][i];
      if (!seen[a.to]) { seen[a.to] = true; parent[a.to] = u; disc[a.to] = time++; order.push(a.to); treeEdges.push(a.e); stack.push([a.to, 0]); }
    } else { stack.pop(); fin[u] = time++; post.push(u); }
  }
  return { order, post, parent, disc, fin, treeEdges };
}

// ---------- spanning trees ----------
/** Kruskal's minimum spanning tree (a forest if the graph is not connected). Ties keep the order edges were given. */
export function kruskal(g: Graph) {
  const u = undirected(g), n = u.names.length, par = Array.from({ length: n }, (_, i) => i), rank = new Array(n).fill(0);
  const find = (x: number): number => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  const idx = u.edges.map((_, i) => i).sort((a, b) => u.edges[a].w - u.edges[b].w || a - b);
  const tree: Edge[] = [];
  for (const k of idx) {
    const e = u.edges[k], a = find(e.u), b = find(e.v);
    if (a === b) continue;
    if (rank[a] < rank[b]) par[a] = b; else if (rank[a] > rank[b]) par[b] = a; else { par[b] = a; rank[a]++; }
    tree.push(e);
  }
  return { edges: tree, total: tree.reduce((s, e) => s + e.w, 0), components: n - tree.length };
}

/** Prim's minimum spanning tree, grown from node `start` (then from the next unvisited node for each other component). */
export function prim(g: Graph, start = 0) {
  const u = undirected(g), n = u.names.length, inTree = new Array(n).fill(false), tree: Edge[] = [];
  const roots = [start, ...Array.from({ length: n }, (_, i) => i).filter((i) => i !== start)];
  for (const r of roots) {
    if (n === 0 || inTree[r]) continue;
    inTree[r] = true; const h = new Heap();
    for (const a of u.adj[r]) h.push(a.w, a.e);
    while (h.size) {
      const [, k] = h.pop(), e = u.edges[k];
      const nxt = inTree[e.u] ? (inTree[e.v] ? -1 : e.v) : e.u;
      if (nxt < 0) continue;
      inTree[nxt] = true; tree.push(e);
      for (const a of u.adj[nxt]) if (!inTree[a.to]) h.push(a.w, a.e);
    }
  }
  return { edges: tree, total: tree.reduce((s, e) => s + e.w, 0), components: n - tree.length };
}

// ---------- maximum flow ----------
/**
 * Edmonds-Karp maximum flow from s to t, with edge weights as capacities (an undirected edge carries flow either way).
 * Returns the flow value, the net flow along each given edge (negative = against the edge's from → to order, only for
 * undirected edges), the source side S of a minimum cut and the cut edges.
 */
export function maxFlow(g: Graph, s: number, t: number) {
  if (s === t) throw new Error('Choose a different source and sink.');
  if (g.edges.some((e) => e.w < 0)) throw new Error('Capacities (weights) must be 0 or more for maximum flow.');
  const n = g.names.length, cap: Map<number, number>[] = Array.from({ length: n }, () => new Map()), flow: Map<number, number>[] = Array.from({ length: n }, () => new Map());
  const add = (a: number, b: number, c: number) => { cap[a].set(b, (cap[a].get(b) ?? 0) + c); if (!cap[b].has(a)) cap[b].set(a, 0); };
  for (const e of g.edges) { add(e.u, e.v, e.w); if (!g.directed) add(e.v, e.u, e.w); }
  const res = (a: number, b: number) => (cap[a].get(b) ?? 0) - (flow[a].get(b) ?? 0);
  let value = 0, rounds = 0;
  for (;;) {
    const par = new Array(n).fill(-1); par[s] = s; const q = [s];
    for (let i = 0; i < q.length && par[t] < 0; i++) { const a = q[i]; for (const b of cap[a].keys()) if (par[b] < 0 && res(a, b) > 1e-12) { par[b] = a; q.push(b); } }
    if (par[t] < 0) break;
    let aug = Infinity; for (let b = t; b !== s; b = par[b]) aug = Math.min(aug, res(par[b], b));
    for (let b = t; b !== s; b = par[b]) { const a = par[b]; flow[a].set(b, (flow[a].get(b) ?? 0) + aug); flow[b].set(a, (flow[b].get(a) ?? 0) - aug); }
    value += aug;
    if (++rounds > 1e6) break;
  }
  const side = new Array(n).fill(false); side[s] = true; const q = [s];
  for (let i = 0; i < q.length; i++) { const a = q[i]; for (const b of cap[a].keys()) if (!side[b] && res(a, b) > 1e-12) { side[b] = true; q.push(b); } }
  // Net flow on each given edge: for antiparallel directed edges the net flow goes on the edge that points its way.
  const edgeFlow = g.edges.map((e) => {
    const f = flow[e.u].get(e.v) ?? 0;
    if (g.directed) return Math.max(0, Math.min(e.w, f));
    return f;
  });
  const cut = g.edges.map((e, k) => k).filter((k) => { const e = g.edges[k]; return (side[e.u] && !side[e.v]) || (!g.directed && side[e.v] && !side[e.u]); });
  const cutCapacity = cut.reduce((sum, k) => sum + g.edges[k].w, 0);
  return { value, edgeFlow, source: side, cut, cutCapacity };
}

// ---------- colouring ----------
/** Greedy colouring of the graph with direction ignored: 'largest' = largest degree first; 'dsatur' = DSatur. As networkx greedy_color. */
export function colour(g: Graph, strategy: 'largest' | 'dsatur') {
  const u = undirected(g), n = u.names.length, deg = u.adj.map((a) => a.length), col = new Array(n).fill(-1);
  const pick = (v: number) => { const used = new Set(u.adj[v].map((a) => col[a.to])); let c = 0; while (used.has(c)) c++; col[v] = c; };
  const order: number[] = [];
  if (strategy === 'largest') {
    for (const v of Array.from({ length: n }, (_, i) => i).sort((a, b) => deg[b] - deg[a] || a - b)) { pick(v); order.push(v); }
  } else {
    const sat: Set<number>[] = Array.from({ length: n }, () => new Set());
    for (let k = 0; k < n; k++) {
      let best = -1;
      for (let v = 0; v < n; v++) {
        if (col[v] >= 0) continue;
        if (best < 0 || sat[v].size > sat[best].size || (sat[v].size === sat[best].size && deg[v] > deg[best])) best = v;
      }
      pick(best); order.push(best);
      for (const a of u.adj[best]) sat[a.to].add(col[best]);
    }
  }
  return { colour: col, count: n ? Math.max(...col) + 1 : 0, order };
}

// ---------- centrality ----------
/** Degree centrality: degree ÷ (n − 1) (in + out degree for directed graphs), as networkx degree_centrality. */
export function degreeCentrality(g: Graph): number[] {
  const n = g.names.length, s = n > 1 ? 1 / (n - 1) : 1;
  return g.names.map((_, i) => (g.directed ? g.adj[i].length + g.radj[i].length : g.adj[i].length) * s);
}

/** Single-source shortest-path counts for Brandes' algorithm (weighted with Dijkstra, or by edge count). */
function sssp(g: Graph, s: number, weighted: boolean) {
  const n = g.names.length, S: number[] = [], P: number[][] = Array.from({ length: n }, () => []), sigma = new Array(n).fill(0), D = new Array(n).fill(-1);
  sigma[s] = 1;
  if (!weighted) {
    D[s] = 0; const q = [s];
    for (let i = 0; i < q.length; i++) {
      const v = q[i]; S.push(v);
      for (const a of g.adj[v]) {
        const w = a.to;
        if (D[w] < 0) { q.push(w); D[w] = D[v] + 1; }
        if (D[w] === D[v] + 1) { sigma[w] += sigma[v]; P[w].push(v); }
      }
    }
    return { S, P, sigma, D };
  }
  // As networkx _single_source_dijkstra_path_basic.
  const seen = new Map<number, number>([[s, 0]]), dist = new Array(n).fill(-1), h = new Heap();
  h.push(0, s * (n + 1) + s);
  while (h.size) {
    const [d, code] = h.pop(), pred = Math.floor(code / (n + 1)), v = code % (n + 1);
    if (dist[v] >= 0) continue;
    sigma[v] += sigma[pred]; S.push(v); dist[v] = d;
    for (const a of g.adj[v]) {
      const w = a.to, vw = d + a.w;
      if (dist[w] < 0 && (!seen.has(w) || vw < seen.get(w)!)) { seen.set(w, vw); h.push(vw, v * (n + 1) + w); sigma[w] = 0; P[w] = [v]; }
      else if (vw === seen.get(w)) { sigma[w] += sigma[v]; P[w].push(v); }
    }
  }
  return { S, P, sigma, D: dist };
}

/** Betweenness centrality (Brandes), normalised as networkx betweenness_centrality(normalized=True). */
export function betweenness(g: Graph, weighted = g.weighted, normalized = true): number[] {
  const n = g.names.length, cb = new Array(n).fill(0);
  if (weighted && g.edges.some((e) => e.w <= 0)) throw new Error('Weighted betweenness needs edge lengths above 0.');
  for (let s = 0; s < n; s++) {
    const { S, P, sigma } = sssp(g, s, weighted), delta = new Array(n).fill(0);
    for (let i = S.length - 1; i >= 0; i--) {
      const w = S[i], c = (1 + delta[w]) / sigma[w];
      for (const v of P[w]) delta[v] += sigma[v] * c;
      if (w !== s) cb[w] += delta[w];
    }
  }
  let scale: number | null;
  if (normalized) scale = n <= 2 ? null : 1 / ((n - 1) * (n - 2));
  else scale = g.directed ? null : 0.5;
  return scale === null ? cb : cb.map((x) => x * scale!);
}

/**
 * Closeness centrality as networkx closeness_centrality (Wasserman and Faust's version for graphs that are not
 * connected): (r − 1)/Σd × (r − 1)/(n − 1), where r counts the nodes that can reach the node. Directed graphs use
 * distances into the node, as networkx does.
 */
export function closeness(g: Graph, weighted = g.weighted): number[] {
  const n = g.names.length;
  if (weighted && g.edges.some((e) => e.w < 0)) throw new Error('Weighted closeness needs edge lengths of 0 or more.');
  return g.names.map((_, s) => {
    let dist: number[];
    if (weighted) dist = dijkstra(g, s, g.radj).dist;
    else {
      dist = new Array(n).fill(Infinity); dist[s] = 0; const q = [s];
      for (let i = 0; i < q.length; i++) for (const a of g.radj[q[i]]) if (dist[a.to] === Infinity) { dist[a.to] = dist[q[i]] + 1; q.push(a.to); }
    }
    let tot = 0, r = 0;
    for (const d of dist) if (Number.isFinite(d)) { tot += d; r++; }
    if (tot <= 0 || n <= 1) return 0;
    return ((r - 1) / tot) * ((r - 1) / (n - 1));
  });
}

// ---------- topological order ----------
/**
 * Topological order of a directed graph (Kahn's algorithm, taking the earliest-listed ready node first, as networkx
 * lexicographical_topological_sort with key = input order). If there is a cycle, `cycle` lists one.
 */
export function topoSort(g: Graph): { order: number[]; cycle: number[] | null } {
  const n = g.names.length, indeg = g.radj.map((a) => a.length), h = new Heap(), order: number[] = [];
  for (let i = 0; i < n; i++) if (!indeg[i]) h.push(i, i);
  while (h.size) { const [, u] = h.pop(); order.push(u); for (const a of g.adj[u]) if (--indeg[a.to] === 0) h.push(a.to, a.to); }
  if (order.length === n) return { order, cycle: null };
  // Find a cycle among the nodes left over: follow in-edges between leftover nodes until one repeats.
  const left = new Array(n).fill(false); for (let i = 0; i < n; i++) if (indeg[i] > 0) left[i] = true;
  let x = left.indexOf(true); const pos = new Map<number, number>(), walk: number[] = [];
  while (!pos.has(x)) { pos.set(x, walk.length); walk.push(x); x = g.radj[x].find((a) => left[a.to])!.to; }
  return { order, cycle: walk.slice(pos.get(x)!).reverse() };
}

// ---------- layout ----------
/**
 * A force-directed (Fruchterman-Reingold) layout in the unit square, the same every time for the same graph.
 * `fixed` positions (by node index) stay where they are and the others settle around them.
 */
export function layout(n: number, edges: { u: number; v: number }[], fixed: ([number, number] | null)[] = [], iters = 300): [number, number][] {
  if (n === 0) return [];
  const pos: [number, number][] = Array.from({ length: n }, (_, i) => fixed[i] ? [fixed[i]![0], fixed[i]![1]] : [0.5 + 0.4 * Math.cos((2 * Math.PI * i) / n - Math.PI / 2), 0.5 + 0.4 * Math.sin((2 * Math.PI * i) / n - Math.PI / 2)]);
  if (n === 1) return pos.map(() => [0.5, 0.5]);
  const free = pos.map((_, i) => !fixed[i]);
  if (!free.some(Boolean)) return pos;
  const k = Math.sqrt(1 / n) * 0.9;
  let temp = 0.1;
  const disp = pos.map(() => [0, 0]);
  for (let it = 0; it < iters; it++) {
    for (const d of disp) { d[0] = 0; d[1] = 0; }
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1], d2 = dx * dx + dy * dy;
      if (d2 < 1e-9) { dx = 1e-3 * (((i * 7 + j * 13) % 11) - 5); dy = 1e-3 * (((i * 5 + j * 3) % 7) - 3); d2 = dx * dx + dy * dy + 1e-12; }
      const f = (k * k) / d2;
      disp[i][0] += dx * f; disp[i][1] += dy * f; disp[j][0] -= dx * f; disp[j][1] -= dy * f;
    }
    for (const e of edges) {
      const dx = pos[e.u][0] - pos[e.v][0], dy = pos[e.u][1] - pos[e.v][1], d = Math.hypot(dx, dy) || 1e-6, f = d / k;
      disp[e.u][0] -= dx * f; disp[e.u][1] -= dy * f; disp[e.v][0] += dx * f; disp[e.v][1] += dy * f;
    }
    for (let i = 0; i < n; i++) {
      if (!free[i]) continue;
      // A weak pull to the middle keeps separate pieces on the page.
      disp[i][0] += (0.5 - pos[i][0]) * 0.05 * n * k; disp[i][1] += (0.5 - pos[i][1]) * 0.05 * n * k;
      const d = Math.hypot(disp[i][0], disp[i][1]) || 1, step = Math.min(d, temp);
      pos[i][0] += (disp[i][0] / d) * step; pos[i][1] += (disp[i][1] / d) * step;
    }
    temp = Math.max(0.002, temp * 0.985);
  }
  // Fit the free nodes into the square (when nothing is fixed).
  if (free.every(Boolean)) {
    const xs = pos.map((p) => p[0]), ys = pos.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), s = Math.max(x1 - x0, y1 - y0) || 1;
    return pos.map(([x, y]) => [0.5 + (x - (x0 + x1) / 2) / s, 0.5 + (y - (y0 + y1) / 2) / s]);
  }
  return pos.map(([x, y]) => [Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y))]);
}

/** The example: a small made-up road network between seven places, weights in km. */
export const EXAMPLE = `A B 7
A D 5
B C 8
B D 9
B E 7
C E 5
D E 15
D F 6
E F 8
E G 9
F G 11`;
/** A made-up task plan for topological order (directed). */
export const EXAMPLE_DAG = `Plan Design
Plan Budget
Design Build
Budget Build
Build Test
Design Docs
Test Release
Docs Release`;
/** A made-up pipe network for maximum flow (directed, capacities). */
export const EXAMPLE_FLOW = `S A 10
S C 10
A B 4
A C 2
A D 8
C D 9
D B 6
B T 10
D T 10`;
