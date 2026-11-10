// Insurance maths for the Money > Insurance tools. Plain TypeScript, no DOM; checked in tests/sci.mjs.
// Every model here is a standard textbook one (cost-sharing arithmetic, Poisson claim counts, lognormal claim
// sizes, expected utility, Markov no-claim-bonus ladders, internal rate of return, level premiums from death
// probabilities). Rules that come from a regulator (IN motor depreciation, IN no-claim bonus) are dated below.
import { normCdf } from '../sci/stats.ts';

// ---------- 1. Out-of-pocket cost of a health or dental plan ----------
export type Plan = {
  premium: number;    // yearly premium
  deductible: number; // you pay the first part of covered costs
  coins: number;      // your share after the deductible, 0 to 1 (coinsurance or India co-payment)
  oopMax: number;     // most you pay in a year in cost sharing (0 = no limit)
  cap: number;        // most the plan pays in a year (sum insured or annual maximum; 0 = no limit)
  fixed?: number;     // copays you expect for the year, added as they are
};
export type PlanCost = { youPay: number; planPays: number; total: number };
/** What you pay for `spend` of covered care in a year: min(S, D) + c·max(0, S − D), capped at the out-of-pocket max; anything above the plan's cap is yours too. */
export function planCost(p: Plan, spend: number): PlanCost {
  const S = Math.max(0, spend);
  let share = Math.min(S, p.deductible) + p.coins * Math.max(0, S - p.deductible);
  if (p.oopMax > 0) share = Math.min(share, p.oopMax);
  let planPays = S - share, youPay = share;
  if (p.cap > 0 && planPays > p.cap) { youPay += planPays - p.cap; planPays = p.cap; }
  youPay += p.fixed || 0;
  return { youPay, planPays, total: p.premium + youPay };
}
/** Spends between 0 and `max` where two plans cost the same in a year (where the cheaper plan changes). */
export function breakEvens(a: Plan, b: Plan, max: number, steps = 2000): number[] {
  const d = (s: number) => planCost(a, s).total - planCost(b, s).total;
  const out: number[] = [];
  let x0 = 0, d0 = d(0); // last point where the plans differed
  for (let k = 1; k <= steps; k++) {
    const x1 = (max * k) / steps, d1 = d(x1);
    if (Math.abs(d1) < 1e-9) continue;
    if (Math.abs(d0) < 1e-9) { x0 = x1; d0 = d1; continue; }
    if ((d0 < 0) !== (d1 < 0)) {
      let lo = x0, hi = x1;
      for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2, dm = d(m); if (Math.abs(dm) < 1e-9) { lo = hi = m; break; } if ((dm < 0) === (d0 < 0)) lo = m; else hi = m; }
      out.push((lo + hi) / 2);
    }
    x0 = x1; d0 = d1;
  }
  return out;
}

// ---------- 2. Room-rent cap and proportionate deduction (India health) ----------
export type Bill = { label: string; amount: number; linked: boolean };
/** If the room costs more than the cap, linked bills (room, nursing, doctors, operation theatre) are paid only in the
 * ratio cap ÷ actual. IRDAI says medicines, implants, consumables and diagnostics are not cut this way. */
export function roomRent(bills: Bill[], capPerDay: number, actualPerDay: number) {
  const ratio = actualPerDay > 0 && capPerDay > 0 ? Math.min(1, capPerDay / actualPerDay) : 1;
  let billed = 0, paid = 0;
  const rows = bills.map((b) => { const p = b.linked ? b.amount * ratio : b.amount; billed += b.amount; paid += p; return { ...b, paid: p, cut: b.amount - p }; });
  return { ratio, billed, paid, cut: billed - paid, rows };
}

// ---------- 3. Underinsurance: condition of average / coinsurance clause (home) ----------
/** Payout = loss × min(1, SI ÷ (required share × true value)), less the deductible, never above the sum insured.
 * India "average" uses the full value (required = 1); many US and Canadian policies use 80%. */
export function averageClause(loss: number, sumInsured: number, value: number, required = 1, deductible = 0) {
  const need = required * value;
  const factor = need > 0 ? Math.min(1, sumInsured / need) : 1;
  const payout = Math.max(0, Math.min(loss * factor, sumInsured) - deductible);
  const full = Math.max(0, Math.min(loss, Math.max(sumInsured, need)) - deductible);
  return { factor, payout, youPay: loss - payout, shortBy: Math.max(0, need - sumInsured), fullPayout: full };
}

