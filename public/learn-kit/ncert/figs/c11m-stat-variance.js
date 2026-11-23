// Class 11 Maths, Statistics: variance as an average of squares. For each value the square has side |x - mean|; the variance is the average area, SD its square root.
// Adding the same number to every value slides the data but keeps every square, so the SD stays the same. Multiplying every value by m multiplies each side by m, the SD by m and the variance by m².
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  const D0 = [4, 6, 7, 9, 14]; let sh = 0, mu = 1; const N = 5;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 310, label: 'Data dots on a number line with one square per value whose side is its distance from the mean' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'add k to every value', min: -4, max: 20, step: 1, value: sh, fmt: (v) => 'k = ' + v, oninput: (v) => { sh = v; cv.redraw(); } });
  slider(ctl, { label: 'multiply every value by m', min: 0.5, max: 3, step: 0.5, value: mu, fmt: (v) => 'm = ' + v, oninput: (v) => { mu = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Variance = the average square of the deviations', col), D = D0.map((v) => v * mu + sh), mean = D.reduce((a, b) => a + b, 0) / N, LO = -6, HI = 58, X = (v) => 14 + ((v - LO) / (HI - LO)) * (w - 28);
    const ny = top + 34;
    for (let v = 0; v <= 50; v += 10) { line(ctx, [[X(v), ny - 12], [X(v), ny + 6]], col.line, 1); text(ctx, String(v), X(v), ny + 15, { color: col.muted, size: 10, align: 'center' }); }
    line(ctx, [[X(LO), ny], [X(HI), ny]], col.muted, 1.5); line(ctx, [[X(mean), ny - 20], [X(mean), ny + 6]], col.s[3], 2.4);
    D.forEach((v) => dot(ctx, X(v), ny, 6, col.s[0], col.panel));
    text(ctx, 'mean ' + +mean.toFixed(2), X(mean), ny - 26, { color: col.s[3], size: 11, weight: 800, align: 'center', halo: col.panel });
    const devs = D.map((v) => v - mean), Sa = D0.map((v) => v * 3), mm = Sa.reduce((a, b) => a + b, 0) / N, kk = (w - 40) / Sa.reduce((a, b) => a + Math.abs(b - mm), 0) * 0.92, base = h - 16;
    let x = 14;
    devs.forEach((d, i) => { const s = Math.abs(d) * kk; ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[i % 5]; ctx.fillRect(x, base - s, s, s); ctx.restore(); ctx.strokeStyle = col.s[i % 5]; ctx.lineWidth = 1.5; ctx.strokeRect(x, base - s, s, s); if (s > 26) text(ctx, +(d * d).toFixed(1), x + s / 2, base - s / 2, { color: col.ink, size: 11, weight: 700, align: 'center' }); x += s + 4; });
    const va = devs.reduce((a, d) => a + d * d, 0) / N, sd = Math.sqrt(va), md = devs.reduce((a, d) => a + Math.abs(d), 0) / N;
    text(ctx, 'Squares (area = deviation²):', 14, base - Math.max(...devs.map((d) => Math.abs(d))) * kk - 10, { color: col.muted, size: 11 });
    ro.innerHTML = `Values: ${D.map((v) => +v.toFixed(1)).join(', ')}. Mean <b>${+mean.toFixed(2)}</b>. Variance = (${devs.map((d) => +(d * d).toFixed(1)).join(' + ')}) ÷ 5 = <b>${+va.toFixed(2)}</b>; SD = <b>${+sd.toFixed(3)}</b>; mean deviation ${+md.toFixed(2)}. ${sh && mu === 1 ? 'Shifting moved the mean but not the SD.' : mu !== 1 ? `Scaling by ${mu} multiplied the SD by ${mu} (and the variance by ${mu * mu}).` : 'Try k or m.'}`;
  };
  cv.redraw();
}
