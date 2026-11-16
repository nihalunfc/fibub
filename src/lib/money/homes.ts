// Mortgage, rent-or-buy and debt payoff maths. Plain TypeScript, no DOM.

export type Freq = 'monthly' | 'semimonthly' | 'biweekly' | 'accbiweekly' | 'weekly' | 'accweekly';
export const FREQS: { id: Freq; name: string; ppy: number }[] = [
  { id: 'monthly', name: 'Monthly (12 a year)', ppy: 12 },
  { id: 'semimonthly', name: 'Semi-monthly (24 a year)', ppy: 24 },
  { id: 'biweekly', name: 'Every 2 weeks (26 a year)', ppy: 26 },
  { id: 'accbiweekly', name: 'Accelerated every 2 weeks (26 a year)', ppy: 26 },
  { id: 'weekly', name: 'Weekly (52 a year)', ppy: 52 },
  { id: 'accweekly', name: 'Accelerated weekly (52 a year)', ppy: 52 },
];

/** Interest rate for one payment period. Canada compounds semi-annually; elsewhere the yearly rate is split evenly. */
export const periodRate = (annualPct: number, ppy: number, canada: boolean) => {
  const r = annualPct / 100;
  return canada ? Math.pow(1 + r / 2, 2 / ppy) - 1 : r / ppy;
};

/** Level payment that repays `principal` over n payments at rate i per payment. */
export const levelPayment = (principal: number, i: number, n: number) =>
  i === 0 ? principal / n : (principal * i) / (1 - Math.pow(1 + i, -n));

export const round2 = (x: number) => Math.round(x * 100) / 100;

/** CMHC premium rate (percent of the loan) by down payment share. Rates as published by CMHC. */
export const cmhcRate = (downPct: number) => (downPct >= 20 ? 0 : downPct >= 15 ? 2.8 : downPct >= 10 ? 3.1 : downPct >= 5 ? 4.0 : NaN);
/** Smallest down payment allowed in Canada: 5% of the first 500,000, 10% of the part up to 1.5 million, 20% above that. */
export const minDownCanada = (price: number) => (price >= 1_500_000 ? price * 0.2 : price <= 500_000 ? price * 0.05 : 25_000 + (price - 500_000) * 0.1);

export interface MortgageIn {
  price: number; down: number; ratePct: number; years: number; freq: Freq; canada: boolean;
  extraPerPayment: number; extraYearly: number; addPremium: boolean;
}
export interface YearRow { year: number; principal: number; interest: number; balance: number }
export interface MortgageOut {
  loan: number; premium: number; premiumPct: number; minDown: number; downOk: boolean; downPct: number;
  payment: number; ppy: number; payments: number; years: number; totalInterest: number; totalPaid: number;
  rows: YearRow[]; balances: number[]; baseInterest: number; basePayments: number; interestSaved: number;
}

function runLoan(loan: number, i: number, pay: number, ppy: number, extra: number, extraYearly: number) {
  let bal = loan, k = 0, interest = 0;
  const rows: YearRow[] = [], balances = [loan];
  let yr: YearRow = { year: 1, principal: 0, interest: 0, balance: loan };
  while (bal > 0.005 && k < ppy * 80) {
    k++;
    const int = bal * i;
    let p = Math.min(bal + int, pay + extra);
    if (k % ppy === 0) p = Math.min(bal + int, p + extraYearly);
    const princ = p - int;
    bal = Math.max(0, bal - princ);
    interest += int; yr.interest += int; yr.principal += princ; yr.balance = bal;
    if (k % ppy === 0 || bal <= 0.005) { rows.push(yr); balances.push(bal); yr = { year: yr.year + 1, principal: 0, interest: 0, balance: bal }; }
  }
  return { rows, balances, interest, payments: k };
}

export function mortgage(o: MortgageIn): MortgageOut {
  const f = FREQS.find((x) => x.id === o.freq)!, ppy = f.ppy;
  const downPct = (o.down / o.price) * 100;
  const base = o.price - o.down;
  const premiumPct = o.canada ? cmhcRate(downPct) : 0;
  const premium = o.canada && premiumPct > 0 ? (base * premiumPct) / 100 : 0;
  const minDown = o.canada ? minDownCanada(o.price) : 0;
  const downOk = !o.canada || o.down >= minDown - 0.005;
  const loan = base + (o.addPremium ? premium : 0);
  // The payment is always worked out from the monthly figure, so the "accelerated" options are half or a quarter of it.
  const iM = periodRate(o.ratePct, 12, o.canada);
  const monthly = levelPayment(loan, iM, o.years * 12);
  const i = periodRate(o.ratePct, ppy, o.canada);
  let payment: number;
  if (o.freq === 'accbiweekly') payment = monthly / 2;
  else if (o.freq === 'accweekly') payment = monthly / 4;
  else payment = levelPayment(loan, i, o.years * ppy);
  payment = round2(payment);
  const run = runLoan(loan, i, payment, ppy, Math.max(0, o.extraPerPayment), Math.max(0, o.extraYearly));
  const base0 = runLoan(loan, i, payment, ppy, 0, 0);
  return {
    loan, premium, premiumPct: isNaN(premiumPct) ? 0 : premiumPct, minDown, downOk, downPct, payment, ppy,
    payments: run.payments, years: run.payments / ppy, totalInterest: run.interest, totalPaid: loan + run.interest,
    rows: run.rows, balances: run.balances, baseInterest: base0.interest, basePayments: base0.payments,
    interestSaved: base0.interest - run.interest,
  };
}

