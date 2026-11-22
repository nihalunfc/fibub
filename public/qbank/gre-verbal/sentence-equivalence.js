// GRE Sentence Equivalence: pick the two words that complete the sentence and give it the same meaning.
// Original sentences, written for fibub. Each item lists the pair first; positions are spread by the id.
const E = ['gre'];
const h = (id) => [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
const se = (id, level, q, pair, others, sol, trap) => {
  const all = [...pair, ...others], o = all.slice().sort((a, b) => (h(id + a) * 7919) % 101 - (h(id + b) * 7919) % 101 || a.localeCompare(b));
  return { id, type: 'msq', level, exams: E, format: 'multi', sub: 'sentence equivalence', q: `<p>${q}</p><p>Select the <b>two</b> words that each complete the sentence and give it the same meaning.</p>`,
    options: o, answer: pair.map((w) => o.indexOf(w)).sort((a, b) => a - b), sol: `<p>${sol}</p>`, ...(trap ? { trap } : {}) };
};
export default {
  topic: 'sentence-equivalence',
  items: [
    se('se-001', 1, 'After weeks of rain, the farmers were ______ to see the sun at last.', ['delighted', 'thrilled'], ['worried', 'indifferent', 'reluctant', 'puzzled'],
      'After weeks of rain, seeing the sun is good news: <b>delighted</b> and <b>thrilled</b> both mean very pleased.'),
    se('se-002', 2, 'The instructions were so ______ that even first-time users assembled the shelf in minutes.', ['clear', 'lucid'], ['vague', 'lengthy', 'technical', 'obscure'],
      'Assembling in minutes on the first try means the instructions were easy to follow: <b>clear</b> and <b>lucid</b>.'),
    se('se-003', 2, 'Despite his ______ manner in meetings, the director was known to be generous and warm in private.', ['brusque', 'curt'], ['cheerful', 'gentle', 'tardy', 'verbose'],
      '"Despite" contrasts the meeting manner with generous and warm: it must be unfriendly and short. <b>Brusque</b> and <b>curt</b> both mean abrupt.', 'Verbose means wordy, which is not the opposite of warm.'),
    se('se-004', 3, 'The museum\'s new wing was praised for its ______ design, which used a few simple materials to striking effect.', ['austere', 'spare'], ['lavish', 'ornate', 'chaotic', 'derivative'],
      'A few simple materials describe a plain, stripped-back design: <b>austere</b> and <b>spare</b>.', 'Lavish and ornate mean the opposite.'),
    se('se-005', 3, 'The witness\'s account was ______: every detail she gave was later confirmed by the security footage.', ['accurate', 'precise'], ['fabricated', 'emotional', 'brief', 'confused'],
      'Every detail confirmed means the account was correct in its details: <b>accurate</b> and <b>precise</b>.'),
    se('se-006', 3, 'Rather than ______ the dispute, the mediator\'s blunt comments only made both sides angrier.', ['defusing', 'calming'], ['inflaming', 'recording', 'prolonging', 'ignoring'],
      '"Rather than" sets up the opposite of making the sides angrier: <b>defusing</b> and <b>calming</b> the dispute.', 'Inflaming describes what actually happened, not what was expected.'),
    se('se-007', 4, 'Once a ______ supporter of the plan, the senator now criticises it at every opportunity.', ['staunch', 'steadfast'], ['reluctant', 'wavering', 'secret', 'recent'],
      '"Once … now criticises it at every opportunity" shows a dramatic change, so earlier support was strong and loyal: <b>staunch</b> and <b>steadfast</b>.', 'Wavering support would make the change unsurprising.'),
    se('se-008', 4, 'The startup\'s early success proved ______: within two years its sales had collapsed.', ['ephemeral', 'fleeting'], ['lasting', 'deserved', 'modest', 'profitable'],
      'Success that collapsed within two years was short-lived: <b>ephemeral</b> and <b>fleeting</b>.'),
    se('se-009', 4, 'The critic\'s review was ______, praising the actors but finding fault with almost every other part of the production.', ['mixed', 'ambivalent'], ['glowing', 'scathing', 'anonymous', 'brief'],
      'Praise for the actors plus faults everywhere else is a review that goes both ways: <b>mixed</b> and <b>ambivalent</b>.', 'Scathing ignores the praise; glowing ignores the faults.'),
    se('se-010', 5, 'Her argument, though ______ at first hearing, collapses once one notices that it assumes what it sets out to prove.', ['plausible', 'convincing'], ['absurd', 'circular', 'tedious', 'original'],
      '"Though … at first hearing, collapses" needs a word for seeming right at first: <b>plausible</b> and <b>convincing</b>.', 'Circular describes the flaw, but the blank describes the first impression.'),
    se('se-011', 5, 'The official\'s statement was so ______ that journalists could not tell whether the project had been cancelled or merely delayed.', ['equivocal', 'evasive'], ['forthright', 'emphatic', 'lengthy', 'hostile'],
      'Leaving journalists unsure what happened means the statement avoided a clear answer: <b>equivocal</b> and <b>evasive</b>.', 'Lengthy can still be clear; the point is the lack of a clear answer.'),
    se('se-012', 5, 'Far from being ______, the scientist\'s conclusion rested on twenty years of patient measurement.', ['hasty', 'rash'], ['careful', 'tentative', 'famous', 'disputed'],
      '"Far from being" needs the opposite of twenty years of patient work: <b>hasty</b> and <b>rash</b>.', 'Careful describes the actual work; the sentence needs its opposite.'),
  ],
};
