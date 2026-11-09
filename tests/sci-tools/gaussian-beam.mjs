// #930 Gaussian beam: q-parameter propagation checked against an independent NumPy ABCD calculation and Self's
// (1983) thin-lens imaging formula.
import { parseElements, propagate, systemMatrix, rayleigh, divergence, radiusAt, curvatureAt, beamAt, selfImage, throughLens } from '../../src/lib/sci/phgauss.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const els = parseElements('lens 200 50\nlens 400 150 # expander\nlens 600 250 focus');
  check('gauss: parse three lenses', els.length === 3 && els[2].label === 'focus' && els[1].f === 150);
  const M = systemMatrix(els, 1000);
  check('gauss: system ABCD vs NumPy', near(M[0], 1.8, 1e-9) && near(M[1], 146.666667, 1e-7) && near(M[2], 0.012, 1e-9) && near(M[3], 1.533333, 1e-6));
  check('gauss: det ABCD = 1', near(M[0] * M[3] - M[1] * M[2], 1, 1e-12));
  const segs = propagate(0.5, 0, 633, 1, els, 1000);
  const last = segs[segs.length - 1];
  check('gauss: final waist position vs NumPy', near(last.zw, 850.57034647717, 1e-8));
  check('gauss: final waist size vs NumPy', near(last.w0, 0.03340501880585591, 1e-8));
  check('gauss: radius at rail end vs NumPy', near(radiusAt(last, 1000), 0.9019386103116326, 1e-8));
  check('gauss: wavefront radius at rail end vs NumPy', near(curvatureAt(last, 1000), 149.63491262183368, 1e-7));
  check('gauss: 3x expander after lens 2', near(segs[2].w0 / 0.5, 3, 0.01));
  const m2 = propagate(0.5, 0, 633, 1.3, els, 1000).at(-1);
  check('gauss: M² = 1.3 waist vs NumPy', near(m2.zw, 850.9569561134425, 1e-8) && near(m2.w0, 0.043270144896268764, 1e-8) && near(radiusAt(m2, 1000), 0.903273825560547, 1e-8));
  const mir = propagate(1, -100, 633, 1, parseElements('mirror 300 500'), 1000).at(-1);
  check('gauss: concave mirror R 500 acts as f 250', near(mir.zw, 550.3802615559321, 1e-8) && near(mir.w0, 0.050349548553555674, 1e-8));
  // Self (1983): waist at s before a lens of focal length f.
  const zr = rayleigh(0.5, 633), s = 300, f = 100, b = throughLens({ w0: 0.5, zw: 0, zR: zr, theta: divergence(0.5, 633) }, s, f), si = selfImage(s, f, zr);
  check('gauss: lens imaging matches Self formula', near(b.zw - s, si.s2, 1e-9) && near(b.w0 / 0.5, si.m, 1e-9));
  check('gauss: Rayleigh range of 0.5 mm waist at 633 nm', near(zr, 1240.755, 1e-6));
  check('gauss: divergence 0.403 mrad', near(divergence(0.5, 633) * 1e3, 0.40298, 1e-4));
  check('gauss: beam conserves w0·θ (beam parameter product)', near(segs[3].w0 * segs[3].theta, 0.5 * divergence(0.5, 633), 1e-9));
  check('gauss: beamAt picks the right segment', beamAt(segs, 500) === segs[2]);
  let msg = ''; try { parseElements('lens 200'); } catch (e) { msg = e.message; }
  check('gauss: bad line message', msg.includes('Line 1'));
  msg = ''; try { parseElements('prism 1 2'); } catch (e) { msg = e.message; }
  check('gauss: unknown element message', msg.includes('"lens" or "mirror"'));
};
