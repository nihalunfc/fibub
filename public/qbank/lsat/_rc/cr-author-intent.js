// LSAT RC comparative passages (humanities): does the author's intention fix a work's meaning? Original, written for fibub.
import { rc } from './h.js';
const it = rc('p3');
export default {
  group: 'p3',
  passage: { title: 'Comparative reading: Passage A and Passage B on what a poem means', passage: `<p><b>Passage A</b></p>
<p>When readers disagree about what a poem means, there must be some standard by which one reading can be better than another; otherwise interpretation is merely the expression of preference. The most defensible standard is the author’s intention. A poem is an act of communication, and to understand any communication is to grasp what the speaker meant by it. This does not require that we read the poet’s private letters or ask what was on the poet’s mind at a given moment. Intentions are shown in the work itself, in its words, form and context, and we infer them as we infer the meaning of a friend’s remark. But if we abandon the idea that we are trying to recover what someone meant, nothing is left to make our readings answerable to anything outside ourselves.</p>
<p><b>Passage B</b></p>
<p>The view that a poem means what its author intended has an appealing simplicity, but it fails to describe how literature actually lives. Poems routinely outlast the circumstances of their making, and readers in later centuries find in them meanings their authors could not have foreseen: a love lyric becomes a poem about exile, a hymn about a harvest becomes a meditation on mortality. To call these readings mistakes because the author did not intend them is to treat the poem as a message whose delivery is either correct or failed. Yet a reading need not be arbitrary simply because it goes beyond intention. It can be tested against the text: does it account for the poem’s images, its structure, its turns of phrase? A reading that ignores half the words fails, whatever its source; a reading that illuminates them succeeds, whatever the author had in mind.</p>` },
  items: [
    it('lsat-rcc-301', 3, 'main issue', 'The central question on which the two passages take different positions is whether',
      ['a poem’s meaning is limited to what its author intended', 'poems should be read at all', 'readers ever disagree about poems', 'a poet’s private letters are useful', 'love poems are better than hymns'],
      '<p>A says the standard is "the author’s intention"; B says readings can go "beyond intention" and still be valid. {A}.</p>'),
    it('lsat-rcc-302', 3, 'shared view', 'Both authors would most likely agree that',
      ['some readings of a poem are better than others', 'the author’s private letters settle disputes', 'any reading of a poem is as good as any other', 'poems cannot outlast their circumstances', 'intentions cannot be inferred from a text'],
      '<p>A wants a standard so one reading "can be better than another"; B says a reading that ignores the words "fails" and one that illuminates them "succeeds". {A}. Both reject {C}.</p>'),
    it('lsat-rcc-303', 4, 'response', 'The author of Passage B would most likely respond to Passage A’s claim that without intention "nothing is left to make our readings answerable" by saying that',
      ['readings can be held answerable to the text itself', 'readings need not be answerable to anything', 'the author’s intention is the only possible standard', 'readers should consult the poet’s letters', 'later readers always misunderstand poems'],
      '<p>B: a reading "can be tested against the text: does it account for the poem’s images, its structure ...". That is an alternative standard. {A}.</p>'),
    it('lsat-rcc-304', 4, 'detail', 'Passage A states that intentions are shown',
      ['in the work itself: its words, form and context', 'only in the poet’s private letters', 'through interviews with the poet', 'only to readers of the same century', 'in the readings of later centuries'],
      '<p>"Intentions are shown in the work itself, in its words, form and context." {A}. A explicitly says we need not read private letters.</p>'),
    it('lsat-rcc-305', 5, 'function', 'In Passage B, the examples of a love lyric becoming a poem about exile serve mainly to',
      ['illustrate meanings later readers find that authors could not have foreseen', 'show that love poems are often misread', 'support Passage A’s position', 'show that hymns are better than lyrics', 'argue that authors hid secret meanings in their poems'],
      '<p>They illustrate "meanings their authors could not have foreseen". {A}.</p>'),
    it('lsat-rcc-306', 5, 'analogy', 'Passage A’s view of interpretation is most closely analogous to which one of the following?',
      ['Working out what a friend meant by a remark from the words used and the situation', 'Choosing the reading of a song one likes best', 'Translating a poem word by word without regard to sense', 'Finding new uses for an old tool', 'Judging a painting only by its colours'],
      '<p>A says we infer intentions "as we infer the meaning of a friend’s remark". {A}. {D} resembles Passage B’s view.</p>'),
  ],
};
