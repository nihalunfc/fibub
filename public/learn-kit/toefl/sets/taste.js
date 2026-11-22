// A first taste: "choose a response" items (lesson 1.1). Original by fibub.
const pairs = [
  ['Do you know if the library is open on Sunday?', 'I think it opens at noon on weekends.', ['Yes, I like reading on Sundays.', 'The library has many books.', 'No, I did not open it.'], '"Do you know if..." asks for information. The reply gives the opening time, which answers it.'],
  ['Professor Kim moved our exam to Thursday.', 'Great, that gives us two more days to study.', ['Professor Kim teaches biology.', 'I moved to a new apartment.', 'The exam was very long.'], 'The natural reaction is to the change of date. The wrong answers repeat words (moved, exam, Professor Kim) without responding.'],
  ['Would you mind if I borrowed your notes from Monday?', 'Not at all. I will send you a photo of them.', ['Yes, I mind my notes.', 'I was not in class on Tuesday.', 'Monday was a holiday last year.'], '"Would you mind...?" is answered with "Not at all" when you agree.'],
  ['I can’t find the room for the chemistry lab.', 'It’s in the basement of the science building.', ['Chemistry is my favourite subject.', 'I found my keys this morning.', 'The lab report is due Friday.'], 'The speaker has a problem; the best reply solves it.'],
  ['Shouldn’t we start the project soon?', 'You’re right. Let’s meet tomorrow to plan it.', ['The project was interesting.', 'We should not start.', 'Soon is a short word.'], 'A negative question ("Shouldn’t we...?") is really a suggestion. Agreeing and making a plan fits.'],
  ['How did your presentation go?', 'Better than I expected, actually.', ['It goes on Monday.', 'I presented it with slides.', 'By bus, usually.'], '"How did it go?" asks how successful it was, not when or how you did it.'],
  ['The cafeteria has run out of vegetarian options again.', 'Maybe we should tell the student council.', ['I ran out of the cafeteria.', 'Vegetarian food is healthy.', 'Again and again.'], 'A complaint is best answered with sympathy or a suggestion.'],
  ['Are you going to the career fair this afternoon?', 'I wish I could, but I have a lab until five.', ['The fair was last year.', 'Careers are important.', 'This afternoon is sunny.'], 'A polite refusal with a reason answers the yes/no question indirectly. TOEFL often uses indirect answers.'],
];
const items = pairs.map(([say, good, wrong, why], i) => ({
  id: `tt-${i}`, type: 'mcq', group: `g${i}`, q: 'Choose the best response.', options: [good, ...wrong], answer: 0, sol: why,
}));
const groups = Object.fromEntries(pairs.map(([say], i) => [`g${i}`, { audio: [{ who: 'A', name: 'Speaker', text: say }] }]));
export default { title: 'choose a response', accent: 'en-US', groups, items };
