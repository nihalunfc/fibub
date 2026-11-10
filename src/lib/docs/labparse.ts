// Read lab-report text into rows (test, value, unit, printed range). Plain TypeScript, no DOM.
// A range is only ever the one printed on the report itself; nothing is added here.

export type Flag = 'below' | 'above' | 'within' | 'none';
export interface Row {
  test: string;
  value: string;       // as printed, e.g. "13.5" or "<0.5"
  num: number;         // NaN if the value has no number
  unit: string;
  low: number | null;  // lower end of the printed range
  high: number | null; // upper end of the printed range
  rangeText: string;   // as printed, e.g. "13.0 - 17.0" or "< 200"
  flag: Flag;
  line: string;        // the original line, so mistakes can be checked
}

const NUM = String.raw`\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?`;
const toNum = (s: string) => parseFloat(s.replace(/,/g, ''));
const SKIP = /^(page|date|age|dob|phone|tel|telephone|fax|ref|reference|report|sample|specimen|patient|id|lab no|collected|collection|received|reported|accession|mobile|time|pin|sex|gender|doctor|dr|address|registered|printed|visit|bill|invoice)\b/i;
const UNIT_WORDS = /^(fl|pg|g|mg|mmol|umol|µmol|μmol|iu|u|meq|ng|ml|mm|sec|secs|s|ratio|cells|mosm|mmhg|kg|ug|µg|μg|mcg|index|titre|score)$/i;
const FLAGS = /^(h|l|hh|ll|high|low|abnormal|normal|\*+)$/i;
const SCI = String.raw`(?:[x×]\s?)?10(?:\s?[\^*Ee]\s?\d+|[¹²³⁴⁵⁶⁷⁸⁹]+)\s?\/\s?[A-Za-zµμ]+`;
const UNIT = String.raw`${SCI}|[A-Za-zµμ%][A-Za-zµμ%0-9\/\^\.\*³⁹]*`;
// name, value, optional unit, rest of line
const LINE = new RegExp(String.raw`^([A-Za-z][A-Za-z0-9 ,()/'.:%+\-]*?[A-Za-z0-9)%])\s+([<>≤≥]?\s?(?:${NUM}))(?=\s|$|%|\*)\s*(.*)$`);

export function rangeOf(text: string): { low: number | null; high: number | null; rangeText: string } {
  const t = text.replace(/[()\[\]]/g, ' ').replace(/\b(ref(erence)?\.?|range|normal|biological|interval|bio)\b:?/gi, ' ').replace(/\s+/g, ' ').trim();
  let m = t.match(new RegExp(String.raw`(${NUM})\s*(?:[-–—]|to)\s*(${NUM})`, 'i'));
  if (m) {
    const a = toNum(m[1]), b = toNum(m[2]);
    if (a <= b) return { low: a, high: b, rangeText: m[0].trim() };
  }
  m = t.match(new RegExp(String.raw`(<|≤|<=)\s*(${NUM})`));
  if (m) return { low: null, high: toNum(m[2]), rangeText: `${m[1]} ${m[2]}` };
  m = t.match(new RegExp(String.raw`(>|≥|>=)\s*(${NUM})`));
  if (m) return { low: toNum(m[2]), high: null, rangeText: `${m[1]} ${m[2]}` };
  return { low: null, high: null, rangeText: '' };
}

/** Compare a value only with the range printed on the report. "<200" means the report wants a value under 200. */
export function flagFor(num: number, low: number | null, high: number | null, rangeText = ''): Flag {
  if (!Number.isFinite(num) || (low === null && high === null)) return 'none';
  const strictHigh = /^</.test(rangeText) && !/^<=|^≤/.test(rangeText), strictLow = /^>/.test(rangeText) && !/^>=|^≥/.test(rangeText);
  if (low !== null && (strictLow ? num <= low : num < low)) return 'below';
  if (high !== null && (strictHigh ? num >= high : num > high)) return 'above';
  return 'within';
}

/** Parse the numbers in a range typed by hand, e.g. "3.5-5.0" or "< 200". */
export function parseRangeText(text: string) {
  const r = rangeOf(text);
  return r;
}

