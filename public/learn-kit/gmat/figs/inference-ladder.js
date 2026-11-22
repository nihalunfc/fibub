// 6.5 Inference ladder: test each claim against the facts; only claims the facts force stay on the ladder.
import { row, button, readout } from '../../kit.js';
import { stack, card } from './_verbal.js';
const FACTS = 'Every member of the chess club also plays in the school band. Some band members play the drums. The band has 40 members.';
const C = [
  { s: 'The chess club has at most 40 members.', ok: true, why: 'Every chess player is in the band, and the band has 40 people, so the club cannot have more than 40.' },
  { s: 'A student who is not in the band is not in the chess club.', ok: true, why: 'This is the first fact turned around correctly (the contrapositive): if you are not in the band, you cannot be in the club.' },
  { s: 'Some chess club members play the drums.', ok: false, why: 'The drummers might all be band members who do not play chess. Nothing forces an overlap.' },
  { s: 'The band is bigger than the chess club.', ok: false, why: 'The club could have all 40 band members, so the band might be the same size. “At most” is not “fewer than”.' },
  { s: 'Most band members play chess.', ok: false, why: 'The club could have just 2 members. The facts give no lower limit.' },
  { s: 'Joining the band makes students better at chess.', ok: false, why: 'A cause needs outside information. The facts only describe who belongs to what.' },
];
export default function (host) {
  const box = stack(host); card(box, 'The facts', FACTS);
  const out = readout(host); let kept = 0, tried = 0;
  const cards = C.map((c, k) => card(box, 'Claim ' + (k + 1), c.s, '', () => {
    const el = cards[k]; if (el.dataset.done) { out.innerHTML = c.why; return; }
    el.dataset.done = '1'; tried++; if (c.ok) kept++;
    el.classList.add(c.ok ? 'vx-good' : 'vx-bad'); if (!c.ok) el.classList.add('vx-off');
    el.querySelector('.vx-tag').textContent = `Claim ${k + 1}: ${c.ok ? 'proven, it stays' : 'not proven, it falls off'}`;
    out.innerHTML = `<b>${c.ok ? 'Proven.' : 'Falls off.'}</b> ${c.why} (${tried} of ${C.length} tested, ${kept} proven.)`;
  }));
  button(row(host), 'Start again', () => { kept = tried = 0; cards.forEach((el, k) => { delete el.dataset.done; el.className = 'vx-card'; el.querySelector('.vx-tag').textContent = 'Claim ' + (k + 1); }); out.textContent = 'Tap a claim to test it.'; });
  out.textContent = 'Tap a claim to test it. Before you tap, decide: do the facts force it?';
}
