// #T88 Colligative properties: the worked numbers from the blog article
// src/blog/discoveries/produced-water-forward-osmosis-van-t-hoff-osmotic-pressure-recovery.md
// (a 20 g/L produced water at 21 C against MgCl2 draw solutions; Mohamed et al. 2024, Membranes 14(5): 107, CC BY 4.0).
import * as C from '../../src/lib/sci/colligative.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const T = 294.15; // 21 C
  const m = C.molality(20, 58.44, 1000);
  check('colligative: 20 g NaCl per kg of water = 0.342231 mol/kg', near(m, 0.3422313, 1e-7));
  check('colligative: that feed gives 16.6897 bar at 21 C and 684.46 mOsm/kg', near(C.osmotic(2, m * 0.997, T), 16.68968, 1e-5) && near(2 * m * 1000, 684.463, 1e-3));
  check('colligative: it also freezes 1.27310 K lower (Kf = 1.86)', near(C.deltaT(2, 1.86, m), 1.2731006, 1e-7));
  check('colligative: 16.3 bar needs 19.533 g/L of NaCl in the ideal limit', near(((16.3 / (2 * C.R_BAR * T)) * 58.44) / 0.997, 19.53303, 1e-4));
  const cDraw = 120 / (3 * C.R_BAR * T);
  check('colligative: 120 bar needs 1.635524 mol/L MgCl2 (155.7 g/L), and the tool gives 120 bar back', near(cDraw, 1.6355241, 1e-7) && near(C.osmotic(3, cDraw, T), 120, 1e-12));
  // Recovery ceiling: pi_d0 Vd/(Vd + Vf r) = pi_f0/(1 - r), with pi_f0 the ideal feed pressure above.
  const pif = C.osmotic(2, m * 0.997, T), ceiling = (pi0, Vd, Vf = 2.5) => (pi0 * Vd - pif * Vd) / (pi0 * Vd + Vf * pif);
  check('colligative: recovery ceilings of 28.51 % (30 bar, 2.5 L draw) and 80.97 % (120 bar, 5.5 L draw)', near(100 * ceiling(30, 2.5), 28.50806, 1e-4) && near(100 * ceiling(120, 5.5), 80.97295, 1e-4));
};
