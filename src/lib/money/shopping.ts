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
