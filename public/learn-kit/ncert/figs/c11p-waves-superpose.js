// Class 11 Waves: superposition. Two waves of the same frequency and amplitude A add up point by point: y = A sin(kx - wt) + A sin(kx - wt + phi) = 2A cos(phi/2) sin(kx - wt + phi/2).
// phi = 0 (path difference 0, lambda, 2 lambda...): constructive, amplitude 2A. phi = 180 degrees (path difference lambda/2, 3 lambda/2...): destructive, they cancel.
// Path difference = phi lambda / 2 pi.
import { canvas, axes, line, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let phi = 0, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'Two waves and their sum for a chosen phase difference' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'phase difference φ (°)', min: 0, max: 360, step: 15, value: phi, fmt: (v) => v + '°', oninput: (v) => { phi = v; go(); } });
  const anim = loop(host, (dt) => { t += dt * 2; cv.redraw(); }); anim.button(ctl);
  const go = () => { const p = phi * Math.PI / 180, R = 2 * Math.abs(Math.cos(p / 2)); ro.innerHTML = `Path difference = ${(phi / 360).toFixed(2)} λ. Resultant amplitude = 2A|cos(φ/2)| = <b>${R.toFixed(2)} A</b>. ${R > 1.9 ? 'Constructive: crest on crest.' : R < 0.1 ? 'Destructive: crest on trough, total silence.' : 'In between.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Two waves (thin) and their sum (thick)', col), p = phi * Math.PI / 180;
    const a = axes(ctx, w, h, col, { x: [0, 4], y: [-2.3, 2.3], xt: [0, 1, 2, 3, 4], yt: [-2, 0, 2], xlabel: 'position (wavelengths of 1 m)', ylabel: 'y / A', l: 36, t: top + 8, b: 40 });
    const f = (ph) => Array.from({ length: 161 }, (_, i) => { const x = i / 40; return [a.X(x), a.Y(Math.sin(2 * Math.PI * x - t + ph))]; });
    ctx.save(); a.clip(); line(ctx, f(0), col.s[0], 1.5); line(ctx, f(p), col.s[1], 1.5);
    line(ctx, Array.from({ length: 161 }, (_, i) => { const x = i / 40; return [a.X(x), a.Y(Math.sin(2 * Math.PI * x - t) + Math.sin(2 * Math.PI * x - t + p))]; }), col.s[3], 3.5); ctx.restore();
  };
  go();
}