// ---------- 4. Claim counts and sizes ----------
export const poisson = (k: number, lambda: number) => { let p = Math.exp(-lambda); for (let i = 1; i <= k; i++) p *= lambda / i; return p; };
/** Lognormal from its median and 90th percentile (the "1 in 10 claims is bigger than this" value). */
export const lognormal = (median: number, p90: number) => { const mu = Math.log(median); const s = Math.max(1e-6, Math.log(Math.max(p90, median * 1.0001) / median) / 1.2815515655446004); return { mu, s }; };
/** E[min(X, D)] for a lognormal X: e^(μ+σ²/2)·Φ((ln D − μ − σ²)/σ) + D·(1 − Φ((ln D − μ)/σ)). */
export function limitedMean(D: number, mu: number, s: number) {
  if (D <= 0) return 0;
  const z = (Math.log(D) - mu) / s;
  return Math.exp(mu + (s * s) / 2) * normCdf(z - s) + D * (1 - normCdf(z));
}
export function rng(seed = 1) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const poissonDraw = (lambda: number, r: () => number) => { const L = Math.exp(-lambda); let k = 0, p = 1; do { k++; p *= r(); } while (p > L); return k - 1; };
const normalDraw = (r: () => number) => { const u = Math.max(1e-12, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

export type DeductibleIn = { lambda: number; median: number; p90: number; premLow: number; premHigh: number; dLow: number; dHigh: number; years: number; runs?: number; seed?: number };
/** Low deductible (dearer premium) against high deductible (cheaper premium). Each claim costs you min(claim, deductible). */
export function deductibleChoice(a: DeductibleIn) {
  const { mu, s } = lognormal(a.median, a.p90);
  const saving = a.premLow - a.premHigh, gap = a.dHigh - a.dLow;
  const extraPerClaim = limitedMean(a.dHigh, mu, s) - limitedMean(a.dLow, mu, s);
  const expectedYear = saving - a.lambda * extraPerClaim; // > 0: high deductible saves on average
  const runs = a.runs ?? 10000, r = rng(a.seed ?? 7), totals: number[] = [];
  for (let k = 0; k < runs; k++) {
    let t = 0;
    for (let y = 0; y < a.years; y++) { t += saving; const n = poissonDraw(a.lambda, r); for (let i = 0; i < n; i++) { const x = Math.exp(mu + s * normalDraw(r)); t -= Math.min(x, a.dHigh) - Math.min(x, a.dLow); } }
    totals.push(t);
  }
  totals.sort((x, y) => x - y);
  const pct = (p: number) => totals[Math.min(runs - 1, Math.floor(p * runs))];
  return {
    saving, gap, extraPerClaim, expectedYear, expectedTotal: expectedYear * a.years,
    yearsToRecover: saving > 0 ? gap / saving : Infinity,   // one full-size claim wipes out this many years of savings
    breakEvenRate: extraPerClaim > 0 ? saving / extraPerClaim : Infinity, // claims a year at which both cost the same
    chanceHighWins: totals.filter((t) => t > 0).length / runs, p10: pct(0.1), p50: pct(0.5), p90: pct(0.9),
  };
}

// ---------- 5. Should I insure? Expected value and expected utility ----------
/** Constant relative risk aversion: γ = 1 is log utility; γ = 0 cares only about averages. */
export const utility = (w: number, g: number) => (w <= 0 ? -Infinity : Math.abs(g - 1) < 1e-9 ? Math.log(w) : (Math.pow(w, 1 - g) - 1) / (1 - g));
export type InsureIn = { wealth: number; loss: number; p: number; premium: number; deductible: number; gamma: number };
export function shouldInsure(a: InsureIn) {
  const covered = Math.max(0, a.loss - a.deductible);
  const expLoss = a.p * a.loss, expPayout = a.p * covered;
  const loading = expPayout > 0 ? a.premium / expPayout - 1 : Infinity; // share of the premium above the fair price
  const eu = (prem: number) => (1 - a.p) * utility(a.wealth - prem, a.gamma) + a.p * utility(a.wealth - prem - a.deductible, a.gamma);
  const euNo = (1 - a.p) * utility(a.wealth, a.gamma) + a.p * utility(a.wealth - a.loss, a.gamma);
  const ruin = a.wealth - a.loss <= 0;
  // Highest premium at which insuring is still as good as not insuring (bisection on expected utility).
  let lo = 0, hi = Math.max(0, a.wealth - a.deductible) * 0.999999;
  if (eu(0) < euNo) hi = 0;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (eu(m) >= euNo) lo = m; else hi = m; }
  const maxPremium = ruin ? Math.max(0, a.wealth - a.deductible) : lo;
  return { expLoss, expPayout, expCostInsured: a.premium + a.p * a.deductible, loading, maxPremium, riskPremium: maxPremium - expPayout, worth: a.premium <= maxPremium, ruin, shareOfWealth: a.loss / a.wealth };
}

// ---------- 6. Claim or pay yourself? No-claim bonus as a Markov chain ----------
/** India private car own-damage no-claim bonus (India Motor Tariff GR.27, kept by insurers): 0, 20, 25, 35, 45, 50%
 * after 0 to 5 claim-free years; a claim sends it back to 0. Checked 2026-11-10. */
export const NCB_IN = [0, 20, 25, 35, 45, 50];
export type NcbIn = { base: number; ladder: number[]; level: number; drop: number; lambda: number; years: number; rate: number };
/** Expected premiums over the next years if you claim now vs if you don't, with future claims at rate λ a year
 * (each future year has a 1 − e^(−λ) chance of a claim). `drop` = levels lost per claim (India: all of them). */
export function claimCost(a: NcbIn) {
  const top = a.ladder.length - 1, pc = 1 - Math.exp(-a.lambda);
  const after = (lvl: number, claimed: boolean) => (claimed ? Math.max(0, lvl - a.drop) : Math.min(top, lvl + 1));
  const run = (start: number) => {
    let dist = new Array(top + 1).fill(0); dist[start] = 1;
    const prem: number[] = [];
    for (let y = 0; y < a.years; y++) {
      prem.push(dist.reduce((s, p, l) => s + p * a.base * (1 - a.ladder[l] / 100), 0));
      const next = new Array(top + 1).fill(0);
      dist.forEach((p, l) => { next[after(l, true)] += p * pc; next[after(l, false)] += p * (1 - pc); });
      dist = next;
    }
    return prem;
  };
  const claim = run(after(a.level, true)), keep = run(after(a.level, false));
  const extra = claim.map((c, k) => c - keep[k]);
  const pv = extra.reduce((s, e, k) => s + e / Math.pow(1 + a.rate / 100, k), 0);
  return { claim, keep, extra, total: extra.reduce((s, e) => s + e, 0), pv };
}

// ---------- 7. India motor: IDV and parts depreciation (India Motor Tariff GR.8 and GR.9, checked 2026-11-10) ----------
/** Depreciation on the ex-showroom price used for the insured declared value, by vehicle age in months; null over 5 years (agreed value). */
export function idvDep(ageMonths: number): number | null {
  if (ageMonths <= 6) return 5; if (ageMonths <= 12) return 15; if (ageMonths <= 24) return 20;
  if (ageMonths <= 36) return 30; if (ageMonths <= 48) return 40; if (ageMonths <= 60) return 50; return null;
}
export const idv = (exShowroom: number, accessories: number, ageMonths: number) => { const d = idvDep(ageMonths); return d === null ? null : (exShowroom + accessories) * (1 - d / 100); };
export type PartKind = 'metal' | 'plastic' | 'fibreglass' | 'glass';
/** Depreciation on parts replaced in an own-damage claim: rubber, nylon and plastic 50%, fibreglass 30%, glass nil, metal by age. */
export function partDep(kind: PartKind, ageMonths: number): number {
  if (kind === 'plastic') return 50; if (kind === 'fibreglass') return 30; if (kind === 'glass') return 0;
  if (ageMonths <= 6) return 0; if (ageMonths <= 12) return 5; if (ageMonths <= 24) return 10; if (ageMonths <= 36) return 15;
  if (ageMonths <= 48) return 25; if (ageMonths <= 60) return 35; if (ageMonths <= 120) return 40; return 50;
}
/** Compulsory deductible for private cars (India Motor Tariff GR.40): ₹1,000 up to 1,500 cc, ₹2,000 above. */
export const compulsoryDeductible = (cc: number) => (cc > 1500 ? 2000 : 1000);

// ---------- 8. Policy return: internal rate of return of yearly cash flows ----------
/** flows[k] happens at the start of year k (k = 0 now). Negative = you pay. */
export const npv = (flows: number[], r: number) => flows.reduce((s, f, k) => s + f / Math.pow(1 + r, k), 0);
export function irr(flows: number[]): number {
  let lo = -0.99, hi = 1, flo = npv(flows, lo), fhi = npv(flows, hi);
  if (!(flo * fhi < 0)) return NaN;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, fm = npv(flows, m); if ((fm < 0) === (flo < 0)) { lo = m; flo = fm; } else hi = m; }
  return (lo + hi) / 2;
}
export type PolicyIn = { premium: number; payYears: number; benefits: { year: number; amount: number }[] };
/** Cash flows for a savings-type policy: premium at the start of years 0..payYears−1, benefits paid at the start of year `year`. */
export function policyFlows(a: PolicyIn) {
  const last = Math.max(a.payYears, ...a.benefits.map((b) => b.year));
  const f = new Array(last + 1).fill(0);
  for (let k = 0; k < a.payYears; k++) f[k] -= a.premium;
  for (const b of a.benefits) f[b.year] += b.amount;
  return f;
}
/** Buy term and invest the difference each year at `rate` (% a year): value at year `atYear`. */
export function investDifference(premium: number, term: number, payYears: number, rate: number, atYear: number) {
  let v = 0; const r = rate / 100;
  for (let k = 0; k < atYear; k++) { if (k < payYears) v += premium - term; v *= 1 + r; }
  return v;
}

