// Syntax trees from labelled bracket notation: parse with clear errors, lay out, draw (SVG or canvas
// operations), and write LaTeX for the forest and qtree packages. Plain TypeScript, no DOM.
//
// Notation: [S [NP [D the] [N dog]] [VP [V barked]]]
//   label_i      subscript (NP_i, t_i)
//   ^NP or NP^   draw the words under this phrase as a triangle (roof)
//   NP#1         this phrase is the landing site of arrow 1
//   t->1         this word (or [NP->1 ...] phrase) moved to #1: an arrow is drawn from here to #1

export type TNode = { label: string; sub: string; tri: boolean; id: string; to: string; leaf: boolean; kids: TNode[]; at: number };

export class TreeError extends Error { at: number; constructor(msg: string, at: number) { super(msg); this.at = at; } }

type Tok = { t: '[' | ']' | 'w'; v: string; at: number };

function lex(src: string): Tok[] {
  const out: Tok[] = [];
  const re = /\[|\]|"((?:[^"\\]|\\.)*)"|(?:\\.|[^\s[\]"])+/g;
  for (const m of src.matchAll(re)) {
    if (m[0] === '[' || m[0] === ']') out.push({ t: m[0], v: m[0], at: m.index! });
    else out.push({ t: 'w', v: m[1] !== undefined ? m[1].replace(/\\(.)/g, '$1') : m[0].replace(/\\(.)/g, '$1'), at: m.index! });
  }
  return out;
}

