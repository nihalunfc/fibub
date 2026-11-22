// 12.3 Cutting documents into chunks: a 700-word document, chunk size 300, overlap 50.
// Steps: the document, chunk 1 (words 1 to 300), chunk 2 (251 to 550, sharing 50), chunk 3 (501 to 700), the count.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const N = 700, CH = [[0, 300], [250, 550], [500, 700]];
const T = ['A document of 700 words', 'Chunk 1: words 1 to 300', 'Chunk 2 starts 250 words later', 'Chunk 3: words 501 to 700', '3 chunks in all'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 280, min: 210, label: 'A 700-word document cut into three overlapping chunks of up to 300 words' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, T[step], col);
    const L = 14, R = w - 14, X = (v) => L + (v / N) * (R - L), y0 = 46, bh = 22;
    ctx.fillStyle = col.soft; ctx.fillRect(L, y0, R - L, bh);
    for (let v = 0; v <= N; v += 100) { ctx.fillStyle = col.muted; ctx.fillRect(X(v), y0 + bh, 1, 5); text(ctx, String(v), X(v), y0 + bh + 14, { color: col.muted, size: 10.5, align: 'center' }); }
    text(ctx, 'words', R, y0 - 8, { color: col.muted, size: 11, align: 'right' });
    const shown = Math.min(step, 3);
    for (let i = 0; i < shown; i++) {
      const [a, b] = CH[i], y = y0 + 52 + i * (bh + 10), grow = i === shown - 1 && step <= 3 ? e : 1;
      ctx.fillStyle = col.s[i]; ctx.fillRect(X(a), y, (X(b) - X(a)) * grow, bh);
      if (grow > 0.6) {
        const lab = `chunk ${i + 1}: ${b - a} words`;
        ctx.font = '700 11.5px system-ui,sans-serif';
        const fits = ctx.measureText(lab).width + 12 <= X(b) - X(a);
        // a label too long for its bar goes just left of it, in ink
        text(ctx, lab, fits ? X(a) + 6 : X(a) - 6, y + bh / 2, { color: fits ? '#fff' : col.ink, size: 11.5, weight: 700, align: fits ? 'left' : 'right' });
      }
      if (i > 0 && grow >= 1) {
        // mark the shared 50 words on the document strip, with dashed guides down to both chunks
        ctx.fillStyle = col.ink; ctx.globalAlpha = 0.35; ctx.fillRect(X(a), y0, X(a + 50) - X(a), bh); ctx.globalAlpha = 1;
        ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
        for (const gx of [X(a), X(a + 50)]) { ctx.beginPath(); ctx.moveTo(gx + 0.5, y0 + bh + 30); ctx.lineTo(gx + 0.5, y + bh + 2); ctx.stroke(); }
        ctx.restore();
      }
    }
    if (step >= 2 && step < 4) text(ctx, 'dark band: 50 words in two chunks (the overlap)', L, h - 12, { color: col.muted, size: 11.5 });
    if (step === 4) text(ctx, '(700 − 50) ÷ (300 − 50) = 2.6, rounded up: 3', L, h - 12, { color: col.ink, size: 12, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