// ---------- 9. How much life cover ----------
/** Present value of a payment of `first` a year that grows by g and is discounted at i, for n years, paid at the start of each year. */
export function pvGrowing(first: number, g: number, i: number, n: number) {
  let s = 0; for (let k = 0; k < n; k++) s += first * Math.pow(1 + g / 100, k) / Math.pow(1 + i / 100, k); return s;
}
export type NeedIn = { income: number; ownShare: number; years: number; growth: number; discount: number; debts: number; goals: number; assets: number; existing: number; funeral: number };
export function lifeNeed(a: NeedIn) {
  const familyYearly = a.income * (1 - a.ownShare / 100);
  const hlv = pvGrowing(familyYearly, a.growth, a.discount, a.years);
  const needs = Math.max(0, hlv + a.debts + a.goals + a.funeral - a.assets - a.existing);
  const multiple = a.income * 10; // the "10 times income" rule of thumb, shown only for comparison
  const dime = a.debts + a.funeral + a.income * a.years + a.goals; // DIME: debt, income × years, mortgage (in debts), education (in goals)
  return { familyYearly, hlv, needs, multiple, dime: Math.max(0, dime - a.existing) };
}

// ---------- 10. Fair (expected-value) price of a level term policy ----------
/** Death chance by policy year from one starting value that rises by `growth` % a year (Gompertz law of mortality). */
export const gompertz = (q0: number, growth: number, n: number) => Array.from({ length: n }, (_, k) => Math.min(1, q0 * Math.pow(1 + growth / 100, k)));
/** Level yearly premium P, paid at the start of each year while alive, that equals the expected value of the death benefit
 * paid at the end of the year of death: P = SA·Σ v^(k+1)·kp·q_k ÷ Σ v^k·kp (the equivalence principle). */
