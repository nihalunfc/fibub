// 1.2 The test day as a timeline: the three written papers back to back, Speaking on the same day or up to a week apart.
import { canvas, text } from '../../kit.js';

const ROWS = [
  ['Listening', '30 min, then 10 to copy answers (2 on computer)', 0, 40],
  ['Reading', '60 min, no extra time', 40, 60],
  ['Writing', '60 min: Task 1 about 20, Task 2 about 40', 100, 60],
  ['Speaking', '11 to 14 min, same day or within about a week', 165, 14],
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 300, min: 250, label: 'Timeline of the IELTS papers: Listening, Reading and Writing back to back, then Speaking' });
  cv.draw = (ctx, w, h, col) => {
    const x0 = 12, x1 = w - 12, sx = (x1 - x0) / 180, rh = (h - 40) / 4;
    text(ctx, 'Minutes from the start', x0, h - 10, { color: col.muted, size: 11 });
    ROWS.forEach(([name, note, start, len], i) => {
      const y = 14 + i * rh;
      text(ctx, name, x0, y + 6, { color: col.ink, size: 13, weight: 700 });
      text(ctx, note, x0, y + 23, { color: col.muted, size: 11 });
      ctx.fillStyle = col.s[i];
      ctx.fillRect(x0 + start * sx, y + 34, Math.max(4, len * sx), 12);
      if (i === 3) { ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(x0 + 160 * sx, y + 40); ctx.lineTo(x0 + 165 * sx, y + 40); ctx.stroke(); ctx.setLineDash([]); }
    });
  };
  cv.redraw();
}
