// Benchmark dose (BMD) modelling of quantal (dichotomous) dose-response data, following the model forms and default
// restrictions of the US EPA Benchmark Dose Technical Guidance (2012) and BMDS: log-logistic (slope ≥ 1), Weibull
// (power ≥ 1), gamma (power 1 to 18), multistage (coefficients ≥ 0) and probit. Maximum likelihood by Nelder-Mead on
// bounded transforms (squares and sines reach the bounds exactly), BMD at a chosen extra risk, and the BMDL as the
// one-sided 95 % lower profile-likelihood limit (2·ΔLL = χ²₁(0.90) = 2.7055; Crump 1984, 1995). No DOM.
import { normCdf, normInv } from './stats.ts';
import { gammaP, gammaPInv } from './floodfreq.ts';
import { chi2Sf } from './probit.ts';

export type Group = { dose: number; n: number; r: number };
export type ModelId = 'loglogistic' | 'weibull' | 'gamma' | 'multistage' | 'probit';
export const MODEL_NAMES: Record<ModelId, string> = { loglogistic: 'Log-logistic', weibull: 'Weibull', gamma: 'Gamma', multistage: 'Multistage', probit: 'Probit' };
export const CHI2_90 = normInv(0.95) ** 2; // 2.7055…: one-sided 95 % limit

/** Nelder-Mead minimiser (adaptive coefficients for the dimension; Gao and Han 2012). */
export function nelderMead(f: (x: number[]) => number, x0: number[], opts: { step?: number; maxIter?: number; tol?: number } = {}) {
  const n = x0.length, step = opts.step ?? 0.5, maxIter = opts.maxIter ?? 4000, tol = opts.tol ?? 1e-13;
  const al = 1, ga = 1 + 2 / n, rh = 0.75 - 1 / (2 * n), si = 1 - 1 / n;
  let S = [x0.slice(), ...x0.map((_, i) => { const p = x0.slice(); p[i] += step; return p; })];
  let F = S.map(f);
  for (let it = 0; it < maxIter; it++) {
    const idx = F.map((_, i) => i).sort((a, b) => F[a] - F[b]);
    S = idx.map((i) => S[i]); F = idx.map((i) => F[i]);
    if (Math.abs(F[n] - F[0]) <= tol * (1 + Math.abs(F[0])) && Math.max(...S.slice(1).map((p) => Math.max(...p.map((v, k) => Math.abs(v - S[0][k]))))) < 1e-9) break;
    const c = x0.map((_, k) => S.slice(0, n).reduce((s, p) => s + p[k], 0) / n);
    const at = (t: number) => c.map((v, k) => v + t * (S[n][k] - v));
    const xr = at(-al), fr = f(xr);
    if (fr < F[0]) { const xe = at(-al * ga), fe = f(xe); if (fe < fr) { S[n] = xe; F[n] = fe; } else { S[n] = xr; F[n] = fr; } }
    else if (fr < F[n - 1]) { S[n] = xr; F[n] = fr; }
    else {
      const out = fr < F[n], xc = at(out ? al * rh : -rh), fc = f(xc);
      if (fc < (out ? fr : F[n])) { S[n] = xc; F[n] = fc; }
      else for (let i = 1; i <= n; i++) { S[i] = S[i].map((v, k) => S[0][k] + si * (v - S[0][k])); F[i] = f(S[i]); }
    }
  }
  const b = F.indexOf(Math.min(...F));
  return { x: S[b], f: F[b] };
}

/** A model on doses scaled to 0..1 (dose ÷ highest dose); θ is the natural parameter vector. */
type Spec = {
  names: string[];
  nat: (u: number[]) => number[];
  inv: (th: number[]) => number[];
  p: (d: number, th: number[]) => number;
  bmd: (th: number[], bmr: number) => number;
  /** Profile: full θ from a fixed BMD and the other free transformed parameters (null if impossible). */
  prof: (bmd: number, v: number[], bmr: number) => number[] | null;
  profV: (th: number[]) => number[];
  starts: (g0: number) => number[][];
  atBound: (th: number[]) => boolean[];
  /** θ for the original dose scale (dose in the user's units), given the highest dose D. */
  unscale: (th: number[], D: number) => number[];
};
const sin2 = (u: number) => Math.sin(u) ** 2;
const asin2 = (g: number) => Math.asin(Math.sqrt(Math.min(1, Math.max(0, g))));
const TINY = 1e-6;

