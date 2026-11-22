// LSAT RC comparative passages (political science): ranked-choice voting. Original, written for fibub.
import { rc } from './h.js';
const it = rc('p4');
export default {
  group: 'p4',
  passage: { title: 'Comparative reading: Passage A and Passage B on ranked ballots', passage: `<p><b>Passage A</b></p>
<p>In most elections for a single office, each voter marks one candidate and whoever receives the most votes wins, even if that is well short of a majority. When three or more candidates run, this system can produce a winner most voters opposed, and it punishes voters who prefer a candidate unlikely to win: by voting sincerely, they may help elect the candidate they like least. Ranked-choice voting addresses both problems. Voters rank the candidates in order of preference; if no one has a majority of first choices, the last-place candidate is eliminated and those ballots move to their next choice, until one candidate has a majority. Voters can support a long-shot candidate first without wasting their vote, and the winner can claim the support, at least as a later preference, of a majority of the ballots still counting at the end. Jurisdictions that have adopted the system report that voters understand it and that campaigns become less negative, since candidates seek to be others’ second choice.</p>
<p><b>Passage B</b></p>
<p>Ranked-choice voting is often presented as a remedy for the flaws of plurality elections, and it does reduce some of them. But its advocates tend to overstate what it guarantees. The "majority" it produces is a majority of the ballots remaining in the final round; ballots that ranked only eliminated candidates are set aside, so the winner may still fall short of a majority of all voters. More importantly, the method can eliminate early a candidate whom most voters would have preferred to each rival in a head-to-head contest, if that candidate has few first choices. And it is not immune to the strategic voting it claims to end: in some circumstances, a voter can help a favoured candidate by ranking that candidate lower. None of these problems is decisive, since every voting method has flaws of some kind. The question for a jurisdiction is not whether ranked-choice voting is perfect but whether its particular trade-offs suit the elections it will be used for.</p>` },
  items: [
    it('lsat-rcc-401', 3, 'relationship', 'Which one of the following best describes the relationship between the passages?',
      ['Passage A argues for ranked-choice voting, and Passage B grants some of its benefits while arguing that its guarantees are overstated.', 'Passage B argues that ranked-choice voting should be banned.', 'Both passages argue for plurality voting.', 'Passage A criticises ranked-choice voting, and Passage B defends it.', 'The passages agree on every point.'],
      '<p>B: "it does reduce some of them. But its advocates tend to overstate what it guarantees." {A}. B never calls for a ban.</p>'),
    it('lsat-rcc-402', 3, 'shared view', 'Both authors would most likely agree that plurality voting',
      ['has flaws when three or more candidates run', 'is the fairest system available', 'always produces a majority winner', 'eliminates strategic voting', 'is used only rarely'],
      '<p>A describes its flaws; B calls ranked-choice "a remedy for the flaws of plurality elections" that "does reduce some of them". {A}.</p>'),
    it('lsat-rcc-403', 4, 'disagreement', 'The authors would most likely disagree about whether',
      ['ranked-choice voting ensures that the winner has majority support among voters', 'voters can rank candidates under ranked-choice voting', 'the last-place candidate is eliminated in each round', 'plurality voting can produce a winner most voters opposed', 'every voting method has some flaws'],
      '<p>A says the winner "can claim the support ... of a majority"; B says that majority is only of remaining ballots and "may still fall short of a majority of all voters". {A}.</p>'),
    it('lsat-rcc-404', 4, 'detail', 'Which one of the following claims appears in Passage A but not in Passage B?',
      ['Campaigns become less negative under ranked-choice voting.', 'Ballots that rank only eliminated candidates are set aside.', 'A voter can sometimes help a candidate by ranking that candidate lower.', 'Every voting method has flaws.', 'The method can eliminate a candidate who would win head-to-head contests.'],
      '<p>Only A reports less negative campaigns. {B} through {E} are B’s points.</p>'),
    it('lsat-rcc-405', 5, 'precision', 'Passage A’s phrase "a majority of the ballots still counting at the end" is most relevant to which point in Passage B?',
      ['The winner may fall short of a majority of all voters because some ballots are set aside.', 'Voters can help a favoured candidate by ranking it lower.', 'A candidate with few first choices may be eliminated early.', 'Every voting method has flaws.', 'Plurality elections reward long-shot candidates.'],
      '<p>A’s careful wording concedes the very point B presses: the majority is of remaining ballots, not of all voters. {A}.</p>'),
    it('lsat-rcc-406', 5, 'author’s view', 'The author of Passage B would most likely advise a city considering ranked-choice voting to',
      ['weigh its specific trade-offs against the kinds of elections the city holds', 'reject it because it is not perfect', 'adopt it because it ends strategic voting', 'keep plurality voting because it has no flaws', 'let candidates choose the voting method'],
      '<p>"The question for a jurisdiction is not whether ranked-choice voting is perfect but whether its particular trade-offs suit the elections it will be used for." {A}.</p>'),
  ],
};
