// Building trees from a small DNA alignment: pairwise distances (p, Jukes-Cantor, Kimura 2-parameter), UPGMA,
// neighbour joining (Saitou and Nei 1987, Studier and Keppler 1988) and maximum parsimony (Fitch 1971 scores;
// exact branch and bound search after Hendy and Penny 1982, or stepwise addition plus SPR rearrangement).
// Plain TypeScript, no DOM.
import { cluster } from './ordination.ts';

export type Seq = { name: string; seq: string };
export type Model = 'p' | 'jc' | 'k2p';

/** Read FASTA. Spaces and digits inside sequences are ignored; U becomes T; letters are upper-cased. */
export function parseFasta(text: string): Seq[] {
  const out: Seq[] = [];
  let cur: Seq | null = null;
  for (const raw of text.replace(/\r/g, '').split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('>')) { cur = { name: line.slice(1).trim() || `Seq ${out.length + 1}`, seq: '' }; out.push(cur); continue; }
    if (!cur) throw new Error('FASTA starts with a line beginning with >, then the name.');
    cur.seq += line.replace(/[\s\d]/g, '').toUpperCase().replace(/U/g, 'T');
  }
  return out;
}

const PURINE = new Set(['A', 'G']);
const isBase = (c: string) => c === 'A' || c === 'C' || c === 'G' || c === 'T';

export type PairCount = { sites: number; diff: number; ts: number; tv: number };
/** Compare two aligned sequences at the given columns (or every column), skipping columns where either is not
 *  A, C, G or T. */
export function countPair(a: string, b: string, cols?: number[]): PairCount {
  let sites = 0, ts = 0, tv = 0;
  const idx = cols ?? Array.from({ length: Math.min(a.length, b.length) }, (_, i) => i);
  for (const i of idx) {
    const x = a[i], y = b[i];
    if (!isBase(x) || !isBase(y)) continue;
    sites++;
    if (x !== y) { if (PURINE.has(x) === PURINE.has(y)) ts++; else tv++; }
  }
  return { sites, diff: ts + tv, ts, tv };
}

/** Distance from counts. NaN when the correction is not defined (too many differences). */
export function distance(c: PairCount, model: Model): number {
  if (!c.sites) return NaN;
  const p = c.diff / c.sites;
  if (model === 'p') return p;
  if (model === 'jc') { const x = 1 - (4 * p) / 3; return x > 0 ? -0.75 * Math.log(x) : NaN; }
  const P = c.ts / c.sites, Q = c.tv / c.sites, a = 1 - 2 * P - Q, b = 1 - 2 * Q;
  return a > 0 && b > 0 ? -0.5 * Math.log(a) - 0.25 * Math.log(b) : NaN;
}

/** Columns where every sequence has A, C, G or T ("complete deletion"). */
export function cleanColumns(seqs: Seq[]): number[] {
  const L = seqs[0].seq.length, out: number[] = [];
  for (let i = 0; i < L; i++) if (seqs.every((s) => isBase(s.seq[i]))) out.push(i);
  return out;
}

export function distanceMatrix(seqs: Seq[], model: Model, gaps: 'pairwise' | 'complete') {
  const n = seqs.length, cols = gaps === 'complete' ? cleanColumns(seqs) : undefined;
  const D = Array.from({ length: n }, () => new Array(n).fill(0)), C: PairCount[][] = Array.from({ length: n }, () => new Array(n));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const c = countPair(seqs[i].seq, seqs[j].seq, cols); C[i][j] = C[j][i] = c; D[i][j] = D[j][i] = distance(c, model); }
  return { D, counts: C, sites: cols?.length };
}

