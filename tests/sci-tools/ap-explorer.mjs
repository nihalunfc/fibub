// #1162 AP explorer. Checked against direct addition of the terms (Python sum(range(...)) for 1 + 2 + ... + 100 =
// 5050) and hand-worked examples (3, 7, 11, ...: 10th term 39, sum of 10 terms 210; 21, 18, 15, ...: −81 is the
// 35th term).
import { nth, terms, sum, whichTerm, termsToReach } from '../../src/lib/sci/ap-school.ts';

export default async (check) => {
  check('Gauss: 1 + 2 + ... + 100 = 5050', sum(1, 1, 100) === 5050);
  check('3, 7, 11, ...: 10th term 39, sum of 10 terms 210', nth(3, 4, 10) === 39 && sum(3, 4, 10) === 210 && terms(3, 4, 4).join() === '3,7,11,15');
  check('21, 18, 15, ...: −81 is the 35th term; 0 is not a term of 3, 7, 11', whichTerm(21, -3, -81) === 35 && whichTerm(3, 4, 0) === null && whichTerm(5, 0, 5) === 1);
  check('terms to reach: 1 + 2 + ... reaches 5050 at n = 100', termsToReach(1, 1, 5050) === 100 && termsToReach(1, 1, 5051) === 101);
  let ok = true;
  for (let i = 0; i < 500; i++) {
    const a = Math.round((Math.random() * 40 - 20) * 2) / 2, d = Math.round((Math.random() * 20 - 10) * 4) / 4, n = 1 + Math.floor(Math.random() * 60);
    const T = terms(a, d, n), direct = T.reduce((s, x) => s + x, 0);
    if (Math.abs(sum(a, d, n) - direct) > 1e-9 * Math.max(1, Math.abs(direct)) || Math.abs(sum(a, d, n) - (n / 2) * (T[0] + T.at(-1))) > 1e-9 * Math.max(1, Math.abs(direct))) ok = false;
    if (d !== 0 && whichTerm(a, d, T.at(-1)) !== n) ok = false;
  }
  check('500 random APs: formula sum = direct sum = n/2 (first + last); whichTerm finds the last term', ok);
};
