// Soil test arithmetic: lime to raise pH (from base saturation and CEC, from a buffer capacity, or from the user's
// own lime factor), scaled to the depth and bulk density of the layer and to the lime's effective neutralising
// value; and nutrient results placed against ranges the user types. No reference tables are bundled. No DOM.

/** Grams of CaCO3 per mole of charge (half its molar mass: Ca 40.078, C 12.011, O 15.999). */
export const CACO3_PER_MOLC = (40.078 + 12.011 + 3 * 15.999) / 2; // 50.04
/** 1 t/ha in short tons (2,000 lb) per acre. */
export const TON_AC_PER_T_HA = (1000 / 0.45359237 / 2000) * 0.40468564224; // 0.44609

/** Mass of soil in a layer, t/ha: depth (cm) × 100 m³ per cm per ha × bulk density (g/cm³ = t/m³). */
export const soilMass = (depthCm: number, bulkDensity: number) => depthCm * 100 * bulkDensity;

/** kg of pure CaCO3 per ha to neutralise `cmol` cmol(+)/kg of acidity in a layer of `mass` t/ha. */
export const caco3ForCharge = (cmol: number, mass: number) => (cmol / 100) * CACO3_PER_MOLC * mass;

export type LimeIn =
  | { method: 'bs'; cec: number; bsNow: number; bsTarget: number; depthCm: number; bulkDensity: number }
  | { method: 'buffer'; ph: number; target: number; bufferCap: number; depthCm: number; bulkDensity: number }
  | { method: 'factor'; ph: number; target: number; factor: number; refDepthCm: number; depthCm: number };
export type LimeOut = { charge: number | null; mass: number | null; caco3: number; note: string };

/** Pure CaCO3 needed, kg/ha (0 if the soil is already at or past the target). */
export function limeNeed(i: LimeIn): LimeOut {
  if (i.method === 'bs') {
    const charge = Math.max(0, (i.cec * (i.bsTarget - i.bsNow)) / 100), mass = soilMass(i.depthCm, i.bulkDensity);
    return { charge, mass, caco3: caco3ForCharge(charge, mass), note: 'CEC × (target − present base saturation)' };
  }
  if (i.method === 'buffer') {
    const charge = Math.max(0, i.bufferCap * (i.target - i.ph)), mass = soilMass(i.depthCm, i.bulkDensity);
    return { charge, mass, caco3: caco3ForCharge(charge, mass), note: 'buffer capacity × pH rise' };
  }
  const rise = Math.max(0, i.target - i.ph);
  return { charge: null, mass: null, caco3: i.factor * 1000 * rise * (i.depthCm / i.refDepthCm), note: 'your lime factor × pH rise × depth ratio' };
}

/** Effective calcium carbonate equivalent, %: neutralising value (CCE, %) × fineness efficiency (%) / 100. */
export const ecce = (cce: number, fineness: number) => (cce * fineness) / 100;
/** kg of the lime product (as sold, with moisture) for a need of pure CaCO3. */
export const productFor = (caco3: number, ecceP: number, moisture = 0) => caco3 / (ecceP / 100) / (1 - moisture / 100);

export type Range = { name: string; value: number; low: number; high: number; unit: string };
export type Rating = Range & { cls: 'low' | 'ok' | 'high'; pct: number; text: string };

/** Read "name, value, low, high, unit" rows (tab, semicolon or comma separated; decimal commas only with tabs or semicolons). */
export function parseRanges(text: string): { rows: Range[]; bad: string[] } {
  const rows: Range[] = [], bad: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const c = line.split(/[\t;]/.test(line) ? /[\t;]/ : /,/).map((s) => s.trim());
    const n = (s: string | undefined) => (s == null || s === '' ? NaN : Number(s.replace(/\s/g, '').replace(',', '.')));
    const r = { name: c[0], value: n(c[1]), low: n(c[2]), high: n(c[3]), unit: c[4] ?? '' };
    if (!r.name || !Number.isFinite(r.value) || !Number.isFinite(r.low) || !Number.isFinite(r.high) || r.low > r.high) { if (!/^(nutrient|name|test)\b/i.test(line)) bad.push(line); continue; }
    rows.push(r);
  }
  return { rows, bad };
}

/** Rate one result: below the range is low, above it high; pct is the value as a percent of the nearest limit. */
export function rate(r: Range): Rating {
  if (r.value < r.low) return { ...r, cls: 'low', pct: (100 * r.value) / r.low, text: `Low, ${Math.round((100 * r.value) / r.low)} % of the bottom` };
  if (r.value > r.high) return { ...r, cls: 'high', pct: (100 * r.value) / r.high, text: `High, ${Math.round((100 * r.value) / r.high)} % of the top` };
  const span = r.high - r.low;
  return { ...r, cls: 'ok', pct: span > 0 ? (100 * (r.value - r.low)) / span : 50, text: 'In range' };
}

/** Made-up, rounded example: a soil test and ranges invented for this tool, not any lab's or agency's. */
export const EXAMPLE_RANGES = [
  'Phosphorus (P), 12, 20, 40, mg/kg',
  'Potassium (K), 150, 120, 250, mg/kg',
  'Magnesium (Mg), 60, 80, 300, mg/kg',
  'Sulphur (S), 9, 8, 20, mg/kg',
  'Zinc (Zn), 1.4, 1, 3, mg/kg',
  'Organic matter, 2.6, 3, 6, %',
].join('\n');
