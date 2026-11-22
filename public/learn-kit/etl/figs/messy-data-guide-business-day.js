// 2.3 Watch it happen: six restaurant orders around midnight, first split by calendar date (midnight), then
// by business date (05:00 cut-off). The two late-night orders move to the 14th and the totals change.
import { canvas, axes, text, title, dot, line, calm, ease, loop } from '../../kit.js';

// hours after 14 Sep 00:00
const ORD = [[19.5, 42], [21.75, 28], [23.6, 35], [25.4, 22], [28.2, 18], [29.3, 31]];
const CUT = 29; // 05:00 on the 15th
export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 300, min: 230, label: 'Orders on a time line split by midnight and by a 05:00 cut-off' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.8); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, step < 2 ? 'Split at midnight (calendar date)' : 'Split at 05:00 (business date)', col);
    const lab = (v) => String(Math.round(v) % 24).padStart(2, '0') + ':00';
    const A = axes(ctx, w, h, col, { x: [18, 31], y: [0, 1], xt: [18, 21, 24, 27, 30], fx: lab, yt: [], fy: () => '', l: 12, r: 14, t: 72, b: 38, grid: false });
    const split = step < 2 ? 24 : 24 + (CUT - 24) * (step === 2 ? ease(k) : 1);
    const yy = A.Y(0.4);
    ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = col.s[0]; ctx.fillRect(A.X(18), A.T, A.X(split) - A.X(18), A.B - A.T);
    ctx.fillStyle = col.s[1]; ctx.fillRect(A.X(split), A.T, A.X(31) - A.X(split), A.B - A.T); ctx.restore();
    line(ctx, [[A.X(split), A.T], [A.X(split), A.B]], col.ink, 2, [5, 4]);
    text(ctx, step < 2 ? 'midnight' : '05:00 cut-off', A.X(split), A.T - 8, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const shown = step === 0 ? 0 : 6;
    let a = 0, b = 0;
    ORD.forEach(([t, v], i) => {
      if (i >= shown && step > 0) return;
      const first = t < split;
      if (first) a += v; else b += v;
      dot(ctx, A.X(t), yy, 6, first ? col.s[0] : col.s[1]);
      text(ctx, '$' + v, A.X(t), yy - 16 - (i % 2) * 12, { color: col.ink, size: 10.5, align: 'center' });
    });
    if (step === 0) text(ctx, 'Six orders, 19:30 on the 14th to 05:18 on the 15th.', 10, 40, { color: col.ink, size: 12 });
    else {
      text(ctx, `14th: $${a}`, 10, 40, { color: col.s[0], size: 13, weight: 700 });
      text(ctx, `15th: $${b}`, 10, 58, { color: col.s[1], size: 13, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
