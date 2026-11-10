// Recipe line parsing and scaling for #T863 Recipe scaler. Plain TypeScript, no DOM.
import { ML, findIngredient } from '../cups-to-grams/data';

const UF: Record<string, number> = { '½': 1 / 2, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 1 / 4, '¾': 3 / 4, '⅛': 1 / 8, '⅜': 3 / 8, '⅝': 5 / 8, '⅞': 7 / 8 };
const UC = '½⅓⅔¼¾⅛⅜⅝⅞';
const QTY = `(\\d+\\s+\\d+\\/\\d+|\\d+\\s*[${UC}]|\\d+\\/\\d+|\\d+(?:[.,]\\d+)?|[${UC}])`;
const UNITS: [RegExp, string][] = [
  [/^fl\.?\s?oz\.?/i, 'floz'], [/^(cups?|c\.)/i, 'cup'], [/^(tablespoons?|tbsps?|tbs)\.?/i, 'tbsp'], [/^(teaspoons?|tsps?)\.?/i, 'tsp'],
  [/^(kilograms?|kgs?)/i, 'kg'], [/^(grams?|g)/i, 'g'], [/^(millilit(?:re|er)s?|ml)/i, 'ml'], [/^(lit(?:re|er)s?|l)/i, 'l'],
  [/^(ounces?|oz)\.?/i, 'oz'], [/^(pounds?|lbs?)\.?/i, 'lb'],
];
const LINE = new RegExp(`^\\s*${QTY}(?:\\s*(?:-|–|to)\\s*${QTY})?\\s*(.*)$`, 'i');

export function parseQty(s: string): number {
  s = s.trim();
  let m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/); if (m) return +m[1] + +m[2] / +m[3];
  m = s.match(new RegExp(`^(\\d+)\\s*([${UC}])$`)); if (m) return +m[1] + UF[m[2]];
  m = s.match(/^(\d+)\/(\d+)$/); if (m) return +m[1] / +m[2];
  if (UF[s] !== undefined) return UF[s];
  return +s.replace(',', '.');
}

const FR: [number, string][] = [[0, ''], [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'], [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'], [1, '']];
/** Nearest kitchen fraction, e.g. 1.5 -> "1½". `set` limits the fractions used. */
export function friendly(v: number, set = FR): string {
  let whole = Math.floor(v), f = v - whole;
  let best = set[0];
  for (const x of set) if (Math.abs(x[0] - f) < Math.abs(best[0] - f)) best = x;
  if (best[0] === 1) { whole += 1; best = [0, '']; }
  if (whole === 0 && best[1] === '') return v > 0 ? set[1][1] : '0';
  return (whole ? String(whole) : '') + best[1];
}
const QUARTERS = FR.filter(([x]) => [0, 1 / 4, 1 / 2, 3 / 4, 1].includes(x));
const SPOONS = FR.filter(([x]) => [0, 1 / 8, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1].includes(x));
const dec = (v: number, d: number) => v.toLocaleString('en-US', { maximumFractionDigits: d });
/** Grams and ml: nearest 5 from 100 up, whole from 10, one decimal below. */
export const metric = (v: number) => (v >= 100 ? String(Math.round(v / 5) * 5) : v >= 10 ? String(Math.round(v)) : dec(v, 1));

function fmt(v: number, unit: string): string {
  if (unit === 'g' || unit === 'ml') return metric(v);
  if (unit === 'kg' || unit === 'l') return dec(v, 2);
  if (unit === 'cup') return v >= 10 ? friendly(v, QUARTERS) : friendly(v);
  if (unit === 'tbsp' || unit === 'tsp') return friendly(v, SPOONS);
  return v >= 10 ? String(Math.round(v)) : friendly(v, QUARTERS);
}
const UNIT_SHOW = (u: string, v: number) => (u === 'cup' ? (v > 1 ? 'cups' : 'cup') : u === 'floz' ? 'fl oz' : u);

export type Scaled = { text: string; was?: string; changed: boolean };

export function scaleLine(line: string, k: number, toMetric = false): Scaled {
  const m = line.match(LINE);
  if (!m || line.trim() === '') return { text: line, changed: false };
  const a = parseQty(m[1]) * k, b = m[2] ? parseQty(m[2]) * k : undefined;
  let rest = m[3], unit = '';
  for (const [re, u] of UNITS) { const um = rest.match(re); if (um && /^(\s|$|[.,;:)])/.test(rest.slice(um[0].length))) { unit = u; rest = rest.slice(um[0].length).replace(/^\.?\s*/, ''); break; } }
  const sp = (s: string) => (s ? ' ' + s : '');
  // Metric: spoons and cups become grams when the ingredient is known (US cup), otherwise ml; oz and lb become grams.
  if (toMetric && ['cup', 'tbsp', 'tsp', 'floz', 'oz', 'lb'].includes(unit)) {
    const ing = unit === 'oz' || unit === 'lb' ? undefined : findIngredient(rest);
    const ml = { cup: ML.uscup, tbsp: ML.tbsp, tsp: ML.tsp, floz: ML.floz } as Record<string, number>;
    const conv = (v: number) => (unit === 'oz' ? v * 28.3495 : unit === 'lb' ? v * 453.592 : ing ? v * ml[unit] * (ing.g / ML.uscup) : v * ml[unit]);
    const mu = unit === 'oz' || unit === 'lb' || ing ? 'g' : 'ml';
    const was = `${fmt(a, unit)}${b !== undefined ? '–' + fmt(b, unit) : ''} ${UNIT_SHOW(unit, b ?? a)}`;
    return { text: `${metric(conv(a))}${b !== undefined ? '–' + metric(conv(b)) : ''} ${mu}${sp(rest)}`, was, changed: true };
  }
  if (!unit && a > 1 && /^egg\b/i.test(rest)) rest = rest.replace(/^egg/i, (e) => e + 's');
  const q = `${fmt(a, unit)}${b !== undefined ? '–' + fmt(b, unit) : ''}`;
  if (!unit && b === undefined && /\beggs?\b/i.test(rest) && Math.abs(a - Math.round(a)) > 0.01) {
    return { text: `${q} ${rest} (beat ${Math.ceil(a)} and use about ${Math.round(a * 50)} g; a large egg is about 50 g)`, changed: true };
  }
  return { text: `${q}${unit ? ' ' + UNIT_SHOW(unit, b ?? a) : ''}${sp(rest)}`, changed: true };
}
