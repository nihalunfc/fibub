// #214 galaxy morphology practice. Sérsic b_n checked against SciPy (scipy.special.gammaincinv(2n, 0.5)), the
// incomplete gamma against scipy.special.gammainc, total light and light inside R against scipy.integrate.quad of the
// profile, and a drawn elliptical (n 1.5, b/a 0.6, turned 40°, 128 px) pixel by pixel and by its second moments
// against the same picture made with NumPy. The class rules (En = 10(1 − b/a) rounded) are checked by hand.
import { sersicB, gammaP, lnGamma, sersic, sersicTotal, sersicFraction, ellipClass, apparentQ, inclinationFromQ, logSpiral, pitchFromPoints, classify, broad, preset, randomOf, quizItem, renderGalaxy, toRGBA, moments, edgeFloor, cues, CLASSES } from '../../src/lib/sci/galaxy.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('galaxy: Sérsic b_n matches SciPy gammaincinv', [[0.5, 0.6931471805599455], [1, 1.6783469900166612], [2, 3.672060748850897], [4, 7.669249442500804], [6, 11.668363153044767], [8, 15.667929544317243]].every(([n, b]) => near(sersicB(n), b, 1e-12)));
  check('galaxy: b for n = 0.5 is ln 2 exactly (Gaussian profile)', near(sersicB(0.5), Math.LN2, 1e-13));
  check('galaxy: incomplete gamma and ln Γ match SciPy', near(gammaP(2, 1.5), 0.4421745996289252, 1e-12) && near(gammaP(12, 5), 0.0054530919130093445, 1e-10) && near(gammaP(3, 10), 0.9972306042844884, 1e-12) && near(lnGamma(10), Math.log(362880), 1e-13) && near(lnGamma(0.3), 1.0957979948180756, 1e-12));
  check('galaxy: Sérsic total light matches numerical integration', near(sersicTotal(1, 0.2, 4, 0.7), 0.6346265442630773, 1e-9) && near(sersicTotal(2, 0.1, 1, 1), 0.23896989482927974, 1e-9) && near(sersicTotal(0.5, 0.3, 2.5, 0.5), 0.4074333858417905, 1e-9));
  check('galaxy: half the light inside Re, and the share inside 0.5 Re and 2 Re for n = 4', [0.5, 1, 2, 4, 7].every((n) => near(sersicFraction(1, 1, n), 0.5, 1e-12)) && near(sersicFraction(0.5, 1, 4), 0.31980588456073417, 1e-8) && near(sersicFraction(2, 1, 4), 0.6900055527446782, 1e-8));
  check('galaxy: Sérsic profile equals Ie at Re and Ie·e^b at the centre', near(sersic(0.3, 2, 0.3, 4), 2) && near(sersic(0, 1, 1, 1), Math.exp(sersicB(1)), 1e-12));
  // Ellipticity classes by hand: b/a 1 → E0, 0.7 → E3, 0.62 → 3.8 → E4, 0.75 → 2.5 → E3, 0.3 → E7, 0.2 → still E7.
  check('galaxy: ellipticity class En = 10(1 − b/a), rounded, E0 to E7', ellipClass(1) === 0 && ellipClass(0.7) === 3 && ellipClass(0.62) === 4 && ellipClass(0.75) === 3 && ellipClass(0.96) === 0 && ellipClass(0.3) === 7 && ellipClass(0.2) === 7);
  check('galaxy: tilted disc axis ratio and its inverse', near(apparentQ(0, 0.2), 1) && near(apparentQ(90, 0.2), 0.2) && near(apparentQ(60, 0), 0.5) && near(inclinationFromQ(apparentQ(48, 0.12), 0.12), 48, 1e-9) && inclinationFromQ(0.1, 0.12) === 90);
  check('galaxy: logarithmic spiral gives its pitch angle back', near(pitchFromPoints(logSpiral(0.4, 0.1, 16), 0.4, logSpiral(2.9, 0.1, 16), 2.9), 16, 1e-12) && near(logSpiral(2 * Math.PI, 1, 45), Math.exp(2 * Math.PI)));
  check('galaxy: class rules', classify(preset('Sa')) === 'Sa' && classify(preset('SBc')) === 'SBc' && classify(preset('S0')) === 'S0' && classify(preset('SB0')) === 'SB0' && classify(preset('E5')) === 'E5' && classify({ ...preset('Sb'), bt: 0.4, pitch: 16 }) === 'Sab' && classify({ ...preset('Sb'), bar: 0.3 }) === 'Sb' && classify({ ...preset('Sb'), bar: 0.35 }) === 'SBb' && broad('SBc') === 'SB' && broad('E6') === 'E');
  { let ok = true; for (const c of CLASSES) for (let s = 1; s <= 60; s++) if (classify(randomOf(c, s)) !== c) ok = false; check('galaxy: random galaxies of every class get their own class back', ok); }
  { const a = quizItem(1234, 5), b = quizItem(1234, 5), c = quizItem(1234, 6); check('galaxy: quiz rounds repeat exactly', JSON.stringify(a) === JSON.stringify(b) && JSON.stringify(a) !== JSON.stringify(c) && classify(a.params) === a.cls); }
  // Pixels of a drawn elliptical against NumPy (largest relative difference 4e-8 at float32), and its moments.
  const p = { ...preset('E3'), n: 1.5, re: 0.12, q: 0.6, pa: 40, noise: 0 };
  const r = renderGalaxy(p, 128);
  const at = (i, j) => r.old[j * 128 + i];
  check('galaxy: drawn elliptical matches NumPy pixel by pixel', near(at(64, 64), 54.622576444821256, 1e-6) && Math.abs(at(80, 30) / 0.027682927020474434 - 1) < 1e-6 && Math.abs(at(20, 100) / 0.004593026030666698 - 1) < 1e-6 && near(r.sums.bulge, 0.9987890038069973, 1e-6));
  const m = moments(r.old, 128);
  check('galaxy: second moments give b/a and turn of the drawn elliptical (NumPy 0.60177, 40.056°)', near(m.q, 0.601768134445466, 1e-7) && near(m.pa, 40.056300804849684, 1e-6));
  { const m2 = moments(renderGalaxy({ ...p, n: 1, re: 0.1, q: 0.7, pa: 30 }, 256).old, 256); check('galaxy: an exponential E3 measures b/a 0.70 at 30°', near(m2.q, 0.7, 1e-4) && near(m2.pa, 30, 1e-3)); }
  { const g = renderGalaxy({ ...preset('E4', 7), noise: 0 }, 320).old, all = moments(g, 320), cut = moments(g, 320, edgeFloor(g, 320));
    check('galaxy: n = 4 E4 cut along the isophote that fits the frame measures b/a 0.600 at 20° (NumPy 0.60006, 19.9995°; whole frame 0.6991, 22.478°)', near(cut.q, 0.6000571903609068, 1e-7) && near(cut.pa, 19.999509527981274, 1e-6) && near(all.q, 0.6990801494097505, 1e-7) && near(all.pa, 22.478057542856845, 1e-6)); }
  // Bulge-to-total is honest: with everything inside the picture the drawn light adds up to 1 and the bulge to B/T.
  for (const c of ['Sa', 'SBb', 'Sc']) {
    const g = renderGalaxy({ ...preset(c, 3), h: 0.06, re: 0.03, n: 1, noise: 0 }, 400), s = g.sums, tot = s.bulge + s.disc + s.bar + s.arms + s.knots;
    check(`galaxy: ${c} light adds up to 1 and its bulge to B/T`, near(tot, 1, 3e-3) && near(s.bulge / tot, preset(c).bt, 3e-3));
  }
  { const a = renderGalaxy(preset('SBb', 9), 64), b = renderGalaxy(preset('SBb', 9), 64), c = renderGalaxy(preset('SBb', 10), 64);
    check('galaxy: the same seed draws the same picture, a new seed a new one', a.young.every((v, i) => v === b.young[i]) && a.sky.every((v, i) => v === b.sky[i]) && a.young.some((v, i) => v !== c.young[i])); }
  { const px = toRGBA(renderGalaxy(preset('E0', 2), 64)); check('galaxy: picture is opaque, black sky, bright warm centre', px.length === 64 * 64 * 4 && px[3] === 255 && px[(32 * 64 + 32) * 4] > 200 && px[(32 * 64 + 32) * 4] >= px[(32 * 64 + 32) * 4 + 2] && px[0] < 60); }
  check('galaxy: cues explain the ellipticity sum and the bar', cues({ ...preset('E3'), q: 0.62 }).some((t) => t.includes('10 × (1 − 0.62) = 3.8') && t.includes('E4')) && cues(preset('SBb')).some((t) => t.includes('bar')) && cues(preset('Sc')).some((t) => t.includes('26°')));
};
