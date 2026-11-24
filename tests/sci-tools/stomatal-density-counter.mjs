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
  // Blog: /blog/discoveries/maize-hybrid-stomatal-density-leaf-layers/ (Zhang et al. 2025, Front. Plant Sci.).
  // The paper's square fields, and the counting noise of 87.21 stomata per mm² scattered at random over 10 × 10 mm.
  check('stomata: 767 µm and 298 µm square fields in mm²', near(0.767 * 0.767, 0.588289, 1e-12) && near(0.298 * 0.298, 0.088804, 1e-12));
  {
    const pts = P.placePoints('random', 10, 10, { n: 8721, rows: 1, cols: 1, seed: 1442686, border: 0 });
    const side = 0.767, k = Math.floor(10 / side), box = new Map();
    for (const [x, y] of pts) { const i = Math.floor(x / side), j = Math.floor(y / side); if (i < k && j < k) box.set(i + ',' + j, (box.get(i + ',' + j) ?? 0) + 1); }
    const counts = []; for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) counts.push((box.get(i + ',' + j) ?? 0) / (side * side));
    const s = P.summary(counts, 'sd');
    check(`stomata: 169 simulated 350x fields give 87.0 +/- 12.5 per mm2 (${s.mean.toFixed(2)} +/- ${s.sd.toFixed(2)})`, counts.length === 169 && near(s.mean, 86.99383261101163, 1e-9) && near(s.sd, 12.53844717403116, 1e-9));
  }
  check('stomata: blobs touching the edge are left out unless asked', P.blobs(new Uint8Array([1, 1, 0, 0, 0, 0, 0, 1, 1]), 3, 3, 1, 9).length === 0 && P.blobs(new Uint8Array([1, 1, 0, 0, 0, 0, 0, 1, 1]), 3, 3, 1, 9, true).length === 2);
};
