// 9.3 llama.cpp: placing layers with -ngl. An 8 GB GGUF with 40 layers (0.2 GB each) and a 6 GB graphics card
// with 1 GB kept for the context. Steps: the stack of 40 layers; set aside 1 GB; fill the card (25 layers);
// the other 15 go to the processor; the setting that does it. A bar under the grid shows the card's 6 GB.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const N = 40, FIT = 25, CARD = 6, CTX = 1, LAYER = 0.2;
export default function (host) {
  const cv = canvas(host, { aspect: 0.74, max: 340, min: 270, label: 'Forty layer blocks, twenty-five on the graphics card and fifteen on the processor, with a bar for the card memory' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 1); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k), heads = ['An 8 GB file = 40 layers of 0.2 GB', 'Card: 6 GB, keep 1 GB for the context', 'Fill the card: 5 GB ÷ 0.2 GB = 25 layers', 'The other 15 layers run on the processor', '-ngl 25 (or -ngl 99: "as many as fit")'];
    const top = title(ctx, heads[step], col) + 8;
    const cols = 10, gap = 4, x0 = 12, bw = (Math.min(w, 520) - 24 - gap * (cols - 1)) / cols, bh = 16;
    const shown = step >= 2 ? (step === 2 ? Math.round(FIT * e) : FIT) : 0;
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / cols), c = i % cols, x = x0 + c * (bw + gap), y = top + r * (bh + gap);
      ctx.fillStyle = i < shown ? col.s[0] : step >= 3 ? col.s[4] : col.soft;
      ctx.fillRect(x, y, bw, bh);
      ctx.strokeStyle = col.line; ctx.strokeRect(x + 0.5, y + 0.5, bw - 1, bh - 1);
    }
    // the graphics card's memory as a bar: layers from the left, context kept on the right
    const by = top + 4 * (bh + gap) + 22, L = x0, R = x0 + cols * (bw + gap) - gap, G = (gb) => L + ((R - L) * gb) / CARD;
    text(ctx, 'graphics card memory: 6 GB', L, by - 9, { color: col.ink, size: 11, weight: 600 });
    ctx.fillStyle = col.soft; ctx.fillRect(L, by, R - L, 18);
    if (step >= 1) { ctx.fillStyle = col.s[2]; ctx.fillRect(G(CARD - CTX), by, G(CARD) - G(CARD - CTX), 18); text(ctx, 'context 1 GB', G(CARD), by + 30, { color: col.ink, size: 10.5, align: 'right' }); }
    if (shown) { ctx.fillStyle = col.s[0]; ctx.fillRect(L, by, G(shown * LAYER) - L, 18); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(L, by, R - L, 18);
    const ly = by + 52;
    text(ctx, `on the card: ${shown} layers (${(shown * LAYER).toFixed(1)} GB)`, L, ly, { color: col.ink, size: 12, weight: 700 });
    if (step >= 3) text(ctx, 'on the processor: 15 layers (3 GB), read more slowly', L, ly + 18, { color: col.ink, size: 12, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
