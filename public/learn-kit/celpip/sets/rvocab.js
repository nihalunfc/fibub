// Working out words from context (lesson 3.6). Original sentences and questions by fibub.
// Each entry: [sentence with the word in bold, the meaning, three wrong meanings, the clue and clue type].
const ctx = [
  ['The bakery’s new hours are <b>temporary</b>; the old schedule returns in March.', 'lasting only for a short time', ['permanent', 'very early', 'cheaper'], 'Contrast clue: "the old schedule returns" shows the new hours will not last.'],
  ['After the storm, the town was <b>inundated</b> with calls, so the office hired extra staff to answer them all.', 'received far too many of something', ['ignored', 'cut off from', 'pleased'], 'Result clue: they hired extra staff to answer them all, so there were too many calls.'],
  ['The landlord was <b>reluctant</b> to lower the rent, but he finally agreed after two months.', 'not wanting to do something', ['eager', 'forced by law', 'quick'], 'Contrast clue: "but he finally agreed" shows he did not want to at first.'],
  ['Please keep your receipt. Items cannot be <b>refunded</b>, that is, you cannot get your money back, without one.', 'given money back for', ['repaired', 'exchanged for a gift card', 'delivered'], 'Definition clue: "that is, you cannot get your money back".'],
  ['The trail is <b>treacherous</b> in winter: ice covers the rocks and several hikers have fallen.', 'dangerous', ['beautiful', 'closed', 'crowded'], 'Example clue after the colon: ice and falling hikers.'],
  ['Unlike her talkative brother, Noor is quite <b>reserved</b> with people she does not know.', 'quiet and not sharing feelings easily', ['booked in advance', 'rude', 'very friendly'], 'Contrast clue: "unlike her talkative brother". Note that "reserved" can also mean booked, but not about a person.'],
  ['The committee will <b>scrutinize</b> every application, checking each document carefully.', 'examine closely', ['reject', 'sign', 'print'], 'Restatement clue: "checking each document carefully".'],
  ['Prices at the market <b>fluctuate</b>: berries cost $4 one week and $7 the next.', 'go up and down', ['stay the same', 'always rise', 'are hidden'], 'Example clue: $4 then $7, changing from week to week.'],
  ['The new bus route is a <b>boon</b> for seniors, who can now reach the clinic without a transfer.', 'a helpful thing', ['a problem', 'a delay', 'a cost'], 'Reason clue: seniors can now reach the clinic more easily.'],
  ['Tickets were <b>scarce</b>, and many fans left without seats.', 'hard to find; few', ['cheap', 'printed', 'shared'], 'Result clue: many fans left without seats.'],
  ['The manager gave a <b>vague</b> answer, so nobody knew when the project would actually start.', 'not clear', ['detailed', 'angry', 'short'], 'Result clue: "nobody knew" what was meant.'],
  ['Residents <b>objected</b> to the plan, and more than two hundred signed a letter against it.', 'expressed disagreement', ['agreed', 'paid for', 'forgot about'], 'Supporting clue: a letter against the plan.'],
  ['Most newcomers find the winters harsh at first, but they gradually <b>adapt</b>, and by the second year the cold seems normal.', 'get used to new conditions', ['complain', 'move away', 'freeze'], 'Result clue: "by the second year the cold seems normal".'],
  ['The museum offers <b>complimentary</b> coffee; you do not need to pay for it.', 'free', ['praising', 'expensive', 'decaffeinated'], 'Definition clue: "you do not need to pay". Do not confuse it with "complementary" (going well together).'],
  ['Because of <b>ample</b> parking behind the arena, visitors never struggle to find a spot.', 'more than enough', ['very little', 'paid', 'underground'], 'Result clue: visitors never struggle.'],
  ['The volunteers were <b>exhausted</b> after twelve hours of sorting donations.', 'very tired', ['excited', 'paid', 'confused'], 'Cause clue: twelve hours of work.'],
  ['The city decided to <b>postpone</b> the fireworks until Sunday because of the high winds.', 'move to a later time', ['cancel forever', 'make louder', 'move earlier'], 'Clue: "until Sunday", a later day, so not cancelled.'],
  ['Her explanation was so <b>concise</b> that the whole class understood it in under a minute.', 'short and clear', ['long and detailed', 'funny', 'difficult'], 'Result clue: understood in under a minute.'],
  ['The old furnace was <b>inefficient</b>, using far more gas than the new models to heat the same space.', 'wasting energy or effort', ['quiet', 'expensive to buy', 'broken'], 'Explanation clue: using far more gas for the same result. The prefix in- means "not".'],
  ['Several stores on the street are <b>vacant</b>, with "For lease" signs in the windows.', 'empty', ['busy', 'closed for lunch', 'new'], 'Example clue: "For lease" signs mean no business is there.'],
  ['Rather than <b>hastily</b> choosing a daycare, the couple visited six before deciding.', 'quickly and without enough thought', ['carefully', 'cheaply', 'happily'], 'Contrast clue: "Rather than" and visiting six shows the opposite of hasty.'],
  ['The coach praised Leo’s <b>persistence</b>: he practised his slap shot every day for a year until he got it right.', 'continuing to try despite difficulty', ['talent', 'luck', 'speed'], 'Example clue: practising every day for a year.'],
  ['The instructions were <b>ambiguous</b>; half the group thought the meeting was at the library, and half thought it was at the school.', 'possible to understand in more than one way', ['written in French', 'very long', 'perfectly clear'], 'Result clue: two groups understood two different things.'],
  ['Thanks to a <b>generous</b> donation from a local family, the food bank can open two extra days a week.', 'giving more than expected', ['secret', 'small', 'late'], 'Result clue: the donation made two extra days possible.'],
  ['The town hall meeting became <b>heated</b> when residents began shouting about the tax increase.', 'angry and emotional', ['warm', 'well organized', 'boring'], 'Example clue: shouting. "Heated" here is not about temperature.'],
  ['The clinic <b>prioritizes</b> patients with serious symptoms, so people with minor problems may wait longer.', 'deals with first because it is most important', ['refuses', 'charges more', 'sends away'], 'Result clue: others wait longer.'],
];
const items = ctx.map(([s, m, wrong, clue], i) => ({
  id: `rv-${String(i + 1).padStart(2, '0')}`,
  type: 'mcq',
  q: `${s}<br>What does the word in bold mean here?`,
  options: [m, ...wrong],
  answer: 0,
  sol: `<b>${m}</b>. ${clue}`,
}));
// Choose the word that fits the context
const fit = [
  ['The ferry was <b>___</b> because of thick fog, so passengers waited three hours.', 'delayed', ['early', 'free', 'crowded'], 'Three hours of waiting means the ferry was late.'],
  ['Since the store is closing, everything is <b>___</b>: 50% off all items.', 'discounted', ['donated', 'refunded', 'reserved'], '50% off means a lower price.'],
  ['Our neighbour is very <b>___</b>; she shovels our driveway whenever it snows.', 'considerate', ['careless', 'reluctant', 'vague'], 'Shovelling for others shows thoughtfulness.'],
  ['The instructions were <b>___</b>, so we finished building the shelf in ten minutes.', 'straightforward', ['ambiguous', 'scarce', 'heated'], 'Finishing fast suggests simple, easy instructions.'],
];
fit.forEach(([s, a, wrong, why], i) => items.push({ id: `rv-f${i + 1}`, type: 'mcq', q: `Choose the word that fits: ${s}`, options: [a, ...wrong], answer: 0, sol: `<b>${a}</b>. ${why}` }));
items.push(
  { id: 'rv-t1', type: 'text', q: 'In the sentence "Most residents were in favour, but a few <b>opposed</b> the plan", which word signals that "opposed" means the opposite of "in favour"? (one word)', answer: ['but'], maxWords: 1, sol: '<b>but</b> marks contrast. The word after it means the opposite of what came before.' },
  { id: 'rv-t2', type: 'text', q: 'The prefix in "<b>un</b>reliable" and "<b>un</b>clear" means what? (one word)', answer: ['not'], maxWords: 1, sol: '<b>not</b>. un-, in-, im-, dis- and non- often mean "not": unreliable = not reliable.' },
);
export default { title: 'working out words from context', accent: 'en-CA', items };
