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
