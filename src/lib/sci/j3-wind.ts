// Wind from pressure (Learn #1222): a side view of land and sea. The warmer side heats the air above it, the air
// rises, and air flows in along the ground from the cooler side (a sea breeze by day, a land breeze by night, the
// monsoon on a bigger scale). Plain TypeScript, no DOM.
// The motion is one closed convection cell, a teaching cartoon: in a box 0 ≤ x ≤ 1 (land on the left half, sea on
// the right), 0 ≤ y ≤ 1 (y up), with strength A ∝ (land − sea temperature):
//   u = −A sin(πx) cos(πy),  v = A cos(πx) sin(πy)   (no divergence: air is not created or lost)
// so for A > 0 air rises over the land, sinks over the sea, and the ground wind blows from sea to land.

export const R_DRY = 287.05; // J/(kg K), dry air
export const G = 9.81;
export const P0 = 101325;

/** Air density (kg/m³) at pressure P (Pa) and temperature t (°C), ideal gas. */
export const density = (P: number, t: number) => P / (R_DRY * (t + 273.15));
/** Pressure (Pa) at height z (m) above ground in a column of air all at temperature t (°C), starting from P0. */
export const pressureAloft = (t: number, z: number, p0 = P0) => p0 * Math.exp((-G * z) / (R_DRY * (t + 273.15)));

/** Cell strength from the temperature difference (teaching scale: 1 °C gives 0.04 box widths per second). */
export const strength = (tLand: number, tSea: number) => 0.04 * (tLand - tSea);

/** Wind at a point of the box. */
export function wind(x: number, y: number, A: number): [number, number] {
  return [-A * Math.sin(Math.PI * x) * Math.cos(Math.PI * y), A * Math.cos(Math.PI * x) * Math.sin(Math.PI * y)];
}

export type Parcel = { x: number; y: number; warm: number };
/** Air parcels spread over the box, from a seeded generator so a test can repeat them. */
export function parcels(n: number, rnd: () => number): Parcel[] {
  return Array.from({ length: n }, () => ({ x: 0.02 + 0.96 * rnd(), y: 0.02 + 0.96 * rnd(), warm: 0.5 }));
}
/** Move the parcels for dt seconds (midpoint rule, small steps), with a little random stirring. Near the
 *  ground each parcel takes on the warmth of the surface below it (0 cool … 1 warm). */
export function stepParcels(ps: Parcel[], A: number, dt: number, tLand: number, tSea: number, rnd: () => number) {
  const n = Math.max(1, Math.ceil(dt / 0.02)), h = dt / n, hot = tLand > tSea ? 'land' : tLand < tSea ? 'sea' : '';
  for (let s = 0; s < n; s++) for (const p of ps) {
    const [u1, v1] = wind(p.x, p.y, A), [u2, v2] = wind(p.x + (u1 * h) / 2, p.y + (v1 * h) / 2, A);
    p.x += u2 * h + (rnd() - 0.5) * 0.004; p.y += v2 * h + (rnd() - 0.5) * 0.004;
    p.x = Math.min(0.995, Math.max(0.005, p.x)); p.y = Math.min(0.995, Math.max(0.005, p.y));
    const ground = p.x < 0.5 ? 'land' : 'sea', target = p.y < 0.12 ? (ground === hot ? 1 : hot ? 0 : 0.5) : p.y > 0.8 ? 0.2 : p.warm;
    p.warm += (target - p.warm) * Math.min(1, h * 1.5);
  }
}
/** Average sideways wind of the parcels in the bottom fifth: negative means blowing towards the land (left). */
export function groundWind(ps: Parcel[], A: number) {
  const low = ps.filter((p) => p.y < 0.2); if (!low.length) return 0;
  return low.reduce((a, p) => a + wind(p.x, p.y, A)[0], 0) / low.length;
}

export type Preset = { id: string; name: string; land: number; sea: number; landName: string; seaName: string; breeze: string };
/** Rounded, made-up temperatures for the four classic cases. */
export const PRESETS: Preset[] = [
  { id: 'day', name: 'Sunny afternoon at the coast', land: 34, sea: 27, landName: 'Land', seaName: 'Sea', breeze: 'sea breeze' },
  { id: 'night', name: 'Clear night at the coast', land: 21, sea: 26, landName: 'Land', seaName: 'Sea', breeze: 'land breeze' },
  { id: 'summer', name: 'Summer over India', land: 42, sea: 29, landName: 'Land (India)', seaName: 'Indian Ocean', breeze: 'south-west summer monsoon' },
  { id: 'winter', name: 'Winter over India', land: 14, sea: 26, landName: 'Land (India)', seaName: 'Indian Ocean', breeze: 'north-east winter monsoon' },
];

export type Q = { q: string; ans: number; unit?: string; tol?: number; abs?: number; choices?: string[]; work: string };
/** Fresh "Check yourself" questions; lvl '8' or '11'. */
export function questions(lvl: string, rnd: () => number = Math.random): Q[] {
  const ri = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));
  const out: Q[] = [
    { q: 'On a hot sunny afternoon at the beach, which way does the wind usually blow along the ground?', ans: 0, choices: ['From the sea to the land', 'From the land to the sea', 'Straight up', 'There is never any wind'], work: 'The land heats up faster than the sea. Air over the land warms, expands and rises, leaving lower pressure, so cooler air from over the sea moves in: a sea breeze.' },
    { q: 'Wind always blows…', ans: 1, choices: ['from low pressure to high pressure', 'from high pressure to low pressure', 'from cold to hot only at night', 'from north to south'], work: 'Air is pushed from where the pressure is higher towards where it is lower, like air rushing out of a pumped-up tyre.' },
    { q: 'Why does the summer monsoon bring rain to India?', ans: 2, choices: ['The land is colder than the sea', 'Wind blows from the land to the sea', 'Moist air from the warm ocean blows in over the hot land', 'The Sun is closer in summer'], work: 'In summer the land gets much hotter than the Indian Ocean, so low pressure forms over the land and moist ocean air blows in. As it rises and cools, its water vapour turns into rain.' },
  ];
  if (lvl === '11') {
    const t1 = ri(20, 30), t2 = t1 + ri(4, 12);
    const r = (density(P0, t1) / density(P0, t2) - 1) * 100;
    out.push({ q: `At the same pressure, how many per cent denser is air at ${t1} °C than air at ${t2} °C? (ρ = P / (R T))`, ans: r, unit: '%', tol: 0.03, work: `ρ ∝ 1/T, so ρ(${t1} °C)/ρ(${t2} °C) = ${t2 + 273.15}/${t1 + 273.15} = ${(1 + r / 100).toFixed(4)}: about ${r.toFixed(2)}% denser. Cool air is heavier, so it sinks and spreads along the ground.` });
  }
  return out;
}
