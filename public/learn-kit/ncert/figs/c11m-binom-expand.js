// Class 11 Maths, Binomial Theorem: the expansion of (a + b)ⁿ = Σ nCk · a^(n−k) · b^k, k = 0 ... n, with n + 1 terms.
// Slide n to see all terms: the powers of a go down from n to 0, the powers of b go up from 0 to n, and the
// coefficients come from row n of Pascal's triangle. Tap a term to read its position T(k+1).
import { canvas, row, slider, choice, readout, text, title } from '../../kit.js';

const C = (n, r) => { let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return Math.round(v); };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (k) => String(k).split('').map((d) => SUP[d]).join('');
export default function (host) {
  let n = 5, sel = 2, sign = 1, hit = [];
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Terms of a binomial expansion with their coefficients, powers and a highlighted general term' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'n', min: 1, max: 9, step: 1, value: n, fmt: String, oninput: (v) => { n = v; sel = Math.min(sel, n); re(); } });
  choice(c1, 'sign', [['1', '(a + b)'], ['-1', '(a − b)']], '1', (v) => { sign = +v; re(); });
  const re = () => { cv.redraw(); const k = sel; out.innerHTML = `General term T<sub>k+1</sub> = ${n}C<sub>k</sub> a<sup>n−k</sup> b<sup>k</sup>. For k = ${k}: T<sub>${k + 1}</sub> = ${n}C${k} · a<sup>${n - k}</sup> · ${sign < 0 && k % 2 ? '(−b)' : 'b'}<sup>${k}</sup> = <b>${sign < 0 && k % 2 ? '−' : ''}${C(n, k)} a${sup(n - k)} b${sup(k)}</b>. There are ${n + 1} terms.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `(a ${sign > 0 ? '+' : '−'} b)${sup(n)}: ${n + 1} terms`, col), rh = Math.min(30, (h - top - 12) / (n + 1)); hit = [];
    for (let k = 0; k <= n; k++) {
      const y = top + 14 + k * rh + rh / 2, on = k === sel, neg = sign < 0 && k % 2;
      hit.push([y - rh / 2, y + rh / 2]);
      if (on) { ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.18; ctx.fillRect(10, y - rh / 2, w - 20, rh); ctx.globalAlpha = 1; }
      text(ctx, `T${k + 1}`, 16, y, { color: col.muted, size: 11 });
      text(ctx, `${neg ? '−' : '+'} ${C(n, k)}`, 56, y, { color: col.s[0], size: 13, weight: 700 });
      text(ctx, `a${sup(n - k)}  b${sup(k)}`, 120, y, { color: col.ink, size: 14, weight: on ? 700 : 500 });
      const bw = (w - 200) * C(n, k) / C(n, Math.floor(n / 2)); ctx.fillStyle = on ? col.s[1] : col.s[0]; ctx.globalAlpha = 0.35; ctx.fillRect(190, y - 5, Math.max(2, bw), 10); ctx.globalAlpha = 1;
    }
  };
  cv.c.addEventListener('pointerdown', (e) => { const y = e.clientY - cv.c.getBoundingClientRect().top; const i = hit.findIndex(([a, b]) => y >= a && y <= b); if (i >= 0) { sel = i; re(); } });
  re();
}
