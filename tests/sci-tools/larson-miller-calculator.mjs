// #849 Larson-Miller calculator: checked against NumPy polyfit and lstsq and SciPy minimize_scalar, Nelder-Mead and
// brentq on the page's made-up creep-rupture and creep-rate data.
import { exampleRupture, exampleNorton, param, logTime, polyfit, fitParam, bestC, bestQ, bestMH, ruptureTime, stressFor, norton } from '../../src/lib/sci/creep.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a / b - 1) <= rel;
  const pts = exampleRupture().map((p) => ({ ...p, T: p.T + 273.15 })), k = { C: 20, Q: 0, Ta: 0, logta: 0 };
  check('creep: example has 12 made-up ruptures', pts.length === 12 && pts[0].t === 3590 && pts[11].t === 41700);
  const lm = fitParam('lm', pts, 2, k);
  check('creep: Larson-Miller quadratic matches numpy polyfit', near(lm.c[0], 26056.089064451, 1e-9) && near(lm.c[1], 1235.75326195835, 1e-8) && near(lm.c[2], -1383.70845386746, 1e-9));
  check('creep: scatter and r² in log t match numpy', near(lm.rms, 0.0767567680809942, 1e-10) && near(lm.r2, 0.98325107096885, 1e-10));
  check('creep: best-fit C matches scipy minimize_scalar', near(bestC(pts, 2), 19.5028141, 2e-7));
  const Q = bestQ(pts, 2), sd = fitParam('sd', pts, 2, { ...k, Q });
  check('creep: Sherby-Dorn best Q and scatter match scipy', near(Q, 417232.144, 1e-6) && near(sd.rms, 0.076871095310661, 1e-9));
  const mh = bestMH(pts, 2), mf = fitParam('mh', pts, 2, { ...k, ...mh });
  check('creep: Manson-Haferd Ta and log ta match scipy Nelder-Mead', near(mh.Ta, 500.81188724, 1e-5) && near(mh.logta, 14.88575021, 1e-6) && near(mf.rms, 0.0748530844092352, 1e-9));
  check('creep: predicted life at 650 °C and 120 MPa', near(ruptureTime(lm, 120, 923.15), 33784.0168533098, 1e-10));
  check('creep: stress for 100 000 h at 600 °C matches brentq', near(stressFor(lm, 1e5, 873.15, 10, 1000), 178.054473311328, 1e-9) && stressFor(lm, 1e5, 873.15, 500, 1000) === null);
  check('creep: parameters invert', ['lm', 'sd', 'mh'].every((m) => { const kk = { C: 20, Q: 3e5, Ta: 400, logta: 15 }; return near(logTime(m, param(m, 900, 1234, kk), 900, kk), Math.log10(1234), 1e-12); }));
  check('creep: LMP of 650 °C for 10 000 h with C = 20 is 22 155.6', near(param('lm', 923.15, 1e4, k), 22155.6, 1e-12));
  { const p = polyfit([1, 2, 3, 4, 5], [3, 5, 11, 21, 35], 2); check('creep: polyfit recovers an exact quadratic', near(p.c[0], 5, 1e-10) && near(p.c[1], -4, 1e-10) && near(p.c[2], 2, 1e-10)); }
  const nx = exampleNorton(), nf = norton(nx.map((r) => r.s), nx.map((r) => r.T + 273.15), nx.map((r) => r.rate));
  check('creep: Norton A, n and Q match numpy lstsq', near(nf.A, 81.2876039548581, 1e-8) && near(nf.n, 5.07173507592418, 1e-10) && near(nf.Q, 283993.389528233, 1e-10) && nf.withQ);
  check('creep: Norton close to the made-up truth (n 5, Q 280 kJ/mol)', Math.abs(nf.n - 5) < 0.2 && Math.abs(nf.Q / 1000 - 280) < 10);
  const n1 = norton(nx.slice(0, 3).map((r) => r.s), [873.15, 873.15, 873.15], nx.slice(0, 3).map((r) => r.rate));
  check('creep: Norton at one temperature (no Q)', !n1.withQ && n1.Q === null && near(n1.n, 5.13290050919293, 1e-10) && near(n1.A, 5.87099213014224e-16, 1e-8));
  let threw = false; try { norton([100, 100, 100], [900, 900, 900], [1, 2, 3]); } catch { threw = true; }
  check('creep: equal stresses are an error', threw);
};
