// A README for a dataset, laid out in the common "readme-style metadata" order (general information, sharing and
// access, data and file overview, methods, data-specific information) so that a person who finds the files later can
// understand and reuse them (the FAIR principles: findable, accessible, interoperable, reusable).
// The page fills a ReadmeData; this file turns it into a document model, Markdown and plain text, and lists what is
// still missing. No DOM.
import { LICENCES, orcidOk, doiOk, doiBare, isoDate } from './metadata.ts';

export type ReadmeData = {
  title: string; authors: string; contact: string; abstract: string; keywords: string;
  dateStart: string; dateEnd: string; location: string; funding: string;
  licence: string; licenceOther: string; restrictions: string; doi: string; publisher: string; year: string; version: string;
  citation: string; publications: string; related: string;
  files: string; naming: string;
  methods: string; processing: string; software: string; quality: string;
  variables: string; missing: string;
};
export const EMPTY: ReadmeData = { title: '', authors: '', contact: '', abstract: '', keywords: '', dateStart: '', dateEnd: '', location: '', funding: '', licence: '', licenceOther: '', restrictions: '', doi: '', publisher: '', year: '', version: '', citation: '', publications: '', related: '', files: '', naming: '', methods: '', processing: '', software: '', quality: '', variables: '', missing: '' };

export type Block = { p: string } | { list: string[] } | { kv: [string, string][] } | { table: { head: string[]; rows: string[][] } };
export type Section = { h: string; blocks: Block[] };
export type Doc = { title: string; sections: Section[] };

const lines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const cells = (l: string) => l.split('|').map((c) => c.trim());

export type Author = { name: string; orcid: string; affiliation: string; email: string };
/** One author per line: "Name; ORCID iD; Affiliation; email" (any part after the name may be left out). */
export function authors(s: string): Author[] {
  return lines(s).map((l) => { const [name = '', orcid = '', affiliation = '', email = ''] = l.split(';').map((x) => x.trim()); return { name, orcid, affiliation, email }; });
}

/** Bytes in words, in powers of 1000 as file managers on phones and macOS show them. */
export function sizeText(n: number): string {
  if (!(n >= 0)) return '';
  if (n < 1000) return `${n} B`;
  const u = ['kB', 'MB', 'GB', 'TB'];
  let x = n / 1000, i = 0;
  while (x >= 1000 && i < u.length - 1) { x /= 1000; i++; }
  return `${x >= 100 ? Math.round(x) : x >= 10 ? x.toFixed(1) : x.toFixed(2)} ${u[i]}`;
}

/** "Rivera, Ana" -> "Rivera, A."; "Ana Rivera" -> "Rivera, A."; organisations (no space or comma) unchanged. */
function citeName(n: string): string {
  if (n.includes(',')) { const [f, g] = n.split(',').map((x) => x.trim()); return g ? `${f}, ${g.split(/[\s-]+/).filter(Boolean).map((x) => x[0].toUpperCase() + '.').join(' ')}` : f; }
  const parts = n.trim().split(/\s+/);
  if (parts.length < 2) return n.trim();
  const fam = parts.pop()!;
  return `${fam}, ${parts.map((x) => x[0].toUpperCase() + '.').join(' ')}`;
}
/** A data citation in the form DataCite recommends: Creator (PublicationYear). Title. Version. Publisher. Identifier. */
export function citation(d: ReadmeData): string {
  if (d.citation.trim()) return d.citation.trim();
  const a = authors(d.authors).map((x) => citeName(x.name)).filter(Boolean);
  if (!a.length || !d.title.trim()) return '';
  const who = a.length === 1 ? a[0] : a.length === 2 ? `${a[0]} & ${a[1]}` : `${a.slice(0, -1).join(', ')}, & ${a[a.length - 1]}`;
  const year = d.year.trim() || (d.dateEnd || d.dateStart).slice(0, 4) || 'n.d.';
  const parts = [`${who} (${year}).`, `${d.title.trim().replace(/\.$/, '')}${d.version.trim() ? ` (Version ${d.version.trim()})` : ''} [Data set].`];
  if (d.publisher.trim()) parts.push(`${d.publisher.trim().replace(/\.$/, '')}.`);
  if (d.doi.trim()) parts.push(doiOk(d.doi) ? `https://doi.org/${doiBare(d.doi)}` : d.doi.trim());
  return parts.join(' ');
}

