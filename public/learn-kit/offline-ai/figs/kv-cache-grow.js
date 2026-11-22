// 8.4 The KV cache: Llama 3.1 8B at about 4.8 bits (4.8 GB of weights) on a 12 GB graphics card. The cache costs
// 128 KB per token at 16 bits (1 GB per 8,192 tokens). Steps: weights only; 8K context; 32K; 64K (over the card);
// 64K with an 8-bit cache (half), which fits again.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const CARD = 12, WGT = 4.8, ENG = 1;
const ST = [[0, 2, 'Weights and engine only'], [8192, 2, '8,192 tokens at 16 bits: +1 GB'], [32768, 2, '32,768 tokens: +4 GB'], [65536, 2, '65,536 tokens: +8 GB, too much'], [65536, 1, 'Same 65,536 tokens with an 8-bit cache: +4 GB']];
export default function (host) {
  const cv = canvas(host, { aspect: 0.56, max: 300, min: 230, label: 'A stacked memory bar: model weights plus a KV cache that grows with the context, against a 12 GB card' });
  let step = 0, k = 1, from = 0;
  const kvOf = (s) => (ST[s][0] * 2 * 32 * 8 * 128 * ST[s][1]) / 1024 ** 3;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k), L = 12, R = w - 20, max = 15, y = h * 0.42, bh = 40;
    const X = (gb) => L + ((R - L) * gb) / max;
    const kv = from + (kvOf(step) - from) * e, total = WGT + ENG + kv, over = total > CARD;
    title(ctx, ST[step][2], col);
    ctx.fillStyle = col.soft; ctx.fillRect(L, y, R - L, bh);
    ctx.fillStyle = col.s[0]; ctx.fillRect(L, y, X(WGT) - L, bh);
    ctx.fillStyle = col.s[7] || col.muted; ctx.fillRect(X(WGT), y, X(WGT + ENG) - X(WGT), bh);
    ctx.fillStyle = over ? col.bad || col.s[5] : col.s[2]; ctx.fillRect(X(WGT + ENG), y, X(total) - X(WGT + ENG), bh);
    text(ctx, 'weights 4.8', L + 4, y + bh / 2, { color: col.panel, size: 11, weight: 700 });
    const cx = X(CARD);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(cx, y - 22); ctx.lineTo(cx, y + bh + 12); ctx.stroke(); ctx.restore();
    text(ctx, '12 GB card', cx, y - 30, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    text(ctx, `engine 1 GB · KV cache ${kv.toFixed(1)} GB · total ${total.toFixed(1)} GB`, L, y + bh + 26, { color: col.ink, size: 12, weight: 600 });
    text(ctx, over ? 'Does not fit: the app crashes or spills into slow memory' : 'Fits on the card', L, y + bh + 46, { color: over ? col.bad || col.ink : col.muted, size: 11.5, weight: 600 });
    text(ctx, 'cache per token = 2 × 32 layers × 8 heads × 128 × bytes', L, h - 12, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { from = kvOf(step); step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
