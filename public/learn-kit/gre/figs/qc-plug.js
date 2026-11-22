// 2.1 Plug-in picture for Quantitative Comparison: both quantities as curves over the allowed x values.
import { canvas, row, choice, slider, readout, text, title } from '../../kit.js';
const C = {
  sq: { name: 'x vs x², x > 0', A: (x) => x, B: (x) => x * x, lo: 0.01, hi: 2.5, la: 'x', lb: 'x²' },
  cube: { name: 'x vs x³, 0 < x < 1', A: (x) => x, B: (x) => x ** 3, lo: 0.01, hi: 0.99, la: 'x', lb: 'x³' },
  lin: { name: '3x + 7 vs 3x + 5', A: (x) => 3 * x + 7, B: (x) => 3 * x + 5, lo: -3, hi: 3, la: '3x + 7', lb: '3x + 5' },
  sqr: { name: 'x² + 1 vs 2x', A: (x) => x * x + 1, B: (x) => 2 * x, lo: -2, hi: 3, la: 'x² + 1', lb: '2x' },
};
const n = (v) => (Math.round(v * 100) / 100).toString().replace('-', '−');
export default function (host) {
  let k = 'sq', x = 1.5;
  const cv = canvas(host, { aspect: 0.6, max: 300, min: 220, label: 'Quantity A and Quantity B plotted over the allowed values of x' });
  const ctl = row(host); let sl;
  const out = readout(host);
  const verdict = (c) => { let a = 0, b = 0, e = 0; for (let i = 0; i <= 400; i++) { const t = c.lo + (c.hi - c.lo) * i / 400, d = c.A(t) - c.B(t); if (Math.abs(d) < 1e-9) e++; else if (d > 0) a++; else b++; }
    return (a && b) || (e && (a || b)) ? 'D: the curves cross or touch, so the result depends on x' : a ? 'A: Quantity A is above everywhere' : b ? 'B: Quantity B is above everywhere' : 'C: the curves are the same'; };
  const go = () => { cv.redraw(); const c = C[k]; out.innerHTML = `At x = ${n(x)}: A = ${n(c.A(x))}, B = ${n(c.B(x))}. Over all allowed x: <b>${verdict(c)}</b>.`; };
  const mk = () => { ctl.innerHTML = ''; choice(ctl, 'Compare', Object.entries(C).map(([a, c]) => [a, c.name]), k, (v) => { k = v; x = (C[v].lo + C[v].hi) / 2; mk(); go(); });
    const c = C[k]; sl = slider(ctl, { label: 'x', min: c.lo, max: c.hi, step: 0.01, value: x, fmt: n, oninput: (v) => { x = v; go(); } }); };
  cv.draw = (ctx, w, h, col) => {
    const c = C[k], l = 36, r = w - 14, t = 44, b = h - 26, ys = []; for (let i = 0; i <= 100; i++) { const u = c.lo + (c.hi - c.lo) * i / 100; ys.push(c.A(u), c.B(u)); }
    const y0 = Math.min(...ys), y1 = Math.max(...ys), X = (u) => l + (r - l) * (u - c.lo) / (c.hi - c.lo), Y = (v) => b - (b - t) * (v - y0) / (y1 - y0 || 1);
    ctx.strokeStyle = col.line; ctx.strokeRect(l, t, r - l, b - t);
    [[c.A, col.s[0], 'A: ' + c.la], [c.B, col.s[1], 'B: ' + c.lb]].forEach(([f, cl, lab], j) => { ctx.strokeStyle = cl; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i <= 200; i++) { const u = c.lo + (c.hi - c.lo) * i / 200; i ? ctx.lineTo(X(u), Y(f(u))) : ctx.moveTo(X(u), Y(f(u))); } ctx.stroke(); ctx.lineWidth = 1;
      text(ctx, lab, l + 8 + j * 110, t + 12, { color: cl, size: 12, weight: 700 }); });
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(x), t); ctx.lineTo(X(x), b); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `x from ${n(c.lo)} to ${n(c.hi)}`, l, b + 14, { color: col.muted, size: 11 });
    title(ctx, 'Which curve is on top, for every allowed x?', col);
  };
  mk(); go();
}
