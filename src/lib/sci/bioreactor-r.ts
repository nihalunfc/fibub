// A stirred-tank bioreactor for school biotechnology: a batch of bacteria growing on sugar, with three
// simple control loops (temperature, pH and dissolved oxygen). A teaching model with round, made-up numbers:
//   growth  μ = μmax · S/(Ks + S) · fT · fpH · fO,  dX/dt = μX,  dS/dt = −μX / Y
//   heat    dT/dt = h·μX − k(T − Troom) − cooling,      cooling = Kt (T − Tset) when the loop is on
//   acid    dpH/dt = −a·μX + base,                       base = Kp · max(0, pHset − pH) when on
//   oxygen  dDO/dt = kLa (100 − DO) − q·μX,              kLa from the stirrer, raised by the DO loop
// solved with fourth-order Runge-Kutta.

export type Setup = {
  tempOn: boolean; tSet: number; phOn: boolean; phSet: number; doOn: boolean; doSet: number;
  stir: number; // kLa (per hour) when the DO loop is off
  S0: number; X0: number;
};
export const P = { muMax: 0.6, Ks: 0.5, Y: 0.5, h: 3, k: 0.05, Troom: 25, Kt: 10, a: 0.15, Kp: 3, q: 200, KO: 10, kLaMin: 5, kLaMax: 60, Kd: 2, T0: 37, pH0: 7, DO0: 100 };

export const fT = (T: number) => Math.exp(-(((T - 37) / 5) ** 2));
export const fpH = (pH: number) => Math.exp(-(((pH - 7) / 0.7) ** 2));
export const fO = (DO: number) => Math.max(DO, 0) / (P.KO + Math.max(DO, 0));
export const mu = (S: number, T: number, pH: number, DO: number) => P.muMax * (Math.max(S, 0) / (P.Ks + Math.max(S, 0))) * fT(T) * fpH(pH) * fO(DO);

/** kLa actually used: the stirrer setting, or what the DO loop asks for (between kLaMin and kLaMax). */
export const kla = (s: Setup, DO: number) => (s.doOn ? Math.min(P.kLaMax, Math.max(P.kLaMin, P.kLaMin + P.Kd * (s.doSet - DO) + 0)) : s.stir);

type Y = [number, number, number, number, number]; // X, S, T, pH, DO
export function deriv(s: Setup, y: Y): Y {
  const [X, S, T, pH, DO] = y, m = mu(S, T, pH, DO), g = m * X;
  const cool = s.tempOn ? P.Kt * (T - s.tSet) : 0;
  const base = s.phOn ? P.Kp * Math.max(0, s.phSet - pH) : 0;
  return [g, -g / P.Y, P.h * g - P.k * (T - P.Troom) - cool, -P.a * g + base, kla(s, DO) * (100 - DO) - P.q * g];
}

export type Run = { t: number[]; X: number[]; S: number[]; T: number[]; pH: number[]; DO: number[] };
export function simulate(s: Setup, hours = 24, dt = 0.005): Run {
  let y: Y = [s.X0, s.S0, P.T0, P.pH0, P.DO0];
  const r: Run = { t: [0], X: [y[0]], S: [y[1]], T: [y[2]], pH: [y[3]], DO: [y[4]] };
  const n = Math.round(hours / dt), add = (a: Y, b: Y, k: number) => a.map((v, i) => v + k * b[i]) as Y;
  for (let i = 1; i <= n; i++) {
    const k1 = deriv(s, y), k2 = deriv(s, add(y, k1, dt / 2)), k3 = deriv(s, add(y, k2, dt / 2)), k4 = deriv(s, add(y, k3, dt));
    y = y.map((v, j) => v + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])) as Y;
    y[1] = Math.max(0, y[1]); y[4] = Math.min(100, Math.max(0, y[4]));
    if (i % 20 === 0) { r.t.push(i * dt); r.X.push(y[0]); r.S.push(y[1]); r.T.push(y[2]); r.pH.push(y[3]); r.DO.push(y[4]); }
  }
  return r;
}

/** First time the sugar falls below 1 % of the start, or NaN. */
export const sugarGone = (r: Run, S0: number) => { const i = r.S.findIndex((v) => v < 0.01 * S0); return i < 0 ? NaN : r.t[i]; };
