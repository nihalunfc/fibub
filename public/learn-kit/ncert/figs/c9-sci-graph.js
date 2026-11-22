// Class 9 Science, Chapter 1: drawing and reading a graph. Eight readings of a spring's stretch for different loads are
// scattered by small errors. Drag the sliders to place a straight line through them; the vertical gaps (residuals) shrink
// as the line gets better. The slope (stretch per newton) is read off with a triangle. "Join the dots" shows why we do not.
import { canvas, axes, line, dot, text, title, row, slider, button, choice, readout } from '../../kit.js';

export default function (host) {
  let m = 1.2, c = 0.5, show = 'line';
  const X = [1, 2, 3, 4, 5, 6, 7, 8], Y = [2.4, 3.1, 4.8, 5.3, 6.7, 8.1, 8.6, 10.1];
  const n = X.length, mx = X.reduce((a, b) => a + b) / n, my = Y.reduce((a, b) => a + b) / n;
  const bm = X.reduce((a, x, i) => a + (x - mx) * (Y[i] - my), 0) / X.reduce((a, x) => a + (x - mx) ** 2, 0), bc = my - bm * mx;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A scatter graph of a spring stretch against load with an adjustable straight line' });
  const ctl = row(host);
  const sm = slider(ctl, { label: 'Slope', min: 0, max: 2.5, step: 0.05, value: m, fmt: (v) => v.toFixed(2), oninput: (v) => { m = v; upd(); } });
  const sc = slider(ctl, { label: 'Start (intercept)', min: -2, max: 4, step: 0.1, value: c, fmt: (v) => v.toFixed(1), oninput: (v) => { c = v; upd(); } });
  button(ctl, 'Best fit', () => { m = +bm.toFixed(2); c = +bc.toFixed(1); sm.set(m); sc.set(c); upd(); });
  choice(ctl, 'Draw', [['line', 'Straight line'], ['join', 'Join the dots']], show, (v) => { show = v; upd(); });
  const out = readout(host);
  const sse = () => X.reduce((a, x, i) => a + (Y[i] - (m * x + c)) ** 2, 0);
  function upd() { out.innerHTML = `Line: y = ${m.toFixed(2)}x + ${c.toFixed(1)}. Total of squared gaps = <b>${sse().toFixed(2)}</b> (best possible ${X.reduce((a, x, i) => a + (Y[i] - (bm * x + bc)) ** 2, 0).toFixed(2)}). Slope = stretch per newton = ${m.toFixed(2)} cm/N.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Spring: stretch (cm) against load (N)', col) + 4;
    const ax = axes(ctx, w, h, col, { x: [0, 9], y: [0, 12], t: top + 2, xlabel: 'load (N)', ylabel: 'stretch (cm)' });
    ctx.save(); ax.clip();
    if (show === 'join') line(ctx, X.map((x, i) => [ax.X(x), ax.Y(Y[i])]), col.s[1], 2, [4, 3]);
    else { line(ctx, [[ax.X(0), ax.Y(c)], [ax.X(9), ax.Y(m * 9 + c)]], col.s[0], 2.5); X.forEach((x, i) => line(ctx, [[ax.X(x), ax.Y(Y[i])], [ax.X(x), ax.Y(m * x + c)]], col.s[3], 1.5)); }
    ctx.restore();
    X.forEach((x, i) => dot(ctx, ax.X(x), ax.Y(Y[i]), 4.5, col.ink));
    if (show === 'line') { const x1 = 2, x2 = 7, y1 = m * x1 + c, y2 = m * x2 + c; line(ctx, [[ax.X(x1), ax.Y(y1)], [ax.X(x2), ax.Y(y1)], [ax.X(x2), ax.Y(y2)]], col.s[2], 1.5, [4, 3]); text(ctx, `rise ${(y2 - y1).toFixed(1)}`, ax.X(x2) + 4, ax.Y((y1 + y2) / 2), { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'run 5', ax.X(4.5), ax.Y(y1) + 12, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
  };
  upd();
}
