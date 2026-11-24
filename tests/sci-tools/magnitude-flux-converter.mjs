// #T44 Magnitude converter. The band zero points and unit round-trips are pinned in tests/sci.mjs; the case below
// pins the numbers published in src/blog/discoveries/radio-bright-little-red-dot-analog-radio-luminosity-from-3ghz-flux.md:
// a 3.0 mJy radio flux density at 3 GHz, and the luminosity it gives at redshift 0.4332 in a Planck 2018 universe.
import { toJy, fromJy } from '../../src/lib/sci/photometry.ts';
import { cosmology, omegaR } from '../../src/lib/sci/cosmo.ts';
const LAM_UM = (2.99792458e8 / 3.0e9) * 1e6; // 3 GHz as a wavelength in micrometres
export default async (check) => {
  const u = fromJy(toJy(3.0, 'mJy', LAM_UM, null), LAM_UM, null);
  check('magnitude converter: 3.0 mJy at 3 GHz is 3e-29 W/m2/Hz, 3e-26 cgs, 3000 microJy and AB 15.207',
    Math.abs(u.si_nu / 3e-29 - 1) < 1e-12 && Math.abs(u.cgs_nu / 3e-26 - 1) < 1e-12 && Math.abs(u.uJy - 3000) < 1e-9 && Math.abs(u.ab - 15.207) < 5e-4);
  check('magnitude converter: a wavelength of 99,930 micrometres is 3 GHz', Math.abs(LAM_UM - 99930.8) < 1);
  const Or = omegaR(67.66), r = cosmology({ H0: 67.66, Om: 0.3111, OL: 1 - 0.3111 - Or, Or }, 0.4332);
  check('cosmology: Planck 2018 luminosity distance at z = 0.4332 is 2461.3 Mpc, lookback 4.687 Gyr',
    Math.abs(r.dl - 2461.3) < 0.1 && Math.abs(r.lookback - 4.687) < 2e-3);
  const dl = r.dl * 3.0856775814913673e22, nuRest = 3.0e9 * 1.4332;
  const Lnu = (4 * Math.PI * dl * dl * u.si_nu) / 1.4332 ** (1 - 0.39);
  check('radio luminosity: log L_nu = 24.242 W/Hz at rest 4.30 GHz and nu L_nu = 7.5e40 erg/s',
    Math.abs(Math.log10(Lnu) - 24.242) < 1e-3 && Math.abs((nuRest * Lnu * 1e7) / 7.51e40 - 1) < 3e-3);
};
