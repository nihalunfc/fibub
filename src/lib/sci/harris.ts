// Harris matrix: stratigraphic units (contexts) and their relations (above/below, same as, contemporary with).
// "Same as" joins contexts into one node; "above" (later than) gives a directed edge from the later unit to the
// earlier one. The tool finds cycles (impossible sequences), contemporary pairs that the sequence contradicts,
// removes redundant relations (transitive reduction) and lays the matrix out in layers, latest at the top.

export type RelKind = 'above' | 'same' | 'contemporary';
export type Relation = { a: string; b: string; kind: RelKind; line: number; text: string };
export type Parsed = { contexts: string[]; relations: Relation[]; errors: string[] };

// Word forms people use on context sheets. Each maps to "a is above (later than) b", the reverse, or an equivalence.
const ABOVE = ['above', 'over', 'overlies', 'overlie', 'covers', 'cover', 'cuts', 'cut', 'fills', 'fill', 'seals', 'seal', 'later than', 'later', 'abuts', 'butts', '>'];
const BELOW = ['below', 'under', 'underlies', 'underlie', 'covered by', 'cut by', 'filled by', 'sealed by', 'abutted by', 'earlier than', 'earlier', '<'];
const SAME = ['same as', 'same', 'equals', 'equal to', '='];
const CONT = ['contemporary with', 'contemporary', 'cont', '~'];
const PHRASES: [string, 'above' | 'below' | 'same' | 'contemporary'][] = [
  ...ABOVE.map((p) => [p, 'above'] as [string, 'above']), ...BELOW.map((p) => [p, 'below'] as [string, 'below']),
  ...SAME.map((p) => [p, 'same'] as [string, 'same']), ...CONT.map((p) => [p, 'contemporary'] as [string, 'contemporary']),
].sort((x, y) => y[0].length - x[0].length) as [string, 'above' | 'below' | 'same' | 'contemporary'][];
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** One relation per line: "102 above 105", "105 cut by 102", "7 = 9", "3 ~ 4", or "102, above, 105" from a spreadsheet. A line with one name lists a context with no relations. */
export function parseRelations(text: string): Parsed {
  const contexts: string[] = [], seen = new Set<string>(), relations: Relation[] = [], errors: string[] = [];
  const add = (c: string) => { if (!seen.has(c)) { seen.add(c); contexts.push(c); } };
  let first = true;
  text.replace(/\r\n?/g, '\n').split('\n').forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const isFirst = first; first = false;
    let a = '', b = '', word = '';
    const cells = line.split(/\t|;|,/).map((c) => c.trim()).filter(Boolean);
    if (cells.length === 3) [a, word, b] = cells;
    else {
      for (const [p] of PHRASES) {
        const sym = /^[<>=~]$/.test(p);
        const m = new RegExp(sym ? `^(.+?)\\s*${esc(p)}\\s*(.+)$` : `^(.+?)\\s+${esc(p)}\\s+(.+)$`, 'i').exec(line);
        if (m) { a = m[1].trim(); b = m[2].trim(); word = p; break; }
      }
      if (!word && cells.length === 1 && !/\s/.test(line)) { add(line); return; }
    }
    const kind = PHRASES.find(([p]) => p === word.toLowerCase().replace(/\s+/g, ' '))?.[1];
    // A spreadsheet's header row (three cells, no relation word) is skipped quietly.
    if (!kind && isFirst && cells.length === 3) return;
    if (!a || !b || !kind) { errors.push(`Line ${i + 1}: "${line}" is not a relation. Write it like "102 above 105", "7 same as 9" or "3 contemporary with 4".`); return; }
    if (a === b) { errors.push(`Line ${i + 1}: a context cannot be related to itself (${a}).`); return; }
    add(a); add(b);
    if (kind === 'below') relations.push({ a: b, b: a, kind: 'above', line: i + 1, text: line });
    else relations.push({ a, b, kind, line: i + 1, text: line });
  });
  return { contexts, relations, errors };
}

