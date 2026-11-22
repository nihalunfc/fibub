// Speaking Task 5: Comparing and Persuading (lesson 5.6). Original items by fibub.
const items = [];
const add = (it) => items.push({ id: `scp-${String(items.length + 1).padStart(2, '0')}`, ...it });

// Comparatives (grammar)
const comp = [
  ['The cabin is ___ the resort, so we save money.', 'cheaper than', ['more cheap than', 'cheapest than', 'cheaper then'], 'One-syllable adjectives add <b>-er</b> and take <b>than</b>: <b>cheaper than</b>.', '"Then" is about time (first this, then that), not comparison.'],
  ['The hatchback is ___ the truck on gas.', 'much more economical than', ['much economicaler than', 'more economical that', 'the most economical than'], 'Long adjectives take <b>more ... than</b>; <b>much</b> makes the difference stronger.', '"The most" is for three or more things and never takes "than".'],
  ['The resort is not ___ the cabin.', 'as relaxing as', ['so relaxing than', 'as relaxing than', 'relaxing as'], 'The pattern is <b>not as + adjective + as</b>.', 'Mixing "as" with "than" is a common slip.'],
  ['The new gym is ___ to our apartment than the old one.', 'closer', ['more close', 'closest', 'more closer'], '<b>Close</b> is one syllable, so it becomes <b>closer</b>.', '"More closer" doubles the comparative.'],
  ['Of the two plans, this one is clearly the ___.', 'better', ['best', 'more better', 'gooder'], 'With exactly two options, careful speakers say <b>the better</b> one; good → better.', '"Best" is for three or more, and "gooder" is not a word.'],
  ['The train takes three hours, ___ the bus takes five.', 'whereas', ['because', 'so that', 'unless'], '<b>Whereas</b> puts two contrasting facts side by side, which is exactly what comparing needs.', '"Because" gives a reason, not a contrast.'],
];
comp.forEach(([q, a, wrong, sol, trap]) => add({ type: 'mcq', q: `Choose the best words: ${q}`, options: [a, ...wrong], answer: 0, sol, trap }));

// Tone and openings
add({ type: 'mcq', q: 'Your sister prefers the resort. Which opening is best for Task 5?', options: ['I can see why you like the resort, the pool looks great. But I really think the cabin is better for us.', 'The resort is a bad idea and you know it.', 'Okay, so, um, the cabin. It has bikes.', 'I will now describe Option A.'], answer: 0, sol: 'It <b>acknowledges</b> her option, then states your choice politely: warm tone and a clear position.', trap: 'Describing Option A like a report forgets that you are talking to a person who disagrees.' });
add({ type: 'mcq', q: 'You are persuading your manager. Which sentence has the right tone?', options: ['I understand the TV would be useful for meetings, but I believe the coffee machine would help the team more every day.', 'Trust me, the TV is pointless.', 'You have to buy the coffee machine.', 'Whatever, both are fine I guess.'], answer: 0, sol: 'Polite and confident: <b>I understand... but I believe...</b> respects the manager and still argues your point.', trap: '"You have to" sounds like an order, which is the wrong tone with a manager.' });
add({ type: 'mcq', q: 'Which closing is the strongest end to a Task 5 answer?', options: ['So what do you say? Shall I book the cabin tonight before it’s gone?', 'That is all.', 'And the resort also has a spa.', 'I am finished speaking now.'], answer: 0, sol: 'A friendly question plus a <b>clear next step</b> (book tonight) ends the persuasion naturally.', trap: 'Ending on the other option’s best feature weakens your own argument.' });
add({ type: 'mcq', q: 'Which response answers the other person’s concern best? (Your friend says the cabin has no Wi-Fi.)', options: ['I know you’ll miss the Wi-Fi, but that means we’ll actually talk and play games together, like we used to.', 'Wi-Fi is not important.', 'The cabin has canoes.', 'The resort has Wi-Fi too.'], answer: 0, sol: 'It names the concern (<b>I know you’ll miss...</b>) and turns it into a benefit.', trap: '"The cabin has canoes" is true but does not answer the concern at all.' });

// Strong reasons (fact + benefit)
const reasons = [
  ['Which reason persuades best for a shared used car?', 'The hatchback uses half the gas, so we’d each save about forty dollars a month.', ['The hatchback is red.', 'The hatchback is a car.', 'I saw a hatchback on TV once.'], 'A fact from the screen (<b>half the gas</b>) plus a concrete benefit (<b>save forty dollars</b>).'],
  ['Which reason persuades best for a coffee machine at work?', 'Staff won’t have to walk across the parking lot in winter, so breaks will be shorter and people will be happier.', ['The coffee machine costs nine hundred dollars.', 'Coffee is a drink.', 'The machine is cleaned once a week.'], 'It links a feature to what the manager cares about: <b>shorter breaks, happier staff</b>.'],
  ['Which reason persuades best for a community garden over a new parking lot?', 'The garden would give families fresh vegetables and a safe place for kids, while the parking lot would just bring more traffic.', ['The garden is green.', 'Parking lots are made of asphalt.', 'Gardens have plants.'], 'It compares both options (<b>while</b>) and shows a benefit for the community.'],
  ['Which reason persuades best for a weekend workshop instead of an online course?', 'In the workshop we can ask the instructor questions face to face, which is much faster than waiting days for an email reply online.', ['The workshop is on a weekend.', 'Online courses use the internet.', 'The workshop has a room.'], 'Clear comparison (<b>much faster than</b>) and a real benefit for the learner.'],
];
reasons.forEach(([q, a, wrong, sol]) => add({ type: 'mcq', q, options: [a, ...wrong], answer: 0, sol, trap: 'A fact with no benefit for the listener describes but does not persuade.' }));

