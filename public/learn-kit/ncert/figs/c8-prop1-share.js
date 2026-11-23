// Class 8 Proportional Reasoning 1: sharing an amount in a ratio. For a : b : c, the total is split into a + b + c equal parts and
// each person gets their number of parts. One part = total / (a + b + c).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let T = 1200, a = 2, b = 3, c = 1;
  const cv = canvas(host, { aspect: 0.58, max: 440, min: 240, label: 'A sum of money divided into equal parts and shared in the ratio a to b to c' });
  const ctl = row(host);
  slider(ctl, { label: 'Total (₹)', min: 100, max: 3000, step: 100, value: T, fmt: (v) => '₹' + Math.round(v), oninput: (v) => { T = Math.round(v); upd(); } });
  slider(ctl, { label: 'Asha parts', min: 1, max: 6, step: 1, value: a, fmt: (v) => String(Math.round(v)), oninput: (v) => { a = Math.round(v); upd(); } });
  slider(ctl, { label: 'Bilal parts', min: 1, max: 6, step: 1, value: b, fmt: (v) => String(Math.round(v)), oninput: (v) => { b = Math.round(v); upd(); } });
  slider(ctl, { label: 'Charu parts', min: 1, max: 6, step: 1, value: c, fmt: (v) => String(Math.round(v)), oninput: (v) => { c = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const P = a + b + c, one = T / P, t = title(ctx, '₹' + T + ' shared in ' + a + ' : ' + b + ' : ' + c, col), x0 = 12, bw = w - 24, y = t + 34, pw = bw / P;
    [[a, 'Asha', 0], [b, 'Bilal', 1], [c, 'Charu', 2]].reduce((st, [n, nm, i]) => {
      for (let j = 0; j < n; j++) { ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = col.s[[0, 2, 3][i]]; ctx.fillRect(x0 + (st + j) * pw + 1, y, pw - 2, 40); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.strokeRect(x0 + (st + j) * pw + 1, y, pw - 2, 40); }
      text(ctx, nm + ' gets ' + n + ' × ₹' + +one.toFixed(2) + ' = ₹' + +(n * one).toFixed(2), x0, y + 62 + i * 22, { color: col.ink, size: 13, weight: 700 });
      return st + n;
    }, 0);
    text(ctx, 'one part = ₹' + T + ' ÷ ' + P + ' = ₹' + +one.toFixed(2), w / 2, h - 14, { color: col.s[5], size: 13, weight: 700, align: 'center' });
  };
  function upd() { const P = a + b + c; out.innerHTML = `${P} parts in all. The shares are <b>₹${+(a * T / P).toFixed(2)}</b>, <b>₹${+(b * T / P).toFixed(2)}</b> and <b>₹${+(c * T / P).toFixed(2)}</b>; together ₹${T}.`; cv.redraw(); }
  upd();
}
