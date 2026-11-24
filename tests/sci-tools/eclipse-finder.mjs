// #T65 Eclipse finder: the 8 April 2024 total solar eclipse as the VLF station of Sanyal et al. (2025),
// Atmosphere 16(2): 161, saw it (36.99 N, 76.95 W, 30 m). The paper states first contact 18:02:53,
// maximum 19:19:19 and last contact 20:31:48 UT, with an eclipse magnitude of 0.834.
import { solarEclipses, sunMoon, overlap } from '../../src/lib/astro/eclipses.ts';

export default async (check) => {
  const near = (got, want, tol) => Number.isFinite(got) && Math.abs(got - want) <= tol;
  const SITE = { name: 'VLF station', lat: 36.99, lon: -76.95, elev: 30, tz: 'UTC' };
  const [e] = solarEclipses(SITE, Date.UTC(2024, 3, 1), Date.UTC(2024, 3, 30));
  const sec = (iso) => Date.parse(`2024-04-08T${iso}Z`);
  check('eclipses: 8 April 2024 was partial in southeastern Virginia and total elsewhere', e.kind === 'partial' && e.globalKind === 'total');
  check('eclipses: its three contact times land within 5 s of the published ones', ['18:02:53', '19:19:19', '20:31:48'].every((t, i) => near([e.begin, e.peak, e.end][i].getTime(), sec(t), 5000)));
  check('eclipses: the magnitude is the published 0.834', near(e.magnitude, 0.834, 0.001));
  check('eclipses: 83.4 % of the diameter is only 80.08 % of the area', near(e.obscuration * 100, 80.08, 0.05) && e.obscuration < e.magnitude);
  check('eclipses: the Sun was 48.4 degrees up and the eclipse lasted 148.9 minutes', near(e.altPeak, 48.39, 0.05) && near((e.end - e.begin) / 60e3, 148.9, 0.1));
  check('eclipses: greatest eclipse on Earth was over Durango, Mexico', near(e.greatest.lat, 25.29, 0.05) && near(e.greatest.lon, -104.14, 0.05));
  // Along the station's meridian the covered area climbs to totality near 43 to 44 degrees north.
  const at = (lat) => solarEclipses({ ...SITE, lat }, Date.UTC(2024, 3, 1), Date.UTC(2024, 3, 30))[0];
  check('eclipses: 54.5 % covered at 30 N, 91.3 % at 40 N, total at 43 N on the same meridian', near(at(30).obscuration * 100, 54.5, 0.1) && near(at(40).obscuration * 100, 91.3, 0.1) && at(43).kind === 'total');
  const sm = sunMoon(SITE, e.peak);
  check('eclipses: the disc overlap at maximum agrees with the reported obscuration to 0.1 %', near(overlap(sm.rSun, sm.rMoon, Math.hypot(sm.east, sm.north)), e.obscuration, 1e-3));
};
