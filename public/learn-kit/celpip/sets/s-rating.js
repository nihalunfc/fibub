// How CELPIP speaking is rated (lesson 5.1). Which rating area a habit helps or hurts, the speaking test format,
// and common myths. Original items by fibub.
const AREAS = ['Content/Coherence', 'Vocabulary', 'Listenability', 'Task Fulfillment'];
const why = {
  'Content/Coherence': 'Content/Coherence is about your ideas: enough of them, explained with details and examples, in a clear order with links between them.',
  Vocabulary: 'Vocabulary is about your words: how precise, varied and natural they are, and whether you use them correctly.',
  Listenability: 'Listenability is about how easy you are to follow: rhythm, pronunciation and intonation; pauses, fillers and self-correction; grammar and sentence structure; and a variety of sentence types.',
  'Task Fulfillment': 'Task Fulfillment is about doing the job you were given: staying relevant, covering every part of the task, using the right tone for the listener and using the time well.',
};
const habits = [
  ['You stop for four or five seconds in the middle of most sentences.', 'Listenability'],
  ['You use "good", "nice" and "bad" for almost everything you describe.', 'Vocabulary'],
  ['The task asks for advice about choosing a gym, and you talk mostly about your own diet.', 'Task Fulfillment'],
  ['Your ideas jump from one point to another with no linking words, so the listener cannot see how they connect.', 'Content/Coherence'],
  ['You are asked to speak to your manager, and you open with "Hey dude, what is up?"', 'Task Fulfillment'],
  ['You finish a 60-second task after only 20 seconds and sit in silence.', 'Task Fulfillment'],
  ['You give one reason for your advice but no example, detail or result.', 'Content/Coherence'],
  ['You put the stress on the wrong syllable, so words like "comfortable" and "develop" are hard to recognize.', 'Listenability'],
  ['Almost every sentence starts with "um", "uh" or "like".', 'Listenability'],
  ['You say "do a decision" and "make my homework" instead of "make a decision" and "do my homework".', 'Vocabulary'],
  ['Every sentence has the same short pattern: "It is big. It is busy. It is loud."', 'Listenability'],
  ['You say "Yesterday he go to the store and he buy milk."', 'Listenability'],
  ['You restart the same sentence three times to fix small mistakes.', 'Listenability'],
  ['The task asks what the people in the picture are doing, and you describe only the buildings.', 'Task Fulfillment'],
  ['You use precise words such as "cluttered", "reluctant" and "affordable" correctly.', 'Vocabulary'],
  ['You say "First... Another reason is... Finally..." so the listener always knows where you are.', 'Content/Coherence'],
  ['Your voice stays flat, with no rise or fall, so every sentence sounds the same.', 'Listenability'],
  ['You give a main idea, then a reason, then a short real-life example for each point.', 'Content/Coherence'],
];
const items = habits.map(([h, a], i) => ({
  id: `sr-a${String(i + 1).padStart(2, '0')}`, type: 'mcq',
  q: `Which rating area does this habit affect most? <i>${h}</i>`,
  options: [a, ...AREAS.filter((x) => x !== a)], answer: 0,
  sol: `<b>${a}</b>. ${why[a]}`,
}));
items.push(
  { id: 'sr-f01', type: 'text', q: 'How many speaking tasks are there in CELPIP-General? (a number)', answer: ['8', 'eight'], maxWords: 1, sol: 'There are <b>8</b> speaking tasks, recorded on the computer in about 15 minutes.' },
  { id: 'sr-f02', type: 'mcq', q: 'About how long does the whole Speaking test take?', options: ['About 15 minutes', 'About 5 minutes', 'About 45 minutes', 'About 27 minutes'], answer: 0, sol: 'The Speaking test takes <b>about 15 minutes</b> for all 8 tasks.', trap: '27 minutes is the time for Writing Task 1, not the whole speaking test.' },
  { id: 'sr-f03', type: 'mcq', q: 'Who do you speak to in the CELPIP Speaking test?', options: ['A computer that records your answers', 'A live examiner on a video call', 'Another test taker as a partner', 'An examiner sitting beside you'], answer: 0, sol: 'You speak into a microphone and the <b>computer records</b> your answers. Raters listen to the recordings later.', trap: 'Some other tests use a live examiner, but CELPIP is recorded on computer.' },
  { id: 'sr-f04', type: 'mcq', q: 'Task 1 (Giving Advice) usually gives you how much speaking time?', options: ['About 90 seconds', 'About 30 seconds', 'About 60 seconds', 'About 3 minutes'], answer: 0, sol: 'Task 1 usually gives about <b>90 seconds</b> to speak, after about 30 seconds to prepare. The test screen shows the exact time.', trap: '60 seconds is the usual speaking time for Tasks 2, 3 and 4.' },
  { id: 'sr-f05', type: 'mcq', q: 'What do Tasks 3 and 4 have in common?', options: ['They use the same picture', 'They are both about giving advice to a friend', 'They have no preparation time', 'They are both letters you read aloud'], answer: 0, sol: 'Task 3 asks you to describe a <b>picture</b>; Task 4 uses the <b>same picture</b> and asks what will probably happen next.' },
  { id: 'sr-f06', type: 'mcq', q: 'Which of these is part of Listenability?', options: ['Pauses, fillers and self-correction', 'Covering every part of the task', 'Using the right tone for the listener', 'Giving examples to support ideas'], answer: 0, sol: 'Listenability includes <b>pauses, interjections (fillers) and self-correction</b>, along with rhythm, pronunciation, intonation, grammar and sentence variety.', trap: 'Covering every part and using the right tone belong to Task Fulfillment.' },
  { id: 'sr-f07', type: 'mcq', q: 'Which of these is part of Task Fulfillment?', options: ['Relevance, completeness, tone and length', 'Rhythm and intonation', 'Precise and varied words', 'Linking words between ideas'], answer: 0, sol: 'Task Fulfillment covers <b>relevance, completeness, tone and length</b>: did you do the whole job, for the right listener, using the time?' },
  { id: 'sr-m01', type: 'mcq', q: 'True or false? <i>You need a Canadian accent to get a high speaking score.</i>', options: ['False: you need to be clear and easy to follow, not to sound Canadian', 'True: raters reward a Canadian accent', 'True: any other accent loses marks automatically', 'False: accent and pronunciation are not rated at all'], answer: 0, sol: 'Pronunciation is part of Listenability, but the goal is to be <b>clear and easy to understand</b>. Many high scorers have a strong accent from their first language.', trap: 'Pronunciation is rated, so "not rated at all" is wrong too.' },
  { id: 'sr-m02', type: 'mcq', q: 'True or false? <i>Big, rare words always raise your Vocabulary score.</i>', options: ['False: words must be correct and natural for the situation', 'True: the more rare words the better', 'True: raters count long words', 'False: Vocabulary is not rated in speaking'], answer: 0, sol: 'A rare word used wrongly can hurt you. Raters look for words that are <b>precise, varied and used correctly</b>.' },
  { id: 'sr-m03', type: 'mcq', q: 'You make a small grammar mistake while speaking. What is usually best?', options: ['Keep going, or fix it quickly once and move on', 'Stop and start the whole answer again', 'Apologize to the computer and explain', 'Stay silent until you remember the rule'], answer: 0, sol: 'One quick fix is natural. Long stops and many restarts hurt <b>Listenability</b> more than a small slip does.' },
);
items.push(
  { id: 'sr-o01', type: 'order', q: 'Put the words in order to make a strong first sentence for an advice task.', options: ['If', 'I', 'were', 'you', 'I', 'would', 'talk', 'to', 'your', 'landlord', 'first'], answer: ['If I were you I would talk to your landlord first', 'If I were you I would first talk to your landlord'], sol: '"If I were you, I would talk to your landlord first." A clear piece of advice in the first sentence helps Task Fulfillment and Coherence.' },
);
export default { title: 'How CELPIP speaking is rated', items };
