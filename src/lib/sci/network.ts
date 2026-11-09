// Network metrics for #588: degree distribution, clustering, density, components, diameter and average path length,
// degree assortativity, PageRank and Louvain communities with modularity. Plain TypeScript, no DOM; graphs come from
// parseGraph in graph.ts. Conventions follow networkx (checked in tests/sci-tools/network-metrics.mjs).
import { undirected, type Graph } from './graph.ts';

/** How many nodes have each degree (total degree, in + out, for directed graphs). */
export function degreeDistribution(g: Graph) {
  const deg = g.names.map((_, i) => (g.directed ? g.adj[i].length + g.radj[i].length : g.adj[i].length));
  const counts = new Map<number, number>();
  for (const d of deg) counts.set(d, (counts.get(d) ?? 0) + 1);
  const ks = [...counts.keys()].sort((a, b) => a - b), n = deg.length;
  let above = n;
  const rows = ks.map((k) => { const c = counts.get(k)!, r = { k, count: c, p: c / n, ccdf: above / n }; above -= c; return r; });
  const mean = deg.reduce((s, d) => s + d, 0) / (n || 1);
  return { deg, rows, mean, max: n ? Math.max(...deg) : 0 };
}

/** Edge density, as networkx density: m / (n(n − 1)/2), or m / (n(n − 1)) when directed. */
export function density(g: Graph): number {
  const n = g.names.length, m = g.edges.length;
  if (n < 2) return 0;
  return g.directed ? m / (n * (n - 1)) : (2 * m) / (n * (n - 1));
}

/** Local clustering of each node, average clustering and transitivity, on the graph with direction ignored (unweighted). */
export function clustering(g: Graph) {
  const u = undirected(g), n = u.names.length;
  const nb = u.adj.map((a) => new Set(a.map((x) => x.to)));
  let tri3 = 0, triads = 0;
  const local = u.names.map((_, i) => {
    const list = [...nb[i]], k = list.length;
    if (k < 2) return 0;
    let t = 0;
    for (let a = 0; a < k; a++) { const s = nb[list[a]]; for (let b = a + 1; b < k; b++) if (s.has(list[b])) t++; }
    tri3 += t; triads += (k * (k - 1)) / 2;
    return t / ((k * (k - 1)) / 2);
  });
  return { local, average: n ? local.reduce((s, c) => s + c, 0) / n : 0, transitivity: triads ? tri3 / triads : 0, triangles: tri3 / 3 };
}

/** Connected components with direction ignored (weak components for a directed graph), largest first. comp[i] is node i's component. */
export function components(g: Graph) {
  const u = undirected(g), n = u.names.length, comp = new Array(n).fill(-1), sizes: number[] = [];
  for (let s = 0; s < n; s++) {
    if (comp[s] >= 0) continue;
    const c = sizes.length, q = [s]; comp[s] = c;
    for (let i = 0; i < q.length; i++) for (const a of u.adj[q[i]]) if (comp[a.to] < 0) { comp[a.to] = c; q.push(a.to); }
    sizes.push(q.length);
  }
  // Renumber so component 0 is the largest (ties: the one met first).
  const order = sizes.map((_, i) => i).sort((a, b) => sizes[b] - sizes[a] || a - b), rank = new Array(sizes.length);
  order.forEach((c, r) => (rank[c] = r));
  return { comp: comp.map((c) => rank[c]), sizes: order.map((c) => sizes[c]) };
}

/** Strongly connected components of a directed graph (Tarjan, iterative), largest first. */
export function strongComponents(g: Graph) {
  const n = g.names.length, idx = new Array(n).fill(-1), low = new Array(n).fill(0), on = new Array(n).fill(false), comp = new Array(n).fill(-1), st: number[] = [];
  let t = 0; const sizes: number[] = [];
  for (let r = 0; r < n; r++) {
    if (idx[r] >= 0) continue;
    const call: [number, number][] = [[r, 0]]; idx[r] = low[r] = t++; st.push(r); on[r] = true;
    while (call.length) {
      const top = call[call.length - 1], [v, i] = top;
      if (i < g.adj[v].length) {
        top[1]++; const w = g.adj[v][i].to;
        if (idx[w] < 0) { idx[w] = low[w] = t++; st.push(w); on[w] = true; call.push([w, 0]); }
        else if (on[w]) low[v] = Math.min(low[v], idx[w]);
      } else {
        call.pop();
        if (call.length) { const p = call[call.length - 1][0]; low[p] = Math.min(low[p], low[v]); }
        if (low[v] === idx[v]) { let w: number, size = 0; do { w = st.pop()!; on[w] = false; comp[w] = sizes.length; size++; } while (w !== v); sizes.push(size); }
      }
    }
  }
  const order = sizes.map((_, i) => i).sort((a, b) => sizes[b] - sizes[a] || a - b), rank = new Array(sizes.length);
  order.forEach((c, k) => (rank[c] = k));
  return { comp: comp.map((c) => rank[c]), sizes: order.map((c) => sizes[c]) };
}