// What is missing
add({ type: 'mcq', q: 'An answer says: "I choose the cabin. It is cheaper. It is closer. It has bikes. Thank you." What is most clearly missing?', options: ['Any mention of the other person’s preferred option and their concern', 'A comparative word', 'A clear choice', 'A detail from the screen'], answer: 0, sol: 'The speaker never acknowledges the resort or answers the listener’s worry, so the persuasion is <b>incomplete</b> (Task Fulfillment).', trap: '"Cheaper" and "closer" are comparatives, so that part is present.' });
add({ type: 'mcq', q: 'An answer acknowledges the friend, gives two strong reasons, answers a concern, then stops mid-sentence when time runs out. What should the speaker fix first?', options: ['Shorten each part so there is time for a closing line', 'Add more reasons', 'Speak more slowly', 'Skip the acknowledgement'], answer: 0, sol: 'Finishing on time is part of <b>length</b> in Task Fulfillment. Shorter parts leave room for the close.', trap: 'Adding reasons would make the timing problem worse.' });

// Paraphrase the task
add({ type: 'mcq', q: 'Which sentence best restates your choice without repeating the screen word for word?', options: ['I really think the lake cabin is the smarter choice for our family this summer.', 'Option A, lake cabin near Huntsville, one thousand one hundred dollars.', 'Option A is Option A.', 'I read Option A.'], answer: 0, sol: 'A natural sentence (<b>the smarter choice for our family</b>) sounds like real speech, not reading.', trap: 'Reading the option label aloud wastes time and sounds unnatural.' });

// Linking words
const links = [
  ['The cabin is cheaper. ___, it is only a two-hour drive.', 'On top of that', ['However', 'Instead', 'Otherwise'], '<b>On top of that</b> adds another reason in the same direction.'],
  ['The resort has a spa. ___, the cabin has a quiet dock that is just as relaxing.', 'Then again', ['Therefore', 'For example', 'As a result'], '<b>Then again</b> introduces the other side, a soft contrast.'],
  ['The truck is older ___ it has twice the kilometres.', 'and', ['but', 'although', 'unless'], 'Both facts point the same way (bad for the truck), so <b>and</b> fits.'],
  ['___ the TV would be nice, the coffee machine helps everyone every day.', 'Although', ['Because', 'So', 'Since then'], '<b>Although</b> admits a point and then contrasts it, perfect for acknowledging.'],
];
links.forEach(([q, a, wrong, sol]) => add({ type: 'mcq', q: `Choose the linking word: ${q}`, options: [a, ...wrong], answer: 0, sol }));

// Word order
const order = [
  ['I can see why you like the resort', 'Acknowledge the other choice.'],
  ['the cabin is much cheaper than the resort', 'Make a comparison.'],
  ['it is not as far as the airport', 'Use not as ... as.'],
  ['so we would save about four hundred dollars', 'Add a benefit.'],
  ['shall I book it before it is gone', 'Close with a question.'],
  ['I know you are worried about the drive', 'Name the concern.'],
];
order.forEach(([s, hint]) => {
  const chips = s.split(' ');
  const shuffled = [...chips].sort((a, b) => (a.length - b.length) || a.localeCompare(b));
  add({ type: 'order', q: `Put the words in order. (${hint})`, options: shuffled, answer: [s], sol: `<b>${s.charAt(0).toUpperCase() + s.slice(1)}.</b>` });
});

// Stress
add({ type: 'mcq', q: 'In the word <b>comfortable</b>, which syllable is stressed?', options: ['1st: COM', '2nd: FOR', '3rd: TA', '4th: BLE'], answer: 0, sol: 'Stress the first syllable: <b>COMF</b>-ta-ble (many speakers say it in three syllables).' });
add({ type: 'mcq', q: 'In the word <b>economical</b>, which syllable is stressed?', options: ['3rd: NOM', '1st: E', '2nd: CO', '4th: I'], answer: 0, sol: 'Words ending in <b>-ical</b> stress the syllable before it: e-co-<b>NOM</b>-i-cal.' });

add({ type: 'text', q: 'Type the comparative form of <b>far</b>, as in: "The resort is ___ from home than the cabin." (one word)', answer: ['farther', 'further'], maxWords: 1, sol: '<b>Far</b> is irregular: <b>farther</b> or <b>further</b> (both are used for distance in Canada).', trap: '"Farer" is not a word.' });

export default { title: 'Task 5: comparing and persuading', items };
