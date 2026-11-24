// #99 Decay calculator. The core decay maths is pinned in tests/sci.mjs (F-18 at 370 MBq and the half-life
// identity). Added with /blog/discoveries/copper-67-64-accelerator-production-decay-losses/: the copper-67 and
// copper-64 production run of Nagai et al. (2025), Front. Nucl. Med. 5: 1657125, with recommended half-lives.
import { decay, timeTo, specific, halfLifeS, nuclide } from '../../src/lib/sci/decay.ts';
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  const h67 = halfLifeS(61.83, 'h'), h64 = halfLifeS(12.701, 'h'), h65 = halfLifeS(243.93, 'd');
  check('copper run: Cu-64 is in the nuclide list at 12.701 h', nuclide('Cu-64').t === 12.701 && nuclide('Cu-64').u === 'h');
  const sep = 8 * 3600; // the paper's separation: about 4 h of sublimation plus 4 h of chromatography
  check('copper run: 8 h leaves 0.914220 of Cu-67 and 0.646234 of Cu-64', near(decay(1, sep, h67), 0.91421980, 1e-7) && near(decay(1, sep, h64), 0.64623390, 1e-7));
  check('copper run: 1.23 kBq of Cu-67 becomes 1124.49 Bq, 6.61 kBq of Cu-64 becomes 4271.6 Bq', near(decay(1230, sep, h67), 1124.4904, 1e-6) && near(decay(6610, sep, h64), 4271.6061, 1e-6));
  check('copper run: Zn-65 barely moves in 8 h (99.9 % left)', near(decay(1, sep, h65), 0.99905, 1e-4));
  check('copper run: a 100-fold rise in the Zn-65 share takes 84.38 h for Cu-64 and 410.79 h for Cu-67', near(timeTo(1, 0.01, h64) / 3600, 84.383617, 1e-6) && near(timeTo(1, 0.01, h67) / 3600, 410.789628, 1e-6));
  const s = specific(h67, 67);
  check('copper run: carrier-free Cu-67 is 2.7990e16 Bq/g with a mean life of 89.202 h', near(s.perGram, 2.79898012e16, 1e-7) && near(s.meanLife / 3600, 89.20183, 1e-6));
  // Rounding a short half-life to two decimals in days: Ni-65 at 0.11 d is 4.9 % high, and a one-day
  // decay correction then differs by 36 %.
  const niRef = halfLifeS(2.5175, 'h'), niPaper = halfLifeS(0.11, 'd');
  check('copper run: Ni-65 rounded to 0.11 d is 4.9 % high and shifts a one-day correction by 36 %', near(niPaper / niRef - 1, 0.04865, 2e-3) && near(decay(1, 86400, niPaper) / decay(1, 86400, niRef) - 1, 0.358823, 1e-4));
};
