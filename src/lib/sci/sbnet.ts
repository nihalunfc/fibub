// Gene regulatory networks: read SIF or GraphML, signed edges (activation, repression), degree statistics,
// components, feedback and feed-forward loop motifs, and a force-directed layout. No DOM.

export type Sign = 1 | -1 | 0;
export type Edge = { s: string; t: string; sign: Sign; type: string };
export type Net = { nodes: string[]; edges: Edge[]; duplicates: number };

const ACT = /^(activat\w*|activ|induc\w*|stimulat\w*|promot\w*|upregulat\w*|up|enhanc\w*|\+|\+1|1|->|→|pos\w*|positive)$/i;
const REP = /^(repress\w*|inhibit\w*|suppress\w*|block\w*|downregulat\w*|down|silenc\w*|-|-1|−|−1|-\||⊣|\|-|neg\w*|negative)$/i;

/** The sign of an interaction word: activates → +1, represses/inhibits → −1, anything else → 0 (unsigned). */
export function signOf(type: string): Sign {
  const t = type.trim();
  return ACT.test(t) ? 1 : REP.test(t) ? -1 : 0;
}

function build(nodes: string[], raw: Edge[]): Net {
  const seen = new Set<string>(), edges: Edge[] = [];
  let duplicates = 0;
  for (const e of raw) { const k = e.s + '\u0001' + e.t; if (seen.has(k)) { duplicates++; continue; } seen.add(k); edges.push(e); }
  const all = [...nodes];
  const has = new Set(all);
  for (const e of edges) for (const n of [e.s, e.t]) if (!has.has(n)) { has.add(n); all.push(n); }
  return { nodes: all, edges, duplicates };
}