export function fairTerm(q: number[], sumAssured: number, rate: number) {
  const v = 1 / (1 + rate / 100);
  let alive = 1, ben = 0, ann = 0, die = 0;
  for (let k = 0; k < q.length; k++) { ann += Math.pow(v, k) * alive; ben += Math.pow(v, k + 1) * alive * q[k]; die += alive * q[k]; alive *= 1 - q[k]; }
  return { premium: (sumAssured * ben) / ann, chanceOfClaim: die, survive: alive, pvBenefit: sumAssured * ben, annuity: ann };
}

// ---------- 11. Top-up vs super top-up (India health) ----------
/** A top-up pays each bill above the deductible (per claim); a super top-up pays once the year's bills together pass it
 * (aggregate). Both stop at their own sum insured. Bills are in the order they happen. */
export function topUp(bills: number[], deductible: number, sumInsured: number, kind: 'topup' | 'super') {
  let cum = 0, paid = 0;
  const rows = bills.map((b) => {
    const before = cum; cum += b;
    let p = kind === 'topup' ? Math.max(0, b - deductible) : Math.max(0, cum - deductible) - Math.max(0, before - deductible);
    p = Math.max(0, Math.min(p, sumInsured - paid)); paid += p;
    return { bill: b, paid: p };
  });
  return { rows, paid, billed: cum, youPay: cum - paid };
}

