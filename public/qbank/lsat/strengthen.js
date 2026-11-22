// LSAT · Logical Reasoning · Strengthen. Every argument is original and written for fibub.
const F = { section: 'lr', qtype: 'strengthen' };
const Q = 'Which one of the following, if true, most strengthens the argument?';
import { place } from './_util.js';
const it = (id, level, arg, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${Q}</p>`, options, answer, sol, trap });
export default {
  topic: 'strengthen',
  items: [
    it('lsat-st-001', 2, 'Students at Hillview who joined the after-school chess club improved their maths grades more over the year than students who did not join. So playing chess improves maths performance.',
      ['Chess is popular in many countries.', 'Students who joined the club had maths grades no higher than other students\' at the start of the year and took the same maths classes.', 'Some students in the chess club dislike maths.', 'The chess club meets twice a week.', 'Students who play chess also tend to enjoy puzzles.'], 1,
      '<p>The worry is that club members differed in some other way. {B} rules out two such differences: they did not start ahead and they had the same classes. That makes chess a more likely cause of the gain.</p>', ''),
    it('lsat-st-002', 3, 'A city reduced bus fares by half for one year, and ridership rose by thirty percent. Officials concluded that the fare cut caused the increase.',
      ['Bus ridership in similar cities that kept their fares unchanged stayed flat over the same year.', 'Some riders said they would have taken the bus anyway.', 'The fare cut cost the city more than expected.', 'Ridership on the city\'s trains also rose during the year.', 'Most bus riders in the city own cars.'], 0,
      '<p>A comparison group helps a causal claim. If similar cities without a fare cut saw no rise, the rise in this city is less likely to come from something general, such as fuel prices. {D} weakens: if trains also rose, something other than bus fares may be at work.</p>', ''),
    it('lsat-st-003', 3, 'Researcher: Birds of this species that nest near the highway lay fewer eggs than those that nest in the quiet forest interior. Traffic noise, which masks the songs males use to attract mates, is probably the reason.',
      ['The highway was built thirty years ago.', 'Birds near the highway have plenty of food.', 'In a test where speakers played traffic noise in a quiet part of the forest, birds nesting nearby laid fewer eggs than usual.', 'Females of this species also sing.', 'Some birds of this species nest in towns.'], 2,
      '<p>{C} is an experiment that isolates noise from everything else about highways (fumes, light, predators). Birds exposed to noise alone laid fewer eggs, which strongly supports noise as the cause. {B} helps a little by ruling out food, but {C} is far stronger.</p>',
      'Several answers can help a little; pick the one that helps most.'),
    it('lsat-st-004', 4, 'Software firm: Our employees who switched to a four-day week reported higher job satisfaction than before, and their output per week did not fall. A four-day week would therefore work well for all of our staff.',
      ['The employees who switched were chosen at random from all departments, not volunteers.', 'Job satisfaction is hard to measure.', 'Some employees prefer a five-day week.', 'Other firms have tried four-day weeks.', 'The trial lasted three months.'], 0,
      '<p>The leap is from the trial group to "all of our staff". If the trial group were volunteers, they might be the people best suited to a short week. {A} says they were a random sample from every department, which makes the group representative and the conclusion much stronger.</p>', ''),
    it('lsat-st-005', 4, 'Archaeologist: The stone tools found at this site are sharpened in a way seen nowhere else except at a site two hundred kilometres to the north. So people from the northern site probably travelled here.',
      ['The northern site is older than this one.', 'The stone used for the tools here comes from a quarry near the northern site.', 'Stone tools were common in this region.', 'Sharpening techniques can be learned by watching someone.', 'Few tools were found at either site.'], 1,
      '<p>The same technique could have been invented twice, or passed along by trade. If the stone itself came from near the northern site, the link between the two places becomes much harder to explain without travel. {D} would weaken: the technique could spread without people moving.</p>', ''),
    it('lsat-st-006', 5, 'Economist: Countries that spend more on early childhood education have higher average incomes thirty years later. This suggests that early education spending raises a country\'s future income.',
      ['Rich countries tend to spend more on many public services.', 'Within countries that raised early education spending sharply, the children who attended the new programmes later earned more than similar children born just before the programmes began.', 'Early education programmes vary in quality.', 'Some poor countries spend a lot on early education.', 'Income is not the only measure of a country\'s success.'], 1,
      '<p>The main worry is reverse causation or a common cause: rich countries can afford more spending. {B} compares otherwise similar children inside the same countries, some just before and some just after the programmes began, and finds the programme group earned more. That isolates the effect of the education. {A} weakens.</p>', ''),
  ],
};
