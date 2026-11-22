// Speaking Task 8: Describing an Unusual Situation (lesson 5.9). Original items by fibub.
const items = [];
const add = (it) => items.push({ id: `sun-${String(items.length + 1).padStart(2, '0')}`, ...it });

// Best description (specific, comparison)
const desc = [
  ['a strange lamp', 'It’s about as tall as a person, and the shade is shaped like a giant umbrella turned upside down.', ['It’s a lamp, quite big, kind of strange.', 'It’s very interesting and unique.', 'It’s like the one you can see here.']],
  ['an unusual car', 'It’s a tiny two-seat car, about half the length of a normal car, with a little glass dome on top instead of a roof.', ['It’s a car that looks different.', 'It’s a weird car with stuff.', 'The car is very unusual and amazing.']],
  ['a strange shoe', 'It’s a running shoe with a small spring under the heel, a bit like the springs in a mattress.', ['It’s a shoe, but not normal.', 'It looks funny.', 'It’s a nice shoe for running.']],
  ['an odd bookshelf', 'The shelves form a spiral, like a staircase, going up around a white pole in the middle.', ['It’s a bookshelf that’s not straight.', 'It has books on it.', 'It’s a big piece of furniture.']],
];
desc.forEach(([what, a, wrong]) => add({ type: 'mcq', q: `You are describing ${what} on the phone. Which sentence helps the listener most?`, options: [a, ...wrong], answer: 0, sol: 'Size, shape and a <b>comparison with something familiar</b> let the listener build the image.', trap: 'Words like "strange" or "interesting" tell feelings, not what it looks like.' }));

// Position words
const pos = [
  ['The basket is ___ the back of the bicycle.', 'attached to', ['attached at', 'attach on', 'attaching in']],
  ['The water tank is ___ the tabletop, so you can’t see it from above.', 'underneath', ['over', 'on top of', 'beside of']],
  ['There is a small garden right ___ of the table.', 'in the middle', ['in the centre at', 'on middle', 'at the middle in']],
  ['A long pipe is ___ the side of the machine.', 'sticking out of', ['sticking out from of', 'stick out at', 'sticked out of']],
  ['The anchor is ___ the front lawn.', 'on', ['in', 'at', 'into']],
];
pos.forEach(([q, a, wrong]) => add({ type: 'mcq', q: `Choose the correct words: ${q}`, options: [a, ...wrong], answer: 0, sol: `The natural position phrase here is <b>${a}</b>.` }));

// Comparison grammar
const comp = [
  ['The wheel is ___ a pizza.', 'about the size of', ['about the size as', 'the size like', 'size than']],
  ['The house is ___ the one next door.', 'twice as wide as', ['twice wider as', 'two times as wide than', 'twice as wider']],
  ['The roof is shaped ___ an upside-down boat.', 'like', ['as', 'same', 'alike']],
  ['The handlebar is ___ a broom handle.', 'about as long as', ['about as long than', 'about long like', 'as longer as']],
];
comp.forEach(([q, a, wrong]) => add({ type: 'mcq', q: `Choose the correct comparison: ${q}`, options: [a, ...wrong], answer: 0, sol: `<b>${a}</b> is the correct pattern.` }));

// Talking around a missing word
add({ type: 'mcq', q: 'You do not know the word "porthole". Which is the best way to keep going?', options: ['There are small round windows along the side, like the ones on a ship.', '(Silence for five seconds.)', 'There are... um... I don’t know the word, sorry.', 'There are portals.'], answer: 0, sol: 'Describe it instead: <b>small round windows, like the ones on a ship</b>. No silence, no guessing a wrong word.' });
add({ type: 'mcq', q: 'You do not know the word "wicker". Which is best?', options: ['A basket made of thin woven sticks, like an old picnic basket.', 'A basket made of wicked.', 'A basket. I forget what it is made of. Sorry.', 'A basket made of the thing.'], answer: 0, sol: 'Explaining the material (<b>thin woven sticks</b>) gives the listener the picture.' });

