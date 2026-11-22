// 4.3 Plasma dispersion. omega(k) for transverse EM waves (omega^2 = omega_p^2 + c^2 k^2) with the light line, and the
// Bohm-Gross branch for electron plasma waves. A slider picks a frequency: the readout gives n, v_phase and v_group,
// or the evanescent decay length below cutoff.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 260, label: 'Dispersion relation of waves in a plasma, with the cutoff at the plasma frequency' });
  let w = 1.6, th = 0.15;   // omega/omega_p and v_th/c for the Bohm-Gross branch
  const ctl = row(host);
  slider(ctl, { label: 'Frequency ω/ω_p', min: 0.2, max: 3, step: 0.01, value: w, fmt: (v) => v.toFixed(2), oninput: (v) => { w = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Thermal speed v_th/c', min: 0.02, max: 0.4, step: 0.01, value: th, fmt: (v) => v.toFixed(2), oninput: (v) => { th = v; cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    if (w > 1) {
      const n = Math.sqrt(1 - 1 / (w * w));
      out.innerHTML = `ω = ${w.toFixed(2)} ω<sub>p</sub>: refractive index n = <b>${n.toFixed(3)}</b>, phase velocity <b>${(1 / n).toFixed(3)} c</b>, group velocity <b>${n.toFixed(3)} c</b> (their product is c²). The wave propagates.`;
    } else {
      out.innerHTML = `ω = ${w.toFixed(2)} ω<sub>p</sub> is below cutoff: k is imaginary and the field decays as e<sup>−z/δ</sup> with δ = c/√(ω<sub>p</sub>² − ω²) = <b>${(1 / Math.sqrt(1 - w * w)).toFixed(3)} c/ω<sub>p</sub></b>. The wave is reflected.`;
    }
  };
  cv.draw = (ctx, W, H, col) => {
    const ax = axes(ctx, W, H, col, { x: [0, 3], y: [0, 3.2], xlabel: 'wavenumber ck/ω_p', ylabel: 'frequency ω/ω_p', t: 34 });
    title(ctx, 'ω² = ω_p² + c²k²: a cutoff at ω_p', col);
    ctx.save(); ax.clip();
    const em = [], bg = [], ll = [];
    for (let i = 0; i <= 300; i++) { const k = (i / 300) * 3; em.push([ax.X(k), ax.Y(Math.sqrt(1 + k * k))]); ll.push([ax.X(k), ax.Y(k)]); bg.push([ax.X(k), ax.Y(Math.sqrt(1 + 3 * k * k * th * th))]); }
    ctx.fillStyle = col.soft; ctx.fillRect(ax.L, ax.Y(1), ax.R - ax.L, ax.Y(0) - ax.Y(1));
    line(ctx, ll, col.muted, 1.2, [5, 4]); line(ctx, bg, col.s[2], 2); line(ctx, em, col.s[0], 2.6);
    line(ctx, [[ax.L, ax.Y(w)], [ax.R, ax.Y(w)]], col.s[3], 1, [3, 3]);
    if (w > 1) dot(ctx, ax.X(Math.sqrt(w * w - 1)), ax.Y(w), 5, col.s[3]);
    ctx.restore();
    text(ctx, 'EM wave', ax.R - 6, ax.T + 14, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'light line ω = ck', ax.R - 6, ax.T + 29, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    text(ctx, 'Bohm-Gross (Langmuir)', ax.R - 6, ax.T + 44, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'no propagation (evanescent)', ax.L + 8, ax.Y(0.5), { color: col.muted, size: 11, halo: col.panel });
  };
  cv.redraw(); show();
}
