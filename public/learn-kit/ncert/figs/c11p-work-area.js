// Class 11 Work, Energy and Power: work as the area under a force-distance graph. W = integral of F dx. For a constant force the area is a rectangle
// (W = F x); for a spring pulled out (F = k x) it is a triangle (W = 1/2 k x^2); for any other force we add up thin strips. The area is found numerically.
import { canvas, axes, line, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  const K = {
    c: { f: () => 20, form: (x) => `F x = 20 × ${x.toFixed(1)}` },
    s: { f: (x) => 5 * x, form: (x) => `½ k x² = ½ × 5 × ${x.toFixed(1)}²` },
    q: { f: (x) => 0.5 * x * x, form: (x) => `x³/6 = ${x.toFixed(1)}³/6` },
    t: { f: (x) => (x < 4 ? 30 : 10), form: (x) => (x <= 4 ? `30 × ${x.toFixed(1)}` : `30 × 4 + 10 × ${(x - 4).toFixed(1)}`) },
  };
  let kind = 'c', xe = 6;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Force against distance with the area under the curve shaded to show the work done' });
  const ctl = row(host);
  choice(ctl, 'Force', [['c', 'Constant'], ['s', 'Spring'], ['q', 'Growing'], ['t', 'Strong then weak']], 'c', (v) => { kind = v; cv.redraw(); });
  slider(ctl, { label: 'Distance moved x', min: 0, max: 10, step: 0.1, value: 6, fmt: (v) => v.toFixed(1) + ' m', oninput: (v) => { xe = v; cv.redraw(); } });
  const ro = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Work = area under the force–distance graph', col);
    const A = axes(ctx, w, h, col, { x: [0, 10], y: [0, 50], xt: [0, 2, 4, 6, 8, 10], yt: [0, 10, 20, 30, 40, 50], xlabel: 'distance x (m)', ylabel: 'force F (N)', t: top + 8, l: 44 });
    const f = K[kind].f, N = 160;
    ctx.save(); ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(0));
    for (let i = 0; i <= N; i++) ctx.lineTo(A.X(xe * i / N), A.Y(f(xe * i / N)));
    ctx.lineTo(A.X(xe), A.Y(0)); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.restore();
    const pts = []; for (let i = 0; i <= N; i++) { const x = 10 * i / N; pts.push([A.X(x), A.Y(Math.min(50, f(x)))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    line(ctx, [[A.X(xe), A.Y(0)], [A.X(xe), A.Y(Math.min(50, f(xe)))]], col.s[2], 2, [5, 4]);
    let W = 0; const M = 4000; for (let i = 0; i < M; i++) W += f((i + 0.5) * xe / M) * xe / M;
    text(ctx, `W = ${W.toFixed(1)} J`, A.R - 8, A.T + 14, { color: col.ink, size: 15, weight: 700, align: 'right', halo: col.panel });
    ro.textContent = `Force type: ${kind === 'c' ? 'constant' : kind === 's' ? 'spring' : kind === 'q' ? 'growing' : 'strong then weak'}. Area = ${K[kind].form(xe)} = ${W.toFixed(1)} J.`;
  };
  cv.redraw();
}
