// #1339 g with height, depth and satellites: checked against hand-worked values (ISS orbit, geostationary height
// 35 786 km, escape speed 11.19 km/s) and the shell theorem limits.
import { PLANETS, planet, g0, gAt, gApproxHeight, orbit, escapeSpeed, stationaryHeight, questions } from '../../src/lib/sci/gravheight.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const e = planet('earth'), near = (a, b, t) => Math.abs(a - b) <= t;
  check('gravity-height-depth: g at Earth surface 9.82 m/s² (GM/R²)', near(g0(e), 9.820, 0.002));
  check('gravity-height-depth: g at h = R is a quarter, at the centre 0, at depth R/2 half', near(gAt(e, e.R), g0(e) / 4, 1e-9) && gAt(e, -e.R) === 0 && near(gAt(e, -e.R / 2), g0(e) / 2, 1e-12));
  check('gravity-height-depth: small-height short cut close at 10 km', Math.abs(gApproxHeight(e, 1e4) - gAt(e, 1e4)) < 1e-4);
  const iss = orbit(e, 400e3);
  check('gravity-height-depth: ISS at 400 km: 7.67 km/s, 92.4 min', near(iss.v, 7673, 3) && near(iss.T / 60, 92.41, 0.05));
  check('gravity-height-depth: geostationary height 35 786 km', near(stationaryHeight(e) / 1000, 35786, 3));
  check('gravity-height-depth: escape speed 11.19 km/s, √2 × orbital speed', near(escapeSpeed(e), 11186, 5) && near(iss.vEsc / iss.v, Math.SQRT2, 1e-12));
  check('gravity-height-depth: energies: KE = −E, PE = 2E', near(iss.ke, -iss.e, 1e-6) && near(iss.pe, 2 * iss.e, 1e-6));
  check('gravity-height-depth: Mars surface g 3.73, areostationary ~17 030 km', near(g0(planet('mars')), 3.728, 0.005) && near(stationaryHeight(planet('mars')) / 1000, 17030, 30));
  let ok = true; const r = seeded(3); for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0) || !Number.isFinite(x.ans))) ok = false; }
  check('gravity-height-depth: questions have positive answers', ok && PLANETS.length === 3);
};
