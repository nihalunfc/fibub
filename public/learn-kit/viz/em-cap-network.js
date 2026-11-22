// Two capacitors on a battery, in series or in parallel. Change C₁, C₂ and the battery voltage. The plates show how
// much charge each holds (more + and − signs = more charge); the bars compare charge, voltage and energy. Series:
// same charge, voltages share. Parallel: same voltage, charges add.
import { canvas, text, row, slider, choice, readout, line } from '../kit.js';

export default function (host) {
  let mode = 's', C1 = 2, C2 = 6, V = 12;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 290, label: 'Two capacitors in series or parallel with a battery' });
  const ctl = row(host);
  choice(ctl, 'Connection', [['s', 'Series'], ['p', 'Parallel']], mode, (v) => { mode = v; upd(); });
  slider(ctl, { label: 'C₁', min: 1, max: 10, value: C1, step: 0.5, fmt: (v) => v + ' µF', oninput: (v) => { C1 = v; upd(); } });
  slider(ctl, { label: 'C₂', min: 1, max: 10, value: C2, step: 0.5, fmt: (v) => v + ' µF', oninput: (v) => { C2 = v; upd(); } });
  slider(ctl, { label: 'Battery', min: 2, max: 24, value: V, step: 1, fmt: (v) => v + ' V', oninput: (v) => { V = v; upd(); } });
  const out = readout(host);
  const solve = () => { if (mode === 's') { const Ce = C1 * C2 / (C1 + C2), Q = Ce * V; return { Ce, q: [Q, Q], v: [Q / C1, Q / C2] }; } return { Ce: C1 + C2, q: [C1 * V, C2 * V], v: [V, V] }; };
  function upd() { const s = solve(), U = (c, v) => 0.5 * c * v * v; out.innerHTML = mode === 's' ? `Series: 1/C = 1/${C1} + 1/${C2} → C = <b>${s.Ce.toFixed(2)} µF</b>. Same Q = ${s.q[0].toFixed(1)} µC on both; V₁ = ${s.v[0].toFixed(2)} V, V₂ = ${s.v[1].toFixed(2)} V (add to ${V} V). The smaller capacitor takes the bigger voltage. Energy ${(U(C1, s.v[0]) + U(C2, s.v[1])).toFixed(1)} µJ.` : `Parallel: C = ${C1} + ${C2} = <b>${s.Ce.toFixed(1)} µF</b>. Same V = ${V} V on both; Q₁ = ${s.q[0].toFixed(1)} µC, Q₂ = ${s.q[1].toFixed(1)} µC (total ${(s.q[0] + s.q[1]).toFixed(1)} µC). Energy ${(U(C1, V) + U(C2, V)).toFixed(1)} µJ.`; cv.redraw(); }
  const plates = (ctx, col, x, y, q, label, c) => { const gap = 8 + 0; ctx.fillStyle = col.ink; ctx.fillRect(x - 22, y - gap, 44, 3); ctx.fillRect(x - 22, y + gap - 3, 44, 3); const n = Math.min(6, Math.max(1, Math.round(q / 12))); for (let i = 0; i < n; i++) { const xx = x - 18 + i * 7; text(ctx, '+', xx, y - gap - 7, { color: col.s[5], size: 11, weight: 700, align: 'center' }); text(ctx, '−', xx, y + gap + 6, { color: col.s[0], size: 11, weight: 700, align: 'center' }); } text(ctx, label, x + 28, y, { color: c, size: 11, weight: 700 }); };
  cv.draw = (ctx, w, h, col) => {
    const s = solve(), top = 54, bot = 150, mid = w * 0.5;
    line(ctx, [[30, top], [30, bot]], col.ink, 2); // battery on the left
    ctx.fillStyle = col.ink; ctx.fillRect(18, (top + bot) / 2 - 7, 24, 2.5); ctx.fillRect(23, (top + bot) / 2 + 3, 14, 5);
    text(ctx, V + ' V', 48, (top + bot) / 2, { color: col.ink, size: 11, weight: 700 });
    if (mode === 's') {
      line(ctx, [[30, top], [mid, top], [mid, 80]], col.ink, 2); line(ctx, [[mid, 100], [mid, 105]], col.ink, 2); line(ctx, [[mid, 125], [mid, bot], [30, bot]], col.ink, 2);
      plates(ctx, col, mid, 90, s.q[0], 'C₁', col.s[0]); plates(ctx, col, mid, 115, s.q[1], 'C₂', col.s[2]); line(ctx, [[mid, 98], [mid, 107]], col.ink, 2);
    } else {
      const x1 = w * 0.4, x2 = w * 0.7; line(ctx, [[30, top], [x2, top]], col.ink, 2); line(ctx, [[30, bot], [x2, bot]], col.ink, 2);
      [[x1, s.q[0], 'C₁', col.s[0]], [x2, s.q[1], 'C₂', col.s[2]]].forEach(([x, q, l, c]) => { line(ctx, [[x, top], [x, 90]], col.ink, 2); line(ctx, [[x, 110], [x, bot]], col.ink, 2); plates(ctx, col, x, 100, q, l, c); });
    }
    // bars: Q, V, U for C1, C2, equivalent
    const U = [0.5 * C1 * s.v[0] ** 2, 0.5 * C2 * s.v[1] ** 2], qm = Math.max(s.q[0], s.q[1], 1), um = Math.max(U[0], U[1], 1), bx = 22, bw = (w - 60) / 3;
    [['Charge Q', s.q.map((q) => q / qm), s.q.map((q) => q.toFixed(0) + ' µC')], ['Voltage V', s.v.map((v) => v / V), s.v.map((v) => v.toFixed(1) + ' V')], ['Energy U', U.map((u) => u / um), U.map((u) => u.toFixed(0) + ' µJ')]].forEach(([nm, f, lb], k) => {
      const x0 = bx + k * (bw + 8); text(ctx, nm, x0, 172, { color: col.ink, size: 11, weight: 700 });
      f.forEach((v, i) => { const y = 188 + i * 34; text(ctx, `C${i + 1}: ${lb[i]}`, x0, y, { color: col.ink, size: 10, fit: false }); ctx.fillStyle = col.s[i * 2]; ctx.fillRect(x0, y + 8, Math.max(2, v * (bw - 4)), 12); });
    });
    text(ctx, mode === 's' ? 'Series: one path, same charge' : 'Parallel: two paths, same voltage', 10, 16, { color: col.ink, size: 12, weight: 700 });
  };
  upd();
}
