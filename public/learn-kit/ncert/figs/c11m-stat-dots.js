// Class 11 Maths, Statistics: measures of dispersion on a dot plot. Drag the seven dots. The mean is the balance point; each blue bar is a deviation |x - mean|.
// Range = largest - smallest. Mean deviation = (sum of |x - mean|)/n. Variance = (sum of (x - mean)²)/n and standard deviation = sqrt(variance); the shaded band is mean ± one SD.
import { canvas, text, title, line, dot, row, readout, button } from '../../kit.js';
import { drag } from '../c12m-lib.js';

export default function (host) {
  const D0 = [4, 6, 9, 10, 11, 14, 16]; let D = [...D0]; const N = 7, LO = 0, HI = 20; let M = null;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'Seven draggable dots with their mean, deviations, range, mean deviation, variance and standard deviation' });
  const ro = readout(host), ctl = row(host);
  button(ctl, 'Reset', () => { D = [...D0]; cv.redraw(); });
  button(ctl, 'Squeeze together', () => { D = D.map((v) => Math.round((v + 10) / 2 * 2) / 2); cv.redraw(); });
  button(ctl, 'Spread out', () => { D = D.map((v) => Math.max(LO, Math.min(HI, Math.round((10 + (v - 10) * 1.5) * 2) / 2))); cv.redraw(); });
  const top0 = () => 40, RH = 27, X = (v, w) => 16 + ((v - LO) / (HI - LO)) * (w - 32), Y = (i) => top0() + 10 + i * RH;
  drag(cv, () => (M ? D.map((v, i) => ({ x: X(v, M.w), y: Y(i) })) : []), (i, px) => { D[i] = Math.max(LO, Math.min(HI, Math.round(((px - 16) / (M.w - 32)) * (HI - LO) * 2) / 2 + LO)); cv.redraw(); }, 22);
  cv.draw = (ctx, w, h, col) => {
    M = { w }; const top = title(ctx, 'Drag the dots: mean, deviations, SD', col);
    const mean = D.reduce((a, b) => a + b, 0) / N, md = D.reduce((a, b) => a + Math.abs(b - mean), 0) / N, va = D.reduce((a, b) => a + (b - mean) ** 2, 0) / N, sd = Math.sqrt(va), mn = Math.min(...D), mx = Math.max(...D);
    const y0 = Y(0) - 12, y1 = Y(N - 1) + 14;
    ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[2]; ctx.fillRect(X(mean - sd, w), y0, X(mean + sd, w) - X(mean - sd, w), y1 - y0); ctx.restore();
    for (let v = LO; v <= HI; v += 5) { line(ctx, [[X(v, w), y0], [X(v, w), y1 + 4]], col.line, 1); text(ctx, String(v), X(v, w), y1 + 14, { color: col.muted, size: 10.5, align: 'center' }); }
    line(ctx, [[X(mean, w), y0], [X(mean, w), y1]], col.s[3], 2.2);
    D.forEach((v, i) => { line(ctx, [[X(mean, w), Y(i)], [X(v, w), Y(i)]], col.s[1], 3); });
    D.forEach((v, i) => dot(ctx, X(v, w), Y(i), 7, col.s[0], col.panel));
    text(ctx, 'mean ' + (+mean.toFixed(2)), X(mean, w), y0 - 6, { color: col.s[3], size: 11.5, weight: 800, align: 'center', halo: col.panel });
    const ry = y1 + 28; line(ctx, [[X(mn, w), ry], [X(mx, w), ry]], col.ink, 2); line(ctx, [[X(mn, w), ry - 4], [X(mn, w), ry + 4]], col.ink, 2); line(ctx, [[X(mx, w), ry - 4], [X(mx, w), ry + 4]], col.ink, 2);
    text(ctx, `range = ${mx} − ${mn} = ${mx - mn}`, w / 2, ry + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const ty = ry + 36, g = (v) => (+v.toFixed(2)).toString();
    text(ctx, `mean deviation = ${g(md)}`, 14, ty, { color: col.s[1], size: 13, weight: 800 });
    text(ctx, `variance = ${g(va)}`, 14, ty + 20, { color: col.ink, size: 13, weight: 800 });
    text(ctx, `standard deviation = ${g(sd)}`, 14, ty + 40, { color: col.s[2], size: 13, weight: 800 });
    ro.textContent = `Dots: ${[...D].sort((a, b) => a - b).join(', ')}. The shaded band is mean ± SD = ${g(mean - sd)} to ${g(mean + sd)}. The nearer the dots huddle together, the smaller every measure becomes.`;
  };
  cv.redraw();
}
