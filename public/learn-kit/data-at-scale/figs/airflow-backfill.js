// 3.5 Watch it happen: a 4-day backfill of a 3-task DAG with max_active_runs=2, then a rerun of one day.
// Because the last task deletes that day's rows before inserting, the rerun leaves the row count unchanged.
import { canvas, text, title, ease, loop, calm } from '../../kit.js';

const rr = (ctx, x, y, w, h, r = 4) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
const DAYS = ['1 Nov', '2 Nov', '3 Nov', '4 Nov'], TASKS = ['wait', 'spark', 'mart'], ROWS = [1040, 980, 1110, 1005];
const CAP = ['Backfill asked for 1 to 4 Nov', 'Two runs at a time: 1 and 2 Nov', 'Then 3 and 4 Nov', 'Rerun 2 Nov: delete its rows, insert again', 'Same rows as before: safe to rerun'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 320, min: 250, label: 'A grid of DAG runs by date turning green during a backfill' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 1.1); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, CAP[step], col);
    const L = 58, T = 58, cellW = Math.min(64, (w - L - 92) / 3), cellH = Math.min(30, (h - T - 44) / 4 - 6), e = ease(k);
    TASKS.forEach((t, j) => text(ctx, t, L + j * (cellW + 6) + cellW / 2, T - 14, { color: col.muted, size: 11, align: 'center', weight: 600 }));
    text(ctx, 'rows', L + 3 * (cellW + 6) + 34, T - 14, { color: col.muted, size: 11, align: 'center', weight: 600 });
    DAYS.forEach((d, i) => {
      const y = T + i * (cellH + 6);
      text(ctx, d, 8, y + cellH / 2, { color: col.ink, size: 11.5, weight: 600 });
      const active = (step === 1 && i < 2) || (step === 2 && i >= 2) || (step === 3 && i === 1);
      const doneBefore = (step >= 2 && i < 2) || step >= 3 || (step === 4);
      TASKS.forEach((_, j) => {
        const x = L + j * (cellW + 6);
        let fill = col.soft, prog = 0;
        if (active) { prog = Math.max(0, Math.min(1, e * 3 - j)); }
        const done = (doneBefore && !(step === 3 && i === 1)) || prog >= 1;
        ctx.fillStyle = col.panel; ctx.strokeStyle = col.line; ctx.lineWidth = 1; rr(ctx, x, y, cellW, cellH); ctx.fill(); ctx.stroke();
        if (done || prog > 0) { ctx.fillStyle = col.good || col.s[2]; ctx.globalAlpha = done ? 0.9 : 0.5; rr(ctx, x, y, cellW * (done ? 1 : prog), cellH); ctx.fill(); ctx.globalAlpha = 1; }
        void fill;
      });
      const shown = (doneBefore && !(step === 3 && i === 1)) || (active && e > 0.95);
      text(ctx, shown ? ROWS[i].toLocaleString('en-CA') : '–', L + 3 * (cellW + 6) + 34, y + cellH / 2, { color: col.ink, size: 12, weight: 700, align: 'center' });
    });
    const foot = step >= 3 ? 'Append instead of delete-then-insert would show 1,960 rows for 2 Nov.' : 'Each run only touches its own date: {{ ds }}.';
    text(ctx, foot, 8, h - 16, { color: col.muted, size: 11.5 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
