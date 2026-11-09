// Structural isomers of small open-chain formulas: every alkane, alkene, alcohol, ether, aldehyde, ketone,
// carboxylic acid and ester with a given formula, each named (IUPAC, school style), with condensed formula,
// cis–trans and chiral-carbon flags, and the kind of isomerism between two of them. Plain maths, no DOM.
// Used by the #1106 isomer explorer.
import { nameGraph, alkylName, key, type Graph } from './chainname.ts';

export type Atom = { el: 'C' | 'O' };
export type Mol = { atoms: Atom[]; adj: number[][]; order: Map<string, number> };
export type Isomer = { name: string; family: string; condensed: string; canon: string; skeleton: string; sides?: string; cisTrans: boolean; chiral: number; mol: Mol };

export type Formula = { id: string; label: string; c: number; kind: 'alkane' | 'alkene' | 'CnH2n+2O' | 'CnH2nO' | 'CnH2nO2'; note: string };
const sub = (k: number) => (k === 1 ? '' : String(k).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d]));
const F = (c: number, kind: Formula['kind'], note = ''): Formula => {
  const h = kind === 'alkane' ? 2 * c + 2 : kind === 'CnH2n+2O' ? 2 * c + 2 : 2 * c;
  const o = kind === 'CnH2n+2O' || kind === 'CnH2nO' ? 1 : kind === 'CnH2nO2' ? 2 : 0;
  const label = `C${sub(c)}H${sub(h)}${o ? 'O' + sub(o) : ''}`;
  return { id: label.replace(/[₀-₉]/g, (d) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(d))), label, c, kind, note };
};
export const FORMULAS: Formula[] = [
  F(4, 'alkane'), F(5, 'alkane'), F(6, 'alkane'), F(7, 'alkane'),
  F(4, 'alkene', 'Open chains only: cyclobutane and methylcyclopropane also have this formula.'),
  F(5, 'alkene', 'Open chains only: rings such as cyclopentane also have this formula.'),
  F(2, 'CnH2n+2O'), F(3, 'CnH2n+2O'), F(4, 'CnH2n+2O'), F(5, 'CnH2n+2O'),
  F(3, 'CnH2nO', 'Aldehydes and ketones only: alcohols and ethers with a C=C or a ring also fit this formula.'),
  F(4, 'CnH2nO', 'Aldehydes and ketones only: alcohols and ethers with a C=C or a ring also fit this formula.'),
  F(5, 'CnH2nO', 'Aldehydes and ketones only: alcohols and ethers with a C=C or a ring also fit this formula.'),
  F(2, 'CnH2nO2', 'Acids and esters only.'), F(3, 'CnH2nO2', 'Acids and esters only.'), F(4, 'CnH2nO2', 'Acids and esters only.'),
];

// ---------- carbon trees ----------
type Tree = number[][]; // adjacency
/** All carbon trees with n atoms (max 4 bonds each), one per shape. */
export function carbonTrees(n: number): Tree[] {
  let level: Tree[] = [[[]]];
  for (let k = 1; k < n; k++) {
    const seen = new Map<string, Tree>();
    for (const t of level) for (let v = 0; v < t.length; v++) {
      if (t[v].length >= 4) continue;
      const nt = t.map((a) => a.slice()); nt.push([v]); nt[v].push(nt.length - 1);
      const c = canonTree(nt.map(() => 'C'), nt, new Map());
      if (!seen.has(c)) seen.set(c, nt);
    }
    level = [...seen.values()];
  }
  return level;
}

/** Canonical string of a labelled tree (labels per atom, bond orders by key): the smallest string over all roots. */
function canonTree(labels: string[], adj: number[][], order: Map<string, number>): string {
  const rooted = (u: number, p: number): string => {
    const ch = adj[u].filter((v) => v !== p).map((v) => (order.get(key(u, v)) ?? 1) + rooted(v, u)).sort();
    return labels[u] + (ch.length ? '(' + ch.join(',') + ')' : '');
  };
  let best = '';
  for (let r = 0; r < adj.length; r++) { const s = rooted(r, -1); if (!best || s < best) best = s; }
  return best;
}
export const canon = (m: Mol) => canonTree(m.atoms.map((a) => a.el), m.adj, m.order);

