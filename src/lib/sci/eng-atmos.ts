// The 1976 US Standard Atmosphere (identical to the ICAO/ISA standard atmosphere up to 32 km and in its
// definitions above) from its defining constants: sea-level values, the gas constant, the molar mass of air and
// the seven geopotential layers with their linear temperature lapse rates. Everything else follows from the
// hydrostatic equation and the ideal gas law. Plain TypeScript, no DOM.
// Above 80 km the 1976 standard lowers the kinetic temperature slightly (up to 0.04 % by 86 km) as oxygen
// dissociates; this tool reports the molecular-scale temperature there, which differs from it by less than 0.1 K.

export const G0 = 9.80665; // m/s², standard gravity
export const RSTAR = 8.31432; // J/(mol·K), the gas constant as defined for the 1976 standard
export const M0 = 0.0289644; // kg/mol, mean molar mass of sea-level air
export const R_AIR = RSTAR / M0; // 287.053 J/(kg·K)
export const GAMMA = 1.4;
export const R_EARTH = 6356766; // m, the effective Earth radius used for geopotential height
export const T0 = 288.15, P0 = 101325, RHO0 = P0 / (R_AIR * T0);
export const SUTH_BETA = 1.458e-6, SUTH_S = 110.4; // Sutherland's law constants of the standard

/** Layer bases (geopotential metres) and lapse rates (K per geopotential metre). */
export const LAYERS: { H: number; L: number; name: string }[] = [
  { H: 0, L: -0.0065, name: 'Troposphere' },
  { H: 11000, L: 0, name: 'Tropopause' },
  { H: 20000, L: 0.001, name: 'Stratosphere (lower)' },
  { H: 32000, L: 0.0028, name: 'Stratosphere (upper)' },
  { H: 47000, L: 0, name: 'Stratopause' },
  { H: 51000, L: -0.0028, name: 'Mesosphere (lower)' },
  { H: 71000, L: -0.002, name: 'Mesosphere (upper)' },
];
export const H_TOP = 84852; // geopotential m, = 86 km geometric
export const H_BOTTOM = -5000;
export const Z_TOP = 86000;

/** Base temperature and pressure of every layer, worked out from sea level upwards. */
const BASES = (() => {
  const out: { H: number; L: number; T: number; P: number; name: string }[] = [];
  let T = T0, P = P0;
  LAYERS.forEach((l, i) => {
    if (i) {
      const prev = out[i - 1], dH = l.H - prev.H;
      T = prev.T + prev.L * dH;
      P = prev.L === 0 ? prev.P * Math.exp((-G0 * dH) / (R_AIR * prev.T)) : prev.P * (prev.T / T) ** ((G0) / (R_AIR * prev.L));
    }
    out.push({ ...l, T, P });
  });
  return out;
})();
export const layerBases = () => BASES.map((b) => ({ ...b }));

export const geopotential = (z: number) => (R_EARTH * z) / (R_EARTH + z);
export const geometric = (H: number) => (R_EARTH * H) / (R_EARTH - H);
export const gravity = (z: number) => G0 * (R_EARTH / (R_EARTH + z)) ** 2;

const layerIndex = (H: number) => { let i = 0; while (i < BASES.length - 1 && H >= BASES[i + 1].H) i++; return i; };

/** Standard temperature (K) and pressure (Pa) at a geopotential height H (m). */
export function stdTP(H: number): { T: number; P: number; layer: number } {
  const i = layerIndex(H), b = BASES[i], dH = H - b.H, T = b.T + b.L * dH;
  const P = b.L === 0 ? b.P * Math.exp((-G0 * dH) / (R_AIR * b.T)) : b.P * (b.T / T) ** (G0 / (R_AIR * b.L));
  return { T, P, layer: i };
}

export const sutherland = (T: number) => (SUTH_BETA * T ** 1.5) / (T + SUTH_S);
export const soundSpeed = (T: number) => Math.sqrt(GAMMA * R_AIR * T);

export type AtmosPoint = {
  z: number; H: number; layer: string; Tstd: number; T: number; P: number; rho: number; a: number; mu: number; nu: number; g: number;
  delta: number; theta: number; sigma: number; dT: number; scaleHeight: number; meanFreePath: number; numberDensity: number;
};

