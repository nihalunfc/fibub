// Occupational noise dose from levels and durations: allowed time at each level for a criterion level, criterion
// duration and exchange rate, the daily dose, the 8-hour time-weighted average, and the energy LEX,8h. Formulas as
// written in, for example, US OSHA 29 CFR 1910.95 Appendix A and NIOSH (1998); the settings are the user's. No DOM.

export type Criterion = { Lc: number; q: number; Lt: number; Tc: number }; // dB(A), dB, dB(A) threshold (−Infinity for none), hours
export type Exposure = { label: string; L: number; hours: number };

/** Allowed time (hours) at level L: T = Tc / 2^((L − Lc)/q). */
export const allowedHours = (L: number, c: Criterion) => c.Tc / Math.pow(2, (L - c.Lc) / c.q);

/** Daily dose (%) and the share of each exposure; levels below the threshold count as zero. */
export function noiseDose(rows: Exposure[], c: Criterion) {
  const parts = rows.map((r) => {
    const counted = r.L >= c.Lt, T = allowedHours(r.L, c);
    return { ...r, counted, allowed: T, dose: counted ? (100 * r.hours) / T : 0 };
  });
  const D = parts.reduce((s, p) => s + p.dose, 0), hours = rows.reduce((s, r) => s + r.hours, 0);
  return { parts, D, hours, twa: twaFromDose(D, c), lavg: hours > 0 && D > 0 ? c.Lc + (c.q / Math.log10(2)) * Math.log10((D / 100) * (c.Tc / hours)) : NaN };
}

/** Time-weighted average over the criterion duration from the dose: TWA = Lc + (q / lg 2)·lg(D/100). */
export const twaFromDose = (D: number, c: Criterion) => (D > 0 ? c.Lc + (c.q / Math.log10(2)) * Math.log10(D / 100) : NaN);

/** Dose (%) that a time-weighted average gives (the inverse). */
export const doseFromTwa = (twa: number, c: Criterion) => 100 * Math.pow(2, (twa - c.Lc) / c.q);

/** Energy-equivalent level normalised to 8 hours, LEX,8h = 10 lg(Σ tᵢ 10^(Lᵢ/10) / 8 h), all levels counted. */
export function lex8h(rows: Exposure[]) {
  const e = rows.reduce((s, r) => s + r.hours * Math.pow(10, r.L / 10), 0);
  return e > 0 ? 10 * Math.log10(e / 8) : NaN;
}

/** Hours more at level L before the dose reaches 100 %, given the dose so far (0 if already there). */
export const hoursLeft = (D: number, L: number, c: Criterion) => Math.max(0, (1 - D / 100) * allowedHours(L, c));

/** Reads "label, level, minutes" or "level, minutes" lines (h:mm also accepted for the time). */
export function parseExposures(text: string, unit: 'min' | 'h'): { rows: Exposure[]; bad: number[] } {
  const rows: Exposure[] = [], bad: number[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  lines.forEach((line, i) => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const sep = t.includes('\t') ? /\t/ : t.includes(';') ? /;/ : t.includes(',') ? /,/ : /\s+/;
    const cells = t.split(sep).map((c) => c.trim()).filter((c) => c !== '');
    const numish = (s: string) => /^-?\d+([.,]\d+)?$/.test(s) || /^\d+:\d{1,2}$/.test(s);
    if (!cells.some(numish)) { if (rows.length || bad.length) bad.push(i + 1); return; } // a header line at the top is skipped
    let label = '', rest = cells;
    if (cells.length && !numish(cells[0])) { label = cells[0]; rest = cells.slice(1); }
    if (rest.length < 2) { bad.push(i + 1); return; }
    const L = Number(rest[0].replace(',', '.')), tm = rest[1];
    let hours: number;
    if (/^\d+:\d{1,2}$/.test(tm)) { const [h, m] = tm.split(':').map(Number); hours = h + m / 60; }
    else { const v = Number(tm.replace(',', '.')); hours = unit === 'min' ? v / 60 : v; }
    if (!(L > 0 && L < 200 && hours > 0 && hours <= 24)) { bad.push(i + 1); return; }
    rows.push({ label: label || `Row ${rows.length + 1}`, L, hours });
  });
  return { rows, bad };
}
