// Map scale and recipe scaling (school maths, proportional reasoning): a map scale 1 : n turns centimetres on
// the map into real distance, and back; a recipe scales by new servings ÷ old servings. Plain TypeScript, no DOM.

/** Real distance in km for `cm` centimetres on a map of scale 1 : n (1 km = 100 000 cm). */
export const realKm = (cm: number, n: number) => (cm * n) / 100000;

/** Map distance in cm for a real distance in km at scale 1 : n. */
export const mapCm = (km: number, n: number) => (km * 100000) / n;

/** The scale number n when `cm` on the map stands for `km` in real life. */
export const scaleN = (cm: number, km: number) => (km * 100000) / cm;

/** A distance in km written in the most readable unit: metres below 1 km. */
export function niceDistance(km: number): string {
  const r = (x: number, dp: number) => String(Number(x.toFixed(dp)));
  return km < 1 ? `${r(km * 1000, 1)} m` : `${r(km, 3)} km`;
}

/** Amount for `to` servings when `amount` serves `from`. */
export const scaleAmount = (amount: number, from: number, to: number) => (amount * to) / from;
