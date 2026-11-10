// #1211 fair-test-planner: only the plan that changes the question's factor alone and measures the right thing is
// fair; two changes, no change or a wrong measure are flagged; averages checked by hand.
import { INVESTIGATIONS, assess, mean, range } from '../../src/lib/sci/learnj-fairtest.ts';
export default async (check) => {
  for (const inv of INVESTIGATIONS) {
    const same = Object.fromEntries(inv.factors.map((f) => [f.id, 'same']));
    const right = { ...same, [inv.change]: 'change' };
    check(`fair test ${inv.id}: right plan is fair`, assess({ inv, roles: right, measure: 0, repeats: 3 }).fair);
    check(`fair test ${inv.id}: nothing changed is not fair`, !assess({ inv, roles: same, measure: 0, repeats: 3 }).fair);
    const other = inv.factors.find((f) => f.id !== inv.change).id;
    const two = assess({ inv, roles: { ...right, [other]: 'change' }, measure: 0, repeats: 3 });
    check(`fair test ${inv.id}: two changes flagged`, !two.fair && two.problems[0].includes('2 things change'));
    check(`fair test ${inv.id}: wrong single change flagged`, !assess({ inv, roles: { ...same, [other]: 'change' }, measure: 0, repeats: 3 }).fair);
    check(`fair test ${inv.id}: wrong measure flagged`, !assess({ inv, roles: right, measure: 1, repeats: 3 }).fair);
    check(`fair test ${inv.id}: one repeat still fair, with advice`, assess({ inv, roles: right, measure: 0, repeats: 1 }).good.some((g) => g.includes('3 repeats')));
  }
  check('fair test: mean 42,45,40 = 42.333', Math.abs(mean([42, 45, 40]) - 127 / 3) < 1e-12);
  check('fair test: range ignores blanks', range([14, NaN, 16, 15]) === 2);
  check('fair test: mean of nothing is NaN', Number.isNaN(mean([NaN])));
};
