// Weather maths and picks for vehicles (pure TypeScript, no DOM): hot-car and tyre-type.

// ---- Hot car ----
// Rough shape of a parked car's cabin warming, fitted by fibub to the kind of curve seen in published
// measurements (McLaren, Null and Quinn 2005, Pediatrics; Grundstein et al. 2009). Not a copy of any table.
export const SUN_RISE_C = 24;       // °C the cabin gains over the outside air after a long time in sun
export const SHADE_FACTOR = 0.5;    // shade: about half the rise
export const CRACKED_FACTOR = 0.95; // cracked windows barely help
export const RISE_MINUTES = 22;     // time constant, minutes

export type HotCarInput = { outsideC: number; minutes: number; sun: boolean; cracked: boolean };

export function cabinRise(minutes: number, sun: boolean, cracked: boolean): number {
  const t = Math.max(0, minutes);
  return SUN_RISE_C * (sun ? 1 : SHADE_FACTOR) * (cracked ? CRACKED_FACTOR : 1) * (1 - Math.exp(-t / RISE_MINUTES));
}
export function cabinTempC(i: HotCarInput): number { return i.outsideC + cabinRise(i.minutes, i.sun, i.cracked); }
export function cabinSeries(i: Omit<HotCarInput, 'minutes'>, maxMin = 60, step = 5): { min: number; c: number }[] {
  const out: { min: number; c: number }[] = [];
  for (let m = 0; m <= maxMin; m += step) out.push({ min: m, c: cabinTempC({ ...i, minutes: m }) });
  return out;
}
export type HotBand = 'ok' | 'warm' | 'danger' | 'deadly';
/** Plain-language bands: under 32 °C ok, 32-40 hot, 40-50 dangerous, 50 and over deadly for a child or pet. */
export function hotBand(c: number): HotBand { return c >= 50 ? 'deadly' : c >= 40 ? 'danger' : c >= 32 ? 'warm' : 'ok'; }
export const cToF = (c: number) => (c * 9) / 5 + 32;
export const fToC = (f: number) => ((f - 32) * 5) / 9;

// ---- Tyre type ----
export type TyreKind = 'summer' | 'all-season' | 'all-weather' | 'winter' | 'all-terrain' | 'mud-terrain';
export type MotoKind = 'road' | 'sport' | 'touring' | 'dual-sport';
export type Cold = 'mild' | 'cold' | 'vcold'; // typical low: above 7 °C / around 0 °C / below -10 °C
export type Snow = 'never' | 'few' | 'weeks';
export type Roads = 'city' | 'rough' | 'sand' | 'mud';
export type Vehicle = 'car' | 'suv' | 'bike' | 'truck';
export type TyreInput = { cold: Cold; snow: Snow; roads: Roads; vehicle: Vehicle };
export type TyrePick = { first: TyreKind | MotoKind; second: TyreKind | MotoKind; why: string };

export function pickTyre(i: TyreInput): TyrePick {
  if (i.vehicle === 'bike') {
    if (i.roads !== 'city') return { first: 'dual-sport', second: 'touring', why: 'Gravel, sand or trails need chunkier blocks that still work on tarmac.' };
    if (i.snow === 'weeks' || i.cold === 'vcold') return { first: 'touring', second: 'road', why: 'Deep cold and snow: most riders park the bike. If you ride, pick a tyre made for wet and cold, and warm it up gently.' };
    return { first: 'road', second: 'touring', why: 'Everyday riding on tarmac suits a road tyre with good wet grip.' };
  }
  if (i.roads === 'mud') {
    return i.snow === 'weeks'
      ? { first: 'all-terrain', second: 'winter', why: 'Mud tyres clog and slip on packed snow and ice, so an all-terrain with the snowflake mark is the safer all-round pick.' }
      : { first: 'mud-terrain', second: 'all-terrain', why: 'Deep mud needs open blocks that throw the mud out. They are louder and wear faster on tarmac.' };
  }
  if (i.roads !== 'city') {
    return i.snow === 'weeks'
      ? { first: 'all-terrain', second: 'winter', why: 'Rough roads and snow: choose an all-terrain tyre that also carries the snowflake mark.' }
      : { first: 'all-terrain', second: 'all-season', why: i.roads === 'sand' ? 'Sand and gravel mixed with tarmac: tough sidewalls and a mixed tread handle both.' : 'Gravel and rough roads need tough sidewalls and a tread that bites loose ground.' };
  }
  if (i.snow === 'weeks' || i.cold === 'vcold') return { first: 'winter', second: 'all-weather', why: 'Long snow or deep cold: winter rubber stays soft and grips snow and ice far better.' };
  if (i.snow === 'few') return { first: 'all-weather', second: i.cold === 'cold' ? 'winter' : 'all-season', why: 'A few snowy days: an all-weather tyre (snowflake mark) copes all year without swapping.' };
  if (i.cold === 'cold') return { first: 'all-season', second: 'winter', why: 'Around freezing but no snow: all-season is fine, and winter tyres add grip on cold, wet roads.' };
  return { first: 'summer', second: 'all-season', why: 'Warm all year with no snow: summer tyres grip best in the dry and the wet.' };
}
