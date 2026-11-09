// #330 Disease progress: AUDPC, AUDPS, models. References from Python (NumPy 2, SciPy 1.18, scratch script):
// numpy.trapezoid for AUDPC; AUDPS by its stairs definition (each rating a bar one interval wide, Σy·D for equal
// intervals, Simko and Piepho 2012); scipy.stats.linregress on the transformed severities; scipy.optimize.curve_fit
// for the three models on the original scale. Made-up severities (%), days 0 to 35.
import { audpc, audps, relAudpc, relAudps, fitAll, model } from '../../src/lib/sci/audpc.ts';
const rel = (a, b, tol) => Math.abs(a / b - 1) < tol;
export default async (check) => {
  const t = [0, 7, 14, 21, 28, 35], A = [1, 3, 9, 22, 41, 58], B = [0.5, 1, 2, 4.5, 9, 15];
  check('AUDPC: trapezoids match numpy (731.5, 169.75 %-days)', Math.abs(audpc(t, A) - 731.5) < 1e-9 && Math.abs(audpc(t, B) - 169.75) < 1e-9);
  check('AUDPS: matches the stairs definition (938, 224)', Math.abs(audps(t, A) - 938) < 1e-9 && Math.abs(audps(t, B) - 224) < 1e-9);
  check('relative AUDPC and AUDPS', Math.abs(relAudpc(t, A, 100) - 0.209) < 1e-12 && Math.abs(relAudps(t, A, 100) - 0.22333333333333333) < 1e-12 && Math.abs(relAudps(t, B, 100) - 0.05333333333333334) < 1e-12);
  const ref = {
    A: { monomolecular: [0.0242160099709, 0.00460169508045, 0.873789035828, -0.0761893217257, 0.0201460134051, 0.0775536362152, 0.00440029147784],
      logistic: [0.142750345738, 0.00623466957767, 0.992427637645, 0.0204799717267, 0.121836352188, 0.00414047037178, 0.00710788276017],
      gompertz: [0.0622257454557, 0.00335542915735, 0.988502754444, 0.00145868992738, 0.0708134274981, 0.000481481526159, 0.00188537770376] },
    B: { monomolecular: [0.00435164979758, 0.00088171177916, 0.858949945727, -0.0175518571618, 0.0041967997184, 0.0178775301395, 0.000870021626419],
      logistic: [0.103978551253, 0.00226998327099, 0.998097211042, 0.00635818598968, 0.0952882819781, 0.000873354739798, 0.00430317866986],
      gompertz: [0.0298480771303, 0.00166521413017, 0.987703149636, 0.00190517272297, 0.0340887844894, 0.000335506688364, 0.000918716032525] },
  };
  for (const [name, y] of [['A', A], ['B', B]]) {
    const { fits, best } = fitAll(t, y.map((v) => v / 100));
    const lin = fits.every((f) => { const r = ref[name][f.model]; return rel(f.lin.r, r[0], 1e-9) && rel(f.lin.rSe, r[1], 1e-9) && rel(f.lin.r2, r[2], 1e-9); });
    const nl = fits.every((f) => { const r = ref[name][f.model]; return rel(f.nl.y0, r[3], 1e-4) && rel(f.nl.r, r[4], 1e-5) && rel(f.nl.y0Se, r[5], 1e-3) && rel(f.nl.rSe, r[6], 1e-3); });
    check(`disease models ${name}: linearised rates, SEs and R² match scipy linregress`, lin);
    check(`disease models ${name}: nonlinear y0, r and SEs match scipy curve_fit`, nl);
    check(`disease models ${name}: Gompertz fits best`, best === 'gompertz');
  }
  check('disease models: y0 is the value at t = 0', Math.abs(model('logistic', 0, 0.02, 0.1) - 0.02) < 1e-15 && Math.abs(model('gompertz', 0, 0.02, 0.1) - 0.02) < 1e-15 && Math.abs(model('monomolecular', 0, 0.02, 0.1) - 0.02) < 1e-15);
};
