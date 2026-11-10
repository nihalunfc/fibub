// Pure maths for the on-road price, e-way bill and trip sheet tools (#T890, #T892, #T893). No DOM.

export type Vehicle = 'car' | 'bike';

// Lifetime road tax, % of ex-showroom, for a petrol vehicle in a typical price band. ESTIMATES:
// states use price slabs, fuel types and cess, so the tool lets the user type their own rate.
export const IN_STATES: { id: string; name: string; car: number; bike: number }[] = [
  { id: 'dl', name: 'Delhi', car: 7, bike: 6 },
  { id: 'mh', name: 'Maharashtra', car: 11, bike: 11 },
  { id: 'ka', name: 'Karnataka', car: 14, bike: 18 },
  { id: 'tn', name: 'Tamil Nadu', car: 12, bike: 10 },
  { id: 'up', name: 'Uttar Pradesh', car: 8, bike: 6 },
  { id: 'gj', name: 'Gujarat', car: 6, bike: 6 },
  { id: 'kl', name: 'Kerala', car: 11, bike: 10 },
  { id: 'tg', name: 'Telangana', car: 13, bike: 12 },
  { id: 'wb', name: 'West Bengal', car: 7, bike: 5 },
  { id: 'rj', name: 'Rajasthan', car: 8, bike: 6 },
  { id: 'xx', name: 'Other state (type the rate)', car: 10, bike: 8 },
];

// Canada: GST/HST from the CRA rate table (from 1 April 2025); PST/QST are the general provincial rates (estimate for vehicles).
export const CA_PROV: { id: string; name: string; gst: number; pst: number; note?: string }[] = [
  { id: 'on', name: 'Ontario', gst: 13, pst: 0 },
  { id: 'bc', name: 'British Columbia', gst: 5, pst: 7, note: 'BC charges a higher PST on passenger vehicles over $55,000, and PST on private sales.' },
  { id: 'ab', name: 'Alberta', gst: 5, pst: 0 },
  { id: 'qc', name: 'Quebec', gst: 5, pst: 9.975 },
  { id: 'mb', name: 'Manitoba', gst: 5, pst: 7 },
  { id: 'sk', name: 'Saskatchewan', gst: 5, pst: 6 },
  { id: 'ns', name: 'Nova Scotia', gst: 14, pst: 0 },
  { id: 'nb', name: 'New Brunswick', gst: 15, pst: 0 },
  { id: 'nl', name: 'Newfoundland and Labrador', gst: 15, pst: 0 },
  { id: 'pe', name: 'Prince Edward Island', gst: 15, pst: 0 },
  { id: 'nt', name: 'Northwest Territories, Nunavut or Yukon', gst: 5, pst: 0 },
];

export const TCS_LIMIT = 1_000_000, TCS_PCT = 1;
export type Line = { label: string; amount: number; note?: string };
export type Price = { lines: Line[]; total: number; loan: number };

const r2 = (v: number) => Math.round(v * 100) / 100;
const pos = (v: number) => (Number.isFinite(v) && v > 0 ? v : 0);
const finish = (lines: Line[], down: number): Price => {
  const kept = lines.filter((l) => l.amount !== 0);
  const total = r2(kept.reduce((s, l) => s + l.amount, 0));
  return { lines: kept, total, loan: r2(Math.max(0, total - pos(down))) };
};

export function onRoadIndia(o: { exShowroom: number; roadTaxPct: number; registration: number; fastag: number; insurance: number; accessories: number; warranty: number; other: number; down: number; tcs: boolean }): Price {
  const ex = pos(o.exShowroom);
  return finish([
    { label: 'Ex-showroom price', amount: ex },
    { label: `Road tax (${o.roadTaxPct}%)`, amount: r2(ex * pos(o.roadTaxPct) / 100) },
    { label: 'TCS (1%, claim it back in your income tax return)', amount: o.tcs && ex > TCS_LIMIT ? r2(ex * TCS_PCT / 100) : 0 },
    { label: 'Registration and smart card', amount: pos(o.registration) },
    { label: 'FASTag', amount: pos(o.fastag) },
    { label: 'Insurance, first year', amount: pos(o.insurance) },
    { label: 'Accessories', amount: pos(o.accessories) },
    { label: 'Extended warranty', amount: pos(o.warranty) },
    { label: 'Other charges', amount: pos(o.other) },
  ], o.down);
}

