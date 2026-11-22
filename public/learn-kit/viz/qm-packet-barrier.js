// A wave packet fired at a barrier, solved live from the Schrödinger equation (ħ = m = 1). Part of the packet reflects, part
// tunnels through even when E < V₀. Try E below the top (small tunnelling), thicker barrier (much less), then E above the top
// (still some reflection). The readout compares the measured T with the exact formula for a rectangular barrier.
import { canvas, axes, line, text, title, row, slider, button, readout, loop } from '../kit.js';

const N = 400, DX = 0.5, DT = 0.05, V0 = 0.5, SIG = 8, X0 = 50, XB = 100;
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'A wave packet hitting a potential barrier, partly reflected and partly transmitted' });
  let Ef = 0.6, wid = 5, Rr, Ii, V, steps = 0, settle = 0;
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Energy E', min: 0.2, max: 1.6, step: 0.05, value: Ef, fmt: (v) => (v * V0).toFixed(2) + ' (E/V₀ = ' + v.toFixed(2) + ')', oninput: (v) => { Ef = v; reset(); } });
  slider(ctl, { label: 'Barrier width', min: 1, max: 12, step: 0.5, value: wid, fmt: (v) => v.toFixed(1), oninput: (v) => { wid = v; reset(); } });
  const anim = loop(host, () => { for (let s = 0; s < 5; s++) step(); if (steps * DT * Math.sqrt(2 * Ef * V0) > 190) { settle++; if (settle > 90) { settle = 0; reset(); return; } } cv.redraw(); show(); });
  anim.button(ctl); button(ctl, 'Restart', () => reset());
  function reset() {
    const E = Ef * V0, k = Math.sqrt(2 * E); Rr = new Float64Array(N); Ii = new Float64Array(N); V = new Float64Array(N); steps = 0; settle = 0;
    let nrm = 0; for (let i = 0; i < N; i++) { const x = i * DX, g = Math.exp(-((x - X0) ** 2) / (4 * SIG * SIG)); Rr[i] = g * Math.cos(k * x); Ii[i] = g * Math.sin(k * x); nrm += g * g * 0 + (Rr[i] ** 2 + Ii[i] ** 2); V[i] = Math.abs(i * DX - XB) <= wid / 2 ? V0 : 0; }
    nrm = Math.sqrt(nrm * DX); for (let i = 0; i < N; i++) { Rr[i] /= nrm; Ii[i] /= nrm; }
    // half step for I (Visscher)
    for (let i = 1; i < N - 1; i++) Ii[i] -= 0.5 * DT * ((V[i] * Rr[i]) - 0.5 * (Rr[i + 1] - 2 * Rr[i] + Rr[i - 1]) / (DX * DX));
    cv.redraw(); show();
  }
  function step() {
    for (let i = 1; i < N - 1; i++) Rr[i] += DT * (-0.5 * (Ii[i + 1] - 2 * Ii[i] + Ii[i - 1]) / (DX * DX) + V[i] * Ii[i]);
    for (let i = 1; i < N - 1; i++) Ii[i] -= DT * (-0.5 * (Rr[i + 1] - 2 * Rr[i] + Rr[i - 1]) / (DX * DX) + V[i] * Rr[i]);
    for (let i = 0; i < 24; i++) { const f = 1 - 0.02 * (1 - i / 24) ** 2; Rr[i] *= f; Ii[i] *= f; Rr[N - 1 - i] *= f; Ii[N - 1 - i] *= f; }
    steps++;
  }
  const exactT = () => {
    const E = Ef * V0; if (E < V0) { const kap = Math.sqrt(2 * (V0 - E)); return 1 / (1 + (V0 * V0 * Math.sinh(kap * wid) ** 2) / (4 * E * (V0 - E))); }
    if (Math.abs(E - V0) < 1e-9) return 1 / (1 + wid * wid * V0 / 2); const q = Math.sqrt(2 * (E - V0)); return 1 / (1 + (V0 * V0 * Math.sin(q * wid) ** 2) / (4 * E * (E - V0)));
  };
  function show() {
    let tr = 0, rf = 0; for (let i = 0; i < N; i++) { const p = (Rr[i] ** 2 + Ii[i] ** 2) * DX; if (i * DX > XB + wid / 2) tr += p; else if (i * DX < XB - wid / 2) rf += p; }
    const ex = exactT(), E = Ef * V0;
    out.innerHTML = `E = ${E.toFixed(2)} ${E < V0 ? '< V₀ = 0.5: classically it would bounce every time.' : '> V₀: classically it would always cross.'} Probability right of the barrier now: <b>${(tr * 100).toFixed(1)}%</b>, left: ${(rf * 100).toFixed(1)}%. Exact transmission T = <b>${(ex * 100).toFixed(1)}%</b> (the measured value settles to it once the packet has passed).`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Packet and barrier (live Schrödinger equation)', col);
    const a = axes(ctx, w, h, col, { x: [0, N * DX], y: [-0.07, 0.13], l: 14, r: 10, t: 40, b: 14, xt: [], yt: [] });
    ctx.fillStyle = col.muted; ctx.globalAlpha = 0.25; ctx.fillRect(a.X(XB - wid / 2), a.Y(0.13 * 0.8), a.X(XB + wid / 2) - a.X(XB - wid / 2), a.Y(-0.07) - a.Y(0.13 * 0.8)); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(a.X(0), a.Y(0));
    for (let i = 0; i < N; i++) ctx.lineTo(a.X(i * DX), a.Y(Rr[i] ** 2 + Ii[i] ** 2)); ctx.lineTo(a.X((N - 1) * DX), a.Y(0)); ctx.closePath();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, Array.from({ length: N }, (_, i) => [a.X(i * DX), a.Y(-0.035 + Rr[i] * 0.45)]), col.s[1], 1);
    text(ctx, 'shaded block = barrier', a.X(XB), a.Y(-0.065), { color: col.muted, size: 10, align: 'center' });
    text(ctx, '|ψ|²', a.X(4), a.Y(0.12), { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'Re ψ', a.X(4), a.Y(-0.05), { color: col.s[1], size: 10.5, weight: 700 });
  };
  reset();
}
