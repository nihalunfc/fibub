// #light-pollution-calculator. The "% per year" trends of the Dutch and German Wadden sky quality meter network
// (Shah et al. 2025, MNRAS 542, 272, doi:10.1093/mnras/staf1200) are the yearly change in luminance,
// 10^(−0.4·Δm) − 1, from each fitted slope Δm in mag/arcsec² per year: the conversion this calculator uses.
import { sqmToMcd, skyglow } from '../../src/lib/sci/skyglow.ts';

export default async (check) => {
  const pct = (m0, dm) => 100 * (sqmToMcd(m0 + dm) / sqmToMcd(m0) - 1);
  check('skyglow: Hornhuizen −0.070 mag/yr is 6.68 % brighter a year (slope rounded to 0.001)', Math.abs(pct(21.77, -0.07) - 6.68) < 0.05);
  check('skyglow: De Held −0.223 mag/yr is 22.83 % brighter a year', Math.abs(pct(19.695, -0.223) - 22.83) < 0.05);
  check('skyglow: Nes +0.081 mag/yr is 7.20 % darker a year', Math.abs(-pct(21.433, 0.081) - 7.2) < 0.05);
  check('skyglow: 21.77 mag/arcsec² is 1.22 natural skies, artificial light adds 22 %', Math.abs(skyglow(21.77).nsu - 1.216) < 0.001 && Math.round(100 * skyglow(21.77).artificial) === 22);
};