/** Simple Interaction Format: "source type target [target …]" per line, tab- or space-separated; one name alone is a node. */
export function parseSIF(text: string): Net {
  const nodes: string[] = [], raw: Edge[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((line, i) => {
    const s = line.replace(/^\s*#.*$/, '').trim();
    if (!s) return;
    const tok = (s.includes('\t') ? s.split('\t') : s.split(/\s+/)).map((x) => x.trim()).filter(Boolean);
    if (tok.length === 1) { if (!nodes.includes(tok[0])) nodes.push(tok[0]); return; }
    if (tok.length === 2) throw new Error(`Line ${i + 1}: write "source interaction target", for example "${tok[0]} activates ${tok[1]}".`);
    for (const n of [tok[0], ...tok.slice(2)]) if (!nodes.includes(n)) nodes.push(n);
    for (const t of tok.slice(2)) raw.push({ s: tok[0], t, sign: signOf(tok[1]), type: tok[1] });
  });
  if (!nodes.length && !raw.length) throw new Error('There are no interactions. Write one per line, such as "GeneA activates GeneB".');
  return build(nodes, raw);
}

const attrs = (s: string) => { const o: Record<string, string> = {}; for (const m of s.matchAll(/([\w.:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) o[m[1]] = unxml(m[2] ?? m[3]); return o; };
const unxml = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&amp;/g, '&');
const datas = (body: string) => { const o: Record<string, string> = {}; for (const m of body.matchAll(/<data\b([^>]*)>([\s\S]*?)<\/data>/g)) { const k = attrs(m[1]).key; if (k) o[k] = unxml(m[2].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()); } return o; };

/** GraphML (as written by Cytoscape, yEd, NetworkX, igraph): nodes, directed edges, and a sign from an edge attribute named sign, interaction, type, effect or regulation. */
export function parseGraphML(text: string): Net {
  if (!/<graphml\b/i.test(text)) throw new Error('This does not look like GraphML (no <graphml> element).');
  const xml = text.replace(/<!--[\s\S]*?-->/g, '');
  const keys: Record<string, { for: string; name: string }> = {};
  for (const m of xml.matchAll(/<key\b([^>]*?)\/?>/g)) { const a = attrs(m[1]); if (a.id) keys[a.id] = { for: (a.for ?? 'all').toLowerCase(), name: (a['attr.name'] ?? a.id).toLowerCase() }; }
  const keyFor = (kind: string, names: RegExp) => Object.entries(keys).filter(([, k]) => (k.for === kind || k.for === 'all') && names.test(k.name)).map(([id]) => id);
  const labelKeys = keyFor('node', /^(label|name|gene|symbol|shared name|gene name)$/), signKeys = keyFor('edge', /^(sign|interaction|type|effect|regulation|edge type|mode|edge_type|interaction type)$/);
  const ids = new Map<string, string>(), nodes: string[] = [], raw: Edge[] = [];
  for (const m of xml.matchAll(/<node\b([^>]*?)(?:\/>|>([\s\S]*?)<\/node>)/g)) {
    const id = attrs(m[1]).id; if (!id) continue;
    const d = datas(m[2] ?? ''), lab = labelKeys.map((k) => d[k]).find((v) => v);
    const name = lab || id;
    ids.set(id, name); if (!nodes.includes(name)) nodes.push(name);
  }
  for (const m of xml.matchAll(/<edge\b([^>]*?)(?:\/>|>([\s\S]*?)<\/edge>)/g)) {
    const a = attrs(m[1]); if (!a.source || !a.target) throw new Error('An edge in the GraphML has no source or target.');
    const d = datas(m[2] ?? ''), type = signKeys.map((k) => d[k]).find((v) => v != null && v !== '') ?? '';
    raw.push({ s: ids.get(a.source) ?? a.source, t: ids.get(a.target) ?? a.target, sign: signOf(type), type });
  }
  if (!nodes.length && !raw.length) throw new Error('The GraphML file has no nodes or edges.');
  return build(nodes, raw);
}

/** Reads either format: GraphML when the text starts with "<", SIF otherwise. */
export const readNetwork = (text: string) => (/^\s*(<\?xml|<graphml)/i.test(text) ? parseGraphML(text) : parseSIF(text));

export type Degree = { node: string; inD: number; outD: number; total: number; act: number; rep: number; self: Sign | null };

/** In- and out-degree (self-loops count once each way, as in NetworkX), and how many targets each node activates or represses. */
export function degrees(net: Net): Degree[] {
  const d = new Map(net.nodes.map((n) => [n, { node: n, inD: 0, outD: 0, total: 0, act: 0, rep: 0, self: null as Sign | null }]));
  for (const e of net.edges) {
    const a = d.get(e.s)!, b = d.get(e.t)!;
    a.outD++; b.inD++;
    if (e.sign === 1) a.act++; else if (e.sign === -1) a.rep++;
    if (e.s === e.t) a.self = e.sign;
  }
  for (const x of d.values()) x.total = x.inD + x.outD;
  return [...d.values()];
}

/** Weakly connected components, largest first. */
export function components(net: Net): string[][] {
  const parent = new Map(net.nodes.map((n) => [n, n]));
  const find = (x: string): string => { let r = x; while (parent.get(r) !== r) r = parent.get(r)!; let y = x; while (parent.get(y) !== r) { const n = parent.get(y)!; parent.set(y, r); y = n; } return r; };
  for (const e of net.edges) parent.set(find(e.s), find(e.t));
  const g = new Map<string, string[]>();
  for (const n of net.nodes) { const r = find(n); if (!g.has(r)) g.set(r, []); g.get(r)!.push(n); }
  return [...g.values()].sort((a, b) => b.length - a.length);
}

export type FFL = { x: string; y: string; z: string; signs: [Sign, Sign, Sign]; kind: 'coherent' | 'incoherent' | 'unsigned'; type: string };

/**
 * Feed-forward loops: X → Y, Y → Z and X → Z with three different nodes (other edges among them allowed).
 * Coherent when the direct path's sign equals the indirect path's (sign XY × sign YZ), as in Mangan and Alon (2003);
 * C1 is all activation, I1 is X activating Y and Z with Y repressing Z.
 */
export function ffls(net: Net): FFL[] {
  const out = new Map<string, Map<string, Sign>>();
  for (const n of net.nodes) out.set(n, new Map());
  for (const e of net.edges) if (e.s !== e.t) out.get(e.s)!.set(e.t, e.sign);
  const res: FFL[] = [];
  for (const x of net.nodes) for (const [y, sxy] of out.get(x)!) for (const [z, syz] of out.get(y)!) {
    if (z === x || z === y || !out.get(x)!.has(z)) continue;
    const sxz = out.get(x)!.get(z)!, signs: [Sign, Sign, Sign] = [sxy, syz, sxz];
    const kind = signs.includes(0) ? 'unsigned' : sxz === sxy * syz ? 'coherent' : 'incoherent';
    const type = kind === 'unsigned' ? '' : signs.join() === '1,1,1' ? 'C1' : signs.join() === '1,-1,1' ? 'I1' : '';
    res.push({ x, y, z, signs, kind, type });
  }
  return res;
}

/** Pairs of nodes that regulate each other (two-node feedback loops); positive when the product of the two signs is +. */
export function mutual(net: Net) {
  const sign = new Map(net.edges.filter((e) => e.s !== e.t).map((e) => [e.s + '\u0001' + e.t, e.sign]));
  const res: { a: string; b: string; signs: [Sign, Sign]; kind: 'positive' | 'negative' | 'unsigned' }[] = [];
  for (const e of net.edges) if (e.s < e.t && sign.has(e.t + '\u0001' + e.s)) {
    const back = sign.get(e.t + '\u0001' + e.s)!, p = e.sign * back;
    res.push({ a: e.s, b: e.t, signs: [e.sign, back], kind: p > 0 ? 'positive' : p < 0 ? 'negative' : 'unsigned' });
  }
  return res;
}

export function summary(net: Net) {
  const n = net.nodes.length, e = net.edges.length, deg = degrees(net), comps = components(net);
  return {
    nodes: n, edges: e, density: n > 1 ? e / (n * (n - 1)) : 0, meanDegree: n ? e / n : 0,
    activation: net.edges.filter((x) => x.sign === 1).length, repression: net.edges.filter((x) => x.sign === -1).length,
    unsigned: net.edges.filter((x) => x.sign === 0).length,
    selfPos: deg.filter((d) => d.self === 1).length, selfNeg: deg.filter((d) => d.self === -1).length, selfUnsigned: deg.filter((d) => d.self === 0).length,
    components: comps.length, largest: comps[0]?.length ?? 0,
    regulators: deg.filter((d) => d.outD - (d.self != null ? 1 : 0) > 0).length, isolated: deg.filter((d) => d.total === 0).length,
  };
}

/** A small seeded random number generator (mulberry32), so a layout is the same every time for the same seed. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/**
 * Fruchterman–Reingold force layout: edges pull, all nodes push, a weak pull to the centre, and the step shrinks each
 * round. Each connected part is laid out on its own and the parts are packed in rows, largest first, so separate
 * parts do not push each other to the edges. Returns x, y in [0, 1] per node (same order as net.nodes).
 */
export function forceLayout(net: Net, seed = 1, iters = 300): [number, number][] {
  const n = net.nodes.length, R = rng(seed);
  if (!n) return [];
  const idx = new Map(net.nodes.map((v, i) => [v, i])), out: [number, number][] = net.nodes.map(() => [0, 0]);
  const comps = components(net), total = Math.sqrt(n) * 1.3;
  let x = 0, y = 0, rowH = 0;
  for (const c of comps) {
    const side = c.length === 1 ? 0.7 : Math.sqrt(c.length);
    if (x > 0 && x + side > total) { x = 0; y += rowH + 0.35; rowH = 0; }
    const set = new Set(c), sub = { nodes: c, edges: net.edges.filter((e) => set.has(e.s)), duplicates: 0 };
    const p = c.length === 1 ? [[0.5, 0.5] as [number, number]] : fr(sub, R, iters);
    c.forEach((v, k) => { out[idx.get(v)!] = [x + p[k][0] * side, y + p[k][1] * side]; });
    x += side + 0.35; rowH = Math.max(rowH, side);
  }
  return fit(out);
}

function fr(net: Net, R: () => number, iters: number): [number, number][] {
  const n = net.nodes.length;
  const idx = new Map(net.nodes.map((v, i) => [v, i]));
  const pos = net.nodes.map(() => [R(), R()]);
  const k = Math.sqrt(1 / n), E = net.edges.filter((e) => e.s !== e.t).map((e) => [idx.get(e.s)!, idx.get(e.t)!]);
  let temp = 0.1;
  for (let it = 0; it < iters; it++) {
    const d = pos.map(() => [0, 0]);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1], r2 = dx * dx + dy * dy;
      if (r2 < 1e-12) { dx = (R() - 0.5) * 1e-3; dy = (R() - 0.5) * 1e-3; r2 = dx * dx + dy * dy; }
      const f = (k * k) / r2;
      d[i][0] += dx * f; d[i][1] += dy * f; d[j][0] -= dx * f; d[j][1] -= dy * f;
    }
    for (const [a, b] of E) {
      const dx = pos[a][0] - pos[b][0], dy = pos[a][1] - pos[b][1], r = Math.sqrt(dx * dx + dy * dy) || 1e-6, f = r / k;
      d[a][0] -= dx * f; d[a][1] -= dy * f; d[b][0] += dx * f; d[b][1] += dy * f;
    }
    for (let i = 0; i < n; i++) {
      d[i][0] += (0.5 - pos[i][0]) * k; d[i][1] += (0.5 - pos[i][1]) * k;
      const len = Math.hypot(d[i][0], d[i][1]) || 1, step = Math.min(len, temp);
      pos[i][0] += (d[i][0] / len) * step; pos[i][1] += (d[i][1] / len) * step;
    }
    temp = Math.max(0.002, temp * 0.985);
  }
  return fit(pos as [number, number][]);
}

/** Nodes evenly on a circle, in order. */
export function circleLayout(net: Net): [number, number][] {
  const n = net.nodes.length;
  return net.nodes.map((_, i) => (n === 1 ? [0.5, 0.5] : [0.5 + 0.5 * Math.cos((2 * Math.PI * i) / n - Math.PI / 2), 0.5 + 0.5 * Math.sin((2 * Math.PI * i) / n - Math.PI / 2)]) as [number, number]);
}

function fit(p: [number, number][]): [number, number][] {
  const xs = p.map((v) => v[0]), ys = p.map((v) => v[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), s = Math.max(x1 - x0, y1 - y0) || 1;
  const ox = (s - (x1 - x0)) / 2, oy = (s - (y1 - y0)) / 2;
  return p.map(([x, y]) => [(x - x0 + ox) / s, (y - y0 + oy) / s]);
}
