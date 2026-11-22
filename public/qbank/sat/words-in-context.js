// SAT Reading and Writing · Craft and structure · words in context. Original passages (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'craft' };
const it = (id, level, sub, text, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>Which choice completes the text with the most logical and precise word or phrase?</p>`, options, answer: 0, sol, trap });
const it2 = (id, level, sub, text, ask, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>${ask}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'words-in-context',
  items: [
    it('sat-wc-001', 2, 'fill the blank', 'The new bridge was designed to ______ strong earthquakes: its towers rest on flexible bearings that let the deck sway without cracking.',
      ['withstand', 'predict', 'cause', 'measure'], '<p>Flexible bearings that let the deck sway "without cracking" are about surviving earthquakes: <b>withstand</b>. Nothing in the text is about predicting, causing or measuring them.</p>'),
    it('sat-wc-002', 3, 'fill the blank', 'Although the author\'s first novel sold few copies, critics praised its ______ portrait of small-town life, noting that every detail, from the smell of the bakery to the creak of the church door, rang true.',
      ['vivid', 'brief', 'reluctant', 'inaccurate'], '<p>The critics "praised" the portrait, and every detail "rang true": it was lively and real, which is <b>vivid</b>. "Inaccurate" contradicts the text; "brief" and "reluctant" do not fit the evidence.</p>'),
    it('sat-wc-003', 3, 'fill the blank', 'Early reports that the new material could store twice as much energy as current batteries proved ______: later tests found only a 10% improvement.',
      ['exaggerated', 'modest', 'confidential', 'permanent'], '<p>Claimed: twice as much. Found: 10% more. The reports overstated it: <b>exaggerated</b>. "Modest" is the opposite.</p>'),
    it('sat-wc-004', 4, 'fill the blank', 'The historian is careful not to ______ the diaries\' accounts; she compares each entry with ship records and newspapers before treating it as fact.',
      ['accept uncritically', 'dismiss entirely', 'publish widely', 'translate freely'], '<p>She checks every entry against other sources before trusting it, which means she will not <b>accept</b> them <b>uncritically</b>. She does use them in the end, so "dismiss entirely" is wrong.</p>'),
    it2('sat-wc-005', 4, 'meaning in context', 'The coach told the team that the final match would test not only their skill but their <b>resolve</b>: they would be playing in heavy rain, a goal down, in front of the other side\'s fans.', 'As used in the text, what does the word "resolve" most nearly mean?',
      ['determination', 'solution', 'decision', 'clarity'], '<p>Playing in rain, behind, before hostile fans tests whether the team keeps trying: <b>determination</b>. "Resolve" can mean a solution or decision elsewhere, but not here.</p>', 'Choosing a common meaning of the word that does not fit this sentence.'),
    it('sat-wc-101', 2, 'fill the blank', 'The museum’s new exhibit is designed to be ______ to young children: the labels are short, the displays are at a child’s eye level, and many objects can be touched.',
      ['accessible', 'invisible', 'expensive', 'forbidden'], '<p>Short labels, low displays and touchable objects make the exhibit easy for children to use: <b>accessible</b>. The other words contradict that.</p>'),
    it('sat-wc-102', 3, 'fill the blank', 'Although the senator was known for long speeches, her response to the reporter’s question was strikingly ______: a single sentence of eight words.',
      ['concise', 'elaborate', 'hesitant', 'repetitive'], '<p>"Although" sets up a contrast with long speeches, and eight words is very short: <b>concise</b>. "Elaborate" is the opposite.</p>'),
    it('sat-wc-103', 4, 'fill the blank', 'Early critics found the composer’s music ______, complaining that its clashing chords and sudden changes of rhythm were impossible to follow; later listeners, used to such techniques, heard it as carefully organised.',
      ['bewildering', 'soothing', 'predictable', 'familiar'], '<p>Critics said it was "impossible to follow": <b>bewildering</b>. "Predictable" and "familiar" contradict the complaint.</p>'),
    it2('sat-wc-104', 4, 'meaning in context', 'The new manager did not <b>court</b> popularity among the staff; instead, she made the changes she thought necessary and explained them plainly, whether or not people liked them.', 'As used in the text, what does the word "court" most nearly mean?',
      ['seek', 'judge', 'avoid', 'accuse'], '<p>She did not try to win popularity; she acted whether or not people liked it. So "court" means <b>seek</b>. "Court" as in a law court suggests "judge", which does not fit.</p>', 'Choosing a meaning from another use of the word.'),
  ],
};
