// Speaking Task 6: Dealing with a Difficult Situation (lesson 5.7). Original items by fibub.
const items = [];
const add = (it) => items.push({ id: `sdf-${String(items.length + 1).padStart(2, '0')}`, ...it });

// Softening bad news
const soft = [
  ['Tell a friend you cannot come to her birthday dinner.', 'I’m really sorry, but I won’t be able to make it to your dinner on Friday.', ['I’m not coming Friday.', 'Your dinner is on Friday, right? Anyway.', 'Friday dinner is impossible for me, okay?'], 'Apology (<b>really sorry</b>) + softener (<b>won’t be able to</b>) + the clear news.'],
  ['Tell your boss you cannot stay late tonight.', 'I’m afraid I can’t stay late tonight; I have to pick up my son from daycare by six.', ['No way I’m staying late.', 'Tonight? Forget it.', 'Ask someone else, I’m busy.'], '<b>I’m afraid</b> softens the refusal, and a short reason follows at once.'],
  ['Tell your landlord the rent will be three days late.', 'Unfortunately, my rent will be about three days late this month, because my pay was delayed.', ['Rent is late. Deal with it.', 'I don’t have the rent.', 'Maybe I’ll pay you sometime.'], '<b>Unfortunately</b> + exact information (three days) + a reason keeps it honest and respectful.'],
  ['Tell your sister you cannot lend her your car this weekend.', 'I wish I could help, but I really need the car this weekend for my shifts.', ['You can’t have my car.', 'Why do you always ask me?', 'My car is mine.'], '<b>I wish I could help, but</b> shows goodwill before saying no.'],
];
soft.forEach(([sit, a, wrong, sol]) => add({ type: 'mcq', q: `Which is the most polite way to do this? ${sit}`, options: [a, ...wrong], answer: 0, sol, trap: 'Short, blunt refusals are clear but sound rude, which hurts Task Fulfillment (tone).' }));

// Empathy
const emp = [
  ['Your friend was counting on you to drive her to the airport.', 'I know you were counting on me, and I feel awful about it.'],
  ['Your coworker will have to work alone because you are leaving early.', 'I understand this makes your afternoon a lot harder.'],
  ['Your neighbour asked you to water her plants, but you will be away.', 'I know how much you care about your plants, so I really don’t want to let you down.'],
];
emp.forEach(([sit, a]) => add({ type: 'mcq', q: `Which sentence shows the best empathy? ${sit}`, options: [a, 'It’s not a big deal.', 'Things happen, you know.', 'You should have asked someone else first.'], answer: 0, sol: `Empathy names the other person’s feelings or problem: <b>${a}</b>`, trap: '"It’s not a big deal" dismisses their feelings, which sounds cold.' }));

// Solutions
const sol = [
  ['You cannot help your friend move on Saturday.', 'I’ve asked my cousin to come with his truck on Saturday, and I’ll help you unpack on Sunday.', ['Maybe someone can help you.', 'Moving is hard, good luck.', 'You could hire people, I guess.']],
  ['You cannot finish your part of a team report by Friday.', 'I can send you the first two sections on Friday and the last one by Monday at noon.', ['I’ll do it when I can.', 'Reports take time.', 'Someone else can do my part.']],
  ['You broke a friend’s blender while house-sitting.', 'I’ve already ordered the same model, and it will arrive at your place on Thursday.', ['Blenders break all the time.', 'It was old anyway.', 'Sorry, it just stopped working.']],
  ['You must cancel babysitting for your neighbour tonight.', 'My daughter, who is sixteen and has babysat before, can come instead if that’s okay with you.', ['You can stay home tonight.', 'Babysitters are easy to find.', 'I’m sure the kids will be fine alone.']],
];
sol.forEach(([sit, a, wrong]) => add({ type: 'mcq', q: `Which offer is the strongest solution? ${sit}`, options: [a, ...wrong], answer: 0, sol: 'The best offer is <b>specific</b>: who, what and when. Vague offers do not solve the problem.', trap: 'Vague or blaming offers leave the listener with the problem.' }));

// Talking TO the person
add({ type: 'mcq', q: 'You chose to talk to your manager. Which opening follows the task correctly?', options: ['Hi Ms. Chen, do you have a minute? It’s about the extra shift on Saturday.', 'I would tell my manager that I can’t work.', 'My manager is Ms. Chen and she wants me to work.', 'I chose the manager because it is easier.'], answer: 0, sol: 'Task 6 asks you to speak <b>directly</b> to the person: use their name and <b>you</b>.', trap: '"I would tell my manager..." describes the conversation instead of having it.' });
add({ type: 'mcq', q: 'Which choice of person is usually smartest in Task 6?', options: ['The one you can give clear reasons and a good solution to', 'The one with the longer name', 'Both people, half the time each', 'The one you dislike more'], answer: 0, sol: 'Choose the option that gives you the <b>clearest reasons and best solution</b>. Speak to one person only.', trap: 'Talking to both people splits your 60 seconds and does not follow the task.' });

