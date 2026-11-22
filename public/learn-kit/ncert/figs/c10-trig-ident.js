// Class 10 Trigonometry: the three identities checked at any angle. (1) sin² + cos² = 1; (2) 1 + tan² = sec²; (3) 1 + cot² = cosec².
// Divide the first by cos² to get the second, and by sin² to get the third. Bars: the stacked left side and the right side have equal length.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

const ID = { 1: ['sin²θ + cos²θ = 1', (a) => [Math.sin(a) ** 2, Math.cos(a) ** 2], () => 1, ['sin²θ', 'cos²θ'], '1'], 2: ['1 + tan²θ = sec²θ', (a) => [1, Math.tan(a) ** 2], (a) => 1 / Math.cos(a) ** 2, ['1', 'tan²θ'], 'sec²θ'], 3: ['1 + cot²θ = cosec²θ', (a) => [1, 1 / Math.tan(a) ** 2], (a) => 1 / Math.sin(a) ** 2, ['1', 'cot²θ'], 'cosec²θ'] };
export default function (host) {
  let th = 35, id = 1;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 270, label: 'Bars showing that the two sides of each trigonometric identity are equal at any angle' });
  const ctl = row(host);
  choice(ctl, 'Identity', [[1, 'sin² + cos² = 1'], [2, '1 + tan² = sec²'], [3, '1 + cot² = cosec²']], id, (v) => { id = v; upd(); });
  slider(ctl, { label: 'Angle θ', min: 10, max: 80, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ID[id][0], col), a = th * D, [p, q] = ID[id][1](a), r = ID[id][2](a), u = (w - 40) / Math.max(p + q, r) , x0 = 20, y0 = t + 24, bh = 38;
    lab(ctx, 'Left side', x0, y0 - 2, col.muted, col, 'left', 11);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(x0, y0 + 6, p * u, bh); ctx.fillStyle = col.s[1]; ctx.fillRect(x0 + p * u, y0 + 6, q * u, bh); ctx.globalAlpha = 1;
    if (p * u > 40) lab(ctx, `${ID[id][3][0]} = ${f3(p)}`, x0 + p * u / 2, y0 + 6 + bh / 2, '#fff', null, 'center', 11); if (q * u > 40) lab(ctx, `${ID[id][3][1]} = ${f3(q)}`, x0 + p * u + q * u / 2, y0 + 6 + bh / 2, '#fff', null, 'center', 11);
    lab(ctx, 'Right side', x0, y0 + bh + 26, col.muted, col, 'left', 11);
    ctx.fillStyle = col.s[2]; ctx.fillRect(x0, y0 + bh + 34, r * u, bh); lab(ctx, `${ID[id][4]} = ${f3(r)}`, x0 + Math.min(r * u / 2, w / 2), y0 + bh + 34 + bh / 2, '#fff', null, 'center', 12);
    lab(ctx, `${f3(p)} + ${f3(q)} = ${f3(p + q)}   and   ${f3(r)}`, w / 2, h - 16, col.ink, col, 'center', 13);
  };
  function upd() { const a = th * D, [p, q] = ID[id][1](a), r = ID[id][2](a); out.innerHTML = `At θ = ${th}°: left side = ${f3(p)} + ${f3(q)} = <b>${f3(p + q)}</b>, right side = <b>${f3(r)}</b>. ${id === 1 ? '' : id === 2 ? 'Derived by dividing sin² + cos² = 1 by cos².' : 'Derived by dividing sin² + cos² = 1 by sin².'}`; cv.redraw(); }
  upd();
}
