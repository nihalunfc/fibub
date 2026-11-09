// #916 real gas calculator: cubic equations of state, checked against an independent NumPy/SciPy solution
// (polynomial roots in V, fugacity by integrating the residual Helmholtz energy, saturation by Brent's method).
import * as RG from '../../src/lib/sci/phrealgas.ts';

export default async (check) => {
  const co2 = RG.GASES.find((g) => g.id === 'co2');
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  const want = { vdw: [0.7314551466, -0.2324976576, 0.5627799738, -0.6557478079, 5259392.62], rk: [0.6974474900, -0.2652975575, 0.5197617648, -0.6505079380, 4565775.46], srk: [0.6946656444, -0.2670964686, 0.5614034350, -0.5836053123, 4201424.34], pr: [0.6711773034, -0.2922656804, 0.5200106023, -0.6474447442, 4162542.39] };
  for (const [eos, w] of Object.entries(want)) {
    const a = RG.solveTP(eos, co2, 300, 50e5), b = RG.solveTP(eos, co2, 350, 200e5), s = RG.psat(eos, co2, 280);
    check(`real gas ${eos}: CO2 300 K 50 bar Z and ln phi match SciPy`, near(a.Z, w[0], 1e-8) && near(Math.log(a.phi), w[1], 1e-6));
    check(`real gas ${eos}: CO2 350 K 200 bar Z and ln phi match SciPy`, near(b.Z, w[2], 1e-8) && near(Math.log(b.phi), w[3], 1e-6));
    check(`real gas ${eos}: CO2 saturation pressure at 280 K matches SciPy`, s && near(s.P, w[4], 1e-6));
  }
  check('real gas: ideal gas gives Z = 1 and V = RT/P', (() => { const s = RG.solveTP('ideal', co2, 300, 1e5); return s.Z === 1 && near(s.V, RG.R * 300 / 1e5, 1e-12); })());
  check('real gas: pressure from V inverts solveTP', (() => { const s = RG.solveTP('pr', co2, 320, 80e5); return near(RG.pressure('pr', co2, 320, s.V), 80e5, 1e-9); })());
  check('real gas: no saturation above Tc', RG.psat('pr', co2, 310) === null);
  check('real gas: below saturation the stable root is vapour-like, above it liquid-like', (() => { const s = RG.psat('pr', co2, 280); return RG.solveTP('pr', co2, 280, s.P * 0.97).Z > 0.5 && RG.solveTP('pr', co2, 280, s.P * 1.03).Z < 0.2; })());
  check('real gas: vdW critical isotherm gives Z close to 3/8 at the critical point', near(RG.solveTP('vdw', co2, co2.Tc, co2.Pc).Z, 0.375, 1e-3));
  check('real gas: cubic roots of (x-1)(x-2)(x-3)', RG.cubicRoots(-6, 11, -6).every((r, i) => Math.abs(r - (i + 1)) < 1e-12));
};
