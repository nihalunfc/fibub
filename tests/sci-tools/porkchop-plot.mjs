// #T63 Porkchop plot. References: the Lambert and Mars-2020 checks live in tests/sci.mjs; the cases below pin the
// numbers published in src/blog/discoveries/mars-sample-return-2029-launch-window-c3-porkchop.md, all recomputed from
// the planets' positions (no fitting). Earth-to-Mars window either side of the turn of 2029, and the Mars ascent burn.
import { leg, burnFromOrbit } from '../../src/lib/astro/porkchop.ts';
const DAY = 864e5;
const bestAt = (ms) => { let b = null; for (let t = 150; t <= 420; t += 5) { const l = leg('Earth', 'Mars', ms, t); if (l && (!b || l.c3 < b.c3)) b = l; } return b; };
export default async (check) => {
  let best = null;
  for (let t = Date.UTC(2028, 8, 1); t <= Date.UTC(2029, 6, 1); t += 2 * DAY) { const b = bestAt(t); if (b && (!best || b.c3 < best.c3)) best = b; }
  const d = new Date(best.dep);
  check('porkchop: late-2028 Earth-Mars window bottoms out on 30 November 2028 at C3 9.00, 315 days, arrival v-infinity 3.17 km/s',
    d.getUTCFullYear() === 2028 && d.getUTCMonth() === 10 && d.getUTCDate() === 30 && Math.abs(best.c3 - 9.00) < 0.02 && best.tof === 315 && Math.abs(best.vinfArr - 3.17) < 0.02);
  const jun = bestAt(Date.UTC(2029, 5, 15));
  check('porkchop: the best C3 on 15 June 2029 is 39.0 km2/s2, far outside the window', Math.abs(jun.c3 - 39.0) < 0.1 && Math.abs(jun.vinfArr - 8.40) < 0.02);
  check('porkchop: one burn from a 200 km Mars orbit is 1.429 km/s to escape and 2.151 km/s to v-infinity 2.75 km/s',
    Math.abs(burnFromOrbit('Mars', 0, 200) - 1.429) < 5e-4 && Math.abs(burnFromOrbit('Mars', 2.75, 200) - 2.151) < 5e-4);
  check('porkchop: an Earth departure at C3 39 costs 4.87 km/s from a 200 km orbit, against 3.63 km/s at C3 9.00',
    Math.abs(burnFromOrbit('Earth', Math.sqrt(39.0), 200) - 4.871) < 2e-3 && Math.abs(burnFromOrbit('Earth', 3.0, 200) - 3.626) < 2e-3);
};
