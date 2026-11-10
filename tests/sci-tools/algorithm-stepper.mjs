// #1287 Algorithm stepper. Checked against Python: sorted() and the inversion count (= bubble sort swaps), bisect
// for whether the number is in the list, the same halving rule for the number of looks, math.gcd summed over every
// pair up to 500 (algorithm-stepper.ref.json), and the guide's hand-worked examples.
import { readFileSync } from 'node:fs';
import { bubbleSteps, binarySteps, linearCount, worst, euclidSteps } from '../../src/lib/sci/algo-l2.ts';

export default async (check) => {
  const b = bubbleSteps([29, 10, 14, 37, 13, 5, 21, 8]), last = b.at(-1);
  check('bubble: example sorts in 28 comparisons, 18 swaps, 7 passes', last.arr.join() === '5,8,10,13,14,21,29,37' && last.comparisons === 28 && last.swaps === 18 && last.pass === 7 && last.done === 8);
  check('bubble: first pass carries 37 to the end in 7 comparisons', b[7].arr.at(-1) === 37 && b[7].comparisons === 7 && b[7].done === 1);
  const s = bubbleSteps([1, 2, 3, 4, 5]);
  check('bubble: sorted list stops after one pass of 4 comparisons', s.length === 5 && s.at(-1).comparisons === 4 && s.at(-1).swaps === 0 && s.at(-1).done === 5);
  check('bubble: 5,4,3,2,1 needs 10 swaps', bubbleSteps([5, 4, 3, 2, 1]).at(-1).swaps === 10);
  const L = [3, 8, 12, 19, 23, 27, 31, 38, 42, 46, 51, 57, 63, 70, 84, 95];
  const bs = binarySteps(L, 57);
  check('binary: 57 found in 2 looks (38, then 57); linear needs 12', bs.length === 2 && bs[0].mid === 7 && bs[1].found && bs[1].mid === 11 && linearCount(L, 57) === 12);
  check('binary: 60 not found in at most 5 looks', !binarySteps(L, 60).at(-1).found && binarySteps(L, 60).at(-1).comparisons <= 5 && linearCount(L, 60) === 16);
  check('worst cases: n = 1000 → 499500, 1000, 10; a million → 20 looks', worst.bubble(1000) === 499500 && worst.linear(1000) === 1000 && worst.binary(1000) === 10 && worst.binary(1e6) === 20 && worst.binary(16) === 5);
  const e = euclidSteps(168, 60);
  check('euclid: 168 = 60×2+48, 60 = 48×1+12, 48 = 12×4+0', e.length === 3 && e[0].q === 2 && e[0].r === 48 && e[1].r === 12 && e[2].q === 4 && e[2].b === 12);
  check('euclid: Fibonacci 89, 55 takes 9 divisions', euclidSteps(89, 55).length === 9 && euclidSteps(89, 55).at(-1).b === 1);
  const ref = JSON.parse(readFileSync(new URL('./algorithm-stepper.ref.json', import.meta.url), 'utf8'));
  let ok = 0;
  for (const c of ref.cases) {
    const st = bubbleSteps(c.L).at(-1), bn = binarySteps(c.S, c.t).at(-1);
    const noEarly = bubbleSteps(c.L, false).at(-1);
    if (st.arr.join() === c.sorted.join() && st.swaps === c.inv && noEarly.comparisons === worst.bubble(c.L.length) && bn.found === c.found && bn.comparisons === c.c && bn.comparisons <= worst.binary(c.S.length)) ok++;
  }
  check(`random lists: 60 match Python sorted(), inversions and bisect (${ok}/60)`, ok === 60);
  let g = 0; for (let x = 1; x <= 500; x++) for (let y = 1; y <= 500; y++) g += euclidSteps(x, y).at(-1).b;
  check('euclid: HCF summed over every pair up to 500 matches Python math.gcd (1009272)', g === ref.gsum && g === 1009272);
};
