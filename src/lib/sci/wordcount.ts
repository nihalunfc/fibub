// Abstract word counter: words, characters, sentences and keywords, optional LaTeX removal, a user-set limit and
// where the text goes over it. Plain TypeScript, no DOM.
import { latexToText } from './bibtex.ts';

export type Unit = 'words' | 'chars' | 'charsNoSpace';
export type Counts = { words: number; chars: number; charsNoSpace: number; sentences: number; paragraphs: number; avgSentence: number };

/** Remove LaTeX markup: comments, citations, labels and footnotes go; maths becomes one word, [math], and a
 *  reference one word, [ref]; formatting commands keep their text; accents become letters. */
export function stripLatex(src: string): string {
  let s = src.replace(/(^|[^\\])%.*$/gm, '$1');
  s = s.replace(/\\begin\{(equation|align|eqnarray|gather|multline|displaymath)\*?\}[\s\S]*?\\end\{\1\*?\}/g, ' [math] ');
  s = s.replace(/\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, ' [math] ');
  s = s.replace(/(^|[^\\])\$(?:[^$\\]|\\.)+\$/g, '$1[math]');
  // References become one word, [ref]; citations, labels and footnotes are not counted.
  s = s.replace(/\\(?:ref|eqref|autoref|cref|Cref|pageref)\s*\{[^{}]*\}/g, '[ref]');
  s = s.replace(/\s*\\(?:cite[a-zA-Z]*|[cC]ite[pt]?\*?|label|footnote|url|input|include)\s*(?:\[[^\]]*\]\s*)*\{[^{}]*\}/g, '');
  s = s.replace(/\\begin\{[^}]*\}|\\end\{[^}]*\}/g, ' ');
  return latexToText(s.replace(/\n{2,}/g, '\u2029')).replace(/\u2029/g, '\n\n');
}

const WORD = /[\p{L}\p{N}]/u;
/** Word tokens: runs of non-space characters that hold at least one letter or digit (as word processors count). */
export function wordSpans(text: string): [number, number][] {
  const out: [number, number][] = [];
  const re = /\S+/gu;
  for (let m; (m = re.exec(text)); ) if (WORD.test(m[0])) out.push([m.index, m.index + m[0].length]);
  return out;
}

const ABBR = new Set(['e.g', 'i.e', 'al', 'fig', 'figs', 'eq', 'eqs', 'ref', 'refs', 'vs', 'cf', 'approx', 'ca', 'dr', 'prof', 'mr', 'mrs', 'ms', 'st', 'no', 'vol', 'pp', 'p', 'sect', 'sec', 'ch', 'tab', 'resp', 'viz', 'jr', 'sr', 'inc', 'ltd', 'co', 'dept', 'univ', 'approx', 'max', 'min', 'est', 'u.s', 'u.k', 'ph.d', 'cf', 'nos', 'ed', 'eds', 'Fig', 'e', 'i']);
/** Sentences: ends at . ! or ? followed by a space and a capital letter, digit or opening mark, unless the word
 *  before the full stop is a common abbreviation (e.g., et al., Fig.) or a single initial. */
export function sentences(text: string): string[] {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return [];
  const out: string[] = [];
  let start = 0;
  const re = /([.!?…]+)(["'”’)\]]*)\s+(?=["'“‘(\[]?[\p{Lu}\p{N}])/gu;
  for (let m; (m = re.exec(t)); ) {
    const end = m.index + m[1].length + m[2].length;
    if (m[1] === '.') {
      const before = t.slice(start, m.index);
      const w = /(\S+)$/.exec(before)?.[1] ?? '';
      const bare = w.replace(/^["'“‘(\[]+/, '');
      if (ABBR.has(bare.toLowerCase()) || /^\p{Lu}$/u.test(bare) || /^(\p{L}\.)+\p{L}$/u.test(bare)) continue;
    }
    out.push(t.slice(start, end).trim());
    start = end;
  }
  if (t.slice(start).trim()) out.push(t.slice(start).trim());
  return out;
}

export function count(text: string): Counts {
  const words = wordSpans(text).length;
  const cps = [...text.normalize('NFC').replace(/\r/g, '')];
  const chars = cps.length, charsNoSpace = cps.filter((c) => !/\s/u.test(c)).length;
  const sn = sentences(text).filter((s) => WORD.test(s)).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => WORD.test(p)).length;
  return { words, chars, charsNoSpace, sentences: sn, paragraphs, avgSentence: sn ? words / sn : 0 };
}

/** Index in the text where the limit is first exceeded (start of the first word, or first character, over it),
 *  or -1 when the text fits. Characters are counted as Unicode code points, the way the counts above are. */
export function overflowAt(text: string, limit: number, unit: Unit): number {
  if (!(limit >= 0)) return -1;
  if (unit === 'words') { const w = wordSpans(text); return w.length > limit ? w[limit][0] : -1; }
  let n = 0, i = 0;
  for (const c of text) {
    if (c !== '\r' && (unit === 'chars' || !/\s/u.test(c))) { n++; if (n > limit) return i; }
    i += c.length;
  }
  return -1;
}

const STOP = new Set('a an and are as at be been being but by can could did do does for from had has have how if in into is it its of on or our that the their them then there these they this those to was we were what when where which while who will with would not no than also both each more most such only other between using used use show shows shown here we our may can based new two one three study results paper present find found however thus'.split(' '));
/** The most used words (four letters or more, common English words left out), for spotting repetition. */
export function topWords(text: string, n = 10): [string, number][] {
  const m = new Map<string, number>();
  for (const [a, b] of wordSpans(text)) {
    if (/^\[(math|ref)\]/.test(text.slice(a, b))) continue;
    const w = text.slice(a, b).toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').replace(/['’]s$/, '');
    if (w.length < 4 || STOP.has(w) || !/\p{L}/u.test(w)) continue;
    m.set(w, (m.get(w) ?? 0) + 1);
  }
  return [...m].filter(([, c]) => c > 1).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).slice(0, n);
}

/** Keywords split at commas, semicolons or new lines; each marked if it appears in the text (any case). */
export function keywords(list: string, text: string): { word: string; inText: boolean }[] {
  const low = text.toLowerCase().replace(/\s+/g, ' ');
  return list.split(/[,;\n]+/).map((k) => k.trim()).filter(Boolean).map((word) => ({ word, inText: low.includes(word.toLowerCase().replace(/\s+/g, ' ')) }));
}

/** Example limits only: journals set their own, so the page says to check the journal's guide. */
export const PRESETS: { label: string; limit: number; unit: Unit }[] = [
  { label: 'Short abstract, 150 words', limit: 150, unit: 'words' },
  { label: 'Typical article, 250 words', limit: 250, unit: 'words' },
  { label: 'Long abstract, 300 words', limit: 300, unit: 'words' },
  { label: 'Conference, 1,500 characters', limit: 1500, unit: 'chars' },
];

export const EXAMPLE = `We present a made-up survey of 1,250 faint galaxies observed with a 2.5-m telescope (e.g. in the $r$ and $i$ bands) to test whether star formation slows in their outer discs \\citep{Lovelace2021}. Using a simple two-component model, we find that the outer discs form stars 40\\% more slowly than the inner discs, with a scatter of 0.2 dex. The effect is stronger in galaxies with low gas fractions; it is weaker in groups. Fig. 3 shows that the trend holds at all masses studied by Babbage et al. (2019). These results suggest that gas supply, rather than feedback, sets the pace of star formation in galaxy outskirts. % a comment that is not counted
Our catalogue and code are public.`;
