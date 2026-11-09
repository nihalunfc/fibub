// Interlinear glossed text following the Leipzig Glossing Rules: parse examples, check that words and
// morphemes line up, find gloss abbreviations, and write plain text, HTML and LaTeX (gb4e, expex). No DOM.

export type Word = { seg: string; gloss: string; problem: string };
export type Example = { title: string; source: string; words: Word[]; translation: string; problems: string[] };

/** Boundaries that must match between a word and its gloss: - (affix), = (clitic), ~ (reduplication). */
const SEP = /[-=~]/g;
/** The boundary marks of a word in order, with infixes <…> counted separately. */
export function shape(w: string): { seps: string; infixes: number; parts: number } {
  const infixes = (w.match(/<[^<>]*>/g) || []).length;
  const bare = w.replace(/<[^<>]*>/g, '');
  const seps = (bare.match(SEP) || []).join('');
  return { seps, infixes, parts: seps.length + 1 };
}
const what = (s: string) => ({ '-': 'hyphen', '=': 'clitic boundary (=)', '~': 'reduplication mark (~)' } as Record<string, string>)[s];

/** Why a word and its gloss do not line up morpheme by morpheme (Leipzig rules 2, 5 and 10), or ''. */
export function checkWord(seg: string, gloss: string): string {
  const a = shape(seg), b = shape(gloss);
  if (a.parts !== b.parts) return `"${seg}" has ${a.parts} morpheme${a.parts === 1 ? '' : 's'} but its gloss "${gloss}" has ${b.parts}.`;
  for (let i = 0; i < a.seps.length; i++) if (a.seps[i] !== b.seps[i]) return `"${seg}" has a ${what(a.seps[i])} where its gloss "${gloss}" has a ${what(b.seps[i])} (boundary ${i + 1}).`;
  if (a.infixes !== b.infixes) return `"${seg}" has ${a.infixes} infix${a.infixes === 1 ? '' : 'es'} in < > but its gloss "${gloss}" has ${b.infixes}.`;
  return '';
}

