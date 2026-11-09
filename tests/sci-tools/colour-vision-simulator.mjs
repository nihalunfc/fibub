// #497 Colour vision simulator: matrices and colours against an independent NumPy implementation of the same
// definitions (sRGB transfer, RGB to XYZ from chromaticities, Hunt-Pointer-Estevez LMS, Viénot 1999 projection).
import * as C from '../../src/lib/sci/colourvision.ts';

export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t;
  const nearM = (a, b, t = 1e-12) => a.every((r, i) => r.every((v, j) => near(v, b[i][j], t)));
  check('cvd: sRGB linearisation (IEC 61966-2-1)', C.toLinear(0) === 0 && near(C.toLinear(0.04045), 0.0031308049535603713) && near(C.toLinear(0.5), 0.21404114048223255) && near(C.toLinear(1), 1));
  check('cvd: sRGB encoding', near(C.toSrgb(0.0031308), 0.040449936, 1e-12) && near(C.toSrgb(0.21404114), 0.49999999947899615, 1e-8) && near(C.toSrgb(0.5), 0.7353569830524495));
  check('cvd: RGB to XYZ from the sRGB primaries = NumPy', nearM(C.RGB2XYZ, [[0.4123907992659594, 0.35758433938387796, 0.1804807884018343], [0.2126390058715103, 0.7151686787677559, 0.07219231536073371], [0.019330818715591825, 0.11919477979462596, 0.9505321522496607]]));
  check('cvd: protanopia matrix = NumPy', nearM(C.dichromat('protan'), [[0.17053269896195225, 0.8294673010380482, 0], [0.1705326989619521, 0.8294673010380476, 0], [-0.004515707820631407, 0.004515707820631408, 1]], 1e-12));
  check('cvd: deuteranopia matrix', nearM(C.dichromat('deutan'), [[0.330627, 0.669373, 0], [0.330627, 0.669373, 0], [-0.027847, 0.027847, 1]], 1e-6));
  check('cvd: tritanopia matrix = NumPy', nearM(C.dichromat('tritan'), [[1, 0.12744102646544533, -0.1274410264654449], [0, 0.873885245667569, 0.12611475433243075], [0, 0.8738852456675694, 0.1261147543324308]], 1e-12));
  // Properties of the projection: white and the anchor colour are unchanged, and each dichromat matrix has rank 2.
  const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  check('cvd: white and anchors fixed, rank 2', ['protan', 'deutan', 'tritan'].every((k) => { const m = C.dichromat(k), w = C.apply(m, [1, 1, 1]), a = k === 'tritan' ? [1, 0, 0] : [0, 0, 1], b = C.apply(m, a); return w.every((v) => near(v, 1, 1e-12)) && b.every((v, i) => near(v, a[i], 1e-12)) && Math.abs(det(m)) < 1e-12; }));
  check('cvd: rows of each matrix sum to 1 (greys stay grey)', ['protan', 'deutan', 'tritan', 'achromat'].every((k) => C.cvdMatrix(k, 0.7).every((r) => near(r[0] + r[1] + r[2], 1, 1e-4))));
  // Colours, rounded to 0 to 255, = NumPy.
  const eq = (a, b) => a.join() === b.join();
  check('cvd: protanopia colours', eq(C.simulate([255, 0, 0], C.cvdMatrix('protan')), [115, 115, 0]) && eq(C.simulate([0, 255, 0], C.cvdMatrix('protan')), [235, 235, 14]) && eq(C.simulate([255, 128, 0], C.cvdMatrix('protan')), [160, 160, 0]));
  check('cvd: deuteranopia colours', eq(C.simulate([255, 0, 0], C.cvdMatrix('deutan')), [156, 156, 0]) && eq(C.simulate([0, 255, 0], C.cvdMatrix('deutan')), [214, 214, 46]));
  check('cvd: tritanopia colours', eq(C.simulate([0, 255, 0], C.cvdMatrix('tritan')), [100, 240, 240]) && eq(C.simulate([0, 0, 255], C.cvdMatrix('tritan')), [0, 100, 100]) && eq(C.simulate([255, 128, 0], C.cvdMatrix('tritan')), [255, 120, 120]));
  check('cvd: deuteranomaly at 60 %', eq(C.simulate([255, 0, 0], C.cvdMatrix('deutan', 0.6)), [203, 123, 0]) && eq(C.simulate([0, 255, 0], C.cvdMatrix('deutan', 0.6)), [170, 231, 35]));
  check('cvd: achromatopsia uses luminance', eq(C.simulate([255, 0, 0], C.cvdMatrix('achromat')), [127, 127, 127]) && eq(C.simulate([0, 255, 0], C.cvdMatrix('achromat')), [220, 220, 220]) && eq(C.simulate([0, 0, 255], C.cvdMatrix('achromat')), [76, 76, 76]));
  check('cvd: severity 0 is normal vision', eq(C.simulate([200, 50, 90], C.cvdMatrix('protan', 0)), [200, 50, 90]));
  // The fast pixel path matches the exact one (lookup tables, 4096 levels).
  { const px = new Uint8ClampedArray([255, 0, 0, 255, 17, 200, 180, 255, 128, 0, 128, 255]); const m = C.cvdMatrix('deutan', 0.6); C.simulatePixels(px, m);
    check('cvd: pixel path = exact within 1 level', [[255, 0, 0], [17, 200, 180], [128, 0, 128]].every((c, i) => C.simulate(c, m).every((v, k) => Math.abs(v - px[i * 4 + k]) <= 1)) && px[3] === 255); }
  check('cvd: names', C.cvdName('deutan', 1) === 'Deuteranopia' && C.cvdName('protan', 0.5) === 'Protanomaly' && C.cvdName('tritan', 1) === 'Tritanopia' && C.cvdName('achromat', 1) === 'Achromatopsia (no colour)' && C.cvdName('protan', 0) === 'Normal colour vision');
};
