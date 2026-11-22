// LSAT · Logical Reasoning · Flaw. Every argument is original and written for fibub.
const F = { section: 'lr', qtype: 'flaw' };
const Q = 'The reasoning in the argument is most vulnerable to criticism on the grounds that the argument';
import { place } from './_util.js';
const it = (id, level, arg, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${Q}</p>`, options, answer, sol, trap });
export default {
  topic: 'flaw',
  items: [
    it('lsat-fl-001', 2, 'Everyone who has won the town marathon trained by running at least fifty kilometres a week. Sam runs fifty kilometres a week, so he will win the marathon this year.',
      ['relies on a source that may be biased', 'treats something that is needed for winning as if it guaranteed winning', 'draws a conclusion about a group from one member', 'uses a key word in two different senses', 'attacks a person instead of an argument'], 1,
      '<p>Winners all trained hard, so hard training is necessary. It does not follow that hard training is enough. Many people may run fifty kilometres a week and not win. This is the necessary-versus-sufficient flaw.</p>', ''),
    it('lsat-fl-002', 3, 'Dr. Lee says that the new road will harm the wetland. But Dr. Lee owns land that would lose value if the road were built, so her claim about the wetland should be dismissed.',
      ['generalises from too few cases', 'rejects a claim because of something about the person making it, rather than the evidence for it', 'confuses cause and effect', 'assumes that what is true of the parts is true of the whole', 'presents only two options when there are more'], 1,
      '<p>Dr. Lee\'s interest may be a reason to check her evidence, but it does not show her claim is false. Dismissing a claim because of who makes it is an attack on the person (ad hominem).</p>', ''),
    it('lsat-fl-003', 3, 'Each player on our team is among the best in the league at their position. So our team is the best team in the league.',
      ['assumes that because each part has a quality, the whole has it too', 'relies on a sample that is too small', 'takes for granted that the league is fair', 'confuses a correlation with a cause', 'uses circular reasoning'], 0,
      '<p>A group of excellent individuals may not play well together. Moving from "each part is excellent" to "the whole is excellent" is the part-to-whole flaw.</p>', ''),
    it('lsat-fl-004', 4, 'Either we raise ticket prices or the theatre will have to close. Closing the theatre is unacceptable. So we must raise ticket prices.',
      ['fails to consider that there may be other ways to keep the theatre open, such as fundraising or cutting costs', 'assumes that raising prices will reduce attendance', 'relies on an appeal to tradition', 'confuses what is likely with what is certain', 'attacks the motives of those who disagree'], 0,
      '<p>The argument offers only two options. If there are others (donations, grants, cutting costs), the conclusion does not follow. This is a false choice.</p>', ''),
    it('lsat-fl-005', 4, 'In a survey, people who drink green tea every day reported less stress than people who do not. So drinking green tea reduces stress.',
      ['fails to consider that people who are less stressed may be more likely to make time for a daily tea habit, rather than the tea lowering stress', 'relies on a survey with too many people', 'assumes that green tea is healthy', 'uses the word "stress" in two senses', 'presents a claim as true because many people believe it'], 0,
      '<p>The link could run the other way: calmer people may be the ones with time for a daily tea ritual. Treating a correlation as proof that one thing causes the other, without ruling out reverse causation, is the flaw.</p>', ''),
    it('lsat-fl-006', 5, 'Critics have not shown that the new fertiliser harms the soil. Therefore it is safe for the soil.',
      ['treats the lack of evidence that something is harmful as proof that it is safe', 'relies on experts outside their field', 'assumes what is true of one soil is true of all', 'confuses a necessary condition with a sufficient one', 'draws a conclusion from a biased sample'], 0,
      '<p>No one having shown harm does not show there is no harm; perhaps no one has tested it. Treating absence of evidence as evidence of absence is the flaw.</p>', ''),
    it('lsat-fl-101', 2, 'My neighbour says the new park will reduce crime. But my neighbour has never lived anywhere except this town, so the claim cannot be right.',
      ['attacks the person making a claim rather than the claim itself', 'relies on a sample that is too small', 'confuses a cause with an effect', 'assumes that what is true of a whole is true of each part', 'treats a necessary condition as a sufficient one'], 0,
      '<p>Where the neighbour has lived says nothing about whether parks reduce crime. The argument rejects the claim because of who made it. {A}.</p>'),
    it('lsat-fl-102', 3, 'If the shipment had been lost, the warehouse would have sent a notice. The warehouse sent a notice. So the shipment was lost.',
      ['takes a condition that would guarantee a result to be the only possible explanation of that result', 'relies on an unrepresentative sample', 'attacks the source of a claim', 'uses a key term in two different senses', 'assumes what it sets out to prove'], 0,
      '<p>Lost → notice. A notice does not prove loss: the warehouse may send notices for delays too. The argument affirms the consequent. {A}.</p>', 'Spotting the reversed conditional.'),
    it('lsat-fl-103', 4, 'Each of the band’s members is an excellent musician. Therefore the band must be an excellent band.',
      ['assumes that because each part of a group has a quality, the group as a whole has it', 'draws a conclusion from a sample that is too small', 'treats a correlation as proof of causation', 'attacks the critics of the band', 'relies on an appeal to popularity'], 0,
      '<p>Good individual players can still play badly together. Moving from parts to whole is the fallacy of composition. {A}.</p>'),
    it('lsat-fl-104', 5, 'Politician: My opponent says we must either raise taxes or cut services. But cutting services would harm families. So my opponent must want to raise taxes on families.',
      ['fails to consider that the opponent may favour some other way of balancing the budget, or tax increases that do not fall on families', 'uses statistics without stating their source', 'treats a sufficient condition as a necessary one', 'generalises from a single case', 'appeals to the authority of experts'], 0,
      '<p>The politician jumps from "raise taxes or cut services" to "raise taxes on families", ignoring that the taxes could fall on others, and treating the opponent’s framing as the only options. {A}.</p>'),
  ],
};
