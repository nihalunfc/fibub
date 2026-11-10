// Hearing range: a log-scale frequency slider from 20 Hz to 20 kHz, wavelength in air, infrasound / audible /
// ultrasound, and an exponential sweep for finding your own range. Plain TypeScript, no DOM.

export const F_MIN = 20, F_MAX = 20000;
/** Slider position 0..1000 → frequency on a log scale, rounded to a tidy value. */
export function posToF(pos: number): number {
  const f = F_MIN * Math.pow(F_MAX / F_MIN, Math.max(0, Math.min(1000, pos)) / 1000);
  const step = f < 100 ? 1 : f < 1000 ? 5 : f < 10000 ? 50 : 100;
  return Math.round(f / step) * step;
}
export const fToPos = (f: number) => Math.round((1000 * Math.log(Math.max(F_MIN, Math.min(F_MAX, f)) / F_MIN)) / Math.log(F_MAX / F_MIN));
/** Wavelength in metres for a sound of f Hz at speed v (default 343 m/s, air at 20 °C). */
export const wavelength = (f: number, v = 343) => v / f;
export const band = (f: number) => (f < 20 ? 'infrasound (too low for people to hear)' : f > 20000 ? 'ultrasound (too high for people to hear)' : 'audible to most young people');
/** Frequency at time t (s) in an exponential sweep from f0 to f1 over `dur` seconds: equal time per octave. */
export const sweepF = (t: number, dur: number, f0: number, f1: number) => f0 * Math.pow(f1 / f0, Math.max(0, Math.min(1, t / dur)));

/** Approximate hearing ranges (Hz), rounded; individuals and studies differ. General knowledge, for comparison only. */
export const ANIMALS: [string, number, number][] = [
  ['People (young)', 20, 20000], ['Elephant', 15, 12000], ['Dog', 70, 45000], ['Cat', 50, 60000], ['Bat', 2000, 110000],
];