/**
 * Diameter, radius and average shortest path length (in edges) of the largest component, with direction ignored, as
 * networkx diameter / radius / average_shortest_path_length on that component. Also the eccentricity of its nodes.
 */
export function distances(g: Graph) {
  const u = undirected(g), { comp, sizes } = components(g), n = u.names.length;
  const members = u.names.map((_, i) => i).filter((i) => comp[i] === 0);
  const ecc = new Array(n).fill(NaN);
  let total = 0, diam = 0, rad = Infinity;
  const dist = new Int32Array(n);
  for (const s of members) {
    dist.fill(-1); dist[s] = 0; const q = [s]; let far = 0;
    for (let i = 0; i < q.length; i++) { const v = q[i]; for (const a of u.adj[v]) if (dist[a.to] < 0) { dist[a.to] = dist[v] + 1; total += dist[a.to]; if (dist[a.to] > far) far = dist[a.to]; q.push(a.to); } }
    ecc[s] = far; if (far > diam) diam = far; if (far < rad) rad = far;
  }
  const k = members.length;
  return { diameter: diam, radius: k ? rad : 0, avgPath: k > 1 ? total / (k * (k - 1)) : 0, ecc, size: sizes[0] ?? 0 };
}

/**
 * Degree assortativity: Pearson correlation of the degrees at the two ends of each edge, as networkx
 * degree_assortativity_coefficient (undirected: each edge both ways; directed: out-degree of the source against
 * in-degree of the target). NaN when every edge joins nodes of the same degree.
 */
export function assortativity(g: Graph): number {
  const xs: number[] = [], ys: number[] = [];
  if (g.directed) for (const e of g.edges) { xs.push(g.adj[e.u].length); ys.push(g.radj[e.v].length); }
  else for (const e of g.edges) { const a = g.adj[e.u].length, b = g.adj[e.v].length; xs.push(a, b); ys.push(b, a); }
  const m = xs.length; if (!m) return NaN;
  const mx = xs.reduce((s, x) => s + x, 0) / m, my = ys.reduce((s, y) => s + y, 0) / m;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < m; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
}

/**
 * PageRank with damping `alpha`, as networkx pagerank: edge weights used (if any), an undirected edge links both ways,
 * and a node with no out-links shares its rank evenly with everyone. Iterates until the total change is below `tol`.
 */
export function pagerank(g: Graph, alpha = 0.85, tol = 1e-13, maxIter = 1000, useWeights = g.weighted) {
  const n = g.names.length;
  if (!n) return { rank: [] as number[], iterations: 0 };
  if (useWeights && g.edges.some((e) => e.w < 0)) throw new Error('PageRank needs weights of 0 or more.');
  const out = g.adj.map((a) => a.reduce((s, x) => s + (useWeights ? x.w : 1), 0));
  let x = new Array(n).fill(1 / n), it = 0;
  for (; it < maxIter; it++) {
    const nx = new Array(n).fill(0);
    let dangle = 0;
    for (let v = 0; v < n; v++) {
      if (out[v] === 0) { dangle += x[v]; continue; }
      for (const a of g.adj[v]) nx[a.to] += (alpha * x[v] * (useWeights ? a.w : 1)) / out[v];
    }
    let err = 0;
    for (let v = 0; v < n; v++) { nx[v] += (alpha * dangle) / n + (1 - alpha) / n; err += Math.abs(nx[v] - x[v]); }
    x = nx;
    if (err < tol) { it++; break; }
  }
  return { rank: x, iterations: it };
}

/** Modularity of a partition (community number per node), as networkx modularity with weights, resolution 1, direction ignored. */
export function modularity(g: Graph, comm: number[], useWeights = g.weighted): number {
  const u = undirected(g);
  let m = 0; const deg = new Array(u.names.length).fill(0);
  for (const e of u.edges) { const w = useWeights ? e.w : 1; m += w; deg[e.u] += w; deg[e.v] += w; }
  if (m <= 0) return 0;
  const inW = new Map<number, number>(), tot = new Map<number, number>();
  for (const e of u.edges) if (comm[e.u] === comm[e.v]) inW.set(comm[e.u], (inW.get(comm[e.u]) ?? 0) + (useWeights ? e.w : 1));
  deg.forEach((d, i) => tot.set(comm[i], (tot.get(comm[i]) ?? 0) + d));
  let q = 0;
  for (const [c, t] of tot) q += (inW.get(c) ?? 0) / m - (t / (2 * m)) ** 2;
  return q;
}

