// #1377 GP explorer. Checked against direct term-by-term sums in Python: 8, 4, 2, … has S8 = 15.9375 and S∞ = 16;
// 3, −6, 12, … has S5 = 33; 5 × 1.5ᵏ has S6 = 103.90625; 10000 at 8 % for 10 years is 21589.25 and doubles after
// 10 whole years (ln 2 / ln 1.08 = 9.006); 15 % depreciation halves after 5 years (4.27); AM, GM, HM of 4 and 9 are
// 6.5, 6 and 72/13; four GMs between 3 and 96 are 6, 12, 24, 48.
import { term, terms, sumN, sumInf, ratioOf, am, gm, hm, insertGMs, yearly, yearsTo } from '../../src/lib/sci/gp-explorer.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  check('gp: 8, 4, 2, … S8 = 15.9375, S∞ = 16', near(sumN(8, 0.5, 8), 15.9375) && sumInf(8, 0.5) === 16 && terms(8, 0.5, 4).join() === '8,4,2,1');
  check('gp: 3, −6, 12, … S5 = 33; a6 = −96', near(sumN(3, -2, 5), 33) && term(3, -2, 6) === -96);
  check('gp: 5 × 1.5ᵏ S6 = 103.90625; r = 1 gives n a', near(sumN(5, 1.5, 6), 103.90625) && sumN(4, 1, 7) === 28);
  check('gp: no sum to infinity for |r| ≥ 1 (r = 1.1, −1); a = 0 gives 0', Number.isNaN(sumInf(2, 1.1)) && Number.isNaN(sumInf(2, -1)) && sumInf(0, 3) === 0 && near(sumInf(6, -0.5), 4));
  check('gp: ratio from two terms', ratioOf(4, 12) === 3 && Number.isNaN(ratioOf(0, 1)));
  check('means: 4 and 9 give AM 6.5, GM 6, HM 72/13; GM² = AM × HM', am(4, 9) === 6.5 && gm(4, 9) === 6 && near(hm(4, 9), 72 / 13) && near(gm(4, 9) ** 2, am(4, 9) * hm(4, 9)));
  const g = insertGMs(3, 96, 4);
  check('means: four GMs between 3 and 96 are 6, 12, 24, 48', near(g.r, 2) && g.means.every((v, i) => near(v, [6, 12, 24, 48][i])));
  check('money: 10000 at 8 % for 10 years is 21589.25', near(yearly(10000, 8, 10)[10], 21589.2499727, 1e-9) && yearly(100, 8, 3).length === 4);
  check('money: doubles after 10 years at 8 %, halves after 5 at −15 %, never at 0 %', yearsTo(10000, 8, 20000) === 10 && yearsTo(100, -15, 50) === 5 && yearsTo(100, 0, 200) === Infinity && yearsTo(100, 10, 50) === 0);
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const a = Math.random() * 20 - 10, r = Math.random() * 3 - 1.5, n = 1 + Math.floor(Math.random() * 15);
    let s = 0; for (let k = 1; k <= n; k++) s += term(a, r, k);
    if (!near(sumN(a, r, n), s, 1e-9)) ok = false;
    if (Math.abs(r) < 0.95 && !near(sumN(a, r, 2000), sumInf(a, r), 1e-9)) ok = false;
    const x = Math.random() * 50 + 0.01, y = Math.random() * 50 + 0.01;
    if (!(am(x, y) >= gm(x, y) - 1e-12 && gm(x, y) >= hm(x, y) - 1e-12)) ok = false;
  }
  check('300 random GPs: formula = term-by-term sum; long sums reach a/(1 − r); AM ≥ GM ≥ HM', ok);
};
