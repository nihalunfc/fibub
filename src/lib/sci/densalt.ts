// Pressure altitude, density altitude and air density with the ICAO/US 1976 standard atmosphere (ISA).
// The ISA is defined by general constants: sea-level 1013.25 hPa and 15 °C, g0 = 9.80665 m/s², R = 287.05287 J/(kg K)
// for dry air, and fixed lapse rates between base geopotential heights (0, 11, 20, 32, 47 km). Heights here are
// geopotential metres, as altimeters and pressure altitude use. Moist air: vapour pressure from the dew point with
// Bolton (1980), virtual temperature Tv = T / (1 − (e/p)(1 − ε)), density ρ = p / (R Tv).
// Checked against the ambiance package (ISA layers) and MetPy 1.7.1 (density from pressure, temperature and mixing ratio).

export const G0 = 9.80665, RD = 287.05287, EPS = 0.621957, P0 = 1013.25, T0 = 288.15, RHO0 = (P0 * 100) / (RD * T0);
export const FT = 0.3048, INHG = 33.8638866667;
/** ISA layers: base geopotential height (m), base temperature (K), lapse rate (K/m), base pressure (hPa). */
const BASES: [number, number][] = [[0, -0.0065], [11000, 0], [20000, 0.001], [32000, 0.0028], [47000, 0]];
export const TOP = 51000;
type Layer = { h: number; t: number; L: number; p: number };
export const LAYERS: Layer[] = (() => {
  const out: Layer[] = [];
  let t = T0, p = P0;
  BASES.forEach(([h, L], i) => {
    if (i) { const prev = out[i - 1], dh = h - prev.h; t = prev.t + prev.L * dh; p = layerP(prev, h); }
    out.push({ h, t, L, p });
  });
  return out;
})();
function layerP(b: Layer, h: number) {
  const dh = h - b.h;
  return b.L === 0 ? b.p * Math.exp((-G0 * dh) / (RD * b.t)) : b.p * ((b.t + b.L * dh) / b.t) ** (-G0 / (RD * b.L));
}
const layerAt = (h: number) => { let i = LAYERS.length - 1; while (i > 0 && h < LAYERS[i].h) i--; return LAYERS[i]; };

/** ISA temperature (K), pressure (hPa) and density (kg/m³) at geopotential height h (m), from −5 km to 51 km. */
export function isa(h: number) {
  const b = layerAt(h), t = b.t + b.L * (h - b.h), p = layerP(b, h);
  return { t, p, rho: (p * 100) / (RD * t) };
}
/** ISA geopotential height (m) where the pressure is p (hPa): the pressure altitude. */
export function pressureAltitude(p: number) {
  let i = LAYERS.length - 1; while (i > 0 && p > LAYERS[i].p) i--;
  const b = LAYERS[i];
  return b.L === 0 ? b.h - (RD * b.t / G0) * Math.log(p / b.p) : b.h + (b.t / b.L) * ((p / b.p) ** ((-RD * b.L) / G0) - 1);
}
/** ISA geopotential height (m) where the density is rho (kg/m³): the density altitude. */
export function densityAltitude(rho: number) {
  // Density falls with height in every layer, so find the layer, then solve inside it.
  let i = LAYERS.length - 1; while (i > 0 && rho > isa(LAYERS[i].h).rho) i--;
  const b = LAYERS[i], rb = isa(b.h).rho;
  if (b.L === 0) return b.h - (RD * b.t / G0) * Math.log(rho / rb);
  return b.h + (b.t / b.L) * ((rho / rb) ** (1 / (-G0 / (RD * b.L) - 1)) - 1);
}

/** Bolton (1980) vapour pressure (hPa) at dew point td (°C). */
export const vapour = (td: number) => 6.112 * Math.exp((17.67 * td) / (td + 243.5));
/** Station pressure (hPa) from the altimeter setting (QNH, hPa) and the elevation (m), as the altimeter defines it. */
export const stationFromQnh = (qnh: number, elev: number) => isa(elev + pressureAltitude(qnh)).p;
/** Altimeter setting (QNH, hPa) from the station pressure (hPa) and elevation (m). */
export const qnhFromStation = (p: number, elev: number) => isa(pressureAltitude(p) - elev).p;

export type DA = {
  p: number; pa: number; tC: number; e: number; tv: number; rho: number; rhoDry: number; da: number; daDry: number;
  isaT: number; isaDev: number; rhoPct: number; thumb: number; w: number;
};
/** Everything from station pressure p (hPa), air temperature tC (°C) and dew point td (°C, or null for dry air). */
export function densityAlt(p: number, tC: number, td: number | null): DA {
  const T = tC + 273.15, e = td == null ? 0 : vapour(td);
  const tv = T / (1 - (e / p) * (1 - EPS));
  const rho = (p * 100) / (RD * tv), rhoDry = (p * 100) / (RD * T);
  const pa = pressureAltitude(p), isaT = isa(pa).t - 273.15;
  // The pilot's rule of thumb: about 120 ft of density altitude per °C away from the standard temperature.
  const thumb = pa + (120 * FT) * (tC - isaT);
  return { p, pa, tC, e, tv, rho, rhoDry, da: densityAltitude(rho), daDry: densityAltitude(rhoDry), isaT, isaDev: tC - isaT, rhoPct: (100 * rho) / RHO0, thumb, w: (EPS * e) / (p - e) };
}
