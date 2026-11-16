// India personal income tax for FY 2026-27 (tax year 2026-27 under the Income-tax Act, 2025), resident individuals.
// New regime (default) vs old regime side by side. Pure maths, no DOM, so tests/tools/india-income-tax.mjs can check it.
// Figures: Income Tax Department "Tax rates" (AY 2026-27 slabs, surcharge, cess, old-regime rebate), PIB 1 Feb 2025
// (new slabs, Rs 75,000 standard deduction, no tax up to Rs 12 lakh), Union Budget 2026-27 (no change to individual
// slabs; Income-tax Act, 2025 in force from 1 April 2026). Checked 2026-11-10.

export type Band = [number, number]; // [upper limit of the band, rate]
const I = Infinity;

export const NEW_BANDS: Band[] = [[400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [I, 0.30]];
export const OLD_BANDS: Record<Age, Band[]> = {
  under60: [[250000, 0], [500000, 0.05], [1000000, 0.20], [I, 0.30]],
  '60to79': [[300000, 0], [500000, 0.05], [1000000, 0.20], [I, 0.30]],
  '80plus': [[500000, 0], [1000000, 0.20], [I, 0.30]],
};
export const NEW_STD = 75000;
export const OLD_STD = 50000;
export const NEW_REBATE = { limit: 1200000, max: 60000 };
export const OLD_REBATE = { limit: 500000, max: 12500 };
export const NEW_SURCHARGE: Band[] = [[5000000, 0], [10000000, 0.10], [20000000, 0.15], [I, 0.25]];
export const OLD_SURCHARGE: Band[] = [[5000000, 0], [10000000, 0.10], [20000000, 0.15], [50000000, 0.25], [I, 0.37]];
export const CESS = 0.04;
export const CAPS = { d80ttaCap: 10000, d80ttbCap: 50000, employerNpsNew: 0.14, employerNpsOld: 0.10, c80: 150000, d80self: 25000, d80selfSenior: 50000, d80parents: 25000, d80parentsSenior: 50000, home24b: 200000, nps: 50000 };

export type Age = 'under60' | '60to79' | '80plus';

export interface Input {
  age: Age;
  salary: number; // gross salary for the year
  other: number; // interest, rent (after its own deductions), other income taxed at slab rates
  hra: number; // HRA exemption amount (old regime only)
  c80: number; // 80C: PF, PPF, ELSS, life insurance, tuition fees, home loan principal
  d80: number; // 80D: health insurance for self, spouse, children
  d80parents: number; // 80D for parents
  parentsSenior: boolean;
  home: number; // home loan interest, self-occupied, section 24(b)
  nps: number; // own NPS contribution, 80CCD(1B)
  employerNps?: number; // employer NPS contribution, 80CCD(2): in both regimes, capped at a share of basic + DA (already part of gross salary)
  basic?: number; // yearly basic + DA, for the employer NPS cap
  eduLoan?: number; // education loan interest, 80E (old regime, no cap)
  savingsInterest?: number; // savings-account interest already in other income, 80TTA (80TTB for seniors), old regime
  extraDed?: number; // extra old-regime deduction, used to find the break-even
}

export interface Side {
  gross: number;
  deductions: { label: string; amount: number }[];
  taxable: number;
  slabTax: number;
  rebate: number; // 87A rebate plus marginal relief near the rebate limit
  surcharge: number; // after marginal relief
  cess: number;
  total: number;
  takeHome: number;
  marginal: number;
}

export const slabTax = (income: number, bands: Band[]) => {
  let tax = 0, lo = 0;
  for (const [hi, r] of bands) { if (income > lo) tax += (Math.min(income, hi) - lo) * r; lo = hi; }
  return tax;
};

// Surcharge with marginal relief: tax plus surcharge may not rise above the tax at the threshold by more than
// the income above it.
const surcharge = (income: number, tax: number, bands: Band[], taxAt: (n: number) => number) => {
  let lo = 0, rate = 0, thr = 0;
  for (const [hi, r] of bands) { if (income > lo) { rate = r; thr = lo; } lo = hi; }
  if (!rate) return 0;
  // the tax plus surcharge just at the threshold, under the band below
  let prev = 0;
  for (const [hi, r] of bands) { if (hi <= thr) prev = r; }
  const atThr = taxAt(thr) * (1 + prev);
  return Math.max(0, Math.min(tax * rate, atThr + (income - thr) - tax));
};

const clamp = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);
const r0 = (n: number) => Math.round(n);

