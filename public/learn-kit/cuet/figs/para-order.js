// 2.5 Put sentences in order: tap them in the order you think is right; the figure shows links (pronouns,
// connectors, time words) between the sentences you chose, then checks the order.
import { row, button, readout } from '../../kit.js';

export const SETS = [
  { s: [
    ['P', 'Within a week, the small plants had pushed through the soil.'],
    ['Q', 'Meera filled a tray with soil and pressed in twenty mustard seeds.'],
    ['R', 'She watered them every evening and kept the tray by the window.'],
    ['S', 'By the end of the month, they were ready to be moved into the garden.'],
  ], order: 'QRPS', why: 'Q introduces Meera and the seeds; R says "She ... them", which needs Q first; P and S follow in time order ("within a week", "by the end of the month").' },
  { s: [
    ['P', 'However, the bridge was too narrow for the traffic of a growing city.'],
    ['Q', 'When it opened in 1950, the bridge was the pride of the town.'],
    ['R', 'So, in 2020, a second, wider bridge was built beside it.'],
    ['S', 'Today the old bridge is kept for walkers and cyclists.'],
  ], order: 'QPRS', why: 'Q sets the scene in 1950; "However" in P turns against it; "So" in R gives the result; "Today" in S ends the story.' },
];
export default function (host) {
  let k = 0, pick = [];
  const list = document.createElement('div'); list.style.cssText = 'display:grid;gap:.4rem;margin:.4rem 0';
  const ans = document.createElement('p'); ans.style.cssText = 'font-weight:600;min-height:1.4em';
  host.append(list, ans);
  const ctl = row(host);
  button(ctl, 'Start again', () => { pick = []; draw(); });
  button(ctl, 'Next set', () => { k = (k + 1) % SETS.length; pick = []; draw(); });
  const out = readout(host);
  const draw = () => {
    const set = SETS[k]; list.replaceChildren();
    for (const [lab, txt] of set.s) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'lk-btn';
      b.style.cssText = 'text-align:left;white-space:normal;line-height:1.35';
      const n = pick.indexOf(lab);
      b.textContent = `${n >= 0 ? `(${n + 1}) ` : ''}${lab}. ${txt}`;
      b.disabled = n >= 0;
      b.addEventListener('click', () => { pick.push(lab); draw(); });
      list.appendChild(b);
    }
    ans.textContent = pick.length ? `Your order: ${pick.join(' ')}` : 'Tap the sentences in the order you think is right.';
    if (pick.length === set.s.length) out.innerHTML = pick.join('') === set.order ? `<b>Right: ${set.order}.</b> ${set.why}` : `<b>Not quite.</b> The order is ${set.order}. ${set.why}`;
    else out.innerHTML = 'Look for the opening sentence (it introduces a person or idea and has no "she", "this" or "however"), then follow the links.';
  };
  draw();
}
