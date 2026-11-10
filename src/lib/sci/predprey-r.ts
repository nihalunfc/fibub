// Predator-prey for school ecology: the Lotka-Volterra model
//   dH/dt = aH − bHP (prey: births minus being eaten; with a prey limit K: aH(1 − H/K) − bHP)
//   dP/dt = cHP − dP (predators: births from prey eaten minus deaths)
// solved with fourth-order Runge-Kutta. Equilibrium without a limit: H* = d/c, P* = a/b.

export type LV = { a: number; b: number; c: number; d: number; K?: number };
export type Run = { t: number[]; H: number[]; P: number[] };

const f = (p: LV, h: number, q: number): [number, number] => [
  p.a * h * (p.K ? 1 - h / p.K : 1) - p.b * h * q,
  p.c * h * q - p.d * q,
];

/** RK4 from (h0, p0) for time T in steps of dt. */
export function simulate(p: LV, h0: number, p0: number, T: number, dt = 0.01): Run {
  const n = Math.round(T / dt), t = [0], H = [h0], P = [p0];
  let h = h0, q = p0;
  for (let i = 1; i <= n; i++) {
    const [k1h, k1p] = f(p, h, q);
    const [k2h, k2p] = f(p, h + (dt / 2) * k1h, q + (dt / 2) * k1p);
    const [k3h, k3p] = f(p, h + (dt / 2) * k2h, q + (dt / 2) * k2p);
    const [k4h, k4p] = f(p, h + dt * k3h, q + dt * k3p);
    h += (dt / 6) * (k1h + 2 * k2h + 2 * k3h + k4h); q += (dt / 6) * (k1p + 2 * k2p + 2 * k3p + k4p);
    h = Math.max(h, 0); q = Math.max(q, 0);
    t.push(i * dt); H.push(h); P.push(q);
  }
  return { t, H, P };
}

/** The point where both populations stay still (both above zero). */
export function equilibrium(p: LV): { H: number; P: number } | null {
  const H = p.d / p.c;
  if (p.K && H >= p.K) return null;
  return { H, P: (p.a * (p.K ? 1 - H / p.K : 1)) / p.b };
}

/** Times of the local maxima of a series (strict, ignoring the ends). */
export function peaks(t: number[], y: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < y.length - 1; i++) if (y[i] > y[i - 1] && y[i] >= y[i + 1]) out.push(t[i]);
  return out;
}

/** Average time between peaks, or NaN when there are fewer than two. */
export const period = (pk: number[]) => (pk.length < 2 ? NaN : (pk[pk.length - 1] - pk[0]) / (pk.length - 1));
/** Small-cycle period of the plain model near equilibrium: 2π / √(ad). */
export const smallPeriod = (p: LV) => (2 * Math.PI) / Math.sqrt(p.a * p.d);
/** Quantity that stays constant along a cycle of the plain model: cH − d ln H + bP − a ln P. */
export const invariant = (p: LV, h: number, q: number) => p.c * h - p.d * Math.log(h) + p.b * q - p.a * Math.log(q);
