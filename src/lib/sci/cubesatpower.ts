// CubeSat power budget: eclipse fraction of a circular orbit from altitude and beta angle (cylindrical Earth
// shadow), solar array power by attitude (sun-pointing, nadir-pointing or tumbling), orbit-average loads by
// operating mode from a duty-cycle table, and a step-by-step battery simulation over a few orbits. Plain
// TypeScript, no DOM. Earth constants and the solar constant are standard values; everything else is entered.
export const MU = 398600.4418; // km³/s², Earth's gravitational parameter
export const RE = 6378.137; // km, Earth's equatorial radius
export const SOLAR = 1361; // W/m², the total solar irradiance at 1 AU
const R = Math.PI / 180;

export const period = (hKm: number) => 2 * Math.PI * Math.sqrt((RE + hKm) ** 3 / MU); // seconds
/** The beta angle above which a circular orbit at this altitude never enters the shadow (degrees). */
export const betaStar = (hKm: number) => Math.asin(RE / (RE + hKm)) / R;

/** Fraction of a circular orbit in the cylindrical shadow: f = acos(√(h² + 2·Re·h) / ((Re + h) cos β)) / π, or 0 when |β| ≥ β*. */
export function eclipseFraction(hKm: number, betaDeg: number): number {
  if (Math.abs(betaDeg) >= betaStar(hKm)) return 0;
  return Math.acos(Math.sqrt(hKm * hKm + 2 * RE * hKm) / ((RE + hKm) * Math.cos(betaDeg * R))) / Math.PI;
}
/** In the cylindrical shadow at orbit angle u (degrees from the point nearest the Sun)? */
export function inShadow(hKm: number, betaDeg: number, uDeg: number): boolean {
  const cb = Math.cos(betaDeg * R), cu = Math.cos(uDeg * R), a = RE + hKm;
  return cu < 0 && a * a * (1 - cb * cb * cu * cu) < RE * RE;
}

export type Face = '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z';
export const FACES: Face[] = ['+X', '-X', '+Y', '-Y', '+Z', '-Z'];
const AXIS: Record<Face, [number, number, number]> = { '+X': [1, 0, 0], '-X': [-1, 0, 0], '+Y': [0, 1, 0], '-Y': [0, -1, 0], '+Z': [0, 0, 1], '-Z': [0, 0, -1] };
export type Panel = { name: string; face: Face; areaCm2: number };
export type SolarArray = { panels: Panel[]; eff: number; packing: number; tempCoef: number; tempC: number; refC: number; degPerYear: number; years: number; other: number };
export type Attitude = { mode: 'sun' | 'nadir' | 'tumble'; sunFace: Face };

/**
 * The Sun's direction in the body frame of a nadir-pointing satellite at orbit angle u: +X along the velocity,
 * +Z towards the Earth (nadir), +Y = Z × X (opposite the orbit normal). The Sun is β above the orbit plane.
 */
export function sunNadir(betaDeg: number, uDeg: number): [number, number, number] {
  const cb = Math.cos(betaDeg * R), sb = Math.sin(betaDeg * R), su = Math.sin(uDeg * R), cu = Math.cos(uDeg * R);
  return [-cb * su, -sb, -cb * cu];
}

/** The product of the array's derating factors: temperature, age and other losses. */
export function derate(a: SolarArray): number {
  const ft = Math.max(0, 1 + (a.tempCoef / 100) * (a.tempC - a.refC));
  const fd = Math.max(0, 1 - a.degPerYear / 100) ** a.years;
  return ft * fd * a.other;
}
/** Power (W) of one panel with the Sun straight on it, after packing, efficiency and derating. */
export const panelPeak = (a: SolarArray, p: Panel) => SOLAR * (p.areaCm2 / 1e4) * a.packing * a.eff * derate(a);

/** Array power (W) in sunlight at orbit angle u. Tumbling uses the average of max(0, cos θ) over random directions, 1/4. */
export function arrayPower(a: SolarArray, att: Attitude, betaDeg: number, uDeg: number): number {
  let s: [number, number, number] | null = null;
  if (att.mode === 'nadir') s = sunNadir(betaDeg, uDeg);
  return a.panels.reduce((sum, p) => {
    let c: number;
    if (att.mode === 'sun') c = p.face === att.sunFace ? 1 : 0;
    else if (att.mode === 'tumble') c = 0.25;
    else { const n = AXIS[p.face]; c = Math.max(0, n[0] * s![0] + n[1] * s![1] + n[2] * s![2]); }
    return sum + panelPeak(a, p) * c;
  }, 0);
}

