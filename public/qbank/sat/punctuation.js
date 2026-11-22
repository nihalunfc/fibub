// SAT Reading and Writing · Standard English conventions · punctuation: commas, colons, dashes, apostrophes.
// Original sentences (fibub). Items are written with the right answer first; place() spreads the positions.
import { place } from './_util.js';
const F = { section: 'rw', domain: 'conventions' };
const Q = 'Which choice completes the text so that it conforms to the conventions of Standard English?';
const it = (id, level, sub, text, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>${Q}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'punctuation',
  items: [
    it('sat-pu-001', 2, 'apostrophes', 'The ______ wings beat about fifty times a second, fast enough to hover in front of a flower.',
      ["hummingbird's", 'hummingbirds', "hummingbirds'", 'hummingbird'], '<p>The wings belong to one hummingbird, so it needs a singular possessive: <b>hummingbird\'s</b>. "Hummingbirds" is just a plural, and "hummingbirds\'" would mean several birds share the wings.</p>'),
    it('sat-pu-002', 3, 'apostrophes', 'Both ______ final reports were submitted on time, and the judges praised their clear charts.',
      ["teams'", "team's", 'teams', "teams's"], '<p>"Both" tells you there are two teams, and the reports belong to them: plural possessive, <b>teams\'</b>.</p>'),
    it('sat-pu-003', 2, 'its and it\'s', 'The museum reopened in May after repairs to ______ roof, which had leaked for years.',
      ['its', "it's", "its'", 'it is'], '<p>"Its" (no apostrophe) is the possessive: the roof of the museum. "It\'s" means "it is", which makes no sense here.</p>'),
    it('sat-pu-004', 3, 'colon', 'The expedition carried only three tools for measuring the ______ laser rangefinder, a GPS receiver and a long steel tape.',
      ['glacier: a', 'glacier, a', 'glacier; a', 'glacier a'], '<p>A colon introduces a list or explanation after a complete sentence. "The expedition carried only three tools for measuring the glacier" is complete, and the list explains it: <b>colon</b>. A semicolon needs a complete sentence on both sides, and the list is not one.</p>'),
    it('sat-pu-005', 3, 'semicolon', 'Most bats hunt by sound, sending out calls and listening for the echoes ______ fruit bats, by contrast, rely largely on sight and smell.',
      ['echoes;', 'echoes,', 'echoes', 'echoes, and,'], '<p>Both parts are complete sentences, so a comma alone would make a comma splice and nothing at all would be a run-on. A <b>semicolon</b> joins two complete sentences that are closely related.</p>', 'A comma cannot join two complete sentences on its own.'),
    it('sat-pu-006', 4, 'paired dashes', 'The town\'s oldest ______ still grinds flour for local bakeries.',
      ['building—a stone mill finished in 1784—', 'building, a stone mill finished in 1784—', 'building—a stone mill finished in 1784,', 'building a stone mill finished in 1784,'], '<p>The phrase "a stone mill finished in 1784" is extra information inserted into the sentence. It needs matching punctuation on both sides: two dashes or two commas, never one of each. Only the option with <b>two dashes</b> matches.</p>', 'Mixing a comma and a dash around the same interruption.'),
    it('sat-pu-007', 3, 'no comma between subject and verb', 'The engineers who designed the first suspension bridges in the region ______ how strong winds could twist a deck.',
      ['did not fully understand', ', did not fully understand', 'did not fully understand,', '— did not fully understand'], '<p>"The engineers who designed the first suspension bridges in the region" is the subject; "did not fully understand" is its verb. No punctuation goes between a subject and its verb, however long the subject is.</p>'),
    it('sat-pu-008', 4, 'restrictive clause', '______ the summer reading list receive a certificate at the start of the school year.',
      ['Students who complete', 'Students, who complete', 'Students; who complete', 'Students: who complete'], '<p>"Who complete the summer reading list" tells you <i>which</i> students receive the certificate. It is essential, so no commas set it off: <b>no punctuation</b>.</p>'),
    it('sat-pu-101', 2, 'apostrophes', 'The ______ roots spread almost as wide as its branches, holding the soil in place on the steep bank.',
      ["oak's", 'oaks', "oaks'", 'oak'], '<p>"Its branches" shows one tree, and the roots belong to it: <b>oak\'s</b>.</p>'),
    it('sat-pu-102', 3, 'commas with extra information', 'Marie Tharp, a geologist and ______ helped produce some of the first detailed maps of the Atlantic Ocean floor.',
      ['mapmaker,', 'mapmaker', 'mapmaker;', 'mapmaker—'], '<p>"A geologist and mapmaker" is extra information about Tharp. It opens with a comma, so it must close with a comma too: <b>mapmaker,</b>. A dash would not match the opening comma, and a semicolon would split the sentence.</p>', 'Closing an aside with a different mark from the one that opened it.'),
    it('sat-pu-103', 3, 'colon before a list', 'The survival kit contained three essential ______ a water filter, a fire starter and a reflective blanket.',
      ['items:', 'items', 'items;', 'items, such as:'], '<p>A complete sentence introducing a list takes a colon: <b>items:</b>. A semicolon must join two complete sentences, and "such as:" puts a colon after an incomplete phrase.</p>'),
    it('sat-pu-104', 4, 'no comma between subject and verb', 'The team of engineers who designed the new solar ______ a prize at the national science fair.',
      ['panel won', 'panel, won', 'panel; won', 'panel: won'], '<p>"The team of engineers who designed the new solar panel" is the subject and "won" is its verb. Nothing should separate a subject from its verb: <b>panel won</b>.</p>'),
  ],
};
