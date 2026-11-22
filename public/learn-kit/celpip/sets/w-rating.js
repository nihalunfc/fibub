// How CELPIP writing is rated (lesson 4.1). Original items by fibub.
const areas = ['Content/Coherence', 'Vocabulary', 'Readability', 'Task Fulfillment'];
const why = {
  'Content/Coherence': 'Content/Coherence is about your ideas: how many, how good, how well organized, and the examples and details that support them.',
  'Vocabulary': 'Vocabulary is about word choice: suitable, precise, accurate words and a good range of them.',
  'Readability': 'Readability is about how easy the text is to read: format and paragraphs, connectors, grammar and sentence structure, spelling and punctuation.',
  'Task Fulfillment': 'Task Fulfillment is about doing what the task asks: relevance, covering every point, the right tone and the word count.',
};
const feats = [
  ['The writer gives a clear example for each reason.', 0],
  ['The ideas follow a logical order, from the problem to the request.', 0],
  ['The answer has three well-developed ideas instead of one repeated idea.', 0],
  ['Each point is supported with a specific detail, such as a date or a cost.', 0],
  ['The writer uses "reimburse" correctly instead of "give back the money".', 1],
  ['The writer avoids using "good" six times and chooses "reliable", "convenient" and "affordable".', 1],
  ['A word is used with the wrong meaning: "I am very sensible to noise."', 1],
  ['The writer picks an exact word: "the tap drips all night" instead of "the tap has a problem".', 1],
  ['Each paragraph starts on a new line with a blank line before it.', 2],
  ['Ideas are joined with "however", "as a result" and "for example".', 2],
  ['Many words are misspelled, such as "recieve" and "untill".', 2],
  ['Sentences run on for five lines with no full stop.', 2],
  ['The email to a landlord sounds rude and demanding.', 3],
  ['The writer forgot the third bullet point in the task.', 3],
  ['The answer has 95 words when the task asks for 150 to 200.', 3],
  ['Half of the survey answer is about a different topic.', 3],
];
const items = feats.map(([f, a], i) => ({
  id: `wr-a${i + 1}`, type: 'mcq',
  q: `Which rating area does this mostly affect? <i>${f}</i>`,
  options: [areas[a], ...areas.filter((_, j) => j !== a)], answer: 0,
  sol: why[areas[a]],
}));
items.push(
  { id: 'wr-f1', type: 'mcq', q: 'How long do you have for Writing Task 1, the email?', options: ['27 minutes', '26 minutes', '20 minutes', '53 minutes'], answer: 0, sol: 'Task 1 (the email) has <b>27 minutes</b>. Task 2 (the survey) has 26. Together they make the 53-minute Writing test.', trap: '53 minutes is the whole Writing test, not one task.' },
  { id: 'wr-f2', type: 'mcq', q: 'What word range does each CELPIP writing task ask for?', options: ['150 to 200 words', '100 to 150 words', '200 to 250 words', 'At least 300 words'], answer: 0, sol: 'Both tasks ask for <b>150 to 200 words</b>. The writing pad counts your words for you.' },
  { id: 'wr-f3', type: 'mcq', q: 'Does the CELPIP writing screen correct your spelling?', options: ['No, there is no spell check', 'Yes, it underlines mistakes', 'Only for names', 'Yes, but only in Task 2'], answer: 0, sol: 'You type with <b>no spell check</b>, so spelling counts under Readability. Learn to spell the words you use often.' },
  { id: 'wr-f4', type: 'mcq', q: 'In Task 2, the survey, what must you do?', options: ['Choose one of two options and give reasons', 'Write an email to a friend', 'Describe both options without choosing', 'Summarize a reading passage'], answer: 0, sol: 'Task 2 gives two options. You <b>choose one and give reasons</b>. It is not an email, so no greeting or sign-off.', trap: 'Describing both options without choosing misses the task and hurts Task Fulfillment.' },
  { id: 'wr-f5', type: 'mcq', q: 'An answer has excellent grammar but ignores one of the three points in the email task. Which area loses the most?', options: ['Task Fulfillment', 'Readability', 'Vocabulary', 'None, grammar is what counts'], answer: 0, sol: 'Completeness is part of <b>Task Fulfillment</b>. Missing a point can pull the score down even if every sentence is correct.' },
  { id: 'wr-f6', type: 'mcq', q: 'Which plan gives the best chance of a high score?', options: ['Cover every point with a clear idea, a detail and a suitable tone, in 170 to 190 words', 'Write 300 words to show more English', 'Use as many rare words as possible', 'Write one long paragraph to save time'], answer: 0, sol: 'All four areas count. A complete, organized, well-pitched answer inside the range scores better than a long or showy one.', trap: '300 words goes far over the range, takes time from checking and adds more chances for errors.' },
  { id: 'wr-f7', type: 'mcq', q: 'A survey answer begins "Dear Sir or Madam," and ends "Sincerely, Ana". What is the problem?', options: ['Task 2 is not an email, so the email format is not suitable', 'Nothing, this is the best format', 'It needs a subject line too', 'The name should be at the top'], answer: 0, sol: 'Task 2 is a survey response, not a letter. Start with your opinion and reasons; skip the greeting and sign-off.' },
  { id: 'wr-f8', type: 'mcq', q: 'Which change most improves Readability?', options: ['Splitting one long block into an opening, two body paragraphs and a closing', 'Replacing "big" with "substantial"', 'Adding a fourth reason', 'Making the tone more polite'], answer: 0, sol: 'Format and paragraphing are part of <b>Readability</b>. Clear paragraphs make the answer easy to follow.' },
);
const missing = [
  ['Task: write to your manager to (1) explain why you missed a meeting, (2) say what you have done to catch up, (3) suggest a time to talk. The answer explains a sick child and suggests Thursday at 2.', 'What you have done to catch up', ['Why you missed the meeting', 'A time to talk', 'Nothing is missing']],
  ['Task: write to a friend to (1) thank them for a gift, (2) say how you used it, (3) invite them for dinner. The answer thanks them and describes using the new tent on a camping trip.', 'An invitation to dinner', ['Thanks for the gift', 'How you used it', 'Nothing is missing']],
  ['Survey: choose a new park playground or a new dog park, and explain why. The answer describes both projects in detail and ends "Both are good ideas."', 'A clear choice of one option', ['Details about the playground', 'Details about the dog park', 'A greeting']],
  ['Task: write to a store to (1) describe the product you bought, (2) explain the problem, (3) say what you want them to do. The answer names the blender, explains the cracked jug and asks for a replacement.', 'Nothing is missing', ['A description of the product', 'The problem', 'What you want them to do']],
];
missing.forEach(([s, a, wrong], i) => items.push({ id: `wr-m${i + 1}`, type: 'mcq', q: `What is missing from this answer? <i>${s}</i>`, options: [a, ...wrong], answer: 0, sol: a === 'Nothing is missing' ? 'All three points are covered: product, problem and request.' : `The answer leaves out: <b>${a.toLowerCase()}</b>. Every part of the task must be covered for Task Fulfillment.` }));
export default { title: 'How CELPIP writing is rated', items };
