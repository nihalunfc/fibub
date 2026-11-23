// Class 11 Maths, Statistics: grouped data. Drag the top of a bar to change a class frequency. Each class is represented by its class mark x (the middle).
// Mean = sum(f x)/n, variance = sum(f (x - mean)²)/n = sum(f x²)/n - mean², SD = sqrt(variance). The shaded band is mean ± SD.
import { canvas, text, title, line, dot, row, readout, button } from '../../kit.js';
import { drag } from '../c12m-lib.js';

export default function (host) {
  const F0 = [3, 7, 12, 6, 2]; let F = [...F0]; const XM = [5, 15, 25, 35, 45], YM = 16; let G = null;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A histogram of five classes with draggable frequencies, and the mean, variance and standard deviation of the grouped data' });
  const ro = readout(host), ctl = row(host);
  button(ctl, 'Reset', () => { F = [...F0]; cv.redraw(); });
  button(ctl, 'Make it lopsided', () => { F = [10, 8, 4, 2, 1]; cv.redraw(); });
  const geom = (w, h) => { const L = 34, R = w - 12, T = 42, B = h - 96; return { L, R, T, B, X: (v) => L + (v / 50) * (R - L), Y: (v) => B - (v / YM) * (B - T) }; };
  drag(cv, () => (G ? F.map((f, i) => ({ x: G.X(XM[i]), y: G.Y(f) })) : []), (i, px, py) => { F[i] = Math.max(0, Math.min(YM, Math.round(((G.B - py) / (G.B - G.T)) * YM))); cv.redraw(); }, 24);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Grouped data: drag the bar tops', col); G = geom(w, h); const { L, R, T, B, X, Y } = G;
    for (let v = 0; v <= YM; v += 4) { line(ctx, [[L, Y(v)], [R, Y(v)]], col.line, 1); text(ctx, String(v), L - 5, Y(v), { color: col.muted, size: 10, align: 'right' }); }
    const n = F.reduce((a, b) => a + b, 0), mean = n ? F.reduce((a, f, i) => a + f * XM[i], 0) / n : 0, va = n ? F.reduce((a, f, i) => a + f * (XM[i] - mean) ** 2, 0) / n : 0, sd = Math.sqrt(va);
    if (n) { ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[2]; ctx.fillRect(X(mean - sd), T - 6, X(mean + sd) - X(mean - sd), B - T + 6); ctx.restore(); }
    F.forEach((f, i) => { const x0 = X(i * 10), x1 = X(i * 10 + 10); ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = col.s[0]; ctx.fillRect(x0 + 1, Y(f), x1 - x0 - 2, B - Y(f)); ctx.restore(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + 1, Y(f), x1 - x0 - 2, B - Y(f)); dot(ctx, X(XM[i]), Y(f), 7, col.s[3], col.panel); text(ctx, String(f), X(XM[i]), Y(f) - 14, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); });
    for (let i = 0; i <= 5; i++) text(ctx, String(i * 10), X(i * 10), B + 11, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'class marks 5, 15, 25, 35, 45', (L + R) / 2, B + 25, { color: col.muted, size: 10.5, align: 'center' });
    if (n) line(ctx, [[X(mean), T - 6], [X(mean), B]], col.s[1], 2.2);
    const g = (v) => (+v.toFixed(2)).toString();
    text(ctx, `n = ${n}   mean = ${g(mean)}`, 14, B + 44, { color: col.ink, size: 12.5, weight: 800 });
    text(ctx, `variance = ${g(va)}   SD = ${g(sd)}`, 14, B + 62, { color: col.s[2], size: 12.5, weight: 800 });
    ro.textContent = n ? `Σfx = ${F.reduce((a, f, i) => a + f * XM[i], 0)}, Σf(x − mean)² = ${g(va * n)}. The orange line is the mean; the green band is mean ± SD.` : 'Raise at least one bar.';
  };
  cv.redraw();
}
