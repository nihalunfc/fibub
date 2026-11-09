// Phylogenetic trees in Newick format: read (quoted labels, comments, branch lengths, internal labels such as support
// values), write, ladderize, reroot on any branch or at the midpoint, distances between tips, and a drawing as simple
// shapes (lines, arcs, text) that a canvas or an SVG file can both show, in rectangular or circular layout. No DOM.

export type Node = { id: number; name: string; length: number | null; children: Node[]; parent: Node | null; color?: string };
export type Tree = { root: Node; nodes: Node[] };

// ---------- Reading ----------
/** Number of trees (each ends with ;) outside quotes and comments. */
export function countTrees(s: string) {
  let n = 0, q = false, c = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) { if (ch === "'") { if (s[i + 1] === "'") i++; else q = false; } continue; }
    if (c) { if (ch === ']') c--; continue; }
    if (ch === "'") q = true; else if (ch === '[') c++; else if (ch === ';') n++;
  }
  return n || (s.trim() ? 1 : 0);
}

/** The trees in a file, as separate strings (each ending with ;), splitting outside quotes and comments. */
export function splitTrees(s: string) {
  const out: string[] = [];
  let q = false, c = 0, start = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) { if (ch === "'") { if (s[i + 1] === "'") i++; else q = false; } continue; }
    if (c) { if (ch === ']') c--; continue; }
    if (ch === "'") q = true; else if (ch === '[') c++;
    else if (ch === ';') { out.push(s.slice(start, i + 1).trim()); start = i + 1; }
  }
  const rest = s.slice(start).replace(/\[[^\]]*\]/g, '').trim();
  if (rest) out.push(rest);
  return out;
}

/** The trees in a Newick file, or in the TREES block of a NEXUS file (with its TRANSLATE table, if any). */
export function readTrees(text: string): { trees: { name: string; newick: string }[]; translate: Map<string, string> | null; nexus: boolean } {
  const s = text.replace(/^﻿/, '');
  if (!/^\s*#nexus/i.test(s)) return { trees: splitTrees(s).map((nw, k) => ({ name: `Tree ${k + 1}`, newick: nw })), translate: null, nexus: false };
  const m = /begin\s+trees\s*;([\s\S]*?)\bend(block)?\s*;/i.exec(s);
  if (!m) throw new Error('This NEXUS file has no TREES block.');
  let translate: Map<string, string> | null = null;
  const trees: { name: string; newick: string }[] = [];
  for (const st of splitTrees(m[1])) {
    const body = st.replace(/^(\s*\[[^\]]*\])*\s*/, '');
    if (/^translate\b/i.test(body)) {
      translate = new Map();
      for (const pair of body.replace(/^translate\s*/i, '').replace(/;\s*$/, '').split(',')) {
        const mm = /^\s*(\S+)\s+('(?:[^']|'')*'|\S+)\s*$/.exec(pair);
        if (mm) translate.set(mm[1], mm[2].startsWith("'") ? mm[2].slice(1, -1).replace(/''/g, "'") : mm[2].replace(/_/g, ' '));
      }
    } else {
      const tm = /^u?tree\s+(\*\s*)?('(?:[^']|'')*'|[^=\s]+)\s*=\s*([\s\S]*)$/i.exec(body);
      if (tm) trees.push({ name: tm[2].replace(/^'|'$/g, ''), newick: tm[3] });
    }
  }
  if (!trees.length) throw new Error('The TREES block of this NEXUS file has no tree.');
  return { trees, translate, nexus: true };
}
/** Rename tips from a NEXUS TRANSLATE table (tip "1" becomes its full name). */
export function applyTranslate(t: Tree, map: Map<string, string> | null) {
  if (map) for (const n of t.nodes) if (!n.children.length && map.has(n.name)) n.name = map.get(n.name)!;
  return t;
}

