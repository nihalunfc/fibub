// Class 11 Maths, Binomial Theorem: (a + b)² as an area. A square of side a + b is cut into four pieces: a square a²,
// a square b² and two rectangles ab. So (a + b)² = a² + 2ab + b². Switch to (a − b)² to see why the middle term is
// subtracted: the big square a² loses two strips ab, but the corner b² has been taken away twice.
import { canvas, row, slider, choice, readout, text, title } from '../../kit.js';

export default function (host) {
  let a = 5, b = 2, mode = 'plus';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'A square of side a plus b cut into a squared, two rectangles ab and b squared' });
  const c1 = row(host), out = readout(host);
  choice(c1, 'show', [['plus', '(a + b)²'], ['minus', '(a − b)²']], mode, (v) => { mode = v; re(); });
  slider(c1, { label: 'a', min: 1, max: 8, step: 0.5, value: a, fmt: String, oninput: (v) => { a = v; if (b > a) { b = a; sb.set(b); } re(); } });
  const sb = slider(c1, { label: 'b', min: 0.5, max: 6, step: 0.5, value: b, fmt: String, oninput: (v) => { b = Math.min(v, a); if (b !== v) sb.set(b); re(); } });
  const re = () => { cv.redraw(); out.innerHTML = mode === 'plus' ? `(${a} + ${b})² = ${a}² + 2·${a}·${b} + ${b}² = ${a * a} + ${2 * a * b} + ${b * b} = <b>${(a + b) ** 2}</b>.` : `(${a} − ${b})² = ${a}² − 2·${a}·${b} + ${b}² = ${a * a} − ${2 * a * b} + ${b * b} = <b>${(a - b) ** 2}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'plus' ? '(a + b)² = a² + 2ab + b²' : '(a − b)² = a² − 2ab + b²', col), S = Math.min(w - 40, h - top - 30), tot = mode === 'plus' ? a + b : a, u = S / tot, x0 = (w - S) / 2, y0 = top + 12;
    const R = (x, y, wd, ht, c, label, al = 0.3) => { ctx.fillStyle = c; ctx.globalAlpha = al; ctx.fillRect(x0 + x * u, y0 + y * u, wd * u, ht * u); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + x * u, y0 + y * u, wd * u, ht * u); if (wd * u > 30 && ht * u > 16) text(ctx, label, x0 + (x + wd / 2) * u, y0 + (y + ht / 2) * u, { color: col.ink, size: 13, weight: 700, align: 'center' }); };
    if (mode === 'plus') { R(0, 0, a, a, col.s[0], 'a²'); R(a, 0, b, a, col.s[1], 'ab'); R(0, a, a, b, col.s[1], 'ab'); R(a, a, b, b, col.s[2], 'b²'); }
    else { const s = a - b; R(0, 0, s, s, col.s[0], '(a−b)²', 0.35); R(s, 0, b, s, col.s[1], 'b(a−b)', 0.12); R(0, s, s, b, col.s[1], 'b(a−b)', 0.12); R(s, s, b, b, col.s[2], 'b²', 0.12); }
    text(ctx, 'a', x0 + (mode === 'plus' ? a / 2 : a / 2) * u, y0 - 3, { color: col.muted, size: 11, align: 'center' });
  };
  re();
}
