// Greenhouse heating and ventilation sums from first principles. Plain TypeScript, no DOM.
// Heat loss Q = U A ΔT (through the cover) + ρ cp V N / 3600 ΔT (air leaking in, N air changes per hour).
// Ventilation: solar heat that is not used to evaporate water, τ I A_floor (1 − E), is carried away by outside air,
// V̇ = (τ I A_floor (1 − E) − U A ΔT) / (ρ cp ΔT). Dry air density from the ideal gas law, ρ = p / (R_d T).
// Physical constants: R_d = 287.05 J/(kg K) (R / M_air), cp = 1006 J/(kg K), standard pressure 101 325 Pa.

export const RD = 287.05, CP = 1006, P0 = 101325, BTU_PER_W = 3.412142, CFM_PER_M3S = 2118.880, J_PER_KWH = 3.6e6;

/** Density of dry air (kg/m³) at temperature tC (°C) and pressure p (Pa). */
export const airDensity = (tC: number, p = P0) => p / (RD * (tC + 273.15));
/** Standard atmosphere pressure (Pa) at an altitude in metres (ISA troposphere). */
export const pressureAtAltitude = (h: number) => P0 * (1 - 2.25577e-5 * h) ** 5.25588;

export type Shape = { length: number; width: number; eave: number; ridge: number };
export type Geometry = { floor: number; walls: number; ends: number; roof: number; cover: number; volume: number; slope: number };
/** A single-span gable greenhouse: floor area, cover areas (side walls, gable ends, roof) and air volume. */
export function geometry(s: Shape): Geometry {
  const { length: L, width: W, eave: He, ridge: Hr } = s;
  if (!(L > 0 && W > 0 && He > 0)) throw new Error('Length, width and eave height must be above 0.');
  if (!(Hr >= He)) throw new Error('The ridge height must be at least the eave height.');
  const rise = Hr - He, gable = W * He + 0.5 * W * rise;
  const walls = 2 * L * He, ends = 2 * gable, roof = 2 * L * Math.hypot(W / 2, rise);
  return { floor: L * W, walls, ends, roof, cover: walls + ends + roof, volume: L * gable, slope: (Math.atan2(rise, W / 2) * 180) / Math.PI };
}

export type Heating = { dT: number; rho: number; uaCover: number; uaAir: number; ua: number; qCover: number; qAir: number; q: number; heater: number; perFloor: number };
/** Design heat loss (W) at the coldest outside temperature you design for. */
export function heating(g: Geometry, o: { U: number; tIn: number; tOut: number; ach: number; margin: number; p?: number }): Heating {
  if (!(o.U > 0)) throw new Error('The cover U value must be above 0.');
  if (!(o.ach >= 0)) throw new Error('Air changes per hour cannot be negative.');
  const dT = o.tIn - o.tOut;
  if (!(dT > 0)) throw new Error('The inside temperature must be above the outside design temperature.');
  const rho = airDensity(o.tOut, o.p), uaCover = o.U * g.cover, uaAir = (rho * CP * g.volume * o.ach) / 3600, ua = uaCover + uaAir;
  const q = ua * dT;
  return { dT, rho, uaCover, uaAir, ua, qCover: uaCover * dT, qAir: uaAir * dT, q, heater: q * (1 + o.margin / 100), perFloor: q / g.floor };
}

export type Fuel = { energyMJ: number; efficiency: number; price?: number };
/** Seasonal heat (kWh) from heating degree-days (K·day) and the fuel this takes. */
export function season(h: Heating, degreeDays: number, f: Fuel) {
  if (!(degreeDays >= 0)) throw new Error('Degree-days cannot be negative.');
  if (!(f.energyMJ > 0) || !(f.efficiency > 0 && f.efficiency <= 1)) throw new Error('Give the fuel energy content and a burner efficiency between 1 and 100 %.');
  const degreeHours = degreeDays * 24, kWh = (h.ua * degreeHours) / 1000;
  const fuel = (kWh * J_PER_KWH) / (f.energyMJ * 1e6 * f.efficiency);
  return { degreeHours, kWh, fuel, cost: f.price != null && Number.isFinite(f.price) ? fuel * f.price : null };
}

export type Vent = { solar: number; coverLoss: number; net: number; rho: number; flow: number; achMin: number; perFloor: number; cfm: number; fans: number | null; needed: boolean };
/** Ventilation needed to hold the inside air dT above outside under full sun. */
export function ventilation(g: Geometry, o: { I: number; tau: number; evap: number; dT: number; tOut: number; U: number; countCover: boolean; fanM3h?: number; p?: number }): Vent {
  if (!(o.dT > 0)) throw new Error('The allowed temperature rise must be above 0.');
  if (!(o.tau >= 0 && o.tau <= 1) || !(o.evap >= 0 && o.evap < 1)) throw new Error('Transmission must be 0 to 100 % and the share used by the crop below 100 %.');
  if (!(o.I >= 0)) throw new Error('Solar radiation cannot be negative.');
  const solar = o.tau * o.I * g.floor * (1 - o.evap), coverLoss = o.countCover ? o.U * g.cover * o.dT : 0, net = solar - coverLoss;
  const rho = airDensity(o.tOut, o.p), flow = Math.max(0, net) / (rho * CP * o.dT);
  return { solar, coverLoss, net, rho, flow, achMin: (flow * 60) / g.volume, perFloor: flow / g.floor, cfm: flow * CFM_PER_M3S, fans: o.fanM3h && o.fanM3h > 0 ? Math.ceil((flow * 3600) / o.fanM3h - 1e-9) : null, needed: net > 0 };
}

/** Rounded example U values (W/m² K) for common covers; real values depend on the product, wind and screens. */
export const COVERS: { id: string; name: string; U: number }[] = [
  { id: 'glass', name: 'Single glass', U: 6.0 },
  { id: 'film', name: 'Single plastic film', U: 6.5 },
  { id: 'double', name: 'Double inflated film', U: 4.0 },
  { id: 'twinwall', name: 'Twin-wall polycarbonate', U: 3.5 },
];
/** Rounded example energy contents (MJ per unit) for common fuels; electricity is exact (3.6 MJ per kWh). */
export const FUELS: { id: string; name: string; unit: string; MJ: number; eff: number }[] = [
  { id: 'gas', name: 'Natural gas', unit: 'm³', MJ: 38, eff: 85 },
  { id: 'propane', name: 'Propane', unit: 'L', MJ: 25, eff: 85 },
  { id: 'oil', name: 'Heating oil', unit: 'L', MJ: 38, eff: 85 },
  { id: 'pellets', name: 'Wood pellets', unit: 'kg', MJ: 17, eff: 85 },
  { id: 'elec', name: 'Electricity', unit: 'kWh', MJ: 3.6, eff: 100 },
];
