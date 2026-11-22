// GRE Text Completion: one-blank questions (five choices) and two- or three-blank questions (one word per blank,
// shown as a select-all list where each blank's words are labelled). All sentences are original, written for fibub.
const E = ['gre'];
// The right word's position is moved by a fixed amount per question (from its id), so answers are spread out.
const h = (id) => [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
const rot = (a, k) => a.map((_, i) => a[(i + k) % a.length]);
const one = (id, level, q, options, answer, sol, trap) => { const k = h(id) % options.length, o = rot(options, k);
  return { id, type: 'mcq', level, exams: E, format: 'single', sub: 'one blank', q: `<p>${q}</p>`, options: o, answer: o.indexOf(options[answer]), sol: `<p>${sol}</p>`, ...(trap ? { trap } : {}) }; };
// Multi-blank: blanks = [[w1,w2,w3], [w1,w2,w3], ...], right = index per blank.
const multi = (id, level, q, blanks, right, sol, trap) => { const B = blanks.map((ws, b) => rot(ws, (h(id) + b) % 3));
  return { id, type: 'msq', level, exams: E, format: 'multi', sub: blanks.length + ' blanks',
    q: `<p>${q}</p><p>Choose <b>one word for each blank</b>: ${blanks.length} choices in all.</p>`,
    options: B.flatMap((ws, b) => ws.map((w) => `Blank (${'i'.repeat(b + 1)}): ${w}`)),
    answer: right.map((k, b) => b * 3 + B[b].indexOf(blanks[b][k])), sol: `<p>${sol}</p>`, ...(trap ? { trap } : {}) }; };
export default {
  topic: 'text-completion',
  items: [
    one('tc-001', 1, 'Although the new phone was advertised as sturdy, it proved surprisingly ______, cracking the first time it was dropped.', ['durable', 'fragile', 'expensive', 'popular', 'heavy'], 1,
      'The clue is "although … sturdy" plus "cracking the first time it was dropped". The blank must mean the opposite of sturdy: <b>fragile</b>.', 'Durable repeats the advert; the word "although" signals a contrast.'),
    one('tc-002', 2, 'The manager was known for her ______ style: she explained every decision to her team and welcomed questions.', ['secretive', 'transparent', 'erratic', 'aloof', 'hasty'], 1,
      'The colon introduces an explanation: explaining every decision and welcoming questions describe a <b>transparent</b> style.'),
    one('tc-003', 2, 'Far from being ______, the professor\'s lectures were so lively that students arrived early to get a seat.', ['tedious', 'brief', 'crowded', 'brilliant', 'formal'], 0,
      '"Far from being" means "the opposite of". Lively lectures are the opposite of <b>tedious</b> ones.', 'Brilliant agrees with the rest of the sentence; "far from" needs an opposite.'),
    one('tc-004', 2, 'The committee\'s report was deliberately ______, so that both sides of the debate could claim it supported them.', ['decisive', 'ambiguous', 'lengthy', 'accurate', 'hostile'], 1,
      'If both sides can claim a report supports them, it must be open to more than one reading: <b>ambiguous</b>.'),
    one('tc-005', 3, 'Early reviewers dismissed the novel as ______, but later critics found in its plain style a depth the first readers had missed.', ['profound', 'superficial', 'ornate', 'controversial', 'popular'], 1,
      'The contrast with "later critics found … a depth" shows the early verdict was the opposite of deep: <b>superficial</b>.', 'Ornate contradicts "plain style".'),
    one('tc-006', 3, 'Her ______ about the project\'s chances surprised colleagues, who had expected her, as its chief critic, to predict failure.', ['pessimism', 'optimism', 'indifference', 'confusion', 'silence'], 1,
      'Colleagues expected a prediction of failure (pessimism) and were surprised, so she showed the opposite: <b>optimism</b>.'),
    one('tc-007', 3, 'The scientist was careful to ______ her claims, stressing that the results came from a single small study.', ['exaggerate', 'qualify', 'publish', 'abandon', 'repeat'], 1,
      'Stressing the limits of a study is limiting your claims, which is what <b>qualify</b> means here.', 'Abandon goes too far: she still makes the claims.'),
    one('tc-008', 4, 'Critics who call the policy ______ overlook how many small, careful adjustments its designers made over a decade.', ['incremental', 'reckless', 'cautious', 'gradual', 'modest'], 1,
      'Many small, careful adjustments over a decade are the opposite of hasty or careless. The critics must call it <b>reckless</b>, and the sentence says they are wrong.', 'Incremental, cautious, gradual and modest all describe what the designers did: the critics would not be "overlooking" that.'),
    one('tc-009', 4, 'Because the evidence was largely ______, the jury could not be sure the defendant had even been at the scene.', ['conclusive', 'circumstantial', 'forensic', 'recent', 'abundant'], 1,
      'Evidence that leaves doubt about the basic facts is indirect: <b>circumstantial</b>.'),
    one('tc-010', 4, 'The author\'s prose is so ______ that a single paragraph can take several readings to untangle.', ['lucid', 'convoluted', 'concise', 'vivid', 'casual'], 1,
      'Needing several readings to untangle points to complicated, twisting prose: <b>convoluted</b>.', 'Lucid and concise are the opposite.'),
    one('tc-011', 5, 'Though he presented his findings as a break with tradition, they were in fact largely ______ of earlier work.', ['independent', 'derivative', 'critical', 'ignorant', 'dismissive'], 1,
      '"Though … a break with tradition" signals the truth is the opposite: the findings came from earlier work, so they were <b>derivative</b>.'),
    one('tc-012', 5, 'The diplomat\'s ______ remarks, carefully chosen to offend no one, left reporters with little to write about.', ['inflammatory', 'anodyne', 'candid', 'witty', 'lengthy'], 1,
      'Remarks chosen to offend no one, giving reporters nothing to write, are bland and harmless: <b>anodyne</b>.', 'Candid remarks would give reporters plenty to write about.'),
    multi('tc-013', 3, 'The city\'s new bus routes were meant to (i) ______ congestion, but because they were poorly advertised, few drivers (ii) ______ their cars.', [['ease', 'worsen', 'measure'], ['abandoned', 'repaired', 'bought']], [0, 0],
      'Blank (i): routes are meant to <b>ease</b> congestion. The "but" says the plan failed: few drivers <b>abandoned</b> their cars for the bus.'),
    multi('tc-014', 3, 'Although the experiment\'s results were (i) ______, the team chose to (ii) ______ them, hoping that further trials would make the picture clearer.', [['inconclusive', 'striking', 'flawless'], ['publish', 'bury', 'falsify']], [0, 0],
      '"Hoping that further trials would make the picture clearer" shows the results were unclear: <b>inconclusive</b>. "Although" contrasts that with sharing them anyway: <b>publish</b>.', 'Bury does not fit "although": hiding unclear results is not a surprise.'),
    multi('tc-015', 4, 'The biography is less a (i) ______ than a defence: the author is so eager to (ii) ______ her subject that every failing is explained away.', [['portrait', 'eulogy', 'satire'], ['vindicate', 'condemn', 'ignore']], [0, 0],
      'A defence that explains away every failing is not a balanced <b>portrait</b>. The author is eager to <b>vindicate</b> (clear the name of) her subject.', 'Eulogy is already a kind of praise, so "less a eulogy than a defence" would not be a contrast.'),
    multi('tc-016', 4, 'Rather than (i) ______ the critics, the company\'s leaders took their complaints seriously, and the product that resulted was far more (ii) ______ than its predecessor.', [['dismissing', 'hiring', 'thanking'], ['robust', 'fragile', 'costly']], [0, 0],
      '"Rather than … took their complaints seriously": the opposite of taking them seriously is <b>dismissing</b> them. Listening led to a better product: more <b>robust</b>.'),
    multi('tc-017', 5, 'The historian\'s account, once (i) ______ as the final word on the period, now seems (ii) ______: new archives have shown how much it (iii) ______.', [['hailed', 'mocked', 'banned'], ['incomplete', 'definitive', 'popular'], ['omitted', 'invented', 'exaggerated']], [0, 0, 0],
      'Once <b>hailed</b> as the final word, it "now seems" the opposite of final: <b>incomplete</b>. New archives show how much it <b>omitted</b>, which explains "incomplete".', 'Invented would make the account false, not incomplete.'),
    multi('tc-018', 5, 'Far from (i) ______ the debate, the new data only (ii) ______ it, since each side found in the figures (iii) ______ for its own position.', [['settling', 'starting', 'avoiding'], ['intensified', 'ended', 'simplified'], ['support', 'danger', 'proof against']], [0, 0, 0],
      '"Far from settling" the debate, the data <b>intensified</b> it, because each side found <b>support</b> for its own view.'),
  ],
};
