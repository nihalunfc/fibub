// #860 Quantum dot size: Brus equation, its inverse, Bohr radius and the user's polynomial sizing curve.
// Reference numbers from NumPy with scipy.constants (CODATA 2022, hence the 1e-9 tolerances),
// scipy.optimize.brentq for the inverse and minimize_scalar for the end of the confinement branch.
import * as Q from '../../src/lib/sci/qdot.ts';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const m = Q.PRESETS[0].m, cds = Q.PRESETS[1].m, pbs = Q.PRESETS[2].m;
  check('qdot: exciton Bohr radius 5.5613 nm (CdSe-like), 3.0276 nm (CdS-like), 19.991 nm (PbS-like)', rel(Q.bohr(m), 5.561335881067541, 1e-9) && rel(Q.bohr(cds), 3.027649611755314, 1e-9) && rel(Q.bohr(pbs), 19.991139064995554, 1e-9));
  check('qdot: Brus E at R = 2 nm with the polarisation term = 2.547701 eV (CdSe-like), 2.873226 eV (CdS-like)', rel(Q.brus(2, m, true).E, 2.5477014271303577, 1e-9) && rel(Q.brus(2, cds, true).E, 2.8732259497972246, 1e-9));
  check('qdot: terms add up: E = Eg + confinement − Coulomb − polarisation', (() => { const t = Q.brus(1.7, m, true); return Math.abs(t.E - (m.Eg + t.conf - t.coul - t.pol)) < 1e-15 && rel(t.conf * 1.7 ** 2, Q.brus(1, m).conf, 1e-12) && rel(t.coul * 1.7, Q.brus(1, m).coul, 1e-12); })());
  check('qdot: confinement branch ends at R* = 30.7325 nm (CdSe-like), 16.7311 nm (CdS-like) (SciPy minimize_scalar)', rel(Q.branchEnd(m), 30.732468667902616, 1e-6) && rel(Q.branchEnd(cds), 16.73107946432781, 1e-6));
  check('qdot: R* = (π²/1.786) · aB (to 1e-8: a0 is a separate constant)', rel(Q.branchEnd(m), (Math.PI ** 2 / 1.786) * Q.bohr(m), 1e-8));
  check('qdot: radius for 2.0, 2.2, 2.5 eV = 3.34876, 2.59535, 2.06096 nm (CdSe-like, SciPy brentq)', rel(Q.radiusFor(2.0, m), 3.3487571477697284, 1e-9) && rel(Q.radiusFor(2.2, m), 2.595346267236593, 1e-9) && rel(Q.radiusFor(2.5, m), 2.060956626430476, 1e-9));
  check('qdot: radius for 2.2 eV with polarisation = 2.58763 nm (CdSe-like); PbS-like 2.0 eV = 2.24541 nm', rel(Q.radiusFor(2.2, m, true), 2.587625394787715, 1e-9) && rel(Q.radiusFor(2.0, pbs), 2.2454060157646905, 1e-9));
  check('qdot: no radius below the branch minimum (CdS-like at 2.2 eV, under its 2.42 eV gap)', Number.isNaN(Q.radiusFor(2.2, cds)) && Number.isNaN(Q.radiusFor(2.0, cds)) && rel(Q.radiusFor(2.5, cds), 3.980031694688272, 1e-9));
  check('qdot: forward and inverse agree to 1e-12 nm over 1–10 nm', [1, 1.3, 2.7, 4.4, 10].every((R) => Math.abs(Q.radiusFor(Q.brus(R, m).E, m) - R) < 1e-10));
  check('qdot: polynomial by Horner: 1 + 2x + 3x² at x = 2 is 17; coefficients parsed with commas, spaces or e-notation', Q.poly([1, 2, 3], 2) === 17 && JSON.stringify(Q.parseCoeffs('1.5, 2e-3 −4e-6')) === '[1.5,0.002,-0.000004]' && typeof Q.parseCoeffs('1, x') === 'string' && Q.parseCoeffs('').length === 0);
};