export function parseLine(raw: string): Row | null {
  let s = raw.replace(/[\t ]+/g, ' ').replace(/\s{2,}/g, ' ').trim().replace(/^\d+[.)]\s+/, '');
  if (!s || s.length > 200) return null;
  const m = s.match(LINE);
  if (!m) return null;
  const test = m[1].replace(/[:.\s]+$/, '').trim();
  if (test.length < 2 || SKIP.test(test)) return null;
  const value = m[2].replace(/\s+/g, '');
  let rest = m[3].trim(), unit = '';
  const u = rest.match(new RegExp(`^(?:${UNIT})`));
  if (u) {
    const cand = u[0].replace(/[.,;]+$/, '');
    if (!FLAGS.test(cand) && (/[\/%]/.test(cand) || /^[x×]?\s?10/.test(cand) || UNIT_WORDS.test(cand))) { unit = cand; rest = rest.slice(u[0].length).trim(); }
    else if (FLAGS.test(cand)) rest = rest.slice(u[0].length).trim();
  }
  rest = rest.replace(/^(?:(?:h|l|hh|ll|high|low|\*+)\s+)+/i, '');
  const { low, high, rangeText } = rangeOf(rest);
  if (!unit && !rangeText) return null;
  const num = toNum(value.replace(/^[<>≤≥]/, ''));
  const flag = /^[<>≤≥]/.test(value) ? 'none' : flagFor(num, low, high, rangeText);
  return { test, value, num, unit, low, high, rangeText, flag, line: raw.trim() };
}

export function parseLabText(text: string): Row[] {
  const rows: Row[] = [];
  for (const line of text.split(/\r?\n/)) { const r = parseLine(line); if (r) rows.push(r); }
  return rows;
}

// ---------- dates (also used by the records organiser) ----------
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const iso = (y: number, m: number, d: number) => {
  if (y < 1950 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const t = new Date(Date.UTC(y, m - 1, d));
  if (t.getUTCMonth() !== m - 1) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};
const monthNo = (s: string) => MONTHS.indexOf(s.slice(0, 3).toLowerCase()) + 1;

/** First date-like string in the text: 2026-03-14, 14/03/2026, 14 Mar 2026, Mar 14, 2026. */
export function findDate(text: string, dayFirst = true): { iso: string; raw: string } | null {
  const pats: [RegExp, (m: RegExpMatchArray) => string | null][] = [
    [/(?<!\d)(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?!\d)/, (m) => iso(+m[1], +m[2], +m[3])],
    [/(?<!\d)(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})(?!\d)/, (m) => (dayFirst ? iso(+m[3], +m[2], +m[1]) : iso(+m[3], +m[1], +m[2])) || (dayFirst ? iso(+m[3], +m[1], +m[2]) : iso(+m[3], +m[2], +m[1]))],
    [/(?<!\d)(\d{1,2})(?:st|nd|rd|th)?[\s\-]+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?[\s\-]+(\d{4})(?!\d)/i, (m) => iso(+m[3], monthNo(m[2]), +m[1])],
    [/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})(?!\d)/i, (m) => iso(+m[3], monthNo(m[1]), +m[2])],
  ];
  let best: { iso: string; raw: string; at: number } | null = null;
  for (const [re, f] of pats) {
    const g = new RegExp(re.source, re.flags + 'g');
    for (const m of text.matchAll(g)) {
      const d = f(m);
      if (d) { if (!best || (m.index ?? 0) < best.at) best = { iso: d, raw: m[0], at: m.index ?? 0 }; break; }
    }
  }
  return best ? { iso: best.iso, raw: best.raw } : null;
}

/** A date typed into a table cell: ISO, "14 Mar 2026" or 14/03/2026 (day first unless told otherwise). */
export function parseDate(s: string, dayFirst = true): string | null {
  return findDate(s.trim(), dayFirst)?.iso ?? null;
}

// ---------- tracker file format ----------
export const TRACKER_HEAD = ['date', 'test', 'value', 'unit', 'low', 'high', 'lab'];
