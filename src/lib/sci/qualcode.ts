// Qualitative coding: documents, a code book, coded passages (segments), counts per code and document,
// code co-occurrence, retrieval, and CSV/JSON export and JSON import. Plain TypeScript, no DOM.

export type QDoc = { id: string; name: string; text: string };
export type QCode = { id: string; name: string; color: string; memo: string };
export type QSeg = { id: string; doc: string; code: string; start: number; end: number };
export type Project = { docs: QDoc[]; codes: QCode[]; segs: QSeg[] };
export const FORMAT = 'fibub-qualitative-coding';

/** Eight colours that stay readable as light highlights and tell apart for most colour vision. */
export const PALETTE = ['#0072B2', '#D55E00', '#009E73', '#CC79A7', '#E69F00', '#56B4E9', '#7A5195', '#8C6D31'];

/** Trim spaces off both ends of a selection; null if nothing is left. */
export function trimRange(text: string, start: number, end: number): [number, number] | null {
  let a = Math.max(0, Math.min(start, end)), b = Math.min(text.length, Math.max(start, end));
  while (a < b && /\s/.test(text[a])) a++;
  while (b > a && /\s/.test(text[b - 1])) b--;
  return a < b ? [a, b] : null;
}

export const overlaps = (a: { start: number; end: number }, b: { start: number; end: number }) => a.start < b.end && b.start < a.end;

/** Segments sorted by document order, then start, then end. */
export function sortSegs(p: Project, segs = p.segs): QSeg[] {
  const di = new Map(p.docs.map((d, i) => [d.id, i]));
  return [...segs].sort((a, b) => (di.get(a.doc)! - di.get(b.doc)!) || a.start - b.start || a.end - b.end);
}

/** counts[code][doc] = number of passages with that code in that document. */
export function codeCounts(p: Project): { code: QCode; perDoc: number[]; total: number; docs: number; chars: number }[] {
  return p.codes.map((c) => {
    const perDoc = p.docs.map((d) => p.segs.filter((s) => s.code === c.id && s.doc === d.id).length);
    const chars = p.segs.filter((s) => s.code === c.id).reduce((n, s) => n + s.end - s.start, 0);
    return { code: c, perDoc, total: perDoc.reduce((a, b) => a + b, 0), docs: perDoc.filter((n) => n > 0).length, chars };
  });
}

/**
 * Code co-occurrence. 'overlap': pairs of passages in the same document that share at least one character
 * (the diagonal is each code's number of passages). 'document': documents where both codes appear (the diagonal
 * is the number of documents with the code). Also the c-coefficient n₁₂ / (n₁ + n₂ − n₁₂).
 */
export function cooccurrence(p: Project, mode: 'overlap' | 'document' = 'overlap'): { n: number[][]; c: number[][] } {
  const k = p.codes.length, idx = new Map(p.codes.map((c, i) => [c.id, i]));
  const n = Array.from({ length: k }, () => new Array(k).fill(0));
  if (mode === 'overlap') {
    for (const s of p.segs) n[idx.get(s.code)!][idx.get(s.code)!]++;
    for (let i = 0; i < p.segs.length; i++) for (let j = i + 1; j < p.segs.length; j++) {
      const a = p.segs[i], b = p.segs[j];
      if (a.doc !== b.doc || a.code === b.code || !overlaps(a, b)) continue;
      const x = idx.get(a.code)!, y = idx.get(b.code)!; n[x][y]++; n[y][x]++;
    }
  } else {
    for (const d of p.docs) {
      const has = [...new Set(p.segs.filter((s) => s.doc === d.id).map((s) => idx.get(s.code)!))];
      for (const x of has) for (const y of has) n[x][y]++;
    }
  }
  const c = n.map((r, i) => r.map((v, j) => (i === j ? NaN : v ? v / (n[i][i] + n[j][j] - v) : 0)));
  return { n, c };
}

/** Every passage with a code, in document order, with its text. */
export function retrieve(p: Project, code: string): { seg: QSeg; doc: QDoc; text: string; others: string[] }[] {
  const docs = new Map(p.docs.map((d) => [d.id, d])), names = new Map(p.codes.map((c) => [c.id, c.name]));
  return sortSegs(p, p.segs.filter((s) => s.code === code)).map((s) => {
    const d = docs.get(s.doc)!;
    const others = [...new Set(p.segs.filter((o) => o.doc === s.doc && o.code !== code && overlaps(o, s)).map((o) => names.get(o.code)!))];
    return { seg: s, doc: d, text: d.text.slice(s.start, s.end), others };
  });
}

