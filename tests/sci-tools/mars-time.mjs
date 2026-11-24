// #T53 Mars time. The Allison and McEwen (2000) worked example and the Curiosity sol checks live in tests/sci.mjs; the
// cases below pin the numbers published in
// src/blog/discoveries/mars-express-water-ice-diurnal-cycle-mars-year-solar-longitude.md: the two ends of the Mars
// Express PFS dataset, the length of the Ls 45 to 150 window in each of Mars Years 27 to 34, and the equation of time.
import { marsTime, lsTime } from '../../src/lib/sci/marstime.ts';
const day = (ms) => new Date(ms).toISOString().slice(0, 10);
export default async (check) => {
  check('mars time: Mars Year 27 reaches Ls 64 on 2004-07-22 and Mars Year 34 reaches Ls 315 on 2018-12-29',
    day(lsTime(27, 64)) === '2004-07-22' && day(lsTime(34, 315)) === '2018-12-29');
  const windows = [];
  for (let my = 27; my <= 34; my++) windows.push((lsTime(my, 150) - lsTime(my, 45)) / 864e5);
  check('mars time: the Ls 45 to 150 window lasts 230.3 Earth days in every Mars Year from 27 to 34',
    windows.every((d) => Math.abs(d - 230.25) < 0.1));
  check('mars time: aphelion at Ls 71 is 1.666 AU and perihelion at Ls 251 is 1.381 AU',
    Math.abs(marsTime(lsTime(34, 71)).r - 1.666) < 5e-4 && Math.abs(marsTime(lsTime(34, 251)).r - 1.3814) < 5e-4);
  let lo = 1e9, hi = -1e9;
  for (let ls = 0; ls < 360; ls += 0.5) { const e = marsTime(lsTime(34, ls)).eot * 4; if (e < lo) lo = e; if (e > hi) hi = e; }
  check('mars time: the equation of time runs from -51.0 to +40.0 minutes', Math.abs(lo + 51.0) < 0.1 && Math.abs(hi - 40.0) < 0.1);
  check('mars time: the subsolar latitude stays inside the cloud belt through Ls 45 to 150',
    [45, 90, 150].every((ls) => { const d = marsTime(lsTime(34, ls)).decl; return d > 12 && d < 26; }));
};