export function licenceText(d: ReadmeData): string {
  const L = LICENCES.find((l) => l.id === d.licence);
  if (L) return `${L.name} (SPDX: ${L.id}), ${L.url}`;
  return d.licence === 'other' ? d.licenceOther.trim() : '';
}

export type FileRow = { name: string; size?: number; description: string };
/** File list lines: "name | description", or "name | size in bytes | description" from picked files. */
export function fileRows(s: string): FileRow[] {
  return lines(s).map((l) => { const c = cells(l); if (c.length >= 3 && /^\d+$/.test(c[1])) return { name: c[0], size: Number(c[1]), description: c.slice(2).join(' | ') }; return { name: c[0], description: c.slice(1).join(' | ') }; });
}
export type VarRow = { name: string; description: string; unit: string; missing: string };
/** Variable lines: "name | description | unit | missing value code". */
export function varRows(s: string): VarRow[] {
  return lines(s).map((l) => { const [name = '', description = '', unit = '', missing = ''] = cells(l); return { name, description, unit, missing }; });
}

/** What a reader would need that is still missing: [item, done] in the order they appear in the README. */
export function checklist(d: ReadmeData): { item: string; ok: boolean; why: string }[] {
  const A = authors(d.authors);
  return [
    { item: 'Title', ok: !!d.title.trim(), why: 'so the data can be named and found' },
    { item: 'Authors', ok: A.length > 0, why: 'who made the data and gets the credit' },
    { item: 'ORCID iDs for authors', ok: A.length > 0 && A.every((a) => a.orcid && orcidOk(a.orcid)), why: 'tell people with the same name apart' },
    { item: 'Contact', ok: !!d.contact.trim() || A.some((a) => a.email), why: 'someone to ask about the data' },
    { item: 'Description', ok: d.abstract.trim().length >= 20, why: 'what the data are, in a few sentences' },
    { item: 'Dates of collection', ok: !!d.dateStart.trim(), why: 'when the data describe' },
    { item: 'Licence', ok: !!licenceText(d), why: 'what others may do with the data (reusable)' },
    { item: 'Identifier or citation', ok: !!d.doi.trim() || !!d.citation.trim(), why: 'how to cite it (findable)' },
    { item: 'File list', ok: fileRows(d.files).length > 0, why: 'what each file holds' },
    { item: 'Methods', ok: d.methods.trim().length >= 20, why: 'how the data were collected' },
    { item: 'Variables', ok: varRows(d.variables).length > 0, why: 'column names, meanings and units (interoperable)' },
    { item: 'Missing value codes', ok: !!d.missing.trim() || varRows(d.variables).some((v) => v.missing), why: 'so a blank or -999 is not read as data' },
  ];
}

/** Problems in what was typed (not just missing): bad ORCID iD, DOI, dates, a file or variable line with no name. */
export function problems(d: ReadmeData): string[] {
  const out: string[] = [];
  authors(d.authors).forEach((a, i) => { if (a.orcid && !orcidOk(a.orcid)) out.push(`Author ${i + 1}: "${a.orcid}" is not a valid ORCID iD (the last character is a check digit).`); if (a.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) out.push(`Author ${i + 1}: "${a.email}" does not look like an email address.`); });
  if (d.doi.trim() && !doiOk(d.doi)) out.push(`"${d.doi.trim()}" is not a DOI (10.xxxx/...).`);
  for (const [k, v] of [['Start date', d.dateStart], ['End date', d.dateEnd]] as const) if (v.trim() && !isoDate(v.trim())) out.push(`${k} "${v.trim()}" is not an ISO 8601 date (YYYY-MM-DD).`);
  if (d.dateStart.trim() && d.dateEnd.trim() && isoDate(d.dateStart) && isoDate(d.dateEnd) && d.dateEnd.trim() < d.dateStart.trim()) out.push('The end date is before the start date.');
  if (d.year.trim() && !/^\d{4}$/.test(d.year.trim())) out.push('The publication year should be four digits.');
  if (d.licence === 'other' && !d.licenceOther.trim()) out.push('Licence is "other" but no licence is written.');
  return out;
}

