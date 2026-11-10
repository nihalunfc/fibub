// Water cycle simulator maths (#1228): a small box model of one coast. The sun and wind evaporate sea water into
// the air over the land; air pushed up over the hills cools, and what it can no longer hold forms cloud; heavy cloud
// rains; rain either runs off to the river or soaks into the ground, which plants send back up. Amounts are mm of
// water spread over the land. A teaching model with made-up round rates, not a weather forecast.

export type Ground = 'forest' | 'farm' | 'city';
export type Params = { sun: number; temp: number; wind: number; ground: Ground };   // sun, wind 0..1; temp °C
export type State = { hour: number; vapour: number; cloud: number; soil: number; river: number; fromSea: number; toSea: number; rain: number; runoff: number; soak: number; plants: number };

/** Share of rain that runs straight off, and how strongly plants send soil water back to the air. */
export const GROUND: Record<Ground, { name: string; runoff: number; plants: number }> = {
  forest: { name: 'Forest', runoff: 0.15, plants: 1 },
  farm: { name: 'Fields', runoff: 0.35, plants: 0.6 },
  city: { name: 'City', runoff: 0.8, plants: 0.1 },
};

export const LIFT_COOLING = 9;   // °C colder at the hill tops (air rises about 1.4 km, cooling about 6.5 °C per km)

/** Saturation vapour pressure over water, kPa (Tetens formula). */
export const satVP = (t: number) => 0.6108 * Math.exp((17.27 * t) / (t + 237.3));
/** Most water vapour a cubic metre of air can hold at t °C, grams (ideal gas, Rv = 461.5 J/(kg K)). */
export const maxVapour = (t: number) => (satVP(t) * 1000 / (461.5 * (t + 273.15))) * 1000;
/** How much vapour (mm) the air column over the land can hold; 30 mm at 25 °C. */
export const capacity = (t: number) => (30 * satVP(t)) / satVP(25);

/** Start with the air over the land half full of vapour for its temperature. */
export const start = (t = 25): State => ({ hour: 0, vapour: 0.5 * capacity(t), cloud: 0, soil: 50, river: 2, fromSea: 0, toSea: 0, rain: 0, runoff: 0, soak: 0, plants: 0 });

/** Water on the land side (air, cloud, soil, river), mm. With what came from and went back to the sea it is conserved. */
export const landWater = (s: State) => s.vapour + s.cloud + s.soil + s.river;

/** One hour. Returns a new state; the hourly flows are in the returned `flows`. */
export function step(s: State, p: Params): { s: State; flows: { evap: number; plants: number; cond: number; rain: number; runoff: number; soak: number; out: number } } {
  const g = GROUND[p.ground], cap = capacity(p.temp), capHill = capacity(p.temp - LIFT_COOLING);
  const room = Math.max(0, 1 - s.vapour / cap);
  const evap = p.sun * (satVP(p.temp) / satVP(25)) * room * (0.3 + p.wind);
  const plants = Math.min(s.soil, 0.06 * p.sun * g.plants * (s.soil / 100) * room);
  let vapour = s.vapour + evap + plants;
  const cond = vapour > capHill ? 0.3 * (vapour - capHill) * (0.5 + p.wind) : 0;
  vapour -= cond;
  let cloud = s.cloud + cond;
  const rain = cloud > 3 ? 0.35 * (cloud - 2) : 0;
  cloud -= rain;
  const runoff = rain * g.runoff, soak = rain - runoff;
  const base = 0.0015 * (s.soil - plants + soak);           // ground water seeping into the river
  const soil = s.soil - plants + soak - base;
  const river = s.river + runoff + base, out = 0.15 * river;
  return {
    s: { hour: s.hour + 1, vapour, cloud, soil, river: river - out, fromSea: s.fromSea + evap, toSea: s.toSea + out, rain: s.rain + rain, runoff: s.runoff + runoff, soak: s.soak + soak, plants: s.plants + plants },
    flows: { evap, plants, cond, rain, runoff, soak, out },
  };
}

/** Run n hours from `s`. */
export function run(s: State, p: Params, hours: number): State {
  for (let i = 0; i < hours; i++) s = step(s, p).s;
  return s;
}
