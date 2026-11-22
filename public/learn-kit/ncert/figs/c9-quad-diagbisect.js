// Class 9 Quadrilaterals: the diagonals of a parallelogram bisect each other at O, which is the centre of a half-turn
// symmetry. Turn a copy of the parallelogram about O: after 180 degrees it lands exactly on the original.
import { canvas, text, title, row, slider, readout, dot } from '../../kit.js';
import { note } from './c9-quad-lib.js';

export default function (host) {
  let lean = 55, turn = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A parallelogram and a copy turned about the meeting point of its diagonals' });
  const ctl = row(host);
  slider(ctl, { label: 'Shape of parallelogram', min: 25, max: 90, step: 1, value: lean, fmt: (v) => v + '°', oninput: (v) => { lean = v; sync(); } });
  slider(ctl, { label: 'Turn the copy about O', min: 0, max: 180, step: 1, value: turn, fmt: (v) => v + '°', oninput: (v) => { turn = v; sync(); } });
  const out = readout(host);
  const sync = () => { out.innerHTML = turn >= 179.5 ? 'After a half-turn (180°) the copy sits exactly on the original. Every point goes to the opposite point through O, so A goes to C, and B goes to D: that is why OA = OC and OB = OD.' : 'Slide the turn to 180° and watch where A, B, C and D go. Then change the shape and try again.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Half-turn symmetry of a parallelogram', col), cx = w / 2, cy = top + (h - top - 40) / 2 + 4, k = Math.min((w / 2 - 34) / 2.3, (h - top - 70) / 2.4);
    const th = (lean * Math.PI) / 180, a = [1.25 * k, 0], b = [0.75 * k * Math.cos(th) + 0.3 * k, -0.75 * k * Math.sin(th)];
    const u = [a[0], a[1]], v = [b[0], b[1]];
    const pts = [[cx - u[0] - v[0], cy - u[1] - v[1]], [cx + u[0] - v[0], cy + u[1] - v[1]], [cx + u[0] + v[0], cy + u[1] + v[1]], [cx - u[0] + v[0], cy - u[1] + v[1]]];
    const rot = (p, t) => { const dx = p[0] - cx, dy = p[1] - cy, c = Math.cos(t), s = Math.sin(t); return [cx + dx * c - dy * s, cy + dx * s + dy * c]; };
    const poly = (ps, fill, stroke, al, lw) => { ctx.beginPath(); ps.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.globalAlpha = al; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); };
    const t = (turn * Math.PI) / 180, cp = pts.map((p) => rot(p, t));
    poly(pts, col.s[0], col.s[0], 0.2, 3);
    poly(cp, col.s[1], col.s[1], 0.2, 2.5);
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    [[0, 2], [1, 3]].forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke(); }); ctx.setLineDash([]);
    dot(ctx, cx, cy, 5, col.s[3], col.ink); text(ctx, 'O', cx + 10, cy - 10, { color: col.ink, size: 13, weight: 700, halo: col.panel });
    pts.forEach((p, i) => { const dx = p[0] - cx, dy = p[1] - cy, L = Math.hypot(dx, dy) || 1; text(ctx, 'ABCD'[i], p[0] + (dx / L) * 14, p[1] + (dy / L) * 14, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
      if (turn > 0) { const q = cp[i], dx2 = q[0] - cx, dy2 = q[1] - cy, L2 = Math.hypot(dx2, dy2) || 1; text(ctx, "ABCD"[i] + "'", q[0] + (dx2 / L2) * 14, q[1] + (dy2 / L2) * 14, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); } });
    note(ctx, 'The parallelogram and a turned copy (its corners carry a dash). Dashed lines: the diagonals, both cut in half by O.', w, h, col);
  };
  sync();
}