/** The README as sections of blocks. Empty parts are left out. */
export function model(d: ReadmeData): Doc {
  const S: Section[] = [];
  const add = (h: string, blocks: (Block | null)[]) => { const b = blocks.filter((x): x is Block => !!x); if (b.length) S.push({ h, blocks: b }); };
  const kv = (pairs: [string, string][]): Block | null => { const p = pairs.filter(([, v]) => v.trim()); return p.length ? { kv: p.map(([k, v]) => [k, v.trim()]) } : null; };
  const para = (s: string): Block | null => (s.trim() ? { p: s.trim() } : null);
  const A = authors(d.authors);
  const dates = d.dateStart.trim() ? (d.dateEnd.trim() && d.dateEnd.trim() !== d.dateStart.trim() ? `${d.dateStart.trim()} to ${d.dateEnd.trim()}` : d.dateStart.trim()) : '';
  add('General information', [
    para(d.abstract),
    A.length ? { list: A.map((a) => [a.name, a.affiliation, a.orcid ? (orcidOk(a.orcid) ? `ORCID https://orcid.org/${a.orcid.replace(/^https?:\/\/(www\.)?orcid\.org\//i, '')}` : `ORCID ${a.orcid}`) : '', a.email].filter(Boolean).join(', ')) } : null,
    kv([['Contact', d.contact], ['Dates of data collection', dates], ['Location', d.location], ['Keywords', d.keywords], ['Funding', d.funding]]),
  ]);
  if (A.length) S[S.length - 1].blocks.splice(d.abstract.trim() ? 1 : 0, 0, { p: 'Authors:' });
  const cite = citation(d);
  add('Sharing and access', [
    kv([['Licence', licenceText(d)], ['Restrictions', d.restrictions], ['DOI', d.doi.trim() ? (doiOk(d.doi) ? `https://doi.org/${doiBare(d.doi)}` : d.doi) : ''], ['Version', d.version], ['Recommended citation', cite]]),
    lines(d.publications).length ? { p: 'Publications that use these data:' } : null,
    lines(d.publications).length ? { list: lines(d.publications) } : null,
    lines(d.related).length ? { p: 'Related data and other places to get these data:' } : null,
    lines(d.related).length ? { list: lines(d.related) } : null,
  ]);
  const F = fileRows(d.files), withSize = F.some((f) => f.size !== undefined);
  add('Data and file overview', [
    F.length ? { table: { head: withSize ? ['File', 'Size', 'Description'] : ['File', 'Description'], rows: F.map((f) => (withSize ? [f.name, f.size !== undefined ? sizeText(f.size) : '', f.description] : [f.name, f.description])) } } : null,
    withSize ? { p: `${F.length} file${F.length === 1 ? '' : 's'}, ${sizeText(F.reduce((s, f) => s + (f.size ?? 0), 0))} in all.` } : null,
    kv([['File naming', d.naming]]),
  ]);
  add('Methods', [kv([['Data collection', d.methods], ['Processing', d.processing], ['Instruments and software', d.software], ['Quality checks', d.quality]])]);
  const V = varRows(d.variables);
  add('Variables', [
    V.length ? { table: { head: ['Variable', 'Description', 'Unit', 'Missing value'], rows: V.map((v) => [v.name, v.description, v.unit, v.missing]) } } : null,
    kv([['Missing values', d.missing]]),
  ]);
  return { title: d.title.trim() || 'Untitled dataset', sections: S };
}

