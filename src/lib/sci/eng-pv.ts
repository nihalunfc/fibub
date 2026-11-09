// Clear-sky solar PV yield: the Sun's position (NOAA solar calculator equations, after Meeus), Haurwitz clear-sky
// global irradiance, the Erbs split into direct and diffuse, isotropic-sky transposition onto a tilted panel, an
// hourly year, monthly energy and a best-tilt search. Clear sky is an upper bound: a cloudiness factor scales it.
// Plain TypeScript, no DOM.

const RAD = Math.PI / 180;
export const SOLAR_CONSTANT = 1366.1; // W/m²

/** Sun's zenith and azimuth (degrees, azimuth clockwise from north) at a UTC time (ms) for latitude and longitude. */
export function sunPosition(ms: number, lat: number, lon: number) {
  const jd = ms / 86400000 + 2440587.5, T = (jd - 2451545) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T), e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = Math.sin(M * RAD) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * RAD) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * RAD) * 0.000289;
  const trueLong = L0 + C, omega = 125.04 - 1934.136 * T, lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60, eps = eps0 + 0.00256 * Math.cos(omega * RAD);
  const decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD));
  const y = Math.tan((eps / 2) * RAD) ** 2;
  const eot = 4 / RAD * (y * Math.sin(2 * L0 * RAD) - 2 * e * Math.sin(M * RAD) + 4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD) - 0.5 * y * y * Math.sin(4 * L0 * RAD) - 1.25 * e * e * Math.sin(2 * M * RAD)); // minutes
  const utcMin = ((ms % 86400000) + 86400000) % 86400000 / 60000;
  const tst = (((utcMin + eot + 4 * lon) % 1440) + 1440) % 1440;
  const ha = tst / 4 < 0 ? tst / 4 + 180 : tst / 4 - 180;
  const cz = Math.sin(lat * RAD) * Math.sin(decl) + Math.cos(lat * RAD) * Math.cos(decl) * Math.cos(ha * RAD);
  const zen = Math.acos(Math.max(-1, Math.min(1, cz)));
  // Azimuth from the components of the Sun's direction (east, north).
  const east = -Math.cos(decl) * Math.sin(ha * RAD), north = Math.cos(lat * RAD) * Math.sin(decl) - Math.sin(lat * RAD) * Math.cos(decl) * Math.cos(ha * RAD);
  const az = ((Math.atan2(east, north) / RAD) % 360 + 360) % 360;
  return { zenith: zen / RAD, azimuth: az, declination: decl / RAD, eot, hourAngle: ha, dayOfYearAngle: 0 };
}

/** Extraterrestrial normal irradiance (Spencer's Earth-Sun distance factor) on day of year n. */
export function extraterrestrial(doy: number) {
  const b = (2 * Math.PI * (doy - 1)) / 365;
  return SOLAR_CONSTANT * (1.00011 + 0.034221 * Math.cos(b) + 0.00128 * Math.sin(b) + 0.000719 * Math.cos(2 * b) + 0.000077 * Math.sin(2 * b));
}

/** Haurwitz clear-sky global horizontal irradiance, W/m². */
export const haurwitz = (zenithDeg: number) => { const c = Math.cos(zenithDeg * RAD); return c > 0 ? 1098 * c * Math.exp(-0.059 / c) : 0; };

/** Erbs: diffuse fraction from the clearness index, then DNI and DHI. */
export function erbs(ghi: number, zenithDeg: number, doy: number) {
  const c = Math.cos(zenithDeg * RAD);
  if (!(ghi > 0) || c <= 0) return { dni: 0, dhi: 0, kt: 0 };
  // Same lower limit on cos(zenith) as pvlib (min_cos_zenith 0.065) so the clearness index stays sensible near the horizon.
  const kt = Math.max(0, Math.min(1, ghi / (extraterrestrial(doy) * Math.max(c, 0.065))));
  const df = kt <= 0.22 ? 1 - 0.09 * kt : kt <= 0.8 ? 0.9511 - 0.1604 * kt + 4.388 * kt ** 2 - 16.638 * kt ** 3 + 12.336 * kt ** 4 : 0.165;
  const dhi = df * ghi, dni = zenithDeg < 87 ? Math.max(0, (ghi - dhi) / c) : 0;
  return { dni, dhi, kt };
}

