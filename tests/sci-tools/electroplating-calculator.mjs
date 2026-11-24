// #97 Electroplating: Faraday's laws of electrolysis. The general checks of this module live in tests/sci.mjs;
// this file pins the worked cases used in fibub's research articles.
import * as F from '../../src/lib/sci/faraday.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const NI = F.sub('Ni'), AREA = 6, T = 30 * 60, H = 0.5;

  // Blog article ni-p-electrodeposition-current-efficiency-faraday-thickness-current-density:
  // Reddah et al. (2026), Coatings 16(2): 205. S1 measured 3.6 um in 30 min at about 55 % current efficiency.
  const j = (3.6 / H) / F.rate(1, NI, 0.55); // A/cm2 implied by that thickness
  check('plating: 3.6 µm of Ni in 30 min at 55 % needs 1.065 A/dm² (106.5 A/m², 9.89 ASF)', near(j * 100, 1.065, 0.002) && near(j * 929.0304, 9.89, 0.02));
  const m = F.mass(j * AREA, T, NI, 0.55);
  check('plating: that run deposits 19.24 mg over 6 cm² and 3.60 µm of nickel', near(m * 1000, 19.24, 0.02) && near(F.thickness(m, NI.rho, AREA), 3.6, 0.001));
  check('plating: the printed 0.100 A/m² would give only 3.38 nm in the same 30 min', near(F.rate(0.1 / 1e4, NI, 0.55) * H * 1000, 3.38, 0.01));
  check('plating: at the same current density, 15 %, 5 % and 1 % efficiency give 0.98, 0.33 and 0.065 µm', near(F.rate(j, NI, 0.15) * H, 0.982, 0.002) && near(F.rate(j, NI, 0.05) * H, 0.327, 0.002) && near(F.rate(j, NI, 0.01) * H, 0.065, 0.001));
  check('plating: the charge that does not plate makes 6.9 mL of H₂ at 55 % and 15.2 mL at 1 %, at 40 °C', near(1000 * F.gasVolume(F.moles(j * AREA * T, 2, 0.45), 313.15, 101.325), 6.89, 0.02) && near(1000 * F.gasVolume(F.moles(j * AREA * T, 2, 0.99), 313.15, 101.325), 15.16, 0.03));
};
