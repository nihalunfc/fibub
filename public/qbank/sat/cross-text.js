// SAT Reading and Writing · Craft and structure · cross-text connections. Original paired passages (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'craft' };
const it = (id, level, sub, t1, t2, ask, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p><b>Text 1</b><br>${t1}</p><p><b>Text 2</b><br>${t2}</p><p>${ask}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'cross-text',
  items: [
    it('sat-ct-001', 3, 'response', 'Many researchers argue that four-day school weeks hurt learning, since students spend fewer hours in class.', 'A study of rural districts that switched to four-day weeks found that test scores stayed about the same, perhaps because longer school days made up much of the lost time, and teacher absences fell.', 'Based on the texts, how would the author of Text 2 most likely respond to the researchers in Text 1?',
      ['By pointing out that, at least in some districts, the shorter week did not lower test scores', 'By agreeing that four-day weeks clearly harm learning', 'By arguing that students should attend school on weekends', 'By claiming that teacher absences have no effect on learning'],
      '<p>Text 1 predicts harm. Text 2 reports a case where scores did not fall. So Text 2\'s author would answer with that evidence. Agreeing contradicts Text 2.</p>'),
    it('sat-ct-002', 4, 'shared view', 'Some historians credit the invention of the shipping container in the 1950s with making world trade cheap: goods no longer had to be loaded crate by crate.', 'Shipping containers mattered, but they worked only because ports, cranes, trucks and railways were rebuilt to the same standard sizes. Without that shared system, a container would have been just another box.', 'Based on the texts, the authors of both texts would most likely agree with which statement?',
      ['Shipping containers played a part in making trade cheaper.', 'Shipping containers alone explain the fall in trade costs.', 'Standard sizes for cranes and trucks were unimportant.', 'Goods were cheaper to ship before the 1950s.'],
      '<p>Text 1 credits containers; Text 2 says they "mattered" but needed a whole system. Both agree containers played a part. Text 2 rejects the second option, and neither text supports the last two.</p>', 'Choosing a view only one of the texts holds.'),
  ],
};
