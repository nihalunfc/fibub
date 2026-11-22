// SAT Reading and Writing · Information and ideas · command of evidence (textual). Original passages (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'info' };
const it = (id, level, sub, text, ask, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>${ask}</p>`, options, answer: 0, sol, trap });
const SUP = 'Which finding, if true, would most directly support the claim?';
export default {
  topic: 'textual-evidence',
  items: [
    it('sat-te-001', 2, 'support a claim', 'A team of biologists claims that city-dwelling blackbirds sing at a higher pitch than forest blackbirds because low notes are drowned out by traffic noise.', SUP,
      ['Blackbirds in the same city sing at a higher pitch on busy streets than in quiet parks.', 'Blackbirds in cities eat different food from blackbirds in forests.', 'Forest blackbirds sing more often in spring than in autumn.', 'Some city blackbirds have learned to nest on buildings.'],
      '<p>The claim links pitch to traffic noise. A finding that pitch is higher where traffic is louder, in the same city, ties the two together directly. The other findings have nothing to do with noise or pitch.</p>'),
    it('sat-te-002', 3, 'weaken a claim', 'An economist argues that a city\'s new free bus service caused downtown shops\' sales to rise in its first year.', 'Which finding, if true, would most directly weaken the economist\'s argument?',
      ['Sales rose by the same amount that year in similar towns with no free buses.', 'Many shoppers said they liked the free buses.', 'The buses ran every ten minutes during the day.', 'Downtown shops were open longer hours on weekends.'],
      '<p>If similar towns saw the same rise without free buses, something else (such as a good economy) probably caused it. That directly weakens the claim that the buses did. The last option offers another possible cause, but only on weekends and without showing it explains the rise.</p>'),
    it('sat-te-003', 3, 'quotation that illustrates', 'In her 1920s letters, the fictional scientist Ruth Calder often described her research with a mix of patience and humour.', 'Which quotation from Calder\'s letters most effectively illustrates the claim?',
      ['"The crystals refuse to grow again this week; I suspect they are on holiday, and I shall simply wait for their return."', '"The laboratory is cold, and the equipment is old."', '"I have measured the samples three times and found the same result."', '"Science requires careful work and exact records."'],
      '<p>The claim has two parts: patience and humour. Only the first quotation shows both: she will "simply wait" (patience) for crystals that are "on holiday" (humour). The others show neither or only one.</p>', 'Checking only one part of a two-part claim.'),
    it('sat-te-004', 4, 'support a hypothesis', 'Some researchers think that sleep helps the brain store new memories. To test this, they taught two groups of volunteers a list of words in the evening. One group then slept; the other stayed awake through the night.', 'Which result, if true, would most directly support the researchers\' idea?',
      ['The group that slept remembered more of the words the next morning than the group that stayed awake.', 'Both groups remembered the same number of words.', 'The volunteers who stayed awake felt more tired the next day.', 'The volunteers learned the words faster in the evening than in the morning.'],
      '<p>The idea is that sleep helps memory, so the sleeping group should remember more. Equal results would count against it; tiredness and learning speed do not test memory storage.</p>'),
  ],
};
