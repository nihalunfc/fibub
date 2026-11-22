// Questions, indirect questions and word-order traps (lesson 4.2). Original by fibub; nothing copied from ETS.
// Part 1 builds indirect questions from original lists: every clause is joined to three of the frames.
const frames = ['could you tell me', 'do you know', 'I wonder', 'I have no idea', 'can you remind me'];
// [what the other person says, the hidden direct question, the clause in statement order]
const clauses = [
  ['I need to drop off this form.', 'Where is the registrar\'s office?', 'where the registrar\'s office is'],
  ['The review session is this week.', 'What time does it start?', 'what time it starts'],
  ['I missed the bus again.', 'When does the next bus leave?', 'when the next bus leaves'],
  ['The new lab manual is out.', 'How much does it cost?', 'how much it costs'],
  ['Our group meets tomorrow.', 'Which room did we book?', 'which room we booked'],
  ['The professor posted the grades.', 'Did everyone pass?', 'whether everyone passed'],
  ['The library is changing its hours.', 'Is it open late on Sundays?', 'if it is open late on Sundays'],
  ['Marco left the meeting early.', 'Why did he leave?', 'why he left'],
  ['There is a quiz on Friday.', 'What will it cover?', 'what it will cover'],
  ['They are building a new dorm.', 'When will it be finished?', 'when it will be finished'],
  ['I need to renew my student card.', 'How long does it take?', 'how long it takes'],
  ['The field trip is next month.', 'Where are we going?', 'where we are going'],
  ['Ana just got back from Japan.', 'How long was she there?', 'how long she was there'],
  ['The essay prompt changed.', 'What does the new one say?', 'what the new one says'],
  ['The speaker is famous, apparently.', 'What is she known for?', 'what she is known for'],
  ['This printer keeps jamming.', 'Who is in charge of fixing it?', 'who is in charge of fixing it'],
  ['The chemistry exam is in the big hall.', 'How many students will be there?', 'how many students will be there'],
  ['I lost my notes from Monday.', 'Has anyone shared theirs?', 'whether anyone has shared theirs'],
  ['The campus shuttle has a new route.', 'Does it stop near the stadium?', 'if it stops near the stadium'],
  ['My lab partner switched sections.', 'Why did she switch?', 'why she switched'],
  ['The scholarship deadline is close.', 'When do applications close?', 'when applications close'],
  ['The museum is free for students.', 'What do we need to show?', 'what we need to show'],
];
const items = [];
clauses.forEach(([said, direct, clause], i) => {
  for (let k = 0; k < 3; k++) {
    const f = frames[(i + k) % frames.length];
    const reply = `${f} ${clause}`;
    items.push({
      id: `w-qwo-i${String(i + 1).padStart(2, '0')}${'abc'[k]}`,
      type: 'order',
      q: `Build a sentence. <i>"${said}"</i> → reply (an indirect question):`,
      options: reply.split(' '),
      answer: [reply],
      sol: `"${reply[0].toUpperCase() + reply.slice(1)}${/^(could|do|can)/.test(f) ? '?' : '.'}" The direct question would be "${direct}" After "${f}", the question word is followed by statement order (subject, then verb)${/\b(does|do|did)\b/i.test(direct) ? ', and "do / does / did" disappears' : ''}.`,
      trap: `Do not keep question order inside: "${f} ${direct.replace('?', '').toLowerCase()}" is wrong.`,
    });
  }
});

