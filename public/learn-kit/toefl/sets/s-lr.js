// Listen and Repeat practice (lesson 5.1). Original by fibub: every sentence is invented.
// One sentence per group. For each sentence: a dictation item (type exactly what you heard), a stress item
// (which word a natural speaker stresses most) and one more item on linking, thought groups or meaning.
// Each row: [sentence, stressed word, three other words from the sentence, why, [question, right option, three wrong, why]]
const rows = [
  ['The library opens at nine.', 'nine', ['The', 'opens', 'at'], 'The new information is the time, so "nine" gets the main stress. Small words like "the" and "at" are weak.',
    ['Which two words join smoothly in natural speech?', 'opens at (opensat)', ['The library (thelibrary)', 'at nine (atnine)', 'library opens (libraryopens)'], 'A consonant at the end of a word ("opens") joins the vowel at the start of the next ("at"): "open-zat".']],
  ['Please sign up at the front desk.', 'desk', ['Please', 'at', 'the'], 'The last content word, "desk", usually carries the main stress in a plain statement.',
    ['Which words link together?', 'sign up at (si-nu-pat)', ['Please sign (pleasesign)', 'front desk (fron-tdesk)', 'the front (thef-ront)'], '"Sign" ends in a consonant sound and "up" and "at" start with vowels, so all three flow as one chunk: "si-nup-at".']],
  ['My roommate left her keys in the kitchen.', 'kitchen', ['My', 'her', 'in'], 'The place is the new information at the end, so "kitchen" is stressed. Pronouns like "my" and "her" are usually weak.',
    ['Where is a natural short pause (a thought-group break)?', 'after "keys"', ['after "My"', 'after "the"', 'after "her"'], 'Thought groups follow meaning: "My roommate left her keys / in the kitchen." You never pause after "the" or "my", because they belong to the next word.']],
  ['The bus to campus is running late today.', 'late', ['The', 'to', 'is'], 'The news is that the bus is late. "Late" carries the main stress; "today" is extra time information.',
    ['Which word is said in its weak form, almost like "tuh"?', 'to', ['bus', 'campus', 'late'], 'In normal speed English, "to" before a consonant is reduced to "tuh". If you say it fully every time, you sound slow and robotic.']],
  ['Could you send me the notes from Monday?', 'Monday', ['Could', 'you', 'me'], 'The key detail is which day. "Monday" carries the main stress.',
    ['How does "Could you" usually sound at natural speed?', '"Couldja", with the d and y blended', ['"Could" and "you" with a long pause between them', '"Cold you", with a different vowel', '"Could" said twice'], 'The d sound and the y sound blend into a "j" sound: "couldja". You may hear it on the test; saying it clearly is also fine.']],
  ['I left my umbrella on the train this morning.', 'umbrella', ['I', 'on', 'the'], 'What was lost is the main point. "Umbrella" (um-BREL-la) gets the strongest stress.',
    ['Which two words link with a consonant and a vowel?', 'my umbrella (my-yum-brella)', ['this morning (thismorning)', 'the train (thetrain)', 'I left (ileft)'], 'Between "my" and "umbrella" a light y sound appears ("my-yumbrella"). Linking vowels with a small y or w sound keeps speech smooth.']],
  ['The professor moved the exam to next Thursday.', 'Thursday', ['The', 'to', 'next'], 'The new date is the news, so "Thursday" carries the main stress.',
    ['What is the best thought-group split?', 'The professor moved the exam / to next Thursday.', ['The professor moved / the / exam to next Thursday.', 'The / professor moved the exam to / next Thursday.', 'The professor moved the / exam to next / Thursday.'], 'Pause between meaning chunks: who did what / when. Never split "the" from its noun.']],
  ['We need to finish the report before the meeting.', 'meeting', ['We', 'to', 'the'], 'In a neutral statement the last content word, "meeting", gets the main stress.',
    ['How is "need to" usually said at natural speed?', '"Nee-tuh", with one t sound', ['"Need" and "two" said slowly and fully', '"Neat", without "to"', '"Need" with a long pause after it'], 'The d of "need" and the t of "to" merge into one sound, and "to" is weak: "nee-tuh".']],
  ['She has been studying chemistry for three years.', 'three', ['She', 'has', 'for'], 'The length of time is the key detail, so the number "three" gets strong stress.',
    ['Which word is usually weak and short here?', 'has', ['studying', 'chemistry', 'years'], '"Has" is a helping verb, so it is weak: "she’s been" or "she has" with a light "uz" sound.']],
  ['If you have any questions, just send me an email.', 'email', ['If', 'you', 'me'], 'The action requested is the email, the last content word.',
    ['Where is the natural pause?', 'after "questions"', ['after "If"', 'after "any"', 'after "an"'], 'A condition clause makes its own thought group: "If you have any questions / just send me an email."']],
  ['The cafeteria is closed for repairs until Friday.', 'Friday', ['The', 'is', 'for'], 'The end date is the new information, so "Friday" carries the main stress.',
    ['Which two words link together?', 'closed for (clos-for)', ['The cafeteria (thecafeteria)', 'until Friday (untilfriday)', 'is closed (isclosed)'], 'The d of "closed" almost disappears before the f of "for", so they run together: "clos-for".']],
  ['I am not sure which room the seminar is in.', 'room', ['I', 'am', 'is'], 'The uncertain thing is the room. "Room" carries the main stress.',
    ['What does the sentence end with, and how should it sound?', 'the preposition "in", said lightly with falling pitch', ['a question, so the pitch must go up', 'the word "seminar", stressed very strongly', 'a long pause before "in"'], 'It is a statement, not a question, so the voice falls at the end. Final "in" is light but must not be dropped.']],
  ['Most students prefer to study in groups before exams.', 'groups', ['Most', 'to', 'in'], 'The preference is about groups, so "groups" carries the main stress.',
    ['Which word has its stress on the second syllable?', 'prefer (pre-FER)', ['students (STU-dents)', 'study (STU-dy)', 'groups (one syllable, no choice of stress)'], '"Prefer" is stressed on the second syllable: pre-FER. "Students" and "study" are stressed on the first.']],
  ['You should check the website for the latest schedule.', 'latest', ['You', 'the', 'for'], 'The contrast is the latest version versus an old one, so "latest" is stressed. "Schedule" also has stress, but less.',
    ['How do "check" and "the" join?', 'The k sound of "check" runs straight into "the"', ['There is a full stop between them', '"Check" loses its first sound', '"The" is stressed strongly'], 'Consonant to consonant: "check-the" with no gap. Only the word "check" carries stress.']],
  ['The new parking rules will start at the beginning of next month.', 'month', ['The', 'will', 'at'], 'In a long neutral statement, stress the last content word: "month".',
    ['Where is the most natural thought-group break?', 'after "rules"', ['after "The"', 'after "at"', 'after "of"'], 'Subject chunk / verb and time chunk: "The new parking rules / will start at the beginning of next month."']],
  ['Our lab group decided to meet in the library instead of the dorm.', 'library', ['Our', 'to', 'of'], 'The contrast is library versus dorm. "Library" gets the strongest stress; "dorm" a little less.',
    ['Which two words link?', 'instead of (instea-dof)', ['Our lab (ourlab)', 'the dorm (thedorm)', 'to meet (tomeet)'], 'The d of "instead" joins the vowel of "of": "instea-dof".']],
  ['Students who live off campus can apply for a parking permit online.', 'permit', ['who', 'can', 'for'], 'The thing you can apply for is the permit. Note: the noun is PER-mit, stress on the first syllable.',
    ['Where is the natural pause?', 'after "campus"', ['after "who"', 'after "can"', 'after "a"'], '"Students who live off campus" is one long subject, so a pause after it helps the listener.']],
  ['The art museum offers free tours on the first Sunday of every month.', 'free', ['The', 'on', 'of'], 'The surprising, useful detail is that the tours are free, so "free" gets strong stress.',
    ['Which word in this sentence is usually reduced to "uv"?', 'of', ['art', 'tours', 'every'], '"Of" is a function word and sounds like "uv" or even just "uh" before a consonant.']],
  ['My advisor suggested that I take statistics before the research course.', 'statistics', ['My', 'that', 'I'], 'The advice is about which course. "Statistics" (sta-TIS-tics) carries the main stress.',
    ['Which syllable of "statistics" is stressed?', 'the second: sta-TIS-tics', ['the first: STA-tis-tics', 'the third: sta-tis-TICS', 'none: every syllable is equal'], 'Words ending in -ic or -ics stress the syllable just before the ending: sta-TIS-tics, e-co-NOM-ics.']],
  ['When the fire alarm rings, leave the building by the nearest exit.', 'nearest', ['When', 'the', 'by'], 'The important instruction is which exit: the nearest one.',
    ['How should the voice move at the comma after "rings"?', 'rise slightly or stay level, to show more is coming', ['fall all the way down, as at the end of a sentence', 'stop for three seconds', 'whisper the next word'], 'At the end of an unfinished part, the pitch stays up a little. That tells the listener the sentence continues.']],
  ['Do you know if the bookstore sells used textbooks?', 'used', ['Do', 'you', 'if'], 'The key contrast is used versus new books, so "used" is stressed.',
    ['What is the pitch at the end of this yes/no question?', 'rising', ['falling sharply', 'exactly flat with no change', 'rising, then falling on every word'], 'Yes/no questions ("Do you know if...") usually rise at the end. Wh- questions usually fall.']],
  ['Where did you put the printer paper after the delivery?', 'paper', ['Where', 'did', 'the'], 'The question is about the paper (not the printer), so "paper" carries the main stress. The question word "where" also gets a beat.',
    ['What is the usual pitch at the end of this wh- question?', 'falling', ['rising sharply', 'always flat', 'rising on "where" only'], 'Wh- questions (where, what, when, why, how) normally fall at the end. A rise can sound surprised or unsure.']],
  ['I would rather walk than wait twenty minutes for the shuttle.', 'walk', ['I', 'than', 'for'], '"Rather" sets up a contrast between walking and waiting, so "walk" (and then "wait") carry stress.',
    ['How is "I would" usually said in fast speech?', '"I\'d"', ['"I wood", both words strong', '"I will"', '"Eye-would" with a pause'], 'In speech, "I would" usually contracts to "I\'d". On the test, saying the full "I would" is fine when that is what you heard.']],
  ['The results of the survey were more surprising than we expected.', 'surprising', ['The', 'of', 'were'], 'The point is that the results surprised them. "Surprising" (sur-PRI-sing) carries the main stress.',
    ['Which word is NOT usually stressed?', 'were', ['results', 'survey', 'expected'], '"Were" is a helping verb here, so it is weak. Content words (nouns, main verbs, adjectives) carry the beats.']],
  ['Anyone who wants to join the hiking club should come to the meeting on Wednesday.', 'Wednesday', ['who', 'to', 'the'], 'In a long statement the last content word, the day, gets the main stress. Note "Wednesday" is said WENZ-day.',
    ['How many syllables do most speakers say in "Wednesday"?', 'two (WENZ-day)', ['three (WED-NES-DAY)', 'one (WENZ)', 'four (WE-DNES-DA-Y)'], 'The first d is silent: WENZ-day. Saying three syllables is a common learner mistake.']],
  ['I have already finished the reading, but I still need to write the summary.', 'summary', ['I', 'have', 'the'], 'The second clause carries the news: what is left to do is the summary.',
    ['Where is the most natural pause?', 'after "reading"', ['after "I"', 'after "the"', 'after "need"'], 'The comma and "but" mark two thought groups: "I have already finished the reading / but I still need to write the summary."']],
  ['Because of the storm, all afternoon classes have been moved online.', 'online', ['of', 'the', 'have'], 'Where the classes moved is the news, so "online" carries the main stress.',
    ['Which word is said in a weak form here?', 'have', ['storm', 'classes', 'online'], '"Have been" is said quickly, often "uv been". The meaning words are "storm", "classes", "moved" and "online".']],
  ['The tutor explained the problem again, and this time it made sense.', 'sense', ['The', 'and', 'it'], 'The result is the key idea. "Made sense" carries the stress on "sense".',
    ['Which two words link?', 'problem again (proble-magain)', ['The tutor (thetutor)', 'this time (thistime)', 'and this (andthis)'], 'The m at the end of "problem" joins the vowel at the start of "again": "proble-magain".']],
  ['She asked whether the deadline could be extended by a few days.', 'extended', ['She', 'whether', 'by'], 'The request is for an extension, so "extended" (ex-TEN-ded) carries the main stress.',
    ['What is the pitch at the end of this sentence?', 'falling, because it is a statement that reports a question', ['rising, because it contains "whether"', 'rising sharply on "days"', 'flat on every word'], 'This is a reported (indirect) question inside a statement, so it falls at the end like any statement.']],
  ['Our flight was delayed, so we did not arrive until after midnight.', 'midnight', ['Our', 'was', 'we'], 'The surprising time is the news: "midnight".',
    ['Where is the most natural pause?', 'after "delayed"', ['after "Our"', 'after "we"', 'after "until"'], 'Cause / result: "Our flight was delayed / so we did not arrive until after midnight."']],
];