function fromTree(t: Tree): Mol { return { atoms: t.map(() => ({ el: 'C' as const })), adj: t.map((a) => a.slice()), order: new Map() }; }
function addAtom(m: Mol, el: 'C' | 'O', to: number, o = 1) { m.atoms.push({ el }); m.adj.push([to]); m.adj[to].push(m.atoms.length - 1); m.order.set(key(to, m.atoms.length - 1), o); return m.atoms.length - 1; }
function clone(m: Mol): Mol { return { atoms: m.atoms.map((a) => ({ ...a })), adj: m.adj.map((a) => a.slice()), order: new Map(m.order) }; }
const valence = (m: Mol, i: number) => m.adj[i].reduce((s, j) => s + (m.order.get(key(i, j)) ?? 1), 0);
/** Put an O between carbons a and b (ether or ester oxygen). */
function insertO(m: Mol, a: number, b: number): Mol {
  const r = clone(m);
  r.adj[a] = r.adj[a].filter((x) => x !== b); r.adj[b] = r.adj[b].filter((x) => x !== a); r.order.delete(key(a, b));
  r.atoms.push({ el: 'O' }); const o = r.atoms.length - 1; r.adj.push([a, b]); r.adj[a].push(o); r.adj[b].push(o); r.order.set(key(a, o), 1); r.order.set(key(b, o), 1);
  return r;
}

/** All structures for a formula (unique by canonical string). */
export function generate(f: Formula): Mol[] {
  const out = new Map<string, Mol>();
  const put = (m: Mol) => { if (m.atoms.every((_, i) => valence(m, i) <= (m.atoms[i].el === 'C' ? 4 : 2))) { const c = canon(m); if (!out.has(c)) out.set(c, m); } };
  for (const t of carbonTrees(f.c)) {
    const base = fromTree(t);
    const edges: [number, number][] = []; t.forEach((a, i) => a.forEach((j) => { if (i < j) edges.push([i, j]); }));
    if (f.kind === 'alkane') put(base);
    if (f.kind === 'alkene') for (const [a, b] of edges) { const m = clone(base); m.order.set(key(a, b), 2); put(m); }
    if (f.kind === 'CnH2n+2O') {
      for (let c = 0; c < f.c; c++) { const m = clone(base); addAtom(m, 'O', c); put(m); }
      for (const [a, b] of edges) put(insertO(base, a, b));
    }
    if (f.kind === 'CnH2nO') for (let c = 0; c < f.c; c++) { const m = clone(base); addAtom(m, 'O', c, 2); put(m); }
    if (f.kind === 'CnH2nO2') {
      for (let c = 0; c < f.c; c++) if (t[c].length <= 1) { const m = clone(base); addAtom(m, 'O', c, 2); addAtom(m, 'O', c, 1); put(m); }
      for (const [a, b] of edges) for (const [x, y] of [[a, b], [b, a]]) { const m = insertO(base, x, y); addAtom(m, 'O', x, 2); put(m); }
    }
  }
  return [...out.values()];
}

