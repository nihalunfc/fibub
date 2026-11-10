// #1367 Bomb calorimeter. Checked by independent hand calculation (Python): 1.000 g benzoic acid, ΔT 2.604 K →
// C = 10.1498 kJ/K; 1.200 g glucose in that calorimeter → q = 18.670 kJ, ΔT = 1.8395 K and back to ΔU = −2803 kJ/mol;
// naphthalene ΔU −5152, Δn −2 → ΔH = −5156.955 kJ/mol at 298 K; urea Δn +½ → ΔH = −631.76.
import * as B from '../../src/lib/sci/bomb-calorimeter.ts';
const near = (a, b, t = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  check('bomb: calibration C = 26.43 / 2.604 = 10.1498 kJ/K', near(B.heatCapacity(1, 2.604), 10.149769585253456, 1e-12));
  const q = 1.2 / 180.16 * 2803;
  check('bomb: 1.2 g glucose releases 18.670 kJ', near(q, 18.670071047957372, 1e-12));
  check('bomb: glucose rise 1.8395 K in a 10.1498 kJ/K calorimeter', near(B.rise(q, 10.149769585253456), 1.8394578, 1e-6));
  check('bomb: back to ΔU = −2803 kJ/mol', near(B.molarU(q, 1.2, 180.16), -2803, 1e-12));
  check('bomb: naphthalene ΔH = ΔU + ΔnRT = −5156.955', near(B.enthalpy(-5152, -2), -5156.95541972, 1e-9));
  check('bomb: urea Δn = +½ gives ΔH above ΔU', near(B.enthalpy(-633, 0.5), -631.761, 1e-5));
  check('bomb: reading flat before firing, then rises to ΔT', B.reading(4, 25, 2) === 25 && near(B.reading(30, 25, 2), 27, 1e-9));
};
