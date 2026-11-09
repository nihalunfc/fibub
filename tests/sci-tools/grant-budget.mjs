// #822 grant budget. Checked against an independent NumPy implementation on 300 random budgets (worst difference
// 1.2e-10, the subaward cap done with cumulative minimums) and by hand below.
import { compute, parsePeople, parseLines, perYear, money, EXAMPLE } from '../../src/lib/sci/grantbudget.ts';
export default async (check) => {
  const p = parsePeople(EXAMPLE.people), l = parseLines(EXAMPLE.lines, 3);
  check('grant budget: example parses (header skipped, flags read)', p.errors.length === 0 && p.people.length === 3 && l.errors.length === 0 && l.lines.length === 6 && l.lines[4].flag === 'cap' && l.lines[5].flag === 'exclude' && p.people[2].effort.join() === '50,50,100');
  const r = compute({ years: 3, people: p.people, lines: l.lines, rates: [50], base: 'modified', excludeCats: ['equipment'], cap: 25000, round: true });
  // By hand: lead researcher year 2 = 90000 x 1.03 x 20 % = 18540, fringe 30 % = 5562.
  check('grant budget: salary with raise and effort, fringe', r.people[0].salary[1] === 18540 && r.people[0].fringe[1] === 5562 && r.people[2].salary[2] === 31212 && r.people[2].months[0] === 6);
  check('grant budget: totals per year', r.salaries.join() === '88000,90490,108658' && r.fringe.join() === '23400,24087,26355' && r.direct.join() === '179400,167077,157013');
  check('grant budget: modified base leaves out equipment, tuition and the subaward above 25000', r.base.join() === '147400,128077,148013' && r.indirect.join() === '73700,64039,74007' && r.total.join() === '253100,231116,231020' && r.sum(r.total) === 715236);
  const t = compute({ years: 3, people: p.people, lines: l.lines, rates: [50, 52, 54], base: 'tdc', excludeCats: [], cap: null, round: false });
  check('grant budget: total direct cost base with a rate per year', Math.abs(t.indirect[2] - t.direct[2] * 0.54) < 1e-9 && t.base.every((b, y) => b === t.direct[y]));
  const s = compute({ years: 3, people: p.people, lines: l.lines, rates: [40], base: 'salaries', excludeCats: [], cap: null, round: true });
  const sf = compute({ years: 3, people: p.people, lines: l.lines, rates: [40], base: 'salfringe', excludeCats: [], cap: null, round: true });
  const no = compute({ years: 3, people: p.people, lines: l.lines, rates: [40], base: 'none', excludeCats: [], cap: null, round: true });
  check('grant budget: salary, salary+fringe and no-indirect bases', s.indirect[0] === 35200 && sf.indirect[0] === 44560 && no.indirect.every((x) => x === 0) && no.total.join() === no.direct.join());
  const cap = compute({ years: 3, people: [], lines: [{ category: 'other', name: 'Sub', amounts: [10000, 20000, 5000], flag: 'cap' }], rates: [10], base: 'modified', excludeCats: [], cap: 25000, round: true });
  check('grant budget: cap counts only the first 25000 over all years', cap.base.join() === '10000,15000,0');
  check('grant budget: per-year lists stretch', perYear([5], 3).join() === '5,5,5' && perYear([5, 6], 4).join() === '5,6,6,6');
  check('grant budget: money cells', money('$52 000') === 52000 && money('15%') === 15 && money('CAD1200') === 1200 && Number.isNaN(money('')) && Number.isNaN(money('52,000')));
  const bad = parsePeople('Tech, abc, 50\nPI, 80000, 150\nPD, 50000, 50, 30, 3');
  check('grant budget: personnel errors', bad.errors.length === 2 && bad.errors[0].includes('salary') && bad.errors[1].includes('effort') && bad.people.length === 1);
  const bl = parseLines('travel, Trip, 100, 200, 300, 400\nfood, Pizza, 5\nequipment, Thing, -5\nconsumables, Tips, 100', 3);
  check('grant budget: cost line errors and notes', bl.errors.length === 3 && bl.errors[0].includes('4 yearly amounts') && bl.errors[1].includes('category') && bl.lines.length === 1 && bl.notes[0].includes('year 1') === false && bl.notes[0].includes('year 2 to 3'));
};
