// Maths for real-mileage, car-depreciation, car-affordability and road-trip. Plain TypeScript, no DOM.
export const KM_PER_MI = 1.609344, L_PER_USGAL = 3.785411784, L_PER_UKGAL = 4.54609;

/* ---------- real mileage (full-tank method) ---------- */
export interface Fill { odo: number; amount: number; price: number; full: boolean }
export interface MileageResult {
  segments: { km: number; litres: number; cost: number; kmPerL: number }[];
  km: number; litres: number; cost: number;
  kmPerL: number; lPer100: number; mpgUS: number; mpgUK: number; costPerKm: number;
  skipped: number;
}
/** distFactor: km per odometer unit (1 or 1.609344). volFactor: litres (or kWh) per entered unit. Rows with no odometer are ignored. */
export function mileage(fills: Fill[], distFactor: number, volFactor: number): MileageResult {
  const segments: MileageResult['segments'] = [];
  let lastOdo: number | null = null, vol = 0, cost = 0, skipped = 0;
  for (const f of fills) {
    if (!(f.odo > 0)) continue;
    if (lastOdo === null) { if (f.full) lastOdo = f.odo; continue; } // fuel before the first full fill is not counted
    vol += (f.amount > 0 ? f.amount : 0) * volFactor;
    cost += (f.amount > 0 ? f.amount : 0) * (f.price > 0 ? f.price : 0);
    if (f.full) {
      const km = (f.odo - lastOdo) * distFactor;
      if (km > 0 && vol > 0) segments.push({ km, litres: vol, cost, kmPerL: km / vol }); else skipped++;
      lastOdo = f.odo; vol = 0; cost = 0;
    }
  }
  const km = segments.reduce((a, s) => a + s.km, 0), litres = segments.reduce((a, s) => a + s.litres, 0), c = segments.reduce((a, s) => a + s.cost, 0);
  const kmPerL = litres > 0 ? km / litres : 0;
  return { segments, km, litres, cost: c, kmPerL, lPer100: kmPerL > 0 ? 100 / kmPerL : 0,
    mpgUS: kmPerL * L_PER_USGAL / KM_PER_MI, mpgUK: kmPerL * L_PER_UKGAL / KM_PER_MI, costPerKm: km > 0 ? c / km : 0, skipped };
}

/* ---------- depreciation ---------- */
export const TYPICAL_CURVES: Record<string, number[]> = {
  car: [20, 14, 12, 11, 10, 9, 8, 8, 7, 7],
  bike: [15, 12, 10, 10, 9, 8, 8, 7, 7, 6],
  truck: [15, 12, 11, 10, 9, 8, 8, 7, 7, 6],
};
export interface DepInput { price: number; years: number; mode: 'declining' | 'curve'; ratePct: number; curve: number[]; kmPerYear: number; typicalKm: number; adjPer10k: number }
/** Value at the end of each year, index 0 = today. Driving more than the typical km adds adjPer10k percentage points of loss per 10,000 km a year. */
export function depreciation(i: DepInput): { values: number[]; ratesUsed: number[] } {
  const values = [i.price], ratesUsed: number[] = [];
  const adj = i.kmPerYear > 0 && i.typicalKm > 0 ? (i.adjPer10k * (i.kmPerYear - i.typicalKm)) / 10000 : 0;
  for (let y = 1; y <= i.years; y++) {
    const base = i.mode === 'declining' ? i.ratePct : (i.curve[Math.min(y, i.curve.length) - 1] ?? i.curve[i.curve.length - 1] ?? 0);
    const r = Math.min(95, Math.max(0, base + adj));
    ratesUsed.push(r);
    values.push(values[y - 1] * (1 - r / 100));
  }
  return { values, ratesUsed };
}

/* ---------- affordability (20/4/10 and variations) ---------- */
export const pv = (payment: number, ratePct: number, months: number) => {
  const r = ratePct / 1200;
  return r === 0 ? payment * months : (payment * (1 - Math.pow(1 + r, -months))) / r;
};
export interface AffordInput { grossMonthly: number; totalPct: number; running: number; ratePct: number; months: number; downPct: number }
export function afford(i: AffordInput) {
  const budget = (i.grossMonthly * i.totalPct) / 100;
  const payment = Math.max(0, budget - i.running);
  const loan = pv(payment, i.ratePct, i.months);
  const down = Math.min(99, Math.max(0, i.downPct));
  const price = loan / (1 - down / 100);
  return { budget, payment, loan, price, downAmount: price - loan, totalPaid: payment * i.months, interest: payment * i.months - loan };
}

