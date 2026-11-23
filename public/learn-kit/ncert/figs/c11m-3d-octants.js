// Class 11 Maths, Three-dimensional Geometry: the three coordinate planes cut space into eight octants. Pick one to see its shaded corner and the signs of x, y, z in it.
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';
import { OCT } from './c11m-3d-axes.js';

export default function (host) {
  let o = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'The eight octants of space, one shaded at a time' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Octant', OCT.map((t, i) => [i, t[0]]), o, (i) => { o = i; cv.redraw(); });
  const v = view3d(cv, ctl, { span: 5, yaw: 0.6, pitch: 0.5 });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The eight octants', col); v.fit(w, h, top + 6); v.axes(ctx, col);
    const [nm, sx, sy, sz] = OCT[o], L = 4, P = (a, b, c) => v.P(a * sx, b * sy, c * sz);
    const face = (pts, c) => { ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = c; ctx.beginPath(); pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.fill(); ctx.restore(); };
    face([P(0, 0, 0), P(L, 0, 0), P(L, L, 0), P(0, L, 0)], col.s[2]); face([P(0, 0, 0), P(L, 0, 0), P(L, 0, L), P(0, 0, L)], col.s[1]); face([P(0, 0, 0), P(0, L, 0), P(0, L, L), P(0, 0, L)], col.s[0]);
    const E = [[[0, 0, 0], [L, 0, 0]], [[0, 0, 0], [0, L, 0]], [[0, 0, 0], [0, 0, L]], [[L, 0, 0], [L, L, 0]], [[L, 0, 0], [L, 0, L]], [[0, L, 0], [L, L, 0]], [[0, L, 0], [0, L, L]], [[0, 0, L], [L, 0, L]], [[0, 0, L], [0, L, L]], [[L, L, 0], [L, L, L]], [[L, 0, L], [L, L, L]], [[0, L, L], [L, L, L]]];
    E.forEach(([a, b]) => line(ctx, [P(...a), P(...b)], col.s[3], 1.8, [5, 3]));
    const m = P(L * 0.75, L * 0.75, L * 0.75); text(ctx, nm, m[0], m[1], { color: col.ink, size: 18, weight: 800, align: 'center', halo: col.panel });
    ro.innerHTML = `Octant <b>${nm}</b>: x is ${sx > 0 ? 'positive' : 'negative'}, y is ${sy > 0 ? 'positive' : 'negative'}, z is ${sz > 0 ? 'positive' : 'negative'}. Example point: (${sx * 2}, ${sy * 3}, ${sz * 1})`.replace(/-(?=\d)/g, '−') + '. Turn the view to see the shaded corner from every side.';
  };
  cv.redraw();
}
