// Class 12 Nuclei (step player): the law of radioactive decay. Each nucleus has the same small chance lambda per second of decaying, so the rate of decay is proportional to how many are
// left: dN/dt = -lambda N. Integrating gives N = N0 e^(-lambda t). Half-life T = ln2 / lambda and mean life tau = 1/lambda = 1.44 T. Steps build the graph and mark T and tau.
import { canvas, text, title, axes, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0;
  const lam = Math.LN2 / 10, N0 = 100;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 310, label: 'Decay curve built step by step from the rule that the decay rate is proportional to the number of nuclei' });
  const TITLES = ['Decay is random but fair', 'Rate is proportional to N', 'Solve the equation', 'The exponential curve', 'Half-life', 'Mean life and activity'];
  let t = 0; loop(host, (dt) => { t += dt; if (step === 1) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col), T = 1 / lam;
    const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, 100], xlabel: 'time t (arbitrary units)', ylabel: 'nuclei left N', l: 42, t: top + 12, b: 84 });
    const N = (x) => N0 * Math.exp(-lam * x);
    if (step >= 2) { const pts = []; for (let x = 0; x <= 40; x += 0.5) pts.push([A.X(x), A.Y(N(x))]); ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore(); }
    if (step === 0 || step === 1) { const x = ((t * 6) % 40), y = N(x); dot(ctx, A.X(x), A.Y(y), 5, col.s[3], col.panel); if (step === 1) { const sl = -lam * y; const dx = 6, dy = sl * dx * 1; line(ctx, [[A.X(x - dx), A.Y(y - dy)], [A.X(x + dx), A.Y(y + dy)]], col.s[2], 3); } }
    if (step === 4) { [10, 20, 30].forEach((x, i) => { const y = N0 / 2 ** (i + 1); ctx.setLineDash([4, 3]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(A.L, A.Y(y)); ctx.lineTo(A.X(x), A.Y(y)); ctx.lineTo(A.X(x), A.B); ctx.stroke(); ctx.setLineDash([]); dot(ctx, A.X(x), A.Y(y), 4, col.s[3]); text(ctx, `${y}`, A.L + 4, A.Y(y) - 8, { color: col.ink, size: 10.5, weight: 700 }); text(ctx, `${i + 1}T`, A.X(x), A.B + 14, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }); }
    if (step === 5) { const y = N0 / Math.E; ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(A.L, A.Y(y)); ctx.lineTo(A.X(T), A.Y(y)); ctx.lineTo(A.X(T), A.B); ctx.stroke(); ctx.setLineDash([]); dot(ctx, A.X(T), A.Y(y), 5, col.s[2], col.panel); text(ctx, 'τ = 1/λ: N falls to N₀/e (37 %)', A.X(T) + 8, A.Y(y) - 12, { color: col.s[2], size: 11, weight: 700 }); line(ctx, [[A.X(0), A.Y(N0)], [A.X(T), A.B]], col.muted, 1.5, [3, 3]); }
    const L = (s, i, c = col.ink, wt = 400) => text(ctx, s, w / 2, A.B + 30 + i * 16, { color: c, size: 12, weight: wt, align: 'center' });
    if (step === 0) { L('Each nucleus decays with the same chance per second, λ.', 0); L('We cannot say WHICH nucleus goes next, but the crowd is predictable.', 1, col.muted); }
    if (step === 1) { L('Number decaying per second, −dN/dt = λN', 0, col.s[7], 700); L('The tangent (slope) is steep when N is big and flat when N is small.', 1, col.muted); }
    if (step === 2) { L('dN/N = −λ dt  →  ln N = −λt + C', 0); L('N = N₀ e^(−λt)', 1, col.s[7], 700); }
    if (step === 3) { L('N falls steeply at first, then ever more slowly.', 0); L('It never quite reaches zero.', 1, col.muted); }
    if (step === 4) { L('N = N₀/2 when e^(−λT) = ½', 0); L('T = ln 2 / λ = 0.693/λ.  Each T halves what is left.', 1, col.s[7], 700); }
    if (step === 5) { L('Mean life τ = 1/λ = T/0.693 = 1.44 T', 0, col.s[7], 700); L('Activity R = −dN/dt = λN = R₀ e^(−λt), in becquerel (1 Bq = 1 decay/s)', 1, col.muted); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
