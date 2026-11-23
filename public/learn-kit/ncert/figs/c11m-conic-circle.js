// Class 11 Maths, Conic Sections: a circle is all points at a fixed distance r from a centre (h, k): (x - h)² + (y - k)² = r².
// Drag the centre or the radius handle; drag the test point to see whether it is inside (distance < r), on (= r) or outside (> r) the circle.
// Expanding gives the general form x² + y² + 2gx + 2fy + c = 0 with centre (-g, -f) and r² = g² + f² - c.
import { canvas, text, title, dot, row, readout, button } from '../../kit.js';
import { world, grid, path, seg, f } from '../c11m-geo.js';
import { drag } from '../c12m-lib.js';

export default function (host) {
  const S = { h: 1, k: 1, r: 3, tx: 3, ty: -2 }; let W = null;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A circle with draggable centre, radius and test point, and its equation' });
  const ro = readout(host), ctl = row(host);
  button(ctl, 'Reset', () => { Object.assign(S, { h: 1, k: 1, r: 3, tx: 3, ty: -2 }); cv.redraw(); });
  const sn = (v) => Math.round(v * 2) / 2;
  drag(cv, () => (W ? [{ x: W.X(S.h), y: W.Y(S.k) }, { x: W.X(S.h + S.r), y: W.Y(S.k) }, { x: W.X(S.tx), y: W.Y(S.ty) }] : []), (i, px, py) => {
    const x = Math.max(-7.5, Math.min(7.5, sn(W.ix(px)))), y = Math.max(-5.5, Math.min(5.5, sn(W.iy(py))));
    if (i === 0) { S.h = x; S.k = y; } else if (i === 1) S.r = Math.max(0.5, Math.min(7, sn(Math.hypot(x - S.h, W.iy(py) - S.k)))); else { S.tx = x; S.ty = y; }
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Circle with centre (h, k) and radius r: drag the dots', col); W = world(w, h, top + 2, [-8, 8], [-6, 6]);
    grid(ctx, W, col, 1);
    const { h: H, k: K, r: R, tx, ty } = S;
    path(ctx, W, (t) => [H + R * Math.cos(t), K + R * Math.sin(t)], 0, 6.2832, 200, col.s[0], 2.6);
    seg(ctx, W, [H, K], [H + R, K], col.s[3], 2, null);
    text(ctx, 'r', W.X(H + R / 2), W.Y(K) - 9, { color: col.s[3], size: 12, weight: 700, align: 'center', halo: col.panel });
    const d = Math.hypot(tx - H, ty - K), ins = d < R - 1e-9 ? 'inside' : d > R + 1e-9 ? 'outside' : 'on the circle';
    seg(ctx, W, [H, K], [tx, ty], col.s[2], 1.4, [4, 3]);
    dot(ctx, W.X(H), W.Y(K), 7, col.s[0], col.panel); dot(ctx, W.X(H + R), W.Y(K), 6, col.s[3], col.panel); dot(ctx, W.X(tx), W.Y(ty), 7, col.s[2], col.panel);
    text(ctx, 'centre', W.X(H) + 9, W.Y(K) + 12, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    text(ctx, 'test point', W.X(tx) + 9, W.Y(ty) + 3, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    const sg = (v) => (v < 0 ? `+ ${f(-v)}` : `− ${f(v)}`);
    ro.innerHTML = `<b>(x ${sg(H)})² + (y ${sg(K)})² = ${f(R * R)}</b>. Expanded: x² + y² ${H ? (-2 * H > 0 ? '+ ' : '− ') + f(Math.abs(2 * H)) + 'x ' : ''}${K ? (-2 * K > 0 ? '+ ' : '− ') + f(Math.abs(2 * K)) + 'y ' : ''}${H * H + K * K - R * R ? (H * H + K * K - R * R > 0 ? '+ ' : '− ') + f(Math.abs(H * H + K * K - R * R)) : '' } = 0. Test point (${f(tx)}, ${f(ty)}): distance from centre ${f(d)} vs r = ${f(R)}: <b>${ins}</b>.`;
  };
  cv.redraw();
}