/** Read the first tree. Unquoted labels have _ turned into spaces; [comments] are skipped. */
export function parseNewick(text: string): Tree {
  const s = text.replace(/^﻿/, '');
  let i = 0, id = 0;
  const nodes: Node[] = [];
  const fail = (m: string) => { throw new Error(`${m} (at character ${i + 1}).`); };
  const skip = () => {
    for (;;) {
      while (i < s.length && /\s/.test(s[i])) i++;
      if (s[i] === '[') { const e = s.indexOf(']', i); if (e < 0) fail('A [comment] is not closed'); i = e + 1; continue; }
      return;
    }
  };
  const label = () => {
    skip();
    if (s[i] === "'") {
      let out = ''; i++;
      for (;;) {
        if (i >= s.length) fail('A quoted label is not closed');
        if (s[i] === "'") { if (s[i + 1] === "'") { out += "'"; i += 2; continue; } i++; break; }
        out += s[i++];
      }
      return out;
    }
    let out = '';
    while (i < s.length && !"(),:;[".includes(s[i])) out += s[i++];
    return out.trim().replace(/_/g, ' ');
  };
  const sub = (parent: Node | null, depth: number): Node => {
    if (depth > 10000) fail('The tree is nested too deeply');
    const n: Node = { id: id++, name: '', length: null, children: [], parent };
    nodes.push(n);
    skip();
    if (s[i] === '(') {
      i++;
      n.children.push(sub(n, depth + 1));
      skip();
      while (s[i] === ',') { i++; n.children.push(sub(n, depth + 1)); skip(); }
      if (s[i] !== ')') fail(s[i] === undefined ? 'The tree ends before a ) closes it' : `Expected , or ) but found "${s[i]}"`);
      i++;
    }
    n.name = label();
    skip();
    if (s[i] === ':') {
      i++; skip();
      const m = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(s.slice(i, i + 40));
      if (!m) fail('A branch length should be a number');
      n.length = Number(m[0]); i += m[0].length;
    }
    return n;
  };
  skip();
  if (i >= s.length) throw new Error('No tree found. Newick looks like ((A:0.1,B:0.2):0.05,C:0.3);');
  const root = sub(null, 0);
  skip();
  if (s[i] === ';') i++;
  else if (i < s.length) fail(`Unexpected "${s[i]}"; a tree ends with ;`);
  return { root, nodes };
}

