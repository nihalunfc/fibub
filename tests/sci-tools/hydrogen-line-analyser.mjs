// Hydrogen 21 cm line analyser: kinematic distances (src/lib/astro/hline.ts). The broader checks live in tests/sci.mjs.
import { kinematicDistance, tangentPoint, GALAXY } from '../../src/lib/astro/hline.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  const { R0, V0 } = GALAXY.modern;
  // Milky Way bar end (a 4.3 kpc, φ 20°; Davis et al. 2026, Nature Astronomy, CC BY 4.0), as used in
  // /blog/discoveries/norma-arm-masers-milky-way-bar-shock-front-4-3-kpc-kinematic-distance/.
  check('hline: circular gas at the bar end (l 19.473°, 70.45 km/s) returns R 4.300 kpc, 4.412 or 11.05 kpc away', (() => {
    const x = 4.3 * Math.cos(Math.PI / 9), y = 4.3 * Math.sin(Math.PI / 9), l = (Math.atan2(y, R0 - x) * 180) / Math.PI;
    const v = V0 * Math.sin((l * Math.PI) / 180) * (R0 / 4.3 - 1), kd = kinematicDistance(l, 0, v, R0, V0);
    return near(l, 19.473, 1e-4) && near(v, 70.45, 1e-4) && near(kd.R, 4.3, 1e-9) && near(kd.d[0], 4.4117, 1e-4) && near(kd.d[1], 11.0502, 1e-4);
  })());
  check('hline: flat-curve terminal velocity recovers V0 at the tangent point', (() => {
    const l = 19.47, vt = V0 * (1 - Math.sin((l * Math.PI) / 180)), t = tangentPoint(l, vt, R0, V0);
    return near(t.V, V0, 1e-12) && near(t.R, R0 * Math.sin((l * Math.PI) / 180), 1e-12);
  })());
};
