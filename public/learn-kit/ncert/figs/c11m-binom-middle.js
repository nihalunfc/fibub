// Class 11 Maths, Binomial Theorem: the middle term(s) of (a + b)ⁿ. There are n + 1 terms. If n is even there is one
// middle term, T(n/2 + 1). If n is odd there are two, T((n+1)/2) and T((n+3)/2). The coefficients rise to the middle and fall again.
import { canvas, row, slider, readout, text, title } from '../../kit.js';

const C = (n, r) => { let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return Math.round(v); };
export default function (host) {
  let n = 8;
  const cv = canvas(host, { aspect: 0.65, max: 440, min: 280, label: 'Coefficients of a binomial expansion with the middle term or terms highlighted' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'n', min: 2, max: 15, step: 1, value: n, fmt: String, oninput: (v) => { n = v; re(); } });
  const re = () => { cv.redraw(); out.innerHTML = n % 2 === 0 ? `n = ${n} is even: ${n + 1} terms, one middle term T<sub>${n / 2 + 1}</sub> = ${n}C${n / 2} a<sup>${n / 2}</sup> b<sup>${n / 2}</sup>, coefficient <b>${C(n, n / 2)}</b>.` : `n = ${n} is odd: ${n + 1} terms, two middle terms T<sub>${(n + 1) / 2}</sub> and T<sub>${(n + 3) / 2}</sub>, both with coefficient <b>${C(n, (n - 1) / 2)}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Middle term(s) of (a + b)${n}`, col), bw = (w - 30) / (n + 1), y1 = h - 34, mx = C(n, Math.floor(n / 2)), bh = y1 - top - 28;
    for (let k = 0; k <= n; k++) { const mid = n % 2 === 0 ? k === n / 2 : k === (n - 1) / 2 || k === (n + 1) / 2, hh = (C(n, k) / mx) * bh, x = 15 + k * bw; ctx.fillStyle = mid ? col.s[1] : col.s[0]; ctx.globalAlpha = mid ? 0.85 : 0.35; ctx.fillRect(x + 2, y1 - hh, bw - 4, hh); ctx.globalAlpha = 1; if (bw > 22) text(ctx, String(C(n, k)), x + bw / 2, y1 - hh - 8, { color: col.ink, size: Math.min(11, bw / 2.4), weight: mid ? 700 : 400, align: 'center' }); text(ctx, 'T' + (k + 1), x + bw / 2, y1 + 11, { color: mid ? col.s[1] : col.muted, size: Math.min(10.5, bw / 1.8), weight: mid ? 700 : 400, align: 'center' }); }
  };
  re();
}
