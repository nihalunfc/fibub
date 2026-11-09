// #846 stress-strain analyser: checked against NumPy (polyfit, trapezoid, the same steps written independently)
// and against the made-up curve's own truth (E = 200 GPa; Voce hardening gives a 0.2 % yield of 304.8 MPa).
import { exampleTest, engineering, analyse, areaOf, trapz, FORCE, LENGTH, STRESS } from '../../src/lib/sci/tensile.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const { force, ext } = exampleTest();
  const { stress, strain } = engineering(force.map((f) => f * 1000), ext, areaOf('flat', 12.5, 2), 50);
  const r = analyse(strain, stress, { lo: 0.1, hi: 0.4, offset: 0.002, toe: true });
  check('tensile: modulus matches numpy polyfit', near(r.E, 199747.7935, 0.01) && r.nFit === 13);
  check('tensile: modulus within 0.2 % of the 200 GPa used to make the curve', near(r.E / 200000, 1, 0.002));
  check('tensile: 0.2 % yield matches numpy', near(r.yield.s, 304.69487, 1e-4) && near(r.yield.e, 0.0035253979, 1e-9));
  check('tensile: 0.2 % yield near the Voce truth 304.8 MPa', near(r.yield.s, 305.9 / 1.003536, 0.5));
  check('tensile: UTS and uniform elongation', near(r.uts, 437.048, 1e-6) && near(r.eUts, 0.164794512, 1e-8) && near(r.uniformPlastic, 0.162606513, 1e-8));
  check('tensile: fracture elongation (plastic) matches numpy', near(r.fracture.plastic, 0.256800835, 1e-8));
  check('tensile: toughness matches numpy trapezoid', near(r.toughness, 105.6517019, 1e-6));
  check('tensile: resilience σy²/2E', near(r.resilience, 0.2323904543, 1e-9));
  check('tensile: Hollomon n and K match numpy', near(r.hollomon.n, 0.15687777, 1e-7) && near(r.hollomon.K, 668.45533, 1e-3));
  check('tensile: true stress and strain at UTS', near(r.trueStress[r.iUts], 437.048 * 1.164794512, 1e-4) && near(r.trueStrain[r.iUts], Math.log(1.164794512), 1e-8));
  // Toe compensation: a line σ = 1000 (e − 0.001) with a soft toe before it.
  const e = [0, 0.0005, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.01], s = [0, 0.1, 0.5, 1, 2, 3, 4, 4.5, 4.2];
  const t = analyse(e, s, { lo: 0.2, hi: 0.8, offset: 0.002, toe: true });
  check('tensile: toe compensation moves zero to 0.001', near(t.toe, 0.001, 1e-12) && near(t.E, 1000, 1e-9) && t.strain[0] === 0 && near(t.strain[1], 0.001, 1e-12));
  check('tensile: offset yield on a bilinear curve', (() => { const b = analyse([0, 0.0005, 0.001, 0.0015, 0.002, 0.003, 0.004, 0.01, 0.02], [0, 50, 100, 150, 200, 300, 310, 330, 340], { lo: 0.1, hi: 0.6, offset: 0.002, toe: false }); return near(b.E, 100000, 1e-6) && b.yield.s > 310 && b.yield.s < 330 && near(b.yield.s, 100000 * (b.yield.e - 0.002), 1e-6); })());
  check('tensile: trapezoid of a triangle', near(trapz([0, 1, 2], [0, 2, 0]), 2, 1e-12));
  check('tensile: round area and units', near(areaOf('round', 10), 78.5398, 1e-4) && FORCE.kN === 1000 && LENGTH.in === 25.4 && near(STRESS.ksi, 6.894757, 1e-6));
  let threw = false; try { analyse([0, 1, 2, 3, 4], [0, 1, 2, 3, 4], { lo: 0.9, hi: 0.95, offset: 0.002, toe: false }); } catch { threw = true; }
  check('tensile: too few points in the modulus range is an error', threw);
};
