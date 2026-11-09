// #906 video motion tracker: finite differences checked against numpy.gradient (uneven spacing, a skipped frame), and the
// constant-velocity and constant-acceleration fits against numpy.polyfit(cov=True).
import { gradient, polyFit, toWorld, metresPerPixel, analyse } from '../../src/lib/sci/phmotion.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const t = [0, 1 / 30, 2 / 30, 3 / 30, 5 / 30, 6 / 30, 7 / 30, 8 / 30], x = [0, 0.051, 0.099, 0.152, 0.249, 0.302, 0.348, 0.401], y = [1.2, 1.195, 1.178, 1.152, 1.065, 1.006, 0.935, 0.853];
  const gx = [1.53, 1.485, 1.515, 1.545, 1.545, 1.485, 1.485, 1.59], gy = [-0.15, -0.33, -0.645, -0.955, -1.615, -1.95, -2.295, -2.46], ay = [-5.4, -7.425, -9.375, -9.5, -10, -10.2, -7.65, -4.95];
  check('motion: velocity by finite differences = numpy.gradient (with a skipped frame)', gradient(t, x).every((v, i) => near(v, gx[i])) && gradient(t, y).every((v, i) => near(v, gy[i])));
  check('motion: acceleration (gradient of gradient) = numpy', gradient(t, gradient(t, y)).every((v, i) => near(v, ay[i], 1e-8)));
  const l = polyFit(t, x, 1);
  check('motion: straight-line fit x = 0.000383 + 1.499 t, errors 0.00100 and 0.00621 (numpy.polyfit)', near(l.c[0], 0.00038333333333336836) && near(l.c[1], 1.499) && near(l.se[0], 0.0010037199329014483, 1e-8) && near(l.se[1], 0.006211548384528027, 1e-8));
  const q = polyFit(t, y, 2);
  check('motion: quadratic fit y = 1.19985 + 0.01120 t − 4.9151 t², errors vs numpy.polyfit', near(q.c[0], 1.1998461240310077) && near(q.c[1], 0.011197674418612868) && near(q.c[2], -4.915116279069802) && near(q.se[2], 0.02623014585642953, 1e-8) && near(q.se[1], 0.007225864321823793, 1e-8));
  check('motion: two clicks 200 px apart for 0.5 m give 2.5 mm per pixel', near(metresPerPixel(10, 10, 130, 170, 0.5), 0.0025));
  { const w = toWorld([{ t: 0, x: 110, y: 50 }], 100, 250, 0.01); check('motion: pixels to metres with y upwards', near(w[0].x, 0.1) && near(w[0].y, 2)); }
  { const pts = Array.from({ length: 10 }, (_, i) => ({ t: i / 25, x: 0.3 + 2 * (i / 25), y: 1 + 3 * (i / 25) - 4.905 * (i / 25) ** 2 })), a = analyse(pts);
    check('motion: exact parabola gives a = −9.81 from the fit and the interior differences', near(2 * a.fy.quad.c[2], -9.81, 1e-9) && a.ay.slice(2, -2).every((v) => near(v, -9.81, 1e-9)) && near(a.fx.lin.c[1], 2)); }
};