/** The text of one document cut at every passage boundary, each piece with the codes covering it. */
export function pieces(text: string, segs: QSeg[]): { start: number; end: number; codes: string[]; segs: string[] }[] {
  const cuts = new Set([0, text.length]);
  for (const s of segs) { cuts.add(s.start); cuts.add(s.end); }
  const xs = [...cuts].filter((x) => x >= 0 && x <= text.length).sort((a, b) => a - b), out = [];
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]; if (a === b) continue;
    const on = segs.filter((s) => s.start <= a && s.end >= b);
    out.push({ start: a, end: b, codes: [...new Set(on.map((s) => s.code))], segs: on.map((s) => s.id) });
  }
  return out;
}

// ---------- files ----------
const cell = (s: string | number) => { const t = String(s); return /[",\n\r]/.test(t) || /^\s|\s$/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
export const csvRows = (rows: (string | number)[][]) => rows.map((r) => r.map(cell).join(',')).join('\r\n') + '\r\n';

/** One row per coded passage. Start and end are character positions (counting from 0) in the document. */
export function segmentsCsv(p: Project): string {
  const docs = new Map(p.docs.map((d) => [d.id, d])), codes = new Map(p.codes.map((c) => [c.id, c.name]));
  return csvRows([['document', 'code', 'start', 'end', 'text'], ...sortSegs(p).map((s) => [docs.get(s.doc)!.name, codes.get(s.code)!, s.start, s.end, docs.get(s.doc)!.text.slice(s.start, s.end)])]);
}
export function countsCsv(p: Project): string {
  return csvRows([['code', ...p.docs.map((d) => d.name), 'total', 'documents'], ...codeCounts(p).map((r) => [r.code.name, ...r.perDoc, r.total, r.docs])]);
}
export function matrixCsv(p: Project, mode: 'overlap' | 'document'): string {
  const { n } = cooccurrence(p, mode);
  return csvRows([['', ...p.codes.map((c) => c.name)], ...p.codes.map((c, i) => [c.name, ...n[i]])]);
}
export function toJson(p: Project): string {
  return JSON.stringify({ format: FORMAT, version: 1, docs: p.docs, codes: p.codes, segments: p.segs }, null, 2) + '\n';
}

/** A project from a JSON file made by this tool. Passages that point nowhere or fall outside their text are dropped. */
export function fromJson(text: string): { project: Project; dropped: number } {
  let o: Record<string, unknown>;
  try { o = JSON.parse(text); } catch { throw new Error('This file is not valid JSON. Choose a .json file saved from this tool.'); }
  if (!o || typeof o !== 'object' || !Array.isArray(o.docs) || !Array.isArray(o.codes)) throw new Error('This JSON file is not a coding project from this tool (it needs "docs" and "codes").');
  const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d);
  const docs: QDoc[] = (o.docs as Record<string, unknown>[]).filter((d) => d && typeof d.text === 'string').map((d, i) => ({ id: str(d.id, 'd' + i), name: str(d.name, `Document ${i + 1}`), text: d.text as string }));
  const codes: QCode[] = (o.codes as Record<string, unknown>[]).filter((c) => c && typeof c.name === 'string').map((c, i) => ({ id: str(c.id, 'c' + i), name: (c.name as string).trim(), color: /^#[0-9a-f]{6}$/i.test(str(c.color)) ? str(c.color) : PALETTE[i % PALETTE.length], memo: str(c.memo) }));
  const dm = new Map(docs.map((d) => [d.id, d])), cs = new Set(codes.map((c) => c.id));
  const raw = Array.isArray(o.segments) ? (o.segments as Record<string, unknown>[]) : [];
  const segs: QSeg[] = [];
  raw.forEach((s, i) => {
    const d = dm.get(str(s?.doc)), a = Number(s?.start), b = Number(s?.end);
    if (!d || !cs.has(str(s?.code)) || !Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b > d.text.length || a >= b) return;
    segs.push({ id: str(s.id, 's' + i), doc: d.id, code: str(s.code), start: a, end: b });
  });
  return { project: { docs, codes, segs }, dropped: raw.length - segs.length };
}
