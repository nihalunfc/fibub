// Plain text helpers for word-counter, case-converter, text-cleaner, find-replace and lorem-ipsum. No DOM.

// ---------- counting ----------
const STOP = new Set('a an the and or but of to in on at for with by from as is are was were be been it its this that these those i you he she we they my your our their not no so if then than also can will would could should have has had do does did'.split(' '));

export type Counts = { words: number; chars: number; charsNoSpaces: number; sentences: number; paragraphs: number; readMin: number; speakMin: number };

export function countText(t: string): Counts {
  const words = (t.match(/\S+/g) || []).length;
  const sentences = (t.match(/[^.!?…]+(?:[.!?…]+|$)/g) || []).filter((s) => /[\p{L}\p{N}]/u.test(s)).length;
  const paragraphs = t.split(/\n\s*\n/).filter((p) => p.trim()).length;
  return {
    words, chars: [...t].length, charsNoSpaces: [...t.replace(/\s/g, '')].length, sentences, paragraphs,
    readMin: words / 238, speakMin: words / 150,
  };
}

/** "1 min 30 sec" style. */
export function fmtMinutes(m: number): string {
  if (m <= 0) return '0 sec';
  const s = Math.round(m * 60);
  if (s < 60) return `${s} sec`;
  const mm = Math.floor(s / 60), ss = s % 60;
  return ss ? `${mm} min ${ss} sec` : `${mm} min`;
}

