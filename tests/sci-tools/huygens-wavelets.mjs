// #1423 Huygens wavelets: refraction angle against Snell's law (Python math.asin), and the envelope checked by
// geometry: the line from the contact point to the tangent point touches every wavelet (distance = radius).
import { refractedAngle, wavelets, envelope, distToLine } from '../../src/lib/sci/q-huygens.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const c = 2.998, v1 = c / 1, v2 = c / 1.5;
  check('huygens: air → glass at 40°: r = 25.374° (Snell)', near(refractedAngle(40, v1, v2), 25.373993939179407, 1e-9));
  check('huygens: water → air at 60°: no refracted wave (sin r = 1.1518)', refractedAngle(60, c / 1.33, c) === null && refractedAngle(45, c / 1.33, c) !== null);
  for (const [i, va, vb, t] of [[40, v1, v2, 1], [40, v1, v2, 0.55], [70, v1, c / 2.42, 0.8], [30, c / 1.33, c, 1], [35, v1, v1, 0.7]]) {
    const W = 220, wl = wavelets(W, i, va, vb, t, 9), env = envelope(W, i, va, vb, t);
    const P = [t * W, 0];
    const ok = env && wl.every((w) => near(distToLine([w.x, 0], P, env.tangent), w.r, 1e-9));
    check(`huygens: i ${i}°, v2/v1 ${(vb / va).toFixed(3)}, t ${t}: one line touches all ${wl.length} wavelets`, ok);
    check(`huygens: i ${i}°: envelope angle equals Snell's r`, near(env.angle, refractedAngle(i, va, vb), 1e-9));
  }
  check('huygens: reflection (same speed) gives r = i', near(envelope(220, 35, v1, v1, 0.7).angle, 35, 1e-9));
  check('huygens: wavelets start only once the wavefront arrives', wavelets(220, 40, v1, v2, 0.5, 10).length === 6 && wavelets(220, 40, v1, v2, 0, 10).length === 1);
  check('huygens: total internal reflection: no envelope', envelope(220, 60, c / 1.33, c, 1) === null);
};
