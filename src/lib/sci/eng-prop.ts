// Propeller and rotor thrust: actuator-disc momentum theory (static thrust against power, induced velocity, figure of
// merit, ideal efficiency in axial flight) and a blade element momentum (BEM) model of a user-defined propeller with
// Prandtl tip loss and a simple made-up linear-lift aerofoil. Textbook equations; plain TypeScript, no DOM.

/** Ideal induced velocity at the disc in axial flight at speed V (m/s): T = 2 ρ A v (V + v). */
export const inducedVelocity = (T: number, rho: number, A: number, V = 0) => -V / 2 + Math.sqrt((V * V) / 4 + T / (2 * rho * A));
/** Ideal (momentum) power for thrust T at axial speed V, W. */
export const idealPower = (T: number, rho: number, A: number, V = 0) => T * (V + inducedVelocity(T, rho, A, V));
/** Static (hover) shaft power for thrust T with a figure of merit FM. */
export const hoverPower = (T: number, rho: number, A: number, FM = 1) => T ** 1.5 / (FM * Math.sqrt(2 * rho * A));
/** Static thrust from shaft power P with figure of merit FM. */
export const staticThrust = (P: number, rho: number, A: number, FM = 1) => (FM * P) ** (2 / 3) * (2 * rho * A) ** (1 / 3);
/** Figure of merit from a measured static thrust and shaft power. */
export const figureOfMerit = (T: number, P: number, rho: number, A: number) => T ** 1.5 / (P * Math.sqrt(2 * rho * A));
/** Ideal (Froude) propulsive efficiency at speed V. */
export const idealEfficiency = (T: number, rho: number, A: number, V: number) => (V > 0 ? V / (V + inducedVelocity(T, rho, A, V)) : 0);

export type Aerofoil = { cla: number; alpha0: number; clmax: number; cd0: number; kd: number };
export type Prop = {
  B: number; D: number; hubD: number; chordRoot: number; chordTip: number; pitch: number; rpm: number; V: number; rho: number;
  foil: Aerofoil; tipLoss?: boolean; n?: number;
};
export type Station = { r: number; c: number; beta: number; phi: number; alpha: number; cl: number; cd: number; W: number; a: number; ap: number; F: number; dT: number; dQ: number; stalled: boolean; ok: boolean };

/** Lift and drag of the simple aerofoil model (angles in radians). Lift is capped at ±CLmax with drag rising past stall. */
export function aerofoil(f: Aerofoil, alpha: number) {
  const raw = f.cla * (alpha - f.alpha0), stalled = Math.abs(raw) > f.clmax;
  const cl = stalled ? Math.sign(raw) * f.clmax : raw;
  const astall = f.alpha0 + Math.sign(raw || 1) * (f.clmax / f.cla);
  const cd = f.cd0 + f.kd * cl * cl + (stalled ? 1.8 * Math.sin(Math.min(Math.PI / 2, Math.abs(alpha - astall))) ** 2 : 0);
  return { cl, cd, stalled };
}

/**
 * One annulus of the BEM model. The inflow angle φ is found from the residual
 * R(φ) = V (cos φ + σ' Ct / (4F sin φ)) − Ωr (sin φ − σ' Cn / (4F sin φ)),
 * which combines momentum and blade-element thrust and torque and works at V = 0 (static). First root above 0.
 */
