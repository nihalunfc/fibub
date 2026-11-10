// #1736 RRSP or TFSA: plain maths, no DOM. Limits checked on canada.ca 2026-11-10.
// https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

/** TFSA dollar limit by year (CRA table). */
export const TFSA_LIMITS: Record<number, number> = {
  2009: 5000, 2010: 5000, 2011: 5000, 2012: 5000, 2013: 5500, 2014: 5500, 2015: 10000, 2016: 5500, 2017: 5500,
  2018: 5500, 2019: 6000, 2020: 6000, 2021: 6000, 2022: 6000, 2023: 6500, 2024: 7000, 2025: 7000, 2026: 7000,
};
/** RRSP dollar limit by year (CRA table). The limit for a year applies to 18% of the previous year's earned income. */
export const RRSP_LIMITS: Record<number, number> = { 2024: 31560, 2025: 32490, 2026: 33810, 2027: 35390 };
export const YEAR = 2026;

export type Refund = 'grossup' | 'tfsa' | 'spend';
export type CompareIn = {
  amount: number; // after-tax money you have to save (each year, or once)
  yearly: boolean; years: number; rate: number; // return % a year
  taxNow: number; taxLater: number; // marginal tax rates in %
  refund: Refund;
};
export type CompareOut = { tfsa: number; rrspGross: number; rrspAfterTax: number; rrspIn: number; refundValue: number; put: number; factor: number };

/** Growth factor of 1 put in now (once) or 1 put in at the start of each year for `years` years. */
export function factor(years: number, rate: number, yearly: boolean): number {
  const g = 1 + rate / 100;
  if (!yearly) return Math.pow(g, years);
  let f = 0;
  for (let k = 1; k <= Math.round(years); k++) f += Math.pow(g, k);
  return f;
}

/** Compare the same after-tax money in a TFSA and an RRSP. RRSP withdrawals are taxed at taxLater.
 *  grossup: the RRSP contribution is amount / (1 - taxNow), the refund pays for the extra (the fair comparison).
 *  tfsa: the RRSP gets `amount`, the refund (amount x taxNow) goes into a TFSA.
 *  spend: the RRSP gets `amount`, the refund is spent. */
export function compare(a: CompareIn): CompareOut {
  const f = factor(a.years, a.rate, a.yearly);
  const tn = a.taxNow / 100, tl = a.taxLater / 100;
  const tfsa = a.amount * f;
  const rrspIn = a.refund === 'grossup' ? a.amount / (1 - tn) : a.amount;
  const rrspGross = rrspIn * f;
  const refundValue = a.refund === 'tfsa' ? a.amount * tn * f : 0;
  const rrspAfterTax = rrspGross * (1 - tl) + refundValue;
  const put = a.yearly ? a.amount * Math.round(a.years) : a.amount;
  return { tfsa, rrspGross, rrspAfterTax, rrspIn, refundValue, put, factor: f };
}

/** TFSA room built up from the year you turned 18 (or became resident, or 2009) to `upTo`. */
export function tfsaRoom(birthYear: number, residentFrom = 0, upTo = YEAR): { start: number; total: number } {
  const start = Math.max(2009, birthYear + 18, residentFrom || 0);
  let total = 0;
  for (let y = start; y <= upTo; y++) total += TFSA_LIMITS[y] ?? 0;
  return { start, total };
}

/** RRSP deduction limit for `year`: 18% of last year's earned income up to the dollar limit, minus the pension adjustment, plus unused room. */
export function rrspRoom(earned: number, pa = 0, unused = 0, year = YEAR): { new: number; total: number; capped: boolean } {
  const lim = RRSP_LIMITS[year] ?? RRSP_LIMITS[YEAR];
  const raw = earned * 0.18;
  const n = Math.max(0, Math.min(raw, lim) - pa);
  return { new: n, total: n + Math.max(0, unused), capped: raw > lim };
}
