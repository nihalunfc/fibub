// #T45 Dark-sky calendar: the yearly and monthly hour budget the calendar shows, pinned to the Dutch sky-quality
// meter network of Shah et al. (2025), MNRAS, doi:10.1093/mnras/staf1200 (CC BY 4.0), used in
// /blog/discoveries/dutch-sky-quality-meter-network-moonless-astronomical-dark-hours/.
import { darkNight, yearDates } from '../../src/lib/astro/darkness.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) < tol;
  const site = { name: 'Lauwersoog', lat: 53.385, lon: 6.235, elev: 0, tz: 'UTC' }; // the paper's Table 1
  let dark21 = 0, free21 = 0;
  for (const iso of yearDates(2021)) { const r = darkNight(site, iso); dark21 += r.darkH; free21 += r.moonFreeH; }
  check('dark-sky calendar: 2021 at Lauwersoog (53.385° N) has 2438 h of astronomical darkness and 1215 h of it Moon-free',
    near(dark21, 2438, 1) && near(free21, 1215, 1));
  check('dark-sky calendar: no astronomical darkness at all on 21 June there, 12.15 h on 21 December',
    darkNight(site, '2021-06-21').darkH === 0 && near(darkNight(site, '2021-12-21').darkH, 12.15, 0.02));
  // The paper's four-year budget: 72.4 % of hours lost to sunlight, 53.8 % of the rest to moonlight.
  let dark = 0, free = 0, hours = 0;
  for (const y of [2020, 2021, 2022, 2023]) for (const iso of yearDates(y)) { const r = darkNight(site, iso); dark += r.darkH; free += r.moonFreeH; hours += 24; }
  check('dark-sky calendar: over 2020-2023, 27.8 % of all hours are astronomically dark (paper: 27.6 %) and 48.9 % of those have no Moon up (paper: 46.2 % with its stricter −3° rule)',
    near((100 * dark) / hours, 27.8, 0.05) && near((100 * free) / dark, 48.9, 0.05));
};
