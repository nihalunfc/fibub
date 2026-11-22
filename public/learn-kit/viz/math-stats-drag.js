// Mean, median and spread with points you can drag. Eleven dots sit on a number line; drag any of them. The mean
// (blue) is pulled by every value, the median (orange) only cares about the middle one, and the standard deviation σ
// (the band) measures how spread out the dots are. Drag one dot far away and see who moves: that is why the median
// resists outliers.
import { canvas, row, button, readout, dot, line, text } from '../kit.js';
import { drag, f2 } from './_math.js';

export default function (host) {
  let v = [2, 3, 3.5, 4, 4.5, 5, 5, 5.5, 6, 7, 8];
  const cv = canvas(host, { aspect: 0.55, max: 300, min: 200, label: 'Eleven dots on a number line with mean, median and standard deviation' });
  const c = row(host);
  button(c, 'Add an outlier', () => { v[10] = 19; cv.redraw(); show(); });
  button(c, 'Squeeze together', () => { const m = v.reduce((s, x) => s + x, 0) / v.length; v = v.map((x) => m + (x - m) * 0.5); cv.redraw(); show(); });
  button(c, 'Spread out', () => { const m = v.reduce((s, x) => s + x, 0) / v.length; v = v.map((x) => Math.max(0, Math.min(20, m + (x - m) * 1.5))); cv.redraw(); show(); });
  button(c, 'Reset', () => { v = [2, 3, 3.5, 4, 4.5, 5, 5, 5.5, 6, 7, 8]; cv.redraw(); show(); });
  const out = readout(host);
  const L = 14, R = () => cv.w - 14, X = (x) => L + (x / 20) * (R() - L);
  const stats = () => { const s = v.slice().sort((a, b) => a - b), n = v.length, m = v.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / n); return { s, m, med: s[(n - 1) / 2], sd, q1: s[2], q3: s[8] }; };
  const yOf = (i, s) => { const k = s.indexOf(v[i]); return 0; };
  const ys = () => { const used = {}; return v.map((x) => { const key = Math.round(x * 3); used[key] = (used[key] || 0) + 1; return used[key]; }); };
  drag(cv, () => { const st = ys(); return v.map((x, i) => [X(x), cv.h * 0.7 - st[i] * 13]); }, (i, px) => { v[i] = Math.max(0, Math.min(20, ((px - L) / (R() - L)) * 20)); cv.redraw(); show(); }, 14);
  function show() { const { m, med, sd } = stats(); out.innerHTML = `Mean = <b>${f2(m)}</b> · median = <b>${f2(med)}</b> · standard deviation σ = <b>${f2(sd)}</b> · range = ${f2(Math.max(...v) - Math.min(...v))}. ${m - med > 0.5 ? 'Mean is above the median: the data is pulled to the right (right-skewed).' : med - m > 0.5 ? 'Mean is below the median: pulled to the left.' : 'Mean and median agree: roughly symmetric.'} σ is the typical distance from the mean.`; }
  cv.draw = (ctx, w, h, col) => {
    const { m, med, sd } = stats(), base = h * 0.7, st = ys();
    ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.fillRect(X(m - sd), 20, X(m + sd) - X(m - sd), base - 20); ctx.globalAlpha = 1;
    line(ctx, [[L, base], [R(), base]], col.muted, 1.5); for (let t = 0; t <= 20; t += 5) { line(ctx, [[X(t), base], [X(t), base + 5]], col.muted, 1); text(ctx, String(t), X(t), base + 15, { color: col.muted, size: 10, align: 'center' }); }
    line(ctx, [[X(m), 22], [X(m), base]], col.s[0], 2.5); line(ctx, [[X(med), 22], [X(med), base]], col.s[1], 2.5, [6, 4]);
    v.forEach((x, i) => dot(ctx, X(x), base - st[i] * 13 + 0, 6, col.s[2], col.ink));
    text(ctx, `mean ${f2(m)}`, X(m) + (m >= med ? 5 : -5), 30, { color: col.s[0], size: 11, weight: 700, align: m >= med ? 'left' : 'right' }); text(ctx, `median ${f2(med)}`, X(med) + (m >= med ? -5 : 5), 46, { color: col.s[1], size: 11, weight: 700, align: m >= med ? 'right' : 'left' });
    text(ctx, 'band = mean ± σ · drag the dots', L, h - 8, { color: col.muted, size: 10 });
  };
  show();
}
