// Adaptive staircases (up-down rules, Levitt 1971; weighted steps, Kaernbach 1991) and psychometric
// function fits by maximum likelihood, with a parametric bootstrap for the threshold. Plain maths, no DOM.
import { normCdf, normInv } from './stats.ts';
import { nelderMead } from './sdt-optim.ts';

export type Shape = 'logistic' | 'weibull' | 'normal';
export type Level = { x: number; k: number; n: number };

/** The underlying sigmoid F(x) from 0 to 1. alpha is the location, beta the slope. */
export function F(shape: Shape, x: number, alpha: number, beta: number): number {
  if (shape === 'logistic') return 1 / (1 + Math.exp(-beta * (x - alpha)));
  if (shape === 'normal') return normCdf(beta * (x - alpha));
  return x > 0 ? 1 - Math.exp(-Math.pow(x / alpha, beta)) : 0;
}
/** Probability correct: ψ(x) = γ + (1 − γ − λ)·F(x). */
export const psi = (shape: Shape, x: number, alpha: number, beta: number, gamma: number, lambda: number) => gamma + (1 - gamma - lambda) * F(shape, x, alpha, beta);
/** The stimulus level at which ψ = p, or NaN when p is out of reach. */
export function inverse(shape: Shape, p: number, alpha: number, beta: number, gamma: number, lambda: number): number {
  const f = (p - gamma) / (1 - gamma - lambda);
  if (!(f > 0 && f < 1)) return NaN;
  if (shape === 'logistic') return alpha + Math.log(f / (1 - f)) / beta;
  if (shape === 'normal') return alpha + normInv(f) / beta;
  return alpha * Math.pow(-Math.log(1 - f), 1 / beta);
}

/** Group trial-by-trial data (level, 1/0) into levels, sorted by level. */
export function group(trials: { x: number; correct: boolean }[]): Level[] {
  const m = new Map<number, Level>();
  for (const t of trials) { const g = m.get(t.x) ?? { x: t.x, k: 0, n: 0 }; g.n++; if (t.correct) g.k++; m.set(t.x, g); }
  return [...m.values()].sort((a, b) => a.x - b.x);
}

export type PfFit = { shape: Shape; alpha: number; beta: number; gamma: number; lambda: number; lambdaFree: boolean; logLik: number; deviance: number; df: number; converged: boolean; n: number };

function logLik(data: Level[], shape: Shape, a: number, b: number, g: number, l: number) {
  let L = 0;
  for (const d of data) {
    const p = Math.min(1 - 1e-12, Math.max(1e-12, psi(shape, d.x, a, b, g, l)));
    L += d.k * Math.log(p) + (d.n - d.k) * Math.log(1 - p);
  }
  return L;
}

/**
 * Maximum likelihood fit of ψ to grouped data. gamma is fixed (e.g. 0.5 for two-alternative forced choice);
 * lambda is fixed at the given value, or fitted between 0 and maxLambda when lambda is 'free'.
 */
