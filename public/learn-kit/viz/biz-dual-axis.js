// Two axes can make unrelated things look related. Sales (left) and an unrelated count (right) are drawn together. On one
// shared scale they have nothing to do with each other; with two axes you can slide the right-hand scale until they seem to
// move as one. Made-up data. The fix: separate panels, or index both to 100.
import { canvas, axes, line, text, title, row, slider, choice, readout } from '../kit.js';
import { wob } from './_biz.js';

const A = Array.from({ length: 12 }, (_, i) => 100 + 4 * i + 6 * wob(i, 1.1));
const Bv = Array.from({ length: 12 }, (_, i) => 60 + 3 * i * (i % 2 ? 1 : 0.4) + 9 * wob(i, 2.3));
export default function (host) {
  let mode = 'dual';
  const cv = canvas(host, { aspect: 0.72, max: 390, min: 300, label: 'Two unrelated series on one axis or two axes' });
  const ctl = row(host);
  choice(ctl, 'Axes', [['one', 'One shared'], ['dual', 'Two (dual)'], ['idx', 'Indexed to 100']], mode, (v) => { mode = v; cv.redraw(); show(); });
  const lo = slider(ctl, { label: 'Right axis starts at', min: 0, max: 60, step: 1, value: 55, fmt: (v) => v, oninput: () => { cv.redraw(); show(); } });
  const hi = slider(ctl, { label: 'Right axis ends at', min: 70, max: 200, step: 1, value: 80, fmt: (v) => v, oninput: () => { cv.redraw(); show(); } });
  const out = readout(host);
  function show() {
    out.innerHTML = mode === 'dual' ? 'Move the right axis range: the orange line is the same data every time, yet it can be made to hug the blue one. <b>Whoever sets the second axis sets the story.</b>' : mode === 'one' ? 'On one honest scale the two series sit at different levels and show no shared pattern.' : 'Indexed to 100 at the start, both are compared by growth on one axis, with no trick available.';
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Do these move together?', col);
    const idx = (s) => s.map((v) => (v / s[0]) * 100);
    const a = axes(ctx, w, h, col, { t: 36, x: [1, 12], y: mode === 'idx' ? [80, 220] : mode === 'one' ? [0, 170] : [95, 155], xlabel: 'Month', xt: [1, 3, 6, 9, 12], l: 40, r: mode === 'dual' ? 40 : 14 });
    const s1 = mode === 'idx' ? idx(A) : A, s2 = mode === 'idx' ? idx(Bv) : Bv;
    line(ctx, s1.map((v, i) => [a.X(i + 1), a.Y(v)]), col.s[0], 3);
    if (mode === 'dual') {
      const f = (v) => a.B - ((v - lo.value) / (hi.value - lo.value)) * (a.B - a.T);
      line(ctx, s2.map((v, i) => [a.X(i + 1), f(v)]), col.s[1], 3);
      text(ctx, 'Unrelated count (right axis)', a.R - 2, a.T + 8, { color: col.s[1], size: 10, weight: 700, align: 'right', fit: false });
      text(ctx, lo.value + '', w - 6, a.B, { color: col.s[1], size: 10, align: 'right', fit: false });
      text(ctx, hi.value + '', w - 6, a.T, { color: col.s[1], size: 10, align: 'right', fit: false });
    } else line(ctx, s2.map((v, i) => [a.X(i + 1), a.Y(v)]), col.s[1], 3);
    text(ctx, 'Sales (left axis)', a.L + 6, a.T + 8, { color: col.s[0], size: 10, weight: 700, fit: false });
  };
  show(); cv.redraw();
}
