// PPF maths (#1740). Plain TypeScript, no DOM.
// PPF Scheme 2019: interest for each month is worked out on the lowest balance between the close of the
// 5th day and the end of the month, at the yearly rate / 12, and added to the account at the end of the
// financial year. So within a year interest is simple; it compounds once a year.
import type { Year } from './growth';

export type PpfTiming = 'start' | 'monthly' | 'end';
export type PpfIn = {
  deposit: number;       // per financial year
  rate: number;          // % a year
  timing: PpfTiming;     // start = one deposit by 5 April; monthly = 1/12 by the 5th of every month; end = after 5 March (earns nothing that year)
  extensions: number;    // 5-year blocks after the first 15 years
  extendDeposits: boolean; // keep paying in during the extensions
  opening?: number;      // balance already in the account
};
export type PpfRow = Year & { paid: number; earned: number };

export const PPF_MIN = 500, PPF_MAX = 150000, PPF_YEARS = 15;

export function ppf(a: PpfIn): PpfRow[] {
  const r = a.rate / 100 / 12;
  let bal = a.opening || 0, put = bal, gained = 0;
  const rows: PpfRow[] = [{ year: 0, deposits: put, interest: 0, balance: bal, real: bal, paid: 0, earned: 0 }];
  const years = PPF_YEARS + 5 * Math.max(0, Math.floor(a.extensions));
  for (let y = 1; y <= years; y++) {
    const pay = y <= PPF_YEARS || a.extendDeposits ? a.deposit : 0;
    let run = bal, earned = 0;
    for (let m = 1; m <= 12; m++) {
      if (a.timing === 'start' && m === 1) run += pay;
      if (a.timing === 'monthly') run += pay / 12;
      earned += run * r;
    }
    if (a.timing === 'end') run += pay;
    bal = run + earned; put += pay; gained += earned;
    rows.push({ year: y, deposits: put, interest: gained, balance: bal, real: bal, paid: pay, earned });
  }
  return rows;
}
