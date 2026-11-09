// Inflation: checked against pandas 2/3 (pct_change, rebasing, Period and Timestamp day of year) and the closed forms.
import { decimalYear, between, rateFactor, fisher, nominalFor, series } from '../../src/lib/sci/inflation.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('inflation: period labels to decimal years (pandas Period)', decimalYear('2015') === 2015 && near(decimalYear('2015-06'), 2015.4166666666667) && near(decimalYear('Dec 2020'), 2020.9166666666667)
    && near(decimalYear('2020Q3'), 2020.5) && near(decimalYear('Q2 2021'), 2021.25) && near(decimalYear('2024-07-01'), 2024.4972677595629) && near(decimalYear('06/2015'), 2015.4166666666667) && Number.isNaN(decimalYear('2015-13')) && Number.isNaN(decimalYear('soon')));
  const b = between(100, 132.4, 10);
  check('inflation: two index values (cumulative 32.4 %, annual 2.8463 %)', near(b.cumulative, 0.324) && near(b.annual, 0.028463299291188626) && near(100 * b.factor, 132.4));
  check('inflation: constant 2.5 % for 7 years = 1.18869', near(rateFactor(0.025, 7), 1.1886857536682123));
  const f = fisher(0.05, 0.03);
  check('inflation: Fisher exact 1.9417 %, approximate 2 %', near(f.exact, 0.01941747572815533) && near(f.approx, 0.02) && near(nominalFor(f.exact, 0.03), 0.05));
  const cpi = [100.0, 101.2, 103.1, 105.4, 107.2, 108.5, 112.0, 120.3, 125.6, 129.1, 132.4], w = [40000, 40800, 41900, 43000, 44200, 45000, 46100, 48000, 50500, 52600, 54300];
  const pts = cpi.map((c, i) => ({ label: String(2015 + i), t: 2015 + i, cpi: c, nominal: w[i] }));
  const s = series(pts, 5);
  const reb = [92.1658986175, 93.2718894009, 95.0230414747, 97.1428571429, 98.801843318, 100.0, 103.2258064516, 110.8755760369, 115.7603686636, 118.9861751152, 122.0276497696];
  const chg = [0.01200000000000001, 0.018774703557312256, 0.022308438409311515, 0.017077798861480087, 0.012126865671641784, 0.032258064516129004, 0.07410714285714293, 0.044056525353283416, 0.027866242038216527, 0.025561580170410547];
  const real = [43400.0, 43743.08300395257, 44094.568380213386, 44264.70588235294, 44736.00746268657, 45000.0, 44659.375, 43291.770573566086, 43624.60191082803, 44206.816421378775, 44498.11178247734];
  const rch = [0.007905138339920903, 0.008035221848196272, 0.003858468477852206, 0.010647344671989023, 0.0059011197531122495, -0.0075694444444444065, -0.03062300863892331, 0.007688097133758065, 0.013346013145078883, 0.0065893765866771314];
  check('inflation: series rebased to 2020 = 100 (pandas)', s.rows.every((r, i) => near(r.rebased, reb[i], 1e-10)));
  check('inflation: period changes match pandas pct_change', Number.isNaN(s.rows[0].change) && s.rows.slice(1).every((r, i) => near(r.change, chg[i])) && s.rows.slice(1).every((r, i) => near(r.yoy, chg[i])) && s.perYear === 1);
  check('inflation: wages in 2020 prices and real growth (pandas)', s.rows.every((r, i) => near(r.real, real[i])) && s.rows.slice(1).every((r, i) => near(r.realChange, rch[i])));
  check('inflation: series cumulative and annual over 10 years', near(s.cumulative, 0.324) && near(s.annual, 0.028463299291188626) && s.years === 10);
  const mon = Array.from({ length: 25 }, (_, i) => ({ label: `${2020 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`, t: decimalYear(`${2020 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`), cpi: 100 * 1.003 ** i }));
  const sm = series(mon, 0);
  check('inflation: monthly series finds the same month a year earlier', sm.perYear === 12 && Number.isNaN(sm.rows[11].yoy) && near(sm.rows[12].yoy, 1.003 ** 12 - 1) && near(sm.rows[24].yoy, 1.003 ** 12 - 1) && near(sm.annual, 1.003 ** 12 - 1));
};
