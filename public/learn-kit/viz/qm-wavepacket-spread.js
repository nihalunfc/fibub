// A free quantum particle as a Gaussian wave packet: |ψ|² (filled), Re ψ (line). The packet keeps its momentum spread but
// its width grows as σ(t) = σ₀√(1 + (ħt/2mσ₀²)²), and Δx·Δp never drops below ħ/2. Try a narrow packet (squeezed in x,
// spreads fast), a heavy particle (dust: spreads in months), and drag the time slider to rewind and replay.
import { canvas, axes, line, text, title, row, slider, choice, button, readout, loop } from '../kit.js';

const HB = 1.0546e-34;
const BODIES = { e: ['electron', 9.109e-31, 0.1e-9], p: ['proton', 1.6726e-27, 0.1e-9], d: ['dust grain (10⁻¹⁵ kg)', 1e-15, 1e-6] };
export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 330, label: 'A Gaussian wave packet spreading in time' });
  let key = 'e', s0f = 1, T = 0, speed = 0.25;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Particle', Object.keys(BODIES).map((k) => [k, BODIES[k][0]]), key, (v) => { key = v; T = 0; tsl.set(0); cv.redraw(); show(); });
  slider(ctl, { label: 'Initial width σ₀', min: 0.5, max: 2, step: 0.05, value: s0f, fmt: (v) => v.toFixed(2) + '× base', oninput: (v) => { s0f = v; cv.redraw(); show(); } });
  const tsl = slider(ctl2, { label: 'Time', min: 0, max: 4, step: 0.01, value: 0, fmt: (v) => v.toFixed(2) + ' τ', oninput: (v) => { T = v; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { T += dt * speed; if (T > 4) T = 0; tsl.set(T); cv.redraw(); show(); }, { autoplay: false });
  anim.button(ctl2);
  const par = () => { const [, m, s] = BODIES[key], s0 = s * s0f, tau = 2 * m * s0 * s0 / HB; return { m, s0, tau, sig: s0 * Math.sqrt(1 + T * T), dp: HB / (2 * s0) }; };
  function show() {
    const p = par(), tu = p.tau < 1e-12 ? (p.tau * 1e15).toFixed(2) + ' fs' : p.tau < 1e-6 ? (p.tau * 1e9).toFixed(1) + ' ns' : p.tau < 100 ? p.tau.toFixed(2) + ' s' : (p.tau / 86400).toFixed(0) + ' days';
    out.innerHTML = `Unit time τ = 2mσ₀²/ħ = <b>${tu}</b>. Width now σ = <b>${(p.sig / p.s0).toFixed(2)} σ₀</b> (${(p.sig * 1e9).toPrecision(3)} nm). Momentum spread Δp = ħ/2σ₀ does not change, so Δx·Δp = <b>${(p.sig * p.dp / HB).toFixed(2)} ħ</b> (minimum 0.5 ħ, reached only at t = 0).`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Free Gaussian packet (moving with the packet)', col);
    const a = axes(ctx, w, h, col, { x: [-8, 8], y: [-0.7, 1.15], l: 36, t: 44, b: 40, xlabel: 'position in units of σ₀', yt: [], xt: [-6, -3, 0, 3, 6] });
    const p = par(), s = p.sig / p.s0, k0 = 3, f = 1 + T * T; // t' = T
    const dens = (x) => Math.exp(-x * x / (2 * s * s)) / s;
    ctx.beginPath(); ctx.moveTo(a.X(-8), a.Y(0));
    for (let i = 0; i <= 200; i++) { const x = -8 + i * 0.08; ctx.lineTo(a.X(x), a.Y(dens(x) * 0.95)); }
    ctx.lineTo(a.X(8), a.Y(0)); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1;
    // Re psi: complex Gaussian exp(-x²/(4(1+iT))) e^{i k0 x}/sqrt(1+iT) with sigma0 = 1 (unit): amplitude normalised to 1 at T=0
    const pts = [];
    for (let i = 0; i <= 400; i++) {
      const x = -8 + i * 0.04, den = 1 + T * T, re = 1 / den; // 1/(1+iT)
      const mag = Math.exp(-x * x * re / 4);
      const pre = Math.pow(den, -0.25);
      pts.push([a.X(x), a.Y(pre * mag * Math.cos(k0 * x + x * x * T / (4 * den)) * 0.95 * 0.9)]);
    }
    line(ctx, pts, col.s[1], 1.6);
    text(ctx, '|ψ|²', a.X(0.4), a.Y(1.0), { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'Re ψ', a.X(-7.5), a.Y(-0.55), { color: col.s[1], size: 11, weight: 700 });
    // width markers ±σ
    line(ctx, [[a.X(-s), a.Y(0.05)], [a.X(s), a.Y(0.05)]], col.ink, 2); text(ctx, 'Δx = σ', a.X(0), a.Y(0.14), { color: col.ink, size: 10.5, align: 'center', weight: 600 });
  };
  show();
}
