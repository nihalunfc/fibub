// 10.2 The deuteron in a square well. Choose the range R and the binding energy B; the depth V0 that binds an S state
// at exactly −B is found from k cot kR = −κ. The radial function u(r) = sin kr inside joins e^{−κ(r−R)} outside,
// drawn on the energy line. The shaded tail is the probability of finding the np pair outside the range of the force.
import { canvas, row, slider, readout, axes, line, text, fmt } from '../../kit.js';

const HC = 197.327, MU = 469.46;

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 300, label: 'Square-well potential and radial wavefunction of the deuteron' });
  let Rw = 2.1, B = 2.2246;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Range R (fm)', min: 0.8, max: 3.5, step: 0.05, value: Rw, fmt: (v) => fmt(v, 3), oninput: (v) => { Rw = v; re(); } });
  slider(ctl, { label: 'Binding energy B (MeV)', min: 0.2, max: 10, step: 0.05, value: B, fmt: (v) => fmt(v, 3), oninput: (v) => { B = v; re(); } });
  const solve = () => {
    const ka = Math.sqrt(2 * MU * B) / HC;
    let lo = Math.PI / (2 * Rw), hi = Math.PI / Rw - 1e-9;
    for (let i = 0; i < 80; i++) { const k = (lo + hi) / 2; if (k / Math.tan(k * Rw) + ka > 0) lo = k; else hi = k; }
    const k = lo, s = Math.sin(k * Rw) ** 2 / (2 * ka), inn = Rw / 2 - Math.sin(2 * k * Rw) / (4 * k);
    return { k, ka, V0: (HC * k) ** 2 / (2 * MU) + B, pout: s / (s + inn), norm: Math.sqrt(s + inn) };
  };
  const show = () => {
    const s = solve();
    out.innerHTML = `Depth V0 = ${fmt(s.V0, 3)} MeV, kR = ${fmt(s.k * Rw, 3)} (π/2 = 1.571), tail length 1/κ = ${fmt(1 / s.ka, 3)} fm. Probability outside the well: ${fmt(100 * s.pout, 3)}%. V0R² = ${fmt(s.V0 * Rw * Rw, 3)} MeV fm² (at least 102 MeV fm² for any binding).`;
  };
  cv.draw = (ctx, W, H, col) => {
    const s = solve(), ymin = -Math.max(40, s.V0 * 1.1);
    const ax = axes(ctx, W, H, col, { x: [0, 10], y: [ymin, 30], xlabel: 'np separation r (fm)', ylabel: 'Energy (MeV)', t: 24 });
    ctx.save(); ax.clip();
    line(ctx, [[ax.X(0), ax.Y(-s.V0)], [ax.X(Rw), ax.Y(-s.V0)], [ax.X(Rw), ax.Y(0)], [ax.X(10), ax.Y(0)]], col.ink, 2);
    line(ctx, [[ax.X(0), ax.Y(-B)], [ax.X(10), ax.Y(-B)]], col.muted, 1, [4, 4]);
    // u(r), scaled to a fixed height above the energy line
    const amp = 26, u = (r) => (r < Rw ? Math.sin(s.k * r) : Math.sin(s.k * Rw) * Math.exp(-s.ka * (r - Rw))) / s.norm * Math.sqrt(1.5);
    const pts = []; for (let r = 0; r <= 10; r += 0.02) pts.push([ax.X(r), ax.Y(-B + amp * u(r))]);
    ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(ax.X(Rw), ax.Y(-B));
    for (let r = Rw; r <= 10; r += 0.02) ctx.lineTo(ax.X(r), ax.Y(-B + amp * u(r)));
    ctx.lineTo(ax.X(10), ax.Y(-B)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, pts, col.s[0], 2.6);
    ctx.restore();
    text(ctx, 'V(r)', ax.X(Rw) + 6, ax.Y(-s.V0) + 12, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
    text(ctx, `E = −${fmt(B, 3)} MeV`, ax.X(9.8), ax.Y(-B) + 12, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    text(ctx, 'u(r) = r ψ(r)', ax.X(Rw * 0.4 + 0.3), ax.Y(-B + amp * 1.05), { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, `outside: ${fmt(100 * s.pout, 2)}%`, ax.X(Math.min(8.5, Rw + 2.5)), ax.Y(-B + 7), { color: col.s[2], size: 11.5, weight: 700, halo: col.panel });
  };
  re();
}
