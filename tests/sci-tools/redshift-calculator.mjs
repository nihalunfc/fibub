// Redshift calculator. Pinned to Carniani et al. (2025, A&A 696, A87, doi:10.1051/0004-6361/202452451): [O III] 88 µm
// (rest 3393.006244 GHz) seen at 223.524 GHz gives z = 14.1796, and with H0 = 70, Ωm = 0.3 one arcsecond at z = 14 is
// 3.268 kpc (our flat, radiation-free sum gives 3.270, within the rounding of the paper's own cosmology code).
import { zFromFreq, velocity } from '../../src/lib/sci/redshift.ts';
import { cosmology } from '../../src/lib/sci/cosmo.ts';

export default async (check) => {
  check('redshift: [O III] 88 µm at 223.524 GHz is z = 14.1796', Math.abs(zFromFreq(223.524, 3393.006244) - 14.1796) < 0.0001);
  check('redshift: 3.268 kpc per arcsec at z = 14 (H0 70, Ωm 0.3)', Math.abs(cosmology({ H0: 70, Om: 0.3, OL: 0.7, Or: 0 }, 14).kpcPerArcsec - 3.268) < 0.005);
  check('redshift: radio velocity of z = 14.1796 is c(1 − 1/15.1796)', Math.abs(velocity(14.1796, 'radio') - 299792.458 * (1 - 1 / 15.1796)) < 1e-6);
};
