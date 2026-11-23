// Class 12 Maths, Matrices: when does the product AB exist? A is m x n and B is p x q. The inner numbers n and p must be equal; then AB has
// the outer order m x q. Set the two orders with the sliders and watch the check light up.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let m = 2, n = 3, p = 3, q = 4;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Two grids showing the orders of A and B and whether their product is defined' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Is AB defined? Compare the inner numbers', col), cs = Math.min(22, (w - 80) / 9), ok = n === p, y = top + 32;
    const grid = (r, c, x, color, name, ord) => { ctx.fillStyle = color; ctx.globalAlpha = 0.18; ctx.fillRect(x, y, c * cs, r * cs); ctx.globalAlpha = 1; ctx.strokeStyle = color; ctx.lineWidth = 1; for (let i = 0; i <= r; i++) { ctx.beginPath(); ctx.moveTo(x, y + i * cs); ctx.lineTo(x + c * cs, y + i * cs); ctx.stroke(); } for (let j = 0; j <= c; j++) { ctx.beginPath(); ctx.moveTo(x + j * cs, y); ctx.lineTo(x + j * cs, y + r * cs); ctx.stroke(); } text(ctx, name, x + (c * cs) / 2, y - 14, { color, size: 12.5, weight: 700, align: 'center' }); text(ctx, ord, x + (c * cs) / 2, y + 4 * cs + 16, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); };
    const gap = 40, xa = (w - (n * cs + p * 0 + q * cs + gap)) / 2 - 0, xa2 = Math.max(10, (w - (n * cs + gap + q * cs)) / 2), xb = xa2 + n * cs + gap;
    grid(m, n, xa2, col.s[0], 'A', `${m} × ${n}`); grid(p, q, xb, col.s[2], 'B', `${p} × ${q}`);
    text(ctx, '×', xa2 + n * cs + gap / 2, y + 2 * cs, { color: col.ink, size: 18, weight: 700, align: 'center' });
    const by = y + 4 * cs + 40;
    text(ctx, `inner: ${n} and ${p}  ${ok ? '= match' : '≠ no match'}`, w / 2, by, { color: ok ? col.good : col.bad, size: 13, weight: 800, align: 'center' });
    text(ctx, ok ? `AB exists, order ${m} × ${q}` : 'AB is not defined', w / 2, by + 24, { color: ok ? col.good : col.bad, size: 13, weight: 800, align: 'center' });
    const ok2 = q === m;
    text(ctx, ok2 ? `BA exists, order ${p} × ${n}` : 'BA is not defined', w / 2, by + 48, { color: ok2 ? col.good : col.bad, size: 13, weight: 800, align: 'center' });
    out.textContent = ok && ok2 ? (m === n && p === q && m === p ? 'Both exist and are the same size, but AB and BA are usually still different matrices.' : `Both AB (${m}×${q}) and BA (${p}×${n}) exist, but they are different sizes, so AB ≠ BA.`) : ok || ok2 ? 'Only one of the two products exists: multiplication of matrices is not commutative.' : 'Neither product exists: the inner numbers never match.';
  };
  const r = row(host), f = (set) => (v) => { set(v); cv.redraw(); };
  slider(r, { label: 'Rows of A (m)', min: 1, max: 4, step: 1, value: m, fmt: String, oninput: f((v) => { m = v; }) }); slider(r, { label: 'Columns of A (n)', min: 1, max: 4, step: 1, value: n, fmt: String, oninput: f((v) => { n = v; }) });
  slider(r, { label: 'Rows of B (p)', min: 1, max: 4, step: 1, value: p, fmt: String, oninput: f((v) => { p = v; }) }); slider(r, { label: 'Columns of B (q)', min: 1, max: 4, step: 1, value: q, fmt: String, oninput: f((v) => { q = v; }) });
  cv.redraw();
}
