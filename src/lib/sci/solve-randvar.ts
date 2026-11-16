// "Solve my numbers" for the random variable builder: binomial probabilities P(X = r), P(X ≤ r), P(X ≥ r) and
// P(a ≤ X ≤ b) from n and p (p may be typed as a fraction such as 1/6), the binomial mean and spread, and the mean,
// variance and standard deviation of a typed probability table. Plain maths, no DOM. Engine: solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const lnFact = (n: number) => { let s = 0; for (let k = 2; k <= n; k++) s += Math.log(k); return s; };
/** C(n, r) as a number (exact for the sizes used at school, which stay far below 2^53). */
export function choose(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r); let x = 1;
  for (let k = 1; k <= r; k++) x = (x * (n - r + k)) / k;
  return x;
}
/** P(X = r) for a binomial(n, p). */
export function pmf(n: number, p: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (p === 0) return r === 0 ? 1 : 0;
  if (p === 1) return r === n ? 1 : 0;
  return Math.exp(lnFact(n) - lnFact(r) - lnFact(n - r) + r * Math.log(p) + (n - r) * Math.log(1 - p));
}
const cdf = (n: number, p: number, r: number) => { let s = 0; for (let k = 0; k <= Math.min(r, n); k++) s += pmf(n, p, k); return Math.min(1, s); };

const pr = (x: number) => (x === 0 ? '0' : x === 1 ? '1' : sf(x, 4));
const pct = (x: number) => `${sf(x * 100, 3)}%`;
const TIP = 'Common mistakes: "at least 1" means P(X ≥ 1) = 1 − P(X = 0), not P(X = 1); and the trials must be independent with the same chance p each time (drawing without replacement is not binomial).';

function binInputs(i: Record<string, SIn>): { n: number; p: number } | SOut {
  const n = i.n.v, p = i.p.v;
  if (!Number.isInteger(n) || n < 1) return { error: 'The number of trials n must be a whole number of 1 or more.' };
  if (n > 1000) return { error: 'This page handles up to 1000 trials. Try a smaller n.' };
  if (!(p >= 0 && p <= 1)) return { error: 'The chance p must be between 0 and 1 (or a fraction such as 1/6).' };
  return { n, p };
}
const bad = (x: unknown): x is SOut => typeof x === 'object' && x !== null && 'error' in x;
const termList = (n: number, p: number, ks: number[]) => ks.map((k) => `P(X = ${k}) = ${pr(pmf(n, p, k))}`).join(', ');

