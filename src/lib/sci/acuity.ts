// Visual acuity notations and conversions. Every notation is a function of logMAR, the log10 of the minimum
// angle of resolution in minutes of arc (Bailey and Lovie 1976; Ferris et al. 1982):
//   MAR = 10^logMAR, decimal = 1 / MAR, Snellen 20/x with x = 20 × MAR, 6/y with y = 6 × MAR,
//   VAS = 100 − 50 × logMAR (Colenbrander's Visual Acuity Score), ETDRS letters = 85 − 50 × logMAR
//   (Beck et al. 2003; Gregori et al. 2010), and 0.02 logMAR per letter on a 5-letter line.
import { num } from './num.ts';

export type Kind = 'snellen' | 'decimal' | 'logmar' | 'mar' | 'vas' | 'letters';
export const KINDS: Kind[] = ['decimal', 'logmar', 'mar', 'vas', 'letters'];
export const KIND_NAMES: Record<Kind, string> = { snellen: 'Snellen fraction', decimal: 'Decimal', logmar: 'logMAR', mar: 'MAR (minutes of arc)', vas: 'VAS (Visual Acuity Score)', letters: 'ETDRS letters' };

export type Acuity = { logmar: number; mar: number; decimal: number; feet: number; metres: number; vas: number; letters: number };

export function fromLogMAR(logmar: number): Acuity {
  const mar = 10 ** logmar;
  return { logmar, mar, decimal: 1 / mar, feet: 20 * mar, metres: 6 * mar, vas: 100 - 50 * logmar, letters: 85 - 50 * logmar };
}
/** logMAR from any notation. Snellen takes the test distance and the line size, plus letters read beyond (+) or missed on (−) that line. */
export function toLogMAR(kind: Kind, v: number, size = NaN, letters = 0, perLetter = 0.02): number {
  switch (kind) {
    case 'snellen': return Math.log10(size / v) - perLetter * letters;
    case 'decimal': return -Math.log10(v);
    case 'mar': return Math.log10(v);
    case 'logmar': return v;
    case 'vas': return (100 - v) / 50;
    case 'letters': return (85 - v) / 50;
  }
}

export type Parsed = { label: string; text: string; kind: Kind; logmar: number; note: string } | { label: string; text: string; error: string };

const PREFIX: [RegExp, Kind][] = [
  [/^log\s*mar/i, 'logmar'], [/^mar/i, 'mar'], [/^vas/i, 'vas'], [/^(etdrs\s*)?letters?|^etdrs/i, 'letters'], [/^dec(imal)?/i, 'decimal'],
];

/** Read one typed value: 20/40, 6/12+2, 0.5, "logMAR 0.3", "VAS 85", "letters 70". Plain numbers are read as `plain`. */
export function parseValue(raw: string, plain: Kind = 'decimal', label = '', perLetter = 0.02): Parsed {
  const text = raw.trim();
  let t = text.replace(/[−–]/g, '-');
  const frac = /^(\d+(?:[.,]\d+)?)\s*(?:ft|m)?\s*\/\s*(\d+(?:[.,]\d+)?)\s*(?:([+-])\s*(\d+))?$/i.exec(t);
  if (frac) {
    const d = num(frac[1]), s = num(frac[2]), k = frac[3] ? (frac[3] === '-' ? -1 : 1) * Number(frac[4]) : 0;
    if (!(d > 0) || !(s > 0)) return { label, text, error: `"${text}": both numbers of a fraction must be above 0` };
    if (Math.abs(k) > 10) return { label, text, error: `"${text}": more than 10 letters ± is unlikely; use the next line instead` };
    return { label, text, kind: 'snellen', logmar: toLogMAR('snellen', d, s, k, perLetter), note: '' };
  }
  let kind = plain;
  for (const [re, k] of PREFIX) { const m = re.exec(t); if (m) { kind = k; t = t.slice(m[0].length).replace(/^\s*[:=]?\s*/, ''); break; } }
  const v = num(t);
  if (!Number.isFinite(v)) return { label, text, error: `"${text}" is not an acuity value (try 20/40, 6/12, 0.5 or logMAR 0.3)` };
  if ((kind === 'decimal' || kind === 'mar') && !(v > 0)) return { label, text, error: `"${text}": a ${KIND_NAMES[kind]} value must be above 0` };
  const logmar = toLogMAR(kind, v);
  const note = logmar < -0.5 || logmar > 2 ? 'Outside the usual chart range (logMAR −0.3 to 1.6): check the value and its notation' : '';
  return { label, text, kind, logmar, note };
}