// ---------- naming and description ----------
const isLeafO = (m: Mol, i: number) => m.atoms[i].el === 'O' && m.adj[i].length === 1;
/** Carbon-only Graph for chainname, from the carbons in `carbons` (OH / =O leaves become flags). */
function toGraph(m: Mol, carbons: number[], prefix?: { at: number; name: string }): Graph {
  const idx = new Map(carbons.map((c, i) => [c, i]));
  const G: Graph = { nC: carbons.length, adj: carbons.map(() => []), order: new Map(), oh: carbons.map(() => 0), oxo: carbons.map(() => 0), hal: carbons.map(() => null) };
  carbons.forEach((c, i) => {
    for (const j of m.adj[c]) {
      if (idx.has(j)) { const k = idx.get(j)!; if (!G.adj[i].includes(k)) { G.adj[i].push(k); G.adj[k].push(i); G.order.set(key(i, k), m.order.get(key(c, j)) ?? 1); } }
      else if (isLeafO(m, j)) { if ((m.order.get(key(c, j)) ?? 1) === 2) G.oxo[i] = 1; else G.oh[i] = 1; }
    }
  });
  if (prefix) G.hal[idx.get(prefix.at)!] = prefix.name;
  return G;
}
/** Carbons reachable from `start` without passing through atoms in `stop`. */
function side(m: Mol, start: number, stop: Set<number>): number[] {
  const seen = new Set([start]), st = [start];
  while (st.length) { const u = st.pop()!; for (const v of m.adj[u]) if (!seen.has(v) && !stop.has(v) && m.atoms[v].el === 'C') { seen.add(v); st.push(v); } }
  return [...seen];
}
function alkyl(m: Mol, root: number, stop: Set<number>) {
  const cs = side(m, root, stop); const G = toGraph(m, cs); return alkylName(G, 0, -1).replace(/^\((.*)\)$/, '$1');
}

export function describe(m: Mol): Isomer {
  const chainO = m.atoms.map((a, i) => (a.el === 'O' && m.adj[i].length === 2 ? i : -1)).filter((i) => i >= 0);
  const carbons = m.atoms.map((a, i) => (a.el === 'C' ? i : -1)).filter((i) => i >= 0);
  let name = '', family = '', sides: string | undefined;
  if (chainO.length) {
    const o = chainO[0], [a, b] = m.adj[o];
    const acylA = m.adj[a].some((j) => isLeafO(m, j) && m.order.get(key(a, j)) === 2), acylB = m.adj[b].some((j) => isLeafO(m, j) && m.order.get(key(b, j)) === 2);
    const stop = new Set([o]);
    if (acylA || acylB) {
      // Ester: alkyl alkanoate.
      const acyl = acylA ? a : b, alk = acylA ? b : a;
      const acid = side(m, acyl, stop), G = toGraph(m, acid); G.oh[acid.indexOf(acyl)] = 1;
      name = `${alkyl(m, alk, stop)} ${nameGraph(G).name.replace(/oic acid$/, 'oate')}`;
      family = 'ester'; sides = [acid.length, side(m, alk, stop).length].join('+');
    } else {
      const sa = side(m, a, stop), sb = side(m, b, stop);
      const [par, pAt, oth, oAt] = sa.length >= sb.length ? [sa, a, sb, b] : [sb, b, sa, a];
      const oxy = alkyl(m, oAt, stop).replace(/yl$/, 'oxy');
      const G = toGraph(m, par, { at: pAt, name: oxy.includes('-') ? `(${oxy})` : oxy });
      name = nameGraph(G).name; family = 'ether'; sides = [par.length, oth.length].sort((x, y) => y - x).join('+');
    }
  } else {
    const r = nameGraph(toGraph(m, carbons)); name = r.name; family = r.series;
  }
  // Carbon skeleton (C–C bonds only, ignoring O and bond orders).
  const ci = new Map(carbons.map((c, i) => [c, i]));
  const sk = carbons.map((c) => m.adj[c].filter((j) => ci.has(j)).map((j) => ci.get(j)!));
  const skelOf = (cs: number[]) => { const mi = new Map(cs.map((c, i) => [c, i])); return canonTree(cs.map(() => 'C'), cs.map((c) => m.adj[c].filter((j) => mi.has(j)).map((j) => mi.get(j)!)), new Map()); };
  const skeleton = chainO.length ? m.adj[chainO[0]].map((x) => skelOf(side(m, x, new Set(chainO)))).sort().join('|') : canonTree(carbons.map(() => 'C'), sk, new Map());
  return { name, family, condensed: condensed(m), canon: canon(m), skeleton, sides, cisTrans: cisTrans(m), chiral: chiralCount(m), mol: m };
}

