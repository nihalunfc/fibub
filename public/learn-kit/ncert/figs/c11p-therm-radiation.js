// Class 11 Thermal Properties of Matter: thermal radiation of a black body. Planck curve B(lambda) ~ lambda^-5 / (exp(14388 / (lambda T)) - 1) with lambda in micrometres. Wien's displacement law: peak wavelength = 2898 um K / T.
// Stefan-Boltzmann law: power per square metre = sigma T^4 (sigma = 5.67e-8 W/(m^2 K^4)). The grey band is visible light (0.4 to 0.7 um). Each curve is scaled to its own peak so its shape is clear; the readout gives the total power.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let T = 3000;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Black-body radiation curves against wavelength with the peak and the visible band marked' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'temperature T (K)', min: 300, max: 7000, step: 50, value: T, fmt: (v) => v + ' K', oninput: (v) => { T = v; go(); } });
  const B = (l, t) => Math.pow(l, -5) / (Math.exp(14388 / (l * t)) - 1);
  const pk = (t) => B(2898 / t, t);
  const go = () => { const lm = 2898 / T, P = 5.67e-8 * T ** 4; ro.textContent = `Peak at λ = 2898/T = ${lm.toFixed(2)} µm ${lm < 0.4 ? '(ultraviolet)' : lm < 0.7 ? '(visible)' : '(infrared: it glows only dimly)'}. Power = σT⁴ = ${P >= 1e6 ? (P / 1e6).toPrecision(3) + ' MW' : (P / 1000).toPrecision(3) + ' kW'} per m². Double T and the power rises 16 times.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Black-body spectrum: hotter means bluer', col), A = axes(ctx, w, h, col, { x: [0, 3], y: [0, 1], xlabel: 'wavelength (µm)', ylabel: 'relative intensity', l: 44, t: top + 8, xt: [0, 0.5, 1, 1.5, 2, 2.5, 3], yt: [0, 0.5, 1], fx: (v) => v });
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.2; ctx.fillRect(A.X(0.4), A.T, A.X(0.7) - A.X(0.4), A.B - A.T); ctx.globalAlpha = 1; text(ctx, 'visible', A.X(0.55), A.B - 8, { color: col.muted, size: 9.5, align: 'center' });
    ctx.save(); A.clip();
    [[3000, col.line], [5000, col.line], [7000, col.line]].forEach(([t]) => { const p = []; for (let l = 0.1; l <= 3; l += 0.03) p.push([A.X(l), A.Y(B(l, t) / pk(t))]); line(ctx, p, col.line, 1.2, [3, 3]); });
    const p = []; for (let l = 0.1; l <= 3; l += 0.03) p.push([A.X(l), A.Y(B(l, T) / pk(T))]); line(ctx, p, col.s[1], 3.5); ctx.restore();
    const lm = 2898 / T; if (lm < 3) { dot(ctx, A.X(lm), A.Y(B(lm, T) / pk(T)), 5, col.s[3], col.panel); text(ctx, 'peak ' + lm.toFixed(2) + ' µm', Math.min(A.X(lm) + 8, A.R - 70), Math.max(A.T + 12, A.Y(B(lm, T) / pk(T)) - 12), { color: col.s[3], size: 11, weight: 700 }); }
    text(ctx, 'dashed: 3000, 5000, 7000 K', A.R - 4, A.B - 8, { color: col.muted, size: 9.5, align: 'right' });
    const tx = 14, ty = A.T + 20; ctx.fillStyle = `hsl(${Math.round(Math.max(0, Math.min(60, (T - 800) / 90)))},${T < 800 ? 0 : 90}%,${T < 800 ? 30 : Math.min(85, 40 + (T - 800) / 120)}%)`; ctx.fillRect(A.L + 8, ty - 8, 26, 16); text(ctx, 'glow colour', A.L + 40, ty, { color: col.ink, size: 10.5 });
  };
  go();
}
