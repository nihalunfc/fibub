// Collocations: English likes certain word pairs ("make a decision", not "do a decision"). Tap a verb on the left, then the
// noun that goes with it on the right; right pairs join up with a line. Switch sets to see make, do, take and strong adjectives.
import { choice, row } from '../kit.js';
import { box, pairMatch } from './_lang.js';

const SETS = {
  verbs: { name: 'Verbs + nouns', left: ['make', 'do', 'take', 'pay', 'catch'], right: ['a decision', 'homework', 'a break', 'attention', 'a cold'], why: ['We make decisions, mistakes and plans.', 'We do homework, jobs and favours.', 'We take a break, a photo, a chance.', 'We pay attention, a bill, a visit.', 'We catch a cold, a bus, a ball.'] },
  adj: { name: 'Strong adjectives', left: ['heavy', 'strong', 'fierce', 'bitter', 'deep'], right: ['rain', 'coffee', 'competition', 'disappointment', 'sleep'], why: ['Heavy rain, heavy traffic.', 'Strong coffee, strong wind.', 'Fierce competition, fierce storm.', 'Bitter disappointment, bitter cold.', 'Deep sleep, deep breath.'] },
  adv: { name: 'Adverb + adjective', left: ['highly', 'deeply', 'fully', 'utterly', 'bitterly'], right: ['recommended', 'grateful', 'aware', 'ridiculous', 'disappointed'], why: ['Highly recommended, highly unlikely.', 'Deeply grateful, deeply concerned.', 'Fully aware, fully booked.', 'Utterly ridiculous, utterly impossible.', 'Bitterly disappointed.'] },
};
export default function (host) {
  let k = 'verbs'; const ctl = row(host); const slot = box(host);
  const mount = () => { slot.innerHTML = ''; pairMatch(slot, { ...SETS[k], heading: SETS[k].name, seed: 3 }); };
  choice(ctl, 'Set', Object.keys(SETS).map((x) => [x, SETS[x].name]), k, (v) => { k = v; mount(); });
  mount();
}