export type Edge = { from: number; to: number; lines: number[] };
export type Matrix = {
  /** Nodes after joining "same as" contexts; each lists its contexts. */
  nodes: string[][];
  nodeOf: Map<string, number>;
  /** All distinct above→below edges between nodes (from = later, to = earlier). */
  edges: Edge[];
  /** Edges kept after transitive reduction. */
  kept: Edge[];
  /** Edges implied by longer paths (redundant). */
  redundant: Edge[];
  /** Each cycle as a list of node indices (first = last omitted). Empty when the sequence is consistent. */
  cycles: number[][];
  /** Same-as joins that put a context above itself (a node with a self loop). */
  selfLoops: Edge[];
  /** Contemporary pairs (node indices) and whether the sequence puts one above the other. */
  contemporary: { a: number; b: number; lines: number[]; conflict: boolean }[];
  /** Layer of each node (0 = top = latest). Empty if there is a cycle. */
  layer: number[];
  /** Left-to-right order within each layer, including dummy points for long edges; dummies are -1 - edge index. */
  rows: number[][];
  /** Each kept edge as the list of [layer, position] points it passes through. */
  routes: [number, number][][];
};

/** Strongly connected components (Tarjan, iterative). */
export function scc(n: number, adj: number[][]): number[][] {
  let index = 0; const idx = new Array(n).fill(-1), low = new Array(n).fill(0), on = new Array(n).fill(false), st: number[] = [], out: number[][] = [];
  for (let s = 0; s < n; s++) {
    if (idx[s] >= 0) continue;
    const work: [number, number][] = [[s, 0]]; idx[s] = low[s] = index++; st.push(s); on[s] = true;
    while (work.length) {
      const top = work[work.length - 1], [v, k] = top;
      if (k < adj[v].length) {
        top[1]++; const w = adj[v][k];
        if (idx[w] < 0) { idx[w] = low[w] = index++; st.push(w); on[w] = true; work.push([w, 0]); }
        else if (on[w]) low[v] = Math.min(low[v], idx[w]);
      } else {
        work.pop();
        if (work.length) { const u = work[work.length - 1][0]; low[u] = Math.min(low[u], low[v]); }
        if (low[v] === idx[v]) { const comp: number[] = []; let w; do { w = st.pop()!; on[w] = false; comp.push(w); } while (w !== v); out.push(comp); }
      }
    }
  }
  return out;
}

/** One directed cycle inside a strongly connected component (breadth-first from its smallest node back to itself). */
function cycleIn(comp: number[], adj: number[][]): number[] {
  const inC = new Set(comp), s = Math.min(...comp), prev = new Map<number, number>(), q = [s];
  for (let h = 0; h < q.length; h++) {
    const v = q[h];
    for (const w of adj[v]) {
      if (!inC.has(w)) continue;
      if (w === s) { const path = [v]; let u = v; while (u !== s) { u = prev.get(u)!; path.push(u); } return path.reverse(); }
      if (!prev.has(w)) { prev.set(w, v); q.push(w); }
    }
  }
  return [s];
}

/** Topological order (Kahn), or null when there is a cycle. Ties broken by node index so the result is stable. */
export function topo(n: number, adj: number[][]): number[] | null {
  const indeg = new Array(n).fill(0); for (const a of adj) for (const w of a) indeg[w]++;
  const ready = [...Array(n).keys()].filter((v) => !indeg[v]), out: number[] = [];
  while (ready.length) { ready.sort((x, y) => x - y); const v = ready.shift()!; out.push(v); for (const w of adj[v]) if (!--indeg[w]) ready.push(w); }
  return out.length === n ? out : null;
}

/** Transitive reduction of a DAG: an edge u→v is redundant when v can be reached from u by a longer path. */
export function reduce(n: number, edges: [number, number][], order: number[]): boolean[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const W = Math.ceil(n / 32), reach = Array.from({ length: n }, () => new Uint32Array(W));
  // Process in reverse topological order: reach[u] = union over children of ({child} ∪ reach[child]).
  for (let k = n - 1; k >= 0; k--) {
    const u = order[k];
    for (const v of adj[u]) { reach[u][v >> 5] |= 1 << (v & 31); for (let w = 0; w < W; w++) reach[u][w] |= reach[v][w]; }
  }
  return edges.map(([u, v]) => adj[u].some((c) => c !== v && (reach[c][v >> 5] >>> (v & 31)) & 1));
}

