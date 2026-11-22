// 14.2 LoRA: a frozen 4,096 × 4,096 grid W, the thin trained strips B (4,096 × 16) and A (16 × 4,096),
// the share they make up, then the whole Llama 3.1 8B adapter (84 MB) against the 16 GB model.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const HEAD = ['W: 16,777,216 frozen numbers', 'B: 4,096 × 16 = 65,536 trained', 'A: 16 × 4,096 = 65,536 trained', 'B and A: 0.78% of W', 'Whole model: 84 MB adapter, 16 GB model'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 230, label: 'A large frozen weight grid with two thin trained strips beside it, and the adapter size against the model size' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.7); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, HEAD[step], col);
    if (step === 4) {
      const L = 70, R = w - 70, y1 = h * 0.38, y2 = h * 0.62, full = R - L;
      text(ctx, 'Model', 10, y1 + 13, { color: col.ink, size: 12, weight: 600 });
      ctx.fillStyle = col.muted; ctx.fillRect(L, y1, full * e, 26);
      text(ctx, '16 GB', L + full * e + 6, y1 + 13, { color: col.ink, size: 12, weight: 700 });
      text(ctx, 'Adapter', 10, y2 + 13, { color: col.ink, size: 12, weight: 600 });
      ctx.fillStyle = col.s[1]; ctx.fillRect(L, y2, Math.max(2, full * 0.084 / 16), 26);
      text(ctx, '84 MB (0.5%)', L + 10, y2 + 13, { color: col.ink, size: 12, weight: 700 });
      text(ctx, '41.9 million trained numbers across 32 layers × 7 grids', w / 2, h - 16, { color: col.muted, size: 11, align: 'center' });
      return;
    }
    const S = Math.min(h - 96, w * 0.5), x0 = Math.max(16, (w - S - 40) / 2 - 10), y0 = 40, t = 14;
    ctx.fillStyle = col.soft; ctx.fillRect(x0, y0, S, S);
    ctx.strokeStyle = col.line; ctx.strokeRect(x0 + 0.5, y0 + 0.5, S - 1, S - 1);
    text(ctx, 'W (frozen)', x0 + S / 2, y0 + S / 2, { color: col.muted, size: 13, weight: 700, align: 'center' });
    text(ctx, '4,096 × 4,096', x0 + S / 2, y0 + S / 2 + 18, { color: col.muted, size: 11, align: 'center' });
    if (step >= 1) {
      const g = step === 1 ? e : 1;
      ctx.fillStyle = col.s[1]; ctx.fillRect(x0 + S + 12, y0, t, S * g);
      text(ctx, 'B', x0 + S + 12 + t / 2, y0 + S + 12, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    }
    if (step >= 2) {
      const g = step === 2 ? e : 1;
      ctx.fillStyle = col.s[2]; ctx.fillRect(x0, y0 + S + 12, S * g, t);
      text(ctx, 'A', x0 - 10, y0 + S + 12 + t / 2, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    }
    if (step === 3) {
      const tx = Math.min(w - 8, x0 + S + 40);
      text(ctx, '131,072 trained', tx, y0 + 20, { color: col.ink, size: 12, weight: 700 });
      text(ctx, '÷ 16,777,216', tx, y0 + 38, { color: col.ink, size: 12 });
      text(ctx, '= 0.78%', tx, y0 + 56, { color: col.ink, size: 14, weight: 700 });
    }
    text(ctx, 'strips drawn wider than scale (r = 16 is 0.4% of 4,096)', 10, h - 10, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
