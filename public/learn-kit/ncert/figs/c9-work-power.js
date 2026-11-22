// Class 9 Work and Energy: power is the rate of doing work, P = W / t. Two cranes lift the same 100 kg load by 10 m
// (the same work, about 9800 J). Crane B is fixed at 20 s; you set how long crane A takes. The faster crane has more
// power. The same quantity is also shown in horsepower (1 hp = 746 W) so the commercial unit is familiar.
import { canvas, text, title, line, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let tA = 40, tt = 0, going = false;
  const tB = 20, Wk = 100 * 9.8 * 10;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Two cranes lifting the same load in different times with their power compared' });
  const ctl = row(host);
  slider(ctl, { label: 'Crane A time', min: 10, max: 80, step: 5, value: tA, fmt: (v) => `${v} s`, oninput: (v) => { tA = v; upd(); } });
  button(ctl, '▶ Start both', () => { tt = 0; going = true; });
  const out = readout(host);
  function upd() { out.innerHTML = `Same work ${Wk.toFixed(0)} J. A: ${Wk.toFixed(0)} ÷ ${tA} = <b>${(Wk / tA).toFixed(0)} W</b> (${(Wk / tA / 746).toFixed(2)} hp). B: ${Wk.toFixed(0)} ÷ ${tB} = <b>${(Wk / tB).toFixed(0)} W</b> (${(Wk / tB / 746).toFixed(2)} hp).`; cv.redraw(); }
  loop(host, (dt) => { if (going) { tt += dt * 6; if (tt >= Math.max(tA, tB) + 2) going = false; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Same work, different time: different power', col);
    const top = 46, bot = h - 74, cr = [[w * 0.22, tA, col.s[0], 'A'], [w * 0.62, tB, col.s[2], 'B']];
    cr.forEach(([x, T, c, n]) => {
      line(ctx, [[x, bot + 8], [x, top]], col.ink, 3); line(ctx, [[x, top], [x + 46, top]], col.ink, 3);
      const f = Math.min(1, tt / T), y = bot - f * (bot - top - 40);
      line(ctx, [[x + 46, top], [x + 46, y]], col.muted, 1.5); ctx.fillStyle = c; ctx.fillRect(x + 32, y, 28, 22);
      text(ctx, `Crane ${n}`, x + 22, bot + 22, { color: c, size: 12, weight: 700, align: 'center' });
      text(ctx, `${(Wk / T).toFixed(0)} W`, x + 22, bot + 38, { color: col.ink, size: 12, weight: 700, align: 'center' });
      const bar = 72 * (Wk / T) / (Wk / 10); ctx.fillStyle = c; ctx.fillRect(x - 10, h - 20, Math.min(bar, 120) , 7);
    });
    text(ctx, 'power bars (longer = more power)', 10, h - 6, { color: col.muted, size: 10 });
    text(ctx, `clock ${Math.min(tt, 99).toFixed(0)} s`, w - 10, bot + 38, { color: col.muted, size: 11, align: 'right' });
  };
  upd();
}
