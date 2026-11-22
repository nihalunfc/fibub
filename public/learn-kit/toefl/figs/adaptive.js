// How an item-by-item adaptive test homes in on a level: a simulated test taker answers items; right answers raise
// the next item's difficulty, wrong ones lower it, by smaller steps over time. A teaching model, not ETS's design.
import { canvas, row, slider, button, readout, axes, line, dot, text, rng } from '../../kit.js';

export default function (host) {
  let level = 4.2, seed = 3, items = [];
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Item difficulty over 20 questions, moving towards the test taker’s level' });
  const ctl = row(host);
  slider(ctl, { label: 'Test taker’s true level', min: 1.5, max: 5.8, step: 0.1, value: level, fmt: (v) => v.toFixed(1), oninput: (v) => { level = v; run(); } });
  button(ctl, '↻ Another test taker', () => { seed++; run(); });
  const out = readout(host);
  const run = () => {
    const r = rng(seed * 97 + 1);
    items = []; let d = 3.5, step = 0.8;
    for (let i = 0; i < 20; i++) {
      // Chance of a right answer falls as the item gets harder than the person's level (logistic curve).
      const p = 1 / (1 + Math.exp(-2.2 * (level - d)));
      const ok = r() < p;
      items.push({ d, ok });
      d = Math.min(6, Math.max(1, d + (ok ? step : -step)));
      step = Math.max(0.15, step * 0.85);
    }
    const est = items.slice(-6).reduce((a, x) => a + x.d, 0) / 6;
    out.innerHTML = `After 20 items the difficulty settles near <b>${est.toFixed(1)}</b> (true level ${level.toFixed(1)}). Right answers: ${items.filter((x) => x.ok).length} of 20, but the band comes from <i>how hard</i> the items were, not just the count.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, T } = axes(ctx, w, h, col, { x: [0, 21], y: [1, 6], l: 44, t: 30, xlabel: 'Question number', ylabel: 'Difficulty (band)', xt: [1, 5, 10, 15, 20], yt: [1, 2, 3, 4, 5, 6] });
    const o = { top: T };
    line(ctx, [[X(0), Y(level)], [X(21), Y(level)]], col.muted, 1.5, [5, 4]);
    text(ctx, 'true level', X(21) - 4, Y(level) - 9, { color: col.muted, size: 11, align: 'right' });
    line(ctx, items.map((it, i) => [X(i + 1), Y(it.d)]), col.s[0], 2);
    items.forEach((it, i) => dot(ctx, X(i + 1), Y(it.d), 4.5, it.ok ? col.s[2] : col.s[7]));
    dot(ctx, X(0.6), o.top - 14, 4.5, col.s[2]); text(ctx, 'right', X(0.6) + 8, o.top - 14, { color: col.ink, size: 11 });
    dot(ctx, X(0.6) + 52, o.top - 14, 4.5, col.s[7]); text(ctx, 'wrong', X(0.6) + 60, o.top - 14, { color: col.ink, size: 11 });
  };
  run();
}
