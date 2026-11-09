// #672 solar PV yield. Checked against an independent pvlib-python calculation (NREL SPA sun position, pvlib's
// Haurwitz clear sky, Erbs decomposition and isotropic transposition) on the same hourly timestamps, at 43.7° N
// 79.4° W (tilt 35°, facing 180°), 33.9° S 151.2° E (30°, facing 0°) and 12.97° N 77.59° E (10°, facing 90°).
import { sunPosition, haurwitz, erbs, poaIsotropic, clearSkyYear, yieldOf, bestTilt, extraterrestrial } from '../../src/lib/sci/eng-pv.ts';
import * as Astro from 'astronomy-engine';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) < t;
  const one = (lat, lon, tilt, az) => yieldOf(clearSkyYear(lat, lon), { tilt, az, albedo: 0.2, kWp: 1, losses: 0, cloud: Array(12).fill(1) });
  const a = one(43.7, -79.4, 35, 180);
  check('pv: 43.7 N clear-sky GHI 1978.45 and POA 2340.01 kWh/m² (pvlib)', rel(a.year.ghi, 1978.4479, 2e-4) && rel(a.year.poa, 2340.0136, 2e-4));
  const pm = [128.3413, 150.6002, 207.6011, 228.1375, 247.8401, 241.8790, 248.9791, 241.3092, 212.8289, 182.1036, 134.7576, 115.6359];
  check('pv: 43.7 N monthly POA within 0.03 % of pvlib', a.months.every((m, i) => rel(m.poa, pm[i], 3e-4)));
  const b = one(-33.9, 151.2, 30, 0);
  check('pv: 33.9 S north-facing GHI 2214.41, POA 2495.56 kWh/m² (pvlib)', rel(b.year.ghi, 2214.4073, 2e-4) && rel(b.year.poa, 2495.5552, 2e-4));
  const c = one(12.97, 77.59, 10, 90);
  check('pv: 12.97 N east-facing GHI 2618.07, POA 2587.38 kWh/m² (pvlib)', rel(c.year.ghi, 2618.0733, 2e-4) && rel(c.year.poa, 2587.3776, 2e-4));
  // Sun position against astronomy-engine (geometric, no refraction).
  let worst = 0;
  for (const [lat, lon, iso] of [[43.7, -79.4, '2025-06-21T17:00:00Z'], [-33.9, 151.2, '2025-03-10T02:30:00Z'], [51.5, 0, '2025-12-21T12:00:00Z'], [12.97, 77.59, '2025-09-01T08:15:00Z']]) {
    const t = new Date(iso), s = sunPosition(t.getTime(), lat, lon), o = new Astro.Observer(lat, lon, 0), eq = Astro.Equator(Astro.Body.Sun, t, o, true, true), h = Astro.Horizon(t, o, eq.ra, eq.dec);
    worst = Math.max(worst, Math.abs(90 - s.zenith - h.altitude), Math.abs(((s.azimuth - h.azimuth + 540) % 360) - 180));
  }
  check(`pv: sun position within 0.02° of astronomy-engine (worst ${worst.toFixed(4)}°)`, worst < 0.02);
  check('pv: Haurwitz at zenith 0 = 1098 e^−0.059', Math.abs(haurwitz(0) - 1098 * Math.exp(-0.059)) < 1e-9 && haurwitz(95) === 0);
  { const e = erbs(800, 30, 172); check('pv: Erbs closes GHI = DNI cos Z + DHI', Math.abs(e.dni * Math.cos(Math.PI / 6) + e.dhi - 800) < 1e-9 && e.kt > 0.6 && e.kt < 0.7); }
  check('pv: extraterrestrial irradiance peaks in early January', extraterrestrial(3) > extraterrestrial(185) && rel(extraterrestrial(3), 1366.1 * 1.0342, 2e-3));
  { const p = poaIsotropic(0, 180, 40, 120, 700, 100, 636.2, 0.2); check('pv: flat panel POA = GHI', Math.abs(p.poa - (700 * Math.cos(40 * Math.PI / 180) + 100)) < 1e-9 && p.ground === 0); }
  { const p = poaIsotropic(90, 180, 60, 180, 500, 100, 350, 0.2); check('pv: vertical panel gets half the sky and half the ground', Math.abs(p.sky - 50) < 1e-9 && Math.abs(p.ground - 35) < 1e-9); }
  const hrs = clearSkyYear(43.7, -79.4), bt = bestTilt(hrs, { az: 180, albedo: 0.2, kWp: 1, losses: 0, cloud: Array(12).fill(1) });
  check('pv: best tilt at 43.7 N facing south 36.4°', Math.abs(bt.best.tilt - 36.4) < 0.15 && bt.curve.length === 91);
  const y = yieldOf(hrs, { tilt: 35, az: 180, albedo: 0.2, kWp: 5, losses: 0.14, cloud: Array(12).fill(0.65) });
  check('pv: energy = kWp × (1 − losses) × sunshine × POA', rel(y.year.energy, 5 * 0.86 * 0.65 * a.year.poa, 1e-12) && rel(y.capacityFactor, y.year.energy / (5 * 8760), 1e-12));
};
