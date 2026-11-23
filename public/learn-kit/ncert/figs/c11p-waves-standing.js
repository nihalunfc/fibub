// Class 11 Waves (step player): standing waves on a string fixed at both ends. A wave going right and its reflection going left (same A, f) add up:
// y = 2A sin(kx) cos(wt). Points where sin(kx) = 0 never move (nodes, half a wavelength apart); between them, antinodes swing with amplitude 2A.
// Fixed ends must be nodes, so L = n lambda / 2 and f_n = n v / 2L (n = 1 fundamental, 2 second harmonic, ...). The last step has a harmonic slider.
import { canvas, axes, line, dot, text, title, loop, row, slider } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0, n = 3;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'Two travelling waves and the standing wave they make on a string fixed at both ends' });
  const ctl = row(host);
  slider(ctl, { label: 'harmonic n', min: 1, max: 6, step: 1, value: n, fmt: (v) => v.toFixed(0), oninput: (v) => { n = v; cv.redraw(); } });
  const anim = loop(host, (dt) => { t += dt * 3; cv.redraw(); }); anim.button(ctl);
  const TT = ['A wave travelling right', 'Its reflection travelling left', 'Add them: y = 2A sin kx cos ωt', 'Nodes and antinodes', 'Fixed ends: only some wavelengths fit'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), a = axes(ctx, w, h, col, { x: [0, 1], y: [-2.3, 2.3], xt: [], yt: [], grid: false, l: 20, r: 20, t: top + 6, b: 36 });
    const m = step === 4 ? n : 3, k = m * Math.PI;
    ctx.save(); a.clip();
    const R = Array.from({ length: 121 }, (_, i) => { const x = i / 120; return [a.X(x), a.Y(Math.sin(k * x - t))]; }), Lf = Array.from({ length: 121 }, (_, i) => { const x = i / 120; return [a.X(x), a.Y(Math.sin(k * x + t))]; });
    const S = Array.from({ length: 121 }, (_, i) => { const x = i / 120; return [a.X(x), a.Y(Math.sin(k * x - t) + Math.sin(k * x + t))]; });
    if (step <= 2) line(ctx, R, col.s[0], step === 0 ? 3 : 1.5); if (step === 1 || step === 2) line(ctx, Lf, col.s[1], step === 1 ? 3 : 1.5);
    if (step >= 2) { if (step >= 3) { line(ctx, Array.from({ length: 121 }, (_, i) => [a.X(i / 120), a.Y(2 * Math.sin(k * i / 120))]), col.line, 1.5, [4, 3]); line(ctx, Array.from({ length: 121 }, (_, i) => [a.X(i / 120), a.Y(-2 * Math.sin(k * i / 120))]), col.line, 1.5, [4, 3]); } line(ctx, S, col.s[3], 3.5); }
    ctx.restore();
    if (step >= 3) for (let j = 0; j <= m; j++) { const x = j / m; dot(ctx, a.X(x), a.Y(0), 5.5, col.ink); if (j < m) text(ctx, 'A', a.X((j + 0.5) / m), a.Y(0) + (j % 2 ? 24 : -24) * 1.6, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, 'N', a.X(x) + (j === 0 ? 9 : j === m ? -9 : 0), a.Y(0) + 15, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    ctx.fillStyle = col.ink; ctx.fillRect(a.L - 5, a.Y(0) - 22, 5, 44); ctx.fillRect(a.R, a.Y(0) - 22, 5, 44);
    const N = ['Thin blue wave: y₁ = A sin(kx − ωt)', 'Reflected wave: y₂ = A sin(kx + ωt)', 'Thick: the sum. Crests do not travel; they just swing.', 'N = node (never moves), A = antinode. Nodes are λ/2 apart.', `n = ${n}: L = ${n} × λ/2, f = ${n} v / 2L (${n} loop${n > 1 ? 's' : ''})`][step];
    text(ctx, N, w / 2, h - 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
