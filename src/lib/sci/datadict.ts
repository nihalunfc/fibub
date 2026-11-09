// Data dictionary: for each column of a table, the type (integer, number, boolean, date, datetime or text), missing
// values, distinct values, range, mean, standard deviation, median, examples and, for categories, the allowed values.
// Exports as Markdown, CSV and a Frictionless Table Schema (JSON). Units are never guessed: the user types them.
// Plain TypeScript, no DOM.

export type ColType = 'integer' | 'number' | 'boolean' | 'date' | 'datetime' | 'string' | 'empty';
export type ColInfo = {
  name: string; type: ColType; format: string; rows: number; missing: number; filled: number; unique: number;
  min: number | string | null; max: number | string | null; mean: number | null; sd: number | null; median: number | null;
  minLen: number | null; maxLen: number | null; examples: string[]; allowed: [string, number][] | null;
  trueValues: string[]; falseValues: string[]; allUnique: boolean; note: string;
};
export type Meta = { title: string; description: string; unit: string };

export const DEFAULT_MISSING = ['', 'NA', 'N/A', 'n/a', 'NaN', 'nan', 'null', 'NULL', 'None', '#N/A'];

const INT = /^[-+]?(0|[1-9]\d*)$/;
const NUM = /^[-+]?((0|[1-9]\d*)(\.\d+)?|\.\d+|(0|[1-9]\d*)\.)([eE][-+]?\d+)?$/;
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATETIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(:(\d{2})(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;
const STRICT_DT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/; // Table Schema's default datetime format
const TRUE = ['true', 'yes', 'y', 't'], FALSE = ['false', 'no', 'n', 'f'];

function validDate(y: number, m: number, d: number) {
  if (m < 1 || m > 12 || d < 1) return false;
  const days = [31, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  return d <= days;
}
const isDate = (s: string) => { const m = DATE.exec(s); return !!m && validDate(+m[1], +m[2], +m[3]); };
const isDateTime = (s: string) => { const m = DATETIME.exec(s); return !!m && validDate(+m[1], +m[2], +m[3]) && +m[4] < 24 && +m[5] < 60 && (m[7] == null || +m[7] < 61); };

/** Unique, non-empty column names (blank ones become column_1 ...). */
export function columnNames(head: string[]): string[] {
  const seen = new Set<string>();
  return head.map((h, i) => { const b = h.trim() || `column_${i + 1}`; let n = b, k = 2; while (seen.has(n.toLowerCase())) n = `${b}_${k++}`; seen.add(n.toLowerCase()); return n; });
}

/** Describe every column. `rows` are the data rows (no header). Category: up to `maxCats` distinct values, each used more than once on average. */
export function describe(head: string[], rows: string[][], missingCodes: string[] = DEFAULT_MISSING, maxCats = 20): ColInfo[] {
  const miss = new Set(missingCodes.map((s) => s.trim()));
  miss.add('');
  const names = columnNames(head);
  return names.map((name, j) => {
    const vals: string[] = [];
    let missing = 0;
    for (const r of rows) { const v = (r[j] ?? '').trim(); if (miss.has(v)) missing++; else vals.push(v); }
    const freq = new Map<string, number>();
    for (const v of vals) freq.set(v, (freq.get(v) ?? 0) + 1);
    const info: ColInfo = { name, type: 'empty', format: 'default', rows: rows.length, missing, filled: vals.length, unique: freq.size, min: null, max: null, mean: null, sd: null, median: null, minLen: null, maxLen: null, examples: [...freq.keys()].slice(0, 3), allowed: null, trueValues: [], falseValues: [], allUnique: vals.length > 0 && freq.size === vals.length, note: '' };
    if (!vals.length) { info.note = 'Every cell is empty or a missing-value code.'; return info; }
    const lower = [...freq.keys()].map((v) => v.toLowerCase());
    if (vals.every((v) => INT.test(v))) info.type = 'integer';
    else if (vals.every((v) => NUM.test(v))) info.type = 'number';
    else if (lower.every((v) => TRUE.includes(v) || FALSE.includes(v)) && (freq.size > 1 || lower[0].length > 1)) info.type = 'boolean';
    else if (vals.every(isDate)) info.type = 'date';
    else if (vals.every((v) => isDate(v) || isDateTime(v))) { info.type = 'datetime'; if (!vals.every((v) => STRICT_DT.test(v))) info.format = 'any'; }
    else info.type = 'string';
    if (info.type === 'integer' || info.type === 'number') {
      const xs = vals.map(Number);
      let mean = 0, m2 = 0, n = 0, lo = Infinity, hi = -Infinity;
      for (const x of xs) { n++; const d = x - mean; mean += d / n; m2 += d * (x - mean); if (x < lo) lo = x; if (x > hi) hi = x; }
      info.min = lo; info.max = hi; info.mean = mean; info.sd = n > 1 ? Math.sqrt(m2 / (n - 1)) : null;
      const s = [...xs].sort((a, b) => a - b), h = s.length >> 1;
      info.median = s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
    } else if (info.type === 'date' || info.type === 'datetime') {
      const s = [...freq.keys()].sort();
      info.min = s[0]; info.max = s[s.length - 1];
    } else if (info.type === 'boolean') {
      info.trueValues = [...freq.keys()].filter((v) => TRUE.includes(v.toLowerCase()));
      info.falseValues = [...freq.keys()].filter((v) => FALSE.includes(v.toLowerCase()));
    }
    if (info.type === 'string') {
      const lens = vals.map((v) => [...v].length);
      info.minLen = Math.min(...lens); info.maxLen = Math.max(...lens);
      if (vals.every((v) => /^\d{1,2}[/.]\d{1,2}[/.]\d{2,4}$/.test(v))) info.note = 'Looks like dates written day/month or month/day. Write them as YYYY-MM-DD so they are not misread.';
      else if (vals.every((v) => /^\d+$/.test(v))) info.note = 'Whole numbers with leading zeros (codes such as 007) are kept as text, so the zeros are not lost.';
      else if (vals.every((v) => /^[-+]?\d{1,3}(,\d{3})+(\.\d+)?$|^[-+]?\d+(\.\d+)?$/.test(v))) info.note = 'Numbers with thousands commas are read as text. Remove the commas to make this a number column.';
    }
    // Categories: few distinct values, each used more than once on average.
    if ((info.type === 'string' || info.type === 'integer' || info.type === 'boolean') && freq.size <= maxCats && freq.size * 2 <= vals.length && !(info.type === 'integer' && freq.size > 10)) {
      info.allowed = [...freq.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
    }
    return info;
  });
}

const rN = (x: number | null, n: number) => (x == null || !Number.isFinite(x) ? '' : String(Number(x.toPrecision(n))));
const r6 = (x: number | null) => rN(x, 6);
const TYPE_TEXT: Record<ColType, string> = { integer: 'integer', number: 'number', boolean: 'true/false', date: 'date', datetime: 'date and time', string: 'text', empty: 'empty' };
export const typeText = (t: ColType) => TYPE_TEXT[t];

/** One row of the dictionary as plain cells. */
export function dictRow(c: ColInfo, m: Meta): Record<string, string> {
  const range = c.min == null ? (c.minLen != null ? (c.minLen === c.maxLen ? `${c.minLen} characters` : `${c.minLen} to ${c.maxLen} characters`) : '') : `${typeof c.min === 'number' ? r6(c.min) : c.min} to ${typeof c.max === 'number' ? r6(c.max as number) : c.max}`;
  const values = c.allowed ? c.allowed.map(([v, n]) => `${v} (${n})`).join(', ') : c.examples.join(', ');
  return {
    column: c.name, title: m.title, description: m.description, type: typeText(c.type), unit: m.unit,
    missing: String(c.missing), missing_pct: c.rows ? (Math.round((1000 * c.missing) / c.rows) / 10).toString() : '0', unique: String(c.unique),
    range, mean: r6(c.mean), sd: r6(c.sd), median: r6(c.median), values_kind: c.allowed ? 'allowed values (count)' : 'examples', values, note: c.note,
  };
}

const CSV_HEAD = ['column', 'title', 'description', 'type', 'unit', 'missing', 'missing_pct', 'unique', 'range', 'mean', 'sd', 'median', 'values_kind', 'values', 'note'];
const csvCell = (s: string) => (/[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
export function toCsv(cols: ColInfo[], meta: Meta[]): string {
  return [CSV_HEAD.join(','), ...cols.map((c, i) => { const r = dictRow(c, meta[i]); return CSV_HEAD.map((k) => csvCell(r[k])).join(','); })].join('\n') + '\n';
}

const md = (s: string) => s.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
export function toMarkdown(cols: ColInfo[], meta: Meta[], dataset = { name: '', description: '', rows: 0 }): string {
  const out: string[] = [];
  out.push(`# Data dictionary${dataset.name ? `: ${md(dataset.name)}` : ''}`, '');
  if (dataset.description.trim()) out.push(md(dataset.description.trim()), '');
  out.push(`${dataset.rows} rows, ${cols.length} columns.`, '');
  out.push('| Column | Type | Unit | Description | Missing | Unique | Range | Mean ± SD | Values |', '| --- | --- | --- | --- | ---: | ---: | --- | --- | --- |');
  cols.forEach((c, i) => {
    const r = dictRow(c, meta[i]);
    const ms = c.mean != null ? `${rN(c.mean, 4)}${c.sd != null ? ` ± ${rN(c.sd, 4)}` : ''}` : '';
    const vals = r.values ? `${c.allowed ? 'Allowed: ' : 'e.g. '}${r.values}` : '';
    out.push(`| ${md(c.name)}${meta[i].title ? ` (${md(meta[i].title)})` : ''} | ${r.type} | ${md(r.unit)} | ${md(r.description)}${r.note ? ` *${md(r.note)}*` : ''} | ${r.missing} (${r.missing_pct} %) | ${r.unique} | ${md(r.range)} | ${ms} | ${md(vals)} |`);
  });
  return out.join('\n') + '\n';
}

/** A Frictionless Table Schema (https://specs.frictionlessdata.io/table-schema/) for the table. */
export function toSchema(cols: ColInfo[], meta: Meta[], missingCodes: string[]): Record<string, unknown> {
  const fields = cols.map((c, i) => {
    const m = meta[i];
    const f: Record<string, unknown> = { name: c.name };
    if (m.title.trim()) f.title = m.title.trim();
    const d0 = m.description.trim();
    const desc = [d0 && m.unit.trim() && !/[.!?]$/.test(d0) ? d0 + '.' : d0, m.unit.trim() ? `Unit: ${m.unit.trim()}.` : ''].filter(Boolean).join(' ');
    if (desc) f.description = desc;
    f.type = c.type === 'empty' ? 'any' : c.type;
    if (c.format !== 'default') f.format = c.format;
    if (c.type === 'boolean') { f.trueValues = c.trueValues.length ? c.trueValues : ['true']; f.falseValues = c.falseValues.length ? c.falseValues : ['false']; }
    if (m.unit.trim()) f.unit = m.unit.trim();
    const cons: Record<string, unknown> = {};
    if (c.missing === 0 && c.rows > 0) cons.required = true;
    // Unique only for identifier-like columns (text or whole numbers with nothing missing), not measurements that happen to differ.
    if (c.allUnique && c.filled > 1 && c.missing === 0 && (c.type === 'string' || c.type === 'integer')) cons.unique = true;
    if (c.allowed && c.type !== 'boolean') cons.enum = c.allowed.map(([v]) => (c.type === 'integer' ? Number(v) : v)).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    if ((c.type === 'integer' || c.type === 'number' || c.type === 'date') && c.min != null) { cons.minimum = c.min; cons.maximum = c.max; }
    if (Object.keys(cons).length) f.constraints = cons;
    return f;
  });
  const missing = [...new Set(['', ...missingCodes.map((s) => s.trim())])];
  return { fields, missingValues: missing };
}

/** A made-up example: a small bird-count survey with the usual problems (missing values, a code with leading zeros). */
export const EXAMPLE = [
  'site_id,date,habitat,observer,temp_c,birds_seen,rain,plot_code,notes',
  'S01,2025-04-02,forest,AB,11.5,14,false,007,',
  'S02,2025-04-02,grassland,AB,13.0,9,false,012,windy',
  'S03,2025-04-03,wetland,CD,NA,22,true,031,',
  'S04,2025-04-03,forest,CD,10.2,17,true,044,fog until 9 am',
  'S05,2025-04-04,grassland,AB,15.8,6,false,052,',
  'S06,2025-04-04,wetland,EF,14.1,25,false,067,heron nest',
  'S07,2025-04-05,forest,EF,,12,false,071,',
  'S08,2025-04-05,grassland,CD,16.4,8,true,083,',
  'S09,2025-04-06,wetland,AB,12.9,NA,true,090,flooded path',
  'S10,2025-04-06,forest,EF,9.8,15,false,104,',
  'S11,2025-04-07,grassland,AB,17.2,7,false,118,',
  'S12,2025-04-07,wetland,CD,13.6,19,false,121,',
].join('\n');
