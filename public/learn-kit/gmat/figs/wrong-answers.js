// 7.2 Wrong-answer families: sort sample wrong answers for a question on the fertiliser passage.
import { row, button, readout } from '../../kit.js';
import { stack, card, clear } from './_verbal.js';
const Q = 'Question: According to the passage, why did purchases rise in the experiment?';
const RIGHT = 'Farmers could pay when they had cash, right after harvest.';
const T = { scope: 'Out of scope', dist: 'Distortion', ext: 'Extreme', part: 'Wrong part' };
const W = [
  { a: 'Farmers were taught how much fertiliser would help.', t: 'part', why: 'Teaching farmers is in the passage, but it belongs to the early programmes, which changed little. A real detail that answers a different question.' },
  { a: 'The price of fertiliser was cut after harvest.', t: 'dist', why: 'Uses the passage’s words (price, harvest) but reverses a fact: the price was the same.' },
  { a: 'Farmers will always buy fertiliser if they can pay at harvest.', t: 'ext', why: '“Always” is far stronger than “purchases rose sharply”.' },
  { a: 'Better seeds made fertiliser more profitable that year.', t: 'scope', why: 'Seeds are never mentioned. Sounds sensible, but the passage gives no support.' },
  { a: 'Paying at harvest is the only way to raise fertiliser use.', t: 'ext', why: '“The only way” goes beyond the passage, which says such policies may work better than price cuts.' },
  { a: 'Fertiliser raised harvests enough to repay its cost.', t: 'part', why: 'True and in paragraph 1, but it explains why fertiliser is worth buying, not why purchases rose in the experiment.' },
  { a: 'Farmers lacked information about fertiliser at planting time.', t: 'dist', why: 'Mixes up the two explanations: information is the rejected view, timing is the supported one.' },
  { a: 'Weather in the region improved during the experiment.', t: 'scope', why: 'Weather is not discussed anywhere in the passage.' },
];
export default function (host) {
  let i = 0, score = 0, seen = 0, done = false; const box = stack(host); const ctl = row(host); const out = readout(host); const btn = {};
  const show = () => { done = false; clear(box); card(box, '', Q); card(box, 'The right answer, for comparison', RIGHT, 'good'); card(box, `Wrong answer ${i + 1} of ${W.length}`, W[i].a, 'bad'); out.textContent = 'Which family does this wrong answer belong to?'; Object.values(btn).forEach((b) => b.setAttribute('aria-pressed', 'false')); };
  Object.entries(T).forEach(([k, name]) => { btn[k] = button(ctl, name, () => {
    const w = W[i], ok = k === w.t; Object.entries(btn).forEach(([j, b]) => b.setAttribute('aria-pressed', String(j === k)));
    if (!done) { seen++; if (ok) score++; done = true; }
    out.innerHTML = `<b>${ok ? 'Right' : 'It is ' + T[w.t]}.</b> ${w.why} <i>(${score} right out of ${seen})</i>`;
  }); });
  button(row(host), 'Next wrong answer', () => { i = (i + 1) % W.length; show(); });
  show();
}
