// A 2 × 2 matrix [[a, b], [c, d]] as a map of the plane: the unit square (grey) goes to the parallelogram spanned
// by the columns (a, c) and (b, d). Its signed area is the determinant ad − bc: negative means the picture is
// flipped over, zero means it is squashed onto a line (a singular matrix, no inverse).
import { canvas, axes, line, row, slider, readout, fmt, arrow, text, choice } from '../../kit.js';

export default function (host) {
  let a = 2, b = 1, c = 0.5, d = 1.5;
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 260, label: 'The unit square and its image under a 2 by 2 matrix, a parallelogram whose area is the determinant' });
  const ctl = row(host);
  const S = {};
  const re = () => { cv.redraw(); show(); };
  const mk = (k, label, v) => (S[k] = slider(ctl, { label, min: -3, max: 3, step: 0.25, value: v, fmt: (x) => fmt(x, 3), oninput: (x) => { ({ a, b, c, d } = { a, b, c, d, [k]: x }); re(); } }));
  mk('a', 'a (top left)', a); mk('b', 'b (top right)', b); mk('c', 'c (bottom left)', c); mk('d', 'd (bottom right)', d);
  choice(ctl, 'Try', [['shear', 'shear'], ['flip', 'reflection'], ['sing', 'singular'], ['rot', 'rotation']], 'shear', (v) => {
    const P = { shear: [1, 1.5, 0, 1], flip: [1, 0, 0, -1], sing: [2, 1, 1, 0.5], rot: [0.71, -0.71, 0.71, 0.71] }[v];
    [a, b, c, d] = P; S.a.set(a); S.b.set(b); S.c.set(c); S.d.set(d); re();
  });
  const out = readout(host);
  const show = () => {
    const D = a * d - b * c;
    const what = Math.abs(D) < 1e-9 ? 'The square is squashed onto a line: the matrix is <b>singular</b> and has no inverse.' : D < 0 ? 'Negative: the picture is flipped over (orientation reversed).' : 'Positive: orientation is kept.';
    const inv = Math.abs(D) < 1e-9 ? '' : ` Inverse = (1/${fmt(D, 3)}) [[${fmt(d, 3)}, ${fmt(-b, 3)}], [${fmt(-c, 3)}, ${fmt(a, 3)}]].`;
    out.innerHTML = `det = ad − bc = ${fmt(a, 3)}×${fmt(d, 3)} − ${fmt(b, 3)}×${fmt(c, 3)} = <b>${fmt(D, 3)}</b>. Every area is multiplied by |det| = ${fmt(Math.abs(D), 3)}. ${what}${inv}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const R = 4.5, k = w / h;
    const { X, Y } = axes(ctx, w, h, col, { x: [-R * k * 0.9, R * k * 0.9], y: [-R * 0.9, R * 0.9], xlabel: 'x', ylabel: 'y', l: 36, b: 34 });
    line(ctx, [[X(-10), Y(0)], [X(10), Y(0)]], col.muted, 1); line(ctx, [[X(0), Y(-10)], [X(0), Y(10)]], col.muted, 1);
    const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.closePath(); ctx.globalAlpha = 0.22; ctx.fillStyle = fill; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); };
    poly([[0, 0], [1, 0], [1, 1], [0, 1]], col.muted, col.muted);
    const D = a * d - b * c;
    poly([[0, 0], [a, c], [a + b, c + d], [b, d]], D < 0 ? col.s[3] : col.s[0], D < 0 ? col.s[3] : col.s[0]);
    arrow(ctx, X(0), Y(0), X(a), Y(c), col.s[1], 2.5);
    arrow(ctx, X(0), Y(0), X(b), Y(d), col.s[2], 2.5);
    text(ctx, `(a, c)`, X(a) + 6, Y(c) - 8, { color: col.s[1], size: 11, halo: col.panel });
    text(ctx, `(b, d)`, X(b) + 6, Y(d) - 8, { color: col.s[2], size: 11, halo: col.panel });
    text(ctx, `area = |det| = ${fmt(Math.abs(D), 3)}`, X(-R * k * 0.85), Y(R * 0.8), { color: col.ink, size: 12, weight: 600, halo: col.panel });
  };
  re();
}
