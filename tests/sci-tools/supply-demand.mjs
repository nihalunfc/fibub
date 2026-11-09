// Supply and demand: checked against an independent SciPy 1.x calculation (brentq for the prices, quad over the
// inverse curves in quantity space for the surplus areas and deadweight losses) and the textbook closed forms.
import { market, policy, solve, arcElasticity, area } from '../../src/lib/sci/supplydemand.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const D = { kind: 'linear', a: 100, b: -2 }, S = { kind: 'linear', a: -20, b: 4 };
  const m = market(D, S);
  check('supply-demand: linear equilibrium P 20, Q 60', near(m.P, 20) && near(m.Q, 60));
  check('supply-demand: linear CS 900, PS 450', near(m.cs, 900) && near(m.ps, 450));
  check('supply-demand: point elasticities −2/3 and 4/3', near(m.ed, -2 / 3) && near(m.es, 4 / 3));
  const tx = policy(D, S, { kind: 'tax', amount: 6 });
  check('supply-demand: tax 6 → Pb 24, Ps 18, Q 52, revenue 312, DWL 24, buyers pay 2/3', near(tx.Pb, 24) && near(tx.Ps, 18) && near(tx.Q, 52) && near(tx.gov, 312) && near(tx.dwl, 24) && near(tx.buyerShare, 2 / 3));
  check('supply-demand: tax welfare adds up (ΔCS −224, ΔPS −112)', near(tx.dCS, -224) && near(tx.dPS, -112));
  const sb = policy(D, S, { kind: 'subsidy', amount: 3 });
  check('supply-demand: subsidy 3 → Pb 18, Q 64, cost 192, DWL 6', near(sb.Pb, 18) && near(sb.Ps, 21) && near(sb.Q, 64) && near(sb.gov, -192) && near(sb.dwl, 6));
  const ce = policy(D, S, { kind: 'ceiling', price: 16 });
  check('supply-demand: ceiling 16 → Q 44, shortage 24, DWL 96 (SciPy)', near(ce.Q, 44) && near(ce.gap, 24) && near(ce.dwl, 96));
  const fl = policy(D, S, { kind: 'floor', price: 25 });
  check('supply-demand: floor 25 → Q 50, surplus 30, DWL 37.5 (SciPy)', near(fl.Q, 50) && near(fl.gap, 30) && near(fl.dwl, 37.5));
  check('supply-demand: non-binding ceiling and floor change nothing', !policy(D, S, { kind: 'ceiling', price: 25 }).binding && !policy(D, S, { kind: 'floor', price: 15 }).binding);

  const Dc = { kind: 'ce', A: 1000, e: -1.5 }, Sc = { kind: 'ce', A: 10, e: 0.5 };
  const mc = market(Dc, Sc);
  check('supply-demand: constant-elasticity equilibrium P 10, Q 31.6228', near(mc.P, 10, 1e-9) && near(mc.Q, 31.622776601683785, 1e-9));
  check('supply-demand: CE PS 210.8185 (SciPy), CS 632.456 closed form', near(mc.ps, 210.81851067789196, 1e-8) && near(mc.cs, 1000 * 10 ** -0.5 / 0.5, 1e-9));
  const t2 = policy(Dc, Sc, { kind: 'tax', amount: 2 });
  check('supply-demand: CE tax 2 matches SciPy (Pb 10.5401, Q 29.2235, DWL 2.40812)', near(t2.Pb, 10.540116335790085, 1e-8) && near(t2.Q, 29.2234774381662, 1e-8) && near(t2.dwl, 2.408119260500946, 1e-6));
  const s1 = policy(Dc, Sc, { kind: 'subsidy', amount: 1 });
  check('supply-demand: CE subsidy 1 matches SciPy (Pb 9.75907, DWL 0.587838)', near(s1.Pb, 9.759069813178243, 1e-8) && near(s1.dwl, 0.5878383104413869, 1e-6));
  const c8 = policy(Dc, Sc, { kind: 'ceiling', price: 8 }), f125 = policy(Dc, Sc, { kind: 'floor', price: 12.5 });
  check('supply-demand: CE ceiling 8 matches SciPy (shortage 15.9099, DWL 4.64954)', near(c8.gap, 15.909902576697299, 1e-8) && near(c8.dwl, 4.649538671083363, 1e-6));
  check('supply-demand: CE floor 12.5 matches SciPy (surplus 12.7279, DWL 33.3634)', near(f125.gap, 12.727922061357862, 1e-8) && near(f125.dwl, 33.36336363091213, 1e-6));
  check('supply-demand: inelastic CE demand has unbounded CS', area({ kind: 'ce', A: 100, e: -0.5 }, 1, Infinity) === Infinity);
  check('supply-demand: curves that never cross give null', solve({ kind: 'linear', a: 10, b: -1 }, { kind: 'linear', a: 20, b: 1 }) === null);
  const a = arcElasticity(10, 100, 12, 80);
  check('supply-demand: arc elasticity (10,100)→(12,80) = −1.2222, simple −1', near(a.arc, (-20 / 90) / (2 / 11)) && near(a.simple, -1));
};
