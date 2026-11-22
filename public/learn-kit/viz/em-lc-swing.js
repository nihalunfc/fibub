// An LC circuit swinging. The charge sloshes between capacitor and inductor, like a mass on a spring: all the energy is in
// the capacitor's electric field (½q²/C) when the current is zero, all in the inductor's magnetic field (½LI²) when the
// charge is zero. The total stays the same (no resistor). Add resistance to see the oscillation die away. f = 1/(2π√LC).
import { canvas, axes, line, text, row, slider, readout, loop, dot, arrow } from '../kit.js';

export default function (host) {
  let L = 1, C = 1, Rr = 0, t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 420, min: 330, label: 'An LC circuit exchanging energy between capacitor and inductor' });
  const ctl = row(host), c2 = row(host);
  slider(ctl, { label: 'L', min: 0.25, max: 4, value: L, step: 0.05, fmt: (x) => x.toFixed(2) + ' H', oninput: (x) => { L = x; t = 0; upd(); } });
  slider(ctl, { label: 'C', min: 0.25, max: 4, value: C, step: 0.05, fmt: (x) => x.toFixed(2) + ' F', oninput: (x) => { C = x; t = 0; upd(); } });
  slider(c2, { label: 'Resistance R', min: 0, max: 1.5, value: Rr, step: 0.05, fmt: (x) => x.toFixed(2) + ' Ω', oninput: (x) => { Rr = x; t = 0; upd(); } });
  const out = readout(host);
  const w0 = () => 1 / Math.sqrt(L * C), g = () => Rr / (2 * L), wd = () => Math.sqrt(Math.max(1e-6, w0() ** 2 - g() ** 2));
  const q = (x) => Math.exp(-g() * x) * (Math.cos(wd() * x) + (g() / wd()) * Math.sin(wd() * x)), I = (x) => -(dq(x)), dq = (x) => -Math.exp(-g() * x) * (wd() + g() * g() / wd()) * Math.sin(wd() * x);
  const anim = loop(host, (dt) => { t += dt * 0.9; if (t > 25) t = 0; cv.redraw(); }); anim.button(c2);
  function upd() { out.innerHTML = `ω₀ = 1/√(LC) = ${w0().toFixed(2)} rad/s, f = <b>${(w0() / 2 / Math.PI).toFixed(3)} Hz</b>, period ${(2 * Math.PI / w0()).toFixed(2)} s. ${Rr === 0 ? 'No resistance: the total energy stays constant, U<sub>E</sub> + U<sub>B</sub> = ½Q²/C.' : `Resistance turns energy into heat: the swings shrink as e<sup>−Rt/2L</sup> (here the amplitude halves every ${(Math.LN2 / g()).toFixed(1)} s).`} Doubling L or C makes it ${Math.SQRT2.toFixed(2)}× slower.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const qq = q(t), ii = I(t) / (w0() || 1) * 1, UE = qq * qq / (2 * C), UB = 0.5 * L * (dq(t)) ** 2, cx1 = 70, cx2 = w - 70, T = 40, B = 110;
    line(ctx, [[cx1, T], [cx2, T]], col.ink, 1.8); line(ctx, [[cx1, B], [cx2, B]], col.ink, 1.8); line(ctx, [[cx1, T], [cx1, 62]], col.ink, 1.8); line(ctx, [[cx1, 80], [cx1, B]], col.ink, 1.8); line(ctx, [[cx2, T], [cx2, B]], col.ink, 1.8);
    ctx.fillStyle = col.ink; ctx.fillRect(cx1 - 22, 62, 44, 3); ctx.fillRect(cx1 - 22, 77, 44, 3);
    const n = Math.round(6 * Math.abs(qq)); for (let k = 0; k < n; k++) { text(ctx, qq > 0 ? '+' : '−', cx1 - 15 + k * 6, 56, { color: qq > 0 ? col.s[5] : col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, qq > 0 ? '−' : '+', cx1 - 15 + k * 6, 87, { color: qq > 0 ? col.s[0] : col.s[5], size: 11, weight: 700, align: 'center' }); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.4; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(cx2 - 40 + k * 16, T - 3, 7, 10, 0, 0, 7); ctx.stroke(); } ctx.fillStyle = col.panel; 
    text(ctx, 'C', cx1 - 34, 72, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'L', cx2 - 5, 24, { color: col.ink, size: 12, weight: 700 });
    // current arrow on the bottom wire, length ∝ current; field glow around coil ∝ U_B
    const cur = dq(t) * w0(); if (Math.abs(cur) > 0.03) arrow(ctx, w / 2 - cur * 38, B, w / 2 + cur * 38, B, col.s[2], 2.6, 8); text(ctx, 'current', w / 2, B + 14, { color: col.s[2], size: 10.5, align: 'center' });
    ctx.globalAlpha = Math.min(0.5, UB / (0.5 / C)); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(cx2 - 5, T + 20, 52, 38, 0, 0, 7); ctx.fill(); ctx.globalAlpha = Math.min(0.5, UE / (0.5 / C)); ctx.fillStyle = col.s[0]; ctx.fillRect(cx1 - 24, 65, 48, 12); ctx.globalAlpha = 1;
    const G = axes(ctx, w, h, col, { x: [0, 25], y: [0, 0.55], xlabel: 'time (s)', ylabel: 'energy', l: 40, t: 150, b: 34, yt: [0], fy: () => '0' });
    const E0 = 0.5 / C, sc = 0.5 / E0;
    const pe = [], pb = [], pt = []; for (let i = 0; i <= 250; i++) { const x = i / 10, a = q(x) ** 2 / (2 * C) * sc, b = 0.5 * L * dq(x) ** 2 * sc; pe.push([G.X(x), G.Y(a)]); pb.push([G.X(x), G.Y(b)]); pt.push([G.X(x), G.Y(a + b)]); }
    line(ctx, pe, col.s[0], 2); line(ctx, pb, col.s[3], 2); line(ctx, pt, col.muted, 1.4, [4, 3]);
    line(ctx, [[G.X(t), G.T], [G.X(t), G.B]], col.muted, 1, [3, 3]);
    text(ctx, 'electric (C)', G.R - 4, G.T + 10, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'magnetic (L)', G.R - 4, G.T + 25, { color: col.s[3], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'total', G.R - 4, G.T + 40, { color: col.muted, size: 10.5, weight: 700, align: 'right' });
  };
  upd();
}
