// #404 Artefact measurement scale tool: scale, lengths, angles, polygon areas, uncertainty and perspective checks.
// Polygon areas checked against numpy's shoelace sum (three random polygons and the example outline).
import { pxPerMm, lengthMm, angleDeg, polygonAreaPx, polygonAreaMm2, perimeterPx, lengthUncertaintyMm, areaScaleRelU, scaleMismatchPct, barAngle, measureNotes, selfIntersects, EXAMPLE } from '../../src/lib/sci/artscale.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const E = EXAMPLE, s = E.scale;
  check('artscale: example scale 8 px per mm', pxPerMm(s) === 8);
  check('artscale: example length 62.5 mm', near(lengthMm(E.length[0], E.length[1], s), 62.5, 1e-12));
  check('artscale: example tip angle 41.7089° (numpy arccos)', near(angleDeg(...E.angle), 41.708916079156694, 1e-9));
  check('artscale: example outline 52600 px², 821.875 mm², perimeter 135.1107 mm (numpy)', polygonAreaPx(E.outline) === 52600 && near(polygonAreaMm2(E.outline, s), 821.875, 1e-9) && near(perimeterPx(E.outline) / 8, 135.11069797428297, 1e-9));
  const NP = [
    [[[633.3, 547.2], [226.5, 427.2], [343.2, 346.2], [698.0, 306.7]], 64864.275],
    [[[627.4, 453.6], [263.1, 429.3], [376.0, 391.6], [323.7, 273.9], [352.5, 193.2], [487.4, 120.1], [600.5, 215.5]], 76047.355],
    [[[712.5, 454.7], [675.5, 515.9], [487.0, 593.3], [378.2, 513.6], [392.0, 404.3], [771.9, 387.2]], 51039.055],
  ];
  NP.forEach(([p, a], i) => check(`artscale: numpy shoelace polygon ${i + 1}`, near(polygonAreaPx(p), a, 1e-6) && near(polygonAreaPx([...p].reverse()), a, 1e-6)));
  check('artscale: right angle and straight line', near(angleDeg([1, 0], [0, 0], [0, 5]), 90, 1e-12) && near(angleDeg([-3, 0], [0, 0], [4, 0]), 180, 1e-12) && near(angleDeg([1, 1], [0, 0], [2, 2]), 0, 1e-9));
  check('artscale: unit square of 10 px at 2 px/mm is 25 mm²', near(polygonAreaMm2([[0, 0], [10, 0], [10, 10], [0, 10]], { a: [0, 0], b: [20, 0], mm: 10 }), 25, 1e-12));
  // Uncertainty: 62.5·√((√2/500)² + (√2/400)²) = 0.2830 mm.
  check('artscale: click uncertainty of the example length 0.2830 mm', near(lengthUncertaintyMm(E.length[0], E.length[1], s, 1), 62.5 * Math.hypot(Math.SQRT2 / 500, Math.SQRT2 / 400), 1e-12) && near(lengthUncertaintyMm(E.length[0], E.length[1], s, 1), 0.28298, 1e-4));
  check('artscale: area relative uncertainty 2√2/400', near(areaScaleRelU(s), 2 * Math.SQRT2 / 400, 1e-15));
  check('artscale: square-on L scale agrees, 90° apart', scaleMismatchPct(s, E.check) === 0 && near(barAngle(s, E.check), 90, 1e-9));
  check('artscale: slanted photo 30 mm second bar disagrees by 18.18 %', near(scaleMismatchPct(s, { ...E.check, mm: 30 }), (100 * (8 - 200 / 30)) / ((8 + 200 / 30) / 2), 1e-9) && near(scaleMismatchPct(s, { ...E.check, mm: 30 }), 18.1818, 1e-3));
  check('artscale: no notes for the example, notes for a long far line', measureNotes(E.length, s, Math.hypot(1200, 800)).length === 0 && measureNotes([[100, 0], [1500, 0]], s, 1500).length === 2 && measureNotes([[1400, 10], [1450, 10]], { a: [0, 1000], b: [40, 1000], mm: 5 }, 1800).some((n) => n.startsWith('far')));
  check('artscale: crossing outline detected', selfIntersects([[0, 0], [10, 10], [10, 0], [0, 10]]) && !selfIntersects(E.outline));
};
