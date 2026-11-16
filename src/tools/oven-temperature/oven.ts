// Oven temperature maths for #T861. Plain TypeScript, no DOM.
// UK gas mark scale with the usual Celsius and Fahrenheit settings printed on cookers and in recipes (fibub's own working).
export const GAS: [string, number, number, string][] = [
  ['¼', 110, 225, 'Very cool'], ['½', 120, 250, 'Very cool'], ['1', 140, 275, 'Cool'], ['2', 150, 300, 'Cool'],
  ['3', 170, 325, 'Warm'], ['4', 180, 350, 'Moderate'], ['5', 190, 375, 'Moderately hot'], ['6', 200, 400, 'Fairly hot'],
  ['7', 220, 425, 'Hot'], ['8', 230, 450, 'Very hot'], ['9', 240, 475, 'Very hot'],
];

export const toF = (c: number) => (c * 9) / 5 + 32;
export const toC = (f: number) => ((f - 32) * 5) / 9;
export const roundTo = (v: number, step: number) => Math.round(v / step) * step;

/** What to set the dial to: Celsius to the nearest 5, Fahrenheit to the nearest 25 (the steps most ovens use). */
export function dial(c: number, f: number): { c: number; f: number } {
  return { c: roundTo(c, 5), f: roundTo(f, 25) };
}

/** Air fryer rule of thumb: 20 °C (25 °F) lower than the oven, and about 20% less time. */
export function airFryer(c: number, f: number): { c: number; f: number; timeFactor: number } {
  return { c: c - 20, f: f - 25, timeFactor: 0.8 };
}

/** True when a Celsius value is a believable home oven setting. */
export const sensible = (c: number) => Number.isFinite(c) && c >= 50 && c <= 330;

/** Typical settings for common bakes, in °C (people usually round these; check your own recipe). */
export const PRESETS: [string, number][] = [
  ['Slow cook', 150], ['Cake', 180], ['Cookies', 180], ['Roast veg', 200], ['Bread', 220], ['Pizza', 240],
];
