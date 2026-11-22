// 8.1 What moves an Issue score: tick what the essay does and see the band it would likely fall in (0 to 6).
import { row, button, readout } from '../../kit.js';
import { stack, card, clear } from '../../gmat/figs/_verbal.js';
const F = [
  ['pos', 'Takes a clear position on the prompt', 1.2],
  ['task', 'Answers the exact task in the instructions', 1],
  ['reasons', 'Gives two or three distinct reasons', 1],
  ['ex', 'Backs each reason with a specific example', 1],
  ['other', 'Answers the strongest other side', 0.6],
  ['order', 'Paragraphs in a logical order with links', 0.6],
  ['clear', 'Clear sentences with few errors', 0.6],
];
export default function (host) {
  const on = new Set(['pos', 'reasons']);
  const box = stack(host), out = readout(host);
  const draw = () => {
    clear(box);
    F.forEach(([k, label]) => { const c = card(box, '', (on.has(k) ? '✓ ' : '○ ') + label, on.has(k) ? 'good' : '', () => { on.has(k) ? on.delete(k) : on.add(k); draw(); }); c.setAttribute('aria-pressed', String(on.has(k))); });
    let s = F.reduce((a, [k, , w]) => a + (on.has(k) ? w : 0), 0);
    if (!on.has('pos') || !on.has('task')) s = Math.min(s, 3); // off-task essays cannot score high
    const band = Math.max(1, Math.min(6, Math.round(s * 2) / 2));
    out.innerHTML = `Likely band: <b>${band.toFixed(1)} of 6</b>. ` + (band >= 5 ? 'A strong essay: clear, well supported and well organised.' : band >= 4 ? 'Adequate. More specific examples and an answer to the other side lift it.' : !on.has('task') ? 'An essay that ignores the exact instructions is capped low, however well written.' : 'Limited. Start with a clear position and real reasons with examples.');
  };
  draw();
}
