// Sample label maker maths: Code 128 barcodes, reading a sample list, and placing labels on a sheet. No DOM.
// Sheet sizes are typed by the user; the presets in the page are rounded examples to measure against.

// Code 128 bar and space widths for symbol values 0..105 and the stop pattern (106), from the standard.
const C128 = ['212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213', '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132', '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211', '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313', '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331', '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111', '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214', '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111', '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141', '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141', '114131', '311141', '411131', '211412', '211214', '211232', '2331112'];
export const C128_PATTERNS = C128;
const START_B = 104, START_C = 105, CODE_B = 100, CODE_C = 99, STOP = 106;

/**
 * Code 128 symbol values for printable ASCII text (32..126), using code set C for runs of 4 or more digits (or a whole
 * text of 2+ even digits) and code set B otherwise. Includes start, check symbol and stop.
 */
export function code128Values(text: string): number[] {
  if (!text.length) throw new Error('Nothing to encode.');
  for (const ch of text) { const c = ch.charCodeAt(0); if (c < 32 || c > 126) throw new Error(`Code 128 here takes plain ASCII letters, digits and symbols; "${ch}" is not one. Use the QR code for other characters.`); }
  const digitsAt = (i: number) => { let n = 0; while (i + n < text.length && text[i + n] >= '0' && text[i + n] <= '9') n++; return n; };
  const out: number[] = [];
  let set: 'B' | 'C', i = 0;
  const d0 = digitsAt(0);
  if (d0 >= 4 || (d0 === text.length && d0 >= 2)) { set = 'C'; out.push(START_C); } else { set = 'B'; out.push(START_B); }
  while (i < text.length) {
    const d = digitsAt(i);
    if (set === 'C') {
      if (d >= 2) { out.push(Number(text.slice(i, i + 2))); i += 2; continue; }
      set = 'B'; out.push(CODE_B); continue;
    }
    // In B: switch to C for a run of 4+ digits that is even, or that runs to the end (odd runs keep one digit in B first).
    if (d >= 4 && (d % 2 === 0 || i + d === text.length || d >= 5)) {
      if (d % 2 === 1) { out.push(text.charCodeAt(i) - 32); i++; }
      set = 'C'; out.push(CODE_C); continue;
    }
    out.push(text.charCodeAt(i) - 32); i++;
  }
  let sum = out[0];
  for (let k = 1; k < out.length; k++) sum += out[k] * k;
  out.push(sum % 103, STOP);
  return out;
}
/** Bars as module widths: alternating bar, space, bar ... starting and ending with a bar. */
export const code128Widths = (text: string) => code128Values(text).map((v) => C128[v]).join('').split('').map(Number);
/** Total width in modules, without the quiet zones (10 modules each side are needed). */
export const code128Modules = (text: string) => code128Widths(text).reduce((a, b) => a + b, 0);

// ---------- Sample list ----------
export type Table = { head: string[]; rows: string[][] };
/** A pasted list: with a header row if the first row has no digits in its first cell or the user says so. Tabs, commas or semicolons. */
export function readList(text: string, header: boolean): Table | string {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return 'Paste or type at least one sample.';
  const sep = lines[0].includes('\t') ? '\t' : lines[0].includes(';') && !lines[0].includes(',') ? ';' : ',';
  const split = (l: string) => { const out: string[] = []; let cur = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; } else if (c === '"') q = true; else if (c === sep) { out.push(cur.trim()); cur = ''; } else cur += c; } out.push(cur.trim()); return out; };
  const all = lines.map(split), n = Math.max(...all.map((r) => r.length));
  const head = header ? all[0].map((h, i) => h || `Column ${i + 1}`) : Array.from({ length: n }, (_, i) => `Column ${i + 1}`);
  while (head.length < n) head.push(`Column ${head.length + 1}`);
  const rows = (header ? all.slice(1) : all).map((r) => head.map((_, i) => r[i] ?? ''));
  if (!rows.length) return 'There is a header row but no samples under it.';
  if (rows.length > 5000) return 'Up to 5000 samples at a time, please.';
  return { head, rows };
}

// ---------- Sheet ----------
export type Sheet = { pageW: number; pageH: number; cols: number; rows: number; labelW: number; labelH: number; left: number; top: number; pitchX: number; pitchY: number };
/** Check a sheet layout fits on its page. Returns a message or ''. */
export function sheetProblem(s: Sheet): string {
  const v = [s.pageW, s.pageH, s.labelW, s.labelH, s.pitchX, s.pitchY];
  if (!v.every((x) => x > 0) || !(s.left >= 0 && s.top >= 0)) return 'Page, label and pitch sizes must be above 0 mm, and margins 0 or more.';
  if (!(Number.isInteger(s.cols) && Number.isInteger(s.rows) && s.cols >= 1 && s.rows >= 1 && s.cols * s.rows <= 400)) return 'Use whole numbers of columns and rows (up to 400 labels a sheet).';
  if (s.cols > 1 && s.pitchX < s.labelW - 1e-9) return 'The across pitch (label start to next label start) is smaller than the label width.';
  if (s.rows > 1 && s.pitchY < s.labelH - 1e-9) return 'The down pitch is smaller than the label height.';
  if (s.left + (s.cols - 1) * s.pitchX + s.labelW > s.pageW + 0.05) return `The labels run ${(s.left + (s.cols - 1) * s.pitchX + s.labelW - s.pageW).toFixed(1)} mm off the right of the page.`;
  if (s.top + (s.rows - 1) * s.pitchY + s.labelH > s.pageH + 0.05) return `The labels run ${(s.top + (s.rows - 1) * s.pitchY + s.labelH - s.pageH).toFixed(1)} mm off the bottom of the page.`;
  return '';
}
/** Where label number k (0-based, after `skip` used labels) goes: page and top-left corner in mm. Filled row by row. */
export function place(s: Sheet, k: number, skip = 0) {
  const per = s.cols * s.rows, n = k + skip, page = Math.floor(n / per), i = n % per, r = Math.floor(i / s.cols), c = i % s.cols;
  return { page, x: s.left + c * s.pitchX, y: s.top + r * s.pitchY };
}
export const pagesNeeded = (s: Sheet, n: number, skip = 0) => Math.ceil((n + skip) / (s.cols * s.rows));
/** Fill in the gaps that make a sheet centred on the page (margins equal on both sides). */
export function centredMargins(s: Sheet) { return { left: (s.pageW - (s.cols - 1) * s.pitchX - s.labelW) / 2, top: (s.pageH - (s.rows - 1) * s.pitchY - s.labelH) / 2 }; }
