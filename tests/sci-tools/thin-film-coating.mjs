// #931 Thin-film coating: characteristic-matrix results checked against an independent NumPy interface/propagation
// transfer-matrix calculation (n + ik convention, Fresnel coefficients at each interface) and closed-form cases.
import { parseLayers, rt, rtAvg, quarterWaveR, bareR } from '../../src/lib/sci/phfilm.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const st = (layers, ns = 1.52, n0 = 1, ks = 0) => ({ n0, ns, ks, layers });
  const one = parseLayers('MgF2 QW', 550);
  check('film: MgF2 QW thickness 99.64 nm', one.length === 1 && near(one[0].d, 550 / (4 * 1.38), 1e-9) && one[0].n === 1.38);
  check('film: single quarter wave matches closed form', near(rt(st(one), 550, 0, 's').R, quarterWaveR(1, 1.38, 1.52), 1e-12));
  check('film: single quarter wave vs NumPy', near(rt(st(one), 550, 0, 'p').R, 0.012600790214630288, 1e-12));
  check('film: bare glass 4.26 %', near(rt(st([]), 550, 0, 's').R, bareR(1, 1.52), 1e-12) && near(bareR(1, 1.52), 0.04258, 1e-6));
  const qhq = parseLayers('1.38 QW\n2.1 2QW\n1.63 QW', 550);
  check('film: QHQ AR at 550 vs NumPy', near(rt(st(qhq), 550, 0, 's').R, 0.001834616991827742, 1e-12));
  check('film: QHQ AR at 450 vs NumPy', near(rt(st(qhq), 450, 0, 's').R, 0.0026344674014058597, 1e-12));
  check('film: QHQ AR 45° s vs NumPy', near(rt(st(qhq), 550, 45, 's').R, 0.013936834836537744, 1e-12) && near(rt(st(qhq), 550, 45, 's').T, 0.9860631651634625, 1e-12));
  check('film: QHQ AR 45° p vs NumPy', near(rt(st(qhq), 550, 45, 'p').R, 0.0008761436351874466, 1e-12));
  const avg = rtAvg(st(qhq), 550, 45);
  check('film: unpolarised is the mean of s and p', near(avg.R, (0.013936834836537744 + 0.0008761436351874466) / 2, 1e-12));
  const bragg = parseLayers('2.35 QW; 1.46 QW x 8', 550);
  check('film: group repeat gives 16 layers', bragg.length === 16 && bragg[15].n === 1.46);
  check('film: Bragg mirror at 550 vs NumPy', near(rt(st(bragg), 550, 0, 's').R, 0.9987043287823427, 1e-12));
  check('film: Bragg mirror 30° p at 600 vs NumPy', near(rt(st(bragg), 600, 30, 'p').R, 0.9732819336211884, 1e-11));
  const metal = parseLayers('0.2 3 50', 600);
  { const s = rt(st(metal), 600, 20, 's'), p = rt(st(metal), 600, 20, 'p');
    check('film: absorbing layer s vs NumPy', near(s.R, 0.8515103342409828, 1e-11) && near(s.T, 0.06857089026356179, 1e-11) && near(s.A, 1 - s.R - s.T, 1e-15) && s.A > 0.07);
    check('film: absorbing layer p vs NumPy', near(p.R, 0.8329913785910863, 1e-11) && near(p.T, 0.078086081030159, 1e-11)); }
  { const r = rt(st(parseLayers('1.46 100', 600), 0.13, 1, 3.3), 600, 30, 'p'); check('film: absorbing substrate vs NumPy', near(r.R, 0.9247801735949205, 1e-11) && near(r.T, 0.07521982640507963, 1e-11)); }
  { const r = rt(st([], 1.0, 1.5), 550, 60, 's'); check('film: total internal reflection R = 1, T = 0', near(r.R, 1, 1e-12) && near(r.T, 0, 1e-12)); }
  { const b = (Math.atan(1.52) * 180) / Math.PI; check('film: Brewster angle p reflectance 0', near(rt(st([]), 550, b, 'p').R, 0, 1e-14) && rt(st([]), 550, b, 's').R > 0.1); }
  check('film: lossless energy conservation', near(rt(st(bragg), 500, 33, 'p').R + rt(st(bragg), 500, 33, 'p').T, 1, 1e-12));
  check('film: half-wave layer is absent at its design wavelength', near(rt(st(parseLayers('2.1 2QW', 550)), 550, 0, 's').R, bareR(1, 1.52), 1e-12));
  let msg = ''; try { parseLayers('unobtainium QW', 550); } catch (e) { msg = e.message; }
  check('film: unknown material message', msg.includes('not a refractive index'));
  msg = ''; try { parseLayers('1.38', 550); } catch (e) { msg = e.message; }
  check('film: missing thickness message', msg.includes('give a thickness'));
  msg = ''; try { parseLayers('1.38 abc', 550); } catch (e) { msg = e.message; }
  check('film: bad thickness message', msg.includes('is not a thickness'));
};
