// #1165 Sample space builder. Probabilities checked against counts done separately in Python with
// itertools.product (two dice: P(sum 7) = 6/36, P(sum ≥ 10) = 6/36, P(prime sum) = 15/36, P(product even) = 27/36;
// three coins: P(exactly 1 head) = 3/8) and the 52-card deck (26 red, 12 face, 6 red face cards).
import { space, EVENTS, probability, simulate, rng } from '../../src/lib/sci/sample-school.ts';

export default async (check) => {
  const ev = (kind, id) => EVENTS[kind].find((e) => e.id === id);
  const P = (kind, id, k, coins) => { const e = ev(kind, id); return probability(space(kind, coins), (v) => e.test(v, k ?? e.k?.[2])); };
  const D = space('dice');
  check('dice: 36 outcomes, first (1, 1), last (6, 6)', D.length === 36 && D[0].label === '(1, 1)' && D[35].label === '(6, 6)');
  check('dice: sum 7 is 6/36 = 1/6', P('dice', 'sum', 7).fav === 6 && P('dice', 'sum', 7).text === '1/6');
  check('dice: sum ≥ 10 is 6/36, doubles 6/36, at least one 6 is 11/36', P('dice', 'sumge', 10).fav === 6 && P('dice', 'double').fav === 6 && P('dice', 'six').text === '11/36');
  check('dice: product even 27/36 = 3/4, prime sum 15/36 = 5/12, sum 13 impossible', P('dice', 'prodeven').text === '3/4' && P('dice', 'prime').text === '5/12' && P('dice', 'sum', 13).text === '0');
  const C3 = space('coins', 3);
  check('coins: 3 coins give 8 outcomes HHH ... TTT', C3.length === 8 && C3[0].label === 'HHH' && C3[7].label === 'TTT' && space('coins', 1).map((o) => o.label).join() === 'H,T');
  check('coins: exactly 1 head of 3 is 3/8, at least one head 7/8, all same 2/8', P('coins', 'heads', 1, 3).text === '3/8' && P('coins', 'atleast', 0, 3).text === '7/8' && P('coins', 'same', 0, 3).text === '1/4');
  check('cards: 52; red 1/2, face 3/13, ace 1/13, red face 3/26, not a heart 3/4', space('cards').length === 52 && P('cards', 'red').text === '1/2' && P('cards', 'face').text === '3/13' && P('cards', 'ace').text === '1/13' && P('cards', 'redface').text === '3/26' && P('cards', 'notheart').text === '3/4');
  const s = simulate(D, (v) => v[0] + v[1] === 7, 60000, rng(42));
  check('simulation: 60 000 rolls give a frequency near 1/6 (within 0.01)', Math.abs(s.freq - 1 / 6) < 0.01 && s.path.at(-1)[0] === 60000);
  const a = simulate(D, (v) => v[0] === v[1], 500, rng(7)), b = simulate(D, (v) => v[0] === v[1], 500, rng(7));
  check('simulation: same seed gives the same result', a.hits === b.hits);
  let ok = true; const r = rng(1); for (let i = 0; i < 10000; i++) { const x = r(); if (!(x >= 0 && x < 1)) ok = false; }
  check('rng: numbers in [0, 1)', ok);
};