/** Build the matrix: join same-as contexts, check for cycles and contradictions, reduce and lay out. */
export function buildMatrix(p: Parsed): Matrix {
  const id = new Map(p.contexts.map((c, i) => [c, i]));
  const parent = p.contexts.map((_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const r of p.relations) if (r.kind === 'same') { const a = find(id.get(r.a)!), b = find(id.get(r.b)!); if (a !== b) parent[Math.max(a, b)] = Math.min(a, b); }
  const roots = [...new Set(p.contexts.map((_, i) => find(i)))].sort((x, y) => x - y);
  const nodeIdx = new Map(roots.map((r, k) => [r, k]));
  const nodes = roots.map(() => [] as string[]);
  const nodeOf = new Map<string, number>();
  p.contexts.forEach((c, i) => { const k = nodeIdx.get(find(i))!; nodes[k].push(c); nodeOf.set(c, k); });
  const n = nodes.length;
  const emap = new Map<string, Edge>(), selfLoops: Edge[] = [];
  for (const r of p.relations) {
    if (r.kind !== 'above') continue;
    const u = nodeOf.get(r.a)!, v = nodeOf.get(r.b)!, key = `${u}>${v}`;
    if (u === v) { const s = selfLoops.find((e) => e.from === u); if (s) s.lines.push(r.line); else selfLoops.push({ from: u, to: v, lines: [r.line] }); continue; }
    const e = emap.get(key); if (e) e.lines.push(r.line); else emap.set(key, { from: u, to: v, lines: [r.line] });
  }
  const edges = [...emap.values()];
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const e of edges) adj[e.from].push(e.to);
  for (const a of adj) a.sort((x, y) => x - y);
  const cycles = scc(n, adj).filter((c) => c.length > 1).map((c) => cycleIn(c, adj));
  const cmap = new Map<string, { a: number; b: number; lines: number[]; conflict: boolean }>();
  for (const r of p.relations) {
    if (r.kind !== 'contemporary') continue;
    const a = nodeOf.get(r.a)!, b = nodeOf.get(r.b)!; if (a === b) continue;
    const key = `${Math.min(a, b)}~${Math.max(a, b)}`, c = cmap.get(key);
    if (c) c.lines.push(r.line); else cmap.set(key, { a: Math.min(a, b), b: Math.max(a, b), lines: [r.line], conflict: false });
  }
  const contemporary = [...cmap.values()];
  const empty = { nodes, nodeOf, edges, contemporary, selfLoops, cycles };
  const order = topo(n, adj);
  if (!order || selfLoops.length) {
    for (const c of contemporary) c.conflict = false;
    return { ...empty, kept: edges, redundant: [], layer: [], rows: [], routes: [] };
  }
  const red = reduce(n, edges.map((e) => [e.from, e.to]), order);
  const kept = edges.filter((_, i) => !red[i]), redundant = edges.filter((_, i) => red[i]);
  // Reachability for contemporary checks.
  const reachable = (s: number, t: number) => { const seen = new Set([s]), q = [s]; for (let h = 0; h < q.length; h++) for (const w of adj[q[h]]) { if (w === t) return true; if (!seen.has(w)) { seen.add(w); q.push(w); } } return false; };
  for (const c of contemporary) c.conflict = reachable(c.a, c.b) || reachable(c.b, c.a);
  const { layer, rows, routes } = layout(n, kept, contemporary.filter((c) => !c.conflict));
  return { ...empty, kept, redundant, layer, rows, routes };
}

/**
 * Layered (Sugiyama-style) layout of the reduced matrix: each node goes one layer below the lowest unit above it
 * (longest path from the top); contemporary units share a layer when that keeps every edge pointing down; edges
 * that span several layers get dummy points; layers are ordered by repeated barycentre sweeps to cut crossings.
 */
