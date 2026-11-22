// 3.1 What a token is: "The unbelievably fast model." split into 7 tokens. Steps: the text, common words,
// the rare word split into pieces, pieces become (made-up) ID numbers, then the count.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const TOK = ['The', ' un', 'believ', 'ably', ' fast', ' model', '.'];
const COMMON = [0, 4, 5, 6], RARE = [1, 2, 3];
const IDS = [791, 653, 21940, 2881, 4062, 1843, 13];

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 200, label: 'The sentence "The unbelievably fast model." cut into seven tokens' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, ['The text: 4 words, 28 characters', 'Common words are one token each', 'A rare word is built from pieces', 'Each piece becomes a number', '7 tokens; 28 characters ÷ 4 = 7'][step], col);
    const size = Math.max(10, Math.min(15, w / 30));
    if (step === 0) { text(ctx, 'The unbelievably fast model.', w / 2, h * 0.48, { color: col.ink, size: size + 3, weight: 600, align: 'center' }); return; }
    ctx.font = `600 ${size}px system-ui,sans-serif`;
    const widths = TOK.map((t) => ctx.measureText(t.replace(' ', '␣')).width + 12);
    const gapX = step === 0 ? 0 : 6 * e, total = widths.reduce((a, b) => a + b, 0) + gapX * 6;
    let x = Math.max(8, (w - total) / 2);
    const y = h * 0.48;
    TOK.forEach((t, i) => {
      const cw = widths[i], isC = COMMON.includes(i), isR = RARE.includes(i);
      let fill = col.soft, ink = col.ink;
      if (step >= 1 && isC) { fill = col.s[0]; ink = '#fff'; }
      if (step >= 2 && isR) { fill = col.s[1]; ink = '#fff'; }
      if (step === 0) { fill = col.panel; }
      ctx.fillStyle = fill; ctx.fillRect(x, y - 16, cw, 32);
      if (step > 0) { ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y - 15.5, cw - 1, 31); }
      text(ctx, step === 0 ? t : t.replace(' ', '␣'), x + cw / 2, y, { color: ink, size, weight: 600, align: 'center', fit: false });
      if (step >= 3) text(ctx, IDS[i].toLocaleString('en-CA'), x + cw / 2, y + 30, { color: col.muted, size: 11, weight: 600, align: 'center', fit: false });
      x += cw + gapX;
    });
    if (step >= 1) text(ctx, '␣ marks the space that belongs to the token', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
