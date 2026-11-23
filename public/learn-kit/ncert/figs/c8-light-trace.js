// Class 8 Light (step player): drawing the image in a concave mirror with two easy rays. The object is beyond C. A ray parallel to
// the axis reflects through F; a ray through F reflects parallel to the axis. Where the two reflected rays meet is the top of the
// image: real, inverted and smaller, between F and C. Numbers: f = 50, C at 100, object 150 from the mirror, image at 75 (1/v = 1/f - 1/u).
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

const TITLES = ['The set-up', 'Ray 1: parallel to the axis', 'Ray 2: through the focus', 'Where the rays meet', 'The image: real, inverted, smaller'];
const along = (pts, p) => { const L = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])), T = L.reduce((a, b) => a + b, 0); let d = p * T; for (let i = 0; i < L.length; i++) { if (d <= L[i]) return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * d / L[i], pts[i][1] + (pts[i + 1][1] - pts[i][1]) * d / L[i]]; d -= L[i]; } return pts[pts.length - 1]; };
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Drawing the image formed by a concave mirror using two rays' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[step], col);
    const cy = h * 0.55, mx = w - 26, s = (w - 56) / 160, F = mx - 50 * s, C = mx - 100 * s, ox = mx - 150 * s, oh = 30 * s, ix = mx - 75 * s, ih = 15 * s, R = 100 * s;
    const mt = (y) => C + Math.sqrt(Math.max(0, R * R - (y - cy) ** 2));
    line(ctx, [[8, cy], [w - 8, cy]], col.muted, 1, [4, 4]);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(C, cy, R, -0.55, 0.55); ctx.stroke(); ctx.restore();
    [[mx, 'P', col.ink], [F, 'F', col.s[3]], [C, 'C', col.muted]].forEach(([x, l, c]) => { dot(ctx, x, cy, 3.5, c); text(ctx, l, x, cy - 13, { color: c, size: 11, weight: 700, align: 'center' }); });
    arrow(ctx, ox, cy, ox, cy - oh, col.s[1], 4, 9); text(ctx, 'object', ox, cy + 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    const ty = cy - oh, tip = [ix, cy + ih], p = Math.min(1, (t % 3.2) / 2.2);
    const r1 = [[ox, ty], [mt(ty), ty], tip], r2 = [[ox, ty], [mt(cy + ih), cy + ih], tip];
    if (step >= 1) { line(ctx, r1, col.s[0], 2); text(ctx, '1', ox + (mx - ox) * 0.4, ty - 9, { color: col.s[0], size: 11, weight: 700, align: 'center' }); }
    if (step >= 2) { line(ctx, r2, col.s[2], 2); text(ctx, '2', ox + (mx - ox) * 0.3, ty + (cy + ih - ty) * 0.28 + 12, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    if (step === 1) { const q = along(r1, p); dot(ctx, q[0], q[1], 4.5, col.s[0], col.ink); }
    if (step === 2) { const q = along(r2, p); dot(ctx, q[0], q[1], 4.5, col.s[2], col.ink); }
    if (step >= 3) { dot(ctx, tip[0], tip[1], 6, col.warn, col.ink); if (step === 3) text(ctx, 'rays meet here', tip[0] - 10, tip[1] + 18, { color: col.warn, size: 10.5, weight: 700, align: 'right' }); }
    if (step >= 4) { arrow(ctx, ix, cy, ix, cy + ih, col.warn, 4, 9); text(ctx, 'image', ix + 8, cy + ih + 16, { color: col.warn, size: 10.5, weight: 700 }); text(ctx, 'real, upside down, smaller', w / 2, h - 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
