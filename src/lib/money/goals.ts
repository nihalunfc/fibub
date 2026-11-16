// Maths for savings-goal, fire-calculator, retirement-planner and fd-calculator. Plain TypeScript, no DOM.

/** Monthly deposit (paid at the end of each month, or the start when `due`) that grows start to target in n months. */
export function monthlyNeeded(target: number, start: number, annualRate: number, months: number, due = false): number {
  const i = annualRate / 1200;
  if (months <= 0) return Math.max(0, target - start);
  if (i === 0) return Math.max(0, (target - start) / months);
  const g = Math.pow(1 + i, months);
  return Math.max(0, (((target - start * g) * i) / (g - 1)) / (due ? 1 + i : 1));
}

/** Months to reach target with a fixed monthly deposit. Infinity if it never gets there. */
export function monthsToReach(target: number, start: number, annualRate: number, monthly: number, due = false): number {
  if (start >= target) return 0;
  const i = annualRate / 1200;
  if (due) monthly *= 1 + i;
  if (i === 0) return monthly > 0 ? (target - start) / monthly : Infinity;
  const top = target * i + monthly, bottom = start * i + monthly;
  if (bottom <= 0 || top <= 0) return Infinity;
  return Math.log(top / bottom) / Math.log(1 + i);
}

/** Balance after n months. */
export function balanceAfter(start: number, annualRate: number, monthly: number, months: number, due = false): number {
  const i = annualRate / 1200;
  if (i === 0) return start + monthly * months;
  const g = Math.pow(1 + i, months);
  return start * g + ((monthly * (g - 1)) / i) * (due ? 1 + i : 1);
}

/** What a goal costs in future money when prices rise `inflationPct` a year. */
export const inflate = (amount: number, inflationPct: number, months: number) => amount * Math.pow(1 + inflationPct / 100, months / 12);

/** "What if I saved more or less?": for each multiple of `monthly`, the months to the goal and the interest earned. */
export function whatIfMonthly(target: number, start: number, rate: number, monthly: number, factors: number[], due = false) {
  return factors.map((x) => {
    const m = monthsToReach(target, start, rate, monthly * x, due), n = Math.ceil(m - 1e-9);
    const interest = isFinite(m) ? Math.max(0, balanceAfter(start, rate, monthly * x, n, due) - start - monthly * x * n) : 0;
    return { factor: x, monthly: monthly * x, months: m, n, interest };
  });
}

/** Years to reach `target` from `start` saving `perYear` a year at real return r% (yearly steps). */
export function yearsToTarget(target: number, start: number, perYear: number, r: number): number {
  if (start >= target) return 0;
  const i = r / 100;
  if (i === 0) return perYear > 0 ? (target - start) / perYear : Infinity;
  const top = target * i + perYear, bottom = start * i + perYear;
  if (bottom <= 0 || top <= 0) return Infinity;
  return Math.log(top / bottom) / Math.log(1 + i);
}

export type RetireIn = {
  now: number; retire: number; planTo: number; savings: number; monthly: number;
  before: number; after: number; inflation: number; spend: number; other: number;
  /** Age the pension or other income starts (blank or 0 = at retirement). */
  otherFrom?: number;
};
export type RetireOut = {
  potAtRetire: number; needed: number; gap: number; lastsUntil: number | null;
  ages: number[]; balance: number[]; endBalance: number;
};

