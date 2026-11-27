// Redshift calculator. Pinned to Carniani et al. (2025, A&A 696, A87, doi:10.1051/0004-6361/202452451): [O III] 88 µm
// (rest 3393.006244 GHz) seen at 223.524 GHz gives z = 14.1796, and with H0 = 70, Ωm = 0.3 one arcsecond at z = 14 is
// 3.268 kpc (our flat, radiation-free sum gives 3.270, within the rounding of the paper's own cosmology code).
import { zFromFreq, velocity } from '../../src/lib/sci/redshift.ts';
import { cosmology, omegaR, sizeFromArcsec } from '../../src/lib/sci/cosmo.ts';

export default async (check) => {
  check('redshift: [O III] 88 µm at 223.524 GHz is z = 14.1796', Math.abs(zFromFreq(223.524, 3393.006244) - 14.1796) < 0.0001);
  check('redshift: 3.268 kpc per arcsec at z = 14 (H0 70, Ωm 0.3)', Math.abs(cosmology({ H0: 70, Om: 0.3, OL: 0.7, Or: 0 }, 14).kpcPerArcsec - 3.268) < 0.005);
  check('redshift: radio velocity of z = 14.1796 is c(1 − 1/15.1796)', Math.abs(velocity(14.1796, 'radio') - 299792.458 * (1 - 1 / 15.1796)) < 1e-6);
  // Onorato et al. (2026, ApJL 1011, L59, doi:10.3847/2041-8213/aeb11f): the quasar pair's 0.98 arcsec at z = 6.08 is about
  // 5.56 kpc; with H0 = 70, Ωm = 0.3, radiation included (the Cosmology calculator's default) we get 5.555 kpc, 899 Myr after the Big Bang.
  { const Or = omegaR(70), r = cosmology({ H0: 70, Om: 0.3, OL: 0.7 - Or, Or }, 6.08); check('redshift: quasar pair 0.98 arcsec at z = 6.08 is 5.56 kpc, 899 Myr', Math.abs(sizeFromArcsec(0.98, r.da) - 5.555) < 0.002 && Math.abs(r.ageZ - 0.899) < 0.001); }
  check('redshift: 6.0781 and 6.0785 differ by 16.9 km/s', Math.abs(velocity(7.0785 / 7.0781 - 1, 'relativistic') - 16.94) < 0.01);
};
