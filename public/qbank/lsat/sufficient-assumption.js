// LSAT · Logical Reasoning · Sufficient assumption ("if assumed, the conclusion follows"). Original, written for fibub.
const F = { section: 'lr', qtype: 'sufficient-assumption' };
const Q = 'The conclusion of the argument follows logically if which one of the following is assumed?';
import { place } from './_util.js';
const it = (id, level, arg, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${Q}</p>`, options, answer, sol, trap });
export default {
  topic: 'sufficient-assumption',
  items: [
    it('lsat-sa-001', 2, 'Every plant in the greenhouse is watered daily. So every plant in the greenhouse will survive the summer.',
      ['Some plants that are watered daily survive the summer.', 'Any plant that is watered daily will survive the summer.', 'Plants outside the greenhouse are not watered daily.', 'Only plants that are watered daily survive the summer.', 'Most plants in the greenhouse are hardy.'], 1,
      '<p>Premise: greenhouse plant → watered daily. Conclusion: greenhouse plant → survives. The missing link is watered daily → survives, which is {B}. Add it and the chain is complete. {D} reverses it (survives → watered daily) and does not complete the chain.</p>',
      'Picking the reversed link: "only X" means the arrow points to X.'),
    it('lsat-sa-002', 3, 'No one who has been convicted of fraud can serve on the board. Lena has been convicted of fraud. Therefore, Lena cannot be the treasurer of the club.',
      ['The club\'s treasurer must be someone who can serve on the board.', 'Some board members have been convicted of fraud.', 'Lena wants to be the treasurer of the club.', 'Anyone who can serve on the board can be treasurer.', 'The treasurer is chosen by the board.'], 0,
      '<p>Chain: Lena → convicted → cannot serve on the board. We need: cannot serve on the board → cannot be treasurer, or in its contrapositive form treasurer → can serve on the board. That is {A}. {D} reverses the link and would not guarantee the conclusion.</p>', ''),
    it('lsat-sa-003', 3, 'All the paintings in the east gallery were made before 1900. Therefore, none of the paintings in the east gallery are by Ortega.',
      ['Ortega made some paintings before 1900.', 'Ortega made no paintings before 1900.', 'Most paintings made before 1900 are in the east gallery.', 'Some paintings by Ortega are in the west gallery.', 'All paintings by Ortega were made after 1850.'], 1,
      '<p>East gallery → before 1900. To reach "not Ortega", we need before 1900 → not Ortega, which is the same as "Ortega made no paintings before 1900". With {B}, any east-gallery painting is pre-1900 and so not by Ortega. {E} allows Ortega paintings from 1850 to 1899.</p>', ''),
    it('lsat-sa-004', 4, 'Council member: The new recycling plant will create jobs and reduce landfill costs. Any project that does both of those things deserves public funding, provided it does not harm the environment. So the recycling plant deserves public funding.',
      ['Most voters support the recycling plant.', 'The recycling plant will not harm the environment.', 'Landfill costs are rising every year.', 'Projects that harm the environment never create jobs.', 'The recycling plant will create more jobs than any other project.'], 1,
      '<p>The principle has a condition attached: "provided it does not harm the environment". The premises establish jobs and lower costs but say nothing about harm. Assuming {B} fills the last condition, and the conclusion then follows with certainty.</p>',
      'Watch for an extra condition hidden in a "provided that" or "as long as" clause.'),
    it('lsat-sa-005', 4, 'Anyone who reads the safety manual will know how to shut down the press in an emergency. Every new employee at the plant must attend the orientation session. Therefore, every new employee will know how to shut down the press in an emergency.',
      ['Some people who attend orientation read the safety manual.', 'Everyone who attends the orientation session reads the safety manual.', 'Everyone who reads the safety manual attends orientation.', 'The orientation session is the only place to learn how to shut down the press.', 'Most emergencies at the plant involve the press.'], 1,
      '<p>Chain: new employee → attends orientation; reads manual → knows shutdown. The gap is attends orientation → reads manual. {B} supplies exactly that: new employee → orientation → reads manual → knows shutdown. {C} has the arrow backwards.</p>', ''),
    it('lsat-sa-006', 5, 'Philosopher: An action is praiseworthy only if the person who performs it could have chosen otherwise. A being whose every act is fixed in advance by the laws of physics could never have chosen otherwise. Hence no human action is praiseworthy.',
      ['Some human actions are not fixed in advance by the laws of physics.', 'Every human act is fixed in advance by the laws of physics.', 'An action is praiseworthy if the person could have chosen otherwise.', 'Beings whose acts are not fixed by physics can always choose otherwise.', 'Most people believe that human actions can be praiseworthy.'], 1,
      '<p>Praiseworthy → could have chosen otherwise. Fixed by physics → could not have chosen otherwise. To conclude that no human action is praiseworthy, we need humans to be beings whose every act is fixed ({B}). Then every human act fails the "could have chosen otherwise" test, so none is praiseworthy. {C} reverses the first rule and does no work here.</p>',
      'The premises talk about "a being whose every act is fixed"; the conclusion is about humans. The answer must connect the two.'),
  ],
};
