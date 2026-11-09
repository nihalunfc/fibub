// Correspondence networks: letters (sender, recipient, date, place) become an undirected network of people whose
// edge weights are the number of letters between them. Measures: degree, strength (letters sent + received),
// betweenness centrality (Brandes 2001, unweighted shortest paths, normalised as in networkx), communities by greedy
// modularity maximisation (Clauset, Newman and Moore 2004, weighted) and a seeded Fruchterman-Reingold layout.
// Plain TypeScript, no DOM.
import { mulberry32 } from './lda.ts';

export type Letter = { from: string; to: string; date: string; place: string };

/** Rows of a pasted table: tab-separated if the text has tabs, otherwise comma- or semicolon-separated with "quotes". */
export function readRows(text: string): string[][] {
  const t = text.replace(/\r\n?/g, '\n');
  const first = t.split('\n').find((l) => l.trim()) ?? '';
  if (first.includes('\t')) return t.split('\n').filter((l) => l.trim()).map((l) => l.split('\t').map((c) => c.trim()));
  const sep = (first.match(/;/g)?.length ?? 0) > (first.match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = []; let row: string[] = [], cell = '', q = false;
  for (let i = 0; i <= t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else if (c !== undefined) cell += c; continue; }
    if (c === '"' && !cell.trim()) { q = true; cell = ''; }
    else if (c === sep) { row.push(cell.trim()); cell = ''; }
    else if (c === '\n' || c === undefined) { row.push(cell.trim()); if (row.some((x) => x)) rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  return rows;
}

const HEAD: Record<keyof Letter, RegExp> = {
  from: /^(sender|from|author|writer|correspondent)$/i,
  to: /^(recipient|to|addressee|receiver)$/i,
  date: /^(date|year|when|sent)$/i,
  place: /^(place|location|from place|sent from|origin)$/i,
};
/**
 * Letters from rows. A first row naming the columns (sender/from, recipient/to, date, place) sets their order;
 * otherwise the order is sender, recipient, date, place. Rows without both names are counted as skipped.
 */
export function readLetters(text: string): { letters: Letter[]; skipped: number; header: boolean } {
  const rows = readRows(text);
  if (!rows.length) return { letters: [], skipped: 0, header: false };
  const h = rows[0].map((c) => c.toLowerCase().replace(/[_-]+/g, ' ').trim());
  const idx = { from: h.findIndex((c) => HEAD.from.test(c)), to: h.findIndex((c) => HEAD.to.test(c)), date: h.findIndex((c) => HEAD.date.test(c)), place: h.findIndex((c) => HEAD.place.test(c)) };
  const header = idx.from >= 0 && idx.to >= 0;
  const col = header ? idx : { from: 0, to: 1, date: 2, place: 3 };
  const letters: Letter[] = []; let skipped = 0;
  for (const r of rows.slice(header ? 1 : 0)) {
    const g = (k: keyof Letter) => (col[k] >= 0 ? (r[col[k]] ?? '').trim() : '');
    const L = { from: g('from').replace(/\s+/g, ' '), to: g('to').replace(/\s+/g, ' '), date: g('date'), place: g('place') };
    if (!L.from || !L.to || L.from === L.to) { skipped++; continue; }
    letters.push(L);
  }
  return { letters, skipped, header };
}

/** A date written as YYYY, YYYY-MM or YYYY-MM-DD (also with / or .), as a sortable "YYYY-MM-DD" with 00 for missing parts; '' if unreadable. */
export function dateKey(s: string): string {
  const m = /^\s*(-?\d{1,4})(?:[-/.](\d{1,2}))?(?:[-/.](\d{1,2}))?/.exec(s);
  if (!m) return '';
  const y = Number(m[1]);
  return `${y < 0 ? '-' : ''}${String(Math.abs(y)).padStart(4, '0')}-${String(m[2] ?? 0).padStart(2, '0')}-${String(m[3] ?? 0).padStart(2, '0')}`;
}
/** Keep letters dated within [from, to] (either may be blank; "1820" as "to" means to the end of 1820). Undated letters are kept only with no filter. */
export function filterLetters(letters: Letter[], from: string, to: string): { kept: Letter[]; undated: number } {
  const lo = from.trim() ? dateKey(from) : '', hiRaw = to.trim() ? dateKey(to) : '';
  const hi = hiRaw ? hiRaw.replace(/-00-00$/, '-99-99').replace(/-00$/, '-99') : '';
  if (!lo && !hi) return { kept: letters, undated: 0 };
  let undated = 0;
  const kept = letters.filter((l) => { const k = dateKey(l.date); if (!k) { undated++; return false; } return (!lo || k >= lo) && (!hi || k <= hi); });
  return { kept, undated };
}

export type Network = {
  names: string[];
  /** Undirected weighted edges a < b, weight = letters either way. */
  edges: { a: number; b: number; w: number; ab: number; ba: number }[];
  adj: Map<number, number>[];
  sent: number[]; received: number[];
};
export function buildNetwork(letters: Letter[]): Network {
  const id = new Map<string, number>(), names: string[] = [];
  const get = (n: string) => { let k = id.get(n); if (k === undefined) { k = names.length; id.set(n, k); names.push(n); } return k; };
  const em = new Map<string, { a: number; b: number; w: number; ab: number; ba: number }>();
  const sent: number[] = [], received: number[] = [];
  for (const l of letters) {
    const f = get(l.from), t = get(l.to);
    sent[f] = (sent[f] ?? 0) + 1; received[t] = (received[t] ?? 0) + 1;
    const a = Math.min(f, t), b = Math.max(f, t), k = `${a},${b}`;
    const e = em.get(k) ?? { a, b, w: 0, ab: 0, ba: 0 }; e.w++; if (f === a) e.ab++; else e.ba++; em.set(k, e);
  }
  const edges = [...em.values()];
  const adj = names.map(() => new Map<number, number>());
  for (const e of edges) { adj[e.a].set(e.b, e.w); adj[e.b].set(e.a, e.w); }
  return { names, edges, adj, sent: names.map((_, i) => sent[i] ?? 0), received: names.map((_, i) => received[i] ?? 0) };
}

export const degree = (n: Network) => n.adj.map((m) => m.size);
export const strength = (n: Network) => n.adj.map((m) => [...m.values()].reduce((a, b) => a + b, 0));

/** Betweenness centrality on unweighted shortest paths (Brandes), normalised by 2/((n−1)(n−2)) as networkx does for undirected graphs. */
export function betweenness(n: Network): number[] {
  const N = n.names.length, C = new Array<number>(N).fill(0);
  for (let s = 0; s < N; s++) {
    const S: number[] = [], P: number[][] = Array.from({ length: N }, () => []), sigma = new Array<number>(N).fill(0), d = new Array<number>(N).fill(-1);
    sigma[s] = 1; d[s] = 0; const Q = [s];
    for (let h = 0; h < Q.length; h++) {
      const v = Q[h]; S.push(v);
      for (const w of n.adj[v].keys()) {
        if (d[w] < 0) { d[w] = d[v] + 1; Q.push(w); }
        if (d[w] === d[v] + 1) { sigma[w] += sigma[v]; P[w].push(v); }
      }
    }
    const delta = new Array<number>(N).fill(0);
    while (S.length) { const w = S.pop()!; for (const v of P[w]) delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]); if (w !== s) C[w] += delta[w]; }
  }
  const scale = N > 2 ? 1 / ((N - 1) * (N - 2)) : 0; // each pair counted twice above, so 2/((n-1)(n-2)) / 2
  return C.map((c) => c * scale);
}

