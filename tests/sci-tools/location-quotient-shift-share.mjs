// Location quotients, shift-share and economic base, checked against pandas/numpy on a made-up region
// (scratch script lq_check.py, 2026-11-09).
import { analyse } from '../../src/lib/sci/lq.ts';

export default async (check) => {
  const raw = [
    ['Farming and fishing', 1800, 1500, 240000, 210000],
    ['Mining and quarrying', 950, 1200, 60000, 52000],
    ['Manufacturing', 8200, 7600, 1100000, 1020000],
    ['Construction', 3100, 3900, 520000, 610000],
    ['Retail and wholesale', 6400, 6900, 1250000, 1300000],
    ['Health and social care', 5200, 6800, 980000, 1210000],
    ['Tourism and hospitality', 4300, 5600, 540000, 600000],
    ['Professional services', 2900, 3500, 860000, 1050000],
    ['Public administration', 2100, 2200, 410000, 420000],
  ];
  const rows = raw.map(([name, r0, r1, n0, n1]) => ({ name, r0, r1, n0, n1 }));
  const py = {
    lq0: [1.2789699570815452, 2.700047687172151, 1.2712186240083236, 1.0166171453725104, 0.8731101573676681, 0.9048494934454467, 1.3579187198643567, 0.5750407558971288, 0.873442897519104],
    lq1: [1.1793002915451896, 3.8100470957613815, 1.230172068827531, 1.055570424891268, 0.8763108320251177, 0.9278461797942318, 1.540952380952381, 0.5503401360544218, 0.8648202137998057],
    ns: [154.63087248322148, 81.61073825503357, 704.4295302013423, 266.3087248322148, 549.7986577181209, 446.7114093959732, 369.3959731543625, 249.12751677852353, 180.4026845637584],
    im: [-379.6308724832215, -208.2774049217002, -1300.793166564979, 270.2297367062469, -293.79865771812064, 773.6967538693325, 108.38180462341553, 391.570157640081, -129.1831723686364],
    rs: [-75, 376.6666666666666, -3.63636363636306, 263.4615384615383, 244, 379.59183673469437, 822.2222222222224, -40.69767441860459, 48.78048780487811],
    basic: [228.0593325092707, 885.0432632880099, 1422.0024721878863, 205.3152039555007, 0, 0, 1965.883807169345, 0, 0],
    mult: 8.329253558859065, cs: 0.12005877752831665, G: 0.08590604026845639, basic0: 3924.328859060403,
  };
  const r = analyse(rows);
  const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const all = (k, key) => r.rows.every((x, i) => close(x[key], py[k][i]));
  check('lq: location quotients year 1 match pandas', all('lq0', 'lq0'));
  check('lq: location quotients year 2 match pandas', all('lq1', 'lq1'));
  check('lq: national share matches pandas', all('ns', 'ns') && close(r.G, py.G));
  check('lq: industry mix matches pandas', all('im', 'im'));
  check('lq: regional shift matches pandas', all('rs', 'rs'));
  check('lq: shift-share parts add up to the change', r.rows.every((x) => close(x.ns + x.im + x.rs, x.r1 - x.r0)) && close(r.totals.ns + r.totals.im + r.totals.rs, r.totals.change));
  check('lq: basic jobs (LQ method) match pandas', all('basic', 'basic'));
  check(`lq: economic base multiplier ${r.multiplier.toFixed(3)} = 8.329`, close(r.multiplier, py.mult));
  check('lq: coefficient of specialisation matches numpy', close(r.specialisation, py.cs));
  check('lq: base analysis on year 1 when asked', close(analyse(rows, 0).totals.basic, py.basic0));
  const one = analyse(rows.map((x) => ({ ...x, r1: NaN, n1: NaN })));
  check('lq: one year only gives LQs and base, no shift-share', !one.twoYears && close(one.rows[1].lq0, py.lq0[1]) && Number.isNaN(one.rows[0].ns) && close(one.totals.basic, py.basic0));
  const z = analyse([{ name: 'A', r0: 0, r1: 50, n0: 100, n1: 120 }, { name: 'B', r0: 200, r1: 210, n0: 900, n1: 1000 }]);
  check('lq: new industry (no jobs in year 1) puts all growth in the regional shift', z.rows[0].ns === 0 && z.rows[0].im === 0 && z.rows[0].rs === 50);
  let msg = '';
  try { analyse([{ name: 'A', r0: 10, r1: 10, n0: 0, n1: 5 }, { name: 'B', r0: 1, r1: 1, n0: 5, n1: 5 }]); } catch (e) { msg = e.message; }
  check('lq: regional jobs with no reference jobs are refused', /none in the reference area/.test(msg));
};
