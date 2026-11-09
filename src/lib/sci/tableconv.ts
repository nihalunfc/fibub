// Table converter: cells pasted from a spreadsheet (tabs) or a CSV file, written out as LaTeX (plain or booktabs,
// optional siunitx decimal alignment), Markdown (GitHub pipe tables) or HTML, with escaping, alignment and rounding.
// Plain TypeScript, no DOM.
import { parseDec, roundAt, roundSig, fixed, lead, type Dec } from './decimal.ts';

export type Sep = 'auto' | 'tab' | 'comma' | 'semicolon';
export type Align = 'auto' | 'left' | 'center' | 'right';
export type NumAlign = 'right' | 'decimal';
export type Rounding = { mode: 'asis' } | { mode: 'dp'; n: number } | { mode: 'sig'; n: number };
export type TableOpts = {
  header: boolean; align: Align; numAlign: NumAlign; round: Rounding;
  booktabs: boolean; caption: string; label: string; float: boolean; mathMinus: boolean;
};
export const DEFAULTS: TableOpts = { header: true, align: 'auto', numAlign: 'right', round: { mode: 'asis' }, booktabs: true, caption: '', label: '', float: true, mathMinus: true };

/** Which separator a pasted block uses: tabs (spreadsheets), then semicolons or commas, whichever splits more evenly. */
export function detectSep(text: string): 'tab' | 'comma' | 'semicolon' {
  const lines = text.split(/\r?\n/).filter((l) => l.trim()).slice(0, 30);
  if (lines.some((l) => l.includes('\t'))) return 'tab';
  const score = (ch: string) => { const counts = lines.map((l) => splitLine(l, ch).length); const min = Math.min(...counts); return min > 1 && counts.every((c) => c === counts[0]) ? 100 + min : min; };
  return score(';') > score(',') ? 'semicolon' : 'comma';
}
const splitLine = (l: string, ch: string) => parseDelimited(l, ch)[0] ?? [];

/** Rows of cells from delimited text. Quotes as in CSV ("a, b" and "" for a quote), also around tab-separated cells (Excel does this for cells with new lines). */
export function parseDelimited(text: string, sep: string): string[][] {
  text = text.replace(/^\ufeff/, '');
  const rows: string[][] = [];
  let row: string[] = [], cell = '', q = false, quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"' && cell.trim() === '' && !quoted) { q = true; quoted = true; cell = ''; }
    else if (c === sep) { row.push(quoted ? cell : cell.trim()); cell = ''; quoted = false; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(quoted ? cell : cell.trim()); rows.push(row); row = []; cell = ''; quoted = false;
    } else if (!(quoted && !q)) cell += c;
  }
  if (cell !== '' || row.length || quoted) { row.push(quoted ? cell : cell.trim()); rows.push(row); }
  // Drop blank rows, pad short rows, drop columns that are empty all the way down at the right.
  const kept = rows.filter((r) => r.some((c) => c.trim() !== ''));
  const width = Math.max(0, ...kept.map((r) => r.length));
  let w = width;
  while (w > 0 && kept.every((r) => (r[w - 1] ?? '').trim() === '')) w--;
  return kept.map((r) => Array.from({ length: w }, (_, j) => r[j] ?? ''));
}

export function readTable(text: string, sep: Sep = 'auto'): { rows: string[][]; sep: 'tab' | 'comma' | 'semicolon' } {
  const s = sep === 'auto' ? detectSep(text) : sep;
  return { rows: parseDelimited(text, s === 'tab' ? '\t' : s === 'comma' ? ',' : ';'), sep: s };
}

/** A cell after rounding: the text to show and, for numbers, the parsed value. */
export type Cell = { text: string; num: Dec | null; sci: { m: string; p: number } | null; pct: boolean; plain: string };