// ---------- Extras for the mortgage calculator ----------
export interface HomeCostsIn { price: number; loan: number; downPct: number; taxPctYear: number; insuranceYear: number; hoaMonth: number; pmiPctYear: number }
/** Monthly costs of owning on top of the mortgage payment. PMI only counts while the down payment is under 20%. */
export function homeCostsMonthly(o: HomeCostsIn) {
  const pos = (x: number) => (isFinite(x) && x > 0 ? x : 0);
  const tax = (o.price * pos(o.taxPctYear)) / 100 / 12;
  const insurance = pos(o.insuranceYear) / 12;
  const hoa = pos(o.hoaMonth);
  const pmi = o.downPct < 20 ? (o.loan * pos(o.pmiPctYear)) / 100 / 12 : 0;
  return { tax, insurance, hoa, pmi, total: tax + insurance + hoa + pmi };
}
/** Date the mortgage is paid off, given a start date and the number of years (can be fractional). */
export function payoffDate(start: Date, years: number) {
  const d = new Date(start.getTime());
  d.setMonth(d.getMonth() + Math.ceil(years * 12 - 1e-9));
  return d;
}
/** Monthly payment for a bare loan at a rate, used for quick "what if the rate were..." comparisons. */
export const quickMonthly = (loan: number, ratePct: number, years: number, canada: boolean) =>
  levelPayment(loan, periodRate(ratePct, 12, canada), years * 12);

// ---------- Rent or buy ----------
export interface RvbIn {
  rent: number; rentGrowth: number; price: number; downPct: number; ratePct: number; mortYears: number; years: number;
  taxPct: number; maintPct: number; insurance: number; homeGrowth: number; investReturn: number; buyCostPct: number; sellCostPct: number; canada: boolean;
}
export interface RvbRow { year: number; buy: number; rent: number; homeValue: number; owed: number }
export function rentVsBuy(o: RvbIn) {
  const down = (o.price * o.downPct) / 100, loan = o.price - down;
  const i = periodRate(o.ratePct, 12, o.canada), n = o.mortYears * 12;
  const pay = levelPayment(loan, i, n);
  const g = Math.pow(1 + o.investReturn / 100, 1 / 12) - 1, hg = Math.pow(1 + o.homeGrowth / 100, 1 / 12) - 1;
  let bal = loan, home = o.price, rent = o.rent, ins = o.insurance;
  let rentPot = down + (o.price * o.buyCostPct) / 100, buyPot = 0;
  const rows: RvbRow[] = [];
  let breakEven: number | null = null;
  for (let m = 1; m <= o.years * 12; m++) {
    const int = bal * i;
    const p = m <= n ? pay : 0;
    bal = Math.max(0, bal - (p - int)); const interestPaid = m <= n ? int : 0; void interestPaid;
    const own = p + (home * (o.taxPct + o.maintPct)) / 100 / 12 + ins / 12;
    rentPot *= 1 + g; buyPot *= 1 + g;
    if (own > rent) rentPot += own - rent; else buyPot += rent - own;
    home *= 1 + hg;
    if (m % 12 === 0) {
      rent *= 1 + o.rentGrowth / 100; ins *= 1 + o.homeGrowth / 100;
      const y = m / 12;
      const buy = home * (1 - o.sellCostPct / 100) - bal + buyPot;
      rows.push({ year: y, buy, rent: rentPot, homeValue: home, owed: bal });
      if (breakEven === null && buy >= rentPot) breakEven = y;
    }
  }
  return { rows, breakEven, payment: pay, down, loan };
}

/** What a month costs in year 1: mortgage payment, property tax and upkeep, insurance, against the rent. */
export function rvbMonthly(o: RvbIn) {
  const down = (o.price * o.downPct) / 100, loan = o.price - down;
  const pay = levelPayment(loan, periodRate(o.ratePct, 12, o.canada), o.mortYears * 12);
  const taxMaint = (o.price * (o.taxPct + o.maintPct)) / 100 / 12, ins = o.insurance / 12;
  const owning = pay + taxMaint + ins;
  return { mortgage: pay, taxMaint, insurance: ins, owning, rent: o.rent, diff: owning - o.rent };
}

