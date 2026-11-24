// #T14 Target altitude planner: the altitude, airmass and meridian numbers the planner shows, pinned against
// fibub's shared observing maths (src/lib/sci/airmass.ts: astronomy-engine positions, Kasten-Young airmass),
// which is itself checked against astropy 8.0 in tests/sci-tools/batch-airmass.mjs.
// The planner's own module (src/lib/astro/sky.ts) imports its neighbours without file endings and a JSON
// catalogue, which plain Node cannot load, so the same positions are taken from the shared module here.
import * as M from '../../src/lib/sci/airmass.ts';
import * as A from 'astronomy-engine';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) < tol;
  // The (28978) Ixion occultation campaign of Kilic et al. (2026), A&A 707: A70 (CC BY 4.0), used in
  // /blog/discoveries/ixion-stellar-occultation-station-altitude-airmass-planning/.
  const CTIO = { lat: -30.169, lon: -70.806, elev: 2200 }, NAPER = { lat: 41.785, lon: -88.147, elev: 215 };
  const YASS = { lat: -34.84, lon: 148.91, elev: 520 }, OPD = { lat: -22.535, lon: -45.583, elev: 1864 };
  const star = M.parseTargets('Ixion star, 18 05 34.6814, -30 09 09.703').targets[0];
  const t = new Date('2021-04-28T07:35:37Z');
  const at = (site) => { const h = M.altAz(star.ra, star.dec, t, new A.Observer(site.lat, site.lon, site.elev), true); return { alt: h.alt, X: M.airmass(h.alt, 'ky') }; };
  const chile = at(CTIO), illinois = at(NAPER);
  check('object altitude: Ixion star of 28 Apr 2021 is 79.51° up (airmass 1.0166) from Cerro Tololo and 13.17° (airmass 4.314) from Naperville at 07:35:37 UT',
    near(star.ra, 271.394505833, 1e-8) && near(star.dec, -30.152695277, 1e-8)
    && near(chile.alt, 79.5116, 2e-3) && near(chile.X, 1.016632, 1e-5)
    && near(illinois.alt, 13.1678, 2e-3) && near(illinois.X, 4.31399, 2e-3));
  const p = M.plan(star, CTIO, new Date('2021-04-27T22:00:00Z'), new Date('2021-04-28T11:00:00Z'), { formula: 'ky', refraction: true, limit: 2, stepMin: 30 });
  check('object altitude: the same star transits within 0.02° of the zenith at Cerro Tololo, at 08:24:02 UT, and never leaves airmass 1.00',
    Math.abs(p.transit.getTime() - Date.parse('2021-04-28T08:24:02Z')) < 3000 && near(p.transitAlt, 89.98, 0.02) && near(p.bestX, 1.0, 1e-3));
  const q = M.plan(star, NAPER, new Date('2021-04-27T22:00:00Z'), new Date('2021-04-28T11:00:00Z'), { formula: 'ky', refraction: true, limit: 2, stepMin: 30 });
  check('object altitude: from Naperville the same star peaks at 18.12° and spends no time at airmass 2 or better',
    near(q.transitAlt, 18.12, 0.02) && q.hoursBelow === 0 && near(q.bestX, 3.188, 2e-3));
  // The 2 June 2022 event: only Australia could see it.
  const star2 = M.parseTargets('Ixion star 2, 18 09 36.9353, -30 43 37.051').targets[0], t2 = new Date('2022-06-02T18:09:33Z');
  const alt2 = (site) => M.altAz(star2.ra, star2.dec, t2, new A.Observer(site.lat, site.lon, site.elev), true).alt;
  check('object altitude: the 2 June 2022 Ixion star is 56.58° up from New South Wales and more than 25° below the horizon from Chile, Brazil and Illinois',
    near(alt2(YASS), 56.580, 0.03) && alt2(CTIO) < -25 && alt2(OPD) < -25 && alt2(NAPER) < -25 && M.airmass(alt2(YASS), 'ky') < 1.21);
};
