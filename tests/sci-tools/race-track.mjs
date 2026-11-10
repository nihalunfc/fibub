// #1247 Time, speed and distance race track. Checked against hand-worked relative-speed examples.
import { kmhToMs, msToKmh, positions, finishTimes, meet } from '../../src/lib/sci/race-track.ts';

const near = (a, b) => Math.abs(a - b) < 1e-9;
export default async (check) => {
  check('36 km/h = 10 m/s; 5 m/s = 18 km/h', near(kmhToMs(36), 10) && near(msToKmh(5), 18));
  const same = { length: 400, vA: 8, vB: 6, head: 40, towards: false };
  const m = meet(same);
  check('same way: 40 m head start, 8 vs 6 m/s → catch up after 20 s at 160 m', m && near(m.t, 20) && near(m.at, 160) && near(m.rel, 2));
  check('positions at 20 s are equal', near(positions(same, 20)[0], positions(same, 20)[1]));
  check('finish times: A 50 s, B 60 s', near(finishTimes(same)[0], 50) && near(finishTimes(same)[1], 60));
  check('A slower never catches up', meet({ ...same, vA: 5 }) === null);
  check('catch-up after the finish line does not count', meet({ length: 400, vA: 8, vB: 7, head: 100, towards: false }) === null);
  const tw = { length: 600, vA: 7, vB: 5, head: 0, towards: true }, m2 = meet(tw);
  check('towards each other: 600 m at 7 + 5 m/s → 50 s, at 350 m', m2 && near(m2.t, 50) && near(m2.at, 350) && near(positions(tw, 50)[1], 350));
  check('runners stop at their finish line', positions(tw, 1000)[0] === 600 && positions(tw, 1000)[1] === 0);
};