/** Isotropic-sky plane-of-array irradiance (W/m²) on a panel of tilt and azimuth (degrees). */
export function poaIsotropic(tilt: number, panelAz: number, zen: number, sunAz: number, dni: number, dhi: number, ghi: number, albedo: number) {
  const cosAoi = Math.cos(zen * RAD) * Math.cos(tilt * RAD) + Math.sin(zen * RAD) * Math.sin(tilt * RAD) * Math.cos((sunAz - panelAz) * RAD);
  const beam = Math.max(0, dni * cosAoi), sky = (dhi * (1 + Math.cos(tilt * RAD))) / 2, ground = (ghi * albedo * (1 - Math.cos(tilt * RAD))) / 2;
  return { poa: beam + sky + ground, beam, sky, ground, cosAoi };
}

export type Hour = { ms: number; month: number; doy: number; zen: number; az: number; ghi: number; dni: number; dhi: number };

/** One clear-sky year, hour by hour at the middle of each hour of local solar time (365 days). */
export function clearSkyYear(lat: number, lon: number, year = 2025): Hour[] {
  const out: Hour[] = [];
  for (let d = 0; d < 365; d++) {
    const day0 = Date.UTC(year, 0, 1 + d) - (lon / 15) * 3600000, month = new Date(Date.UTC(year, 0, 1 + d)).getUTCMonth();
    for (let h = 0; h < 24; h++) {
      const ms = day0 + (h + 0.5) * 3600000, s = sunPosition(ms, lat, lon), ghi = haurwitz(s.zenith), e = erbs(ghi, s.zenith, d + 1);
      out.push({ ms, month, doy: d + 1, zen: s.zenith, az: s.azimuth, ghi, dni: e.dni, dhi: e.dhi });
    }
  }
  return out;
}

export type PvSystem = { tilt: number; az: number; albedo: number; kWp: number; losses: number; cloud: number[] };

/** Monthly and yearly plane-of-array insolation (kWh/m²) and AC energy (kWh). cloud: 12 monthly factors (0..1). */
export function yieldOf(hours: Hour[], s: PvSystem) {
  const months = Array.from({ length: 12 }, () => ({ ghi: 0, poa: 0, poaClear: 0, energy: 0 }));
  const k = s.kWp * (1 - s.losses);
  for (const h of hours) {
    if (h.ghi <= 0) continue;
    const p = poaIsotropic(s.tilt, s.az, h.zen, h.az, h.dni, h.dhi, h.ghi, s.albedo).poa, f = s.cloud[h.month], m = months[h.month];
    m.ghi += (h.ghi * f) / 1000; m.poaClear += p / 1000; m.poa += (p * f) / 1000; m.energy += (k * p * f) / 1000;
  }
  const year = months.reduce((a, m) => ({ ghi: a.ghi + m.ghi, poa: a.poa + m.poa, poaClear: a.poaClear + m.poaClear, energy: a.energy + m.energy }), { ghi: 0, poa: 0, poaClear: 0, energy: 0 });
  return { months, year, specific: s.kWp > 0 ? year.energy / s.kWp : 0, capacityFactor: s.kWp > 0 ? year.energy / (s.kWp * 8760) : 0 };
}

/** Annual plane-of-array insolation for every whole-degree tilt from 0 to 90 at a fixed azimuth, and the best one. */
export function bestTilt(hours: Hour[], s: Omit<PvSystem, 'tilt'>) {
  const curve: { tilt: number; poa: number }[] = [];
  for (let t = 0; t <= 90; t++) curve.push({ tilt: t, poa: yieldOf(hours, { ...s, tilt: t, kWp: 1, losses: 0 }).year.poa });
  let best = curve[0]; for (const c of curve) if (c.poa > best.poa) best = c;
  // Refine to 0.1° around the best whole degree.
  let fine = best;
  for (let t = Math.max(0, best.tilt - 1); t <= Math.min(90, best.tilt + 1) + 1e-9; t += 0.1) {
    const p = yieldOf(hours, { ...s, tilt: t, kWp: 1, losses: 0 }).year.poa; if (p > fine.poa) fine = { tilt: +t.toFixed(1), poa: p };
  }
  return { curve, best: fine };
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
