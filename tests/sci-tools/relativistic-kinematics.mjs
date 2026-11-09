// #947 relativistic kinematics. Reference values from a NumPy Lorentz-matrix implementation written for these tests,
// and textbook thresholds (antiproton production 5.63 GeV kinetic, π0 photoproduction 144.7 MeV).
import { mass, fourFrom, add, describe, boost, restBeta, twoBody, twoBodyLab, threshold, sqrtSFixed, massOf, kallen } from '../../src/lib/sci/phrel.ts';
export default async (check) => {
  const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.max(1, Math.abs(b));
  const mp = 938.272, mpi = 139.570, mpi0 = 134.977, mmu = 105.658, mK = 493.677;
  const pb = threshold(mp, mp, 4 * mp);
  check('rel: antiproton threshold p + p → p p p p̄, T = 6 m_p = 5629.6 MeV', near(pb.T, 5629.632) && near(pb.p, 6500.539101277064));
  check('rel: π0 photoproduction threshold γ p → p π0 is 144.69 MeV', near(threshold(0, mp, mp + mpi0).E, 144.68569349666186));
  check('rel: below threshold (elastic) flagged', threshold(mp, mp, 2 * mp).below === true && threshold(mp, mp, 2 * mp).T === 0);
  check('rel: π+ → μ+ ν momentum 29.79 MeV', near(twoBody(mpi, mmu, 0).p, 29.792118420864078));
  const k = twoBody(mK, mpi, mpi0);
  check('rel: K+ → π+ π0 momentum 205.14 MeV and π+ energy 248.12 MeV (NumPy)', near(k.p, 205.13797422096297) && near(k.E1, 248.11564514854857) && near(k.E1 + k.E2, mK));
  const lab = twoBodyLab(mK, mpi, mpi0, 1000);
  check('rel: lab energy range and largest angle for a 1 GeV/c kaon (NumPy)', near(lab.d1.min, 144.96463016555182) && near(lab.d1.max, 976.0261307862531) && near(lab.d1.thetaMax, 46.51872860133516));
  check('rel: forbidden decay gives null', twoBody(mpi, mK, 0) === null);
  const b = boost({ E: 5000, px: 300, py: -400, pz: 1200 }, 0.3, -0.2, 0.5);
  check('rel: general Lorentz boost matches the NumPy Lorentz matrix', near(b.E, 5372.10537211, 1e-10) && near(b.px, -1440.86955403, 1e-10) && near(b.py, 760.57970269, 1e-10) && near(b.pz, -1701.44925671, 1e-10));
  check('rel: boost keeps the mass', near(mass(b), mass({ E: 5000, px: 300, py: -400, pz: 1200 })));
  const gg = add([{ E: 50, px: 50, py: 0, pz: 0 }, { E: 80, px: -40, py: 40 * Math.sqrt(3), pz: 0 }]);
  check('rel: two photons at 120°: m = √(2 E1 E2 (1 − cos θ)) = 109.54 MeV', near(mass(gg), 109.54451150103323));
  const mm = add([fourFrom(mmu, 30000, 10000, 20000), fourFrom(mmu, -25000, -5000, -15000)]);
  check('rel: dimuon invariant mass (NumPy)', near(mass(mm), 66435.22887689921) && near(mm.E, 66997.31066189, 1e-10));
  const rest = boost(mm, ...restBeta(mm));
  check('rel: boosting to the rest frame leaves E = M and p = 0', near(rest.E, mass(mm)) && Math.abs(rest.px) < 1e-6 && Math.abs(rest.pz) < 1e-6);
  const d = describe(fourFrom(mp, 0, 0, 1000));
  check('rel: describe a 1 GeV/c proton (γ, β, rapidity = artanh β)', near(d.gamma, Math.hypot(mp, 1000) / mp) && near(d.y, Math.atanh(d.beta)) && near(d.eta, Infinity) === false && near(d.T, Math.hypot(mp, 1000) - mp));
  check('rel: √s for a beam on a fixed target', near(sqrtSFixed(mp, mp + pb.T, mp), 4 * mp));
  check('rel: Källén function symmetric', kallen(1, 2, 3) === kallen(3, 1, 2) && kallen(4, 1, 1) === 0);
  check('rel: particle names and numbers', massOf('proton') === mp && massOf('π0') === mpi0 && massOf('Pi+') === mpi && massOf('105.658') === mmu && Number.isNaN(massOf('banana')) && massOf('γ') === 0);
};
