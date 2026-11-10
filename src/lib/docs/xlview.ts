// Excel viewer: reads .xlsx (via the file converter's reader) and CSV/TSV, notes hidden sheets, rows and columns, and
// writes one sheet as CSV or as a PDF that fits the page width and repeats the header row.
import { unzipSync, strFromU8 } from 'fflate';
import { parseCsv, toCsv, xlsxToTables, type Table } from '../convert/table';

export type Sheet = { name: string; hidden: boolean; table: Table; hiddenRows: Set<number>; hiddenCols: Set<number> };

const S = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const colIndex = (ref: string) => ref.replace(/\d+/g, '').split('').reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
export const colLetters = (i: number) => { let s = ''; for (i++; i; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s; return s; };

/** Hidden flags per sheet, in workbook order: { state, rows (0-based), cols (0-based) }. */
function hiddenInfo(data: Uint8Array) {
  const files = unzipSync(data);
  const read = (p: string) => (files[p] ? new DOMParser().parseFromString(strFromU8(files[p]), 'application/xml') : null);
  const wb = read('xl/workbook.xml'), rels = read('xl/_rels/workbook.xml.rels');
  const target = (id: string) => Array.from(rels?.getElementsByTagName('Relationship') ?? []).find((r) => r.getAttribute('Id') === id)?.getAttribute('Target') ?? '';
  return Array.from(wb?.getElementsByTagNameNS(S, 'sheet') ?? []).map((sh, i) => {
    const rid = sh.getAttribute('r:id') ?? sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') ?? '';
    let path = target(rid).replace(/^\//, '');
    path = path.startsWith('xl/') ? path : `xl/${path || `worksheets/sheet${i + 1}.xml`}`;
    const doc = read(path);
    const rows = new Set<number>(), cols = new Set<number>();
    for (const r of Array.from(doc?.getElementsByTagNameNS(S, 'row') ?? [])) if (/^(1|true)$/.test(r.getAttribute('hidden') ?? '')) rows.add(+(r.getAttribute('r') ?? 0) - 1);
    for (const c of Array.from(doc?.getElementsByTagNameNS(S, 'col') ?? [])) if (/^(1|true)$/.test(c.getAttribute('hidden') ?? '')) for (let k = +(c.getAttribute('min') ?? 0) - 1; k < Math.min(+(c.getAttribute('max') ?? 0), 16384); k++) cols.add(k);
    return { hidden: sh.getAttribute('state') === 'hidden' || sh.getAttribute('state') === 'veryHidden', rows, cols };
  });
}

export function readXlsx(data: Uint8Array): Sheet[] {
  const tables = xlsxToTables(data);
  const info = hiddenInfo(data);
  return tables.map((t, i) => ({ name: t.name, hidden: info[i]?.hidden ?? false, table: t.table, hiddenRows: info[i]?.rows ?? new Set(), hiddenCols: info[i]?.cols ?? new Set() }));
}

export function readCsv(text: string, name = 'Sheet1'): Sheet[] {
  const table = parseCsv(text).filter((r) => r.length > 1 || (r[0] ?? '') !== '');
  const width = Math.max(0, ...table.map((r) => r.length));
  return [{ name, hidden: false, table: table.map((r) => Array.from({ length: width }, (_, k) => r[k] ?? '')), hiddenRows: new Set(), hiddenCols: new Set() }];
}

/** Read a picked file. Throws a plain message the page shows. */
export async function readFile(f: File): Promise<Sheet[]> {
  const n = f.name.toLowerCase();
  if (/\.(xls|ods|numbers)$/.test(n)) throw new Error(`${f.name} is an older or non-Excel format. Open it in your spreadsheet program and save it as .xlsx or CSV, then choose it again.`);
  if (/\.xlsm?$/.test(n) || n.endsWith('.xlsx')) {
    try { return readXlsx(new Uint8Array(await f.arrayBuffer())); } catch { throw new Error(`${f.name} could not be read as an Excel file. It may be damaged or password-protected.`); }
  }
  if (/\.(csv|tsv|txt)$/.test(n)) return readCsv(await f.text(), f.name.replace(/\.[^.]+$/, ''));
  throw new Error('Choose an .xlsx, .csv or .tsv file.');
}

/** The cells to export: optionally without hidden rows and columns. */
export function visibleTable(s: Sheet, skipHidden: boolean): Table {
  if (!skipHidden) return s.table;
  const cols = (s.table[0] ?? []).map((_, i) => i).filter((i) => !s.hiddenCols.has(i));
  return s.table.filter((_, r) => !s.hiddenRows.has(r)).map((r) => cols.map((c) => r[c] ?? ''));
}

export const sheetCsv = (s: Sheet, skipHidden: boolean) => toCsv(visibleTable(s, skipHidden));

/** A PDF of the sheet: landscape pages, columns scaled to fit the width, the header row repeated on every page. */
export async function sheetPdf(s: Sheet, skipHidden: boolean, paper: 'a4' | 'letter', headerRow: boolean): Promise<{ bytes: Uint8Array; pages: number; lost: string[]; scale: number }> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const { pdfSafe } = await import('../resume/pdf');
  const t = visibleTable(s, skipHidden);
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [W, H] = paper === 'a4' ? [841.89, 595.28] : [792, 612];
  const M = 28, base = 9, pad = 3;
  const lost = new Set<string>();
  const safe = (v: string) => { const r = pdfSafe(v.replace(/[\r\n\t]+/g, ' ')); r.lost.forEach((c) => lost.add(c)); return r.text; };
  const cells = t.map((r) => r.map(safe));
  const ncol = Math.max(1, ...cells.map((r) => r.length));
  // Natural width of each column, up to 220 pt for long text.
  const nat = Array.from({ length: ncol }, (_, c) => Math.min(220, Math.max(24, bold.widthOfTextAtSize(cells[0]?.[c] ?? '', base) + pad * 2 + 1, ...cells.slice(0, 400).map((r) => font.widthOfTextAtSize(r[c] ?? '', base) + pad * 2 + 1))));
  const total = nat.reduce((a, b) => a + b, 0), avail = W - M * 2;
  const scale = Math.min(1, avail / total);
  const size = Math.max(3, base * scale), rowH = size * 1.6;
  const w = nat.map((x) => x * scale);
  const clip = (str: string, f: typeof font, max: number) => {
    if (f.widthOfTextAtSize(str, size) <= max) return str;
    let a = str;
    while (a.length > 1 && f.widthOfTextAtSize(a + '...', size) > max) a = a.slice(0, -1);
    return a + '...';
  };
  let page = doc.addPage([W, H]), y = H - M;
  doc.setTitle(`${s.name}`);
  const drawRow = (r: string[], head: boolean) => {
    let x = M;
    if (head) page.drawRectangle({ x: M, y: y - rowH, width: total * scale, height: rowH, color: rgb(0.92, 0.93, 0.95) });
    for (let c = 0; c < ncol; c++) {
      const v = clip(r[c] ?? '', head ? bold : font, w[c] - pad * 2 * scale);
      if (v) page.drawText(v, { x: x + pad * scale, y: y - rowH + size * 0.45, size, font: head ? bold : font, color: rgb(0.07, 0.09, 0.15) });
      x += w[c];
    }
    page.drawLine({ start: { x: M, y: y - rowH }, end: { x: M + total * scale, y: y - rowH }, thickness: 0.3, color: rgb(0.75, 0.77, 0.8) });
    y -= rowH;
  };
  cells.forEach((r, i) => {
    if (y - rowH < M) { page = doc.addPage([W, H]); y = H - M; if (headerRow && i > 0) drawRow(cells[0], true); }
    drawRow(r, headerRow && i === 0);
  });
  return { bytes: await doc.save(), pages: doc.getPageCount(), lost: [...lost], scale };
}
