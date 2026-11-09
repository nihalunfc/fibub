// #327 Stomatal density counter: field of view, density, stomatal index, and the automatic blob suggestion.
import * as P from '../../src/lib/sci/plantimg.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // Field of view: field number 22 mm with a 40× objective is 0.55 mm across, π × 0.275² = 0.237583 mm².
  check('stomata: field of view FN 22, 40× = 0.55 mm', near(P.fovDiameter(22, 40), 0.55, 1e-12));
  check('stomata: field area 0.237583 mm²', near(P.circleArea(P.fovDiameter(22, 40)), 0.2375829, 1e-7));
  check('stomata: extra 1.5× magnifier shrinks the field', near(P.fovDiameter(20, 10, 1.5), 4 / 3, 1e-12));
  // Stomatal index (Salisbury 1928): 23 stomata and 37 other cells give 38.33 %.
  check('stomata: stomatal index 23 / (23 + 37) = 38.33 %', near(P.stomatalIndex(23, 37), 38.3333333, 1e-6) && Number.isNaN(P.stomatalIndex(0, 0)));
  // The made-up epidermis: 23 stomata drawn; Otsu on brightness and 100 to 2000 px patches find all 23, at the drawn centres.
  const e = P.exampleStomata(), v = P.luminance(e.px, e.w * e.h), t = P.otsu(P.histogram(v));
  const b = P.blobs(P.threshold(v, t, true), e.w, e.h, 100, 2000);
  const hit = e.stomata.every((s) => b.some((r) => Math.hypot(r.cx - s[0], r.cy - s[1]) < 1));
  check(`stomata: example suggestion finds the 23 drawn stomata (${b.length})`, e.stomata.length === 23 && b.length === 23 && hit && e.cells.length === 37);
  // Density: 480 × 320 px at 2 px per µm = 0.0384 mm², so 23 / 0.0384 = 598.96 per mm².
  check('stomata: example density 598.96 per mm²', near(23 / ((240 * 160) / 1e6), 598.958, 1e-3));
  check('stomata: blobs touching the edge are left out unless asked', P.blobs(new Uint8Array([1, 1, 0, 0, 0, 0, 0, 1, 1]), 3, 3, 1, 9).length === 0 && P.blobs(new Uint8Array([1, 1, 0, 0, 0, 0, 0, 1, 1]), 3, 3, 1, 9, true).length === 2);
};
