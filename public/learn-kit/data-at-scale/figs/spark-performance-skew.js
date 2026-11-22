// 2.3 Watch it happen: skew and salting. Eight tasks of one stage; the "online store" key holds most rows, so one
// task runs 240 s while the rest take about 30 s. Salting splits the hot key into four pieces, then a small second
// aggregation adds the pieces back together.
import { canvas, text, title, line, ease, loop, calm } from '../../kit.js';

const rr = (ctx, x, y, w, h, r = 3) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
const EVEN = [32, 28, 35, 30, 27, 33, 31, 29];
const SKEW = [240, 28, 35, 30, 27, 33, 31, 29];
const SALT = [62, 58, 64, 60, 28, 35, 30, 27, 33, 31, 29];
const CAP = ['What you hope for: even tasks', 'Skew: one key, one giant task', 'Salting: split the hot key into 4', 'Then add the 4 pieces back up'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 340, min: 260, label: 'Task duration bars for a Spark stage before and after salting a skewed key' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.8); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, CAP[step], col);
    const data = step === 0 ? EVEN : step === 1 ? SKEW : SALT;
    const L = 64, R = w - 14, T = 44, B = h - 50, X = (s) => L + (s / 250) * (R - L);
    for (const s of [0, 60, 120, 180, 240]) { line(ctx, [[X(s), T - 4], [X(s), B]], col.line, 1); text(ctx, s + ' s', X(s), B + 11, { color: col.muted, size: 10.5, align: 'center' }); }
    const rowH = (B - T) / (data.length + (step === 3 ? 1 : 0)), e = ease(k);
    data.forEach((d, i) => {
      const y = T + i * rowH, hot = (step === 1 && i === 0) || (step >= 2 && i < 4);
      text(ctx, step >= 2 && i < 4 ? `online#${i}` : step >= 1 && i === 0 ? 'online' : `store ${i + (step >= 2 ? -3 : 1)}`, L - 6, y + rowH / 2, { color: hot ? col.bad : col.muted, size: 10, align: 'right' });
      ctx.fillStyle = hot ? col.s[1] : col.s[0];
      rr(ctx, L, y + 2, (X(d) - L) * (step === 3 ? 1 : e), Math.max(4, rowH - 5)); ctx.fill();
    });
    if (step === 3) {
      const y = T + data.length * rowH;
      text(ctx, 'combine', L - 6, y + rowH / 2, { color: col.ink, size: 10, align: 'right', weight: 600 });
      ctx.fillStyle = col.ink; rr(ctx, X(64), y + 2, (X(6) - L) * e, Math.max(4, rowH - 5)); ctx.fill();
    }
    const total = step === 0 ? 35 : step === 1 ? 240 : step === 2 ? 64 : 70;
    text(ctx, `Stage takes as long as its slowest task: about ${total} s`, 8, h - 14, { color: col.ink, size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
