// Class 8 Science, Investigating: repeating a measurement and taking the mean. Each tap on "Time 10 swings" adds one
// stopwatch reading of a pendulum whose true time is 14.0 s; human reaction time makes every reading a little off
// (about plus or minus 0.6 s). The more readings, the more steady the mean. Readings come from a seeded generator,
// so the same taps always give the same picture.
import { canvas, axes, dot, line, text, title, row, button, readout, rng } from '../../kit.js';

export default function (host) {
  const R = rng(11), pool = Array.from({ length: 40 }, () => 14 + (R() + R() + R() - 1.5) * 0.8);
  let n = 1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Dot plot of repeated stopwatch readings with their mean' });
  const ctl = row(host);
  button(ctl, 'Time 10 swings', () => { n = Math.min(40, n + 1); upd(); });
  button(ctl, 'Add 5 readings', () => { n = Math.min(40, n + 5); upd(); });
  button(ctl, 'Start again', () => { n = 1; upd(); });
  const out = readout(host);
  const mean = () => pool.slice(0, n).reduce((a, b) => a + b, 0) / n;
  function upd() { out.innerHTML = `${n} reading${n > 1 ? 's' : ''}: mean = <b>${mean().toFixed(2)} s</b>. The true time is 14.00 s. One reading can be off by half a second; the mean of many is much closer.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Repeat and take the mean', col);
    const g = axes(ctx, w, h, col, { x: [12.5, 15.5], y: [0, 8], xlabel: 'time for 10 swings (s)', t: 30, yt: [], xt: [13, 14, 15] });
    const { X, Y } = g, cnt = {};
    pool.slice(0, n).forEach((v) => { const b = Math.round(v * 10); cnt[b] = (cnt[b] || 0) + 1; dot(ctx, X(b / 10), Y(cnt[b] - 0.5), 5, col.s[0]); });
    line(ctx, [[X(14), g.T], [X(14), g.B]], col.good, 1.5, [5, 4]); text(ctx, 'true 14.0', X(14) + 4, g.T + 8, { color: col.good, size: 10.5 });
    line(ctx, [[X(mean()), g.T + 14], [X(mean()), g.B]], col.s[2], 2.5); text(ctx, 'mean', X(mean()), g.T + 22, { color: col.s[2], size: 10.5, align: 'center', halo: col.panel });
  };
  upd();
}
