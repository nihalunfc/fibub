// SAT Math · Problem-solving and data analysis · scatterplots, lines of best fit and two-way tables. Original (fibub).
import { int, choose, shuffleOpts, fmt, steps } from './_util.js';
const F = { section: 'math', domain: 'data' };

export default {
  topic: 'two-variable-data',
  gens: [
    { id: 'sat-tv-g01', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'predict from a line', facets: F, format: 'numeric',
      make(r) {
        const m = int(r, 2, 12) / 2, b = int(r, 5, 40), x = int(r, 3, 20);
        return { q: `<p>The line of best fit for a scatterplot of plant height <i>y</i>, in centimetres, against weeks <i>x</i> is <i>y</i> = ${fmt(m)}<i>x</i> + ${b}. What height does the line predict at ${x} weeks?</p>`, answer: m * x + b, tol: 0.001, m, b, x,
          sol: steps(`Put <i>x</i> = ${x} into the line: ${fmt(m)}(${x}) + ${b} = <b>${fmt(m * x + b)}</b> cm.`) };
      },
      verify: (p) => p.m * p.x + p.b },
    { id: 'sat-tv-g02', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'interpret slope', facets: F, format: 'single',
      make(r) {
        const m = int(r, 2, 9) * 5, b = int(r, 100, 400);
        const right = `For each additional hour of advertising, the model predicts about ${m} more tickets sold.`;
        const o = shuffleOpts(r, right, [`The model predicts ${m} tickets sold with no advertising.`, `For each additional ticket, the model predicts ${m} more hours of advertising.`, `The model predicts ${b} more tickets for each hour of advertising.`]);
        return { q: `<p>A theatre models tickets sold <i>T</i> against hours of radio advertising <i>h</i> with the line of best fit <i>T</i> = ${m}<i>h</i> + ${b}. What is the best interpretation of ${m}?</p>`, ...o,
          sol: `<p>The slope (${m}) is the predicted change in <i>T</i> for each 1-unit increase in <i>h</i>. The constant (${b}) is the prediction at <i>h</i> = 0. Answer: <b>${right}</b></p>`,
          trap: 'Swapping the roles of slope and intercept.' };
      } },
    { id: 'sat-tv-g03', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'two-way table', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 10, 40), b = int(r, 10, 40), c = int(r, 10, 40), d = int(r, 10, 40);
        const ask = choose(r, ['row', 'col']);
        const q = `<table class="qb-table"><tr><th></th><th>Walks to school</th><th>Takes the bus</th></tr><tr><th>Grade 9</th><td>${a}</td><td>${b}</td></tr><tr><th>Grade 10</th><td>${c}</td><td>${d}</td></tr></table>`;
        const ans = ask === 'row' ? (100 * b) / (a + b) : (100 * c) / (a + c);
        return { q: q + (ask === 'row' ? '<p>What percent of grade 9 students take the bus? Round to the nearest whole percent.</p>' : '<p>Of the students who walk to school, what percent are in grade 10? Round to the nearest whole percent.</p>'), answer: Math.round(ans), tol: 0, a, b, c, d, ask,
          sol: ask === 'row' ? steps(`Grade 9 total: ${a} + ${b} = ${a + b}.`, `${b} ÷ ${a + b} × 100 ≈ <b>${Math.round(ans)}</b>%.`) : steps(`Walkers in total: ${a} + ${c} = ${a + c}.`, `${c} ÷ ${a + c} × 100 ≈ <b>${Math.round(ans)}</b>%.`),
          trap: 'Dividing by the grand total instead of the row or column the question names.' };
      },
      verify: (p) => Math.round(p.ask === 'row' ? (100 * p.b) / (p.a + p.b) : (100 * p.c) / (p.a + p.c)) },
    { id: 'sat-tv-g04', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'residual', facets: F, format: 'numeric',
      make(r) {
        const m = int(r, 2, 8), b = int(r, 10, 30), x = int(r, 2, 12), res = int(r, -9, 9) || 4;
        const y = m * x + b + res;
        return { q: `<p>A line of best fit is <i>y</i> = ${m}<i>x</i> + ${b}. One data point is (${x}, ${y}). What is the actual <i>y</i>-value minus the value the line predicts at <i>x</i> = ${x}?</p>`, answer: res, tol: 0, m, b, x, y,
          sol: steps(`Predicted: ${m}(${x}) + ${b} = ${m * x + b}.`, `Actual − predicted = ${y} − ${m * x + b} = <b>${fmt(res)}</b>. (A positive answer means the point is above the line.)`) };
      },
      verify: (p) => p.y - (p.m * p.x + p.b) },
  ],
  items: [
    { id: 'sat-tv-001', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'association', facets: F,
      q: '<p>In a scatterplot of the age of used cars (in years) against their price, the points fall from upper left to lower right and lie close to a straight line. Which statement best describes the relationship?</p>',
      options: ['A strong negative linear association', 'A strong positive linear association', 'A weak positive association', 'No association'], answer: 0,
      sol: '<p>Falling from left to right: as age goes up, price goes down, so the association is negative. Points close to a line: strong and linear. Answer: <b>a strong negative linear association</b>.</p>' },
    { id: 'sat-tv-002', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'linear or exponential', facets: F,
      q: '<table class="qb-table"><tr><th><i>x</i></th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th><i>y</i></th><td>5</td><td>10</td><td>20</td><td>40</td></tr></table><p>Which kind of model fits the data in the table exactly?</p>',
      options: ['Exponential, because <i>y</i> doubles each time <i>x</i> increases by 1', 'Linear, because <i>y</i> increases by 5 each time', 'Linear, because <i>y</i> increases each time', 'Neither linear nor exponential'], answer: 0,
      sol: '<p>The differences are 5, 10, 20: not constant, so not linear. The ratios are 10/5 = 20/10 = 40/20 = 2: constant, so the data are <b>exponential</b>, <i>y</i> = 5 · 2<sup><i>x</i></sup>.</p>' },
  ],
};
