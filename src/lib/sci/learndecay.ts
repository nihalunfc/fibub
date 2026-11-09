// Radioactive decay modelled with dice for the school tool decay-dice: every throw, each die that shows the chosen
// face is removed. The chance per throw p gives the decay constant λ = −ln(1 − p) (≈ p when p is small), the
// half-life ln 2 / λ, and the expected number left N₀(1 − p)ᵗ = N₀ e^(−λt). Plain maths, no DOM.
export const lambdaOf = (p: number) => -Math.log(1 - p);
export const halfLife = (p: number) => Math.LN2 / lambdaOf(p);
export const expected = (N0: number, p: number, t: number) => N0 * (1 - p) ** t;
export const expectedExp = (N0: number, lambda: number, t: number) => N0 * Math.exp(-lambda * t);
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Throw every die still in play; returns a new list of which are left (true = still there). */
export function throwAll(alive: boolean[], p: number, rand: () => number) {
  return alive.map((a) => a && rand() >= p);
}
/** When the count first reaches half its start, interpolating ln N between throws. NaN if it never does. */
export function measuredHalfLife(series: number[]) {
  const half = series[0] / 2;
  for (let t = 1; t < series.length; t++) {
    if (series[t] <= half) {
      const a = series[t - 1], b = series[t];
      if (b <= 0) return t - 1 + (a - half) / (a - b);
      return t - 1 + (Math.log(a) - Math.log(half)) / (Math.log(a) - Math.log(b));
    }
  }
  return NaN;
}
