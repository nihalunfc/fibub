// LSAT · Reading Comprehension · structure and function of parts of a passage. Original passage written for fibub.
import { place } from './_util.js';
import sf_default_pensions from './_rc/sf-default-pensions.js';
import sf_rock_art from './_rc/sf-rock-art.js';
import sf_class_actions from './_rc/sf-class-actions.js';
const extra = [sf_default_pensions, sf_rock_art, sf_class_actions]; // more original passages, one per file in _rc/
const F = { section: 'rc', qtype: 'rc' };
const it = (id, level, sub, q, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], sub, facets: F, format: 'passage', group: 'p1', q: `<p>${q}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'rc-structure-function',
  groups: {
    p1: { title: 'Passage: precedent and the problem of new technology', passage: `<p>Courts in common-law countries decide new cases partly by reasoning from old ones. A judge facing an unfamiliar dispute asks which earlier decisions it most resembles, and applies the principle those decisions established. This method, called reasoning by precedent, gives the law stability: people can predict how courts will rule by looking at how they have ruled before.</p>
<p>New technologies strain the method because they rarely resemble anything exactly. When telephones spread in the early twentieth century, courts had to decide whether listening in on a call was like opening a letter, which required a warrant, or like overhearing a conversation in a public street, which did not. Different courts chose different analogies, and for decades the answer depended on where one lived.</p>
<p>Some legal scholars conclude that precedent is simply the wrong tool for technological change and that legislatures, which can write rules from scratch, should take the lead. But this conclusion overlooks what the telephone cases eventually achieved. The competing analogies forced judges to say what, exactly, made a letter private: not the envelope itself, but the sender's reasonable expectation that no one else would read it. Once that principle was stated, it applied to telephones, and later to email, without any need for new analogies. Precedent, in other words, is slow to adapt, but the very struggle to find the right comparison can uncover principles general enough to outlast the technology that prompted them.</p>` },
    ...Object.fromEntries(extra.map((x) => [x.group, x.passage])),
  },
  items: [
    it('lsat-rsf-001', 3, 'function of a paragraph', 'The second paragraph functions primarily to',
      ['give an example of the difficulty that new technology creates for reasoning by precedent', 'present the author\'s main conclusion', 'argue that legislatures should regulate telephones', 'explain why precedent gives the law stability', 'reject the view stated in the first paragraph'],
      '<p>"New technologies strain the method" is the claim, and the telephone story illustrates it. The author\'s conclusion comes in paragraph 3.</p>'),
    it('lsat-rsf-002', 4, 'function of a sentence', 'The author mentions email in the third paragraph most likely in order to',
      ['show that a principle drawn from the telephone cases applied to later technology as well', 'argue that email is less private than letters', 'give an example of a technology that legislatures regulated', 'suggest that courts still disagree about email', 'show that analogies to letters are always wrong'],
      '<p>The principle ("reasonable expectation that no one else would read it") "applied to telephones, and later to email, without any need for new analogies". Email shows the principle outlasting the technology that produced it.</p>'),
    it('lsat-rsf-003', 4, 'structure', 'Which one of the following best describes the structure of the third paragraph?',
      ['It reports a conclusion some scholars draw, then argues that the conclusion overlooks a benefit of the method they criticise.', 'It states a principle and then lists exceptions to it.', 'It compares two technologies and concludes that they are alike.', 'It summarises the first two paragraphs without adding anything new.', 'It presents two opposing views and declines to choose between them.'],
      '<p>"Some legal scholars conclude..." then "But this conclusion overlooks..." and the telephone cases\' hidden benefit. The author does choose a side.</p>'),
    it('lsat-rsf-004', 5, 'main point', 'Which one of the following most accurately states the main point of the passage?',
      ['Although reasoning by precedent adapts slowly to new technology, the search for apt comparisons can produce principles general enough to cover later technologies.', 'Courts should stop reasoning by precedent when deciding cases about new technology.', 'Telephone calls deserve the same privacy as letters.', 'Legislatures are better than courts at protecting privacy.', 'Precedent makes the law stable and predictable.'],
      '<p>The final sentence sums up the passage: slow, but able to uncover lasting principles. The last option is true according to paragraph 1 but is background, not the main point.</p>'),
    ...extra.flatMap((x) => x.items),
  ],
};
