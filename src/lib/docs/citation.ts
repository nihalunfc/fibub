// Citation formatting for #1773. Plain TypeScript, no DOM.
// The rules below are written from the published style rules (author order, punctuation, which parts are
// italic or quoted). Italic text is marked with * ... * in the strings returned.

export type SrcType = 'book' | 'article' | 'chapter' | 'website' | 'report';
export type StyleId = 'apa' | 'mla' | 'chicago-ad' | 'chicago-note' | 'harvard' | 'ieee';

export interface Src {
  type: SrcType;
  authors: string[]; // one per line: "Family, Given" or an organisation name (no comma)
  editors: string[];
  year: string;
  month: number; // 0 = none
  day: number; // 0 = none
  title: string;
  container: string; // journal, book title or website name
  volume: string;
  issue: string;
  pages: string;
  publisher: string;
  place: string;
  edition: string; // "2" or "2nd"
  reportNo: string;
  doi: string;
  url: string;
  accessed: string; // yyyy-mm-dd or ''
  pageCited: string; // for Chicago notes
}

export const STYLES: { id: StyleId; name: string }[] = [
  { id: 'apa', name: 'APA 7' },
  { id: 'mla', name: 'MLA 9' },
  { id: 'chicago-ad', name: 'Chicago author-date' },
  { id: 'chicago-note', name: 'Chicago notes and bibliography' },
  { id: 'harvard', name: 'Harvard' },
  { id: 'ieee', name: 'IEEE' },
];

export const TYPES: { id: SrcType; name: string }[] = [
  { id: 'book', name: 'Book' },
  { id: 'article', name: 'Journal article' },
  { id: 'chapter', name: 'Chapter in an edited book' },
  { id: 'website', name: 'Web page' },
  { id: 'report', name: 'Report' },
];

export const emptySrc = (type: SrcType = 'book'): Src => ({
  type, authors: [], editors: [], year: '', month: 0, day: 0, title: '', container: '', volume: '', issue: '',
  pages: '', publisher: '', place: '', edition: '', reportNo: '', doi: '', url: '', accessed: '', pageCited: '',
});

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MLA_M = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const IEEE_M = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

// ---------- names ----------
export interface Name { family: string; given: string; org: boolean }
export function parseName(line: string): Name | null {
  const s = line.trim().replace(/\s+/g, ' ');
  if (!s) return null;
  const i = s.indexOf(',');
  if (i < 0) return { family: s, given: '', org: true };
  return { family: s.slice(0, i).trim(), given: s.slice(i + 1).trim(), org: false };
}
export const parseNames = (lines: string[]): Name[] => lines.map(parseName).filter((n): n is Name => !!n);

const initial = (tok: string) => tok.split('-').filter(Boolean).map((p) => p[0].toUpperCase() + '.').join('-');
export function initialsOf(given: string, spaced: boolean): string {
  const t = given.split(/\s+/).filter(Boolean).map(initial);
  return t.join(spaced ? ' ' : '');
}
const inverted = (n: Name) => (n.org || !n.given ? n.family : `${n.family}, ${n.given}`);
const direct = (n: Name) => (n.org || !n.given ? n.family : `${n.given} ${n.family}`);
const famInit = (n: Name, spaced: boolean) => (n.org || !n.given ? n.family : `${n.family}, ${initialsOf(n.given, spaced)}`);
const initFam = (n: Name) => (n.org || !n.given ? n.family : `${initialsOf(n.given, true)} ${n.family}`);

// ---------- small helpers ----------
const endDot = (s: string) => (s && !/[.?!]$/.test(s.replace(/\*+$/, '')) ? s + '.' : s);
const it = (s: string) => (s ? `*${s.replace(/\*/g, '')}*` : '');
const clean = (s: string) =>
  s.replace(/\s+/g, ' ').replace(/\.\.(?=\s|$)/g, '.').replace(/\?\.(?=\s|$)/g, '?').replace(/!\.(?=\s|$)/g, '!').replace(/,\s*,/g, ',').replace(/\s+([,.;:])/g, '$1').replace(/\s+\)/g, ')').trim();
const join = (parts: (string | false | undefined | null)[], sep = ' ') => parts.filter((p) => !!p).join(sep);

