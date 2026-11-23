// Class 11 Maths, Probability: relative frequency settles down. Repeat an experiment many times; the fraction of successes wobbles at first and then settles near the
// theoretical probability (coin: 1/2, six on a die: 1/6, sum 7 on two dice: 1/6). This is why we trust probabilities as long-run fractions. Seeded random numbers: same run every visit.
import { canvas, text, title, line, row, readout, choice, button, loop, rng, axes } from '../../kit.js';

const EXP = { coin: ['Head on a coin', 1 / 2, (r) => r() < 0.5, [0, 1]], six: ['Six on a die', 1 / 6, (r) => Math.floor(r() * 6) === 5, [0, 0.5]], s7: ['Sum 7 on two dice', 1 / 6, (r) => Math.floor(r() * 6) + Math.floor(r() * 6) === 5, [0, 0.5]] };
export default function (host) {
  let k = 'coin', R = rng(7), n = 0, s = 0, hist = [];
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A graph of the fraction of successes against the number of trials, settling near the theoretical probability' });
  const ctl = row(host), ro = readout(host);
  const reset = () => { R = rng(7); n = 0; s = 0; hist = []; cv.redraw(); };
  choice(ctl, 'Experiment', Object.entries(EXP).map(([i, v]) => [i, v[0]]), k, (v) => { k = v; reset(); });
  const run = (m) => { for (let i = 0; i < m; i++) { n++; if (EXP[k][2](R)) s++; hist.push(s / n); } };
  const an = loop(host, (dt) => { run(Math.max(1, Math.round(dt * (n < 100 ? 20 : n < 1000 ? 150 : 600)))); if (n >= 5000) an.pause(); cv.redraw(); }, { autoplay: false });
  an.button(ctl); button(ctl, '+100 trials', () => { run(100); cv.redraw(); }); button(ctl, 'Reset', reset);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Relative frequency: ' + EXP[k][0], col), E = EXP[k], p = E[1], A = axes(ctx, w, h, col, { x: [1, 5000], y: E[3], xlog: true, xlabel: 'number of trials (log scale)', l: 40, t: top + 4, b: 36, fy: (v) => +v.toFixed(2) });
    line(ctx, [[A.L, A.Y(p)], [A.R, A.Y(p)]], col.s[1], 1.6, [5, 4]);
    text(ctx, `theory ${+p.toFixed(3)}`, A.R - 4, A.Y(p) - 9, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
    if (hist.length > 1) { ctx.save(); A.clip(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); hist.forEach((v, i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, A.X(i + 1), A.Y(v))); ctx.stroke(); ctx.restore(); }
    ro.innerHTML = n ? `After <b>${n}</b> trials: ${s} successes, relative frequency <b>${(s / n).toFixed(4)}</b> (theory ${p.toFixed(4)}, gap ${Math.abs(s / n - p).toFixed(4)}). Early on the line jumps about; later it hugs the theory.` : 'Press Play or +100 trials.';
  };
  run(25); cv.redraw();
}