export function rvSolve(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find;
  if (f === 'mv') {
    const xs = i.xs.list, ps = i.ps.list;
    if (xs.length < 2) return { error: 'Type at least two values of X, separated by commas.' };
    if (xs.length !== ps.length) return { error: `You typed ${xs.length} values of X but ${ps.length} probabilities. They must match one to one.` };
    if (ps.some((x) => x < 0 || x > 1)) return { error: 'Every probability must be between 0 and 1.' };
    const tot = ps.reduce((a, b) => a + b, 0);
    if (Math.abs(tot - 1) > 1e-6) return { error: `The probabilities add up to ${sf(tot, 6)}, but they must add up to exactly 1. Check them, or find the missing one as 1 minus the others.` };
    const mean = xs.reduce((a, x, k) => a + x * ps[k], 0), ex2 = xs.reduce((a, x, k) => a + x * x * ps[k], 0), v = Math.max(0, ex2 - mean * mean), sd = Math.sqrt(v);
    return {
      answer: `The mean is μ = ${sf(mean, 4)}, the variance is ${sf(v, 4)} and the standard deviation is ${sf(sd, 4)}.`,
      lines: ['Mean: μ = E(X) = Σ x P(x)', `μ = ${xs.map((x, k) => `${sf(x)} × ${sf(ps[k])}`).join(' + ')} = ${sf(mean, 4)}`, `E(X²) = Σ x² P(x) = ${xs.map((x, k) => `${sf(x * x)} × ${sf(ps[k])}`).join(' + ')} = ${sf(ex2, 4)}`, `Variance: Var(X) = E(X²) − μ² = ${sf(ex2, 4)} − ${sf(mean * mean, 4)} = ${sf(v, 4)}`, `Standard deviation: σ = √${sf(v, 4)} = ${sf(sd, 4)}`],
      tip: 'Common mistake: squaring the probabilities, or forgetting to subtract μ² at the end. Square the x values (not P), multiply by P, add, then subtract the mean squared.',
    };
  }
  const b = binInputs(i); if (bad(b)) return b;
  const { n, p } = b, q = 1 - p;
  if (f === 'musd') {
    const mu = n * p, v = n * p * q;
    return { answer: `The mean is np = ${sf(mu, 4)}, the variance is npq = ${sf(v, 4)} and the standard deviation is ${sf(Math.sqrt(v), 4)}.`, lines: [`q = 1 − p = ${pr(q)}`, `Mean = np = ${n} × ${pr(p)} = ${sf(mu, 4)}`, `Variance = npq = ${n} × ${pr(p)} × ${pr(q)} = ${sf(v, 4)}`, `σ = √${sf(v, 4)} = ${sf(Math.sqrt(v), 4)}`], tip: 'The mean np is what you expect on average, and it need not be a whole number: 3 tosses of a coin give 1.5 heads on average.' };
  }
  const r = i.r.v;
  if (!Number.isInteger(r) || r < 0 || r > n) return { error: `r must be a whole number from 0 to n (here 0 to ${n}).` };
  const hdr = `X is binomial with n = ${n} and p = ${pr(p)}, so q = ${pr(q)}.`;
  if (f === 'eq') {
    const v = pmf(n, p, r);
    return { answer: `P(X = ${r}) = ${pr(v)} (${pct(v)}).`, lines: [hdr, 'Formula: P(X = r) = C(n, r) pʳ qⁿ⁻ʳ', `C(${n}, ${r}) = ${sf(choose(n, r), 8)}`, `P(X = ${r}) = ${sf(choose(n, r), 8)} × ${pr(p)}^${r} × ${pr(q)}^${n - r} = ${pr(v)}`], tip: TIP };
  }
  if (f === 'le') {
    const v = cdf(n, p, r), ks = Array.from({ length: r + 1 }, (_, k) => k);
    return { answer: `P(X ≤ ${r}) = ${pr(v)} (${pct(v)}).`, lines: [hdr, `P(X ≤ ${r}) = P(X = 0) + ... + P(X = ${r})`, ...(r <= 8 ? [termList(n, p, ks)] : [`That adds up ${r + 1} terms of C(n, k) pᵏ qⁿ⁻ᵏ.`]), `Sum = ${pr(v)}`], tip: TIP };
  }
  if (f === 'ge') {
    const v = r === 0 ? 1 : 1 - cdf(n, p, r - 1);
    const lines = [hdr, r === 0 ? 'P(X ≥ 0) = 1: X is always 0 or more.' : `At least ${r} means P(X ≥ ${r}) = 1 − P(X ≤ ${r - 1}).`];
    if (r >= 1 && r - 1 <= 8) lines.push(termList(n, p, Array.from({ length: r }, (_, k) => k)), ...(r > 1 ? [`P(X ≤ ${r - 1}) = ${pr(cdf(n, p, r - 1))}`] : []));
    lines.push(`P(X ≥ ${r}) = ${r === 0 ? '1' : `1 − ${pr(cdf(n, p, r - 1))} = ${pr(v)}`}`);
    return { answer: `P(X ≥ ${r}) = ${pr(Math.max(0, v))} (${pct(Math.max(0, v))}).`, lines, tip: TIP };
  }
  // btw: r to s
  const r2 = i.r2.v;
  if (!Number.isInteger(r2) || r2 < r || r2 > n) return { error: `The upper value must be a whole number from ${r} to ${n}.` };
  const v = cdf(n, p, r2) - (r === 0 ? 0 : cdf(n, p, r - 1)), ks = Array.from({ length: r2 - r + 1 }, (_, k) => r + k);
  return { answer: `P(${r} ≤ X ≤ ${r2}) = ${pr(Math.max(0, v))} (${pct(Math.max(0, v))}).`, lines: [hdr, `P(${r} ≤ X ≤ ${r2}) = P(X = ${r}) + ... + P(X = ${r2})`, ...(ks.length <= 8 ? [termList(n, p, ks)] : []), `Sum = ${pr(Math.max(0, v))}`], tip: TIP };
}

export const RV_SPEC: SSpec = {
  id: 'rv',
  finds: [['eq', 'Binomial P(X = r)'], ['le', 'Binomial P(X ≤ r)'], ['ge', 'Binomial P(X ≥ r), "at least"'], ['btw', 'Binomial P(r ≤ X ≤ s)'], ['musd', 'Binomial mean and variance'], ['mv', 'Mean and variance of a table']],
  fields: [
    { k: 'n', label: 'Number of trials n', ph: 'e.g. 6', show: (c) => c.find !== 'mv' },
    { k: 'p', label: 'Chance of success p (decimal or fraction)', ph: 'e.g. 0.3 or 1/6', show: (c) => c.find !== 'mv' },
    { k: 'r', label: 'r (number of successes)', ph: 'e.g. 2', show: (c) => ['eq', 'le', 'ge', 'btw'].includes(c.find) },
    { k: 'r2', label: 's (upper number of successes)', ph: 'e.g. 4', show: (c) => c.find === 'btw' },
    { k: 'xs', label: 'Values of X (separate with commas)', kind: 'list', ph: 'e.g. 0, 1, 2, 3', show: (c) => c.find === 'mv' },
    { k: 'ps', label: 'Their probabilities (commas; fractions like 1/8 are fine)', kind: 'list', ph: 'e.g. 1/8, 3/8, 3/8, 1/8', show: (c) => c.find === 'mv' },
  ],
  presets: [
    { name: 'Exactly 2 heads in 3 tosses', find: 'eq', vals: { n: '3', p: '0.5', r: '2' } },
    { name: 'At least one six in 4 throws of a die', find: 'ge', vals: { n: '4', p: '1/6', r: '1' } },
    { name: 'At most 2 faulty in 10 bulbs (p = 0.1)', find: 'le', vals: { n: '10', p: '0.1', r: '2' } },
    { name: 'Between 3 and 5 successes in 8 trials', find: 'btw', vals: { n: '8', p: '0.5', r: '3', r2: '5' } },
    { name: 'Mean and variance of 12 trials with p = 0.25', find: 'musd', vals: { n: '12', p: '0.25' } },
    { name: 'Mean of a table: heads in 3 tosses', find: 'mv', vals: { xs: '0, 1, 2, 3', ps: '1/8, 3/8, 3/8, 1/8' } },
  ],
  solve: (i, c) => rvSolve(i, c),
};