export function onRoadCanada(o: { price: number; freight: number; fees: number; gstPct: number; pstPct: number; plates: number; down: number }): Price {
  const taxed = pos(o.price) + pos(o.freight) + pos(o.fees);
  return finish([
    { label: 'Vehicle price', amount: pos(o.price) },
    { label: 'Freight and PDI', amount: pos(o.freight) },
    { label: 'Levies and dealer fees', amount: pos(o.fees) },
    { label: `GST/HST (${o.gstPct}%)`, amount: r2(taxed * pos(o.gstPct) / 100) },
    { label: `PST/QST (${o.pstPct}%)`, amount: r2(taxed * pos(o.pstPct) / 100) },
    { label: 'Licence plate and registration', amount: pos(o.plates) },
  ], o.down);
}

export function onRoadUS(o: { price: number; docFee: number; taxPct: number; taxDoc: boolean; title: number; trade: number; taxNet: boolean; down: number }): Price {
  const base = Math.max(0, pos(o.price) - (o.taxNet ? pos(o.trade) : 0)) + (o.taxDoc ? pos(o.docFee) : 0);
  return finish([
    { label: 'Vehicle price', amount: pos(o.price) },
    { label: 'Trade-in', amount: -pos(o.trade) },
    { label: 'Doc fee', amount: pos(o.docFee) },
    { label: `Sales tax (${o.taxPct}%)`, amount: r2(base * pos(o.taxPct) / 100) },
    { label: 'Title and registration', amount: pos(o.title) },
  ], o.down);
}

// E-way bill validity, Rule 138(10) CGST Rules: 1 day per 200 km (or part); over-dimensional cargo 1 day per 20 km (or part).
// A day ends at midnight of the day after the date the vehicle details (Part B) were first entered.
export const EWB_KM = { normal: 200, odc: 20 } as const;
export const EWB_LIMIT = 50_000;
export const ewayDays = (km: number, odc: boolean) => (km > 0 ? Math.ceil(km / (odc ? EWB_KM.odc : EWB_KM.normal)) : 0);
/** Expiry as [year, month (1-12), day] of the last valid day; the bill is valid until 23:59:59 that day. */
export function ewayExpiry(y: number, m: number, d: number, days: number): [number, number, number] {
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()];
}

// Trip sheet
export type Trip = { odoStart: number; odoEnd: number; freight: number; advance: number; fills: { litres: number; price: number }[]; tolls: number; bataPerDay: number; days: number; loading: number; other: number; driverPays: { diesel: boolean; tolls: boolean; loading: boolean; other: boolean } };
export function tripTotals(t: Trip) {
  const km = Math.max(0, t.odoEnd - t.odoStart);
  const litres = t.fills.reduce((s, f) => s + pos(f.litres), 0);
  const diesel = r2(t.fills.reduce((s, f) => s + pos(f.litres) * pos(f.price), 0));
  const bata = r2(pos(t.bataPerDay) * pos(t.days));
  const cost = r2(diesel + pos(t.tolls) + bata + pos(t.loading) + pos(t.other));
  const paidByDriver = (t.driverPays.diesel ? diesel : 0) + (t.driverPays.tolls ? pos(t.tolls) : 0) + (t.driverPays.loading ? pos(t.loading) : 0) + (t.driverPays.other ? pos(t.other) : 0);
  return { km, litres, kmpl: litres > 0 && km > 0 ? km / litres : 0, diesel, bata, cost, profit: r2(pos(t.freight) - cost), driverBalance: r2(bata + paidByDriver - pos(t.advance)) };
}
