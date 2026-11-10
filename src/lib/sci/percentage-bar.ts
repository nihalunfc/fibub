// Percentage bar (school maths, fractions in disguise): p% of a whole, what percent one number is of another,
// percentage change, and why "up p% then down p%" does not get back to the start. Plain TypeScript, no DOM.

/** p% of n. */
export const percentOf = (p: number, n: number) => (p / 100) * n;

/** What percent a is of b. */
export const whatPercent = (a: number, b: number) => (b === 0 ? NaN : (100 * a) / b);

/** Percentage change from `from` to `to` (positive = increase). */
export const percentChange = (from: number, to: number) => (from === 0 ? NaN : (100 * (to - from)) / from);

/** Change n by p% (p may be negative for a decrease). */
export const changeBy = (n: number, p: number) => n * (1 + p / 100);

/** Change by p% then by q%: the overall percentage change, (1 + p/100)(1 + q/100) − 1, as a percent. */
export const overall = (p: number, q: number) => 100 * ((1 + p / 100) * (1 + q / 100) - 1);

/** The value before a p% change that gave `after`. */
export const original = (after: number, p: number) => after / (1 + p / 100);
