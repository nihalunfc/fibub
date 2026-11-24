// #T19 Telescope calculator: focal ratio, light grasp, resolution, image scale, field of view and sampling.
// Standard optical formulas; the Dome A numbers are pinned by the article on daytime near-infrared photometry
// at Antarctic Dome A (Yang et al. 2025, AJ 169(4), doi:10.3847/1538-3881/adbd0e).
import { scope, camera, eyepiece } from '../../src/lib/astro/optics.ts';

export default async (check) => {
  const near = (got, want, tol) => Number.isFinite(got) && Math.abs(got - want) <= tol;
  // An 8-inch f/10 Schmidt-Cassegrain: the textbook figures for 203 mm.
  const sct = scope(203, 2032);
  check('optics: 203/2032 is f/10.0 with 841x the light grasp of the eye', near(sct.f, 10.01, 0.01) && near(sct.grasp, 841.0, 0.1));
  check('optics: its Dawes limit is 0.57" and Rayleigh 0.68"', near(sct.dawes, 0.571, 0.002) && near(sct.rayleigh, 0.680, 0.002));
  check('optics: its faintest-star estimate is mag 14.2', near(sct.limit, 14.24, 0.01));
  // A 25 mm 50-degree eyepiece on it: 81x, 2.5 mm exit pupil, 0.61 degrees of true field.
  const ep = eyepiece(sct, 25, 50);
  check('optics: a 25 mm 50 deg eyepiece gives 81x, a 2.5 mm exit pupil and 0.61 deg', near(ep.mag, 81.3, 0.1) && near(ep.exit, 2.497, 0.005) && near(ep.tfov, 0.615, 0.003));
  // An IMX571 camera on a 480 mm refractor.
  const cam = camera(scope(80, 480), 23.5, 15.7, 3.76, 3);
  check('optics: IMX571 on 480 mm is 1.62" per pixel', near(cam.scale, 1.616, 0.002));
  check('optics: and a 2.81 x 1.87 degree field', near(cam.fovW / 60, 2.805, 0.005) && near(cam.fovH / 60, 1.873, 0.005));
  check('optics: well matched at 3" seeing, oversampled at 6"', cam.verdict === 'Well matched' && camera(scope(80, 480), 23.5, 15.7, 3.76, 6).verdict === 'Oversampled');
  // Dome A: 150 mm telescope, 15 um pixels at 1238 mm give the paper's 2.5"/px and 0.87 x 0.69 degree field.
  const dome = camera(scope(150, (206.265 * 15) / 2.5), 18.8, 14.9, 15, 1.5);
  check('optics: Dome A rig is 2.50" per pixel', near(dome.scale, 2.5, 0.005));
  check('optics: Dome A field is 0.87 x 0.69 degrees', near(dome.fovW / 60, 0.87, 0.005) && near(dome.fovH / 60, 0.69, 0.005));
  check('optics: 2.5" pixels undersample 1.5" seeing', dome.verdict === 'Undersampled');
  // Sky-limited depth goes as the diameter: 1.25 log10 of the light-grasp ratio.
  const gain = 1.25 * Math.log10(scope(1000, 8250).grasp / scope(150, 1238).grasp);
  check('optics: 150 mm to 1 m is 2.06 magnitudes of sky-limited depth', near(gain, 2.0598, 0.002));
};
