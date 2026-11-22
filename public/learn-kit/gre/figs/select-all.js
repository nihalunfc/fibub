// 2.3 Select-all: every choice is its own true-or-false check; only the exact set scores.
import { row, button, readout } from '../../kit.js';
import { stack, card } from '../../gmat/figs/_verbal.js';
const XS = [1, 2, 3, 4, 5, 6], ok = (x) => 2 * x - 3 > 1 && 2 * x - 3 < 9;
export default function (host) {
  const pick = new Set(); const box = stack(host);
  card(box, 'Question', 'Which integers x satisfy 1 &lt; 2x − 3 &lt; 9? Select all that apply.');
  const ctl = row(host), out = readout(host); const bs = [];
  XS.forEach((x) => { const b = button(ctl, String(x), () => { pick.has(x) ? pick.delete(x) : pick.add(x); b.setAttribute('aria-pressed', String(pick.has(x))); }); b.setAttribute('aria-pressed', 'false'); bs.push(b); });
  button(row(host), 'Check', () => {
    const right = XS.filter(ok), miss = right.filter((x) => !pick.has(x)), extra = [...pick].filter((x) => !ok(x));
    out.innerHTML = XS.map((x) => `${x}: 2(${x}) − 3 = ${2 * x - 3} → ${ok(x) ? 'yes' : 'no'}`).join('; ') + '.<br>' +
      (!miss.length && !extra.length ? '<b>Exactly right: this scores.</b>' : `<b>Scores nothing.</b> ${miss.length ? 'Missed: ' + miss.join(', ') + '. ' : ''}${extra.length ? 'Wrongly picked: ' + extra.join(', ') + '.' : ''}`);
  });
  out.textContent = 'Tick every value that works, then press Check.';
}
