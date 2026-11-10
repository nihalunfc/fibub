// Household and driving costs: electricity, EV vs petrol, commute, lease vs buy, driver earnings, mileage. Plain TypeScript, no DOM.
import { payment } from './borrowing';

export const HOURS_PER_MONTH = 730;
export const MI_KM = 1.609344;
/** Petrol: 8.887 kg CO2 per US gallon (US EPA) = about 2.35 kg per litre. */
export const PETROL_KG_PER_L = 2.35;

// ---------- Electricity ----------
export interface Appliance { name: string; watts: number; hoursPerDay: number; daysPerMonth: number; standbyWatts: number }
export interface Tariff { mode: 'flat' | 'tou'; flat: number; on: number; mid: number; off: number; onShare: number; midShare: number; fixed: number }
export const PRESETS: [string, number, number, number][] = [
  // name, typical watts, hours a day, standby watts
  ['LED bulb', 9, 5, 0], ['Fridge', 150, 8, 0], ['Freezer', 100, 8, 0], ['Television', 100, 4, 1], ['Laptop', 50, 6, 1],
  ['Desktop computer', 200, 6, 2], ['Wi-Fi router', 10, 24, 0], ['Washing machine', 500, 1, 1], ['Clothes dryer', 3000, 1, 1],
  ['Dishwasher', 1200, 1, 1], ['Microwave', 1100, 0.3, 2], ['Electric kettle', 1800, 0.3, 0], ['Electric oven', 2400, 1, 1],
  ['Window air conditioner', 1000, 8, 1], ['Ceiling fan', 60, 8, 0], ['Space heater', 1500, 4, 0], ['Water heater (tank)', 4000, 3, 0],
  ['Phone charger', 5, 3, 0.1], ['Electric car charging (level 2)', 7200, 2, 0],
];
export const tariffRate = (t: Tariff) => {
  if (t.mode === 'flat') return t.flat;
  const o = Math.max(0, 100 - t.onShare - t.midShare);
  return (t.on * t.onShare + t.mid * t.midShare + t.off * o) / 100;
};
export function applianceKwh(a: Appliance) {
  const used = a.hoursPerDay * a.daysPerMonth; // hours in use a month
  const idle = Math.max(0, HOURS_PER_MONTH - used);
  return (a.watts * used + a.standbyWatts * idle) / 1000;
}
export function electricity(list: Appliance[], t: Tariff) {
  const rate = tariffRate(t);
  const rows = list.map((a) => { const kwh = applianceKwh(a); return { name: a.name, kwh, cost: kwh * rate }; });
  const kwh = rows.reduce((s, r) => s + r.kwh, 0);
  const month = kwh * rate + t.fixed;
  return { rows, rate, kwh, month, day: (month * 12) / 365, year: month * 12 };
}

// ---------- EV vs petrol ----------
export interface Veh { price: number; incentive: number; perYearEnergy: number; maintenance: number; insurance: number; resalePct: number }
export function tco(v: Veh, years: number) {
  const upfront = v.price - v.incentive;
  const annual = v.perYearEnergy + v.maintenance + v.insurance;
  const resale = (v.price * v.resalePct) / 100;
  return { upfront, annual, resale, total: upfront + annual * years - resale, perYear: (upfront + annual * years - resale) / years };
}
/** Years until `a` (dearer to buy) has cost no more than `b` in cash, ignoring resale; null if never. */
export function breakEven(a: Veh, b: Veh): number | null {
  const up = a.price - a.incentive - (b.price - b.incentive);
  const sa = b.perYearEnergy + b.maintenance + b.insurance - (a.perYearEnergy + a.maintenance + a.insurance);
  if (up <= 0) return 0;
  if (sa <= 0) return null;
  return up / sa;
}
export const petrolYear = (km: number, l100: number, pricePerL: number) => ((km * l100) / 100) * pricePerL;
export const evYear = (km: number, kwh100: number, homePct: number, home: number, pub: number) => ((km * kwh100) / 100) * ((homePct / 100) * home + (1 - homePct / 100) * pub);
export const co2Petrol = (km: number, l100: number) => ((km * l100) / 100) * PETROL_KG_PER_L;
export const co2Ev = (km: number, kwh100: number, gridKgPerKwh: number) => ((km * kwh100) / 100) * gridKgPerKwh;

