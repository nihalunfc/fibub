// Class 11 Maths, Binomial Theorem: why the coefficients are nCr. Expanding (a + b)ⁿ means multiplying n brackets;
// from every bracket you pick either a or b. A term with k b's is made by choosing WHICH k of the n brackets give b,
// and that can be done in nCk ways. Tap the brackets to pick a or b: the term and its count update.
import { canvas, row, slider, button, readout, text, title, touchGuard } from '../../kit.js';

const C = (n, r) => { let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return Math.round(v); };
export default function (host) {
  let n = 4, pick = [0, 1, 0, 1], boxes = [];
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'Brackets where each tap chooses a or b, building one term of the expansion' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'n brackets', min: 2, max: 6, step: 1, value: n, fmt: String, oninput: (v) => { n = v; pick = Array.from({ length: n }, (_, i) => (pick[i] ?? 0)); re(); } });
  button(c1, 'All a', () => { pick = pick.map(() => 0); re(); }); button(c1, 'Reset', () => { pick = pick.map((_, i) => i % 2); re(); });
  const re = () => { cv.redraw(); const k = pick.reduce((s, v) => s + v, 0); out.innerHTML = `You picked b from ${k} bracket${k === 1 ? '' : 's'}: the term is <b>a<sup>${n - k}</sup>b<sup>${k}</sup></b>. The k b's can sit in any ${k} of the ${n} brackets: ${n}C${k} = <b>${C(n, k)}</b> ways, so the coefficient of this term is ${C(n, k)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `(a + b)${'⁰¹²³⁴⁵⁶⁷⁸⁹'[n]}: tap each bracket to pick a or b`, col), cw = Math.min(56, (w - 24) / n); boxes = [];
    pick.forEach((v, i) => { const x = (w - n * cw) / 2 + i * cw, y = top + 24; boxes.push([x, y, cw - 6, 56]); ctx.fillStyle = v ? col.s[1] : col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(x, y, cw - 6, 56); ctx.globalAlpha = 1; ctx.strokeStyle = v ? col.s[1] : col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(x, y, cw - 6, 56); text(ctx, v ? 'b' : 'a', x + (cw - 6) / 2, y + 28, { color: col.ink, size: 24, weight: 700, align: 'center' }); text(ctx, '(a + b)', x + (cw - 6) / 2, y - 8, { color: col.muted, size: 10.5, align: 'center' }); });
    const k = pick.reduce((s, v) => s + v, 0);
    text(ctx, `a${n - k > 1 ? '^' + (n - k) : n - k === 0 ? '⁰' : ''}  ×  b${k > 1 ? '^' + k : k === 0 ? '⁰' : ''}`.replace('a⁰', '1·').replace('b⁰', '1'), w / 2, top + 110, { color: col.ink, size: 20, weight: 700, align: 'center' });
    const y2 = top + 140, bw = (w - 40) / (n + 1), mx = Math.max(...Array.from({ length: n + 1 }, (_, j) => C(n, j))), bh = h - y2 - 40;
    for (let j = 0; j <= n; j++) { const hh = (C(n, j) / mx) * bh, x = 20 + j * bw; ctx.fillStyle = j === k ? col.s[1] : col.line; ctx.fillRect(x + 3, y2 + bh - hh, bw - 6, hh); text(ctx, String(C(n, j)), x + bw / 2, y2 + bh - hh - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'b^' + j, x + bw / 2, y2 + bh + 10, { color: col.muted, size: 10, align: 'center' }); }
  };
  const hit = (x, y) => boxes.findIndex(([bx, by, bw, bh]) => x >= bx && x <= bx + bw && y >= by - 14 && y <= by + bh);
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(), i = hit(e.clientX - r.left, e.clientY - r.top); if (i >= 0) { pick[i] = 1 - pick[i]; re(); } });
  re();
}
