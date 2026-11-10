// Maths for savings-goal, fire-calculator, retirement-planner and fd-calculator. Plain TypeScript, no DOM.

/** Monthly deposit (paid at the end of each month) that grows start to target in n months. */
export function monthlyNeeded(target: number, start: number, annualRate: number, months: number): number {
  const i = annualRate / 1200;
  if (months <= 0) return Math.max(0, target - start);
  if (i === 0) return Math.max(0, (target - start) / months);
  const g = Math.pow(1 + i, months);
  return Math.max(0, ((target - start * g) * i) / (g - 1));
}

/** Months to reach target with a fixed monthly deposit (end of month). Infinity if it never gets there. */
export function monthsToReach(target: number, start: number, annualRate: number, monthly: number): number {
  if (start >= target) return 0;
  const i = annualRate / 1200;
  if (i === 0) return monthly > 0 ? (target - start) / monthly : Infinity;
  const top = target * i + monthly, bottom = start * i + monthly;
  if (bottom <= 0 || top <= 0) return Infinity;
  return Math.log(top / bottom) / Math.log(1 + i);
}

/** Balance after n months (end-of-month deposits). */
export function balanceAfter(start: number, annualRate: number, monthly: number, months: number): number {
  const i = annualRate / 1200;
  if (i === 0) return start + monthly * months;
  const g = Math.pow(1 + i, months);
  return start * g + (monthly * (g - 1)) / i;
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
    const next = bal * (1 + ra) - need;
    if (next < 0 && lastsUntil === null) {
      // the pot runs out part-way through this month
      lastsUntil = a.retire + (m - 1 + Math.max(0, bal * (1 + ra)) / need) / 12;
      bal = 0;
    } else bal = lastsUntil === null ? next : 0;
    if (m % 12 === 0) { ages.push(a.retire + m / 12); balance.push(Math.max(0, bal)); }
  }
  // pot needed at retirement to pay `need` a month for retMonths (paid at month end)
  const needed = ra === 0 ? need * retMonths : (need * (1 - Math.pow(1 + ra, -retMonths))) / ra;
  return { potAtRetire, needed, gap: potAtRetire - needed, lastsUntil, ages, balance, endBalance: bal };
}

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
