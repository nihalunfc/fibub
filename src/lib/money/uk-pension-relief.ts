// #1788 Pension tax relief (UK, 2026/27): relief at source vs net pay (and salary sacrifice), higher-rate claim back,
// annual allowance with taper and carry-forward, money purchase annual allowance, State Pension age.
// Pure maths, no DOM, checked in tests/tools/uk-pension-relief.mjs. Tax maths comes from ./uk-income-tax.ts.
// Rules (GOV.UK, checked 2026-11-10): annual allowance 60,000; taper when threshold income > 200,000 and adjusted income
// > 260,000, £1 for every £2, not below 10,000 (PTM057100); MPAA 10,000 with no carry-forward; carry forward from the
// previous 3 tax years; relief on up to 100% of earnings, or 3,600 gross with no earnings (2,880 net + 20%).
import { ukTax, type PensionType } from './uk-income-tax.ts';

export const AA = 60000, TAPER_THRESHOLD = 200000, TAPER_ADJUSTED = 260000, AA_MIN = 10000, MPAA = 10000, NO_EARNINGS_CAP = 3600;

export interface Input {
  region: 'ruk' | 'scot';
  salary: number;      // pay from employment before any pension (relevant UK earnings)
  other: number;       // other taxable income (no NI)
  gross: number;       // personal contribution a year, gross (what lands in the pot including basic-rate relief)
  employer: number;    // employer contributions a year (not including any salary sacrifice)
  unused: number[];    // unused annual allowance from the 3 previous tax years, oldest first
  flexi: boolean;      // has flexibly accessed a pension: MPAA applies
}
export interface Method { type: PensionType; cost: number; relief: number; rate: number; providerAdds: number; claim: number; niSaved: number }
export interface Result {
  relievable: number; capped: boolean;
  ras: Method; netpay: Method; sacrifice: Method;
  threshold: number; adjusted: number; allowance: number; tapered: boolean;
  input: number; over: number; carryUsed: number; excess: number; charge: number;
}

const pos = (x: number) => (x > 0 ? x : 0);
const r2 = (x: number) => Math.round(x * 100) / 100;

/** Tapered annual allowance from threshold and adjusted income. */
export function allowanceFor(threshold: number, adjusted: number): number {
  if (threshold <= TAPER_THRESHOLD || adjusted <= TAPER_ADJUSTED) return AA;
  return Math.max(AA_MIN, AA - Math.floor((adjusted - TAPER_ADJUSTED) / 2));
}

export function relief(inp: Input): Result {
  const salary = pos(inp.salary), other = pos(inp.other), G = pos(inp.gross), E = pos(inp.employer);
  const cap = Math.max(salary, NO_EARNINGS_CAP);
  const relievable = Math.min(G, cap);
  const base = ukTax({ region: inp.region, salary, other, pension: 0, pensionType: 'none', loans: [] });
  const method = (type: PensionType): Method => {
    const amt = type === 'ras' ? relievable : Math.min(G, salary);
    const w = ukTax({ region: inp.region, salary, other, pension: amt, pensionType: type, loans: [] });
    // Cost: how much less take-home pay you end up with, after any higher-rate claim (shown as lower tax).
    // Any part above the relief limit has no relief, so it costs in full.
    const cost = base.takeHome - w.takeHome + (G - amt);
    const providerAdds = type === 'ras' ? r2(amt * 0.2) : 0;
    return { type, cost: r2(cost), relief: r2(G - cost), rate: G > 0 ? (G - cost) / G : 0, providerAdds, claim: type === 'ras' ? r2(base.tax - w.tax) : 0, niSaved: r2(base.ni - w.ni) };
  };
  const ras = method('ras'), netpay = method('netpay'), sacrifice = method('sacrifice');
  // Threshold income: income less personal contributions (salary sacrifice set up after 8 July 2015 is added back).
  // Adjusted income: income before any pension, plus employer contributions. Uses relief at source / net pay.
  const I = salary + other;
  const threshold = pos(I - G), adjusted = I + E;
  const allowance = inp.flexi ? Math.min(MPAA, allowanceFor(threshold, adjusted)) : allowanceFor(threshold, adjusted);
  const input = G + E;
  const over = pos(input - allowance);
  const carry = inp.flexi ? 0 : inp.unused.slice(0, 3).reduce((s, x) => s + pos(x), 0);
  const carryUsed = Math.min(over, carry);
  const excess = over - carryUsed;
  // Annual allowance charge: the excess is taxed as if it were the top slice of your income (estimate).
  const charge = excess > 0 ? ukTax({ region: inp.region, salary, other: other + excess, pension: 0, pensionType: 'none', loans: [] }).tax - base.tax : 0;
  return {
    relievable, capped: G > cap, ras, netpay, sacrifice,
    threshold, adjusted, allowance, tapered: allowance < AA && !inp.flexi, input, over, carryUsed, excess, charge: r2(charge),
  };
}

/** UK State Pension age for a date of birth (GOV.UK State Pension age timetable, checked 2026-11-10). */
export function statePensionAge(y: number, m: number, d: number): { years: number; months: number; note?: string } {
  const key = y * 10000 + m * 100 + d;
  if (key < 19600406) return { years: 66, months: 0 };
  if (key < 19610306) return { years: 66, months: (y - 1960) * 12 + (m - 4) - (d < 6 ? 1 : 0) + 1 };
  if (key < 19770406) return { years: 67, months: 0 };
  if (key < 19780406) return { years: 67, months: 0, note: 'between 67 and 68: a set date from May 2044 to March 2046' };
  return { years: 68, months: 0, note: 'planned; the rise to 68 could change after a future review' };
}
