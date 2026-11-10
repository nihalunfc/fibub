// #1282 Probability spinner designer. Fractions, sector angles and the pointer lookup checked by hand; the random
// spins checked against the theory with a chi-square test on 100 000 spins (Python scipy.stats.chisquare gives the
// 99.9% critical value 13.82 for 2 degrees of freedom).
import { simplify, total, probs, fracText, angles, sectorAt, spin, meets } from '../../src/lib/sci/spinner-school.ts';
import { rng } from '../../src/lib/sci/converse-school.ts';

export default async (check) => {
  const s = [{ name: 'Red', share: 2 }, { name: 'Blue', share: 3 }, { name: 'Green', share: 1 }];
  check('total and probabilities', total(s) === 6 && probs(s).every((p, i) => Math.abs(p - [1 / 3, 1 / 2, 1 / 6][i]) < 1e-12));
  check('fractions', fracText(2, 6) === '1/3' && fracText(3, 6) === '1/2' && fracText(6, 6) === '1' && fracText(0, 6) === '0' && simplify(12, 18).join() === '2,3');
  check('angles 0-120, 120-300, 300-360', JSON.stringify(angles(s)) === JSON.stringify([[0, 120], [120, 300], [300, 360]]));
  check('pointer lookup', sectorAt(s, 0) === 0 && sectorAt(s, 350) === 0 && sectorAt(s, 300) === 0 && sectorAt(s, 200) === 1 && sectorAt(s, 30) === 2 && sectorAt(s, 720 + 100) === 1);
  const n = 100000, c = spin(s, n, rng(11)), p = probs(s);
  const chi = c.reduce((t, o, i) => t + (o - n * p[i]) ** 2 / (n * p[i]), 0);
  check(`100 000 spins fit the theory (chi-square ${chi.toFixed(2)} < 13.82)`, c.reduce((a, b) => a + b, 0) === n && chi < 13.82);
  const z = spin([{ name: 'A', share: 0 }, { name: 'B', share: 1 }, { name: 'C', share: 0 }], 1000, rng(2));
  check('empty sectors never come up', z[0] === 0 && z[2] === 0 && z[1] === 1000);
  check('meets target', meets(s, [[1, 3], [1, 2], [1, 6]]) && meets([{ name: 'a', share: 4 }, { name: 'b', share: 6 }, { name: 'c', share: 2 }], [[1, 3], [1, 2], [1, 6]]) && !meets(s, [[1, 2], [1, 3], [1, 6]]));
};
