// LSAT · Reading Comprehension · comparative reading (two passages). Original passages written for fibub.
import { place } from './_util.js';
import cr_urban_trees from './_rc/cr-urban-trees.js';
import cr_author_intent from './_rc/cr-author-intent.js';
import cr_ranked_voting from './_rc/cr-ranked-voting.js';
const extra = [cr_urban_trees, cr_author_intent, cr_ranked_voting]; // more original passages, one per file in _rc/
const F = { section: 'rc', qtype: 'rc' };
const it = (id, level, sub, q, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], sub, facets: F, format: 'passage', group: 'p1', q: `<p>${q}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'rc-comparative',
  groups: {
    p1: { title: 'Comparative reading: Passage A and Passage B on museum repatriation', passage: `<p><b>Passage A</b></p>
<p>Museums in former colonial powers hold thousands of objects taken from other countries during periods of conquest. Requests to return these objects are often met with the argument that the museums preserve them better and make them available to a global audience. That argument confuses custody with ownership. A borrowed book does not become the borrower's because it is kept on a clean shelf. Where an object was taken by force or under clear duress, the default should be return, and the burden should fall on the museum to show why it should keep what it never fairly acquired.</p>
<p><b>Passage B</b></p>
<p>Calls to return museum objects to their countries of origin rest on a simple picture: an object was taken from a people, and justice requires giving it back. Real cases are rarely so simple. Many objects changed hands several times, sometimes through sales that were legal at the time; the modern state that requests an object may not represent the community that made it; and some communities of origin have asked museums to keep objects they cannot yet house safely. None of this means that museums should keep everything. It means that each claim must be judged on its own history, by a process both sides trust, rather than settled by a general rule.</p>` },
    ...Object.fromEntries(extra.map((x) => [x.group, x.passage])),
  },
  items: [
    it('lsat-rcc-001', 3, 'disagreement', 'The authors of the two passages would be most likely to disagree about whether',
      ['there should be a general presumption in favour of returning objects taken by force', 'some museum objects were taken during conquest', 'museums sometimes preserve objects well', 'some objects should be returned to their countries of origin', 'the history of an object matters at all'],
      '<p>Passage A wants a default of return, with the burden on museums. Passage B rejects any general rule in favour of case-by-case judgment. Both accept that some objects should go back ("None of this means that museums should keep everything").</p>', 'Choosing a point both authors accept.'),
    it('lsat-rcc-002', 4, 'agreement', 'Both passages express which one of the following views?',
      ['Museums should not simply keep every object whose return is requested.', 'Every object taken during colonial periods should be returned at once.', 'Good preservation gives a museum the right to keep an object.', 'Modern states always represent the communities that made the objects.', 'Sales of objects were always illegal.'],
      '<p>Passage A puts the burden on museums to justify keeping objects; Passage B says "None of this means that museums should keep everything". So both reject keeping everything by default.</p>'),
    it('lsat-rcc-003', 4, 'relationship', 'Which one of the following best describes how Passage B relates to the argument in Passage A?',
      ['Passage B raises complications that count against settling claims by a general rule such as the one Passage A proposes.', 'Passage B gives further evidence for the default that Passage A proposes.', 'Passage B argues that the analogy in Passage A is accurate.', 'Passage B rejects the idea that any object was taken unfairly.', 'Passage B restates Passage A\'s conclusion in different words.'],
      '<p>Passage B lists complications (several owners, legal sales, states versus communities, communities asking museums to keep objects) and concludes that claims need case-by-case judgment, which works against a general default.</p>'),
    it('lsat-rcc-004', 5, 'analogy', 'The author of Passage A uses the example of a borrowed book primarily to',
      ['illustrate the claim that keeping something well does not make it yours', 'show that museums are like libraries', 'argue that museums should lend objects to other museums', 'suggest that colonial powers paid for most objects', 'show that preservation is unimportant'],
      '<p>The book example follows "That argument confuses custody with ownership" and illustrates it: good care (a clean shelf) does not transfer ownership.</p>'),
    ...extra.flatMap((x) => x.items),
  ],
};
