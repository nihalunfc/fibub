import { int, choose, fmt, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'sets',
  items: [
    { id: 'st-001', type: 'mcq', level: 2, exams: E, sub: 'two sets',
      q: '<p>Of 50 students, 30 study French, 25 study Spanish and 8 study neither. How many study both?</p>', options: ['3', '5', '8', '13', '17'], answer: 3,
      sol: '<p>Students studying at least one language: 50 − 8 = 42. French + Spanish counts the "both" group twice: 30 + 25 − both = 42, so both = 13.</p>' },
    { id: 'st-002', type: 'mcq', level: 3, exams: E, sub: 'max min',
      q: '<p>In a group of 40 people, 28 own a car and 22 own a bike. What is the least possible number who own both?</p>', options: ['0', '6', '10', '18', '22'], answer: 2,
      sol: '<p>The overlap is smallest when nobody owns neither: 28 + 22 − both = 40 gives both = 10. Fewer than 10 would need more than 40 people.</p>' },
  ],
  gens: [
    { id: 'st-g01', type: 'mcq', level: 2, exams: E, sub: 'two sets', title: 'overlapping groups',
      make(r) {
        const both = int(r, 3, 25), onlyA = int(r, 5, 40), onlyB = int(r, 5, 40), neither = int(r, 0, 20), total = both + onlyA + onlyB + neither;
        const A = both + onlyA, B = both + onlyB, value = both;
        return { q: `<p>In a survey of ${total} shoppers, ${A} used a coupon, ${B} paid by phone and ${neither} did neither. How many shoppers both used a coupon and paid by phone?</p>`, ...numOpts(r, value, [A + B - total, total - A - B + neither > 0 ? total - A - B + neither : value + 3, neither].filter((x) => x > 0 && x !== value)), value, total, A, B, neither,
          hint: 'Total = A + B − both + neither.',
          sol: steps(`At least one: ${total} − ${neither} = ${total - neither}.`, `A + B = ${A + B} counts "both" twice.`, `Both = ${A + B} − ${total - neither} = <b>${value}</b>.`), trap: `Forgetting the ${neither} who did neither gives ${A + B - total}.` };
      }, check: (p) => p.A + p.B + p.neither - p.total },
    { id: 'st-g02', type: 'mcq', level: 3, exams: E, sub: 'table', title: 'fill the double-set table',
      make(r) {
        const total = int(r, 10, 40) * 10, pm = choose(r, [40, 45, 50, 55, 60, 65, 70]), pYesGivenM = choose(r, [20, 25, 30, 40, 50, 60]), yesTotal = choose(r, [30, 35, 40, 45, 50]);
        const M = (total * pm) / 100, yesM = (M * pYesGivenM) / 100, yes = (total * yesTotal) / 100, yesF = yes - yesM, F = total - M;
        if (!Number.isInteger(M) || !Number.isInteger(yesM) || !Number.isInteger(yes) || yesF < 0 || yesF > F) return this.make(r);
        const value = F - yesF;
        return { q: `<p>Of ${total} employees, ${pm}% work in the morning shift and the rest in the evening shift. ${pYesGivenM}% of the morning-shift workers and ${yesTotal}% of all employees joined a training course. How many evening-shift workers did not join the course?</p>`, ...numOpts(r, value, [yesF, F, total - yes].filter((x) => x !== value && x > 0)), value, total, M, yesM, yes,
          hint: 'Draw a 2 × 2 table: shift down the side, course yes/no across the top, totals in the margins.',
          sol: steps(`Morning: ${pm}% of ${total} = ${M}; evening: ${F}.`, `Joined: morning ${pYesGivenM}% of ${M} = ${yesM}; all ${yesTotal}% of ${total} = ${yes}; so evening joined ${yes} − ${yesM} = ${yesF}.`, `Evening not joined: ${F} − ${yesF} = <b>${value}</b>.`) };
      }, check: (p) => (p.total - p.M) - (p.yes - p.yesM) },
  ],
};
