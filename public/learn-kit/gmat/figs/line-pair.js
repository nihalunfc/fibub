// 3.1 A system of two linear equations is two lines; the solution is where they cross.
import { canvas, axes, line, dot, text, row, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Two lines and where they cross' });
  let m1 = 1, b1 = 1, m2 = -0.5, b2 = 4;
  const ctl = row(host), f = (v) => (+v).toFixed(1);
  slider(ctl, { label: 'Slope 1', min: -3, max: 3, step: 0.5, value: m1, fmt: f, oninput: (v) => { m1 = v; go(); } });
  slider(ctl, { label: 'Intercept 1', min: -5, max: 5, step: 0.5, value: b1, fmt: f, oninput: (v) => { b1 = v; go(); } });
  slider(ctl, { label: 'Slope 2', min: -3, max: 3, step: 0.5, value: m2, fmt: f, oninput: (v) => { m2 = v; go(); } });
  slider(ctl, { label: 'Intercept 2', min: -5, max: 5, step: 0.5, value: b2, fmt: f, oninput: (v) => { b2 = v; go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); out.innerHTML = m1 === m2 ? (b1 === b2 ? 'The lines are the same line: <b>infinitely many solutions</b>.' : 'Same slope, different intercepts: the lines are parallel, so there is <b>no solution</b>.') : (() => { const x = (b2 - b1) / (m1 - m2), y = m1 * x + b1; return `y = ${m1}x + ${b1} and y = ${m2}x + ${b2} cross at <b>(${+x.toFixed(2)}, ${+y.toFixed(2)})</b>: the one pair (x, y) that makes both equations true.`; })(); };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y } = axes(ctx, w, h, col, { x: [-6, 6], y: [-6, 6], xlabel: 'x', ylabel: 'y' });
    const seg = (m, b) => [[X(-6), Y(m * -6 + b)], [X(6), Y(m * 6 + b)]];
    ctx.save(); ctx.beginPath(); ctx.rect(X(-6), Y(6), X(6) - X(-6), Y(-6) - Y(6)); ctx.clip();
    line(ctx, seg(m1, b1), col.s[0], 2.5); line(ctx, seg(m2, b2), col.s[1], 2.5);
    if (m1 !== m2) { const x = (b2 - b1) / (m1 - m2); dot(ctx, X(x), Y(m1 * x + b1), 6, col.ink); }
    ctx.restore();
    title(ctx, 'The solution is the crossing point', col);
  };
  go();
}
