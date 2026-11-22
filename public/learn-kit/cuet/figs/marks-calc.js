// 1.1 / 1.2 How a CUET score is built: 50 questions, +5 right, −1 wrong, 0 blank. Slide right and wrong answers
// and watch the bar split into marks won, marks lost and marks left on the table.
import { canvas, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.36, max: 240, min: 170, label: 'Bar showing marks won, lost and not attempted out of 250' });
  let right = 32, wrong = 8;
  const ctl = row(host);
  const sR = slider(ctl, { label: 'Right answers', min: 0, max: 50, step: 1, value: right, fmt: (v) => String(v), oninput: (v) => { right = v; if (right + wrong > 50) { wrong = 50 - right; sW.set(wrong); } go(); } });
  const sW = slider(ctl, { label: 'Wrong answers', min: 0, max: 50, step: 1, value: wrong, fmt: (v) => String(v), oninput: (v) => { wrong = Math.min(v, 50 - right); if (wrong !== v) sW.set(wrong); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); show(); };
  const show = () => {
    const blank = 50 - right - wrong, score = 5 * right - wrong;
    const acc = right + wrong ? Math.round((100 * right) / (right + wrong)) : 0;
    out.innerHTML = `Score <b>${score} / 250</b>: ${right} right × 5 = ${5 * right}, minus ${wrong} wrong × 1. ${blank} left blank. Accuracy ${acc}%.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const x0 = 16, x1 = w - 16, bw = x1 - x0, y = h * 0.34, bh = h * 0.24;
    const won = 5 * right, lost = wrong, blank = 50 - right - wrong;
    const seg = [
      [won - lost, col.s[2], 'kept'], [lost, col.s[1], 'lost to wrong answers'], [5 * wrong, col.line, 'wrong answers could have won'], [5 * blank, col.muted, 'blank'],
    ];
    let x = x0;
    for (const [v, c] of seg) {
      const ww = (Math.max(0, v) / 250) * bw;
      ctx.fillStyle = c; ctx.globalAlpha = c === col.muted ? 0.25 : 1; ctx.fillRect(x, y, ww, bh); ctx.globalAlpha = 1;
      x += ww;
    }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x0, y, bw, bh);
    text(ctx, '0', x0, y + bh + 14, { color: col.muted, size: 11, align: 'left' });
    text(ctx, '250', x1, y + bh + 14, { color: col.muted, size: 11, align: 'right' });
    const keys = [[col.s[2], 'Your score'], [col.s[1], 'Lost: −1 each'], [col.line, 'Wrong answers'], [col.muted, 'Blank']];
    let kx = x0;
    for (const [c, t] of keys) { ctx.fillStyle = c; ctx.globalAlpha = c === col.muted ? 0.35 : 1; ctx.fillRect(kx, h - 22, 10, 10); ctx.globalAlpha = 1; text(ctx, t, kx + 14, h - 17, { color: col.ink, size: 11 }); kx += Math.min(118, (bw) / 4); }
    text(ctx, `${5 * right - wrong} marks`, x0, y - 12, { color: col.ink, size: 14, weight: 700 });
  };
  go();
}
