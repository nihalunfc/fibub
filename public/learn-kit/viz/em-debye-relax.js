// Dipoles that cannot keep up. A material of polar molecules is put in an alternating field E(t). Each molecule needs a
// relaxation time τ to turn (Debye model). Slow field (ωτ ≪ 1): the dipoles follow and ε′ is large. Fast field (ωτ ≫ 1): they
// cannot move and ε′ falls to ε∞. In between the polarisation lags the field by φ = atan(ωτ), which is where energy is lost:
// ε″ peaks at ωτ = 1. Slide the frequency (in units of 1/τ) and watch the lag, the dipole picture and the curves.
import { canvas, axes, line, text, row, slider, readout, loop, arrow, dot } from '../kit.js';

export default function (host) {
  let lw = 0, t = 0;
  const cv = canvas(host, { aspect: 1.1, max: 450, min: 350, label: 'Polarisation lagging an alternating field, with the Debye dielectric curves' });
  const ctl = row(host);
  slider(ctl, { label: 'Frequency ωτ', min: -2, max: 2, value: lw, step: 0.05, fmt: (x) => Math.pow(10, x).toPrecision(2), oninput: (x) => { lw = x; upd(); } });
  const anim = loop(host, (dt) => { t += dt * 2.2 / Math.max(0.5, Math.pow(10, lw) ** 0.4); cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  const wt = () => Math.pow(10, lw);
  function upd() { const x = wt(), lag = Math.atan(x) * 180 / Math.PI, e1 = 1 / (1 + x * x), e2 = x / (1 + x * x); out.innerHTML = `ωτ = ${x.toPrecision(2)}: polarisation amplitude ${(100 / Math.sqrt(1 + x * x)).toFixed(0)}% of the static value and it lags the field by <b>${lag.toFixed(0)}°</b>. ε′ = ε∞ + Δε/(1+ω²τ²) (here Δε = 1: ε′ − ε∞ = ${e1.toFixed(2)}), ε″ = Δε ωτ/(1+ω²τ²) = <b>${e2.toFixed(2)}</b>. Loss is largest at ωτ = 1, where ε″ = Δε/2 (microwave ovens work near this point for water).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const x = wt(), lag = Math.atan(x), A = 1 / Math.sqrt(1 + x * x), E = Math.cos(t), Pp = A * Math.cos(t - lag);
    // dipoles: a row of molecules with mean orientation following P
    for (let i = 0; i < 8; i++) { const px = 30 + i * (w - 60) / 7, py = 60, jit = (1 - Math.abs(Pp)) * 0.7 * Math.sin(t * 5 + i * 2), ang = (Math.PI / 2) * (1 - Pp) + jit * 0.6; arrow(ctx, px - Math.cos(ang) * 13, py + Math.sin(ang) * 13 * -1 + 0, px + Math.cos(ang) * 13, py - Math.sin(ang) * 13 * -1 + 0, col.s[5], 2.4, 6); }
    arrow(ctx, w / 2 - E * 40, 22, w / 2 + E * 40, 22, col.s[0], 3, 8); text(ctx, 'E(t)', w / 2 + 48, 22, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'molecular dipoles (follow P)', 10, 94, { color: col.s[5], size: 10.5, weight: 700 });
    const G = axes(ctx, w, h, col, { x: [0, 4 * Math.PI], y: [-1.1, 1.1], ylabel: 'E and P', l: 40, t: 110, b: 168, xt: [], yt: [-1, 0, 1], fy: (v) => v });
    line(ctx, Array.from({ length: 161 }, (_, i) => { const a = i / 40 * Math.PI; return [G.X(a), G.Y(Math.cos(a))]; }), col.s[0], 2); line(ctx, Array.from({ length: 161 }, (_, i) => { const a = i / 40 * Math.PI; return [G.X(a), G.Y(A * Math.cos(a - lag))]; }), col.s[5], 2.2);
    text(ctx, 'E', G.R - 4, G.T + 8, { color: col.s[0], size: 11, weight: 700, align: 'right' }); text(ctx, `P lags by ${(lag * 180 / Math.PI).toFixed(0)}°`, G.R - 4, G.T + 24, { color: col.s[5], size: 11, weight: 700, align: 'right' });
    const H = axes(ctx, w, h, col, { x: [0.01, 100], xlog: true, y: [0, 1.05], xlabel: 'ωτ (log scale)', ylabel: 'ε′ − ε∞, ε″ (units of Δε)', l: 44, t: h - 150, b: 36, yt: [0, 0.5, 1], fy: (v) => v });
    line(ctx, Array.from({ length: 121 }, (_, i) => { const q = Math.pow(10, -2 + i / 30); return [H.X(q), H.Y(1 / (1 + q * q))]; }), col.s[0], 2.2); line(ctx, Array.from({ length: 121 }, (_, i) => { const q = Math.pow(10, -2 + i / 30); return [H.X(q), H.Y(q / (1 + q * q))]; }), col.s[5], 2.2);
    line(ctx, [[H.X(x), H.T], [H.X(x), H.B]], col.muted, 1.2, [3, 3]); text(ctx, "ε′", H.X(0.02), H.Y(0.9) - 8, { color: col.s[0], size: 11, weight: 700 }); text(ctx, "ε″ (loss)", H.X(5), H.Y(0.2) - 10, { color: col.s[5], size: 11, weight: 700 });
  };
  upd();
}
