// 1.8 What a matrix does to vectors. A unit vector v sweeps round the circle; the matrix sends it to Av. Most of the
// time Av points somewhere new. Along an eigenvector Av lands on the same line as v, stretched by the eigenvalue.
import { canvas, text, arrow, line, row, choice, readout, fmt, loop, title } from '../../kit.js';

const MATS = {
  sym: { name: '[[2, 1], [1, 2]]', m: [2, 1, 1, 2] },
  stretch: { name: '[[3, 0], [0, 1]]', m: [3, 0, 0, 1] },
  mixed: { name: '[[1, 2], [2, −2]]', m: [1, 2, 2, -2] },
  shear: { name: 'Shear [[1, 1], [0, 1]]', m: [1, 1, 0, 1] },
  rot: { name: 'Rotation [[0, −1], [1, 0]]', m: [0, -1, 1, 0] },
};

function eig([a, b, c, d]) {
  const t = a + d, D = a * d - b * c, disc = t * t - 4 * D;
  if (disc < -1e-12) return { complex: true, t, D };
  const s = Math.sqrt(Math.max(0, disc)), ls = [(t + s) / 2, (t - s) / 2];
  const vecs = ls.map((l) => (Math.abs(b) > 1e-12 ? [b, l - a] : Math.abs(c) > 1e-12 ? [l - d, c] : (Math.abs(l - a) < 1e-12 ? [1, 0] : [0, 1])));
  return { complex: false, ls, vecs: vecs.map(([x, y]) => { const n = Math.hypot(x, y); return [x / n, y / n]; }), t, D };
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 260, label: 'A unit vector v and its image Av under a 2 by 2 matrix, with eigenvector lines' });
  let key = 'sym', ang = 0.3;
  const ctl = row(host);
  choice(ctl, 'Matrix', Object.entries(MATS).map(([k, v]) => [k, v.name]), key, (v) => { key = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const M = MATS[key].m, e = eig(M);
    const v = [Math.cos(ang), Math.sin(ang)], Av = [M[0] * v[0] + M[1] * v[1], M[2] * v[0] + M[3] * v[1]];
    const cross = v[0] * Av[1] - v[1] * Av[0];
    const along = Math.abs(cross) < 0.06 * Math.hypot(...Av) + 1e-9;
    const eigTxt = e.complex ? `no real eigenvectors: its eigenvalues are complex (trace ${fmt(e.t)}, det ${fmt(e.D)}), so Av is never parallel to v`
      : Math.abs(e.ls[0] - e.ls[1]) < 1e-9 ? `one repeated eigenvalue ${fmt(e.ls[0])} with only one eigenvector line`
      : `eigenvalues ${fmt(e.ls[0])} and ${fmt(e.ls[1])} (the dashed lines are their eigenvectors)`;
    out.innerHTML = `Trace ${fmt(e.t)} = sum of the eigenvalues; determinant ${fmt(e.D)} = their product. This matrix has ${eigTxt}. ${along ? '<b>Right now Av lies along v: v is an eigenvector.</b>' : 'Watch for the moments when Av lines up with v.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const M = MATS[key].m, e = eig(M);
    const S = Math.min(w, h) / 8.4, cx = w / 2, cy = h / 2 + 8;
    const P = (x, y) => [cx + x * S, cy - y * S];
    title(ctx, 'v (grey) and Av (colour)', col);
    line(ctx, [P(-4, 0), P(4, 0)], col.line, 1); line(ctx, [P(0, -3.6), P(0, 3.6)], col.line, 1);
    const circ = [], img = [];
    for (let k = 0; k <= 96; k++) { const t = (k / 96) * 2 * Math.PI, x = Math.cos(t), y = Math.sin(t); circ.push(P(x, y)); img.push(P(M[0] * x + M[1] * y, M[2] * x + M[3] * y)); }
    line(ctx, circ, col.muted, 1.2, [3, 3]);
    line(ctx, img, col.s[2], 1.5);
    if (!e.complex) e.vecs.forEach(([x, y], i) => line(ctx, [P(-4 * x, -4 * y), P(4 * x, 4 * y)], col.s[i === 0 ? 4 : 5], 1.5, [7, 5]));
    const v = [Math.cos(ang), Math.sin(ang)], Av = [M[0] * v[0] + M[1] * v[1], M[2] * v[0] + M[3] * v[1]];
    arrow(ctx, ...P(0, 0), ...P(...v), col.muted, 2.5, 9);
    arrow(ctx, ...P(0, 0), ...P(...Av), col.s[0], 3, 10);
    text(ctx, 'v', ...P(v[0] * 1.15, v[1] * 1.15), { color: col.muted, size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'Av', ...P(Av[0] * 1.08 + 0.15, Av[1] * 1.08 + 0.15), { color: col.s[0], size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'dashed circle: all unit vectors v · solid curve: where A sends them', 8, h - 10, { color: col.muted, size: 11, base: 'bottom' });
  };
  const lp = loop(host, (dt) => { ang = (ang + (dt ?? 0.016) * 0.5) % (2 * Math.PI); cv.redraw(); show(); });
  lp.button(ctl);
  cv.redraw(); show();
}
