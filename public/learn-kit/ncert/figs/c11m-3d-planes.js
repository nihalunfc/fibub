// Class 11 Maths, Three-dimensional Geometry: the three coordinate planes. XY-plane is z = 0, YZ-plane is x = 0, ZX-plane is y = 0.
// A point's distance from a coordinate plane is the absolute value of the matching coordinate; its mirror image in the plane flips that one sign.
import { canvas, text, title, line, dot, row, slider, readout, choice } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export default function (host) {
  const q = [3, 2, 2]; let pl = 2;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 330, label: 'A point, a coordinate plane, and the mirror image of the point in that plane' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.65, pitch: 0.5 });
  choice(ctl, 'Plane', [[2, 'XY (z = 0)'], [0, 'YZ (x = 0)'], [1, 'ZX (y = 0)']], pl, (t) => { pl = t; cv.redraw(); });
  ['x', 'y', 'z'].forEach((c, i) => slider(ctl, { label: c, min: -4, max: 4, step: 1, value: q[i], fmt: (t) => String(t).replace('-', '−'), oninput: (t) => { q[i] = t; cv.redraw(); } }));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A coordinate plane and mirror images', col); v.fit(w, h, top + 6); v.axes(ctx, col);
    const L = 4.5, c = [[-L, -L], [L, -L], [L, L], [-L, L]].map(([a, b]) => { const p = [0, 0, 0], k = [0, 1, 2].filter((i) => i !== pl); p[k[0]] = a; p[k[1]] = b; return v.P(...p); });
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath(); c.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.fill(); ctx.restore();
    const M = [...q]; M[pl] = -M[pl]; const F = [...q]; F[pl] = 0;
    const P = v.P(...q), Mi = v.P(...M), Fo = v.P(...F);
    line(ctx, [P, Mi], col.s[3], 1.8, [5, 3]);
    dot(ctx, Fo[0], Fo[1], 4, col.s[3]);
    dot(ctx, P[0], P[1], 6.5, col.s[2], col.panel); dot(ctx, Mi[0], Mi[1], 6.5, col.s[5], col.panel);
    text(ctx, 'P', P[0] + 9, P[1] - 8, { color: col.ink, size: 13, weight: 800, halo: col.panel }); text(ctx, "P′", Mi[0] + 9, Mi[1] - 8, { color: col.ink, size: 13, weight: 800, halo: col.panel });
  };
  const upd = () => {
    const nm = ['YZ-plane (x = 0)', 'ZX-plane (y = 0)', 'XY-plane (z = 0)'][pl], co = 'xyz'[pl];
    const M = [...q]; M[pl] = -M[pl]; const F = [...q]; F[pl] = 0;
    ro.innerHTML = `P(${q.join(', ')}) is <b>${Math.abs(q[pl])}</b> from the ${nm}, the absolute value of ${co}. Foot of the perpendicular: (${F.join(', ')}). Mirror image P′ = <b>(${M.join(', ')})</b>: only ${co} changes sign.`.replace(/-(?=\d)/g, '−');
  };
  const d0 = cv.draw; cv.draw = (a, b, c, d) => { upd(); d0(a, b, c, d); };
  cv.redraw();
}
