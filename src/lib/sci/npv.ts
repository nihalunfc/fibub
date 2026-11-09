// Project appraisal: NPV, every IRR (with a warning when there is more than one), MIRR, payback and
// discounted payback, profitability index and the NPV profile. Cash flow t happens at the end of period t,
// so the first one (t = 0) is today. Rates are fractions per period. Plain maths, no DOM.

/** Net present value at rate r. */
export function npv(r: number, cf: number[]): number {
  let s = 0, d = 1;
  for (let t = 0; t < cf.length; t++) { s += cf[t] / d; d *= 1 + r; }
  return s;
}

/** Number of sign changes in the cash flows (Descartes' rule: an upper bound on the number of IRRs). */
export function signChanges(cf: number[]): number {
  let n = 0, last = 0;
  for (const c of cf) { if (c === 0) continue; if (last && Math.sign(c) !== last) n++; last = Math.sign(c); }
  return n;
}

/** Brent-style safe root finding on a bracket [a, b] where f changes sign (bisection with secant steps). */
function root(f: (x: number) => number, a: number, b: number): number {
  let fa = f(a), fb = f(b);
  if (fa === 0) return a;
  if (fb === 0) return b;
  for (let i = 0; i < 200; i++) {
    // Secant step, kept inside the bracket; otherwise bisect.
    let m = b - (fb * (b - a)) / (fb - fa);
    if (!(m > Math.min(a, b) && m < Math.max(a, b)) || i % 3 === 2) m = (a + b) / 2;
    const fm = f(m);
    if (fm === 0 || Math.abs(b - a) < 1e-15 * Math.max(1, Math.abs(m))) return m;
    if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else { b = m; fb = fm; }
    if (Math.abs(b - a) < 1e-14 * Math.max(1, Math.abs(a))) break;
  }
  return (a + b) / 2;
}

/**
 * Every internal rate of return between −99.9 % and 100,000 % per period: NPV is scanned on a fine grid of
 * growth factors 1 + r (evenly spaced in log) and each sign change is refined. Roots where NPV only touches
 * zero without crossing are found from local minima of |NPV| as well.
 */
export function irrAll(cf: number[]): number[] {
  if (cf.length < 2 || signChanges(cf) === 0) return [];
  // NPV × (1 + r)^n is a polynomial in g = 1 + r; scale by the largest flow to avoid overflow.
  const n = cf.length - 1, big = Math.max(...cf.map(Math.abs));
  const P = (g: number) => { let s = 0; for (let t = 0; t <= n; t++) s = s * g + cf[t] / big; return s; }; // Σ cf_t g^(n−t)
  const N = 20000, lo = Math.log(0.001), hi = Math.log(1001);
  const out: number[] = [];
  let gPrev = Math.exp(lo), pPrev = P(gPrev);
  const vals: [number, number][] = [[gPrev, pPrev]];
  for (let i = 1; i <= N; i++) {
    const g = Math.exp(lo + ((hi - lo) * i) / N), p = P(g);
    if (p === 0) out.push(g);
    else if (pPrev !== 0 && (p > 0) !== (pPrev > 0)) out.push(root(P, gPrev, g));
    vals.push([g, p]); gPrev = g; pPrev = p;
  }
  // Double roots (touching zero): a local minimum of |P| very close to zero.
  for (let i = 1; i < vals.length - 1; i++) {
    const [g, p] = vals[i], a = Math.abs(vals[i - 1][1]), b = Math.abs(vals[i + 1][1]);
    if (Math.abs(p) <= a && Math.abs(p) <= b && Math.sign(vals[i - 1][1]) === Math.sign(vals[i + 1][1]) && Math.abs(p) < 1e-4) {
      // Golden-section search for the smallest |P| between the neighbours.
      let x0 = vals[i - 1][0], x1 = vals[i + 1][0];
      const k = (Math.sqrt(5) - 1) / 2;
      for (let it = 0; it < 200 && x1 - x0 > 1e-15 * x1; it++) {
        const c = x1 - k * (x1 - x0), d = x0 + k * (x1 - x0);
        if (Math.abs(P(c)) < Math.abs(P(d))) x1 = d; else x0 = c;
      }
      const gm = (x0 + x1) / 2;
      if (Math.abs(P(gm)) < 1e-13 && !out.some((x) => Math.abs(x - gm) < 1e-6 * gm)) out.push(gm);
    }
  }
  return [...new Set(out.map((g) => g - 1))].sort((a, b) => a - b).filter((r, i, a) => i === 0 || Math.abs(r - a[i - 1]) > 1e-10);
}

/** Modified IRR: negative flows discounted at the finance rate, positive flows grown at the reinvestment rate. */
export function mirr(cf: number[], finance: number, reinvest: number): number {
  const n = cf.length - 1;
  let pvNeg = 0, fvPos = 0;
  cf.forEach((c, t) => { if (c < 0) pvNeg += c / (1 + finance) ** t; else fvPos += c * (1 + reinvest) ** (n - t); });
  if (pvNeg === 0 || fvPos === 0 || n === 0) return NaN;
  return (fvPos / -pvNeg) ** (1 / n) - 1;
}

/**
 * Payback period: when the running total first turns from negative to zero or more for good is not required;
 * this is the first time it reaches zero, with straight-line timing inside the period. NaN if it never does.
 * With `rate`, uses discounted cash flows (discounted payback).
 */
export function payback(cf: number[], rate = 0): number {
  const d = cf.map((c, t) => c / (1 + rate) ** t);
  let cum = d[0];
  if (cum >= 0) return 0;
  for (let t = 1; t < d.length; t++) {
    const next = cum + d[t];
    if (next >= 0) return t - 1 + (d[t] ? -cum / d[t] : 1);
    cum = next;
  }
  return NaN;
}

/** Profitability index: present value of the flows after today ÷ the outlay today (−cf[0]). */
export function profitabilityIndex(r: number, cf: number[]): number {
  if (!(cf[0] < 0)) return NaN;
  return (npv(r, cf) - cf[0]) / -cf[0];
}

/** Equivalent annual amount: the level payment over n periods with the same NPV. */
export function equivalentAnnuity(r: number, cf: number[]): number {
  const n = cf.length - 1, v = npv(r, cf);
  if (n < 1) return NaN;
  return r === 0 ? v / n : (v * r) / (1 - (1 + r) ** -n);
}
