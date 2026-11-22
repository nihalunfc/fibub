import { int, choose, fmt, money, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'profit',
  items: [
    { id: 'pf-001', type: 'mcq', level: 2, exams: E, sub: 'markup',
      q: '<p>A store buys a lamp for &#36;40 and marks it up 50%. During a sale it takes 20% off the marked price. What is the profit on the lamp?</p>', options: ['&#36;4', '&#36;8', '&#36;12', '&#36;20', '&#36;48'], answer: 1,
      sol: '<p>Marked price: 40 × 1.5 = &#36;60. Sale price: 60 × 0.8 = &#36;48. Profit: 48 − 40 = &#36;8.</p>', trap: '50% up and 20% off is not 30% up: it is 1.5 × 0.8 = 1.2, a 20% profit.' },
    { id: 'pf-002', type: 'mcq', level: 2, exams: E, sub: 'interest',
      q: '<p>&#36;2,000 is invested at 10% a year, compounded once a year. What is it worth after 2 years?</p>', options: ['&#36;2,200', '&#36;2,400', '&#36;2,420', '&#36;2,440', '&#36;2,662'], answer: 2,
      sol: '<p>Year 1: 2,000 × 1.1 = 2,200. Year 2: 2,200 × 1.1 = 2,420. Simple interest would give 2,400; the extra &#36;20 is interest on the first year\'s interest.</p>' },
  ],
  gens: [
    { id: 'pf-g01', type: 'mcq', level: 2, exams: E, sub: 'markup and discount', title: 'markup then discount',
      make(r) {
        const cost = int(r, 4, 40) * 10, up = choose(r, [20, 25, 40, 50, 60, 80, 100]), off = choose(r, [10, 15, 20, 25, 30]);
        const sale = cost * (1 + up / 100) * (1 - off / 100), value = sale - cost;
        return { q: `<p>A shop buys a chair for ${money(cost)}, marks the price up ${up}% and later sells it at ${off}% off the marked price. What is the profit, in dollars? (A loss is negative.)</p>`, ...numOpts(r, value, [cost * (up - off) / 100, cost * up / 100, sale], (x) => money(x)), value, cost, up, off,
          hint: 'Apply the markup to the cost, then the discount to the marked price.',
          sol: steps(`Marked price: ${money(cost)} × ${fmt(1 + up / 100)} = ${money(cost * (1 + up / 100))}.`, `Sale price: × ${fmt(1 - off / 100)} = ${money(sale)}.`, `Profit: ${money(sale)} − ${money(cost)} = <b>${money(value)}</b>.`), trap: `Subtracting the percents (${up} − ${off} = ${up - off}%) gives ${money(cost * (up - off) / 100)}.` };
      }, check: (p) => p.cost * ((1 + p.up / 100) * (1 - p.off / 100) - 1) },
    { id: 'pf-g02', type: 'mcq', level: 2, exams: E, sub: 'interest', title: 'compound interest',
      make(r) {
        const P = int(r, 2, 20) * 500, rate = choose(r, [2, 4, 5, 6, 8, 10, 20]), n = choose(r, [2, 3]), value = P * (1 + rate / 100) ** n;
        return { q: `<p>${money(P)} is invested at ${rate}% a year, compounded once a year. What is the investment worth after ${n} years, in dollars?</p>`, ...numOpts(r, value, [P * (1 + (rate * n) / 100), P * (1 + rate / 100) ** (n - 1), P * (rate / 100) * n], (x) => money(x)), value, P, rate, n,
          hint: `Each year multiply by ${fmt(1 + rate / 100)}.`,
          sol: steps(`Value = ${money(P)} × ${fmt(1 + rate / 100)}<sup>${n}</sup>.`, `${fmt(1 + rate / 100)}<sup>${n}</sup> = ${fmt((1 + rate / 100) ** n, 6)}.`, `${money(P)} × ${fmt((1 + rate / 100) ** n, 6)} = <b>${money(value)}</b>.`), trap: `Simple interest gives ${money(P * (1 + (rate * n) / 100))}; compounding also earns interest on interest.` };
      }, check: (p) => p.P * (1 + p.rate / 100) ** p.n },
    { id: 'pf-g03', type: 'mcq', level: 2, exams: E, sub: 'break-even', title: 'break-even quantity',
      make(r) {
        const fixed = int(r, 4, 40) * 500, price = choose(r, [12, 15, 20, 25, 30, 40]), vc = choose(r, [4, 5, 6, 8, 10].filter((x) => x < price)), unitM = price - vc, value = Math.ceil(fixed / unitM);
        return { q: `<p>A small bakery pays ${money(fixed)} a month in fixed costs. Each cake sells for ${money(price)} and costs ${money(vc)} in ingredients. What is the least number of cakes it must sell in a month to avoid a loss?</p>`, ...numOpts(r, value, [Math.ceil(fixed / price), Math.floor(fixed / unitM) === value ? value + 2 : Math.floor(fixed / unitM), Math.ceil(fixed / vc)]), value, fixed, price, vc,
          hint: 'Each cake adds price − ingredient cost toward the fixed costs.',
          sol: steps(`Each cake contributes ${money(price)} − ${money(vc)} = ${money(unitM)}.`, `${money(fixed)} ÷ ${money(unitM)} = ${fmt(fixed / unitM, 2)}.`, `Round up to a whole cake: <b>${value}</b>.`), trap: 'Dividing the fixed cost by the full price, which forgets the ingredient cost.' };
      }, check: (p) => Math.ceil(p.fixed / (p.price - p.vc)) },
  ],
};
