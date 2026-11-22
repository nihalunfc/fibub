// LSAT · Logical Reasoning · Evaluate ("most useful to know"). Every argument is original and written for fibub.
const F = { section: 'lr', qtype: 'evaluate' };
const Q = 'Which one of the following would be most useful to know in order to evaluate the argument?';
import { place } from './_util.js';
const it = (id, level, arg, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${Q}</p>`, options, answer, sol, trap });
export default {
  topic: 'evaluate',
  items: [
    it('lsat-ev-001', 2, 'Since the school started serving breakfast, students\' morning test scores have risen. So the breakfast programme is improving students\' performance.',
      ['Whether the breakfasts are healthy.', 'Whether anything else that could raise morning scores, such as a later start time, changed when the programme began.', 'How much the programme costs.', 'Whether students like the food.', 'How many schools in the country serve breakfast.'], 1,
      '<p>Good evaluate answers have two answers that point in opposite directions. If something else changed at the same time, the argument is weaker; if nothing did, it is stronger. The other questions do not affect whether breakfast caused the rise.</p>', ''),
    it('lsat-ev-002', 3, 'A company plans to cut costs by replacing its call centre staff with an automated phone system. The system costs less per call than human staff.',
      ['Whether the automated system can be updated easily.', 'Whether customers who cannot get help from the automated system would call back repeatedly or switch to the more costly in-person help desk.', 'How long the call centre has been open.', 'Whether other companies use automated systems.', 'Whether the call centre staff would find other jobs.'], 1,
      '<p>The plan is about total cost. A lower cost per call could be outweighed if the system creates many extra calls or pushes people to a more expensive channel. Knowing whether that happens tells you whether the plan saves money.</p>', ''),
    it('lsat-ev-003', 3, 'Doctor: Patients who took the new sleep medicine reported falling asleep twenty minutes faster on average. So the medicine works.',
      ['Whether the medicine has a pleasant taste.', 'Whether patients given an identical-looking pill with no active ingredient also reported falling asleep faster.', 'How much the medicine costs.', 'Whether the patients slept in their own beds.', 'Whether the medicine is sold in other countries.'], 1,
      '<p>Believing you took a sleep pill can by itself help you fall asleep. If the placebo group improved just as much, the medicine adds nothing; if they did not, the argument gets much stronger.</p>', ''),
    it('lsat-ev-004', 4, 'Town council: Our new free shuttle to the downtown shops has been running for six months, and downtown shop sales have risen ten percent. So the shuttle has helped downtown businesses.',
      ['How many seats the shuttle has.', 'How sales changed over the same six months at shops in similar towns that have no shuttle.', 'Whether the shuttle drivers are town employees.', 'Whether the shuttle runs on weekends.', 'How many people in the town own cars.'], 1,
      '<p>Comparing with similar towns separates the shuttle\'s effect from a general rise (a holiday season or a good economy). If those towns also rose ten percent, the shuttle may have done nothing.</p>', ''),
    it('lsat-ev-005', 5, 'Columnist: Cities that ban single-use plastic bags see far fewer bags littering their streets. But such bans also lead shoppers to buy more plastic bin liners, which are thicker. So bag bans do not reduce the total amount of plastic people use.',
      ['Whether bin liners are more expensive than shopping bags.', 'Whether the extra plastic in the bin liners people buy is greater than the plastic in the shopping bags no longer used.', 'Whether littered bags harm wildlife.', 'Whether most shoppers support the bans.', 'Whether paper bags are recyclable.'], 1,
      '<p>The conclusion is about the total amount of plastic. That depends on a comparison: plastic saved from bags versus plastic added in liners. {B} asks exactly that. The other options are about cost, wildlife or opinion, not total plastic.</p>', ''),
    it('lsat-ev-101', 2, 'A bakery started offering free coffee with every pastry, and pastry sales rose by a third the next month. The owner concludes that the free coffee caused the rise.',
      ['Whether pastry sales usually rise at that time of year', 'Whether the bakery’s coffee is made from fair-trade beans', 'How many kinds of pastry the bakery sells', 'Whether the owner also drinks coffee', 'How long the bakery has been open'], 0,
      '<p>If sales always jump that month (a holiday season, say), the rise may have nothing to do with coffee. If not, the coffee explanation gains support. {A} cuts both ways, which is what an evaluate answer should do.</p>'),
    it('lsat-ev-102', 3, 'Manager: Employees who completed our optional training course have had fewer workplace injuries than those who did not. So the course makes employees safer.',
      ['Whether the employees who chose the course work in less dangerous jobs than those who did not', 'How much the course cost the company', 'Whether the course is taught in the morning or afternoon', 'How many employees the company has in total', 'Whether employees enjoyed the course'], 0,
      '<p>The course was optional. If people in safer jobs took it, the difference may reflect the job, not the course. Knowing {A} tells us whether that alternative holds.</p>'),
    it('lsat-ev-103', 4, 'Since the city lowered the speed limit on residential streets, the number of pedestrians injured on those streets has fallen. The lower limit is therefore working.',
      ['Whether the number of people walking on residential streets has changed since the limit was lowered', 'Whether drivers support the lower limit', 'How much the new signs cost', 'Whether other cities have lowered their limits', 'Whether the limit applies at night'], 0,
      '<p>Fewer injuries could just mean fewer pedestrians. If walking has stayed steady or risen, the drop supports the limit; if walking fell, it does not. {A}.</p>'),
    it('lsat-ev-104', 5, 'Archaeologist: Pottery found at the site is decorated in a style typical of a people who lived two hundred kilometres away. Therefore, members of that people must have lived at the site.',
      ['Whether pottery in that style was commonly traded over long distances', 'Whether the pottery is broken or whole', 'How many pieces of pottery were found at the site', 'What colour the pottery is', 'Whether the site was occupied in winter'], 0,
      '<p>If such pottery was traded widely, it could arrive without its makers; if it was rarely traded, the conclusion is stronger. {A}. {C} matters less: even many pieces could be traded goods.</p>'),
  ],
};
