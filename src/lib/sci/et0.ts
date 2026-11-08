// Daily reference evapotranspiration by FAO-56 Penman-Monteith (Allen and others, 1998), with Hargreaves for comparison.
// Temperatures in °C, pressures in kPa, radiation in MJ/m²/day, wind in m/s, ET in mm/day. No DOM.

export const SIGMA = 4.903e-9; // Stefan-Boltzmann constant, MJ/K⁴/m²/day
export const GSC = 0.082; // solar constant, MJ/m²/min

/** Saturation vapour pressure e°(T), kPa. */
export const svp = (T: number) => 0.6108 * Math.exp((17.27 * T) / (T + 237.3));
/** Slope of the saturation vapour pressure curve, kPa/°C. */
export const slope = (T: number) => (4098 * svp(T)) / (T + 237.3) ** 2;
/** Air pressure from elevation, kPa. */
export const pressure = (z: number) => 101.3 * Math.pow((293 - 0.0065 * z) / 293, 5.26);
/** Psychrometric constant, kPa/°C. */
export const psy = (P: number) => 0.000665 * P;
/** Wind speed at 2 m from a reading at height h (m) above the ground (log profile for short grass). */
export const wind2 = (u: number, h: number) => (h === 2 ? u : (u * 4.87) / Math.log(67.8 * h - 5.42));

/** Day of the year (1-366) for a date string YYYY-MM-DD, or NaN. */
export function dayOfYear(s: string) {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s.trim());
  if (!m) return NaN;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return NaN;
  return Math.round((Date.UTC(y, mo - 1, d) - Date.UTC(y, 0, 1)) / 86400000) + 1;
}

/** Extraterrestrial radiation Ra, daylight hours N and sunset hour angle for latitude (degrees, south negative) and day J. */
export function extraterrestrial(latDeg: number, J: number) {
  const phi = (latDeg * Math.PI) / 180, dr = 1 + 0.033 * Math.cos((2 * Math.PI * J) / 365), dec = 0.409 * Math.sin((2 * Math.PI * J) / 365 - 1.39);
  const ws = Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(dec))));
  const Ra = ((24 * 60) / Math.PI) * GSC * dr * (ws * Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.sin(ws));
  return { Ra: Math.max(0, Ra), N: (24 / Math.PI) * ws, ws, dec, dr };
}

export type Humidity =
  | { kind: 'rhmaxmin'; rhmax: number; rhmin: number }
  | { kind: 'rhmean'; rh: number }
  | { kind: 'tdew'; tdew: number }
  | { kind: 'ea'; ea: number }
  | { kind: 'none'; ko?: number }; // dew point taken as Tmin − ko (0 for humid places, about 2 for dry ones)

export type Solar =
  | { kind: 'sun'; n: number; as?: number; bs?: number }
  | { kind: 'rs'; rs: number }
  | { kind: 'temp'; krs?: number }; // Hargreaves radiation formula, krs 0.16 inland, 0.19 coastal

export type Day = { tmax: number; tmin: number; lat: number; z: number; J: number; u?: number; uh?: number; hum: Humidity; sol: Solar };

/** Actual vapour pressure ea, kPa. */
export function actualVp(tmax: number, tmin: number, h: Humidity) {
  if (h.kind === 'rhmaxmin') return (svp(tmin) * h.rhmax / 100 + svp(tmax) * h.rhmin / 100) / 2;
  if (h.kind === 'rhmean') return (h.rh / 100) * (svp(tmax) + svp(tmin)) / 2;
  if (h.kind === 'tdew') return svp(h.tdew);
  if (h.kind === 'ea') return h.ea;
  return svp(tmin - (h.ko ?? 0));
}

/** FAO-56 Penman-Monteith reference ET0 for one day, with every step. Wind defaults to 2 m/s when not given. Soil heat flux G = 0. */
export function penmanMonteith(d: Day) {
  const T = (d.tmax + d.tmin) / 2, P = pressure(d.z), g = psy(P), D = slope(T);
  const es = (svp(d.tmax) + svp(d.tmin)) / 2, ea = Math.min(actualVp(d.tmax, d.tmin, d.hum), es), vpd = es - ea;
  const { Ra, N } = extraterrestrial(d.lat, d.J), Rso = (0.75 + 2e-5 * d.z) * Ra;
  let Rs: number;
  if (d.sol.kind === 'sun') Rs = ((d.sol.as ?? 0.25) + (d.sol.bs ?? 0.5) * Math.min(1, N > 0 ? d.sol.n / N : 0)) * Ra;
  else if (d.sol.kind === 'rs') Rs = d.sol.rs;
  else Rs = (d.sol.krs ?? 0.16) * Math.sqrt(Math.max(0, d.tmax - d.tmin)) * Ra;
  Rs = Math.min(Rs, Rso);
  const Rns = 0.77 * Rs, ratio = Rso > 0 ? Math.min(1, Rs / Rso) : 0.5;
  const Rnl = SIGMA * (((d.tmax + 273.16) ** 4 + (d.tmin + 273.16) ** 4) / 2) * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * ratio - 0.35);
  const Rn = Rns - Rnl, u2 = d.u === undefined ? 2 : wind2(d.u, d.uh ?? 2);
  const rad = 0.408 * D * Rn, aero = g * (900 / (T + 273)) * u2 * vpd, den = D + g * (1 + 0.34 * u2);
  const et0 = Math.max(0, (rad + aero) / den);
  return { et0, T, P, gamma: g, delta: D, es, ea, vpd, Ra, N, Rso, Rs, Rns, Rnl, Rn, u2, radPart: rad / den, aeroPart: aero / den };
}

/** Hargreaves-Samani (1985) ET0, mm/day: 0.0023 (T + 17.8) √(Tmax − Tmin) × Ra as evaporation (0.408 Ra). */
export const hargreaves = (tmax: number, tmin: number, Ra: number) => 0.0023 * ((tmax + tmin) / 2 + 17.8) * Math.sqrt(Math.max(0, tmax - tmin)) * 0.408 * Ra;

/** Finds the weather columns of a daily table by their header names. */
export function weatherColumns(head: string[]) {
  const h = head.map((s) => s.toLowerCase().replace(/[^a-z0-9%]/g, ''));
  const find = (re: RegExp, not?: RegExp) => h.findIndex((s) => re.test(s) && !(not && not.test(s)));
  return {
    date: find(/^(date|day|time)/),
    tmax: find(/(tmax|maxtemp|temperaturemax|tempmax|maxt)/),
    tmin: find(/(tmin|mintemp|temperaturemin|tempmin|mint)/),
    rhmax: find(/(rhmax|maxrh|humiditymax|maxhumidity)/),
    rhmin: find(/(rhmin|minrh|humiditymin|minhumidity)/),
    rh: find(/^(rh|rhmean|meanrh|humidity|relativehumidity)/, /(max|min)/),
    tdew: find(/(dew|tdew|td$)/),
    u: find(/(wind|^u2?$|^u\d|windspeed)/),
    sun: find(/(sun|^n$|sunshine)/),
    rs: find(/(^rs$|solar|radiation|^sr)/),
  };
}
