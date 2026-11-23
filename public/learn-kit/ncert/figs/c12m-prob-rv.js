// Class 12 Maths, Probability: a random variable X turns each outcome into a number, and its probability distribution lists P(X = x). The mean E(X) = sum of x P(X = x) is the
// long-run average. Pick an experiment, see the exact bars, then simulate: the orange bars (what happened) settle onto the blue ones and the sample mean onto E(X).
import { canvas, text, title, axes, line, row, button, choice, readout, rng } from '../../kit.js';

const EXP = {
  heads: { name: 'Heads in 3 tosses', xs: [0, 1, 2, 3], ps: [1, 3, 3, 1].map((v) => v / 8), draw: (r) => (r() < 0.5) + (r() < 0.5) + (r() < 0.5) },
  sum: { name: 'Sum of 2 dice', xs: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], ps: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((v) => v / 36), draw: (r) => 2 + Math.floor(r() * 6) + Math.floor(r() * 6) },
  max: { name: 'Larger of 2 dice', xs: [1, 2, 3, 4, 5, 6], ps: [1, 3, 5, 7, 9, 11].map((v) => v / 36), draw: (r) => 1 + Math.max(Math.floor(r() * 6), Math.floor(r() * 6)) },
};

export default function (host) {
  let key = 'heads', R = rng(7), cnt = {}, tot = 0, sum = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'The exact probability distribution of a random variable and a simulation that settles onto it' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'experiment', Object.entries(EXP).map(([k, v]) => [k, v.name]), key, (v) => { key = v; reset(); });
  const reset = () => { cnt = {}; tot = 0; sum = 0; go(); };
  const run = (n) => { const e = EXP[key]; for (let i = 0; i < n; i++) { const x = e.draw(R); cnt[x] = (cnt[x] || 0) + 1; tot++; sum += x; } go(); };
  button(ctl, 'Run 10 trials', () => run(10)); button(ctl, 'Run 500 trials', () => run(500)); button(ctl, 'Clear', reset);
  const go = () => {
    const e = EXP[key], m = e.xs.reduce((s, x, i) => s + x * e.ps[i], 0);
    ro.textContent = `E(X) = Σ x·P(X = x) = ${m.toFixed(3)}.  ${tot ? `After ${tot} trials the average is ${(sum / tot).toFixed(3)}.` : 'Press Run to simulate.'}  The probabilities add to ${e.ps.reduce((a, b) => a + b, 0).toFixed(2)}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const e = EXP[key], top = title(ctx, e.name + ': distribution of X', col), n = e.xs.length, pm = Math.max(...e.ps) * 1.2;
    const A = axes(ctx, w, h, col, { x: [e.xs[0] - 0.7, e.xs[n - 1] + 0.7], y: [0, pm], xlabel: 'value of X', ylabel: 'probability', l: 54, t: top + 8, b: 40, xt: e.xs, fy: (v) => v.toFixed(2) });
    const bw = (A.R - A.L) / (n + 1) * 0.5;
    e.xs.forEach((x, i) => {
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fillRect(A.X(x) - bw, A.Y(e.ps[i]), bw, A.B - A.Y(e.ps[i]));
      ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.strokeRect(A.X(x) - bw, A.Y(e.ps[i]), bw, A.B - A.Y(e.ps[i]));
      if (tot) { const f = (cnt[x] || 0) / tot; ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.85; ctx.fillRect(A.X(x), A.Y(f), bw, A.B - A.Y(f)); ctx.globalAlpha = 1; }
    });
    const m = e.xs.reduce((s, x, i) => s + x * e.ps[i], 0);
    line(ctx, [[A.X(m), A.T], [A.X(m), A.B]], col.s[3], 2, [5, 4]); text(ctx, `E(X) = ${m.toFixed(2)}`, A.X(m) + 5, A.T + 8, { color: col.s[3], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'blue: exact', A.L + 8, A.T + 8, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'orange: simulated', A.L + 8, A.T + 22, { color: col.s[1], size: 10.5, weight: 700 });
  };
  go();
}
