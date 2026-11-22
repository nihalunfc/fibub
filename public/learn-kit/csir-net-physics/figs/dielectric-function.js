// 9.3 Dielectric response, four views. Clausius-Mossotti: εr against Nα/3ε0, with and without the local field.
// Debye: ε′ and ε″ against log(ωτ) (a step and a loss peak). Lorentz oscillator: ε′ and ε″ against ω/ω0 (normal and
// anomalous dispersion, absorption peak). Drude metal: ε′, ε″ and the normal-incidence reflectivity R against ω/ωp
// (R near 1 below the plasma frequency, transparency above).
import { canvas, row, slider, choice, readout, axes, line, dot, text, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 300, label: 'Dielectric function of a solid in four models' });
  let mode = 'lorentz', x = 0.3, es = 20, ei = 3, wp = 1.2, g = 0.15, gd = 0.05, wsel = 0.8;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  const re = () => { build(); cv.redraw(); show(); };
  choice(ctl, 'Model', [['cm', 'Clausius-Mossotti'], ['debye', 'Debye'], ['lorentz', 'Lorentz'], ['drude', 'Drude metal']], mode, (v) => { mode = v; re(); });
  const build = () => {
    ctl2.innerHTML = '';
    if (mode === 'debye') wsel = 0; else if (wsel < 0.05) wsel = 0.8;
    if (mode === 'cm') slider(ctl2, { label: 'Nα/3ε₀', min: 0, max: 0.9, step: 0.01, value: x, fmt: (v) => fmt(v, 2), oninput: (v) => { x = v; cv.redraw(); show(); } });
    if (mode === 'debye') {
      slider(ctl2, { label: 'Static ε_s', min: 4, max: 80, step: 1, value: es, fmt: (v) => fmt(v, 3), oninput: (v) => { es = v; cv.redraw(); show(); } });
      slider(ctl2, { label: 'High-frequency ε∞', min: 1, max: 10, step: 0.5, value: ei, fmt: (v) => fmt(v, 2), oninput: (v) => { ei = v; cv.redraw(); show(); } });
    }
    if (mode === 'lorentz') {
      slider(ctl2, { label: 'Oscillator strength ωp/ω0', min: 0.3, max: 2, step: 0.05, value: wp, fmt: (v) => fmt(v, 2), oninput: (v) => { wp = v; cv.redraw(); show(); } });
      slider(ctl2, { label: 'Damping γ/ω0', min: 0.02, max: 0.6, step: 0.01, value: g, fmt: (v) => fmt(v, 2), oninput: (v) => { g = v; cv.redraw(); show(); } });
    }
    if (mode === 'drude') slider(ctl2, { label: 'Damping γ/ωp', min: 0.01, max: 0.5, step: 0.01, value: gd, fmt: (v) => fmt(v, 2), oninput: (v) => { gd = v; cv.redraw(); show(); } });
    if (mode !== 'cm') slider(ctl2, { label: mode === 'debye' ? 'Frequency log₁₀(ωτ)' : mode === 'lorentz' ? 'Frequency ω/ω0' : 'Frequency ω/ωp', min: mode === 'debye' ? -2 : 0.05, max: mode === 'debye' ? 2 : 2.4, step: 0.01, value: wsel, fmt: (v) => fmt(v, 3), oninput: (v) => { wsel = v; cv.redraw(); show(); } });
  };
  // complex epsilon [re, im] at frequency w (units depend on mode)
  const eps = (w) => {
    if (mode === 'debye') { const u = 10 ** w, d = es - ei; return [ei + d / (1 + u * u), d * u / (1 + u * u)]; }
    if (mode === 'lorentz') { const a = 1 - w * w, b = g * w, D = a * a + b * b; return [1 + wp * wp * a / D, wp * wp * b / D]; }
    const D = w * w + gd * gd; return [1 - 1 / D, gd / (w * D)];
  };
  const refl = ([e1, e2]) => { const m = Math.hypot(e1, e2), n = Math.sqrt((m + e1) / 2), k = Math.sqrt(Math.max(0, (m - e1) / 2)); return ((n - 1) ** 2 + k * k) / ((n + 1) ** 2 + k * k); };
  const show = () => {
    if (mode === 'cm') { out.innerHTML = `Nα/3ε₀ = ${fmt(x, 2)}: Clausius-Mossotti gives εr = (1 + 2x)/(1 − x) = ${fmt((1 + 2 * x) / (1 - x), 4)}; without the local field, 1 + 3x = ${fmt(1 + 3 * x, 4)}. As x → 1, εr diverges: the polarisation catastrophe behind displacive ferroelectrics.`; return; }
    const [a, b] = eps(wsel);
    out.innerHTML = `${mode === 'debye' ? `ωτ = ${fmt(10 ** wsel, 3)}` : mode === 'lorentz' ? `ω/ω0 = ${fmt(wsel, 3)}` : `ω/ωp = ${fmt(wsel, 3)}`}: ε′ = ${fmt(a, 3)}, ε″ = ${fmt(b, 3)}${mode !== 'debye' ? `, reflectivity R = ${fmt(refl([a, b]), 3)}` : `, loss tangent ${fmt(b / a, 3)}`}. ${mode === 'debye' ? 'The loss peaks at ωτ = 1 with height (ε_s − ε∞)/2.' : mode === 'lorentz' ? 'Between the resonance ω0 and √(ω0² + ωp²), ε′ < 0 and the medium reflects strongly.' : 'Below ωp, ε′ < 0 and R ≈ 1; above it, the metal turns transparent.'}`;
  };
  cv.draw = (ctx, W, H, col) => {
    if (mode === 'cm') {
      const ax = axes(ctx, W, H, col, { x: [0, 0.95], y: [0, 20], xlabel: 'Nα / 3ε₀', ylabel: 'εr', t: 24 });
      const a = [], b = [];
      for (let u = 0; u <= 0.95; u += 0.005) { a.push([ax.X(u), ax.Y(Math.min(20.5, (1 + 2 * u) / (1 - u)))]); b.push([ax.X(u), ax.Y(1 + 3 * u)]); }
      ctx.save(); ax.clip(); line(ctx, a, col.s[0], 2.5); line(ctx, b, col.muted, 1.8, [5, 4]); ctx.restore();
      dot(ctx, ax.X(x), ax.Y(Math.min(20, (1 + 2 * x) / (1 - x))), 5, col.ink, col.panel);
      text(ctx, 'Clausius-Mossotti (with local field)', ax.X(0.03), ax.Y(17), { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
      text(ctx, 'dashed: εr = 1 + Nα/ε₀', ax.X(0.03), ax.Y(15), { color: col.muted, size: 11, halo: col.panel });
      return;
    }
    const xr = mode === 'debye' ? [-2, 2] : [0, 2.5];
    const ys = []; for (let w = xr[0] + 0.001; w <= xr[1]; w += (xr[1] - xr[0]) / 400) ys.push([w, eps(w)]);
    const lim = mode === 'debye' ? [0, es * 1.05] : mode === 'lorentz' ? [-Math.min(12, 1 + wp * wp / (2 * g)), Math.min(14, 1 + wp * wp / (2 * g) + 1)] : [-4, 4];
    const ax = axes(ctx, W, H, col, { x: xr, y: lim, xlabel: mode === 'debye' ? 'log₁₀(ωτ)' : mode === 'lorentz' ? 'ω / ω0' : 'ω / ωp', ylabel: 'ε′, ε″', t: 24 });
    ctx.save(); ax.clip();
    line(ctx, [[ax.L, ax.Y(0)], [ax.R, ax.Y(0)]], col.muted, 1);
    line(ctx, ys.map(([w, e]) => [ax.X(w), ax.Y(e[0])]), col.s[0], 2.5);
    line(ctx, ys.map(([w, e]) => [ax.X(w), ax.Y(e[1])]), col.s[2], 2.5);
    if (mode !== 'debye') line(ctx, ys.map(([w, e]) => [ax.X(w), ax.Y(refl(e) * (lim[1] > 3 ? lim[1] / 1.2 : 1))]), col.s[4] || col.ink, 1.6, [6, 3]);
    ctx.restore();
    const e = eps(wsel);
    dot(ctx, ax.X(wsel), ax.Y(Math.max(lim[0], Math.min(lim[1], e[0]))), 4.5, col.s[0], col.panel);
    dot(ctx, ax.X(wsel), ax.Y(Math.max(lim[0], Math.min(lim[1], e[1]))), 4.5, col.s[2], col.panel);
    text(ctx, 'ε′ (real)', ax.R - 6, ax.T + 10, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'ε″ (loss)', ax.R - 6, ax.T + 26, { color: col.s[2], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    if (mode !== 'debye') text(ctx, `dashed: reflectivity R${lim[1] > 3 ? ` × ${fmt(lim[1] / 1.2, 2)}` : ''}`, ax.R - 6, ax.T + 42, { color: col.s[4] || col.ink, size: 11, align: 'right', halo: col.panel });
  };
  re();
}
