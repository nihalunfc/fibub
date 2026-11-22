// Tone in CELPIP emails (lesson 4.3). Original items by fibub.
const tones = ['Formal', 'Semi-formal', 'Friendly'];
const readers = [
  ['the customer service team of an online electronics store', 0],
  ['the city councillor for your ward', 0],
  ['a hiring manager you have never met', 0],
  ['the property management company of your building', 0],
  ['your supervisor, whom you see every day', 1],
  ['a neighbour you say hello to but do not know well', 1],
  ['your child’s teacher', 1],
  ['the coach of your community soccer team', 1],
  ['your best friend from college', 2],
  ['your brother', 2],
  ['a close friend who just moved to Halifax', 2],
  ['your cousin who invited you to her wedding', 2],
];
const why = ['A stranger or an organization: use a formal tone ("Dear Sir or Madam", "I would appreciate...", no contractions).', 'Someone you know in a work or community role: semi-formal ("Hi Mr. Chen" or "Dear Ms. Roy", polite but warm, a few contractions are fine).', 'Family or close friends: friendly ("Hi Sam", contractions, a warm personal tone, but still clear and complete).'];
const items = readers.map(([r, t], i) => ({ id: `wt-r${i + 1}`, type: 'mcq', q: `Which tone suits an email to <b>${r}</b>?`, options: [tones[t], ...tones.filter((_, j) => j !== t)], answer: 0, sol: why[t] }));
const pairs = [
  ['Formal (to a store)', 'I would be grateful if you could send a replacement.', ['Send me a new one ASAP.', 'Gimme a new one, okay?', 'You better send a new one.']],
  ['Friendly (to a friend)', 'Thanks so much for the lift on Saturday, you saved me!', ['I wish to express my gratitude for the transportation provided.', 'Your assistance with transport is acknowledged.', 'I am writing to formally thank you for driving.']],
  ['Semi-formal (to your manager)', 'Would it be possible to leave an hour early on Friday?', ['I am leaving early Friday, deal with it.', 'I hereby request permission to depart at an earlier hour.', 'Friday, early, me. Cool?']],
  ['Formal (to a city office)', 'I am writing to report a large pothole on Elm Street.', ['There’s a crazy hole on Elm, fix it!', 'Hey guys, Elm Street is a mess lol.', 'Pothole. Elm. Now.']],
  ['Friendly (to your sister)', 'Can’t wait to see you and the twins next week!', ['I anticipate our meeting with great pleasure.', 'Please confirm the date of your arrival.', 'Kindly advise of your travel arrangements.']],
  ['Semi-formal (to a neighbour)', 'I hope you don’t mind me asking, but could you move your car on Tuesday mornings?', ['Move your car or I’ll call a tow truck.', 'Yo, your car is in my way.', 'It is hereby requested that the vehicle be relocated.']],
];
pairs.forEach(([t, a, wrong], i) => items.push({ id: `wt-p${i + 1}`, type: 'mcq', q: `Tone needed: <b>${t}</b>. Which sentence fits best?`, options: [a, ...wrong], answer: 0, sol: `"${a}" matches the reader: polite enough, but natural.`, trap: 'Very stiff or old-fashioned language is a tone mistake too, not only rude language.' }));
const fix = [
  ['To a store: "I want my money back now."', 'I would like a full refund, please.'],
  ['To your landlord: "Fix the sink."', 'Could you please arrange for someone to fix the sink?'],
  ['To your manager: "I can’t come Monday."', 'Unfortunately, I will not be able to come in on Monday.'],
  ['To a friend: "I hereby accept your invitation."', 'I’d love to come!'],
];
fix.forEach(([s, a], i) => items.push({ id: `wt-f${i + 1}`, type: 'mcq', q: `Which rewrite has the best tone? <i>${s}</i>`, options: [a, s.split(': ')[1].replace(/"/g, ''), 'Whatever works for you, I guess.', 'Do it now, please, immediately.'], answer: 0, sol: `"${a}" keeps the message but fits the reader.` }));
items.push(
  { id: 'wt-o1', type: 'order', q: 'Put the words in order to soften a complaint.', options: ['I', 'am', 'afraid', 'there', 'is', 'a', 'problem', 'with', 'my', 'bill'], answer: ['I am afraid there is a problem with my bill'], sol: '"I am afraid..." softens bad news politely.' },
  { id: 'wt-o2', type: 'order', q: 'Put the words in order to make a semi-formal request.', options: ['Would', 'you', 'mind', 'checking', 'the', 'schedule', 'for', 'me'], answer: ['Would you mind checking the schedule for me'], sol: '"Would you mind + -ing" is polite but not stiff.' },
  { id: 'wt-c1', type: 'mcq', q: 'Your email is to an insurance company. Which feature makes the tone too informal?', options: ['"Thanks a ton, you guys rock!"', '"Thank you for your attention to this matter."', '"I look forward to your reply."', '"Please find the details below."'], answer: 0, sol: 'Slang like "you guys rock" does not suit a company. Task Fulfillment includes tone.' },
  { id: 'wt-c2', type: 'mcq', q: 'You are angry with a company. What is the best tone?', options: ['Firm and polite: clear facts and a clear request', 'Angry, so they know how you feel', 'Very friendly, with jokes', 'Short and cold, with no greeting'], answer: 0, sol: 'Raters reward a firm but polite tone. State facts and what you want; skip insults.' },
);
export default { title: 'Getting the tone right', items };
