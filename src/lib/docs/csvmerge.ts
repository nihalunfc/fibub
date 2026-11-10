// Merge CSV: stack many CSV/XLSX tables into one (same columns or all columns), add a source-file column, and split
// one table into many files by the values of a column. The Excel reader is the file converter's.
import { strToU8 } from 'fflate';
import { parseCsv, toCsv, xlsxToTables, type Table } from '../convert/table';
import { fileName, zipFiles } from './mailmerge';

export type Input = { name: string; table: Table; note?: string };

export async function readInput(f: File): Promise<Input> {
  const n = f.name.toLowerCase();
  if (/\.(xls|ods|numbers)$/.test(n)) throw new Error(`${f.name} is an older or non-Excel format. Save it as .xlsx or CSV first.`);
  let table: Table, note = '';
  if (n.endsWith('.xlsx')) {
    let sheets;
    try { sheets = xlsxToTables(new Uint8Array(await f.arrayBuffer())); } catch { throw new Error(`${f.name} could not be read as an Excel file.`); }
    const used = sheets.find((s) => s.table.some((r) => r.some((c) => c.trim() !== '')));
    if (!used) throw new Error(`${f.name} has no data.`);
    if (sheets.length > 1) note = `used sheet "${used.name}" of ${sheets.length}`;
    table = used.table;
  } else if (/\.(csv|tsv|txt)$/.test(n)) table = parseCsv(await f.text());
  else throw new Error(`${f.name}: choose .csv, .tsv or .xlsx files.`);
  table = table.filter((r) => r.some((c) => c.trim() !== ''));
  if (!table.length) throw new Error(`${f.name} is empty.`);
  return { name: f.name, table, note };
}

const key = (h: string) => h.trim().toLowerCase();

export type MergeOpts = { mode: 'match' | 'union'; source: boolean; sourceName: string };
export type Merged = { table: Table; rows: number; problems: string[] };

/** Row 1 of each file is its header. "match": every file must have the first file's columns (any order). "union": all columns. */
export function mergeTables(inputs: Input[], o: MergeOpts): Merged {
  const problems: string[] = [];
  const heads = inputs.map((i) => i.table[0].map((h) => h.trim()));
  let cols: string[];
  if (o.mode === 'union') {
    cols = [];
    const seen = new Set<string>();
    for (const h of heads) for (const c of h) if (!seen.has(key(c))) { seen.add(key(c)); cols.push(c); }
  } else {
    cols = heads[0];
    const want = [...cols.map(key)].sort().join('\u0001');
    inputs.forEach((i, n) => { if ([...heads[n].map(key)].sort().join('\u0001') !== want) problems.push(`${i.name} has different columns from ${inputs[0].name}.`); });
    if (problems.length) return { table: [], rows: 0, problems };
  }
  const sname = o.sourceName.trim() || 'source_file';
  if (o.source && cols.some((c) => key(c) === key(sname))) problems.push(`A column called "${sname}" already exists; pick another name for the source column.`);
  if (problems.length) return { table: [], rows: 0, problems };
  const out: Table = [o.source ? [...cols, sname] : [...cols]];
  inputs.forEach((i, n) => {
    const idx = cols.map((c) => heads[n].findIndex((h) => key(h) === key(c)));
    for (const r of i.table.slice(1)) out.push([...idx.map((k) => (k < 0 ? '' : r[k] ?? '')), ...(o.source ? [i.name] : [])]);
  });
  return { table: out, rows: out.length - 1, problems };
}

/** One CSV per distinct value in the column, all in one ZIP. Returns the ZIP and the file names. */
export function splitBy(table: Table, col: number): { zip: Uint8Array; names: string[] } {
  const groups = new Map<string, string[][]>();
  for (const r of table.slice(1)) { const v = (r[col] ?? '').trim(); if (!groups.has(v)) groups.set(v, []); groups.get(v)!.push(r); }
  const used = new Set<string>(), files: Record<string, Uint8Array> = {};
  let i = 0;
  for (const [v, rows] of groups) files[fileName(v || 'blank', i++, used, 'csv')] = strToU8('﻿' + toCsv([table[0], ...rows]));
  return { zip: zipFiles(files), names: Object.keys(files) };
}

export { toCsv };
