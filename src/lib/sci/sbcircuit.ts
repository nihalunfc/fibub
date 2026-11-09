// Genetic circuit designs: read a part list and interactions, find transcription units, check common mistakes, and
// lay the design out as SBOL Visual style glyphs (drawn by fibub from the shapes the standard describes) for SVG or
// canvas. No DOM.

export type PartType = 'promoter' | 'operator' | 'rbs' | 'cds' | 'terminator' | 'insulator' | 'ori' | 'spacer' | 'generic';
export const PART_TYPES: { id: PartType; name: string; words: string[] }[] = [
  { id: 'promoter', name: 'Promoter', words: ['promoter', 'p', 'prom'] },
  { id: 'operator', name: 'Operator', words: ['operator', 'op', 'o'] },
  { id: 'rbs', name: 'Ribosome binding site', words: ['rbs', 'ribosome', 'res'] },
  { id: 'cds', name: 'Coding sequence', words: ['cds', 'gene', 'orf'] },
  { id: 'terminator', name: 'Terminator', words: ['terminator', 't', 'term'] },
  { id: 'insulator', name: 'Insulator', words: ['insulator', 'ins'] },
  { id: 'ori', name: 'Origin of replication', words: ['ori', 'origin'] },
  { id: 'spacer', name: 'Spacer', words: ['spacer', 'sp'] },
  { id: 'generic', name: 'Other part', words: ['generic', 'other', 'part', 'user'] },
];
const WORD: Record<string, PartType> = {};
for (const t of PART_TYPES) for (const w of t.words) WORD[w] = t.id;

export type Part = { name: string; type: PartType; rev: boolean };
export type Interaction = { from: string; to: string; kind: 'repression' | 'activation' };
export type Design = { parts: Part[]; interactions: Interaction[] };

/**
 * Reads a design: parts as "name:type" separated by commas or new lines ("<name:type" for the reverse strand), and
 * interactions as "A -| B" (A represses B) or "A -> B" (A activates B), one per line or separated by commas.
 */
export function parseDesign(text: string): { design: Design; errors: string[] } {
  const parts: Part[] = [], interactions: Interaction[] = [], errors: string[] = [];
  const items = text.replace(/\r/g, '').split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
  for (const it of items) {
    const m = it.match(/^(.+?)\s*(-\||⊣|->|→)\s*(.+)$/);
    if (m) { interactions.push({ from: m[1].trim(), to: m[3].trim(), kind: m[2] === '->' || m[2] === '→' ? 'activation' : 'repression' }); continue; }
    let s = it, rev = false;
    if (s.startsWith('<')) { rev = true; s = s.slice(1).trim(); }
    const c = s.lastIndexOf(':');
    if (c < 0) { errors.push(`"${it}": write a part as name:type, for example tetR:cds.`); continue; }
    const name = s.slice(0, c).trim(), tw = s.slice(c + 1).trim().toLowerCase(), type = WORD[tw];
    if (!name) { errors.push(`"${it}": the part needs a name.`); continue; }
    if (!type) { errors.push(`"${it}": unknown type "${tw}". Use promoter, operator, rbs, cds, terminator, insulator, ori, spacer or generic.`); continue; }
    parts.push({ name, type, rev });
  }
  return { design: { parts, interactions }, errors };
}

export type Unit = { promoter: string; rev: boolean; parts: string[]; terminated: boolean; cds: string[] };
/** Transcription units: from each promoter, downstream on its strand, to the first terminator (or the end). */
export function transcriptionUnits(d: Design): Unit[] {
  const out: Unit[] = [], P = d.parts;
  P.forEach((p, i) => {
    if (p.type !== 'promoter') return;
    const u: Unit = { promoter: p.name, rev: p.rev, parts: [], terminated: false, cds: [] };
    for (let j = p.rev ? i - 1 : i + 1; j >= 0 && j < P.length; j += p.rev ? -1 : 1) {
      const q = P[j];
      if (q.rev !== p.rev) continue;
      if (q.type === 'terminator') { u.terminated = true; u.parts.push(q.name); break; }
      u.parts.push(q.name);
      if (q.type === 'cds') u.cds.push(q.name);
    }
    out.push(u);
  });
  return out;
}

