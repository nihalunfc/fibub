// Class 9 Rotation (step player): from fractions of a turn to degrees. One full turn is 360 degrees, so a fraction
// p/q of a turn is p/q x 360 degrees. Shown for 1/4, 1/2, 3/4, 1 and then 1/8 (half of a quarter).
import { canvas, text, title, arrow, dot } from '../../kit.js';

const S = [
  { f: 0, d: 0, t: 'Start: the arm points along the start line. 0 turn = 0°.' },
  { f: 0.25, d: 90, t: '¼ turn: 360 ÷ 4 = 90°. A right angle.' },
  { f: 0.5, d: 180, t: '½ turn: 360 ÷ 2 = 180°. A straight line.' },
  { f: 0.75, d: 270, t: '¾ turn: 3 × 90 = 270°.' },
  { f: 1, d: 360, t: '1 full turn = 360°. Back where we began.' },
  { f: 0.125, d: 45, t: 'Cut a quarter in half: ⅛ turn = 360 ÷ 8 = 45°.' },
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Fractions of a turn drawn as angles of 90, 180, 270, 360 and 45 degrees' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fraction of a turn → degrees', col), cx = w / 2, cy = top + (h - top - 40) / 2 + 6, R = Math.min(w / 2 - 28, (h - top - 40) / 2 - 12), q = S[s], th = (q.d * Math.PI) / 180;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, 0, -th, true); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R, cy); ctx.stroke(); ctx.setLineDash([]);
    arrow(ctx, cx, cy, cx + Math.cos(th) * R, cy - Math.sin(th) * R, col.s[2], 4, 10);
    dot(ctx, cx, cy, 5, col.ink);
    text(ctx, q.d + '°', cx, cy + R * 0.45, { color: col.s[0], size: 16, weight: 700, align: 'center', halo: col.panel });
    text(ctx, q.t, w / 2, h - 18, { color: col.ink, size: 12, align: 'center', weight: 600 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, S.length - 1); cv.redraw(); } };
}
