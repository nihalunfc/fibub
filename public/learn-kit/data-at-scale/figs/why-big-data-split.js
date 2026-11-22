// 1.1 Watch it happen: scale out. 12 GB of receipts read by one machine (60 s at 200 MB/s), then split into four
// partitions read by four machines at once, combined, and finally one machine fails and only its chunk is re-read.
import { canvas, text, title, line, ease, loop, calm } from '../../kit.js';

const rr = (ctx, x, y, w, h, r = 4) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
const CAP = ['One machine reads all 12 GB', 'Split into 4 partitions of 3 GB', 'Four machines read at the same time', 'Combine four small results', 'A machine fails: redo only its part'];
const TOTAL = [60, 60, 15, 17, 32];
export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 340, min: 250, label: 'Bars showing how long one machine and four machines take to read 12 GB' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.8); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, CAP[step], col);
    const L = 78, R = w - 16, T = 48, B = h - 46, X = (s) => L + (s / 60) * (R - L);
    // time axis
    for (const s of [0, 15, 30, 45, 60]) { line(ctx, [[X(s), T - 4], [X(s), B]], col.line, 1); text(ctx, s + ' s', X(s), B + 12, { color: col.muted, size: 10.5, align: 'center' }); }
    const e = ease(k), rowH = Math.min(30, (B - T) / 5);
    if (step <= 1) {
      text(ctx, 'Machine 1', 8, T + rowH * 0.5, { color: col.ink, size: 11.5, weight: 600 });
      const pw = (X(60) - L);
      for (let i = 0; i < 4; i++) {
        const gap = step === 1 ? 4 * e : 0;
        ctx.fillStyle = step === 1 ? col.s[i] : col.s[0];
        rr(ctx, L + i * (pw / 4) + gap / 2, T, pw / 4 - gap, rowH - 6); ctx.fill();
        if (step === 1) text(ctx, '3 GB', L + i * (pw / 4) + pw / 8, T + rowH / 2 - 3, { color: '#fff', size: 11, weight: 700, align: 'center' });
      }
      if (step === 0) text(ctx, '12 GB at 200 MB/s', L + pw / 2, T + rowH / 2 - 3, { color: '#fff', size: 11.5, weight: 700, align: 'center' });
    } else {
      for (let i = 0; i < 4; i++) {
        const y = T + i * rowH;
        const failed = step === 4 && i === 2;
        text(ctx, 'Machine ' + (i + 1), 8, y + rowH * 0.5 - 3, { color: failed ? col.bad : col.ink, size: 11.5, weight: 600 });
        const grow = step === 2 ? e : 1;
        ctx.fillStyle = col.s[i]; ctx.globalAlpha = failed ? 0.3 : 1;
        rr(ctx, L, y, (X(failed ? 7.5 : 15) - L) * grow, rowH - 6); ctx.fill(); ctx.globalAlpha = 1;
        if (failed) text(ctx, '✕ failed', X(7.5) + 6, y + rowH / 2 - 3, { color: col.bad, size: 11, weight: 700 });
        if (step === 4 && i === 3) { ctx.fillStyle = col.s[2]; rr(ctx, X(17), y, (X(15) - L) * e, rowH - 6); ctx.fill(); text(ctx, 'redo 3', X(17) + 6, y + rowH / 2 - 3, { color: '#fff', size: 10.5, weight: 700 }); }
      }
      if (step >= 3) {
        const y = T + 4 * rowH;
        text(ctx, 'Combine', 8, y + rowH * 0.5 - 3, { color: col.ink, size: 11.5, weight: 600 });
        const at = step === 4 ? 32 : 15;
        ctx.fillStyle = col.ink; rr(ctx, X(at), y, (X(2) - L) * (step === 3 ? e : 1), rowH - 6); ctx.fill();
      }
    }
    text(ctx, `Finished after about ${TOTAL[step]} s`, 8, h - 14, { color: col.ink, size: 12.5, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
