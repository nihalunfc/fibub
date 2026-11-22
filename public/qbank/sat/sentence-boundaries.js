// SAT Reading and Writing · Standard English conventions · sentence boundaries: run-ons, comma splices, fragments.
// Original sentences (fibub). Items are written with the right answer first; place() spreads the positions.
import { place } from './_util.js';
const F = { section: 'rw', domain: 'conventions' };
const Q = 'Which choice completes the text so that it conforms to the conventions of Standard English?';
const it = (id, level, sub, text, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>${Q}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'sentence-boundaries',
  items: [
    it('sat-sb-001', 2, 'comma splice', 'The octopus has three hearts ______ two pump blood through the gills, and the third sends it to the rest of the body.',
      ['hearts. Two', 'hearts, two', 'hearts two', 'hearts, and two,'], '<p>"The octopus has three hearts" is a complete sentence, and so is what follows. Two complete sentences need a period, a semicolon, or a comma with "and", "but" and similar words. A comma alone is a comma splice; nothing is a run-on. <b>hearts. Two</b> is correct.</p>', 'Joining two complete sentences with only a comma.'),
    it('sat-sb-002', 2, 'fragment', 'After decades of research into how bees navigate ______ scientists found that the insects use the sun\'s position as a compass.',
      ['navigate,', 'navigate.', 'navigate;', 'navigate:'], '<p>"After decades of research into how bees navigate" is not a sentence on its own: it is an introductory phrase. Cutting it off with a period or semicolon leaves a fragment. A <b>comma</b> joins it to the main sentence.</p>'),
    it('sat-sb-003', 3, 'conjunction', 'The village had no road until 1962 ______ supplies arrived by boat or on horseback.',
      ['1962, so', '1962 so,', '1962, so,', '1962 so'], '<p>Two complete sentences can be joined by a comma plus a joining word such as "so". The comma goes before "so", not after it: <b>1962, so</b>.</p>'),
    it('sat-sb-004', 3, 'however', 'The first version of the vaccine worked well in the laboratory ______ it was too fragile to ship to remote clinics.',
      ['laboratory; however,', 'laboratory, however,', 'laboratory, however', 'laboratory however,'], '<p>"However" is not a joining word like "but". Between two complete sentences it needs a semicolon (or period) before it and a comma after: <b>laboratory; however,</b>. With only commas you get a comma splice.</p>', 'Treating "however" like "but".'),
    it('sat-sb-005', 4, 'participle phrase', 'The researchers sealed the samples in glass jars ______ them from moisture during the long voyage home.',
      ['jars, protecting', 'jars. Protecting', 'jars; protecting', 'jars, they protected'], '<p>"Protecting them from moisture during the long voyage home" is not a complete sentence, so it cannot stand after a period or semicolon. Attached with a comma it describes the sealing: <b>jars, protecting</b>. "Jars, they protected" would be a comma splice.</p>'),
    it('sat-sb-006', 4, 'question boundary', 'Historians still debate one question about the lost colony ______ did its settlers leave willingly, or were they forced out?',
      ['colony:', 'colony,', 'colony', 'colony;'], '<p>The first part is complete and introduces the question that follows. A <b>colon</b> is the mark that introduces an explanation or example after a complete sentence.</p>'),
  ],
};
