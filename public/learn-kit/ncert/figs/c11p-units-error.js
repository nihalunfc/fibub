// Class 11 Units and Measurement: accuracy, precision and errors. A pendulum's period (true value 2.00 s) is timed with a stopwatch. Random scatter is shrunk by
// averaging more readings (precision improves); a zero error shifts every reading by the same amount, so the mean stays off the true value (accuracy is poor)
// whatever you do. Mean absolute error = average of |reading - mean|; relative error = mean absolute error / mean.
import { canvas, text, title, line, dot, row, slider, choice, readout, rng } from '../../kit.js';

export default function (host) {
  let n = 5, bias = 0;
  const T0 = 2.0, noise = (() => { const r = rng(7), a = []; for (let i = 0; i < 20; i++) a.push((r() + r() + r() - 1.5) * 0.24); return a; })();
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Repeated timing readings on a line with the mean and the true value' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Number of readings', min: 1, max: 20, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; go(); } });
  choice(ctl, 'Stopwatch', [[0, 'No zero error'], [0.15, 'Starts 0.15 s late']], 0, (v) => { bias = v; go(); });
  const rd = () => noise.slice(0, n).map((x) => +(T0 + bias + x).toFixed(2));
  function go() {
    const a = rd(), mean = a.reduce((p, q) => p + q, 0) / n, dev = a.map((x) => Math.abs(x - mean)), mad = dev.reduce((p, q) => p + q, 0) / n;
    out.innerHTML = `Mean = <b>${mean.toFixed(3)} s</b>, mean absolute error = <b>${mad.toFixed(3)} s</b>, relative error = <b>${(mad / mean * 100).toFixed(1)} %</b>. Distance from the true value (2.00 s): <b>${Math.abs(mean - T0).toFixed(3)} s</b>. ${bias ? 'Averaging cannot remove a systematic (zero) error: the cluster is tight but sits in the wrong place.' : 'More readings make the mean settle near the true value.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Timing a pendulum: readings on a line', col);
    const a = rd(), mean = a.reduce((p, q) => p + q, 0) / n, L = 24, R = w - 24, X = (v) => L + ((v - 1.7) / 0.7) * (R - L), y = h * 0.55;
    line(ctx, [[L, y], [R, y]], col.ink, 2);
    for (let v = 1.7; v <= 2.401; v += 0.1) { line(ctx, [[X(v), y], [X(v), y + 6]], col.ink, 1); if (Math.round(v * 10) % 2 === 0) text(ctx, v.toFixed(1), X(v), y + 17, { size: 10, color: col.muted, align: 'center' }); }
    text(ctx, 'period (s)', w / 2, y + 36, { size: 11, color: col.muted, align: 'center' });
    line(ctx, [[X(T0), y - 80], [X(T0), y + 2]], col.s[2], 2.5, [6, 4]); text(ctx, 'true 2.00', X(T0), y - 90, { size: 11, weight: 700, color: col.s[2], align: 'center' });
    const dev = a.reduce((p, q) => p + Math.abs(q - mean), 0) / n; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(X(mean - dev), y - 70, X(mean + dev) - X(mean - dev), 68); ctx.globalAlpha = 1;
    a.forEach((v, i) => dot(ctx, X(v), y - 14 - (i % 4) * 11, 4.5, col.s[0], col.panel));
    line(ctx, [[X(mean), y - 72], [X(mean), y + 2]], col.s[3], 3); text(ctx, 'mean ' + mean.toFixed(2), X(mean), y - 82 - (Math.abs(mean - T0) < 0.09 ? 12 : 0), { size: 11, weight: 700, color: col.s[3], align: 'center' });
    text(ctx, 'shaded band = mean ± mean absolute error', w / 2, h - 12, { size: 10.5, color: col.muted, align: 'center' });
  };
  go();
}
