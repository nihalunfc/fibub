// #418 colour difference (ΔE) calculator. CIEDE2000 checked against Sharma, Wu and Dalal's (2005) published test
// pairs; ΔE76, ΔE94 (both weightings), CIEDE2000 with random kL/kC/kH, LCh, sRGB→XYZ→Lab (D65 and Bradford to D50)
// checked against colour-science 0.4.7 on 2,000 random pairs (all within 1e-12); a few of those pairs are kept here.
import * as C from '../../src/lib/sci/colourdiff.ts';

export default async (check) => {
  const near = (a, b, t = 1e-4) => Math.abs(a - b) <= t;
  // Sharma et al. (2005), Table 1, pairs 1, 7, 17 and 25 (the paper's test data for implementers).
  check('colour: CIEDE2000 Sharma pair 1 = 2.0425', near(C.dE00([50, 2.6772, -79.7751], [50, 0, -82.7485]), 2.0425));
  check('colour: CIEDE2000 Sharma pair 7 (neutral to colour) = 2.3669', near(C.dE00([50, 0, 0], [50, -1, 2]), 2.3669));
  check('colour: CIEDE2000 Sharma pair 17 (large difference) = 27.1492', near(C.dE00([50, 2.5, 0], [73, 25, -18]), 27.1492));
  check('colour: CIEDE2000 Sharma pair 25 = 1.2644', near(C.dE00([60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387]), 1.2644));
  check('colour: CIEDE2000 is symmetric and zero for equal colours', near(C.dE00([40, 20, -30], [45, 18, -25]), C.dE00([45, 18, -25], [40, 20, -30]), 1e-12) && C.dE00([40, 20, -30], [40, 20, -30]) === 0);
  // colour-science 0.4.7 values (delta_E_CIE2000, its intermediate attributes with kL, kC, kH = 1.5, 0.8, 1.2, delta_E_CIE1994).
  const P = [
    [[42.1604, -90.6385, -6.6751], [36.0493, -83.4333, -8.0841], 5.5713080496045455, 4.036036694168333, 6.324242700702272, 3.4431799345551584],
    [[60.7267, 42.8424, -85.7017], [67.1323, 29.2587, -88.6561], 10.230634417197143, 7.999034954811439, 8.530196431536337, 6.678436613874638],
    [[42.1, 48.3, 22.6], [44.0, 44.9, 21.8], 2.0746194890876652, 1.7729239036514188, 2.1880073662853468, 1.4148461798542304],
  ];
  check('colour: CIEDE2000 matches colour-science', P.every((p) => near(C.dE00(p[0], p[1]), p[2], 1e-9)));
  check('colour: CIEDE2000 with kL 1.5, kC 0.8, kH 1.2 matches colour-science', P.every((p) => near(C.dE00(p[0], p[1], 1.5, 0.8, 1.2), p[3], 1e-9)));
  check('colour: ΔE94 graphic arts and textiles match colour-science', P.every((p) => near(C.dE94(p[0], p[1]), p[4], 1e-9) && near(C.dE94(p[0], p[1], 'textiles'), p[5], 1e-9)));
  check('colour: ΔE94 is not symmetric (reference chroma sets the weights)', !near(C.dE94(P[1][0], P[1][1]), C.dE94(P[1][1], P[1][0]), 1e-3));
  check('colour: ΔE*ab 1976 is the straight distance', C.dE76([50, 0, 0], [53, 4, 0]) === 5);
  // sRGB → Lab, colour-science sRGB_to_XYZ + XYZ_to_Lab (D65) and Bradford to D50.
  const lab65 = C.toLab([177, 183, 117], 'srgb', 'D65'), lab50 = C.toLab([177, 183, 117], 'srgb', 'D50');
  check('colour: sRGB (177,183,117) → Lab D65 72.5604, −12.4925, 32.8987', near(lab65[0], 72.5604) && near(lab65[1], -12.4925) && near(lab65[2], 32.8987));
  check('colour: sRGB (177,183,117) → Lab D50 (Bradford) 72.7648, −9.8458, 32.8439', near(lab50[0], 72.7648) && near(lab50[1], -9.8458) && near(lab50[2], 32.8439));
  check('colour: white is L* 100, a* = b* = 0, in both whites', C.toLab([255, 255, 255], 'srgb', 'D50').every((v, i) => near(v, i ? 0 : 100, 0.01)) && C.xyzToLab(C.whiteXYZ('D65')).every((v, i) => near(v, i ? 0 : 100, 1e-9)));
  check('colour: Lab ↔ XYZ and Lab ↔ LCh round trips', C.dE76(C.xyzToLab(C.labToXyz([3, 20, -40], 'D50'), 'D50'), [3, 20, -40]) < 1e-9 && C.dE76(C.lchToLab(C.labToLch([60, -20, -5])), [60, -20, -5]) < 1e-12 && near(C.labToLch([50, 0, -10])[2], 270, 1e-9));
  check('colour: swatch hex and gamut', C.labToSrgb(C.toLab([12, 200, 99], 'srgb')).hex === '#0cc863' && C.labToSrgb([50, 0, 0]).inGamut && !C.labToSrgb([50, 120, 0]).inGamut);
  check('colour: parseHex reads #abc and #a1b2c3, rejects others', C.parseHex('#abc').join() === '170,187,204' && C.parseHex('a1b2c3').join() === '161,178,195' && C.parseHex('#ab') === null);
  const d = C.compare([50, 10, 20], [52, 8, 25]);
  check('colour: components after − before; ΔH from Δa, Δb and ΔC', d.dL === 2 && d.da === -2 && d.db === 5 && near(d.dL ** 2 + d.dC ** 2 + d.dH ** 2, d.e76 ** 2, 1e-9) && C.describe(d, [50, 10, 20]) === 'lighter, more saturated, hue towards yellow' && C.describe(C.compare([50, 10, 1], [50, 10, -1]), [50, 10, 1]) === 'hue towards red' && C.describe(C.compare([50, 0, 0], [50.2, 0, 0])) === 'about the same');
  const s = C.parseSurvey(C.EXAMPLE_SURVEY, 'lab', 'D65');
  check('colour: example survey has 6 samples, header skipped', s.rows.length === 6 && s.bad.length === 0 && s.rows[0].label === 'Red silk band' && near(s.rows[0].d.e00, 2.0746194890876652, 1e-9));
  const sh = C.parseSurvey('a, #ff0000, #fe0101\n#000000, #010101\nbad row, 1, 2', 'srgb', 'D65');
  check('colour: survey reads hex pairs and flags bad rows', sh.rows.length === 2 && sh.rows[0].label === 'a' && sh.rows[1].label === 'Row 2' && sh.bad.length === 1 && sh.bad[0].startsWith('Line 3'));
  const sx = C.parseSurvey('x;40;50;60;41;50;59', 'xyz', 'D50');
  check('colour: survey in XYZ under D50', sx.rows.length === 1 && near(sx.rows[0].before[0], C.xyzToLab([40, 50, 60], 'D50')[0], 1e-12));
};