const splitWords = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const unquote = (s: string) => s.trim().replace(/^["'‘’“”«»]+|["'‘’“”«»]+$/g, '').trim();

/**
 * Examples are separated by blank lines. Each has, in order: an optional title line starting with #, the
 * original line (when `hasSource`), the morpheme-segmented line, the gloss line and the free translation.
 */
export function parseExamples(text: string, hasSource = true): { examples: Example[]; errors: string[] } {
  const blocks = text.replace(/\r\n?/g, '\n').split(/\n\s*\n/).map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean)).filter((b) => b.length);
  const examples: Example[] = [], errors: string[] = [];
  const need = hasSource ? 4 : 3;
  blocks.forEach((lines, bi) => {
    const title = lines[0].startsWith('#') ? lines.shift()!.replace(/^#\s*/, '') : '';
    if (lines.length !== need && !(lines.length === need - 1)) {
      errors.push(`Example ${bi + 1} has ${lines.length} line${lines.length === 1 ? '' : 's'}; it needs ${need}: ${hasSource ? 'original, ' : ''}morphemes, glosses and translation (the translation may be left out). Separate examples with a blank line.`);
      return;
    }
    const [source, seg, gloss, tr] = hasSource ? lines : ['', ...lines];
    const sw = splitWords(seg), gw = splitWords(gloss);
    const problems: string[] = [];
    if (sw.length !== gw.length) problems.push(`The morpheme line has ${sw.length} word${sw.length === 1 ? '' : 's'} but the gloss line has ${gw.length}. Each word needs one gloss (join a multi-word gloss with dots, such as "come.out").`);
    const n = Math.max(sw.length, gw.length);
    const words: Word[] = [];
    for (let i = 0; i < n; i++) {
      const s = sw[i] ?? '', g = gw[i] ?? '';
      const p = !s ? `Gloss "${g}" (word ${i + 1}) has no word above it.` : !g ? `"${s}" (word ${i + 1}) has no gloss.` : checkWord(s, g);
      if (p && s && g) problems.push(`Word ${i + 1}: ${p}`);
      words.push({ seg: s, gloss: g, problem: p });
    }
    if (hasSource && sw.length && splitWords(source).length !== sw.length) problems.push(`Note: the original line has ${splitWords(source).length} words and the morpheme line ${sw.length}. That is fine if words were split or joined on purpose.`);
    examples.push({ title, source: hasSource ? source : '', words, translation: tr ? unquote(tr) : '', problems });
  });
  if (!blocks.length) errors.push('Type an example: the original line, the morpheme line, the gloss line and the translation.');
  return { examples, errors };
}

/** Gloss pieces that are grammatical category labels (PL, 1SG, NOM …), to show in small capitals. */
const PIECE = /([^.\-=~:\\<>_\s]+)/g;
export const isAbbr = (p: string) => /^(?:[1-3]+[A-Z]*|[A-Z][A-Z0-9]*)$/.test(p);
/** Split a gloss into runs of text and abbreviations, for small caps. */
export function glossRuns(g: string): { t: string; abbr: boolean }[] {
  const out: { t: string; abbr: boolean }[] = [];
  let last = 0;
  for (const m of g.matchAll(PIECE)) {
    if (m.index! > last) out.push({ t: g.slice(last, m.index), abbr: false });
    out.push({ t: m[0], abbr: isAbbr(m[0]) });
    last = m.index! + m[0].length;
  }
  if (last < g.length) out.push({ t: g.slice(last), abbr: false });
  return out;
}
/** Each abbreviation used, split into its parts (1SG → 1, SG), in order of first use. */
export function abbreviationsUsed(ex: Example[]): string[] {
  const seen = new Set<string>();
  for (const e of ex) for (const w of e.words) for (const r of glossRuns(w.gloss)) if (r.abbr) {
    const m = r.t.match(/^([1-3]+)([A-Z][A-Z0-9]*)?$/);
    if (m) { for (const d of m[1]) seen.add(d); if (m[2]) seen.add(m[2]); } else seen.add(r.t);
  }
  return [...seen];
}

/** Common category labels and their meanings (a short list; add your own). */
export const COMMON: Record<string, string> = {
  1: 'first person', 2: 'second person', 3: 'third person', SG: 'singular', DU: 'dual', PL: 'plural',
  M: 'masculine', F: 'feminine', N: 'neuter', NOM: 'nominative', ACC: 'accusative', GEN: 'genitive', DAT: 'dative',
  LOC: 'locative', ABL: 'ablative', INS: 'instrumental', ERG: 'ergative', ABS: 'absolutive', VOC: 'vocative',
  PST: 'past', PRS: 'present', FUT: 'future', PFV: 'perfective', IPFV: 'imperfective', PRF: 'perfect',
  IMP: 'imperative', SBJV: 'subjunctive', COND: 'conditional', NEG: 'negation, negative', Q: 'question particle',
  DEF: 'definite', INDF: 'indefinite', DEM: 'demonstrative', POSS: 'possessive', REFL: 'reflexive', COP: 'copula',
  AUX: 'auxiliary', INF: 'infinitive', PTCP: 'participle', PASS: 'passive', CAUS: 'causative', TOP: 'topic', FOC: 'focus',
  CL: 'classifier', DIM: 'diminutive', PROG: 'progressive', HAB: 'habitual', EVID: 'evidential', OBJ: 'object', SBJ: 'subject',
};

// ---------- exports ----------
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const width = (s: string) => Array.from(s.normalize('NFC').replace(/\p{M}/gu, '')).length;

/** Plain text with spaces lining up the words (use a fixed-width font). */
export function toPlain(ex: Example[]): string {
  return ex.map((e, i) => {
    const out: string[] = [];
    const num = `(${i + 1})`, ind = ' '.repeat(num.length + 1);
    if (e.title) out.push(`${num} ${e.title}`);
    let first = !e.title;
    const lead = () => { const l = first ? num + ' ' : ind; first = false; return l; };
    if (e.source) out.push(lead() + e.source);
    const cols = e.words.map((w) => Math.max(width(w.seg), width(w.gloss)));
    const pad = (s: string, n: number) => s + ' '.repeat(Math.max(0, n - width(s)));
    out.push(lead() + e.words.map((w, j) => pad(w.seg, cols[j])).join('  ').trimEnd());
    out.push(ind + e.words.map((w, j) => pad(w.gloss, cols[j])).join('  ').trimEnd());
    if (e.translation) out.push(`${ind}‘${e.translation}’`);
    return out.join('\n');
  }).join('\n\n');
}

/** A self-contained HTML fragment with inline styles; abbreviations in small caps. */
export function toHtml(ex: Example[]): string {
  const g = (s: string) => glossRuns(s).map((r) => (r.abbr ? `<span style="font-variant:small-caps;text-transform:lowercase">${xml(r.t)}</span>` : xml(r.t))).join('');
  return ex.map((e, i) => {
    const words = e.words.map((w) => `<div style="display:inline-block;vertical-align:top;margin:0 0.9em 0.4em 0"><div style="font-style:italic">${xml(w.seg)}</div><div>${g(w.gloss)}</div></div>`).join('');
    return `<div class="igt" style="display:flex;gap:1em;margin:1em 0">\n  <div>(${i + 1})</div>\n  <div>\n` +
      (e.title ? `    <div>${xml(e.title)}</div>\n` : '') +
      (e.source ? `    <div style="font-style:italic">${xml(e.source)}</div>\n` : '') +
      `    <div>${words}</div>\n` +
      (e.translation ? `    <div>‘${xml(e.translation)}’</div>\n` : '') + '  </div>\n</div>';
  }).join('\n');
}

const tex = (s: string) => s.replace(/[\\{}$&#%_^~<>]/g, (c) => ({ '\\': '\\textbackslash{}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}', '<': '\\textless{}', '>': '\\textgreater{}' } as Record<string, string>)[c] ?? '\\' + c);
/** A gloss word for LaTeX, abbreviations as \textsc{lowercase}. */
export const texGloss = (s: string) => glossRuns(s).map((r) => (r.abbr ? `\\textsc{${r.t.toLowerCase()}}` : tex(r.t))).join('');
const brace = (s: string) => (/\s/.test(s) ? `{${s}}` : s);

/** gb4e: \gll (or \glll with the original line when it has the same number of words). */
export function toGb4e(ex: Example[]): string {
  const body = ex.map((e) => {
    const seg = e.words.map((w) => brace(tex(w.seg))).join(' '), gl = e.words.map((w) => brace(texGloss(w.gloss))).join(' ');
    const src = e.source ? e.source.trim().split(/\s+/) : [];
    const lines = [`\\ex${e.title ? ' ' + tex(e.title) + '\\\\' : ''}`];
    if (src.length && src.length === e.words.length) lines.push(`\\glll ${src.map(tex).join(' ')}\\\\`, `     ${seg}\\\\`, `     ${gl}\\\\`);
    else { if (src.length) lines.push(`\\textit{${tex(e.source)}}\\\\`); lines.push(`\\gll ${seg}\\\\`, `     ${gl}\\\\`); }
    if (e.translation) lines.push(`\\trans \`${tex(e.translation)}'`);
    return lines.join('\n');
  });
  return ['% \\usepackage{gb4e}', '\\begin{exe}', ...body, '\\end{exe}'].join('\n');
}

/** expex: \begingl with \glpreamble for the original line and \glft for the translation. */
export function toExpex(ex: Example[]): string {
  return ['% \\usepackage{expex}', ...ex.map((e) => [
    '\\ex' + (e.title ? ' ' + tex(e.title) : ''),
    '\\begingl',
    ...(e.source ? [`\\glpreamble ${tex(e.source)}//`] : []),
    `\\gla ${e.words.map((w) => brace(tex(w.seg))).join(' ')}//`,
    `\\glb ${e.words.map((w) => brace(texGloss(w.gloss))).join(' ')}//`,
    ...(e.translation ? [`\\glft \`${tex(e.translation)}'//`] : []),
    '\\endgl',
    '\\xe',
  ].join('\n'))].join('\n\n');
}