/** Groups around atom i, seen from neighbour `from`, as canonical strings (H counted as "H"). */
function groups(m: Mol, i: number, exclude: number[]): string[] {
  const out: string[] = [];
  const rooted = (u: number, p: number): string => { const ch = m.adj[u].filter((v) => v !== p).map((v) => (m.order.get(key(u, v)) ?? 1) + rooted(v, u)).sort(); return m.atoms[u].el + (ch.length ? '(' + ch.join(',') + ')' : ''); };
  for (const j of m.adj[i]) if (!exclude.includes(j)) out.push((m.order.get(key(i, j)) ?? 1) + rooted(j, i));
  const h = (m.atoms[i].el === 'C' ? 4 : 2) - valence(m, i);
  for (let k = 0; k < h; k++) out.push('H');
  return out;
}
/** Does a C=C have two different groups on each end (so cis and trans forms exist)? */
export function cisTrans(m: Mol) {
  for (const [k, o] of m.order) {
    if (o !== 2) continue;
    const [a, b] = k.split('-').map(Number);
    if (m.atoms[a].el !== 'C' || m.atoms[b].el !== 'C') continue;
    const ga = groups(m, a, [b]), gb = groups(m, b, [a]);
    if (ga.length === 2 && gb.length === 2 && ga[0] !== ga[1] && gb[0] !== gb[1]) return true;
  }
  return false;
}
/** Number of carbons with four different groups (chiral centres). */
export function chiralCount(m: Mol) {
  let n = 0;
  m.atoms.forEach((a, i) => { if (a.el !== 'C') return; const g = groups(m, i, []); if (g.length === 4 && new Set(g).size === 4) n++; });
  return n;
}

