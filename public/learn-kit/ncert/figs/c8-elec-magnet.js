// Class 8 Science, Electricity: an electromagnet is a coil of wire that becomes a magnet only while current flows.
// Its pull grows with the number of turns and with the current, and a soft iron core makes it far stronger
// (the core becomes magnetised too). Toy model: pull = turns x current (x 20 with an iron core), in units of paper clips lifted.
import { canvas, text, title, line, dot, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let N = 20, I = 1, core = true, on = true;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'An iron nail with a coil of wire and paper clips being picked up' });
  const ctl = row(host);
  const bo = button(ctl, 'Switch: ON', () => { on = !on; bo.textContent = 'Switch: ' + (on ? 'ON' : 'OFF'); upd(); });
  const bc = button(ctl, 'Iron core: IN', () => { core = !core; bc.textContent = 'Iron core: ' + (core ? 'IN' : 'OUT'); upd(); });
  slider(ctl, { label: 'Turns of wire', min: 5, max: 50, step: 5, value: N, fmt: (v) => String(v), oninput: (v) => { N = v; upd(); } });
  slider(ctl, { label: 'Current', min: 0.5, max: 3, step: 0.5, value: I, fmt: (v) => `${v} A`, oninput: (v) => { I = v; upd(); } });
  const out = readout(host);
  const clips = () => (on ? Math.min(12, Math.round(N * I * (core ? 0.2 : 0.01) / 1)) : 0);
  function upd() { out.innerHTML = !on ? 'Switch off: the magnetism vanishes and every clip drops. An electromagnet can be switched on and off.' : `Lifts about <b>${clips()}</b> clip${clips() === 1 ? '' : 's'}. More turns, more current and an iron core all make it stronger.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Electromagnet', col);
    const cx = w / 2, top = 56, len = 110;
    if (core) { ctx.fillStyle = col.muted; ctx.fillRect(cx - 9, top, 18, len); }
    const nt = Math.round(N / 5) + 3;
    for (let i = 0; i < nt; i++) { const y = top + 10 + i * ((len - 20) / nt); line(ctx, [[cx - 20, y], [cx + 20, y + 5]], col.s[1], 3); }
    line(ctx, [[cx - 20, top + 12], [cx - 70, top + 12], [cx - 70, top - 8]], col.ink, 2); line(ctx, [[cx + 20, top + len - 12], [cx + 70, top + len - 12], [cx + 70, top - 8]], col.ink, 2);
    text(ctx, 'cell', cx, top - 14, { color: col.muted, size: 10.5, align: 'center' }); line(ctx, [[cx - 70, top - 8], [cx - 6, top - 8]], col.ink, 2); line(ctx, [[cx + 6, top - 8], [cx + 70, top - 8]], col.ink, 2); line(ctx, [[cx - 6, top - 16], [cx - 6, top]], col.ink, 4); line(ctx, [[cx + 2, top - 12], [cx + 2, top - 4]], col.ink, 2);
    const n = clips(), by = top + len + 6;
    if (on && core) { ctx.save(); ctx.globalAlpha = 0.15; dot(ctx, cx, by + 6, 30 + Math.min(n, 12) * 2, col.s[1]); ctx.restore(); }
    for (let i = 0; i < 12; i++) { const hold = i < n; const x = hold ? cx - 14 + (i % 3) * 14 : w * 0.12 + i * (w * 0.76 / 12), y = hold ? by + 6 + Math.floor(i / 3) * 11 : h - 28; ctx.strokeStyle = hold ? col.s[4] : col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 6, y - 3, 12, 7, 3); ctx.stroke(); }
    text(ctx, on ? `${n} clips held` : 'clips fall', cx, h - 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  upd();
}
