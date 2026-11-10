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
