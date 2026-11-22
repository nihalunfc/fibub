// LSAT · Logical Reasoning · Point at issue (disagree / agree). Every dialogue is original and written for fibub.
const F = { section: 'lr', qtype: 'point-at-issue' };
import { place } from './_util.js';
const it = (id, level, arg, ask, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${ask}</p>`, options, answer, sol, trap });
const D = (a, b) => `The dialogue provides the most support for the claim that ${a} and ${b} disagree over whether`;
export default {
  topic: 'point-at-issue',
  items: [
    it('lsat-pi-001', 2, 'Omar: Our town should build a public pool. Swimming is excellent exercise, and many families cannot afford private clubs.<br>Beth: A pool would cost far more to run each year than the town can afford. The town should not build one.', D('Omar', 'Beth'),
      ['swimming is good exercise', 'the town should build a public pool', 'many families cannot afford private clubs', 'the pool would be expensive to build', 'exercise is important'], 1,
      '<p>Omar says the town should build a pool; Beth says it should not. Beth never challenges the exercise or affordability points, so we cannot say they disagree about those.</p>', 'A correct answer needs a view from both speakers.'),
    it('lsat-pi-002', 3, 'Ines: Remote work raises productivity, since workers save time on commuting.<br>Paul: Saving time on commuting is real, but many remote workers are interrupted more at home, so overall productivity does not rise.', D('Ines', 'Paul'),
      ['remote workers save time on commuting', 'remote work raises productivity', 'remote workers are interrupted at home', 'commuting is tiring', 'offices should close'], 1,
      '<p>Paul agrees that commuting time is saved ("is real") but denies that productivity rises. Ines claims it rises. So they disagree over {B} and agree on {A}.</p>', 'Watch for concessions: Paul agrees with {A}.'),
    it('lsat-pi-003', 4, 'Critic: The novel\'s ending is weak because it leaves the main mystery unsolved.<br>Writer: An unsolved mystery can be a strength. It leaves readers thinking about the story long after they finish it, which is what makes this ending powerful.', D('the critic', 'the writer'),
      ['the novel leaves the main mystery unsolved', 'the novel\'s ending is weak', 'readers think about the story after finishing it', 'all novels should solve their mysteries', 'the novel is popular'], 1,
      '<p>Both accept that the mystery is unsolved. The critic says this makes the ending weak; the writer says it makes the ending powerful. They disagree over whether the ending is weak. {D} goes beyond what the critic said about this novel.</p>', ''),
    it('lsat-pi-004', 5, 'Lena: The study proves that the reading programme works: children in it read better after a year.<br>Marco: Children read better after any year of school. Without a comparison group, the study does not show the programme made a difference, though it may well have.', D('Lena', 'Marco'),
      ['children in the programme read better after a year', 'the study shows that the reading programme made a difference', 'the reading programme does not work', 'children read better after a year of school', 'a comparison group is impossible to arrange'], 1,
      '<p>Marco accepts that the children improved and even says the programme "may well" have worked. He denies only that the study shows it. Lena says the study proves it. So they disagree over {B}. {C} is a trap: Marco never says the programme fails.</p>', ''),
  ],
};
