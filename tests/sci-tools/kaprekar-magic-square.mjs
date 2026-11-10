// #1240 Kaprekar and magic squares. Step counts checked against a Python brute force over 0000..9999 and 000..999.
import { kStep, kChain, stepCounts, siamese, four, magicConstant, isMagic, lineSums } from '../../src/lib/sci/numplay-j4.ts';

export default async (check) => {
  check('kaprekar: step counts for 4 digits match Python', stepCounts(4).join() === '1,383,576,2400,1272,1518,1656,2184');
  check('kaprekar: step counts for 3 digits match Python', stepCounts(3).join() === '1,149,144,270,222,150,54');
  check('kaprekar: 3524 chain and 2111 keeps the zero', kChain(3524, 4).map((s) => s.diff).join() === '3087,8352,6174,6174' && kChain(2111, 4).map((s) => s.diff).join() === '999,8991,8082,8532,6174,6174' && kStep(999, 4).big === 9990);
  check('magic: Lo Shu 816/357/492', siamese(3).grid.map((r) => r.join('')).join('/') === '816/357/492');
  check('magic: odd squares 3 to 9 and the 4 × 4 are magic with constant n(n²+1)/2', [3, 5, 7, 9].every((n) => isMagic(siamese(n).grid) && lineSums(siamese(n).grid).rows[0] === magicConstant(n)) && isMagic(four().grid) && lineSums(four().grid).diag === 34);
  check('magic: a + (v − 1)d keeps it magic', isMagic(siamese(5).grid.map((r) => r.map((v) => 7 + (v - 1) * 3))) && !isMagic([[2, 1, 6], [3, 5, 7], [4, 9, 8]]));
};