/**
 * Properties at an altitude. `alt` is geometric unless `geopotential` is true. A temperature offset dT (ISA
 * deviation, K) shifts the temperature at every height while the pressure stays that of the standard at the same
 * pressure altitude (the usual convention for "ISA + 15" days), so the density changes.
 */
export function atmosphere(alt: number, opt: { geopotential?: boolean; dT?: number } = {}): AtmosPoint {
  const H = opt.geopotential ? alt : geopotential(alt), z = opt.geopotential ? geometric(alt) : alt, dT = opt.dT ?? 0;
  const s = stdTP(H), T = s.T + dT, P = s.P, rho = P / (R_AIR * T), mu = sutherland(T);
  const g = gravity(z), NA = 6.022169e23, sigmaD = 3.65e-10; // Avogadro and the effective collision diameter of the 1976 standard
  const n = (NA * P) / (RSTAR * T);
  return {
    z, H, layer: BASES[s.layer].name, Tstd: s.T, T, P, rho, a: soundSpeed(T), mu, nu: mu / rho, g,
    delta: P / P0, theta: T / T0, sigma: rho / RHO0, dT, scaleHeight: (R_AIR * T) / g,
    meanFreePath: 1 / (Math.SQRT2 * Math.PI * sigmaD ** 2 * n), numberDensity: n,
  };
}

/** Pressure altitude: the geopotential height (m) at which the standard pressure equals P (Pa). Exact inverse. */
export function pressureAltitude(P: number): number {
  if (!(P > 0)) return NaN;
  // Find the layer: pressure falls with height.
  let i = 0; while (i < BASES.length - 1 && P <= BASES[i + 1].P) i++;
  const b = BASES[i];
  if (b.L === 0) return b.H - (R_AIR * b.T / G0) * Math.log(P / b.P);
  const T = b.T * (P / b.P) ** (-(R_AIR * b.L) / G0);
  return b.H + (T - b.T) / b.L;
}

/** Density altitude: the geopotential height (m) at which the standard density equals rho. Bisection. */
export function densityAltitude(rho: number): number {
  if (!(rho > 0)) return NaN;
  let lo = H_BOTTOM - 5000, hi = H_TOP + 2000;
  const f = (H: number) => { const s = stdTP(H); return s.P / (R_AIR * s.T) - rho; };
  if (f(lo) < 0 || f(hi) > 0) return NaN;
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; if (hi - lo < 1e-7) break; }
  return (lo + hi) / 2;
}

/** Station pressure (Pa) at a field elevation (geometric m) from the altimeter setting QNH (Pa), standard relation. */
export function stationPressure(qnh: number, elevation: number): number {
  return qnh * (stdTP(geopotential(elevation)).P / P0);
}

/**
 * From a field elevation, altimeter setting (QNH) and outside air temperature, the pressure altitude, density,
 * density altitude and ISA deviation. Heights in geopotential metres (the aviation convention for pressure and
 * density altitude), temperature in K, pressures in Pa.
 */
export function fieldDensity(elevation: number, qnh: number, oatK: number) {
  const P = stationPressure(qnh, elevation), Hp = pressureAltitude(P), rho = P / (R_AIR * oatK);
  const isa = stdTP(Hp).T, Hd = densityAltitude(rho);
  return { P, pressureAlt: Hp, rho, densityAlt: Hd, isaDev: oatK - isa, isaT: isa, sigma: rho / RHO0 };
}

/** A table of properties from `from` to `to` (geometric m unless geopotential), every `step` metres. */
export function table(from: number, to: number, step: number, opt: { geopotential?: boolean; dT?: number } = {}): AtmosPoint[] {
  const out: AtmosPoint[] = [];
  if (!(step > 0) || to < from) return out;
  const n = Math.min(5000, Math.floor((to - from) / step + 1e-9));
  for (let k = 0; k <= n; k++) out.push(atmosphere(from + k * step, opt));
  return out;
}

export const FT = 0.3048;
export const INHG = 3386.389; // Pa per inch of mercury (0 °C)
export const PSI = 6894.757;
export const SLUGFT3 = 515.3788; // kg/m³ per slug/ft³
