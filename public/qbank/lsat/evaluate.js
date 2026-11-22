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
  ],
};
