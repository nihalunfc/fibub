// SAT Math · Algebra · building and reading linear models from words, tables and graphs. Original (fibub).
import { int, nz, choose, shuffleOpts, fmt, lin, v, usd, steps } from './_util.js';
const F = { section: 'math', domain: 'algebra' };

export default {
  topic: 'linear-models',
  gens: [
    { id: 'sat-lm-g01', type: 'nat', level: 2, exams: ['sat'], sub: 'rate of change', facets: F, format: 'numeric',
      make(r) {
        const start = int(r, 10, 80) * 10, rate = int(r, 2, 30) * 5 * (r() < 0.4 ? -1 : 1), d = choose(r, [2, 3, 4, 5]);
        const t = [0, d, 2 * d, 3 * d], y = t.map((x) => start + rate * x);
        return { q: `<table class="qb-table"><tr><th>Day</th>${t.map((x) => `<td>${x}</td>`).join('')}</tr><tr><th>Litres in tank</th>${y.map((x) => `<td>${x.toLocaleString('en-US')}</td>`).join('')}</tr></table><p>The table shows the amount of water in a tank, which changes at a constant rate. By how many litres does the amount change each day? (Give a negative number for a decrease.)</p>`, answer: rate, tol: 0, y, d,
          sol: steps(`Between rows the day goes up by ${d} and the water changes by ${fmt(y[1] - y[0])}.`, `Per day: ${fmt(y[1] - y[0])} ÷ ${d} = <b>${fmt(rate)}</b> litres.`),
          trap: `Giving the change per row (${fmt(rate * d)}) instead of per day.` };
      },
      verify: (p) => (p.y[1] - p.y[0]) / p.d },
    { id: 'sat-lm-g02', type: 'nat', level: 2, exams: ['sat'], sub: 'break-even', facets: F, format: 'numeric',
      make(r) {
        const m = int(r, 2, 15), ra = int(r, 10, 40), rb = ra + int(r, 2, 12);
        const k = rb - ra, fee = k * m;
        return { q: `<p>Plan A costs a ${usd(fee)} sign-up fee plus ${usd(ra)} per month. Plan B has no sign-up fee and costs ${usd(rb)} per month. After how many months do the two plans cost the same in total?</p>`, answer: m, tol: 0, fee, ra, rb,
          sol: steps(`Plan A after ${v('n')} months: ${fee} + ${ra}${v('n')}. Plan B: ${rb}${v('n')}.`, `Set them equal: ${fee} + ${ra}${v('n')} = ${rb}${v('n')}, so ${fee} = ${k}${v('n')}.`, `${v('n')} = ${fee} ÷ ${k} = <b>${m}</b> months.`) };
      },
      verify: (p) => p.fee / (p.rb - p.ra) },
    { id: 'sat-lm-g03', type: 'nat', level: 2, exams: ['sat'], sub: 'when empty', facets: F, format: 'numeric',
      make(r) {
        const rate = int(r, 2, 12) * 5, t = int(r, 4, 30), V = rate * t, ask = int(r, 1, t - 1);
        const kind = choose(r, ['empty', 'left']);
        return { q: `<p>A pool holds ${V.toLocaleString('en-US')} gallons and is drained at a constant ${rate} gallons per minute. ${kind === 'empty' ? 'How many minutes does it take to empty?' : `How many gallons are left after ${ask} minutes?`}</p>`, answer: kind === 'empty' ? t : V - rate * ask, tol: 0, V, rate, ask, kind,
          sol: steps(`Model: ${v('G')} = ${V} − ${rate}${v('t')}.`, kind === 'empty' ? `Empty means ${v('G')} = 0: ${rate}${v('t')} = ${V}, so ${v('t')} = <b>${t}</b>.` : `${v('G')} = ${V} − ${rate}(${ask}) = <b>${V - rate * ask}</b>.`) };
      },
      verify: (p) => (p.kind === 'empty' ? p.V / p.rate : p.V - p.rate * p.ask) },
    { id: 'sat-lm-g04', type: 'mcq', level: 2, exams: ['sat'], sub: 'interpret', facets: F, format: 'single',
      make(r) {
        const s = choose(r, [
          ['A candle\'s height, in centimetres, <i>t</i> hours after it is lit is', 'h', 'the number of centimetres the candle burns down each hour', 'the height of the candle before it is lit', 'the number of hours the candle burns'],
          ['The balance, in dollars, on a gift card after <i>t</i> coffees are bought is', 'B', 'the cost of one coffee', 'the starting value of the card', 'the number of coffees that can be bought'],
          ['The fuel, in litres, left in a truck after it drives <i>t</i> hundred kilometres is', 'F', 'the litres used per hundred kilometres', 'the fuel in the tank at the start', 'the distance the truck can drive'],
        ]);
        const a = int(r, 20, 90), b = int(r, 2, 9), which = choose(r, ['slope', 'start']);
        const right = which === 'slope' ? s[2] : s[3];
        const o = shuffleOpts(r, right, [s[2], s[3], s[4], `the value of ${s[1]} after ${b} hours`]);
        return { q: `<p>${s[0]} given by ${v(s[1])} = ${a} − ${b}${v('t')}. What is the best interpretation of ${which === 'slope' ? b : a} in this context?</p>`, ...o,
          sol: `<p>In ${v(s[1])} = ${a} − ${b}${v('t')}, the number on its own (${a}) is the value when ${v('t')} = 0, the start. The number multiplied by ${v('t')} (${b}) is how much the value drops each time ${v('t')} goes up by 1. So ${which === 'slope' ? b : a} is <b>${right}</b>.</p>` };
      } },
  ],
  items: [
    { id: 'sat-lm-001', type: 'mcq', level: 2, exams: ['sat'], sub: 'build', facets: F,
      q: '<p>A taxi charges $3.50 to start a ride and $1.80 for each mile. Which function gives the cost <i>C</i>, in dollars, of a ride of <i>m</i> miles?</p>',
      options: ['<i>C</i>(<i>m</i>) = 1.80<i>m</i> + 3.50', '<i>C</i>(<i>m</i>) = 3.50<i>m</i> + 1.80', '<i>C</i>(<i>m</i>) = 5.30<i>m</i>', '<i>C</i>(<i>m</i>) = 1.80(<i>m</i> + 3.50)'], answer: 0,
      sol: '<p>The start charge is paid once: + 3.50. Each mile adds 1.80: 1.80<i>m</i>. The last option would multiply the start charge by 1.80 too.</p>' },
    { id: 'sat-lm-002', type: 'nat', level: 3, exams: ['sat'], sub: 'two points', facets: F,
      q: '<p>A plant was 12 centimetres tall 3 weeks after planting and 26 centimetres tall 10 weeks after planting. If it grew at a constant rate, how tall, in centimetres, was it when it was planted?</p>', answer: 6, tol: 0,
      sol: '<p>Rate: (26 − 12) ÷ (10 − 3) = 2 cm per week. Going back 3 weeks from 12 cm: 12 − 3 × 2 = <b>6</b> cm.</p>' },
  ],
};
