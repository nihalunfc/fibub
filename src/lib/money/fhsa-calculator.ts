// #1737 FHSA: plain maths, no DOM. Rules checked on canada.ca 2026-11-10.
export const FHSA_YEAR = 8000, FHSA_LIFE = 40000, FHSA_CARRY = 8000, FHSA_YEARS = 15;
export const HBP_MAX = 60000, HBP_REPAY_YEARS = 15;

export type FhsaIn = {
  perYear: number; years: number; rate: number; taxRate: number;
  balance: number; contributed: number; carry: number; // already in the account, lifetime contributions so far, unused room carried in
};
export type FhsaRow = { year: number; room: number; put: number; refund: number; balance: number; carryOut: number };
export type FhsaOut = { rows: FhsaRow[]; put: number; refunds: number; balance: number; capped: boolean };

/** Year by year: room = $8,000 + carry-forward (at most $8,000), never above what is left of $40,000.
 *  Contributions go in at the start of the year; unused room (up to $8,000) carries to next year. */
export function fhsa(a: FhsaIn): FhsaOut {
  const g = 1 + a.rate / 100;
  let bal = a.balance, life = a.contributed, carry = Math.min(FHSA_CARRY, Math.max(0, a.carry));
  let put = 0, refunds = 0, capped = false;
  const rows: FhsaRow[] = [];
  for (let y = 1; y <= Math.round(a.years); y++) {
    const room = Math.max(0, Math.min(FHSA_YEAR + carry, FHSA_LIFE - life));
    const c = Math.min(Math.max(0, a.perYear), room);
    if (a.perYear > room + 0.005) capped = true;
    bal = (bal + c) * g; life += c; put += c;
    const refund = c * a.taxRate / 100; refunds += refund;
    carry = Math.min(FHSA_CARRY, Math.max(0, FHSA_YEAR + carry - c));
    rows.push({ year: y, room, put: c, refund, balance: bal, carryOut: carry });
  }
  return { rows, put, refunds, balance: bal, capped };
}

/** The same contributions in an RRSP, taken out under the Home Buyers' Plan: up to $60,000 tax-free,
 *  repaid over 15 years; anything above $60,000 is taxed at `taxRate` when taken out. */
export function hbp(balance: number, taxRate: number) {
  const free = Math.min(balance, HBP_MAX);
  const taxed = Math.max(0, balance - HBP_MAX);
  const tax = taxed * taxRate / 100;
  return { free, taxed, tax, cash: balance - tax, repayYear: free / HBP_REPAY_YEARS };
}

/** Refunds (arriving at the end of the year they are earned) grown at the same return to the end of the plan. */
export function refundsGrown(rows: FhsaRow[], rate: number): number {
  const g = 1 + rate / 100, n = rows.length;
  return rows.reduce((t, r, k) => t + r.refund * Math.pow(g, n - 1 - k), 0);
}

/** First year (1-based) in which the FHSA balance reaches `target`, or null. */
export function yearReached(rows: FhsaRow[], target: number): number | null {
  const r = rows.find((x) => x.balance >= target - 0.005);
  return target > 0 && r ? r.year : null;
}

/** Smallest yearly amount (to the nearest dollar) that reaches `target` by the end of the plan, within the limits.
 *  null when even the most you are allowed to put in falls short. */
export function perYearForTarget(a: Omit<FhsaIn, 'perYear'>, target: number): number | null {
  const reach = (p: number) => fhsa({ ...a, perYear: p }).balance >= target - 0.005;
  const cap = FHSA_YEAR + FHSA_CARRY; // no year can take more than this
  if (!(target > 0)) return 0;
  if (!reach(cap)) return null;
  let lo = 0, hi = cap;
  while (hi - lo > 1) { const mid = Math.floor((lo + hi) / 2); if (reach(mid)) hi = mid; else lo = mid; }
  return hi;
}

/** Turn an amount `years` ahead into today's money at `inflation`% a year. */
export const todaysMoney = (v: number, inflation: number, years: number) => v / Math.pow(1 + inflation / 100, Math.max(0, years));
