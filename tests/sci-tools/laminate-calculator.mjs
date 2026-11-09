// #850 laminate calculator: checked against an independent NumPy implementation (compliance inverse for Q, the
// T⁻¹QRTR⁻¹ transformation for Q-bar, numpy.linalg for ABD and its inverse, numpy.roots for the Tsai-Wu ratio) on an
// unsymmetric five-ply laminate with mixed thicknesses and N and M loads, plus textbook limits.
import { halpinTsai, micromechanics, reducedQ, qBar, parseStack, laminate, effective, plyResults, tsaiWu, tsaiWuIndex, maxStress } from '../../src/lib/sci/laminate.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.max(Math.abs(b), 1e-300);
  const S = { Xt: 1000, Xc: 600, Yt: 30, Yc: 120, S: 50 };
  // NumPy reference, unsymmetric laminate.
  const ply = { E1: 140000, E2: 10000, G12: 5000, nu12: 0.3 };
  const L = laminate(ply, [0, 30, -60, 90, 15], [0.1, 0.2, 0.15, 0.1, 0.25]);
  check('laminate: A11, A16, B16, B22, D66, D26 match numpy', near(L.A[0][0], 66036.9898893573, 1e-12) && near(L.A[0][2], 13619.73392798999, 1e-12) && near(L.B[0][2], 435.63463010476426, 1e-11) && near(L.B[1][1], 722.596472015533, 1e-11) && near(L.D[2][2], 582.9229571052001, 1e-12) && near(L.D[1][2], 169.81148937525637, 1e-11));
  const r = plyResults(L, [50, -20, 10], [5, -3, 2], S);
  const want = [0.0009659625938238585, -0.0008579228821160061, -0.0004289117459628119, 0.001015092113508003, -0.003960689663543836, 0.0014762975737893963];
  check('laminate: mid-plane strains and curvatures match numpy.linalg.solve', [...r.e0, ...r.k].every((x, i) => near(x, want[i], 1e-10)));
  const p = r.pts.find((q) => q.ply === 3 && q.pos === 'top');
  check('laminate: ply 3 top stresses in ply axes match numpy', near(p.sig12[0], -53.070624812157675, 1e-10) && near(p.sig12[1], 2.3106433691502755, 1e-9) && near(p.sig12[2], 9.862686302623972, 1e-10));
  const e = effective(L);
  check('laminate: effective Ex and νxy from the ABD inverse match numpy', near(e.Ex, 52964.8537036651, 1e-11) && near(e.nuxy, 0.49230135590920654, 1e-11));
  // Micromechanics.
  const mm = micromechanics({ Ef: 75000, nuf: 0.2, Em: 3500, num: 0.35, Vf: 0.6 });
  check('laminate: rule of mixtures E1 and ν12', near(mm.ply.E1, 46400, 1e-14) && near(mm.ply.nu12, 0.26, 1e-14));
  check('laminate: Reuss E2 and G12', near(mm.E2reuss, 1 / (0.6 / 75000 + 0.4 / 3500), 1e-14) && near(mm.G12reuss, 3050.9065550906557, 1e-12));
  check('laminate: Halpin-Tsai E2 (ξ = 2) and G12 (ξ = 1) match numpy', near(mm.E2halpin, 15020.460358056267, 1e-12) && near(mm.G12halpin, 4493.387924137605, 1e-12));
  check('laminate: Halpin-Tsai tends to Voigt as ξ → ∞ and Reuss at ξ = 0', near(halpinTsai(75000, 3500, 0.6, 1e9), 46400, 1e-6) && near(halpinTsai(75000, 3500, 0.6, 0), mm.E2reuss, 1e-12));
  // Q and Q-bar.
  const Q = reducedQ(ply);
  check('laminate: Q11 = E1/(1 − ν12ν21)', near(Q[0][0], 140000 / (1 - 0.3 * 0.3 * 10000 / 140000), 1e-14) && Q[2][2] === 5000);
  check('laminate: Q-bar at 90° swaps Q11 and Q22, at 0° equals Q', near(qBar(Q, 90)[0][0], Q[1][1], 1e-12) && near(qBar(Q, 0)[0][0], Q[0][0], 1e-14) && Math.abs(qBar(Q, 0)[0][2]) < 1e-9);
  check('laminate: Q-bar16 changes sign with the angle', near(qBar(Q, -30)[0][2], -qBar(Q, 30)[0][2], 1e-12));
  // Quasi-isotropic laminate: in-plane isotropy.
  const qi = laminate(mm.ply, parseStack('[0/±45/90]s'), 0.125), qe = effective(qi);
  check('laminate: quasi-isotropic [0/±45/90]s has Ex = Ey and Gxy = Ex/(2(1 + νxy))', near(qe.Ex, qe.Ey, 1e-12) && near(qe.Gxy, qe.Ex / (2 * (1 + qe.nuxy)), 1e-10));
  check('laminate: symmetric stack has B = 0', qi.B.flat().every((x) => Math.abs(x) < 1e-9));
  check('laminate: unidirectional ply gives Ex = E1, Ey = E2, νxy = ν12', (() => { const u = effective(laminate(ply, [0, 0, 0, 0], 0.2)); return near(u.Ex, 140000, 1e-12) && near(u.Ey, 10000, 1e-12) && near(u.nuxy, 0.3, 1e-12) && near(u.Efx, 140000, 1e-12); })());
  // Failure.
  const ms = maxStress([-700, 10, 20], S);
  check('laminate: max stress picks fibre compression', near(ms.fi, 700 / 600, 1e-14) && ms.mode === 'fibre compression');
  check('laminate: Tsai-Wu ratio puts the index at exactly 1', [[200, 10, 20], [-300, -50, 10], [0, 0, 25]].every((s) => near(tsaiWuIndex(s.map((x) => x * tsaiWu(s, S)), S), 1, 1e-12)));
  check('laminate: Tsai-Wu in pure fibre tension and pure shear equals the strength', near(tsaiWu([1, 0, 0], S), 1000, 1e-12) && near(tsaiWu([0, 0, 1], S), 50, 1e-12) && near(tsaiWu([0, -1, 0], S), 120, 1e-12));
  const q = plyResults(qi, [40, 0, 0], [0, 0, 0], S);
  check('laminate: example first-ply failure is the 90° ply in transverse tension', q.firstMS.angle === 90 && q.firstMS.msMode === 'transverse tension' && near(q.firstMS.msR, 0.5122620580055475 * 100 / 40, 1e-12));
  check('laminate: stacking notation', JSON.stringify(parseStack('[0/±45/90]s')) === '[0,45,-45,90,90,-45,45,0]' && JSON.stringify(parseStack('[0/90]2s')) === '[0,90,0,90,90,0,90,0]' && JSON.stringify(parseStack('0_2/90')) === '[0,0,90]' && JSON.stringify(parseStack('0, 30, −30')) === '[0,30,-30]' && typeof parseStack('0/x') === 'string');
};