/** Plain-language warnings about the design. */
export function checkDesign(d: Design): string[] {
  const w: string[] = [], P = d.parts, names = new Set(P.map((p) => p.name)), units = transcriptionUnits(d);
  const seen = new Set<string>();
  for (const p of P) { if (seen.has(p.name)) w.push(`Two parts are called "${p.name}"; give them different names so interactions are clear.`); seen.add(p.name); }
  P.forEach((p, i) => {
    if (p.type !== 'cds') return;
    // The nearest upstream part on the same strand (operators and spacers skipped) should be an RBS.
    let prev: Part | undefined;
    for (let j = p.rev ? i + 1 : i - 1; j >= 0 && j < P.length; j += p.rev ? 1 : -1) { const q = P[j]; if (q.rev !== p.rev || q.type === 'operator' || q.type === 'spacer') continue; prev = q; break; }
    if (!prev || prev.type !== 'rbs') w.push(`${p.name}: no ribosome binding site just upstream, so it may not be translated.`);
    if (!units.some((u) => u.cds.includes(p.name))) w.push(`${p.name}: no promoter upstream on its strand, so it is not transcribed.`);
  });
  for (const u of units) {
    if (!u.terminated) w.push(`${u.promoter}: no terminator downstream, so transcription reads through to the end.`);
    else if (!u.cds.length) w.push(`${u.promoter}: no coding sequence before the terminator.`);
  }
  for (const x of d.interactions) {
    if (!names.has(x.from)) w.push(`Interaction ${x.from} → ${x.to}: there is no part called "${x.from}".`);
    if (!names.has(x.to)) w.push(`Interaction ${x.from} → ${x.to}: there is no part called "${x.to}".`);
    const t = P.find((p) => p.name === x.to);
    if (t && t.type !== 'promoter' && t.type !== 'operator') w.push(`${x.from} ${x.kind === 'repression' ? 'represses' : 'activates'} ${x.to}, which is a ${t.type}: regulators usually act on a promoter or operator.`);
  }
  return w;
}

// ---------- Layout ----------
export type Prim = { k: 'path'; d: string; fill: 'none' | 'ink' | 'soft' | 'bg'; stroke: 'ink' | 'accent' | 'bad' | 'none'; w: number } | { k: 'text'; x: number; y: number; s: string; size: number; anchor: 'start' | 'middle' | 'end'; color: 'ink' | 'muted' | 'accent' | 'bad'; bold?: boolean };
export type Layout = { w: number; h: number; prims: Prim[]; boxes: { name: string; x: number; w: number }[] };

export const textW = (s: string, size: number) => s.length * size * 0.58;
const WIDTH: Record<PartType, number> = { promoter: 34, operator: 20, rbs: 26, cds: 72, terminator: 26, insulator: 26, ori: 28, spacer: 24, generic: 40 };
const f = (n: number) => +n.toFixed(2);

/** Glyph outline for a part whose box starts at x on a backbone at y. Forward parts sit above the line; reverse are mirrored below. */
function glyph(p: Part, x: number, w: number, y: number): Prim[] {
  const s = p.rev ? 1 : -1; // up for forward
  const X = (u: number) => f(p.rev ? x + w - u : x + u), Y = (v: number) => f(y + s * v);
  const L = (pts: [number, number][], close = false) => `M${pts.map(([u, v]) => `${X(u)} ${Y(v)}`).join(' L')}${close ? ' Z' : ''}`;
  const c = w / 2;
  switch (p.type) {
    case 'promoter': return [{ k: 'path', d: L([[6, 0], [6, 26], [w - 6, 26]]), fill: 'none', stroke: 'ink', w: 2 }, { k: 'path', d: L([[w - 12, 20], [w - 4, 26], [w - 12, 32]], true), fill: 'ink', stroke: 'ink', w: 1.5 }];
    case 'operator': return [{ k: 'path', d: L([[c - 7, -7], [c + 7, -7], [c + 7, 7], [c - 7, 7]], true), fill: 'bg', stroke: 'ink', w: 1.6 }];
    case 'rbs': { const r = 10; return [{ k: 'path', d: `M${X(c - r)} ${Y(0)} A${r} ${r} 0 0 1 ${X(c + r)} ${Y(0)}`, fill: 'soft', stroke: 'ink', w: 1.6 }]; }
    case 'cds': return [{ k: 'path', d: L([[2, -11], [w - 16, -11], [w - 2, 0], [w - 16, 11], [2, 11]], true), fill: 'soft', stroke: 'ink', w: 1.6 }];
    case 'terminator': return [{ k: 'path', d: L([[c, 0], [c, 22]]) + ' ' + L([[c - 9, 22], [c + 9, 22]]), fill: 'none', stroke: 'ink', w: 2.2 }];
    case 'insulator': return [{ k: 'path', d: L([[c - 10, -10], [c + 10, -10], [c + 10, 10], [c - 10, 10]], true), fill: 'bg', stroke: 'ink', w: 1.4 }, { k: 'path', d: L([[c - 5, -5], [c + 5, -5], [c + 5, 5], [c - 5, 5]], true), fill: 'none', stroke: 'ink', w: 1.4 }];
    case 'ori': { const r = 10; return [{ k: 'path', d: `M${f(x + c - r)} ${f(y)} A${r} ${r} 0 1 0 ${f(x + c + r)} ${f(y)} A${r} ${r} 0 1 0 ${f(x + c - r)} ${f(y)} Z`, fill: 'bg', stroke: 'ink', w: 1.6 }]; }
    case 'spacer': { const r = 8, k = r * 0.7071; return [{ k: 'path', d: `M${f(x + c - r)} ${f(y)} A${r} ${r} 0 1 0 ${f(x + c + r)} ${f(y)} A${r} ${r} 0 1 0 ${f(x + c - r)} ${f(y)} Z`, fill: 'bg', stroke: 'ink', w: 1.4 }, { k: 'path', d: `M${f(x + c - k)} ${f(y - k)} L${f(x + c + k)} ${f(y + k)} M${f(x + c - k)} ${f(y + k)} L${f(x + c + k)} ${f(y - k)}`, fill: 'none', stroke: 'ink', w: 1.4 }]; }
    default: return [{ k: 'path', d: L([[3, 0], [3, 18], [w - 3, 18], [w - 3, 0]]), fill: 'none', stroke: 'ink', w: 1.6 }];
  }
}