// ---------- Commute ----------
export function commute(o: { daysPerWeek: number; weeksPerYear: number; hourly: number;
  car: { oneWayKm: number; l100: number; fuelPrice: number; parking: number; tolls: number; wearPerKm: number; minutes: number };
  transit: { monthly: number; extraPerDay: number; minutes: number };
  bike: { perDay: number; minutes: number } }) {
  const days = o.daysPerWeek * o.weeksPerYear;
  const carDay = o.car.oneWayKm * 2 * ((o.car.l100 / 100) * o.car.fuelPrice + o.car.wearPerKm) + o.car.parking + o.car.tolls;
  const transitYear = o.transit.monthly * 12 + o.transit.extraPerDay * days;
  const mk = (name: string, perYear: number, mins: number) => {
    const timeYear = ((mins * 2) / 60) * o.hourly * days;
    return { name, day: days ? perYear / days : 0, month: perYear / 12, year: perYear, timeYear, withTime: perYear + timeYear, hoursYear: ((mins * 2) / 60) * days };
  };
  return [mk('Car', carDay * days, o.car.minutes), mk('Transit', transitYear, o.transit.minutes), mk('Bike or walk', o.bike.perDay * days, o.bike.minutes)];
}

// ---------- Lease vs buy ----------
export function leaseVsBuy(o: { leasePay: number; leaseDown: number; term: number; leaseFees: number; kmLimit: number; kmYear: number; excess: number;
  price: number; down: number; ratePct: number; loanMonths: number; resale: number }) {
  const excessKm = Math.max(0, (o.kmYear - o.kmLimit) * (o.term / 12));
  const excessCost = excessKm * o.excess;
  const leaseTotal = o.leaseDown + o.leasePay * o.term + o.leaseFees + excessCost;
  const i = o.ratePct / 1200;
  const principal = Math.max(0, o.price - o.down);
  const pay = payment(principal, i, o.loanMonths);
  const k = Math.min(o.term, o.loanMonths);
  const balance = i === 0 ? principal - pay * k : principal * Math.pow(1 + i, k) - (pay * (Math.pow(1 + i, k) - 1)) / i;
  const paid = pay * k;
  const interest = paid + balance - principal;
  const buyNet = o.down + paid + Math.max(0, balance) - o.resale;
  return { excessKm, excessCost, leaseTotal, leaseMonthly: leaseTotal / o.term, pay, balance: Math.max(0, balance), interest, buyOut: o.down + paid, buyNet, buyMonthly: buyNet / o.term, diff: leaseTotal - buyNet };
}

// ---------- Driver earnings ----------
export function driver(o: { fares: number; tips: number; hours: number; km: number; feePct: number; l100: number; fuelPrice: number; maintPerKm: number; insurance: number; phone: number; setAside: number }) {
  const fee = (o.fares * o.feePct) / 100;
  const fuel = ((o.km * o.l100) / 100) * o.fuelPrice;
  const maint = o.km * o.maintPerKm;
  const costs = fee + fuel + maint + o.insurance + o.phone;
  const gross = o.fares + o.tips;
  const net = gross - costs;
  return { gross, fee, fuel, maint, costs, net, perHour: o.hours > 0 ? net / o.hours : 0, perKm: o.km > 0 ? net / o.km : 0, grossPerHour: o.hours > 0 ? gross / o.hours : 0, setAside: (Math.max(0, net) * o.setAside) / 100, keep: net - (Math.max(0, net) * o.setAside) / 100 };
}

// ---------- Mileage ----------
export type MRegion = 'ca' | 'us' | 'uk' | 'in';
export interface MRate { unit: 'km' | 'mi'; cur: string; first: number; after: number; limit: number }
/** Rates in money per unit. Confirmed on canada.ca, irs.gov and gov.uk on 2026-11-10; check the official source. */
export const RATES: Record<MRegion, MRate> = {
  ca: { unit: 'km', cur: '$', first: 0.73, after: 0.67, limit: 5000 },
  us: { unit: 'mi', cur: '$', first: 0.725, after: 0.725, limit: Infinity },
  uk: { unit: 'mi', cur: '£', first: 0.55, after: 0.25, limit: 10000 },
  in: { unit: 'km', cur: '', first: 0, after: 0, limit: Infinity },
};
export const allowance = (businessDist: number, r: { first: number; after: number; limit: number }) =>
  Math.min(businessDist, r.limit) * r.first + Math.max(0, businessDist - r.limit) * r.after;
export interface Trip { date: string; from: string; to: string; purpose: string; dist: number; business: boolean }
export function mileage(trips: Trip[], r: { first: number; after: number; limit: number }) {
  const business = trips.filter((t) => t.business).reduce((s, t) => s + t.dist, 0);
  const personal = trips.filter((t) => !t.business).reduce((s, t) => s + t.dist, 0);
  return { business, personal, total: business + personal, allowance: allowance(business, r), pctBusiness: business + personal ? (business / (business + personal)) * 100 : 0 };
}
const q = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
export const tripsCsv = (trips: Trip[], unit: string) =>
  ['Date,From,To,Purpose,Distance (' + unit + '),Type', ...trips.map((t) => [t.date, q(t.from), q(t.to), q(t.purpose), t.dist, t.business ? 'Business' : 'Personal'].join(','))].join('\n');