/** Everything in today's money. Returns use real rates ((1+r)/(1+inflation)-1). Saving rises with prices. */
export function retirement(a: RetireIn): RetireOut {
  const rb = Math.pow((1 + a.before / 100) / (1 + a.inflation / 100), 1 / 12) - 1;
  const ra = Math.pow((1 + a.after / 100) / (1 + a.inflation / 100), 1 / 12) - 1;
  const need = Math.max(0, a.spend - a.other);
  const later = a.otherFrom && a.otherFrom > a.retire ? a.otherFrom : 0;
  const needAt = (m: number) => (later && a.retire + (m - 1) / 12 < later ? Math.max(0, a.spend) : need);
  const workMonths = Math.round((a.retire - a.now) * 12), retMonths = Math.round((a.planTo - a.retire) * 12);
  let bal = a.savings;
  const ages = [a.now], balance = [bal];
  for (let m = 1; m <= workMonths; m++) {
    bal = bal * (1 + rb) + a.monthly;
    if (m % 12 === 0) { ages.push(a.now + m / 12); balance.push(bal); }
  }
  const potAtRetire = bal;
  let lastsUntil: number | null = null;
  for (let m = 1; m <= retMonths; m++) {
    const nd = needAt(m);
    const next = bal * (1 + ra) - nd;
    if (next < 0 && lastsUntil === null) {
      // the pot runs out part-way through this month
      lastsUntil = a.retire + (m - 1 + Math.max(0, bal * (1 + ra)) / nd) / 12;
      bal = 0;
    } else bal = lastsUntil === null ? next : 0;
    if (m % 12 === 0) { ages.push(a.retire + m / 12); balance.push(Math.max(0, bal)); }
  }
  // pot needed at retirement to pay `need` a month for retMonths (paid at month end)
  let needed = ra === 0 ? need * retMonths : (need * (1 - Math.pow(1 + ra, -retMonths))) / ra;
  if (later) { needed = 0; for (let m = 1; m <= retMonths; m++) needed += needAt(m) / Math.pow(1 + ra, m); }
  return { potAtRetire, needed, gap: potAtRetire - needed, lastsUntil, ages, balance, endBalance: bal };
}

/** Extra things worth knowing, all in today's money. */
export function retirementExtras(a: RetireIn, r: RetireOut) {
  const rb = Math.pow((1 + a.before / 100) / (1 + a.inflation / 100), 1 / 12) - 1;
  const ra = Math.pow((1 + a.after / 100) / (1 + a.inflation / 100), 1 / 12) - 1;
  const workMonths = Math.round((a.retire - a.now) * 12), retMonths = Math.round((a.planTo - a.retire) * 12);
  // extra monthly saving that closes a shortfall (deposits at the end of each month)
  const grow = rb === 0 ? workMonths : (Math.pow(1 + rb, workMonths) - 1) / rb;
  const extraMonthly = r.gap < 0 && grow > 0 ? -r.gap / grow : 0;
  // monthly spending the pot could pay until planTo (pension counted, when it starts at retirement)
  const annuity = retMonths <= 0 ? 0 : ra === 0 ? retMonths : (1 - Math.pow(1 + ra, -retMonths)) / ra;
  const affordableSpend = annuity > 0 ? r.potAtRetire / annuity + (a.otherFrom && a.otherFrom > a.retire ? 0 : a.other) : 0;
  // earliest retirement age (quarter-year steps) at which the money lasts to planTo
  let earliest: number | null = null;
  for (let x = Math.ceil((a.now + 0.25) * 4) / 4; x <= a.planTo - 0.25 + 1e-9; x += 0.25) {
    if (retirement({ ...a, retire: x }).lastsUntil === null) { earliest = x; break; }
  }
  return { extraMonthly, affordableSpend, earliest };
}

/** Multiply a today's-money amount by this to show it as future (not inflation-adjusted) money. */
export const futureFactor = (inflationPct: number, years: number) => Math.pow(1 + inflationPct / 100, Math.max(0, years));

export type Comp = 'm' | 'q' | 'h' | 'y' | 's';
export const COMP_PER_YEAR: Record<string, number> = { m: 12, q: 4, h: 2, y: 1 };

/** Fixed deposit maturity. years may be fractional. 's' = simple interest paid at the end. */
export function fdMaturity(p: number, rate: number, years: number, comp: Comp): number {
  if (comp === 's') return p * (1 + (rate / 100) * years);
  const m = COMP_PER_YEAR[comp];
  return p * Math.pow(1 + rate / 100 / m, m * years);
}

