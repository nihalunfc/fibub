// LSAT · Reading Comprehension · author's attitude and tone. Original passage written for fibub.
import { place } from './_util.js';
import aa_microfinance from './_rc/aa-microfinance.js';
import aa_jazz_recordings from './_rc/aa-jazz-recordings.js';
import aa_de_extinction from './_rc/aa-de-extinction.js';
const extra = [aa_microfinance, aa_jazz_recordings, aa_de_extinction]; // more original passages, one per file in _rc/
const F = { section: 'rc', qtype: 'rc' };
const it = (id, level, sub, q, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], sub, facets: F, format: 'passage', group: 'p1', q: `<p>${q}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'rc-author-attitude',
  groups: {
    p1: { title: 'Passage: a reconsideration of the "self-taught" painter', passage: `<p>Art historians have long described the nineteenth-century landscape painter Teodora Vass as self-taught, a label that has done much to shape her reputation. Vass, the story goes, learned to paint alone in a remote mountain village, and the strange flatness of her skies and the absence of conventional perspective in her valleys are the marks of a gifted outsider who never absorbed the rules of the academy.</p>
<p>This account is not exactly false, but it is badly incomplete. Letters recently found in a regional archive show that Vass spent two winters in the capital copying paintings in the national gallery, and that she corresponded for a decade with a teacher at the academy who sent her prints and detailed criticism. Her "outsider" flatness, seen in this light, looks less like ignorance than choice. Several of her letters discuss Japanese woodblock prints, then newly fashionable among academy painters, and praise exactly the qualities critics later treated as her limitations.</p>
<p>None of this diminishes Vass's achievement; if anything, it enlarges it. A painter who breaks rules she has never learned shows talent, but a painter who learns the rules and then sets them aside for a purpose shows judgment. The self-taught label, for all its romance, has made Vass seem a happy accident rather than an artist making deliberate decisions. It is time historians described her as what the letters show she was: a well-informed painter who knew the conventions of her day and chose, with care, which of them to keep.</p>` },
    ...Object.fromEntries(extra.map((x) => [x.group, x.passage])),
  },
  items: [
    it('lsat-raa-001', 3, 'attitude to a view', 'The author\'s attitude toward the description of Vass as "self-taught" is best described as',
      ['critical of it as misleadingly incomplete, though not entirely false', 'fully supportive of it', 'indifferent to whether it is accurate', 'convinced that it was invented deliberately to harm Vass', 'uncertain whether the letters bear on it'],
      '<p>The author says the account "is not exactly false, but it is badly incomplete". That is criticism with a concession. Nothing suggests the label was made up to harm her.</p>'),
    it('lsat-raa-002', 4, 'attitude to the subject', 'The author\'s attitude toward Vass\'s work can most accurately be described as',
      ['admiring, with the view that the new evidence makes her achievement greater', 'disappointed that she was not truly self-taught', 'neutral, avoiding any judgment of her painting', 'sceptical that her paintings have any lasting value', 'amused by the flatness of her skies'],
      '<p>"None of this diminishes Vass\'s achievement; if anything, it enlarges it." The author admires her and thinks the letters raise her standing.</p>'),
    it('lsat-raa-003', 4, 'meaning of a phrase', 'In the third paragraph, the author contrasts "talent" with "judgment" primarily in order to',
      ['explain why deliberate rule-breaking deserves more credit than rule-breaking from ignorance', 'argue that talent cannot be taught', 'suggest that academy painters lacked talent', 'show that Vass never broke any rules', 'claim that judgment is a form of talent'],
      '<p>The contrast supports the claim that the letters "enlarge" Vass\'s achievement: a painter who knows the rules and sets them aside for a purpose shows something more than one who never learned them.</p>'),
    it('lsat-raa-004', 5, 'strengthen the author', 'Which one of the following, if true, would most strengthen the author\'s view of Vass?',
      ['An early painting by Vass, made before her winters in the capital, uses conventional perspective that her later paintings abandon.', 'Many other nineteenth-century painters were self-taught.', 'Vass\'s letters were written in an unusual dialect.', 'Japanese woodblock prints were difficult to obtain in the mountains.', 'Some critics still praise the flatness of Vass\'s skies.'],
      '<p>If Vass once painted conventional perspective and later dropped it, her flatness was a choice, not a lack of skill, exactly the author\'s claim. The other facts do not bear on whether her style was deliberate.</p>'),
    ...extra.flatMap((x) => x.items),
  ],
};