export function station(p: Prop, r: number, dr: number): Station {
  const R = p.D / 2, Om = (p.rpm * 2 * Math.PI) / 60, c = p.chordRoot + ((p.chordTip - p.chordRoot) * (r - p.hubD / 2)) / (R - p.hubD / 2);
  const beta = Math.atan(p.pitch / (2 * Math.PI * r)), sig = (p.B * c) / (2 * Math.PI * r);
  const parts = (phi: number) => {
    const s = Math.sin(phi), co = Math.cos(phi), alpha = beta - phi, af = aerofoil(p.foil, alpha);
    const Cn = af.cl * co - af.cd * s, Ct = af.cl * s + af.cd * co;
    let F = 1;
    if (p.tipLoss !== false) { const f = (p.B / 2) * (R - r) / (r * s); F = (2 / Math.PI) * Math.acos(Math.min(1, Math.exp(-f))); F = Math.max(F, 1e-4); }
    const res = p.V * (co + (sig * Ct) / (4 * F * s)) - Om * r * (s - (sig * Cn) / (4 * F * s));
    return { s, co, alpha, af, Cn, Ct, F, res };
  };
  const N = 400, lo = 1e-4, hi = Math.PI / 2;
  let a = lo, fa = parts(a).res, root = NaN;
  for (let i = 1; i <= N; i++) {
    const b = lo + ((hi - lo) * i) / N, fb = parts(b).res;
    if (fa === 0) { root = a; break; }
    if (fa * fb < 0) {
      let x0 = a, x1 = b, f0 = fa;
      for (let k = 0; k < 100; k++) { const m = (x0 + x1) / 2, fm = parts(m).res; if (f0 * fm <= 0) x1 = m; else { x0 = m; f0 = fm; } if (x1 - x0 < 1e-13) break; }
      root = (x0 + x1) / 2; break;
    }
    a = b; fa = fb;
  }
  if (!Number.isFinite(root)) return { r, c, beta, phi: NaN, alpha: NaN, cl: 0, cd: 0, W: 0, a: 0, ap: 0, F: 1, dT: 0, dQ: 0, stalled: false, ok: false };
  const x = parts(root);
  const W = (Om * r) / (x.co + (sig * x.Ct) / (4 * x.F * x.s));
  const q = 0.5 * p.rho * W * W * p.B * c * dr;
  const ua = W * x.s - p.V, ut = Om * r - W * x.co;
  return { r, c, beta, phi: root, alpha: x.alpha, cl: x.af.cl, cd: x.af.cd, W, a: p.V > 0 ? ua / p.V : NaN, ap: ut / (Om * r), F: x.F, dT: q * x.Cn, dQ: q * x.Ct * r, stalled: x.af.stalled, ok: true };
}

/** Whole-propeller BEM: thrust, torque, power and the usual coefficients. */
export function bem(p: Prop) {
  const n = p.n ?? 40, R = p.D / 2, r0 = p.hubD / 2, dr = (R - r0) / n, st: Station[] = [];
  for (let i = 0; i < n; i++) st.push(station(p, r0 + (i + 0.5) * dr, dr));
  const T = st.reduce((s, x) => s + x.dT, 0), Q = st.reduce((s, x) => s + x.dQ, 0);
  const rps = p.rpm / 60, Om = rps * 2 * Math.PI, P = Q * Om;
  const CT = T / (p.rho * rps ** 2 * p.D ** 4), CP = P / (p.rho * rps ** 3 * p.D ** 5), J = p.V / (rps * p.D);
  const A = (Math.PI * p.D * p.D) / 4;
  return {
    T, Q, P, CT, CP, CQ: Q / (p.rho * rps ** 2 * p.D ** 5), J, eta: T > 0 && P > 0 ? (T * p.V) / P : 0,
    FM: p.V === 0 && T > 0 && P > 0 ? figureOfMerit(T, P, p.rho, A) : NaN,
    tipSpeed: Om * R, stations: st, failed: st.filter((s) => !s.ok).length, stalled: st.filter((s) => s.stalled).length,
  };
}

export const EXAMPLE_FOIL: Aerofoil = { cla: 5.7, alpha0: (-3 * Math.PI) / 180, clmax: 1.2, cd0: 0.012, kd: 0.012 };
// A made-up 10 × 5 inch two-blade model propeller at 8,000 rpm.
export const EXAMPLE_PROP: Prop = { B: 2, D: 0.254, hubD: 0.03, chordRoot: 0.025, chordTip: 0.015, pitch: 0.127, rpm: 8000, V: 0, rho: 1.225, foil: EXAMPLE_FOIL };
