// Vocabulary range for CELPIP writing (lesson 4.6). Original items by fibub.
const precise = [
  ['The hotel room was <b>very dirty</b>.', 'filthy', ['tidy', 'spotless', 'dusty-free']],
  ['The new schedule is <b>very good</b> for parents with young children.', 'ideal', ['adequate', 'average', 'awful']],
  ['The price of the course went <b>up a lot</b> this year.', 'rose sharply', ['dropped slightly', 'stayed stable', 'rose slowly']],
  ['I was <b>very tired</b> after the double shift.', 'exhausted', ['refreshed', 'sleepy-ish', 'energetic']],
  ['The staff were <b>nice and helpful</b>.', 'courteous', ['careless', 'rude', 'distant']],
  ['The meeting room is <b>too small</b> for twenty people.', 'cramped', ['spacious', 'roomy', 'empty']],
  ['Please <b>give back</b> the deposit I paid.', 'refund', ['charge', 'invest', 'withdraw']],
  ['The noise from the construction <b>bothers</b> me every morning.', 'disturbs', ['delights', 'calms', 'informs']],
  ['The bus is <b>not on time a lot</b>.', 'frequently late', ['always punctual', 'rarely late', 'slightly early']],
  ['The library would be <b>good for</b> students.', 'beneficial to', ['harmful to', 'similar to', 'equal to']],
  ['I want to <b>say sorry</b> for missing the deadline.', 'apologize', ['complain', 'celebrate', 'congratulate']],
  ['The tap has been <b>making water come out slowly</b> all week.', 'dripping', ['flooding', 'boiling', 'freezing']],
];
const items = precise.map(([s, a, wrong], i) => ({ id: `wv-p${i + 1}`, type: 'mcq', q: `Choose the most precise replacement for the words in bold: <i>${s}</i>`, options: [a, ...wrong], answer: 0, sol: `<b>${a}</b> says the same idea in one precise word or phrase. Precision is part of the Vocabulary rating.` }));
const colloc = [
  ['I would like to ___ a complaint about the service.', 'make', ['do', 'take', 'give']],
  ['Could you please ___ attention to the broken lock?', 'pay', ['make', 'do', 'put']],
  ['We need to ___ a decision by Friday.', 'make', ['do', 'take part', 'have done']],
  ['The new park would ___ a big difference to families.', 'make', ['do', 'give', 'get']],
  ['I hope you can ___ me a favour.', 'do', ['make', 'take', 'have']],
  ['Volunteers ___ an important role in our community.', 'play', ['make', 'do', 'take']],
  ['The council should ___ action before winter.', 'take', ['make', 'do', 'give']],
  ['I am writing to ___ my concerns about the parking rules.', 'express', ['say', 'tell', 'speak']],
];
colloc.forEach(([s, a, wrong], i) => items.push({ id: `wv-c${i + 1}`, type: 'mcq', q: `Choose the natural word partner (collocation): <i>${s}</i>`, options: [a, ...wrong], answer: 0, sol: `English says "<b>${s.replace('___', a)}</b>". Natural word partners show accurate vocabulary.` }));
const wrongWord = [
  ['I am very <b>sensible</b> to loud noise.', 'sensitive', ['sensible', 'sensational', 'senseless'], 'Sensible means having good judgment; sensitive means easily affected.'],
  ['The trip was very <b>economic</b>; it only cost $40.', 'economical', ['economic', 'economy', 'economist'], 'Economic is about the economy; economical means cheap to run or buy.'],
  ['Please <b>borrow</b> me your ladder this weekend.', 'lend', ['borrow', 'loan from', 'rent from'], 'You lend something to someone; you borrow something from someone.'],
  ['The new rules will <b>effect</b> all tenants.', 'affect', ['effect', 'infect', 'reflect'], 'Affect is usually the verb; effect is usually the noun.'],
];
wrongWord.forEach(([s, a, opts, w], i) => items.push({ id: `wv-w${i + 1}`, type: 'mcq', q: `The bold word is used wrongly. Choose the right word: <i>${s}</i>`, options: [a, ...opts.slice(1), 'no change needed'], answer: 0, sol: w }));
items.push(
  { id: 'wv-t1', type: 'text', q: 'Write one word that means "not expensive" and sounds positive: "The gym membership is very ___."', answer: ['affordable', 'reasonable', 'inexpensive', 'economical'], maxWords: 1, sol: '<b>affordable</b> (also reasonable, inexpensive, economical). "Cheap" can sound like low quality.' },
  { id: 'wv-t2', type: 'text', q: 'One word for "easy to reach or use": "The new clinic is ___ by bus."', answer: ['accessible', 'reachable'], maxWords: 1, sol: '<b>accessible</b>.' },
  { id: 'wv-r1', type: 'mcq', q: 'An answer uses "important" five times. What is the best fix?', options: ['Vary it with essential, vital, a priority, key', 'Keep it, repetition is clear', 'Replace all with "importantly"', 'Delete every sentence that uses it'], answer: 0, sol: 'Range matters. Swap some repeats for accurate synonyms, but only words you are sure of.' },
  { id: 'wv-r2', type: 'mcq', q: 'Which is the safest way to show vocabulary range?', options: ['Use precise words you know well, correctly', 'Use rare words from a thesaurus you have never used', 'Write very long words only', 'Copy words from the task'], answer: 0, sol: 'A wrong "fancy" word lowers accuracy. Precise everyday words used correctly score better.', trap: 'Thesaurus words often have the wrong shade of meaning.' },
);
export default { title: 'Vocabulary range', items };
