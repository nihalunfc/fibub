// Class 8 Quadrilaterals (step player): the four angles of any quadrilateral add up to 360 degrees. Tear off the four corners
// and fit them together around one point: they fill the whole circle exactly, which is 360 degrees.
import { canvas, text, title } from '../../kit.js';
import { note, view, shape, wedge } from './c8-lib.js';

const Q = [[1, 1], [9, 2], [8, 6.5], [2, 5.5]];
const ang = (i) => { const p = Q[i], a = Q[(i + 3) % 4], b = Q[(i + 1) % 4]; const u = [a[0] - p[0], a[1] - p[1]], v = [b[0] - p[0], b[1] - p[1]]; return Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))); };
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'Four corners of a quadrilateral fitted together around a point to make a full turn' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angle sum of a quadrilateral', col), A = [0, 1, 2, 3].map(ang), deg = A.map((a) => Math.round((a * 180) / Math.PI));
    const split = s >= 2, V = view(w, split ? (h - top) * 0.5 + top : h - 50, top, 10, 7, 4);
    shape(ctx, V, Q, col.s[0], col.ink, 0.1, 2.5);
    Q.forEach((p, i) => { text(ctx, 'ABCD'[i], V.X(p[0]) + (i === 0 || i === 3 ? -12 : 12), V.Y(p[1]) + (i < 2 ? 8 : -8), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); });
    if (s >= 1) { const n = Q.length; for (let i = 0; i < n; i++) wedge(ctx, V, Q[i], Q[(i + 1) % n], Q[(i + n - 1) % n], col.s[[0, 1, 2, 4][i]], 15, 4); }
    if (s >= 1) text(ctx, s >= 4 ? `${deg.join('° + ')}° = 360°` : deg.map((d, i) => 'ABCD'[i] + '=' + d + '°').join('  '), w / 2, V.Y(0) + 14, { color: s >= 4 ? col.s[2] : col.muted, size: s >= 4 ? 14 : 10.5, weight: s >= 4 ? 700 : 400, align: 'center' });
    if (split) {
      const cx = w / 2, cy = top + (h - top) * 0.7, R = Math.min(56, (h - top) * 0.18); let a0 = -Math.PI / 2;
      const full = s >= 3;
      A.forEach((a, i) => {
        const tx = full ? 0 : [-1, 1, 1, -1][i] * R * 1.1 * (s === 2 ? 1.5 : 0), ty = full ? 0 : [-1, -1, 1, 1][i] * R * 0.5 * (s === 2 ? 1.5 : 0);
        ctx.fillStyle = col.s[[0, 1, 2, 4][i]]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(cx + tx, cy + ty);
        const st = full ? a0 : -Math.PI / 2 - a / 2; ctx.arc(cx + tx, cy + ty, R, st, st + a); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke();
        if (full) { const m = a0 + a / 2; text(ctx, 'ABCD'[i], cx + Math.cos(m) * R * 0.62, cy + Math.sin(m) * R * 0.62, { color: col.panel, size: 12, weight: 700, align: 'center' }); a0 += a; }
      });
      
    }
    note(ctx, ['Any quadrilateral ABCD (here a lopsided one).', 'Mark its four angles. They are all different sizes.', 'Tear off the four corners (shown pulled apart).', 'Fit the corners together with their points touching at one spot. They fit all the way round with no gap.', 'A full turn is 360°, so the four angles add up to 360°. A diagonal gives the same answer: two triangles, 2 × 180°.'][Math.min(s, 4)], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
