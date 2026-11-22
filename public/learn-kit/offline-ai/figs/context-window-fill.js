// 3.3 Context window: an 8,192-token window filling with a 300-token system prompt, 2,500 tokens of chat,
// 1,000 kept for the answer (4,392 left for a document), then a 9,000-token contract that overflows.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const CAP = 8192;
const PARTS = [['system', 300, 0], ['chat so far', 2500, 1], ['answer', 1000, 2]];

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 200, label: 'An 8,192-token context window filling up, then overflowing' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, ['An empty 8,192-token window', 'System prompt: 300', 'Chat so far: 2,500', 'Keep 1,000 for the answer: 4,392 left', 'A 9,000-token contract overflows'][step], col);
    const L = 12, R = w - 12, sc = (R - L) / CAP, top = 62, bh = 44;
    ctx.fillStyle = col.soft; ctx.fillRect(L, top, R - L, bh);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, top, R - L, bh);
    if (step < 4) {
      let x = L;
      PARTS.slice(0, step).forEach(([name, n, c], i) => {
        const ww = n * sc * (i === step - 1 ? e : 1);
        ctx.fillStyle = col.s[c]; ctx.fillRect(x, top, ww, bh);
        text(ctx, `${name} ${n.toLocaleString('en-CA')}`, x + 2, top + bh + 16 + i * 16, { color: col.s[c], size: 11.5, weight: 700 });
        x += ww;
      });
      if (step === 3 && k >= 1) { text(ctx, '4,392', (x + R) / 2, top + bh / 2, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'free for a document (about 3,300 words)', R, top + bh + 64, { color: col.ink, size: 11.5, weight: 700, align: 'right' }); }
    } else {
      // 300 system + 2,500 chat + 9,000 contract + 1,000 answer = 12,800: the oldest 4,608 fall out on the left
      const all = [['system', 300, 0], ['chat', 2500, 1], ['contract', 9000, 3], ['answer', 1000, 2]];
      const over = 300 + 2500 + 9000 + 1000 - CAP, shift = over * sc * e;
      let x = L - shift;
      ctx.save(); ctx.beginPath(); ctx.rect(0, top - 2, w, bh + 4); ctx.clip();
      all.forEach(([name, n, c]) => { ctx.fillStyle = col.s[c]; ctx.globalAlpha = x < L ? 0.35 : 1; ctx.fillRect(x, top, n * sc, bh); ctx.globalAlpha = 1; x += n * sc; });
      ctx.restore();
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, top, R - L, bh);
      if (k >= 1) {
        text(ctx, `${over.toLocaleString('en-CA')} oldest tokens dropped: the system prompt,`, L, top + bh + 18, { color: col.bad || col.ink, size: 11.5, weight: 700 });
        text(ctx, 'the whole chat and the start of the contract', L, top + bh + 34, { color: col.bad || col.ink, size: 11.5, weight: 700 });
      }
    }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
