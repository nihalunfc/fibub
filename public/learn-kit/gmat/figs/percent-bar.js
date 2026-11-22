// 4.1 Two percent changes in a row: the second change is a percent of the new amount, so they do not cancel.
import { canvas, text, row, slider, readout, title, loop, ease } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.42, max: 240, min: 190, label: 'A bar growing then shrinking by percents' });
  let a = 20, b = -20, t = 1;
  const ctl = row(host), f = (v) => `${v > 0 ? '+' : ''}${Math.round(v)}%`;
  slider(ctl, { label: 'First change', min: -50, max: 100, step: 5, value: a, fmt: f, oninput: (v) => { a = v; t = 0; say(); } });
  slider(ctl, { label: 'Second change', min: -50, max: 100, step: 5, value: b, fmt: f, oninput: (v) => { b = v; t = 0; say(); } });
  const out = readout(host);
  loop(host, (dt) => { if (t < 1) { t = Math.min(1, t + dt * 0.7); cv.redraw(); } });
  const say = () => { const f1 = 1 + a / 100, f2 = 1 + b / 100, tot = (f1 * f2 - 1) * 100; out.innerHTML = `100 × ${f1.toFixed(2)} × ${f2.toFixed(2)} = <b>${(100 * f1 * f2).toFixed(1)}</b>. Overall change: <b>${tot >= 0 ? '+' : ''}${tot.toFixed(1)}%</b>, not ${a + b >= 0 ? '+' : ''}${a + b}%. Multipliers multiply; percents do not add.`; };
  cv.draw = (ctx, w, h, col) => {
    const vals = [100, 100 * (1 + a / 100), 100 * (1 + a / 100) * (1 + b / 100)], max = Math.max(...vals, 100) * 1.1, L = 90, R = w - 20;
    const show = [vals[0], vals[0] + (vals[1] - vals[0]) * ease(Math.min(1, t * 2)), t < 0.5 ? vals[1] : vals[1] + (vals[2] - vals[1]) * ease((t - 0.5) * 2)];
    ['Start', 'After 1st', 'After 2nd'].forEach((lab, i) => {
      const y = 40 + i * ((h - 60) / 3), bw = (show[i] / max) * (R - L);
      ctx.fillStyle = col.s[i]; ctx.fillRect(L, y, bw, (h - 60) / 3 - 10);
      text(ctx, lab, L - 8, y + (h - 60) / 6 - 5, { color: col.ink, size: 11.5, align: 'right' });
      text(ctx, show[i].toFixed(1), L + bw + 6, y + (h - 60) / 6 - 5, { color: col.ink, size: 11.5, weight: 700 });
    });
    title(ctx, 'Start from 100 and apply each change in turn', col);
  };
  cv.redraw(); say();
}
