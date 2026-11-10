// Population growth for school ecology: exponential growth N = N0 e^(rt) and logistic growth
// N = K / (1 + ((K − N0)/N0) e^(−rt)), with their growth rates dN/dt = rN and dN/dt = rN(1 − N/K),
// and three made-up age-pyramid shapes (expanding, stable, declining).

export const expN = (n0: number, r: number, t: number) => n0 * Math.exp(r * t);
export const logN = (n0: number, r: number, K: number, t: number) => (n0 <= 0 ? 0 : K / (1 + ((K - n0) / n0) * Math.exp(-r * t)));
export const expRate = (r: number, n: number) => r * n;
export const logRate = (r: number, K: number, n: number) => r * n * (1 - n / K);
/** Doubling time of exponential growth: ln 2 / r. */
export const doubling = (r: number) => (r > 0 ? Math.LN2 / r : Infinity);
/** Time for logistic growth to reach N (N between N0 and K): t = ln(N (K − N0) / (N0 (K − N))) / r. */
export const logTimeTo = (n0: number, r: number, K: number, n: number) => Math.log((n * (K - n0)) / (n0 * (K - n))) / r;
/** Fastest logistic growth: at N = K/2, dN/dt = rK/4. */
export const maxRate = (r: number, K: number) => ({ n: K / 2, rate: (r * K) / 4 });

/** Share of the population in each age group (0-9, 10-19, ... 80+), made-up teaching shapes; each adds to 100. */
export const PYRAMIDS: Record<'expanding' | 'stable' | 'declining', number[]> = {
  expanding: [26, 21, 16, 13, 10, 7, 4, 2, 1],
  stable: [12, 12, 12, 12, 12, 12, 11, 10, 7],
  declining: [7, 8, 10, 12, 14, 15, 14, 12, 8],
};
/** Share under 20, 20-59 and 60+. */
export function groups(p: number[]) {
  const s = (a: number, b: number) => p.slice(a, b).reduce((x, y) => x + y, 0);
  return { young: s(0, 2), working: s(2, 6), old: s(6, 9) };
}
