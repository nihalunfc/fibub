// LED series resistor, power and array layout. Uses the straight-line LED model (a fixed forward voltage at the
// design current). No DOM.
import { seriesValues } from './eng-resistor.ts';

export type LedDesign = {
  r: number; pR: number; pLed: number; pTotal: number; iTotal: number; eff: number; headroom: number;
};

/** Series resistor for one string of n LEDs (forward voltage vf each) at current i from supply vs, with `strings` strings in parallel. */
export function design(vs: number, vf: number, i: number, n: number, strings = 1): LedDesign {
  const headroom = vs - n * vf;
  if (!(headroom > 0)) throw new Error(`${n} LED${n > 1 ? 's' : ''} need${n > 1 ? '' : 's'} ${+(n * vf).toPrecision(4)} V, more than the ${vs} V supply. Use fewer LEDs per string.`);
  const r = headroom / i;
  return { r, pR: i * i * r * strings, pLed: vf * i * n * strings, pTotal: vs * i * strings, iTotal: i * strings, eff: (n * vf) / vs, headroom };
}

/** Current through a string with resistor r (straight-line LED model). */
export const currentWith = (vs: number, vf: number, n: number, r: number) => Math.max(0, (vs - n * vf) / r);

/** The standard resistor just above (safer, a little less current) and the nearest one, in an E series. */
export function pick(r: number, series: number): { above: number; nearest: number } {
  const v = seriesValues(series, r / 2, r * 2);
  const above = v.find((x) => x >= r * (1 - 1e-12))!;
  const nearest = v.reduce((b, x) => (Math.abs(Math.log(x / r)) < Math.abs(Math.log(b / r)) ? x : b), v[0]);
  return { above, nearest };
}

const RATINGS = [0.0625, 0.1, 0.125, 0.25, 0.5, 1, 2, 3, 5, 10];
/** Smallest common resistor power rating at least `margin` times the dissipation. */
export const rating = (p: number, margin = 2) => RATINGS.find((x) => x >= p * margin) ?? NaN;

/** Most LEDs one string can hold, keeping at least `minHead` volts (or 10 % of the supply, whichever is more) for the resistor. */
export function maxPerString(vs: number, vf: number, minHead = 0): number {
  const head = Math.max(minHead, 0.1 * vs);
  return Math.max(0, Math.floor((vs - head) / vf + 1e-9));
}

/** Layout for `total` LEDs: strings of up to `per` LEDs; the strings are as even as possible. */
export function layout(total: number, per: number): { strings: number; sizes: number[] } {
  if (!(per >= 1)) return { strings: 0, sizes: [] };
  const strings = Math.ceil(total / per), base = Math.floor(total / strings), extra = total % strings;
  return { strings, sizes: Array.from({ length: strings }, (_, k) => base + (k < extra ? 1 : 0)) };
}

/** How the current changes when the forward voltage or the supply drifts (straight-line model). */
export function spread(vs: number, vf: number, n: number, r: number, dVf: number, dVs: number): { lo: number; hi: number } {
  return { lo: currentWith(vs - dVs, vf + dVf, n, r), hi: currentWith(vs + dVs, vf - dVf, n, r) };
}
