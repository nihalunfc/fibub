// 15.1 Batching: four people's answers as lanes over 12 weight reads. One at a time, then four sharing each read,
// then continuous batching (Ben leaves, Eve joins), then the memory each seat's KV cache takes. Made-up numbers.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const NAMES = ['Ana', 'Ben', 'Chen', 'Dev'];
const HEAD = ['Batch 1: one answer per read', 'Batch 4: one read, four tokens', 'Ben finishes, Eve takes his seat', 'Each seat needs its own KV cache'];
const RATE = ['40 tokens/s in total', '≈ 140 tokens/s in total', '≈ 140 tokens/s in total', 'more seats, more memory'];
const COLS = 12;

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 230, label: 'Lanes for four answers sharing each read of the model weights' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.9); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, HEAD[step], col);
    const L = 44, R = w - 10, top = 40, lane = Math.min(26, (h - top - 70) / 4), cw = (R - L) / COLS;
    const shown = Math.ceil(COLS * (step === 3 ? 1 : e));
    text(ctx, 'each column = one read of all 8 GB of weights', L, top - 8, { color: col.muted, size: 10.5 });
    NAMES.forEach((nm, i) => {
      const y = top + i * (lane + 6);
      text(ctx, nm, 6, y + lane / 2, { color: col.ink, size: 11.5, weight: 600 });
      for (let c = 0; c < COLS; c++) {
        const x = L + c * cw;
        ctx.strokeStyle = col.line; ctx.strokeRect(x + 1.5, y + 0.5, cw - 3, lane - 1);
        if (c >= shown) continue;
        let fill = null;
        if (step === 0) fill = i === 0 ? col.s[0] : null;
        else if (i === 1 && step >= 2 && c >= 5) fill = col.s[4];
        else fill = col.s[i];
        if (fill) { ctx.fillStyle = fill; ctx.fillRect(x + 2, y + 1, cw - 4, lane - 2); }
      }
      if (step === 0 && i > 0) text(ctx, 'waiting in the queue', L + 8, y + lane / 2, { color: col.muted, size: 11 });
      if (step >= 2 && i === 1) text(ctx, 'Eve joins', L + 5 * cw + 6, y + lane / 2, { color: col.ink, size: 11, weight: 700, fit: false });
    });
    const by = top + 4 * (lane + 6) + 6;
    if (step === 3) {
      const full = R - L, sc = full / 16;
      ctx.fillStyle = col.muted; ctx.fillRect(L, by, 8 * sc, 18);
      text(ctx, 'weights 8 GB', L + 4, by + 9, { color: col.panel, size: 11, weight: 700 });
      for (let i = 0; i < 4; i++) { ctx.fillStyle = col.s[i]; ctx.fillRect(L + (8 + i * 1.5) * sc * 1, by, 1.5 * sc * e, 18); }
      text(ctx, '+ a KV cache per seat', L + 14 * sc, by + 30, { color: col.ink, size: 11, align: 'right' });
    } else {
      text(ctx, RATE[step], L, by + 10, { color: col.ink, size: 12.5, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
