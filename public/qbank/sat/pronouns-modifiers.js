// SAT Reading and Writing · Standard English conventions · pronoun agreement and dangling modifiers. Original (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'conventions' };
const Q = 'Which choice completes the text so that it conforms to the conventions of Standard English?';
const it = (id, level, sub, text, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>${Q}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'pronouns-modifiers',
  items: [
    it('sat-pm-001', 2, 'pronoun number', 'The city council announced that ______ would vote on the new park next month.',
      ['it', 'they', 'them', 'we'], '<p>"The city council" is one group acting together, so it takes a singular pronoun: <b>it</b>.</p>'),
    it('sat-pm-002', 3, 'pronoun number', 'Sea otters wrap themselves in kelp before sleeping so that ______ do not drift away on the tide.',
      ['they', 'it', 'he or she', 'one'], '<p>The pronoun refers back to "sea otters", which is plural: <b>they</b>.</p>'),
    it('sat-pm-003', 3, 'dangling modifier', 'Painted in only six weeks, ______',
      ['the mural covers the entire north wall of the library.', 'the artist covered the entire north wall of the library with the mural.', 'the library\'s entire north wall is covered by the artist\'s mural.', 'it took the artist six weeks to cover the north wall.'], '<p>"Painted in only six weeks" describes whatever comes right after the comma. The thing that was painted is the mural, so the sentence must continue with <b>the mural</b>. The artist was not painted, and neither was the wall.</p>', 'The opening phrase must describe the noun that comes right after the comma.'),
    it('sat-pm-004', 4, 'dangling modifier', 'Having studied the ice cores for three years, ______',
      ['the team concluded that the region had been far warmer 120,000 years ago.', 'the region was found to have been far warmer 120,000 years ago.', 'the conclusion was that the region had been far warmer 120,000 years ago.', 'evidence showed that the region had been far warmer 120,000 years ago.'], '<p>Who studied the ice cores? The team. So "the team" must come right after the comma. The region, the conclusion and the evidence did not do any studying.</p>'),
    it('sat-pm-005', 3, 'possessive pronoun', 'The two companies merged in 2015, but each kept ______ own name and logo for another decade.',
      ['its', 'their', "it's", 'theirs'], '<p>"Each" is singular, so the pronoun is singular: <b>its</b> (the possessive, with no apostrophe).</p>'),
  ],
};
