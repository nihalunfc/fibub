// #1429 Energy bands. ni model, carrier densities and LED wavelengths checked against an independent Python version
// (math.exp, and scipy.optimize.brentq solving n − ni²/n − N = 0 for the doped case).
import * as B from '../../src/lib/sci/energybands.ts';
const PY = { si300: 9780342473.978699, ge300: 71479911266291.58, si400over300: 346.18208671956336, n600: 1985283977829068.2, p600: 985283977829068.4, ni600: 1398595186176379.0 };
const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.abs(b);
export default async (check) => {
  check('bands: ni(Si, 300 K) equals Python', rel(B.ni(1.12, 300), PY.si300));
  check('bands: ni(Ge, 300 K) equals Python', rel(B.ni(0.66, 300), PY.ge300));
  check('bands: Si 400 K vs 300 K ratio', rel(B.niRatio(1.12, 400), PY.si400over300));
  const c = B.carriers(1.12, 600, 'n', 1e15);
  check('bands: n-type at 600 K equals scipy brentq', rel(c.n, PY.n600) && rel(c.p, PY.p600) && rel(c.ni, PY.ni600));
  const d = B.carriers(1.12, 300, 'p', 1e16);
  check('bands: p-type majority = N, n·p = ni²', rel(d.p, 1e16, 1e-6) && rel(d.n * d.p, d.ni * d.ni));
  check('bands: LED wavelength 1240/Eg', Math.abs(B.lambdaNm(1.9) - 652.55) < 0.01 && Math.abs(B.egFromLambda(450) - 2.7552) < 1e-4);
  check('bands: colour names', B.colourName(652) === 'red' && B.colourName(460) === 'blue' && B.colourName(530) === 'green' && B.colourName(1107) === 'infrared' && B.colourName(300) === 'ultraviolet');
  check('bands: wavelengthRGB red and black outside', B.wavelengthRGB(700).join() === '255,0,0' && B.wavelengthRGB(900).join() === '0,0,0');
  check('bands: classify', B.classify(0) === 'conductor' && B.classify(1.12) === 'semiconductor' && B.classify(5.5) === 'insulator');
  check('bands: dots', B.dots(1e10) === 8 && B.dots(1) === 0 && B.dots(1e30) === 30);
  let bad = 0; for (const f of [() => B.ni(1, 0), () => B.ni(0, 300), () => B.lambdaNm(0), () => B.classify(-1)]) { try { f(); } catch { bad++; } }
  check('bands: bad input refused', bad === 4);
};