/** Read a cell: numbers (with an optional % sign) are rounded as asked; e-notation keeps its exponent. */
export function cellOf(raw: string, round: Rounding): Cell {
  const t = raw.trim();
  const pct = /%$/.test(t);
  const body = pct ? t.slice(0, -1).trim() : t;
  const x = body ? parseDec(body) : null;
  if (!x) return { text: raw.trim(), num: null, sci: null, pct: false, plain: '' };
  const m = /[eE]([-+−]?\d+)$/.exec(body);
  if (m) {
    // Keep scientific notation: round the mantissa.
    let p = Number(m[1].replace('−', '-'));
    const mant: Dec = { ...x, e: x.e - p };
    const rnd = (d: Dec) => (round.mode === 'dp' ? roundAt(d, -round.n) : round.mode === 'sig' ? roundSig(d, round.n) : d);
    let r = rnd(mant);
    // 9.995e-4 rounded to 2 places is 10.00e-4: write it as 1.00e-3.
    if (round.mode !== 'asis' && lead(mant) === 0 && lead(r) === 1) { r = rnd({ ...r, e: r.e - 1 }); p += 1; }
    const ms = fixed(r, round.mode === 'dp' ? round.n : Math.max(0, -r.e));
    return { text: `${ms}e${p}`, num: x, sci: { m: ms, p }, pct, plain: `${ms}e${p}` };
  }
  let r = x, minDec = Math.max(0, -x.e);
  // Keep the decimals as typed ("2.50" stays "2.50").
  const typedDec = /\.(\d*)/.exec(body.replace(/,/g, ''))?.[1].length ?? 0;
  minDec = typedDec;
  if (round.mode === 'dp') { r = roundAt(x, -round.n); minDec = round.n; }
  else if (round.mode === 'sig') { r = x.d ? roundSig(x, round.n) : x; minDec = r.d ? Math.max(0, -r.e) : Math.max(0, round.n - 1); }
  const plain = fixed(r, minDec);
  // As typed: keep the text (thousands commas and all), with a plain minus sign.
  const text = round.mode === 'asis' ? t.replace(/^[−–]/, '-') : plain + (pct ? '%' : '');
  return { text, num: r, sci: null, pct, plain };
}

export type Prepared = { head: string[] | null; body: Cell[][]; headCells: string[]; numeric: boolean[]; align: ('l' | 'c' | 'r')[]; width: number };

/** The table ready to write: header split off, numbers rounded, a column counts as numeric when every filled cell is a number. */
export function prepare(rows: string[][], o: TableOpts): Prepared {
  const head = o.header && rows.length ? rows[0] : null;
  const data = o.header ? rows.slice(1) : rows;
  const width = Math.max(0, ...rows.map((r) => r.length));
  const body = data.map((r) => Array.from({ length: width }, (_, j) => cellOf(r[j] ?? '', o.round)));
  const numeric = Array.from({ length: width }, (_, j) => {
    const filled = body.filter((r) => r[j].text !== '' && r[j].text !== '-' && r[j].text !== '–');
    return filled.length > 0 && filled.every((r) => r[j].num);
  });
  const align = numeric.map((n) => (o.align === 'auto' ? (n ? 'r' : 'l') : o.align === 'left' ? 'l' : o.align === 'center' ? 'c' : 'r')) as ('l' | 'c' | 'r')[];
  return { head, body, headCells: head ? Array.from({ length: width }, (_, j) => head[j] ?? '') : [], numeric, align, width };
}

// ---------------------------------------------------------------- number text per format

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = (n: number) => String(n).split('').map((c) => SUP[c] ?? c).join('');

/** Digits before and after the point, sign, for lining numbers up on the point. */
function shape(c: Cell): { int: number; dec: number; neg: boolean; exp: number; expNeg: boolean } {
  const t = c.sci ? c.sci.m : c.plain;
  const neg = t.startsWith('-');
  const u = t.replace(/^-/, '');
  const [i, d = ''] = u.split('.');
  return { int: i.length, dec: u.includes('.') ? d.length + 1 : 0, neg, exp: c.sci ? String(Math.abs(c.sci.p)).length : 0, expNeg: !!c.sci && c.sci.p < 0 };
}

// ---------------------------------------------------------------- LaTeX

