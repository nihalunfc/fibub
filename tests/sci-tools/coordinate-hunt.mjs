// #1272 Coordinate treasure hunt. Checked against hand-worked quadrants and distances (3-4-5, 5-12-13, 6-8-10 on
// the grid), Math.hypot (same as Python math.dist) for 1,000 random grid pairs, and 10,000 ship placements.
import { quadrant, signs, dist, surd, placeShips, hitShip, readPoint } from '../../src/lib/sci/coordinate-hunt.ts';

export default async (check) => {
  check('coord: quadrants and axes', quadrant(3, 4) === 'Quadrant I' && quadrant(-3, 4) === 'Quadrant II' && quadrant(-3, -4) === 'Quadrant III' && quadrant(3, -4) === 'Quadrant IV' && quadrant(5, 0) === 'the x-axis' && quadrant(0, -2) === 'the y-axis' && quadrant(0, 0) === 'the origin');
  check('coord: signs', signs(-2, 5) === '(−, +)' && signs(3, -1) === '(+, −)');
  check('coord: 3-4-5, 5-12-13, 6-8-10', dist([0, 0], [3, 4]).d === 5 && dist([-1, 2], [4, 14]).d === 13 && dist([2, -3], [-4, 5]).d === 10 && dist([-1, 1], [2, -3]).sq === 25);
  let ok = true;
  for (let i = 0; i < 1000; i++) { const a = [Math.floor(Math.random() * 13) - 6, Math.floor(Math.random() * 13) - 6], b = [Math.floor(Math.random() * 13) - 6, Math.floor(Math.random() * 13) - 6]; if (Math.abs(dist(a, b).d - Math.hypot(b[0] - a[0], b[1] - a[1])) > 1e-12) ok = false; }
  check('coord: 1,000 random distances match hypot', ok);
  check('coord: surds', surd(25) === '5' && surd(8) === '2√2' && surd(13) === '√13' && surd(72) === '6√2' && surd(0) === '0' && surd(50) === '5√2');
  let good = true;
  for (let i = 0; i < 10000; i++) {
    const ships = placeShips([4, 3, 2], 5), cells = ships.flat(), keys = new Set(cells.map((c) => c.join(',')));
    if (cells.length !== 9 || keys.size !== 9 || cells.some(([x, y]) => Math.abs(x) > 5 || Math.abs(y) > 5)) good = false;
    for (const s of ships) { const st = s.every((c) => c[1] === s[0][1]) || s.every((c) => c[0] === s[0][0]); if (!st) good = false; }
    if (hitShip(ships, cells[0][0], cells[0][1]) !== 0) good = false;
  }
  check('coord: 10,000 fleets on the grid, straight, no overlap', good);
  check('coord: read typed points', JSON.stringify(readPoint('(3, −2)')) === '[3,-2]' && JSON.stringify(readPoint('-4,5')) === '[-4,5]' && JSON.stringify(readPoint('2 7')) === '[2,7]' && readPoint('abc') === null);
};
