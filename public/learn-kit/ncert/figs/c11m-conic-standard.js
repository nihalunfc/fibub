// Class 11 Maths, Conic Sections: the four standard curves with all their parts. Circle x² + y² = r². Parabola y² = 4ax (and its three turns).
// Ellipse x²/a² + y²/b² = 1 with c² = a² - b², e = c/a, latus rectum 2b²/a. Hyperbola x²/a² - y²/b² = 1 with c² = a² + b², e = c/a, latus rectum 2b²/a.
// Foci, vertices, directrices and the latus rectum are drawn; the readout lists their values.
import { canvas, text, title, dot, row, slider, readout, choice } from '../../kit.js';
import { world, grid, path, seg, f } from '../c11m-geo.js';

export default function (host) {
  let kind = 'ell', pa = 2, a = 5, b = 3, dir = 'r', rad = 4;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Standard circle, parabola, ellipse and hyperbola with foci, vertices, directrices and latus rectum' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Conic', [['cir', 'Circle'], ['par', 'Parabola'], ['ell', 'Ellipse'], ['hyp', 'Hyperbola']], kind, (v) => { kind = v; cv.redraw(); });
  const sr = slider(ctl, { label: 'radius r', min: 1, max: 6, step: 0.5, value: rad, fmt: (v) => v, oninput: (v) => { rad = v; cv.redraw(); } });
  const sp = slider(ctl, { label: 'a (focus distance)', min: 0.5, max: 3, step: 0.25, value: pa, fmt: (v) => v, oninput: (v) => { pa = v; cv.redraw(); } });
  const sa = slider(ctl, { label: 'a (x-semi-axis)', min: 1, max: 6, step: 0.5, value: a, fmt: (v) => v, oninput: (v) => { a = v; cv.redraw(); } });
  const sb = slider(ctl, { label: 'b (y-semi-axis)', min: 1, max: 6, step: 0.5, value: b, fmt: (v) => v, oninput: (v) => { b = v; cv.redraw(); } });
  const sd = choice(ctl, 'Opens', [['r', 'right'], ['l', 'left'], ['u', 'up'], ['d', 'down']], dir, (v) => { dir = v; cv.redraw(); });
  // hide the controls that do not apply
  const nodes = [...ctl.children]; const map = [[nodes[1], 'cir'], [nodes[2], 'par'], [nodes[3], 'ell hyp'], [nodes[4], 'ell hyp'], [nodes[5], 'par']];
  const vis2 = () => map.forEach(([n, k]) => { n.style.display = k.includes(kind) ? '' : 'none'; });
  const go = () => { vis2(); };
  const old = cv.redraw; cv.redraw = () => { go(); old(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Standard forms of the four conics', col), W = world(w, h, top + 2, [-8, 8], [-6.3, 6.3]);
    grid(ctx, W, col, 1);
    const tx = (x, y) => (dir === 'r' ? [x, y] : dir === 'l' ? [-x, y] : dir === 'u' ? [y, x] : [y, -x]);
    const L = (A, B, c, wd = 1.6, d = [5, 4]) => seg(ctx, W, A, B, c, wd, d), pt = (x, y, lab, dx = 6, dy = -9) => { dot(ctx, W.X(x), W.Y(y), 4.5, col.ink); text(ctx, lab, W.X(x) + dx, W.Y(y) + dy, { color: col.ink, size: 11, weight: 700, halo: col.panel }); };
    let eq = '', info = '';
    if (kind === 'cir') {
      path(ctx, W, (t) => [rad * Math.cos(t), rad * Math.sin(t)], 0, 6.2832, 200, col.s[0], 2.6);
      pt(0, 0, 'centre'); L([0, 0], [rad, 0], col.s[3], 1.8, null);
      eq = `x² + y² = ${rad * rad}`; info = `Circle of radius ${rad}, centre at the origin. Every point is ${rad} from the centre; e = 0 and the two foci join in the centre. Area ${f(Math.PI * rad * rad, 1)}.`;
    } else if (kind === 'par') {
      path(ctx, W, (t) => tx(t * t / (4 * pa), t), -12, 12, 300, col.s[0], 2.6);
      const ax = tx(1, 0), vx = (v) => tx(v, 0);
      L(tx(-pa, -7), tx(-pa, 7), col.s[2]); L(tx(pa, -2 * pa), tx(pa, 2 * pa), col.s[3], 2.4, null);
      pt(...tx(pa, 0), 'F'); pt(0, 0, 'V', -12, 10);
      eq = dir === 'r' ? `y² = ${f(4 * pa)}x` : dir === 'l' ? `y² = −${f(4 * pa)}x` : dir === 'u' ? `x² = ${f(4 * pa)}y` : `x² = −${f(4 * pa)}y`;
      const fo = tx(pa, 0), dd = dir === 'r' ? `x = −${f(pa)}` : dir === 'l' ? `x = ${f(pa)}` : dir === 'u' ? `y = −${f(pa)}` : `y = ${f(pa)}`;
      info = `Focus (${f(fo[0])}, ${f(fo[1])}); directrix ${dd}; vertex (0, 0); latus rectum length 4a = ${f(4 * pa)}; e = 1.`;
    } else if (kind === 'ell') {
      path(ctx, W, (t) => [a * Math.cos(t), b * Math.sin(t)], 0, 6.2832, 240, col.s[0], 2.6);
      const maj = a >= b, A = Math.max(a, b), B = Math.min(a, b), c = Math.sqrt(A * A - B * B), e = c / A, T = (u, v) => (maj ? [u, v] : [v, u]);
      if (c > 1e-9) {
        pt(...T(c, 0), 'F₁'); pt(...T(-c, 0), 'F₂'); L(T(c, -B * B / A), T(c, B * B / A), col.s[3], 2.4, null); L(T(-c, -B * B / A), T(-c, B * B / A), col.s[3], 2.4, null);
        L(T(A / e, -7), T(A / e, 7), col.s[2]); L(T(-A / e, -7), T(-A / e, 7), col.s[2]);
      } else pt(0, 0, 'centre');
      L(T(-A, 0), T(A, 0), col.s[1], 1.2, [2, 3]);
      eq = `x²/${a * a} + y²/${b * b} = 1`;
      info = c > 1e-9 ? `${maj ? 'Major axis along x' : 'Major axis along y'}: 2×${A} = ${2 * A}; foci ${maj ? '(±' + f(c) + ', 0)' : '(0, ±' + f(c) + ')'}; c² = a² − b² gives c = ${f(c)}; e = ${f(e)}; latus rectum 2b²/a = ${f(2 * B * B / A)}.` : 'a = b: a circle (e = 0).';
    } else {
      [1, -1].forEach((sg) => path(ctx, W, (u) => [sg * a * Math.cosh(u), b * Math.sinh(u)], -3.5, 3.5, 200, col.s[0], 2.6));
      const c = Math.hypot(a, b), e = c / a;
      path(ctx, W, (t) => [t, (b / a) * t], -9, 9, 2, col.s[1], 1.3, [4, 4]); path(ctx, W, (t) => [t, -(b / a) * t], -9, 9, 2, col.s[1], 1.3, [4, 4]);
      pt(c, 0, 'F₂', 4, -10); pt(-c, 0, 'F₁', -4, -10); L([c, -b * b / a], [c, b * b / a], col.s[3], 2.4, null); L([-c, -b * b / a], [-c, b * b / a], col.s[3], 2.4, null);
      L([a / e, -7], [a / e, 7], col.s[2]); L([-a / e, -7], [-a / e, 7], col.s[2]);
      eq = `x²/${a * a} − y²/${b * b} = 1`;
      info = `Foci (±${f(c)}, 0) since c² = a² + b²; vertices (±${a}, 0); e = ${f(e)}; latus rectum 2b²/a = ${f(2 * b * b / a)}; asymptotes y = ±${f(b / a)}x (dashed).`;
    }
    text(ctx, eq, 10, h - 12, { color: col.ink, size: 14, weight: 800, halo: col.panel });
    ro.textContent = info;
  };
  cv.redraw();
}
