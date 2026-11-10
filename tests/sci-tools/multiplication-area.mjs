// #1245 Mental multiplication with the area picture. Checked against ordinary multiplication for every pair up
// to 400 (grid and base method with several bases) and hand-worked examples (103 × 97 = 10 000 − 9 = 9991).
import { placeParts, grid, baseParts, autoBase, squaresTrick } from '../../src/lib/sci/multiplication-area.ts';

export default async (check) => {
  check('place parts: 147 → 100, 40, 7; 305 → 300, 5; 60 → 60', placeParts(147).join() === '100,40,7' && placeParts(305).join() === '300,5' && placeParts(60).join() === '60');
  const g = grid(23, 47);
  check('grid 23 × 47: 800 + 140 + 120 + 21 = 1081', g.cells.flat().join() === '800,140,120,21' && g.total === 1081);
  const p = baseParts(103, 97, 100);
  check('base 100: 103 × 97 = 10000 + 300 − 300 − 9 = 9991', p.x === 3 && p.y === -3 && p.Bx === 300 && p.By === -300 && p.xy === -9 && p.total === 9991);
  check('base 100: 98 × 96 = 10000 − 200 − 400 + 8 = 9408', baseParts(98, 96, 100).total === 9408 && baseParts(98, 96, 100).xy === 8);
  check('auto base: 103, 97 → 100; 48, 52 → 50; 21, 19 → 20; 998, 1004 → 1000', autoBase(103, 97) === 100 && autoBase(48, 52) === 50 && autoBase(21, 19) === 20 && autoBase(998, 1004) === 1000);
  check('squares trick: 103 × 97 → 100² − 3²; odd sum → null', JSON.stringify(squaresTrick(103, 97)) === '{"m":100,"d":3}' && squaresTrick(10, 7) === null);
  let ok = true;
  for (let a = 1; a <= 400; a++) for (let b = 1; b <= 400; b++) {
    if (grid(a, b).total !== a * b) ok = false;
    for (const B of [10, 50, 100, autoBase(a, b)]) if (baseParts(a, b, B).total !== a * b) ok = false;
    const s = squaresTrick(a, b); if (s && s.m * s.m - s.d * s.d !== a * b) ok = false;
  }
  check('every pair up to 400: grid, base method and squares trick equal a × b', ok);
};
