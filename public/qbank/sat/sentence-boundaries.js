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
    it('sat-sb-101', 2, 'comma splice', 'The library extended its opening hours during exam ______ students could study there until midnight.',
      ['season, so', 'season,', 'season', 'season so,'], '<p>Two complete sentences need a comma plus a joining word: <b>season, so</b>. A comma alone makes a comma splice; nothing at all makes a run-on.</p>'),
    it('sat-sb-102', 3, 'semicolon', 'Glass looks solid and ______ its atoms are arranged in a disordered pattern more like a liquid’s than a crystal’s.',
      ['still; in fact,', 'still, in fact,', 'still in fact,', 'still, in fact;'], '<p>"Glass looks solid and still" and "its atoms are arranged..." are both complete. A semicolon joins them, and "in fact" introduces the second: <b>still; in fact,</b>. A comma alone would be a comma splice.</p>'),
    it('sat-sb-103', 3, 'fragment', 'Because the river had flooded the only road into the ______ supplies were delivered by boat for two weeks.',
      ['village,', 'village.', 'village;', 'village, and'], '<p>"Because the river had flooded ... village" is a dependent clause, so it must attach to the main clause with a comma: <b>village,</b>. A period or semicolon leaves a fragment.</p>'),
    it('sat-sb-104', 4, 'colon', 'The chef’s new menu is built around a single ______ every dish uses ingredients grown within fifty kilometres of the restaurant.',
      ['idea:', 'idea', 'idea, that', 'idea, which'], '<p>A complete sentence followed by an explanation of "a single idea" takes a colon: <b>idea:</b>. No punctuation makes a run-on; "which" would wrongly make the second part a description of "idea" with a full sentence after it.</p>'),
  ],
};
