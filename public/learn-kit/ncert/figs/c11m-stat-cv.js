// Class 11 Maths, Statistics: comparing two series with the coefficient of variation CV = (SD / mean) x 100. Two bell-shaped sets of marks: the one with the smaller CV is more consistent.
// A larger SD alone does not mean "more spread out" in a fair comparison if the mean is also larger.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  const S = { ma: 60, sa: 9, mb: 40, sb: 5 };
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Two bell curves for two sets of marks with their means, standard deviations and coefficients of variation' });
  const ctl = row(host), ro = readout(host);
  [['ma', 'Mean of A', 20, 90, 5], ['sa', 'SD of A', 2, 20, 1], ['mb', 'Mean of B', 20, 90, 5], ['sb', 'SD of B', 2, 20, 1]].forEach(([k, l, a, b, st]) => slider(ctl, { label: l, min: a, max: b, step: st, value: S[k], fmt: String, oninput: (v) => { S[k] = v; cv.redraw(); } }));
  const pdf = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Which set of marks is more consistent?', col), L = 14, R = w - 14, B = h - 40, T = top + 14, X = (v) => L + (v / 100) * (R - L);
    const peak = Math.max(1 / S.sa, 1 / S.sb) / Math.sqrt(2 * Math.PI), Y = (d) => B - (d / peak) * (B - T) * 0.95;
    for (let v = 0; v <= 100; v += 20) { line(ctx, [[X(v), B], [X(v), B + 4]], col.muted, 1); text(ctx, String(v), X(v), B + 14, { color: col.muted, size: 10.5, align: 'center' }); }
    line(ctx, [[L, B], [R, B]], col.muted, 1.5);
    [[S.ma, S.sa, col.s[0], 'A'], [S.mb, S.sb, col.s[3], 'B']].forEach(([m, s, c, nm]) => {
      ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(X(0), B); for (let v = 0; v <= 100; v += 1) ctx.lineTo(X(v), Y(pdf(v, m, s))); ctx.lineTo(X(100), B); ctx.fill(); ctx.restore();
      ctx.strokeStyle = c; ctx.lineWidth = 2.4; ctx.beginPath(); for (let v = 0; v <= 100; v += 1) (v ? ctx.lineTo : ctx.moveTo).call(ctx, X(v), Y(pdf(v, m, s))); ctx.stroke();
      line(ctx, [[X(m), B], [X(m), Y(pdf(m, m, s))]], c, 1.2, [4, 3]); text(ctx, nm, X(m), Y(pdf(m, m, s)) - 9, { color: c, size: 14, weight: 800, align: 'center', halo: col.panel });
    });
    const cva = (S.sa / S.ma) * 100, cvb = (S.sb / S.mb) * 100;
    text(ctx, `CV of A = ${S.sa}/${S.ma} × 100 = ${cva.toFixed(1)}%`, 14, h - 24, { color: col.s[0], size: 12, weight: 800 });
    text(ctx, `CV of B = ${S.sb}/${S.mb} × 100 = ${cvb.toFixed(1)}%`, 14, h - 8, { color: col.s[3], size: 12, weight: 800 });
    ro.innerHTML = Math.abs(cva - cvb) < 0.05 ? 'The two sets are <b>equally consistent</b> (same CV).' : `<b>${cva < cvb ? 'A' : 'B'} is more consistent</b>: its CV is smaller. ${(S.sa > S.sb) === (cva < cvb) ? 'Notice that its SD is the larger one: the bigger mean makes up for it, which is why we compare CV and not SD.' : ''}`;
  };
  cv.redraw();
}
