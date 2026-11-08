// Reading a data file the user picks (CSV, TSV, TXT or Excel .xlsx) into tab-separated text for the paste boxes of
// the science tools, with clear limits on file size, columns and rows. Everything stays in the browser.
import { parseCsv } from './convert/table';

export type Limits = { maxBytes: number; maxCols: number; maxRows: number };
export type DataFileResult = { text: string; rows: number; cols: number; notes: string[] };

export const ACCEPT = '.csv,.tsv,.txt,.dat,.xlsx,text/csv,text/plain,text/tab-separated-values,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const mb = (b: number) => `${+(b / 1e6).toFixed(1)} MB`;
/** The one-line limit text shown next to an upload button. */
export const limitText = (l: Limits) => `CSV, TSV, TXT or Excel (.xlsx), up to ${mb(l.maxBytes)}, ${l.maxCols} columns and ${l.maxRows.toLocaleString('en')} rows.`;

/** Read a picked file into tab-separated text. Throws an Error with a plain message the page can show. */
export async function readDataFile(f: File, l: Limits): Promise<DataFileResult> {
  const name = f.name.toLowerCase(), notes: string[] = [];
  if (f.size > l.maxBytes) throw new Error(`${f.name} is ${mb(f.size)}; this tool takes files up to ${mb(l.maxBytes)}. Delete rows or columns you don't need, or save only the part you want to use.`);
  if (/\.(xls|ods|numbers)$/.test(name)) throw new Error(`${f.name} is an older or non-Excel spreadsheet format. Save it as .xlsx or CSV first (File, Save as).`);
  let table: string[][];
  if (name.endsWith('.xlsx')) {
    const { xlsxToTables } = await import('./convert/table');
    let sheets;
    try { sheets = xlsxToTables(new Uint8Array(await f.arrayBuffer())); } catch { throw new Error(`${f.name} could not be read as an Excel file. Try saving it again as .xlsx or CSV.`); }
    const used = sheets.find((s) => s.table.some((r) => r.some((c) => c.trim() !== '')));
    if (!used) throw new Error(`${f.name} has no data in any sheet.`);
    if (sheets.length > 1) notes.push(`Used the sheet "${used.name}" (the first with data; the file has ${sheets.length} sheets).`);
    table = used.table;
  } else {
    let text = await f.text();
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    if (/\u0000/.test(text.slice(0, 2000))) throw new Error(`${f.name} is not a text file. Use CSV, TSV, TXT or Excel (.xlsx).`);
    const first = text.split(/\r?\n/, 20).join('\n');
    // Tabs, semicolons or commas: let parseCsv handle quoted commas; split tabs and semicolons directly.
    if (name.endsWith('.tsv') || first.includes('\t')) table = text.split(/\r?\n/).map((r) => r.split('\t'));
    else if (first.includes(';') && !first.includes(',')) table = text.split(/\r?\n/).map((r) => r.split(';'));
    else if (first.includes(',')) table = parseCsv(text);
    else table = text.split(/\r?\n/).map((r) => r.trim().split(/\s+/));
  }
  table = table.map((r) => r.map((c) => (c ?? '').replace(/[\t\r\n]+/g, ' ').trim())).filter((r) => r.some((c) => c !== ''));
  if (!table.length) throw new Error(`${f.name} is empty.`);
  // Drop columns that are empty all the way down (common at the right of spreadsheets).
  const width = Math.max(...table.map((r) => r.length));
  const keep = Array.from({ length: width }, (_, i) => i).filter((i) => table.some((r) => (r[i] ?? '') !== ''));
  let cols = keep.length;
  if (cols > l.maxCols) { notes.push(`The file has ${cols} columns; only the first ${l.maxCols} are used (this tool's limit).`); keep.length = l.maxCols; cols = l.maxCols; }
  let rows = table.length;
  if (rows > l.maxRows + 1) { notes.push(`The file has ${(rows - 1).toLocaleString('en')} data rows; only the first ${l.maxRows.toLocaleString('en')} are used (this tool's limit).`); table = table.slice(0, l.maxRows + 1); rows = table.length; }
  const text = table.map((r) => keep.map((i) => r[i] ?? '').join('\t')).join('\n');
  return { text, rows, cols, notes };
}
