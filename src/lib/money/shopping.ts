// Shopping maths for the percentage, tip, fuel and unit-price tools. Plain TypeScript, no DOM.

export const pct = (x: number, y: number) => (x / 100) * y;
export const whatPercent = (x: number, y: number) => (x / y) * 100;
export const pctChange = (a: number, b: number) => ((b - a) / a) * 100;
/** Add (+) or take off (-) a percent. */
export const addPct = (amount: number, p: number) => amount * (1 + p / 100);
/** Amount already includes p%: the amount before it was added. */
export const removeIncluded = (amount: number, p: number) => amount / (1 + p / 100);
/** Several discounts one after another: the true total discount in percent. */
export const stackedDiscount = (ds: number[]) => (1 - ds.reduce((k, d) => k * (1 - d / 100), 1)) * 100;
/** x is p% of what? The whole is x / (p/100). */
export const wholeFromPart = (x: number, p: number) => x / (p / 100);
/** Percentage difference between two values, against their average (symmetric, no "old" value). */
export const pctDifference = (a: number, b: number) => (Math.abs(a - b) / ((Math.abs(a) + Math.abs(b)) / 2)) * 100;
/** Selling price for a wanted margin (percent of the price) or markup (percent of the cost). */
export const priceFromMargin = (cost: number, marginPct: number) => cost / (1 - marginPct / 100);
export const priceFromMarkup = (cost: number, markupPct: number) => cost * (1 + markupPct / 100);
export const markupMargin = (cost: number, price: number) => ({
  markup: ((price - cost) / cost) * 100,
  margin: ((price - cost) / price) * 100,
});

export type TipBasis = 'pre' | 'post';
export function tip(o: { bill: number; taxPct: number; tipPct: number; basis: TipBasis; included: boolean; people: number; roundUp: boolean }) {
  const tax = (o.bill * o.taxPct) / 100;
  const base = o.basis === 'pre' ? o.bill : o.bill + tax;
  const tipAmt = o.included ? 0 : (base * o.tipPct) / 100;
  const total = o.bill + tax + tipAmt;
  const n = Math.max(1, Math.floor(o.people) || 1);
  let each = total / n;
  if (o.roundUp) each = Math.ceil(Math.round(each * 100) / 100 - 1e-9);
  const paid = each * n;
  return { tax, tipAmt, total, each, paid, extra: paid - total, n };
}

export type TipIn = Parameters<typeof tip>[0];
/** The tip, total and each person's share at several tip percents, for a side-by-side table. */
export const tipTable = (o: TipIn, pcts: number[]) =>
  pcts.map((p) => { const r = tip({ ...o, tipPct: p, roundUp: false }); return { pct: p, tipAmt: r.tipAmt, total: r.total, each: r.each, tipEach: r.tipAmt / r.n }; });

export type Eco = 'l100' | 'kml' | 'mpgus' | 'mpguk';
const MI = 1.609344, L_US = 3.785411784, L_UK = 4.54609;
export const ecoToL100 = (v: number, u: Eco) => (u === 'l100' ? v : u === 'kml' ? 100 / v : u === 'mpgus' ? (100 * L_US) / (MI * v) : (100 * L_UK) / (MI * v));
export const l100ToEco = (l: number, u: Eco) => (u === 'l100' ? l : u === 'kml' ? 100 / l : u === 'mpgus' ? (100 * L_US) / (MI * l) : (100 * L_UK) / (MI * l));
export type PriceUnit = 'l' | 'usgal' | 'ukgal';
export const pricePerLitre = (p: number, u: PriceUnit) => (u === 'l' ? p : u === 'usgal' ? p / L_US : p / L_UK);
export function fuelTrip(o: { distance: number; mi: boolean; eco: number; ecoUnit: Eco; price: number; priceUnit: PriceUnit; round: boolean; people: number }) {
  const km = o.distance * (o.mi ? MI : 1) * (o.round ? 2 : 1);
  const litres = (km * ecoToL100(o.eco, o.ecoUnit)) / 100;
  const cost = litres * pricePerLitre(o.price, o.priceUnit);
  const n = Math.max(1, Math.floor(o.people) || 1);
  return { km, litres, cost, each: cost / n, n };
}

