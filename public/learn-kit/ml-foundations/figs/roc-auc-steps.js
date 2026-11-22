// 4.6 ROC curves: lower the threshold one patient at a time. Left, six risk scores (P = has the condition,
// N = does not) with the threshold line; right, the ROC points traced so far and the area under them.
import { canvas, text, line, dot, axes, title } from '../../kit.js';

const S = [[0.95, 1], [0.8, 1], [0.7, 0], [0.55, 1], [0.4, 0], [0.1, 0]];
const TH = [1.0, 0.8, 0.7, 0.55, 0.1];
const roc = (t) => { const tp = S.filter(([s, y]) => y && s >= t).length, fp = S.filter(([s, y]) => !y && s >= t).length; return [fp / 3, tp / 3]; };
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'Six risk scores with a threshold, and the ROC curve it traces' });
  let step = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Lower the threshold, trace the curve', col) + 6;
    const sw = Math.min(150, w * 0.36), x0 = 16, B = h - 36, T = top + 6;
    const Y = (s) => B - s * (B - T);
    line(ctx, [[x0 + 30, T], [x0 + 30, B]], col.line, 2);
    text(ctx, 'score', x0 + 30, h - 18, { color: col.muted, size: 11, align: 'center' });
    const t = TH[step];
    S.forEach(([s, y]) => {
      const on = s >= t;
      dot(ctx, x0 + 30, Y(s), 9, y ? col.s[0] : col.s[1], on ? col.ink : null);
      text(ctx, y ? 'P' : 'N', x0 + 30, Y(s) + 0.5, { color: '#fff', size: 10, weight: 700, align: 'center' });
      text(ctx, s.toFixed(2), x0 + 46, Y(s), { color: on ? col.ink : col.muted, size: 11, weight: on ? 700 : 400 });
    });
    const ty = step === 0 ? T - 4 : Y(t) + 11;
    line(ctx, [[x0, ty], [x0 + sw - 20, ty]], col.s[3], 2, [5, 4]);
    text(ctx, step === 0 ? 'flag nothing' : `flag ≥ ${t}`, x0 + sw - 22, ty + (step === 0 ? 10 : 10), { color: col.ink, size: 10.5, weight: 600, align: 'right', halo: col.panel });
    // ROC panel
    const ox = x0 + sw + 10, size = Math.min(w - ox - 14, B - T);
    const a = axes(ctx, ox + size + 14, h, col, { l: ox + 30, r: 14, t: T, b: h - B, x: [0, 1], y: [0, 1], xt: [0, 0.5, 1], yt: [0, 0.5, 1], xlabel: '', fx: (v) => String(v), fy: (v) => String(v) });
    text(ctx, 'FPR (false alarms)', (a.L + a.R) / 2, h - 8, { color: col.ink, size: 11, weight: 600, align: 'center' });
    text(ctx, 'TPR', a.L - 6, T - 4, { color: col.ink, size: 11, weight: 600, align: 'right' });
    line(ctx, [[a.X(0), a.Y(0)], [a.X(1), a.Y(1)]], col.line, 1, [4, 4]);
    const pts = TH.slice(0, step + 1).map(roc), path = [];
    pts.forEach(([fx, ty2], i) => { if (i) path.push([a.X(fx), a.Y(pts[i - 1][1])]); path.push([a.X(fx), a.Y(ty2)]); });
    if (step === TH.length - 1) {
      ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(a.X(0), a.Y(0));
      path.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(a.X(1), a.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      text(ctx, 'area = 8/9 ≈ 0.89', a.X(0.55), a.Y(0.35), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    }
    line(ctx, path, col.s[2], 2.5);
    pts.forEach(([fx, ty2], i) => dot(ctx, a.X(fx), a.Y(ty2), i === step ? 5 : 3.5, col.s[2]));
    const [fx, ty2] = pts[step];
    text(ctx, `(${fx.toFixed(2)}, ${ty2.toFixed(2)})`, a.X(fx) + 8, a.Y(ty2) + 14, { color: col.ink, size: 11, weight: 600, halo: col.panel });
  };
  cv.redraw();
  return { step(i) { step = Math.min(TH.length - 1, i); cv.redraw(); } };
}
