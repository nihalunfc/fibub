// #1229 Square and cube builder. Taxicab numbers checked against a brute-force Python search below 50,000 and OEIS
// A001235 (1729, 4104, 13832, 20683, 32832, 39312, 40033, 46683, 64232, 65728, ...); 1008 = 2⁴ × 3² × 7 worked by hand.
import { odds, exactRoot, shell, factorise, smallestMultiplier, smallestDivisor, cubeWays, taxicabs } from '../../src/lib/sci/squarecube-j2.ts';

export default async (check) => {
  let ok = true; for (let n = 1; n <= 50; n++) if (odds(n).reduce((a, b) => a + b, 0) !== n * n || shell(n) !== n ** 3 - (n - 1) ** 3) ok = false;
  check('squares: first n odd numbers add to n², shells 3n² − 3n + 1 (n up to 50)', ok);
  let roots = true;
  for (let x = 1; x <= 20000; x++) { const r2 = exactRoot(x, 2), r3 = exactRoot(x, 3); if ((r2 !== null) !== Number.isInteger(Math.sqrt(x)) || (r2 !== null && r2 * r2 !== x) || (r3 !== null && r3 ** 3 !== x)) roots = false; }
  check('squares: exact roots right for every number to 20,000; big ones too', roots && exactRoot(999950884, 2) === 31622 && exactRoot(1e9, 3) === 1000 && exactRoot(1e9 + 1, 3) === null);
  check('squares: 1008 = 2⁴ × 3² × 7; × 7 for a square, ÷ 7, × 588 for a cube', JSON.stringify(factorise(1008)) === '[[2,4],[3,2],[7,1]]' && smallestMultiplier(1008, 2) === 7 && smallestDivisor(1008, 2) === 7 && smallestMultiplier(1008, 3) === 588 && exactRoot(1008 * 588, 3) === 84);
  let mult = true; for (let x = 2; x <= 3000; x++) { const m = smallestMultiplier(x, 2); if (exactRoot(x * m, 2) === null) mult = false; for (let d = 1; d < m; d++) if (exactRoot(x * d, 2) !== null) mult = false; }
  check('squares: smallest multiplier really is the smallest (2 to 3,000)', mult);
  check('squares: taxicab numbers below 70,000 match OEIS A001235', taxicabs(70000).map((t) => t.n).join() === '1729,4104,13832,20683,32832,39312,40033,46683,64232,65728');
  check('squares: 1729 = 1³ + 12³ = 9³ + 10³; 91 one way; 100 none', JSON.stringify(cubeWays(1729)) === '[[1,12],[9,10]]' && cubeWays(91).length === 1 && cubeWays(100).length === 0 && cubeWays(2).length === 1);
  check('squares: 87,539,319 is a sum of two cubes in three ways', cubeWays(87539319).length === 3);
};
