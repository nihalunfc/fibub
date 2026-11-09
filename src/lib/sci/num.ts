// Reading numbers people paste and writing them back sensibly.

/** A number typed or pasted by a person: accepts "1,5" (comma decimal), "1 234.5", "2.5e-3", "−3" (minus sign). NaN if it is not a number. */
export function num(s: string | null | undefined): number {
  if (s == null) return NaN;
  let t = String(s).trim().replace(/[−–]/g, '-').replace(/[\s  ']/g, '');
  if (!t) return NaN;
  // "1,5" is a decimal comma; "1,234.5" uses a thousands comma.
  if (/^-?\d+,\d+$/.test(t) && !/^-?\d{1,3},\d{3}$/.test(t)) t = t.replace(',', '.');
  else if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/,/g, '');
  t = t.replace(/[×x]10\^?/i, 'e').replace(/\*10\^/, 'e');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return NaN;
  return Number(t);
}

/**
 * A pasted table (from Excel, Sheets, a CSV file or plain text) as rows of cells. Tabs win, then
 * semicolons, then commas (unless commas are decimal marks), then runs of spaces.
 */
export function parseTable(text: string): string[][] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  if (!lines.length) return [];
  const sample = lines.slice(0, 20).join('\n');
  let sep: RegExp;
  if (sample.includes('\t')) sep = /\t/;
  else if (sample.includes(';')) sep = /;/;
  else if (/,/.test(sample) && !/\d,\d+[ \t]+\d/.test(sample)) sep = /,/;
  else sep = /\s+/;
  return lines.map((l) => l.split(sep).map((c) => c.trim().replace(/^"(.*)"$/, '$1')));
}

/** Columns of numbers from a pasted table. A first row that is not numeric becomes the headers. */
export function numericColumns(text: string): { headers: string[]; cols: number[][]; rows: number } {
  const rows = parseTable(text);
  if (!rows.length) return { headers: [], cols: [], rows: 0 };
  const width = Math.max(...rows.map((r) => r.length));
  const head = rows[0].some((c) => c !== '' && Number.isNaN(num(c)));
  const headers = Array.from({ length: width }, (_, i) => (head ? rows[0][i] || `Column ${i + 1}` : `Column ${i + 1}`));
  const body = head ? rows.slice(1) : rows;
  const cols = headers.map((_, i) => body.map((r) => num(r[i])));
  return { headers, cols, rows: body.length };
}

/** A number to n significant figures, as plain text (no exponent for everyday sizes). */
export function sig(x: number, n = 4): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '–';
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e6 || a < 1e-4) return fmtExp(x, n);
  const d = Math.max(0, n - 1 - Math.floor(Math.log10(a)));
  return x.toFixed(Math.min(d, 12)).replace(/\.?0+$/, (m) => (m.includes('.') ? '' : m)).replace('-', '−');
}
export function fmtExp(x: number, n = 4): string {
  const [m, e] = x.toExponential(n - 1).split('e');
  return `${m.replace(/\.?0+$/, '').replace('-', '−')} × 10${sup(Number(e))}`;
}
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
export const sup = (n: number) => String(n).split('').map((c) => SUP[c] ?? c).join('');

/**
 * A value and its uncertainty rounded the way lab reports want: the uncertainty to 2 significant
 * figures (1 if it starts with 3 to 9 is also common; we keep 2), the value to the same decimal place.
 * Returns plain strings for each, and the decimals used.
 */
export function roundPair(value: number, u: number): { v: string; u: string; exp: number } {
  if (!(u > 0) || !Number.isFinite(value)) return { v: sig(value, 6), u: sig(u, 2), exp: 0 };
  const e = Math.floor(Math.log10(u)) - 1; // last kept digit of u
  const big = Math.abs(value) >= 1e6 || u < 1e-4 || Math.abs(value) < 1e-4 && value !== 0;
  if (big) {
    const p = Math.floor(Math.log10(Math.max(Math.abs(value), u)));
    const s = 10 ** p, d = Math.max(0, p - e);
    return { v: (value / s).toFixed(d), u: (u / s).toFixed(d), exp: p };
  }
  const d = Math.max(0, -e);
  const r = (x: number) => (d > 0 ? x.toFixed(d) : String(Math.round(x / 10 ** e) * 10 ** e));
  return { v: r(value), u: r(u), exp: 0 };
}
/** "9.807 ± 0.012" or "(6.674 ± 0.015) × 10⁻¹¹". */
export function pm(value: number, u: number): string {
  const r = roundPair(value, u);
  const t = `${r.v.replace('-', '−')} ± ${r.u}`;
  return r.exp ? `(${t}) × 10${sup(r.exp)}` : t;
}

/** Text for a CSV file: quotes cells that need it. */
export const csv = (rows: (string | number)[][]) => rows.map((r) => r.map((c) => { const s = String(c); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n') + '\n';