// ---------- Writing ----------
const needsQuote = (s: string) => /[\s(),:;[\]'_]/.test(s);
const q = (s: string) => (s === '' ? '' : needsQuote(s) ? `'${s.replace(/'/g, "''")}'` : s);
const fmtLen = (x: number) => String(+x.toPrecision(10));
export function toNewick(t: Tree | Node) {
  const root = 'root' in t ? t.root : t;
  const out: string[] = [];
  const walk = (n: Node) => {
    if (n.children.length) { out.push('('); n.children.forEach((c, k) => { if (k) out.push(','); walk(c); }); out.push(')'); }
    out.push(q(n.name));
    if (n.length !== null && n !== root) out.push(`:${fmtLen(n.length)}`);
  };
  walk(root);
  return out.join('') + ';';
}

// ---------- Questions ----------
export const leaves = (n: Node): Node[] => (n.children.length ? n.children.flatMap(leaves) : [n]);
export const descendants = (n: Node): Node[] => [n, ...n.children.flatMap(descendants)];
export const hasLengths = (t: Tree) => t.nodes.some((n) => n !== t.root && n.length !== null && n.length > 0);
const len = (n: Node) => (n.length !== null && Number.isFinite(n.length) ? Math.max(0, n.length) : 0);
/** Distance from the root along branches (lengths missing count as 0). */
export function depths(t: Tree) { const d = new Map<Node, number>(); const w = (n: Node, x: number) => { d.set(n, x); n.children.forEach((c) => w(c, x + len(c))); }; w(t.root, 0); return d; }
export const totalLength = (t: Tree) => t.nodes.reduce((s, n) => s + (n === t.root ? 0 : len(n)), 0);
/** Distance between two nodes along the tree. */
export function distance(a: Node, b: Node) {
  const up = new Map<Node, number>();
  for (let n: Node | null = a, d = 0; n; d += len(n), n = n.parent) up.set(n, d);
  for (let n: Node | null = b, d = 0; n; d += len(n), n = n.parent) { const u = up.get(n); if (u !== undefined) return u + d; }
  return NaN;
}
export function stats(t: Tree) {
  const L = leaves(t.root), d = depths(t), ds = L.map((n) => d.get(n)!);
  const names = L.map((n) => n.name), dup = names.filter((x, k) => x && names.indexOf(x) !== k);
  const binary = t.nodes.every((n) => n.children.length === 0 || n.children.length === 2);
  const support = t.nodes.filter((n) => n.children.length && n !== t.root && n.name !== '' && Number.isFinite(Number(n.name))).length;
  return { tips: L.length, internal: t.nodes.length - L.length, total: totalLength(t), minDepth: Math.min(...ds), maxDepth: Math.max(...ds), binary, rootChildren: t.root.children.length, unnamed: names.filter((x) => !x).length, duplicates: [...new Set(dup)], support, lengths: hasLengths(t) };
}

// ---------- Changing ----------
/** Sort children so the side with fewer tips comes first ("up") or last ("down"). */
export function ladderize(t: Tree, dir: 'up' | 'down' = 'up') {
  const size = new Map<Node, number>();
  const count = (n: Node): number => { const c = n.children.length ? n.children.reduce((s, x) => s + count(x), 0) : 1; size.set(n, c); return c; };
  count(t.root);
  const sort = (n: Node) => { n.children.sort((a, b) => (dir === 'up' ? size.get(a)! - size.get(b)! : size.get(b)! - size.get(a)!)); n.children.forEach(sort); };
  sort(t.root);
  return t;
}
export const swap = (n: Node) => { n.children.reverse(); };

/** A new tree rooted on the branch above `node`, `along` of the way from `node` towards its parent (0 to its
 *  length). The old root disappears if it is left with two branches. Tip-to-tip distances do not change. */
export function reroot(t: Tree, node: Node, along?: number): Tree {
  if (!node.parent) return t;
  const L = len(node), a = Math.min(L, Math.max(0, along ?? L / 2));
  // Undirected edges with lengths.
  const adj = new Map<Node, { to: Node; l: number }[]>();
  for (const n of t.nodes) adj.set(n, []);
  for (const n of t.nodes) if (n.parent) { adj.get(n)!.push({ to: n.parent, l: len(n) }); adj.get(n.parent)!.push({ to: n, l: len(n) }); }
  let id = 0;
  const nodes: Node[] = [];
  // A number on an inner node is the support of the branch above it. When the walk goes up a branch (from a
  // node to its old parent), that branch now sits above the old parent, so the number moves with it.
  const isNum = (x: string) => x !== '' && Number.isFinite(Number(x));
  const build = (n: Node, from: Node, l: number, parent: Node): Node => {
    const up = from.parent === n; // reached n from one of its old children
    const name = up && (n.name === '' || isNum(n.name)) ? (isNum(from.name) ? from.name : '') : n.name;
    const m: Node = { id: id++, name, length: l, children: [], parent, color: n.color };
    nodes.push(m);
    for (const e of adj.get(n)!) if (e.to !== from && !(n === node && e.to === node.parent) && !(n === node.parent && e.to === node)) m.children.push(build(e.to, n, e.l, m));
    return m;
  };
  const root: Node = { id: id++, name: '', length: null, children: [], parent: null };
  nodes.push(root);
  root.children.push(build(node, node.parent, a, root), build(node.parent, node, L - a, root));
  // Internal labels such as support values belong to branches: after rerooting, the old root's own label is lost
  // and any node left with one child is joined to it.
  for (const n of [...nodes]) {
    if (n !== root && n.children.length === 1) {
      const c = n.children[0], p = n.parent!;
      c.length = (c.length ?? 0) + (n.length ?? 0); c.parent = p;
      p.children[p.children.indexOf(n)] = c;
      nodes.splice(nodes.indexOf(n), 1);
    }
  }
  nodes.forEach((n, k) => { n.id = k; });
  return { root, nodes };
}

/** Root at the middle of the longest tip-to-tip path. */
export function midpointRoot(t: Tree): Tree {
  const L = leaves(t.root);
  if (L.length < 2) return t;
  let a = L[0], best = -1;
  for (const x of L) { const d = distance(L[0], x); if (d > best) { best = d; a = x; } }
  let b = a; best = -1;
  for (const x of L) { const d = distance(a, x); if (d > best) { best = d; b = x; } }
  const half = best / 2;
  // Walk from the deeper of a, b towards their common ancestor until the half-way point.
  const da = distance(a, lca(a, b)), start = da >= half ? a : b, target = da >= half ? half : best - half;
  let n = start, walked = 0;
  while (n.parent && walked + len(n) < target - 1e-12) { walked += len(n); n = n.parent; }
  return reroot(t, n, target - walked);
}
function lca(a: Node, b: Node) { const s = new Set<Node>(); for (let n: Node | null = a; n; n = n.parent) s.add(n); for (let n: Node | null = b; n; n = n.parent) if (s.has(n)) return n; return a; }
export const copyTree = (t: Tree) => { const tt = parseNewick(toNewick(t)); const src = t.nodes, ord = (x: Tree) => { const o: Node[] = []; const w = (n: Node) => { o.push(n); n.children.forEach(w); }; w(x.root); return o; }; const a = ord(t), b = ord(tt); a.forEach((n, k) => { if (n.color) b[k].color = n.color; }); void src; return tt; };

// ---------- Drawing ----------
export type Shape =
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; color: string; w: number; dash?: boolean }
  | { t: 'arc'; cx: number; cy: number; r: number; a0: number; a1: number; color: string; w: number }
  | { t: 'text'; x: number; y: number; s: string; size: number; color: string; anchor: 'start' | 'end' | 'middle'; rot?: number; italic?: boolean };
