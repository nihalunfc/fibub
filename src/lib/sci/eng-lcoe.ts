// Levelised cost of energy: discounted lifetime costs divided by discounted lifetime energy, with a yearly
// cash-flow table and a one-at-a-time sensitivity (tornado). Plain TypeScript, no DOM.
// Example plants are made up for fibub and labelled as such; they are not agency or market figures.

export type LcoeInput = {
  mw: number; // capacity, MW
  capex: number; // overnight capital cost per kW
  fom: number; // fixed operation and maintenance per kW per year
  vom: number; // variable O&M per MWh
  fuelPrice: number; // fuel price per GJ of fuel
  heatRate: number; // GJ of fuel per MWh of electricity (0 for wind, solar, hydro)
  cf: number; // capacity factor, 0..1
  degr: number; // yearly output loss, fraction (0.005 = 0.5 %/yr)
  rate: number; // discount rate, fraction
  life: number; // years of operation
  esc: number; // yearly rise in O&M and fuel costs, fraction
};
export type Year = { t: number; mwh: number; capex: number; fom: number; vom: number; fuel: number; total: number; df: number; pvCost: number; pvMwh: number };
export type LcoeResult = { lcoe: number; years: Year[]; pvCost: number; pvMwh: number; parts: { capex: number; fom: number; vom: number; fuel: number }; crf: number; simple: number; totalMwh: number };

export const crf = (r: number, n: number) => (r === 0 ? 1 / n : (r * (1 + r) ** n) / ((1 + r) ** n - 1));

/** LCOE per MWh. The capital is spent at year 0; energy and running costs come at the end of years 1..life. */
export function lcoe(p: LcoeInput): LcoeResult {
  const n = Math.round(p.life), kw = p.mw * 1000, e0 = p.mw * 8760 * p.cf;
  const years: Year[] = [{ t: 0, mwh: 0, capex: p.capex * kw, fom: 0, vom: 0, fuel: 0, total: p.capex * kw, df: 1, pvCost: p.capex * kw, pvMwh: 0 }];
  const parts = { capex: p.capex * kw, fom: 0, vom: 0, fuel: 0 };
  let pvCost = p.capex * kw, pvMwh = 0, totalMwh = 0;
  for (let t = 1; t <= n; t++) {
    const mwh = e0 * (1 - p.degr) ** (t - 1), g = (1 + p.esc) ** (t - 1), df = 1 / (1 + p.rate) ** t;
    const fom = p.fom * kw * g, vom = p.vom * mwh * g, fuel = p.fuelPrice * p.heatRate * mwh * g, total = fom + vom + fuel;
    years.push({ t, mwh, capex: 0, fom, vom, fuel, total, df, pvCost: total * df, pvMwh: mwh * df });
    pvCost += total * df; pvMwh += mwh * df; totalMwh += mwh;
    parts.fom += fom * df; parts.vom += vom * df; parts.fuel += fuel * df;
  }
  const k = pvMwh > 0 ? 1 / pvMwh : NaN;
  const c = crf(p.rate, n);
  // Textbook shortcut with no degradation or escalation: annualised capital plus fixed O&M over a year's energy, plus running costs.
  const simple = e0 > 0 ? (p.capex * kw * c + p.fom * kw) / e0 + p.vom + p.fuelPrice * p.heatRate : NaN;
  return { lcoe: pvCost * k, years, pvCost, pvMwh, parts: { capex: parts.capex * k, fom: parts.fom * k, vom: parts.vom * k, fuel: parts.fuel * k }, crf: c, simple, totalMwh };
}

export const KEYS: { key: keyof LcoeInput; name: string }[] = [
  { key: 'capex', name: 'Capital cost' }, { key: 'fom', name: 'Fixed O&M' }, { key: 'vom', name: 'Variable O&M' },
  { key: 'fuelPrice', name: 'Fuel price' }, { key: 'heatRate', name: 'Heat rate' }, { key: 'cf', name: 'Capacity factor' },
  { key: 'rate', name: 'Discount rate' }, { key: 'life', name: 'Lifetime' }, { key: 'degr', name: 'Degradation' }, { key: 'esc', name: 'Cost escalation' },
];
export type Bar = { key: keyof LcoeInput; name: string; lowIn: number; highIn: number; low: number; high: number; swing: number };
/** One-at-a-time sensitivity: each input × (1 − f) and × (1 + f), others held. Inputs that are 0 are skipped. Sorted by swing. */
export function tornado(p: LcoeInput, f = 0.2): Bar[] {
  const out: Bar[] = [];
  for (const { key, name } of KEYS) {
    const v = p[key];
    if (!v) continue;
    let lo = v * (1 - f), hi = v * (1 + f);
    if (key === 'cf') hi = Math.min(1, hi);
    if (key === 'life') { lo = Math.max(1, Math.round(lo)); hi = Math.round(hi); }
    const a = lcoe({ ...p, [key]: lo }).lcoe, b = lcoe({ ...p, [key]: hi }).lcoe;
    out.push({ key, name, lowIn: lo, highIn: hi, low: a, high: b, swing: Math.abs(b - a) });
  }
  return out.sort((x, y) => y.swing - x.swing);
}

/** Made-up example plants (rounded, illustrative; not market, agency or study figures). Edit them. */
export const EXAMPLES: Record<string, { name: string; p: LcoeInput }> = {
  solar: { name: 'Solar farm (made-up example)', p: { mw: 50, capex: 1000, fom: 15, vom: 0, fuelPrice: 0, heatRate: 0, cf: 0.22, degr: 0.005, rate: 0.07, life: 30, esc: 0 } },
  wind: { name: 'Onshore wind farm (made-up example)', p: { mw: 100, capex: 1400, fom: 40, vom: 0, fuelPrice: 0, heatRate: 0, cf: 0.35, degr: 0.002, rate: 0.07, life: 25, esc: 0 } },
  gas: { name: 'Gas combined-cycle plant (made-up example)', p: { mw: 400, capex: 1000, fom: 20, vom: 3, fuelPrice: 6, heatRate: 7, cf: 0.55, degr: 0, rate: 0.07, life: 30, esc: 0.01 } },
};
