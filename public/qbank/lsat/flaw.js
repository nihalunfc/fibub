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
  ],
};
