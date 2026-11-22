// Class 10 Quadratic Equations: nature of roots as a moving parabola. Keep a = 1 and b = -4 and slide c upward: the
// curve y = x² - 4x + c lifts off the x-axis. Two roots (D > 0) merge into one (D = 0, the parabola just touches) and then
// disappear (D < 0). The discriminant is D = 16 - 4c.
import { canvas, axes, line, dot, text, title, row, slider, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  let c = -2, dir = 1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A parabola lifting off the x-axis as c increases, showing two, one then no real roots' });
  const ctl = row(host);
  const s = slider(ctl, { label: 'c in x² − 4x + c', min: -4, max: 8, step: 0.5, value: c, oninput: (v) => { c = v; anim.pause(); say(); cv.redraw(); } });
  const anim = loop(host, (dt) => { c += dir * dt * 1.2; if (c > 8) dir = -1; if (c < -4) dir = 1; s.set(c); say(); cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function say() {
    const D = 16 - 4 * c;
    out.innerHTML = D > 0.01 ? `D = 16 − 4c = <b>${fmt(D)}</b> &gt; 0: two different real roots.` : D > -0.01 ? `D = <b>0</b>: the curve just touches the axis, one repeated root x = 2.` : `D = 16 − 4c = <b>${fmt(D)}</b> &lt; 0: no real roots.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'y = x² − 4x + c', col);
    const A = axes(ctx, w, h, col, { x: [-2, 6], y: [-6, 12], t: 34, b: 28, l: 34 });
    ctx.save(); A.clip();
    const pts = []; for (let i = 0; i <= 100; i++) { const x = -2 + (8 * i) / 100; pts.push([A.X(x), A.Y(x * x - 4 * x + c)]); }
    const D = 16 - 4 * c, colr = D > 0.01 ? col.s[1] : D > -0.01 ? col.s[2] : col.s[3];
    line(ctx, pts, colr, 3);
    ctx.restore();
    if (D >= -0.01) {
      const r = D < 0.01 ? [2] : [2 + Math.sqrt(D) / 2, 2 - Math.sqrt(D) / 2];
      for (const x of r) { dot(ctx, A.X(x), A.Y(0), 6, colr, col.panel); text(ctx, fmt(x, 2), A.X(x), A.Y(0) + 15, { color: colr, size: 11, weight: 700, align: 'center' }); }
    }
    const lab = D > 0.01 ? 'two roots' : D > -0.01 ? 'one root' : 'no real roots';
    text(ctx, lab, w - 14, A.T + 12, { color: colr, size: 13, weight: 700, align: 'right' });
    text(ctx, `D = ${fmt(D)}`, w - 14, A.T + 30, { color: col.muted, size: 12, align: 'right' });
  };
  say(); cv.redraw();
}
