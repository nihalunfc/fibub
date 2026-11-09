// Concrete mix proportions by the absolute volume method. Every factor (w/c ratio, water, air, coarse
// aggregate fraction, specific gravities, moisture) is entered by the user; nothing here is a code table.
// Aggregate masses are on an oven-dry basis; the mix water is the free (net) water. Field batch weights
// correct for the moisture the stockpiles hold: wet mass = dry × (1 + m), free water from the aggregate
// = dry × (m − a), where m is the total moisture and a the absorption (both as fractions of dry mass).

export type MixInput = {
  wc: number;        // water / cement ratio by mass
  water: number;     // free water, kg/m³
  air: number;       // entrapped + entrained air, % of volume
  caFrac: number;    // dry-rodded bulk volume of coarse aggregate per unit volume of concrete
  caRodded: number;  // dry-rodded bulk density of coarse aggregate, kg/m³
  sgC: number; sgCA: number; sgFA: number; // specific gravities (aggregates oven-dry bulk)
  caM: number; caA: number; faM: number; faA: number; // total moisture and absorption, % of dry mass
  rhoW?: number;     // density of water, kg/m³ (1000)
};

export type Mix = {
  cement: number; water: number; ca: number; fa: number; // design (dry aggregate) kg/m³
  vol: { water: number; cement: number; air: number; ca: number; fa: number }; // m³ per m³
  density: number;   // fresh concrete density from the design masses, kg/m³
  field: { cement: number; water: number; ca: number; fa: number }; // batch weights with stock moisture
  caFree: number; faFree: number; // free water carried by each aggregate, kg/m³ (negative = absorbs)
  ratio: [number, number, number]; // 1 : FA/C : CA/C by dry mass
};

export function mixDesign(p: MixInput): Mix {
  const rw = p.rhoW ?? 1000;
  const cement = p.water / p.wc;
  const ca = p.caFrac * p.caRodded;
  const vol = { water: p.water / rw, cement: cement / (p.sgC * rw), air: p.air / 100, ca: ca / (p.sgCA * rw), fa: 0 };
  vol.fa = 1 - vol.water - vol.cement - vol.air - vol.ca;
  const fa = vol.fa * p.sgFA * rw;
  const caFree = (ca * (p.caM - p.caA)) / 100, faFree = (fa * (p.faM - p.faA)) / 100;
  const field = { cement, water: p.water - caFree - faFree, ca: ca * (1 + p.caM / 100), fa: fa * (1 + p.faM / 100) };
  return { cement, water: p.water, ca, fa, vol, density: cement + p.water + ca + fa, field, caFree, faFree, ratio: [1, fa / cement, ca / cement] };
}

/** Standard normal cumulative distribution (Abramowitz and Stegun 7.1.26 erf, |error| < 1.5e-7). */
export function normCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}

/** Target mean strength f'cr = f'c + k·s, and the share of results expected below f'c if strengths are normal. */
export function targetStrength(fc: number, k: number, s: number): { fcr: number; below: number } {
  return { fcr: fc + k * s, below: normCdf(-k) };
}
