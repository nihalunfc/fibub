// Class 9 Coordinates: reflecting a point in the x-axis (y changes sign), the y-axis (x changes sign) or the origin (both change sign).
import { canvas, text, title, row, choice, slider, readout, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(v).replace('-', '−');
export default function (host) {
  let a = 3, b = 2, m = 'x';
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A point and its mirror image in the x-axis, the y-axis or the origin' });
  const top = row(host); choice(top, 'Mirror', [['x', 'x-axis'], ['y', 'y-axis'], ['o', 'Origin']], m, (v) => { m = v; upd(); });
  const ctl = row(host);
  slider(ctl, { label: 'x', min: -5, max: 5, step: 1, value: a, fmt: num, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'y', min: -5, max: 5, step: 1, value: b, fmt: num, oninput: (v) => { b = v; upd(); } });
  const out = readout(host);
  const img = () => (m === 'x' ? [a, -b] : m === 'y' ? [-a, b] : [-a, -b]);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Reflection in the ' + (m === 'o' ? 'origin' : m + '-axis'), col), g = plane(ctx, w, h, col, { top: t + 6, x0: -6, x1: 6, y0: -6, y1: 6 }), I = img();
    ctx.save(); ctx.setLineDash([5, 4]); line(ctx, [[g.X(a), g.Y(b)], [g.X(I[0]), g.Y(I[1])]], col.s[0], 2); ctx.restore();
    dot(ctx, g.X(a), g.Y(b), 7, col.s[2], col.ink); dot(ctx, g.X(I[0]), g.Y(I[1]), 7, col.s[3], col.ink);
    text(ctx, 'P (' + num(a) + ', ' + num(b) + ')', g.X(a), g.Y(b) - 14, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'P′ (' + num(I[0]) + ', ' + num(I[1]) + ')', g.X(I[0]), g.Y(I[1]) + (I[1] === b && I[0] !== a ? -14 : 15), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  function upd() { const I = img(); out.innerHTML = `P(${num(a)}, ${num(b)}) goes to P′(${num(I[0])}, ${num(I[1])}). ` + (m === 'x' ? 'Mirror in the x-axis: <b>x stays, y changes sign</b>.' : m === 'y' ? 'Mirror in the y-axis: <b>y stays, x changes sign</b>.' : 'Reflection in the origin: <b>both signs change</b> (a half-turn about O).'); cv.redraw(); }
  upd();
}
