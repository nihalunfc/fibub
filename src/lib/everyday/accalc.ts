// Room air conditioner sizing helpers. Plain TypeScript, no DOM.
// Chart: ENERGY STAR "Properly Sized Room Air Conditioners": [upper limit in sq ft, BTU/h]. Each band runs from the previous limit (first from 100).
export const BANDS: [number, number][] = [[150, 5000], [250, 6000], [300, 7000], [350, 8000], [400, 9000], [450, 10000], [550, 12000], [700, 14000], [1000, 18000], [1200, 21000], [1400, 23000], [1500, 24000], [2000, 30000], [2500, 34000]];
export const UNITS = [5000, 6000, 8000, 10000, 12000, 14000, 18000, 24000];
export const SQFT = 0.09290304, FT = 0.3048, BTU_W = 3.41214;

export const bandIndex = (sqft: number) => BANDS.findIndex(([top]) => sqft <= top + 1e-9);

/** Common unit sizes just below and above a need (either may be missing). */
export function unitsAround(need: number) {
  const up = UNITS.find((u) => u >= need), down = [...UNITS].reverse().find((u) => u < need);
  return { down, up };
}

/** Electric input power in watts for a cooling output in BTU/h at a given efficiency (EER = BTU/h per watt). */
export const inputWatts = (btu: number, eer: number) => (eer > 0 ? btu / eer : NaN);

/** Running cost if the unit ran flat out: kWh and money per day and per 30 days. Real use is lower because the compressor cycles. */
export function runCost(btu: number, eer: number, hoursPerDay: number, pricePerKwh: number) {
  const kw = inputWatts(btu, eer) / 1000, kwhDay = kw * hoursPerDay;
  return { kw, kwhDay, costDay: kwhDay * pricePerKwh, costMonth: kwhDay * 30 * pricePerKwh };
}

/** Floor area from length and width in the same unit. */
export const areaFrom = (len: number, wid: number) => (len > 0 && wid > 0 ? len * wid : NaN);
