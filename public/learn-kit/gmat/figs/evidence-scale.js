// 6.3 Evidence scale: add statements to an argument and watch how far each one lifts or sinks it.
import { row, button, readout } from '../../kit.js';
import { stack, card } from './_verbal.js';
const ARG = 'After the town planted trees along Elm Street, summer pavement temperatures there fell by 4 °C. So the trees cooled the street.';
const S = [
  { s: 'On nearby streets with no new trees, pavement temperatures did not fall that summer.', v: 2, why: 'Rules out the weather: the change happened only where the trees went. Strengthens.' },
  { s: 'The blocks that got the most trees cooled the most.', v: 2, why: 'More cause, more effect: a dose pattern. Strengthens.' },
  { s: 'Elm Street was repaved with pale asphalt the same spring.', v: -2, why: 'Another cause: pale asphalt reflects sunlight and cools pavement on its own. Weakens.' },
  { s: 'That summer was the coolest in ten years across the region.', v: -2, why: 'Another cause: the whole region was cooler. Weakens.' },
  { s: 'Residents say Elm Street now looks much nicer.', v: 0, why: 'Off topic: looks say nothing about temperature. No effect.' },
  { s: 'The trees cost the town 40,000 dollars.', v: 0, why: 'Cost matters for a plan, not for whether trees cool streets. No effect.' },
];
export default function (host) {
  const on = new Set();
  const box = stack(host);
  card(box, 'Argument', ARG);
  const m = document.createElement('div'); m.className = 'vx-meter'; m.setAttribute('role', 'img'); m.innerHTML = '<i></i><b></b>'; box.appendChild(m);
  const out = readout(host);
  const cards = S.map((x, k) => card(box, 'Statement ' + (k + 1), x.s, '', () => {
    on.has(k) ? on.delete(k) : on.add(k); cards[k].setAttribute('aria-pressed', String(on.has(k))); go(k);
  }));
  const ctl = row(host);
  button(ctl, 'Clear', () => { on.clear(); cards.forEach((c) => c.setAttribute('aria-pressed', 'false')); go(-1); });
  const go = (last) => {
    const t = [...on].reduce((a, k) => a + S[k].v, 0), w = Math.min(50, Math.abs(t) * 6.25);
    const bar = m.querySelector('i'), col = getComputedStyle(document.body).getPropertyValue(t >= 0 ? '--good' : '--bad');
    bar.style.background = col; bar.style.width = w + '%'; bar.style.left = t >= 0 ? '50%' : 50 - w + '%';
    const verdict = t > 0 ? 'The conclusion is better supported.' : t < 0 ? 'The conclusion is in trouble.' : 'The argument is where it started.';
    m.setAttribute('aria-label', verdict);
    out.innerHTML = (last >= 0 && on.has(last) ? `<b>Statement ${last + 1}:</b> ${S[last].why} ` : 'Tap statements to add them to the argument. ') + verdict;
  };
  go(-1);
}
