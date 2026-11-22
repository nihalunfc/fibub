// LSAT · Logical Reasoning · Weaken. Every argument is original and written for fibub.
const F = { section: 'lr', qtype: 'weaken' };
const Q = 'Which one of the following, if true, most seriously weakens the argument?';
import { place } from './_util.js';
const it = (id, level, arg, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${Q}</p>`, options, answer, sol, trap });
export default {
  topic: 'weaken',
  items: [
    it('lsat-wk-001', 2, 'Since the restaurant added a vegetarian menu, its monthly sales have risen by a fifth. The vegetarian menu must be drawing in new customers.',
      ['Vegetarian dishes cost less to make.', 'The month the menu was added, a large office building opened next door and its workers now eat at the restaurant.', 'Some customers order from both menus.', 'Many restaurants offer vegetarian food.', 'The restaurant\'s owner is vegetarian.'], 1,
      '<p>{B} gives another cause for the rise that has nothing to do with the menu: hundreds of new office workers. If that is the reason, the conclusion about the menu loses its support.</p>', ''),
    it('lsat-wk-002', 3, 'A survey of readers of a gardening magazine found that eighty percent prefer organic fertiliser. So most gardeners in the country prefer organic fertiliser.',
      ['The survey had over five thousand responses.', 'The magazine is published by an organic farming association and mainly attracts readers with an interest in organic methods.', 'Organic fertiliser is more expensive than chemical fertiliser.', 'Some readers did not answer the fertiliser question.', 'The magazine is sold across the country.'], 1,
      '<p>The sample is readers of one magazine. If that magazine attracts organic fans, the sample is biased, and its result says little about gardeners in general. A large biased sample is still biased, so {A} does not help much.</p>',
      'A big sample does not fix an unrepresentative one.'),
    it('lsat-wk-003', 3, 'Health officer: People who take vitamin D supplements have fewer bone fractures than people who do not. So vitamin D supplements protect against fractures.',
      ['Vitamin D is also made by the skin in sunlight.', 'People who take supplements are much more likely to exercise regularly and eat well, both of which strengthen bones.', 'Fractures are more common in older people.', 'Vitamin D supplements are inexpensive.', 'Some people take vitamin D for other reasons.'], 1,
      '<p>{B} shows supplement users differ in other ways (exercise, diet) that themselves protect bones. Those habits could explain the difference in fractures without vitamin D doing anything.</p>', ''),
    it('lsat-wk-004', 4, 'City official: Last year we added more police patrols downtown, and reported thefts there dropped by a quarter. The extra patrols clearly reduced theft downtown.',
      ['Thefts in the rest of the city also fell.', 'Many downtown shops began asking customers to report thefts online through a new site that city records do not include.', 'Police patrols are expensive.', 'Downtown has more shops than other parts of the city.', 'The number of patrol officers in the city has risen in each of the last five years.'], 1,
      '<p>The evidence is <i>reported</i> thefts in city records. If many reports moved to a site those records do not count, the drop may be in reporting, not in theft. {A} weakens a little (something citywide), but {B} goes straight at the evidence.</p>',
      'Check whether the evidence measures the thing itself or only reports of it.'),
    it('lsat-wk-005', 4, 'Advertisement: Ninety percent of dentists surveyed said that they would recommend SmileBright toothpaste to their patients. So SmileBright is the toothpaste most dentists think is best.',
      ['The dentists surveyed live in many different cities.', 'Dentists in the survey were asked about SmileBright alone, and most said they would also recommend several competing brands.', 'SmileBright costs more than most toothpastes.', 'Some dentists in the survey do not use SmileBright themselves.', 'The survey was carried out by an independent firm.'], 1,
      '<p>Being willing to recommend something is not the same as thinking it is the best. {B} shows the dentists would recommend many brands, so the ninety percent figure does not show SmileBright is preferred over others.</p>', ''),
    it('lsat-wk-006', 5, 'Biologist: In lakes where a certain fish was introduced, populations of a native frog fell sharply within five years. The fish, which eats tadpoles, is therefore the main cause of the frogs\' decline in those lakes.',
      ['The fish also eats insects.', 'In nearby lakes where the fish was never introduced, the same frog declined just as sharply over the same years, at the same time as a fungal disease spread through the region.', 'The frog lays eggs only in spring.', 'The fish was introduced for sport fishing.', 'Tadpoles can hide in weeds.'], 1,
      '<p>{B} gives a control group: lakes without the fish lost frogs just as fast. If the decline happens with or without the fish, the fish cannot be the main cause, and the fungus is a likely alternative.</p>', ''),
  ],
};
