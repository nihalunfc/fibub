// #925 hydrogen orbitals: radial functions and spherical harmonics against SciPy (genlaguerre, sph_harm_y),
// expectation values against the closed forms and SciPy quad, node radii against Laguerre roots.
import * as H from '../../src/lib/sci/phhydro.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('hydrogen: R_nl matches SciPy genlaguerre formula', [[1, 0, 1, 0.7357588823428847], [2, 1, 3.3, 0.12936667734897056], [3, 2, 7, 0.042840707456873], [4, 1, 5.5, 0.00035064059186033645], [5, 3, 10, 0.01380323006948462], [7, 4, 20, 0.004738375777387522]].every(([n, l, r, v]) => near(H.radial(n, l, r), v, 1e-13)));
  check('hydrogen: R_31 for Z = 2 at r = 2', near(H.radial(3, 1, 2, 2), 0.12024721275949021, 1e-13));
  check('hydrogen: Y_lm matches scipy.special.sph_harm_y (Condon–Shortley phase)', [[2, 1, 0.7, 1.1, -0.17266309095335006, -0.339241475400997], [3, 3, 1.0, 0.5, -0.01758467760678664, -0.24796892356892503], [3, -2, 1.2, 2.5, 0.09125401441476917, 0.3084855651093695]].every(([l, m, t, p, a, b]) => { const y = H.ylm(l, m, t, p); return Math.abs(y[0] - a) < 1e-13 && Math.abs(y[1] - b) < 1e-13; }));
  check('hydrogen: real harmonics match √2(−1)^m Re/Im Y_lm', near(H.yreal(1, 1, 0.7, 1.1), 0.14277680921235797, 1e-13) && near(H.yreal(2, -2, 1.2, 2.5), -0.45505434463383904, 1e-13) && near(H.yreal(3, -1, 0.3, -1), -0.40498896958064434, 1e-13));
  { let s = 0; const n = 200; for (let i = 0; i < n; i++) for (let j = 0; j < 2 * n; j++) { const th = (Math.PI * (i + 0.5)) / n, ph = (Math.PI * (j + 0.5)) / n; s += H.yreal(3, 2, th, ph) ** 2 * Math.sin(th) * (Math.PI / n) ** 2; } check('hydrogen: real Y_32 is normalised', near(s, 1, 1e-4)); }
  const P = [[1, 0, 1.5, 3, 1, 2.661160168917105], [2, 1, 5, 30, 4, 7.993589586052952], [3, 2, 10.5, 126, 9, 15.79810815974783], [4, 0, 24, 648, 24.61809, 33.62149850638052], [4, 3, 18, 360, 16, 25.989423082637213], [6, 5, 39, 1638, 36, 53.344756907885646]];
  for (const [n, l, rm, r2, rp, r90] of P) {
    const p = H.properties(n, l);
    check(`hydrogen: ${n}${'spdfgh'[l]} ⟨r⟩ = ${rm}, ⟨r²⟩ = ${r2}, peak ${rp}, 90 % radius ${r90.toFixed(4)} (SciPy quad/brentq)`, near(p.rMean, rm, 1e-14) && near(p.r2Mean, r2, 1e-14) && near(p.rPeak, rp, 2e-6) && near(p.r90, r90, 2e-6));
  }
  { const p = H.properties(4, 0); check('hydrogen: 4s node radii are the Laguerre roots 1.871644, 6.610815, 15.517541', p.nodeRadii.length === 3 && [1.871644455048176, 6.610814578664559, 15.517540966287262].every((v, i) => near(p.nodeRadii[i], v, 1e-6)) && p.radialNodes === 3 && p.angularNodes === 0); }
  check('hydrogen: E₁ = −13.6057 eV, E₂ for He⁺ = −13.6057 eV', near(H.properties(1, 0).E, -13.605693123, 1e-12) && near(H.properties(2, 1, 2).E, -13.605693123, 1e-12));
  { const s = H.sample(3, 2, 0, true, 3000, 1); const rm = s.reduce((a, p) => a + Math.hypot(p.x, p.y, p.z), 0) / s.length, z2 = s.reduce((a, p) => a + p.z * p.z, 0) / s.length;
    check(`hydrogen: 3000 samples of 3d z² have ⟨r⟩ ≈ 10.5 and ⟨z²⟩ ≈ 66 (${rm.toFixed(2)}, ${z2.toFixed(1)})`, s.length === 3000 && Math.abs(rm - 10.5) < 0.3 && Math.abs(z2 - 66) < 4); }
  check('hydrogen: orbital names', H.orbitalName(3, 2, 2, true) === '3d x²−y²' && H.orbitalName(2, 1, -1, true) === '2p y' && H.orbitalName(1, 0, 0, true) === '1s' && H.orbitalName(4, 3, -2, true) === '4f xyz');
};