// Part 2: direct questions. [situation, question, ...other correct orders]
const direct = [
  ['You want to know when the review session starts.', 'what time does the review session start'],
  ['You want to know how long your friend has waited.', 'how long have you been waiting'],
  ['You want to know who your classmate worked with.', 'who did you work with'],
  ['You want to know what the new library is like.', 'what is the new library like'],
  ['You want to know if your friend has ever studied online.', 'have you ever taken an online course'],
  ['You want to know who told your friend about the change.', 'who told you about the change'],
  ['You want to check that the lab closes at six.', 'the lab closes at six doesn\'t it'],
  ['You want to know why your friend did not come.', 'why didn\'t you come to the lecture'],
  ['You want to know how often the bus runs.', 'how often does the bus run on weekends', 'how often on weekends does the bus run'],
  ['You want to know whose laptop this is.', 'whose laptop is this'],
  ['You want to know which chapter you should read first.', 'which chapter should we read first'],
  ['You want to know what your friend is planning to do.', 'what are you planning to do after graduation', 'after graduation what are you planning to do'],
  ['You want to know who will lead the group.', 'who is going to lead the group'],
  ['You want to know how many pages the report needs.', 'how many pages does the report need'],
  ['You want to know where your friend grew up.', 'where did you grow up'],
  ['You want to know what happened at the meeting.', 'what happened at the meeting'],
  ['You want to know if the exam has been moved.', 'has the exam been moved'],
  ['You want to know which bus goes downtown.', 'which bus goes downtown'],
];
direct.forEach(([sit, qn, ...alts], i) => items.push({
  id: `w-qwo-d${String(i + 1).padStart(2, '0')}`,
  type: 'order',
  q: `Build the question. ${sit}`,
  options: qn.split(' '),
  answer: [qn, ...alts],
  sol: `"${qn[0].toUpperCase() + qn.slice(1)}?" ${/^(who|what|which) (told|happened|goes|is going)/.test(qn) ? 'Here the question word is the subject, so there is no "do / did" and the verb follows directly.' : 'Question order: question word, then helper verb (do, does, did, have, is, will...), then the subject, then the main verb.'}`,
}));

// Part 3: spot the right form.
const mcq = [
  ['Which sentence is correct?', ['Can you tell me where the station is?', 'Can you tell me where is the station?', 'Can you tell me where the station it is?', 'Can you tell me where does the station is?'], 'Indirect question: statement order after the question word.'],
  ['Which sentence is correct?', ['I do not know what time the shop opens.', 'I do not know what time does the shop open.', 'I do not know what time opens the shop.', 'I do not know what time the shop does open?'], 'No "does" inside an indirect question, and the verb takes -s: "the shop opens".'],
  ['Which sentence is correct?', ['Who called you last night?', 'Who did call you last night?', 'Who did you called last night?', 'Who you called last night?'], 'When "who" is the subject, there is no "did": "Who called you?"'],
  ['Which sentence is correct?', ['Who did you call last night?', 'Who you called last night?', 'Who did you called last night?', 'Who called you did last night?'], 'When "who" is the object, use did + base verb: "Who did you call?"'],
  ['Which sentence is correct?', ['She asked me whether I had finished.', 'She asked me had I finished.', 'She asked me whether had I finished.', 'She asked me did I finish.'], 'Reported yes/no questions use "whether" or "if" + statement order.'],
  ['Which sentence is correct?', ['Do you know if the bus stops here?', 'Do you know does the bus stop here?', 'Do you know if does the bus stop here?', 'Do you know if stops the bus here?'], 'Yes/no question inside another question: "if" + statement order.'],
  ['Which sentence is correct?', ['Not only did she finish early, but she also helped me.', 'Not only she finished early, but she also helped me.', 'Not only she did finish early, but she also helped me.', 'Not only finished she early, but she also helped me.'], 'After "Not only" at the start, use question order: "did she finish".'],
  ['Which sentence is correct?', ['Rarely have I seen such a full lecture hall.', 'Rarely I have seen such a full lecture hall.', 'Rarely seen have I such a full lecture hall.', 'Rarely I seen have such a full lecture hall.'], 'Negative adverbs at the start ("Rarely", "Never") take question order.'],
  ['Which sentence is correct?', ['The lab is open today, isn\'t it?', 'The lab is open today, doesn\'t it?', 'The lab is open today, is it?', 'The lab is open today, isn\'t he?'], 'Tag question: positive sentence, negative tag with the same helper verb ("is" → "isn\'t it").'],
  ['Which sentence is correct?', ['What is the weather like today?', 'How is the weather like today?', 'What the weather is like today?', 'How the weather is like today?'], '"What ... like?" asks for a description. "How ... like" is a common mistake.'],
  ['Which sentence is correct?', ['I wonder why he left so early.', 'I wonder why did he leave so early.', 'I wonder why he did leave so early?', 'I wonder why left he so early.'], '"I wonder" is a statement, so statement order and a full stop.'],
  ['Which sentence is correct?', ['How long have you been studying English?', 'How long you have been studying English?', 'How long have been you studying English?', 'How long are you studying English since?'], 'Helper verb before the subject: "have you been studying".'],
];
mcq.forEach(([q, options, sol], i) => items.push({ id: `w-qwo-m${i + 1}`, type: 'mcq', q, options, answer: 0, sol }));

export default { title: 'Questions and word order', accent: 'en-US', items };