/** Lays a design out left to right with interaction arcs above. */
export function layout(d: Design): Layout {
  const pad = 14, gap = 8, size = 12, prims: Prim[] = [], boxes: { name: string; x: number; w: number }[] = [];
  let x = pad;
  for (const p of d.parts) {
    const w = p.type === 'cds' ? Math.max(WIDTH.cds, textW(p.name, size) + 30) : Math.max(WIDTH[p.type], textW(p.name, size) + 4);
    boxes.push({ name: p.name, x, w }); x += w + gap;
  }
  const W = Math.max(x - gap + pad, 120);
  // Interaction arcs: shortest spans get the lowest levels, without overlapping on the same level.
  const idx = (n: string) => d.parts.findIndex((p) => p.name === n);
  const arcs = d.interactions.map((it) => ({ it, a: idx(it.from), b: idx(it.to) })).filter((r) => r.a >= 0 && r.b >= 0 && r.a !== r.b).map((r) => {
    const A = boxes[r.a], B = boxes[r.b]; return { ...r, xa: A.x + A.w / 2, xb: B.x + B.w / 2, lo: Math.min(A.x, B.x), hi: Math.max(A.x + A.w, B.x + B.w) };
  }).sort((p, q) => (p.hi - p.lo) - (q.hi - q.lo));
  const levels: { lo: number; hi: number }[][] = [], lvl: number[] = [];
  arcs.forEach((r, i) => { let L = 0; while ((levels[L] ?? []).some((s) => !(r.hi + 4 < s.lo || r.lo - 4 > s.hi))) L++; (levels[L] ??= []).push({ lo: r.lo, hi: r.hi }); lvl[i] = L; });
  const nL = levels.length, top = 10, step = 16, y = top + (nL ? 40 + (nL - 1) * step : 36);
  // Backbone.
  prims.push({ k: 'path', d: `M${pad - 6} ${f(y)} L${f(W - pad + 6)} ${f(y)}`, fill: 'none', stroke: 'ink', w: 1.6 });
  d.parts.forEach((p, i) => {
    const b = boxes[i];
    prims.push(...glyph(p, b.x, b.w, y));
    prims.push({ k: 'text', x: f(b.x + b.w / 2), y: f(y + 44), s: p.name, size, anchor: 'middle', color: 'ink' });
  });
  arcs.forEach((r, i) => {
    const ay = y - 34 - lvl[i] * step, sy = y - 14, ty = y - 30, rep = r.it.kind === 'repression', col = rep ? 'bad' : 'accent';
    const xa = r.xa + (r.xb > r.xa ? 4 : -4), xb = r.xb + (r.xb > r.xa ? -3 : 3);
    prims.push({ k: 'path', d: `M${f(xa)} ${f(sy)} L${f(xa)} ${f(ay)} L${f(xb)} ${f(ay)} L${f(xb)} ${f(ty)}`, fill: 'none', stroke: col, w: 1.6 });
    prims.push(rep ? { k: 'path', d: `M${f(xb - 7)} ${f(ty)} L${f(xb + 7)} ${f(ty)}`, fill: 'none', stroke: col, w: 2.4 } : { k: 'path', d: `M${f(xb - 5)} ${f(ty - 7)} L${f(xb + 5)} ${f(ty - 7)} L${f(xb)} ${f(ty)} Z`, fill: 'none', stroke: col, w: 1.6 });
  });
  return { w: f(W), h: f(y + 56), prims, boxes };
}

export type Colours = { ink: string; muted: string; accent: string; bad: string; bg: string; soft: string };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The layout as a standalone SVG document. */
export function toSvg(L: Layout, c: Colours, background = true) {
  const col = (k: string) => (c as Record<string, string>)[k] ?? k;
  const body = L.prims.map((p) => p.k === 'path'
    ? `<path d="${p.d}" fill="${p.fill === 'none' ? 'none' : col(p.fill)}" stroke="${p.stroke === 'none' ? 'none' : col(p.stroke)}" stroke-width="${p.w}" stroke-linejoin="round" stroke-linecap="round"/>`
    : `<text x="${p.x}" y="${p.y}" font-size="${p.size}" text-anchor="${p.anchor}" fill="${col(p.color)}"${p.bold ? ' font-weight="700"' : ''}>${esc(p.s)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}" font-family="Helvetica, Arial, sans-serif">${background ? `<rect width="100%" height="100%" fill="${c.bg}"/>` : ''}${body}</svg>`;
}
