// Class 11 Waves: a travelling harmonic wave y(x,t) = A sin(k x - w t), k = 2 pi / lambda, w = 2 pi f, speed v = f lambda = w / k.
// Transverse mode: the string curve moves right while each piece (the marked dots) only moves up and down. Longitudinal mode: air layers move back and forth along the
// direction of travel, bunching into compressions (high pressure) and spreading into rarefactions (low pressure). Pressure change is 90 degrees ahead of the displacement.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'T', A = 0.6, lam = 2, f = 0.5, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'A wave travelling to the right, transverse or longitudinal' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Wave type', [['T', 'Transverse (string)'], ['L', 'Longitudinal (sound)']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'amplitude A', min: 0.2, max: 1, step: 0.1, value: A, fmt: (v) => v.toFixed(1), oninput: (v) => { A = v; go(); } });
  slider(ctl, { label: 'wavelength λ (m)', min: 0.5, max: 4, step: 0.25, value: lam, fmt: (v) => v.toFixed(2), oninput: (v) => { lam = v; go(); } });
  slider(ctl, { label: 'frequency f (Hz)', min: 0.25, max: 2, step: 0.25, value: f, fmt: (v) => v.toFixed(2), oninput: (v) => { f = v; go(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const go = () => { ro.innerHTML = `k = 2π/λ = ${(2 * Math.PI / lam).toFixed(2)} rad/m, ω = 2πf = ${(2 * Math.PI * f).toFixed(2)} rad/s, speed v = fλ = <b>${(f * lam).toFixed(2)} m/s</b>. Period T = ${(1 / f).toFixed(2)} s. ${mode === 'T' ? 'Each dot only moves up and down.' : 'Each layer only moves to and fro.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const k = 2 * Math.PI / lam, om = 2 * Math.PI * f;
    const top = title(ctx, mode === 'T' ? 'y = A sin(kx − ωt)' : 'Displacement and pressure in a sound wave', col);
    if (mode === 'T') {
      const a = axes(ctx, w, h, col, { x: [0, 4], y: [-1.2, 1.2], xt: [0, 1, 2, 3, 4], yt: [-1, 0, 1], xlabel: 'position x (m)', ylabel: 'y', l: 36, t: top + 8, b: 40 });
      ctx.save(); a.clip(); line(ctx, Array.from({ length: 161 }, (_, i) => [a.X(i / 40), a.Y(A * Math.sin(k * i / 40 - om * t))]), col.s[0], 3); ctx.restore();
      for (const x of [0.5, 1.5, 2.5, 3.5]) { dot(ctx, a.X(x), a.Y(A * Math.sin(k * x - om * t)), 5.5, col.s[2], col.ink); line(ctx, [[a.X(x), a.T], [a.X(x), a.B]], col.line, 1, [2, 3]); }
      const xc = ((((Math.PI / 2 + om * t) / k) % lam) + lam) % lam; for (let c = xc; c < 4; c += lam) { text(ctx, 'crest', a.X(c), a.Y(A) - 12, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); }
    } else {
      const x0 = 18, x1 = w - 18, n = 56, rowsY = [top + 24, top + 44, top + 64], sp = (x1 - x0) / n;
      for (let i = 0; i < n; i++) { const xr = (i / n) * 4, d = A * 0.6 * (lam / 4 * (x1 - x0) / (2 * Math.PI)) * Math.sin(k * xr - om * t); rowsY.forEach((y, j) => dot(ctx, x0 + i * sp + sp / 2 + d, y, 3.2, i === 8 || i === 28 || i === 48 ? col.s[2] : col.s[0])); }
      const a = axes(ctx, w, h, col, { x: [0, 4], y: [-1.2, 1.2], xt: [0, 1, 2, 3, 4], yt: [], xlabel: 'position x (m)', ylabel: 'pressure change', l: 36, t: top + 86, b: 40 });
      ctx.save(); a.clip(); line(ctx, Array.from({ length: 161 }, (_, i) => [a.X(i / 40), a.Y(-A * Math.cos(k * i / 40 - om * t))]), col.s[3], 3); ctx.restore();
      text(ctx, 'compression', a.L + 4, a.T + 8, { color: col.muted, size: 10 }); text(ctx, 'rarefaction', a.L + 4, a.B - 8, { color: col.muted, size: 10 });
    }
  };
  go();
}
