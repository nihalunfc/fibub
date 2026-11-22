// ROC and precision-recall for one fixed classifier (scores are bell curves: positives centred 1.5 higher than
// negatives). Move the threshold, and the class balance: the ROC curve never changes, but when positives are rare,
// precision collapses. That is why precision-recall is the honest picture for fraud, disease and anomaly detection.
import { canvas, text, row, slider, readout, title, axes, line, dot } from '../kit.js';

const phi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2), p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
const D = 1.5;
export default function (host) {
  let th = 0.8, prev = 0.3;
  const cv = canvas(host, { aspect: 1.45, max: 560, min: 400, label: 'ROC curve and precision-recall curve for a classifier with a threshold marker' });
  const ctl = row(host);
  slider(ctl, { label: 'Threshold', min: -2, max: 4, value: th, fmt: (v) => v.toFixed(2), oninput: (v) => { th = v; show(); } });
  slider(ctl, { label: 'Share that are positive', min: 0.005, max: 0.5, value: prev, log: true, fmt: (v) => (v * 100).toFixed(1) + '%', oninput: (v) => { prev = v; show(); } });
  const out = readout(host);
  const tpr = (t) => 1 - phi(t - D), fpr = (t) => 1 - phi(t);
  const prec = (t) => { const a = prev * tpr(t), b = (1 - prev) * fpr(t); return a + b ? a / (a + b) : 1; };
  function show() {
    const N = 10000, P = N * prev, TP = P * tpr(th), FN = P - TP, FP = (N - P) * fpr(th), TN = N - P - FP;
    out.innerHTML = `Per ${N.toLocaleString()} cases: TP <b>${Math.round(TP)}</b>, FN ${Math.round(FN)}, FP <b>${Math.round(FP)}</b>, TN ${Math.round(TN)}. Recall (TPR) <b>${(tpr(th) * 100).toFixed(0)}%</b>, false-positive rate ${(fpr(th) * 100).toFixed(1)}%, precision <b>${(prec(th) * 100).toFixed(0)}%</b>. ${prev < 0.05 ? 'Positives are rare, so even a small false-positive rate buries the few true ones: look at precision.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const half = Math.round(h / 2);
    title(ctx, 'ROC (left to right: lower the threshold)', col);
    const draw = (oy, hh, X, Y, ptsF, mk, xl, yl, base) => {
      ctx.save(); ctx.translate(0, oy);
      const ax = axes(ctx, w, hh, col, { x: [0, 1], y: [0, 1], xlabel: xl, ylabel: yl, t: oy ? 24 : 26, b: 34, l: 46, r: 16, fx: (v) => v.toFixed(1), fy: (v) => v.toFixed(1) });
      if (base) line(ctx, base(ax), col.muted, 1, [4, 4]);
      const pts = []; for (let t = 5; t >= -3; t -= 0.05) pts.push(ptsF(t, ax));
      line(ctx, pts, col.s[0], 2.5);
      const [mx, my] = mk(th, ax); dot(ctx, mx, my, 6, col.s[1], col.ink);
      ctx.restore();
    };
    draw(0, half, null, null, (t, ax) => [ax.X(fpr(t)), ax.Y(tpr(t))], (t, ax) => [ax.X(fpr(t)), ax.Y(tpr(t))], 'false-positive rate', 'recall (TPR)', (ax) => [[ax.X(0), ax.Y(0)], [ax.X(1), ax.Y(1)]]);
    draw(half, h - half, null, null, (t, ax) => [ax.X(tpr(t)), ax.Y(prec(t))], (t, ax) => [ax.X(tpr(th)), ax.Y(prec(th))], 'recall', 'precision', (ax) => [[ax.X(0), ax.Y(prev)], [ax.X(1), ax.Y(prev)]]);
    text(ctx, 'Precision-recall (dashed = guessing)', 10, half + 12, { color: col.ink, size: 12, weight: 700 });
  };
  show();
}
