// #1373 radian ruler. Conversions checked against Python's math.radians/math.degrees and sympy's nsimplify(deg/180)
// for the π forms; arc length and sector area against s = rθ and A = ½r²θ worked by hand.
import * as R from '../../src/lib/sci/school-radian.ts';
const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t;
export default async (check) => {
  check('radian: 180° = π, 1 rad = 57.2958°', near(R.toRad(180), Math.PI) && near(R.toDeg(1), 57.29577951308232));
  const forms = [[135, '3π/4'], [30, 'π/6'], [360, '2π'], [180, 'π'], [270, '3π/2'], [-45, '−π/4'], [22.5, 'π/8'], [1, 'π/180'], [0, '0'], [520, '26π/9']];
  check('radian: π forms (sympy nsimplify)', forms.every(([d, s]) => R.piForm(d) === s));
  check('radian: 10.3° has no simple π form', R.piForm(10.3) === null);
  check('radian: reads 3pi/4, 3π/4, pi, -pi/2, 2.5', near(R.readRad('3pi/4'), 3 * Math.PI / 4) && near(R.readRad('3π/4'), 3 * Math.PI / 4) && near(R.readRad('pi'), Math.PI) && near(R.readRad('-pi/2'), -Math.PI / 2) && R.readRad('2.5') === 2.5);
  check('radian: rejects junk', Number.isNaN(R.readRad('abc')) && Number.isNaN(R.readRad('')));
  check('radian: 40° 20′ = 40.3333°', near(R.dms(40, 20), 40 + 1 / 3));
  check('radian: arc of r = 5 over π/3 is 5.236, sector 13.09', near(R.arc(5, Math.PI / 3), 5.235987755982988) && near(R.sector(5, Math.PI / 3), 13.089969389957471));
};
