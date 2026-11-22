// A superposition of two box states sloshes back and forth: |ψ|² of aψ_m + bψ_n beats at ω = (E_n − E_m)/ħ, while a single
// energy state stands still. Try mixing 0 (stationary), 50:50 (biggest slosh), then change which pair (m, n) to see how the
// beat frequency grows as (n² − m²). The lower plot follows ⟨x⟩(t); a charge sloshing like this radiates at that beat frequency.
import { canvas, axes, line, text, title, row, slider, choice, button, readout, loop } from '../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 480, min: 360, label: 'Probability density of a superposition of two infinite-well states moving in time' });
  let pair = '1,2', mix = 0.5, t = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'States', [['1,2', '1 + 2'], ['1,3', '1 + 3'], ['2,3', '2 + 3'], ['1,4', '1 + 4']], pair, (v) => { pair = v; t = 0; cv.redraw(); show(); });
  slider(ctl2, { label: 'Share of upper state', min: 0, max: 1, step: 0.01, value: mix, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { mix = v; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { t += dt * 1.0; cv.redraw(); });
  anim.button(ctl2);
  button(ctl2, 'Restart', () => { t = 0; cv.redraw(); });
  const mn = () => pair.split(',').map(Number);
  const psi = (n, x) => Math.SQRT2 * Math.sin(n * Math.PI * x);
  const amps = () => [Math.sqrt(1 - mix), Math.sqrt(mix)];
  const Xmn = () => { const [m, n] = mn(); let s = 0; for (let i = 0; i < 400; i++) { const x = (i + 0.5) / 400; s += psi(m, x) * psi(n, x) * x; } return s / 400; };
  const X = (tm) => { const [m, n] = mn(), [a, b] = amps(), w = (n * n - m * m) * Math.PI * Math.PI / 2 * 0.12; return 0.5 + 2 * a * b * Xmn() * Math.cos(w * tm); };
  function show() {
    const [m, n] = mn(), r = (n * n - m * m);
    out.innerHTML = `Energies E<sub>n</sub> = n²E₁. Beat: ΔE = (${n}² − ${m}²)E₁ = <b>${r}E₁</b>, so the density repeats every T = h/ΔE = <b>${(1 / r).toFixed(3)} h/E₁</b>. ${mix === 0 || mix === 1 ? 'Only one state: |ψ|² never changes (a stationary state).' : Math.abs(Xmn()) < 1e-3 ? 'Both states have the same parity, so ⟨x⟩ does not move: the density breathes but there is no oscillating dipole (a selection rule: Δn must be odd).' : `Swing of ⟨x⟩ about the middle: ±${Math.abs(2 * amps()[0] * amps()[1] * Xmn()).toFixed(3)} L.`}`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Superposition in a box', col);
    const a = axes(ctx, w, h * 0.58, col, { x: [0, 1], y: [0, 3.2], l: 34, t: 40, b: 26, yt: [], xt: [0, 0.5, 1], fx: (v) => (v === 0 ? '0' : v === 1 ? 'L' : 'L/2') });
    const [m, n] = mn(), [A, B] = amps(), w1 = Math.PI * Math.PI / 2 * 0.12, Em = m * m * w1, En = n * n * w1;
    const re = (x) => A * psi(m, x) * Math.cos(Em * t) + B * psi(n, x) * Math.cos(En * t), im = (x) => -A * psi(m, x) * Math.sin(Em * t) - B * psi(n, x) * Math.sin(En * t);
    ctx.beginPath(); ctx.moveTo(a.X(0), a.Y(0));
    for (let i = 0; i <= 200; i++) { const x = i / 200; ctx.lineTo(a.X(x), a.Y(re(x) ** 2 + im(x) ** 2)); }
    ctx.lineTo(a.X(1), a.Y(0)); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, Array.from({ length: 201 }, (_, i) => [a.X(i / 200), a.Y(re(i / 200) ** 2 + im(i / 200) ** 2)]), col.s[0], 2);
    line(ctx, Array.from({ length: 201 }, (_, i) => [a.X(i / 200), a.Y(1.6 + re(i / 200) * 0.5)]), col.s[1], 1, [3, 3]);
    text(ctx, '|ψ|²', a.X(0.03), a.Y(3), { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'Re ψ (dashed)', a.X(0.97), a.Y(3), { color: col.s[1], size: 10.5, align: 'right' });
    const xm = X(t); ctx.beginPath(); ctx.moveTo(a.X(xm), a.B); ctx.lineTo(a.X(xm), a.B - 12); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.stroke();
    const b = axes(ctx, w, h, col, { x: [0, 400], y: [0, 1], l: 34, t: h * 0.58 + 20, b: 24, xlabel: 'time →', ylabel: '⟨x⟩ / L', yt: [0, 0.5, 1], xt: [], fy: (v) => v });
    const P = 2 * Math.PI / ((n * n - m * m) * w1), pts = [];
    for (let i = 0; i <= 400; i++) pts.push([b.X(i), b.Y(X(t - 3 * P * (1 - i / 400)))]);
    line(ctx, pts, col.s[2], 2); ctx.beginPath(); ctx.arc(b.X(400), b.Y(X(t)), 4, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill();
  };
  show();
}
