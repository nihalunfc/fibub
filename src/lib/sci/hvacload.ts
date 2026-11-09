// A simplified steady-state room heating and cooling load: fabric U·A·ΔT, solar gain through glazing (area × SHGC
// × irradiance), outdoor air by infiltration (air changes per hour) and ventilation (sensible and latent, from the
// psychrometric humidity ratios), and internal gains from people, lighting and equipment. Not a full ASHRAE or
// CIBSE method: no thermal mass, time lag, hour-by-hour sun or diversity.
import { air } from './psychro.ts';

export const W_TO_BTUH = 3.412141633, W_PER_TON = 3516.852842;

export type Element = { name: string; area: number; U: number; shgc?: number; sun?: number; extraDT?: number };
export type LoadIn = {
  elements: Element[];
  volume: number; ach: number; ventLps: number; p: number;
  tiH: number; toH: number; rhoH: number; // heating: indoor, outdoor °C, outdoor RH (0-1)
  tiC: number; rhiC: number; toC: number; rhoC: number; // cooling: indoor °C and RH, outdoor °C and RH
  people: number; perSens: number; perLat: number; lightW: number; equipW: number;
  creditHeating: boolean; margin: number; // margin as a fraction, e.g. 0.1
};
export type Row = { name: string; heat: number; sens: number; lat: number };

export function roomLoad(L: LoadIn) {
  const rows: Row[] = [];
  const dH = L.tiH - L.toH, dC = L.toC - L.tiC;
  for (const e of L.elements) {
    const fabricC = e.U * e.area * (dC + (e.extraDT ?? 0)), solar = e.area * (e.shgc ?? 0) * (e.sun ?? 0);
    rows.push({ name: e.name, heat: e.U * e.area * dH, sens: fabricC, lat: 0 });
    if (solar) rows.push({ name: `${e.name}: sun`, heat: 0, sens: solar, lat: 0 });
  }
  const Vdot = (L.ach * L.volume) / 3600 + L.ventLps / 1000; // m³/s of outdoor air
  const oH = air(L.toH, L.p, { rh: L.rhoH }), oC = air(L.toC, L.p, { rh: L.rhoC }), iC = air(L.tiC, L.p, { rh: L.rhiC });
  // Mass flow of dry air, taking the volume flow at outdoor conditions (v in m³ per kg dry air).
  const mH = Vdot / oH.v, mC = Vdot / oC.v;
  const airHeat = mH * (1.006 + 1.86 * oH.W) * dH * 1000;
  const airSens = mC * (1.006 + 1.86 * oC.W) * dC * 1000;
  const airLat = mC * (oC.W - iC.W) * (2501 + 1.86 * L.tiC) * 1000;
  rows.push({ name: 'Outdoor air', heat: airHeat, sens: airSens, lat: airLat });
  const pS = L.people * L.perSens, pL = L.people * L.perLat;
  const credit = L.creditHeating ? -1 : 0;
  rows.push({ name: 'People', heat: credit * pS, sens: pS, lat: pL });
  rows.push({ name: 'Lighting', heat: credit * L.lightW, sens: L.lightW, lat: 0 });
  rows.push({ name: 'Equipment', heat: credit * L.equipW, sens: L.equipW, lat: 0 });
  const sum = (k: 'heat' | 'sens' | 'lat') => rows.reduce((s, r) => s + r[k], 0);
  const heat0 = Math.max(0, sum('heat')), sens0 = sum('sens'), lat0 = Math.max(0, sum('lat'));
  const f = 1 + L.margin;
  const heat = heat0 * f, sens = sens0 * f, lat = lat0 * f, total = sens + lat;
  return { rows, Vdot, mH, mC, wOut: oC.W, wIn: iC.W, heat, sens, lat, total, shr: total > 0 ? sens / total : NaN, heat0, sens0, lat0 };
}
