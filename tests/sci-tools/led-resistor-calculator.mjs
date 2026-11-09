// #626 LED resistor calculator. R = (Vs − n Vf)/I and the powers checked against an independent Python sum, and
// the E-series choices against a Python search of the IEC 60063 E24/E12 lists.
import * as L from '../../src/lib/sci/eng-led.ts';
export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t;
  const d = L.design(12, 3, 0.02, 3, 4);
  check('led: 3 × 3 V LEDs on 12 V at 20 mA need 150 Ω', near(d.r, 150));
  check('led: powers for 4 strings vs Python (0.24 W, 0.72 W, 0.96 W)', near(d.pR, 0.24) && near(d.pLed, 0.72) && near(d.pTotal, 0.96) && near(d.iTotal, 0.08) && near(d.eff, 0.75));
  { const p = L.pick(290, 24), q = L.pick(290, 12); check('led: 290 Ω → E24 300 above and nearest; E12 330 above, 270 nearest', p.above === 300 && p.nearest === 300 && q.above === 330 && q.nearest === 270); }
  check('led: current with a chosen resistor', near(L.currentWith(5, 2.1, 1, 300), 2.9 / 300) && L.currentWith(5, 3, 2, 100) === 0);
  { const s = L.spread(12, 3, 3, 150, 0.1, 0.6); check('led: current spread for Vf ± 0.1 V and supply ± 5 % vs Python (14 to 26 mA)', near(s.lo, 0.014, 1e-15) && near(s.hi, 0.026, 1e-15)); }
  check('led: at most 3 white LEDs per string on 12 V with 10 % headroom', L.maxPerString(12, 3) === 3 && L.maxPerString(24, 3) === 7 && L.maxPerString(5, 2) === 2);
  check('led: 10 LEDs in strings of 3 → 3, 3, 2, 2', L.layout(10, 3).sizes.join() === '3,3,2,2' && L.layout(9, 3).strings === 3);
  check('led: resistor rating with 2× margin', L.rating(0.06) === 0.125 && L.rating(0.24) === 0.5 && L.rating(0.4) === 1);
  let m = ''; try { L.design(5, 3, 0.02, 2); } catch (e) { m = e.message; } check('led: too many LEDs for the supply', m.includes('more than the 5 V supply'));
};
