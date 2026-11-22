// 12.6 A standard siren, step by step. Top: a cartoon chirp (far fewer cycles than the real thing; amplitude
// grows as f^(2/3), as in the real waveform). Its strength for a face-on binary is
// h = (4/d)(G𝓜/c²)^(5/3)(πf/c)^(2/3), so with the chirp mass 𝓜 (from how fast the pitch rises) the strength gives
// the distance d. Bottom: Hubble's law. The host galaxy's speed (default 3,017 km/s, the Hubble-flow speed of
// NGC 4993, host of GW170817, Abbott et al. 2017, Nature 551, 85) over the distance gives H0.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { G, C, M_SUN, MPC } from '../phys.js';

const MC = 1.19, F_REF = 100; // GW170817's chirp mass (solar masses) and a reference frequency (Hz)
const strain = (dMpc, f = F_REF) => (4 / (dMpc * MPC)) * Math.pow((G * MC * M_SUN) / (C * C), 5 / 3) * Math.pow((Math.PI * f) / C, 2 / 3);

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 520, min: 420, label: 'A gravitational-wave chirp whose strength gives the distance, and the resulting point on Hubble\'s law' });
  let step = 0, d = 44, v = 3017;
  const ctl = row(host);
  slider(ctl, { label: 'Distance from the wave (Mpc)', min: 20, max: 80, step: 0.5, value: d, fmt: (x) => x.toFixed(1), oninput: (x) => { d = x; upd(); } });
  slider(ctl, { label: 'Host galaxy speed (km/s)', min: 2000, max: 5000, step: 10, value: v, fmt: (x) => Math.round(x).toLocaleString('en-CA'), oninput: (x) => { v = x; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['1. The chirp', '2. Pitch rise gives the chirp mass', '3. Strength gives the distance', '4. Light gives the speed', '5. H₀ = speed ÷ distance'][step], col) + 4;
    const midY = top + (h - top) * 0.42;
    // waveform panel
    const L = 14, R = w - 14, y0 = (top + midY) / 2, amp0 = ((midY - top) / 2 - 8) * Math.min(1, 30 / d);
    const pts = [];
    const N = 900, TAU_END = 0.003, FMAX = Math.pow(TAU_END, -3 / 8);
    let ph = 0;
    for (let i = 0; i <= N; i++) {
      const tau = 1 - (i / N) * (1 - TAU_END), f = Math.pow(tau, -3 / 8); // frequency grows as τ^(−3/8)
      ph += 0.045 * f * f; // cartoon: far fewer cycles than the real signal, but the same speeding up
      const a = Math.pow(f / FMAX, 2 / 3); // strength grows as f^(2/3)
      pts.push([L + (i / N) * (R - L), y0 - amp0 * a * Math.cos(ph)]);
    }
    line(ctx, [[L, y0], [R, y0]], col.line, 1);
    line(ctx, pts, col.s[0], 1.8);
    if (step === 1) {
      text(ctx, 'pitch rises faster for heavier pairs', (L + R) / 2, top + 8, { color: col.s[1], size: 11.5, weight: 700, align: 'center', halo: col.panel });
      text(ctx, `chirp mass 𝓜 = ${MC} M☉`, R, midY - 6, { color: col.s[1], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    }
    if (step === 2) {
      text(ctx, `strength h ≈ ${(strain(d) * 1e22).toFixed(2)} × 10⁻²² at ${F_REF} Hz`, (L + R) / 2, top + 8, { color: col.s[3], size: 11.5, weight: 700, align: 'center', halo: col.panel });
      text(ctx, 'farther → weaker (h ∝ 1/d)', R, midY - 6, { color: col.s[3], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    }
    if (step === 0) text(ctx, 'cartoon: the real signal has thousands of cycles', R, midY - 6, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
    if (step === 3) text(ctx, 'flash of light → host galaxy → redshift → speed', (L + R) / 2, top + 8, { color: col.s[2], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    // Hubble diagram
    const A = axes(ctx, w, h, col, { x: [0, 90], y: [0, 6500], t: midY + 16, l: 64, r: 14, xlabel: 'Distance (Mpc)', ylabel: 'Speed (km/s)', xt: [0, 20, 40, 60, 80], yt: [0, 2000, 4000, 6000] });
    ctx.save(); A.clip();
    line(ctx, [[A.X(0), A.Y(0)], [A.X(90), A.Y(67.4 * 90)]], col.s[0], 1.5, [6, 4]);
    line(ctx, [[A.X(0), A.Y(0)], [A.X(89), A.Y(73.04 * 89)]], col.s[1], 1.5, [6, 4]);
    if (step >= 3) {
      line(ctx, [[A.X(0), A.Y(v)], [A.X(d), A.Y(v)]], col.s[2], 1, [2, 3]);
      line(ctx, [[A.X(d), A.Y(0)], [A.X(d), A.Y(v)]], col.s[3], 1, [2, 3]);
      line(ctx, [[A.X(d * 0.85), A.Y(v)], [A.X(d * 1.15), A.Y(v)]], col.ink, 2);
      dot(ctx, A.X(d), A.Y(v), 6, col.ink, col.panel);
    }
    if (step >= 4) line(ctx, [[A.X(0), A.Y(0)], [A.X(90), A.Y((v / d) * 90)]], col.ink, 2.2);
    ctx.restore();
    text(ctx, '67.4', A.X(86), A.Y(67.4 * 86) + 14, { color: col.s[0], size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, '73.0', A.X(76), A.Y(73.04 * 76) - 12, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
    if (step >= 4) text(ctx, `siren: ${(v / d).toFixed(1)}`, A.L + 8, A.T + 10, { color: col.ink, size: 12, weight: 700, halo: col.panel });
  };
  const upd = () => {
    const H = v / d;
    out.innerHTML = `Distance <b>${d.toFixed(1)} Mpc</b> (strength ${(strain(d) * 1e22).toFixed(2)} × 10⁻²² at ${F_REF} Hz) · speed <b>${Math.round(v).toLocaleString('en-CA')} km/s</b> · H₀ = ${Math.round(v).toLocaleString('en-CA')} ÷ ${d.toFixed(1)} = <b>${H.toFixed(1)} km/s/Mpc</b>. The bar shows ±15%, about how well one siren's distance is known: that alone spans ${(v / (d * 1.15)).toFixed(0)} to ${(v / (d * 0.85)).toFixed(0)}.`;
    cv.redraw();
  };
  upd();
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
