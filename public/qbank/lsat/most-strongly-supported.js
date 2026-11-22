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
    it('lsat-ms-101', 2, 'In a survey of a town’s residents, those who lived within a kilometre of the new library visited it far more often than those who lived farther away. The library has no parking lot, and no bus route passes near it.',
      ['Ease of reaching the library on foot may influence how often residents visit it.', 'Residents who live far away dislike libraries.', 'The library will build a parking lot.', 'All residents near the library visit it every week.', 'The town has no other library.'], 0,
      '<p>With no parking or bus, walking distance plausibly matters. {A} is cautious ("may") and fits. The others go well beyond the facts.</p>'),
    it('lsat-ms-102', 3, 'A species of bird nests only in old trees with hollow trunks. Over the past thirty years, logging has removed most of the old trees in the region, and the number of nesting pairs of the bird there has fallen sharply.',
      ['The loss of old trees has probably contributed to the decline of the bird in the region.', 'The bird will soon be extinct everywhere.', 'Logging should be banned in the region.', 'The bird cannot survive anywhere without old trees.', 'All old trees in the region have hollow trunks.'], 0,
      '<p>The bird needs old hollow trees, and those trees disappeared as the bird declined. {A} is supported. {B} and {C} go far beyond the region or into recommendations.</p>'),
    it('lsat-ms-103', 4, 'When a supermarket moved its bread from the back of the store to the entrance, bread sales were unchanged, but sales of milk, which stayed at the back, fell by a tenth. Before the move, most customers who bought bread also bought milk.',
      ['Some customers who previously bought milk while fetching bread at the back no longer passed the milk.', 'Customers prefer bread to milk.', 'Moving products always reduces sales.', 'Milk is more profitable than bread.', 'The supermarket will move the milk next.'], 0,
      '<p>Bread used to draw shoppers to the back, past the milk; after the move, fewer passed it. That fits the facts. {A}. {C} overgeneralises; bread sales were unchanged.</p>'),
    it('lsat-ms-104', 5, 'Historian: Nearly all surviving letters from the colony’s first decade were written by its governors and wealthy merchants. Most colonists of that time could not write. Historians have described the decade as one of general prosperity, relying mainly on these letters.',
      ['The historians’ picture of the decade may not reflect the experience of most colonists.', 'The colony was poor in its first decade.', 'Governors always exaggerate prosperity.', 'Most colonists were merchants.', 'Letters are the only source of historical evidence.'], 0,
      '<p>The sources come from a small, wealthy group, so conclusions about "general" prosperity may not hold for most people. {A}. {B} claims the opposite outright, which is not supported.</p>', 'Swapping "may be unrepresentative" for "is false".'),
  ],
};
