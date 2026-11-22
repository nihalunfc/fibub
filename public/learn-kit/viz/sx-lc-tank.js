// An oscillator starting up. A tank circuit (L and C) swaps energy between the capacitor (E-field) and the inductor
// (B-field) at f₀ = 1/2π√LC, but its resistance drains it (quality factor Q). An amplifier feeds back loop gain G: if
// G < 1 the ringing dies; at G > 1 (Barkhausen) a tiny kick grows until the amplifier saturates and the amplitude settles.
// Press Play to watch the energy move between C and L along the trace. Try G = 0.9, 1.0 and 1.2, and a low Q.
import { canvas, axes, line, text, row, slider, readout, loop, title, button } from '../kit.js';

export default function (host) {
  let tp = 0;
  const cv = canvas(host, { aspect: 0.8, max: 360, min: 280, label: 'Oscillator start-up: voltage against time with the energy split between capacitor and inductor' });
  const ctl = row(host);
  const sG = slider(ctl, { label: 'Loop gain G', min: 0.8, max: 1.6, step: 0.01, value: 1.3, fmt: (v) => v.toFixed(2), oninput: () => cv.redraw() });
  const sQ = slider(ctl, { label: 'Quality factor Q', min: 5, max: 100, step: 1, value: 15, fmt: (v) => v.toFixed(0), oninput: () => cv.redraw() });
  const sL = slider(ctl, { label: 'L (µH)', min: 1, max: 100, step: 1, value: 10, fmt: (v) => v + ' µH', oninput: () => cv.redraw() });
  const sC = slider(ctl, { label: 'C (pF)', min: 10, max: 1000, step: 10, value: 100, fmt: (v) => v + ' pF', oninput: () => cv.redraw() });
  const ctl2 = row(host);
  loop(host, (dt) => { tp += dt * 12; if (tp > 120) tp = 0; cv.redraw(); }, { autoplay: false }).button(ctl2);
  button(ctl2, 'Restart', () => { tp = 0; cv.redraw(); });
  const out = readout(host);
  const SPC = 16, NC = 120;
  function trace() { // x'' = 2σ(1 − 4x²)x' − x   (time in units of 1/ω₀), σ = (G − 1)/(2Q)
    const s = (sG.value - 1) / (2 * sQ.value), dt = (2 * Math.PI) / SPC, X = [], V = [];
    let x = 0.004, v = 0;
    for (let i = 0; i <= NC * SPC; i++) { X.push(x); V.push(v); const a = 2 * s * (1 - 4 * x * x) * v - x; v += a * dt; x += v * dt; }
    return { X, V };
  }
  cv.draw = (ctx, w, h, col) => {
    const T = trace(), top = h * 0.62;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, top); ctx.clip();
    const A = axes(ctx, w, top, col, { x: [0, NC], y: [-1.5, 1.5], xlabel: 'cycles', ylabel: 'voltage (arb.)', l: 42, t: 34, b: 34, yt: [-1, 0, 1] });
    A.clip();
    line(ctx, T.X.map((x, i) => [A.X(i / SPC), A.Y(x)]).filter((_, i) => i % 2 === 0), col.s[0], 1.6);
    const k = Math.min(T.X.length - 1, Math.round(tp * SPC));
    line(ctx, [[A.X(tp), A.T], [A.X(tp), A.B]], col.s[1], 2);
    ctx.restore();
    title(ctx, 'Start-up from a tiny kick', col);
    // energy bars
    const x = T.X[k], v = T.V[k], Ec = x * x, El = v * v, mx = 1.1, bx = 16, bw = w - 32, y0 = top + 14;
    text(ctx, 'Energy now (at the orange line)', bx, y0, { color: col.ink, size: 11, weight: 600 });
    [['capacitor (E-field)', Ec, col.s[0]], ['inductor (B-field)', El, col.s[2]]].forEach(([n, e, c], i) => {
      const y = y0 + 12 + i * 26; ctx.fillStyle = col.line; ctx.fillRect(bx, y, bw, 14); ctx.fillStyle = c; ctx.fillRect(bx, y, Math.min(1, e / mx) * bw, 14);
      text(ctx, n, bx + 4, y + 7, { color: col.ink, size: 10.5, weight: 600, halo: col.panel });
    });
  };
  const rd = cv.redraw; cv.redraw = () => { rd(); const f0 = 1 / (2 * Math.PI * Math.sqrt(sL.value * 1e-6 * sC.value * 1e-12)), G = sG.value, Q = sQ.value; out.innerHTML = `<b>f₀ = 1/(2π√LC) = ${(f0 / 1e6).toFixed(2)} MHz.</b> ${G < 0.995 ? `Loop gain ${G.toFixed(2)} < 1: the amplifier cannot make up for the losses, so the ringing dies out (about ${Math.round((Math.LN2 * Q) / (Math.PI * (1 - G)))} cycles to halve the amplitude).` : G < 1.005 ? 'Loop gain 1: the loss is just cancelled, a marginal oscillation (Barkhausen condition |Kβ| = 1 with zero phase).' : `Loop gain ${G.toFixed(2)} > 1: the amplitude grows about ${((Math.exp(Math.PI * (G - 1) / Q) - 1) * 100).toFixed(1)}% per cycle until the amplifier saturates and the gain falls back to 1. A higher Q gives a purer, more stable frequency but a slower start.`}`; }; cv.redraw();
}
