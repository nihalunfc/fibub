// #1234 Power of doubling. Checked against Python exact integers (2**k, 2**k − 1 for k = 1..64) and
// math.ceil(math.log2(target / 0.1 mm)) for every landmark: [0, 4, 10, 15, 20, 27, 32, 42, 51, 69].
import { foldThickness, foldsToReach, grainsOn, grainsUpTo, LANDMARKS } from '../../src/lib/sci/doubling-j4.ts';
import { stdForm, group3, groupIndian, sup } from '../../src/lib/sci/school-j4.ts';

export default async (check) => {
  check('doubling: 10 folds of 0.1 mm = 102.4 mm', Math.abs(foldThickness(0.1, 10) - 102.4) < 1e-9);
  check('doubling: folds to pass each landmark match Python', LANDMARKS.map((L) => foldsToReach(1e-4, L.m)).join() === '0,4,10,15,20,27,32,42,51,69');
  check('doubling: Moon needs 42 folds; exact powers of two need no extra fold', foldsToReach(1e-4, 3.844e8) === 42 && foldsToReach(1, 1024) === 10 && foldsToReach(1, 1025) === 11 && foldsToReach(2, 1) === 0);
  let ok = true;
  for (let k = 1; k <= 64; k++) { const p = 2n ** BigInt(k - 1); if (grainsOn(k) !== p || grainsUpTo(k) !== 2n * p - 1n) ok = false; }
  check('doubling: grains on square k = 2^(k−1) and up to k = 2^k − 1, for every k', ok);
  check('doubling: square 64 and whole board exact', String(grainsOn(64)) === '9223372036854775808' && String(grainsUpTo(64)) === '18446744073709551615');
  check('school-j4: standard form', stdForm(384400000) === '3.84 × 10⁸' && stdForm(0.0001) === '1 × 10⁻⁴' && stdForm(9.996, 3) === '1 × 10¹' && stdForm(99960, 3) === '1 × 10⁵' && stdForm(5) === '5');
  check('school-j4: grouping and superscripts', group3(1234567n) === '1,234,567' && groupIndian(1234567) === '12,34,567' && groupIndian(999) === '999' && sup(-12) === '⁻¹²');
};
