// 6.4 Word families: pick a root and see the words it builds, each in one short sentence.
import { row, choice, readout } from '../../kit.js';
import { stack, card, clear } from '../../gmat/figs/_verbal.js';
const R = {
  bene: ['bene: good', [['benevolent', 'wishing others well', 'A benevolent donor paid for the new library.'], ['benefactor', 'a person who gives help', 'An unnamed benefactor covered the fees.'], ['benign', 'harmless, kind', 'The doctor said the lump was benign.']]],
  mal: ['mal: bad', [['malevolent', 'wishing harm', 'The villain gave a malevolent smile.'], ['malign', 'to speak badly of', 'Critics maligned the plan before reading it.'], ['malfunction', 'to fail to work', 'The sensor malfunctioned in the cold.']]],
  loq: ['loqu / locu: speak', [['loquacious', 'talking a lot', 'The loquacious guide never paused.'], ['eloquent', 'speaking well and movingly', 'Her eloquent speech won the room.'], ['circumlocution', 'talking around the point', 'His answer was a long circumlocution.']]],
  ver: ['ver: true', [['veracity', 'truthfulness', 'No one doubted the veracity of her account.'], ['verify', 'to check it is true', 'Verify the figures before you publish.'], ['verisimilitude', 'the look of being real', 'The film’s sets had great verisimilitude.']]],
};
export default function (host) {
  const ctl = row(host), box = stack(host), out = readout(host);
  const go = (k) => { clear(box); R[k][1].forEach(([w, m, s]) => card(box, w, `<b>${m}.</b> ${s}`)); out.textContent = `Root ${R[k][0]}. Knowing the root lets you guess the direction of an unknown word: good or bad, speaking or seeing.`; };
  choice(ctl, 'Root', Object.entries(R).map(([k, v]) => [k, v[0].split(':')[0]]), 'bene', go); go('bene');
}
