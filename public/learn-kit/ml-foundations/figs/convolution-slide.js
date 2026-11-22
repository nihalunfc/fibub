// 9.6 Watch it happen: the edge filter [1, 0, −1] slides along a strip of pixels 0 0 0 9 9 (dark to bright).
import { canvas, text, title, ease, loop, calm } from '../../kit.js';

const STRIP = [0, 0, 0, 9, 9], KER = [1, 0, -1], OUT = [0, -9, -9];
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 280, min: 240, label: 'A three-weight filter sliding along five pixels and the feature map it makes' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const pos = Math.min(step, 2), done = step >= 3;
    title(ctx, done ? 'The feature map lights up at the edge' : `Position ${pos + 1}: multiply and add`, col);
    const cell = Math.min(52, (w - 120) / 5), L = 100, y0 = 50;
    const box = (x, y, v, fill, ink, bold) => {
      ctx.fillStyle = fill; ctx.fillRect(x, y, cell - 4, cell - 4);
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, cell - 5, cell - 5);
      text(ctx, String(v), x + (cell - 4) / 2, y + (cell - 4) / 2, { color: ink, size: 14, weight: bold ? 800 : 600, align: 'center', fit: false });
    };
    text(ctx, 'pixels', 8, y0 + cell / 2, { color: col.muted, size: 11.5 });
    STRIP.forEach((v, i) => box(L + i * cell, y0, v, v ? col.panel : col.ink, v ? col.ink : col.panel));
    if (!done) {
      // filter window under the strip, sliding in
      const prev = Math.max(0, pos - 1), x = L + (prev + (pos - prev) * ease(k)) * cell;
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.strokeRect(x - 2, y0 - 2, cell * 3, cell);
      text(ctx, 'filter', 8, y0 + cell * 1.5 + 4, { color: col.s[0], size: 11.5, weight: 700 });
      KER.forEach((v, i) => box(x + i * cell, y0 + cell + 6, v, col.soft, col.s[0], true));
      const terms = KER.map((kv, i) => `${STRIP[pos + i]}×${kv < 0 ? '(' + kv + ')' : kv}`).join(' + ');
      text(ctx, `${terms} = ${OUT[pos]}`, 10, y0 + 2 * cell + 26, { color: col.ink, size: 12.5, weight: 600 });
    }
    const yo = done ? y0 + cell + 30 : y0 + 2 * cell + 62;
    text(ctx, 'feature map', 8, yo + cell / 2 - (done ? 0 : 12), { color: col.muted, size: 11.5 });
    if (done) OUT.forEach((v, i) => box(L + (i + 1) * cell, yo, v, v ? col.s[1] : col.soft, v ? '#fff' : col.ink, true));
    else for (let i = 0; i <= pos; i++) text(ctx, String(OUT[i]), L + (i + 1) * cell + (cell - 4) / 2, yo, { color: OUT[i] ? col.s[1] : col.muted, size: 14, weight: 800, align: 'center', fit: false });
    if (done) text(ctx, 'Zero on the flat part; strong where dark turns to bright.', 10, h - 14, { color: col.ink, size: 11.5, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
