// SAT Math · Problem-solving and data analysis · ratios, rates, proportions and percentages. Original (fibub).
import { int, choose, shuffleOpts, fmt, usd, steps } from './_util.js';
const F = { section: 'math', domain: 'data' };

export default {
  topic: 'ratios-rates-percent',
  gens: [
    { id: 'sat-rp-g01', type: 'nat', marks: 1, level: 1, exams: ['sat'], sub: 'percent of', facets: F, format: 'numeric',
      make(r) {
        const p = choose(r, [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75]), n = int(r, 2, 40) * 20;
        return { q: `<p>What is ${p}% of ${n}?</p>`, answer: (p * n) / 100, tol: 0, p, n,
          sol: steps(`"Percent" means "out of 100", so ${p}% = ${p}/100 = ${fmt(p / 100)}.`, `${fmt(p / 100)} × ${n} = <b>${fmt((p * n) / 100)}</b>.`) };
      },
      verify: (p) => (p.p / 100) * p.n },
    { id: 'sat-rp-g02', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'percent change', facets: F, format: 'numeric',
      make(r) {
        const old = int(r, 4, 40) * 25, p = choose(r, [4, 8, 10, 12, 16, 20, 24, 30, 40]), up = r() < 0.5;
        const now = old * (1 + (up ? p : -p) / 100);
        return { q: `<p>The price of a jacket changed from ${usd(old)} to ${usd(now)}. By what percent did the price ${up ? 'increase' : 'decrease'}?</p>`, answer: p, tol: 0, old, now,
          sol: steps(`Change: ${usd(Math.abs(now - old))}.`, `Percent change = change ÷ <i>original</i> × 100 = ${fmt(Math.abs(now - old))} ÷ ${old} × 100 = <b>${p}</b>%.`),
          trap: 'Dividing by the new price instead of the original.' };
      },
      verify: (p) => (Math.abs(p.now - p.old) / p.old) * 100 },
    { id: 'sat-rp-g03', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'successive percents', facets: F, format: 'single',
      make(r) {
        const a = choose(r, [10, 20, 25, 30, 40, 50]), b = choose(r, [10, 20, 25, 30, 40, 50]);
        const net = Math.round(((1 + a / 100) * (1 - b / 100) - 1) * 10000) / 100;
        const word = (x) => (x === 0 ? "no change" : x > 0 ? `a ${fmt(x)}% increase` : `a ${fmt(-x)}% decrease`);
        const o = shuffleOpts(r, word(net), [word(a - b), word(a + b === 0 ? 1 : a - b + 5), word(-(a * b) / 100), a === b ? 'no change' : word(b - a)]);
        return { q: `<p>A store raised the price of a lamp by ${a}%. A month later it lowered the new price by ${b}%. Which describes the overall change from the original price?</p>`, ...o,
          sol: steps(`Raising by ${a}% multiplies by ${fmt(1 + a / 100)}; lowering by ${b}% multiplies by ${fmt(1 - b / 100)}.`, `Overall: ${fmt(1 + a / 100)} × ${fmt(1 - b / 100)} = ${fmt((1 + a / 100) * (1 - b / 100))}.`, `So the overall change is <b>${word(net)}</b>.`),
          trap: `Adding the percents (${a} − ${b}): the second percent is taken of a different, larger price.` };
      } },
    { id: 'sat-rp-g04', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'proportion', facets: F, format: 'numeric',
      make(r) {
        const s = choose(r, [['cups of flour', 'muffins'], ['litres of paint', 'square metres of wall'], ['grams of salt', 'litres of soup'], ['hours of work', 'chairs built']]);
        const a = int(r, 2, 9), b = a * int(r, 2, 8), k = int(r, 2, 9);
        return { q: `<p>A recipe uses ${a} ${s[0]} for every ${b} ${s[1]}. At this rate, how many ${s[0]} are needed for ${b * k} ${s[1]}?</p>`, answer: a * k, tol: 0, a, b, n: b * k,
          sol: steps(`Set up a proportion: ${a}/${b} = <i>x</i>/${b * k}.`, `${b * k} is ${k} times ${b}, so <i>x</i> = ${a} × ${k} = <b>${a * k}</b>.`) };
      },
      verify: (p) => (p.a * p.n) / p.b },
    { id: 'sat-rp-g05', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'ratio parts', facets: F, format: 'numeric',
      make(r) {
        const x = int(r, 1, 7), y = int(r, 1, 7) + (x === 1 ? 1 : 0), m = int(r, 3, 25), total = (x + y) * m;
        return { q: `<p>The ratio of red tiles to blue tiles in a box is ${x} to ${y}. There are ${total} tiles in all. How many blue tiles are there?</p>`, answer: y * m, tol: 0, x, y, total,
          sol: steps(`The ratio ${x} : ${y} splits the tiles into ${x + y} equal parts.`, `One part: ${total} ÷ ${x + y} = ${m}.`, `Blue = ${y} parts = <b>${y * m}</b>.`),
          trap: `Using ${total} ÷ ${y} instead of dividing by the total number of parts.` };
      },
      verify: (p) => (p.total * p.y) / (p.x + p.y) },
    { id: 'sat-rp-g06', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'reverse percent', facets: F, format: 'numeric',
      make(r) {
        const p = choose(r, [10, 20, 25, 40, 50, 60, 75]), orig = int(r, 2, 40) * 20, now = orig * (1 - p / 100);
        return { q: `<p>After a ${p}% discount, a bicycle costs ${usd(now)}. What was the price, in dollars, before the discount?</p>`, answer: orig, tol: 0, p, now,
          sol: steps(`After a ${p}% discount you pay ${100 - p}% of the original: ${fmt((100 - p) / 100)} × <i>P</i> = ${fmt(now)}.`, `<i>P</i> = ${fmt(now)} ÷ ${fmt((100 - p) / 100)} = <b>${orig}</b>.`),
          trap: `Adding ${p}% of the sale price back on (${fmt(now * (1 + p / 100))}).` };
      },
      verify: (p) => p.now / (1 - p.p / 100) },
  ],
  items: [
    { id: 'sat-rp-001', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'unit rate', facets: F,
      q: '<p>Store A sells 6 bottles of water for &#36;4.50. Store B sells 10 bottles for &#36;7.20. Which statement is true?</p>',
      options: ['Store B is cheaper by &#36;0.03 per bottle.', 'Store A is cheaper by &#36;0.03 per bottle.', 'Both stores charge the same per bottle.', 'Store B is cheaper by &#36;0.30 per bottle.'], answer: 0,
      sol: '<p>Price per bottle: A: 4.50 ÷ 6 = &#36;0.75. B: 7.20 ÷ 10 = &#36;0.72. B is cheaper by 0.75 − 0.72 = <b>&#36;0.03</b> per bottle.</p>' },
    { id: 'sat-rp-002', type: 'nat', marks: 1, level: 4, exams: ['sat'], sub: 'percent of a percent', facets: F,
      q: '<p>In a school, 40% of students play a sport. Of the students who play a sport, 25% play soccer. What percent of all the students in the school play soccer?</p>', answer: 10, tol: 0,
      sol: '<p>25% of 40% = 0.25 × 0.40 = 0.10, so <b>10</b>% of all students play soccer.</p>' },
  ],
};
