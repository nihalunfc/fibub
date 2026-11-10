// #1244 Tessellation and symmetry studio. Checked against the standard facts: only triangles, squares and
// hexagons tile alone; the 17 combinations of regular polygons that fit around a point (the 21 vertex types
// counted without order); interior angle 180(n − 2)/n.
import { interior, aroundPoint, vertexSum, vertexFit, vertexTypes, symmetry, polygonAt } from '../../src/lib/sci/tessellation-studio.ts';

const near = (a, b) => Math.abs(a - b) < 1e-9;
export default async (check) => {
  check('interior angles: 60, 90, 108, 120, 135, 150', [3, 4, 5, 6, 8, 12].map(interior).join() === '60,90,108,120,135,150');
  const tiles = []; for (let n = 3; n <= 20; n++) if (aroundPoint(n).left === 0) tiles.push(n);
  check('only 3, 4 and 6 tile on their own', tiles.join() === '3,4,6');
  check('pentagons: 3 fit with 36° left', aroundPoint(5).count === 3 && near(aroundPoint(5).left, 36));
  check('octagons: 2 fit with 90° left; heptagons: 2 fit', aroundPoint(8).count === 2 && near(aroundPoint(8).left, 90) && aroundPoint(7).count === 2);
  check('4.8.8 and 3.12.12 and 3.3.3.3.6 close; 5.5.5 leaves a gap; 6.6.8 overlaps', vertexFit([4, 8, 8]) === 'closes' && vertexFit([3, 12, 12]) === 'closes' && vertexFit([3, 3, 3, 3, 6]) === 'closes' && vertexFit([5, 5, 5]) === 'gap' && vertexFit([6, 6, 8]) === 'overlap');
  check('vertexSum(3,4,6,4) = 360', near(vertexSum([3, 4, 6, 4]), 360));
  const vt = vertexTypes();
  check('17 combinations of regular polygons fit around a point', vt.length === 17);
  check('they include 3.7.42, 3.8.24, 3.9.18, 3.10.15, 4.5.20, 5.5.10', ['3,7,42', '3,8,24', '3,9,18', '3,10,15', '4,5,20', '5,5,10'].every((s) => vt.some((v) => v.join() === s)));
  check('symmetry: 6 turns with mirrors = order 6, 6 lines, 60°', JSON.stringify(symmetry(6, true)) === '{"order":6,"lines":6,"angle":60}' && symmetry(5, false).lines === 0);
  const sq = polygonAt(4, 0, 0, 0, 1);
  check('a unit square from the origin', sq.length === 4 && near(sq[2][0], 1) && near(sq[2][1], 1) && near(sq[3][0], 0) && near(sq[3][1], 1));
  const hx = polygonAt(6, 0, 0, 0, 2);
  const back = hx[5], t = (300 * Math.PI) / 180;
  check('a hexagon closes back to its start', near(back[0] + 2 * Math.cos(t), 0) && near(back[1] + 2 * Math.sin(t), 0));
};
