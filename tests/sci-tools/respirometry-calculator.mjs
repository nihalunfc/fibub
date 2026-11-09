// #342 respirometry: flow-through equations checked against an independent NumPy solve of the N2, O2 and CO2
// mass balances (Lighton 2008, ch. 8-10), closed-chamber slope against SciPy linregress, energy by hand.
import * as R from '../../src/lib/sci/respiro.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-8) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const a = R.openBoth(500, 'in', 0.2094, 0.0004, 0.2031, 0.0052);
  check('respirometry: incurrent flow, O2 and CO2 match NumPy mass balance', near(a.vo2, 3.342402425) && near(a.vco2, 2.395073892) && near(a.rq, 0.7165725688) && near(a.fre, 499.0526715));
  const b = R.openBoth(500, 'out', 0.2094, 0.0004, 0.2031, 0.0052);
  check('respirometry: excurrent flow matches NumPy mass balance', near(b.vo2, 3.348747153) && near(b.vco2, 2.399620349) && near(b.fri, 500.9491268));
  const c = R.openBoth(250, 'in', 0.2095, 0, 0.2, 0.008);
  check('respirometry: CO2-free incurrent air', near(c.vo2, 2.46969697) && near(c.vco2, 1.996212121) && near(c.rq, 0.8082822086));
  check('respirometry: CO2 scrubbed, Lighton eq. 10.2 and excurrent form', near(R.openO2(500, 'in', 0.2094, 0.2031).vo2, 3.952817167) && near(R.openO2(500, 'out', 0.2094, 0.2031).vo2, 3.984315710));
  check('respirometry: flow to STPD', near(R.toStpd(500, 22, 99.5), 454.3964084));
  check('respirometry: Weir and Lighton oxycalorific watts', near(R.watts(4, 3.3, 'weir'), 1.353788987) && near(R.watts(4, 3.3, 'lighton'), 1.350686667) && near(R.watts(3, 0, 'fixed', 20.1), 1.005));
  const t = [0, 5, 10, 15, 20, 25, 30], o = [20.90, 20.71, 20.55, 20.33, 20.17, 19.98, 19.80], L = R.line(t, o);
  check('respirometry: closed-chamber slope and R² match SciPy linregress', near(L.slope, -0.03671428571) && near(L.r2, 0.9992284418));
  check('respirometry: closed air chamber VO2 (STPD, wet air)', near(R.closedAir(L.slope / 100, 960, 20, 101.3, 2.64), 0.3197732430));
  check('respirometry: water vapour at 20 °C within 0.1 % of 2.3393 kPa (IAPWS)', Math.abs(R.waterVapourKPa(20) / 2.3393 - 1) < 1e-3 && Math.abs(R.waterVapourKPa(37) / 6.2803 - 1) < 2e-3);
  check('respirometry: 1 mg O2 = 0.7005 mL STPD; kJ/day', near(R.mgO2toMl(1), 0.7004812801) && near(R.kjPerDay(1), 86.4));
};
