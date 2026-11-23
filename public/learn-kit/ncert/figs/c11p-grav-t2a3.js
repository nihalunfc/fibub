// Class 11 Gravitation: Kepler's third law, T^2 proportional to a^3 (T in years, a in AU: T^2 = a^3 for the Sun). The top picture shows planets circling with periods in their true ratios
// (1 year = 6 s on screen); the plot (log scales) shows the six planets sitting on one straight line of slope 3/2 for log T against log a. The slider adds a planet of your own.
import { canvas, axes, line, text, title, dot, row, slider, button, readout, loop } from '../../kit.js';

const PL = [['Mercury', 0.387, 0.241], ['Venus', 0.723, 0.615], ['Earth', 1, 1], ['Mars', 1.524, 1.881], ['Jupiter', 5.203, 11.86], ['Saturn', 9.537, 29.46]];

export default function (host) {
  let a = 3, t = 0;
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 320, label: 'Planets orbiting the Sun with their true period ratios and a log-log plot of period against orbit size' });
  const ctl = row(host);
  slider(ctl, { label: 'Your planet: orbit radius a', min: 0.3, max: 10, step: 0.1, value: 3, fmt: (v) => v.toFixed(1) + ' AU', oninput: (v) => { a = v; } });
  const b2 = row(host); const lp = loop(host, (dt) => { t += dt; cv.redraw(); }); lp.button(b2);
  const ro = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'T² ∝ a³: every planet on one line', col), pr = (h - top) * 0.42, cx = 40 + 0, cy = top + pr / 2 + 6, Sx = (w - 70) / 1.7;
    // orbits drawn as circles to a compressed scale (sqrt of a) so inner planets are visible
    const rad = (x) => 10 + Math.sqrt(x / 10) * (pr / 2 - 12);
    ctx.save(); ctx.translate(w / 2, cy);
    [...PL.slice(0, 4), ['you', a, Math.pow(a, 1.5)]].forEach(([n, x, T], i) => { const rr = rad(x), th = (t / 6) * 2 * Math.PI / T; ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.3); ctx.strokeStyle = i === 4 ? col.s[2] : col.line; ctx.lineWidth = 1; ctx.stroke(); dot(ctx, rr * Math.cos(th), -rr * Math.sin(th), i === 4 ? 6 : 4.5, i === 4 ? col.s[2] : col.s[i], col.panel); });
    dot(ctx, 0, 0, 6, col.s[3], col.panel); ctx.restore();
    text(ctx, 'orbit sizes squeezed to fit', 8, top + 14, { color: col.muted, size: 10 });
    const A = axes(ctx, w, h, col, { x: [0.3, 12], y: [0.15, 40], xlog: true, ylog: true, xt: [0.3, 1, 3, 10], yt: [0.3, 1, 3, 10, 30], xlabel: 'orbit radius a (AU)', ylabel: 'period T (years)', t: top + pr + 24, l: 46 });
    line(ctx, [[A.X(0.3), A.Y(Math.pow(0.3, 1.5))], [A.X(12), A.Y(Math.pow(12, 1.5))]], col.muted, 1.5, [5, 4]);
    PL.forEach(([n, x, T], i) => { dot(ctx, A.X(x), A.Y(T), 5, col.s[i % 8], col.panel); text(ctx, n, A.X(x) + 6, A.Y(T) + 10, { color: col.ink, size: 10 }); });
    dot(ctx, A.X(a), A.Y(Math.pow(a, 1.5)), 6.5, col.s[2], col.ink);
    const T = Math.pow(a, 1.5);
    ro.textContent = `A planet at a = ${a.toFixed(1)} AU has T = a^1.5 = ${T.toFixed(2)} years (T² = ${(T * T).toFixed(2)}, a³ = ${(a * a * a).toFixed(2)}). Data: real planets (NASA fact sheet); the dashed line is T² = a³.`;
  };
  cv.redraw();
}