/* ---------- road trip ---------- */
export interface Leg { dist: number; speed: number }
export interface TripInput { legs: Leg[]; distUnit: 'km' | 'mi'; breakEveryH: number; breakMin: number; litresPer100km: number; tankL: number; reservePct: number; stopMin: number; pricePerL: number; tolls: number }
export function trip(i: TripInput) {
  const ok = i.legs.filter((l) => l.dist > 0 && l.speed > 0);
  const driveH = ok.reduce((a, l) => a + l.dist / l.speed, 0);
  const dist = ok.reduce((a, l) => a + l.dist, 0);
  const km = dist * (i.distUnit === 'mi' ? KM_PER_MI : 1);
  const breaks = i.breakEveryH > 0 ? Math.max(0, Math.ceil(driveH / i.breakEveryH - 1e-9) - 1) : 0;
  const breakH = (breaks * i.breakMin) / 60;
  const fuelL = (km * i.litresPer100km) / 100;
  const usable = i.tankL * (1 - i.reservePct / 100);
  const fuelStops = usable > 0 && fuelL > usable ? Math.ceil(fuelL / usable - 1e-9) - 1 : 0;
  const stopH = (fuelStops * i.stopMin) / 60;
  const totalH = driveH + breakH + stopH;
  return { dist, km, driveH, breaks, breakH, fuelL, fuelStops, stopH, totalH, fuelCost: fuelL * i.pricePerL, totalCost: fuelL * i.pricePerL + i.tolls };
}
export const hm = (h: number) => { const m = Math.round(h * 60); return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} m`; };
export const TYPICAL_TANKS_L: Record<string, number> = { car: 45, bike: 12, truck: 300 };

/* ---------- added 2026-11-16: more options for the vehicle tools ---------- */
export type EconUnit = 'l100' | 'kml' | 'mpgus' | 'mpguk';
/** Any fuel-economy figure to litres per 100 km. 0 for a blank, zero or negative figure. */
export function toL100(v: number, unit: EconUnit): number {
  if (!(v > 0) || !isFinite(v)) return 0;
  if (unit === 'l100') return v;
  if (unit === 'kml') return 100 / v;
  const gal = unit === 'mpgus' ? L_PER_USGAL : L_PER_UKGAL;
  return (100 * gal) / (KM_PER_MI * v);
}
/** The same economy in every common unit. */
export function economyAll(l100: number) {
  if (!(l100 > 0)) return { l100: 0, kmPerL: 0, mpgUS: 0, mpgUK: 0 };
  return { l100, kmPerL: 100 / l100, mpgUS: (100 * L_PER_USGAL) / (KM_PER_MI * l100), mpgUK: (100 * L_PER_UKGAL) / (KM_PER_MI * l100) };
}
/** Litres in one unit of the economy's fuel measure (a litre, a US gallon or a UK gallon). */
export const litresPerUnit = (unit: EconUnit) => (unit === 'mpgus' ? L_PER_USGAL : unit === 'mpguk' ? L_PER_UKGAL : 1);

// car-affordability
/** A loan for a car: price is what you pay in total (tax included), downPct is a share of it. */
export function carPayment(price: number, downPct: number, ratePct: number, months: number) {
  const p = price > 0 ? price : 0, d = Math.min(100, Math.max(0, downPct));
  const loan = p * (1 - d / 100);
  const payment = months > 0 ? (ratePct > 0 ? loan * (ratePct / 1200) / (1 - Math.pow(1 + ratePct / 1200, -months)) : loan / months) : 0;
  return { loan, down: p - loan, payment, interest: payment * months - loan, totalPaid: payment * months + (p - loan) };
}
/** Same budget, different loan lengths: biggest total price, payment and interest for each. */
export function affordByTerm(i: AffordInput, terms: number[], taxPct = 0) {
  return terms.map((months) => {
    const r = afford({ ...i, months });
    const sticker = r.price / (1 + Math.max(0, taxPct) / 100);
    return { months, price: r.price, sticker, payment: r.payment, interest: r.interest };
  });
}

// car-depreciation
/** The yearly percent a car has lost so far: paid X, worth Y after `years`. Null if it cannot be worked out. */
export function impliedRate(paid: number, now: number, years: number): number | null {
  if (!(paid > 0) || !(now >= 0) || !(years > 0)) return null;
  return (1 - Math.pow(now / paid, 1 / years)) * 100;
}

// real-mileage
export function mileageStats(segments: { kmPerL: number }[]) {
  if (!segments.length) return null;
  const v = segments.map((s) => s.kmPerL);
  const best = Math.max(...v), worst = Math.min(...v);
  const last3 = v.slice(-3), recent = last3.reduce((a, b) => a + b, 0) / last3.length;
  return { best, worst, recent, bestIdx: v.indexOf(best) + 1, worstIdx: v.indexOf(worst) + 1 };
}
/** Real use against the maker's claim, both in litres (or kWh) per 100 km. Positive = real use is higher (worse). */
export const vsClaimed = (realPer100: number, claimedPer100: number) => (realPer100 > 0 && claimedPer100 > 0 ? ((realPer100 - claimedPer100) / claimedPer100) * 100 : null);
export const tripFuel = (distKm: number, kmPerL: number, pricePerL: number) => {
  const l = distKm > 0 && kmPerL > 0 ? distKm / kmPerL : 0;
  return { litres: l, cost: l * (pricePerL > 0 ? pricePerL : 0) };
};

// road-trip
export function doubleTrip<T extends ReturnType<typeof trip>>(t: T): T {
  const o = { ...t } as Record<string, number>;
  for (const k of ['dist', 'km', 'driveH', 'breaks', 'breakH', 'fuelL', 'fuelStops', 'stopH', 'totalH', 'fuelCost', 'totalCost']) o[k] = (t as unknown as Record<string, number>)[k] * 2;
  return o as unknown as T;
}
export const splitCost = (total: number, people: number) => (people >= 1 ? total / Math.floor(people) : total);

// commute-cost
/** Car share when people ride together: the money cost is divided; the time value stays. */
export function sharedCar<T extends { year: number; month: number; day: number; timeYear: number; withTime: number }>(row: T, people: number): T {
  const n = people >= 1 ? Math.floor(people) : 1;
  if (n === 1) return row;
  return { ...row, year: row.year / n, month: row.month / n, day: row.day / n, withTime: row.year / n + row.timeYear };
}
/** Commuting days a month at which a monthly pass costs the same as driving (null if driving is never dearer per day). */
export function passBreakEvenDays(carPerDay: number, passMonthly: number, extraPerDay: number): number | null {
  const gap = carPerDay - extraPerDay;
  return gap > 0 && passMonthly >= 0 ? passMonthly / gap : null;
}

// ev-vs-petrol
/** Yearly km above which vehicle A (dearer to buy, cheaper per km) costs less in total than B. 0 = A is ahead at any distance, null = never. */
export function breakEvenKmPerYear(fixedA: number, perKmA: number, fixedB: number, perKmB: number, years: number): number | null {
  if (!(years > 0)) return null;
  if (fixedA <= fixedB && perKmA <= perKmB) return 0;
  if (perKmA >= perKmB) return fixedA <= fixedB ? 0 : null;
  const km = (fixedA - fixedB) / (years * (perKmB - perKmA));
  return km < 0 ? 0 : km;
}
export const costPer100 = (energyPerYear: number, kmPerYear: number) => (kmPerYear > 0 ? (energyPerYear / kmPerYear) * 100 : 0);
/** Electric use to kWh per 100 km from kWh/100 km, km/kWh or miles/kWh. */
export function toKwh100(v: number, unit: 'kwh100' | 'kmkwh' | 'mikwh'): number {
  if (!(v > 0)) return 0;
  return unit === 'kwh100' ? v : unit === 'kmkwh' ? 100 / v : 100 / (v * KM_PER_MI);
}

// lease-vs-buy
/** Car value at the end at which buying and leasing cost the same. */
export const tieValue = (buyNet: number, resale: number, leaseTotal: number) => resale + (buyNet - leaseTotal);

// on-road-price
export function emi(loan: number, ratePct: number, months: number) {
  if (!(loan > 0) || !(months >= 1)) return { payment: 0, interest: 0, total: 0 };
  const r = ratePct / 1200;
  const payment = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -months)) : loan / months;
  return { payment, interest: payment * months - loan, total: payment * months };
}
