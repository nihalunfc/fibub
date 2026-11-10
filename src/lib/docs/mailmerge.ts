// Mail merge: read a CSV, fill {{Field}} placeholders in a Word template (even when Word has split a
// placeholder across several runs) or in plain text, and pack the results. Plain TypeScript, no DOM.
import { unzipSync, zipSync, strToU8, strFromU8 } from 'fflate';

export type Table = { headers: string[]; rows: Record<string, string>[]; delimiter: string };

/** Reads CSV text (comma, semicolon or tab; quotes; BOM; blank lines skipped). */
export function parseCsv(text: string): Table {
  const t = text.replace(/^﻿/, '');
  const first = t.split(/\r?\n/, 1)[0] ?? '';
  const count = (ch: string) => { let n = 0, q = false; for (const c of first) { if (c === '"') q = !q; else if (c === ch && !q) n++; } return n; };
  const delimiter = [',', ';', '\t'].map((d) => [d, count(d)] as const).sort((a, b) => b[1] - a[1])[0];
  const D = delimiter[1] ? delimiter[0] : ',';
  const recs: string[][] = [];
  let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c;
    } else if (c === '"') q = true;
    else if (c === D) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some((x) => x.trim() !== '')) recs.push(row); row = []; }
    else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== '')) recs.push(row);
  if (!recs.length) return { headers: [], rows: [], delimiter: D };
  const headers = recs[0].map((h) => h.trim());
  const rows = recs.slice(1).map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').trim()])));
  return { headers, rows, delimiter: D };
}

const PH = /\{\{\s*([^{}]+?)\s*\}\}/g;
const lookup = (row: Record<string, string>, name: string): string | undefined => {
  if (name in row) return row[name];
  const k = Object.keys(row).find((h) => h.toLowerCase() === name.toLowerCase());
  return k === undefined ? undefined : row[k];
};

/** Field names used in some text, in order, once each. */
export function fieldsIn(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(PH)) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

/** Fill a plain text template. Unknown fields stay as written. */
export function fillText(template: string, row: Record<string, string>): string {
  return template.replace(PH, (all, name) => lookup(row, name) ?? all);
}

const unesc = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const T_RE = /<w:t(?: [^>]*)?>([^<]*)<\/w:t>/g;
const P_RE = /<w:p[ >][\s\S]*?<\/w:p>/g;

/** Merge one paragraph's XML. row = null only lists placeholders. */
function mergeParagraph(p: string, row: Record<string, string> | null, found?: Set<string>, missing?: Set<string>): string {
  const segs: string[] = [];
  for (const m of p.matchAll(T_RE)) segs.push(unesc(m[1]));
  const joined = segs.join('');
  if (!joined.includes('{{')) return p;
  const matches = [...joined.matchAll(PH)];
  if (!matches.length) return p;
  for (const m of matches) found?.add(m[1]);
  if (!row) return p;
  for (let k = matches.length - 1; k >= 0; k--) {
    const m = matches[k], s = m.index!, e = s + m[0].length;
    const val = lookup(row, m[1]);
    if (val === undefined) { missing?.add(m[1]); continue; }
    let pos = 0, placed = false;
    for (let i = 0; i < segs.length; i++) {
      const a = pos, b = pos + segs[i].length;
      pos = b;
      if (b <= s || a >= e) continue;
      const from = Math.max(s, a) - a, to = Math.min(e, b) - a;
      segs[i] = segs[i].slice(0, from) + (placed ? '' : val) + segs[i].slice(to);
      placed = true;
    }
  }
  let i = 0;
  return p.replace(T_RE, (all) => {
    const t = segs[i++];
    return `<w:t xml:space="preserve">${esc(t).replace(/\r?\n/g, '</w:t><w:br/><w:t xml:space="preserve">')}</w:t>`;
  });
}

const PARTS = /^word\/(document|header\d*|footer\d*)\.xml$/;
const mergeXml = (xml: string, row: Record<string, string> | null, found?: Set<string>, missing?: Set<string>) =>
  xml.replace(P_RE, (p) => mergeParagraph(p, row, found, missing));

export type Template = { files: Record<string, Uint8Array>; fields: string[] };

/** Opens a .docx and lists its placeholders. Throws if it is not a Word file. */
export function openTemplate(bytes: Uint8Array): Template {
  let files: Record<string, Uint8Array>;
  try { files = unzipSync(bytes); } catch { throw new Error('That is not a Word (.docx) file.'); }
  if (!files['word/document.xml']) throw new Error('That is not a Word (.docx) file.');
  const found = new Set<string>();
  for (const n of Object.keys(files)) if (PARTS.test(n)) mergeXml(strFromU8(files[n]), null, found);
  return { files, fields: [...found] };
}

/** One filled-in .docx for a row. */
export function mergeDocx(t: Template, row: Record<string, string>): { bytes: Uint8Array; missing: string[] } {
  const missing = new Set<string>();
  const out: Record<string, Uint8Array> = {};
  for (const [n, data] of Object.entries(t.files)) out[n] = PARTS.test(n) ? strToU8(mergeXml(strFromU8(data), row, undefined, missing)) : data;
  return { bytes: zipSync(out, { level: 6 }), missing: [...missing] };
}

/** The text of a .docx body, one line per paragraph (for the preview). */
export function docxText(bytes: Uint8Array): string {
  const xml = strFromU8(unzipSync(bytes)['word/document.xml']);
  return [...xml.matchAll(P_RE)].map((p) => [...p[0].matchAll(T_RE)].map((m) => unesc(m[1])).join('')).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** A safe, unique file name from a column value. */
export function fileName(value: string, index: number, used: Set<string>, ext: string): string {
  let base = value.normalize('NFKD').replace(/[^\w\- .]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
  if (!base) base = `merged-${String(index + 1).padStart(3, '0')}`;
  let name = base, n = 2;
  while (used.has(name.toLowerCase())) name = `${base}-${n++}`;
  used.add(name.toLowerCase());
  return `${name}.${ext}`;
}

/** Packs named files into one ZIP. */
export const zipFiles = (files: Record<string, Uint8Array>) => zipSync(files, { level: 1 });

/** A small Word letter with placeholders, for people who want something to start from. */
export function sampleTemplate(): Uint8Array {
  const X = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  const para = (t: string, b = false) => `<w:p><w:r>${b ? '<w:rPr><w:b/></w:rPr>' : ''}<w:t xml:space="preserve">${esc(t)}</w:t></w:r></w:p>`;
  const body = [para('{{Company}}', true), para('{{Address}}'), para(''), para('Dear {{Name}},'), para(''),
    para('Thank you for your order {{Order}}. It will arrive on {{Date}}.'), para(''), para('Yours sincerely,'), para('Your name')].join('');
  return zipSync({
    '[Content_Types].xml': strToU8(`${X}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`),
    '_rels/.rels': strToU8(`${X}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`),
    'word/document.xml': strToU8(`${X}<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`),
  });
}
