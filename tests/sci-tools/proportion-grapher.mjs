// #1243 Direct and inverse proportion. Checked against hand-worked unitary-method examples.
import { yOf, missing, classify } from '../../src/lib/sci/proportion-grapher.ts';

const near = (a, b) => Math.abs(a - b) < 1e-9;
export default async (check) => {
  check('direct: 6 pencils at ₹5 = ₹30', yOf('direct', 5, 6) === 30);
  check('inverse: 24 worker-days with 4 workers = 6 days; 120 km at 40 km/h = 3 h', yOf('inverse', 24, 4) === 6 && yOf('inverse', 120, 40) === 3);
  check('direct missing: 5 kg cost ₹150, 8 kg cost ₹240', near(missing('direct', 5, 150, 8), 240));
  check('inverse missing: 6 workers take 10 days, 4 workers take 15 days', near(missing('inverse', 6, 10, 4), 15));
  check('inverse missing: 60 km/h takes 2 h, 40 km/h takes 3 h', near(missing('inverse', 60, 2, 40), 3));
  check('classify direct table', classify([1, 2, 3, 5], [4, 8, 12, 20]) === 'direct' && classify([0, 2, 4], [0, 3, 6]) === 'direct');
  check('classify inverse table', classify([1, 2, 4, 8], [16, 8, 4, 2]) === 'inverse' && classify([10, 20, 40], [12, 6, 3]) === 'inverse');
  check('classify neither: y = x + 1 and y = x²', classify([1, 2, 3], [2, 3, 4]) === 'neither' && classify([1, 2, 3], [1, 4, 9]) === 'neither');
};
