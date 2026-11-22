// 1.2 Expected marks from guessing one 4-option question at +5/−1, by how many wrong options you can rule out
// (or by how sure you are). Bars above zero mean guessing pays on average.
import { canvas, text, row, slider, readout, line } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'Expected marks from a guess for each number of options ruled out' });
  let sure = 40;
  const ctl = row(host);
  slider(ctl, { label: 'How sure you are of your best pick', min: 0, max: 100, step: 1, value: sure, fmt: (v) => `${v}%`, oninput: (v) => { sure = v; cv.redraw(); show(); } });
  const out = readout(host);
  const ev = (p) => 5 * p - (1 - p);
  const show = () => {
    const e = ev(sure / 100);
    out.innerHTML = `At ${sure}% sure, one answer is worth <b>${e >= 0 ? '+' : ''}${e.toFixed(2)}</b> marks on average. Break-even is 1 in 6 (16.7%): ${sure / 100 > 1 / 6 ? 'answer it.' : 'skip it.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const bars = [['Blind guess (1 in 4)', 0.25], ['Ruled out 1 (1 in 3)', 1 / 3], ['Ruled out 2 (1 in 2)', 0.5], ['Your pick', sure / 100]];
    const top = 20, bot = h - 44, zero = top + (bot - top) * (5 / 6), sc = (bot - top) / 6; // range −1..+5
    line(ctx, [[30, zero], [w - 10, zero]], col.ink, 1);
    text(ctx, '0', 24, zero, { color: col.muted, size: 11, align: 'right' });
    text(ctx, '+5', 24, top, { color: col.muted, size: 11, align: 'right' });
    text(ctx, '−1', 24, bot, { color: col.muted, size: 11, align: 'right' });
    const bw = (w - 50) / bars.length;
    bars.forEach(([lab, p], i) => {
      const e = ev(p), x = 40 + i * bw, hh = e * sc;
      ctx.fillStyle = e >= 0 ? col.s[2] : col.s[1];
      ctx.fillRect(x + bw * 0.15, e >= 0 ? zero - hh : zero, bw * 0.7, Math.abs(hh));
      text(ctx, `${e >= 0 ? '+' : ''}${e.toFixed(2)}`, x + bw / 2, e >= 0 ? zero - hh - 9 : zero - hh + 9, { color: col.ink, size: 12, weight: 600, align: 'center' });
      text(ctx, lab, x + bw / 2, h - 26, { color: col.ink, size: 10.5, align: 'center' });
    });
    text(ctx, 'Average marks per guess', 34, h - 8, { color: col.muted, size: 10.5, base: 'bottom' });
  };
  cv.redraw(); show();
}
