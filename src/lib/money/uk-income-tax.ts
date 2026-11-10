// UK income tax, employee National Insurance, student loans and pension for the 2026/27 tax year
// (6 April 2026 to 5 April 2027). Pure maths, no DOM, checked in tests/tools/uk-income-tax.mjs.
// Figures: GOV.UK "Rates and thresholds for employers 2026 to 2027", checked 2026-11-10.

export type Band = [number, number]; // [upper limit of taxable income in the band, rate]

const I = Infinity;
export const PA = 12570;
export const TAPER_FROM = 100000;
export const RUK: Band[] = [[37700, 0.20], [125140, 0.40], [I, 0.45]];
export const SCOT: Band[] = [[3967, 0.19], [16956, 0.20], [31092, 0.21], [62430, 0.42], [125140, 0.45], [I, 0.48]];
export const NI = { pt: 12570, uel: 50270, main: 0.08, upper: 0.02 };
export const LOANS: Record<string, { name: string; from: number; rate: number }> = {
  plan1: { name: 'Plan 1', from: 26900, rate: 0.09 },
  plan2: { name: 'Plan 2', from: 29385, rate: 0.09 },
  plan4: { name: 'Plan 4 (Scotland)', from: 33795, rate: 0.09 },
  plan5: { name: 'Plan 5', from: 25000, rate: 0.09 },
  pg: { name: 'Postgraduate loan', from: 21000, rate: 0.06 },
};

export type PensionType = 'none' | 'ras' | 'netpay' | 'sacrifice';
export interface Input {
  region: 'ruk' | 'scot';
  salary: number;         // employment pay before anything comes off
  other: number;          // other taxable income with no NI (e.g. rental profit, a private pension)
  pension: number;        // gross amount a year that goes into the pension pot
  pensionType: PensionType;
  loans: string[];        // keys of LOANS
}
export interface Result {
  gross: number; allowance: number; taxable: number;
  tax: number; ni: number; loans: number; loanParts: Record<string, number>;
  pensionGross: number; pensionCost: number; reliefAdded: number;
  takeHome: number; average: number; marginal: number;
}

const pos = (x: number) => (x > 0 ? x : 0);
const r2 = (x: number) => Math.round(x * 100) / 100;

export const bandTax = (x: number, bands: Band[]) => {
  let tax = 0, lo = 0;
  for (const [hi, r] of bands) { if (x > lo) tax += (Math.min(x, hi) - lo) * r; lo = hi; }
  return tax;
};
export const allowance = (adjustedNet: number) => pos(PA - Math.floor(pos(adjustedNet - TAPER_FROM) / 2));

const core = (inp: Input) => {
  const salary = pos(inp.salary), other = pos(inp.other);
  const type = inp.pensionType, G = type === 'none' ? 0 : Math.min(pos(inp.pension), salary + other);
  // Salary sacrifice lowers pay for tax, NI and student loans. Net pay lowers pay for tax only.
  const pay = type === 'sacrifice' ? pos(salary - G) : salary;
  const taxIncome = pay + other - (type === 'netpay' ? G : 0);
  // Relief at source: you pay 80%, the provider adds 20%; higher rates come back by widening the bands.
  const ras = type === 'ras' ? G : 0;
  const pa = allowance(taxIncome - ras);
  const taxable = pos(taxIncome - pa);
  const base = inp.region === 'scot' ? SCOT : RUK;
  const basicIdx = inp.region === 'scot' ? 1 : 0;
  const bands: Band[] = base.map(([hi, r], i) => [i >= basicIdx && hi !== I ? hi + ras : hi, r]);
  const tax = bandTax(taxable, bands);
  const ni = NI.main * pos(Math.min(pay, NI.uel) - NI.pt) + NI.upper * pos(pay - NI.uel);
  const loanParts: Record<string, number> = {};
  let loans = 0;
  const undergrad = inp.loans.filter((k) => k !== 'pg' && LOANS[k]);
  // With more than one undergraduate plan, 9% is taken once, from the lowest threshold.
  if (undergrad.length) {
    const k = undergrad.reduce((a, b) => (LOANS[a].from <= LOANS[b].from ? a : b));
    loanParts[k] = Math.floor(LOANS[k].rate * pos(pay - LOANS[k].from) * 100) / 100;
    loans += loanParts[k];
  }
  if (inp.loans.includes('pg')) { loanParts.pg = Math.floor(LOANS.pg.rate * pos(pay - LOANS.pg.from) * 100) / 100; loans += loanParts.pg; }
  const pensionCost = type === 'ras' ? G * 0.8 : G;
  const gross = salary + other;
  // Take-home: what reaches your bank after tax, NI, loans and your own pension payments.
  const takeHome = gross - tax - ni - loans - pensionCost;
  return { gross, pa, taxable, tax, ni, loans, loanParts, G, pensionCost, takeHome };
};

export function ukTax(inp: Input): Result {
  const c = core(inp);
  const up = core({ ...inp, salary: pos(inp.salary) + 100 });
  return {
    gross: c.gross, allowance: c.pa, taxable: r2(c.taxable),
    tax: r2(c.tax), ni: r2(c.ni), loans: r2(c.loans), loanParts: c.loanParts,
    pensionGross: r2(c.G), pensionCost: r2(c.pensionCost), reliefAdded: r2(c.G - c.pensionCost),
    takeHome: r2(c.takeHome),
    average: c.gross > 0 ? c.tax / c.gross : 0,
    // Marginal: share of the next 100 of salary lost to tax, NI and loans.
    marginal: ((up.tax + up.ni + up.loans) - (c.tax + c.ni + c.loans)) / 100,
  };
}