function spec(id: ModelId, degree = 2): Spec {
  if (id === 'loglogistic') return {
    names: ['background', 'intercept', 'slope'],
    nat: (u) => [sin2(u[0]), u[1], 1 + u[2] * u[2]], inv: (t) => [asin2(t[0]), t[1], Math.sqrt(Math.max(0, t[2] - 1))],
    p: (d, [g, a, b]) => (d > 0 ? g + (1 - g) / (1 + Math.exp(-a - b * Math.log(d))) : g),
    bmd: ([, a, b], r) => Math.exp((Math.log(r / (1 - r)) - a) / b),
    prof: (B, [u0, u2], r) => { const b = 1 + u2 * u2; return [sin2(u0), Math.log(r / (1 - r)) - b * Math.log(B), b]; },
    profV: (t) => [asin2(t[0]), Math.sqrt(Math.max(0, t[2] - 1))],
    starts: (g) => [-3, -1, 1, 3].flatMap((a) => [1, 2, 4].map((b) => [asin2(g), a, Math.sqrt(b - 1)])),
    atBound: ([g, , b]) => [g < TINY, false, b - 1 < TINY],
    unscale: ([g, a, b], D) => [g, a - b * Math.log(D), b],
  };
  if (id === 'weibull') return {
    names: ['background', 'power', 'slope'],
    nat: (u) => [sin2(u[0]), 1 + u[1] * u[1], Math.exp(u[2])], inv: (t) => [asin2(t[0]), Math.sqrt(Math.max(0, t[1] - 1)), Math.log(t[2])],
    p: (d, [g, al, be]) => (d > 0 ? g + (1 - g) * -Math.expm1(-be * d ** al) : g),
    bmd: ([, al, be], r) => (-Math.log1p(-r) / be) ** (1 / al),
    prof: (B, [u0, u1], r) => { const al = 1 + u1 * u1; return [sin2(u0), al, -Math.log1p(-r) / B ** al]; },
    profV: (t) => [asin2(t[0]), Math.sqrt(Math.max(0, t[1] - 1))],
    starts: (g) => [1, 2, 4].flatMap((al) => [0.3, 1, 3, 10].map((be) => [asin2(g), Math.sqrt(al - 1), Math.log(be)])),
    atBound: ([g, al]) => [g < TINY, al - 1 < TINY, false],
    unscale: ([g, al, be], D) => [g, al, be / D ** al],
  };
  if (id === 'gamma') {
    // Power between 1 and 18, as in BMDS.
    const pw = (u: number) => 1 + 17 * sin2(u), ipw = (a: number) => asin2((a - 1) / 17);
    return {
      names: ['background', 'power', 'slope'],
      nat: (u) => [sin2(u[0]), pw(u[1]), Math.exp(u[2])], inv: (t) => [asin2(t[0]), ipw(t[1]), Math.log(t[2])],
      p: (d, [g, al, be]) => (d > 0 ? g + (1 - g) * gammaP(al, be * d) : g),
      bmd: ([, al, be], r) => gammaPInv(r, al) / be,
      prof: (B, [u0, u1], r) => { const al = pw(u1); return [sin2(u0), al, gammaPInv(r, al) / B]; },
      profV: (t) => [asin2(t[0]), ipw(t[1])],
      starts: (g) => [1, 2, 4, 8].flatMap((al) => [0.5, 2, 8, 20].map((be) => [asin2(g), ipw(al), Math.log(be)])),
      atBound: ([g, al]) => [g < TINY, al - 1 < TINY, 18 - al < TINY],
      unscale: ([g, al, be], D) => [g, al, be / D],
    };
  }
  if (id === 'multistage') {
    const k = degree;
    const poly = (d: number, th: number[]) => { let s = 0; for (let i = 1; i <= k; i++) s += th[i] * d ** i; return s; };
    return {
      names: ['background', ...Array.from({ length: k }, (_, i) => `β${i + 1}`)],
      nat: (u) => [sin2(u[0]), ...u.slice(1).map((v) => v * v)], inv: (t) => [asin2(t[0]), ...t.slice(1).map((v) => Math.sqrt(Math.max(0, v)))],
      p: (d, th) => (d > 0 ? th[0] + (1 - th[0]) * -Math.expm1(-poly(d, th)) : th[0]),
      bmd: (th, r) => {
        const q = -Math.log1p(-r);
        if (!th.slice(1).some((v) => v > 0)) return Infinity;
        let lo = 0, hi = 1;
        while (poly(hi, th) < q) hi *= 2;
        for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (poly(m, th) < q) lo = m; else hi = m; if (hi - lo < 1e-15 * hi) break; }
        return (lo + hi) / 2;
      },
      prof: (B, v, r) => {
        const q = -Math.log1p(-r), rest = v.slice(1).map((x) => x * x);
        let s = 0; rest.forEach((b, i) => (s += b * B ** (i + 2)));
        const b1 = (q - s) / B;
        return b1 < 0 ? null : [sin2(v[0]), b1, ...rest];
      },
      profV: (t) => [asin2(t[0]), ...t.slice(2).map((v) => Math.sqrt(Math.max(0, v)))],
      starts: (g) => {
        const out: number[][] = [];
        const vals = [0, 0.3, 1, 3];
        const rec = (pre: number[]) => { if (pre.length === k) { if (pre.some((x) => x > 0)) out.push([asin2(g), ...pre.map(Math.sqrt)]); return; } for (const v of vals) rec([...pre, v]); };
        rec([]);
        return out;
      },
      atBound: (th) => [th[0] < TINY, ...th.slice(1).map((v) => v < TINY)],
      unscale: (th, D) => [th[0], ...th.slice(1).map((v, i) => v / D ** (i + 1))],
    };
  }
  // Probit: P = Φ(a + b·d), no background term (as in BMDS).
  return {
    names: ['intercept', 'slope'],
    nat: (u) => [u[0], u[1]], inv: (t) => t.slice(),
    p: (d, [a, b]) => normCdf(a + b * d),
    bmd: ([a, b], r) => (b > 0 ? (normInv(normCdf(a) + r * (1 - normCdf(a))) - a) / b : NaN),
    prof: (B, [a], r) => [a, (normInv(normCdf(a) + r * (1 - normCdf(a))) - a) / B],
    profV: (t) => [t[0]],
    starts: () => [-3, -2, -1, 0].flatMap((a) => [0.5, 2, 5].map((b) => [a, b])),
    atBound: () => [false, false],
    unscale: ([a, b], D) => [a, b / D],
  };
}