// ---------- 12. Dental plan year ----------
export type DentalClass = 'preventive' | 'basic' | 'major';
export type DentalIn = {
  premium: number; deductible: number; annualMax: number;
  pays: Record<DentalClass, number>;   // share the plan pays, 0 to 1 (often 1, 0.8, 0.5)
  wait: Record<DentalClass, number>;   // waiting period in months from the start date
  deductibleOnPreventive: boolean;
  items: { cls: DentalClass; cost: number; month: number }[]; // month after the plan starts (0 = first month)
};
/** Works through the year's treatments in date order: waiting period, then deductible, then the plan's share, then the annual maximum. */
export function dentalYear(a: DentalIn) {
  let dedLeft = a.deductible, maxLeft = a.annualMax > 0 ? a.annualMax : Infinity, planPays = 0, cost = 0;
  const rows = [...a.items].sort((x, y) => x.month - y.month).map((it) => {
    cost += it.cost;
    if (it.month < a.wait[it.cls]) return { ...it, plan: 0, why: 'waiting period' };
    let base = it.cost;
    if (it.cls !== 'preventive' || a.deductibleOnPreventive) { const d = Math.min(dedLeft, base); dedLeft -= d; base -= d; }
    let p = base * a.pays[it.cls];
    const capped = p > maxLeft; p = Math.min(p, maxLeft); maxLeft -= p; planPays += p;
    return { ...it, plan: p, why: capped ? 'annual maximum reached' : '' };
  });
  const youPay = cost - planPays;
  return { rows, cost, planPays, youPay, total: a.premium + youPay, cashOnly: cost, saving: cost - (a.premium + youPay) };
}

// ---------- 13. Is own-damage (collision) cover still worth it? ----------
/** Expected yearly payout from own-damage cover on a car worth `value`: claims at rate λ, sizes lognormal, each claim
 * paid as min(claim, value) − min(claim, deductible). */
export const odPayout = (value: number, deductible: number, lambda: number, mu: number, s: number) =>
  lambda * Math.max(0, limitedMean(value, mu, s) - limitedMean(Math.min(deductible, value), mu, s));
export type OdIn = { value: number; dep: number; premium: number; premiumChange: number; deductible: number; lambda: number; median: number; p90: number; years: number };
export function ownDamage(a: OdIn) {
  const { mu, s } = lognormal(a.median, a.p90);
  const rows = Array.from({ length: a.years }, (_, k) => {
    const value = a.value * Math.pow(1 - a.dep / 100, k), premium = a.premium * Math.pow(1 + a.premiumChange / 100, k);
    const expected = odPayout(value, a.deductible, a.lambda, mu, s);
    return { year: k + 1, value, premium, expected, net: expected - premium, payBack: premium > 0 ? expected / premium : 0 };
  });
  return { rows, firstLosing: rows.find((r) => r.net < 0)?.year ?? null };
}

// ---------- 14. Loan balance for creditor (mortgage) insurance ----------
/** Balance at the start of each year of a loan repaid monthly. */
export function loanBalances(principal: number, rate: number, years: number) {
  const i = rate / 1200, n = years * 12;
  const pay = i > 0 ? (principal * i) / (1 - Math.pow(1 + i, -n)) : principal / n;
  const out: number[] = []; let b = principal;
  for (let m = 0; m < n; m++) { if (m % 12 === 0) out.push(b); b = b * (1 + i) - pay; }
  return { payment: pay, balances: out };
}
/** Cost per 1,000 of cover, averaged over the years: creditor cover follows the balance, level term stays at `termCover`. */
export function creditorVsTerm(balances: number[], creditorYearly: number[], termYearly: number, termCover: number) {
  const years = balances.length;
  const credCost = creditorYearly.reduce((s, c) => s + c, 0), termCost = termYearly * years;
  const credCover = balances.reduce((s, b) => s + b, 0) / years;
  return { credCost, termCost, credCover, termCover, credPer1000: credCover > 0 ? (credCost / years / credCover) * 1000 : 0, termPer1000: termCover > 0 ? (termYearly / termCover) * 1000 : 0 };
}

// ---------- 15. Surrender a savings policy or keep it? ----------
/** Keeping means giving up the surrender value now, paying the remaining premiums and getting the later benefits:
 * its return from today is the IRR of [−SV − premium, −premium, ..., +benefits]. */
export function keepReturn(surrenderValue: number, premium: number, yearsLeft: number, benefits: { year: number; amount: number }[]) {
  const f = policyFlows({ premium, payYears: yearsLeft, benefits });
  f[0] -= surrenderValue;
  return { flows: f, irr: irr(f) };
}
/** Surrender now and invest the surrender value plus each premium you no longer pay, at `rate` % a year: value at `atYear`. */
export function surrenderInvest(surrenderValue: number, premium: number, yearsLeft: number, rate: number, atYear: number) {
  let v = surrenderValue; const r = rate / 100;
  for (let k = 0; k < atYear; k++) { if (k < yearsLeft) v += premium; v *= 1 + r; }
  return v;
}
