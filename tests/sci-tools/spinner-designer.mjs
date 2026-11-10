// #1282 Spinner designer. Checked by hand (90° of 360° → 1/4; 120/120/90/30 sectors with points 1, 2, 5, 10 →
// expected (120 + 240 + 450 + 300)/360 = 3.083 points) and by the law of large numbers: 200 000 seeded spins land
// within 1 % of each sector's share.
import { probs, sectorAt, expected, normalise, spin, rng } from '../../src/lib/sci/spinner-school.ts';
export default async (check) => {
  const s = [{ name: 'Red', deg: 120, points: 1 }, { name: 'Blue', deg: 120, points: 2 }, { name: 'Green', deg: 90, points: 5 }, { name: 'Yellow', deg: 30, points: 10 }];
  const p = probs(s);
  check('spinner: probabilities 1/3, 1/3, 1/4, 1/12', [1 / 3, 1 / 3, 1 / 4, 1 / 12].every((v, i) => Math.abs(p[i] - v) < 1e-12));
  check('spinner: pointer at 0° is Red, 125° Blue, 300° Green, 359° Yellow, 365° Red', sectorAt(s, 0) === 0 && sectorAt(s, 125) === 1 && sectorAt(s, 300) === 2 && sectorAt(s, 359) === 3 && sectorAt(s, 365) === 0);
  check('spinner: expected points 3.0833', Math.abs(expected(s) - 1110 / 360) < 1e-12);
  const n = normalise([1, 1, 1]);
  check('spinner: three equal parts are 120° each; any list fits 360', n.join() === '120,120,120' && normalise([10, 20, 33]).reduce((a, b) => a + b, 0) === 360);
  const c = spin(s, 200000, rng(42));
  check('spinner: 200 000 spins land within 1 % of the theory', c.every((k, i) => Math.abs(k / 200000 - p[i]) < 0.01) && c.reduce((a, b) => a + b, 0) === 200000);
  check('spinner: a 0° sector is never landed on', spin([{ name: 'A', deg: 360, points: 0 }, { name: 'B', deg: 0, points: 0 }], 5000, rng(1))[1] === 0);
};
