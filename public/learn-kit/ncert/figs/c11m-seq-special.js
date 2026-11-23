// Class 11 Maths, Sum to n terms of special series: Σn = n(n+1)/2, Σn² = n(n+1)(2n+1)/6, Σn³ = (n(n+1)/2)².
// Dots show Σn as a triangle of dots and the sum of odd numbers as a square (1 + 3 + 5 + ... = n²); bars show the three sums.
import { canvas, row, slider, choice, readout, text, title, dot } from '../../kit.js';

export default function (host) {
  let n = 5, mode = 'tri';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Dots arranged as a triangle or a square to show sums of natural numbers' });
  const c1 = row(host), out = readout(host);
  choice(c1, 'series', [['tri', '1+2+3+…'], ['odd', '1+3+5+…'], ['sq', '1²+2²+3²+…'], ['cu', '1³+2³+…']], mode, (v) => { mode = v; re(); });
  slider(c1, { label: 'n', min: 1, max: 10, step: 1, value: n, fmt: String, oninput: (v) => { n = v; re(); } });
  const sum = (f) => { let s = 0; for (let i = 1; i <= n; i++) s += f(i); return s; };
  const re = () => { cv.redraw(); const t = { tri: [sum((i) => i), `n(n+1)/2 = ${n}×${n + 1}/2`, n * (n + 1) / 2], odd: [sum((i) => 2 * i - 1), `n² = ${n}²`, n * n], sq: [sum((i) => i * i), `n(n+1)(2n+1)/6 = ${n}×${n + 1}×${2 * n + 1}/6`, n * (n + 1) * (2 * n + 1) / 6], cu: [sum((i) => i ** 3), `(n(n+1)/2)² = ${n * (n + 1) / 2}²`, (n * (n + 1) / 2) ** 2] }[mode]; out.innerHTML = `Adding term by term: <b>${t[0]}</b>. Formula ${t[1]} = <b>${t[2]}</b>. They agree.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { tri: 'Triangular numbers', odd: 'Sum of odd numbers is a square', sq: 'Sum of squares', cu: 'Sum of cubes = (sum of n)²' }[mode], col), area = Math.min(w - 30, h - top - 20), cell = Math.min(24, area / Math.max(n, 2) / (mode === 'tri' ? 1 : 1)), x0 = (w - n * cell) / 2, y0 = top + 20;
    if (mode === 'tri' || mode === 'odd') for (let i = 1; i <= n; i++) for (let j = 0; j < (mode === 'tri' ? i : 2 * i - 1); j++) { const x = mode === 'tri' ? w / 2 + (j - (i - 1) / 2) * cell : x0 + (j < i ? j : i - 1) * cell + cell / 2, y = mode === 'tri' ? y0 + (i - 1) * cell + cell / 2 : y0 + (j < i ? i - 1 : 2 * i - 2 - j) * cell + cell / 2; dot(ctx, x, y, cell * 0.36, col.s[(i - 1) % 6], col.panel); }
    else { const vals = Array.from({ length: n }, (_, i) => (mode === 'sq' ? (i + 1) ** 2 : (i + 1) ** 3)), tot = vals.reduce((s, v) => s + v, 0), bw = w - 40; let x = 20; vals.forEach((v, i) => { const ww = bw * v / tot; ctx.fillStyle = col.s[i % 6]; ctx.globalAlpha = 0.55; ctx.fillRect(x, y0 + 20, ww - 1, 40); ctx.globalAlpha = 1; if (ww > 18) text(ctx, String(v), x + ww / 2, y0 + 40, { color: col.ink, size: 11, weight: 700, align: 'center' }); x += ww; }); text(ctx, `total ${tot}`, w / 2, y0 + 82, { color: col.ink, size: 16, weight: 700, align: 'center' }); }
  };
  re();
}
