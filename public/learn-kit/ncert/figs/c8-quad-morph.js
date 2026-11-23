// Class 8 Quadrilaterals: one slider turns a square into a rectangle, a parallelogram, a rhombus and a trapezium. The base is
// fixed at 8. Change the top length, how far the top slides sideways (shear) and the height, and the name follows the rules.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { view, grid, shape, seg } from './c8-lib.js';

export default function (host) {
  let t = 5, sh = 0, ht = 5;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A four-sided shape whose top length, slant and height you can change' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Top length', min: 2, max: 5, step: 1, value: t, fmt: (v) => v, oninput: (v) => { t = Math.round(v); sync(); } });
  slider(ctl, { label: 'Slide the top', min: -2, max: 4, step: 1, value: sh, fmt: (v) => v, oninput: (v) => { sh = Math.round(v); sync(); } });
  slider(ctl, { label: 'Height', min: 2, max: 6, step: 1, value: ht, fmt: (v) => v, oninput: (v) => { ht = Math.round(v); sync(); } });
  const info = () => {
    const xd = 2 + (5 - t) / 2 + sh, P = [[2, 1], [7, 1], [xd + t, 1 + ht], [xd, 1 + ht]], sA = Math.hypot(xd - 2, ht), sB = Math.hypot(xd + t - 7, ht);
    const par = t === 5, right = xd === 2, iso = Math.abs(sA - sB) < 1e-9, rhomb = Math.abs(sA - 5) < 1e-9;
    let name;
    if (par) name = right && rhomb ? 'a square' : right ? 'a rectangle' : rhomb ? 'a rhombus' : 'a parallelogram';
    else name = iso ? 'an isosceles trapezium' : right || xd + t === 7 ? 'a right trapezium' : 'a trapezium';
    return { P, name, par, sA, sB };
  };
  function sync() { const q = info(); out.innerHTML = `This is <b>${q.name}</b>. ${q.par ? 'Both pairs of opposite sides are parallel (top = base = 5).' : 'Only the top and the base are parallel: one pair.'} Slanting sides: ${q.sA.toFixed(1)} and ${q.sB.toFixed(1)}. Try: top 5, slide 3, height 4 gives a rhombus.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Morph the shape', col), V = view(w, h, top, 12, 8, 8), q = info();
    grid(ctx, V, col); shape(ctx, V, q.P, col.s[q.par ? 2 : 0], col.s[q.par ? 2 : 0], 0.25, 3);
    q.P.forEach((p, i) => text(ctx, 'ABCD'[i], V.X(p[0]) + (i === 0 || i === 3 ? -12 : 12), V.Y(p[1]) + (i < 2 ? 12 : -12), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }));
    seg(ctx, V, q.P[0], q.P[1], col.ink, 3); seg(ctx, V, q.P[3], q.P[2], col.s[3], 3);
  };
  sync();
}
