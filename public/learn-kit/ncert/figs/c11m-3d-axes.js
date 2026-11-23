// Class 11 Maths, Three-dimensional Geometry: coordinates of a point. A point P(x, y, z) is reached by walking x along the x-axis, y parallel to the y-axis, z up.
// x is the signed distance from the YZ-plane, y from the ZX-plane and z from the XY-plane. The signs of (x, y, z) name the octant. OP = sqrt(x² + y² + z²).
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export const OCT = [['I', 1, 1, 1], ['II', -1, 1, 1], ['III', -1, -1, 1], ['IV', 1, -1, 1], ['V', 1, 1, -1], ['VI', -1, 1, -1], ['VII', -1, -1, -1], ['VIII', 1, -1, -1]];
export default function (host) {
  const q = { x: 3, y: 2, z: 2 };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A point in three dimensions with its three coordinates and its octant' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.6, pitch: 0.45 });
  [['x', 'x (right)'], ['y', 'y (into screen)'], ['z', 'z (up)']].forEach(([n, l]) => slider(ctl, { label: l, min: -4, max: 4, step: 1, value: q[n], fmt: (t) => String(t).replace('-', '−'), oninput: (t) => { q[n] = t; cv.redraw(); } }));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Point P(x, y, z) in space', col); v.fit(w, h, top + 6); v.axes(ctx, col);
    const { x, y, z } = q, P = v.P(x, y, z), D = (a, b, c) => v.P(a, b, c);
    line(ctx, [D(0, 0, 0), D(x, 0, 0)], col.s[0], 2.6); line(ctx, [D(x, 0, 0), D(x, y, 0)], col.s[1], 2.6); line(ctx, [D(x, y, 0), P], col.s[2], 2.6);
    [[D(x, 0, 0), D(x, 0, z)], [D(0, y, 0), D(x, y, 0)], [D(0, 0, z), D(x, 0, z)], [D(x, 0, z), P], [D(0, y, z), P], [D(0, 0, z), D(0, y, z)], [D(0, y, 0), D(0, y, z)]].forEach(([a, b]) => line(ctx, [a, b], col.muted, 1, [3, 3]));
    line(ctx, [D(0, 0, 0), P], col.ink, 1.8, [6, 3]);
    dot(ctx, P[0], P[1], 6, col.ink, col.panel);
    text(ctx, `P(${x}, ${y}, ${z})`.replace(/-(?=\d)/g, '−'), P[0] + 9, P[1] - 9, { color: col.ink, size: 12, weight: 800, halo: col.panel });
    [[D(x, 0, 0), 'x = ' + x, col.s[0]], [D(x, y, 0), 'y = ' + y, col.s[1]], [D(x, y, z / 2), 'z = ' + z, col.s[2]]].forEach(([p, s, c]) => text(ctx, s.replace('-', '−'), p[0] + 7, p[1] + 12, { color: c, size: 11, weight: 700, halo: col.panel }));
  };
  const upd = () => {
    const { x, y, z } = q, oc = x && y && z ? OCT.find((o) => o[1] === Math.sign(x) && o[2] === Math.sign(y) && o[3] === Math.sign(z)) : null;
    ro.innerHTML = `P(${x}, ${y}, ${z}): ${oc ? `octant <b>${oc[0]}</b> (signs ${oc.slice(1).map((s) => (s > 0 ? '+' : '−')).join(' ')})` : '<b>on a coordinate plane or axis</b> (a zero coordinate)'}. Distances from the planes: XY-plane ${Math.abs(z)}, YZ-plane ${Math.abs(x)}, ZX-plane ${Math.abs(y)}. OP = √(${x * x} + ${y * y} + ${z * z}) = <b>${Math.sqrt(x * x + y * y + z * z).toFixed(2)}</b>.`.replace(/-(?=\d)/g, '−');
  };
  const draw0 = cv.draw; cv.draw = (a, b, c, d) => { upd(); draw0(a, b, c, d); };
  cv.redraw();
}
