// #965 Hall effect and van der Pauw analyser. References: SciPy brentq on the van der Pauw equation,
// scipy.constants.e, scipy.stats.linregress, and the symmetric closed form R_s = πR/ln 2.
import * as H from '../../src/lib/sci/phhall.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  check('hall: symmetric sample R_s = πR/ln 2', near(H.vdpSheet(100, 100).Rs, (100 * Math.PI) / Math.LN2, 1e-13) && H.vdpSheet(100, 100).f === 1);
  check('hall: van der Pauw equation matches SciPy brentq', [[120, 95, 484.93729556316475], [100, 10, 174.31126260476074], [1000, 1, 598.1926294410929]].every(([a, b, r]) => near(H.vdpSheet(a, b).Rs, r, 1e-12)));
  { const v = H.vdpSheet(37, 81); check('hall: the solution satisfies the van der Pauw equation', Math.abs(Math.exp((-Math.PI * 37) / v.Rs) + Math.exp((-Math.PI * 81) / v.Rs) - 1) < 1e-14 && v.f < 1); }
  check('hall: van der Pauw is symmetric in R_A and R_B', H.vdpSheet(10, 70).Rs === H.vdpSheet(70, 10).Rs);
  check('hall: bad resistances give NaN', Number.isNaN(H.vdpSheet(0, 5).Rs));
  const h = H.hall({ I: 1e-3, B: 0.5, VH: -2e-3, Rs: 484.93729556316475, t: 500e-9 });
  check('hall: sheet Hall coefficient and n-type', h.RHs === -4 && h.type === 'n');
  check('hall: sheet density 1/(e|R_Hs|)', near(h.ns, 1.5603772686151908e18, 1e-12));
  check('hall: Hall mobility |R_Hs|/R_s', near(h.mu * 1e4, 82.48489106936478, 1e-12));
  check('hall: bulk density and resistivity', near(h.n * 1e-6, 3.1207545372303816e18, 1e-12) && near(h.rho * 100, 0.024246864778158236, 1e-12));
  check('hall: positive Hall voltage is p-type', H.hall({ I: 1e-3, B: 1, VH: 1e-3 }).type === 'p');
  check('hall: Hall factor scales density and mobility', near(H.hall({ I: 1e-3, B: 1, VH: 1e-3, rH: 1.18 }).ns, 1.18 * H.hall({ I: 1e-3, B: 1, VH: 1e-3 }).ns, 1e-14) && near(H.hall({ I: 1e-3, B: 1, VH: 1e-3, Rs: 100, rH: 1.18 }).mu, H.hall({ I: 1e-3, B: 1, VH: 1e-3, Rs: 100 }).mu / 1.18, 1e-14));
  const L = H.line([-1, -0.5, 0, 0.5, 1], [4.05e-3, 2.02e-3, 0.03e-3, -1.96e-3, -3.98e-3]);
  check('hall: field sweep line matches linregress', near(L.b, -0.004008, 1e-12) && near(L.seB, 8.326663997872156e-6, 1e-9) && near(L.a, 3.2e-5, 1e-9) && near(L.seA, 5.88784057755729e-6, 1e-9) && near(L.r2, 0.9999870520120675, 1e-12));
  check('hall: reciprocity spread', near(H.spread([100, 102, 98]), 0.02, 1e-12));
};
