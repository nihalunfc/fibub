// 4.1 Percent as "out of 100": a 10 × 10 grid. Step 1 shades p%, step 2 raises by a%, step 3 lowers the NEW amount by b%.
// data-p, data-a, data-b set the numbers; used as a step player (<div class="steps" data-fig="percent-grid">).
import { canvas, text } from '../../kit.js';

export default function (host) {
  const ds = host.parentElement?.dataset || {};
  const p = Number(ds.p || 40), a = Number(ds.a || 25), b = Number(ds.b || 20);
  const cv = canvas(host, { aspect: 0.55, max: 300, min: 220, label: 'A grid of 100 squares showing a percent' });
  let k = 0;
  const vals = () => [100, 100 * (1 + a / 100), 100 * (1 + a / 100) * (1 - b / 100)];
  cv.draw = (ctx, w, h, col) => {
    const sz = Math.min((h - 60) / 10, (w / 2 - 30) / 10), x0 = 18, y0 = 36;
    const shade = k === 0 ? p : 100;
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(i / 10), c = i % 10;
      ctx.fillStyle = i < shade ? col.s[0] : col.panel; ctx.globalAlpha = i < shade ? 0.55 : 1;
      ctx.fillRect(x0 + c * sz, y0 + r * sz, sz - 2, sz - 2); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.line; ctx.strokeRect(x0 + c * sz, y0 + r * sz, sz - 2, sz - 2);
    }
    text(ctx, k === 0 ? `${p} of 100 squares = ${p}%` : 'the original price = 100 squares', x0, 18, { color: col.ink, size: 12, weight: 700 });
    if (k > 0) {
      const v = vals(), bx = w / 2 + 20, bw = w / 2 - 40, max = Math.max(...v);
      const show = k === 1 ? [0, 1] : [0, 1, 2];
      show.forEach((j, n) => {
        const y = 50 + n * 46, len = (v[j] / max) * bw;
        ctx.fillStyle = col.s[j]; ctx.globalAlpha = 0.6; ctx.fillRect(bx, y, len, 26); ctx.globalAlpha = 1;
        text(ctx, ['start: 100', `+${a}%: ${+v[1].toFixed(2)}`, `−${b}% of that: ${+v[2].toFixed(2)}`][j], bx + 4, y + 13, { color: col.ink, size: 12, weight: 700, halo: true });
      });
    }
  };
  cv.redraw();
  return { step(i) { k = Math.min(i, 2); cv.redraw(); } };
}