const TEX_ESC: Record<string, string> = { '\\': '\\textbackslash{}', '&': '\\&', '%': '\\%', $: '\\$', '#': '\\#', _: '\\_', '{': '\\{', '}': '\\}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}', '<': '\\textless{}', '>': '\\textgreater{}' };
/** Text made safe for LaTeX: the ten special characters escaped; µ, °, ± and − written as commands. */
export function texEscape(s: string): string {
  return s.replace(/[\\&%$#_{}~^<>]/g, (c) => TEX_ESC[c]).replace(/µ|μ/g, '\\textmu{}').replace(/°/g, '\\textdegree{}').replace(/±/g, '\\ensuremath{\\pm}').replace(/−/g, '\\ensuremath{-}').replace(/×/g, '\\ensuremath{\\times}').replace(/\n/g, ' ');
}
function texNum(c: Cell, o: TableOpts): string {
  if (c.sci) return `$${c.sci.m.replace(/^-/, '-')} \\times 10^{${c.sci.p}}$${c.pct ? '\\%' : ''}`;
  const t = c.text;
  if (t.startsWith('-') && o.mathMinus) return `$-$${t.slice(1).replace(/%$/, '\\%')}`;
  return t.replace(/%$/, '\\%');
}

/** siunitx table-format for a numeric column, such as "-3.2e1". */
function siFormat(cells: Cell[]): string {
  let int = 1, dec = 0, neg = false, exp = 0, expNeg = false;
  for (const c of cells) { if (!c.num) continue; const s = shape(c); int = Math.max(int, s.int); dec = Math.max(dec, s.dec ? s.dec - 1 : 0); neg ||= s.neg; exp = Math.max(exp, s.exp); expNeg ||= s.expNeg; }
  return `${neg ? '-' : ''}${int}.${dec}${exp ? `e${expNeg ? '-' : ''}${exp}` : ''}`;
}

export function toLatex(p: Prepared, o: TableOpts): { text: string; packages: string[] } {
  const packages: string[] = [];
  const S = o.numAlign === 'decimal';
  const cols = p.align.map((a, j) => (S && p.numeric[j] ? `S[table-format=${siFormat(p.body.map((r) => r[j]))}]` : a));
  if (S && p.numeric.some(Boolean)) packages.push('siunitx');
  if (o.booktabs) packages.push('booktabs');
  const pct = p.numeric.map((n, j) => n && p.body.length > 0 && p.body.every((r) => !r[j].num || r[j].pct));
  const cell = (c: Cell, j: number) => {
    if (S && p.numeric[j]) return c.num ? (c.pct && !pct[j] ? `{${texNum(c, o)}}` : c.plain) : c.text ? `{${texEscape(c.text)}}` : '';
    return c.num ? texNum(c, o) : texEscape(c.text);
  };
  const lines: string[] = [];
  const top = o.booktabs ? '\\toprule' : '\\hline', mid = o.booktabs ? '\\midrule' : '\\hline', bot = o.booktabs ? '\\bottomrule' : '\\hline';
  const ind = o.float ? '  ' : '';
  if (o.float) {
    lines.push('\\begin{table}[htbp]', '  \\centering');
    if (o.caption.trim()) lines.push(`  \\caption{${texEscape(o.caption.trim())}}`);
    if (o.label.trim()) lines.push(`  \\label{${o.label.trim().replace(/[{}\\%#&$\s]/g, '')}}`);
  }
  lines.push(`${ind}\\begin{tabular}{${cols.join(o.booktabs ? ' ' : ' ')}}`, `${ind}  ${top}`);
  if (p.head) lines.push(`${ind}  ${p.headCells.map((h, j) => (S && p.numeric[j] ? `{${texEscape(h)}${pct[j] ? ' (\\%)' : ''}}` : texEscape(h))).join(' & ')} \\\\`, `${ind}  ${mid}`);
  for (const r of p.body) lines.push(`${ind}  ${r.map(cell).join(' & ')} \\\\`);
  lines.push(`${ind}  ${bot}`, `${ind}\\end{tabular}`);
  if (o.float) lines.push('\\end{table}');
  return { text: lines.join('\n') + '\n', packages };
}

// ---------------------------------------------------------------- Markdown

const FIG = '\u2007'; // figure space: as wide as a digit
/** Numbers padded with figure spaces so the decimal points line up in a right-aligned column. */
function padDecimals(cells: Cell[], texts: string[]): string[] {
  const dec = Math.max(0, ...cells.map((c) => (c.num && !c.sci ? shape(c).dec : 0)));
  // A missing decimal point is padded with a punctuation space (as wide as "."), missing digits with figure spaces.
  return texts.map((t, i) => { if (!cells[i].num || cells[i].sci) return t; const own = shape(cells[i]).dec; return t + (own === 0 && dec > 0 ? '\u2008' + FIG.repeat(dec - 1) : FIG.repeat(dec - own)); });
}
const mdEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ');
function plainNum(c: Cell, html: boolean): string {
  if (c.sci) { const m = c.sci.m.replace(/^-/, '−'); return html ? `${m} × 10<sup>${String(c.sci.p).replace('-', '−')}</sup>${c.pct ? '%' : ''}` : `${m} × 10${sup(c.sci.p)}${c.pct ? '%' : ''}`; }
  return c.text.replace(/^-/, '−');
}

export function toMarkdown(p: Prepared, o: TableOpts): string {
  const cols = p.width;
  const cellsByCol = Array.from({ length: cols }, (_, j) => p.body.map((r) => r[j]));
  const textByCol = cellsByCol.map((cs, j) => {
    const t = cs.map((c) => (c.num ? plainNum(c, false) : mdEscape(c.text)));
    return o.numAlign === 'decimal' && p.numeric[j] ? padDecimals(cs, t) : t;
  });
  const head = p.head ? p.headCells.map(mdEscape) : Array.from({ length: cols }, () => '');
  const w = Array.from({ length: cols }, (_, j) => Math.max(3, [...head[j]].length, ...textByCol[j].map((t) => [...t].length)));
  const pad = (s: string, j: number) => { const n = w[j] - [...s].length; const a = p.align[j]; return a === 'r' ? ' '.repeat(n) + s : a === 'c' ? ' '.repeat(Math.floor(n / 2)) + s + ' '.repeat(Math.ceil(n / 2)) : s + ' '.repeat(n); };
  const rule = p.align.map((a, j) => (a === 'r' ? '-'.repeat(w[j] - 1) + ':' : a === 'c' ? ':' + '-'.repeat(w[j] - 2) + ':' : ':' + '-'.repeat(w[j] - 1)));
  const line = (cells: string[]) => `| ${cells.map(pad).join(' | ')} |`;
  const out = [line(head), `| ${rule.join(' | ')} |`];
  for (let i = 0; i < p.body.length; i++) out.push(line(textByCol.map((c) => c[i])));
  let text = out.join('\n') + '\n';
  if (o.caption.trim()) text = `**${mdEscape(o.caption.trim())}**\n\n` + text;
  return text;
}

// ---------------------------------------------------------------- HTML

const htmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function toHtml(p: Prepared, o: TableOpts): string {
  const st = (a: string) => (a === 'r' ? ' style="text-align:right"' : a === 'c' ? ' style="text-align:center"' : '');
  const cols = p.width;
  const textByCol = Array.from({ length: cols }, (_, j) => {
    const cs = p.body.map((r) => r[j]);
    const t = cs.map((c) => (c.num ? plainNum(c, true) : htmlEscape(c.text)));
    return o.numAlign === 'decimal' && p.numeric[j] ? padDecimals(cs, t) : t;
  });
  const lines: string[] = ['<table>'];
  if (o.caption.trim()) lines.push(`  <caption>${htmlEscape(o.caption.trim())}</caption>`);
  if (p.head) {
    lines.push('  <thead>', `    <tr>${p.headCells.map((h, j) => `<th scope="col"${st(p.align[j])}>${htmlEscape(h)}</th>`).join('')}</tr>`, '  </thead>');
  }
  lines.push('  <tbody>');
  for (let i = 0; i < p.body.length; i++) lines.push(`    <tr>${textByCol.map((c, j) => `<td${st(p.align[j])}>${c[i]}</td>`).join('')}</tr>`);
  lines.push('  </tbody>', '</table>');
  const id = o.label.trim().replace(/[^A-Za-z0-9_:.-]/g, '-');
  if (id) lines[0] = `<table id="${id}">`;
  return lines.join('\n') + '\n';
}
