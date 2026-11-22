// Class 12 Chemistry, Electrochemistry (step player): deriving the Nernst equation. dG = dG0 + RT ln Q and dG = -nFE (so dG0 = -nFE0) give E = E0 - (RT/nF) ln Q.
// At 298 K, RT/F ln 10 = 0.0592 V, so E = E0 - (0.0592/n) log Q. At equilibrium E = 0 and Q = K, so log K = n E0/0.0592. Daniell cell: E0 = 1.10 V, n = 2, log K = 37.2.
// The graph shows E against log Q; the marker moves with each step.
import { canvas, text, title, axes, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Free energy and the reaction quotient', 'Free energy and the cell voltage', 'Put the two together', 'At 298 K: the working form', 'At equilibrium the cell is dead'];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Steps to the Nernst equation with a graph of voltage against log Q' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 12, L = 14;
    const eq = ['ΔG = ΔG° + RT ln Q', 'ΔG = −nFE   and   ΔG° = −nFE°', '−nFE = −nFE° + RT ln Q', 'E = E° − (RT/nF) ln Q', 'E = E° − (0.0592/n) log Q   (298 K)', 'E = 0, Q = K:  log K = nE°/0.0592'];
    const lines = [[0], [0, 1], [0, 1, 2, 3], [3, 4], [4, 5]][step];
    const exp = ['Free energy changes with the mixture.', 'Work from the cell = charge × voltage.', 'Divide by −nF to isolate E.', 'ln = 2.303 log; R = 8.314, T = 298, F = 96485.', 'Daniell cell: log K = 2(1.10)/0.0592 = 37.2'];
    lines.forEach((li, i) => text(ctx, eq[li], L, t0 + i * 22, { color: i === lines.length - 1 ? col.s[3] : col.ink, size: 12.5, weight: 700 }));
    text(ctx, exp[step], L, t0 + lines.length * 22 + 6, { color: col.muted, size: 11 });
    const top = t0 + 4 * 22 + 40, A = axes(ctx, w, h, col, { x: [-6, 40], y: [-0.1, 1.3], xlabel: 'log Q', ylabel: 'E (V)', l: 40, t: top, b: 36, fx: (v) => String(Math.round(v)), fy: (v) => v.toFixed(1) });
    const E = (x) => 1.10 - 0.0592 / 2 * x;
    ctx.save(); A.clip(); line(ctx, [[A.X(-6), A.Y(E(-6))], [A.X(40), A.Y(E(40))]], col.s[0], 3); ctx.restore();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A.L, A.Y(0)); ctx.lineTo(A.R, A.Y(0)); ctx.stroke(); ctx.setLineDash([]);
    const pos = [0, 0, 0, 12, 37.16][step]; dot(ctx, A.X(pos), A.Y(E(pos)), 6, col.s[3], col.panel);
    if (step >= 3) text(ctx, step === 4 ? 'dead cell' : `E = ${E(pos).toFixed(2)} V`, A.X(pos) + 8, A.Y(E(pos)) - 10, { color: col.s[3], size: 11, weight: 700, halo: col.panel, align: step === 4 ? 'right' : 'left' });
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
