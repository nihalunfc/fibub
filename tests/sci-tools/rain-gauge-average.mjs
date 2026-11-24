// #150 Rain gauge average (Thiessen polygons). Hand-checkable symmetric layouts, the tiling and closure properties,
// gauges outside the catchment, missing readings (cells redrawn), and the published weight table of
// Hamidi et al. (2025), ITM Web of Conferences 75: 04004, doi:10.1051/itmconf/20257504004 (CC BY 4.0),
// used in the blog article thiessen-weights-areal-rainfall-tasikmalaya.
import { cells, area, signedArea, centroid, arealMean, inside, clipHalf, lonLatToKm } from '../../src/lib/sci/thiessen.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const SQ = [[0, 0], [10, 0], [10, 10], [0, 10]];
  check('thiessen: shoelace area and centroid of a square', near(area(SQ), 100) && near(signedArea(SQ), 100) && near(centroid(SQ)[0], 5) && near(centroid(SQ)[1], 5));
  { const r = cells(SQ, [[2.5, 2.5], [7.5, 2.5], [7.5, 7.5], [2.5, 7.5]]);
    check('thiessen: four symmetric gauges each take a quarter', r.cells.every((c) => near(c.weight, 0.25, 1e-12)) && near(r.total, 100)); }
  { const r = cells(SQ, [[2.5, 5], [7.5, 5]]);
    check('thiessen: two gauges split a square in half', near(r.cells[0].weight, 0.5, 1e-12) && near(r.cells[1].weight, 0.5, 1e-12)); }
  { const r = cells(SQ, [[1, 5], [4, 5], [9, 5]]); // bisectors at x = 2.5 and x = 6.5
    check('thiessen: cell edges fall on the perpendicular bisectors', near(r.cells[0].weight, 0.25, 1e-12) && near(r.cells[1].weight, 0.4, 1e-12) && near(r.cells[2].weight, 0.35, 1e-12)); }
  { const r = cells(SQ, [[-5, 5], [12, 5], [5, 5]]); // two gauges outside, one in the middle
    const sum = r.cells.reduce((s, c) => s + c.area, 0);
    check('thiessen: a gauge outside keeps the strip nearest it, one cut off entirely gets nothing, and the cells still tile the catchment', near(r.cells[0].weight, 0, 1e-12) && near(r.cells[1].weight, 0.15, 1e-12) && near(r.cells[2].weight, 0.85, 1e-12) && near(sum, area(SQ), 1e-9)); }
  { const r = cells(SQ, [[5, 5], [5, 5]]);
    check('thiessen: two gauges at the same spot do not double-count', near(r.cells[0].weight, 1, 1e-12) && r.cells[1].weight === 0); }
  { const r = cells([[0, 0], [10, 0], [10, 10], [5, 4], [0, 10]], [[2, 8], [8, 8]]); // concave catchment
    check('thiessen: a concave catchment still closes', near(r.cells.reduce((s, c) => s + c.area, 0), r.total, 1e-9) && near(r.total, 70, 1e-9)); }
  check('thiessen: clipping a half-plane and the inside test', clipHalf(SQ, [1, 0], 5).length === 4 && near(area(clipHalf(SQ, [1, 0], 5)), 50) && inside(SQ, [1, 1]) && !inside(SQ, [11, 1]));
  { const km = lonLatToKm([[10, 45], [11, 45]]);
    check('thiessen: one degree of longitude at 45° N is about 78.7 km', near(km.pts[1][0] - km.pts[0][0], 111.32 * Math.cos((45 * Math.PI) / 180), 1e-9)); }
  { const g = [[2.5, 2.5], [7.5, 2.5], [7.5, 7.5], [2.5, 7.5]], a = arealMean(SQ, g, [10, 20, 30, 40]);
    const b = arealMean(SQ, g, [10, 20, 30, NaN]);
    check('thiessen: areal mean of four quarters, and a missing reading redraws the cells', near(a.mean, 25, 1e-12) && near(a.arith, 25, 1e-12) && b.used === 3 && b.weights[3] === 0 && near(b.weights.reduce((s, w) => s + w, 0), 1, 1e-12) && b.mean > 18 && b.mean < 22); }
  // The published table: eight polygon areas (m²) and the eight weights, with the station mean monthly rainfalls.
  { const A = [636706540.53, 220335769.46, 172771131.14, 406859686.61, 52395594.0, 821362618.22, 245685842.77, 143799533.27];
    const W = [0.23582, 0.08161, 0.06399, 0.15069, 0.01941, 0.30422, 0.091, 0.05326];
    const MEAN = [285.585, 197.881, 181.881, 219.722, 199.038, 202.618, 298.222, 284.417], TOTAL = 2699916716.0;
    const sum = A.reduce((a, b) => a + b, 0);
    const worst = Math.max(...A.map((a, i) => Math.abs(a / TOTAL - W[i])));
    const areal = W.reduce((s, w, i) => s + w * MEAN[i], 0), plain = MEAN.reduce((a, b) => a + b, 0) / 8;
    check('thiessen: the published areas close on the published total and weights', near(sum, TOTAL, 1e-6) && worst < 5e-6);
    check('thiessen: the published weights give an areal mean of 236.03 mm, 2.36 above the plain average', near(areal, 236.0342, 5e-4) && near(areal - plain, 2.3637, 5e-4)); }
  // The demonstration catchment of that article: our own outline and gauges reproduce the published weights.
  { const POLY = [[0, 0], [23.368, -7.789], [44.139, -5.193], [59.718, 5.193], [67.507, 20.771], [62.314, 36.35], [46.735, 44.139], [28.561, 42.841], [10.386, 33.753], [-2.596, 18.175]];
    const G = [[57.09, 25.14], [-1.66, 14.79], [9.89, 32.34], [39.89, 29.83], [30.05, 42.94], [19.02, 6.32], [24.16, 34.29], [39.58, 41.17]];
    const W = [0.23582, 0.08161, 0.06399, 0.15069, 0.01941, 0.30422, 0.091, 0.05326];
    const MEAN = [285.6, 197.9, 181.9, 219.7, 199.0, 202.6, 298.2, 284.4];
    const r = cells(POLY, G), worst = Math.max(...r.cells.map((c, i) => Math.abs(c.weight - W[i])));
    check(`thiessen: the demonstration layout reproduces the published weights (worst ${worst.toExponential(1)})`, worst < 1e-4 && near(area(POLY), 2699.91, 0.01));
    const all = arealMean(POLY, G, MEAN), noTaraju = arealMean(POLY, G, MEAN.map((v, i) => (i ? v : NaN)));
    check('thiessen: losing the wettest gauge drops the catchment rainfall by about 15 mm', near(all.mean, 236.04, 0.01) && near(noTaraju.mean - all.mean, -15.06, 0.02)); }
};
