// LSAT RC passage (history): craft guilds and marks of quality. Original, written for fibub.
import { rc } from './h.js';
const it = rc('p4');
export default {
  group: 'p4',
  passage: { title: 'Passage: what medieval guilds were really for', passage: `<p>Craft guilds, the associations of master artisans that regulated trades such as weaving, metalworking and baking in many medieval and early modern European towns, have long had a poor reputation among economists. In the classic account, guilds were cartels. By limiting the number of masters, fixing prices and forbidding outsiders to practise the trade, they raised their members’ incomes at the expense of customers and of the many workers kept out. Their eventual abolition, on this account, freed markets that had been held back for centuries.</p>
<p>A number of historians have argued that this picture leaves out what guilds did for buyers. In a world without brand names, standardised measures or reliable courts, a customer buying cloth or silver faced a serious problem: it was hard to tell good work from bad before purchase, and costly to seek a remedy afterwards. Guilds addressed this by inspecting goods and stamping approved items with a mark, by enforcing rules on materials, such as the proportion of pure metal in silverware, and by punishing members whose work fell short. A buyer from a distant town who saw the mark of a respected guild could trust the goods without knowing the maker. On this view, guilds lowered the cost of trust and so made trade possible that would otherwise not have occurred.</p>
<p>The two accounts need not exclude each other, and the most careful recent work treats them as describing different sides of the same institution. The same powers that let a guild guarantee quality, the power to inspect and to exclude, also let it restrict entry and keep prices high. Which side predominated seems to have depended on circumstances. Where a town’s goods were sold mainly to distant buyers, a guild’s reputation was its members’ most valuable asset, and quality rules were enforced strictly. Where guilds served a captive local market, the evidence of price fixing and exclusion is stronger.</p>
<p>The question matters beyond economic history. Modern professions, from medicine to law, also combine licensing that protects the public with barriers to entry that protect members, and debates about them often repeat the old disagreement. The history of guilds suggests that asking whether such bodies are good or bad is less useful than asking under what conditions their protective function outweighs their restrictive one.</p>` },
  items: [
    it('lsat-rdi-401', 3, 'detail', 'According to the passage, the classic account holds that guilds',
      ['raised members’ incomes at the expense of customers and excluded workers', 'protected buyers from poor-quality goods', 'were abolished because they failed to inspect goods', 'served only distant buyers', 'were the origin of modern brand names'],
      '<p>Paragraph 1 gives the "cartel" account: {A}. {B} is the historians’ alternative view.</p>'),
    it('lsat-rdi-402', 3, 'detail', 'The passage mentions the proportion of pure metal in silverware as an example of',
      ['a rule about materials that a guild enforced', 'a price that guilds fixed', 'a reason guilds were abolished', 'a mark stamped on approved goods', 'a modern licensing requirement'],
      '<p>"by enforcing rules on materials, such as the proportion of pure metal in silverware". {A}.</p>'),
    it('lsat-rdi-403', 4, 'inference', 'It can be inferred from the passage that a guild selling mainly to distant buyers would be likely to',
      ['enforce its quality rules strictly to protect its reputation', 'show the strongest evidence of price fixing', 'have no mark of approval', 'allow anyone to join', 'stop inspecting goods'],
      '<p>Paragraph 3: where goods went to distant buyers, reputation was "most valuable" and "quality rules were enforced strictly". {A}. {B} matches captive local markets.</p>'),
    it('lsat-rdi-404', 4, 'inference', 'Which one of the following best expresses the point of the claim that the same powers let a guild both guarantee quality and restrict entry?',
      ['The protective and restrictive sides of guilds came from one set of powers, so the two accounts describe one institution.', 'Guilds always used their powers in the same way.', 'Inspection was unrelated to the power to exclude.', 'The classic account is simply false.', 'Guilds had no power to keep prices high.'],
      '<p>The paragraph says the accounts describe "different sides of the same institution" because inspection and exclusion powers serve both ends. {A}. {D} is too strong.</p>'),
    it('lsat-rdi-405', 5, 'application', 'The author would most likely recommend that a debate about a modern licensing body focus on',
      ['the conditions under which its protection of the public outweighs its restriction of entry', 'whether the body is good or bad in general', 'how many members it has', 'whether it existed in the Middle Ages', 'how it marks approved products'],
      '<p>Last sentence: asking good or bad "is less useful than asking under what conditions their protective function outweighs their restrictive one." {A}; {B} is what the author calls less useful.</p>'),
    it('lsat-rdi-406', 5, 'organisation', 'Which one of the following best describes the organisation of the passage?',
      ['A traditional view is stated, an alternative view is presented, the two are reconciled, and the lesson is applied more broadly.', 'Two views are presented and the second is shown to be false.', 'A history is told in chronological order and ends with the abolition of guilds.', 'A modern problem is described and solved by a historical example.', 'A theory is proposed and then tested against statistical data.'],
      '<p>P1 cartel view; P2 trust view; P3 reconciliation; P4 application to modern professions. {A}.</p>'),
  ],
};
