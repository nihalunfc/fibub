// 13.1 What an agent is: one small job, turn by turn. The model asks, your code runs a tool, the result is added,
// and a context bar fills (500 task, +30 list, +1,000 per file read) until the model answers in plain text.
import { canvas, title, text, arrow, loop, calm, ease } from '../../kit.js';

const C = 8192;
const SEG = [['task', 500], ['list', 30], ['file a', 1000], ['file b', 1000], ['answer', 70]];
const CALL = ['', 'list_files(".")', 'read_file("brief-a.txt")', 'read_file("brief-b.txt")', ''];
const BACK = ['', '3 file names', '~1,000 tokens of text', '~1,000 tokens of text', ''];
const HEAD = ['The task arrives', 'Turn 1: the model asks for a tool', 'Turn 2: read a file', 'Turn 3: read another', 'Plain text, no tool call: done'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 230, label: 'An agent loop: model, your code and tools, with the context window filling turn by turn' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  const box = (ctx, x, y, w, h, label, on, col) => {
    ctx.fillStyle = on ? col.s[0] : col.panel; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    text(ctx, label, x + w / 2, y + h / 2, { color: on ? '#fff' : col.ink, size: 12.5, weight: 700, align: 'center' });
  };
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, HEAD[step], col);
    const bw = Math.min(120, w * 0.3), bh = 36, y = 52;
    const xm = 12, xc = w - bw - 12;
    const tool = step >= 1 && step <= 3;
    box(ctx, xm, y, bw, bh, 'Model', step === 0 || step === 4 || (tool && e < 0.5), col);
    box(ctx, xc, y, bw, bh, 'Your code', tool && e >= 0.5, col);
    if (tool) {
      arrow(ctx, xm + bw + 4, y + 10, xm + bw + 4 + (xc - xm - bw - 8) * Math.min(1, e * 2), y + 10, col.s[1], 2);
      text(ctx, CALL[step], w / 2, y - 4, { color: col.s[1], size: 11, weight: 600, align: 'center' });
      if (e > 0.5) {
        arrow(ctx, xc - 4, y + bh - 10, xc - 4 - (xc - xm - bw - 8) * (e - 0.5) * 2, y + bh - 10, col.s[2], 2);
        text(ctx, BACK[step], w / 2, y + bh + 10, { color: col.s[2], size: 11, weight: 600, align: 'center' });
      }
    }
    if (step === 0) text(ctx, '"Which files mention a deadline?"', w / 2, y + bh + 14, { color: col.muted, size: 11.5, align: 'center' });
    if (step === 4) text(ctx, '"brief-b.txt has a deadline of 12 December."', w / 2, y + bh + 14, { color: col.ink, size: 11.5, weight: 600, align: 'center' });
    // context bar
    const L = 12, R = w - 12, by = h - 62, bhh = 24, sc = (R - L) / C;
    text(ctx, `Context window: ${C.toLocaleString('en-CA')} tokens`, L, by - 12, { color: col.muted, size: 11 });
    ctx.fillStyle = col.soft; ctx.fillRect(L, by, R - L, bhh);
    let x = L, used = 0;
    SEG.slice(0, step + 1).forEach(([name, t], i) => {
      const grow = i === step ? e : 1, wd = t * sc * grow;
      ctx.fillStyle = col.s[i % 8]; ctx.fillRect(x, by, wd, bhh);
      x += wd; used += t * grow;
    });
    ctx.strokeStyle = col.line; ctx.strokeRect(L + 0.5, by + 0.5, R - L - 1, bhh - 1);
    text(ctx, `${Math.round(used).toLocaleString('en-CA')} used`, L, by + bhh + 14, { color: col.ink, size: 11.5, weight: 700 });
    text(ctx, 'the model re-reads all of it every turn', R, by + bhh + 14, { color: col.muted, size: 11, align: 'right' });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
