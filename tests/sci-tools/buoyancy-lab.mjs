// #1345 buoyancy: a floating block's weight equals its upthrust, a 10 cm pine cube floats half under, ice in sea
// water about 90 % under, the push to sink it is the extra upthrust, a sinking block's balance reading equals
// weight − upthrust, and relative density comes back from the readings.
import { cube, relativeDensity, OBJECTS, LIQUIDS, questions } from '../../src/lib/sci/buoyancy.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const w = cube(0.1, 500, 1000);
  check('buoyancy-lab: 10 cm pine cube floats half under; weight 4.9 N = upthrust', w.floats && near(w.floatFrac, 0.5, 1e-12) && near(w.weight, 4.9, 1e-12) && near(w.upthrust, 4.9, 1e-12) && w.push === 0 && near(w.displacedMl, 500, 1e-9));
  check('buoyancy-lab: ice in sea water 89.76 % under', near(cube(0.1, 920, 1025).floatFrac, 0.89756, 1e-5));
  check('buoyancy-lab: holding the pine cube fully under takes 4.9 N', near(cube(0.1, 500, 1000, 1).push, 4.9, 1e-12));
  const fe = cube(0.1, 7900, 1000);
  check('buoyancy-lab: 10 cm iron cube: weight 77.42 N, balance 67.62 N, RD 7.9', !fe.floats && near(fe.weight, 77.42, 1e-9) && near(fe.balance, 67.62, 1e-9) && near(relativeDensity(fe.weight, fe.balance), 7.9, 1e-9));
  check('buoyancy-lab: iron floats on mercury', cube(0.1, 7900, 13600).floats);
  let ok = true; const r = seeded(23); for (let i = 0; i < 300; i++) { const a = 0.01 + r() * 0.3, rho = 100 + r() * 9000, s = 700 + r() * 13000, p = r(), c = cube(a, rho, s, p); if (c.floats ? !near(c.upthrust - c.push, c.weight, 1e-9 * c.weight) : !near(c.balance + c.upthrust, c.weight, 1e-9 * c.weight)) ok = false; }
  check('buoyancy-lab: 300 random cases: forces balance', ok);
  let qok = true; for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0))) qok = false; }
  check('buoyancy-lab: questions', qok && OBJECTS.length === 6 && LIQUIDS.length === 5);
};
