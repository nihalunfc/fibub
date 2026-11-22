// 2.4 Attention: the token "it" looks back at "cat", "mat" and "the". Steps: the question, match scores,
// softmax shares (arcs get thicker), the blend, then the stored keys and values (KV cache).
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const W = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it'];
const LOOK = { 1: 2, 5: 1, 4: 0 };
const EX = { 1: Math.exp(2), 5: Math.exp(1), 4: 1 }, TOT = EX[1] + EX[5] + EX[4];

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 330, min: 210, label: 'The word "it" attending to earlier words, most of all to "cat"' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, ['"it" asks: who am I about?', 'Compare with each label', 'Softmax: shares of attention', 'Blend the notes', 'Keep keys and values: the KV cache'][step], col);
    const y = h * 0.7, gap = (w - 20) / W.length, X = (i) => 10 + gap * (i + 0.5);
    W.forEach((t, i) => {
      const it = i === 7, on = i in LOOK;
      ctx.fillStyle = it ? col.s[0] : step === 4 ? col.s[2] : col.soft;
      ctx.fillRect(X(i) - gap / 2 + 2, y - 13, gap - 4, 26);
      text(ctx, t, X(i), y, { color: it || step === 4 ? '#fff' : on && step >= 1 ? col.ink : col.muted, size: Math.min(12, gap / 4.5), weight: 600, align: 'center', fit: false });
    });
    if (step >= 1 && step <= 3) {
      for (const [i, s] of Object.entries(LOOK)) {
        const x0 = X(7), x1 = X(+i), share = EX[i] / TOT;
        const lw = step === 1 ? 2 : 1 + 14 * share * (step === 2 ? e : 1);
        ctx.save(); ctx.strokeStyle = col.s[1]; ctx.globalAlpha = 0.85; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(x0, y - 14); ctx.quadraticCurveTo((x0 + x1) / 2, y - 14 - (x0 - x1) * 0.45 * (step === 1 ? e : 1), x1, y - 14); ctx.stroke(); ctx.restore();
        const lab = step === 1 ? `score ${s}` : `${Math.round(share * 100)}%`;
        text(ctx, lab, x1, y + (+i === 4 ? 46 : 28), { color: col.ink, size: 11.5, weight: 700, align: 'center' });
      }
    }
    if (step === 3) text(ctx, '"it" now carries mostly the meaning of "cat"', w / 2, h - 8, { color: col.muted, size: 11.5, align: 'center' });
    if (step === 4) text(ctx, 'every word\'s key and value stays in memory', w / 2, y + 30, { color: col.muted, size: 11.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
