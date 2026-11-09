// #1068 hydrogen-spectrum: Bohr levels and Rydberg wavelengths checked against Python with CODATA 2018 constants
// (and against the well-known values: Lyman α 121.57 nm, H-alpha 656.47 nm in vacuum, Balmer limit 364.7 nm).
import { R_H, RY_EV, energyEV, wavelengthNm, photonEV, seriesName, region, radiusNm, speed } from '../../src/lib/sci/learnhydrogen.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('hyd: R_H = 10967758.34 m⁻¹', near(R_H, 10967758.340280352, 1e-12));
  check('hyd: ionisation energy 13.5983 eV', near(RY_EV, 13.598287264287854, 1e-9));
  check('hyd: E2 = −3.3996 eV', near(energyEV(2), -3.3995718160719635, 1e-9));
  check('hyd: H-alpha 3→2 = 656.470 nm (vacuum)', near(wavelengthNm(2, 3), 656.4696, 1e-6));
  check('hyd: Lyman alpha = 121.5684 nm', near(wavelengthNm(1, 2), 121.56844561723405, 1e-9));
  check('hyd: Balmer limit = 364.705 nm', near(wavelengthNm(2, Infinity), 364.7053, 1e-5));
  check('hyd: photon energy 3→2 = 1.8887 eV and E = hc/λ', near(photonEV(2, 3), 1.8886510089288686, 1e-9) && near(photonEV(2, 3) * wavelengthNm(2, 3), 1239.8419843320026, 1e-9));
  check('hyd: series names', seriesName(1) === 'Lyman' && seriesName(2) === 'Balmer' && seriesName(3) === 'Paschen');
  check('hyd: regions', region(121.6) === 'ultraviolet' && region(656.5) === 'visible' && region(1875) === 'infrared');
  check('hyd: r3 = 9 a0 = 0.4763 nm, v3 = v1/3', near(radiusNm(3), 0.4762594898127, 1e-9) && near(speed(3), 729230.42121, 1e-9));
};
