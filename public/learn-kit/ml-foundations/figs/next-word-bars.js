// 10.3 Predicting the next word: the bigram probability of "the cat sat", one word at a time. Each new word's
// probability is a bar; the running product (the sentence's probability) shrinks below. Last step: "flew"
// never follows "cat", so the whole sentence gets 0.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const W = [['the', 12, 14, 'start'], ['cat', 4, 20, 'the'], ['sat', 1, 5, 'cat']];
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 250, label: 'Bars for the probability of each next word and of the sentence so far' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const L = 96, R = w - 24, bh = 20, e = ease(k);
    const words = step < 4 ? W.slice(0, Math.min(3, step + 1)) : [W[0], W[1], ['flew', 0, 5, 'cat']];
    // sentence so far
    title(ctx, 'Sentence: ' + words.map((x) => x[0]).join(' '), col);
    let prod = 1;
    words.forEach(([wd, a, b, prev], i) => {
      const y = 50 + i * 44, p = a / b, t = i === words.length - 1 && step < 3 ? e : 1;
      prod *= p;
      text(ctx, `P(${wd} | ${prev})`, 10, y + bh / 2, { color: col.ink, size: 11.5, weight: 600 });
      ctx.fillStyle = col.soft; ctx.fillRect(L, y, R - L, bh);
      ctx.fillStyle = wd === 'flew' ? col.bad || col.s[5] : col.s[0]; ctx.fillRect(L, y, (R - L) * p * t, bh);
      text(ctx, `${a}/${b} = ${(p).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`, L + 6, y + bh + 10, { color: col.muted, size: 11 });
    });
    if (step >= 3) {
      const y = h - 54, t = step === 3 ? e : 1;
      text(ctx, 'P(sentence)', 10, y + bh / 2, { color: col.ink, size: 11.5, weight: 700 });
      ctx.fillStyle = col.soft; ctx.fillRect(L, y, R - L, bh);
      ctx.fillStyle = col.s[2]; ctx.fillRect(L, y, (R - L) * prod * t, bh);
      text(ctx, step === 3 ? '0.857 × 0.2 × 0.2 = 0.034' : '0.857 × 0.2 × 0 = 0: one unseen pair kills the sentence', L + 6, y + bh + 11, { color: col.ink, size: 11.5, weight: 600 });
    }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
