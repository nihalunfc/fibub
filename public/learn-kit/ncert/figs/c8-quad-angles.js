// Class 8 Quadrilaterals: angles of a parallelogram. Neighbouring angles sit between the same pair of parallel lines, so they
// add up to 180 degrees; opposite angles are equal. Slide angle A and read all four angles. A cross-check shows the sum is 360.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { view, shape, wedge } from './c8-lib.js';

export default function (host) {
  let a = 65;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 270, label: 'A parallelogram whose angle A you can change' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Angle A', min: 30, max: 150, step: 1, value: a, fmt: (v) => Math.round(v) + '°', oninput: (v) => { a = Math.round(v); sync(); } });
  function sync() { out.innerHTML = `A = ${a}°, B = ${180 - a}°, C = ${a}°, D = ${180 - a}°. Neighbours: ${a} + ${180 - a} = 180. All four: 2 × ${a} + 2 × ${180 - a} = <b>360°</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angles of a parallelogram', col), r = (a * Math.PI) / 180, W = 6, S = 3, hh = S * Math.sin(r), sx = S * Math.cos(r), V = view(w, h, top, 11, 5, 14);
    const ox = 2 - Math.min(0, sx), A = [ox, 0.5], B = [ox + W, 0.5], C = [ox + W + sx, 0.5 + hh], D = [ox + sx, 0.5 + hh], P = [A, B, C, D];
    shape(ctx, V, P, col.s[0], col.ink, 0.18, 3);
    [A, B, C, D].forEach((p, i) => { const q = P[(i + 1) % 4], z = P[(i + 3) % 4]; wedge(ctx, V, p, q, z, col.s[[0, 3, 0, 3][i]], 18, 4);
      const cxm = (A[0] + C[0]) / 2, cym = (A[1] + C[1]) / 2, dx = p[0] - cxm, dy = p[1] - cym, l = Math.hypot(dx, dy) || 1;
      text(ctx, ['A ', 'B ', 'C ', 'D '][i] + (i % 2 ? 180 - a : a) + '°', V.X(p[0]) + (dx / l) * 34, V.Y(p[1]) - (dy / l) * 30, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); });
  };
  sync();
}