// ---------- writers ----------
// Markdown: backslashes, *, _, `, < and > are escaped so names such as site-<letter>.csv or temp_*.csv show as typed;
// | is escaped in table cells, and a line that would start a heading, quote or list is escaped too.
const mdEsc = (s: string) => s.replace(/[\\*_`<>[\]]/g, (c) => `\\${c}`);
const mdLine = (l: string) => mdEsc(l).replace(/^(\s*)([#+-]|\d+[.)])(?=\s|$)/, (_, sp, m) => `${sp}${m.replace(/^([#+-])/, '\\$1').replace(/^(\d+)([.)])$/, '$1\\$2')}`);
const mdCell = (s: string) => mdEsc(s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const mdText = (s: string) => s.split(/\r?\n/).map(mdLine).join('\n').replace(/\n(?!\n)/g, '  \n');
export function toMarkdown(doc: Doc, made = ''): string {
  const out: string[] = [`# ${mdEsc(doc.title)}`, ''];
  for (const s of doc.sections) {
    out.push(`## ${s.h}`, '');
    for (const b of s.blocks) {
      if ('p' in b) out.push(mdText(b.p), '');
      else if ('list' in b) out.push(...b.list.map((x) => `- ${mdEsc(x.replace(/\r?\n/g, ' '))}`), '');
      else if ('kv' in b) out.push(...b.kv.map(([k, v]) => (v.includes('\n') ? `**${k}:**\n\n${mdText(v)}\n` : `- **${k}:** ${mdEsc(v)}`)), '');
      else { const { head, rows } = b.table; out.push(`| ${head.map(mdCell).join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${head.map((_, i) => mdCell(r[i] ?? '')).join(' | ')} |`), ''); }
    }
  }
  if (made) out.push('---', '', made, '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

const width = (s: string) => [...s].length;
const padR = (s: string, n: number) => s + ' '.repeat(Math.max(0, n - width(s)));
/** Plain text with underlined headings, "Key: value" lines and tables lined up in columns. */
export function toText(doc: Doc, made = ''): string {
  const out: string[] = [doc.title, '='.repeat(Math.min(78, width(doc.title))), ''];
  for (const s of doc.sections) {
    out.push(s.h.toUpperCase(), '-'.repeat(width(s.h)), '');
    for (const b of s.blocks) {
      if ('p' in b) out.push(b.p, '');
      else if ('list' in b) out.push(...b.list.map((x) => `  * ${x}`), '');
      else if ('kv' in b) out.push(...b.kv.map(([k, v]) => (v.includes('\n') ? `${k}:\n${v.split(/\r?\n/).map((l) => `  ${l}`).join('\n')}` : `${k}: ${v}`)), '');
      else {
        const { head, rows } = b.table, all = [head, ...rows.map((r) => head.map((_, i) => (r[i] ?? '').replace(/\r?\n/g, ' ')))];
        const w = head.map((_, i) => Math.max(...all.map((r) => width(r[i]))));
        const line = (r: string[]) => r.map((c, i) => (i === r.length - 1 ? c : padR(c, w[i]))).join('  ').trimEnd();
        out.push(line(head), w.map((n) => '-'.repeat(n)).join('  '), ...all.slice(1).map(line), '');
      }
    }
  }
  if (made) out.push(made, '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

/** A made-up example, filled in everywhere. */
export const EXAMPLE: ReadmeData = {
  ...EMPTY,
  title: 'Stream temperature at three sites, spring 2026 (example)',
  authors: 'Ana Rivera; 0000-0002-1825-0097; Example River Institute; ana@example.org\nChidi Okafor; ; Example River Institute',
  contact: 'Ana Rivera, ana@example.org',
  abstract: 'Made-up example data: hourly water temperature from three loggers in a small stream, to show how a README is laid out.',
  keywords: 'stream temperature, water quality, field survey',
  dateStart: '2026-03-01', dateEnd: '2026-05-31', location: 'Example Creek (45.42, -75.69)', funding: 'Example Foundation, grant EX-123',
  licence: 'CC-BY-4.0', doi: '10.5555/example.2026', publisher: 'Example Data Repository', year: '2026', version: '1.0',
  files: 'site-a.csv | 41250 | Hourly temperature, site A\nsite-b.csv | 40980 | Hourly temperature, site B\nsite-c.csv | 39875 | Hourly temperature, site C',
  naming: 'site-<letter>.csv, one file per logger.',
  methods: 'Three loggers were tied 20 cm under the surface and recorded every hour.',
  processing: 'Readings taken while a logger was out of the water were removed.',
  software: 'Example logger, exported as CSV; checked in R 4.4.',
  quality: 'Each logger was compared with a hand thermometer every week.',
  variables: 'time | Date and time of the reading, UTC | ISO 8601 | \ntemp_c | Water temperature | °C | -999\nflag | 1 if the reading was checked by hand | none | ',
  missing: '-999 means no reading.',
};
