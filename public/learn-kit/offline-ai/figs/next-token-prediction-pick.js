// 2.1 Next-token prediction: one turn of the loop for "The cat sat on the". Steps: read the tokens,
// scores, softmax chances, a weighted pick, then the chosen token joins the text.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const TOK = [' mat', ' sofa', ' roof', ' moon'], SC = [3, 2, 1, 0];
const EX = SC.map(Math.exp), TOT = EX.reduce((a, b) => a + b, 0), PR = EX.map((v) => v / TOT);
const CTX = ['The', ' cat', ' sat', ' on', ' the'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 240, label: 'Scores and chances for the next token after "The cat sat on the"' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  const chips = (ctx, col, toks, y, hi) => {
    let x = 10;
    ctx.font = '600 12px system-ui,sans-serif';
    toks.forEach((t, i) => {
      const w = ctx.measureText(t.trim()).width + 14;
      ctx.fillStyle = i === hi ? col.s[0] : col.soft; ctx.fillRect(x, y - 11, w, 22);
      text(ctx, t.trim(), x + 7, y, { color: i === hi ? '#fff' : col.ink, size: 12, weight: 600, fit: false });
      x += w + 5;
    });
  };
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, ['Read the text so far', 'Score each possible next token', 'Softmax: scores become chances', 'Pick one by its chance', 'Add it and go again'][step], col);
    const toks = step === 4 ? [...CTX, ' mat'] : CTX;
    chips(ctx, col, toks, 46, step === 4 ? 5 : step === 0 ? Math.min(4, Math.floor(e * 5)) : -1);
    if (step === 0 || step === 4) {
      text(ctx, step === 0 ? 'The model reads every token, every time.' : 'Next turn: read all six tokens, score again.', 10, 86, { color: col.muted, size: 12 });
      return;
    }
    const L = 70, R = w - 64, top = 84, gap = (h - top - 20) / 4;
    TOK.forEach((t, i) => {
      const y = top + i * gap, v = step === 1 ? SC[i] / 3 : PR[i] / PR[0];
      text(ctx, t.trim(), 10, y + 11, { color: col.ink, size: 12.5, weight: 600 });
      ctx.fillStyle = col.soft; ctx.fillRect(L, y, R - L, 22);
      ctx.fillStyle = step === 3 && i === 0 ? col.s[0] : col.s[1]; ctx.fillRect(L, y, (R - L) * v * e, 22);
      text(ctx, step === 1 ? `score ${SC[i]}` : `${Math.round(PR[i] * 100)}%`, R + 6, y + 11, { color: col.ink, size: 12, weight: 600 });
    });
    if (step === 3 && k >= 1) text(ctx, 'picked: mat', L + 6, top + 11, { color: '#fff', size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
