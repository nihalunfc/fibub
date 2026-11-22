// The grammar mistakes that cost the most (lesson 4.7). Original items by fibub.
const fixes = [
  ['She live in Moncton since 2019.', 'She has lived in Moncton since 2019.', ['She is living in Moncton since 2019.', 'She lived in Moncton since 2019.', 'She live in Moncton from 2019.'], 'Use the present perfect (has lived) with "since" for something that started in the past and continues.'],
  ['My neighbour have two dogs.', 'My neighbour has two dogs.', ['My neighbour having two dogs.', 'My neighbour are have two dogs.', 'My neighbour haves two dogs.'], 'Third person singular: he/she/my neighbour <b>has</b>.'],
  ['I am writing to complain about the noises.', 'I am writing to complain about the noise.', ['I am writing to complain about a noises.', 'I am writing to complain about noises’.', 'I am writing to complain about the noisy.'], '"Noise" in general is usually uncountable.'],
  ['Please give me an information about the course.', 'Please give me some information about the course.', ['Please give me informations about the course.', 'Please give me a informations about the course.', 'Please give me an informations about the course.'], '"Information" is uncountable: no "an", no plural. Same for advice, furniture, equipment.'],
  ['I look forward to hear from you.', 'I look forward to hearing from you.', ['I look forward to heard from you.', 'I look forward hear from you.', 'I look forward for hearing from you.'], 'After "look forward to", use the -ing form.'],
  ['If I will have time, I will help.', 'If I have time, I will help.', ['If I would have time, I will help.', 'If I had time, I will help.', 'If I having time, I will help.'], 'In first conditionals, use the present tense after "if".'],
  ['The parking is very expensive, people avoid downtown.', 'The parking is very expensive, so people avoid downtown.', ['The parking is very expensive people avoid downtown.', 'The parking is very expensive, however people avoid downtown.', 'The parking very expensive, people avoid downtown.'], 'Two full sentences joined by only a comma is a comma splice. Add a connector (so) or a full stop.'],
  ['Because the bus was late.', 'I was late because the bus was late.', ['Because the bus was late!', 'Because was the bus late.', 'Because the bus late.'], 'A "because" clause alone is a fragment. Join it to a main clause.'],
  ['Yesterday I go to the clinic and wait two hours.', 'Yesterday I went to the clinic and waited two hours.', ['Yesterday I go to the clinic and waited two hours.', 'Yesterday I am going to the clinic and wait two hours.', 'Yesterday I gone to the clinic and waited two hours.'], 'Finished past time (yesterday) needs the past simple: went, waited.'],
  ['There is many reasons to choose Option A.', 'There are many reasons to choose Option A.', ['There is much reasons to choose Option A.', 'There be many reasons to choose Option A.', 'There have many reasons to choose Option A.'], '"There are" with plural nouns.'],
  ['I suggest you to call the manager.', 'I suggest that you call the manager.', ['I suggest you calling the manager.', 'I suggest to you call the manager.', 'I suggest you to calling the manager.'], 'Suggest + that + subject + verb (or suggest + -ing). Not "suggest you to".'],
  ['The furnitures in the lobby is old.', 'The furniture in the lobby is old.', ['The furnitures in the lobby are old.', 'The furniture in the lobby are olds.', 'A furnitures in the lobby is old.'], '"Furniture" is uncountable.'],
  ['I am agree with the first option.', 'I agree with the first option.', ['I am agreeing with the first option.', 'I agreed to the first option am.', 'I am agree to the first option.'], '"Agree" is a verb: I agree. Not "I am agree".'],
  ['She is more better at planning than me.', 'She is better at planning than me.', ['She is more good at planning than me.', 'She is best at planning than me.', 'She is gooder at planning than me.'], '"Better" is already comparative; do not add "more".'],
  ['I have received your email yesterday.', 'I received your email yesterday.', ['I have receive your email yesterday.', 'I was received your email yesterday.', 'I am receiving your email yesterday.'], 'With a finished time (yesterday), use the past simple, not the present perfect.'],
  ['Every students need a quiet place to study.', 'Every student needs a quiet place to study.', ['Every students needs a quiet place to study.', 'Every student need a quiet place to study.', 'All student needs a quiet place to study.'], '"Every" takes a singular noun and a singular verb.'],
];
const items = fixes.map(([bad, good, wrong, w], i) => ({ id: `wg-f${i + 1}`, type: 'mcq', q: `Choose the correct version: <i>${bad}</i>`, options: [good, ...wrong], answer: 0, sol: w }));
const spell = [
  ['I did not ___ the package.', 'receive', ['recieve', 'receeve', 'resieve']],
  ['The library is ___ for students.', 'necessary', ['neccessary', 'necesary', 'neccesary']],
  ['Please wait ___ Friday.', 'until', ['untill', 'untile', 'intil']],
  ['I am ___ for the delay.', 'sorry', ['sory', 'sorrey', 'soory']],
  ['We need a reliable ___.', 'schedule', ['schedual', 'shedule', 'schedulle']],
  ['It was a great ___.', 'opportunity', ['oportunity', 'opportunaty', 'oppurtunity']],
  ['I would ___ your help.', 'appreciate', ['apreciate', 'appriciate', 'appreaciate']],
  ['Our ___ is very quiet.', 'neighbourhood', ['neighborhod', 'nieghbourhood', 'neighbourood']],
];
spell.forEach(([s, a, wrong], i) => items.push({ id: `wg-s${i + 1}`, type: 'mcq', q: `No spell check on test day. Which spelling is right? <i>${s}</i>`, options: [a, ...wrong], answer: 0, sol: `Correct: <b>${a}</b>. Spelling counts under Readability.` }));
items.push(
  { id: 'wg-t1', type: 'text', q: 'Write the past form: "Last week the store ___ (send) me the wrong item."', answer: ['sent'], maxWords: 1, sol: 'send → <b>sent</b>.' },
  { id: 'wg-t2', type: 'text', q: 'Write the right article: "I have ___ appointment at 3 p.m."', answer: ['an'], maxWords: 1, sol: '<b>an</b> before a vowel sound (an appointment).' },
  { id: 'wg-o1', type: 'order', q: 'Put the words in order to make a correct sentence.', options: ['I', 'have', 'been', 'waiting', 'for', 'three', 'weeks'], answer: ['I have been waiting for three weeks'], sol: 'Present perfect continuous for something that started in the past and is still going.' },
  { id: 'wg-o2', type: 'order', q: 'Put the words in order to make a correct question.', options: ['Could', 'you', 'tell', 'me', 'when', 'the', 'office', 'opens'], answer: ['Could you tell me when the office opens'], sol: 'In an indirect question, use statement order: "when the office opens", not "when does the office open".' },
);
export default { title: 'The grammar mistakes that cost the most', items };
