// Class 11 Maths, Conic Sections: the focus-directrix definition. A conic is every point P whose distance from a fixed point F (the focus)
// is e times its distance from a fixed line (the directrix): PF = e x PD. With F at the origin and the directrix x = -p, the curve is r = e p / (1 - e cos t).
// e < 1 gives an ellipse, e = 1 a parabola and e > 1 a hyperbola (the negative r values draw its second branch).
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';
import { world, grid, path, seg, f } from '../c11m-geo.js';

export default function (host) {
  let e = 0.6, th = 1.0; const p = 3;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'A conic section traced as the set of points whose distance from the focus is e times the distance from the directrix' });
  const ctl = row(host), ro = readout(host);
  const R = (t) => (e * p) / (1 - e * Math.cos(t));
  const anim = loop(host, (dt) => {
    th = (th + dt * 0.8) % (2 * Math.PI);
    for (let k = 0; k < 120 && Math.abs(R(th)) > 22; k++) th = (th + 0.04) % (2 * Math.PI);
    cv.redraw();
  });
  slider(ctl, { label: 'eccentricity e', min: 0.2, max: 2.5, step: 0.05, value: e, fmt: (v) => v.toFixed(2), oninput: (v) => { e = v; cv.redraw(); } });
  anim.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Focus and directrix: PF = e × PD', col), W = world(w, h, top + 2, [-6, 9], [-5.5, 5.5]);
    grid(ctx, W, col, 1);
    seg(ctx, W, [-p, -9], [-p, 9], col.s[2], 2, [6, 4]);
    text(ctx, 'directrix', W.X(-p) + 4, W.Y(4.7), { color: col.s[2], size: 11, weight: 700 });
    path(ctx, W, (t) => { const r = R(t); return Math.abs(r) > 60 ? null : [r * Math.cos(t), r * Math.sin(t)]; }, 0, 2 * Math.PI, 700, col.s[0], 2.6);
    const r = R(th), x = r * Math.cos(th), y = r * Math.sin(th), D = [-p, y];
    seg(ctx, W, [0, 0], [x, y], col.s[3], 2); seg(ctx, W, [x, y], D, col.s[2], 2);
    dot(ctx, W.X(0), W.Y(0), 5, col.ink); text(ctx, 'F', W.X(0) + 7, W.Y(0) + 11, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    dot(ctx, W.X(x), W.Y(y), 6, col.s[0], col.panel); dot(ctx, W.X(...D), 3, col.s[2]);
    const pf = Math.abs(r), pd = Math.abs(x + p), kind = Math.abs(e - 1) < 0.01 ? 'parabola' : e < 1 ? 'ellipse' : 'hyperbola';
    text(ctx, `e = ${e.toFixed(2)}: ${kind}`, 10, h - 12, { color: col.ink, size: 13, weight: 800, halo: col.panel });
    ro.innerHTML = `PF = <b>${f(pf)}</b>, PD = <b>${f(pd)}</b>, PF ÷ PD = <b>${f(pf / pd, 2)}</b>, always equal to e = ${e.toFixed(2)}. ${e < 0.35 ? 'A tiny e is almost a circle (a circle is e = 0).' : e < 1 ? 'Closed curve: an ellipse.' : Math.abs(e - 1) < 0.01 ? 'Open, with one arm: a parabola.' : 'Two branches: a hyperbola.'}`;
  };
  cv.redraw();
}
