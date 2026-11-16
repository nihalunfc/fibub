// Vehicle physics for stopping-distance, tyre-pressure, ev-range, engine-cc, sprocket-ratio. Plain maths, no DOM.
export const G = 9.80665;
export const ATM_KPA = 101.325;
export const KPA_PER_PSI = 6.894757;
export const KPA_PER_BAR = 100;

export const ROADS: Record<string, number> = { dry: 0.7, wet: 0.4, snow: 0.2, ice: 0.1 };

/** speed in km/h; slopePct positive = uphill (shorter), negative = downhill. */
export function stopping(o: { kmh: number; reaction: number; mu: number; slopePct: number; extraLag?: number }) {
  const v = o.kmh / 3.6, t = o.reaction + (o.extraLag || 0);
  const reactionDist = v * t;
  const eff = o.mu + o.slopePct / 100;
  const brakingDist = eff > 0 ? (v * v) / (2 * eff * G) : Infinity;
  return { reactionDist, brakingDist, total: reactionDist + brakingDist, mps: v };
}

export type PUnit = 'psi' | 'bar' | 'kpa';
export const toKpa = (v: number, u: PUnit) => (u === 'psi' ? v * KPA_PER_PSI : u === 'bar' ? v * KPA_PER_BAR : v);
export const fromKpa = (k: number, u: PUnit) => (u === 'psi' ? k / KPA_PER_PSI : u === 'bar' ? k / KPA_PER_BAR : k);

/** Gauge pressure (kPa) at a new temperature, gas at constant volume: absolute pressure is proportional to kelvin. */
export function gaugeAtTemp(gaugeKpa: number, fromC: number, toC: number) {
  return ((gaugeKpa + ATM_KPA) * (toC + 273.15)) / (fromC + 273.15) - ATM_KPA;
}

export const EV_FACTORS = {
  // typical, editable multipliers on consumption
  speed: (kmh: number) => (kmh <= 50 ? 0.85 : kmh <= 80 ? 1 : kmh <= 100 ? 1.2 : kmh <= 120 ? 1.4 : 1.6),
  temp: (c: number) => (c < -10 ? 1.4 : c < 0 ? 1.3 : c < 10 ? 1.15 : c < 15 ? 1.05 : c <= 25 ? 1 : c <= 32 ? 1.05 : 1.15),
  heater: 1.1,
  load: 1.05,
};

export function evRange(o: { kwh: number; per100: number; factors: number[]; chargerKw?: number; fromPct?: number; toPct?: number }) {
  const mult = o.factors.reduce((a, b) => a * b, 1);
  const per100 = o.per100 * mult;
  const km = per100 > 0 ? (o.kwh / per100) * 100 : 0;
  const energy = o.kwh * Math.max(0, ((o.toPct ?? 100) - (o.fromPct ?? 0)) / 100);
  const hours = o.chargerKw && o.chargerKw > 0 ? energy / o.chargerKw : 0;
  return { per100, km, mult, energy, hours };
}

export const MM3_PER_CC = 1000, CC_PER_CUIN = 16.387064;
export function engine(o: { boreMm: number; strokeMm: number; cyl: number; chamberCc?: number }) {
  const sweptEach = (Math.PI / 4) * o.boreMm * o.boreMm * o.strokeMm / MM3_PER_CC;
  const cc = sweptEach * o.cyl;
  const cr = o.chamberCc && o.chamberCc > 0 ? (sweptEach + o.chamberCc) / o.chamberCc : null;
  return { sweptEach, cc, litres: cc / 1000, cuin: cc / CC_PER_CUIN, cr, ratio: o.boreMm / o.strokeMm };
}

/** Road speed (km/h) at engine rpm: gearRatio is gearbox, primary, front/rear teeth; circumference in mm. */
export function sprocketSpeed(o: { front: number; rear: number; primary: number; gear: number; circMm: number; rpm: number }) {
  const total = o.primary * o.gear * (o.rear / o.front);
  const wheelRpm = o.rpm / total;
  return { total, kmh: (wheelRpm * o.circMm * 60) / 1e6 };
}
export const circFromTyre = (widthMm: number, aspectPct: number, rimIn: number) => Math.PI * (rimIn * 25.4 + 2 * widthMm * aspectPct / 100);

// ---- Extras ----
export const KM_PER_MI = 1.609344;
export const mphToKmh = (m: number) => m * KM_PER_MI;
export const kmhToMph = (k: number) => k / KM_PER_MI;
export const cToF = (c: number) => (c * 9) / 5 + 32;
export const fToC = (f: number) => ((f - 32) * 5) / 9;

