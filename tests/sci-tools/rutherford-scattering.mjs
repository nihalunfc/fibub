// #1069 rutherford-scattering: the analytic Rutherford formulas checked against Python and against a step-by-step
// integration of the Coulomb path.
import { headOn, angleFromB, bFromAngle, closest, path } from '../../src/lib/sci/learnrutherford.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('ruth: 5 MeV alpha on gold: d = 45.503 fm', near(headOn(79, 5), 45.50287756800001));
  check('ruth: 7.7 MeV alpha on gold: d = 29.547 fm', near(headOn(79, 7.7), 29.547323096103904));
  check('ruth: b = d/2 gives 90°', near(angleFromB(0.5, 1), Math.PI / 2));
  check('ruth: b = 0 gives 180°', near(angleFromB(1e-12, 1), Math.PI, 1e-9));
  check('ruth: b from angle inverts', near(bFromAngle(angleFromB(0.37, 1), 1), 0.37));
  check('ruth: r_min for b = 0 is d', near(closest(0, 1), 1));
  check('ruth: r_min for b = 1, d = 1 is 1.618', near(closest(1, 1), 1.618033988749895));
  for (const b of [0.2, 0.5, 1, 3]) {
    const p = path(b), th = angleFromB(b, 1);
    check(`ruth: integrated angle for b = ${b}d matches 2 atan(d/2b) = ${(th * 180 / Math.PI).toFixed(2)}° (got ${(p.angle * 180 / Math.PI).toFixed(2)}°)`, Math.abs(p.angle - th) < 0.002);
    check(`ruth: integrated closest approach for b = ${b}d matches`, Math.abs(p.rmin - closest(b, 1)) < 0.01 * closest(b, 1));
    check(`ruth: speed back to the start far away (energy kept), b = ${b}`, Math.abs(p.speed - Math.sqrt(1 - 1 / p.end)) < 1e-4);
  }
};
