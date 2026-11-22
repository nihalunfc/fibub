import { int, pick, choose, fmt, numOpts, steps } from './_q.js';
export default {
  topic: 'mental-maths',
  items: [
    { id: 'mm-001', type: 'mcq', level: 1, exams: ['gmat', 'gre'], sub: 'estimation',
      q: '<p>Which is closest to 49.7 × 20.3?</p>', options: ['100', '500', '1,000', '5,000', '10,000'], answer: 2,
      sol: '<p>Round: 49.7 ≈ 50 and 20.3 ≈ 20, so the product is about 50 × 20 = 1,000. The real value is 1,008.91.</p>', trap: 'Counting zeros wrongly gives 100 or 10,000.' },
    { id: 'mm-002', type: 'mcq', level: 2, exams: ['gmat', 'gre'], sub: 'fractions',
      q: '<p>Which is the largest?</p>', options: ['5/8', '3/5', '7/12', '2/3', '9/14'], answer: 3,
      sol: '<p>As decimals: 5/8 = 0.625, 3/5 = 0.6, 7/12 ≈ 0.583, 2/3 ≈ 0.667, 9/14 ≈ 0.643. The largest is 2/3.</p>', trap: 'Picking the fraction with the biggest numbers (9/14).' },
    { id: 'mm-003', type: 'mcq', level: 2, exams: ['gmat', 'gre'], sub: 'percent',
      q: '<p>What is 35% of 240?</p>', options: ['72', '78', '84', '90', '96'], answer: 2,
      sol: '<p>10% of 240 is 24, so 30% is 72 and 5% is 12. 35% = 72 + 12 = 84.</p>' },
    { id: 'mm-004', type: 'mcq', level: 2, exams: ['gmat', 'gre'], sub: 'squares',
      q: '<p>What is 45<sup>2</sup>?</p>', options: ['1,825', '2,025', '2,125', '2,225', '2,425'], answer: 1,
      sol: '<p>A number ending in 5: multiply the tens digit by the next number (4 × 5 = 20) and write 25 after it: 2,025.</p>' },
  ],
  gens: [
    { id: 'mm-g01', type: 'mcq', level: 1, exams: ['gmat', 'gre'], sub: 'percent',
      make(r) {
        const p = choose(r, [5, 15, 25, 35, 45, 55, 65, 75]), n = pick(r, 40, 880, 20), value = (p * n) / 100;
        const tens = Math.floor(p / 10) * 10;
        return { q: `<p>What is ${p}% of ${fmt(n)}? (Work it out without a calculator.)</p>`, ...numOpts(r, value, [value * 10, (p - 5) * n / 100, n / p]), value, p, n,
          hint: 'Find 10% by moving the decimal point one place, then 5% as half of that.',
          sol: steps(`10% of ${fmt(n)} is ${fmt(n / 10)}, so ${tens}% is ${fmt((tens * n) / 100)}.`, `5% is half of 10%: ${fmt(n / 20)}.`, `${p}% = ${fmt((tens * n) / 100)} + ${fmt(n / 20)} = <b>${fmt(value)}</b>.`) };
      }, check: (p) => (p.p / 100) * p.n },
    { id: 'mm-g02', type: 'mcq', level: 1, exams: ['gmat', 'gre'], sub: 'multiplication',
      make(r) {
        const a = int(r, 12, 19), b = int(r, 11, 19), value = a * b;
        return { q: `<p>What is ${a} × ${b}?</p>`, ...numOpts(r, value, [value + 10, value - 10, a * 10 + b]), value, a, b,
          hint: `Split one number: ${a} × ${b} = ${a} × 10 + ${a} × ${b - 10}.`,
          sol: steps(`${a} × 10 = ${a * 10}.`, `${a} × ${b - 10} = ${a * (b - 10)}.`, `Add: ${a * 10} + ${a * (b - 10)} = <b>${value}</b>.`) };
      }, check: (p) => p.a * p.b },
    { id: 'mm-g03', type: 'mcq', level: 2, exams: ['gmat', 'gre'], sub: 'squares',
      make(r) {
        const m = int(r, 3, 9) * 10, d = choose(r, [1, 2, 3]), s = choose(r, [1, -1]), a = m + s * d, value = a * a;
        return { q: `<p>What is ${a}<sup>2</sup>?</p>`, ...numOpts(r, value, [m * m + d * d, m * m - d * d, value + 10]), value, a,
          hint: `Write ${a} as ${m} ${s > 0 ? '+' : '−'} ${d} and use (a ${s > 0 ? '+' : '−'} b)² = a² ${s > 0 ? '+' : '−'} 2ab + b².`,
          sol: steps(`${a} = ${m} ${s > 0 ? '+' : '−'} ${d}.`, `${m}² = ${m * m}; 2 × ${m} × ${d} = ${2 * m * d}; ${d}² = ${d * d}.`, `${m * m} ${s > 0 ? '+' : '−'} ${2 * m * d} + ${d * d} = <b>${value}</b>.`) };
      }, check: (p) => p.a * p.a },
    { id: 'mm-g04', type: 'mcq', level: 2, exams: ['gmat', 'gre'], sub: 'division',
      make(r) {
        const d = choose(r, [4, 5, 8, 12, 15, 25]), qn = int(r, 14, 96), n = d * qn;
        return { q: `<p>What is ${fmt(n)} ÷ ${d}?</p>`, ...numOpts(r, qn, [qn * 10, qn + d, qn - 1]), value: qn, n, d,
          hint: d === 25 ? 'Dividing by 25 is the same as multiplying by 4 and dividing by 100.' : d === 5 || d === 15 ? 'Double both numbers first: dividing by 5 becomes dividing by 10.' : 'Halve both numbers again and again until the division is easy.',
          sol: steps(`Check by multiplying back: ${d} × ${qn} = ${fmt(n)}.`, `So ${fmt(n)} ÷ ${d} = <b>${qn}</b>.`) };
      }, check: (p) => p.n / p.d },
  ],
};
