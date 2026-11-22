// Speaking Task 7: Expressing Opinions (lesson 5.8). Original items by fibub.
const items = [];
const add = (it) => items.push({ id: `sop-${String(items.length + 1).padStart(2, '0')}`, ...it });

// Best opening (clear position)
const open = [
  ['Should cities offer free public transit for seniors?', 'In my opinion, cities should definitely offer free transit for seniors.', ['Free transit is a topic many people talk about.', 'Well, there are good points and bad points, so it depends.', 'Seniors use transit, and cities have transit.']],
  ['Should schools ban phones in class?', 'I strongly believe phones should be banned during class time.', ['Phones are very popular these days.', 'Some people like phones and some people don’t.', 'I have a phone and my son has a phone.']],
  ['Is it better to rent or to buy a home?', 'Personally, I think renting is the smarter choice for most young people today.', ['Homes are expensive and rent is expensive.', 'Buying and renting both have advantages, so I can’t say.', 'Many people live in homes.']],
  ['Should restaurants be required to show calories on menus?', 'I’m all for showing calories on menus, because it helps people make better choices.', ['Calories are on some menus and not on others.', 'It’s hard to say, really.', 'Restaurants make food.']],
];
open.forEach(([q, a, wrong]) => add({ type: 'mcq', q: `Question: ${q} Which first sentence is best?`, options: [a, ...wrong], answer: 0, sol: 'The first sentence should state a <b>clear position</b> using the words of the question.', trap: 'Starting with "it depends" or a general fact leaves the listener unsure of your view.' }));

// Best example (specific support)
const ex = [
  ['Reason: Volunteer hours teach teenagers real skills.', 'My nephew volunteered at a food bank in Grade 10 and learned to run the till, which got him his first paid job.', ['Volunteering is good for skills.', 'Skills are important in life.', 'Many teenagers volunteer.']],
  ['Reason: Working from home saves time.', 'My commute was seventy minutes each way, so working from home gave me back almost twelve hours a week.', ['Commuting takes time.', 'Time is very important.', 'Working from home is popular now.']],
  ['Reason: Car-free streets help local shops.', 'When our town closed Main Street for a summer festival, the bakery on the corner sold out every Saturday.', ['Shops like customers.', 'Cars are bad for shops sometimes.', 'Main Street has many shops.']],
  ['Reason: Phones distract students.', 'My daughter told me half her class checks social media during math, and her teacher has to repeat everything.', ['Phones are distracting.', 'Students use phones.', 'Distraction is a problem.']],
];
ex.forEach(([r, a, wrong]) => add({ type: 'mcq', q: `${r} Which example supports it best?`, options: [a, ...wrong], answer: 0, sol: 'A strong example is <b>specific</b>: a real person, place, number or event.', trap: 'Repeating the reason in other words is not an example.' }));

// Handling the other side
add({ type: 'mcq', q: 'You support car-free weekends. Which sentence handles the other side best?', options: ['I understand drivers might find it harder, but a few side streets could stay open for parking and deliveries.', 'Drivers are wrong.', 'Some people don’t agree, and maybe they are right, so I’m not sure anymore.', 'Nobody disagrees with this.'], answer: 0, sol: '<b>I understand... but...</b> admits the concern and then answers it with a solution, keeping your position.', trap: 'Saying "maybe they are right, I’m not sure" changes sides and weakens coherence.' });
add({ type: 'mcq', q: 'You think students should do volunteer hours. Which sentence handles the other side best?', options: ['Admittedly, some students are busy with part-time jobs, but forty hours over four years is less than one hour a month.', 'Busy students should just stop working.', 'That is a stupid argument.', 'Everyone has time.'], answer: 0, sol: '<b>Admittedly..., but...</b> plus a quick calculation answers the concern calmly.' });

// Conclusion
add({ type: 'mcq', q: 'Which conclusion is best for an answer supporting free transit for seniors?', options: ['So overall, I believe free transit for seniors is a small cost for a very big benefit.', 'So, that’s it.', 'In conclusion, transit is a big topic with many sides.', 'Anyway, maybe the city can’t pay for it.'], answer: 0, sol: 'A good conclusion <b>restates the opinion in new words</b> and sums up why.', trap: 'Ending on the opposite argument leaves the listener confused.' });
add({ type: 'mcq', q: 'At about 75 seconds you are still on your second reason. What should you do?', options: ['Finish the sentence and move straight to a one-line conclusion', 'Start a third reason', 'Stop talking and wait', 'Repeat your first reason'], answer: 0, sol: 'A one-line conclusion before time runs out makes the answer feel complete.' });

