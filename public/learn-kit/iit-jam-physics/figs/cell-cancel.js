// 1.6 Why Stokes and Green work: chop the surface into tiny cells. Each cell's circulation is (curl · n) × area. Where
// two cells meet, their shared edge is walked in opposite directions and cancels, so only the outer boundary survives.
// Driven by a step player (step(i)); shows the last stage when used alone.
import { canvas, text, arrow, line, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 240, label: 'A region divided into cells with circulation arrows; the inner edges cancel' });
  let stage = 0;
  const N = 6;
  const inside = (i, j) => { const x = (i + 0.5) / N - 0.5, y = (j + 0.5) / N - 0.5; return (x * x) / 0.25 + (y * y) / 0.2 < 1; };
  cv.draw = (ctx, w, h, col) => {
    const T = ['One tiny cell: circulation = (curl · n) × area', 'Two cells: the shared edge cancels', 'Every cell: all inner edges cancel', 'Only the boundary is left: Stokes / Green'][stage];
    title(ctx, T, col);
    const size = Math.min(w * 0.8, (h - 60) * 1.0) / N, ox = (w - size * N) / 2, oy = 36 + (h - 60 - size * N) / 2;
    const C = (i, j) => [ox + i * size, oy + (N - j) * size];
    const loopCell = (i, j, c, wd = 2) => {
      const g = size * 0.16, [x0, y1] = C(i, j), [x1, y0] = C(i + 1, j + 1);
      arrow(ctx, x0 + g, y1 - g, x1 - g, y1 - g, c, wd, 7); arrow(ctx, x1 - g, y1 - g, x1 - g, y0 + g, c, wd, 7);
      arrow(ctx, x1 - g, y0 + g, x0 + g, y0 + g, c, wd, 7); arrow(ctx, x0 + g, y0 + g, x0 + g, y1 - g, c, wd, 7);
    };
    const cells = []; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (inside(i, j)) cells.push([i, j]);
    for (const [i, j] of cells) { const [x, y] = C(i, j + 1); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x, y, size, size); }
    if (stage === 0) loopCell(2, 3, col.s[0], 2.5);
    if (stage === 1) {
      loopCell(2, 3, col.s[0], 2.5); loopCell(3, 3, col.s[2], 2.5);
      const [x, yTop] = C(3, 4);
      line(ctx, [[x, yTop + 4], [x, yTop + size - 4]], col.s[3], 4);
      text(ctx, 'up + down = 0', x, yTop + size + 14, { color: col.s[3], size: 12, weight: 700, align: 'center', halo: col.panel });
    }
    if (stage === 2) cells.forEach(([i, j]) => loopCell(i, j, col.muted, 1.2));
    if (stage >= 2) {
      const has = (i, j) => i >= 0 && j >= 0 && i < N && j < N && inside(i, j);
      for (const [i, j] of cells) {
        const e = [];
        if (!has(i, j - 1)) e.push([C(i, j), C(i + 1, j)]);
        if (!has(i + 1, j)) e.push([C(i + 1, j), C(i + 1, j + 1)]);
        if (!has(i, j + 1)) e.push([C(i + 1, j + 1), C(i, j + 1)]);
        if (!has(i - 1, j)) e.push([C(i, j + 1), C(i, j)]);
        for (const [[a, b], [c, d]] of e) arrow(ctx, a, b, c, d, col.s[0], stage === 3 ? 3 : 2, 8);
      }
    }
    if (stage === 3) text(ctx, '∮ round the boundary = Σ (curl · n) dA over the inside', w / 2, h - 8, { color: col.ink, size: 12.5, weight: 700, align: 'center', base: 'bottom', halo: col.panel });
  };
  cv.redraw();
  return { step(i) { stage = Math.max(0, Math.min(3, i)); cv.redraw(); } };
}
