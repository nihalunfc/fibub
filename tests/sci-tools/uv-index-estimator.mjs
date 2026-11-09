// #504 UV index estimator. Checked against an independent NumPy version of the Madronich formula with the Sun's
// zenith from pvlib's NREL SPA and from pysolar (400 random places and times, 1990–2059), the Earth–Sun distance
// from pvlib, and 40 random days on a 10-second grid (peak, solar noon against pvlib's transit, daily dose by
// trapezoid, hours above 3/6/8/11, minutes to a dose by cumulative sum): 2,091 checks, 0 failed.
import { julianDay, sunPosition, uvIndex, dayCurve, minutesToDoseFrom, minutesToDose, band, clock, DEFAULT_MODEL } from '../../src/lib/sci/uvindex.ts';

export default async (check) => {
  const close = (a, b, t) => Math.abs(a - b) <= t;
  check('Julian day: J2000.0 = 2451545.0', julianDay(2000, 1, 1, 12) === 2451545);
  // Meeus, Astronomical Algorithms, examples 25.a and 28.b: 1992 October 13.0, declination −7.78507°,
  // R = 0.99766 AU, equation of time 13 min 42.6 s.
  const m = sunPosition(julianDay(1992, 10, 13, 0), 0, 0);
  check('Sun: Meeus 25.a declination −7.785°', close(m.decl, -7.78507, 0.002));
  check('Sun: Meeus 25.a distance 0.99766 AU', close(m.r, 0.99766, 2e-5));
  check('Sun: Meeus 28.b equation of time 13.71 min', close(m.eotMin, 13.71, 0.02));
  // At the equator at an equinox noon the Sun is almost overhead.
  const eq = sunPosition(julianDay(2026, 3, 20, 12), 0, 0);
  check('Sun: equinox noon at 0°, 0° is within 3° of overhead', eq.zenith < 3);

  // Madronich (2007): UVI = 12.5 μ^2.42 (Ω/300)^−1.23.
  const base = { ...DEFAULT_MODEL, distance: false };
  check('UVI: Sun overhead, 300 DU → 12.5', close(uvIndex(1, 1, base).total, 12.5, 1e-12));
  check('UVI: zenith 30°, 300 DU → 12.5 · cos30°^2.42', close(uvIndex(Math.cos(Math.PI / 6), 1, base).total, 12.5 * Math.cos(Math.PI / 6) ** 2.42, 1e-12));
  check('UVI: 10 % less ozone gives (0.9)^−1.23 = +13.8 %', close(uvIndex(1, 1, { ...base, ozone: 270 }).total / 12.5, 0.9 ** -1.23, 1e-12));
  check('UVI: Sun below the horizon → 0', uvIndex(-0.1, 1, base).total === 0);
  const all = uvIndex(1, 0.983, { ...base, altKm: 2, perKm: 0.07, albedo: 0.9, skyRefl: 0.3, cmf: 0.6, distance: true });
  check('UVI: factors multiply (height, snow, cloud, distance)', close(all.total, 12.5 * 1.14 * (1 / (1 - 0.27)) * 0.6 / 0.983 ** 2, 1e-9) && close(all.ground, 1 / 0.73, 1e-12));

  check('dose: 1 SED at UVI 4 takes 100 / (4 × 0.025 × 60) = 16.7 min', close(minutesToDose(4, 1), 100 / 6, 1e-9) && minutesToDose(0, 1) === Infinity);
  check('bands: WHO 0–2 low, 3–5 moderate, 6–7 high, 8–10 very high, 11+ extreme',
    band(2.94).name === 'Low' && band(2.96).name === 'Moderate' && band(5.9).name === 'Moderate' && band(6).name === 'High' && band(8).name === 'Very high' && band(10.9).name === 'Very high' && band(11).name === 'Extreme');

  // The page's example: Toronto, 21 June 2026, UTC−4, 300 DU, sea level.
  const c = dayCurve(2026, 6, 21, { lat: 43.65, lon: -79.38, utcOffset: -4 }, DEFAULT_MODEL);
  check('day: solar noon 13:19 in Toronto (EDT)', clock(c.noon) === '13:19');
  check('day: peak 10.4 at 20.2° zenith', close(c.peak.uvi, 10.378, 0.001) && close(c.peak.zenith, 20.21, 0.01));
  check('day: the minute grid never beats the noon peak', Math.max(...c.uvi) <= c.peak.uvi + 1e-9);
  check('day: daily dose about 62.9 SED', close(c.doseJ / 100, 62.92, 0.01));
  check('day: UVI 3 or more from 09:02 to 17:37', clock(c.above[0].from) === '09:02' && clock(c.above[0].to) === '17:37' && close(c.above[0].hours, 8.581, 0.01));
  check('day: never extreme', c.above[3].hours === 0 && Number.isNaN(c.above[3].from));
  check('dose from 11:00: 1 SED in 8.7 min (slower than at the noon peak)', close(minutesToDoseFrom(c, 11, 1), 8.735, 0.01) && minutesToDoseFrom(c, 11, 1) > minutesToDose(c.peak.uvi, 1));
  check('dose from 20:00 never reached', minutesToDoseFrom(c, 20, 1) === Infinity);
  // Polar night: no UV all day.
  const pn = dayCurve(2026, 12, 21, { lat: 78, lon: 15, utcOffset: 1 }, DEFAULT_MODEL);
  check('day: polar night gives 0 all day', pn.peak.uvi === 0 && pn.doseJ === 0);
  check('clock: 24 h wraps, NaN shows a dash', clock(23.9999) === '00:00' && clock(NaN) === '–' && clock(9.5) === '09:30');
};
