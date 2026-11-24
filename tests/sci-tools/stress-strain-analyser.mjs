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
  // New with the blog article on early plasticity in DP600/DP800/DC01 (doi:10.1051/meca/2026014): a simulated
  // Ramberg-Osgood DP600 curve (E = 210 GPa, Re = 305 MPa, n = 10.84) read at the 0.2 % offset and at the bending
  // rig's 2.1e-7 offset, with the paper's 20-150 MPa modulus window (6 % to 45 % of the 330 MPa top stress).
  {
    const st = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 290, 300, 305, 310, 320, 330];
    const en = [0, 0.0000952, 0.0001905, 0.0002857, 0.000381, 0.0004762, 0.0005715, 0.0006671, 0.0007637, 0.0008637, 0.000973, 0.0011056, 0.0012917, 0.0015925, 0.0021247, 0.0025387, 0.0031005, 0.0034524, 0.0038617, 0.0048894, 0.0062696];
    const a = analyse(en, st, { lo: 0.06, hi: 0.45, offset: 0.002, toe: false });
    const b = analyse(en, st, { lo: 0.06, hi: 0.45, offset: 2.1e-7, toe: false });
    check('tensile: simulated DP600 curve gives E 209.88 GPa and a 0.2 % proof stress of 305.0 MPa', near(a.E / 1000, 209.88, 0.01) && near(a.yield.s, 305.0, 0.05) && a.nFit === 7);
    check('tensile: the same curve at a 2.1e-7 offset gives 140.3 MPa (modulus-fit sensitivity)', near(b.yield.s, 140.3, 0.05));
  }
  let threw = false; try { analyse([0, 1, 2, 3, 4], [0, 1, 2, 3, 4], { lo: 0.9, hi: 0.95, offset: 0.002, toe: false }); } catch { threw = true; }
  check('tensile: too few points in the modulus range is an error', threw);
  // The PVA + 1 wt% jute cellulose nanocrystal film of Sheikh, Hirogaki and Nakane (2025), Adv. Polym. Technol.,
  // doi:10.1155/adv/7757433 (CC BY 4.0): a Ramberg-Osgood curve through its published modulus and strength at 6.5 %
  // strain, as used in src/blog/discoveries/pva-jute-cellulose-nanocrystal-film-tensile-modulus-toughness.md.
  const film = (() => {
    const uts = 102.93, E = 3254.18, epMax = 0.065 - 102.93 / 3254.18, n = Math.log(epMax / 0.0005) / Math.log(2);
    const st = [], ep = [];
    for (let i = 0; i <= 80; i++) { const s = (uts * i) / 80; st.push(s); ep.push(s / E + epMax * (s / uts) ** n); }
    return { strain: ep, stress: st };
  })();
  const f1 = analyse(film.strain, film.stress, { lo: 0.1, hi: 0.4, offset: 0.002, toe: false });
  const f2 = analyse(film.strain, film.stress, { lo: 0.05, hi: 0.2, offset: 0.002, toe: false });
  check('tensile: jute CNC film modulus, 10-40 % and 5-20 % windows', near(f1.E, 3217, 1) && near(f2.E, 3253, 1));
  check('tensile: jute CNC film yield, toughness and resilience', near(f1.yield.s, 65.54, 0.01) && near(f1.toughness, 4.58, 0.01) && near(f1.resilience, 0.668, 0.001));
  check('tensile: jute CNC film strength and elongation come back unchanged', near(f1.uts, 102.93, 1e-9) && near(f1.eUts, 0.065, 1e-9));
};
