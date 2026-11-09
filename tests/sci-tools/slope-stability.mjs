// #658 slope stability (Bishop simplified). Each circle is checked against an independent Python/numpy script
// (slip-mass ends by scipy brentq, Bishop's equation solved by brentq rather than iteration): 7 circles over four
// made-up slopes with no water, ru, a piezometric line and two layers. The grid search minimum is checked against
// scipy Nelder–Mead started from four points (1.18178 for slope S2).
import { fos, search, cut, ground, piezo } from '../../src/lib/sci/slope.ts';
export default async (check) => {
  const S = { S1: { H: 10, beta: 30, top: { c: 10, phi: 25, gamma: 19 }, water: { kind: 'none' } },
    S2: { H: 10, beta: 30, top: { c: 10, phi: 25, gamma: 19 }, water: { kind: 'ru', ru: 0.25 } },
    S3: { H: 8, beta: 35, top: { c: 5, phi: 30, gamma: 18 }, bottom: { c: 20, phi: 20, gamma: 19.5 }, yi: -1, water: { kind: 'line', yToe: -2, yCrest: 5 } },
    S4: { H: 12, beta: 26.565, top: { c: 0, phi: 32, gamma: 20 }, water: { kind: 'line', yToe: 0, yCrest: 6 } } };
  const PY = [["S1", 8, 20, 20, 1.8504752899323993, 1.7225501874610514, 1.7403837422828738, 25.32050807568877], ["S1", 12, 18, 17, 2.318491998423522, 2.1283984215081273, 4.637086066290206, 27.0], ["S2", 8, 20, 20, 1.4444102439331117, 1.3121558270500127, 1.7403837422828738, 25.32050807568877], ["S3", 4, 14, 15, 1.3912708120656734, 1.2212821693361209, -1.3851648071345064, 17.74772708486752], ["S3", 7, 16, 18, 1.7182948838420835, 1.4907461167277019, -1.2462112512353178, 23.124515496597102], ["S4", 10, 25, 26, 1.5662246685904735, 1.3915356926957503, 1.1239829660287735, 32.5166604983954], ["S4", 15, 22, 20, 2.004383707214614, 1.7870668187779966, 7.182373048073222, 32.32050807568877]];
  let wb = 0, wo = 0, wx = 0;
  for (const [n, a, b, R, Fb, Fo, xL, xR] of PY) { const f = fos(S[n], { xc: a, yc: b, R }); wb = Math.max(wb, Math.abs(f.bishop - Fb)); wo = Math.max(wo, Math.abs(f.ordinary - Fo)); wx = Math.max(wx, Math.abs(f.xL - xL), Math.abs(f.xR - xR)); }
  check(`slope-stability: Bishop FS matches Python on ${PY.length} circles (worst ${wb.toExponential(1)})`, wb < 1e-10);
  check('slope-stability: ordinary FS matches Python', wo < 1e-12);
  check('slope-stability: slip-mass ends match Python', wx < 1e-9);
  { const f = fos({ ...S.S1, top: { c: 30, phi: 0, gamma: 19 } }, { xc: 8, yc: 20, R: 20 }); check('slope-stability: φ = 0 gives Bishop = ordinary', Math.abs(f.bishop - f.ordinary) < 1e-12); }
  { const f = fos(S.S1, { xc: 8, yc: 20, R: 20 }); check('slope-stability: Bishop above ordinary for c-φ soil', f.bishop > f.ordinary && f.iterations < 30); }
  const r = search(S.S2, { x0: -8, x1: 17.3, y0: 11, y1: 25, nx: 11, ny: 11, yLow: -5, nR: 8 });
  check(`slope-stability: grid search minimum near scipy's 1.18178 (${r.best.f.bishop.toFixed(5)})`, r.best.f.bishop >= 1.18178 - 1e-4 && r.best.f.bishop < 1.18178 * 1.005 && !r.onEdge);
  check('slope-stability: geometry helpers', ground(S.S1, -1) === 0 && Math.abs(ground(S.S1, 5) - 5 * Math.tan(Math.PI / 6)) < 1e-12 && ground(S.S1, 30) === 10 && piezo(S.S4, 30) === 6 && piezo(S.S4, -5) === 0);
  check('slope-stability: a circle above the ground does not cut it', cut(S.S1, { xc: 5, yc: 30, R: 5 }) === null);
};
