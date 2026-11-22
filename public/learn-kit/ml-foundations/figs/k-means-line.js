// 8.1 Watch it happen: k-means with k = 2 on six points on a line (1, 2, 3, 10, 11, 12), centres starting
// badly at 1 and 2. Steps: start, assign, update, assign, update, done.
import { canvas, text, title, dot, line, lerp, ease, loop, calm } from '../../kit.js';

const PTS = [1, 2, 3, 10, 11, 12];
const POS = [[1, 2], [1, 2], [1, 7.6], [1, 7.6], [2, 11], [2, 11]];
const BORDER = [null, 1.5, null, 4.3, null, 6.5];
const TITLES = ['Start: two centres, badly placed', 'Assign: each point to the nearer centre', 'Update: centres move to their points\' average',
  'Assign again: three points switch', 'Update again', 'Assign: nothing changes, so stop'];
const NOTES = ['Centres at 1 and 2.', 'Border halfway, at 1.5. Centre 2 gets five points.', 'Centre 2: (2+3+10+11+12) ÷ 5 = 7.6',
  'New border at (1 + 7.6) ÷ 2 = 4.3', 'Centres: 2 and 11', 'Inertia 2 + 2 = 4, its lowest'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.48, max: 250, min: 210, label: 'k-means moving two centres along a line of six points' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.9); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[step], col);
    const L = 22, R = w - 22, y = h * 0.6, X = (v) => L + (v / 13) * (R - L);
    line(ctx, [[L, y], [R, y]], col.muted, 1);
    for (let v = 0; v <= 13; v++) text(ctx, String(v), X(v), y + 14, { color: col.muted, size: 10, align: 'center' });
    // border used for the colours: the last assign step so far
    let b = null; for (let i = step; i >= 0; i--) if (BORDER[i] != null) { b = BORDER[i]; break; }
    if (BORDER[step] != null) line(ctx, [[X(BORDER[step]), y - 44], [X(BORDER[step]), y + 4]], col.muted, 1.5, [4, 4]);
    for (const p of PTS) dot(ctx, X(p), y, 6, b == null ? col.muted : p < b ? col.s[0] : col.s[1]);
    const prev = POS[Math.max(0, step - 1)], cur = POS[step], e = ease(k);
    cur.forEach((c, j) => {
      const v = lerp(prev[j], c, e), cx = X(v), cy = y - 30;
      ctx.beginPath(); ctx.moveTo(cx, cy + 9); ctx.lineTo(cx - 8, cy - 5); ctx.lineTo(cx + 8, cy - 5); ctx.closePath();
      ctx.fillStyle = col.s[j]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
      text(ctx, 'centre ' + (j + 1) + ' = ' + (+v.toFixed(1)), cx, cy - 16 - j * 0, { color: col.s[j], size: 11, weight: 700, align: 'center', halo: col.panel });
    });
    text(ctx, NOTES[step], 10, h - 12, { color: col.ink, size: 12, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
