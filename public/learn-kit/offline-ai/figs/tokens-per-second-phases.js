// 3.5 Tokens per second: a timeline of one request. 8,000 input tokens read in 16 s (prefill), the first
// token, then 300 output tokens at 12 per second (25 s of decode). Total 41 s.
import { canvas, title, text, line, loop, calm, ease } from '../../kit.js';

const PRE = 16, DEC = 25, TOT = PRE + DEC;

export default function (host) {
  const cv = canvas(host, { aspect: 0.48, max: 290, min: 190, label: 'Timeline: 16 seconds of prefill, then 25 seconds of decode' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 1.2); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, ['You press Enter: 8,000 tokens to read', 'Prefill: reading at 500 tokens/s', 'First token after 16 s', 'Decode: writing at 12 tokens/s', 'Total: 41 seconds'][step], col);
    const L = 14, R = w - 14, sc = (R - L) / TOT, y = h * 0.5, bh = 30;
    line(ctx, [[L, y + bh + 8], [R, y + bh + 8]], col.line, 1);
    [0, 10, 20, 30, 40].forEach((t) => text(ctx, `${t} s`, L + t * sc, y + bh + 20, { color: col.muted, size: 10.5, align: 'center' }));
    if (step === 0) text(ctx, 'waiting… 8,000 input tokens queued', L, y + bh / 2, { color: col.muted, size: 12 });
    const pre = step === 0 ? 0 : step === 1 ? PRE * e : PRE;
    ctx.fillStyle = col.s[0]; ctx.fillRect(L, y, pre * sc, bh);
    if (pre > 6) text(ctx, 'prefill (reading)', L + 6, y + bh / 2, { color: '#fff', size: 11.5, weight: 700 });
    if (step >= 2) {
      line(ctx, [[L + PRE * sc, y - 14], [L + PRE * sc, y + bh]], col.ink, 2);
      text(ctx, 'first token', L + PRE * sc, y - 22, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    }
    const dec = step < 3 ? 0 : step === 3 ? DEC * e : DEC;
    if (dec > 0) {
      ctx.fillStyle = col.s[1];
      const n = Math.floor(dec * 12 / 10);           // one tick per 10 tokens
      for (let i = 0; i < n; i++) ctx.fillRect(L + PRE * sc + (i * 10 / 12) * sc, y + 4, Math.max(1.5, (10 / 12) * sc - 1.5), bh - 8);
      if (dec > 10) text(ctx, `decode: ${Math.round(dec * 12)} tokens`, L + PRE * sc + 6, y - 6 + (step === 3 ? 0 : 0) - 0, { color: col.s[1], size: 11, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
