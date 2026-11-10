// #1457 bioreactor. RK4 (dt 0.005 h) checked against scipy.integrate.solve_ivp (LSODA, rtol 1e-10) on the
// same teaching model at 6 and 12 hours, with all loops on and with each loop switched off in turn.
import * as B from '../../src/lib/sci/bioreactor-r.ts';
const near = (a, b, t = 2e-6) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const base = { tempOn: true, tSet: 37, phOn: true, phSet: 7, doOn: true, doSet: 30, stir: 2, S0: 20, X0: 0.1 };
const PY = {
  all: [base, [2.2982842197306335, 15.603431560538676, 37.26403334618823, 6.950811062884311, 58.42882161008804], [10.099999999999987, 0, 36.94029850751829, 6.999884991445719, 99.99933403339674]],
  noT: [{ ...base, tempOn: false }, [2.1394769231812503, 15.921046153637535, 39.50965662236967, 6.9598891719110805, 67.06984241663464], [5.41159156161487, 9.376816876770313, 44.037920219509274, 6.980708564869171, 84.67355509423273]],
  noPH: [{ ...base, phOn: false }, [2.1181040651309537, 15.963791869738152, 37.198580243384725, 6.697284390230354, 66.31886252501738], [6.807199015433685, 6.585601969132689, 37.070977144242825, 5.993920147684963, 82.10227384454129]],
  noDO: [{ ...base, doOn: false }, [2.093150053318111, 16.01369989336387, 37.191798718082524, 6.960281415949585, 24.270144634254763], [7.764826622863608, 4.670346754272889, 37.23018269658651, 6.951480685328991, 3.0279280342840686]],
};
export default async (check) => {
  for (const [name, [s, a6, a12]] of Object.entries(PY)) {
    const r = B.simulate(s), at = (h) => r.t.findIndex((t) => Math.abs(t - h) < 1e-6), got = (i) => [r.X[i], r.S[i], r.T[i], r.pH[i], r.DO[i]];
    check(`bioreactor: ${name} at 6 h and 12 h matches scipy`, got(at(6)).every((v, j) => near(v, a6[j], 1e-5)) && got(at(12)).every((v, j) => near(v, a12[j], 1e-5)));
  }
  const r = B.simulate(base);
  check('bioreactor: yield 0.5 g cells per g sugar (10 g/L made from 20 g/L)', near(r.X[r.X.length - 1], 0.1 + 0.5 * 20, 1e-6));
  check('bioreactor: growth best at 37 °C and pH 7', B.fT(37) === 1 && B.fpH(7) === 1 && B.fT(45) < 0.1);
  check('bioreactor: no sugar, no growth', B.mu(0, 37, 7, 50) === 0);
};
