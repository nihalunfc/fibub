// Class 9 Science, Chapter 1: measurement uncertainty. Each "stopwatch reading" of a pendulum's time period is the true
// value plus a random error (reaction time). Readings pile up on a number line; the mean settles closer to the true
// value as readings increase, and the spread (range) shows the uncertainty. A "zero error" (watch started late)
// shifts every reading the same way, which averaging cannot cure.
import { canvas, text, title, line, dot, row, button, choice, readout, rng } from '../../kit.js';

export default function (host) {
  let data = [], mode = 'random', R = rng(7);
  const TRUE = 2.0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'A dot plot of repeated timing readings with the mean and the true value marked' });
  const ctl = row(host);
  const g = () => (R() + R() + R() - 1.5) * 0.36;
  const add = (k) => { for (let i = 0; i < k; i++) data.push(+(TRUE + g() + (mode === 'zero' ? 0.25 : 0)).toFixed(2)); upd(); };
  button(ctl, 'Take 1 reading', () => add(1)); button(ctl, 'Take 10', () => add(10)); button(ctl, 'Clear', () => { data = []; upd(); });
  choice(ctl, 'Errors', [['random', 'Random only'], ['zero', 'Random + zero error']], mode, (v) => { mode = v; data = []; upd(); });
  const out = readout(host);
  function upd() {
    if (!data.length) out.textContent = 'True value 2.00 s (a hidden number). Take readings and watch the mean.';
    else { const m = data.reduce((a, b) => a + b, 0) / data.length, lo = Math.min(...data), hi = Math.max(...data); out.innerHTML = `${data.length} readings. Mean <b>${m.toFixed(3)} s</b>, range ${lo.toFixed(2)} to ${hi.toFixed(2)} s, so T = <b>${m.toFixed(2)} ± ${((hi - lo) / 2).toFixed(2)} s</b>. ` + (mode === 'zero' ? 'The mean stays about 0.25 s too high: a zero error is not removed by averaging.' : 'Random errors average out: more readings, a mean nearer the true value.'); }
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Repeat the measurement and the scatter tells the story', col) + 10;
    const L = 24, R2 = w - 24, X = (v) => L + ((v - 1.4) / 1.2) * (R2 - L), by = h - 52;
    line(ctx, [[L, by], [R2, by]], col.ink, 1.5);
    for (let v = 1.4; v <= 2.601; v += 0.2) { line(ctx, [[X(v), by], [X(v), by + 5]], col.ink, 1); text(ctx, v.toFixed(1), X(v), by + 16, { color: col.muted, size: 10.5, align: 'center' }); }
    text(ctx, 'time for one swing (s)', w / 2, h - 8, { color: col.muted, size: 11, align: 'center' });
    line(ctx, [[X(TRUE), top + 6], [X(TRUE), by]], col.s[2], 2, [5, 4]); text(ctx, 'true 2.00 s', X(TRUE), top + 2, { color: col.s[2], size: 11, weight: 700, align: 'center', halo: col.panel });
    const bins = {}; data.forEach((v) => { const k = Math.round(v * 50); bins[k] = (bins[k] || 0) + 1; ctx.beginPath(); });
    const used = {}; data.forEach((v) => { const k = Math.round(v * 50); used[k] = (used[k] || 0) + 1; dot(ctx, X(v), by - 7 - (used[k] - 1) * 10, 4.5, col.s[0]); });
    if (data.length) { const m = data.reduce((a, b) => a + b, 0) / data.length; line(ctx, [[X(m), by - 4], [X(m), top + 28]], col.s[1], 3); text(ctx, 'mean', X(m), top + 22, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); }
  };
  add(6);
}
