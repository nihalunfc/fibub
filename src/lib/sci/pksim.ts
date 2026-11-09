// Teaching simulator for linear one- and two-compartment pharmacokinetic models: what an entered regimen does to
// an invented drug. Closed forms (Gibaldi and Perrier, Pharmacokinetics, 2nd ed. 1982; Rowland and Tozer,
// Clinical Pharmacokinetics and Pharmacodynamics): the unit-impulse response is (1/V1)·Σ Aᵢ·e^(−λᵢt), each
// administration is added by superposition, and steady state by the geometric series Σ e^(−λ·jτ). No DOM.
// This file only goes forward from a regimen to concentrations; it never works out an amount to give.

export type Model = { comp: 1 | 2; cl: number; v1: number; q?: number; v2?: number };
export type Route = 'bolus' | 'infusion' | 'oral';
export type Regimen = { route: Route; amount: number; tau: number; n: number; tinf?: number; ka?: number; f?: number };
export type Exp = { a: number; lam: number };

/** Disposition exponents and coefficients: C(t) after a unit IV bolus = (1/V1)·Σ a·e^(−lam·t). */
export function disposition(m: Model): Exp[] {
  if (!(m.cl > 0) || !(m.v1 > 0)) throw new Error('Clearance and volume must be above 0.');
  const k10 = m.cl / m.v1;
  if (m.comp === 1) return [{ a: 1, lam: k10 }];
  if (!(m.q! > 0) || !(m.v2! > 0)) throw new Error('The intercompartmental clearance Q and the peripheral volume V2 must be above 0.');
  const k12 = m.q! / m.v1, k21 = m.q! / m.v2!;
  const s = k10 + k12 + k21, d = Math.sqrt(s * s - 4 * k10 * k21);
  const alpha = (s + d) / 2, beta = (k10 * k21) / alpha; // product form keeps beta accurate
  return [{ a: (alpha - k21) / (alpha - beta), lam: alpha }, { a: (k21 - beta) / (alpha - beta), lam: beta }];
}

/** (e^(−λt) − e^(−ka·t)) / (ka − λ), with its limit t·e^(−λt) when ka ≈ λ. */
function bateman(lam: number, ka: number, t: number) {
  const d = ka - lam;
  if (Math.abs(d) < 1e-7 * Math.max(ka, lam)) return t * Math.exp(-lam * t) * (1 - (d * t) / 2);
  return (Math.exp(-lam * t) - Math.exp(-ka * t)) / d;
}

export type Sim = {
  exps: Exp[];
  /** Concentration s after one administration (0 before it). */
  single(s: number): number;
  /** Concentration at time t after the regimen's n administrations starting at 0. */
  at(t: number): number;
  /** Concentration at time t (0 ≤ t ≤ τ) into a dosing interval at steady state. */
  ss(t: number): number;
};

export function simulate(m: Model, r: Regimen): Sim {
  const exps = disposition(m), V = m.v1;
  if (!(r.amount > 0)) throw new Error('The amount per administration must be above 0.');
  if (!(r.tau > 0)) throw new Error('The interval between administrations must be above 0.');
  if (!(r.n >= 1) || r.n > 1000 || !Number.isInteger(r.n)) throw new Error('The number of administrations must be a whole number from 1 to 1000.');
  const F = r.route === 'oral' ? (r.f ?? 1) : 1;
  if (!(F > 0 && F <= 1)) throw new Error('The fraction absorbed F must be above 0 and at most 1.');
  const D = r.amount * F;
  let single: (s: number) => number;
  // The part of the single response that is a plain sum of exponentials, valid for s ≥ s0.
  let tail: { c: number; mu: number }[], s0 = 0;
  if (r.route === 'bolus') {
    single = (s) => (s < 0 ? 0 : (D / V) * exps.reduce((acc, e) => acc + e.a * Math.exp(-e.lam * s), 0));
    tail = exps.map((e) => ({ c: (D / V) * e.a, mu: e.lam }));
  } else if (r.route === 'infusion') {
    const T = r.tinf!;
    if (!(T > 0)) throw new Error('The infusion duration must be above 0.');
    if (T > r.tau) throw new Error('The infusion must end before the next one starts (duration at most the interval).');
    const R = D / T;
    single = (s) => {
      if (s < 0) return 0;
      if (s <= T) return (R / V) * exps.reduce((acc, e) => acc + (e.a / e.lam) * (1 - Math.exp(-e.lam * s)), 0);
      return (R / V) * exps.reduce((acc, e) => acc + (e.a / e.lam) * (1 - Math.exp(-e.lam * T)) * Math.exp(-e.lam * (s - T)), 0);
    };
    tail = exps.map((e) => ({ c: (R / V) * (e.a / e.lam) * (Math.exp(e.lam * T) - 1), mu: e.lam }));
    s0 = T;
  } else {
    const ka = r.ka!;
    if (!(ka > 0)) throw new Error('The absorption rate constant ka must be above 0.');
    single = (s) => (s < 0 ? 0 : ((D * ka) / V) * exps.reduce((acc, e) => acc + e.a * bateman(e.lam, ka, s), 0));
    // ka-terms and λ-terms, each a pure exponential (ka ≠ λ assumed for steady state; nudged if equal).
    tail = [];
    for (const e of exps) {
      let k = ka;
      if (Math.abs(k - e.lam) < 1e-7 * k) k = e.lam * (1 + 1e-6);
      tail.push({ c: ((D * ka) / V) * e.a / (k - e.lam), mu: e.lam }, { c: -((D * ka) / V) * e.a / (k - e.lam), mu: k });
    }
  }
  const at = (t: number) => {
    let c = 0;
    const last = Math.min(r.n - 1, Math.floor(t / r.tau + 1e-12));
    for (let j = 0; j <= last; j++) c += single(t - j * r.tau);
    return c;
  };
  // Steady state: this administration's own curve plus all earlier ones, which are on their exponential tails
  // (s ≥ τ ≥ s0), summed as geometric series.
  const ss = (t: number) => {
    let c = single(t);
    for (const { c: k, mu } of tail) c += k * Math.exp(-mu * (t + r.tau)) / (1 - Math.exp(-mu * r.tau));
    return c;
  };
  void s0;
  return { exps, single, at, ss };
}

