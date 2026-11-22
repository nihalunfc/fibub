// The grammar mistakes that cost the most (lesson 4.6). Original sentences by fibub.
// Each row: [sentence with one mistake (the wrong part in bold), accepted fixes, why, kind]
const fixes = [
  ['She <b>study</b> biology at the state university.', ['studies'], 'Third person singular present: she studies.', 'Subject-verb agreement'],
  ['The results of the survey <b>was</b> surprising.', ['were'], 'The subject is "results" (plural), not "survey".', 'Subject-verb agreement'],
  ['Everyone in the class <b>have</b> a laptop.', ['has'], '"Everyone" is singular: everyone has.', 'Subject-verb agreement'],
  ['There <b>is</b> many reasons to support this plan.', ['are'], '"many reasons" is plural: there are.', 'Subject-verb agreement'],
  ['One of my friends <b>live</b> near campus.', ['lives'], 'The subject is "one": one of my friends lives.', 'Subject-verb agreement'],
  ['Yesterday I <b>go</b> to the library after class.', ['went'], '"Yesterday" needs the past simple: went.', 'Verb tense'],
  ['I <b>live</b> here since 2023.', ['have lived', 'have been living'], 'With "since", use the present perfect.', 'Verb tense'],
  ['When I arrived, the lecture <b>already started</b>.', ['had already started'], 'The earlier past action takes the past perfect.', 'Verb tense'],
  ['If I <b>will have</b> time, I will join the club.', ['have'], 'After "if" about the future, use the present simple.', 'Verb tense'],
  ['If I <b>was</b> you, I would ask the professor.', ['were'], 'In this fixed advice phrase, use "were": "If I were you".', 'Verb tense'],
  ['The new rules were <b>announce</b> last week.', ['announced'], 'Passive: was/were + past participle.', 'Verb form'],
  ['I am looking forward to <b>meet</b> you.', ['meeting'], '"look forward to" + -ing.', 'Verb form'],
  ['She suggested <b>to take</b> the early bus.', ['taking'], '"suggest" + -ing: suggested taking.', 'Verb form'],
  ['He can <b>speaks</b> three languages.', ['speak'], 'After a modal (can, will, must), use the base verb.', 'Verb form'],
  ['I am <b>interesting</b> in marine biology.', ['interested'], '-ed describes how you feel; -ing describes what causes it.', 'Word form'],
  ['The lecture was very <b>bored</b>.', ['boring'], 'The lecture causes the feeling: boring.', 'Word form'],
  ['Bike lanes are <b>benefit</b> for the environment.', ['beneficial', 'good'], 'After "are" you need an adjective: beneficial.', 'Word form'],
  ['She explained the idea very <b>clear</b>.', ['clearly'], 'An adverb describes how she explained: clearly.', 'Word form'],
  ['Can you give me some <b>advices</b>?', ['advice'], '"advice" is uncountable: no -s.', 'Countable and uncountable'],
  ['We need more <b>informations</b> about the trip.', ['information'], '"information" is uncountable.', 'Countable and uncountable'],
  ['There were <b>less</b> students than last year.', ['fewer'], 'Countable plural nouns take "fewer".', 'Countable and uncountable'],
  ['I bought two new <b>furnitures</b> for my room.', ['pieces of furniture'], '"furniture" is uncountable: two pieces of furniture.', 'Countable and uncountable'],
  ['She is <b>a</b> honest person.', ['an'], '"honest" starts with a vowel sound (the h is silent): an.', 'Articles'],
  ['I want to become <b>engineer</b>.', ['an engineer'], 'A singular job noun needs "a" or "an".', 'Articles'],
  ['<b>The</b> education is important for everyone.', ['education'], 'Uncountable nouns in a general sense take no article.', 'Articles'],
  ['I will meet you <b>in</b> Monday.', ['on'], 'Days take "on": on Monday.', 'Prepositions'],
  ['The class starts <b>on</b> 9 a.m.', ['at'], 'Clock times take "at".', 'Prepositions'],
  ['It depends <b>of</b> the weather.', ['on'], '"depend on".', 'Prepositions'],
  ['I am good <b>in</b> math.', ['at'], '"good at" a subject or skill.', 'Prepositions'],
  ['My roommate, <b>which</b> is from Chile, cooks well.', ['who'], 'Use "who" for people.', 'Relative clauses'],
  ['The book <b>who</b> I borrowed is overdue.', ['that', 'which'], 'Use "that" or "which" for things.', 'Relative clauses'],
  ['This is the most <b>easiest</b> question.', ['easiest'], 'Do not use "most" with -est.', 'Comparatives'],
  ['My essay is <b>more long</b> than yours.', ['longer'], 'Short adjectives add -er: longer.', 'Comparatives'],
];
const items = fixes.map(([s, ans, why, kind], i) => ({
  id: `w-gr-${String(i + 1).padStart(2, '0')}`,
  type: 'text',
  q: `${kind}. Fix the bold part. Type only the correct word or words: "${s}"`,
  answer: ans,
  sol: `<b>${ans[0]}</b>. ${why}`,
}));

const mcq = [
  ['Which sentence is correct?', ['I went to the store, but it was closed.', 'I went to the store, it was closed.', 'I went to the store it was closed.', 'I went to the store but, it was closed.'], 'Two full sentences joined by a comma alone is a comma splice. Use ", but", a full stop, or a semicolon.'],
  ['Which is a complete sentence?', ['Because the bus was late, I missed the start.', 'Because the bus was late.', 'Which was a problem for everyone.', 'Although I tried to arrive early.'], 'A "because" or "although" clause needs a main clause to be complete.'],
  ['Which sentence is correct?', ['Although it was raining, we went out.', 'Although it was raining, but we went out.', 'Although it was raining, so we went out.', 'Although, it was raining we went out.'], 'Use "although" or "but", not both.'],
  ['Which sentence is correct?', ['The number of students has increased.', 'The number of students have increased.', 'The number of students are increased.', 'The number of student has increase.'], '"The number" is singular: has increased.'],
  ['Which sentence is correct?', ['Each of the rooms has a window.', 'Each of the rooms have a window.', 'Each of the room has a window.', 'Each the rooms has a window.'], '"Each of the + plural noun" + singular verb.'],
  ['Which sentence is correct?', ['I have been to Canada twice.', 'I have been to Canada two times ago.', 'I went to Canada twice since.', 'I am been to Canada twice.'], 'Present perfect for life experience: "have been ... twice".'],
  ['Which sentence is correct?', ['The professor made us rewrite the introduction.', 'The professor made us to rewrite the introduction.', 'The professor made us rewriting the introduction.', 'The professor made us rewrote the introduction.'], '"make someone do": no "to".'],
  ['Which sentence is correct?', ['Its main advantage is its low cost.', 'It\'s main advantage is it\'s low cost.', 'Its main advantage is it\'s low cost.', 'It\'s main advantage is its low cost.'], '"its" = belonging to it; "it\'s" = it is.'],
  ['Which mistake usually costs the most?', ['One that makes the meaning unclear', 'A missing comma in a long sentence', 'Using "big" instead of "large"', 'Starting a sentence with "And"'], 'Errors that block meaning matter most. Fix those first, then frequent small errors.'],
];
mcq.forEach(([q, options, sol], i) => items.push({ id: `w-gr-m${i + 1}`, type: 'mcq', q, options, answer: 0, sol }));

export default { title: 'Grammar fixes', accent: 'en-US', items };
