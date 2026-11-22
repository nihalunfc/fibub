// Class 9 Linear Polynomials: is it a polynomial? Each term must be (number) x (x to a whole-number power 0, 1, 2, ...).
// Pick an expression: every term shows its power of x in green if it is allowed and red if not (x in the bottom, under a root, or a fraction power).
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const LIST = {
  a: { s: '3x + 2', t: [['3x', 1, 1], ['2', 0, 1]], deg: 1 },
  b: { s: 'x² − 5x + 6', t: [['x²', 2, 1], ['−5x', 1, 1], ['6', 0, 1]], deg: 2 },
  c: { s: '7', t: [['7', 0, 1]], deg: 0 },
  d: { s: '4/x + 1', t: [['4/x = 4x⁻¹', -1, 0], ['1', 0, 1]], deg: null },
  e: { s: '√x + 3', t: [['√x = x^(1/2)', 0.5, 0], ['3', 0, 1]], deg: null },
  f: { s: 'x³ − ½x', t: [['x³', 3, 1], ['−½x', 1, 1]], deg: 3 },
};
export default function (host) {
  let k = 'a';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Each term of an expression checked for a whole-number power of x, with the verdict and degree' });
  const ctl = row(host);
  choice(ctl, 'Expression', Object.entries(LIST).map(([v, o]) => [v, o.s]), k, (v) => { k = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const E = LIST[k], t = title(ctx, E.s + ': polynomial in x?', col);
    const n = E.t.length, cw = Math.min(150, (w - 20 - (n - 1) * 8) / n), x0 = (w - (n * cw + (n - 1) * 8)) / 2;
    E.t.forEach(([lab, p, okk], i) => {
      const X = x0 + i * (cw + 8), Y = t + 16, c = okk ? col.s[2] : col.s[6];
      ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(X, Y, cw, 78, 8); ctx.fill(); ctx.stroke(); ctx.restore();
      text(ctx, lab, X + cw / 2, Y + 22, { color: col.ink, size: 14, weight: 700, align: 'center' });
      text(ctx, 'power of x: ' + String(p).replace('-', '−'), X + cw / 2, Y + 47, { color: col.muted, size: 11, align: 'center' });
      text(ctx, okk ? 'allowed' : 'not allowed', X + cw / 2, Y + 65, { color: c, size: 12, weight: 700, align: 'center' });
    });
    const Y2 = t + 16 + 78 + 26, ok = E.deg !== null;
    text(ctx, ok ? 'Yes: a polynomial of degree ' + E.deg : 'No: not a polynomial', w / 2, Y2, { color: ok ? col.s[2] : col.s[6], size: 15, weight: 700, align: 'center' });
    if (ok) text(ctx, ['constant', 'linear', 'quadratic', 'cubic'][E.deg], w / 2, Y2 + 22, { color: col.muted, size: 12, align: 'center' });
  };
  function upd() { const E = LIST[k]; out.innerHTML = E.deg === null ? `<b>${E.s}</b> has a term whose power of x is not a whole number (0, 1, 2, …), so it is not a polynomial.` : `Every power of x in <b>${E.s}</b> is a whole number. The highest is ${E.deg}, so its degree is ${E.deg}.`; cv.redraw(); }
  upd();
}
