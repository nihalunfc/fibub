// #1447 lac operon. The switch table checked by hand against the textbook rules (repressor, inducer, i⁻ and Oᶜ
// mutants, CAP); the time course (RK4, dt 0.5 min) checked against scipy solve_ivp (LSODA, rtol 1e-10) at 6 times.
import * as L from '../../src/lib/sci/lacoperon.ts';
const PY = {"2,2,none,cap":[[1.063187565,0.220500328,9.0718e-05,4e-09,0.0,-0.0],[1.914085911,1.711962663,0.641351174,0.002868487,4.2537e-05,1.9366e-05],[0.063285139,0.175901898,1.274885782,0.942300101,0.14918229,0.041806374]],"0,2,none,basic":[[0.0,0.0,0.0,0.0,0.0,0.0],[0.435202938,0.00114445,6.9797e-05,2.3032e-05,1.0933e-05,7.963e-06],[1.571015966,0.871078265,0.33627317,0.139511219,0.040497448,0.027097368]],"0,0,i-,basic":[[0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0],[1.589498383,2.165045174,2.376777006,2.454668794,2.493865088,2.49916973]],"2,0,none,cap":[[1.063187566,0.220500329,9.0718e-05,4e-09,-0.0,-0.0],[0.0,0.0,0.0,0.0,0.0,0.0],[0.009739274,0.005113811,0.014098579,0.020987738,0.024456999,0.024926513]]};
const TS = [50, 100, 150, 200, 300, 400];
export default async (check) => {
  const e = (l, g, m, lv) => L.state(l, g, m, lv).expression;
  check('lac: repressor switch', e(false, false) === 'off' && e(true, false) === 'on' && e(true, true) === 'on' && e(false, true) === 'off');
  check('lac: mutants', e(false, false, 'i-') === 'on' && e(false, false, 'oc') === 'on' && L.state(false, false, 'i-').repressorMade === false && L.state(false, false, 'oc').repressorActive === true);
  check('lac: CAP extension', e(true, false, 'none', 'cap') === 'high' && e(true, true, 'none', 'cap') === 'low' && e(false, false, 'none', 'cap') === 'off');
  let ok = true, worst = 0;
  for (const [key, ys] of Object.entries(PY)) {
    const [G0, L0, m, lv] = key.split(','), s = L.simulate(Number(G0), Number(L0), m, lv);
    TS.forEach((t, j) => { const i = t * 2; [s.glucose[i], s.lactose[i], s.enzyme[i]].forEach((v, k) => { const d = Math.abs(v - Math.max(0, ys[k][j])); worst = Math.max(worst, d); if (d > 1e-4) ok = false; }); });
  }
  check(`lac: time course equals scipy solve_ivp (worst ${worst.toExponential(1)})`, ok);
  const d = L.simulate(2, 2, 'none', 'cap');
  check('lac: glucose is used before lactose (diauxie)', L.timeBelow(d.t, d.glucose, 0.05) < L.timeBelow(d.t, d.lactose, 1));
  let bad = 0; try { L.simulate(-1, 0, 'none', 'basic'); } catch { bad++; } check('lac: bad input refused', bad === 1);
};