export function layout(n: number, kept: Edge[], cont: { a: number; b: number }[] = []) {
  // Longest-path layering, then pull contemporaries level with the lower of the two when no edge breaks.
  const layer = new Array(n).fill(0);
  const adj: number[][] = Array.from({ length: n }, () => []), radj: number[][] = Array.from({ length: n }, () => []);
  for (const e of kept) { adj[e.from].push(e.to); radj[e.to].push(e.from); }
  const order = topo(n, adj)!;
  const relax = () => { for (const v of order) for (const w of adj[v]) layer[w] = Math.max(layer[w], layer[v] + 1); };
  relax();
  for (let it = 0; it < n + 2; it++) {
    let changed = false;
    for (const c of cont) { const L = Math.max(layer[c.a], layer[c.b]); if (layer[c.a] !== L || layer[c.b] !== L) { layer[c.a] = layer[c.b] = L; changed = true; } }
    relax();
    if (!changed) break;
  }
  const depth = n ? Math.max(...layer) + 1 : 0;
  // Dummy points: edge k spanning layers gets ids -1-k-1000*j ... keep a per-edge list.
  const rows: number[][] = Array.from({ length: depth }, () => []);
  for (let v = 0; v < n; v++) rows[layer[v]].push(v);
  const chains: number[][] = []; // per kept edge: the ids in each layer from top to bottom
  let nextDummy = -1;
  const dummyLayer = new Map<number, number>();
  kept.forEach((e) => {
    const chain = [e.from];
    for (let L = layer[e.from] + 1; L < layer[e.to]; L++) { const d = nextDummy--; dummyLayer.set(d, L); rows[L].push(d); chain.push(d); }
    chain.push(e.to); chains.push(chain);
  });
  // Neighbours between consecutive layers.
  const up = new Map<number, number[]>(), down = new Map<number, number[]>();
  const link = (m: Map<number, number[]>, k: number, v: number) => { const a = m.get(k); if (a) a.push(v); else m.set(k, [v]); };
  for (const c of chains) for (let i = 0; i + 1 < c.length; i++) { link(down, c[i], c[i + 1]); link(up, c[i + 1], c[i]); }
  const pos = new Map<number, number>();
  const setPos = () => rows.forEach((r) => r.forEach((v, i) => pos.set(v, i)));
  // Start each row in node-number order (dummies after), then sweep.
  for (const r of rows) r.sort((a, b) => (a < 0 ? 1e9 - a : a) - (b < 0 ? 1e9 - b : b));
  setPos();
  const crossings = () => {
    let c = 0;
    for (let L = 0; L + 1 < rows.length; L++) {
      const segs: [number, number][] = [];
      for (const v of rows[L]) for (const w of down.get(v) ?? []) segs.push([pos.get(v)!, pos.get(w)!]);
      for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) if ((segs[i][0] - segs[j][0]) * (segs[i][1] - segs[j][1]) < 0) c++;
    }
    return c;
  };
  let best = rows.map((r) => [...r]), bestC = crossings();
  for (let sweep = 0; sweep < 24 && bestC > 0; sweep++) {
    const downward = sweep % 2 === 0;
    const Ls = downward ? [...Array(rows.length).keys()].slice(1) : [...Array(rows.length).keys()].reverse().slice(1);
    for (const L of Ls) {
      const nb = downward ? up : down;
      const bary = new Map(rows[L].map((v) => { const ns = nb.get(v) ?? []; return [v, ns.length ? ns.reduce((s, w) => s + pos.get(w)!, 0) / ns.length : pos.get(v)!]; }));
      rows[L].sort((a, b) => bary.get(a)! - bary.get(b)! || pos.get(a)! - pos.get(b)!);
      rows[L].forEach((v, i) => pos.set(v, i));
    }
    const c = crossings();
    if (c < bestC) { bestC = c; best = rows.map((r) => [...r]); }
  }
  rows.splice(0, rows.length, ...best); setPos();
  const at = (v: number): [number, number] => [v >= 0 ? layer[v] : dummyLayer.get(v)!, pos.get(v)!];
  const routes = chains.map((c) => c.map(at));
  return { layer, rows, routes, crossings: bestC };
}

/** Plain-text label of a node: its contexts joined with "=". */
export const nodeLabel = (m: Matrix, k: number) => m.nodes[k].join(' = ');

/** The made-up example: a small pit, a wall and floors (contexts invented for this tool), with one redundant relation. */
export const EXAMPLE = `# Made-up example: one relation per line
1 above 2
2 above 3
2 above 4
3 above 5
4 above 5
5 cuts 6
6 above 7
5 above 7
8 above 3
8 same as 9
9 above 10
10 above 6
3 contemporary with 4
11 above 7
11 contemporary with 6`;