/** Integral of g over [a, b] by composite Simpson with n (even) panels. */
export function simpson(g: (t: number) => number, a: number, b: number, n = 2000) {
  if (b <= a) return 0;
  const h = (b - a) / n;
  let s = g(a) + g(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * g(a + i * h);
  return (s * h) / 3;
}

/** Highest value of g on [a, b]: a dense scan, then golden-section refinement around the best point. */
export function maxOn(g: (t: number) => number, a: number, b: number, n = 400) {
  let bi = 0, bv = -Infinity;
  for (let i = 0; i <= n; i++) { const v = g(a + ((b - a) * i) / n); if (v > bv) { bv = v; bi = i; } }
  let lo = a + ((b - a) * Math.max(0, bi - 1)) / n, hi = a + ((b - a) * Math.min(n, bi + 1)) / n;
  const gr = (Math.sqrt(5) - 1) / 2;
  for (let k = 0; k < 80; k++) {
    const x1 = hi - gr * (hi - lo), x2 = lo + gr * (hi - lo);
    if (g(x1) >= g(x2)) hi = x2; else lo = x1;
  }
  const t = (lo + hi) / 2, v = g(t);
  return v >= bv ? { t, v } : { t: a + ((b - a) * bi) / n, v: bv };
}

export type Summary = {
  halfLives: number[]; cmax1: number; tmax1: number; auc1: number;
  cmaxSs: number; tmaxSs: number; cminSs: number; cavSs: number; aucSs: number;
  racAuc: number; racCmax: number; fluct: number; t90: number;
};

/** Steady-state and first-interval numbers for the regimen. */
export function summarise(m: Model, r: Regimen, sim = simulate(m, r)): Summary {
  const tau = r.tau, split = r.route === 'infusion' ? r.tinf! : NaN;
  const integ = (g: (t: number) => number) => (Number.isFinite(split) && split < tau ? simpson(g, 0, split) + simpson(g, split, tau) : simpson(g, 0, tau));
  const peak = (g: (t: number) => number) => (r.route === 'bolus' ? { t: 0, v: g(0) } : r.route === 'infusion' ? { t: r.tinf!, v: g(r.tinf!) } : maxOn(g, 0, tau));
  const F = r.route === 'oral' ? (r.f ?? 1) : 1;
  const p1 = peak(sim.single), ps = peak(sim.ss);
  const auc1 = integ(sim.single), aucSs = (r.amount * F) / m.cl;
  // Trough at steady state: lowest point of the interval (just before the next administration for these routes).
  let cminSs = Math.min(sim.ss(0), sim.ss(tau));
  if (r.route === 'oral') for (let i = 0; i <= 200; i++) cminSs = Math.min(cminSs, sim.ss((tau * i) / 200));
  const lamMin = Math.min(...sim.exps.map((e) => e.lam));
  return {
    halfLives: sim.exps.map((e) => Math.LN2 / e.lam), cmax1: p1.v, tmax1: p1.t, auc1,
    cmaxSs: ps.v, tmaxSs: ps.t, cminSs, cavSs: aucSs / tau, aucSs,
    racAuc: aucSs / auc1, racCmax: ps.v / p1.v, fluct: ((ps.v - cminSs) / (aucSs / tau)) * 100,
    t90: Math.log(10) / lamMin,
  };
}
