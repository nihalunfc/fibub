// Class 11 Maths, Statistics: mean deviation about any point c is (sum of |x - c|)/n. Slide c along the line: the total of the bars is smallest when c is the median.
// A big outlier drags the mean away from the middle, but the median stays put, so the mean deviation about the median is the smaller of the two.
import { canvas, text, title, line, dot, row, slider, readout, choice, button } from '../../kit.js';

const SETS = { A: [4, 6, 7, 9, 14], B: [2, 4, 6, 8, 40] };
export default function (host) {
  let k = 'A', c = 10; const N = 5;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Five data values with bars showing their distance from a movable centre point, and the mean deviation about that point' });
  const ctl = row(host), ro = readout(host);
  const sl = slider(ctl, { label: 'centre point c', min: 0, max: 42, step: 0.5, value: c, fmt: (v) => v, oninput: (v) => { c = v; cv.redraw(); } });
  choice(ctl, 'Data', [['A', 'A: 4 6 7 9 14'], ['B', 'B: 2 4 6 8 40']], k, (v) => { k = v; cv.redraw(); });
  const stats = () => { const d = SETS[k]; return { d, mean: d.reduce((a, b) => a + b, 0) / N, med: [...d].sort((a, b) => a - b)[2] }; };
  button(ctl, 'Go to mean', () => { c = stats().mean; sl.set(c); cv.redraw(); });
  button(ctl, 'Go to median', () => { c = stats().med; sl.set(c); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Mean deviation about c: Σ|x − c| ÷ n', col), { d, mean, med } = stats(), HI = 42, X = (v) => 16 + (v / HI) * (w - 32), Y = (i) => top + 26 + i * 36;
    const y1 = Y(N - 1) + 16;
    for (let v = 0; v <= HI; v += 10) { line(ctx, [[X(v), top + 6], [X(v), y1]], col.line, 1); text(ctx, String(v), X(v), y1 + 11, { color: col.muted, size: 10.5, align: 'center' }); }
    d.forEach((v, i) => line(ctx, [[X(c), Y(i)], [X(v), Y(i)]], col.s[1], 4));
    d.forEach((v, i) => { dot(ctx, X(v), Y(i), 7, col.s[0], col.panel); text(ctx, String(v), X(v), Y(i) - 13, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel }); });
    line(ctx, [[X(c), top + 6], [X(c), y1]], col.s[3], 2.4);
    text(ctx, 'c', X(c), top + 2, { color: col.s[3], size: 12, weight: 800, align: 'center' });
    ctx.save(); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(X(mean), y1 + 24); ctx.lineTo(X(mean) - 6, y1 + 36); ctx.lineTo(X(mean) + 6, y1 + 36); ctx.fill(); ctx.fillStyle = col.s[5]; ctx.beginPath(); ctx.moveTo(X(med), y1 + 24); ctx.lineTo(X(med) - 6, y1 + 36); ctx.lineTo(X(med) + 6, y1 + 36); ctx.fill(); ctx.restore();
    text(ctx, `mean ${+mean.toFixed(2)}`, X(mean) + (mean >= med ? 9 : -9), y1 + 32, { color: col.s[2], size: 11, weight: 700, align: mean >= med ? 'left' : 'right' });
    text(ctx, `median ${med}`, X(med) + (mean >= med ? -9 : 9), y1 + 32, { color: col.s[5], size: 11, weight: 700, align: mean >= med ? 'right' : 'left' });
    const tot = d.reduce((a, b) => a + Math.abs(b - c), 0), mdm = d.reduce((a, b) => a + Math.abs(b - mean), 0) / N, mdd = d.reduce((a, b) => a + Math.abs(b - med), 0) / N;
    ro.innerHTML = `Σ|x − c| = ${+tot.toFixed(2)}, so mean deviation about c = <b>${+(tot / N).toFixed(3)}</b>. About the mean ${+mean.toFixed(2)}: ${+mdm.toFixed(3)}. About the median ${med}: <b>${+mdd.toFixed(3)}</b>, the smallest possible.`;
  };
  cv.redraw();
}
