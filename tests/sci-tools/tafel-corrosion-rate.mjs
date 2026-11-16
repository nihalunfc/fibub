// Tafel corrosion rate: inhibitor efficiency check (blog: quaternium-22-corrosion-inhibitor-carbon-steel-hcl).
// Noise-free Wagner-Traud curves for a blank (icorr 400 µA/cm², βa 70, βc 120 mV/dec) and an inhibited steel with
// 2.79 % of that current must give back both icorr values, an efficiency 1 - 11.16/400 = 97.21 %, and the ASTM G102
// rate 3.27e-3 × 400 × 27.92 / 7.87 = 4.640 mm/y for the blank (worked by hand).
import * as COR from '../../src/lib/sci/corrosion.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const curve = (Ec, ic, ba, bc) => { const E = [], i = []; for (let k = 0; k <= 500; k++) { const e = Ec - 0.25 + k * 0.001; E.push(e); i.push(COR.bv(e, Ec, ic, ba, bc)); } return COR.signed(E, i); };
  const b = COR.tafel(curve(-0.47, 400e-6, 0.07, 0.12), 0.08, 0.2), h = COR.tafel(curve(-0.452, 11.16e-6, 0.085, 0.13), 0.08, 0.2);
  // Straight Tafel lines from 80 to 200 mV read a little low (the other branch still adds 1.5 to 3 % at 80 mV):
  // 394.3 and 10.85 µA/cm²; the full Wagner-Traud fit gives the true values back.
  check('tafel: line extrapolation reads 394.3 and 10.85 µA/cm² (1.4 % and 2.8 % low, as expected)', near(b.icorr * 1e6, 394.34, 0.05) && near(h.icorr * 1e6, 10.850, 0.005));
  const fb = COR.fitBV(curve(-0.47, 400e-6, 0.07, 0.12), b.E0, b), fh = COR.fitBV(curve(-0.452, 11.16e-6, 0.085, 0.13), h.E0, h);
  check('tafel: Wagner-Traud fit recovers 400 and 11.16 µA/cm² to 0.01 %', near(fb.icorr, 400e-6, 0.04e-6) && near(fh.icorr, 11.16e-6, 0.0011e-6));
  check('tafel: inhibitor efficiency 1 - 11.16/400 = 97.21 % from the fit (97.25 % from the lines)', near(100 * (1 - fh.icorr / fb.icorr), 97.21, 0.005) && near(100 * (1 - h.icorr / b.icorr), 97.25, 0.01));
  check('tafel: ASTM G102 on carbon steel, 400 µA/cm² = 4.640 mm/y, 11.16 µA/cm² = 0.1295 mm/y', near(COR.rateMmY(400, 27.92, 7.87), 4.6404, 1e-3) && near(COR.rateMmY(11.16, 27.92, 7.87), 0.12946, 1e-4));
};
