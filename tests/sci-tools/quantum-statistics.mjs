// #921 quantum statistics: Fermi-Dirac and Bose-Einstein integrals and the ideal quantum gas, checked against
// mpmath (polylog, findroot) at 30 digits.
import * as QS from '../../src/lib/sci/phqstat.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  const F = [[-40, 4.248354255291589e-18, 4.248354255291589e-18], [-5, 0.0067219543145059127, 0.0067299409090146934], [0, 0.76514702462540795, 0.86719988901218414], [3, 4.4875474213517089, 7.7886107702959699], [30, 123.77734775009833, 1493.45599923088], [45, 227.22033247157213, 4099.9240721641059], [300, 3908.8736769986794, 469090.56008065049]];
  check('quantum: Fermi-Dirac integrals F1/2 and F3/2 match mpmath from η −40 to 300', F.every(([e, a, b]) => near(QS.fermiDirac(0.5, e), a, 1e-9) && near(QS.fermiDirac(1.5, e), b, 1e-9)));
  const L = [[0.1, 0.10374145234616939, 0.10183523303960216], [0.6, 0.79820885144423313, 0.68385315932807376], [0.9, 1.6144385285663397, 1.1390030252021568], [0.999, 2.5017084653413556, 1.3389476332802495]];
  check('quantum: Bose-Einstein integrals Li3/2 and Li5/2 match mpmath', L.every(([z, a, b]) => near(QS.boseEinstein(1.5, z), a, 1e-8) && near(QS.boseEinstein(2.5, z), b, 1e-9)));
  check('quantum: Li3/2 very close to z = 1', near(QS.boseEinstein(1.5, 0.99999), 2.6011799418353219, 2e-4) && QS.boseEinstein(1.5, 1) === QS.ZETA32);
  check('quantum: occupancies at x = 0 and 1', QS.occupancy('fd', 0) === 0.5 && near(QS.occupancy('be', 1), 1 / (Math.E - 1), 1e-14) && near(QS.occupancy('mb', 1), 1 / Math.E, 1e-15) && Number.isNaN(QS.occupancy('be', -1)) && QS.occupancy('fd', 800) >= 0 && QS.occupancy('fd', -800) === 1);
  const e = QS.idealGas('fd', QS.ME, 2, 8.5e28, 300);
  check('quantum: electron gas at 8.5e28 m⁻³, 300 K: η, μ, EF and mean energy match mpmath', near(e.eta, 272.678318164895, 1e-9) && near(e.mu / QS.QE, 7.04927982296447, 1e-9) && near(e.EF / QS.QE, 7.04935779984910, 1e-12) && near(e.meanE / QS.QE, 4.22984860124744, 1e-9));
  const m = 86.909180527 * QS.AMU;
  { const b = QS.idealGas('be', m, 1, 1e20, 2e-7); check('quantum: Rb-87 at 200 nK condenses: Tc and condensate fraction match mpmath', near(b.Tc, 3.98330692016813e-7, 1e-12) && near(b.condensate, 0.644221796907183, 1e-11) && b.eta === 0); }
  { const b = QS.idealGas('be', m, 1, 1e20, 5e-7); check('quantum: Rb-87 at 500 nK: μ and mean energy match mpmath', near(b.eta, -0.0555669012826887, 1e-6) && near(b.meanE / (QS.KB * 5e-7), 0.989219476048005, 1e-6)); }
  { const b = QS.idealGas('be', m, 1, 1e20, 1e-6); check('quantum: Rb-87 at 1 µK', near(b.eta, -0.654823959636549, 1e-8) && near(b.meanE / (QS.KB * 1e-6), 1.32366901828347, 1e-8)); }
  { const g = QS.idealGas('mb', m, 1, 1e20, 300); check('quantum: Maxwell-Boltzmann limit: μ = kT ln(nλ³/g), U = 3/2 kT, P = nkT', near(g.mu, QS.KB * 300 * Math.log(1e20 * QS.lambdaT(m, 300) ** 3), 1e-12) && near(g.pressure, 1e20 * QS.KB * 300, 1e-12)); }
  { const f = QS.idealGas('fd', QS.ME, 2, 1e10, 300), b = QS.idealGas('be', QS.ME, 2, 1e10, 300), c = QS.idealGas('mb', QS.ME, 2, 1e10, 300); check('quantum: dilute gas, all three statistics agree', Math.abs(f.eta - c.eta) < 1e-6 && Math.abs(b.eta - c.eta) < 1e-6 && near(f.meanE, c.meanE, 1e-8)); }
  { const f = QS.idealGas('fd', QS.ME, 2, 8.5e28, 1e-3); check('quantum: Fermi gas near absolute zero: μ → EF, U → 3/5 EF', near(f.mu, f.EF, 1e-8) && near(f.meanE, 0.6 * f.EF, 1e-6)); }
  { const n = 8.5e28, s = []; for (let i = 0; i < 20000; i++) { const E = (i + 0.5) * 1e-3 * QS.QE; s.push(QS.spectrum('fd', QS.ME, 2, e.mu, 300, E) * 1e-3 * QS.QE); } check('quantum: the energy spectrum integrates back to the density', near(s.reduce((a, b) => a + b, 0), n, 2e-4)); }
};
