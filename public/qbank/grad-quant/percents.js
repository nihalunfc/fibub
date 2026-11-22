import { int, choose, fmt, money, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'percents',
  items: [
    { id: 'pc-001', type: 'mcq', level: 2, exams: E, sub: 'successive',
      q: '<p>A price rises by 20% and then falls by 20%. Compared with the original price, the final price is:</p>', options: ['4% lower', '2% lower', 'the same', '2% higher', '4% higher'], answer: 0,
      sol: '<p>Use 100: up 20% gives 120; down 20% of 120 (24) gives 96. That is 4% below the original.</p>', trap: 'The two 20% changes are of different amounts, so they do not cancel.' },
    { id: 'pc-002', type: 'mcq', level: 2, exams: E, sub: 'reverse',
      q: '<p>After a 25% discount a jacket costs &#36;90. What was the price before the discount?</p>', options: ['&#36;67.50', '&#36;112.50', '&#36;115', '&#36;120', '&#36;125'], answer: 3,
      sol: '<p>&#36;90 is 75% of the old price, so the old price is 90 ÷ 0.75 = &#36;120.</p>', trap: 'Adding 25% of &#36;90 gives &#36;112.50; the 25% was of the old price, not the new one.' },
    { id: 'pc-003', type: 'mcq', level: 3, exams: E, sub: 'percent of percent',
      q: '<p>In a company, 40% of employees work remotely, and 30% of the remote workers live in another country. What percent of all employees are remote workers living in another country?</p>', options: ['10%', '12%', '28%', '70%', '75%'], answer: 1,
      sol: '<p>30% of 40% is 0.3 × 0.4 = 0.12, or 12% of all employees.</p>' },
  ],
  gens: [
    { id: 'pc-g01', type: 'mcq', level: 1, exams: E, sub: 'percent change', title: 'percent change',
      make(r) {
        const old = int(r, 4, 40) * 5, ch = choose(r, [-40, -30, -25, -20, -15, -12, -10, 8, 10, 15, 20, 25, 30, 40, 50, 60, 75]), nw = old * (1 + ch / 100), value = ch;
        return { q: `<p>The number of members of a club changed from ${old} to ${fmt(nw)}. What was the percent change? (A decrease is negative.)</p>`, ...numOpts(r, value, [((nw - old) / nw) * 100, -value, nw - old].map((x) => +x.toFixed(1))), value, old, nw, unit: '%',
          hint: 'Percent change = (new − old) ÷ old × 100.',
          sol: steps(`Change: ${fmt(nw)} − ${old} = ${fmt(nw - old)}.`, `Divide by the old value: ${fmt(nw - old)} ÷ ${old} = ${fmt((nw - old) / old)}.`, `× 100 = <b>${value}%</b>.`), trap: 'Dividing by the new value instead of the old one.' };
      }, check: (p) => ((p.nw - p.old) / p.old) * 100 },
    { id: 'pc-g02', type: 'mcq', level: 2, exams: E, sub: 'successive', title: 'two changes in a row',
      make(r) {
        const a = choose(r, [10, 20, 25, 30, 40, 50]), b = choose(r, [10, 20, 25, 30, 40]), up = r() < 0.5;
        const f = (1 + (up ? a : -a) / 100) * (1 + (up ? -b : b) / 100), value = +((f - 1) * 100).toFixed(4);
        return { q: `<p>A stock price ${up ? 'rose' : 'fell'} ${a}% on Monday and then ${up ? 'fell' : 'rose'} ${b}% on Tuesday. What was the overall percent change over the two days? (A decrease is negative.)</p>`, ...numOpts(r, value, [up ? a - b : b - a, -value, (up ? a - b : b - a) + 5]), value, a, b, up, unit: '%',
          hint: 'Start from 100 and apply the changes one after the other.',
          sol: steps(`Start at 100. Monday: ${fmt(100 * (1 + (up ? a : -a) / 100))}.`, `Tuesday: ${fmt(100 * (1 + (up ? a : -a) / 100))} × ${fmt(1 + (up ? -b : b) / 100)} = ${fmt(100 * f)}.`, `Overall change: <b>${fmt(value)}%</b>.`), trap: `Simply adding the two percents gives ${up ? a - b : b - a}%.` };
      }, check: (p) => ((1 + (p.up ? p.a : -p.a) / 100) * (1 + (p.up ? -p.b : p.b) / 100) - 1) * 100 },
    { id: 'pc-g03', type: 'mcq', level: 2, exams: E, sub: 'reverse', title: 'find the original amount',
      make(r) {
        const pct = choose(r, [5, 10, 15, 20, 25, 30, 40]), up = r() < 0.5, orig = int(r, 4, 60) * 20, nw = orig * (1 + (up ? pct : -pct) / 100), value = orig;
        return { q: `<p>After a ${pct}% ${up ? 'raise' : 'pay cut'}, a monthly salary is ${money(nw)}. What was the salary before the change, in dollars?</p>`, ...numOpts(r, value, [nw * (1 - (up ? pct : -pct) / 100), nw - pct, nw], (x) => money(x)), value, nw, pct, up,
          hint: `The new salary is ${up ? 100 + pct : 100 - pct}% of the old one.`,
          sol: steps(`New = old × ${fmt(1 + (up ? pct : -pct) / 100)}.`, `Old = ${money(nw)} ÷ ${fmt(1 + (up ? pct : -pct) / 100)}.`, `= <b>${money(value)}</b>.`), trap: `Taking ${pct}% of the new salary instead.` };
      }, check: (p) => p.nw / (1 + (p.up ? p.pct : -p.pct) / 100) },
    { id: 'pc-g04', type: 'mcq', level: 3, exams: E, sub: 'percent of', title: 'what percent of',
      make(r) {
        const whole = int(r, 4, 50) * 20, pct = choose(r, [2.5, 5, 7.5, 12.5, 15, 35, 45, 62.5, 80, 120, 150]), part = (whole * pct) / 100, value = pct;
        return { q: `<p>${fmt(part)} is what percent of ${fmt(whole)}?</p>`, ...numOpts(r, value, [(whole / part) * 100, pct / 10, pct * 2].map((x) => +x.toFixed(2))), value, part, whole, unit: '%',
          hint: 'Percent = part ÷ whole × 100.',
          sol: steps(`${fmt(part)} ÷ ${fmt(whole)} = ${fmt(part / whole)}.`, `× 100 = <b>${fmt(value)}%</b>.`), trap: 'Dividing the whole by the part.' };
      }, check: (p) => (p.part / p.whole) * 100 },
  ],
};
