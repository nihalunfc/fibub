// Kidney nephron filter (#1305): a teaching model of a day's filtration and reabsorption in both kidneys. Round
// textbook-style values (about 125 mL a minute filtered, 180 L a day), and a simple glucose model with a single
// threshold. Not medical. No DOM.

export const GFR_ML_MIN = 125;                    // filtered by both kidneys, mL a minute
export const FILTRATE_L_DAY = (GFR_ML_MIN * 1440) / 1000; // 180 L a day
export const GLUCOSE_THRESHOLD = 180;             // mg/dL in this model: above it glucose spills into urine
export const UREA_PLASMA_G_L = 0.3;               // g/L, a round teaching value
export const UREA_BACK = 0.5;                     // share of filtered urea that goes back into the blood
export const SODIUM_PLASMA = 140;                 // mmol/L
export const SODIUM_BACK = 0.994;                 // share reabsorbed
export const OTHER_WATER_LOSS = 0.5;              // L a day, net loss by sweat, breath and faeces after water in food

/** Urine volume a day (L) from water drunk a day (L), never below 0.5 L. */
export const urineL = (drinkL: number) => Math.max(0.5, drinkL - OTHER_WATER_LOSS);

/** Glucose filtered and lost in urine, in grams a day, for blood glucose in mg/dL. */
export function glucose(mgdl: number) {
  const perMin = (GFR_ML_MIN / 100) * mgdl;            // mg a minute filtered (1 dL = 100 mL)
  const maxBack = (GFR_ML_MIN / 100) * GLUCOSE_THRESHOLD; // most the tubules can take back, mg a minute
  const lost = Math.max(0, perMin - maxBack);
  return { filtered: (perMin * 1440) / 1000, urine: (lost * 1440) / 1000, back: (Math.min(perMin, maxBack) * 1440) / 1000 };
}

export type Row = { id: string; name: string; unit: string; filtered: number; urine: number };

/** The day's balance for each substance. */
export function day(drinkL: number, mgdl: number): Row[] {
  const u = urineL(drinkL), g = glucose(mgdl), urea = FILTRATE_L_DAY * UREA_PLASMA_G_L, na = FILTRATE_L_DAY * SODIUM_PLASMA;
  return [
    { id: 'water', name: 'Water', unit: 'L', filtered: FILTRATE_L_DAY, urine: u },
    { id: 'glucose', name: 'Glucose', unit: 'g', filtered: g.filtered, urine: g.urine },
    { id: 'urea', name: 'Urea', unit: 'g', filtered: urea, urine: urea * (1 - UREA_BACK) },
    { id: 'salt', name: 'Sodium (salt)', unit: 'mmol', filtered: na, urine: na * (1 - SODIUM_BACK) },
    { id: 'protein', name: 'Proteins and blood cells', unit: '', filtered: 0, urine: 0 },
  ];
}

/** Share (0 to 1) of the filtered amount that goes back into the blood. */
export const backShare = (r: Row) => (r.filtered > 0 ? 1 - r.urine / r.filtered : 0);

/** Where along the tubule water is taken back (shares of the filtrate), for a given urine volume. */
export function waterSteps(urine: number) {
  const pct = 0.65 * FILTRATE_L_DAY, loop = 0.15 * FILTRATE_L_DAY;
  const rest = FILTRATE_L_DAY - pct - loop - urine;     // DCT and collecting duct, controlled by ADH
  return { pct, loop, late: rest };
}