// Formal vs friendly
const reg = [
  ['your landlord', 'I was wondering if it would be possible to make an exception, just for two weeks.', ['Come on, just let me keep the dog, buddy.', 'Whatever, I’m keeping the dog.', 'Rules are dumb, right?'], 'With a landlord, a formal request (<b>I was wondering if it would be possible</b>) is the right tone.'],
  ['your best friend', 'Hey, I hate to do this, but I can’t make it on Saturday.', ['Dear Sir, I regret to inform you that I am unavailable.', 'Please be advised of my absence.', 'This is to notify you of a change.'], 'With a close friend, warm and casual is right. Very formal language sounds cold or strange.'],
  ['your team leader', 'Would you consider giving us until Monday? We want the draft to be really good.', ['Give us till Monday, okay?', 'We need more time, deal with it.', 'Monday. Final answer.'], 'A polite question (<b>Would you consider</b>) plus a positive reason fits a team leader.'],
];
reg.forEach(([who, a, wrong, s]) => add({ type: 'mcq', q: `You are speaking to ${who}. Which sentence has the best tone?`, options: [a, ...wrong], answer: 0, sol: s }));

// What is missing
add({ type: 'mcq', q: 'An answer: "Hi Tom. Sorry, I can’t help you move on Saturday because I have to work. I know you needed me. Sorry again, bye." What is missing?', options: ['A solution or alternative', 'The news', 'A reason', 'Empathy'], answer: 0, sol: 'News, reason and empathy are all there, but there is <b>no offer</b> to help in another way, so the task feels unfinished.' });
add({ type: 'mcq', q: 'An answer spends 40 seconds on small talk about the weather and the weekend before mentioning the problem. What is the main issue?', options: ['The news comes far too late, leaving little time for reasons and a solution', 'The vocabulary is too difficult', 'It is too short', 'It uses too many contractions'], answer: 0, sol: 'Prepare the listener briefly, then <b>give the news in the first two sentences</b>.' });
add({ type: 'mcq', q: 'Which reason is best for a Task 6 answer?', options: ['Two coworkers are off sick, so the store can’t open without me.', 'Well, on Monday I woke up late, then on Tuesday my car made a noise, and on Wednesday my sister called, and...', 'I just don’t feel like it.', 'Reasons are private.'], answer: 0, sol: 'One short, believable reason is best. Long stories eat your time; no reason sounds rude.' });

// Linking
const links = [
  ['I promised to help you. ___, my manager now needs me that day.', 'Unfortunately', ['Luckily', 'For example', 'Similarly']],
  ['I can’t come on Saturday. ___, I can come on Sunday morning.', 'However', ['Therefore', 'Because', 'In addition']],
  ['Two people are sick, ___ my boss really needs me.', 'so', ['but', 'although', 'unless']],
];
links.forEach(([q, a, wrong]) => add({ type: 'mcq', q: `Choose the linking word: ${q}`, options: [a, ...wrong], answer: 0, sol: `<b>${a}</b> fits the meaning here.` }));

// Order
const order = [
  ['I am afraid I cannot make it on Saturday', 'Soft refusal.'],
  ['I know you were counting on me', 'Empathy.'],
  ['what I can do is help you on Sunday', 'Offer a solution.'],
  ['would it be possible to keep the dog for two weeks', 'Formal request.'],
  ['do you have a minute to talk', 'Prepare the listener.'],
  ['I have already asked my cousin to help', 'Arranged solution.'],
];
order.forEach(([s, hint]) => {
  const chips = s.split(' ');
  add({ type: 'order', q: `Put the words in order. (${hint})`, options: [...chips].sort(), answer: [s], sol: `<b>${s.charAt(0).toUpperCase() + s.slice(1)}.</b>` });
});

// Stress
add({ type: 'mcq', q: 'In the word <b>unfortunately</b>, which syllable is stressed?', options: ['2nd: FOR', '1st: UN', '3rd: TU', '4th: NATE'], answer: 0, sol: 'un-<b>FOR</b>-tu-nate-ly. Stress the second syllable.' });
add({ type: 'text', q: 'Complete the soft refusal with one word: "I’m ___, but I won’t be able to help on Saturday."', answer: ['sorry'], maxWords: 1, sol: '<b>I’m sorry, but...</b> softens bad news. (<b>I’m afraid</b> also works, but without <b>but</b>: I’m afraid I won’t be able to...)' });

export default { title: 'Task 6: dealing with a difficult situation', items };
