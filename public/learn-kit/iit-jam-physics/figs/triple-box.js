// 1.4 The scalar triple product as a volume. a and b span the base parallelogram (area |a × b|); the third edge c
// stands on it. Tilting c sideways does not change the volume: only its height above the base, the component of c
// along a × b, counts. Push c through the base and the triple product turns negative (a left-handed set).
import { canvas, line, text, arrow, row, slider, readout, fmt, title } from '../../kit.js';

const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (...vs) => vs.reduce((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]], [0, 0, 0]);

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 430, min: 260, label: 'A parallelepiped on edges a, b and c, with its base area and height' });
  let ang = 60, tilt = 0.8, hgt = 1.2;
  const ctl = row(host);
  slider(ctl, { label: 'angle between a and b', min: 15, max: 165, step: 1, value: ang, fmt: (v) => v + '°', oninput: (v) => { ang = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'slide c sideways', min: -1.5, max: 1.5, step: 0.05, value: tilt, fmt: (v) => fmt(v, 3), oninput: (v) => { tilt = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'height of c', min: -1.5, max: 1.8, step: 0.05, value: hgt, fmt: (v) => fmt(v, 3), oninput: (v) => { hgt = v; cv.redraw(); show(); } });
  const out = readout(host);
  const vecs = () => {
    const t = (ang * Math.PI) / 180;
    const a = [2, 0, 0], b = [1.6 * Math.cos(t), 1.6 * Math.sin(t), 0], c = [0.4 + tilt, 0.5 + 0.5 * tilt, hgt];
    return { a, b, c };
  };
  const show = () => {
    const { a, b, c } = vecs(), n = cross(a, b), area = Math.hypot(...n), V = dot(c, n);
    out.innerHTML = `Base area |a × b| = ${fmt(area, 4)}. Height of c above the base = c · (a × b)/|a × b| = ${fmt(V / area, 4)}. Triple product a · (b × c) = ${fmt(V, 4)}${Math.abs(V) < 1e-9 ? ': <b>zero, the three vectors are coplanar</b>' : V < 0 ? ': <b>negative, because c points below the base (a, b, c is a left-handed set)</b>; the volume is its absolute value' : ', the volume of the box'}. Sliding c sideways changes nothing.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { a, b, c } = vecs(), n = cross(a, b);
    title(ctx, 'Volume = base area × height = a · (b × c)', col);
    const S = Math.min(w, h) / 5.2, cx = w * 0.3, cy = h * 0.66;
    const P = (v) => [cx + S * (v[0] + 0.35 * v[1]), cy - S * (v[2] + 0.45 * v[1])];
    const O = [0, 0, 0];
    const base = [O, a, add(a, b), b, O].map(P);
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath(); base.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.fill(); ctx.restore();
    const topF = [c, add(a, c), add(a, b, c), add(b, c), c].map(P);
    line(ctx, base, col.s[0], 1.5);
    line(ctx, topF, col.muted, 1.5);
    for (const v of [a, add(a, b), b]) line(ctx, [P(v), P(add(v, c))], col.muted, 1.5);
    // height: drop from tip of c to the base plane (z = 0)
    line(ctx, [P(c), P([c[0], c[1], 0])], col.s[3], 2, [5, 4]);
    text(ctx, 'height', ...P([c[0] + 0.08, c[1], c[2] / 2]), { color: col.s[3], size: 12, halo: col.panel });
    arrow(ctx, ...P(O), ...P(a), col.s[0], 3, 10);
    arrow(ctx, ...P(O), ...P(b), col.s[2], 3, 10);
    arrow(ctx, ...P(O), ...P(c), col.s[4], 3, 10);
    const nn = Math.hypot(...n), u = n.map((x) => (0.9 * x) / nn);
    arrow(ctx, ...P(O), ...P(u), col.ink, 1.5, 7);
    text(ctx, 'a', ...P([a[0] + 0.1, a[1], a[2] - 0.15]), { color: col.s[0], size: 14, weight: 700, halo: col.panel });
    text(ctx, 'b', ...P([b[0] - 0.1, b[1] + 0.15, b[2]]), { color: col.s[2], size: 14, weight: 700, halo: col.panel, align: 'right' });
    text(ctx, 'c', ...P([c[0] + 0.1, c[1], c[2] + 0.1]), { color: col.s[4], size: 14, weight: 700, halo: col.panel });
    text(ctx, 'a × b (unit)', ...P([u[0] - 0.08, u[1], u[2] + 0.12]), { color: col.ink, size: 11, halo: col.panel, align: 'right' });
  };
  cv.redraw(); show();
}