/** Weighted modularity Q of a partition (community number per node). */
export function modularity(n: Network, comm: number[]): number {
  const s = strength(n), m2 = s.reduce((a, b) => a + b, 0);
  if (!m2) return 0;
  let q = 0;
  for (const e of n.edges) if (comm[e.a] === comm[e.b]) q += (2 * e.w) / m2;
  const tot = new Map<number, number>(); s.forEach((x, i) => tot.set(comm[i], (tot.get(comm[i]) ?? 0) + x));
  for (const t of tot.values()) q -= (t / m2) ** 2;
  return q;
}

/**
 * Communities by greedy modularity maximisation (Clauset-Newman-Moore): start with every person alone and keep
 * joining the two connected communities that raise modularity most, until no join helps. Ties go to the pair with
 * the lowest numbers. Communities are numbered largest first (ties: earliest member).
 */
export function greedyCommunities(n: Network): number[] {
  const N = n.names.length, s = strength(n), m2 = s.reduce((a, b) => a + b, 0);
  const comm = n.names.map((_, i) => i);
  if (!m2) return comm;
  const e = new Map<number, Map<number, number>>(), a = new Map<number, number>();
  for (let i = 0; i < N; i++) { e.set(i, new Map()); a.set(i, s[i] / m2); }
  for (const ed of n.edges) { e.get(ed.a)!.set(ed.b, ed.w / m2); e.get(ed.b)!.set(ed.a, ed.w / m2); }
  for (;;) {
    let best = 1e-12, bi = -1, bj = -1;
    for (const [i, row] of e) for (const [j, eij] of row) {
      if (j <= i) continue;
      const dq = 2 * (eij - a.get(i)! * a.get(j)!);
      if (dq > best + 1e-15) { best = dq; bi = i; bj = j; }
    }
    if (bi < 0) break;
    // Join bj into bi.
    const ri = e.get(bi)!, rj = e.get(bj)!;
    for (const [k, v] of rj) { if (k === bi) continue; ri.set(k, (ri.get(k) ?? 0) + v); const rk = e.get(k)!; rk.set(bi, (rk.get(bi) ?? 0) + v); rk.delete(bj); }
    ri.delete(bj); e.delete(bj);
    a.set(bi, a.get(bi)! + a.get(bj)!); a.delete(bj);
    for (let k = 0; k < N; k++) if (comm[k] === bj) comm[k] = bi;
  }
  const groups = new Map<number, number[]>();
  comm.forEach((c, i) => groups.set(c, [...(groups.get(c) ?? []), i]));
  const order = [...groups.values()].sort((x, y) => y.length - x.length || x[0] - y[0]);
  const out = new Array<number>(N);
  order.forEach((g, k) => g.forEach((i) => (out[i] = k)));
  return out;
}

