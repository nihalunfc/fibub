// Natural selection with peppered moths (school biology). Plain maths, no DOM.
// One gene: C (dark, dominant) and c (light). Birds find moths that do not match the bark more often:
// the conspicuous form survives with chance 1 - s, the camouflaged one with chance 1. With random mating the
// newborns follow Hardy-Weinberg proportions p², 2pq, q². Teaching model; numbers are made up.

export type Bark = 'light' | 'dark';
export type Schedule = 'light' | 'dark' | 'soot' | 'clean';
/** Bark colour in generation g for a schedule (soot darkens at CHANGE_AT, clean air lightens at CHANGE_AT). */
export const CHANGE_AT = 10;
export function barkAt(s: Schedule, g: number): Bark {
  if (s === 'light' || s === 'dark') return s;
  if (s === 'soot') return g < CHANGE_AT ? 'light' : 'dark';
  return g < CHANGE_AT ? 'dark' : 'light';
}
/** Survival chances of dark and light moths on this bark when birds remove a share s of the visible ones. */
export const fitness = (bark: Bark, s: number) => ({ dark: bark === 'light' ? 1 - s : 1, light: bark === 'dark' ? 1 - s : 1 });

/** Frequency of C in the next generation (dark is dominant: CC and Cc look the same). */
export function nextP(p: number, wDark: number, wLight: number): number {
  const q = 1 - p, wBar = (p * p + 2 * p * q) * wDark + q * q * wLight;
  return wBar > 0 ? (p * wDark) / wBar : p;
}

export type Gen = { g: number; bark: Bark; p: number; CC: number; Cc: number; cc: number; dark: number; light: number; darkLeft: number; lightLeft: number };

/** Binomial random number (direct for small n, normal approximation for large n). */
export function binomial(n: number, p: number, r: () => number): number {
  if (p <= 0 || n <= 0) return 0;
  if (p >= 1) return n;
  if (n < 60) { let k = 0; for (let i = 0; i < n; i++) if (r() < p) k++; return k; }
  const m = n * p, sd = Math.sqrt(n * p * (1 - p));
  const z = Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  return Math.min(n, Math.max(0, Math.round(m + sd * z)));
}

/** Poisson random number by inversion (for rare events such as new mutations; fine for small means). */
export function poisson(lambda: number, r: () => number): number {
  if (!(lambda > 0)) return 0;
  let k = 0, prob = Math.exp(-lambda), cum = prob; const u = r();
  while (u > cum && k < 1000) { k++; prob *= lambda / k; cum += prob; }
  return k;
}
/** Light-to-dark mutation: a share mu of the c alleles turn into C each generation (expected value). */
export const mutate = (p: number, mu: number) => p + mu * (1 - p);

/** Simulate gens generations. N = Infinity gives the expected (no-chance) path with fractional counts per 1000.
 *  mu (default 0) is the chance per generation that a light allele c mutates to dark C. */
export function simulate(opts: { p0: number; s: number; schedule: Schedule; N: number; gens: number; mu?: number }, r: () => number): Gen[] {
  const out: Gen[] = [], mu = Math.max(0, opts.mu ?? 0);
  let p = opts.p0;
  for (let g = 0; g <= opts.gens; g++) {
    const bark = barkAt(opts.schedule, g), w = fitness(bark, opts.s), q = 1 - p;
    let CC: number, Cc: number, cc: number, darkLeft: number, lightLeft: number;
    if (!Number.isFinite(opts.N)) {
      CC = 1000 * p * p; Cc = 2000 * p * q; cc = 1000 * q * q;
      darkLeft = (CC + Cc) * w.dark; lightLeft = cc * w.light;
      out.push({ g, bark, p, CC, Cc, cc, dark: CC + Cc, light: cc, darkLeft, lightLeft });
      p = mutate(nextP(p, w.dark, w.light), mu);
      continue;
    }
    // Random mating: each moth gets two alleles drawn with chance p.
    CC = binomial(opts.N, p * p, r);
    Cc = binomial(opts.N - CC, (2 * p * q) / Math.max(1e-12, 1 - p * p), r);
    cc = opts.N - CC - Cc;
    const CCleft = binomial(CC, w.dark, r), Ccleft = binomial(Cc, w.dark, r), ccleft = binomial(cc, w.light, r);
    darkLeft = CCleft + Ccleft; lightLeft = ccleft;
    out.push({ g, bark, p, CC, Cc, cc, dark: CC + Cc, light: cc, darkLeft, lightLeft });
    const alleles = 2 * (CCleft + Ccleft + ccleft);
    if (alleles > 0) {
      const C = 2 * CCleft + Ccleft, c = alleles - C;
      const born = mu > 0 ? Math.min(c, poisson(c * mu, r)) : 0; // new dark alleles by mutation
      p = (C + born) / alleles;
    }
  }
  return out;
}

/** Hardy-Weinberg check of genotype counts: p from the counts, expected counts and chi-square (1 df). */
export function hwCheck(CC: number, Cc: number, cc: number) {
  const n = CC + Cc + cc, p = (2 * CC + Cc) / (2 * n), q = 1 - p;
  const exp = [p * p * n, 2 * p * q * n, q * q * n], obs = [CC, Cc, cc];
  const chi2 = obs.reduce((s, o, i) => s + (exp[i] > 0 ? (o - exp[i]) ** 2 / exp[i] : 0), 0);
  // 1 degree of freedom: P(chi² >= x) = erfc(sqrt(x / 2)).
  return { n, p, q, exp, chi2, pValue: erfc(Math.sqrt(chi2 / 2)) };
}
/** Complementary error function (Numerical Recipes erfc approximation, relative error below 1.2e-7). */
export function erfc(x: number): number {
  const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}
