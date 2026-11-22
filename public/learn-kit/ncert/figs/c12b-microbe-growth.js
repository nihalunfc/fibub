// Class 12 Microbes in Human Welfare: the four phases of a bacterial growth curve in a closed culture. Lag (cells adjust), log or exponential (doubling every g minutes: N = N0 x 2^(t/g)),
// stationary (food runs out or waste builds up, so growth = death) and decline. Slide the doubling time and the food supply; switch the y axis to a log scale to see the log phase as a straight line.
import { canvas, text, title, axes, line, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let g = 30, food = 0.6, log = false;
  const LAG = 2, TMAX = 24, N0 = 1e3;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Growth curve of bacteria with lag, log, stationary and decline phases' });
  const ctl = row(host), ctl2 = row(host), ro = readout(host);
  slider(ctl, { label: 'Doubling time', min: 20, max: 120, step: 5, value: g, fmt: (v) => v + ' min', oninput: (v) => { g = v; go(); } });
  slider(ctl, { label: 'Food in the flask', min: 0.2, max: 1, step: 0.05, value: food, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { food = v; go(); } });
  choice(ctl2, 'Vertical scale', [['lin', 'Linear'], ['log', 'Log']], 'lin', (v) => { log = v === 'log'; go(); });
  const K = () => 1e9 * food;
  const tK = () => LAG + (g / 60) * Math.log2(K() / N0);               // hours when the culture reaches the food limit
  const N = (t) => { if (t < LAG) return N0; const te = tK(); if (t < te) return N0 * 2 ** ((t - LAG) * 60 / g); if (t < te + 5) return K(); return K() * Math.exp(-0.25 * (t - te - 5)); };
  const go = () => {
    const te = tK(), n = Math.log2(K() / N0);
    ro.textContent = `Lag about ${LAG} h. Log phase: doubling every ${g} min, ${n.toFixed(1)} doublings from ${N0.toExponential(0)} to ${K().toExponential(1)} cells in ${(te - LAG).toFixed(1)} h (N = N0 × 2^n). The stationary phase starts at ${te.toFixed(1)} h when the food limit is reached.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Growth curve of a bacterial culture', col), te = tK();
    const A = axes(ctx, w, h, col, { x: [0, TMAX], y: log ? [1e2, 1e10] : [0, 1e9], ylog: log, xlabel: 'time (hours)', ylabel: 'cells per mL', l: 62, t: t0 + 8, b: 40, xt: [0, 6, 12, 18, 24], fy: (v) => (v === 0 ? '0' : v.toExponential(0).replace('e+', 'e')) });
    const shade = (a, b, c, lab) => { ctx.save(); A.clip(); ctx.fillStyle = c; ctx.globalAlpha = 0.12; ctx.fillRect(A.X(Math.min(a, TMAX)), A.T, Math.max(0, A.X(Math.min(b, TMAX)) - A.X(Math.min(a, TMAX))), A.B - A.T); ctx.restore(); if (A.X(Math.min(b, TMAX)) - A.X(a) > 26) text(ctx, lab, (A.X(a) + A.X(Math.min(b, TMAX))) / 2, A.B - 10, { color: c, size: 10.5, weight: 700, align: 'center' }); };
    shade(0, LAG, col.muted, 'lag'); shade(LAG, te, col.s[0], 'log'); shade(te, te + 5, col.s[2], 'stationary'); shade(te + 5, TMAX, col.bad, 'decline');
    const pts = []; for (let t = 0; t <= TMAX; t += 0.1) pts.push([A.X(t), A.Y(Math.max(N(t), log ? 1e2 : 0))]);
    ctx.save(); A.clip(); line(ctx, pts, col.s[3], 3); ctx.restore();
  };
  go();
}
