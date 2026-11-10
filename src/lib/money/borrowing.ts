// Loan comparison, car loan, card payoff and debt-to-income maths. Plain TypeScript, no DOM.

/** Payment per period for a loan of `principal` over n periods at rate i per period, leaving `balloon` unpaid at the end. */
export const payment = (principal: number, i: number, n: number, balloon = 0) => {
  if (n <= 0) return NaN;
  if (i === 0) return (principal - balloon) / n;
  return ((principal - balloon / Math.pow(1 + i, n)) * i) / (1 - Math.pow(1 + i, -n));
};

/** Present value of n level payments at rate i. */
export const presentValue = (pay: number, i: number, n: number) => (i === 0 ? pay * n : (pay * (1 - Math.pow(1 + i, -n))) / i);

/** Monthly rate at which `net` received today equals `pay` paid at the end of each of n months, plus `balloon` at the end. */
export function solveRate(net: number, pay: number, n: number, balloon = 0): number {
  const f = (i: number) => presentValue(pay, i, n) + balloon / Math.pow(1 + i, n) - net;
  let lo = 0, hi = 1;
  if (f(0) < 0) return NaN; // you pay back less than you got
  while (f(hi) > 0 && hi < 1e6) hi *= 2;
  for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}

export interface Offer { amount: number; ratePct: number; years: number; upfront: number; monthlyFee: number }
export interface OfferOut { payment: number; monthly: number; totalPaid: number; totalCost: number; interest: number; aprPct: number }
/** One loan offer: payment, what you pay in total, and the APR (the yearly rate that includes the fees). */
export function evalOffer(o: Offer): OfferOut {
  const n = Math.round(o.years * 12), i = o.ratePct / 1200;
  const pay = payment(o.amount, i, n);
  const monthly = pay + o.monthlyFee;
  const totalPaid = pay * n + o.monthlyFee * n + o.upfront;
  const interest = pay * n - o.amount;
  const net = o.amount - o.upfront;
  const mi = solveRate(net, monthly, n);
  return { payment: pay, monthly, totalPaid, totalCost: totalPaid - o.amount, interest, aprPct: mi * 1200 };
}

/** Flat rate (interest on the full amount every year) to the reducing-balance rate with the same monthly payment. */
export function flatToReducing(flatPct: number, years: number) {
  const n = Math.round(years * 12), pay = (1 + (flatPct / 100) * years) / n; // per 1 borrowed
  return { monthly: pay, reducingPct: solveRate(1, pay, n) * 1200 };
}
/** Reducing-balance rate to the flat rate with the same total interest. */
export function reducingToFlat(ratePct: number, years: number) {
  const n = Math.round(years * 12), pay = payment(1, ratePct / 1200, n);
  return (((pay * n - 1) / years) * 100);
}

export interface CarIn {
  price: number; trade: number; down: number; taxPct: number; taxOnNet: boolean; fees: number; financeFees: boolean;
  ratePct: number; months: number; balloonPct: number;
}
export function car(o: CarIn) {
  const taxable = Math.max(0, o.taxOnNet ? o.price - o.trade : o.price);
  const tax = (taxable * o.taxPct) / 100;
  const total = o.price + tax + o.fees;
  const loan = Math.max(0, total - o.trade - o.down - (o.financeFees ? 0 : o.fees)); // fees paid in cash when not financed
  const balloon = (o.price * o.balloonPct) / 100;
  const i = o.ratePct / 1200;
  const pay = payment(loan, i, o.months, Math.min(balloon, loan));
  const totalPaid = pay * o.months + Math.min(balloon, loan);
  return { tax, loan, balloon: Math.min(balloon, loan), payment: pay, interest: totalPaid - loan, totalPaid, cashNow: o.down + (o.financeFees ? 0 : o.fees), totalCost: totalPaid + o.down + (o.financeFees ? 0 : o.fees) };
}

export interface CardIn {
  balance: number; aprPct: number; mode: 'min' | 'fixed'; minPct: number; floor: number; fixed: number;
  promo: boolean; feePct: number; promoRatePct: number; promoMonths: number;
}
export interface CardOut { months: number; interest: number; fee: number; paid: number; first: number; balances: number[]; never: boolean }
/** Pay a card down month by month. With a balance transfer the fee is added up front and the promo rate applies for the promo months. */
export function card(o: CardIn): CardOut {
  const fee = o.promo ? (o.balance * o.feePct) / 100 : 0;
  let bal = o.balance + fee, interest = 0, k = 0, first = 0;
  const balances = [bal];
  while (bal > 0.005 && k < 1200) {
    const rate = (o.promo && k < o.promoMonths ? o.promoRatePct : o.aprPct) / 1200;
    const int = bal * rate;
    const want = o.mode === 'fixed' ? o.fixed : Math.max((bal * o.minPct) / 100, o.floor);
    const pay = Math.min(bal + int, want);
    if (k === 0) first = pay;
    if (pay <= int && k > 0 && bal >= balances[k - 1] && k > 600) break;
    interest += int; bal = bal + int - pay; k++;
    balances.push(bal);
  }
  const never = bal > 0.005;
  return { months: k, interest, fee, paid: o.balance + fee + interest, first, balances, never };
}

export type Region = 'ca' | 'us' | 'uk';
export interface DtiIn { income: number; debts: number; housing: number }
/** Debt-to-income: share of gross monthly income that goes to debts (and housing, if given). */
export const dti = (o: DtiIn) => ({ debtPct: (o.debts / o.income) * 100, totalPct: ((o.debts + o.housing) / o.income) * 100 });

export const LIMITS = {
  ca: { front: 39, back: 44, name: 'Canada: GDS 39%, TDS 44%' },
  us: { front: 28, back: 36, name: 'United States: 28% / 36%' },
} as const;
/** Largest monthly housing payment under the front and back ratios, and the loan it supports. */
export function affordability(region: 'ca' | 'us', income: number, debts: number, otherHousing: number, ratePct: number, years: number) {
  const L = LIMITS[region];
  const byFront = (income * L.front) / 100 - otherHousing;
  const byBack = (income * L.back) / 100 - debts - otherHousing;
  const maxPay = Math.max(0, Math.min(byFront, byBack));
  const i = region === 'ca' ? Math.pow(1 + ratePct / 200, 1 / 6) - 1 : ratePct / 1200;
  return { maxPay, limitedBy: byFront <= byBack ? 'housing ratio' : 'total debt ratio', loan: presentValue(maxPay, i, Math.round(years * 12)) };
}
