// #934 Fibre optic calculator: Bessel functions, zeros, LP mode counts and the LP01 propagation constant checked against
// SciPy (jv, kv, jn_zeros, brentq on the LP01 eigenvalue equation); NA, V, budget by hand.
import { besselJn, besselKn, besselZero, lpModes, basics, bLP01, nEff, marcuse, spreading, linkBudget } from '../../src/lib/sci/phfibre.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  check('fibre: J_n vs SciPy (J5(7.1), J0(50.3), J12(30))', near(besselJn(5, 7.1), 0.33804207810912146, 1e-13) && near(besselJn(0, 50.3), 0.0820551183631546, 1e-13) && near(besselJn(12, 30), 0.14825335109966004, 1e-13));
  check('fibre: K_n vs SciPy (K0, K1 at 0.5 and 7.3, K3(2))', near(besselKn(0, 0.5), 0.9244190712276656, 1e-12) && near(besselKn(1, 0.5), 1.6564411200033007, 1e-12) && near(besselKn(0, 7.3), 0.00030836221306093187, 1e-15) && near(besselKn(1, 7.3), 0.0003288419967843264, 1e-15) && near(besselKn(3, 2), 0.6473853909486342, 1e-12));
  check('fibre: Bessel zeros vs SciPy jn_zeros', near(besselZero(0, 1), 2.40482556, 1e-8) && near(besselZero(0, 2), 5.52007811, 1e-8) && near(besselZero(1, 2), 7.01558667, 1e-8) && near(besselZero(4, 1), 7.58834243, 1e-8));
  const count = (V) => { const m = lpModes(V); return [m.length, m.reduce((s, x) => s + x.degeneracy, 0)]; };
  check('fibre: LP mode counts vs SciPy at V = 1.95, 2.5, 3.9, 5, 12', [[1.95, 1, 2], [2.5, 2, 6], [3.9, 4, 12], [5.0, 4, 12], [12, 21, 76]].every(([V, n, t]) => { const [a, b] = count(V); return a === n && b === t; }));
  check('fibre: V = 35 gives 160 LP modes, 618 in all (≈ V²/2 = 612)', (() => { const [a, b] = count(35); return a === 160 && b === 618; })());
  { const m = lpModes(12).map((x) => x.vc); const ref = [0, 2.4048255576957724, 3.8317059702075125, 3.8317059702075125, 5.135622301840683, 5.520078110286311, 6.380161895923984, 7.015586669815619]; check('fibre: first 8 cutoffs vs SciPy', ref.every((v, i) => near(m[i], v, 1e-9))); }
  check('fibre: LP01 b vs SciPy brentq at V = 1, 1.951, 2.4, 3, 6', [[1, 0.040950422036847844], [1.951, 0.40000920679998164], [2.4, 0.530026404048868], [3, 0.651470886178292], [6, 0.8827014243975647]].every(([V, b]) => near(bLP01(V), b, 1e-9)));
  check('fibre: LP01 b near the Rudolph-Neumann approximation (1.1428 − 0.996/V)²', near(bLP01(2), (1.1428 - 0.996 / 2) ** 2, 0.003));
  const f = { n1: 1.45, n2: 1.445, aUm: 4, lamNm: 1550 }, b = basics(f);
  check('fibre: NA = √(n1² − n2²) = 0.1203', near(b.NA, Math.sqrt(1.45 ** 2 - 1.445 ** 2), 1e-15) && near(b.NA, 0.12031, 1e-5));
  check('fibre: V = 2πa NA/λ = 1.951, single mode', near(b.V, (2 * Math.PI * 4 * b.NA) / 1.55, 1e-12) && near(b.V, 1.9508, 1e-4) && b.singleMode);
  check('fibre: cutoff wavelength 1257 nm', near(b.cutoffNm, 1257.4, 0.1));
  check('fibre: acceptance angle asin(NA)', near(b.accept, (Math.asin(b.NA) * 180) / Math.PI, 1e-12) && near(b.accept, 6.91, 0.01));
  check('fibre: n_eff between n2 and n1', nEff(f, bLP01(b.V)) > 1.445 && nEff(f, bLP01(b.V)) < 1.45);
  check('fibre: Marcuse w/a at V = 2', near(marcuse(2), 0.65 + 1.619 / 2 ** 1.5 + 2.879 / 64, 1e-15) && near(marcuse(2), 1.267, 0.001));
  const mm = { n1: 1.48, n2: 1.46, aUm: 25, lamNm: 850 };
  { const s = spreading(mm, 'step', false, 1000, 0, 0); check('fibre: step-index modal spread 67.6 ns/km', near(s.modal, (1000 * 1.48 * 0.02) / (299792458 * 1.46), 1e-18) && near(s.modal * 1e9, 67.63, 0.01)); }
  { const s = spreading(mm, 'graded', false, 1000, 0, 0), d = (1.48 ** 2 - 1.46 ** 2) / (2 * 1.48 ** 2); check('fibre: graded-index modal spread L n1 Δ²/(8c)', near(s.modal, (1000 * 1.48 * d * d) / (8 * 299792458), 1e-20)); }
  { const s = spreading(f, 'step', true, 80000, 17, 0.1); check('fibre: chromatic spread D L Δλ = 136 ps', near(s.chrom, 136e-12, 1e-18) && s.modal === 0 && near(s.bandwidth, 0.44 / 136e-12, 1)); }
  const lb = linkBudget({ txDbm: 0, rxDbm: -28, attDbPerKm: 0.25, Lkm: 80, nConn: 2, connDb: 0.5, nSplice: 8, spliceDb: 0.1, marginDb: 3 });
  check('fibre: link budget sums', near(lb.loss, 20 + 1 + 0.8, 1e-12) && near(lb.rx, -21.8, 1e-12) && near(lb.spare, 3.2, 1e-12) && lb.ok && near(lb.maxKm, 92.8, 1e-9));
};
