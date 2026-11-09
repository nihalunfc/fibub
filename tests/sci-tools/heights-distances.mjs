// #1154 Heights and distances. Checked against hand-worked exact answers (e.g. two observers 20 m apart seeing a
// tower at 60° and 30° gives h = 10√3 ≈ 17.32 m, the near one 10 m away) and by putting each answer back in.
import { oneObserver, twoObservers, depression } from '../../src/lib/sci/heights-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('one: d = 30, 60° → h = 30√3', near(oneObserver('height', { d: 30, angle: 60 }).h, 30 * Math.sqrt(3)));
  check('one: eye height 1.5 adds on', near(oneObserver('height', { d: 20, angle: 45, e: 1.5 }).h, 21.5));
  check('one: h = 50, 30° → d = 50√3', near(oneObserver('distance', { h: 50, angle: 30 }).d, 50 * Math.sqrt(3)));
  check('one: h = 10, d = 10 → 45°', near(oneObserver('angle', { h: 10, d: 10 }).angle, 45));
  check('one: h = 11.5, d = 10, e = 1.5 → 45°', near(oneObserver('angle', { h: 11.5, d: 10, e: 1.5 }).angle, 45));
  const t = twoObservers(60, 30, 20, true);
  check('two same side: 60°, 30°, 20 m → h = 10√3, near 10 m, far 30 m', near(t.h, 10 * Math.sqrt(3)) && near(t.x1, 10) && near(t.x2, 30));
  check('two same side: near angle must be bigger', twoObservers(30, 60, 20, true) === null && twoObservers(40, 40, 20, true) === null);
  const o = twoObservers(60, 30, 80, false);
  check('two opposite sides: 60°, 30°, 80 m → h = 20√3, 20 m and 60 m', near(o.h, 20 * Math.sqrt(3)) && near(o.x1, 20) && near(o.x2, 60) && near(o.x1 + o.x2, 80));
  check('two opposite: 45°, 45°, 10 m → 5 m', near(twoObservers(45, 45, 10, false).h, 5));
  check('depression: 75 m cliff, 30° → 75√3', near(depression(75, 30), 75 * Math.sqrt(3)) && near(depression(10, 45), 10));
  let ok = true;
  for (let a = 5; a < 89; a += 7) for (let b = 2; b < a; b += 9) { const r = twoObservers(a, b, 13, true); if (!near(Math.atan(r.h / r.x1) * 180 / Math.PI, a, 1e-9) || !near(r.x2 - r.x1, 13)) ok = false; }
  check('two same side: answers put back give the angles and the gap', ok);
};
