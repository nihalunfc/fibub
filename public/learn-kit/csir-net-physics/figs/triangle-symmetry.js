// 2.2 The six symmetry operations of an equilateral triangle (the group C3v ≅ S3). Pick h, then g: the triangle shows
// the result of doing h first and g second, and the multiplication table highlights the product g·h. Each operation
// is a 2×2 matrix; the product is found by multiplying matrices and matching the result.
import { canvas, text, title, row, choice, readout, line, dot } from '../../kit.js';

const R = (k) => { const a = (2 * Math.PI * k) / 3; return [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)]; };
// reflection across the line at angle φ: [[cos2φ, sin2φ], [sin2φ, −cos2φ]]
const S = (phi) => [Math.cos(2 * phi), Math.sin(2 * phi), Math.sin(2 * phi), -Math.cos(2 * phi)];
const VERT = [90, 210, 330].map((d) => (d * Math.PI) / 180); // vertex 1, 2, 3 positions
const OPS = [
  ['E', 'identity', R(0)], ['C₃', 'turn 120°', R(1)], ['C₃²', 'turn 240°', R(2)],
  ['σ₁', 'mirror through vertex 1', S(VERT[0])], ['σ₂', 'mirror through vertex 2', S(VERT[1])], ['σ₃', 'mirror through vertex 3', S(VERT[2])],
];
const mul = (a, b) => [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3]];
const find = (m) => OPS.findIndex((o) => o[2].every((v, i) => Math.abs(v - m[i]) < 1e-9));
const TABLE = OPS.map((g) => OPS.map((h) => find(mul(g[2], h[2]))));

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 300, label: 'An equilateral triangle after two symmetry operations, and the multiplication table of the group' });
  let g = 1, h = 3;
  const ctl = row(host);
  choice(ctl, 'First h', OPS.map((o, i) => [i, o[0]]), h, (v) => { h = v; cv.redraw(); });
  const ctl2 = row(host);
  choice(ctl2, 'Then g', OPS.map((o, i) => [i, o[0]]), g, (v) => { g = v; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Symmetries of a triangle: g·h means h first', col);
    const narrow = W < 520, cx = narrow ? W * 0.27 : W * 0.25, cy = H * 0.55, rad = Math.min(W * 0.2, H * 0.32);
    const m = mul(OPS[g][2], OPS[h][2]), k = find(m);
    // fixed outline and the moved labels
    const P = VERT.map((a) => [Math.cos(a), Math.sin(a)]);
    const px = ([x, y]) => [cx + rad * x, cy - rad * y];
    line(ctx, [...P, P[0]].map(px), col.line, 2);
    // mirror line of the result, if it is a reflection
    if (k >= 3) { const a = VERT[k - 3]; line(ctx, [px([-1.15 * Math.cos(a), -1.15 * Math.sin(a)]), px([1.15 * Math.cos(a), 1.15 * Math.sin(a)])], col.s[3], 1.5, [5, 4]); }
    P.forEach((p, i) => {
      const q = [m[0] * p[0] + m[1] * p[1], m[2] * p[0] + m[3] * p[1]], [x, y] = px(q);
      dot(ctx, x, y, 13, col.s[i], col.panel);
      text(ctx, String(i + 1), x, y, { color: col.panel, size: 13, weight: 700, align: 'center', fit: false });
    });
    text(ctx, 'labels show where each corner went', cx, cy + rad + 22, { color: col.muted, size: 11, align: 'center' });
    // multiplication table: row g, column h
    const t0x = narrow ? W * 0.52 : W * 0.5, t0y = 44, cw = Math.min((W - t0x - 10) / 7, 40), ch = Math.min((H - t0y - 10) / 7, 34);
    ctx.save(); ctx.font = '600 12px system-ui';
    for (let i = 0; i < 6; i++) {
      text(ctx, OPS[i][0], t0x + (i + 1.5) * cw, t0y + ch / 2, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false });
      text(ctx, OPS[i][0], t0x + cw / 2, t0y + (i + 1.5) * ch, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false });
      for (let j = 0; j < 6; j++) {
        const x = t0x + (j + 1) * cw, y = t0y + (i + 1) * ch, on = i === g && j === h;
        ctx.fillStyle = on ? col.s[0] : (i === g || j === h) ? col.soft : col.panel;
        ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
        text(ctx, OPS[TABLE[i][j]][0], x + cw / 2, y + ch / 2, { color: on ? col.panel : col.ink, size: 12, align: 'center', fit: false });
      }
    }
    ctx.restore();
    text(ctx, 'row g, column h', t0x + 4 * cw, t0y + 7 * ch + 12, { color: col.muted, size: 11, align: 'center' });
    out.innerHTML = `h = <b>${OPS[h][0]}</b> (${OPS[h][1]}), then g = <b>${OPS[g][0]}</b> (${OPS[g][1]}): the result is g·h = <b>${OPS[k][0]}</b> (${OPS[k][1]}). ${TABLE[g][h] === TABLE[h][g] ? 'Here h·g gives the same.' : `But h·g = <b>${OPS[TABLE[h][g]][0]}</b>: the group is not abelian.`}`;
  };
  cv.redraw();
}
