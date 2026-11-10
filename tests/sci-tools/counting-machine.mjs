// #1376 Counting machine. Checked against Python's math.perm / math.comb and itertools: 5P3 = 60, 5C3 = 10,
// 10P5 = 30240, 30C15 = 155117520, 20! = 2432902008176640000, MISSISSIPPI 34650, BANANA 60, LEVEL 30 (distinct
// itertools permutations), and lists of every case match the formulas for all n ≤ 7.
import { fact, nPr, nCr, arrangements, selections, letterCounts, wordArrangements, distinctWords, big } from '../../src/lib/sci/counting-machine.ts';

export default async (check) => {
  check('counting: 5P3 = 60, 5C3 = 10, 10P5 = 30240', nPr(5, 3) === 60n && nCr(5, 3) === 10n && nPr(10, 5) === 30240n);
  check('counting: 30C15 = 155117520 and 20! exact', nCr(30, 15) === 155117520n && fact(20) === 2432902008176640000n);
  check('counting: r > n gives 0; r = 0 gives 1; 0! = 1', nPr(3, 4) === 0n && nCr(3, 4) === 0n && nPr(6, 0) === 1n && nCr(6, 0) === 1n && fact(0) === 1n);
  check('words: MISSISSIPPI 34650, BANANA 60, LEVEL 30, MATHS 120', wordArrangements('MISSISSIPPI') === 34650n && wordArrangements('banana') === 60n && wordArrangements('LEVEL') === 30n && wordArrangements('MATHS') === 120n);
  check('words: letters counted in order, spaces dropped', JSON.stringify(letterCounts('a b-a')) === '[["A",2],["B",1]]');
  const ban = distinctWords('BANANA');
  check('words: 60 distinct BANANA words, sorted, starting AAABNN', ban.length === 60 && new Set(ban).size === 60 && ban[0] === 'AAABNN' && ban[2] === 'AAANNB');
  check('lists: ABCDE take 3 starts ABC, ABD, ABE, ACB', arrangements([...'ABCDE'], 3).slice(0, 4).map((a) => a.join('')).join() === 'ABC,ABD,ABE,ACB');
  let ok = true;
  for (let n = 1; n <= 7; n++) for (let r = 0; r <= n; r++) {
    const it = Array.from({ length: n }, (_, i) => i);
    const A = arrangements(it, r), S = selections(it, r);
    if (BigInt(A.length) !== nPr(n, r) || BigInt(S.length) !== nCr(n, r) || nPr(n, r) !== nCr(n, r) * fact(r) || nCr(n, r) !== nCr(n, n - r)) ok = false;
    if (new Set(A.map((a) => a.join())).size !== A.length || S.some((s) => s.some((v, i) => i && v <= s[i - 1]))) ok = false;
  }
  check('lists: every n ≤ 7 lists nPr arrangements and nCr selections, all different; nPr = nCr × r!', ok);
  check('limit and format', arrangements([...'ABCDEFGH'], 5, 240).length === 240 && big(34650n) === '34,650');
};
