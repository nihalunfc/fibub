// #345 membrane potential: Nernst, GHK voltage, GHK currents and the zero-current potential checked against an
// independent NumPy/SciPy (brentq) implementation.
import * as G from '../../src/lib/sci/ghk.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-7) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const ions = [{ name: 'K', z: 1, out: 5, in: 140, p: 1 }, { name: 'Na', z: 1, out: 145, in: 12, p: 0.05 }, { name: 'Cl', z: -1, out: 110, in: 10, p: 0.45 }, { name: 'Ca', z: 2, out: 2, in: 1e-4, p: 0 }];
  check('membrane: Nernst potentials at 37 °C', near(G.nernst(1, 5, 140, 37), -89.05869404) && near(G.nernst(1, 145, 12, 37), 66.59821327) && near(G.nernst(-1, 110, 10, 37), -64.08772954) && near(G.nernst(2, 2, 1e-4, 37), 132.3435679));
  check('membrane: GHK voltage at 37 °C and 25 °C', near(G.ghkVoltage(ions, 37), -64.92311720) && near(G.ghkVoltage(ions, 25), -62.41117973));
  check('membrane: GHK voltage at the spike peak (PNa 20)', near(G.ghkVoltage(ions.map((i) => (i.name === 'Na' ? { ...i, p: 20 } : i)), 37), 51.13116664));
  const I = (k, V) => G.ghkCurrent(ions[k], V, 37, 1e-6);
  check('membrane: GHK currents in µA/cm²', near(I(0, -100), -0.6211096931) && near(I(0, 30), 22.21718124) && near(I(1, -100), -2.675626256) && near(I(1, 30), -0.2825353928) && near(I(2, -100), -1.229892083) && near(I(2, 30), 7.712583735));
  check('membrane: divalent GHK current', near(G.ghkCurrent({ ...ions[3], p: 1 }, -50, 37, 1e-6), -1.479108958));
  check('membrane: current at 0 mV is the limit', near(G.ghkCurrent(ions[0], 0, 37, 1e-6), (G.ghkCurrent(ions[0], 1e-4, 37, 1e-6) + G.ghkCurrent(ions[0], -1e-4, 37, 1e-6)) / 2, 1e-6));
  check('membrane: zero-current potential equals GHK voltage without Ca', near(G.zeroCurrent(ions, 37), -64.92311720, 1e-9));
  check('membrane: zero-current potential with Ca permeant matches brentq', near(G.zeroCurrent(ions.map((i) => (i.name === 'Ca' ? { ...i, p: 0.1 } : i)), 37), -63.77897047, 1e-9));
  check('membrane: each ion current reverses at its Nernst potential', Math.abs(G.ghkCurrent(ions[1], G.nernst(1, 145, 12, 37), 37)) < 1e-9);
  // New with the article on calcium and Drosophila larval muscle (Elliott and Cooper 2024): HL3-like saline at 21 °C,
  // K 5/174.2, Na 80/10, Cl 117/24.15 mM, P 1 : 0.127 : 0.1 gives -60.0 mV; the leak cut to 0.07 gives -67.5 mV;
  // the same in choline saline (Na out 10) only -77.8 to -79.5 mV. Checked against the GHK formula written out here.
  {
    const fly = (pna, nao) => [{ name: 'K', z: 1, out: 5, in: 174.2, p: 1 }, { name: 'Na', z: 1, out: nao, in: 10, p: pna }, { name: 'Cl', z: -1, out: 117, in: 24.15, p: 0.1 }];
    const hand = (pna, nao) => G.rtf(21) * Math.log((5 + pna * nao + 0.1 * 24.15) / (174.2 + pna * 10 + 0.1 * 117));
    check('membrane: fly muscle model -60.0 → -67.5 mV in HL3, -77.8 → -79.5 mV in choline saline', near(G.ghkVoltage(fly(0.127, 80), 21), hand(0.127, 80)) && Math.abs(G.ghkVoltage(fly(0.127, 80), 21) + 60.0) < 0.05 && Math.abs(G.ghkVoltage(fly(0.07, 80), 21) + 67.5) < 0.05 && Math.abs(G.ghkVoltage(fly(0.127, 10), 21) + 77.8) < 0.05 && Math.abs(G.ghkVoltage(fly(0.07, 10), 21) + 79.5) < 0.05 && Math.abs(G.nernst(1, 5, 174.2, 21) + 90) < 0.01);
  }
};
