// Zero-dimensional energy balance climate model, written by fibub from the textbook equations. No DOM.
// Radiative form:  C dT/dt = S(1 − α(T))/4 + F − ε σ T⁴
// Linear form:     C dΔT/dt = F − λ ΔT            (ΔT from a starting equilibrium)
// CO₂ forcing F = 5.35 ln(C/C₀) W/m² (Myhre et al. 1998, the standard simplified expression).
// Ice-albedo feedback (optional): α(T) = αw + (αi − αw)·(1 − tanh((T − Tm)/w))/2, a smooth step from icy to ice-free.
// With it there can be several equilibria; the equilibrium curve in solar-constant space is
//   S_eq(T) = 4 (ε σ T⁴ − F) / (1 − α(T)),
// stable where S_eq rises with T, and the tipping points (snowball and melt-back) are its turning points.
// One-layer greenhouse: an atmosphere transparent to sunlight with long-wave emissivity εa:
//   Te⁴ = S(1 − α)/(4σ),  Ts⁴ = 2 Te⁴/(2 − εa),  Ta⁴ = Te⁴/(2 − εa).

export const SIGMA = 5.670374419e-8;     // W m⁻² K⁻⁴ (CODATA, exact from SI)
export const YEAR = 365.25 * 86400;      // s
export const RHO_CP_WATER = 4.18e6;      // J m⁻³ K⁻¹, rounded volumetric heat capacity of water
export const K0 = 273.15;

/** CO₂ radiative forcing, W/m² (Myhre et al. 1998). */
export const co2Forcing = (c: number, c0: number) => 5.35 * Math.log(c / c0);
/** Heat capacity (J m⁻² K⁻¹) of a water layer of depth h metres. */
export const heatCap = (h: number) => RHO_CP_WATER * h;

export type Ice = { on: boolean; ai: number; Tm: number; w: number };
export type Params = { S: number; alpha: number; eps: number; F: number; ice: Ice };

/** Albedo at temperature T (K): the warm albedo, or the smooth ice step when the feedback is on. */
export function albedo(p: Params, T: number): number {
  if (!p.ice.on) return p.alpha;
  return p.alpha + ((p.ice.ai - p.alpha) * (1 - Math.tanh((T - p.ice.Tm) / p.ice.w))) / 2;
}
export const absorbed = (p: Params, T: number) => (p.S * (1 - albedo(p, T))) / 4;
export const olr = (p: Params, T: number) => p.eps * SIGMA * T ** 4;
/** Net energy into the system, W/m². */
export const net = (p: Params, T: number) => absorbed(p, T) + p.F - olr(p, T);

/** Equilibrium temperature without ice-albedo feedback (closed form), K. */
export function eqTemp(p: Params): number {
  const a = (p.S * (1 - p.alpha)) / 4 + p.F;
  return a > 0 ? (a / (p.eps * SIGMA)) ** 0.25 : NaN;
}

/** Bisection root of f on [a, b] where f changes sign. */
export function bisect(f: (x: number) => number, a: number, b: number, tol = 1e-12): number {
  let fa = f(a);
  for (let i = 0; i < 200 && b - a > tol * Math.max(1, Math.abs(a)); i++) {
    const m = (a + b) / 2, fm = f(m);
    if (fm === 0) return m;
    if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else b = m;
  }
  return (a + b) / 2;
}

export type Eq = { T: number; stable: boolean };
/** Every equilibrium between lo and hi K (scan, then bisection), with stability from the slope of the net flux. */
export function equilibria(p: Params, lo = 100, hi = 450, n = 3500): Eq[] {
  const out: Eq[] = [], f = (T: number) => net(p, T);
  let a = lo, fa = f(a);
  for (let i = 1; i <= n; i++) {
    const b = lo + ((hi - lo) * i) / n, fb = f(b);
    if (fa === 0) out.push({ T: a, stable: false });
    else if ((fa < 0) !== (fb < 0) && fb !== 0) out.push({ T: bisect(f, a, b), stable: false });
    a = b; fa = fb;
  }
  for (const e of out) { const h = 1e-4; e.stable = (f(e.T + h) - f(e.T - h)) / (2 * h) < 0; }
  return out;
}

/** The effective climate feedback parameter at T (W m⁻² K⁻¹): −d(net)/dT. Without ice, the Planck response 4εσT³. */
export function feedbackAt(p: Params, T: number): number { const h = 1e-4; return -(net(p, T + h) - net(p, T - h)) / (2 * h); }

// ---- Time evolution -------------------------------------------------------------------------------------------
export type Run = { t: number[]; T: number[]; F: number[] };
export type Scenario = { years: number; kind: 'step' | 'ramp'; Ffinal: number; rampYears: number };

/** Forcing at time t (years): a step to Ffinal at 0, or a linear-in-forcing ramp over rampYears (as CO₂ rising 1 %/yr). */
export const forcingAt = (s: Scenario, t: number) => (s.kind === 'step' || s.rampYears <= 0 ? s.Ffinal : s.Ffinal * Math.min(1, Math.max(0, t / s.rampYears)));

