// Response to reviewers: split pasted reviewer reports into reviewers and numbered points, then write the response
// letter as LaTeX, Markdown or plain sections (for the Word, PDF and image downloads). Plain TypeScript, no DOM.
import { tex } from './authors.ts';

export type Point = { id: string; reviewer: number; n: number; group: string; text: string };
export type Reviewer = { name: string; label: string; points: Point[] };
export type Answer = { response: string; changes: string };
export type Letter = { title: string; msId: string; opening: string; closing: string };

const HEAD = /^[\s#*_>]*(?:(?:comments?|report|remarks|review)\s+(?:from|of|by|for)\s+(?:the\s+)?)?(reviewer|referee|editor|associate\s+editor|academic\s+editor|handling\s+editor|editor[- ]in[- ]chief)\s*(?::\s*(?=\d{1,2}\b))?(?:#|no\.?|number)?\s*(\d{1,2}|[A-H]|[IVX]{1,4})?\b\s*(?:\([^)]*\))?\s*[:.\-–—]?[\s*_]*(.*)$/i;
const MARK = /^\s*(?:\(?(\d{1,3})[.)\]:]\s+|\[(\d{1,3})\]\s*|\(?([a-z])\)\s+|(?:comment|point|issue|question|concern|remark|q|c)\s*#?\s*(\d{1,3}(?:\.\d{1,2})?)\s*[:.)\-–]\s*|[-•*–▪]\s+)/i;
const GROUP = /^[\s#*_]*((?:major|minor|general|specific|additional|other|technical|editorial)(?:\s+(?:comments?|points?|issues?|concerns?|revisions?|remarks?))?|(?:summary|overall assessment|recommendation))\s*[:.]?[\s*_]*$/i;

/** Is this line a reviewer heading? Returns the reviewer's display name and short label, or null. */
export function reviewerHeading(line: string, index: number): { name: string; label: string; rest: string } | null {
  if (line.trim().length > 90) return null;
  const m = HEAD.exec(line);
  if (!m) return null;
  // "Reviewer 2 suggests ..." is a sentence, not a heading: a heading has a number, a colon or nothing after it.
  let rest = (m[3] ?? '').trim();
  if (/^(?:'s\s+)?(?:comments?|report|remarks|review)\s*(?:to\s+the\s+authors?)?\s*:?$/i.test(rest)) rest = '';
  else if (rest && !m[2] && !/[:.\-–—]\s*$/.test(line.slice(0, line.length - (m[3] ?? '').length).trim())) return null;
  if (rest && rest.length > 0 && /^[a-z]/.test(rest) && !/[:]/.test(line)) return null;
  const role = m[1].toLowerCase().replace(/\s+/g, ' ');
  const isEditor = role.includes('editor');
  const num = m[2] ? m[2].toUpperCase() : '';
  const name = (isEditor ? role.replace(/^./, (c) => c.toUpperCase()) : 'Reviewer') + (num ? ` ${num}` : isEditor ? '' : ` ${index}`);
  const label = isEditor ? `E${num}` : `R${num || index}`;
  return { name, label, rest };
}

/** Split pasted comments into reviewers and points. Numbered or bulleted lines start points; without any, each
 *  paragraph is a point. Lines such as "Major comments" set a group for the points that follow. */
export function splitComments(text: string): Reviewer[] {
  const lines = text.replace(/\r/g, '').split('\n');
  const blocks: { name: string; label: string; lines: string[] }[] = [];
  let rIndex = 0;
  for (const raw of lines) {
    const h = reviewerHeading(raw, rIndex + 1);
    if (h) {
      if (!h.name.startsWith('Reviewer')) blocks.push({ name: h.name, label: h.label, lines: [] });
      else { rIndex++; blocks.push({ name: h.name, label: h.label, lines: [] }); }
      if (h.rest) blocks[blocks.length - 1].lines.push(h.rest);
      continue;
    }
    if (!blocks.length) { if (!raw.trim()) continue; blocks.push({ name: 'General comments', label: 'G', lines: [] }); }
    blocks[blocks.length - 1].lines.push(raw);
  }
  // Labels must be unique (two "Reviewer 1" headings, or editor and associate editor both "E").
  const seen = new Map<string, number>();
  for (const b of blocks) { const k = seen.get(b.label) ?? 0; seen.set(b.label, k + 1); if (k) b.label += String.fromCharCode(97 + k); }
  const out: Reviewer[] = [];
  blocks.forEach((b, ri) => {
    const pts: { group: string; text: string[]; own: string; pre: boolean }[] = [];
    let group = '';
    const marked = b.lines.some((l) => MARK.test(l));
    let para: string[] = [], own = '', pre = false;
    const flush = () => { if (para.join('').trim()) pts.push({ group, text: para, own, pre }); para = []; own = ''; pre = false; };
    for (const l of b.lines) {
      const g = GROUP.exec(l);
      if (g && l.trim().length < 60) { flush(); group = g[1].trim().replace(/^./, (c) => c.toUpperCase()); continue; }
      if (marked) {
        if (MARK.test(l)) { flush(); const m = MARK.exec(l)!; own = m[1] ?? m[2] ?? m[4] ?? ''; para = [l.replace(MARK, '')]; }
        else if (!l.trim()) para.push('');
        else if (!para.length && !pts.length) { para = [l]; pre = true; }
        else para.push(l);
      } else {
        if (!l.trim()) flush(); else para.push(l);
      }
    }
    flush();
    const kept = pts.map((p) => ({ ...p, body: p.text.join('\n').replace(/\n{3,}/g, '\n\n').trim() })).filter((p) => p.body);
    // Keep the reviewer's own numbers when every numbered point has a different one; text before the first
    // numbered point (often a summary) is point 0.
    const main = kept.filter((p) => !p.pre);
    const ownOk = main.length > 0 && main.every((p) => /^\d+(\.\d+)?$/.test(p.own)) && new Set(main.map((p) => p.own)).size === main.length;
    let k = 0;
    const points = kept.map((p) => {
      const n = p.pre ? 0 : ++k;
      const tag = p.pre ? '0' : ownOk ? p.own : String(n);
      return { id: `${b.label}.${tag}`, reviewer: ri, n, group: p.pre && !p.group ? 'General' : p.group, text: p.body };
    });
    if (points.length) out.push({ name: b.name, label: b.label, points });
  });
  return out;
}

const texPara = (s: string) => s.trim().split(/\n\s*\n/).map((p) => p.split('\n').map((l) => tex(l.trim())).join('\n')).join('\n\n');
const answered = (a?: Answer) => !!a && !!a.response.trim();

/** A complete LaTeX document for the response letter. */
export function toLatex(R: Reviewer[], A: Record<string, Answer>, L: Letter): string {
  const o: string[] = [
    '\\documentclass[11pt]{article}', '\\usepackage[T1]{fontenc}', '\\usepackage[utf8]{inputenc}', '\\usepackage[margin=2.5cm]{geometry}', '\\usepackage{parskip}', '\\usepackage{xcolor}',
    '% Reviewer comments in grey italics; responses in normal type.',
    '\\newenvironment{reviewercomment}{\\quote\\itshape\\color{black!70}}{\\endquote}',
    '\\begin{document}', '', '\\section*{Response to the reviewers}',
  ];
  if (L.title.trim()) o.push(`\\textbf{Manuscript:} ${tex(L.title.trim())}${L.msId.trim() ? ` (${tex(L.msId.trim())})` : ''}`, '');
  else if (L.msId.trim()) o.push(`\\textbf{Manuscript:} ${tex(L.msId.trim())}`, '');
  if (L.opening.trim()) o.push(texPara(L.opening), '');
  for (const r of R) {
    o.push(`\\section*{${tex(r.name)}}`);
    let g = '';
    for (const p of r.points) {
      if (p.group && p.group !== g) { o.push(`\\subsection*{${tex(p.group)}}`); g = p.group; }
      const a = A[p.id];
      o.push(`\\paragraph{Comment ${tex(p.id)}}`, '\\begin{reviewercomment}', texPara(p.text), '\\end{reviewercomment}');
      o.push(`\\textbf{Response:} ${answered(a) ? texPara(a!.response) : '\\textcolor{red}{[Response to be written.]}'}`, '');
      if (a?.changes.trim()) o.push(`\\textbf{Changes in the manuscript:} ${texPara(a.changes)}`, '');
    }
  }
  if (L.closing.trim()) o.push(texPara(L.closing), '');
  o.push('\\end{document}');
  return o.join('\n') + '\n';
}

/** Markdown version (pastes into many editors, or turns into Word with Pandoc). */
export function toMarkdown(R: Reviewer[], A: Record<string, Answer>, L: Letter): string {
  const quote = (s: string) => s.trim().split('\n').map((l) => `> ${l}`.trimEnd()).join('\n');
  const o = ['# Response to the reviewers', ''];
  if (L.title.trim() || L.msId.trim()) o.push(`**Manuscript:** ${[L.title.trim(), L.msId.trim() ? `(${L.msId.trim()})` : ''].filter(Boolean).join(' ')}`, '');
  if (L.opening.trim()) o.push(L.opening.trim(), '');
  for (const r of R) {
    o.push(`## ${r.name}`, '');
    let g = '';
    for (const p of r.points) {
      if (p.group && p.group !== g) { o.push(`### ${p.group}`, ''); g = p.group; }
      const a = A[p.id];
      o.push(`**Comment ${p.id}**`, '', quote(p.text), '', `**Response:** ${answered(a) ? a!.response.trim() : '*[Response to be written.]*'}`, '');
      if (a?.changes.trim()) o.push(`**Changes in the manuscript:** ${a.changes.trim()}`, '');
    }
  }
  if (L.closing.trim()) o.push(L.closing.trim(), '');
  return o.join('\n');
}

/** Sections for the report helper (Word, PDF and image): one per reviewer. */
export function toSections(R: Reviewer[], A: Record<string, Answer>, L: Letter): { title: string; text: string[] }[] {
  const out: { title: string; text: string[] }[] = [];
  const intro = [L.title.trim() ? `Manuscript: ${L.title.trim()}${L.msId.trim() ? ` (${L.msId.trim()})` : ''}` : L.msId.trim() ? `Manuscript: ${L.msId.trim()}` : '', L.opening.trim()].filter(Boolean);
  if (intro.length) out.push({ title: 'Letter', text: intro });
  for (const r of R) {
    const text: string[] = [];
    let g = '';
    for (const p of r.points) {
      if (p.group && p.group !== g) { text.push(`${p.group.toUpperCase()}`); g = p.group; }
      const a = A[p.id];
      text.push(`Comment ${p.id}: ${p.text}`, `Response: ${answered(a) ? a!.response.trim() : '[Response to be written.]'}`);
      if (a?.changes.trim()) text.push(`Changes in the manuscript: ${a.changes.trim()}`);
    }
    out.push({ title: r.name, text });
  }
  if (L.closing.trim()) out.push({ title: 'Closing', text: [L.closing.trim()] });
  return out;
}

export const progress = (R: Reviewer[], A: Record<string, Answer>) => {
  const all = R.flatMap((r) => r.points);
  return { total: all.length, done: all.filter((p) => answered(A[p.id])).length, missing: all.filter((p) => !answered(A[p.id])).map((p) => p.id) };
};

export const OPENING = `Dear Editor,

Thank you for the opportunity to revise our manuscript, and thank you to the reviewers for their careful reading. We have addressed every comment below. The reviewers' comments are in italics, followed by our response and the changes made to the manuscript.`;
export const CLOSING = `We hope the revised manuscript is now suitable for publication.

Yours sincerely,
The authors`;

export const EXAMPLE = `Reviewer #1:
The authors present a made-up study of plant growth under three light levels. The paper is clear, but some points need attention.

Major comments
1. The number of plants per group (n = 6) seems small. Please justify the sample size or add more plants.
2. The statistics section does not say whether the data were checked for normality before the ANOVA.

Minor comments
3. Figure 2: the axis labels are too small to read when printed.
4. Line 112: "efect" should be "effect".

Reviewer 2
I enjoyed reading this manuscript.

Could the authors discuss how temperature might have differed between the light treatments?

The conclusion overstates the result; the effect was seen in one species only.
`;
