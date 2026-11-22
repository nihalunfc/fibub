// LSAT · Logical Reasoning · Must be true (inference). Every passage is original and written for fibub.
const F = { section: 'lr', qtype: 'must-be-true' };
const Q = 'If the statements above are true, which one of the following must also be true?';
import { place } from './_util.js';
const it = (id, level, arg, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${Q}</p>`, options, answer, sol, trap });
export default {
  topic: 'inference-must-be-true',
  items: [
    it('lsat-mt-001', 2, 'Every bakery on Oak Street opens before 7 a.m. Rosa\'s shop opens at 8 a.m.',
      ['Rosa\'s shop is not a bakery on Oak Street.', 'Rosa\'s shop is not a bakery.', 'Rosa\'s shop is not on Oak Street.', 'Most shops on Oak Street open early.', 'Rosa\'s shop sells bread.'], 0,
      '<p>Bakery on Oak Street → opens before 7. Rosa\'s opens at 8, so it is not a bakery on Oak Street (contrapositive). It could be a bakery elsewhere (so {B} need not be true), or a non-bakery on Oak Street (so {C} need not be true).</p>', 'The contrapositive keeps both parts together.'),
    it('lsat-mt-002', 3, 'At the conference, every speaker gave exactly one talk, on either Monday or Tuesday. All the talks on Tuesday were about climate. Dr. Ito, one of the speakers, gave a talk that was not about climate.',
      ['Dr. Ito gave a talk on Monday.', 'All the talks on Monday were about subjects other than climate.', 'Dr. Ito is not a climate scientist.', 'More talks were given on Tuesday than on Monday.', 'Most speakers talked about climate.'], 0,
      '<p>Every Tuesday talk was about climate, so Dr. Ito\'s talk was not on Tuesday. Every speaker spoke on Monday or Tuesday, so Dr. Ito spoke on Monday. {B} need not be true: climate talks could happen on Monday too. {C} is about Dr. Ito\'s job, which the passage never mentions.</p>', 'Tuesday talks are all climate talks, but that does not make every climate talk a Tuesday talk.'),
    it('lsat-mt-003', 3, 'No one who works the night shift can attend the morning training. Some of the warehouse staff work the night shift.',
      ['Some warehouse staff cannot attend the morning training.', 'Most warehouse staff cannot attend the morning training.', 'No warehouse staff attend the morning training.', 'Everyone who attends the morning training works days.', 'Some people who attend the morning training work in the warehouse.'], 0,
      '<p>The warehouse staff who work nights cannot attend the morning training, so at least some warehouse staff cannot attend. {B} and {C} go too far. {D} assumes everyone works either nights or days. {E} may be true but need not be.</p>', ''),
    it('lsat-mt-004', 4, 'The cafe sold more muffins in March than in February. In both months, it sold every muffin it baked, and it baked the same number each day it was open. The cafe was open the same number of days in each month.',
      ['The cafe baked more muffins per day in March than in February.', 'The cafe made more money in March than in February.', 'Muffins were more popular in March.', 'The cafe raised its prices in March.', 'The cafe will sell more muffins in April.'], 0,
      '<p>Sold = baked (every muffin sold). Each month, baked = days open × muffins per day. Days open were equal, and March sales were higher, so March\'s daily batch must have been bigger than February\'s. The passage says nothing about money, prices or popularity.</p>', 'Read "the same number each day" as "within each month"; the daily number can differ between months.'),
    it('lsat-mt-005', 5, 'Only members of the hiking club may join the glacier trip. Every member of the hiking club has completed a first aid course. Some people who have completed a first aid course are lifeguards.',
      ['Everyone on the glacier trip has completed a first aid course.', 'Some people on the glacier trip are lifeguards.', 'Every lifeguard is a member of the hiking club.', 'Some hiking club members are lifeguards.', 'Everyone who has completed first aid may join the glacier trip.'], 0,
      '<p>Glacier trip → hiking club member → first aid. So everyone on the trip has first aid ({A}). The lifeguard statement uses "some" and attaches to first aid, not to club members, so {B} and {D} need not be true. {C} and {E} reverse the arrows.</p>', ''),
  ],
};
