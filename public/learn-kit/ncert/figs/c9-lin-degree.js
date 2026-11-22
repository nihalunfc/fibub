// Class 9 Linear Polynomials: the degree is the highest power of x whose coefficient is not zero. Set the coefficients of
// x^3, x^2, x and the constant with sliders; set the leading ones to 0 and watch the degree drop (3, then 2, then 1, then 0).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const num = (v) => String(v).replace('-', '−');
export default function (host) {
  const c = [0, 0, 2, 1];
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A polynomial built from four coefficients with its degree highlighted' });
  const ctl = row(host);
  ['x³', 'x²', 'x', 'constant'].forEach((n, i) => slider(ctl, { label: 'coefficient of ' + n, min: -4, max: 4, step: 1, value: c[i], fmt: num, oninput: (v) => { c[i] = v; upd(); } }));
  const out = readout(host);
  const deg = () => { for (let i = 0; i < 4; i++) if (c[i]) return 3 - i; return null; };
  cv.draw = (ctx, w, h, col) => {
    const d = deg(), t = title(ctx, 'Degree of the polynomial', col), names = ['x³', 'x²', 'x', '1'];
    const cw = (w - 20 - 3 * 6) / 4;
    c.forEach((v, i) => {
      const X = 10 + i * (cw + 6), Y = t + 14, top = d !== null && 3 - i === d;
      ctx.save(); ctx.fillStyle = top ? col.soft : col.panel; ctx.strokeStyle = v === 0 ? col.line : top ? col.s[3] : col.s[0]; ctx.lineWidth = top ? 4 : 2; ctx.beginPath(); ctx.roundRect(X, Y, cw, 92, 8); ctx.fill(); ctx.stroke(); ctx.restore();
      text(ctx, (v === 0 ? '0' : num(v)) + (i < 3 ? names[i] : ''), X + cw / 2, Y + 30, { color: v === 0 ? col.muted : col.ink, size: 16, weight: 700, align: 'center' });
      text(ctx, 'power ' + (3 - i), X + cw / 2, Y + 58, { color: col.muted, size: 11, align: 'center' });
      text(ctx, v === 0 ? 'term vanishes' : top ? 'DEGREE' : 'present', X + cw / 2, Y + 76, { color: top ? col.s[3] : col.muted, size: 10.5, weight: top ? 700 : 400, align: 'center' });
    });
    text(ctx, d === null ? 'All coefficients 0: the zero polynomial (no degree)' : 'Degree ' + d + ' (' + ['constant', 'linear', 'quadratic', 'cubic'][d] + ')', w / 2, t + 14 + 92 + 26, { color: col.ink, size: 15, weight: 700, align: 'center' });
  };
  function upd() {
    let s = ''; c.forEach((v, i) => { if (!v) return; const e = 3 - i, a = Math.abs(v), t = (a === 1 && e > 0 ? '' : a) + (e === 0 ? '' : e === 1 ? 'x' : 'x' + (e === 2 ? '²' : '³')); s += s ? (v < 0 ? ' − ' : ' + ') + t : (v < 0 ? '−' : '') + t; });
    const d = deg(); out.innerHTML = `p(x) = <b>${s || '0'}</b>. ` + (d === null ? 'The zero polynomial has no degree.' : `The highest power with a non-zero coefficient is ${d}, so the degree is <b>${d}</b>.`) + ' A zero coefficient makes that term vanish, so the degree can drop.'; cv.redraw();
  }
  upd();
}
