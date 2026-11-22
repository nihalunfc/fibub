// 6.2 Random walks and diffusion. Many walkers start at the centre and take unit steps in random directions. Left: the
// spreading cloud. Right: the measured mean square displacement against the number of steps, with the line N l^2.
import { canvas, axes, line, dot, text, title, row, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 400, min: 240, label: 'Random walkers spreading from a point, and their mean square displacement growing linearly with time' });
  const M = 300, R = rng(7);
  let P, steps, hist;
  const reset = () => { P = Array.from({ length: M }, () => [0, 0]); steps = 0; hist = [[0, 0]]; };
  reset();
  const ctl = row(host);
  const out = readout(host);
  const step = () => {
    for (const q of P) { const a = 2 * Math.PI * R(); q[0] += Math.cos(a); q[1] += Math.sin(a); }
    steps++;
    hist.push([steps, P.reduce((s, q) => s + q[0] * q[0] + q[1] * q[1], 0) / M]);
  };
  let acc = 0;
  const lp = loop(host, (dt) => {
    acc += dt * 30;
    while (acc >= 1) { acc -= 1; if (steps < 400) step(); }
    cv.redraw(); show();
  });
  lp.button(ctl);
  button(ctl, 'Restart', () => { reset(); cv.redraw(); show(); });
  const show = () => {
    const ms = hist[hist.length - 1][1];
    out.innerHTML = `After N = <b>${steps}</b> unit steps: measured ⟨r²⟩ = <b>${ms.toFixed(1)}</b>, expected N l² = ${steps}. The rms distance √N = ${Math.sqrt(steps).toFixed(1)} grows only as the square root of time: in two dimensions ⟨r²⟩ = 4Dt with D = l²/4τ.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const half = w / 2;
    const s = Math.min(half, h) / 2 / 28, cx = half / 2, cy = h / 2 + 8;
    text(ctx, 'walkers', cx, 14, { color: col.ink, size: 12, align: 'center', weight: 600 });
    ctx.beginPath(); ctx.arc(cx, cy, Math.sqrt(steps) * s, 0, 2 * Math.PI); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.stroke();
    for (const q of P) dot(ctx, cx + q[0] * s, cy + q[1] * s, 1.8, col.s[0]);
    ctx.save(); ctx.translate(half, 0);
    const ax = axes(ctx, half, h, col, { x: [0, 400], y: [0, 450], xlabel: 'steps N', ylabel: '⟨r²⟩', t: 26, l: 46 });
    ctx.restore();
    const X = (v) => half + ax.X(v), Y = ax.Y;
    line(ctx, [[X(0), Y(0)], [X(400), Y(400)]], col.muted, 1.2, [5, 4]);
    line(ctx, hist.map(([n, m]) => [X(n), Y(Math.min(450, m))]), col.s[0], 2.2);
    text(ctx, '⟨r²⟩ = N l²', X(390), Y(400) - 10, { color: col.muted, size: 11, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
