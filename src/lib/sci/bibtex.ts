// BibTeX cleaner: a forgiving BibTeX parser (entries, @string, @preamble, @comment, ADS exports), field clean-up,
// duplicate removal by DOI or title, journal macros such as \apj written out, capital letters protected, sorting,
// and export as a clean .bib, a formatted reference list (APA-like, numbered, AAS-like), RIS and CSL-JSON.
// Plain TypeScript, no DOM.

export type Entry = { type: string; key: string; fields: [string, string][]; line: number };
export type Parsed = { entries: Entry[]; strings: Record<string, string>; preambles: string[]; comments: number; errors: string[]; warnings: string[] };

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ---------- Parsing ----------
/** Parse BibTeX text. Values are kept as written inside their braces or quotes; @string macros and month names
 *  are filled in; `#` joins pieces. Problems are reported with line numbers and parsing carries on. */
export function parseBib(src: string): Parsed {
  const out: Parsed = { entries: [], strings: {}, preambles: [], comments: 0, errors: [], warnings: [] };
  const s = src.replace(/^﻿/, '');
  let i = 0;
  const lineAt = (p: number) => { let n = 1; for (let k = 0; k < p && k < s.length; k++) if (s.charCodeAt(k) === 10) n++; return n; };
  const ws = () => { while (i < s.length && /\s/.test(s[i])) i++; };
  const ident = () => { const m = /^[^\s"#%'(),={}]+/.exec(s.slice(i, i + 300)); if (!m) return ''; i += m[0].length; return m[0]; };
  // Read a {balanced} group starting at s[i] === '{'; returns the inside.
  const braced = (): string => {
    let depth = 0; const st = i;
    for (; i < s.length; i++) {
      const c = s[i];
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { i++; return s.slice(st + 1, i - 1); } }
    }
    throw new Error('a { is never closed');
  };
  const quoted = (): string => {
    let depth = 0; const st = ++i;
    for (; i < s.length; i++) {
      const c = s[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '"' && depth === 0) { i++; return s.slice(st, i - 1); }
    }
    throw new Error('a " is never closed');
  };
  const value = (): string => {
    const parts: string[] = [];
    for (;;) {
      ws();
      const c = s[i];
      if (c === '{') parts.push(braced());
      else if (c === '"') parts.push(quoted());
      else if (/[0-9]/.test(c ?? '')) { const m = /^[0-9]+/.exec(s.slice(i))!; parts.push(m[0]); i += m[0].length; }
      else {
        const name = ident();
        if (!name) throw new Error('a field value is missing');
        const k = name.toLowerCase();
        if (k in out.strings) parts.push(out.strings[k]);
        else if (MONTHS.includes(k)) parts.push(MONTH_NAMES[MONTHS.indexOf(k)]);
        else { out.warnings.push(`Line ${lineAt(i)}: the macro "${name}" is not defined; kept as text.`); parts.push(name); }
      }
      ws();
      if (s[i] === '#') { i++; continue; }
      return parts.join('');
    }
  };
  while (i < s.length) {
    const at = s.indexOf('@', i);
    if (at < 0) break;
    i = at + 1; ws();
    const type = ident().toLowerCase();
    ws();
    const open = s[i];
    if (!type || (open !== '{' && open !== '(')) { continue; }
    const close = open === '{' ? '}' : ')';
    const start = at;
    try {
      if (type === 'comment') { if (open === '{') braced(); else { const e = s.indexOf(')', i); i = e < 0 ? s.length : e + 1; } out.comments++; continue; }
      i++; ws();
      if (type === 'preamble') { out.preambles.push(value()); ws(); if (s[i] === close) i++; continue; }
      if (type === 'string') {
        const name = ident().toLowerCase(); ws();
        if (s[i] !== '=') throw new Error('expected = in @string');
        i++; out.strings[name] = value(); ws(); if (s[i] === close) i++; continue;
      }
      // An entry: key, then fields.
      let key = '';
      const kStart = i;
      const km = /^[^,\s{}()=]*/.exec(s.slice(i))!; key = km[0]; i += key.length; ws();
      if (s[i] === '=') { key = ''; i = kStart; } // no key: the first word was a field name
      else if (s[i] === ',') i++;
      const e: Entry = { type, key, fields: [], line: lineAt(start) };
      for (;;) {
        ws();
        if (s[i] === close) { i++; break; }
        if (s[i] === ',') { i++; continue; }
        if (i >= s.length) throw new Error('the entry is never closed');
        if (s[i] === '@') throw new Error('the entry is not closed before the next @');
        const name = ident().toLowerCase();
        if (!name) throw new Error(`unexpected "${s[i]}"`);
        ws();
        if (s[i] !== '=') throw new Error(`expected = after "${name}"`);
        i++;
        const v = value();
        if (e.fields.some(([n]) => n === name)) out.warnings.push(`Line ${e.line}: ${key || 'an entry'} has "${name}" twice; the first is kept.`);
        else e.fields.push([name, v]);
      }
      out.entries.push(e);
    } catch (err) {
      out.errors.push(`Line ${lineAt(start)}: @${type}${type === 'string' || type === 'preamble' ? '' : ' entry'} could not be read (${(err as Error).message}); it is left out.`);
      // Carry on at the next @ that starts a line.
      const nx = s.slice(start + 1).search(/\n\s*@/);
      i = nx < 0 ? s.length : start + 1 + nx + 1;
    }
  }
  return out;
}

// ---------- LaTeX to plain text ----------
const ACC: Record<string, string> = { "'": '́', '`': '̀', '^': '̂', '"': '̈', '~': '̃', '=': '̄', '.': '̇', c: '̧', v: '̌', u: '̆', r: '̊', H: '̋', k: '̨', d: '̣', b: '̱' };
const SYM: Record<string, string> = { aa: 'å', AA: 'Å', o: 'ø', O: 'Ø', ss: 'ß', ae: 'æ', AE: 'Æ', oe: 'œ', OE: 'Œ', l: 'ł', L: 'Ł', i: 'ı', j: 'ȷ', dj: 'đ', DJ: 'Đ', textendash: '–', textemdash: '—', textquoteright: '’', textquoteleft: '‘', ldots: '…', dots: '…', textregistered: '®', copyright: '©', S: '§', P: '¶', textdegree: '°', degree: '°', textasciitilde: '~', textbackslash: '\\', '&': '&', '%': '%', $: '$', '#': '#', _: '_', '{': '{', '}': '}', ' ': ' ', ',': ' ', ';': ' ', '/': '', '-': '', textunderscore: '_', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', lambda: 'λ', mu: 'μ', nu: 'ν', pi: 'π', sigma: 'σ', tau: 'τ', omega: 'ω', Omega: 'Ω', odot: '⊙', sun: '☉', sim: '~', approx: '≈', times: '×', pm: '±', le: '≤', ge: '≥', leq: '≤', geq: '≥', AA_: 'Å' };
const DROP_ARG = new Set(['textit', 'emph', 'textbf', 'textrm', 'textsc', 'textsf', 'texttt', 'mathrm', 'mathit', 'mathbf', 'mbox', 'text', 'textup', 'textnormal', 'it', 'bf', 'rm', 'em', 'sc', 'sl', 'tt', 'protect', 'url', 'href', 'NoCaseChange', 'MakeUppercase', 'ensuremath']);

/** Turn BibTeX/LaTeX text into plain Unicode: accents, special letters, dashes, braces and simple commands. */
export function latexToText(t: string): string {
  let s = t;
  // \href{url}{text} -> text
  s = s.replace(/\\href\s*\{[^{}]*\}\s*\{([^{}]*)\}/g, '$1');
  // Accents: \'{e}, \'e, {\'e}, \c{c}, \c c, \'{\i}
  const accRe = /\\(['`^"~=.]|[cvurHkdb](?![A-Za-z]))\s*(?:\{\s*(\\[ij]|[A-Za-z])\s*\}|(\\[ij](?![A-Za-z])|[A-Za-z]))/g;
  for (let n = 0; n < 3; n++) s = s.replace(accRe, (_m, a: string, b1?: string, b2?: string) => { let base = b1 ?? b2 ?? ''; if (base === '\\i') base = 'i'; if (base === '\\j') base = 'j'; return (base + ACC[a]).normalize('NFC'); });
  s = s.replace(/\\([A-Za-z]+)\s*/g, (m, name: string) => (name in SYM ? SYM[name] : DROP_ARG.has(name) ? '' : m));
  s = s.replace(/\\([&%$#_{} ,;/-])/g, (_m, c: string) => SYM[c] ?? c);
  s = s.replace(/---/g, '—').replace(/--/g, '–').replace(/``|''/g, '"').replace(/(^|[^\\])~/g, '$1 ');
  // Inline maths: keep the inside, superscripts and subscripts written plainly.
  s = s.replace(/\$([^$]*)\$/g, (_m, x: string) => x.replace(/\^\{?([^{}\s]+)\}?/g, '$1').replace(/_\{?([^{}\s]+)\}?/g, '$1'));
  s = s.replace(/\\[A-Za-z]+\*?/g, '');
  s = s.replace(/[{}]/g, '');
  return s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

// ---------- Names ----------
export type Name = { first: string; von: string; last: string; jr: string };
/** Split at top-level separators (outside braces). */
function splitTop(s: string, re: RegExp): string[] {
  const out: string[] = []; let depth = 0, cur = '';
  const words = s.split(/(\s+)/);
  // Rebuild word by word so the separator is only matched at depth 0.
  for (const w of words) {
    if (depth === 0 && re.test(w) && cur.trim()) { out.push(cur.trim()); cur = ''; continue; }
    for (const c of w) { if (c === '{') depth++; else if (c === '}') depth = Math.max(0, depth - 1); }
    cur += w;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
/** Split an author field into names at " and " (outside braces). */
export const splitAuthors = (s: string) => splitTop(s.replace(/\s+/g, ' ').trim(), /^and$/i);

function words(s: string): string[] {
  const out: string[] = []; let depth = 0, cur = '';
  for (const c of s) {
    if (c === '{') depth++; if (c === '}') depth--;
    if (depth === 0 && /[\s~]/.test(c)) { if (cur) out.push(cur); cur = ''; } else cur += c;
  }
  if (cur) out.push(cur);
  return out;
}
const commas = (s: string): string[] => { const out: string[] = []; let depth = 0, cur = ''; for (const c of s) { if (c === '{') depth++; if (c === '}') depth--; if (depth === 0 && c === ',') { out.push(cur.trim()); cur = ''; } else cur += c; } out.push(cur.trim()); return out; };
/** BibTeX's case rule: a word is lower case if its first letter (outside braces, or a special character) is. */
function isLower(w: string): boolean {
  let depth = 0;
  for (let k = 0; k < w.length; k++) {
    const c = w[k];
    if (c === '{') { depth++; if (depth === 1 && w[k + 1] === '\\') { const m = /^\{\\[A-Za-z]+|^\{\\./.exec(w.slice(k)); const rest = latexToText(w.slice(k)); return /^\p{Ll}/u.test(rest) && !!m; } continue; }
    if (c === '}') { depth--; continue; }
    if (depth === 0 && /\p{L}/u.test(c)) return /\p{Ll}/u.test(c);
  }
  return false;
}
/** One name in BibTeX's three forms: "First von Last", "von Last, First", "von Last, Jr, First". */
export function parseName(raw: string): Name {
  const p = commas(raw.trim());
  if (p.length === 1) {
    const w = words(p[0]);
    if (w.length <= 1) return { first: '', von: '', last: w[0] ?? '', jr: '' };
    let vs = -1, ve = -1;
    for (let k = 0; k < w.length - 1; k++) if (isLower(w[k])) { if (vs < 0) vs = k; ve = k; }
    if (vs < 0) return { first: w.slice(0, -1).join(' '), von: '', last: w[w.length - 1], jr: '' };
    return { first: w.slice(0, vs).join(' '), von: w.slice(vs, ve + 1).join(' '), last: w.slice(ve + 1).join(' '), jr: '' };
  }
  const vl = words(p[0]);
  let ve = -1;
  for (let k = 0; k < vl.length - 1; k++) if (isLower(vl[k])) ve = k;
  const von = vl.slice(0, ve + 1).join(' '), last = vl.slice(ve + 1).join(' ');
  const fw = (x: string) => words(x).join(' ');
  if (p.length === 2) return { first: fw(p[1]), von, last, jr: '' };
  return { first: fw(p.slice(2).join(', ')), von, last, jr: fw(p[1]) };
}
const isOthers = (n: string) => n.trim().toLowerCase() === 'others';
/** Initials from given names in plain text: "Jean-Paul Marie" -> "J.-P. M.", "J. H. J." stays. */
export function initialsOf(first: string): string {
  return first.split(/\s+/).filter(Boolean).map((w) => w.split('-').map((p) => { const ch = [...p.replace(/^[^\p{L}]+/u, '')][0]; return ch ? ch.toUpperCase() + '.' : ''; }).filter(Boolean).join('-')).join(' ');
}
type PN = { family: string; given: string; particle: string; suffix: string; literal: boolean; others: boolean };
function plainNames(field: string): PN[] {
  return splitAuthors(field).map((n) => {
    if (isOthers(n)) return { family: '', given: '', particle: '', suffix: '', literal: false, others: true };
    const nm = parseName(n);
    const literal = !nm.first && !nm.von && /^\{.*\}$/.test(nm.last) && /\s/.test(nm.last);
    return { family: latexToText(nm.last), given: latexToText(nm.first), particle: latexToText(nm.von), suffix: latexToText(nm.jr), literal, others: false };
  });
}

// ---------- Journal macros (AAS) ----------
/** AAS journal macros as used in ADS exports: macro -> [abbreviation, full name]. */
export const JOURNALS: Record<string, [string, string]> = {
  aj: ['AJ', 'The Astronomical Journal'], actaa: ['AcA', 'Acta Astronomica'], araa: ['ARA&A', 'Annual Review of Astronomy and Astrophysics'],
  apj: ['ApJ', 'The Astrophysical Journal'], apjl: ['ApJL', 'The Astrophysical Journal Letters'], apjs: ['ApJS', 'The Astrophysical Journal Supplement Series'],
  ao: ['ApOpt', 'Applied Optics'], apss: ['Ap&SS', 'Astrophysics and Space Science'], aap: ['A&A', 'Astronomy and Astrophysics'],
  aapr: ['A&A Rv', 'Astronomy and Astrophysics Review'], aaps: ['A&AS', 'Astronomy and Astrophysics Supplement Series'], azh: ['AZh', 'Astronomicheskii Zhurnal'],
  baas: ['BAAS', 'Bulletin of the American Astronomical Society'], caa: ['ChA&A', 'Chinese Astronomy and Astrophysics'], cjaa: ['ChJA&A', 'Chinese Journal of Astronomy and Astrophysics'],
  icarus: ['Icarus', 'Icarus'], jcap: ['JCAP', 'Journal of Cosmology and Astroparticle Physics'], jrasc: ['JRASC', 'Journal of the Royal Astronomical Society of Canada'],
  memras: ['MmRAS', 'Memoirs of the Royal Astronomical Society'], mnras: ['MNRAS', 'Monthly Notices of the Royal Astronomical Society'], na: ['NewA', 'New Astronomy'],
  nar: ['NewAR', 'New Astronomy Reviews'], pra: ['PhRvA', 'Physical Review A'], prb: ['PhRvB', 'Physical Review B'], prc: ['PhRvC', 'Physical Review C'],
  prd: ['PhRvD', 'Physical Review D'], pre: ['PhRvE', 'Physical Review E'], prl: ['PhRvL', 'Physical Review Letters'], pasa: ['PASA', 'Publications of the Astronomical Society of Australia'],
  pasp: ['PASP', 'Publications of the Astronomical Society of the Pacific'], pasj: ['PASJ', 'Publications of the Astronomical Society of Japan'], rmxaa: ['RMxAA', 'Revista Mexicana de Astronomía y Astrofísica'],
  qjras: ['QJRAS', 'Quarterly Journal of the Royal Astronomical Society'], skytel: ['S&T', 'Sky and Telescope'], solphys: ['SoPh', 'Solar Physics'], sovast: ['Soviet Ast.', 'Soviet Astronomy'],
  ssr: ['SSRv', 'Space Science Reviews'], zap: ['ZA', 'Zeitschrift für Astrophysik'], nat: ['Nature', 'Nature'], iaucirc: ['IAU Circ.', 'IAU Circulars'],
  aplett: ['Astrophys. Lett.', 'Astrophysics Letters'], apspr: ['Astrophys. Space Phys. Res.', 'Astrophysics Space Physics Research'], bain: ['BAN', 'Bulletin of the Astronomical Institutes of the Netherlands'],
  fcp: ['Fund. Cosmic Phys.', 'Fundamentals of Cosmic Physics'], gca: ['GeoCoA', 'Geochimica et Cosmochimica Acta'], grl: ['Geophys. Res. Lett.', 'Geophysical Research Letters'],
  jcp: ['JChPh', 'The Journal of Chemical Physics'], jgr: ['J. Geophys. Res.', 'Journal of Geophysical Research'], jqsrt: ['JQSRT', 'Journal of Quantitative Spectroscopy and Radiative Transfer'],
  memsai: ['MmSAI', 'Memorie della Società Astronomica Italiana'], nphysa: ['NuPhA', 'Nuclear Physics A'], physrep: ['PhR', 'Physics Reports'], physscr: ['PhyS', 'Physica Scripta'],
  planss: ['Planet. Space Sci.', 'Planetary and Space Science'], procspie: ['Proc. SPIE', 'Proceedings of the SPIE'], psj: ['PSJ', 'The Planetary Science Journal'],
};
const bibEsc = (s: string) => s.replace(/(?<!\\)&/g, '\\&');

// ---------- Cleaning ----------
export type CleanOptions = {
  journals: 'keep' | 'abbrev' | 'full';
  protect: 'none' | 'acronyms' | 'all';
  unwrapTitle: boolean;
  pages: boolean;
  doi: boolean;
  dedupe: boolean;
  drop: string[];
  sort: 'none' | 'key' | 'author' | 'year';
  keys: boolean; // make keys for entries without one
};
export const DEFAULTS: CleanOptions = { journals: 'abbrev', protect: 'acronyms', unwrapTitle: true, pages: true, doi: true, dedupe: true, drop: ['abstract', 'file', 'keywords', 'adsnote'], sort: 'none', keys: true };
export type Change = { key: string; what: string };
export type Cleaned = { entries: Entry[]; changes: Change[]; removed: { key: string; keptAs: string; why: string }[]; warnings: string[] };

const get = (e: Entry, f: string) => e.fields.find(([n]) => n === f)?.[1];
const set = (e: Entry, f: string, v: string) => { const k = e.fields.findIndex(([n]) => n === f); if (k >= 0) e.fields[k] = [f, v]; else e.fields.push([f, v]); };
const del = (e: Entry, f: string) => { e.fields = e.fields.filter(([n]) => n !== f); };

/** Does the text start and end with one brace pair that wraps all of it? */
function wrapped(s: string): boolean {
  if (!s.startsWith('{') || !s.endsWith('}')) return false;
  let depth = 0;
  for (let k = 0; k < s.length; k++) { if (s[k] === '{') depth++; else if (s[k] === '}') { depth--; if (depth === 0 && k < s.length - 1) return false; } }
  return true;
}
/** Wrap words that must keep their capitals in braces. "acronyms": words with a capital after the first letter
 *  (DNA, pH, ApJ, CO2, GaN). "all": also every capitalised word after the first. Parts already in braces and
 *  maths are left alone. */
export function protectCaps(title: string, mode: 'none' | 'acronyms' | 'all'): string {
  if (mode === 'none') return title;
  let out = '', depth = 0, k = 0, first = true, inMath = false;
  while (k < title.length) {
    const c = title[k];
    if (c === '\\' && depth === 0) { const m = /^\\([A-Za-z]+|.)/.exec(title.slice(k))!; out += m[0]; k += m[0].length; first = false; continue; }
    if (c === '$') { inMath = !inMath; out += c; k++; continue; }
    if (c === '{') { depth++; out += c; k++; continue; }
    if (c === '}') { depth--; out += c; k++; first = false; continue; }
    if (depth > 0 || inMath) { out += c; k++; continue; }
    const m = /^[\p{L}\p{N}][\p{L}\p{N}'’-]*/u.exec(title.slice(k));
    if (!m) { out += c; k++; continue; }
    const w = m[0];
    const inner = [...w].slice(1).some((ch) => /\p{Lu}/u.test(ch));
    const cap = /^\p{Lu}/u.test(w);
    const afterColon = /[:.?!]\s*$/.test(out);
    if (inner || (mode === 'all' && cap && !first && !afterColon)) out += `{${w}}`;
    else out += w;
    first = false; k += w.length;
  }
  return out;
}

const normTitle = (t: string) => latexToText(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const normDoi = (d: string) => d.trim().replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, '').toLowerCase();
const firstFamily = (e: Entry) => { const a = get(e, 'author') ?? get(e, 'editor'); if (!a) return ''; const n = plainNames(a)[0]; return n ? n.family.toLowerCase() : ''; };
const yearOf = (e: Entry) => { const y = get(e, 'year') ?? ''; const m = /\d{4}/.exec(latexToText(y)); return m ? Number(m[0]) : NaN; };

/** Clean entries (a copy; the parsed entries are not changed). */
export function cleanEntries(input: Entry[], o: CleanOptions): Cleaned {
  const raw: { e: Entry; what: string }[] = [], warnings: string[] = [], removed: Cleaned['removed'] = [];
  let entries: Entry[] = input.map((e) => ({ ...e, fields: e.fields.map(([n, v]) => [n, v] as [string, string]) }));
  for (const e of entries) {
    const note = (what: string) => raw.push({ e, what });
    // biblatex names to BibTeX ones when the BibTeX field is missing.
    if (get(e, 'journaltitle') !== undefined && get(e, 'journal') === undefined) { set(e, 'journal', get(e, 'journaltitle')!); del(e, 'journaltitle'); note('journaltitle → journal'); }
    if (get(e, 'date') !== undefined && get(e, 'year') === undefined) { const m = /^(\d{4})(?:-(\d{1,2}))?/.exec(get(e, 'date')!.trim()); if (m) { set(e, 'year', m[1]); if (m[2] && get(e, 'month') === undefined) set(e, 'month', MONTH_NAMES[Number(m[2]) - 1] ?? ''); del(e, 'date'); note('date → year and month'); } }
    for (const [n, v] of [...e.fields]) {
      const t = v.replace(/\s+/g, ' ').trim();
      if (!t || t === '{}') { del(e, n); note(`empty ${n} removed`); continue; }
      if (o.drop.includes(n)) { del(e, n); note(`${n} removed`); continue; }
      if (t !== v) set(e, n, t);
    }
    // Journal macros such as \apj.
    const j = get(e, 'journal');
    if (j !== undefined && o.journals !== 'keep') {
      const m = /^\s*\{?\s*\\([A-Za-z]+)\s*\}?\s*$/.exec(j);
      if (m && JOURNALS[m[1].toLowerCase()]) { const name = JOURNALS[m[1].toLowerCase()][o.journals === 'abbrev' ? 0 : 1]; set(e, 'journal', bibEsc(name)); note(`journal \\${m[1]} → ${name}`); }
      else if (m) warnings.push(`${e.key}: the journal macro \\${m[1]} is not in the list; write the name by hand.`);
    }
    // Pages: 12-15, 12 – 15 -> 12--15.
    const p = get(e, 'pages');
    if (p !== undefined && o.pages) { const q = p.replace(/\s*(?:-+|–|—|\\textendash\s*\{?\}?)\s*/g, '--'); if (q !== p) { set(e, 'pages', q); note('pages dash'); } }
    // Month: names or numbers -> three-letter macro.
    const mo = get(e, 'month');
    if (mo !== undefined) {
      const t = latexToText(mo).toLowerCase();
      const k = /^\d{1,2}$/.test(t) ? Number(t) - 1 : MONTHS.findIndex((x) => t.startsWith(x));
      if (k >= 0 && k < 12) set(e, 'month', `@${MONTHS[k]}`); else warnings.push(`${e.key}: month "${mo}" not understood; kept as written.`);
    }
    const d = get(e, 'doi');
    if (d !== undefined && o.doi) { const q = d.trim().replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, ''); if (q !== d) { set(e, 'doi', q); note('doi prefix removed'); } }
    const y = get(e, 'year');
    if (y !== undefined && !/^\d{4}[a-z]?$/.test(latexToText(y))) warnings.push(`${e.key}: year "${y}" is not a four-digit year.`);
    // Titles: drop braces around the whole title, then protect capitals.
    for (const f of ['title', 'booktitle']) {
      let t = get(e, f);
      if (t === undefined) continue;
      const before = t;
      if (o.unwrapTitle) while (wrapped(t)) t = t.slice(1, -1);
      t = protectCaps(t, o.protect);
      if (t !== before) { set(e, f, t); note(`${f} capitals`); }
    }
    for (const req of e.type === 'article' ? ['author', 'title', 'journal', 'year'] : e.type === 'book' ? ['title', 'year'] : ['title']) if (get(e, req) === undefined && !(req === 'author' && get(e, 'editor'))) warnings.push(`${e.key || `Entry on line ${e.line}`}: no ${req}.`);
  }
  // Keys: make missing ones, rename repeats.
  const used = new Set<string>();
  for (const e of entries) {
    if (!e.key && o.keys) { e.key = `${(firstFamily(e) || 'anon').normalize('NFD').replace(/[^A-Za-z]/g, '')}${Number.isFinite(yearOf(e)) ? yearOf(e) : ''}` || 'entry'; raw.push({ e, what: `key made for the entry on line ${e.line}` }); }
    if (used.has(e.key) && !o.dedupe) { let s = 'b', k = e.key + s; while (used.has(k)) { s = String.fromCharCode(s.charCodeAt(0) + 1); k = e.key + s; } warnings.push(`Key ${e.key} is used twice; the second (line ${e.line}) is now ${k}. Update \\cite commands.`); e.key = k; }
    used.add(e.key);
  }
  // Duplicates: same DOI, or same title and first author. The fuller entry is kept and gains missing fields.
  if (o.dedupe) {
    const kept: Entry[] = [];
    for (const e of entries) {
      const dd = get(e, 'doi'), tt = get(e, 'title');
      let why = '';
      const twin = kept.find((k) => {
        const kd = get(k, 'doi');
        if (dd && kd) { why = 'same DOI'; return normDoi(dd) === normDoi(kd); }
        const kt = get(k, 'title');
        why = 'same title and first author';
        return !!(tt && kt && normTitle(tt).length > 8 && normTitle(tt) === normTitle(kt) && firstFamily(k) === firstFamily(e));
      });
      if (!twin) {
        if (e.key && kept.some((k) => k.key === e.key)) { let s = 'b', k = e.key + s; while (kept.some((x) => x.key === k)) { s = String.fromCharCode(s.charCodeAt(0) + 1); k = e.key + s; } warnings.push(`Key ${e.key} is used by two different entries; the second (line ${e.line}) is now ${k}. Update \\cite commands.`); e.key = k; }
        kept.push(e); continue;
      }
      const [keep, drop] = e.fields.length > twin.fields.length ? [e, twin] : [twin, e];
      for (const [n, v] of drop.fields) if (get(keep, n) === undefined) keep.fields.push([n, v]);
      if (keep === e) kept[kept.indexOf(twin)] = e;
      removed.push({ key: drop.key, keptAs: keep.key, why });
    }
    entries = kept;
  }
  const cmp = (a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base' });
  if (o.sort === 'key') entries.sort((a, b) => cmp(a.key, b.key));
  if (o.sort === 'author') entries.sort((a, b) => cmp(firstFamily(a), firstFamily(b)) || (yearOf(a) || 0) - (yearOf(b) || 0) || cmp(a.key, b.key));
  if (o.sort === 'year') entries.sort((a, b) => (yearOf(a) || 0) - (yearOf(b) || 0) || cmp(firstFamily(a), firstFamily(b)));
  const changes: Change[] = raw.map(({ e, what }) => ({ key: e.key || `line ${e.line}`, what }));
  return { entries, changes, removed, warnings };
}

// ---------- Writing BibTeX ----------
export function writeBib(entries: Entry[], preambles: string[] = []): string {
  const out: string[] = preambles.map((p) => `@preamble{{${p}}}`);
  for (const e of entries) {
    const w = Math.max(0, ...e.fields.map(([n]) => n.length));
    const lines = e.fields.map(([n, v]) => `  ${n.padEnd(w)} = ${v.startsWith('@') && MONTHS.includes(v.slice(1)) ? v.slice(1) : `{${v}}`}`);
    out.push(`@${e.type}{${e.key},\n${lines.join(',\n')}\n}`);
  }
  return out.join('\n\n') + '\n';
}

// ---------- Formatted references ----------
export type Ref = { key: string; type: string; names: PN[]; editors: PN[]; title: string; container: string; year: string; month: number; volume: string; issue: string; pages: string; publisher: string; doi: string; url: string; eprint: string; note: string; isbn: string; issn: string; school: string };
const txt = (e: Entry, f: string) => { const v = get(e, f); return v === undefined ? '' : v.startsWith('@') ? v.slice(1) : latexToText(v); };
export function toRef(e: Entry): Ref {
  const mo = get(e, 'month');
  const month = mo?.startsWith('@') ? MONTHS.indexOf(mo.slice(1)) + 1 : 0;
  return {
    key: e.key, type: e.type, names: get(e, 'author') ? plainNames(get(e, 'author')!) : [], editors: get(e, 'editor') ? plainNames(get(e, 'editor')!) : [],
    title: txt(e, 'title'), container: txt(e, 'journal') || txt(e, 'booktitle') || txt(e, 'series'), year: txt(e, 'year'), month,
    volume: txt(e, 'volume'), issue: txt(e, 'number') || txt(e, 'issue'), pages: txt(e, 'pages') || txt(e, 'eid'), publisher: txt(e, 'publisher') || txt(e, 'institution') || txt(e, 'organization'),
    doi: (get(e, 'doi') ?? '').trim().replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, ''), url: (get(e, 'url') ?? '').trim(), eprint: txt(e, 'eprint'), note: txt(e, 'note'), isbn: txt(e, 'isbn'), issn: txt(e, 'issn'), school: txt(e, 'school'),
  };
}
const full = (n: PN) => (n.literal ? n.family : [n.particle, n.family].filter(Boolean).join(' '));
const famInit = (n: PN) => (n.literal ? n.family : `${full(n)}${n.given ? `, ${initialsOf(n.given)}` : ''}${n.suffix ? `, ${n.suffix}` : ''}`);
const initFam = (n: PN) => (n.literal ? n.family : `${n.given ? initialsOf(n.given) + ' ' : ''}${full(n)}${n.suffix ? `, ${n.suffix}` : ''}`);
const endDot = (s: string) => (/[.?!]$/.test(s) ? s : s + '.');

export type Styled = { text: string; html: string };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const I = (s: string) => ({ t: s, h: `<i>${esc(s)}</i>` });
const T = (s: string) => ({ t: s, h: esc(s) });
const join = (parts: { t: string; h: string }[]): Styled => ({ text: parts.map((p) => p.t).join(''), html: parts.map((p) => p.h).join('') });

/** APA-like (7th edition shape): Family, I., & Family, I. (Year). Title. Journal, Vol(Issue), pages. https://doi.org/... */
export function apa(r: Ref): Styled {
  const ns = r.names.filter((n) => !n.others), more = r.names.some((n) => n.others);
  let au = '';
  if (ns.length) {
    const xs = ns.map(famInit);
    if (more) au = `${xs.slice(0, 19).join(', ')}, et al.`;
    else au = xs.length === 1 ? xs[0] : xs.length <= 20 ? `${xs.slice(0, -1).join(', ')}, & ${xs[xs.length - 1]}` : `${xs.slice(0, 19).join(', ')}, … ${xs[xs.length - 1]}`;
  }
  const year = r.year ? `(${r.year}).` : '(n.d.).';
  const parts = [T(au ? `${endDot(au)} ${year} ` : `${year} `)];
  const doi = r.doi ? ` https://doi.org/${r.doi}` : r.url ? ` ${r.url}` : '';
  if (r.type === 'article') {
    parts.push(T(`${endDot(r.title)} `));
    if (r.container) parts.push(I(r.container));
    if (r.volume) parts.push(T(', '), I(r.volume));
    if (r.issue) parts.push(T(`(${r.issue})`));
    if (r.pages) parts.push(T(`, ${r.pages.replace('--', '–')}`));
    parts.push(T('.' + doi));
  } else if (r.type === 'book') {
    parts.push(I(endDot(r.title)), T(r.publisher ? ` ${endDot(r.publisher)}` : ''), T(doi));
  } else if (r.container) {
    parts.push(T(`${endDot(r.title)} In `), I(r.container), T(r.pages ? ` (pp. ${r.pages.replace('--', '–')})` : ''), T(`.${r.publisher ? ` ${endDot(r.publisher)}` : ''}${doi}`));
  } else {
    parts.push(I(endDot(r.title)), T(`${r.school || r.publisher ? ` ${endDot(r.school || r.publisher)}` : ''}${r.eprint && !doi ? ` arXiv:${r.eprint}` : ''}${doi}`));
  }
  return join(parts);
}
/** Numbered, IEEE-like: A. Family, B. Family, and C. Family, "Title," Journal, vol. 1, no. 2, pp. 3–4, Year, doi: ... */
export function numbered(r: Ref, n: number): Styled {
  const ns = r.names.filter((x) => !x.others), more = r.names.some((x) => x.others);
  const xs = ns.map(initFam);
  const au = xs.length > 6 ? `${xs[0]} et al.` : more ? `${xs.join(', ')} et al.` : xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')}, and ${xs[xs.length - 1]}`;
  const parts = [T(`[${n}] ${au ? au + ', ' : ''}`)];
  if (r.type === 'book') parts.push(I(r.title), T(r.publisher ? `. ${r.publisher}` : ''), T(r.year ? `, ${r.year}` : ''));
  else {
    parts.push(T(`“${r.title},” `));
    if (r.container) parts.push(...(r.type === 'article' ? [] : [T('in ')]), I(r.container), T(', '));
    if (r.volume) parts.push(T(`vol. ${r.volume}, `));
    if (r.issue) parts.push(T(`no. ${r.issue}, `));
    if (r.pages) parts.push(T(`${/[-–]/.test(r.pages) ? 'pp.' : 'p.'} ${r.pages.replace('--', '–')}, `));
    if (r.year) parts.push(T(`${r.month ? MONTH_NAMES[r.month - 1].slice(0, 3) + '. ' : ''}${r.year}`));
  }
  parts.push(T(r.doi ? `, doi: ${r.doi}.` : '.'));
  const out = join(parts);
  return { text: out.text.replace(/, \./, '.').replace(/,\s*,/g, ','), html: out.html.replace(/, \./, '.').replace(/,\s*,/g, ',') };
}
/** AAS-like: Family, I., Family, I., & Family, I. Year, Journal, Vol, first page, doi: ... (no titles). */
export function aas(r: Ref): Styled {
  const ns = r.names.filter((x) => !x.others), more = r.names.some((x) => x.others);
  const xs = ns.map(famInit);
  const au = xs.length > 5 ? `${xs[0]}, et al.` : more ? `${xs.join(', ')}, et al.` : xs.length <= 1 ? xs.join('') : xs.length === 2 ? `${xs[0]}, & ${xs[1]}` : `${xs.slice(0, -1).join(', ')}, & ${xs[xs.length - 1]}`;
  const first = r.pages.split(/--|–|-/)[0];
  const bits = [au ? au + ' ' + (r.year || '') : r.year];
  if (r.type === 'article') { if (r.container) bits.push(r.container); if (r.volume) bits.push(r.volume); if (first) bits.push(first); }
  else { if (r.title) bits.push(r.title); if (r.container) bits.push(r.container); if (r.publisher) bits.push(r.publisher); }
  if (r.doi) bits.push(`doi: ${r.doi}`);
  else if (r.eprint) bits.push(`arXiv:${r.eprint}`);
  const s = bits.filter(Boolean).join(', ');
  return { text: s, html: esc(s) };
}
const sortKey = (r: Ref) => `${r.names[0] ? full(r.names[0]).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() : r.title.toLowerCase()}\u0000${r.year}`;
export function referenceList(entries: Entry[], style: 'apa' | 'numbered' | 'aas'): Styled[] {
  const refs = entries.map(toRef);
  if (style === 'numbered') return refs.map((r, k) => numbered(r, k + 1));
  const sorted = [...refs].sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'en'));
  return sorted.map(style === 'apa' ? apa : aas);
}

// ---------- RIS and CSL-JSON ----------
const RIS_TYPE: Record<string, string> = { article: 'JOUR', book: 'BOOK', inproceedings: 'CPAPER', conference: 'CPAPER', proceedings: 'CONF', incollection: 'CHAP', inbook: 'CHAP', phdthesis: 'THES', mastersthesis: 'THES', techreport: 'RPRT', misc: 'GEN', unpublished: 'UNPB', online: 'ELEC', electronic: 'ELEC', manual: 'GEN', booklet: 'PAMP' };
export function toRIS(entries: Entry[]): string {
  const out: string[] = [];
  for (const e of entries) {
    const r = toRef(e);
    const L = (tag: string, v: string) => { if (v) out.push(`${tag}  - ${v}`); };
    L('TY', RIS_TYPE[e.type] ?? 'GEN');
    for (const n of r.names) if (!n.others) L('AU', n.literal ? n.family : `${full(n)}${n.given ? ', ' + n.given : ''}${n.suffix ? ', ' + n.suffix : ''}`);
    for (const n of r.editors) if (!n.others) L('ED', n.literal ? n.family : `${full(n)}${n.given ? ', ' + n.given : ''}`);
    L('TI', r.title);
    if (e.type === 'article') L('JO', r.container); else L('T2', r.container);
    L('PY', r.year);
    L('VL', r.volume); L('IS', r.issue);
    const [sp, ep] = r.pages.split(/--|–|-/);
    L('SP', sp ?? ''); L('EP', ep ?? '');
    L('PB', r.publisher || r.school); L('SN', r.isbn || r.issn);
    L('DO', r.doi); L('UR', r.url);
    if (get(e, 'abstract')) L('AB', txt(e, 'abstract'));
    if (get(e, 'keywords')) for (const k of txt(e, 'keywords').split(/[,;]/)) L('KW', k.trim());
    L('ID', e.key);
    out.push('ER  - ', '');
  }
  return out.join('\r\n');
}
const CSL_TYPE: Record<string, string> = { article: 'article-journal', book: 'book', inproceedings: 'paper-conference', conference: 'paper-conference', proceedings: 'book', incollection: 'chapter', inbook: 'chapter', phdthesis: 'thesis', mastersthesis: 'thesis', techreport: 'report', misc: 'document', unpublished: 'manuscript', online: 'webpage', electronic: 'webpage', manual: 'report', booklet: 'pamphlet' };
export function toCSL(entries: Entry[]): object[] {
  return entries.map((e) => {
    const r = toRef(e);
    const person = (n: PN) => (n.literal ? { literal: n.family } : { family: n.family, ...(n.given ? { given: n.given } : {}), ...(n.particle ? { 'non-dropping-particle': n.particle } : {}), ...(n.suffix ? { suffix: n.suffix } : {}) });
    const o: Record<string, unknown> = { id: e.key, type: CSL_TYPE[e.type] ?? 'document' };
    if (r.names.length) o.author = r.names.filter((n) => !n.others).map(person);
    if (r.editors.length) o.editor = r.editors.filter((n) => !n.others).map(person);
    if (r.title) o.title = r.title;
    if (r.container) o['container-title'] = r.container;
    const y = Number(/\d{4}/.exec(r.year)?.[0]);
    if (y) o.issued = { 'date-parts': [r.month ? [y, r.month] : [y]] };
    if (r.volume) o.volume = r.volume;
    if (r.issue) o.issue = r.issue;
    if (r.pages) o.page = r.pages.replace(/--|–/g, '-');
    if (r.publisher || r.school) o.publisher = r.publisher || r.school;
    if (r.doi) o.DOI = r.doi;
    if (r.url) o.URL = r.url;
    if (r.isbn) o.ISBN = r.isbn;
    if (r.issn) o.ISSN = r.issn;
    if (r.note) o.note = r.note;
    return o;
  });
}

export const EXAMPLE = `% A made-up reference list in the shape of an ADS export, with the usual problems.
@string{lab = "Example Press"}

@ARTICLE{2021ApJ...900...12L,
       author = {{Lovelace}, Ada and {Babbage}, Charles and {van der Berg}, Mira},
        title = "{Faint HII regions in the outer disk of a made-up galaxy}",
      journal = {\\apj},
     keywords = {Astrophysics - Astrophysics of Galaxies},
         year = 2021,
        month = mar,
       volume = {900},
        pages = {12-20},
          doi = {10.5555/example.0001},
       adsurl = {https://ui.adsabs.harvard.edu/abs/2021ApJ...900...12L},
      adsnote = {Provided by the SAO/NASA Astrophysics Data System}
}

@article{lovelace2021,
  title   = {Faint {HII} Regions in the Outer Disk of a Made-up Galaxy},
  author  = {Lovelace, A. and Babbage, C. and van der Berg, M.},
  journal = {The Astrophysical Journal},
  year    = {2021},
  doi     = {https://doi.org/10.5555/EXAMPLE.0001}
}

@ARTICLE{2019MNRAS.480.1234N,
       author = {{N{\\'u}{\\~n}ez-Garc{\\'\\i}a}, Jos{\\'e} and {M{\\"u}ller}, J{\\"o}rg and others},
        title = "{The DNA of star formation: a toy model with CO and pH-like tracers}",
      journal = {\\mnras},
         year = 2019,
        month = jan,
       volume = {480},
       number = {2},
        pages = {1234--1250},
          doi = {10.5555/example.0002},
     abstract = {A made-up abstract.}
}

@book{babbage2018,
  author    = {Charles Babbage},
  title     = {Engines of Calculation},
  publisher = lab,
  year      = 2018
}

@inproceedings{
  title     = {A conference talk with no key},
  author    = {Smith, Jr., John and Doe, Jane},
  booktitle = {Proceedings of the Example Workshop},
  pages     = {5 - 9},
  year      = {2020}
}
`;