/** The "5% rule" yardstick: rent a year as a share of the price, and the price-to-rent ratio. */
export const priceToRent = (price: number, rentMonthly: number) => ({ ratio: rentMonthly > 0 ? price / (rentMonthly * 12) : 0, rentPct: price > 0 ? ((rentMonthly * 12) / price) * 100 : 0 });

/** Break-even year (or null) if the home price grew at each of the given rates instead. */
export function rvbSensitivity(o: RvbIn, growths: number[]) {
  return growths.map((hg) => ({ growth: hg, breakEven: rentVsBuy({ ...o, homeGrowth: hg }).breakEven }));
}

/** An amount `years` ahead in today's money at `inflation`% a year. */
export const rvbTodays = (v: number, inflation: number, years: number) => v / Math.pow(1 + inflation / 100, Math.max(0, years));

// ---------- Debt payoff ----------
export interface Debt { name: string; balance: number; apr: number; min: number }
export type Strategy = 'snowball' | 'avalanche' | 'minimums';
export interface PayoffRow { month: number; balances: number[]; interest: number; paid: number }
/** `lump` is a one-off payment made before the first month (ignored for 'minimums'). */
export function payoff(debts: Debt[], extra: number, strategy: Strategy, lump = 0) {
  const n = debts.length, bal = debts.map((d) => d.balance), done: (number | null)[] = debts.map((d) => (d.balance <= 0 ? 0 : null));
  const rows: PayoffRow[] = [];
  let totalInterest = 0, m = 0;
  const budget = debts.reduce((s, d) => s + d.min, 0) + Math.max(0, extra);
  const order = debts.map((_, k) => k).sort((a, b) => strategy === 'avalanche' ? debts[b].apr - debts[a].apr || bal[a] - bal[b] : bal[a] - bal[b] || debts[b].apr - debts[a].apr);
  if (strategy !== 'minimums' && lump > 0 && Number.isFinite(lump)) {
    let pool = lump;
    for (const k of order) { if (pool <= 0.005) break; const p = Math.min(bal[k], pool); if (p > 0) { bal[k] -= p; pool -= p; } }
  }
  while (bal.some((b) => b > 0.005) && m < 1200) {
    m++;
    let mInt = 0, paid = 0;
    for (let k = 0; k < n; k++) if (bal[k] > 0) { const x = (bal[k] * debts[k].apr) / 1200; bal[k] += x; mInt += x; }
    let pool = strategy === 'minimums' ? 0 : budget;
    if (strategy === 'minimums') {
      for (let k = 0; k < n; k++) if (bal[k] > 0) { const p = Math.min(bal[k], debts[k].min); bal[k] -= p; paid += p; }
    } else {
      for (let k = 0; k < n; k++) if (bal[k] > 0) { const p = Math.min(bal[k], debts[k].min); bal[k] -= p; pool -= p; paid += p; }
      for (const k of order) { if (pool <= 0.005) break; if (bal[k] > 0) { const p = Math.min(bal[k], pool); bal[k] -= p; pool -= p; paid += p; } }
    }
    for (let k = 0; k < n; k++) { if (bal[k] <= 0.005) bal[k] = 0; if (bal[k] === 0 && done[k] === null) done[k] = m; }
    totalInterest += mInt;
    rows.push({ month: m, balances: bal.slice(), interest: mInt, paid });
  }
  const finished = bal.every((b) => b <= 0.005);
  return { months: m, finished, totalInterest, rows, doneMonth: done, order: debts.map((_, k) => k).filter((k) => done[k] !== null).sort((a, b) => (done[a]! - done[b]!) || a - b) };
}

/** Year and month (0 to 11) that is `months` after the given year and month. */
export function addMonths(year: number, month0: number, months: number) {
  const t = year * 12 + month0 + Math.max(0, Math.round(months));
  return { year: Math.floor(t / 12), month0: t % 12 };
}

/** Names of debts whose minimum does not even cover one month of interest (the balance would never fall on minimums alone). */
export function minimumTooLow(debts: Debt[]) {
  return debts.filter((d) => d.balance > 0 && d.min <= (d.balance * d.apr) / 1200).map((d) => d.name);
}

/** The same payoff plan with different extra monthly amounts, so people can see what a bit more does. */
export function extraScenarios(debts: Debt[], extras: number[], strategy: Strategy, lump = 0) {
  return extras.map((extra) => { const r = payoff(debts, extra, strategy, lump); return { extra, months: r.months, finished: r.finished, interest: r.totalInterest }; });
}
