// Class 9 Numbers: laws of exponents with rational powers. a^(1/n) is the n-th root of a. Pick a base and two rational powers
// p and q: the page works out both sides of each law numerically, and they agree.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const P = { '1/2': 0.5, '1/3': 1 / 3, '2/3': 2 / 3, '3/2': 1.5, '−1/2': -0.5, '1/4': 0.25 };
const f = (v) => String(+v.toPrecision(6)).replace('-', '−');
export default function (host) {
  let a = 16, p = '1/2', q = '1/4';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 280, label: 'Laws of exponents with fractional powers checked by calculation for a chosen base and two powers' });
  const c1 = row(host); choice(c1, 'Base a', [[4, '4'], [8, '8'], [16, '16'], [27, '27'], [64, '64']], a, (v) => { a = v; upd(); });
  const c2 = row(host); choice(c2, 'Power p', Object.keys(P).map((k) => [k, k]), p, (v) => { p = v; upd(); });
  const c3 = row(host); choice(c3, 'Power q', Object.keys(P).map((k) => [k, k]), q, (v) => { q = v; upd(); });
  const out = readout(host);
  const rows = () => { const pp = P[p], qq = P[q];
    return [
      [`a^p × a^q`, Math.pow(a, pp) * Math.pow(a, qq), `a^(p+q)`, Math.pow(a, pp + qq)],
      [`a^p ÷ a^q`, Math.pow(a, pp) / Math.pow(a, qq), `a^(p−q)`, Math.pow(a, pp - qq)],
      [`(a^p)^q`, Math.pow(Math.pow(a, pp), qq), `a^(pq)`, Math.pow(a, pp * qq)],
    ]; };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'a = ' + a + ', p = ' + p + ', q = ' + q, col);
    text(ctx, `a^p = ${f(Math.pow(a, P[p]))},  a^q = ${f(Math.pow(a, P[q]))}`, 12, t + 18, { color: col.ink, size: 12.5, weight: 700 });
    rows().forEach(([l, lv, r, rv], i) => {
      const y = t + 50 + i * 64;
      ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = col.line; ctx.beginPath(); ctx.roundRect(8, y - 8, w - 16, 54, 8); ctx.fill(); ctx.stroke(); ctx.restore();
      text(ctx, l + ' = ' + f(lv), 18, y + 8, { color: col.ink, size: 13, weight: 600 });
      text(ctx, r + ' = ' + f(rv), 18, y + 30, { color: col.ink, size: 13, weight: 600 });
      text(ctx, Math.abs(lv - rv) < 1e-9 * Math.max(1, Math.abs(lv)) ? '= equal' : 'differ', w - 18, y + 19, { color: col.s[2], size: 14, weight: 700, align: 'right' });
    });
    text(ctx, 'a^(1/n) is the n-th root: 16^(1/4) = 2 because 2⁴ = 16', 12, h - 12, { color: col.muted, size: 11 });
  };
  function upd() { out.innerHTML = `For a = ${a}: ${a}^(${p}) = ${f(Math.pow(a, P[p]))}. The three laws hold for every rational power (as long as a > 0): multiply, divide and raise to a power by adding, subtracting and multiplying the exponents.`; cv.redraw(); }
  upd();
}
