// #952 plasma parameters: checked against the NRL Plasma Formulary shortcut formulas and an independent SciPy script.
import { plasma, coulombLog, EV_K } from '../../src/lib/sci/phplasma.ts';
export default async (check) => {
  const near = (a, b, r) => Math.abs(a / b - 1) < r;
  const p = plasma({ ne: 1e20, Te: 1e4, Ti: 1e4, B: 5, A: 2, Z: 1 });
  check('plasma: Debye length (NRL 7.43e2 Te^1/2 n^-1/2 cm)', near(p.lambdaD, 7.43e-5, 2e-3));
  check('plasma: electron plasma frequency (NRL 8.98e3 n^1/2 Hz)', near(p.fpe, 8.98e10, 2e-3));
  check('plasma: ion plasma frequency (NRL 2.10e2 n^1/2 mu^-1/2)', near(p.fpi, 1.4849e9, 3e-3));
  check('plasma: electron cyclotron (NRL 2.80e6 B Hz, B in G)', near(p.fce, 1.4e11, 3e-3));
  check('plasma: electron gyroradius (NRL 2.38 Te^1/2/B cm)', near(p.rLe, 4.76e-5, 3e-3));
  check('plasma: ion gyroradius (SciPy 2.8795e-3 m)', near(p.rLi, 2.87948e-3, 1e-4));
  check('plasma: Coulomb log, hot branch 24 - ln(n^1/2/Te)', near(p.lnL, 17.09224, 1e-5));
  check('plasma: electron collision time (NRL 3.44e5 Te^3/2 / n lnL)', near(p.tauE, 2.0126e-4, 1e-3));
  check('plasma: ion collision time (NRL 2.09e7 Ti^3/2 mu^1/2 / n lnL)', near(p.tauI, 1.7293e-2, 7e-3));
  check('plasma: Alfven speed (SciPy 7.7387e6 m/s)', near(p.vA, 7.73866e6, 1e-4));
  check('plasma: beta (NRL 4.03e-11 n T / B^2)', near(p.beta, 0.03224, 2e-3));
  check('plasma: Debye number ND (SciPy 1.7209e8)', near(p.ND, 1.72086e8, 1e-4));
  check('plasma: ion sound speed sqrt((Z Te + 3 Ti)/mi)', near(p.cs, 1.389139e6, 1e-5));
  check('plasma: eV in kelvin', near(EV_K, 11604.518, 1e-6));
  check('plasma: Coulomb log, warm branch 23 - ln(n^1/2 Z Te^-3/2)', near(coulombLog(1e16, 2, 1, 0.03, 40), 23 - Math.log(Math.sqrt(1e10) * 2 ** -1.5), 1e-9));
  const g = plasma({ ne: 1e16, Te: 2, Ti: 0.03, B: 0, A: 40, Z: 1 });
  check('plasma: no field means no gyroradius and infinite beta', g.rLe === Infinity && g.beta === Infinity && g.vA === 0);
  const z = plasma({ ne: 1e20, Te: 1e4, Ti: 1e4, B: 5, A: 2, Z: 2, lnL: 15 });
  check('plasma: Z = 2 halves ion density and uses the given lnL', z.ni === 5e19 && z.lnL === 15);
};
