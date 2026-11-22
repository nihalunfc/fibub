// The Hall effect as it happens. A current I flows along a bar in a field B (out of the page). The magnetic force pushes the
// carriers (electrons or holes) towards the bottom edge; charge piles up there until its electric field E_H cancels the push,
// and the sideways voltage V_H = IB/(nqt) stays. Press Play, switch carrier type and change B, n and I and watch how the
// edge charge builds up, why the sign flips between n- and p-type, and how a high carrier density kills the signal.
import { canvas, line, arrow, text, row, slider, choice, button, readout, loop, title, rng, fmt } from '../kit.js';

export default function (host) {
  let kind = 'n', hall = 0;
  const R = rng(21), D = Array.from({ length: 34 }, () => ({ x: R(), y: R(), p: R() * 6.3 }));
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 240, label: 'Carriers deflected to one edge of a current-carrying bar in a magnetic field' });
  const ctl = row(host);
  choice(ctl, 'Carriers', [['n', 'Electrons (n-type)'], ['p', 'Holes (p-type)']], kind, (v) => { kind = v; hall = 0; show(); });
  const sB = slider(ctl, { label: 'Field B', min: 0, max: 1, step: 0.05, value: 0.5, fmt: (v) => v.toFixed(2) + ' T', oninput: () => { hall = 0; show(); } });
  const sI = slider(ctl, { label: 'Current I', min: 0.2, max: 5, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) + ' mA', oninput: () => show() });
  const sn = slider(ctl, { label: 'Carrier density n', min: 1e20, max: 1e24, log: true, value: 1e22, fmt: (v) => fmt(v, 2) + ' m⁻³', oninput: () => show() });
  const ctl2 = row(host);
  loop(host, (dt) => { const tgt = sB.value > 0 ? 1 : 0; hall += (tgt - hall) * Math.min(1, dt * 0.7); D.forEach((d) => { d.x = (d.x + (kind === 'n' ? -1 : 1) * dt * 0.18 + 1) % 1; d.y = Math.min(1, Math.max(0, d.y + (sB.value > 0 ? 1 : 0) * (1 - hall) * dt * 0.5 * (d.y < 0.97))); if (d.y >= 0.97 && R() < dt * 0.6) d.y = R() * 0.5; }); cv.redraw(); }).button(ctl2);
  button(ctl2, 'Restart', () => { hall = 0; show(); });
  const out = readout(host);
  const VH = () => (sI.value / 1000 * sB.value) / (sn.value * 1.602e-19 * 1e-3) * (kind === 'n' ? -1 : 1); // thickness 1 mm; sign: bottom edge relative to top
  function show() { queueMicrotask(() => cv.redraw()); const v = VH(); out.innerHTML = `<b>V_H = IB/(nqt) = ${(v * 1000).toFixed(3)} mV</b> (thickness t = 1 mm; the bottom edge is ${v < 0 ? 'negative' : 'positive'} for ${kind === 'n' ? 'electrons' : 'holes'}; ${sB.value === 0 ? 'with B = 0 there is no Hall voltage' : 'reverse B or the carrier type and the sign flips'}). Hall coefficient R_H = ${kind === 'n' ? '−' : '+'}1/(ne) = ${fmt(1 / (sn.value * 1.602e-19), 3)} m³/C. Measuring the sign gives the carrier type; the size gives n. In a metal (n ≈ 10²⁸) the voltage is millions of times smaller.`; }
  cv.draw = (ctx, w, h, col) => {
    const L = 24, Rr = w - 24, T = 66, B = h - 70, c = kind === 'n' ? col.s[0] : col.s[5], sg = kind === 'n' ? '−' : '+', op = kind === 'n' ? '+' : '−';
    ctx.fillStyle = col.soft; ctx.fillRect(L, T, Rr - L, B - T); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(L, T, Rr - L, B - T);
    for (let i = 0; i < 6; i++) text(ctx, '⊙', L + 20 + i * ((Rr - L - 40) / 5), T + (B - T) / 2 - 4, { color: col.line, size: 18, align: 'center', weight: 300 });
    const t = performance.now() / 1000;
    D.forEach((d) => { const x = L + 8 + d.x * (Rr - L - 16), y = T + 8 + d.y * (B - T - 16) + Math.sin(t * 3 + d.p) * 1.5; ctx.beginPath(); ctx.arc(x, y, 3.6, 0, 7); if (kind === 'n') { ctx.fillStyle = c; ctx.fill(); } else { ctx.lineWidth = 1.6; ctx.strokeStyle = c; ctx.stroke(); } });
    const nS = Math.round(hall * 9);
    for (let i = 0; i < nS; i++) { text(ctx, sg, L + 16 + i * ((Rr - L - 32) / 8), B + 10, { color: c, size: 14, weight: 800, align: 'center' }); text(ctx, op, L + 16 + i * ((Rr - L - 32) / 8), T - 10, { color: kind === 'n' ? col.s[5] : col.s[0], size: 14, weight: 800, align: 'center' }); }
    if (hall > 0.15) { const m = (L + Rr) / 2; arrow(ctx, m + 60, T + 14, m + 60, B - 14, col.s[1], 2.5 * hall + 0.5, 8); text(ctx, 'E_H', m + 66, (T + B) / 2, { color: col.s[1], size: 11, weight: 700 }); }
    arrow(ctx, w * 0.35, T + 22, w * 0.35 + (kind === 'n' ? -34 : 34), T + 22, col.ink, 2, 8);
    text(ctx, `${kind === 'n' ? 'electrons' : 'holes'} drift`, w * 0.35 + (kind === 'n' ? 8 : -8), T + 36, { color: col.ink, size: 10.5, align: kind === 'n' ? 'left' : 'right' });
    text(ctx, 'current I flows to the right; ⊙ = B out of the page', L, 40, { color: col.muted, size: 10.5 });
    // voltmeter bar
    const mx = w / 2, my = h - 26, v = VH(), amp = Math.min(1, Math.abs(v) / 0.0015) * hall * (w * 0.3);
    line(ctx, [[mx - w * 0.3, my], [mx + w * 0.3, my]], col.line, 6); line(ctx, [[mx, my - 8], [mx, my + 8]], col.muted, 2);
    line(ctx, [[mx, my], [mx + (v > 0 ? 1 : -1) * amp, my]], col.s[1], 6);
    text(ctx, `V_H(now) = ${(v * hall * 1000).toFixed(3)} mV`, mx, my - 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    title(ctx, 'Hall effect: charge piles up on one edge', col);
  };
  show();
}