const loglik = (S: Spec, th: number[], g: Group[]) => {
  let ll = 0;
  for (const { dose, n, r } of g) {
    const p = Math.min(1 - 1e-15, Math.max(1e-15, S.p(dose, th)));
    ll += (r > 0 ? r * Math.log(p) : 0) + (n - r > 0 ? (n - r) * Math.log(1 - p) : 0);
  }
  return ll;
};

export type ModelFit = {
  id: ModelId; name: string; params: { name: string; value: number; atBound: boolean }[];
  ll: number; k: number; aic: number; chi2: number; df: number; pValue: number;
  bmd: number; bmdl: number; residuals: number[]; expected: number[];
  /** Probability of response at a dose in the user's units. */
  curve: (dose: number) => number;
  notes: string[];
};

export function checkGroups(groups: Group[]): Group[] {
  const g = groups.filter((x) => [x.dose, x.n, x.r].every(Number.isFinite)).slice().sort((a, b) => a.dose - b.dose);
  if (g.length < 3) throw new Error('Enter at least 3 dose groups (dose, number tested, number affected).');
  if (g.length > 50) throw new Error('That is more than 50 dose groups. Is this the right data?');
  for (const x of g) {
    if (x.dose < 0) throw new Error('Doses cannot be negative.');
    if (!(x.n > 0) || !Number.isInteger(x.n) || !Number.isInteger(x.r)) throw new Error('Numbers tested and affected must be whole numbers, with at least 1 tested per group.');
    if (x.r < 0 || x.r > x.n) throw new Error(`At dose ${x.dose}, the number affected must be between 0 and ${x.n}.`);
  }
  for (let i = 1; i < g.length; i++) if (g[i].dose === g[i - 1].dose) throw new Error(`The dose ${g[i].dose} appears twice. Combine those groups into one row.`);
  if (!(g[g.length - 1].dose > 0)) throw new Error('At least one dose must be above 0.');
  if (g.every((x) => x.r === 0)) throw new Error('No animal or subject responded at any dose, so there is no dose-response to model.');
  return g;
}

