// #687 PVT correlations: every value checked against an independent Python implementation written separately
// from the published equations (SciPy brentq root finding for both Z-factor methods, solving for Z instead of
// reduced density; scipy.integrate.quad for undersaturated Bo).
import * as P from '../../src/lib/sci/eng-pvt.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const py = { '0.5,1.1': [0.8570452477104863, 0.8565045862042593], '2,1.5': [0.8214651256147745, 0.82083377978503], '5,1.3': [0.7266778242781944, 0.7252351292980601], '10,2': [1.1444485548105119, 1.1438993796476828], '1.5,1.05': [0.2837317809225563, 0.30987806346185326], '25,2.8': [1.692115358954654, 1.6630349268227826], '3,1.2': [0.5302397946800431, 0.5305433323180747] };
  for (const [k, [dak, hy]] of Object.entries(py)) { const [pr, tr] = k.split(',').map(Number); check(`pvt: Z at Ppr ${pr}, Tpr ${tr} matches Python (DAK ${dak.toFixed(4)}, HY ${hy.toFixed(4)})`, near(P.zDAK(pr, tr), dak, 1e-10) && near(P.zHY(pr, tr), hy, 1e-10)); }
  check('pvt: Z → 1 at low pressure', near(P.zDAK(0.001, 1.5), 1, 1e-3) && near(P.zHY(0.001, 1.5), 1, 1e-3));
  const oi = { api: 35, gg: 0.75, T: 180, Rsb: 600, Tsep: 75, psep: 100 };
  const s1 = P.oil({ ...oi, method: 'standing' }, 1000), s3 = P.oil({ ...oi, method: 'standing' }, 3000);
  check('pvt: Standing pb, Rs and Bo at 1000 psia match Python', near(s1.pb, 2463.0110160236873) && near(s1.Rs, 206.1797930347353) && near(s1.Bo, 1.143955016545672) && near(s1.Bob, 1.3351886551611598));
  check('pvt: undersaturated Bo at 3000 psia matches integrating co (quad)', near(s3.Bo, 1.3241023197436197) && !s3.saturated && near(s3.co, 1.409176875813109e-5));
  check('pvt: Beggs-Robinson dead, bubble-point and live oil viscosity match Python', near(s1.muDead, 2.1833493301402447) && near(s1.muB, 0.5776163658988794) && near(s1.mu, 1.0067714528282323));
  check('pvt: Vasquez-Beggs undersaturated viscosity at 3000 psia', near(s3.mu, 0.6087582547314551));
  check('pvt: oil density by mass balance', near(s1.rho, 48.19565780310885));
  const v1 = P.oil({ ...oi, method: 'vb' }, 1000), v4 = P.oil({ ...oi, method: 'vb' }, 4500);
  check('pvt: Vasquez-Beggs gas gravity correction, pb, Rs and Bo match Python', near(v1.ggs, 0.7430672648819268) && near(v1.pb, 2781.3443131355484) && near(v1.Rs, 178.1643698063755) && near(v1.Bo, 1.1467238797596544) && near(v1.Bob, 1.3469089540108814));
  check('pvt: Vasquez-Beggs undersaturated Bo at 4500 psia', near(v4.Bo, 1.3197889466736321));
  check('pvt: Standing Rs at its own bubble point gives back the GOR (within 0.1 scf/STB)', Math.abs(P.standingRs(s1.pb, 0.75, 180, 35) - 600) < 0.1);
  check('pvt: Vasquez-Beggs Rs and pb are exact inverses', near(P.vbRs(P.vbPb(600, 0.8, 180, 25), 0.8, 180, 25), 600, 1e-12));
  check('pvt: Bo continuous at the bubble point (Standing Rs and pb round-trip to 1 in 10,000)', near(P.oil({ ...oi, method: 'standing' }, s1.pb * (1 - 1e-9)).Bo, s1.Bob, 1e-4) && near(P.oil({ ...oi, method: 'vb' }, v1.pb * (1 - 1e-12)).Bo, v1.Bob, 1e-9));
  const gd = P.gas({ gg: 0.7, T: 200, yCO2: 0.05, yH2S: 0.1, method: 'dak' }, 2500), gh = P.gas({ gg: 0.7, T: 200, yCO2: 0.05, yH2S: 0.1, method: 'hy' }, 2500);
  check('pvt: Sutton pseudo-criticals with Wichert-Aziz match Python', near(gd.Tpc, 356.8545573276727) && near(gd.Ppc, 623.7794905010957) && near(gd.eps, 20.735442672327267));
  check('pvt: sour gas Z, Bg, density and Lee-Gonzalez-Eakin viscosity (DAK) match Python', near(gd.Z, 0.9094920257831018) && near(gd.Bg, 0.006786676028950672) && near(gd.rho, 7.8732032232610845) && near(gd.mu, 0.0180774312569112));
  check('pvt: the same with Hall-Yarborough', near(gh.Z, 0.9084123761570327) && near(gh.mu, 0.01808651834941069));
  check('pvt: gas compressibility matches −(1/V)dV/dp from Python (1e-6)', near(gd.cg, 0.0003818677216245652, 1e-6) && near(gh.cg, 0.00038470533243064025, 1e-6));
  const g0 = P.gas({ gg: 0.65, T: 150, yCO2: 0, yH2S: 0, method: 'dak' }, 3000);
  check('pvt: sweet gas at 3000 psia, 150 °F', near(g0.Tpc, 365.11) && near(g0.Ppc, 670.0835) && near(g0.Z, 0.8609425594626248) && near(g0.mu, 0.01978929690009245) && g0.inRange);
  check('pvt: API to specific gravity (10 °API = water)', near(P.specificGravity(10), 1));
};
