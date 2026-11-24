// #T42 Sub-exposure calculator: sky signal from a sky-brightness reading, and the shortest sub that keeps
// read noise to a chosen share. Numbers pinned by the article on Hong Kong's night sky brightness
// (So, Pun and Liu 2026, Remote Sensing 18(11): 1691), worked out with the tool's own default rig:
// 80 mm f/6 (480 mm), 3.76 um pixels, 80 % QE, 80 % throughput, 1.5 e- read noise, no dark current.
import { skyFromSqm, skyFromFrame, subLength, efficiency } from '../../src/lib/sci/subexp.ts';

export default async (check) => {
  const RIG = { apertureMm: 80, obstructionPct: 0, focalMm: 480, pixelUm: 3.76, qe: 0.8, throughput: 0.8 };
  const sky = (sqm, bandwidthNm) => skyFromSqm({ ...RIG, sqm, bandwidthNm });
  const near = (got, want, tol) => Number.isFinite(got) && Math.abs(got - want) <= tol;
  // 250, 119 and 9 times the IAU 21.6 mag/arcsec2 reference are 15.61, 16.41 and 19.21 mag/arcsec2.
  check('subexp: 250x the IAU dark sky is 15.61 mag/arcsec2', near(21.6 - 2.5 * Math.log10(250), 15.61, 0.005));
  check('subexp: city sky 15.61 gives 47.9 e- per pixel per second in a 100 nm channel', near(sky(15.61, 100), 47.88, 0.02));
  check('subexp: and a 5 % sub length of 0.458 s', near(subLength(1.5, sky(15.61, 100)), 0.4584, 0.001));
  check('subexp: a 7 nm filter cuts that sky to 3.35 e-/px/s and needs 6.55 s', near(sky(15.61, 7), 3.352, 0.002) && near(subLength(1.5, sky(15.61, 7)), 6.549, 0.01));
  check('subexp: suburban 19.21 needs 180 s and the IAU sky 1630 s in 7 nm', near(subLength(1.5, sky(19.21, 7)), 180.4, 0.2) && near(subLength(1.5, sky(21.6, 7)), 1630, 2));
  check('subexp: a 1.38 mag darkening between early and late night multiplies the sub length by 3.56', near(subLength(1.5, sky(16.41 + 1.38, 7)) / subLength(1.5, sky(16.41, 7)), 10 ** (0.4 * 1.38), 1e-9));
  check('subexp: 60 s is 99.4 % efficient under the city sky in 7 nm', near(efficiency(60, 1.5, sky(15.61, 7)) * 100, 99.4, 0.05));
  check('subexp: the tool page worked example, 3.125 e-/px/s, needs 7.0 s', near(subLength(1.5, skyFromFrame(1250, 500, 0.25, 60)), 7.0244, 0.001));
};
