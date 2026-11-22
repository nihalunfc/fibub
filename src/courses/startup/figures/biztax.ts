// Rough yearly tax estimates for a founder's business profit, by country and structure, built on the fibub
// income tax engines (src/lib/money). Simplified on purpose: no credits beyond the basic ones, no state or city
// tax in the USA, and the latest published rates. Used by the Module 8 calculators only, with a clear "estimate" label.
import { indiaTax } from '../../../lib/money/india-income-tax';
import { canadaTax, CPP } from '../../../lib/money/canada-income-tax';
import { bracketTax, BRACKETS, STD, SS_BASE } from '../../../lib/money/us-paycheck';

const pos = (x: number) => (x > 0 ? x : 0);
const IN0 = { age: 'under60' as const, salary: 0, other: 0, hra: 0, c80: 0, d80: 0, d80parents: 0, parentsSenior: false, home: 0, nps: 0 };

/** India, new regime: tax on salary and on other income (business profit, dividends) for an individual. */
export const inPersonal = (salary: number, other: number) => indiaTax({ ...IN0, salary: pos(salary), other: pos(other) }).new.total;
/** Section 115BAA company rate: 22 % + 10 % surcharge + 4 % cess. */
export const IN_CO = 0.22 * 1.1 * 1.04;
/** LLP: 30 % + 12 % surcharge over ₹1 crore + 4 % cess (marginal relief ignored). */
export const inLlp = (p: number) => pos(p) * 0.3 * (p > 1e7 ? 1.12 : 1) * 1.04;
/** Presumptive income: 44AD (6 % of digital receipts, 8 % cash) and 44ADA (50 % of professional receipts). */
export const in44 = (turnover: number, kind: 'ad' | 'ada', cashShare = 0) =>
  kind === 'ada' ? turnover * 0.5 : turnover * (0.06 * (1 - cashShare) + 0.08 * cashShare);

/** Canada: provinces with small business and general corporate rates (federal 9 % and 15 % added). */
export const CA_CORP: Record<string, { name: string; small: number; general: number }> = {
  ON: { name: 'Ontario', small: 0.032, general: 0.115 },
  BC: { name: 'British Columbia', small: 0.02, general: 0.12 },
  AB: { name: 'Alberta', small: 0.02, general: 0.08 },
  MB: { name: 'Manitoba', small: 0, general: 0.12 },
  QC: { name: 'Quebec', small: 0.032, general: 0.115 },
};
export const caCorpTax = (p: number, prov: string) => {
  const r = CA_CORP[prov] ?? CA_CORP.ON, small = Math.min(pos(p), 500000);
  return small * (0.09 + r.small) + pos(p - 500000) * (0.15 + r.general);
};
/** Self-employed CPP: both halves (11.9 %) to the YMPE, plus CPP2 (8 %) to the YAMPE. */
export const caSelfCpp = (p: number) => {
  const pens = pos(Math.min(pos(p), CPP.ympe) - CPP.exempt);
  return pens * 2 * (CPP.base + CPP.first) + pos(Math.min(pos(p), CPP.yampe) - CPP.ympe) * 2 * CPP.second;
};
/** Sole proprietor: income tax on profit less the employer half of CPP (a deduction), plus both halves of CPP. */
export const caProp = (p: number, prov: string) => {
  const cpp = caSelfCpp(p), half = cpp / 2;
  const t = canadaTax({ prov: prov === 'QC' ? 'ON' : prov, employment: 0, other: pos(p - half), rrsp: 0 });
  return { income: t.incomeTax, cpp, total: t.incomeTax + cpp };
};

/** USA, single filer, federal only. */
export const usSe = (p: number) => { const b = pos(p) * 0.9235; return Math.min(b, SS_BASE) * 0.124 + b * 0.029 + pos(b - 200000) * 0.009; };
export const usIncome = (ordinary: number, qbi: number) => {
  const agi = pos(ordinary), taxableBefore = pos(agi - STD.single);
  const ded = Math.min(0.2 * pos(qbi), 0.2 * taxableBefore);
  return bracketTax(pos(taxableBefore - ded), BRACKETS.single);
};
/** Sole proprietor or single-member LLC: SE tax plus income tax (half the SE tax is deductible; QBI on the rest). */
export const usProp = (p: number) => {
  const se = usSe(p), agi = pos(p - se / 2), inc = usIncome(agi, pos(p - se / 2));
  return { se, income: inc, total: se + inc };
};
/** S corporation paying the owner a salary S out of profit P: payroll tax both sides, QBI on the distribution only. */
export const usScorp = (p: number, s: number) => {
  const sal = Math.min(pos(s), pos(p) / 1.0765), er = Math.min(sal, SS_BASE) * 0.062 + sal * 0.0145;
  const dist = pos(p - sal - er), ee = Math.min(sal, SS_BASE) * 0.062 + sal * 0.0145 + pos(sal - 200000) * 0.009;
  const inc = usIncome(sal + dist, dist);
  return { salary: sal, dist, payroll: er + ee, income: inc, total: er + ee + inc };
};
export const US_CCORP = 0.21;
