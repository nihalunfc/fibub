// #541 Graphing calculator. Reference values from Python (numpy 2 / scipy, /home/user/pyenv):
// numpy.roots for the cubic and for the cubic-circle crossings (x^2 + (x^3-2x-1)^2 - 16 = 0),
// scipy.integrate.quad for the cardioid length (8, exact), scipy.special.ellipe for the ellipse
// perimeter, scipy.optimize.brentq for exp(x) = x + 2, minimize_scalar for x·e^(-x) (max 1/e at x = 1).
import { readCurve, readSurface, constant, sampleExplicit, sampleParametric, samplePolar, contour, keyPoints, crossings, crossingsImplicit, pieceLength, surfaceGrid, project } from '../../src/lib/sci/grapher.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const throws = (s, re) => { try { readCurve(s); return false; } catch (e) { return re.test(e.message); } };
  // Reading what people type.
  check('grapher: y = … is explicit', readCurve('y = x^3 - 2x - 1').kind === 'explicit' && readCurve('x^2 = y').kind === 'explicit' && readCurve('sin(x)').kind === 'explicit');
  check('grapher: equations are implicit', readCurve('x^2 + y^2 = 16').kind === 'implicit' && readCurve('x = 3').kind === 'implicit' && readCurve('y = 2y + x').kind === 'implicit');
  check('grapher: polar and parametric', readCurve('r = 1 + cos(θ)').kind === 'polar' && readCurve('r = cos(3theta)').kind === 'polar' && readCurve('(cos(t), sin(2t))').kind === 'parametric');
  check('grapher: slider letters and e', readCurve('y = a sin(b x) + e').params.join() === 'a,b' && near(readCurve('y = e^x').make({}).f(1), Math.E));
  check('grapher: friendly errors', throws('y = sinx', /not a name/) && throws('y = x = 2', /one = sign/) && throws('r = x', /θ/) && throws('y = ', /missing/) && throws('y = (x', /not closed/) && throws('(x, t)', /uses t/));
  check('grapher: constants in boxes', near(constant('2pi'), 2 * Math.PI) && near(constant('-e'), -Math.E) && Number.isNaN(constant('x')));
  { const f = readCurve('y = a x + b').make({ a: 2, b: -3 }).f; check('grapher: slider values used', f(5) === 7); }

  // Key points of the cubic (numpy.roots: -1, -0.6180339887498948, 1.6180339887498945; turning points at ±sqrt(2/3)).
  { const f = readCurve('y = x^3 - 2x - 1').make({}).f, k = keyPoints(f, -6, 6);
    const r = k.filter((p) => p.what === 'root').map((p) => p.x), mx = k.find((p) => p.what === 'max'), mn = k.find((p) => p.what === 'min'), yi = k.find((p) => p.what === 'y-intercept');
    check('grapher: cubic roots', r.length === 3 && near(r[0], -1, 1e-12) && near(r[1], -0.6180339887498948, 1e-12) && near(r[2], 1.6180339887498945, 1e-12));
    check('grapher: cubic turning points', near(mx.x, -0.816496580927726, 1e-7) && near(mx.y, 0.08866210790363471, 1e-12) && near(mn.x, 0.816496580927726, 1e-7) && near(mn.y, -2.0886621079036347, 1e-12) && yi.y === -1);
    const c = crossingsImplicit(f, readCurve('x^2 + y^2 = 16').make({}).F, -6, 6);
    check('grapher: cubic meets circle (numpy.roots)', c.length === 2 && near(c[0].x, -1.8402502982767022, 1e-11) && near(c[0].y, -3.55154597882282, 1e-10) && near(c[1].x, 2.0427969848075795, 1e-11) && near(c[1].y, 3.4390377257106337, 1e-10)); }
  { const k = keyPoints(Math.sin, -6, 6); const r = k.filter((p) => p.what === 'root').map((p) => p.x);
    check('grapher: sin roots and turning points', r.length === 3 && near(r[0], -Math.PI, 1e-12) && r[1] === 0 && near(r[2], Math.PI, 1e-12) && k.filter((p) => p.what === 'max').length === 2 && near(k.find((p) => p.what === 'max').y, 1, 1e-12)); }
  { const k = keyPoints((x) => x * Math.exp(-x), -1, 5), m = k.find((p) => p.what === 'max');
    check('grapher: x·e^-x has its maximum 1/e at x = 1', near(m.x, 1, 1e-7) && near(m.y, Math.exp(-1), 1e-13)); }
  { const k = keyPoints((x) => (x - 1) ** 2, -3, 3); check('grapher: a double root is found at the turning point', k.filter((p) => p.what === 'root').length === 1 && near(k.find((p) => p.what === 'root').x, 1, 1e-7)); }
  { const k = keyPoints((x) => 1 / x, -3, 3); check('grapher: a pole is not a root', !k.some((p) => p.what === 'root')); }
  { const k = keyPoints(Math.tan, -3, 3); check('grapher: tan has one root in (-3, 3) and no false turning points', k.filter((p) => p.what === 'root').length === 1 && !k.some((p) => p.what === 'max' || p.what === 'min')); }
  { const c = crossings(Math.exp, (x) => x + 2, -4, 4); check('grapher: exp(x) = x + 2 (scipy brentq)', c.length === 2 && near(c[0].x, -1.8414056604369606, 1e-12) && near(c[1].x, 1.1461932206205825, 1e-12)); }

  // Sampling: breaks at asymptotes, domain edges reached.
  check('grapher: tan breaks at its 4 asymptotes in (-5, 5)', sampleExplicit(Math.tan, -5, 5, 10).length === 5);
  check('grapher: 1/x breaks at 0', sampleExplicit((x) => 1 / x, -5, 5, 10).length === 2);
  check('grapher: floor jumps make separate steps', sampleExplicit(Math.floor, -2.5, 2.5, 6).length === 6);
  check('grapher: a steep but smooth curve stays whole', sampleExplicit((x) => Math.atan(1000 * x), -5, 5, 4).length === 1);
  { const p = sampleExplicit((x) => Math.sqrt(4 - x * x), -5, 5, 10); check('grapher: semicircle reaches its domain ends', p.length === 1 && near(p[0][0][0], -2, 1e-12) && near(p[0].at(-1)[0], 2, 1e-12) && near(pieceLength(p[0]), 2 * Math.PI, 1e-3)); }
  { const r = readCurve('r = 1 + cos(θ)').make({}).r; const p = samplePolar(r, 0, 2 * Math.PI, 4); check('grapher: cardioid length is 8 (scipy quad)', p.length === 1 && near(pieceLength(p[0]), 8, 1e-5)); }
  { const p = sampleParametric((t) => 3 * Math.cos(t), (t) => 2 * Math.sin(t), 0, 2 * Math.PI, 6); check('grapher: ellipse perimeter (scipy ellipe 15.8654395893)', near(pieceLength(p[0]), 15.865439589290588, 1e-5)); }
  { const p = sampleParametric((t) => t, (t) => 1 / t, -3, 3, 6); check('grapher: parametric curve breaks at a pole', p.length === 2); }

  // Implicit curves by marching squares.
  { const F = readCurve('x^2 + y^2 = 16').make({}).F, c = contour(F, -6, 6, -4.5, 4.5, 240, 180);
    const worst = Math.max(...c.flat().map(([x, y]) => Math.abs(Math.hypot(x, y) - 4)));
    check('grapher: circle traced as one closed loop on the curve', c.length === 1 && worst < 1e-12 && near(pieceLength(c[0]), 8 * Math.PI, 1e-4)); }
  { const c = contour((x, y) => x - 2, -5, 5, -5, 5, 100, 100); check('grapher: x = 2 is a vertical line', c.length === 1 && c[0].every(([x]) => near(x, 2, 1e-12)) && near(pieceLength(c[0]), 10, 1e-9)); }
  { const c = contour((x, y) => x * y - 1, -4, 4, -4, 4, 160, 160); check('grapher: xy = 1 gives two branches', c.length === 2 && c.flat().every(([x, y]) => Math.abs(x * y - 1) < 1e-10)); }
  { const c = contour((x, y) => 1 / (x - y), -4, 4, -4, 4, 80, 80); check('grapher: a pole is not drawn as a curve', c.length === 0); }
  { const c = contour((x, y) => x ** 3 + y ** 3 - 3 * x * y, -3, 3, -3, 3, 300, 300); check('grapher: folium of Descartes points satisfy the equation', c.length >= 1 && c.flat().every(([x, y]) => Math.abs(x ** 3 + y ** 3 - 3 * x * y) < 1e-9)); }

  // 3D surface.
  { const s = readSurface('z = sin(x) cos(y)'), g = surfaceGrid(s.make({}), -Math.PI, Math.PI, -Math.PI, Math.PI, 40);
    check('grapher: surface grid range', g.z.length === 41 && near(g.zmax, 1, 1e-12) && near(g.zmin, -1, 1e-12) && g.bad === 0); }
  { const g = surfaceGrid((x, y) => Math.sqrt(1 - x * x - y * y), -1, 1, -1, 1, 10); check('grapher: undefined surface points are counted', g.bad > 0 && near(g.zmax, 1, 1e-12)); }
  { const [X, Y, D] = project(1, 0, 0, Math.PI / 2, 0); check('grapher: projection turns the box', near(X, 0, 1e-15) && near(Y, 0, 1e-15) && near(D, -1, 1e-15)); }
  { let ok = false; try { readSurface('z = z + 1'); } catch { ok = true; } check('grapher: surface rejects z on the right', ok && readSurface('x*y').params.length === 0); }
};
