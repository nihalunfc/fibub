// Loan payoff maths: monthly amortisation with extra payments (prepayments).

export interface Prepay {
  amount: number;
  every: number;   // 0 = one time, otherwise every N months
  start: number;   // month number of the first prepayment (1 = first payment month)
  end?: number;    // last month it can happen (0/undefined = until the loan is paid)
}
export interface Row { m: number; interest: number; principal: number; extra: number; payment: number; balance: number }
export interface Result { rows: Row[]; months: number; interest: number; extra: number; emi: number; lastEmi: number }

/** The fixed monthly payment (EMI) that pays off `p` over `n` months at `annual` % a year. */
export function emi(p: number, annual: number, n: number) {
  const r = annual / 1200;
  if (n <= 0) return p;
  if (r === 0) return p / n;
  const f = Math.pow(1 + r, n);
  return (p * r * f) / (f - 1);
}

/** Months needed to pay off `p` with monthly payment `pay` (Infinity if it never gets paid). */
export function monthsFor(p: number, annual: number, pay: number) {
  const r = annual / 1200;
  if (r === 0) return Math.ceil(p / pay);
  if (pay <= p * r) return Infinity;
  return Math.ceil(-Math.log(1 - (p * r) / pay) / Math.log(1 + r) - 1e-9);
}

export const extraIn = (plan: Prepay[], m: number) => plan.reduce((s, x) => {
  if (!(x.amount > 0) || m < x.start || (x.end && m > x.end)) return s;
  if (x.every === 0) return m === x.start ? s + x.amount : s;
  return (m - x.start) % x.every === 0 ? s + x.amount : s;
}, 0);

/**
 * Runs the loan month by month.
 * mode 'tenure': keep paying the same EMI, so the loan ends sooner (saves the most interest).
 * mode 'emi': after each prepayment, the EMI is recalculated over the original end date.
 */
export function simulate(p: number, annual: number, n: number, plan: Prepay[] = [], mode: 'tenure' | 'emi' = 'tenure', pay?: number): Result {
  const r = annual / 1200;
  const base = pay && pay > 0 ? pay : emi(p, annual, n);
  let e = base, bal = p, interestSum = 0, extraSum = 0;
  const rows: Row[] = [];
  const maxMonths = Math.max(n, 1) * 3 + 1200;
  for (let m = 1; bal > 0.005 && m <= maxMonths; m++) {
    const interest = bal * r;
    let principal = Math.min(e - interest, bal);
    if (principal < 0) principal = 0;
    bal -= principal;
    const extra = Math.min(extraIn(plan, m), bal);
    bal -= extra;
    interestSum += interest; extraSum += extra;
    rows.push({ m, interest, principal, extra, payment: interest + principal, balance: Math.max(0, bal) });
    if (mode === 'emi' && extra > 0 && bal > 0.005) e = emi(bal, annual, Math.max(1, n - m));
  }
  return { rows, months: rows.length, interest: interestSum, extra: extraSum, emi: base, lastEmi: e };
}

/** Interest paid in each 12-month block. */
export function byYear(res: Result) {
  const out: { interest: number; principal: number; extra: number; balance: number }[] = [];
  for (const row of res.rows) {
    const y = Math.floor((row.m - 1) / 12);
    out[y] ??= { interest: 0, principal: 0, extra: 0, balance: 0 };
    out[y].interest += row.interest; out[y].principal += row.principal; out[y].extra += row.extra; out[y].balance = row.balance;
  }
  return out;
}

export const presets = (e: number, p: number): { label: string; plan: Prepay[] }[] => {
  const round = (x: number) => { const k = Math.pow(10, Math.max(0, Math.floor(Math.log10(Math.max(1, x))) - 1)); return Math.round(x / k) * k; };
  return [
    { label: `Pay 5% more every month`, plan: [{ amount: round(e * 0.05), every: 1, start: 1 }] },
    { label: `Pay 10% more every month`, plan: [{ amount: round(e * 0.1), every: 1, start: 1 }] },
    { label: `1 extra payment every year`, plan: [{ amount: round(e), every: 12, start: 12 }] },
    { label: `1 extra payment every 6 months`, plan: [{ amount: round(e), every: 6, start: 6 }] },
    { label: `5% of the loan once a year`, plan: [{ amount: round(p * 0.05), every: 12, start: 12 }] },
    { label: `10% of the loan once, now`, plan: [{ amount: round(p * 0.1), every: 0, start: 1 }] },
  ];
};

export const span = (months: number) => {
  const y = Math.floor(months / 12), m = months % 12;
  return [y ? `${y} year${y === 1 ? '' : 's'}` : '', m ? `${m} month${m === 1 ? '' : 's'}` : ''].filter(Boolean).join(' ') || '0 months';
};
