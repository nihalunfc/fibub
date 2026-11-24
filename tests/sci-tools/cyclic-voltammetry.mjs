// Cyclic voltammetry analyser (src/lib/sci/cv.ts): Randles–Sevcik numbers pinned to the worked example of the
// screen-printed electrode article (Applied Sciences 16: 10077, 2026). The core checks live in tests/sci.mjs.
import { randlesSevcik, rsConstant } from '../../src/lib/sci/cv.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  // 5 mM ferricyanide, D = 6.7e-6 cm²/s, n = 1, 298 K: the paper's mean slope 6510.5 µA (V/s)^-½ gives 1.872 cm².
  check('cv: Randles–Sevcik constant is 2.687e5 at 298 K', near(rsConstant(298), 2.6872e5, 1e-4));
  check('cv: 6510.5 µA per (V/s)^½ at 5 mM, D 6.7e-6 means 1.872 cm² (paper: about 1.87)', near(6510.5e-6 / randlesSevcik(1, 1, 6.7e-6, 0.005, 1, 298), 1.8720, 1e-4));
  check('cv: a 4 mm disc at 5 mM, 50 mV/s peaks near 97.7 µA', near(randlesSevcik(1, Math.PI * 0.04, 6.7e-6, 0.005, 0.05, 298) * 1e6, 97.72, 1e-3));
};
