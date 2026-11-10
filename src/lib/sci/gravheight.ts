// g above and below a planet's surface, and circular orbits (speed, period, escape speed, energy, the stationary
// orbit) for the school gravity-height-depth tool. Plain TypeScript, no DOM.
// GM, mean and equatorial radii and sidereal rotation periods: NASA planetary fact sheets (public domain), rounded.
import { type Question, pick, one, n } from './h4quiz.ts';

export const G = 6.6743e-11; // CODATA 2018
export type Planet = { id: string; name: string; GM: number; R: number; day: number; Req: number };
export const PLANETS: Planet[] = [
  { id: 'earth', name: 'Earth', GM: 3.986004e14, R: 6371e3, day: 86164.1, Req: 6378.137e3 },
  { id: 'mars', name: 'Mars', GM: 4.282837e13, R: 3389.5e3, day: 88642.7, Req: 3396.2e3 },
  { id: 'moon', name: 'Moon', GM: 4.9028e12, R: 1737.4e3, day: 2360591.5, Req: 1738.1e3 },
];
export const planet = (id: string) => PLANETS.find((p) => p.id === id) ?? PLANETS[0];

/** g at the surface (m/s²). */
export const g0 = (p: Planet) => p.GM / (p.R * p.R);
/** g at height h (m) above the surface; h < 0 means a depth −h inside (uniform-density model, g falls linearly to 0 at the centre). */
export function gAt(p: Planet, h: number) {
  if (h >= 0) return p.GM / (p.R + h) ** 2;
  const d = Math.min(-h, p.R);
  return g0(p) * (1 - d / p.R);
}
/** The school short cut for small heights: g (1 − 2h/R). */
export const gApproxHeight = (p: Planet, h: number) => g0(p) * (1 - (2 * h) / p.R);

/** A circular orbit at height h (m): speed, period, escape speed from there and energies per kg. */
export function orbit(p: Planet, h: number) {
  const r = p.R + h, v = Math.sqrt(p.GM / r);
  return { r, v, T: (2 * Math.PI * r) / v, vEsc: Math.sqrt((2 * p.GM) / r), ke: p.GM / (2 * r), pe: -p.GM / r, e: -p.GM / (2 * r), fromSurface: p.GM / p.R - p.GM / (2 * r) };
}
/** Escape speed from the surface. */
export const escapeSpeed = (p: Planet) => Math.sqrt((2 * p.GM) / p.R);
/** Height above the equator of the orbit whose period equals the planet's rotation (geostationary for Earth). */
export function stationaryHeight(p: Planet) {
  const r = Math.cbrt((p.GM * p.day * p.day) / (4 * Math.PI * Math.PI));
  return r - p.Req;
}

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const k = one(rng, [1, 2, 3, 4]), g = 9.8, ans = g / (1 + k) ** 2;
    qs.push({ text: `g at the Earth's surface is 9.8 m/s². What is g at a height equal to ${k === 1 ? 'the Earth\'s radius' : `${k} times the Earth's radius`} above the surface?`, ans, unit: 'm/s²', work: `At height h = ${k}R the distance from the centre is ${k + 1}R, so g = 9.8 ÷ ${k + 1}² = ${n(ans, 3)} m/s².`, tol: 0.01 }); }
  { const f = one(rng, [4, 5, 10, 2]), g = 9.8, ans = g * (1 - 1 / f);
    qs.push({ text: `How big is g at a depth of R/${f} below the Earth's surface? (g = 9.8 m/s² at the surface; take the Earth as uniform)`, ans, unit: 'm/s²', work: `g(d) = g (1 − d/R) = 9.8 × (1 − 1/${f}) = ${n(ans, 3)} m/s².`, tol: 0.01 }); }
  { const h = pick(rng, 2, 20) * 100, e = PLANETS[0], o = orbit(e, h * 1000), ans = o.v / 1000;
    qs.push({ text: `A satellite circles the Earth ${h} km above the surface. How fast does it move? (GM = 3.986 × 10¹⁴ m³/s², R = 6371 km)`, ans, unit: 'km/s', work: `v = √(GM/r) with r = 6371 + ${h} = ${6371 + h} km: v = √(3.986 × 10¹⁴ ÷ ${n((6371 + h) * 1000, 0)}) = ${n(ans, 3)} km/s.`, tol: 0.02 }); }
  { const m = pick(rng, 4, 9) * 10, k = one(rng, [2, 3, 4]), ans = (m * 9.8) / (k * k);
    qs.push({ text: `A ${m} kg student weighs ${n(m * 9.8, 1)} N on the ground. What would they weigh at a distance of ${k}R from the Earth's centre?`, ans, unit: 'N', work: `Weight falls as 1/r²: ${n(m * 9.8, 1)} ÷ ${k}² = ${n(ans, 2)} N. Their mass is still ${m} kg.`, tol: 0.5 }); }
  return qs;
}