/** Read many values: one or more per line, separated by commas, tabs or semicolons; a first cell that is not a value is a label. */
export function parseMany(text: string, plain: Kind = 'decimal', perLetter = 0.02): Parsed[] {
  const out: Parsed[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    let cells = line.split(/[\t;,]/).map((c) => c.trim()).filter(Boolean);
    let label = '';
    if (cells.length > 1 && 'error' in parseValue(cells[0], plain)) { label = cells[0]; cells = cells.slice(1); }
    else if (cells.length === 1) {
      // "Right eye 20/40": words before the value.
      const m = /^(.*?[A-Za-z)][^\d]*?)\s+((?:log\s*mar|mar|vas|letters?|etdrs|dec(?:imal)?)?\s*[:=]?\s*[-−]?[\d.,]+\s*(?:\/\s*[\d.,]+\s*(?:[+-−]\s*\d+)?)?)$/i.exec(cells[0]);
      if (m && 'error' in parseValue(cells[0], plain) && !('error' in parseValue(m[2], plain))) { label = m[1].replace(/[:\s]+$/, ''); cells = [m[2]]; }
    }
    cells.forEach((c, i) => out.push(parseValue(c, plain, label ? (cells.length > 1 ? `${label} ${i + 1}` : label) : '', perLetter)));
  });
  return out;
}

/** Nominal chart labels for logMAR lines in 0.1 steps (the rounded values printed on charts). */
const FEET: Record<number, string> = { [-3]: '10', [-2]: '12.5', [-1]: '16', 0: '20', 1: '25', 2: '32', 3: '40', 4: '50', 5: '63', 6: '80', 7: '100', 8: '125', 9: '160', 10: '200', 11: '250', 12: '320', 13: '400' };
const METRES: Record<number, string> = { [-3]: '3', [-2]: '3.8', [-1]: '4.8', 0: '6', 1: '7.5', 2: '9.5', 3: '12', 4: '15', 5: '19', 6: '24', 7: '30', 8: '38', 9: '48', 10: '60', 11: '75', 12: '95', 13: '120' };
const DEC: Record<number, string> = { [-3]: '2.0', [-2]: '1.6', [-1]: '1.25', 0: '1.0', 1: '0.8', 2: '0.63', 3: '0.5', 4: '0.4', 5: '0.32', 6: '0.25', 7: '0.2', 8: '0.16', 9: '0.125', 10: '0.1', 11: '0.08', 12: '0.063', 13: '0.05' };
export type Line = { step: number; logmar: number; feet: string; metres: string; decimal: string; mar: number; vas: number; letters: number };
/** The chart lines from logMAR −0.3 to 1.3 (20/10 to 20/400), with nominal Snellen and decimal labels. */
export function lines(): Line[] {
  const out: Line[] = [];
  for (let s = -3; s <= 13; s++) { const a = fromLogMAR(s / 10); out.push({ step: s, logmar: s / 10, feet: FEET[s], metres: METRES[s], decimal: DEC[s], mar: a.mar, vas: a.vas, letters: a.letters }); }
  return out;
}
/** The nearest whole line to a logMAR value and the letters beyond it (+) or short of it (−), at 0.02 per letter. */
export function nearestLine(logmar: number): { line: Line | null; letters: number } {
  const s = Math.round(logmar * 10 + 1e-9);
  const L = lines().find((l) => l.step === s) ?? null;
  return { line: L, letters: Math.round((s / 10 - logmar) / 0.02) };
}
/** The proper average acuity: the mean of logMAR values (Holladay 1997), and its equivalents. */
export function meanAcuity(logmars: number[]): Acuity | null {
  if (!logmars.length) return null;
  return fromLogMAR(logmars.reduce((a, b) => a + b, 0) / logmars.length);
}
