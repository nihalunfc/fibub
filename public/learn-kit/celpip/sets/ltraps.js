// Listening traps (lesson 2.8). Twenty-four very short original clips, each built around one classic trap:
// changed plan, repeated word, true-but-not-asked, negative, number, speaker mix-up, tone, condition. By fibub.
const clips = [
  ['Changed plan', [['A', 'Ella', 'Let’s meet at the library at two.'], ['B', 'Raj', 'The library closes early on Saturdays. How about the café next door at two thirty?'], ['A', 'Ella', 'Sure, see you there.']],
    'Where will they meet?', ['At the café', 'At the library', 'At Ella’s home', 'At the library entrance'], '"How about the café next door?" "Sure, see you there."', 'The library is the first plan, then it changes.'],
  ['Changed plan', [['A', 'Mark', 'I was going to drive to Halifax, but my car is in the shop, so I’m taking the bus.']],
    'How will Mark travel?', ['By bus', 'By car', 'By plane', 'By train'], '"So I’m taking the bus."', '"I was going to" signals a plan that did not happen.'],
  ['Repeated word', [['A', 'Customer', 'This jacket is nice, but do you have it in a larger size?'], ['B', 'Clerk', 'Not in this colour. The larger sizes only come in navy.'], ['A', 'Customer', 'Navy is fine.']],
    'What will the customer buy?', ['A larger jacket in navy', 'The same jacket in the same colour', 'A smaller jacket', 'Nothing'], 'She accepts the larger size in navy: "Navy is fine."', '"Nice" and "this colour" are repeated words; they do not mean she buys the first one.'],
  ['Repeated word', [['A', 'Ahmed', 'The meeting room is booked, so the training will be online.'], ['B', 'Tina', 'Then I can join from home.']],
    'Where will the training happen?', ['Online', 'In the meeting room', 'At Tina’s home office only', 'It is cancelled'], '"The training will be online."', '"Meeting room" is said, but it is booked, so it is not used.'],
  ['True but not asked', [['A', 'Lin', 'The new bakery is great. The bread is fresh, it’s cheap, and it’s right by the bus stop. But mostly I go because they make gluten-free bread, and I can’t eat wheat.']],
    'What is the MAIN reason Lin goes to the bakery?', ['It sells gluten-free bread', 'It is cheap', 'It is near the bus stop', 'The bread is fresh'], '"But mostly I go because they make gluten-free bread."', 'All the options are true, but only one is "mostly" the reason.'],
  ['True but not asked', [['A', 'Paul', 'I moved to Kelowna for the job. The weather and the lake are a nice bonus.']],
    'Why did Paul move?', ['For work', 'For the weather', 'For the lake', 'To be near family'], '"I moved to Kelowna for the job."', 'The weather and lake are true details, but only "a bonus".'],
  ['Negative', [['A', 'Grace', 'I don’t mind the long drive. What I can’t stand is the parking downtown.']],
    'What bothers Grace?', ['Parking downtown', 'The long drive', 'Traffic on the highway', 'The cost of gas'], '"What I can’t stand is the parking downtown."', '"I don’t mind" means it does NOT bother her.'],
  ['Negative', [['A', 'Tom', 'Is the pool closed tomorrow?'], ['B', 'Staff', 'Not tomorrow. It’s Thursday that we close for cleaning.']],
    'When is the pool closed?', ['Thursday', 'Tomorrow', 'Every day', 'Wednesday'], '"It’s Thursday that we close for cleaning."', '"Not tomorrow" removes tomorrow.'],
  ['Numbers', [['A', 'Clerk', 'The basic plan is thirty dollars a month. With unlimited data it’s forty-five, but we have a deal this week: unlimited for thirty-eight.'], ['B', 'Customer', 'I’ll take the deal.']],
    'How much will the customer pay per month?', ['$38', '$30', '$45', '$83'], '"Unlimited for thirty-eight. I’ll take the deal."', 'Three numbers are said; only the last matches the choice.'],
  ['Numbers', [['A', 'Nina', 'The train leaves at quarter to six, so let’s meet fifteen minutes before.']],
    'What time will they meet?', ['5:30', '5:45', '6:15', '6:00'], 'Quarter to six is 5:45; fifteen minutes before is 5:30.', '5:45 is the train time, not the meeting time.'],
  ['Numbers', [['A', 'Coach', 'We had sixteen players sign up, but three dropped out and two more joined last week.']],
    'How many players are there now?', ['15', '16', '13', '18'], '16 − 3 + 2 = 15.', '16 was the first number, before changes.'],
  ['Speaker mix-up', [['A', 'Jen', 'I think we should paint the kitchen yellow.'], ['B', 'Eric', 'Yellow is too bright. I’d go with light grey.'], ['A', 'Jen', 'Grey is boring, but fine, as long as we paint the door yellow.']],
    'Who wanted light grey?', ['Eric', 'Jen', 'Both of them', 'Neither of them'], 'Eric: "I’d go with light grey."', 'Jen agrees in the end, but it was not her idea.'],
  ['Speaker mix-up', [['A', 'Sara', 'Did you call the plumber?'], ['B', 'Ian', 'No, I thought you were going to.'], ['A', 'Sara', 'Okay, I’ll do it now.']],
    'Who will call the plumber?', ['Sara', 'Ian', 'Both', 'Nobody'], '"Okay, I’ll do it now," says Sara.', 'Ian thought Sara would call; she confirms she will.'],
  ['Tone', [['A', 'Ben', 'Oh, wonderful. The bus is late again. Just what I needed on my first day.']],
    'How does Ben feel?', ['Frustrated', 'Delighted', 'Relaxed', 'Excited'], '"Just what I needed" said about a late bus on his first day is sarcasm: he is frustrated.', '"Wonderful" is positive on paper; the situation shows he means the opposite.'],
  ['Tone', [['A', 'Amy', 'The hotel was clean, I suppose. The staff were polite enough. I just wouldn’t go back.']],
    'What is Amy’s overall opinion of the hotel?', ['Negative', 'Very positive', 'Excited', 'She has not stayed there'], '"I just wouldn’t go back" is her overall verdict. "I suppose" and "enough" weaken the praise.', 'Clean and polite are positive details, but weakened.'],
  ['Condition', [['A', 'Dan', 'I’ll come to the barbecue if I finish my shift on time. If not, I’ll just come for dessert.']],
    'What is certain about Dan?', ['He will come at some point', 'He will be there for the whole barbecue', 'He will not come', 'He will bring dessert'], 'Either way he comes: for the whole thing or for dessert.', 'Coming for the whole barbecue depends on "if I finish my shift on time".'],
  ['Condition', [['A', 'Manager', 'You can leave early on Friday, as long as the report is done by Thursday.']],
    'What must happen for the employee to leave early?', ['Finish the report by Thursday', 'Work late on Friday', 'Ask again on Friday', 'Find a replacement'], '"As long as the report is done by Thursday."', '"As long as" introduces the condition.'],
  ['Changed plan', [['A', 'Rita', 'For the potluck I’ll bring a salad. Actually, Ken is already bringing salad. I’ll make my lentil soup.']],
    'What will Rita bring?', ['Lentil soup', 'Salad', 'Dessert', 'Nothing'], '"Actually... I’ll make my lentil soup."', '"Actually" cancels the salad.'],
  ['True but not asked', [['A', 'Officer', 'Your passport photo was fine, and the form is complete. The only problem is the fee. It went up to one hundred and sixty dollars last month.']],
    'What is the problem with the application?', ['The fee has changed', 'The photo is wrong', 'The form is incomplete', 'The passport expired'], '"The only problem is the fee."', 'The photo and form are mentioned, but both are fine.'],
  ['Repeated word', [['A', 'Kim', 'The doctor said I should rest my ankle, so no running for two weeks. I can still swim, though.']],
    'What exercise can Kim do?', ['Swimming', 'Running', 'Nothing', 'Running slowly'], '"I can still swim, though."', '"Running" is the repeated word, but she cannot do it.'],
  ['Negative', [['A', 'Leo', 'It’s not that I don’t like the apartment. It’s just too far from my daughter’s school.']],
    'Why might Leo not take the apartment?', ['The location', 'He dislikes it', 'The price', 'It is too small'], '"It’s just too far from my daughter’s school."', '"Not that I don’t like" means he does like it.'],
  ['Speaker mix-up', [['A', 'Host', 'Mr. Banerjee, you think the new park will help the neighbourhood?'], ['B', 'Mr. Banerjee', 'I do. But my neighbour, Mrs. Hall, worries about noise at night.']],
    'Who is worried about noise?', ['Mrs. Hall', 'Mr. Banerjee', 'The host', 'Nobody'], '"My neighbour, Mrs. Hall, worries about noise at night."', 'Mr. Banerjee reports her worry; he supports the park.'],
  ['Numbers', [['A', 'Agent', 'Your flight was at nine ten, but it’s delayed by an hour and a half.']],
    'When will the flight leave now?', ['10:40', '9:10', '10:10', '11:10'], '9:10 plus 1 hour 30 minutes is 10:40.', '9:10 is the old time.'],
  ['Tone', [['A', 'Fay', 'You fixed the sink yourself? Well, I’m impressed. I really didn’t think you could.']],
    'How does Fay feel?', ['Surprised and impressed', 'Angry', 'Disappointed', 'Bored'], '"Well, I’m impressed. I really didn’t think you could."', '"Didn’t think you could" sounds negative, but it shows surprise at his success.'],
];
const groups = {};
const items = clips.map(([kind, lines, q, options, sol, trap], i) => {
  const g = `t${i + 1}`;
  groups[g] = { title: `Clip ${i + 1}. Trap to watch for: ${kind.toLowerCase()}.`, audio: lines.map(([who, name, text]) => ({ who, name, text })) };
  return { id: `ltr-${String(i + 1).padStart(2, '0')}`, type: 'mcq', group: g, q, options, answer: 0, sol, trap };
});
export default { title: 'listening traps: short clips', accent: 'en-CA', groups, items };
