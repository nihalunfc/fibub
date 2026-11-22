// English bank: academic words (the general academic vocabulary of essays, lectures and reports:
// analyse, significant, factor, approach...). Original items written for fibub.
// mcq options are written correct-first and placed by ROT so the answer letters spread over A-D.
// Append new items at the end with new ids; never reuse an id.
const EX = ['ielts', 'celpip', 'toefl'];
const F = { skill: 'vocabulary' };
const ROT = [0, 2, 1, 3, 3, 1, 2, 0, 2, 3, 0, 1];
let n = 0;
const m = (id, level, q, opts, sol, sub) => { const k = ROT[n++ % ROT.length]; const o = opts.slice(1); o.splice(k, 0, opts[0]); return { id, type: 'mcq', level, exams: EX, facets: F, sub, q, options: o, answer: k, sol }; };
const t = (id, level, q, answer, sol, sub) => ({ id, type: 'text', level, exams: EX, facets: F, sub, q, answer: [].concat(answer), maxWords: 1, sol });
const o = (id, level, q, s, sol, sub) => ({ id, type: 'order', level, exams: EX, facets: F, sub, q, options: s.split(' ').sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())), answer: [s], sol });
const mean = (w) => `Which word or phrase is closest in meaning to <b>${w}</b>?`;