export type DrawOpts = { layout: 'rect' | 'circle'; lengths: boolean; align: boolean; support: boolean; branchLabels: boolean; font: number; line: number; italic: boolean; ink: string; muted: string; width: number };
export type Drawing = { w: number; h: number; shapes: Shape[]; hits: { node: Node; x: number; y: number }[] };

/** Shapes for the tree, sized to `width`, with tip names measured by `measure` (text width at size 1). */
export function drawTree(t: Tree, o: DrawOpts, measure: (s: string) => number = (s) => s.length * 0.55): Drawing {
  const L = leaves(t.root), n = L.length, useLen = o.lengths && hasLengths(t);
  const y = new Map<Node, number>(), x = new Map<Node, number>();
  L.forEach((l, k) => y.set(l, k));
  const setY = (m: Node): number => { if (!m.children.length) return y.get(m)!; const ys = m.children.map(setY); const v = (ys[0] + ys[ys.length - 1]) / 2; y.set(m, v); return v; };
  setY(t.root);
  if (useLen) { const d = depths(t); for (const m of t.nodes) x.set(m, d.get(m)!); }
  else { const h = (m: Node): number => (m.children.length ? 1 + Math.max(...m.children.map(h)) : 0); const H = h(t.root); const set = (m: Node, depth: number) => { x.set(m, m.children.length ? depth : H); m.children.forEach((c) => set(c, depth + 1)); }; set(t.root, 0); }
  const maxX = Math.max(1e-12, ...L.map((l) => x.get(l)!));
  const fs = o.font, labelW = Math.max(...L.map((l) => measure(l.name) * fs), 0) + fs * 0.6;
  const shapes: Shape[] = [], hits: Drawing['hits'] = [];
  const supportOf = (m: Node) => (m.children.length && m !== t.root && m.name !== '' ? m.name : '');
  const colorOf = (m: Node) => { for (let p: Node | null = m; p; p = p.parent) if (p.color) return p.color; return o.ink; };
  const fmt = (v: number) => String(+v.toPrecision(3));
  if (o.layout === 'rect') {
    const pad = fs, top = fs * 1.2, rowH = Math.max(fs * 1.35, 6);
    const plotW = Math.max(60, o.width - pad * 2 - labelW), H = top + (n - 1) * rowH + fs * 1.2 + (useLen ? fs * 3 : fs);
    const X = (v: number) => pad + (v / maxX) * plotW, Y = (v: number) => top + v * rowH;
    for (const m of t.nodes) {
      const col = colorOf(m), xm = X(x.get(m)!), ym = Y(y.get(m)!);
      if (m.parent) shapes.push({ t: 'line', x1: X(x.get(m.parent)!), y1: ym, x2: xm, y2: ym, color: col, w: o.line });
      if (m.children.length > 1) shapes.push({ t: 'line', x1: xm, y1: Y(y.get(m.children[0])!), x2: xm, y2: Y(y.get(m.children[m.children.length - 1])!), color: col, w: o.line });
      if (!m.children.length) {
        const xt = o.align && useLen ? X(maxX) : xm;
        if (xt > xm + 1) shapes.push({ t: 'line', x1: xm, y1: ym, x2: xt, y2: ym, color: o.muted, w: Math.max(0.5, o.line / 2), dash: true });
        shapes.push({ t: 'text', x: xt + fs * 0.35, y: ym, s: m.name, size: fs, color: col, anchor: 'start', italic: o.italic });
      } else {
        const sp = supportOf(m);
        if (o.support && sp) shapes.push({ t: 'text', x: xm - fs * 0.2, y: ym - fs * 0.55, s: sp, size: fs * 0.75, color: o.muted, anchor: 'end' });
      }
      if (o.branchLabels && m.parent && useLen && m.length !== null) shapes.push({ t: 'text', x: (X(x.get(m.parent)!) + xm) / 2, y: ym + fs * 0.6, s: fmt(m.length), size: fs * 0.7, color: o.muted, anchor: 'middle' });
      hits.push({ node: m, x: xm, y: ym });
    }
    if (useLen) scaleBar(shapes, maxX, plotW, pad, H - fs * 1.4, fs, o);
    return { w: o.width, h: Math.ceil(H), shapes, hits };
  }
  // Circular: tips around the circle, radius = distance from the root.
  const pad = fs, R = Math.max(40, o.width / 2 - pad - labelW), C = o.width / 2, extra = useLen ? fs * 3 : 0;
  const ang = (v: number) => -Math.PI / 2 + (v / Math.max(1, n)) * 2 * Math.PI;
  const P = (r: number, a: number) => [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
  const rad = (v: number) => (v / maxX) * R;
  for (const m of t.nodes) {
    const col = colorOf(m), a = ang(y.get(m)!), r = rad(x.get(m)!);
    if (m.parent) { const [x1, y1] = P(rad(x.get(m.parent)!), a), [x2, y2] = P(r, a); shapes.push({ t: 'line', x1, y1, x2, y2, color: col, w: o.line }); }
    if (m.children.length > 1) shapes.push({ t: 'arc', cx: C, cy: C, r, a0: ang(y.get(m.children[0])!), a1: ang(y.get(m.children[m.children.length - 1])!), color: col, w: o.line });
    const [xm, ym] = P(r, a);
    if (!m.children.length) {
      const rt = o.align && useLen ? R : r;
      if (rt > r + 1) { const [xa, ya] = P(rt, a); shapes.push({ t: 'line', x1: xm, y1: ym, x2: xa, y2: ya, color: o.muted, w: Math.max(0.5, o.line / 2), dash: true }); }
      const [xt, yt] = P(rt + fs * 0.35, a), deg = (a * 180) / Math.PI, flip = Math.cos(a) < 0;
      shapes.push({ t: 'text', x: xt, y: yt, s: m.name, size: fs, color: col, anchor: flip ? 'end' : 'start', rot: flip ? deg + 180 : deg, italic: o.italic });
    } else if (o.support) { const sp = supportOf(m); if (sp) shapes.push({ t: 'text', x: xm, y: ym - fs * 0.5, s: sp, size: fs * 0.75, color: o.muted, anchor: 'middle' }); }
    hits.push({ node: m, x: xm, y: ym });
  }
  if (useLen) scaleBar(shapes, maxX, R, pad, o.width + fs * 1.4, fs, o);
  return { w: o.width, h: Math.ceil(o.width + extra), shapes, hits };
}
function scaleBar(shapes: Shape[], maxX: number, span: number, x0: number, y: number, fs: number, o: DrawOpts) {
  const raw = maxX / 5, p = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 5, 10].map((k) => k * p).find((v) => v >= raw)!;
  const w = (step / maxX) * span;
  shapes.push({ t: 'line', x1: x0, y1: y, x2: x0 + w, y2: y, color: o.ink, w: Math.max(1, o.line) });
  shapes.push({ t: 'text', x: x0 + w / 2, y: y + fs * 0.9, s: String(+step.toPrecision(3)), size: fs * 0.8, color: o.ink, anchor: 'middle' });
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
/** The drawing as an SVG file. */
export function toSvg(d: Drawing, bg = '#ffffff', fontFamily = 'Arial, Helvetica, sans-serif') {
  const r = (v: number) => +v.toFixed(2);
  const body = d.shapes.map((s) => {
    if (s.t === 'line') return `<line x1="${r(s.x1)}" y1="${r(s.y1)}" x2="${r(s.x2)}" y2="${r(s.y2)}" stroke="${s.color}" stroke-width="${s.w}"${s.dash ? ' stroke-dasharray="2 3"' : ''} stroke-linecap="square"/>`;
    if (s.t === 'arc') {
      const x1 = s.cx + s.r * Math.cos(s.a0), y1 = s.cy + s.r * Math.sin(s.a0), x2 = s.cx + s.r * Math.cos(s.a1), y2 = s.cy + s.r * Math.sin(s.a1);
      return `<path d="M${r(x1)} ${r(y1)} A${r(s.r)} ${r(s.r)} 0 ${s.a1 - s.a0 > Math.PI ? 1 : 0} 1 ${r(x2)} ${r(y2)}" fill="none" stroke="${s.color}" stroke-width="${s.w}"/>`;
    }
    return `<text x="${r(s.x)}" y="${r(s.y)}" font-size="${r(s.size)}" fill="${s.color}" text-anchor="${s.anchor}" dominant-baseline="central"${s.italic ? ' font-style="italic"' : ''}${s.rot ? ` transform="rotate(${r(s.rot)} ${r(s.x)} ${r(s.y)})"` : ''}>${esc(s.s)}</text>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}" font-family="${fontFamily}">\n<rect width="100%" height="100%" fill="${bg}"/>\n${body}\n</svg>\n`;
}

/** A made-up tree for the example: 14 made-up taxa with branch lengths and support values (not a published tree). */
export const EXAMPLE = '((((Taxon_A:0.08,Taxon_B:0.10)98:0.05,Taxon_C:0.17)87:0.04,((Taxon_D:0.06,Taxon_E:0.07)100:0.09,(Taxon_F:0.12,(Taxon_G:0.03,Taxon_H:0.04)92:0.08)64:0.03)71:0.05)95:0.12,(((Taxon_I:0.11,Taxon_J:0.09)99:0.06,Taxon_K:0.21)58:0.04,((Taxon_L:0.05,Taxon_M:0.06)100:0.13,Taxon_N:0.30)83:0.07)90:0.10);';
