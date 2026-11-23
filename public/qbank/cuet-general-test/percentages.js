// CUET General Test: percentages. Original questions for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq0 = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Written items list the correct option first; this moves it to slot (id number mod 4) so answers spread over A-D.
const mcq = (id, level, sub, q, opts, answer, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4; const right = opts[answer]; const o = opts.filter((_, i) => i !== answer); o.splice(k, 0, right);
  return mcq0(id, level, sub, q, o, k, sol, trap);
};

export default {
  topic: 'percentages',
  items: [
    mcq('pc-001', 1, 'basics', 'What is 15% of 240?', ['36', '24', '32', '40'], 0,
      '10% of 240 is 24 and 5% is half of that, 12. So 15% = 24 + 12 = <b>36</b>.'),
    mcq('pc-002', 1, 'basics', '45 is what percent of 180?', ['25%', '20%', '30%', '40%'], 0,
      '45 ÷ 180 = 0.25 = <b>25%</b>. Check: a quarter of 180 is 45.'),
    mcq('pc-003', 1, 'fractions', 'Which fraction equals 37.5%?', ['3/8', '3/7', '5/8', '7/20'], 0,
      '37.5% = 37.5/100 = 375/1000 = <b>3/8</b>. Learn the eighths: 12.5%, 25%, 37.5%, 50%, 62.5%, 75%, 87.5%.'),
    mcq('pc-004', 2, 'change', 'A price rises from ₹400 to ₹460. What is the percentage increase?', ['15%', '13%', '60%', '12%'], 0,
      'Change = 460 − 400 = 60. Percentage change is always change ÷ <b>old</b> value: 60 ÷ 400 = 0.15 = <b>15%</b>.',
      'Dividing by the new value (60 ÷ 460 ≈ 13%) is the usual slip.'),
    mcq('pc-005', 2, 'successive', 'A price goes up 20% and then comes down 20%. Overall it is:', ['4% lower', 'unchanged', '4% higher', '2% lower'], 0,
      'Use multipliers: 1.20 × 0.80 = 0.96, so the price ends at 96% of the start, <b>4% lower</b>. The 20% fall is taken on a bigger number than the 20% rise.',
      'Thinking +20% and −20% cancel.'),
    mcq('pc-006', 2, 'reverse', 'After a 25% increase a salary is ₹30,000. What was it before?', ['₹24,000', '₹22,500', '₹25,000', '₹23,000'], 0,
      'New = old × 1.25, so old = 30,000 ÷ 1.25 = <b>₹24,000</b>.',
      'Taking 25% off ₹30,000 (₹22,500) undoes the wrong base.'),
    mcq('pc-007', 2, 'compare', 'If A is 25% more than B, then B is how much less than A?', ['20%', '25%', '30%', '15%'], 0,
      'Let B = 100, so A = 125. B is 25 less than A, and 25 ÷ 125 = <b>20%</b>.'),
    mcq('pc-008', 2, 'population', 'A town of 50,000 grows 10% a year. What is its population after 2 years?', ['60,500', '60,000', '55,000', '61,000'], 0,
      '50,000 × 1.1 × 1.1 = 50,000 × 1.21 = <b>60,500</b>. Growth is on the new total each year.'),
    mcq('pc-009', 2, 'expenditure', 'The price of sugar rises 25%. By what percent must a family cut its use to keep spending the same?', ['20%', '25%', '15%', '33⅓%'], 0,
      'Spending = price × amount. Price × 1.25, so amount must be × 1/1.25 = 0.8, a cut of <b>20%</b>. Shortcut: r ÷ (100 + r) × 100 = 25 ÷ 125 × 100.'),
    mcq('pc-010', 2, 'exams', 'A student needs 40% to pass. She scores 178 and fails by 22 marks. What are the maximum marks?', ['500', '450', '400', '550'], 0,
      'Pass mark = 178 + 22 = 200. That is 40% of the maximum, so maximum = 200 ÷ 0.4 = <b>500</b>.'),
    mcq('pc-011', 2, 'elections', 'In a two-person election the winner gets 58% of the valid votes and wins by 1,200 votes. How many valid votes were cast?', ['7,500', '6,000', '8,000', '12,000'], 0,
      'Loser gets 42%, so the margin is 58 − 42 = 16% of the votes. 16% = 1,200, so 100% = 1,200 ÷ 0.16 = <b>7,500</b>.'),
    mcq('pc-012', 3, 'successive', 'Two successive discounts of 10% and 20% equal one discount of:', ['28%', '30%', '27%', '25%'], 0,
      '0.9 × 0.8 = 0.72, so you pay 72% and the single discount is <b>28%</b>. Formula: a + b − ab/100 = 10 + 20 − 2 = 28.'),
    mcq('pc-013', 3, 'mixture', 'In 60 litres of a mixture, 20% is water. How much water must be added so that water becomes 40%?', ['20 L', '12 L', '24 L', '15 L'], 0,
      'Non-water part = 80% of 60 = 48 L and it does not change. In the new mixture it is 60%, so the total is 48 ÷ 0.6 = 80 L. Water added = 80 − 60 = <b>20 L</b>.',
      'Adding 20% of 60 (12 L) forgets that the total grows.'),
    mcq('pc-014', 1, 'fractions', 'Which is the largest?', ['3/5', '55%', '0.58', '7/13'], 0,
      '3/5 = 60%, 0.58 = 58%, 7/13 ≈ 53.8%. The largest is <b>3/5</b>.'),
    mcq('pc-015', 2, 'basics', 'What is 120% of 85?', ['102', '97', '105', '100'], 0,
      '120% = 1.2, and 85 × 1.2 = <b>102</b>.'),
    mcq('pc-016', 2, 'change', 'A phone\'s battery life falls from 20 hours to 17 hours. By what percent did it fall?', ['15%', '3%', '17.6%', '12%'], 0,
      'Fall = 3 hours, and 3 ÷ 20 = <b>15%</b> (divide by the old value).'),
    mcq('pc-017', 3, 'comparison', 'A\'s income is 20% less than B\'s. By what percent is B\'s income more than A\'s?', ['25%', '20%', '22%', '18%'], 0,
      'Let B = 100, so A = 80. B is 20 more than A, and 20 ÷ 80 = <b>25%</b>.'),
    mcq('pc-018', 3, 'successive', 'The length of a rectangle increases 20% and its width decreases 10%. Its area:', ['increases 8%', 'increases 10%', 'decreases 2%', 'increases 12%'], 0,
      'Area multiplier = 1.2 × 0.9 = 1.08, an <b>8% increase</b>.'),
    mcq('pc-019', 2, 'basics', 'x% of y equals y% of:', ['x', 'y', '100', 'xy'], 0,
      'x% of y = xy/100 = y% of <b>x</b>. Handy trick: 8% of 50 = 50% of 8 = 4.'),
    mcq('pc-020', 3, 'budget', 'A family spends 30% on rent, 25% of the rest on food, and saves ₹15,750, which is what is left. What is its income?', ['₹30,000', '₹35,000', '₹31,500', '₹45,000'], 0,
      'After rent, 70% is left; food takes 25% of that, so 75% of 70% = 52.5% is saved. Income = 15,750 ÷ 0.525 = <b>₹30,000</b>.'),
  ],
  gens: [
    { id: 'pc-g01', type: 'mcq', level: 1, sub: 'basics', ...T,
      make(rng) {
        const p = choose(rng, [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75]), n = int(rng, 4, 60) * 20;
        const a = (p * n) / 100;
        const { options, answer } = shuffleOpts(rng, a, [a * 2, a / 2, a + n / 10, (n * (p + 5)) / 100], (v) => fmt(v));
        return { q: `What is ${p}% of ${fmt(n, 0)}?`, options, answer, p, n,
          sol: steps(`${p}% means ${p} out of every 100.`, `${p}/100 × ${fmt(n, 0)} = <b>${fmt(a)}</b>.`) };
      },
      verify: (p) => fmt((p.n * p.p) / 100) === p.options[p.answer] ? p.answer : -1 },
    { id: 'pc-g02', type: 'mcq', level: 2, sub: 'change', ...T,
      make(rng) {
        const old = int(rng, 8, 50) * 20, up = rng() < 0.5, p = choose(rng, [5, 10, 15, 20, 25, 30, 40]);
        const nu = up ? old * (1 + p / 100) : old * (1 - p / 100), ch = Math.abs(nu - old);
        const wrong = +((ch / nu) * 100).toFixed(1);
        const { options, answer } = shuffleOpts(rng, p, [wrong, p + 5, Math.max(1, p - 5)], (v) => `${fmt(v, 1)}%`);
        return { q: `A price ${up ? 'rises' : 'falls'} from ${rs(old, 0)} to ${rs(nu)}. What is the percentage ${up ? 'increase' : 'decrease'}?`, options, answer,
          sol: steps(`Change = ${rs(ch)}.`, `Divide by the <b>old</b> price: ${fmt(ch)} ÷ ${fmt(old, 0)} = ${fmt(p / 100, 2)} = <b>${p}%</b>.`),
          trap: `Dividing by the new price gives ${fmt(wrong, 1)}%.` };
      } },
    { id: 'pc-g03', type: 'mcq', level: 2, sub: 'successive', ...T,
      make(rng) {
        const a = choose(rng, [10, 20, 25, 30, 40, 50]), b = choose(rng, [10, 20, 25, 30, 40, 50]);
        const net = +((1 + a / 100) * (1 - b / 100) * 100 - 100).toFixed(2);
        const show = (v) => (v === 0 ? 'no change' : `${fmt(Math.abs(v), 2)}% ${v > 0 ? 'higher' : 'lower'}`);
        const { options, answer } = shuffleOpts(rng, net, [a - b, -(a * b) / 200, net === 0 ? 2 : -net], show);
        return { q: `A price goes up ${a}% and then down ${b}%. Overall the price is:`, options, answer,
          sol: steps(`Multipliers: up ${a}% is × ${1 + a / 100}, down ${b}% is × ${1 - b / 100}.`, `${1 + a / 100} × ${1 - b / 100} = ${fmt(1 + net / 100, 4)}.`, `So the price is <b>${show(net)}</b>.`),
          trap: 'Adding and subtracting the percentages ignores that the second change is on a new base.' };
      } },
    { id: 'pc-g04', type: 'mcq', level: 2, sub: 'reverse', ...T,
      make(rng) {
        const p = choose(rng, [10, 20, 25, 40, 50]), old = int(rng, 10, 60) * 1000, nu = old * (1 + p / 100);
        const { options, answer } = shuffleOpts(rng, old, [nu * (1 - p / 100), old + 1000, old - 1000], (v) => rs(v, 0));
        return { q: `After a ${p}% rise, a monthly salary is ${rs(nu, 0)}. What was it before the rise?`, options, answer,
          sol: steps(`New = old × ${1 + p / 100}.`, `Old = ${fmt(nu, 0)} ÷ ${1 + p / 100} = <b>${rs(old, 0)}</b>.`),
          trap: `Taking ${p}% off the new salary gives ${rs(nu * (1 - p / 100), 0)}, which is wrong because the ${p}% was of the old salary.` };
      } },
    { id: 'pc-g05', type: 'mcq', level: 3, sub: 'expenditure', ...T,
      make(rng) {
        const r = choose(rng, [10, 20, 25, 50, 60, 100]), cut = +((r / (100 + r)) * 100).toFixed(2);
        const { options, answer } = shuffleOpts(rng, cut, [r, r / 2, cut + 5], (v) => `${fmt(v, 2)}%`);
        return { q: `The price of cooking oil rises ${r}%. By what percent must a family reduce how much it uses, so that it spends the same amount?`, options, answer,
          sol: steps(`Spending = price × amount, and it must stay the same.`, `Price × ${1 + r / 100}, so amount × 1/${1 + r / 100}.`, `Cut = ${r} ÷ ${100 + r} × 100 = <b>${fmt(cut, 2)}%</b>.`) };
      } },
  ],
};
