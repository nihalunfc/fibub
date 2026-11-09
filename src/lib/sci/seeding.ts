// Seeding rate and plant population: seeds to sow for a target stand (germination, purity and field emergence),
// seed weight from the thousand-seed weight, seeds per metre of row and the gap between seeds, and the reverse:
// plants per hectare from stand counts in a length of row or a frame. Exact unit conversions. No DOM.

export const M2_PER_HA = 10000;
export const HA_PER_AC = 0.40468564224;
export const M2_PER_AC = M2_PER_HA * HA_PER_AC; // 4046.86
export const KG_PER_LB = 0.45359237;
export const M_PER_FT = 0.3048;
export const CM_PER_IN = 2.54;

/** Seeds to sow per m² for a target of plants per m². Percentages 0 to 100. */
export function seedsFor(plantsM2: number, germ: number, purity: number, emergence: number) {
  const pls = (germ / 100) * (purity / 100);
  const survive = pls * (emergence / 100);
  return { seedsM2: plantsM2 / survive, pls, survive };
}

/** kg of seed per ha for a number of seeds per m² and a thousand-seed weight in grams. */
export const kgPerHa = (seedsM2: number, tswG: number) => (seedsM2 * M2_PER_HA * tswG) / 1e6;
/** Thousand-seed weight (g) from seeds per kg, or seeds per lb. */
export const tswFromPerKg = (perKg: number) => 1e6 / perKg;
export const tswFromPerLb = (perLb: number) => (1e6 * KG_PER_LB) / perLb;

/** Seeds per metre of row and the gap between them (cm) for seeds per m² and a row spacing in m. */
export function inRow(seedsM2: number, rowM: number) {
  const perM = seedsM2 * rowM;
  return { perM, gapCm: 100 / perM };
}

/** Length of row (ft) that makes 1/1000 acre at a row spacing in inches. */
export const rowFtPerThousandthAcre = (rowIn: number) => (43560 / 1000) / (rowIn / 12);

export type Stand = { perM2: number[]; mean: number; sd: number; cv: number; min: number; max: number; n: number };
/** Plants per m² from counts in a length of row (m) at a row spacing (m), or in a frame of `areaM2`. */
export function stand(counts: number[], areaM2: number): Stand {
  const perM2 = counts.map((c) => c / areaM2), n = perM2.length;
  const mean = perM2.reduce((s, v) => s + v, 0) / n;
  const sd = n > 1 ? Math.sqrt(perM2.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1)) : 0;
  return { perM2, mean, sd, cv: mean > 0 ? (100 * sd) / mean : 0, min: Math.min(...perM2), max: Math.max(...perM2), n };
}