export default {
  topic: 'academic-words',
  items: [
    m('aw-001', 1, mean('obtain'), ['get', 'lose', 'give', 'keep back'], '<b>Obtain</b> = get (more formal).', 'meaning'),
    m('aw-002', 1, mean('require'), ['need', 'refuse', 'allow', 'offer'], '<b>Require</b> = need.', 'meaning'),
    m('aw-003', 1, mean('assist'), ['help', 'stop', 'watch', 'follow'], '<b>Assist</b> = help.', 'meaning'),
    m('aw-004', 1, mean('approximately'), ['about', 'exactly', 'never', 'quickly'], '<b>Approximately</b> = about, roughly.', 'meaning'),
    m('aw-005', 1, mean('purchase'), ['buy', 'sell', 'borrow', 'return'], '<b>Purchase</b> = buy.', 'meaning'),
    m('aw-006', 1, mean('sufficient'), ['enough', 'too much', 'very little', 'extra'], '<b>Sufficient</b> = enough.', 'meaning'),
    m('aw-007', 2, mean('significant'), ['important', 'tiny', 'recent', 'secret'], '<b>Significant</b> = important or large enough to notice.', 'meaning'),
    m('aw-008', 2, mean('indicate'), ['show', 'hide', 'change', 'repeat'], '<b>Indicate</b> = show or suggest.', 'meaning'),
    m('aw-009', 2, mean('factor'), ['a cause or reason', 'a final result', 'a kind of tool', 'a total number'], 'A <b>factor</b> is one of the things that cause a result.', 'meaning'),
    m('aw-010', 2, mean('approach'), ['a way of dealing with something', 'a final answer', 'a kind of problem', 'an exam result'], 'An <b>approach</b> (noun) is a way of dealing with something.', 'meaning'),
    m('aw-011', 2, mean('consequence'), ['a result', 'a reason', 'a beginning', 'a guess'], 'A <b>consequence</b> is a result, often a bad one.', 'meaning'),
    m('aw-012', 2, mean('maintain'), ['keep', 'lose', 'build', 'sell'], '<b>Maintain</b> = keep something at the same level, or keep it in good condition.', 'meaning'),
    m('aw-013', 2, mean('primary'), ['main', 'last', 'minor', 'second'], '<b>Primary</b> = main, most important (or first).', 'meaning'),
    m('aw-014', 2, mean('estimate'), ['make a rough calculation', 'measure exactly', 'forget', 'copy'], 'To <b>estimate</b> is to guess an amount from what you know.', 'meaning'),
    m('aw-015', 3, mean('acquire'), ['gain', 'reject', 'lend', 'waste'], '<b>Acquire</b> = gain or get, often over time (acquire skills, acquire a company).', 'meaning'),
    m('aw-016', 3, mean('constrain'), ['limit', 'expand', 'measure', 'praise'], '<b>Constrain</b> = limit or hold back.', 'meaning'),
    m('aw-017', 3, mean('derive'), ['come from', 'go towards', 'replace', 'pay for'], 'To <b>derive from</b> = to come from a source.', 'meaning'),
    m('aw-018', 3, mean('inherent'), ['part of the basic nature of something', 'added later from outside', 'easy to remove', 'happening by chance'], 'An <b>inherent</b> risk is built in; it cannot be separated from the thing.', 'meaning'),
    m('aw-019', 3, mean('subsequent'), ['later', 'earlier', 'main', 'secret'], '<b>Subsequent</b> = coming after.', 'meaning'),
    m('aw-020', 3, mean('ambiguous'), ['having more than one meaning', 'very clear', 'very old', 'very common'], '<b>Ambiguous</b> = unclear, because it can be understood in more than one way.', 'meaning'),
    m('aw-021', 3, mean('adequate'), ['good enough', 'excellent', 'far too little', 'unknown'], '<b>Adequate</b> = enough or good enough, but not more.', 'meaning'),
    m('aw-022', 3, mean('hypothesis'), ['an idea to be tested', 'a proven law', 'a final report', 'a list of data'], 'A <b>hypothesis</b> is an idea that an experiment tests.', 'meaning'),
    m('aw-023', 3, mean('allocate'), ['give out for a purpose', 'take back', 'count again', 'throw away'], 'To <b>allocate</b> money or time is to give it for a particular use.', 'meaning'),
    m('aw-024', 3, mean('diminish'), ['become smaller', 'become larger', 'stay the same', 'disappear at once'], '<b>Diminish</b> = become or make smaller or weaker.', 'meaning'),
    m('aw-025', 4, mean('mitigate'), ['make less severe', 'make worse', 'explain fully', 'measure'], 'To <b>mitigate</b> a problem is to reduce how bad it is.', 'meaning'),
    m('aw-026', 4, mean('comprehensive'), ['complete and including everything', 'short and simple', 'hard to understand', 'out of date'], 'A <b>comprehensive</b> study covers everything. Not the same as <i>comprehensible</i> (easy to understand).', 'meaning'),
    m('aw-027', 4, mean('substantiate'), ['support with evidence', 'replace with another', 'make smaller', 'question'], 'To <b>substantiate</b> a claim is to give evidence for it.', 'meaning'),
    m('aw-028', 4, mean('prevalent'), ['common or widespread', 'rare', 'dangerous', 'new'], '<b>Prevalent</b> = common in a place or group.', 'meaning'),
    m('aw-029', 4, mean('discrepancy'), ['a difference that should not be there', 'an exact match', 'a calculation', 'a summary'], 'A <b>discrepancy</b> is a gap between two things that should agree.', 'meaning'),
    m('aw-030', 4, mean('feasible'), ['possible and practical', 'impossible', 'expensive', 'popular'], 'A <b>feasible</b> plan can be done.', 'meaning'),
    m('aw-031', 4, mean('implicit'), ['suggested but not said directly', 'stated clearly', 'false', 'written down'], '<b>Implicit</b> = understood without being said. The opposite is <i>explicit</i>.', 'meaning'),
    m('aw-032', 4, mean('undermine'), ['weaken gradually', 'support', 'dig up', 'explain'], 'To <b>undermine</b> something is to make it weaker, often slowly or secretly.', 'meaning'),
    m('aw-033', 5, mean('ubiquitous'), ['found everywhere', 'found nowhere', 'very costly', 'very old'], '<b>Ubiquitous</b> = seeming to be everywhere (smartphones are ubiquitous).', 'meaning'),
    m('aw-034', 5, mean('exacerbate'), ['make worse', 'make better', 'start', 'end'], 'To <b>exacerbate</b> a problem is to make it worse.', 'meaning'),
    m('aw-035', 5, mean('tenuous'), ['very weak or slight', 'very strong', 'clearly proven', 'long-lasting'], 'A <b>tenuous</b> link is weak and hard to believe.', 'meaning'),
    m('aw-036', 5, mean('corroborate'), ['confirm with more evidence', 'deny', 'invent', 'hide'], 'To <b>corroborate</b> a story is to support it with more evidence.', 'meaning'),
    m('aw-037', 5, mean('paradigm'), ['a typical model or way of thinking', 'a small mistake', 'a type of graph', 'a short story'], 'A <b>paradigm</b> is a model or pattern of thinking (a paradigm shift is a big change in it).', 'meaning'),
    m('aw-038', 5, mean('salient'), ['most noticeable or important', 'least useful', 'hidden', 'salty'], 'The <b>salient</b> points are the main ones.', 'meaning'),
    m('aw-039', 2, 'The results ______ that the new method works better.', ['suggest', 'suggestion', 'suggestive', 'suggestively'], 'A verb after the subject <i>The results</i>: <b>suggest</b>.', 'in context'),
    m('aw-040', 2, 'We need to ______ the data before we draw any conclusions.', ['analyze', 'analysis', 'analytical', 'analyst'], 'After <i>need to</i> we need a base verb: <b>analyze</b> (UK: analyse).', 'in context'),
    m('aw-041', 3, 'Several ______ affect how much people earn, such as education and location.', ['factors', 'results', 'conclusions', 'outcomes'], '<b>Factors</b> are things that cause or influence a result.', 'in context'),
    m('aw-042', 3, 'The study ______ on children aged 8 to 12.', ['focused', 'aimed', 'pointed', 'looked'], 'We say <b>focus on</b> a group or topic.', 'in context'),
    m('aw-043', 3, 'The museum receives ______ funding from the city: about half its budget.', ['substantial', 'substance', 'substantially', 'substitute'], '<b>Substantial</b> = large in amount; an adjective before <i>funding</i>.', 'in context'),
    m('aw-044', 3, 'The rise in prices was a direct ______ of the poor harvest.', ['consequence', 'reason', 'cause', 'factor'], 'The price rise came after and because of the harvest: it is a <b>consequence</b> (result).', 'in context'),
    m('aw-045', 4, 'The author fails to ______ between correlation and cause.', ['distinguish', 'separate out', 'differ', 'divide'], 'We say <b>distinguish between</b> two things.', 'in context'),
    m('aw-046', 4, 'The theory is ______ on two key assumptions.', ['based', 'depended', 'relied', 'rested'], 'We say <b>be based on</b>. <i>Depend, rely</i> and <i>rest</i> take <i>on</i> too, but they are not used in the passive like this.', 'in context'),
    m('aw-047', 4, 'The figures are ______ with earlier research, which found the same pattern.', ['consistent', 'constant', 'insistent', 'persistent'], '<b>Consistent with</b> = agreeing with.', 'in context'),
    m('aw-048', 4, 'There is little ______ evidence to support this view; it is mostly opinion.', ['empirical', 'empire', 'emotional', 'imperial'], '<b>Empirical</b> evidence comes from observation or experiment.', 'in context'),
    m('aw-049', 5, 'The policy had a number of ______ consequences that nobody had planned.', ['unintended', 'unattended', 'unintelligent', 'intensive'], '<b>Unintended</b> = not planned. <i>Unattended</i> = left alone with nobody watching.', 'in context'),
    m('aw-050', 5, 'Her research ______ earlier claims that the drug was safe.', ['refuted', 'refused', 'reflected', 'refunded'], '<b>Refute</b> = prove a claim wrong.', 'in context'),
    t('aw-051', 2, 'Write the academic word that means "to show something is true": d______.', ['demonstrate'], '<b>Demonstrate</b> = show clearly.', 'recall'),
    t('aw-052', 2, 'Write the academic word that means "a period of ten years": d______.', ['decade'], 'A <b>decade</b> is ten years.', 'recall'),
    t('aw-053', 3, 'Write the academic word that means "to say what a word means": d______.', ['define'], 'To <b>define</b> a word is to give its meaning.', 'recall'),
    t('aw-054', 3, 'Write the academic word that means "a general direction of change": t______.', ['trend'], 'A <b>trend</b> is the general way something is changing.', 'recall'),
    t('aw-055', 3, 'Write the academic word that means "the people who take part in a study": p______.', ['participants'], '<b>Participants</b> are the people in a study.', 'recall'),
    t('aw-056', 4, 'Write the academic word that means "to examine a claim and judge its strengths and weaknesses": e______.', ['evaluate'], 'To <b>evaluate</b> is to judge how good or useful something is.', 'recall'),
    t('aw-057', 4, 'Write the academic word that means "something accepted as true without proof": a______.', ['assumption'], 'An <b>assumption</b> is something you take for granted.', 'recall'),
    t('aw-058', 5, 'Write the academic word that means "a way of counting or measuring progress": i______.', ['indicator'], 'An <b>indicator</b> (such as GDP) measures how something is doing.', 'recall'),
    t('aw-059', 5, 'Write the academic word that means "to make an idea clear by giving examples": i______.', ['illustrate'], 'To <b>illustrate</b> a point is to explain it with examples or pictures.', 'recall'),
    o('aw-060', 3, 'Put the words in order to make an academic sentence.', 'The results indicate a strong link between sleep and memory', '<b>Indicate</b> = show; <b>a strong link between</b> A and B.', 'in context'),
    o('aw-061', 4, 'Put the words in order to make an academic sentence.', 'Further research is required to confirm these findings', '<b>Further research is required</b> is a common academic phrase.', 'in context'),
    o('aw-062', 5, 'Put the words in order to make an academic sentence.', 'These figures should be interpreted with caution', 'A careful (hedged) academic sentence: <b>interpreted with caution</b>.', 'in context'),
  ],
};
