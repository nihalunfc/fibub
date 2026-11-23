// Class 8 Algebra Play: a number trick explained by algebra. Think of n, add 5, double, take away 4, halve, take away n: always 3.
// The right column keeps the letter n so you see where the n cancels.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const STEP = [['Think of a number', (n) => n, 'n'], ['Add 5', (n) => n + 5, 'n + 5'], ['Double it', (n) => 2 * (n + 5), '2n + 10'], ['Take away 4', (n) => 2 * (n + 5) - 4, '2n + 6'], ['Halve it', (n) => n + 3, 'n + 3'], ['Take away your first number', () => 3, '3']];
export default function (host) {
  let n = 7;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A number trick shown with numbers and with algebra side by side' });
  const ctl = row(host);
  slider(ctl, { label: 'Your number n', min: 1, max: 50, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; sync(); } });
  const out = readout(host);
  function sync() { out.innerHTML = `You started with ${n} and ended with <b>3</b>. Change n: the middle numbers change but the last line stays 3, because in algebra the <b>n</b> in “n + 3” and the n you take away cancel.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Think of a number, always get 3', col), y0 = top + 26, dy = Math.min(40, (h - y0 - 24) / 6), c1 = w * 0.04, c2 = w * 0.64;
    text(ctx, 'With your number', c1, y0 - 8, { color: col.muted, size: 10.5 }); text(ctx, 'With n', c2, y0 - 8, { color: col.muted, size: 10.5 });
    STEP.forEach(([lab, f, alg], i) => { const y = y0 + 14 + i * dy, last = i === 5; text(ctx, lab, c1, y - 8, { color: col.ink, size: 11 }); text(ctx, String(f(n)), c1 + 4, y + 7, { color: last ? col.s[2] : col.ink, size: 14, weight: 700 }); text(ctx, alg, c2, y, { color: last ? col.s[2] : col.s[0], size: 14, weight: 700 }); if (i) { ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(c1, y - dy / 2 - 1 + 2); ctx.lineTo(w - 10, y - dy / 2 - 1 + 2); ctx.stroke(); } });
  };
  sync();
}
