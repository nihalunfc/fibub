// Inflation: real and nominal values from price index (CPI) numbers the user supplies, or from a constant
// annual rate. No index data is bundled. Plain maths, no DOM.

/**
 * A period label as a decimal year: "2015" → 2015, "2015-06" or "2015/06" or "Jun 2015" → 2015 + 5/12,
 * "2015Q3" or "2015 Q3" → 2015.5, "2015-06-15" → 2015 + (day of year − 1)/days in year. NaN if not understood.
 */
export function decimalYear(label: string): number {
  const s = label.trim();
  let m = s.match(/^(\d{4})$/);
  if (m) return Number(m[1]);
  m = s.match(/^(\d{4})\s*-?\s*[Qq]([1-4])$/);
  if (m) return Number(m[1]) + (Number(m[2]) - 1) / 4;
  m = s.match(/^[Qq]([1-4])\s*-?\s*(\d{4})$/);
  if (m) return Number(m[2]) + (Number(m[1]) - 1) / 4;
  m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) {
    const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return NaN;
    const t = Date.UTC(y, mo - 1, d), start = Date.UTC(y, 0, 1), len = Date.UTC(y + 1, 0, 1) - start;
    return y + (t - start) / len;
  }
  m = s.match(/^(\d{4})[-/.]?[Mm]?(\d{1,2})$/);
  if (m) { const mo = Number(m[2]); return mo >= 1 && mo <= 12 ? Number(m[1]) + (mo - 1) / 12 : NaN; }
  m = s.match(/^(\d{1,2})[-/.](\d{4})$/);
  if (m) { const mo = Number(m[1]); return mo >= 1 && mo <= 12 ? Number(m[2]) + (mo - 1) / 12 : NaN; }
  const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  m = s.match(/^([A-Za-z]{3})[A-Za-z]*\.?[\s-]*(\d{4})$/) || s.match(/^(\d{4})[\s-]*([A-Za-z]{3})[A-Za-z]*\.?$/);
  if (m) {
    const [a, b] = /^\d/.test(m[1]) ? [m[2], m[1]] : [m[1], m[2]];
    const i = MON.indexOf(a.toLowerCase());
    return i >= 0 ? Number(b) + i / 12 : NaN;
  }
  return NaN;
}

/** Between two index values: cumulative inflation, the annual rate over `years`, and the price factor. */
export function between(cpi1: number, cpi2: number, years: number) {
  const factor = cpi2 / cpi1;
  return { factor, cumulative: factor - 1, annual: years > 0 ? factor ** (1 / years) - 1 : NaN };
}

/** Price factor from a constant annual rate (as a fraction) over `years`. */
export const rateFactor = (rate: number, years: number) => (1 + rate) ** years;

/** Fisher equation: real rate from a nominal rate and inflation (fractions), exact and the usual approximation. */
export function fisher(nominal: number, inflation: number) {
  return { exact: (1 + nominal) / (1 + inflation) - 1, approx: nominal - inflation };
}

/** Nominal rate needed for a given real rate at an inflation rate (exact Fisher). */
export const nominalFor = (real: number, inflation: number) => (1 + real) * (1 + inflation) - 1;

export type Point = { label: string; t: number; cpi: number; nominal?: number };

export type SeriesResult = {
  base: number;
  rows: { label: string; t: number; cpi: number; rebased: number; change: number; yoy: number; nominal?: number; real?: number; realChange?: number }[];
  cumulative: number;
  annual: number;
  years: number;
  /** Periods per year guessed from the spacing (1, 4, 12 or other). */
  perYear: number;
};

/**
 * A pasted price index series: rebased to 100 at row `baseIndex`; each period's change; the change over a year
 * (for annual, quarterly and monthly data); and, when a nominal value column is given, the value in base-period
 * prices (nominal × CPI_base / CPI_t) and its real change.
 */
export function series(points: Point[], baseIndex: number): SeriesResult {
  const base = points[baseIndex].cpi;
  const gaps = points.slice(1).map((p, i) => p.t - points[i].t).filter((g) => g > 0).sort((a, b) => a - b);
  const g = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 1;
  const perYear = Math.round(1 / g);
  const lag = [1, 4, 12].includes(perYear) && Math.abs(g * perYear - 1) < 0.02 ? perYear : 0;
  const rows = points.map((p, i) => {
    const prev = points[i - 1];
    const year = lag ? points.find((o) => Math.abs(o.t - (p.t - 1)) < 0.25 / perYear) : undefined;
    const real = p.nominal !== undefined ? (p.nominal * base) / p.cpi : undefined;
    const prevReal = prev && prev.nominal !== undefined ? (prev.nominal * base) / prev.cpi : undefined;
    return {
      label: p.label, t: p.t, cpi: p.cpi, rebased: (100 * p.cpi) / base,
      change: prev ? p.cpi / prev.cpi - 1 : NaN,
      yoy: year ? p.cpi / year.cpi - 1 : NaN,
      nominal: p.nominal, real, realChange: real !== undefined && prevReal !== undefined ? real / prevReal - 1 : undefined,
    };
  });
  const first = points[0], last = points[points.length - 1], years = last.t - first.t;
  const b = between(first.cpi, last.cpi, years);
  return { base, rows, cumulative: b.cumulative, annual: b.annual, years, perYear: lag || perYear };
}
