// A small box model of the carbon cycle for school (Learn): atmosphere, land (plants and soil), surface ocean,
// deep ocean and fossil fuels. Numbers are rounded teaching values in gigatonnes of carbon (GtC), chosen so the
// model behaves like the real cycle in outline; it is a teaching model, not a climate forecast. No DOM.

export type Stores = { air: number; land: number; sea: number; deep: number; fossil: number };
export type Choices = { burn: number; clear: number; plant: number }; // GtC per year
export type Flows = {
  photo: number; resp: number; seaIn: number; seaOut: number; down: number; up: number;
  burn: number; clear: number; plant: number;
};

/** Pre-industrial balance (rounded teaching values). 2.12 GtC of carbon in the air is 1 ppm of CO₂. */
export const PRE: Stores = { air: 590, land: 2300, sea: 900, deep: 37100, fossil: 5000 };
export const GTC_PER_PPM = 2.12;
export const GPP = 120;      // photosynthesis at the start, GtC/yr
export const EXCH = 60;      // air-sea exchange each way at the start, GtC/yr
export const MIX = 30;       // surface-deep mixing each way at the start, GtC/yr
export const BUFFER = 10;    // the ocean's buffer (Revelle) factor: CO₂ pressure over the sea rises 10 times faster than the carbon in it
export const FERT = 0.2;     // CO₂ fertilisation: photosynthesis × (1 + 0.2 ln(air / pre-industrial))

export const ppm = (air: number) => air / GTC_PER_PPM;

/** All the flows (GtC per year) for the stores and the choices. */
export function flows(s: Stores, c: Choices): Flows {
  const fuel = Math.min(c.burn, Math.max(0, s.fossil));
  return {
    photo: GPP * (1 + FERT * Math.log(s.air / PRE.air)),
    resp: GPP * (s.land / PRE.land),
    seaIn: EXCH * (s.air / PRE.air),
    seaOut: EXCH * Math.pow(s.sea / PRE.sea, BUFFER),
    down: MIX * (s.sea / PRE.sea),
    up: MIX * (s.deep / PRE.deep),
    burn: fuel, clear: Math.min(c.clear, Math.max(0, s.land)), plant: c.plant,
  };
}

/** One year forward (ten small steps inside, so the fast ocean exchange stays stable). */
export function step(s: Stores, c: Choices): Stores {
  let x = { ...s };
  const n = 10, dt = 1 / n;
  for (let i = 0; i < n; i++) {
    const f = flows(x, c);
    x = {
      air: x.air + dt * (f.resp - f.photo + f.seaOut - f.seaIn + f.burn + f.clear - f.plant),
      land: x.land + dt * (f.photo - f.resp - f.clear + f.plant),
      sea: x.sea + dt * (f.seaIn - f.seaOut - f.down + f.up),
      deep: x.deep + dt * (f.down - f.up),
      fossil: x.fossil - dt * f.burn,
    };
  }
  return x;
}

export const total = (s: Stores) => s.air + s.land + s.sea + s.deep + s.fossil;

/** Made-up smooth history: fuel burning rising from 0 in 1850 to 10 GtC/yr in 2025, land clearing about 1. */
export const pastBurn = (year: number) => 10 * Math.pow(Math.max(0, year - 1850) / 175, 2.2);
export const pastClear = (year: number) => Math.min(1.2, Math.max(0, (year - 1850) / 100));

/** The model's own 2025: run the made-up history from the pre-industrial balance. */
export function start2025(): Stores {
  let s = { ...PRE };
  for (let y = 1850; y < 2025; y++) s = step(s, { burn: pastBurn(y), clear: pastClear(y), plant: 0 });
  return s;
}

/** Run from `s` for `years` with the same choices each year; returns the state at the start and after each year. */
export function run(s: Stores, c: Choices, years: number): Stores[] {
  const out = [s];
  for (let i = 0; i < years; i++) out.push(step(out[out.length - 1], c));
  return out;
}

/** Where a year's fuel carbon ends up: the change in each store over one year, in GtC. */
export function budget(s: Stores, c: Choices) {
  const t = step(s, c);
  return { air: t.air - s.air, land: t.land - s.land, sea: t.sea - s.sea + t.deep - s.deep, fossil: t.fossil - s.fossil };
}
