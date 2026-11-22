// How TOEFL writing is scored (lesson 4.5). Original by fibub. The four areas here are fibub's plain summary;
// ETS's own scoring guides on ets.org are the official description.
const areas = ['Task completion', 'Development', 'Organization', 'Language use'];
// [what a rater might notice, the area it mainly affects, why]
const spot = [
  ['The email answers two of the three points in the task and forgets the third.', 0, 'Missing a required point means the task is not fully done.'],
  ['The post says "I agree with Priya" and then stops after two sentences.', 1, 'There is a position but no reasons or examples to support it.'],
  ['The ideas are good, but they jump around with no linking words, so the reader gets lost.', 2, 'Order and connections between ideas are about organization.'],
  ['Many verbs are in the wrong tense, and some words are used with the wrong meaning.', 3, 'Grammar and word choice are language use.'],
  ['The email to a professor starts "Hey dude" and uses text-message spelling.', 0, 'The register does not fit the situation, so the email does not do its job well. Word choice (language use) is affected too.'],
  ['The post gives a reason and then explains it with a specific example from the writer\'s own town.', 1, 'Explaining with a concrete example is development, and it is a strength.'],
  ['Each paragraph of the email has one clear job: the problem, the effect, the request.', 2, 'A clear, logical order is a strength in organization.'],
  ['The writer uses a wide range of accurate structures, like "had I known" and "which meant that".', 3, 'Range and accuracy of grammar are language use, and here they are a strength.'],
  ['The post writes about bike safety in general but never answers whether cities should build bike lanes.', 0, 'Off the question: the task is not completed even if the English is good.'],
  ['The post lists five reasons in one sentence each, with no explanation of any of them.', 1, 'Many undeveloped reasons are weaker than one or two explained ones.'],
  ['The email has no greeting, no closing, and all the sentences are in one block.', 2, 'Missing the normal parts and layout of an email hurts organization (and makes the task look unfinished).'],
  ['The same simple words are repeated: "good", "bad", "thing", "very".', 3, 'A narrow vocabulary range is part of language use.'],
  ['The post copies whole sentences from the classmates\' posts.', 1, 'Copied text is not your own development, and it shows less of your language.'],
  ['"However" is used where "so" is needed, which makes the logic confusing.', 2, 'Wrong linking words break the connection between ideas.'],
];
const items = spot.map(([s, a, why], i) => ({
  id: `w-sc-a${String(i + 1).padStart(2, '0')}`,
  type: 'mcq',
  q: `Which area does this mostly affect? <i>${s}</i>`,
  options: [areas[a], ...areas.filter((_, k) => k !== a)],
  answer: 0,
  sol: `<b>${areas[a]}</b>. ${why}`,
}));

const more = [
  ['Which of these is the best summary of what raters look for in the email and discussion tasks?', ['Whether you did the task, developed your ideas, organized them clearly and used English well', 'Only grammar mistakes', 'Only the number of words', 'Whether you used rare, difficult words'], 'Fibub\'s plain summary uses four areas: task completion, development, organization and language use. ETS\'s scoring guides on ets.org are the official description.'],
  ['Two posts make the same point. Post A is 160 words and repeats itself. Post B is 110 words and explains one reason with an example. Which is likely stronger?', ['Post B', 'Post A, because it is longer', 'They are equal', 'Neither, because both are too short'], 'Length helps only when it adds development. Repeating yourself adds words but not quality.'],
  ['How is Build a Sentence marked?', ['Each sentence is either right or wrong: the words must be in a correct order', 'By a rater who gives 1 to 6 for style', 'By word count', 'By how fast you finish'], 'Build a Sentence items have a correct answer, like a quiz question. The email and discussion tasks are rated on quality.'],
  ['A post has a few small spelling errors but is clear, on topic and well developed. What is the most likely effect?', ['A small effect: minor errors that do not block meaning cost less than missing content', 'A score of 1', 'No score at all', 'The rater stops reading'], 'Clear communication matters most. Small slips lower language use a little; errors that confuse the reader cost more.'],
  ['Which change would raise an email\'s score the most?', ['Adding the missing third point the task asked for', 'Replacing "help" with "assistance" everywhere', 'Adding a fancy quotation', 'Making the greeting longer'], 'An unfinished task is the biggest weakness; fix that before polishing words.'],
  ['What does "development" mean in plain terms?', ['Explaining your ideas with reasons, details and examples', 'Writing as many words as possible', 'Using long sentences', 'Starting with a question'], 'Development is how far you take each idea: why it is true, and an example that shows it.'],
  ['What does "organization" mean in plain terms?', ['Ideas in a logical order, clearly connected, easy to follow', 'Using bullet points', 'Writing in exactly three paragraphs', 'Putting the longest sentence first'], 'Logical order plus clear connections. No fixed number of paragraphs is required.'],
  ['Where can you find the official writing scoring guides?', ['On ETS\'s TOEFL pages at ets.org', 'Only in paid books', 'They are secret', 'On social media'], 'ETS publishes scoring guides (rubrics) and sample materials on ets.org/toefl. Read them in full there.'],
  ['Which strategy is risky?', ['Memorizing a long template and pasting it into every answer', 'Using a few useful phrases you know well', 'Planning for one minute before writing', 'Proofreading at the end'], 'Memorized, general text that does not fit the task tends to be noticed and does not show development. Short flexible phrases are fine.'],
  ['You want to check your own practice email. What is the best first question to ask?', ['Did I do everything the task asked?', 'Did I use a semicolon?', 'Is it over 200 words?', 'Did I use the word "furthermore"?'], 'Task completion first, then development, organization and language.'],
];
more.forEach(([q, options, sol], i) => items.push({ id: `w-sc-b${String(i + 1).padStart(2, '0')}`, type: 'mcq', q, options, answer: 0, sol }));

export default { title: 'How writing is scored', accent: 'en-US', items };