export type Kind = 'mass' | 'volume' | 'count' | 'sheets';
export const UNITS: Record<string, { kind: Kind; f: number }> = {
  g: { kind: 'mass', f: 1 }, kg: { kind: 'mass', f: 1000 }, oz: { kind: 'mass', f: 28.349523125 }, lb: { kind: 'mass', f: 453.59237 },
  ml: { kind: 'volume', f: 1 }, L: { kind: 'volume', f: 1000 }, 'fl oz': { kind: 'volume', f: 29.5735295625 },
  count: { kind: 'count', f: 1 }, sheets: { kind: 'sheets', f: 1 },
};
/** Price per 100 g, per litre, per item or per 100 sheets. */
export function unitPrice(price: number, qty: number, unit: string, packs = 1) {
  const u = UNITS[unit], total = qty * packs * u.f;
  if (!(price >= 0) || !(total > 0)) return null;
  const per = u.kind === 'mass' ? (price / total) * 100 : u.kind === 'volume' ? (price / total) * 1000 : u.kind === 'sheets' ? (price / total) * 100 : price / total;
  return { kind: u.kind, per };
}
export const perLabel: Record<Kind, string> = { mass: 'per 100 g', volume: 'per litre', count: 'per item', sheets: 'per 100 sheets' };

/** What to compare per, for each kind of unit. `amount` is in the base unit (g, ml, items, sheets). */
export const BASES: Record<Kind, { id: string; label: string; amount: number }[]> = {
  mass: [{ id: '100g', label: 'per 100 g', amount: 100 }, { id: 'kg', label: 'per kg', amount: 1000 }, { id: 'lb', label: 'per lb', amount: 453.59237 }, { id: 'oz', label: 'per oz', amount: 28.349523125 }],
  volume: [{ id: 'l', label: 'per litre', amount: 1000 }, { id: '100ml', label: 'per 100 ml', amount: 100 }, { id: 'floz', label: 'per fl oz', amount: 29.5735295625 }],
  count: [{ id: '1', label: 'per item', amount: 1 }, { id: '10', label: 'per 10 items', amount: 10 }, { id: '12', label: 'per dozen', amount: 12 }],
  sheets: [{ id: '100', label: 'per 100 sheets', amount: 100 }, { id: '1', label: 'per sheet', amount: 1 }, { id: '1000', label: 'per 1,000 sheets', amount: 1000 }],
};

/** Like unitPrice, but with a chosen "per" basis (an id from BASES) and an optional % off the shelf price.
 *  Returns null for a blank, negative or zero-size input; never NaN. */
export function unitPriceAt(price: number, qty: number, unit: string, packs = 1, basisId?: string, offPct = 0) {
  const u = UNITS[unit];
  if (!u) return null;
  const total = qty * (packs > 0 ? packs : 1) * u.f;
  if (!Number.isFinite(price) || !(price >= 0) || !Number.isFinite(total) || !(total > 0)) return null;
  const off = Number.isFinite(offPct) ? Math.min(100, Math.max(0, offPct)) : 0;
  const paid = price * (1 - off / 100);
  const list = BASES[u.kind];
  const b = list.find((x) => x.id === basisId) ?? list[0];
  return { kind: u.kind, per: (paid / total) * b.amount, label: b.label, paid, total };
}

/** How much dearer `per` is than the best (cheapest) one, in percent. 0 for the best. */
export const dearerThanBest = (per: number, best: number) => (best > 0 ? Math.max(0, (per / best - 1) * 100) : 0);

// ---- Fuel cost extras (added for the fuel-cost tool) ----
/** Fuel economy worked out from a fill-up: distance driven (km) and fuel added (litres). Returns L/100 km, or null. */
export const l100FromFill = (km: number, litres: number) => (km > 0 && litres > 0 ? (litres / km) * 100 : null);
/** Cost of a regular trip repeated: per week, per month (52/12 weeks) and per year. */
export function repeatCost(tripCost: number, tripsPerWeek: number) {
  const week = tripCost * Math.max(0, tripsPerWeek);
  return { week, month: (week * 52) / 12, year: week * 52 };
}
/** Cost per km and per mile from a trip's total cost and distance in km. */
export const costPerDistance = (cost: number, km: number) => (km > 0 ? { perKm: cost / km, perMile: (cost * MI) / km, per100km: (cost * 100) / km } : null);
export const litresToGallons = (l: number) => ({ us: l / L_US, uk: l / L_UK });