export type Load = { name: string; watts: number; duty: number[] };
/** A load table: name, power (W), then one duty cycle (%) per operating mode, with the mode names in the header. */
export function parseLoads(rows: string[][], numf: (s: string) => number): { modes: string[]; loads: Load[] } | string {
  if (!rows.length) return 'Add at least one load: name, power in watts, then the duty cycle (%) in each mode.';
  const head = rows[0].length >= 3 && !Number.isFinite(numf(rows[0][1]));
  const nModes = Math.max(1, Math.max(...rows.map((r) => r.length)) - 2);
  const modes = Array.from({ length: nModes }, (_, i) => (head && rows[0][i + 2]) || `Mode ${i + 1}`);
  const loads: Load[] = [];
  const body = head ? rows.slice(1) : rows;
  for (let i = 0; i < body.length; i++) {
    const r = body[i], w = numf(r[1]);
    if (!Number.isFinite(w) || w < 0) return `Load row ${i + 1} (${r[0] || 'no name'}): give the power in watts.`;
    const duty = modes.map((_, k) => { const v = r[k + 2] === undefined || r[k + 2] === '' ? 100 : numf(r[k + 2]); return v; });
    const bad = duty.findIndex((d) => !(d >= 0 && d <= 100));
    if (bad >= 0) return `Load row ${i + 1} (${r[0]}): the duty cycle in ${modes[bad]} must be 0 to 100 %.`;
    loads.push({ name: r[0] || `Load ${i + 1}`, watts: w, duty });
  }
  if (!loads.length) return 'Add at least one load.';
  return { modes, loads };
}
/** Orbit-average load power (W) in operating mode k: the sum of power × duty cycle. */
export const loadAverage = (loads: Load[], k: number) => loads.reduce((s, l) => s + l.watts * (l.duty[k] / 100), 0);

export type Battery = { capacityWh: number; chargeEff: number; dischargeEff: number; startSoc: number };
export type SimResult = {
  t: number[]; gen: number[]; load: number; soc: number[]; T: number; ecl: number; dt: number;
  genAvg: number; sunAvg: number; eGen: number; eLoad: number; maxDod: number; endSoc: number; startLastSoc: number; empty: boolean; shunted: number;
};

/**
 * Battery and power over `orbits` orbits in `steps` equal steps each. Generation is taken at the middle of each
 * step (0 in shadow). Surplus charges the battery at chargeEff until full (the rest is shunted); a shortfall
 * drains it at 1 / dischargeEff. Each orbit starts at the shadow entry. Energies per orbit (Wh) and the deepest depth of discharge are for the last orbit.
 */
export function simulate(hKm: number, betaDeg: number, a: SolarArray, att: Attitude, loadW: number, b: Battery, orbits = 3, steps = 1440): SimResult {
  const T = period(hKm), dt = T / steps, C = b.capacityWh, u0 = 180 - 180 * eclipseFraction(hKm, betaDeg);
  let E = C * b.startSoc / 100, empty = false, shunted = 0, eGen = 0, minE = E, startLast = E;
  const t: number[] = [0], gen: number[] = [], soc: number[] = [100 * E / C];
  for (let o = 0; o < orbits; o++) {
    if (o === orbits - 1) { startLast = E; minE = E; eGen = 0; shunted = 0; }
    for (let k = 0; k < steps; k++) {
      const u = u0 + ((k + 0.5) / steps) * 360; // orbit angle from noon; each orbit starts as the satellite enters the shadow
      const pg = inShadow(hKm, betaDeg, u) ? 0 : arrayPower(a, att, betaDeg, u);
      const net = pg - loadW, h = dt / 3600;
      if (net >= 0) { E += net * b.chargeEff * h; if (E > C) { shunted += (E - C) / b.chargeEff; E = C; } }
      else { E += (net / b.dischargeEff) * h; if (E < 0) { E = 0; empty = true; } }
      if (o === orbits - 1) { eGen += pg * h; minE = Math.min(minE, E); }
      t.push(o * T + (k + 1) * dt); gen.push(pg); soc.push(100 * E / C);
    }
  }
  const ecl = eclipseFraction(hKm, betaDeg);
  return { t, gen, load: loadW, soc, T, ecl, dt, genAvg: eGen / (T / 3600), sunAvg: ecl < 1 ? eGen / (T * (1 - ecl) / 3600) : 0, eGen, eLoad: loadW * T / 3600, maxDod: 100 * (C - minE) / C, endSoc: 100 * E / C, startLastSoc: 100 * startLast / C, empty, shunted };
}

/** Rounded, made-up example: a 3U CubeSat with four body-mounted long faces and two deployed wings on −Z. */
export const EXAMPLE_PANELS = 'Panel, Face, Panel area (cm²)\nBody +X, +X, 340\nBody -X, -X, 340\nBody +Y, +Y, 340\nBody -Y, -Y, 340\nWing 1, -Z, 340\nWing 2, -Z, 340';
export const EXAMPLE_LOADS = 'Load, Power (W), Nominal, Payload, Safe\nOn-board computer, 0.4, 100, 100, 100\nAttitude control, 1.5, 100, 100, 20\nUHF radio receive, 0.2, 100, 100, 100\nUHF radio transmit, 4, 5, 5, 2\nS-band transmitter, 10, 0, 25, 0\nPayload camera, 6, 0, 50, 0\nHeaters, 2, 20, 20, 30';