export function normDoi(d: string): string {
  return d.trim().replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, '');
}
const doiUrl = (d: string) => (normDoi(d) ? 'https://doi.org/' + normDoi(d) : '');
const link = (s: Src) => doiUrl(s.doi) || s.url.trim();
const noProto = (u: string) => u.replace(/^https?:\/\//i, '').replace(/\/$/, '');

export function ordinal(e: string): string {
  const t = e.trim();
  if (!t) return '';
  if (/^\d+$/.test(t)) { const n = +t; if (n <= 1) return ''; const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th'; return n + s + ' ed.'; }
  return /ed\.?$|edition$/i.test(t) ? t.replace(/edition$/i, 'ed.') : t + ' ed.';
}
const ed7 = (e: string) => ordinal(e).replace(/ ed\.$/, ' ed.');

function pageParts(p: string): [string, string] {
  const m = p.trim().split(/\s*[-–—]+\s*/).filter(Boolean);
  return [m[0] || '', m[1] || ''];
}
function pagesText(p: string, dash: string, label: boolean): string {
  const [a, b] = pageParts(p);
  if (!a) return '';
  if (!b) return label ? `p. ${a}` : a;
  return (label ? 'pp. ' : '') + a + dash + b;
}

function dateParts(s: Src) { return { y: s.year.trim(), m: s.month, d: s.day }; }
function longDate(s: Src): string { const { y, m, d } = dateParts(s); return m ? `${MONTHS[m - 1]}${d ? ' ' + d : ''}${y ? (d ? ', ' : ' ') + y : ''}` : y; }
function accessedParts(a: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(a.trim());
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

// ---------- author lists ----------
function listAPA(ns: Name[]): string {
  const f = ns.map((n) => famInit(n, true));
  if (f.length <= 1) return f[0] || '';
  if (f.length > 20) return f.slice(0, 19).join(', ') + ', . . . ' + f[f.length - 1];
  return f.slice(0, -1).join(', ') + ', & ' + f[f.length - 1];
}
function listMLA(ns: Name[]): string {
  if (!ns.length) return '';
  if (ns.length >= 3) return inverted(ns[0]) + ', et al.';
  if (ns.length === 2) return `${inverted(ns[0])}, and ${direct(ns[1])}`;
  return inverted(ns[0]);
}
function listChicagoBib(ns: Name[]): string {
  const x = ns.length > 10 ? ns.slice(0, 7) : ns;
  const f = x.map((n, i) => (i === 0 ? inverted(n) : direct(n)));
  if (ns.length > 10) return f.join(', ') + ', et al.';
  if (f.length <= 1) return f[0] || '';
  if (f.length === 2) return `${f[0]}, and ${f[1]}`;
  return f.slice(0, -1).join(', ') + ', and ' + f[f.length - 1];
}
function listChicagoNote(ns: Name[]): string {
  if (!ns.length) return '';
  if (ns.length > 3) return direct(ns[0]) + ' et al.';
  const f = ns.map(direct);
  if (f.length === 1) return f[0];
  if (f.length === 2) return `${f[0]} and ${f[1]}`;
  return f.slice(0, -1).join(', ') + ', and ' + f[f.length - 1];
}
function listHarvard(ns: Name[]): string {
  if (ns.length > 3) return famInit(ns[0], false) + ' et al.';
  const f = ns.map((n) => famInit(n, false));
  if (f.length <= 1) return f[0] || '';
  return f.slice(0, -1).join(', ') + ' and ' + f[f.length - 1];
}
function listIEEE(ns: Name[]): string {
  if (ns.length > 6) return initFam(ns[0]) + ' et al.';
  const f = ns.map(initFam);
  if (f.length <= 1) return f[0] || '';
  if (f.length === 2) return `${f[0]} and ${f[1]}`;
  return f.slice(0, -1).join(', ') + ', and ' + f[f.length - 1];
}
// editors, first name first
function editorsList(ns: Name[], style: 'apa' | 'plain' | 'harvard' | 'ieee'): string {
  const f = ns.map((n) => (style === 'plain' ? direct(n) : initFam(n)));
  if (f.length <= 1) return f[0] || '';
  if (f.length === 2) return style === 'apa' ? `${f[0]} & ${f[1]}` : `${f[0]} and ${f[1]}`;
  if (style === 'apa') return f.slice(0, -1).join(', ') + ', & ' + f[f.length - 1];
  if (style === 'plain' && f.length > 3) return f[0] + ' et al.';
  return f.slice(0, -1).join(', ') + ', and ' + f[f.length - 1];
}

// ---------- the six styles ----------
function apa(s: Src): string[] {
  const au = parseNames(s.authors), eds = parseNames(s.editors);
  const web = s.type === 'website';
  const dp = `(${s.year.trim() ? s.year.trim() + (web && s.month ? ', ' + MONTHS[s.month - 1] + (s.day ? ' ' + s.day : '') : '') : 'n.d.'})`;
  const ed = ordinal(s.edition);
  const rep = s.reportNo ? ` (Report No. ${s.reportNo.trim()})` : '';
  let title = '';
  if (s.type === 'book') title = it(s.title) + (ed ? ` (${ed})` : '');
  else if (s.type === 'article' || s.type === 'chapter') title = s.title;
  else if (web) title = it(s.title);
  else title = it(s.title) + rep;
  const head = au.length ? `${endDot(listAPA(au))} ${dp}. ${endDot(title)}` : `${endDot(title)} ${dp}.`;
  const orgAuthor = au.length === 1 && au[0].org ? au[0].family.toLowerCase() : '';
  let body = '';
  if (s.type === 'book') body = endDot(s.publisher);
  else if (s.type === 'report') body = s.publisher.trim().toLowerCase() === orgAuthor ? '' : endDot(s.publisher);
  else if (s.type === 'article') {
    const vol = s.volume ? it(s.volume) + (s.issue ? `(${s.issue})` : '') : '';
    body = endDot(join([it(s.container), vol, pagesText(s.pages, '–', false)], ', '));
  } else if (s.type === 'chapter') {
    const e = eds.length ? editorsList(eds, 'apa') + (eds.length > 1 ? ' (Eds.),' : ' (Ed.),') : '';
    const pg = pagesText(s.pages, '–', true);
    body = `In ${e} ${it(s.container)}${pg ? ` (${pg})` : ''}. ${endDot(s.publisher)}`;
  } else if (web) body = s.container.trim().toLowerCase() === orgAuthor ? '' : endDot(s.container);
  const ac = accessedParts(s.accessed);
  const l = link(s);
  const tail = l ? (web && ac && !s.doi ? `Retrieved ${MONTHS[ac.m - 1]} ${ac.d}, ${ac.y}, from ${l}` : l) : '';
  return [clean(join([head, body, tail]))];
}

function mla(s: Src): string[] {
  const au = parseNames(s.authors), eds = parseNames(s.editors);
  const a = au.length ? endDot(listMLA(au)) : '';
  const web = s.type === 'website';
  const quoted = s.type === 'article' || s.type === 'chapter' || web;
  const t = quoted ? `"${endDot(s.title)}"` : endDot(it(s.title));
  const pg = pagesText(s.pages, '-', true);
  const l = doiUrl(s.doi) || (s.url.trim() ? noProto(s.url.trim()) : '');
  let rest: string[] = [];
  const m = s.month ? MLA_M[s.month - 1] : '';
  const dateTxt = [s.day || '', m, s.year.trim()].filter(Boolean).join(' ');
  if (s.type === 'book') rest = [ordinal(s.edition), s.publisher, s.year.trim()];
  else if (s.type === 'report') rest = [s.reportNo ? `Report no. ${s.reportNo.trim()}` : '', s.publisher, s.year.trim()];
  else if (s.type === 'article') rest = [it(s.container), s.volume && `vol. ${s.volume}`, s.issue && `no. ${s.issue}`, dateTxt, pg];
  else if (s.type === 'chapter') {
    const e = eds.length ? 'edited by ' + editorsList(eds, 'plain') : '';
    rest = [it(s.container), e, s.publisher, s.year.trim(), pg];
  } else rest = [it(s.container), s.publisher, dateTxt];
  const ac = accessedParts(s.accessed);
  let r = join(rest.filter(Boolean) as string[], ', ');
  r = join([r, l], ', ');
  r = r ? endDot(r) : '';
  if (web && ac && !s.year.trim()) r = join([r, `Accessed ${ac.d} ${MLA_M[ac.m - 1]} ${ac.y}.`]);
  return [clean(join([a, t, r]))];
}

function pubPlace(s: Src): string { return s.place.trim() ? `${s.place.trim()}: ${s.publisher.trim()}` : s.publisher.trim(); }

function chicagoBib(s: Src, ad: boolean): string {
  const au = parseNames(s.authors), eds = parseNames(s.editors);
  const web = s.type === 'website';
  const y = s.year.trim();
  const ed = ordinal(s.edition);
  const pubYear = (withYear: boolean) => join([pubPlace(s), withYear ? y : ''], ', ');
  const a = au.length ? endDot(listChicagoBib(au)) : '';
  const yPart = ad ? endDot(y || 'n.d.') : '';
  const pg = pagesText(s.pages, '–', false);
  const l = link(s);
  const ac = accessedParts(s.accessed);
  let t = '', rest = '';
  if (s.type === 'book') { t = endDot(it(s.title)); rest = join([ed ? endDot(ed) : '', endDot(pubYear(!ad))]); }
  else if (s.type === 'report') { t = endDot(it(s.title)); rest = join([s.reportNo ? endDot(`Report No. ${s.reportNo.trim()}`) : '', endDot(pubYear(!ad))]); }
  else if (s.type === 'article') {
    t = `"${endDot(s.title)}"`;
    const vol = join([s.volume, s.issue && `no. ${s.issue}`], ', ');
    rest = endDot(join([it(s.container), vol], ' ') + (ad ? '' : y ? ` (${y})` : '') + (pg ? ': ' + pg : ''));
  } else if (s.type === 'chapter') {
    t = `"${endDot(s.title)}"`;
    const e = eds.length ? 'edited by ' + editorsList(eds, 'plain') : '';
    rest = join([endDot(join(['In ' + it(s.container), e, pg], ', ')), endDot(pubYear(!ad))]);
  } else {
    t = `"${endDot(s.title)}"`;
    const dt = ad ? longDate({ ...s, year: '' }) : longDate(s);
    rest = join([s.container ? endDot(s.container) : '', s.publisher ? endDot(s.publisher) : '', dt ? endDot(dt) : '']);
  }
  if (web && ac && !s.year.trim() && !s.month) rest = join([rest, `Accessed ${MONTHS[ac.m - 1]} ${ac.d}, ${ac.y}.`]);
  // author-date puts the year after the author; an author-less item starts with the title
  const lead = au.length ? join([a, yPart]) : '';
  const tail = l ? endDot(l) : '';
  if (!au.length) return clean(join([ad ? '' : '', t, ad ? yPart : '', rest, tail]));
  return clean(join([lead, t, rest, tail]));
}

function chicagoNote(s: Src): string {
  const au = parseNames(s.authors), eds = parseNames(s.editors);
  const a = listChicagoNote(au);
  const y = s.year.trim();
  const ed = ordinal(s.edition);
  const pub = (inner: string) => `(${join([pubPlace(s), y], ', ')})${inner ? ', ' + inner : ''}`;
  const pc = s.pageCited.trim();
  const l = link(s);
  let body = '';
  const dash = (x: string) => x.replace(/\s*[-–—]+\s*/, '–');
  if (s.type === 'book') body = join([it(s.title) + (ed ? `, ${ed}` : ''), pub(dash(pc))], ' ');
  else if (s.type === 'report') body = join([join([it(s.title), s.reportNo && `Report No. ${s.reportNo.trim()}`], ', '), pub(dash(pc))], ' ');
  else if (s.type === 'article') {
    const vol = join([s.volume, s.issue && `no. ${s.issue}`], ', ');
    body = join([`"${s.title},"`, join([it(s.container), vol], ' ')], ' ') + (y ? ` (${y})` : '') + (pc ? ': ' + dash(pc) : '');
  } else if (s.type === 'chapter') {
    const e = eds.length ? 'ed. ' + editorsList(eds, 'plain') : '';
    body = `"${s.title}," in ${join([it(s.container), e], ', ')} ${pub(dash(pc))}`;
  } else body = join([`"${s.title},"`, join([s.container, longDate(s)], ', ')], ' ');
  const whole = a ? `${a}, ${body}` : body;
  return clean(endDot(join([whole, l && s.type !== 'book' && s.type !== 'chapter' && s.type !== 'report' ? ', ' + l : ''], '')));
}

function harvard(s: Src): string[] {
  const au = parseNames(s.authors), eds = parseNames(s.editors);
  const y = s.year.trim() || 'no date';
  const ed = ordinal(s.edition);
  const web = s.type === 'website';
  const q = (t: string) => `‘${t.replace(/[.,]$/, '')}’`;
  const quoted = s.type === 'article' || s.type === 'chapter';
  const t = quoted ? q(s.title) : it(s.title);
  const a = au.length ? listHarvard(au) : '';
  const lead = a ? `${a} (${y})` : `${t.replace(/,$/, '')} (${y})`;
  const titlePart = a ? t : '';
  const pg = pagesText(s.pages, '–', true);
  const ac = accessedParts(s.accessed);
  const avail = s.url.trim() && !s.doi ? `Available at: ${s.url.trim()}${ac ? ` (Accessed: ${ac.d} ${MONTHS[ac.m - 1]} ${ac.y})` : ''}.` : '';
  const doi = s.doi ? `doi:${normDoi(s.doi)}.` : '';
  let body = '';
  if (s.type === 'book') body = join([endDot(titlePart), ed ? endDot(ed) : '', endDot(pubPlace(s))]);
  else if (s.type === 'report') body = join([endDot(join([titlePart, s.reportNo ? `(Report no. ${s.reportNo.trim()})` : ''])), endDot(pubPlace(s))]);
  else if (s.type === 'article') {
    const vol = s.volume ? s.volume + (s.issue ? `(${s.issue})` : '') : '';
    body = join([titlePart + ',', join([it(s.container), vol, pg], ', ') + '.']);
  } else if (s.type === 'chapter') {
    const e = eds.length ? editorsList(eds, 'harvard') + (eds.length > 1 ? ' (eds)' : ' (ed.)') : '';
    body = join([titlePart + ', in', join([e, it(s.container)]) + '.', endDot(pubPlace(s)).replace(/\.$/, '') + (pg ? ', ' + pg : '') + '.']);
  } else body = endDot(titlePart);
  return [clean(join([lead, body, doi, avail]))];
}

function ieee(s: Src): string[] {
  const au = parseNames(s.authors), eds = parseNames(s.editors);
  const a = listIEEE(au);
  const y = s.year.trim();
  const my = join([s.month ? IEEE_M[s.month - 1] : '', y]);
  const pg = pagesText(s.pages, '–', true);
  const ed = ordinal(s.edition);
  const ac = accessedParts(s.accessed);
  const lead = (x: string) => (a ? a + ', ' : '') + x;
  let r = '';
  if (s.type === 'book') r = join([join([a, it(s.title), ed].filter(Boolean) as string[], ', ') + '.', endDot(join([pubPlace(s), y], ', '))]);
  else if (s.type === 'report') r = endDot(lead(join([`"${s.title},"`, join([s.publisher, s.place, s.reportNo && `Rep. no. ${s.reportNo.trim()}`, y], ', ')])));
  else if (s.type === 'article') {
    const items = [it(s.container), s.volume && `vol. ${s.volume}`, s.issue && `no. ${s.issue}`, pg, my, s.doi && `doi: ${normDoi(s.doi)}`];
    r = endDot(lead(join([`"${s.title},"`, join(items as string[], ', ')])));
  } else if (s.type === 'chapter') {
    const e = eds.length ? editorsList(eds, 'ieee') + (eds.length > 1 ? ', Eds.' : ', Ed.') : '';
    r = join([lead(join([`"${s.title},"`, 'in', join([it(s.container), e], ', ')])) + '.', endDot(join([pubPlace(s), y, pg], ', '))]);
  } else {
    r = join([a ? a + '.' : '', `"${s.title}."`, s.container ? endDot(s.container) : '', s.url.trim(), ac ? `(accessed ${IEEE_M[ac.m - 1]} ${ac.d}, ${ac.y}).` : '']);
  }
  if (s.type === 'book' && s.doi) r = join([r, `doi: ${normDoi(s.doi)}.`]);
  return [clean(r)];
}

export function cite(s: Src, style: StyleId): string[] {
  switch (style) {
    case 'apa': return apa(s);
    case 'mla': return mla(s);
    case 'chicago-ad': return [chicagoBib(s, true)];
    case 'chicago-note': return [chicagoNote(s), chicagoBib(s, false)];
    case 'harvard': return harvard(s);
    case 'ieee': return ieee(s);
  }
}

// sort key: first author's family name, else title
export function sortKey(s: Src): string {
  const n = parseNames(s.authors)[0];
  return ((n ? n.family : s.title.replace(/^(a|an|the)\s+/i, '')) + ' ' + s.year).toLowerCase();
}

export function problems(s: Src): string[] {
  const p: string[] = [];
  if (!s.title.trim()) p.push('Add the title.');
  if (!parseNames(s.authors).length) p.push('No author: the title will go first, as the styles say. For a company or group, type its name on one line.');
  if (!s.year.trim()) p.push('No year: it will show as "n.d." (no date).');
  if (s.type === 'article' && !s.container.trim()) p.push('Add the journal name.');
  if (s.type === 'chapter' && !s.container.trim()) p.push('Add the title of the book that holds the chapter.');
  if (s.type === 'website' && !s.url.trim()) p.push('Add the web address.');
  if ((s.type === 'book' || s.type === 'chapter' || s.type === 'report') && !s.publisher.trim()) p.push('Add the publisher.');
  return p;
}

// ---------- exports ----------
const ascii = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]/g, '');
export function bibKeys(list: Src[]): string[] {
  const seen = new Map<string, number>();
  return list.map((s) => {
    const n = parseNames(s.authors)[0];
    const base = (n ? ascii(n.family) : ascii(s.title.split(/\s+/)[0] || 'ref')) + (s.year.trim().match(/\d{4}/)?.[0] || '');
    const c = seen.get(base) || 0; seen.set(base, c + 1);
    return base + (c ? String.fromCharCode(96 + c) : '') || 'ref';
  });
}
const bibEsc = (t: string) => t.replace(/([&%$#_])/g, '\\$1');
export function toBibtex(list: Src[]): string {
  const keys = bibKeys(list);
  return list.map((s, i) => {
    const type = { book: 'book', article: 'article', chapter: 'incollection', website: 'misc', report: 'techreport' }[s.type];
    const f: [string, string][] = [];
    const au = parseNames(s.authors).map((n) => (n.org ? `{${n.family}}` : `${n.family}, ${n.given}`)).join(' and ');
    const ed = parseNames(s.editors).map((n) => (n.org ? `{${n.family}}` : `${n.family}, ${n.given}`)).join(' and ');
    f.push(['author', au], ['editor', ed], ['title', s.title ? `{${bibEsc(s.title)}}` : '']);
    if (s.type === 'article') f.push(['journal', bibEsc(s.container)]);
    else if (s.type === 'chapter') f.push(['booktitle', bibEsc(s.container)]);
    else if (s.type === 'website') f.push(['howpublished', s.url ? `\\url{${s.url}}` : ''], ['organization', bibEsc(s.container)]);
    f.push(['year', s.year.trim()], ['month', s.month ? MONTHS[s.month - 1].slice(0, 3).toLowerCase() : ''], ['volume', s.volume], ['number', s.issue || s.reportNo],
      ['pages', s.pages.replace(/\s*[-–—]+\s*/, '--')], ['publisher', bibEsc(s.publisher)], ['address', s.place], ['edition', s.edition],
      ['doi', normDoi(s.doi)], ['url', s.type === 'website' ? '' : s.url]);
    const body = f.filter(([, v]) => v && v.trim()).map(([k, v]) => `  ${k} = {${/^\{.*\}$/.test(v) && k === 'title' ? v.slice(1, -1).replace(/^/, '{').replace(/$/, '}') : v}}`).join(',\n');
    return `@${type}{${keys[i]},\n${body}\n}`;
  }).join('\n\n') + (list.length ? '\n' : '');
}
export function toRis(list: Src[]): string {
  return list.map((s) => {
    const ty = { book: 'BOOK', article: 'JOUR', chapter: 'CHAP', website: 'ELEC', report: 'RPRT' }[s.type];
    const [sp, ep] = pageParts(s.pages);
    const rows: [string, string][] = [['TY', ty]];
    parseNames(s.authors).forEach((n) => rows.push(['AU', n.org ? n.family : `${n.family}, ${n.given}`]));
    parseNames(s.editors).forEach((n) => rows.push(['A2', n.org ? n.family : `${n.family}, ${n.given}`]));
    rows.push(['TI', s.title], ['T2', s.container], ['PY', s.year.trim()], ['VL', s.volume], ['IS', s.issue || s.reportNo], ['SP', sp], ['EP', ep],
      ['PB', s.publisher], ['CY', s.place], ['ET', s.edition], ['DO', normDoi(s.doi)], ['UR', s.url]);
    if (s.accessed) rows.push(['Y2', s.accessed.replace(/-/g, '/')]);
    rows.push(['ER', '']);
    return rows.filter(([k, v]) => v || k === 'ER').map(([k, v]) => `${k}  - ${v}`).join('\r\n');
  }).join('\r\n') + (list.length ? '\r\n' : '');
}

// italic markers -> html / plain
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const toHtml = (t: string) => esc(t).replace(/\*([^*]+)\*/g, '<i>$1</i>');
export const toPlain = (t: string) => t.replace(/\*/g, '');