function side(gross: number, deductions: { label: string; amount: number }[], bands: Band[], reb: { limit: number; max: number }, sBands: Band[], newRegime: boolean): Omit<Side, 'marginal'> {
  const taxable = Math.max(0, Math.floor((gross - deductions.reduce((s, d) => s + d.amount, 0)) / 10) * 10); // rounded down to Rs 10 (s. 288A)
  const slab = slabTax(taxable, bands);
  let rebate = 0;
  if (taxable <= reb.limit) rebate = Math.min(slab, reb.max);
  else if (newRegime) rebate = Math.max(0, slab - (taxable - reb.limit)); // marginal relief: tax no more than income above Rs 12 lakh
  const afterRebate = slab - rebate;
  const sur = surcharge(taxable, afterRebate, sBands, (n) => slabTax(n, bands));
  const cess = (afterRebate + sur) * CESS;
  const total = r0(afterRebate + sur + cess);
  return { gross, deductions, taxable, slabTax: r0(slab), rebate: r0(rebate), surcharge: r0(sur), cess: r0(cess), total, takeHome: gross - total };
}

function compute(inp: Input, regime: 'new' | 'old'): Omit<Side, 'marginal'> {
  const salary = clamp(inp.salary), other = clamp(inp.other);
  const gross = salary + other;
  if (regime === 'new') {
    const ne = Math.min(clamp(inp.employerNps ?? 0), CAPS.employerNpsNew * clamp(inp.basic ?? 0));
    return side(gross, [{ label: 'Standard deduction', amount: Math.min(NEW_STD, salary) }, ...(ne > 0 ? [{ label: 'Employer NPS 80CCD(2)', amount: ne }] : [])], NEW_BANDS, NEW_REBATE, NEW_SURCHARGE, true);
  }
  const senior = inp.age !== 'under60';
  const d: { label: string; amount: number }[] = [
    { label: 'Standard deduction', amount: Math.min(OLD_STD, salary) },
    { label: 'HRA exemption', amount: Math.min(clamp(inp.hra), salary) },
    { label: '80C', amount: Math.min(clamp(inp.c80), CAPS.c80) },
    { label: '80D (self and family)', amount: Math.min(clamp(inp.d80), senior ? CAPS.d80selfSenior : CAPS.d80self) },
    { label: '80D (parents)', amount: Math.min(clamp(inp.d80parents), inp.parentsSenior ? CAPS.d80parentsSenior : CAPS.d80parents) },
    { label: 'Home loan interest 24(b)', amount: Math.min(clamp(inp.home), CAPS.home24b) },
    { label: 'NPS 80CCD(1B)', amount: Math.min(clamp(inp.nps), CAPS.nps) },
    { label: 'Employer NPS 80CCD(2)', amount: Math.min(clamp(inp.employerNps ?? 0), CAPS.employerNpsOld * clamp(inp.basic ?? 0)) },
    { label: 'Education loan interest 80E', amount: clamp(inp.eduLoan ?? 0) },
    { label: senior ? 'Deposit interest 80TTB' : 'Savings interest 80TTA', amount: Math.min(clamp(inp.savingsInterest ?? 0), clamp(inp.other), senior ? CAPS.d80ttbCap : CAPS.d80ttaCap) },
    { label: 'Other deductions', amount: clamp(inp.extraDed ?? 0) },
  ].filter((x) => x.amount > 0);
  return side(gross, d, OLD_BANDS[inp.age] || OLD_BANDS.under60, OLD_REBATE, OLD_SURCHARGE, false);
}

export function indiaTax(inp: Input) {
  const out = {} as Record<'new' | 'old', Side>;
  for (const reg of ['new', 'old'] as const) {
    const a = compute(inp, reg);
    const b = compute({ ...inp, other: clamp(inp.other) + 1000 }, reg);
    out[reg] = { ...a, marginal: (b.total - a.total) / 1000 };
  }
  const better = out.new.total <= out.old.total ? 'new' : 'old';
  return { ...out, better, saving: Math.abs(out.new.total - out.old.total) };
}

// ---- Extras: break-even, what-if and monthly view ----
/** Extra old-regime deductions (on top of what is entered) that would make the old regime cost the same as the new one.
 *  0 when the old regime already wins; null when no amount of deduction gets there. */
export function breakEven(inp: Input): number | null {
  const base = indiaTax(inp);
  if (base.old.total <= base.new.total) return 0;
  const gross = clamp(inp.salary) + clamp(inp.other);
  const f = (x: number) => compute({ ...inp, extraDed: clamp(inp.extraDed ?? 0) + x }, 'old').total;
  if (f(gross) > base.new.total) return null;
  let lo = 0, hi = gross;
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (f(mid) > base.new.total) lo = mid; else hi = mid; }
  return Math.ceil(hi / 1000) * 1000;
}
/** Yearly amount from a monthly one, never negative or NaN. */
export const yearly = (monthly: number) => clamp(monthly) * 12;
/** Tax change for an extra salary amount in each regime. */
export function nextExtra(inp: Input, extra = 100000) {
  const a = indiaTax(inp), b = indiaTax({ ...inp, salary: clamp(inp.salary) + extra });
  return { new: b.new.total - a.new.total, old: b.old.total - a.old.total };
}