/** Recurring deposit: a deposit at the start of each month, compounding as for an FD.
 *  Quarterly compounding is the Indian bank formula R[(1+i)^n - 1] / (1 - (1+i)^(-1/3)), i = rate/4, n = quarters. */
export function rdMaturity(d: number, rate: number, months: number, comp: Comp): number {
  let total = 0;
  if (comp === 's') {
    for (let j = 1; j <= months; j++) total += 1 + (rate / 100) * (j / 12);
    return d * total;
  }
  const m = COMP_PER_YEAR[comp];
  const g = Math.pow(1 + rate / 100 / m, m / 12);
  for (let j = 1; j <= months; j++) total += Math.pow(g, j);
  return d * total;
}

/** Interest left after tax at a slab rate (percent). Negative interest is not taxed. */
export const afterTax = (interest: number, taxPct: number) => interest - Math.max(0, interest) * Math.min(100, Math.max(0, taxPct)) / 100;
/** Value in today's money after `years` of yearly inflation (percent). */
export const todaysMoney = (amount: number, inflation: number, years: number) => amount / Math.pow(1 + inflation / 100, years);
/** Interest an FD earns in each full or part year (for the 10% TDS check, which looks at one bank and one year). First-year figure for a plain deposit. */
export const firstYearInterest = (p: number, rate: number, comp: Comp) => fdMaturity(p, rate, 1, comp) - p;
/** Bank TDS (10%) applies once a year's interest passes the limit: Rs 40,000, or Rs 50,000 for senior citizens (from 1 April 2025). */
export const tdsLimit = (senior: boolean) => (senior ? 50000 : 40000);

// ---------- FIRE calculator ----------
/** The pot that pays `spend` a year at `wrPct`% a year, after any other income (pension, part-time work) that covers part of it. */
export const fireNumber = (spend: number, wrPct: number, otherIncome = 0) =>
  wrPct > 0 ? Math.max(0, (Number.isFinite(spend) ? spend : 0) - Math.max(0, otherIncome || 0)) / (wrPct / 100) : Infinity;

/** What you need today so that growth alone (no more saving) reaches `fire` in `yearsLeft` years at real return `ret`%. */
export const coastNumber = (fire: number, ret: number, yearsLeft: number) => fire / Math.pow(1 + ret / 100, Math.max(0, yearsLeft));

/** Whole years until the savings, left to grow on their own from then on, reach `fire` by the end of `yearsLeft`. 0 = already there, Infinity = not within yearsLeft. */
export function yearsToCoast(fire: number, saved: number, perYear: number, ret: number, yearsLeft: number): number {
  const i = ret / 100;
  let bal = saved;
  for (let t = 0; t <= Math.max(0, Math.floor(yearsLeft)); t++) {
    if (bal * Math.pow(1 + i, yearsLeft - t) >= fire) return t;
    bal = bal * (1 + i) + perYear;
  }
  return Infinity;
}

/** Savings at the end of each year, 0..years. */
export function savingsByYear(saved: number, perYear: number, ret: number, years: number): number[] {
  const out: number[] = [];
  let b = saved;
  for (let k = 0; k <= years; k++) { out.push(b); b = b * (1 + ret / 100) + perYear; }
  return out;
}

/** Years to FIRE for each saving rate (percent of income). Spending = income x (1 - rate); retirement spending is that times `retireRatio`. */
export function savingRateCurve(income: number, rates: number[], wrPct: number, saved: number, ret: number, retireRatio = 1, other = 0) {
  return rates.map((rate) => {
    const spend = income * (1 - rate / 100), fire = fireNumber(spend * retireRatio, wrPct, other);
    return { rate, spend, fire, years: yearsToTarget(fire, saved, income - spend, ret) };
  });
}

/** The saving rate (percent of income, may be below 0 or above 100) that gives this yearly spending. */
export const savingRate = (income: number, spend: number) => (income > 0 ? ((income - spend) / income) * 100 : 0);
