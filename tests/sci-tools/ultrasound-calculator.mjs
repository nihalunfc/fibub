// #973 Ultrasound calculator. Reference values from an independent numpy script written for these tests, and the
// textbook result that a soft tissue to air boundary reflects about 99.9 % of the intensity.
import * as U from '../../src/lib/sci/phus.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t, M = U.MEDIA, st = M[1], fat = M[2], mus = M[3], bone = M[6], air = M[7];
  check('us: impedance of soft tissue 1.63 MRayl', near(U.impedance(st), 1.6324e6, 1));
  check('us: soft tissue to air reflects 99.9 %', near(U.boundary(st, air).R, 0.998992, 1e-6));
  check('us: fat to muscle and soft tissue to bone match numpy', near(U.boundary(fat, mus).R, 0.0104142, 1e-7) && near(U.boundary(st, bone).R, 0.4178017, 1e-7));
  check('us: oblique incidence matches numpy', near(U.boundary(st, bone, 15).R, 0.5145131, 1e-7) && near(U.boundary(fat, mus, 30).R, 0.0139183, 1e-7));
  check('us: critical angle and total reflection', near(U.boundary(st, bone).critical, 22.64374, 1e-5) && U.boundary(st, bone, 25).total && U.boundary(st, bone, 25).R === 1 && U.boundary(bone, st).critical === null);
  check('us: same impedance, no reflection', U.boundary(st, st).R === 0 && near(U.boundary(st, st, 40).thetaT, 40, 1e-9));
  check('us: wavelength, axial resolution, near field, divergence', near(U.wavelength(1540, 5), 0.308, 1e-12) && near(U.axialRes(3, 1540, 5), 0.462, 1e-12) && near(U.nearField(10, 1540, 5), 81.168831, 1e-6) && near(U.divergence(10, 1540, 5), 2.1534532, 1e-6) && Number.isNaN(U.divergence(0.1, 1540, 1)));
  check('us: half-value layer, penetration and attenuation', near(U.halfValueLayer(0.5, 5), 1.20412, 1e-5) && U.penetration(0.5, 5, 60) === 12 && U.attenuationDb(0.5, 5, 4) === 10 && near(U.fromDb(10), 0.1, 1e-15));
  check('us: echo time 13 µs per cm and PRF limit', near(U.echoTime(10, 1540), 129.87013, 1e-4) && U.maxPrf(10, 1540) === 7700);
  check('us: Doppler shift and aliasing limit', near(U.doppler(5, 0.5, 60, 1540), 1623.3766, 1e-3) && near(U.vMaxDoppler(5000, 5, 60, 1540), 0.77, 1e-12));
};