// Missing parts
add({ type: 'mcq', q: 'An answer: "I agree with working from home. It saves time. It saves money. It is comfortable. It is good for families. So I agree." What is weakest?', options: ['No reason has an example or explanation', 'There is no opinion', 'There is no conclusion', 'It is off topic'], answer: 0, sol: 'Four reasons with no support sound like a list. Two reasons, each with an example, would be stronger.' });
add({ type: 'mcq', q: 'An answer gives good reasons for both sides and ends with "So it really depends on the person." What is the main problem?', options: ['It never takes a clear position', 'It is too short', 'It has no reasons', 'It has too many examples'], answer: 0, sol: 'Task 7 asks for <b>your opinion</b>. Choose a side and defend it.' });
add({ type: 'mcq', q: 'In 30 seconds of planning, what should you write?', options: ['Your side, two reasons with an example each, and one word for the other side', 'A full introduction sentence', 'Nothing; just start talking', 'Every idea you can think of'], answer: 0, sol: 'Short notes for <b>reasons and examples</b> give you a map for 90 seconds.' });

// Linking
const links = [
  ['___ reason is that it saves money.', 'Another', ['However', 'Although', 'Despite']],
  ['Some people say it is too expensive. ___, I think the benefits are worth it.', 'Even so', ['For example', 'Because', 'In addition']],
  ['It reduces traffic. ___, my street used to be jammed every Saturday.', 'For instance', ['On the other hand', 'In conclusion', 'Unless']],
  ['___ all these reasons, I strongly support the idea.', 'For', ['Despite', 'Although', 'Unless']],
];
links.forEach(([q, a, wrong]) => add({ type: 'mcq', q: `Choose the linking phrase: ${q}`, options: [a, ...wrong], answer: 0, sol: `<b>${a}</b> fits the meaning here.` }));

// Grammar fixes
const gram = [
  ['I am agree with this idea.', 'I agree with this idea.', ['I am agreed with this idea.', 'I agreeing with this idea.', 'I am agreeing this idea.'], '<b>Agree</b> is a verb, so no <b>am</b>: <b>I agree</b>.'],
  ['People is happier without cars.', 'People are happier without cars.', ['People be happier without cars.', 'People is more happier without cars.', 'Peoples are happier without cars.'], '<b>People</b> is plural: <b>people are</b>.'],
  ['In my opinion, I think it is good.', 'In my opinion, it is good.', ['In my opinion, I am think it is good.', 'In my opinion I thinking it is good.', 'My opinion I think it good.'], '<b>In my opinion</b> and <b>I think</b> mean the same; use one.'],
];
gram.forEach(([bad, a, wrong, s]) => add({ type: 'mcq', q: `Fix the sentence: "${bad}"`, options: [a, ...wrong], answer: 0, sol: s }));

// Order
const order = [
  ['I strongly believe phones should be banned in class'],
  ['the main reason is that it saves time'],
  ['some people argue that it costs too much'],
  ['that is why I support this idea'],
];
order.forEach(([s]) => add({ type: 'order', q: 'Put the words in order to make a sentence for Task 7.', options: s.split(' ').sort(), answer: [s], sol: `<b>${s.charAt(0).toUpperCase() + s.slice(1)}.</b>` }));

// Stress
add({ type: 'mcq', q: 'In the word <b>opinion</b>, which syllable is stressed?', options: ['2nd: PIN', '1st: O', '3rd: ION', 'All equally'], answer: 0, sol: 'o-<b>PIN</b>-ion. Stress the second syllable.' });
add({ type: 'mcq', q: 'In the word <b>environment</b>, which syllable is stressed?', options: ['2nd: VI', '1st: EN', '3rd: RON', '4th: MENT'], answer: 0, sol: 'en-<b>VI</b>-ron-ment. Stress the second syllable.' });

add({ type: 'text', q: 'Complete with one word: "Some people argue that it is too expensive. That’s a ___ point, but the benefits are bigger."', answer: ['fair', 'good', 'valid'], maxWords: 1, sol: '<b>That’s a fair point, but...</b> admits the other side politely before you answer it.' });
add({ type: 'text', q: 'Complete with one word: "All things ___, I’m convinced it is a good idea."', answer: ['considered'], maxWords: 1, sol: '<b>All things considered</b> is a natural way to begin a conclusion.' });

export default { title: 'Task 7: expressing opinions', items };
