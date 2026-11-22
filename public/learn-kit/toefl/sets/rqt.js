// Reading question types (lesson 2.5). Original items by fibub, not ETS material.
const items = [];
const T = ['Detail (stated in the text)', 'Inference (not stated, but follows)', 'Vocabulary in context', 'Purpose (why the author wrote something)', 'Main idea'];
const kinds = [
  ['According to the passage, when did the first bridge open?', 0, 'It asks for a fact the text states: "according to the passage".'],
  ['Which of the following can be inferred about the early settlers?', 1, '"Can be inferred" = not stated directly, but it must follow from the text.'],
  ['The word "dense" in paragraph 2 is closest in meaning to...', 2, '"closest in meaning to" = vocabulary in context.'],
  ['Why does the author mention the price of salt?', 3, '"Why does the author mention..." asks about purpose, not about the fact itself.'],
  ['What is the passage mainly about?', 4, '"mainly about" = main idea of the whole passage.'],
  ['What does the passage suggest about the professor’s opinion?', 1, '"suggest" usually signals an inference.'],
  ['According to paragraph 3, what caused the drought?', 0, 'A stated fact in a named paragraph.'],
  ['In the notice, the word "valid" is closest in meaning to...', 2, 'A vocabulary question about one word in its sentence.'],
  ['Why does the writer include the example of the tomato plant?', 3, 'An example is there for a reason; this asks for the reason.'],
  ['Which sentence best states the main point of the email?', 4, 'The main point of the whole text.'],
  ['What is most likely true about students who arrive late?', 1, '"most likely true" = an inference the text supports.'],
  ['Which of the following is NOT mentioned as a cause of erosion?', 0, 'A negative detail question: three causes are stated, one is not.'],
  ['The phrase "in turn" in the passage is closest in meaning to...', 2, 'A vocabulary question about a phrase.'],
  ['What is the function of the last sentence of paragraph 1?', 3, '"function" = what job the sentence does (purpose).'],
];
kinds.forEach(([q, a, why], i) => {
  const opts = [T[a], ...T.filter((_, k) => k !== a)].slice(0, 4);
  items.push({ id: `rqt-k${String(i + 1).padStart(2, '0')}`, type: 'mcq', q: `What type of question is this? <i>"${q}"</i>`, options: opts, answer: 0, sol: why });
});
const groups = {
  q1: { title: 'Read the short passage.', passage: '<p>Sea otters spend almost their whole lives in cold ocean water, yet unlike seals and whales they have no thick layer of fat. Instead, they rely on the densest fur of any animal, with up to a million hairs in a single square inch. The fur traps a layer of air that keeps the skin dry. For this reason, otters spend hours each day grooming; a coat that becomes dirty or matted no longer holds air, and the animal quickly loses heat.</p>' },
  q2: { title: 'Read the short passage.', passage: '<p>When the town of Millbrook built its first public swimming pool in 1931, officials expected it to be used mainly by children. Within a month, however, so many adults came after work that the pool extended its evening hours twice. The town council later admitted that it had underestimated how few places residents had to cool off during the hot summers.</p>' },
  q3: { title: 'Read the short passage.', passage: '<p>Most early paper was made from old cloth, which was beaten into a pulp, spread on screens and dried. As demand for books and newspapers grew in the 1800s, there was simply not enough cloth. Inventors experimented with straw, grass and even wasps’ nests before wood pulp became the standard. Wood was cheap and plentiful, but paper made from it contains acids that cause it to yellow and crumble over time, a problem librarians still face today.</p>' },
  q4: { title: 'Read the short passage.', passage: '<p>Desert ants that leave their nest to search for food may walk a long, winding path. Yet when they find food, they return in an almost straight line. Experiments suggest that the ants count their steps and use the position of the sun to keep track of direction. When researchers attached tiny stilts to the legs of ants that had just found food, the ants walked past their nest on the way home, as if their longer steps had made them misjudge the distance.</p>' },
};
const g = [
  ['q1', 'According to the passage, how do sea otters stay warm?', ['Their dense fur traps a layer of air', 'They have a thick layer of fat', 'They stay out of the water', 'They groom other otters'], 'Detail. "they rely on the densest fur ... The fur traps a layer of air".', 'Fat is what seals and whales use; otters have none.'],
  ['q1', 'Why does the author mention seals and whales?', ['To contrast them with otters, which lack fat', 'To show which animals otters eat', 'To prove that otters are related to them', 'To describe animals with thick fur'], 'Purpose. "unlike seals and whales they have no thick layer of fat" sets up a contrast.', ''],
  ['q1', 'What can be inferred about an otter caught in an oil spill?', ['It could lose heat dangerously fast', 'It would grow thicker fur', 'It would stay warm because of its fat', 'It would stop grooming'], 'Inference. Oil makes fur dirty, and dirty fur "no longer holds air, and the animal quickly loses heat".', ''],
  ['q1', 'The word "matted" in the passage is closest in meaning to...', ['tangled together', 'cleaned', 'colored', 'long'], 'Vocabulary. A coat that is "dirty or matted" no longer holds air: the hairs are stuck and tangled.', ''],
  ['q2', 'What can be inferred about the town officials in 1931?', ['They did not expect so many adults to use the pool', 'They wanted the pool only for adults', 'They planned evening hours from the start', 'They thought the summers were mild'], 'Inference. They "expected it to be used mainly by children" and later "underestimated" the need.', ''],
  ['q2', 'Why did the pool extend its evening hours?', ['Many adults came after work', 'Children asked for longer hours', 'The weather became cooler', 'The council needed more money'], 'Detail. "so many adults came after work that the pool extended its evening hours twice."', ''],
  ['q2', 'The word "underestimated" is closest in meaning to...', ['judged too low', 'judged correctly', 'ignored on purpose', 'measured exactly'], 'Vocabulary. under- (too little) + estimate: they thought the need was smaller than it was.', ''],
  ['q3', 'What is the passage mainly about?', ['How paper materials changed and one result of that change', 'How books were printed in the 1800s', 'Why librarians dislike newspapers', 'How wasps build nests'], 'Main idea. It moves from cloth to wood pulp and ends with the acid problem.', 'Wasps’ nests are a small detail, not the main idea.'],
  ['q3', 'Which material is NOT mentioned as tried for paper?', ['Leaves', 'Straw', 'Grass', 'Wasps’ nests'], 'Negative detail. Straw, grass and wasps’ nests are named; leaves are not.', ''],
  ['q3', 'Why does the author mention librarians in the last sentence?', ['To show that the problem with wood paper continues today', 'To explain who invented wood pulp', 'To praise libraries', 'To show that cloth paper was weak'], 'Purpose. "a problem librarians still face today" shows the effect lasts.', ''],
  ['q4', 'According to the passage, what do desert ants use to find their way home?', ['Step counting and the position of the sun', 'Smell and landmarks', 'The stars at night', 'Paths left by other ants'], 'Detail. "the ants count their steps and use the position of the sun".', ''],
  ['q4', 'Why does the author describe the experiment with stilts?', ['To give evidence that ants count their steps', 'To show that ants can walk on stilts', 'To explain how ants find food', 'To prove that ants dislike the sun'], 'Purpose. Longer steps made the ants overshoot, which supports the step-counting idea.', ''],
  ['q4', 'What would most likely happen to ants whose legs were made shorter?', ['They would stop before reaching their nest', 'They would walk past their nest', 'They would walk in circles', 'They would find no food'], 'Inference. Shorter steps cover less ground per step, so counting the same number of steps leaves them short of home.', 'Walking past the nest is what happened with longer legs, the opposite case.'],
];
g.forEach(([grp, q, opts, sol, trap], i) => items.push({ id: `rqt-g${String(i + 1).padStart(2, '0')}`, type: 'mcq', group: grp, q, options: opts, answer: 0, sol, ...(trap ? { trap } : {}) }));
export default { title: 'Reading question types', accent: 'en-US', groups, items };
