// Class 11 Maths, Straight Lines: the slope-intercept form y = mx + c. The slope m tells how much y changes when x
// increases by 1; c is where the line crosses the y-axis. Move the sliders and read the x-intercept (−c/m) as well.
import { canvas, axes, row, slider, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let m = 1, c = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'The line y equals m x plus c with sliders for the slope and the y-intercept' });
  const c1 = row(host), out = readout(host);
  const f = (v) => String(+v.toFixed(2)).replace('-', '−');
  slider(c1, { label: 'slope m', min: -4, max: 4, step: 0.5, value: m, fmt: f, oninput: (v) => { m = v; re(); } });
  slider(c1, { label: 'intercept c', min: -5, max: 5, step: 1, value: c, fmt: f, oninput: (v) => { c = v; re(); } });
  const re = () => { cv.redraw(); out.innerHTML = `y = ${f(m)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}. Cuts the y-axis at (0, ${f(c)}); ${m === 0 ? 'parallel to the x-axis, so it never meets it (unless c = 0)' : `cuts the x-axis at (${f(-c / m)}, 0)`}. Angle with the x-axis: <b>${((Math.atan(m) * 180 / Math.PI + 180) % 180).toFixed(1)}°</b>. Each step of 1 along x moves y by ${f(m)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `y = ${f(m)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, col), g = axes(ctx, w, h, col, { x: [-6, 6], y: [-6, 6], l: 26, b: 22, t: top + 4, r: 10, xt: [-6, -3, 0, 3, 6], yt: [-6, -3, 0, 3, 6] });
    ctx.save(); g.clip(); line(ctx, [[g.X(-7), g.Y(m * -7 + c)], [g.X(7), g.Y(m * 7 + c)]], col.s[0], 2.5); ctx.restore();
    line(ctx, [[g.X(0), g.Y(c)], [g.X(1), g.Y(c)]], col.s[2], 2); line(ctx, [[g.X(1), g.Y(c)], [g.X(1), g.Y(c + m)]], col.s[1], 2);
    text(ctx, '1', g.X(0.5), g.Y(c) + (m >= 0 ? 12 : -12), { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, f(m), g.X(1) + 14, g.Y(c + m / 2), { color: col.s[1], size: 11, weight: 700, align: 'center' });
    dot(ctx, g.X(0), g.Y(c), 6, col.s[1], col.panel); if (m !== 0) dot(ctx, g.X(-c / m), g.Y(0), 6, col.s[2], col.panel);
  };
  re();
}
