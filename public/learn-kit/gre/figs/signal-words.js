// 6.1 Clue and signal: tap a sentence to see its clue, its signal word, the prediction and the answer.
import { readout } from '../../kit.js';
import { stack, card } from '../../gmat/figs/_verbal.js';
const S = [
  { s: 'Although the bridge looked <u>flimsy</u>, it was in fact remarkably ______.', clue: 'flimsy', sig: 'Although: contrast', pred: 'strong', ans: 'sturdy' },
  { s: 'The speaker was so ______ that the audience <u>struggled to stay awake</u>.', clue: 'struggled to stay awake', sig: 'so … that: cause and result', pred: 'boring', ans: 'tedious' },
  { s: 'Her notes were <u>clear and well organised</u>; similarly, her lectures were ______.', clue: 'clear and well organised', sig: 'similarly: same direction', pred: 'clear', ans: 'lucid' },
  { s: 'The new law was meant to be ______, but it <u>has been changed every year</u> since.', clue: 'changed every year', sig: 'but: contrast', pred: 'lasting', ans: 'permanent' },
];
export default function (host) {
  const box = stack(host), out = readout(host); const cs = [];
  S.forEach((x, i) => { const c = card(box, 'Sentence ' + (i + 1), x.s, '', () => { cs.forEach((d, j) => d.setAttribute('aria-pressed', String(j === i)));
    out.innerHTML = `<b>Clue:</b> “${x.clue}”. <b>Signal:</b> ${x.sig}. <b>Your own word:</b> ${x.pred}. <b>A choice that matches:</b> ${x.ans}.`; }); cs.push(c); });
  out.textContent = 'Tap a sentence. Cover the choices and predict a word before you look.';
}
