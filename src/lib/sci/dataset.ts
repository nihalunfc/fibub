// Reading a pasted or opened table for the data-science tools: rows of text cells under unique column names,
// with the usual spellings of "missing" recognised. Plain TypeScript, no DOM.
import { parseCsv } from '../convert/table.ts';
import { num } from './num.ts';

/** Cells that count as missing (after trimming). */
export const MISSING = new Set(['', 'NA', 'N/A', 'n/a', 'na', 'NaN', 'nan', 'null', 'NULL', 'None', 'none', '#N/A', '?', '-', '.']);
export const isMissing = (s: string | undefined) => s == null || MISSING.has(s.trim());

export type Table = { head: string[]; rows: string[][]; headerGuessed: boolean };

/** A number in a cell, or NaN when the cell is missing or not a number. */
export const cellNumber = (s: string | undefined) => (isMissing(s) ? NaN : num(s));

/** Unique, non-empty column names. */
export function uniqueNames(head: string[]): string[] {
  const seen = new Set<string>();
  return head.map((h, i) => {
    const b = (h ?? '').trim() || `Column ${i + 1}`;
    let n = b, k = 2;
    while (seen.has(n.toLowerCase())) n = `${b}_${k++}`;
    seen.add(n.toLowerCase());
    return n;
  });
}

/**
 * Parse CSV, TSV or semicolon text (quotes allowed). The first row is taken as column names when any of its
 * cells is text; otherwise columns are named Column 1, Column 2 ... Rows are padded to the same width.
 */
export function readTable(text: string): Table {
  const raw = parseCsv(text.replace(/\r\n?/g, '\n')).map((r) => r.map((c) => (c ?? '').trim())).filter((r) => r.some((c) => c !== ''));
  if (!raw.length) return { head: [], rows: [], headerGuessed: false };
  const width = Math.max(...raw.map((r) => r.length));
  const pad = (r: string[]) => (r.length < width ? [...r, ...Array(width - r.length).fill('')] : r);
  const first = raw[0];
  const hasHead = first.some((c) => c !== '' && !isMissing(c) && Number.isNaN(num(c)));
  const head = uniqueNames(hasHead ? pad(first) : Array.from({ length: width }, (_, i) => `Column ${i + 1}`));
  return { head, rows: (hasHead ? raw.slice(1) : raw).map(pad), headerGuessed: !hasHead };
}

/** A small seeded random number generator (mulberry32), the same sequence on every device. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** CSV text for a table (quotes where needed). */
export const toCsvText = (head: string[], rows: (string | number)[][]) =>
  [head, ...rows].map((r) => r.map((c) => { const s = String(c); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n') + '\n';