/** Fruchterman-Reingold force layout in the unit square, seeded; edge pull grows with the number of letters. */
export function layout(n: Network, seed = 1, iterations = 300): [number, number][] {
  const N = n.names.length, rand = mulberry32(seed);
  const p: [number, number][] = n.names.map(() => [rand(), rand()]);
  if (N < 2) return N ? [[0.5, 0.5]] : [];
  const k = Math.sqrt(1 / N), maxW = Math.max(...n.edges.map((e) => e.w), 1);
  let t = 0.1;
  for (let it = 0; it < iterations; it++) {
    const d: [number, number][] = p.map(() => [0, 0]);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      let dx = p[i][0] - p[j][0], dy = p[i][1] - p[j][1], dist = Math.hypot(dx, dy);
      if (dist < 1e-9) { dx = (rand() - 0.5) * 1e-3; dy = (rand() - 0.5) * 1e-3; dist = Math.hypot(dx, dy); }
      const f = (k * k) / dist;
      d[i][0] += (dx / dist) * f; d[i][1] += (dy / dist) * f; d[j][0] -= (dx / dist) * f; d[j][1] -= (dy / dist) * f;
    }
    for (const e of n.edges) {
      const dx = p[e.a][0] - p[e.b][0], dy = p[e.a][1] - p[e.b][1], dist = Math.max(1e-9, Math.hypot(dx, dy));
      const f = ((dist * dist) / k) * (0.5 + (0.5 * e.w) / maxW);
      d[e.a][0] -= (dx / dist) * f; d[e.a][1] -= (dy / dist) * f; d[e.b][0] += (dx / dist) * f; d[e.b][1] += (dy / dist) * f;
    }
    for (let i = 0; i < N; i++) {
      const len = Math.max(1e-9, Math.hypot(d[i][0], d[i][1])), step = Math.min(len, t);
      p[i][0] += (d[i][0] / len) * step; p[i][1] += (d[i][1] / len) * step;
      // Gentle pull to the centre keeps separate groups on the page.
      p[i][0] += (0.5 - p[i][0]) * 0.01; p[i][1] += (0.5 - p[i][1]) * 0.01;
    }
    t = Math.max(0.002, t * 0.985);
  }
  const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), sx = Math.max(...xs) - x0 || 1, sy = Math.max(...ys) - y0 || 1;
  return p.map(([x, y]) => [(x - x0) / sx, (y - y0) / sy]);
}

/** Made-up letters between invented people, written for fibub: a family circle, a naturalists' circle and a go-between. */
export const EXAMPLE = `sender,recipient,date,place
Anna Price,Clara Price,1821-03-02,Bath
Clara Price,Anna Price,1821-03-20,York
Anna Price,Clara Price,1821-06-11,Bath
Clara Price,Anna Price,1821-07-01,York
Anna Price,Henry Price,1821-09-14,Bath
Henry Price,Anna Price,1821-10-02,London
Henry Price,Clara Price,1822-01-08,London
Clara Price,Henry Price,1822-02-15,York
Anna Price,Clara Price,1822-04-30,Bath
Henry Price,Anna Price,1822-05-19,London
Martha Lowe,Anna Price,1822-06-02,Bath
Anna Price,Martha Lowe,1822-06-20,Bath
Henry Price,Edward Moss,1822-08-04,London
Edward Moss,Henry Price,1822-08-29,Edinburgh
Henry Price,Edward Moss,1823-01-10,London
Edward Moss,Henry Price,1823-02-02,Edinburgh
Edward Moss,James Reid,1823-03-15,Edinburgh
James Reid,Edward Moss,1823-04-01,Glasgow
Edward Moss,James Reid,1823-05-22,Edinburgh
James Reid,Edward Moss,1823-06-30,Glasgow
James Reid,Sarah Hart,1823-07-12,Glasgow
Sarah Hart,James Reid,1823-08-03,Manchester
Sarah Hart,Edward Moss,1823-09-09,Manchester
Edward Moss,Sarah Hart,1823-10-01,Edinburgh
Sarah Hart,Edward Moss,1824-01-15,Manchester
Edward Moss,Sarah Hart,1824-02-20,Edinburgh
James Reid,Sarah Hart,1824-03-30,Glasgow
Thomas Webb,Edward Moss,1824-05-05,Leeds
Edward Moss,Thomas Webb,1824-05-28,Edinburgh
Thomas Webb,James Reid,1824-07-14,Leeds
Henry Price,Edward Moss,1824-09-01,London
Clara Price,Anna Price,1824-11-11,York
Martha Lowe,Clara Price,1825-01-20,Bath
Anna Price,Clara Price,1825-03-03,Bath
Henry Price,Martha Lowe,1825-04-18,London
`;
