// CSV, JSON and Excel (.xlsx) tables, without outside libraries. Excel support covers values
// (text, numbers, true/false), not formatting, formulas or charts.
import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';

export type Table = string[][];

/** RFC 4180 CSV: quotes, doubled quotes, commas and new lines inside quotes. Detects ; and tab. */
export function parseCsv(text: string): Table {
  text = text.replace(/^﻿/, '');
  const first = text.slice(0, text.indexOf('\n') === -1 ? undefined : text.indexOf('\n'));
  const sep = [',', ';', '\t'].map((s) => [s, first.split(s).length] as const).sort((a, b) => b[1] - a[1])[0][0];
  const rows: Table = [];
  let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"' && cell === '') q = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

export const toCsv = (t: Table) =>
  t.map((r) => r.map((v) => (/[",\n\r]|^\s|\s$/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\r\n') + '\r\n';

/** First row = keys. Numbers and true/false become JSON numbers and booleans. */
export function tableToJson(t: Table) {
  const [head, ...rows] = t;
  const val = (v: string) => (v === '' ? null : /^-?\d+(\.\d+)?$/.test(v) && !/^0\d/.test(v) ? Number(v) : v === 'true' ? true : v === 'false' ? false : v);
  return JSON.stringify(rows.filter((r) => r.some((v) => v !== '')).map((r) => Object.fromEntries(head.map((h, i) => [h || `column${i + 1}`, val(r[i] ?? '')]))), null, 2);
}

/** A list of objects (nested ones flattened to a.b.c) or a list of lists. */
export function jsonToTable(text: string): Table {
  let data = JSON.parse(text);
  if (!Array.isArray(data)) data = Array.isArray(Object.values(data).find(Array.isArray)) ? Object.values(data).find(Array.isArray) : [data];
  if (data.every(Array.isArray)) return data.map((r: unknown[]) => r.map(str));
  const flat = data.map((o: unknown) => flatten(o));
  const keys = [...new Set(flat.flatMap((o: Record<string, unknown>) => Object.keys(o)))] as string[];
  return [keys, ...flat.map((o: Record<string, unknown>) => keys.map((k) => str(o[k])))];
}
const str = (v: unknown) => (v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));
function flatten(o: unknown, pre = '', out: Record<string, unknown> = {}) {
  if (o && typeof o === 'object' && !Array.isArray(o)) for (const [k, v] of Object.entries(o)) flatten(v, pre ? `${pre}.${k}` : k, out);
  else out[pre || 'value'] = o;
  return out;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const colName = (i: number) => { let s = ''; for (i++; i; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s; return s; };

export function tableToXlsx(t: Table, sheet = 'Sheet1'): Uint8Array {
  const rows = t.map((r, ri) => `<row r="${ri + 1}">${r.map((v, ci) => {
    const ref = `${colName(ci)}${ri + 1}`;
    if (v === '') return '';
    if (/^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(v) && !/^0\d/.test(v) && v.length < 16) return `<c r="${ref}"><v>${v}</v></c>`;
    return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
  }).join('')}</row>`).join('');
  const x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  return zipSync({
    '[Content_Types].xml': strToU8(`${x}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`),
    '_rels/.rels': strToU8(`${x}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    'xl/workbook.xml': strToU8(`${x}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${esc(sheet.slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets></workbook>`),
    'xl/_rels/workbook.xml.rels': strToU8(`${x}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`),
    'xl/worksheets/sheet1.xml': strToU8(`${x}<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows}</sheetData></worksheet>`),
  }, { level: 6 });
}

/** Every sheet of an .xlsx as a table of values (shown values for formulas). */
export function xlsxToTables(data: Uint8Array): { name: string; table: Table }[] {
  const files = unzipSync(data);
  const read = (p: string) => (files[p] ? new DOMParser().parseFromString(strFromU8(files[p]), 'application/xml') : null);
  const S = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const shared = Array.from(read('xl/sharedStrings.xml')?.getElementsByTagNameNS(S, 'si') ?? []).map((si) => Array.from(si.getElementsByTagNameNS(S, 't')).map((t) => t.textContent).join(''));
  const wb = read('xl/workbook.xml');
  const rels = read('xl/_rels/workbook.xml.rels');
  if (!wb) throw new Error('Not an Excel file');
  const target = (id: string) => Array.from(rels?.getElementsByTagName('Relationship') ?? []).find((r) => r.getAttribute('Id') === id)?.getAttribute('Target') ?? '';
  return Array.from(wb.getElementsByTagNameNS(S, 'sheet')).map((sh, i) => {
    const rid = sh.getAttribute('r:id') ?? sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') ?? '';
    let path = target(rid).replace(/^\//, '');
    path = path.startsWith('xl/') ? path : `xl/${path || `worksheets/sheet${i + 1}.xml`}`;
    const doc = read(path);
    const table: Table = [];
    for (const row of Array.from(doc?.getElementsByTagNameNS(S, 'row') ?? [])) {
      const r = +(row.getAttribute('r') ?? table.length + 1) - 1;
      const cells: string[] = [];
      for (const c of Array.from(row.getElementsByTagNameNS(S, 'c'))) {
        const ref = c.getAttribute('r') ?? '';
        const col = ref ? ref.replace(/\d+/g, '').split('').reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1 : cells.length;
        const t = c.getAttribute('t');
        const v = c.getElementsByTagNameNS(S, 'v')[0]?.textContent ?? '';
        cells[col] = t === 's' ? shared[+v] ?? '' : t === 'inlineStr' ? Array.from(c.getElementsByTagNameNS(S, 't')).map((x) => x.textContent).join('') : t === 'b' ? (v === '1' ? 'TRUE' : 'FALSE') : v;
      }
      table[r] = Array.from(cells, (v) => v ?? '');
    }
    const width = Math.max(0, ...table.filter(Boolean).map((r) => r.length));
    return { name: sh.getAttribute('name') ?? `Sheet${i + 1}`, table: Array.from(table, (r) => Array.from({ length: width }, (_, k) => r?.[k] ?? '')) };
  });
}