export function keywordDensity(t: string, top = 10, skipCommon = true): { word: string; count: number; pct: number }[] {
  const ws = (t.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).map((w) => w.replace(/^['’-]+|['’-]+$/g, '')).filter(Boolean);
  const m = new Map<string, number>();
  for (const w of ws) { if (skipCommon && (STOP.has(w) || w.length < 2)) continue; m.set(w, (m.get(w) || 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, top)
    .map(([word, count]) => ({ word, count, pct: ws.length ? (count / ws.length) * 100 : 0 }));
}

/** Index in `t` where the text goes over the limit, or -1 when within it. unit: words or chars. */
export function overLimitIndex(t: string, unit: 'words' | 'chars', limit: number): number {
  if (!(limit >= 0)) return -1;
  if (unit === 'chars') { const a = [...t]; return a.length > limit ? a.slice(0, limit).join('').length : -1; }
  let n = 0; const re = /\S+/g; let m: RegExpExecArray | null;
  while ((m = re.exec(t))) { n++; if (n > limit) return m.index; }
  return -1;
}

export const LIMITS: { id: string; label: string; unit: 'words' | 'chars'; n: number }[] = [
  { id: 'tweet', label: 'Post on X (280 characters)', unit: 'chars', n: 280 },
  { id: 'meta-title', label: 'Search page title (60 characters)', unit: 'chars', n: 60 },
  { id: 'meta-desc', label: 'Meta description (160 characters)', unit: 'chars', n: 160 },
  { id: 'sms', label: 'One text message (160 characters)', unit: 'chars', n: 160 },
  { id: 'sop250', label: 'Short statement (250 words)', unit: 'words', n: 250 },
  { id: 'sop500', label: 'Short essay (500 words)', unit: 'words', n: 500 },
  { id: 'sop650', label: 'College application essay (650 words)', unit: 'words', n: 650 },
  { id: 'sop1000', label: 'Statement of purpose (1000 words)', unit: 'words', n: 1000 },
];

// ---------- case ----------
const SMALL = new Set('a an and as at but by for if in nor of off on or per so the to up via vs yet'.split(' '));

function wordsOf(t: string): string[] {
  // split camelCase and separators into words
  return t.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2').replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

export type CaseKind = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'constant' | 'kebab' | 'alternate';

export function convertCase(t: string, kind: CaseKind): string {
  switch (kind) {
    case 'upper': return t.toUpperCase();
    case 'lower': return t.toLowerCase();
    case 'title': {
      let first = true;
      const out = t.toLowerCase().replace(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu, (w, off: number) => {
        const isFirst = first; first = false;
        const rest = t.toLowerCase().slice(off + w.length);
        const isLast = !/[\p{L}\p{N}]/u.test(rest);
        const afterBreak = /[:.!?\u2014\u2013]\s*$/.test(t.slice(0, off));
        return !isFirst && !isLast && !afterBreak && SMALL.has(w) ? w : cap(w);
      });
      return out;
    }
    case 'sentence': {
      const l = t.toLowerCase();
      return l.replace(/(^|[.!?]\s+|\n\s*)(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase()).replace(/\bi\b(?=['’ ]|[.,!?]|$)/g, 'I');
    }
    case 'camel': { const w = wordsOf(t); return w.map((x, i) => (i ? cap(x) : x.toLowerCase())).join(''); }
    case 'pascal': return wordsOf(t).map(cap).join('');
    case 'snake': return wordsOf(t).map((x) => x.toLowerCase()).join('_');
    case 'constant': return wordsOf(t).map((x) => x.toUpperCase()).join('_');
    case 'kebab': return wordsOf(t).map((x) => x.toLowerCase()).join('-');
    case 'alternate': { let i = 0; return [...t].map((c) => (/\p{L}/u.test(c) ? (i++ % 2 ? c.toUpperCase() : c.toLowerCase()) : c)).join(''); }
  }
}

// ---------- cleaner ----------
export type CleanOpts = {
  joinLines?: boolean; spaces?: boolean; blankLines?: boolean; straightQuotes?: boolean; smartQuotes?: boolean;
  hyphenation?: boolean; bullets?: boolean; numbering?: boolean; emojis?: boolean; invisible?: boolean; trim?: boolean;
};

export function cleanText(input: string, o: CleanOpts): string {
  let t = input.replace(/\r\n?/g, '\n');
  if (o.invisible) t = t.replace(/[​-‍⁠﻿­‎‏‪-‮]/g, '').replace(/[  -   　]/g, ' ').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  if (o.emojis) t = t.replace(/[\p{Extended_Pictographic}️⃣\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}]/gu, '');
  if (o.bullets) t = t.replace(/^[ \t]*[•◦▪▫●○■□‣⁃·*\-–—➢➤✓✔►▸][ \t]+/gm, '');
  if (o.numbering) t = t.replace(/^[ \t]*(?:\(?\d{1,3}[.)]|\(?[a-zA-Z][.)]|\(?[ivxIVX]{1,5}[.)])[ \t]+/gm, '');
  if (o.hyphenation) t = t.replace(/(\p{L})[-­]\n[ \t]*(\p{Ll})/gu, '$1$2');
  if (o.joinLines) {
    // single line breaks inside a paragraph become spaces; blank lines stay as paragraph breaks
    t = t.replace(/\n[ \t]*\n+/g, '\u0001').replace(/[ \t]*\n[ \t]*/g, ' ').replace(/\u0001/g, '\n\n');
  }
  if (o.straightQuotes) t = t.replace(/[‘’‚‛′]/g, "'").replace(/[“”„‟″]/g, '"');
  else if (o.smartQuotes) {
    t = t.replace(/(^|[\s(\[{—–-])"/g, '$1“').replace(/"/g, '”')
      .replace(/(^|[\s(\[{—–-])'/g, '$1‘').replace(/'/g, '’');
  }
  if (o.spaces) t = t.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/ +([,.;:!?])/g, '$1');
  if (o.blankLines) t = t.replace(/\n{3,}/g, '\n\n');
  if (o.trim) t = t.trim();
  return t;
}

// ---------- find and replace ----------
export type Pair = { find: string; replace: string };
export type FRopts = { regex: boolean; matchCase: boolean; wholeWord: boolean };
export type FRresult = { ok: boolean; error?: string; text: string; counts: number[]; total: number; segments: { text: string; hit: boolean }[] };

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildRegex(find: string, o: FRopts): RegExp {
  let src = o.regex ? find : esc(find);
  if (o.wholeWord) src = `(?<![\\p{L}\\p{N}_])(?:${src})(?![\\p{L}\\p{N}_])`;
  return new RegExp(src, 'gu' + (o.matchCase ? '' : 'i'));
}

/** Applies pairs in order. Segments describe the ORIGINAL text with hits marked by the first pair that matches (for the preview). */
export function findReplace(text: string, pairs: Pair[], o: FRopts): FRresult {
  const active = pairs.filter((p) => p.find !== '');
  const counts: number[] = [];
  let out = text;
  try {
    for (const p of active) {
      const re = buildRegex(p.find, o);
      let n = 0;
      out = out.replace(re, (...a) => {
        n++;
        if (!o.regex) return p.replace;
        const groups = a.slice(1, -2).filter((x) => typeof x === 'string' || x === undefined) as string[];
        const rawNamed = typeof a[a.length - 1] === 'object' ? a[a.length - 1] : null;
        return p.replace.replace(/\$(\$|&|\d{1,2}|<(\w+)>)/g, (_m, g: string, name?: string) => {
          if (g === '$') return '$'; if (g === '&') return a[0];
          if (name) return rawNamed?.[name] ?? '';
          const i = Number(g); return i >= 1 && i <= groups.length ? groups[i - 1] ?? '' : _m;
        });
      });
      counts.push(n);
    }
    // preview of the original: mark every match of every pair
    const marks: [number, number][] = [];
    for (const p of active) {
      const re = buildRegex(p.find, o);
      for (const m of text.matchAll(re)) if (m[0].length) marks.push([m.index!, m.index! + m[0].length]);
    }
    marks.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const segments: { text: string; hit: boolean }[] = [];
    let pos = 0;
    for (const [s, e] of marks) {
      if (s < pos) continue;
      if (s > pos) segments.push({ text: text.slice(pos, s), hit: false });
      segments.push({ text: text.slice(s, e), hit: true }); pos = e;
    }
    if (pos < text.length) segments.push({ text: text.slice(pos), hit: false });
    return { ok: true, text: out, counts, total: counts.reduce((a, b) => a + b, 0), segments };
  } catch (e) {
    return { ok: false, error: 'That pattern is not valid: ' + (e as Error).message, text, counts: [], total: 0, segments: [{ text, hit: false }] };
  }
}

// ---------- lorem ipsum ----------
const LATIN = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');
const PLAIN = 'the team met on Monday to plan the next steps for the project and every person shared what they had learned last week after a short break the group agreed on a simple schedule that works for everyone the report will be ready by Friday and the notes will go to the whole office a clear list of tasks keeps the work moving while small changes can be made along the way people can ask questions at any time and answers will be posted in the shared folder this makes it easier to see what is done and what is still open on the day of the review everything will be checked once more before it is sent out'.split(' ');
export const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

function rng(seed: number) { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

export type LoremOpts = { unit: 'paragraphs' | 'sentences' | 'words'; count: number; style: 'classic' | 'plain'; startClassic: boolean; html: boolean; seed?: number };

export function lorem(o: LoremOpts): string {
  const pool = o.style === 'classic' ? LATIN : PLAIN;
  const r = rng(o.seed ?? 7);
  const n = Math.max(1, Math.min(o.unit === 'words' ? 5000 : o.unit === 'sentences' ? 500 : 100, Math.floor(o.count) || 1));
  const word = () => pool[Math.floor(r() * pool.length)];
  let firstDone = false;
  const sentence = (): string => {
    const len = 6 + Math.floor(r() * 10);
    let ws: string[];
    if (!firstDone && o.startClassic && o.style === 'classic') { firstDone = true; return CLASSIC_START + '.'; }
    else { firstDone = true; ws = Array.from({ length: len }, word); }
    const commaAt = len > 9 ? 3 + Math.floor(r() * 3) : -1;
    let s = ws.map((w, i) => (i === commaAt ? w + ',' : w)).join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  };
  if (o.unit === 'words') {
    let ws: string[] = [];
    if (o.startClassic && o.style === 'classic') ws = CLASSIC_START.toLowerCase().replace(',', '').split(' ');
    while (ws.length < n) ws.push(word());
    ws = ws.slice(0, n);
    const s = ws.join(' ');
    const out = s.charAt(0).toUpperCase() + s.slice(1);
    return o.html ? `<p>${out}</p>` : out;
  }
  if (o.unit === 'sentences') {
    const s = Array.from({ length: n }, sentence).join(' ');
    return o.html ? `<p>${s}</p>` : s;
  }
  const ps = Array.from({ length: n }, () => Array.from({ length: 3 + Math.floor(r() * 4) }, sentence).join(' '));
  return o.html ? ps.map((p) => `<p>${p}</p>`).join('\n') : ps.join('\n\n');
}
