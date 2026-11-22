// LSAT · Logical Reasoning · Most strongly supported. Every passage is original and written for fibub.
const F = { section: 'lr', qtype: 'mss' };
const Q = 'The statements above, if true, most strongly support which one of the following?';
import { place } from './_util.js';
const it = (id, level, arg, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${Q}</p>`, options, answer, sol, trap });
export default {
  topic: 'most-strongly-supported',
  items: [
    it('lsat-ms-001', 2, 'In a study of two hundred gardens, the gardens that were mulched every spring used about a third less water over the summer than gardens that were not mulched, even though both groups grew similar plants in similar soil.',
      ['Mulching probably reduces the amount of water a garden needs.', 'Mulch is the cheapest way to save water.', 'All gardens should be mulched.', 'Unmulched gardens grow poorer plants.', 'Mulching has no effect on weeds.'], 0,
      '<p>The study compares similar gardens and finds mulched ones used less water. That gives good support to the modest claim that mulching probably reduces water need. {B} and {C} go far beyond the evidence.</p>', 'Prefer the cautious answer the facts support.'),
    it('lsat-ms-002', 3, 'The library extended its hours on weekdays to 9 p.m. Since then, the number of evening visitors has grown steadily, and most of them are adults who say they could not visit during the day because of work.',
      ['The extended hours have allowed some people who work during the day to use the library.', 'The library should open twenty-four hours a day.', 'The library\'s daytime visitors have fallen.', 'Most library users now come in the evening.', 'Adults read more than children.'], 0,
      '<p>Evening visitors grew, and most say they could not come during the day because of work. That strongly supports {A}. Nothing is said about daytime numbers ({C}) or the overall share of users ({D}).</p>', ''),
    it('lsat-ms-003', 4, 'Older trees in the forest produce far more seeds than younger ones. Squirrels in the forest bury many seeds and forget about some, which later sprout. In parts of the forest where older trees were cut down, fewer young trees have appeared in recent years.',
      ['Cutting down older trees may reduce the number of young trees that grow nearby.', 'Squirrels prefer seeds from older trees.', 'Young trees cannot grow without squirrels.', 'The forest will disappear within a century.', 'Older trees are healthier than younger ones.'], 0,
      '<p>Older trees supply most seeds, and where they were removed fewer young trees appeared. {A} states a reasonable link with the word "may". {C} and {D} are far too strong; {B} is never addressed.</p>', ''),
    it('lsat-ms-004', 5, 'A town replaced its streetlights with brighter LED lamps. Afterward, residents reported feeling safer walking at night, but the number of reported night-time crimes stayed the same. Residents also reported that the brighter lights made it harder to see the stars.',
      ['The new lamps changed how safe people felt more than they changed reported crime.', 'The new lamps reduced crime.', 'The town should remove the new lamps.', 'Crime is not affected by lighting in any town.', 'Most residents care more about stars than safety.'], 0,
      '<p>Feelings of safety rose while reported crime did not change, which supports {A}. {B} contradicts the data on reports. {D} generalises to every town. {C} and {E} are value judgements the passage does not make.</p>', ''),
  ],
};
