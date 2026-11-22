// 5.2 Scattering. View 1: Born differential cross-section of a Yukawa potential against angle (log scale), for a chosen
// k/mu, with the Rutherford (mu -> 0) shape for comparison. View 2: exact s-wave phase shift of an attractive square
// well against ka for a chosen depth (K0 a), with sin^2(delta_0); resonances appear where the well nearly binds.
import { canvas, axes, line, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 260, label: 'Born cross-section against angle, and s-wave phase shift of a square well' });
  let view = 'born', km = 1.5, K0 = 1.4;
  const ctl = row(host);
  choice(ctl, 'View', [['born', 'Born: dσ/dΩ'], ['delta', 'Phase shift δ₀']], view, (v) => { view = v; cv.redraw(); show(); });
  slider(ctl, { label: 'k/μ (Born view)', min: 0.2, max: 5, step: 0.05, value: km, fmt: (v) => v.toFixed(2), oninput: (v) => { km = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Well strength K₀a (phase view)', min: 0.3, max: 6, step: 0.02, value: K0, fmt: (v) => v.toFixed(2), oninput: (v) => { K0 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const d0 = (ka) => { const Ka = Math.sqrt(ka * ka + K0 * K0); let d = Math.atan((ka / Ka) * Math.tan(Ka)) - ka; while (d < -Math.PI / 2) d += Math.PI; return d; };
  const show = () => {
    if (view === 'born') {
      const r = Math.pow(1 + 4 * km * km, 2);
      out.innerHTML = `Yukawa, Born: dσ/dΩ ∝ 1/(μ² + q²)², q = 2k sin(θ/2). At k/μ = ${km.toFixed(2)} the forward/backward ratio is <b>${r.toFixed(1)}</b>. As k/μ grows the screened potential looks more and more like Coulomb and the curve approaches the Rutherford 1/sin⁴(θ/2) shape (dashed).`;
    } else {
      const bound = Math.floor(K0 / Math.PI + 0.5);
      out.innerHTML = `Square well with K₀a = ${K0.toFixed(2)} (K₀² = 2mV₀/ħ²): it holds <b>${bound}</b> bound s state${bound === 1 ? '' : 's'} (a new one appears each time K₀a passes π/2, 3π/2, …). Low-energy δ₀ → −k a<sub>s</sub>; near K₀a = π/2 the scattering length diverges and sin²δ₀ reaches 1 at very small ka.`;
    }
  };
  cv.draw = (ctx, W, H, col) => {
    if (view === 'born') {
      const f = (t, kk) => 1 / Math.pow(1 + 4 * kk * kk * Math.sin(t / 2) ** 2, 2);
      const ax = axes(ctx, W, H, col, { x: [0, 180], y: [1e-4, 1], ylog: true, xlabel: 'scattering angle θ (degrees)', ylabel: 'dσ/dΩ (relative)', t: 34, xt: [0, 30, 60, 90, 120, 150, 180] });
      title(ctx, 'Born approximation, Yukawa potential', col);
      ctx.save(); ax.clip();
      const a = [], b = [];
      for (let i = 1; i <= 360; i++) { const th = i / 2, t = th * Math.PI / 180; a.push([ax.X(th), ax.Y(Math.max(1e-4, f(t, km)))]); const ru = Math.pow(Math.sin(t / 2), -4) / Math.pow(2 * km, 4); b.push([ax.X(th), ax.Y(Math.min(1, Math.max(1e-4, ru / 16)))]); }
      line(ctx, b, col.muted, 1.3, [5, 4]); line(ctx, a, col.s[0], 2.5);
      ctx.restore();
      return;
    }
    const ax = axes(ctx, W, H, col, { x: [0, 4], y: [-1.6, 3.2], xlabel: 'ka', ylabel: 'δ₀ (rad) and sin²δ₀', t: 34 });
    title(ctx, 'Exact s-wave phase shift of a square well', col);
    ctx.save(); ax.clip();
    const a = [], b = [];
    for (let i = 1; i <= 400; i++) { const k = (i / 400) * 4, d = d0(k); a.push([ax.X(k), ax.Y(d)]); b.push([ax.X(k), ax.Y(Math.sin(d) ** 2)]); }
    line(ctx, [[ax.L, ax.Y(0)], [ax.R, ax.Y(0)]], col.line, 1);
    line(ctx, a, col.s[0], 2.5); line(ctx, b, col.s[2], 2);
    ctx.restore();
    text(ctx, 'δ₀ (mod π)', ax.R - 6, ax.T + 14, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'sin²δ₀', ax.R - 6, ax.T + 29, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
