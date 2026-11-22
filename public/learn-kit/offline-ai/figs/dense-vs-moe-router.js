// 2.5 Mixture-of-Experts: a router sends one token to 2 of 8 experts. Steps: the token arrives, router
// scores, top 2 chosen (0.6 and 0.4), blend, then the next token picks different experts.
import { canvas, title, text, arrow, loop, calm, ease } from '../../kit.js';

const SC = [0.2, 0.5, 2.4, 1.1, 0.3, 2.0, 0.9, 0.1];
const PICK = [[2, 0.6], [5, 0.4]], NEXT = [0, 4];

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 230, label: 'A router choosing 2 of 8 experts for one token' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, ['A token arrives', 'The router scores 8 experts', 'Only the top 2 run', 'Mix their results 60 : 40', 'Next token: a different pair'][step], col);
    const gap = (w - 20) / 8, ey = h * 0.62, X = (i) => 10 + gap * (i + 0.5);
    const tok = step === 4 ? 'next token' : 'token " 7"';
    const ty = 54;
    ctx.fillStyle = col.s[0]; ctx.fillRect(w / 2 - 50, ty - 13, 100, 26);
    text(ctx, tok, w / 2, ty, { color: '#fff', size: 12, weight: 700, align: 'center' });
    const chosen = step === 4 ? NEXT : step >= 2 ? PICK.map((p) => p[0]) : [];
    for (let i = 0; i < 8; i++) {
      const on = chosen.includes(i);
      ctx.fillStyle = on ? col.s[1] : col.soft;
      ctx.globalAlpha = step >= 2 && !on ? 0.5 : 1;
      ctx.fillRect(X(i) - gap / 2 + 3, ey - 18, gap - 6, 36);
      ctx.globalAlpha = 1;
      text(ctx, `E${i + 1}`, X(i), ey, { color: on ? '#fff' : col.ink, size: 12, weight: 700, align: 'center', fit: false });
      if (step === 1) {
        const bh = 34 * SC[i] / 2.4 * e;
        ctx.fillStyle = col.s[2]; ctx.fillRect(X(i) - 6, ey - 24 - bh, 12, bh);
      }
      if (on && step >= 2) arrow(ctx, w / 2, ty + 14, X(i), ey - 20, col.ink, 1.5, 7);
    }
    if (step >= 2 && step <= 3) PICK.forEach(([i, s]) => text(ctx, `${s}`, X(i), ey + 32, { color: col.ink, size: 12, weight: 700, align: 'center' }));
    if (step === 3) text(ctx, '2 of 8 experts read from memory', w / 2, h - 12, { color: col.muted, size: 11.5, align: 'center' });
    if (step === 4) text(ctx, 'all 8 must stay in memory', w / 2, h - 12, { color: col.muted, size: 11.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