const groups = {};
const items = [];
rows.forEach(([s, stress, others, whyS, [q3, right3, wrong3, why3]], i) => {
  const g = 'lr' + String(i + 1).padStart(2, '0');
  groups[g] = { title: 'Listen to the sentence. Do not open the transcript until you have answered.', audio: [{ who: 'N', name: 'Speaker', text: s }] };
  const bare = s.replace(/[.?!]$/, '');
  items.push({ id: `s-lr-${i + 1}a`, type: 'text', group: g, q: 'Type exactly what you heard, word for word.', answer: [s, bare], sol: `The sentence was: "${s}" Check every small word (a, the, to, of, has, have) and every ending (-s, -ed). Those are the words learners drop when repeating.` });
  items.push({ id: `s-lr-${i + 1}b`, type: 'mcq', group: g, q: 'In natural speech, which word carries the main stress?', options: [stress, ...others], answer: 0, sol: whyS, trap: `"${others[0]}" is a small or early word. Small grammar words are usually weak, and the main stress usually falls on the last important new word.` });
  items.push({ id: `s-lr-${i + 1}c`, type: 'mcq', group: g, q: q3, options: [right3, ...wrong3], answer: 0, sol: why3 });
});

export default { title: 'Listen and Repeat drills', accent: 'en-US', groups, items };