/**
 * Louvain communities (Blondel et al. 2008) with direction ignored: move each node (in list order) to the neighbouring
 * community that raises modularity most, repeat until nothing moves, merge communities into single nodes and start
 * again; stop when modularity rises by less than 1e-7 (as networkx louvain_communities). Communities are numbered
 * largest first.
 */
export function louvain(g: Graph, useWeights = g.weighted, resolution = 1) {
  const u = undirected(g), n0 = u.names.length;
  if (useWeights && u.edges.some((e) => e.w < 0)) throw new Error('Communities need weights of 0 or more.');
  // Current level: nodes with weighted neighbour maps, self-loop weight and degree.
  let nbr: Map<number, number>[] = Array.from({ length: n0 }, () => new Map());
  let deg = new Array(n0).fill(0);
  let m = 0;
  for (const e of u.edges) { const w = useWeights ? e.w : 1; nbr[e.u].set(e.v, (nbr[e.u].get(e.v) ?? 0) + w); nbr[e.v].set(e.u, (nbr[e.v].get(e.u) ?? 0) + w); deg[e.u] += w; deg[e.v] += w; m += w; }
  let member = Array.from({ length: n0 }, (_, i) => i); // original node -> current super-node
  if (m <= 0) return { comm: member.slice(), count: n0, modularity: 0, levels: 0 };
  let mod = modularity(g, member, useWeights), levels = 0;
  for (;;) {
    const n = nbr.length, com = Array.from({ length: n }, (_, i) => i), tot = deg.slice();
    let improved = false, moved = true;
    while (moved) {
      moved = false;
      for (let v = 0; v < n; v++) {
        const k = deg[v], best0 = com[v], wto = new Map<number, number>();
        for (const [x, w] of nbr[v]) if (x !== v) wto.set(com[x], (wto.get(com[x]) ?? 0) + w);
        tot[best0] -= k;
        let best = best0, bestGain = 0;
        const remove = -(wto.get(best0) ?? 0) / m + (resolution * tot[best0] * k) / (2 * m * m);
        for (const [c, w] of wto) {
          const gain = remove + w / m - (resolution * tot[c] * k) / (2 * m * m);
          if (gain > bestGain) { bestGain = gain; best = c; }
        }
        tot[best] += k;
        if (best !== best0) { com[v] = best; moved = true; improved = true; }
      }
    }
    // Relabel communities 0..k-1 in order of first appearance.
    const lab = new Map<number, number>(); for (const c of com) if (!lab.has(c)) lab.set(c, lab.size);
    const next = member.map((s) => lab.get(com[s])!);
    const newMod = modularity(g, next, useWeights);
    if (!improved || newMod - mod <= 1e-7) { if (improved && newMod > mod) { member = next; mod = newMod; levels++; } break; }
    member = next; mod = newMod; levels++;
    // Aggregate.
    const k = lab.size, nn: Map<number, number>[] = Array.from({ length: k }, () => new Map()), nd = new Array(k).fill(0);
    for (let v = 0; v < n; v++) {
      const a = lab.get(com[v])!; nd[a] += deg[v];
      for (const [x, w] of nbr[v]) { const b = lab.get(com[x])!; nn[a].set(b, (nn[a].get(b) ?? 0) + w); }
    }
    nbr = nn; deg = nd;
  }
  // Number communities largest first (ties: first met).
  const size = new Map<number, number>(); for (const c of member) size.set(c, (size.get(c) ?? 0) + 1);
  const first = new Map<number, number>(); member.forEach((c, i) => { if (!first.has(c)) first.set(c, i); });
  const order = [...size.keys()].sort((a, b) => size.get(b)! - size.get(a)! || first.get(a)! - first.get(b)!), rank = new Map(order.map((c, i) => [c, i]));
  const comm = member.map((c) => rank.get(c)!);
  return { comm, count: order.length, modularity: modularity(g, comm, useWeights), levels };
}

/** A small made-up social network: three friend groups of 12, 10 and 12 people with a few links between groups. */
export function exampleNetwork(): string {
  let seed = 20261109;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const groups = [12, 10, 12], names: string[] = [], grp: number[] = [];
  groups.forEach((s, gi) => { for (let i = 0; i < s; i++) { names.push(`${'ABC'[gi]}${i + 1}`); grp.push(gi); } });
  const lines: string[] = [];
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
    const same = grp[i] === grp[j], ring = same && j === i + 1;
    if (ring || rnd() < (same ? 0.3 : 0.025)) lines.push(`${names[i]} ${names[j]}`);
  }
  return lines.join('\n');
}
