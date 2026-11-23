// Class 11 Maths, Conic Sections: the two-pin-and-string ellipse and its hyperbola twin. Ellipse: PF1 + PF2 = 2a stays constant (a loop of string round two pins).
// Hyperbola: |PF1 - PF2| = 2a stays constant. Ellipse needs a > c (string longer than the gap), hyperbola needs a < c. b² = a² - c² (ellipse), b² = c² - a² (hyperbola).
import { canvas, text, title, line, dot, row, slider, readout, loop, choice } from '../../kit.js';
import { world, grid, path, seg, f } from '../c11m-geo.js';

export default function (host) {
  let mode = 'ell', c = 3, a = 5, s = 0.1;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'An ellipse drawn with two pins and a loop of string, and a hyperbola with constant difference of distances' });
  const ctl = row(host), ro = readout(host);
  const anim = loop(host, (dt) => { s = (s + dt * 0.08) % 1; sl.set(s); cv.redraw(); });
  choice(ctl, 'Curve', [['ell', 'Ellipse (sum)'], ['hyp', 'Hyperbola (difference)']], mode, (v) => { mode = v; if (v === 'ell' && a <= c) a = c + 1; if (v === 'hyp' && a >= c) a = Math.max(1, c - 1); asl.set(a); cv.redraw(); });
  slider(ctl, { label: 'pins at ±c', min: 1, max: 5, step: 0.5, value: c, fmt: (v) => '±' + v, oninput: (v) => { c = v; cv.redraw(); } });
  const asl = slider(ctl, { label: 'a (half of 2a)', min: 1, max: 6, step: 0.5, value: a, fmt: (v) => v, oninput: (v) => { a = v; cv.redraw(); } });
  const sl = slider(ctl, { label: 'pencil position', min: 0, max: 1, step: 0.005, value: s, fmt: () => '', oninput: (v) => { s = v; cv.redraw(); } });
  anim.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'ell' ? 'Ellipse: PF₁ + PF₂ = 2a' : 'Hyperbola: |PF₁ − PF₂| = 2a', col), W = world(w, h, top + 2, [-8, 8], [-5.2, 5.2]);
    grid(ctx, W, col, 1);
    const ok = mode === 'ell' ? a > c : a < c, b = Math.sqrt(Math.abs(a * a - c * c));
    dot(ctx, W.X(-c), W.Y(0), 5, col.ink); dot(ctx, W.X(c), W.Y(0), 5, col.ink);
    text(ctx, 'F₁', W.X(-c), W.Y(0) + 14, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'F₂', W.X(c), W.Y(0) + 14, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    if (!ok) { ro.innerHTML = mode === 'ell' ? '<b>The string is too short:</b> for an ellipse the length 2a must be more than the gap 2c. Increase a or reduce c.' : '<b>For a hyperbola</b> the difference 2a must be less than the gap 2c. Reduce a or increase c.'; return; }
    let P;
    if (mode === 'ell') {
      path(ctx, W, (t) => [a * Math.cos(t), b * Math.sin(t)], 0, 2 * Math.PI, 240, col.s[0], 2.4);
      const t = 2 * Math.PI * s; P = [a * Math.cos(t), b * Math.sin(t)];
    } else {
      [1, -1].forEach((sg) => path(ctx, W, (u) => [sg * a * Math.cosh(u), b * Math.sinh(u)], -3, 3, 200, col.s[0], 2.4));
      const u = 2 * Math.sin(2 * Math.PI * s); P = [a * Math.cosh(u), b * Math.sinh(u)];
    }
    seg(ctx, W, [-c, 0], P, col.s[3], 2); seg(ctx, W, [c, 0], P, col.s[2], 2);
    dot(ctx, W.X(...P), 6, col.s[0], col.panel);
    const d1 = Math.hypot(P[0] + c, P[1]), d2 = Math.hypot(P[0] - c, P[1]);
    ro.innerHTML = mode === 'ell'
      ? `PF₁ = <b>${f(d1)}</b>, PF₂ = <b>${f(d2)}</b>, sum = <b>${f(d1 + d2)}</b> = 2a = ${2 * a}. Here b² = a² − c² = ${f(a * a - c * c)}, so b = ${f(b)} and e = c/a = ${f(c / a)}.`
      : `PF₁ = <b>${f(d1)}</b>, PF₂ = <b>${f(d2)}</b>, difference = <b>${f(Math.abs(d1 - d2))}</b> = 2a = ${2 * a}. Here b² = c² − a² = ${f(c * c - a * a)}, so b = ${f(b)} and e = c/a = ${f(c / a)}.`;
  };
  cv.redraw();
}