/** Condensed structural formula, e.g. CH₃–CH(OH)–CH₃ or CH₃–C(=O)–O–CH₃. */
export function condensed(m: Mol): string {
  const backbone = m.atoms.map((_, i) => i).filter((i) => !isLeafO(m, i));
  // Longest path through backbone atoms.
  const far = (s: number) => { const d = new Map([[s, 0]]), prev = new Map<number, number>(), q = [s]; while (q.length) { const u = q.shift()!; for (const v of m.adj[u]) if (!d.has(v) && !isLeafO(m, v)) { d.set(v, d.get(u)! + 1); prev.set(v, u); q.push(v); } } let best = s; for (const [k, v] of d) if (v > d.get(best)! ) best = k; return { best, prev }; };
  const { best: e1 } = far(backbone[0]); const { best: e2, prev } = far(e1);
  const path: number[] = [e2]; while (path[path.length - 1] !== e1) path.push(prev.get(path[path.length - 1])!);
  // Prefer a direction that starts with a plain carbon end (CH₃–… rather than HOOC–…).
  const endText = (i: number) => m.adj[i].some((j) => isLeafO(m, j));
  if (endText(path[0]) && !endText(path[path.length - 1])) path.reverse();
  const onPath = new Set(path);
  const bondSym = (a: number, b: number) => ({ 1: '–', 2: '=', 3: '≡' } as Record<number, string>)[m.order.get(key(a, b)) ?? 1];
  const atomText = (i: number, inChain: boolean, from: number, isEnd: boolean): string => {
    if (m.atoms[i].el === 'O') return 'O';
    const h = 4 - valence(m, i);
    const leaves = m.adj[i].filter((j) => isLeafO(m, j));
    const hasOxo = leaves.some((j) => m.order.get(key(i, j)) === 2), hasOH = leaves.some((j) => m.order.get(key(i, j)) === 1);
    const branches = m.adj[i].filter((j) => !isLeafO(m, j) && j !== from && !(inChain && onPath.has(j)));
    const bText = branches.map((j) => `(${branchText(j, i)})`);
    // Collapse equal branches: (CH₃)(CH₃) → (CH₃)₂
    const cnt = new Map<string, number>(); for (const b of bText) cnt.set(b, (cnt.get(b) || 0) + 1);
    const bt = [...cnt].map(([t, k]) => t + (k > 1 ? sub(k) : '')).join('');
    if (isEnd && hasOxo && hasOH) return 'COOH';
    if (isEnd && hasOxo && h === 1 && !branches.length) return 'CHO';
    let t = 'C' + (h ? 'H' + sub(h) : '') + bt;
    if (hasOxo) t += '(=O)';
    if (hasOH) t += isEnd && !bt && !hasOxo ? '–OH' : '(OH)';
    return t;
  };
  const branchText = (start: number, from: number): string => {
    const parts: string[] = []; let u = start, p = from;
    for (;;) {
      const next = m.adj[u].filter((v) => v !== p && !isLeafO(m, v));
      const isEnd = next.length === 0;
      parts.push(atomTextBranch(u, p, next.slice(1), isEnd));
      if (!next.length) break;
      parts.push(bondSym(u, next[0])); p = u; u = next[0];
    }
    return parts.join('');
  };
  const atomTextBranch = (i: number, from: number, extra: number[], isEnd: boolean) => {
    if (m.atoms[i].el === 'O') return 'O';
    const h = 4 - valence(m, i);
    const leaves = m.adj[i].filter((j) => isLeafO(m, j));
    const hasOxo = leaves.some((j) => m.order.get(key(i, j)) === 2), hasOH = leaves.some((j) => m.order.get(key(i, j)) === 1);
    if (isEnd && hasOxo && hasOH) return 'COOH';
    if (isEnd && hasOxo && h === 1) return 'CHO';
    return 'C' + (h ? 'H' + sub(h) : '') + extra.map((j) => `(${branchText(j, i)})`).join('') + (hasOxo ? '(=O)' : '') + (hasOH ? '(OH)' : '');
  };
  if (path.length === 1) { const t = atomText(path[0], true, -1, true); return t === 'CHO' ? 'HCHO' : t === 'COOH' ? 'HCOOH' : t; }
  const parts: string[] = [];
  path.forEach((a, k) => { parts.push(atomText(a, true, -1, k === path.length - 1 || k === 0)); if (k + 1 < path.length) parts.push(bondSym(a, path[k + 1])); });
  let s = parts.join('');
  // A first atom shown as CHO/COOH reads backwards; write it as OHC– / HOOC–.
  s = s.replace(/^CHO–/, 'OHC–').replace(/^COOH–/, 'HOOC–').replace(/^(CH[₂₃]?)–OH(?=[–=≡])/, 'HO–$1');
  return s;
}

/** Kind of isomerism between two different isomers of the same formula. */
export function relation(a: Isomer, b: Isomer): { kind: 'functional' | 'metamers' | 'chain' | 'position'; why: string } {
  if (a.family !== b.family) return { kind: 'functional', why: `They belong to different families (${a.family} and ${b.family}): functional group isomers.` };
  if ((a.family === 'ether' || a.family === 'ester') && a.sides !== b.sides) return { kind: 'metamers', why: `Both are ${a.family}s, but the carbon groups on the two sides of the oxygen differ (${a.sides} vs ${b.sides} carbons): metamers.` };
  if (a.skeleton !== b.skeleton) return { kind: 'chain', why: 'Same family, but the carbon skeletons differ (straight vs branched): chain isomers.' };
  if (a.family === 'ether' || a.family === 'ester') return { kind: 'position', why: `Both are ${a.family}s with the same carbon groups, but the oxygen is joined at a different carbon: position isomers.` };
  return { kind: 'position', why: `Same family and the same carbon skeleton; only the position of the ${a.family === 'alkene' ? 'double bond' : 'functional group'} differs: position isomers.` };
}

/** Every isomer of a formula, described and sorted by family then name. */
export function isomersOf(f: Formula): Isomer[] {
  const fam = ['alkane', 'alkene', 'alcohol', 'ether', 'aldehyde', 'ketone', 'carboxylic acid', 'ester'];
  return generate(f).map(describe).sort((x, y) => fam.indexOf(x.family) - fam.indexOf(y.family) || x.condensed.length - y.condensed.length || x.name.localeCompare(y.name));
}