/** Split a label or word into its text, subscript, triangle mark and arrow marks. */
export function decorate(raw: string): { text: string; sub: string; tri: boolean; id: string; to: string } {
  let s = raw, to = '', id = '', tri = false, sub = '';
  let m = s.match(/->(\w+)$/); if (m) { to = m[1]; s = s.slice(0, -m[0].length); }
  m = s.match(/#(\w+)$/); if (m) { id = m[1]; s = s.slice(0, -m[0].length); }
  if (s.length > 1 && s.startsWith('^')) { tri = true; s = s.slice(1); } else if (s.length > 1 && s.endsWith('^')) { tri = true; s = s.slice(0, -1); }
  const u = s.indexOf('_');
  if (u > 0 && u < s.length - 1) { sub = s.slice(u + 1).replace(/^\{(.*)\}$/, '$1'); s = s.slice(0, u); }
  return { text: s, sub, tri, id, to };
}

const near = (src: string, at: number) => { const a = src.slice(Math.max(0, at - 12), at + 12).replace(/\s+/g, ' '); return `near "${a.trim()}"`; };
const lineCol = (src: string, at: number) => { const pre = src.slice(0, at).split('\n'); return pre.length > 1 ? `line ${pre.length}, character ${pre[pre.length - 1].length + 1}` : `character ${at + 1}`; };

/** Parse bracket notation into one tree. Throws TreeError with a plain message and the character position. */
export function parseTree(src: string): TNode {
  const toks = lex(src);
  if (!toks.length) throw new TreeError('Type a tree in bracket notation, such as [S [NP Kim] [VP sleeps]].', 0);
  if (toks[0].t !== '[') throw new TreeError(`The tree must start with "[" (found "${toks[0].v}" at ${lineCol(src, toks[0].at)}).`, toks[0].at);
  let i = 0;
  const node = (): TNode => {
    const open = toks[i++];
    const lab = toks[i];
    if (!lab) throw new TreeError(`The "[" at ${lineCol(src, open.at)} is never closed: add a label and a "]".`, open.at);
    if (lab.t !== 'w') throw new TreeError(`Each "[" needs a label right after it, such as [NP …]. The "[" at ${lineCol(src, open.at)} has none.`, open.at);
    i++;
    const d = decorate(lab.v);
    const n: TNode = { label: d.text, sub: d.sub, tri: d.tri, id: d.id, to: d.to, leaf: false, kids: [], at: open.at };
    let words: { v: string; at: number }[] = [];
    const flush = () => {
      if (!words.length) return;
      n.kids.push({ label: words.map((w) => w.v).join(' '), sub: '', tri: false, id: '', to: '', leaf: true, kids: [], at: words[0].at });
      words = [];
    };
    for (;;) {
      const t = toks[i];
      if (!t) { const o = toks.filter((x) => x.t === '[').length, c = toks.filter((x) => x.t === ']').length; throw new TreeError(`Missing "]": the [${lab.v} opened at ${lineCol(src, open.at)} is never closed (${o} "[" but ${c} "]").`, open.at); }
      if (t.t === ']') { i++; break; }
      if (t.t === '[') { if (n.tri) throw new TreeError(`[${lab.v} is drawn as a triangle, so it can only hold words, not another [ … ] (${near(src, t.at)}).`, t.at); flush(); n.kids.push(node()); continue; }
      const w = decorate(t.v);
      if (w.id || w.to || w.sub) { flush(); n.kids.push({ label: w.text, sub: w.sub, tri: false, id: w.id, to: w.to, leaf: true, kids: [], at: t.at }); }
      else words.push({ v: t.v, at: t.at });
      i++;
    }
    flush();
    if (n.tri && n.kids.length === 1 && n.kids[0].leaf) n.kids[0].tri = true;
    else if (n.tri && !n.kids.length) throw new TreeError(`[${lab.v}] is marked as a triangle but has no words under it.`, open.at);
    return n;
  };
  const root = node();
  if (i < toks.length) {
    const t = toks[i];
    if (t.t === ']') throw new TreeError(`There is an extra "]" at ${lineCol(src, t.at)}: the tree was already closed. Remove it or add a matching "[".`, t.at);
    throw new TreeError(`There is more after the tree ends, at ${lineCol(src, t.at)} (${near(src, t.at)}). Put everything inside one top bracket, such as [S … ].`, t.at);
  }
  // Arrows: every ->k needs exactly one #k.
  const ids = new Map<string, number>(), tos: [string, number][] = [];
  walk(root, (n) => { if (n.id) { if (ids.has(n.id)) throw new TreeError(`#${n.id} is used twice; each landing site needs its own number.`, n.at); ids.set(n.id, n.at); } if (n.to) tos.push([n.to, n.at]); });
  for (const [k, at] of tos) if (!ids.has(k)) throw new TreeError(`The arrow ->${k} has nowhere to go: mark the landing site with #${k}, such as [DP#${k} what].`, at);
  return root;
}

export function walk(n: TNode, f: (n: TNode, depth: number, parent: TNode | null) => void, depth = 0, parent: TNode | null = null) {
  f(n, depth, parent); for (const k of n.kids) walk(k, f, depth + 1, n);
}

export function stats(root: TNode) {
  let nodes = 0, leaves = 0, depth = 0; const words: string[] = [];
  walk(root, (n, d) => { if (n.leaf) { leaves++; words.push(n.label); } else nodes++; depth = Math.max(depth, d); });
  return { phrases: nodes, leaves, depth, sentence: words.join(' ') };
}

/** Bracket notation back out, tidy and on one line. */
export function toBrackets(n: TNode): string {
  const lab = (x: TNode) => (x.tri && !x.leaf ? '^' : '') + x.label + (x.sub ? '_' + x.sub : '') + (x.id ? '#' + x.id : '') + (x.to ? '->' + x.to : '');
  if (n.leaf) return lab(n);
  return `[${lab(n)}${n.kids.map((k) => ' ' + toBrackets(k)).join('')}]`;
}

// ---------- layout ----------
export type Measure = (text: string, size: number) => number;
export const roughMeasure: Measure = (t, size) => t.length * size * 0.55;
export type Opts = { size?: number; level?: number; gap?: number; bottomLeaves?: boolean; arrows?: boolean; measure?: Measure };
export type Placed = { n: TNode; x: number; y: number; w: number; depth: number; bottom: number };
export type Op =
  | { k: 'text'; x: number; y: number; text: string; sub: string; size: number; leaf: boolean }
  | { k: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { k: 'poly'; pts: [number, number][] }
  | { k: 'arrow'; d: [number, number][]; head: [number, number][] };
export type Layout = { w: number; h: number; ops: Op[]; placed: Placed[] };

export function layout(root: TNode, o: Opts = {}): Layout {
  const size = o.size ?? 16, level = o.level ?? size * 3.2, gap = o.gap ?? size * 1.1, M = o.measure ?? roughMeasure, pad = size;
  const lw = (n: TNode) => M(n.label, size) + (n.sub ? M(n.sub, size * 0.7) + 1 : 0);
  let maxDepth = 0; walk(root, (_, d) => (maxDepth = Math.max(maxDepth, d)));
  const width = new Map<TNode, number>();
  const W = (n: TNode): number => {
    const own = lw(n);
    const kids = n.kids.reduce((s, k) => s + W(k), 0) + gap * Math.max(0, n.kids.length - 1);
    const w = Math.max(own, kids); width.set(n, w); return w;
  };
  W(root);
  const placed: Placed[] = [], pos = new Map<TNode, Placed>();
  const place = (n: TNode, x0: number, depth: number): number => {
    const w = width.get(n)!, kidsW = n.kids.reduce((s, k) => s + width.get(k)!, 0) + gap * Math.max(0, n.kids.length - 1);
    let cx = x0 + w / 2;
    if (n.kids.length) {
      let x = x0 + (w - kidsW) / 2; const cs: number[] = [];
      for (const k of n.kids) { cs.push(place(k, x, depth + 1)); x += width.get(k)! + gap; }
      cx = (cs[0] + cs[cs.length - 1]) / 2;
      const half = lw(n) / 2; cx = Math.min(x0 + w - half, Math.max(x0 + half, cx));
    }
    const d = n.leaf && o.bottomLeaves ? maxDepth : depth;
    const p: Placed = { n, x: cx, y: pad + size + d * level, w: lw(n), depth: d, bottom: 0 };
    placed.push(p); pos.set(n, p);
    return cx;
  };
  place(root, pad, 0);
  // Bottom of each subtree (for arrows that start or end at a phrase).
  const bottom = (n: TNode): number => { const p = pos.get(n)!; p.bottom = Math.max(p.y + size * 0.35, ...n.kids.map(bottom)); return p.bottom; };
  bottom(root);
  const ops: Op[] = [];
  const top = (p: Placed) => p.y - size * 0.95, foot = (p: Placed) => p.y + size * 0.4;
  walk(root, (n) => {
    const p = pos.get(n)!;
    for (const k of n.kids) {
      const c = pos.get(k)!;
      if (k.tri && k.leaf) ops.push({ k: 'poly', pts: [[p.x, foot(p)], [c.x - c.w / 2, top(c)], [c.x + c.w / 2, top(c)]] });
      else ops.push({ k: 'line', x1: p.x, y1: foot(p), x2: c.x, y2: top(c) });
    }
  });
  for (const p of placed) ops.push({ k: 'text', x: p.x, y: p.y, text: p.n.label, sub: p.n.sub, size, leaf: p.n.leaf });
  let h = pad + size + maxDepth * level + size * 0.5 + pad;
  if (o.arrows !== false) {
    const byId = new Map<string, Placed>(); for (const p of placed) if (p.n.id) byId.set(p.n.id, p);
    const treeBottom = Math.max(...placed.map((p) => p.y + size * 0.4));
    let lane = 0;
    for (const s of placed.filter((p) => p.n.to)) {
      const t = byId.get(s.n.to)!;
      const sy = s.n.leaf ? s.y + size * 0.45 : s.bottom + size * 0.15, ty = t.n.leaf ? t.y + size * 0.45 : t.bottom + size * 0.15;
      const Y = treeBottom + size * (1.1 + 0.8 * lane++);
      const a = size * 0.35, tx = t.x;
      ops.push({ k: 'arrow', d: [[s.x, sy], [s.x, Y], [tx, Y], [tx, ty + a * 1.4]], head: [[tx, ty], [tx - a, ty + a * 1.6], [tx + a, ty + a * 1.6]] });
      h = Math.max(h, Y + pad);
    }
  }
  const w = Math.max(...placed.map((p) => p.x + p.w / 2)) + pad;
  return { w, h, ops, placed };
}

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f1 = (x: number) => +x.toFixed(1);

/** A standalone SVG file. */
export function toSvg(L: Layout, c: { ink: string; bg?: string; font?: string } = { ink: '#000000', bg: '#ffffff' }): string {
  const font = c.font ?? 'Times New Roman, Times, serif';
  const out = [`<svg xmlns="http://www.w3.org/2000/svg" width="${f1(L.w)}" height="${f1(L.h)}" viewBox="0 0 ${f1(L.w)} ${f1(L.h)}" font-family="${xml(font)}">`];
  if (c.bg) out.push(`<rect width="100%" height="100%" fill="${c.bg}"/>`);
  for (const o of L.ops) {
    if (o.k === 'line') out.push(`<line x1="${f1(o.x1)}" y1="${f1(o.y1)}" x2="${f1(o.x2)}" y2="${f1(o.y2)}" stroke="${c.ink}" stroke-width="1.2"/>`);
    else if (o.k === 'poly') out.push(`<polygon points="${o.pts.map((p) => p.map(f1).join(',')).join(' ')}" fill="none" stroke="${c.ink}" stroke-width="1.2" stroke-linejoin="round"/>`);
    else if (o.k === 'arrow') {
      const [p0, p1, p2, p3] = o.d;
      out.push(`<path d="M${f1(p0[0])},${f1(p0[1])} C${f1(p1[0])},${f1(p1[1])} ${f1(p2[0])},${f1(p2[1])} ${f1(p3[0])},${f1(p3[1])}" fill="none" stroke="${c.ink}" stroke-width="1.2"/>`);
      out.push(`<polygon points="${o.head.map((p) => p.map(f1).join(',')).join(' ')}" fill="${c.ink}"/>`);
    } else {
      const sub = o.sub ? `<tspan font-size="${f1(o.size * 0.7)}" dy="${f1(o.size * 0.3)}">${xml(o.sub)}</tspan>` : '';
      out.push(`<text x="${f1(o.x)}" y="${f1(o.y)}" font-size="${o.size}" text-anchor="middle" fill="${c.ink}"${o.leaf ? '' : ' font-weight="bold"'}>${xml(o.text)}${sub}</text>`);
    }
  }
  out.push('</svg>');
  return out.join('\n');
}

// ---------- LaTeX ----------
const tex = (s: string) => s.replace(/[\\{}$&#%_^~]/g, (ch) => ({ '\\': '\\textbackslash{}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' } as Record<string, string>)[ch] ?? '\\' + ch);
const texLab = (n: TNode) => tex(n.label).replace(/∅/g, '$\\emptyset$') + (n.sub ? `$_{${tex(n.sub)}}$` : '');

/** forest package: one node per line; triangles use roof, arrows are drawn with TikZ after the tree. */
export function toForest(root: TNode): string {
  const draws: string[] = []; let si = 0;
  const lines: string[] = [];
  const rec = (n: TNode, ind: string) => {
    const opts: string[] = [];
    if (n.tri && n.leaf) opts.push('roof');
    if (n.id) opts.push(`name=t${n.id}`);
    if (n.to) { const nm = `s${n.to}x${++si}`; opts.push(`name=${nm}`); draws.push(`\\draw[->] (${nm}) to[out=south, in=south] (t${n.to});`); }
    const head = `[{${texLab(n)}}${opts.length ? ', ' + opts.join(', ') : ''}`;
    if (!n.kids.length) { lines.push(`${ind}${head}]`); return; }
    lines.push(`${ind}${head}`);
    for (const k of n.kids) rec(k, ind + '  ');
    lines.push(`${ind}]`);
  };
  rec(root, '');
  return ['% \\usepackage[linguistics]{forest}', '\\begin{forest}', ...lines, ...draws, '\\end{forest}'].join('\n');
}

/** qtree package: \Tree [.S ... ] with \qroof for triangles. qtree has no arrows. */
export function toQtree(root: TNode): string {
  const rec = (n: TNode): string => {
    if (n.leaf) return `{${texLab(n)}}`;
    if (n.tri && n.kids.length === 1 && n.kids[0].leaf) return `\\qroof{${texLab(n.kids[0])}}.{${texLab(n)}}`;
    return `[.{${texLab(n)}} ${n.kids.map(rec).join(' ')} ]`;
  };
  return ['% \\usepackage{qtree}', `\\Tree ${rec(root)}`].join('\n');
}