/** RK4 for the radiative model from T0; C in J m⁻² K⁻¹; returns points + 1 samples, evenly spaced. */
export function runRadiative(p: Params, C: number, T0: number, s: Scenario, points = 400): Run {
  const rhs = (t: number, T: number) => (net({ ...p, F: forcingAt(s, t) }, T) * YEAR) / C;
  const lam = Math.max(0.5, feedbackAt({ ...p, F: s.Ffinal }, T0));
  return rk4(rhs, T0, s, Math.min(0.25, C / (lam * YEAR) / 20), points);
}
/** RK4 for the linear model: dΔT/dt = (F − λΔT)/C, from ΔT = 0. */
export function runLinear(lambda: number, C: number, s: Scenario, points = 400): Run {
  const rhs = (t: number, T: number) => ((forcingAt(s, t) - lambda * T) * YEAR) / C;
  return rk4(rhs, 0, s, Math.min(0.25, C / (Math.max(lambda, 0.05) * YEAR) / 20), points);
}
function rk4(f: (t: number, y: number) => number, y0: number, s: Scenario, dtMax: number, points: number): Run {
  // A whole number of steps per output point, so every run samples the same times.
  const every = Math.max(1, Math.min(Math.floor(400000 / points), Math.ceil(s.years / dtMax / points)));
  const steps = every * points, dt = s.years / steps;
  const out: Run = { t: [0], T: [y0], F: [forcingAt(s, 0)] };
  let y = y0;
  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    // Forcing kinks (end of a ramp) fall on step edges closely enough at this step size.
    const k1 = f(t, y), k2 = f(t + dt / 2, y + (dt / 2) * k1), k3 = f(t + dt / 2, y + (dt / 2) * k2), k4 = f(t + dt, y + dt * k3);
    y += (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    if ((i + 1) % every === 0) { out.t.push((i + 1) * dt); out.T.push(y); out.F.push(forcingAt(s, (i + 1) * dt)); }
  }
  return out;
}
/** Exact solution of the linear model after a step: ΔT(t) = (F/λ)(1 − e^(−λt/C)). */
export const linearStep = (F: number, lambda: number, C: number, tYears: number) => (F / lambda) * (1 - Math.exp((-lambda * tYears * YEAR) / C));
/** Years for the response to a step to reach 63 % (e-folding) in the linear model. */
export const efold = (lambda: number, C: number) => C / lambda / YEAR;

// ---- Hysteresis -----------------------------------------------------------------------------------------------
/** Solar constant at which T (K) is an equilibrium. */
export const sEq = (p: Params, T: number) => (4 * (p.eps * SIGMA * T ** 4 - p.F)) / (1 - albedo(p, T));

/** The equilibrium curve S_eq(T) sampled from lo to hi K, split into stable and unstable stretches, plus turning points. */
export function hysteresis(p: Params, lo = 180, hi = 360, n = 1800): { pts: { T: number; S: number; stable: boolean }[]; tips: { T: number; S: number; kind: 'melt' | 'freeze' }[] } {
  const dS = (T: number) => { const h = 1e-4 * T; return (sEq(p, T + h) - sEq(p, T - h)) / (2 * h); };
  const pts: { T: number; S: number; stable: boolean }[] = [], tips: { T: number; S: number; kind: 'melt' | 'freeze' }[] = [];
  let prevT = lo, prevD = dS(lo);
  for (let i = 0; i <= n; i++) {
    const T = lo + ((hi - lo) * i) / n, d = dS(T);
    if (i > 0 && (d < 0) !== (prevD < 0)) {
      const Tt = bisect(dS, prevT, T);
      // A maximum of S_eq: the cold branch ends there (more sun melts the snowball). A minimum: the warm branch ends (less sun freezes it).
      tips.push({ T: Tt, S: sEq(p, Tt), kind: prevD > 0 ? 'melt' : 'freeze' });
    }
    pts.push({ T, S: sEq(p, T), stable: d > 0 });
    prevT = T; prevD = d;
  }
  return { pts, tips };
}

// ---- One-layer greenhouse -------------------------------------------------------------------------------------
export function oneLayer(S: number, alpha: number, epsA: number) {
  if (!(epsA >= 0 && epsA <= 1)) throw new Error('Atmosphere emissivity must be between 0 and 1.');
  const Te4 = (S * (1 - alpha)) / (4 * SIGMA), Ts4 = (2 * Te4) / (2 - epsA), Ta4 = Te4 / (2 - epsA);
  const Te = Te4 ** 0.25, Ts = Ts4 ** 0.25, Ta = Ta4 ** 0.25;
  const surf = SIGMA * Ts4, atm = epsA * SIGMA * Ta4;
  return { Te, Ts, Ta, absorbed: SIGMA * Te4, surface: surf, atmUp: atm, atmDown: atm, through: (1 - epsA) * surf, olr: (1 - epsA) * surf + atm, greenhouse: Ts - Te };
}
