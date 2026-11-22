// 5.6 A process diagram you walk through: in a step player (data-fig="process-steps") each step lights one stage
// of making glass bottles from recycled glass and shows the sentence a Task 1 report would use for it.
import { canvas, text, arrow, colors } from '../../kit.js';

const STAGES = ['Collection', 'Sorting by colour', 'Washing', 'Crushing', 'Melting (1,500 °C)', 'Moulding', 'New bottles'];
export default function (host) {
  let at = -1;
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'A seven-stage process: collection, sorting, washing, crushing, melting, moulding, new bottles', mark: 'br' });
  cv.draw = (ctx, w, h, col) => {
    const cols = w < 520 ? 2 : 4, rows = Math.ceil(STAGES.length / cols);
    const bw = (w - 30 - (cols - 1) * 26) / cols, bh = Math.min(54, (h - 30 - (rows - 1) * 26) / rows);
    const pos = STAGES.map((_, i) => { const r = Math.floor(i / cols), c = r % 2 ? cols - 1 - (i % cols) : i % cols; return [15 + c * (bw + 26), 15 + r * (bh + 26)]; });
    for (let i = 0; i < STAGES.length; i++) {
      const [x, y] = pos[i], on = i === at, done = i < at;
      ctx.fillStyle = on ? col.s[0] : done ? col.soft : col.panel; ctx.strokeStyle = on ? col.s[0] : col.muted; ctx.lineWidth = on ? 2 : 1;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, bw, bh, 8) : ctx.rect(x, y, bw, bh); ctx.fill(); ctx.stroke();
      text(ctx, `${i + 1}. ${STAGES[i]}`, x + bw / 2, y + bh / 2, { color: on ? col.panel : col.ink, size: 12, weight: on ? 700 : 400, align: 'center' });
      if (i < STAGES.length - 1) {
        const [nx, ny] = pos[i + 1];
        if (ny === y) arrow(ctx, nx > x ? x + bw + 3 : x - 3, y + bh / 2, nx > x ? nx - 3 : nx + bw + 3, y + bh / 2, col.muted, 1.5, 7);
        else arrow(ctx, x + bw / 2, y + bh + 3, nx + bw / 2, ny - 3, col.muted, 1.5, 7);
      }
    }
  };
  cv.redraw();
  return { step(i) { at = i; cv.redraw(); } };
}