/** Stopping distance for a list of speeds (km/h), same conditions. */
export function stoppingTable(speeds: number[], o: { reaction: number; mu: number; slopePct: number; extraLag?: number }) {
  return speeds.map((kmh) => ({ kmh, ...stopping({ kmh, ...o }) }));
}
/** Speed (km/h) at which you hit an obstacle first seen `distM` metres ahead; 0 if you stop in time. */
export function impactSpeed(o: { kmh: number; reaction: number; mu: number; slopePct: number; extraLag?: number; distM: number }) {
  const v = o.kmh / 3.6, t = o.reaction + (o.extraLag || 0);
  const left = o.distM - v * t;
  if (left <= 0) return { kmh: o.kmh, stopped: false, reactionOnly: true };
  const a = (o.mu + o.slopePct / 100) * G;
  if (a <= 0) return { kmh: o.kmh, stopped: false, reactionOnly: false };
  const v2 = v * v - 2 * a * left;
  return v2 <= 0 ? { kmh: 0, stopped: true, reactionOnly: false } : { kmh: Math.sqrt(v2) * 3.6, stopped: false, reactionOnly: false };
}

/** Gauge pressure (kPa) at several temperatures, for a table. */
export const pressureAtTemps = (gaugeKpa: number, fromC: number, temps: number[]) => temps.map((t) => ({ t, kpa: gaugeAtTemp(gaugeKpa, fromC, t) }));

export type ConsUnit = 'kwh100' | 'whkm' | 'whmi' | 'mikwh' | 'kmkwh';
/** Any EV consumption figure to kWh per 100 km. */
export function consToKwh100(v: number, u: ConsUnit) {
  if (!(v > 0)) return NaN;
  return u === 'kwh100' ? v : u === 'whkm' ? v / 10 : u === 'whmi' ? (v / KM_PER_MI) / 10 : u === 'mikwh' ? 100 / (v * KM_PER_MI) : 100 / v;
}
/** Speed table: range at several speeds with the other factors held. */
export function evSpeedTable(o: { kwh: number; per100: number; otherFactors: number[]; speeds: number[] }) {
  return o.speeds.map((s) => { const f = EV_FACTORS.speed(s); return { kmh: s, factor: f, km: evRange({ kwh: o.kwh, per100: o.per100, factors: [f, ...o.otherFactors] }).km }; });
}
/** A trip: starting charge %, reserve %, distance. */
export function evTrip(o: { kwh: number; per100: number; mult: number; distKm: number; startPct: number; reservePct: number }) {
  const use = (o.distKm * o.per100 * o.mult) / 100;
  const startKwh = (o.kwh * o.startPct) / 100, reserveKwh = (o.kwh * o.reservePct) / 100;
  const arriveKwh = startKwh - use, arrivePct = (arriveKwh / o.kwh) * 100;
  const rangeKm = ((startKwh - reserveKwh) / (o.per100 * o.mult)) * 100;
  const ok = arrivePct >= o.reservePct;
  const stopsKwh = ok ? 0 : reserveKwh - arriveKwh;
  return { use, arrivePct, ok, rangeKm: Math.max(0, rangeKm), needKwh: stopsKwh };
}
/** Running cost: money per 100 km for electricity (price per kWh) and petrol (L/100 km, price per L). */
export const evCost100 = (per100Real: number, pricePerKwh: number) => per100Real * pricePerKwh;
export const petrolCost100 = (l100: number, pricePerL: number) => l100 * pricePerL;

/** Engine extras. */
export const meanPistonSpeed = (strokeMm: number, rpm: number) => (2 * strokeMm * rpm) / 60000; // m/s
export const POWER_W = { kw: 1000, hp: 745.69987158227, ps: 735.49875 } as const;
export const specificOutput = (power: number, unit: keyof typeof POWER_W, litres: number) => ((power * POWER_W[unit]) / 1000 / litres); // kW per litre
/** Swept volume (cc, total) to the other units. */
export const ccFrom = (v: number, u: 'cc' | 'l' | 'cuin') => (u === 'cc' ? v : u === 'l' ? v * 1000 : v * CC_PER_CUIN);
/** Stroke (mm) that gives targetCc with this bore and cylinder count; or bore for a stroke. */
export const strokeFor = (targetCc: number, boreMm: number, cyl: number) => (targetCc * MM3_PER_CC) / ((Math.PI / 4) * boreMm * boreMm * cyl);
export const boreFor = (targetCc: number, strokeMm: number, cyl: number) => Math.sqrt((targetCc * MM3_PER_CC * 4) / (Math.PI * strokeMm * cyl));

/** rpm at a road speed (km/h) in a gear. */
export function rpmAtSpeed(o: { front: number; rear: number; primary: number; gear: number; circMm: number; kmh: number }) {
  const total = o.primary * o.gear * (o.rear / o.front);
  return (o.kmh * 1e6 / (o.circMm * 60)) * total;
}
/** Rear teeth (not rounded) that give `kmh` at `rpm` in a gear. */
export function rearForSpeed(o: { front: number; primary: number; gear: number; circMm: number; rpm: number; kmh: number }) {
  const wheelRpm = (o.kmh * 1e6) / (o.circMm * 60);
  return (o.rpm / wheelRpm / (o.primary * o.gear)) * o.front;
}