export function fitPF(data: Level[], shape: Shape, gamma: number, lambda: number | 'free', maxLambda = 0.1, opts: { start?: PfFit; quick?: boolean } = {}): PfFit {
  if (data.length < 2) throw new Error('Need trials at two or more stimulus levels to fit a curve.');
  if (shape === 'weibull' && data.some((d) => d.x <= 0)) throw new Error('The Weibull function needs stimulus levels above 0. Use the logistic or normal shape for levels of 0 or below (such as log units or dB).');
  if (!(gamma >= 0 && gamma < 1)) throw new Error('The guess rate must be from 0 up to (not including) 1.');
  if (lambda !== 'free' && !(lambda >= 0 && gamma + lambda < 1)) throw new Error('The lapse rate must be 0 or more, and guess + lapse below 1.');
  const xs = data.map((d) => d.x), lo = Math.min(...xs), hi = Math.max(...xs), span = hi - lo || Math.abs(hi) || 1;
  const free = lambda === 'free';
  // Bounded parameters keep fits to sparse or perfectly separated data finite: the location stays within
  // three ranges of the data, and the curve's rise is between a thousandth of the range and twenty ranges wide.
  const W = shape === 'weibull';
  const aLo = W ? Math.log(lo / 20) : lo - 3 * span, aHi = W ? Math.log(hi * 20) : hi + 3 * span;
  const bLo = W ? Math.log(0.2) : Math.log(0.2 / span), bHi = W ? Math.log(100) : Math.log(5000 / span);
  const sq = (t: number, a: number, b: number) => a + (b - a) / (1 + Math.exp(-t));
  const unsq = (v: number, a: number, b: number) => { const f = Math.min(1 - 1e-12, Math.max(1e-12, (v - a) / (b - a))); return Math.log(f / (1 - f)); };
  const unpack = (p: number[]) => { const la = sq(p[0], aLo, aHi); return { a: W ? Math.exp(la) : la, b: Math.exp(sq(p[1], bLo, bHi)), l: free ? maxLambda / (1 + Math.exp(-p[2])) : (lambda as number) }; };
  const pack = (a: number, b: number, l: number) => [unsq(W ? Math.log(a) : a, aLo, aHi), unsq(Math.log(b), bLo, bHi), ...(free ? [unsq(l, 0, maxLambda)] : [])];
  const f = (p: number[]) => { const u = unpack(p); return -logLik(data, shape, u.a, u.b, gamma, u.l); };
  let best: number[] = [], bestF = Infinity;
  if (opts.start) { best = pack(opts.start.alpha, opts.start.beta, free ? Math.min(Math.max(opts.start.lambda, 0.001), maxLambda - 0.001) : 0); bestF = f(best); }
  else {
    // Start from the best point of a coarse grid, so the fit does not depend on a lucky first guess.
    for (let i = 0; i <= 12; i++) for (let j = 0; j <= 12; j++) {
      const a = W ? Math.exp(Math.log(Math.max(lo, 1e-9)) + ((Math.log(hi) - Math.log(Math.max(lo, 1e-9))) * i) / 12) : lo + (span * i) / 12;
      const b = W ? Math.exp(Math.log(0.5) + (Math.log(20) * j) / 12) : Math.exp(Math.log(0.5 / span) + (Math.log(80) * j) / 12);
      const p = pack(a, b, 0.02), v = f(p);
      if (v < bestF) { bestF = v; best = p; }
    }
  }
  const m = nelderMead(f, best, opts.quick ? { maxIter: 2000, tol: 1e-8, xtol: 1e-4, restarts: 1, step: best.map(() => 0.3) } : { maxIter: 20000, tol: 1e-14, restarts: 6, step: best.map(() => 0.5) });
  const u = unpack(m.x), L = -m.f;
  let dev = 0;
  for (const d of data) {
    const p = psi(shape, d.x, u.a, u.b, gamma, u.l);
    if (d.k > 0) dev += 2 * d.k * Math.log(d.k / (d.n * p));
    if (d.k < d.n) dev += 2 * (d.n - d.k) * Math.log((d.n - d.k) / (d.n * (1 - p)));
  }
  return { shape, alpha: u.a, beta: u.b, gamma, lambda: u.l, lambdaFree: free, logLik: L, deviance: Math.max(0, dev), df: data.length - (free ? 3 : 2), converged: m.converged, n: data.reduce((s, d) => s + d.n, 0) };
}

/** Binomial draw by summing Bernoulli trials (n is small here). */
const binom = (n: number, p: number, rand: () => number) => { let k = 0; for (let i = 0; i < n; i++) if (rand() < p) k++; return k; };
const quant = (s: number[], p: number) => { const h = (s.length - 1) * p, i = Math.floor(h); return i + 1 < s.length ? s[i] + (h - i) * (s[i + 1] - s[i]) : s[s.length - 1]; };

/**
 * Parametric bootstrap of the threshold (level where ψ = pTarget): simulate new counts from the fitted
 * curve at the same levels and trial numbers, refit, and take the 2.5 and 97.5 percentiles.
 */
export function bootstrap(data: Level[], fit: PfFit, pTarget: number, reps: number, rand: () => number) {
  return bootSummary(bootRaw(data, fit, pTarget, reps, rand));
}
export type BootRaw = { th: number[]; sl: number[]; failed: number };
/** The bootstrap thresholds and slopes themselves; call in chunks (same rand) and join with joinBoot. */
export function bootRaw(data: Level[], fit: PfFit, pTarget: number, reps: number, rand: () => number): BootRaw {
  const th: number[] = [], sl: number[] = [];
  let failed = 0;
  for (let r = 0; r < reps; r++) {
    const sim = data.map((d) => ({ x: d.x, n: d.n, k: binom(d.n, psi(fit.shape, d.x, fit.alpha, fit.beta, fit.gamma, fit.lambda), rand) }));
    try {
      const f = fitPF(sim, fit.shape, fit.gamma, fit.lambdaFree ? 'free' : fit.lambda, 0.1, { start: fit, quick: true });
      const t = inverse(f.shape, pTarget, f.alpha, f.beta, f.gamma, f.lambda);
      if (Number.isFinite(t)) { th.push(t); sl.push(f.beta); } else failed++;
    } catch { failed++; }
  }
  return { th, sl, failed };
}
export const joinBoot = (a: BootRaw, b: BootRaw): BootRaw => ({ th: a.th.concat(b.th), sl: a.sl.concat(b.sl), failed: a.failed + b.failed });
export function bootSummary(raw: BootRaw) {
  const th = raw.th.slice().sort((a, b) => a - b), sl = raw.sl.slice().sort((a, b) => a - b);
  const mean = th.reduce((s, x) => s + x, 0) / th.length;
  const se = Math.sqrt(th.reduce((s, x) => s + (x - mean) ** 2, 0) / (th.length - 1));
  return { ci: [quant(th, 0.025), quant(th, 0.975)] as [number, number], se, slopeCi: [quant(sl, 0.025), quant(sl, 0.975)] as [number, number], used: th.length, failed: raw.failed };
}

