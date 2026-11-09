// #912 skin depth calculator: checked against SciPy (complex Bessel functions jv for the round wire, the
// complex propagation constant for lossy media) and the textbook low- and high-frequency limits.
import * as S from '../../src/lib/sci/ph-skin.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.abs(b);
  check('skin: copper at 50 Hz, δ = 9.33 mm', rel(S.skinDepth(1.72e-8, 50), 0.009334678245334186, 1e-9) && rel(S.skinDepthGood(1.72e-8, 50), 0.009334678245334186, 1e-12));
  check('skin: copper at 1 MHz, δ = 66.0 µm, Rs = 0.261 mΩ', rel(S.skinDepth(1.72e-8, 1e6), 6.600614287470346e-05, 1e-9) && rel(S.surfaceR(1.72e-8, 1e6), 0.00026058180725163714, 1e-12));
  for (const [rho, er, f, want] of [[0.2, 80, 1e9, 0.01062624351144249], [0.2, 80, 1e3, 7.117628602412891], [1e3, 4, 1e8, 10.620353399076842]])
    check(`skin: exact δ for ρ = ${rho} Ω m, εr = ${er} at ${f} Hz (SciPy propagation constant)`, rel(S.skinDepth(rho, f, 1, er), want, 1e-9));
  check('skin: δ falls as 1/√(μr f)', rel(S.skinDepth(1e-7, 1e4, 100) * 10, S.skinDepth(1e-7, 1e4, 1), 1e-9));
  check('skin: J1/J0 ratio by continued fraction at small z is z/2', (() => { const r = S.besselRatio([1e-4, -1e-4]); return rel(r[0], 0.5e-4, 1e-6) && rel(r[1], -0.5e-4, 1e-6); })());
  for (const [u, r, x] of [[0.5, 1.0013007285557947, 0.062459355760410895], [1, 1.0204923888556223, 0.24744199828150282], [2, 1.2646429062732136, 0.8704825956041908], [5, 2.76810760073429, 2.4767247880708534], [20, 10.254679114660355, 9.99507047612892], [50, 25.251874490567317, 24.99808700820431]]) {
    const w = S.wireRatio(u, 1);
    check(`skin: round wire Z/Rdc at a/δ = ${u} matches SciPy jv`, rel(w.r, r, 1e-10) && rel(w.x, x, 1e-10));
  }
  check('skin: thick wire R_ac/R_dc → a/2δ + 1/4', rel(S.wireRatio(500, 1).r, 250.25, 1e-4));
  check('skin: wire at DC has internal reactance ωμ/8π (x → (a/δ)²/4)', rel(S.wireRatio(0.01, 1).x, 0.01 ** 2 / 4, 1e-4));
  check('skin: sheet of 35 µm copper at 1 MHz (SciPy coth)', rel(S.sheetR(1.72e-8, 35e-6, S.skinDepth(1.72e-8, 1e6)), 0.0004948715708248221, 1e-9));
  check('skin: thin sheet → ρ/t, thick sheet → ρ/δ', rel(S.sheetR(1e-8, 1e-6, 1e-3), 1e-2, 1e-6) && rel(S.sheetR(1e-8, 1, 1e-3), 1e-5, 1e-12));
  check('skin: absorption 8.686 dB per skin depth', rel(S.absorptionDb(1, 1), 8.685889638065035, 1e-12));
  // Coax conductor loss: copper 1/3.5 mm air line at 1 GHz, by the direct formula.
  { const Rs = S.surfaceR(1.72e-8, 1e9), a = 0.5e-3, b = 1.75e-3, eta = 376.730313412;
    check('skin: coax conductor attenuation Rs(1/a + 1/b)/(2η ln(b/a))', rel(S.coaxLoss(Rs, a, b, 1), (Rs * (1 / a + 1 / b)) / (2 * eta * Math.log(b / a)), 1e-8)); }
};