export function fitModel(id: ModelId, groups: Group[], bmr: number, degree = 2): ModelFit {
  if (!(bmr > 0 && bmr < 1)) throw new Error('The benchmark response must be between 0 and 100 % (10 % is usual).');
  const D = Math.max(...groups.map((x) => x.dose));
  const g = groups.map((x) => ({ ...x, dose: x.dose / D }));
  const S = spec(id, degree);
  const ctl = g.find((x) => x.dose === 0);
  const g0 = Math.min(0.5, Math.max(0.01, ctl ? (ctl.r + 0.5) / (ctl.n + 1) : 0.05));
  const nll = (u: number[]) => { const v = -loglik(S, S.nat(u), g); return Number.isFinite(v) ? v : 1e300; };
  // Several starts, each polished by restarting the simplex until it stops improving.
  let best: { x: number[]; f: number } | null = null;
  for (const s of S.starts(g0)) {
    const r = nelderMead(nll, s, { maxIter: 1500, tol: 1e-10 });
    if (!best || r.f < best.f) best = r;
  }
  for (let k = 0; k < 8; k++) {
    const r = nelderMead(nll, best!.x, { step: 0.05 / (k + 1), maxIter: 4000 });
    const done = best!.f - r.f < 1e-12;
    if (r.f <= best!.f) best = r;
    if (done && k > 1) break;
  }
  const th = S.nat(best!.x), ll = -best!.f;
  const bound = S.atBound(th), k = bound.filter((b) => !b).length;
  const expected = g.map((x) => x.n * S.p(x.dose, th));
  const residuals = g.map((x, i) => { const p = Math.min(1 - 1e-15, Math.max(1e-15, expected[i] / x.n)); return (x.r - expected[i]) / Math.sqrt(x.n * p * (1 - p)); });
  const chi2 = residuals.reduce((s, z) => s + z * z, 0), df = g.length - k;
  const bmdS = S.bmd(th, bmr);
  const notes: string[] = [];
  // BMDL: lowest BMD whose profile log-likelihood is within χ²₁(0.90)/2 of the maximum.
  let bmdlS = NaN;
  if (Number.isFinite(bmdS) && bmdS > 0) {
    const target = ll - CHI2_90 / 2;
    let warm = S.profV(th);
    const prof = (B: number) => {
      const f = (v: number[]) => { const t = S.prof(B, v, bmr); if (!t || t.some((x) => !Number.isFinite(x))) return 1e300; const val = -loglik(S, t, g); return Number.isFinite(val) ? val : 1e300; };
      let r = nelderMead(f, warm, { maxIter: 3000 });
      for (const s of [S.profV(th), ...S.starts(g0).slice(0, 4).map((u) => S.profV(S.nat(u)))]) { const r2 = nelderMead(f, s, { maxIter: 1500, tol: 1e-10 }); if (r2.f < r.f) r = r2; }
      for (let k2 = 0; k2 < 4; k2++) { const r2 = nelderMead(f, r.x, { step: 0.05 / (k2 + 1), maxIter: 3000 }); if (r2.f < r.f - 1e-13) r = r2; else break; }
      warm = r.x;
      return -r.f;
    };
    let hi = bmdS, lo = bmdS;
    for (let i = 0; i < 80; i++) { lo = lo * 0.7; if (prof(lo) < target) break; hi = lo; if (lo < bmdS * 1e-8) { lo = NaN; break; } }
    if (Number.isFinite(lo)) {
      for (let i = 0; i < 45; i++) { const m = Math.sqrt(lo * hi); if (prof(m) < target) lo = m; else hi = m; if (hi / lo - 1 < 1e-7) break; }
      bmdlS = Math.sqrt(lo * hi);
    } else notes.push('The BMDL could not be bounded above zero: the data allow a BMD near 0.');
  } else notes.push('The fitted curve does not reach the benchmark response, so there is no BMD.');
  if (bmdS > 1) notes.push('The BMD is above the highest dose (extrapolated).');
  const thU = S.unscale(th, D);
  return {
    id, name: id === 'multistage' ? `Multistage (degree ${degree})` : MODEL_NAMES[id],
    params: S.names.map((name, i) => ({ name, value: thU[i], atBound: bound[i] })),
    ll, k, aic: -2 * ll + 2 * k, chi2, df, pValue: df > 0 ? chi2Sf(chi2, df) : NaN,
    bmd: bmdS * D, bmdl: bmdlS * D, residuals, expected,
    curve: (dose: number) => S.p(dose / D, th), notes,
  };
}

/** Fit every model; the lowest AIC among fits with goodness-of-fit p ≥ 0.1 and a BMD is marked (BMDS practice). */
export function fitAll(groups: Group[], bmr: number, degree = 2) {
  const g = checkGroups(groups);
  const fits = (['loglogistic', 'weibull', 'gamma', 'multistage', 'probit'] as ModelId[]).map((id) => fitModel(id, g, bmr, degree));
  const ok = fits.filter((f) => f.pValue >= 0.1 && Number.isFinite(f.bmd) && Number.isFinite(f.bmdl));
  const lowest = ok.length ? ok.reduce((a, b) => (b.aic < a.aic ? b : a)) : null;
  return { groups: g, fits, lowest };
}