// ---------- Newick helpers ----------
const quote = (s: string) => (/[\s(),:;[\]'_]/.test(s) ? `'${s.replace(/'/g, "''")}'` : s);
const f = (x: number) => String(+x.toPrecision(10));

/** UPGMA: average linkage, with node heights half the joining distance, so the tree is ultrametric. */
export function upgma(D: number[][], names: string[]): string {
  const n = names.length, Z = cluster(D, 'average'), h = (c: number) => (c < n ? 0 : Z[c - n][2] / 2);
  const w = (c: number, ph: number): string => (c < n ? quote(names[c]) : `(${w(Z[c - n][0], h(c))},${w(Z[c - n][1], h(c))})`) + `:${f(ph - h(c))}`;
  const top = Z[n - 2];
  return `(${w(top[0], top[2] / 2)},${w(top[1], top[2] / 2)});`;
}

export type Edge = { a: number; b: number; len: number };
/** Neighbour joining. Returns the unrooted tree as edges between nodes (tips 0..n−1, inner nodes n, n+1, ...),
 *  with branch lengths as computed (they can come out slightly negative). */
export function nj(D: number[][]): Edge[] {
  const n = D.length, edges: Edge[] = [];
  let ids = Array.from({ length: n }, (_, i) => i), d = D.map((r) => r.slice()), next = n;
  while (ids.length > 3) {
    const m = ids.length, r = d.map((row) => row.reduce((s, v) => s + v, 0));
    let bi = 0, bj = 1, best = Infinity;
    for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) { const Q = (m - 2) * d[i][j] - r[i] - r[j]; if (Q < best - 1e-12) { best = Q; bi = i; bj = j; } }
    const li = d[bi][bj] / 2 + (r[bi] - r[bj]) / (2 * (m - 2)), lj = d[bi][bj] - li, u = next++;
    edges.push({ a: u, b: ids[bi], len: li }, { a: u, b: ids[bj], len: lj });
    const keep = ids.map((_, k) => k).filter((k) => k !== bi && k !== bj);
    const du = keep.map((k) => (d[bi][k] + d[bj][k] - d[bi][bj]) / 2);
    d = [...keep.map((k, x) => [...keep.map((l) => d[k][l]), du[x]]), [...du, 0]];
    ids = [...keep.map((k) => ids[k]), u];
  }
  if (ids.length === 3) {
    const [x, y, z] = [0, 1, 2], c = next++;
    edges.push({ a: c, b: ids[x], len: (d[x][y] + d[x][z] - d[y][z]) / 2 }, { a: c, b: ids[y], len: (d[x][y] + d[y][z] - d[x][z]) / 2 }, { a: c, b: ids[z], len: (d[x][z] + d[y][z] - d[x][y]) / 2 });
  } else edges.push({ a: ids[0], b: ids[1], len: d[0][1] });
  return edges;
}

/** Tip-to-tip path lengths of an edge-list tree. */
export function patristic(edges: Edge[], n: number): number[][] {
  const adj = new Map<number, { to: number; l: number }[]>();
  for (const e of edges) { if (!adj.has(e.a)) adj.set(e.a, []); if (!adj.has(e.b)) adj.set(e.b, []); adj.get(e.a)!.push({ to: e.b, l: e.len }); adj.get(e.b)!.push({ to: e.a, l: e.len }); }
  return Array.from({ length: n }, (_, i) => {
    const dist = new Map<number, number>([[i, 0]]), st = [i];
    while (st.length) { const v = st.pop()!; for (const e of adj.get(v) ?? []) if (!dist.has(e.to)) { dist.set(e.to, dist.get(v)! + e.l); st.push(e.to); } }
    return Array.from({ length: n }, (_, j) => dist.get(j)!);
  });
}

/** Newick of an unrooted edge-list tree, written from an inner node next to tip `at` (so it may have three
 *  branches at the base). `lengths` false leaves branch lengths out; negative lengths are written as 0. */
export function edgesNewick(edges: Edge[], names: string[], lengths = true, at = 0): string {
  const adj = new Map<number, { to: number; l: number }[]>();
  for (const e of edges) { if (!adj.has(e.a)) adj.set(e.a, []); if (!adj.has(e.b)) adj.set(e.b, []); adj.get(e.a)!.push({ to: e.b, l: e.len }); adj.get(e.b)!.push({ to: e.a, l: e.len }); }
  const n = names.length;
  const w = (v: number, from: number, l: number | null): string => {
    const kids = (adj.get(v) ?? []).filter((e) => e.to !== from);
    const body = v < n ? quote(names[v]) : `(${kids.map((e) => w(e.to, v, e.l)).join(',')})`;
    return body + (lengths && l !== null ? `:${f(Math.max(0, l))}` : '');
  };
  if (n === 2) return `(${quote(names[0])}${lengths ? `:${f(Math.max(0, edges[0].len))}` : ''},${quote(names[1])}${lengths ? ':0' : ''});`;
  const start = adj.get(at)![0].to;
  return w(start, -1, null) + ';';
}

// ---------- Parsimony ----------
const MASK: Record<string, number> = { A: 1, C: 2, G: 4, T: 8, R: 5, Y: 10, S: 6, W: 9, K: 12, M: 3, B: 14, D: 13, H: 11, V: 7, N: 15, '-': 15, '?': 15, '.': 15 };
export type Patterns = { tips: Uint8Array[]; w: number[]; informative: number; variable: number; sites: number };
/** Site patterns (identical columns merged, with weights). Gaps and N count as "any base" (missing). */
export function patterns(seqs: Seq[]): Patterns {
  const n = seqs.length, L = seqs[0].seq.length, map = new Map<string, number>(), cols: number[][] = [], w: number[] = [];
  let informative = 0, variable = 0;
  for (let i = 0; i < L; i++) {
    const col = seqs.map((s) => MASK[s.seq[i]] ?? 15);
    // A column is informative when at least two states each occur (unambiguously) in at least two sequences.
    const cnt = new Map<number, number>(); for (const m of col) if (m === 1 || m === 2 || m === 4 || m === 8) cnt.set(m, (cnt.get(m) ?? 0) + 1);
    if ([...cnt.values()].filter((c) => c >= 2).length >= 2) informative++;
    if (cnt.size >= 2) variable++;
    const key = col.join(',');
    const k = map.get(key);
    if (k === undefined) { map.set(key, cols.length); cols.push(col); w.push(1); } else w[k]++;
  }
  const tips = Array.from({ length: n }, (_, t) => Uint8Array.from(cols.map((c) => c[t])));
  return { tips, w, informative, variable, sites: L };
}

/** Fitch score of an unrooted binary tree given as edges (tips 0..n−1). */
export function fitchScore(edges: [number, number][], P: Patterns): number {
  const n = P.tips.length, adj: number[][] = [];
  for (const [a, b] of edges) { (adj[a] ??= []).push(b); (adj[b] ??= []).push(a); }
  const K = P.w.length;
  let score = 0;
  const down = (v: number, from: number): Uint8Array => {
    if (v < n) return P.tips[v];
    const kids = adj[v].filter((x) => x !== from);
    let s = down(kids[0], v);
    for (let c = 1; c < kids.length; c++) {
      const t = down(kids[c], v), r = new Uint8Array(K);
      for (let k = 0; k < K; k++) { const i = s[k] & t[k]; if (i) r[k] = i; else { r[k] = s[k] | t[k]; score += P.w[k]; } }
      s = r;
    }
    return s;
  };
  if (n === 2) { for (let k = 0; k < K; k++) if (!(P.tips[0][k] & P.tips[1][k])) score += P.w[k]; return score; }
  const s = down(adj[0][0], 0), t0 = P.tips[0];
  for (let k = 0; k < K; k++) if (!(s[k] & t0[k])) score += P.w[k];
  return score;
}

/** Insert tip `t` (with new inner node `u`) on edge index `e`. Returns the edge list (a new array). */
function insert(edges: [number, number][], e: number, t: number, u: number): [number, number][] {
  const [a, b] = edges[e], out = edges.slice();
  out[e] = [a, u]; out.push([u, b], [u, t]);
  return out;
}

/** Stepwise addition: each taxon in turn goes on the branch where it adds least to the score. */
export function stepwise(P: Patterns): [number, number][] {
  const n = P.tips.length;
  let tree: [number, number][] = [[n, 0], [n, 1], [n, 2]];
  for (let t = 3; t < n; t++) {
    let best: [number, number][] = [], bs = Infinity;
    for (let e = 0; e < tree.length; e++) {
      const c = insert(tree, e, t, n + t - 2);
      const sub = { ...P, tips: P.tips.slice(0, t + 1) };
      const s = fitchScore(c, sub);
      if (s < bs) { bs = s; best = c; }
    }
    tree = best;
  }
  return tree;
}

/** Subtree pruning and regrafting until no move lowers the score. */
export function spr(start: [number, number][], P: Patterns, maxRounds = 50): { tree: [number, number][]; score: number; rounds: number; scored: number } {
  const n = P.tips.length;
  let tree = start, score = fitchScore(tree, P), rounds = 0, scored = 1;
  for (; rounds < maxRounds; rounds++) {
    let improved = false;
    outer: for (let e = 0; e < tree.length; e++) {
      for (const [u, v] of [tree[e], [tree[e][1], tree[e][0]] as [number, number]]) {
        // Prune the subtree hanging from v below inner node u.
        if (u < n) continue;
        const others = tree.filter(([a, b]) => (a === u || b === u) && !((a === u && b === v) || (a === v && b === u))).map(([a, b]) => (a === u ? b : a));
        if (others.length !== 2) continue;
        const [x, y] = others;
        const rest = tree.filter(([a, b]) => a !== u && b !== u);
        rest.push([x, y]);
        // Nodes in the pruned subtree, so we do not regraft inside it.
        const adj = new Map<number, number[]>(); for (const [a, b] of tree) { adj.set(a, [...(adj.get(a) ?? []), b]); adj.set(b, [...(adj.get(b) ?? []), a]); }
        const inSub = new Set<number>([v]); const st = [v];
        while (st.length) { const z = st.pop()!; for (const w of adj.get(z)!) if (w !== u && !inSub.has(w)) { inSub.add(w); st.push(w); } }
        for (let g = 0; g < rest.length; g++) {
          const [a, b] = rest[g];
          if (inSub.has(a) || inSub.has(b)) continue;
          if ((a === x && b === y) || (a === y && b === x)) continue; // back where it was
          const cand = rest.slice(); cand[g] = [a, u]; cand.push([u, b], [u, v]);
          const s = fitchScore(cand, P); scored++;
          if (s < score) { tree = cand; score = s; improved = true; break outer; }
        }
      }
    }
    if (!improved) break;
  }
  return { tree, score, rounds, scored };
}

export type MpResult = { trees: [number, number][][]; score: number; exact: boolean; examined: number; capped: boolean; method: string };
/** Maximum parsimony. Exact (branch and bound) when `exact` and the search stays under `limit` partial trees;
 *  otherwise stepwise addition followed by SPR. Collects up to `keep` equally best trees in the exact search. */
export function parsimony(P: Patterns, exact: boolean, limit = 2_000_000, keep = 100): MpResult {
  const n = P.tips.length;
  if (n === 3) { const t: [number, number][] = [[3, 0], [3, 1], [3, 2]]; return { trees: [t], score: fitchScore(t, P), exact: true, examined: 1, capped: false, method: 'only one tree' }; }
  const h = spr(stepwise(P), P);
  if (!exact) return { trees: [h.tree], score: h.score, exact: false, examined: h.scored, capped: false, method: 'stepwise addition + SPR' };
  let best = h.score, trees: [number, number][][] = [], examined = 0, aborted = false;
  const subs = Array.from({ length: n + 1 }, (_, m) => ({ ...P, tips: P.tips.slice(0, m) }));
  const grow = (tree: [number, number][], t: number) => {
    if (aborted) return;
    for (let e = 0; e < tree.length; e++) {
      const c = insert(tree, e, t, n + t - 2), s = fitchScore(c, subs[t + 1]);
      if (++examined > limit) { aborted = true; return; }
      if (s > best) continue;
      if (t === n - 1) { if (s < best) { best = s; trees = []; } if (trees.length < keep) trees.push(c); }
      else grow(c, t + 1);
      if (aborted) return;
    }
  };
  grow([[n, 0], [n, 1], [n, 2]], 3);
  if (aborted) return { trees: [h.tree], score: h.score, exact: false, examined, capped: false, method: 'stepwise addition + SPR (the exact search was too large)' };
  return { trees, score: best, exact: true, examined, capped: trees.length >= keep, method: 'branch and bound (exact)' };
}

/** Number of distinct unrooted binary trees for n tips: (2n − 5)!! */
export function treeCount(n: number) { let c = 1; for (let k = 3; k <= 2 * n - 5; k += 2) c *= k; return c; }