// Order of description
add({ type: 'mcq', q: 'What should come first in your description?', options: ['The big picture: what it is and what is strange about it', 'The price', 'The colour of the smallest part', 'Your opinion of the designer'], answer: 0, sol: 'Big picture first, then details. The listener needs a frame before the small parts.' });
add({ type: 'mcq', q: 'Which order of details is easiest to follow?', options: ['Top to bottom: roof, windows, door, lawn', 'Door, roof, lawn, windows, roof again', 'Lawn, roof, door, lawn again', 'Random order, as you notice things'], answer: 0, sol: 'Move in <b>one direction</b> (top to bottom or left to right) so the listener can build the image step by step.' });
add({ type: 'mcq', q: 'Which opening sets the scene best?', options: ['Hey Sara, I’m walking past the new house on Elm Street, and you have to hear about this place.', 'It is a house.', 'As you can see, the house is very strange.', 'Okay, so, the roof.'], answer: 0, sol: 'It greets the listener, says <b>where you are</b> and why you are calling.', trap: '"As you can see" forgets that the listener cannot see the picture.' });
add({ type: 'mcq', q: 'Which closing best connects to the purpose? (Your parents need a kitchen table.)', options: ['You said you wanted something special for the kitchen, and it’s under seven hundred dollars. Should I ask if they deliver?', 'That’s the table.', 'Okay, bye.', 'The legs are copper.'], answer: 0, sol: 'Linking to <b>their need</b> and suggesting a next step completes the task.' });

// Missing
add({ type: 'mcq', q: 'An answer describes the object very well but never says why the speaker is calling. What is missing?', options: ['The purpose: the connection to the listener’s need', 'Comparisons', 'Colour', 'Position words'], answer: 0, sol: 'Task 8 has a situation. Linking the description to it is part of <b>Task Fulfillment</b>.' });
add({ type: 'mcq', q: 'An answer spends 40 seconds on the normal parts of a bicycle (seat, chain, brakes). What is the main problem?', options: ['Too little time on what is unusual', 'Too many comparisons', 'The tone is too formal', 'It is too short'], answer: 0, sol: 'Spend most of your time on the <b>unusual</b> feature: that is what the listener cannot imagine.' });

// Order items
const order = [
  ['you will not believe what I am looking at'],
  ['it is shaped like a giant open hand'],
  ['there is a basket attached to the back'],
  ['it is about as tall as a fridge'],
  ['should I take a picture and send it to you'],
];
order.forEach(([s]) => add({ type: 'order', q: 'Put the words in order to make a sentence for Task 8.', options: s.split(' ').sort(), answer: [s], sol: `<b>${s.charAt(0).toUpperCase() + s.slice(1)}.</b>` }));

// Text and stress
add({ type: 'text', q: 'Complete with one word: "Basically, it’s a bicycle, but it’s built for three people riding side by ___."', answer: ['side'], maxWords: 1, sol: '<b>Side by side</b> means next to each other.' });
add({ type: 'mcq', q: 'In the word <b>unusual</b>, which syllable is stressed?', options: ['2nd: U (yoo)', '1st: UN', '3rd: SU', '4th: AL'], answer: 0, sol: 'un-<b>U</b>-su-al. Stress the second syllable, said like "yoo".' });

add({ type: 'mcq', q: 'Which phrase describes material correctly?', options: ['The legs are made of old copper pipes.', 'The legs are made by old copper pipes.', 'The legs are make of old copper pipes.', 'The legs made from of copper pipes.'], answer: 0, sol: 'For what something consists of, say <b>made of</b>.', trap: '"Made by" names the person or company who made it.' });
add({ type: 'mcq', q: 'Which sentence describes colour most usefully?', options: ['It’s painted in green and white stripes, a bit like a candy cane.', 'It has colours.', 'The colour is nice.', 'It is coloured.'], answer: 0, sol: 'Exact colours, a pattern (<b>stripes</b>) and a comparison (<b>like a candy cane</b>) paint the picture.' });

export default { title: 'Task 8: describing an unusual situation', items };
