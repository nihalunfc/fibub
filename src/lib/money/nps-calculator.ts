// NPS maths (#1742). Plain TypeScript, no DOM.
// Monthly contributions at the start of each month at the expected return / 12 (like a SIP), then at exit a
// share buys an annuity (monthly pension = annuity amount x annuity rate / 12) and the rest is a lump sum.
import type { Year } from './growth';

export type NpsIn = {
  monthly: number; stepUp: number; rate: number;
  ageNow: number; exitAge: number; opening: number;
  annuityShare: number;  // % of the corpus used to buy the annuity
  annuityRate: number;   // % a year paid by the annuity
};
export type NpsOut = { rows: Year[]; corpus: number; invested: number; annuity: number; lump: number; pension: number };

/** Minimum annuity at normal exit (age 60 / superannuation), PFRDA press release of 19 December 2025. */
export const NPS_MIN_ANNUITY = { citizen: 20, government: 40 } as const;
export const NPS_SMALL = 800000;   // corpus up to this may be taken in full
export const NPS_MID = 1200000;    // non-government, above 8 lakh up to this: lump sum up to 6 lakh
export const NPS_MID_LUMP = 600000;

export function nps(a: NpsIn): NpsOut {
  const i = a.rate / 1200;
  let bal = a.opening, put = a.opening, pay = a.monthly;
  const rows: Year[] = [{ year: 0, deposits: put, interest: 0, balance: bal, real: bal }];
  const months = Math.max(0, Math.round((a.exitAge - a.ageNow) * 12));
  for (let m = 1; m <= months; m++) {
    if (m > 1 && (m - 1) % 12 === 0) pay *= 1 + a.stepUp / 100;
    bal = (bal + pay) * (1 + i); put += pay;
    if (m % 12 === 0 || m === months) rows.push({ year: m / 12, deposits: put, interest: bal - put, balance: bal, real: bal });
  }
  const annuity = bal * a.annuityShare / 100;
  return { rows, corpus: bal, invested: put, annuity, lump: bal - annuity, pension: annuity * a.annuityRate / 1200 };
}
