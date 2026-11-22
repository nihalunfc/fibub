// Paragraphs and linking words (lesson 4.5). Original items by fibub.
const gaps = [
  ['The rent is reasonable. ___, the apartment is close to my work.', 'In addition', ['However', 'For example', 'Otherwise'], 'adds another positive point'],
  ['I ordered the blue model. ___, I received a grey one.', 'However', ['Furthermore', 'As a result', 'For instance'], 'shows contrast with what was expected'],
  ['The bus was cancelled. ___, I arrived forty minutes late.', 'As a result', ['In contrast', 'For example', 'Meanwhile'], 'shows a result'],
  ['Many activities suit seniors. ___, the centre could offer chair yoga.', 'For example', ['However', 'As a result', 'Instead'], 'introduces an example'],
  ['___ the weather was bad, the festival was a success.', 'Although', ['Because', 'So', 'Unless'], 'joins a contrast in one sentence'],
  ['Please call me ___ you have any questions.', 'if', ['although', 'because', 'despite'], 'introduces a condition'],
  ['I could not attend the meeting ___ my daughter was sick.', 'because', ['although', 'however', 'unless'], 'gives a reason'],
  ['___, I would like to thank you for your patience.', 'Finally', ['For example', 'However', 'Instead'], 'marks the last point'],
  ['A garden is cheap to build. ___, it teaches children useful skills.', 'Moreover', ['Nevertheless', 'Otherwise', 'Instead'], 'adds a stronger point'],
  ['The gym is expensive. ___, a park is free for everyone.', 'In contrast', ['Similarly', 'Therefore', 'In addition'], 'compares two different things'],
  ['___ these reasons, I support the bike lanes.', 'For', ['Because', 'Despite', 'Unless'], 'begins a conclusion ("For these reasons")'],
  ['The repair is urgent; ___, water may damage the floor.', 'otherwise', ['moreover', 'for example', 'similarly'], 'shows what happens if nothing is done'],
  ['I booked a table for six. ___, only four of us could come.', 'In the end', ['Firstly', 'For instance', 'Similarly'], 'shows the final outcome'],
  ['___ the delay, the staff were very helpful.', 'Despite', ['Although', 'Because', 'Even'], 'takes a noun ("the delay") and shows contrast'],
];
const items = gaps.map(([s, a, wrong, w], i) => ({ id: `wl-g${i + 1}`, type: 'mcq', q: `Choose the best linking word: <i>${s}</i>`, options: [a, ...wrong], answer: 0, sol: `<b>${a}</b> ${w}.` }));
items.push(
  { id: 'wl-p1', type: 'mcq', q: 'Where should a new paragraph start in an email?', options: ['When you move to a new point from the task', 'After every sentence', 'Only before the sign-off', 'Every 50 words exactly'], answer: 0, sol: 'One paragraph per idea or task point makes the structure clear (Readability).' },
  { id: 'wl-p2', type: 'mcq', q: 'How do you show a new paragraph clearly when typing?', options: ['Leave a blank line between paragraphs', 'Write the word PARAGRAPH', 'Use capital letters', 'Add three spaces in the middle of a line'], answer: 0, sol: 'A blank line is the clearest way to show paragraphs on screen.' },
  { id: 'wl-p3', type: 'mcq', q: 'Which is the best topic sentence for a paragraph about the cost of a car-share program?', options: ['The main advantage of car sharing is the money it saves.', 'I took a car once.', 'For example, it costs $12 an hour.', 'However, cars.'], answer: 0, sol: 'A topic sentence tells the reader what the paragraph is about. Details come after.' },
  { id: 'wl-p4', type: 'mcq', q: 'An answer uses "and" to join almost every idea. What is the fix?', options: ['Use a range of connectors that show the real link: because, however, as a result', 'Use "and" even more', 'Remove all connectors', 'Use "moreover" in every sentence'], answer: 0, sol: 'Varied, accurate connectors show how ideas relate. Overusing one (even a fancy one) reads badly.' },
  { id: 'wl-p5', type: 'mcq', q: 'Which connector is used wrongly? "I love this neighbourhood. Therefore, it is noisy at night."', options: ['Therefore (it should show contrast, like However)', 'I love', 'at night', 'Nothing is wrong'], answer: 0, sol: '"Therefore" shows a result, but noise is a contrast to loving the area. Use "However".' },
  { id: 'wl-p6', type: 'mcq', q: 'Which pair of sentences links most smoothly?', options: ['The hall holds 200 people. This makes it ideal for the dance.', 'The hall holds 200 people. Dance is fun.', 'The hall holds 200 people. Also hall.', 'The hall holds 200 people. However it holds 200.'], answer: 0, sol: '"This" refers back to the capacity and links the ideas (reference words help coherence).' },
  { id: 'wl-o1', type: 'order', q: 'Put the words in order.', options: ['As', 'a', 'result', 'I', 'missed', 'the', 'first', 'session'], answer: ['As a result I missed the first session'], sol: '"As a result, I missed the first session."' },
  { id: 'wl-o2', type: 'order', q: 'Put the words in order.', options: ['On', 'the', 'other', 'hand', 'parking', 'is', 'very', 'limited'], answer: ['On the other hand parking is very limited'], sol: '"On the other hand, parking is very limited."' },
  { id: 'wl-o3', type: 'order', q: 'Put the words in order.', options: ['This', 'is', 'why', 'I', 'prefer', 'the', 'first', 'option'], answer: ['This is why I prefer the first option'], sol: '"This is why..." links a conclusion to the reasons before it.' },
  { id: 'wl-o4', type: 'order', q: 'Put the sentences of a paragraph in order (A, B, C).', options: ['B', 'A', 'C'], answer: ['B A C'], sol: 'B (topic: the location is perfect) then A (it is two minutes from the station) then C (as a result, staff could arrive on time). Topic, detail, result.' },
);
items[items.length - 1].q = 'Put these sentences in the best order. A: It is two minutes from the subway station. B: The location of the new office is perfect. C: As a result, staff would rarely be late.';
items.push(
  { id: 'wl-t1', type: 'text', q: 'One word that means "also" and starts a sentence formally: "___, the room has a projector."', answer: ['Additionally', 'Furthermore', 'Moreover', 'Also'], maxWords: 1, sol: '<b>Additionally</b>, <b>Furthermore</b> or <b>Moreover</b>.' },
  { id: 'wl-t2', type: 'text', q: 'Two words that introduce an example: "___ ___, the city could add more benches."', answer: ['For example', 'For instance'], maxWords: 2, sol: '<b>For example</b> or <b>For instance</b>.' },
);
export default { title: 'Paragraphs and linking words', items };
