// #T60 Radio telescope calculator. The general checks (GBT-like 100 m dish, N(N−1) pairs) live in tests/sci.mjs.
// New with the article on the Murriyang cryogenic phased array feed (PASA 2026, doi:10.1017/pasa.2026.10164):
// a 64 m dish at 1420 MHz with Tsys 17 K and aperture efficiency 0.7, worked by hand from the formulas
// G = ηπ(D/2)²/(2k) × 1e-26, SEFD = Tsys/G, σ = SEFD/√(2 B t), HPBW = 1.2 λ/D.
import { scope } from '../../src/lib/sci/radiotel.ts';

export default async (check) => {
  const near = (a, b, t = 1e-3) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const s = scope({ D: 64, eta: 0.7, tsys: 17, f: 1420e6, n: 1, npol: 2, bw: 5e3 });
  check('radio: 64 m dish, η 0.7: gain 0.816 K/Jy', near(s.gain, 0.8159, 1e-3));
  check('radio: Tsys 17 K gives SEFD 20.8 Jy', near(s.sefd, 20.83, 1e-3));
  check('radio: 5 kHz, 80 s, two polarisations: 23.3 mJy', near(s.sigma(80) * 1e3, 23.29, 1e-3));
  check('radio: the same noise as a temperature is Tsys/√(2Bt) = 19.0 mK', near(s.gain * s.sigma(80), 17 / Math.sqrt(2 * 5e3 * 80), 1e-9));
  check('radio: beam of a 64 m dish at 1420 MHz is 13.6 arcmin', near((s.hpbw * 180 * 60) / Math.PI, 13.60, 1e-3));
};
