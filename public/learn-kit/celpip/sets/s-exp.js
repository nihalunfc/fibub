// Speaking Task 2: Talking about a Personal Experience (lesson 5.3). Past tenses, sequence words, choosing a story,
// details and feelings, closings, sentence order and word stress. Original items by fibub.
const verbs = [
  ['catch', 'caught', 'I ___ the last bus home that night.'],
  ['lose', 'lost', 'On my first day in Winnipeg, I ___ my wallet.'],
  ['forget', 'forgot', 'I ___ my passport at the hotel.'],
  ['feel', 'felt', 'I ___ really nervous before the interview.'],
  ['bring', 'brought', 'My neighbour ___ us a big pot of soup.'],
  ['teach', 'taught', 'My uncle ___ me how to skate when I was ten.'],
  ['fall', 'fell', 'Halfway down the hill, I slipped and ___.'],
  ['spend', 'spent', 'We ___ the whole weekend painting the basement.'],
];
const items = verbs.map(([base, past, s], i) => ({
  id: `se-v${i + 1}`, type: 'text', q: `Past tense: <i>${s}</i> (${base})`, answer: [past], maxWords: 1,
  sol: `<b>${base} → ${past}</b>. Task 2 is a story about the past, so irregular past forms come up all the time.`,
}));
const stress = [
  ['experience', 'second syllable: ex-PE-ri-ence', ['first syllable: EX-pe-ri-ence', 'third syllable: ex-pe-RI-ence']],
  ['memorable', 'first syllable: MEM-o-ra-ble', ['second syllable: me-MO-ra-ble', 'third syllable: mem-o-RA-ble']],
  ['embarrassing', 'second syllable: em-BAR-rass-ing', ['first syllable: EM-bar-rass-ing', 'third syllable: em-bar-RASS-ing']],
  ['celebrate', 'first syllable: CEL-e-brate', ['second syllable: ce-LE-brate', 'third syllable: cel-e-BRATE']],
];
stress.forEach(([w, a, wrong], i) => items.push({ id: `se-p${i + 1}`, type: 'mcq', q: `Word stress: which syllable is stressed in <b>${w}</b>?`, options: [a, ...wrong], answer: 0, sol: `<b>${a}</b>. Clear word stress makes you easier to follow (Listenability).` }));
items.push(
  { id: 'se-c1', type: 'mcq', q: 'Choose the tense: <i>I ___ home from work when I saw the accident.</i>', options: ['was walking', 'walked', 'am walking', 'have walked'], answer: 0, sol: 'Use the <b>past continuous</b> (was walking) for the longer background action, and the past simple (saw) for the short event that interrupted it.' },
  { id: 'se-c2', type: 'mcq', q: 'Choose the tense: <i>When we arrived at the campsite, we realized we ___ the tent poles at home.</i>', options: ['had left', 'leave', 'were leaving', 'have left'], answer: 0, sol: 'The <b>past perfect</b> (had left) shows an action that happened before another past action (arrived, realized).' },
  { id: 'se-c3', type: 'mcq', q: 'Choose the best sentence.', options: ['Since that day, I have always kept a spare key at my neighbour\'s place.', 'Since that day, I always kept a spare key at my neighbour\'s place.', 'Since that day, I am always keeping a spare key at my neighbour\'s place.', 'Since that day, I always keep a spare key at my neighbour\'s place yesterday.'], answer: 0, sol: '<b>Since</b> + a past time connects past to now, so use the present perfect: "I have always kept". Good for the final lesson you learned.' },
  { id: 'se-q1', type: 'mcq', q: 'Choose the sequence word: <i>The car would not start. ___, a stranger stopped and offered to help.</i>', options: ['Luckily', 'Firstly', 'In conclusion', 'For example'], answer: 0, sol: '<b>Luckily</b> moves the story forward and shows your feeling at the same time.' },
  { id: 'se-q2', type: 'mcq', q: 'Choose the sequence word: <i>We waited two hours at the airport. ___, they told us the flight was cancelled.</i>', options: ['In the end', 'At first', 'Meanwhile', 'Before that'], answer: 0, sol: '<b>In the end</b> introduces the final result of a sequence of events.', trap: '"At first" introduces the beginning of a story, not the end.' },
  { id: 'se-q3', type: 'text', q: 'Fill in one or two words: <i>___ , I thought the job would be easy, but after a week I changed my mind.</i>', answer: ['At first', 'In the beginning', 'Initially'], maxWords: 3, sol: '<b>At first</b> sets up a feeling that later changes, which makes a story more interesting.' },
  { id: 'se-k1', type: 'mcq', q: 'The task: <i>Talk about a time you helped someone. What happened, and how did you feel?</i> Which story is the best choice?', options: ['Helping a lost child find her parents at a summer festival: clear events, clear feelings', 'Helping people in general because you like helping', 'A long story about your whole childhood', 'A story about someone helping you'], answer: 0, sol: 'Choose <b>one specific event</b> with a beginning, middle and end that answers both questions (what happened, how you felt).', trap: '"Someone helping you" reverses the task. Check who does the action in the question.' },
  { id: 'se-k2', type: 'mcq', q: 'You cannot remember a real experience that fits the task. What is the most practical choice?', options: ['Tell a simple, believable story you can describe well; you are rated on your English', 'Say "I have never done that" and stop', 'Talk about a different topic you know better', 'Stay silent while you try to remember'], answer: 0, sol: 'Raters judge your <b>language and how well you do the task</b>, not whether the story is true. A short, clear, believable story is fine.' },
  { id: 'se-d1', type: 'mcq', q: 'Which sentence adds the most useful detail to a story?', options: ['It was minus thirty, my phone was dead, and the next bus was not coming for forty minutes.', 'It was a bad situation.', 'Many things happened.', 'It was very, very, very bad.'], answer: 0, sol: 'Specific details (<b>temperature, phone, time</b>) let the listener picture the scene and show a range of vocabulary.' },
  { id: 'se-d2', type: 'mcq', q: 'Which sentence describes a feeling most precisely?', options: ['I was relieved, but also a little embarrassed that I had panicked.', 'I felt good and bad.', 'My feeling was a feeling of happy.', 'I was feeling.'], answer: 0, sol: 'Precise feeling words (<b>relieved, embarrassed, panicked</b>) score better on Vocabulary than "good" and "bad".' },
  { id: 'se-m1', type: 'mcq', q: 'The task asks <i>what happened and why it was important to you</i>. An answer tells the events clearly and stops. What is missing?', options: ['Why it was important to the speaker', 'An introduction', 'Past tense verbs', 'Linking words'], answer: 0, sol: 'Answer <b>every part</b> of the question. Save 10 to 15 seconds at the end for "why it mattered" or "what I learned".' },
  { id: 'se-e1', type: 'mcq', q: 'Which is the best closing sentence for a personal experience?', options: ['Since then, I always check the weather before I drive anywhere in winter.', 'So that is my story, thank you for listening to my story.', 'And then, um, yeah.', 'There are many experiences in life.'], answer: 0, sol: 'A closing that shows <b>what changed or what you learned</b> rounds off the story naturally.' },
  { id: 'se-o1', type: 'mcq', q: 'Which opening sentence works best?', options: ['I will never forget the first time I drove in a snowstorm, two winters ago in Sudbury.', 'Okay, so, my experience is about something.', 'I am going to talk about the question.', 'Snow is very common in Canada.'], answer: 0, sol: 'It says <b>what, when and where</b> in one sentence and makes the listener want to hear more.' },
);
items.push(
  { id: 'se-r1', type: 'order', q: 'Put the words in order.', options: ['I', 'was', 'cooking', 'dinner', 'when', 'the', 'power', 'went', 'out'], answer: ['I was cooking dinner when the power went out', 'when the power went out I was cooking dinner'], sol: '"I was cooking dinner when the power went out." Background action (past continuous) + interruption (past simple).' },
  { id: 'se-r2', type: 'order', q: 'Put the words in order.', options: ['It', 'turned', 'out', 'to', 'be', 'the', 'best', 'day', 'of', 'the', 'trip'], answer: ['It turned out to be the best day of the trip'], sol: '"It turned out to be the best day of the trip." <b>Turned out</b> shows a surprising result.' },
  { id: 'se-r3', type: 'order', q: 'Put the words in order.', options: ['Looking', 'back', 'I', 'learned', 'a', 'lot', 'from', 'that', 'mistake'], answer: ['Looking back I learned a lot from that mistake'], sol: '"Looking back, I learned a lot from that mistake." A natural way to begin your reflection.' },
);
export default { title: 'Speaking Task 2: Personal Experience', items };
