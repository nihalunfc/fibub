// SAT Math · Algebra · linear equations in one variable. All questions original (fibub).
import { int, nz, other, choose, shuffleOpts, fmt, frac, lin, term, v, usd, steps } from './_util.js';
const F = { section: 'math', domain: 'algebra' };
const X = v('x');

export default {
  topic: 'linear-equations',
  gens: [
    { id: 'sat-le-g01', type: 'nat', marks: 1, level: 1, exams: ['sat'], sub: 'solve', facets: F, format: 'numeric',
      make(r) {
        const x = nz(r, -9, 12), a = int(r, 2, 9), c = other(r, -6, 8, [a, 0]), b = int(r, -15, 15), d = a * x + b - c * x;
        return { q: `<p>${lin(a, b)} = ${lin(c, d)}</p><p>What value of ${X} is the solution to the equation above?</p>`,
          answer: x, tol: 0, a, b, c, d,
          sol: steps(`Get the ${X} terms on one side: subtract ${lin(c, 0)} from both sides to get ${lin(a - c, b)} = ${fmt(d)}.`,
            `Move the number: ${lin(a - c, 0)} = ${fmt(d)} ${b < 0 ? '+ ' + fmt(-b) : '− ' + fmt(b)} = ${fmt(d - b)}.`,
            `Divide by ${fmt(a - c)}: ${X} = <b>${fmt(x)}</b>. Check: both sides give ${fmt(a * x + b)}.`),
          trap: 'Moving a term across the equals sign without changing its sign.' };
      },
      verify: (p) => (p.d - p.b) / (p.a - p.c) },
    { id: 'sat-le-g02', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'expression value', facets: F, format: 'numeric',
      make(r) {
        const k = int(r, 2, 6), p = int(r, 1, 5), q = int(r, -9, 9), val = int(r, -8, 12), R = k * val;
        return { q: `<p>If ${lin(k * p, k * q)} = ${fmt(R)}, what is the value of ${lin(p, q)}?</p>`, answer: val, tol: 0, k, R,
          sol: steps(`Notice that ${lin(k * p, k * q)} is exactly ${k} times ${lin(p, q)}.`, `So ${k}(${lin(p, q)}) = ${fmt(R)}.`,
            `Divide both sides by ${k}: ${lin(p, q)} = <b>${fmt(val)}</b>. There is no need to find ${X} itself.`),
          trap: `Solving for ${X} and stopping there, when the question asks for an expression.` };
      },
      verify: (p) => p.R / p.k },
    { id: 'sat-le-g03', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'number of solutions', facets: F, format: 'single',
      make(r) {
        const a = int(r, 2, 6), b = int(r, 1, 6), k = int(r, 2, 4), kind = choose(r, ['none', 'many', 'one']);
        const lhs = `${k}(${lin(a, b)})`;
        const rhs = kind === 'many' ? lin(k * a, k * b) : kind === 'none' ? lin(k * a, k * b + nz(r, 1, 5)) : lin(k * a + nz(r, 1, 3), k * b);
        const right = { none: 'No solution', many: 'Infinitely many solutions', one: 'Exactly one solution' }[kind];
        const o = shuffleOpts(r, right, ['No solution', 'Infinitely many solutions', 'Exactly one solution', 'Exactly two solutions']);
        return { q: `<p>${lhs} = ${rhs}</p><p>How many solutions does the equation above have?</p>`, ...o,
          sol: steps(`Expand the left side: ${lhs} = ${lin(k * a, k * b)}.`,
            kind === 'many' ? `Both sides are the same expression, so every value of ${X} works: <b>infinitely many solutions</b>.`
              : kind === 'none' ? `Same ${X} term on both sides but different numbers. Subtracting ${lin(k * a, 0)} leaves a false statement like ${fmt(k * b)} = ${rhs.split(' ').pop()}: <b>no solution</b>.`
                : `The ${X} terms have different coefficients, so they do not cancel and you can solve for one value of ${X}: <b>exactly one solution</b>.`),
          trap: 'Deciding from the look of the equation before expanding the brackets.' };
      } },
    { id: 'sat-le-g04', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'fractions', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 2, 8), x = a * int(r, -6, 10), b = nz(r, -9, 9), c = x / a + b;
        return { q: `<p>${X}/${a} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fmt(c)}</p><p>What is the solution to the equation above?</p>`, answer: x, tol: 0, a, b, c,
          sol: steps(`${b < 0 ? 'Add' : 'Subtract'} ${Math.abs(b)} on both sides: ${X}/${a} = ${fmt(c - b)}.`, `Multiply both sides by ${a}: ${X} = <b>${fmt(x)}</b>.`) };
      },
      verify: (p) => (p.c - p.b) * p.a },
    { id: 'sat-le-g05', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'word problem', facets: F, format: 'numeric',
      make(r) {
        const job = choose(r, [['A plumber', 'hour', 'hours of work'], ['A tutor', 'session', 'sessions'], ['A moving company', 'hour', 'hours'], ['A dog walker', 'walk', 'walks']]);
        const fee = int(r, 3, 12) * 5, rate = int(r, 4, 18) * 5, n = int(r, 2, 9), T = fee + rate * n;
        return { q: `<p>${job[0]} charges a one-time fee of ${usd(fee)} plus ${usd(rate)} per ${job[1]}. A customer's total bill was ${usd(T)}. How many ${job[2]} did the customer pay for?</p>`, answer: n, tol: 0, fee, rate, T,
          sol: steps(`Write the equation: ${fee} + ${rate}${v('n')} = ${T}, where ${v('n')} is the number of ${job[2]}.`, `Subtract the fee: ${rate}${v('n')} = ${T - fee}.`, `Divide by ${rate}: ${v('n')} = <b>${n}</b>.`),
          trap: 'Dividing the whole bill by the rate and forgetting the one-time fee.' };
      },
      verify: (p) => (p.T - p.fee) / p.rate },
    { id: 'sat-le-g06', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'no solution', facets: F, format: 'numeric',
      make(r) {
        const k = int(r, 2, 9), b = int(r, 1, 9), c = other(r, -9, 9, [b]);
        return { q: `<p>In the equation ${v('a')}${X} ${term(b)} = ${lin(k, c)}, ${v('a')} is a constant. If the equation has no solution, what is the value of ${v('a')}?</p>`, answer: k, tol: 0, k,
          sol: steps(`A linear equation has no solution when the ${X} terms cancel but the numbers do not match.`, `The ${X} terms cancel only if the coefficients are equal: ${v('a')} = ${k}.`, `Then the equation becomes ${fmt(b)} = ${fmt(c)}, which is false, so there is no solution. ${v('a')} = <b>${k}</b>.`),
          trap: 'Setting the constants equal instead of the coefficients (that gives infinitely many solutions, not none).' };
      },
      verify: (p) => p.k },
    { id: 'sat-le-g07', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'brackets', facets: F, format: 'numeric',
      make(r) {
        const x = nz(r, -8, 10), a = int(r, 2, 5), b = nz(r, -6, 6), c = int(r, 2, 4), d = nz(r, -6, 6), e = other(r, -4, 7, [a - c, 0]);
        // a(x + b) - c(x + d) = e x + f
        const f = a * (x + b) - c * (x + d) - e * x;
        return { q: `<p>${a}(${lin(1, b)}) − ${c}(${lin(1, d)}) = ${lin(e, f)}</p><p>What value of ${X} satisfies the equation?</p>`, answer: x, tol: 0, a, b, c, d, e, f,
          sol: steps(`Expand, taking care with the minus sign in front of ${c}: ${lin(a, a * b)} ${term(-c, 'x')} ${term(-c * d)} = ${lin(e, f)}.`, `Collect: ${lin(a - c, a * b - c * d)} = ${lin(e, f)}.`, `So ${lin(a - c - e, 0)} = ${fmt(f - a * b + c * d)}, and ${X} = <b>${fmt(x)}</b>.`),
          trap: `Multiplying only the first term in the second bracket by −${c}.` };
      },
      verify: (p) => (p.f - p.a * p.b + p.c * p.d) / (p.a - p.c - p.e) },
    { id: 'sat-le-g08', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'solve for a variable', facets: F, format: 'single',
      make(r) {
        const s = choose(r, [
          ['P = 2l + 2w', 'w', '(P − 2l)/2', ['P − 2l', '(P − l)/2', '2(P − l)'], 'the perimeter of a rectangle'],
          ['A = (1/2)bh', 'h', '2A/b', ['A/(2b)', '2Ab', 'b/(2A)'], 'the area of a triangle'],
          ['C = 5(F − 32)/9', 'F', '9C/5 + 32', ['5C/9 + 32', '9(C − 32)/5', '9C/5 − 32'], 'Celsius from Fahrenheit'],
          ['d = rt', 't', 'd/r', ['dr', 'r/d', 'd − r'], 'distance, rate and time'],
          ['V = πr²h', 'h', 'V/(πr²)', ['Vπr²', 'πr²/V', 'V − πr²'], 'the volume of a cylinder'],
          ['y = mx + b', 'x', '(y − b)/m', ['(y + b)/m', 'y/m − b', 'm(y − b)'], 'a line'],
          ['I = Prt', 'r', 'I/(Pt)', ['IPt', 'Pt/I', 'I − Pt'], 'simple interest'],
        ]);
        const o = shuffleOpts(r, s[2], s[3]);
        return { q: `<p>The formula ${s[0]} gives ${s[4]}. Which of the following expresses ${v(s[1])} in terms of the other variables?</p>`, ...o,
          sol: `<p>Undo what is done to ${v(s[1])}, in reverse order, doing the same thing to both sides. The result is ${v(s[1])} = <b>${s[2]}</b>. Check by putting simple numbers into the original formula.</p>`,
          trap: 'Undoing the steps in the wrong order (for example dividing before subtracting).' };
      } },
  ],
  items: [
    { id: 'sat-le-001', type: 'mcq', marks: 1, level: 1, exams: ['sat'], sub: 'translate', facets: F,
      q: '<p>Seven more than three times a number <i>n</i> is 40. Which equation represents this situation?</p>',
      options: ['3<i>n</i> + 7 = 40', '3(<i>n</i> + 7) = 40', '7<i>n</i> + 3 = 40', '3<i>n</i> = 40 + 7'], answer: 0,
      sol: '<p>"Three times a number" is 3<i>n</i>; "seven more than" that adds 7: 3<i>n</i> + 7 = 40. Brackets would mean the 7 is added before multiplying, which the words do not say.</p>' },
    { id: 'sat-le-002', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'interpret', facets: F,
      q: '<p>A phone plan costs <i>C</i> dollars for a month in which <i>g</i> gigabytes of data are used, where <i>C</i> = 4.5<i>g</i> + 30. What is the best interpretation of 30 in this context?</p>',
      options: ['The monthly cost before any data is used', 'The cost of each gigabyte of data', 'The number of gigabytes included each month', 'The total cost for 4.5 gigabytes'], answer: 0,
      sol: '<p>Put <i>g</i> = 0: <i>C</i> = 30. So 30 dollars is what the month costs with no data used, the fixed part of the bill. The 4.5 is the cost per gigabyte.</p>' },
    { id: 'sat-le-003', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'decimals', facets: F,
      q: '<p>0.25<i>x</i> + 1.5 = 0.75<i>x</i> − 2.5</p><p>What is the value of <i>x</i>?</p>', answer: 8, tol: 0,
      sol: '<p>Multiply every term by 4 to clear decimals: <i>x</i> + 6 = 3<i>x</i> − 10. Then 16 = 2<i>x</i>, so <i>x</i> = <b>8</b>.</p>' },
    { id: 'sat-le-004', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'number of solutions', facets: F,
      q: '<p>In the equation 6(<i>x</i> − <i>k</i>) = 6<i>x</i> − 18, <i>k</i> is a constant. For which value of <i>k</i> does the equation have infinitely many solutions?</p>',
      options: ['3', '−3', '18', '6'], answer: 0,
      sol: '<p>Expand: 6<i>x</i> − 6<i>k</i> = 6<i>x</i> − 18. The sides are identical when 6<i>k</i> = 18, so <i>k</i> = <b>3</b>. Any other <i>k</i> gives no solution.</p>' },
    { id: 'sat-le-005', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'word problem', facets: F,
      q: '<p>A school spent &#36;1,680 on new chairs and tables. Each table cost &#36;90 and each chair cost &#36;30. The school bought 4 times as many chairs as tables. How many tables did it buy?</p>', answer: 8, tol: 0,
      sol: '<p>Let <i>t</i> be the number of tables, so there are 4<i>t</i> chairs. Cost: 90<i>t</i> + 30(4<i>t</i>) = 1,680, so 210<i>t</i> = 1,680 and <i>t</i> = <b>8</b>. Check: 8 tables (&#36;720) and 32 chairs (&#36;960) make &#36;1,680.</p>',
      trap: 'Letting t stand for chairs and answering with the number of chairs (32).' },
  ],
};