// ---------- Staircases ----------

export type Rule = {
  /** Correct answers in a row needed to make it harder (step down). */
  down: number;
  stepDown: number; stepUp: number; start: number; min: number; max: number;
  /** Steps are multiplied/divided (log steps) instead of added/subtracted. */
  multiplicative?: boolean;
  /** Halve both steps at these reversal counts (e.g. [2, 4]). */
  halveAt?: number[];
};
export type StairTrial = { trial: number; x: number; correct: boolean; reversal: boolean };
export type StairState = { x: number; run: number; dir: 0 | 1 | -1; reversals: number; stepDown: number; stepUp: number };

export const initStair = (r: Rule): StairState => ({ x: r.start, run: 0, dir: 0, reversals: 0, stepDown: r.stepDown, stepUp: r.stepUp });

/**
 * One staircase step: after `down` correct answers in a row the level goes down (harder); after any
 * wrong answer it goes up (easier). A reversal is a change of direction. Returns the new state and
 * whether this answer caused a reversal.
 */
export function stairStep(r: Rule, s: StairState, correct: boolean): { s: StairState; reversal: boolean } {
  let move: 0 | 1 | -1 = 0, run = s.run;
  if (correct) { run++; if (run >= r.down) { move = -1; run = 0; } }
  else { move = 1; run = 0; }
  if (!move) return { s: { ...s, run }, reversal: false };
  const reversal = s.dir !== 0 && move !== s.dir;
  let { stepDown, stepUp } = s;
  const reversals = s.reversals + (reversal ? 1 : 0);
  // The move that makes the reversal uses the step in force; halving applies from the next move.
  const step = move === -1 ? stepDown : stepUp;
  let x = r.multiplicative ? (move === -1 ? s.x / step : s.x * step) : s.x + move * step;
  x = Math.min(r.max, Math.max(r.min, x));
  if (reversal && r.halveAt?.includes(reversals)) {
    stepDown = r.multiplicative ? Math.sqrt(stepDown) : stepDown / 2;
    stepUp = r.multiplicative ? Math.sqrt(stepUp) : stepUp / 2;
  }
  return { s: { x, run, dir: move, reversals, stepDown, stepUp }, reversal };
}

/** Run a staircase against a simulated observer whose probability correct at level x is p(x). */
export function simulateStair(r: Rule, p: (x: number) => number, trials: number, rand: () => number, stopAfterReversals = Infinity): StairTrial[] {
  let s = initStair(r);
  const out: StairTrial[] = [];
  for (let i = 0; i < trials && s.reversals < stopAfterReversals; i++) {
    const correct = rand() < p(s.x), x = s.x;
    const st = stairStep(r, s, correct);
    out.push({ trial: i + 1, x, correct, reversal: st.reversal });
    s = st.s;
  }
  return out;
}

/**
 * Threshold from the reversals: the mean (or geometric mean for multiplicative steps) of the level at the
 * last `last` reversals, after dropping the first `drop`. The level of a reversal is the level of the trial
 * whose answer caused it.
 */
export function reversalMean(t: StairTrial[], drop: number, last: number, geometric = false) {
  const lv = t.filter((x) => x.reversal).map((x) => x.x).slice(drop);
  const use = lv.slice(-last);
  if (!use.length) return { mean: NaN, sd: NaN, n: 0 };
  const v = geometric ? use.map(Math.log) : use;
  const m = v.reduce((s, x) => s + x, 0) / v.length;
  const sd = v.length > 1 ? Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1)) : NaN;
  return { mean: geometric ? Math.exp(m) : m, sd: geometric ? NaN : sd, n: use.length };
}

/** Percent correct a staircase converges on: p^down = 0.5 (Levitt), or for 1-down weighted steps p = up/(up + down) (Kaernbach). */
export function target(r: Rule): number {
  if (r.down === 1) { const su = r.multiplicative ? Math.log(r.stepUp) : r.stepUp, sd = r.multiplicative ? Math.log(r.stepDown) : r.stepDown; return su / (su + sd); }
  return Math.pow(0.5, 1 / r.down);
}
