// Jablonski diagram as a story: what an excited molecule does with the energy it just absorbed. Absorption is instant, vibrations
// shed heat in picoseconds, fluorescence emits a (lower energy, longer wavelength) photon in nanoseconds, and a spin flip
// (intersystem crossing) can trap the molecule in the triplet state, which glows slowly: phosphorescence. Use the steps or slider.
import { canvas, text, title, row, slider, readout, arrow, line, ease, loop, calm } from '../kit.js';

const ST = [
  ['Ground state S₀', 'The electron pair sits in the lowest level, spin paired (singlet). Nothing is happening.', ''],
  ['Absorption S₀ → S₂', 'A photon is absorbed in about 10⁻¹⁵ s, too fast for the nuclei to move (Franck-Condon): the molecule jumps vertically to a vibrationally excited S₂ level.', '~10⁻¹⁵ s'],
  ['Vibrational relaxation', 'The molecule shakes off its extra vibration as heat to its neighbours and drops to the bottom of S₂ in picoseconds.', '10⁻¹² s'],
  ['Internal conversion S₂ → S₁', 'Without any light, the molecule slides down to S₁ (Kasha rule: emission almost always comes from the lowest excited state).', '10⁻¹² to 10⁻¹¹ s'],
  ['Fluorescence S₁ → S₀', 'A photon is emitted. It carries less energy than the one absorbed, so it is a longer wavelength (the Stokes shift).', '10⁻⁹ to 10⁻⁸ s'],
  ['Intersystem crossing S₁ → T₁', 'Sometimes a spin flip (weakly allowed through spin-orbit coupling) puts the electron into the triplet state T₁, which cannot easily return.', '10⁻⁸ to 10⁻³ s'],
  ['Phosphorescence T₁ → S₀', 'T₁ → S₀ also needs a spin flip, so it is forbidden and slow: the glow-in-the-dark effect, lasting milliseconds to seconds.', '10⁻³ to 10 s'],
];
export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 480, min: 380, label: 'Jablonski energy level diagram with an electron moving through absorption, relaxation, fluorescence and phosphorescence' });
  let s = 0, tgt = 0;
  const ctl = row(host), out = readout(host);
  const sl = slider(ctl, { label: 'Stage', min: 0, max: 6, step: 0.01, value: 0, fmt: (v) => String(Math.round(v) + 1) + ' of 7', oninput: (v) => { s = v; tgt = v; cv.redraw(); show(); } });
  loop(host, (dt) => { if (Math.abs(tgt - s) > 0.005) { s += Math.sign(tgt - s) * Math.min(Math.abs(tgt - s), dt * 1.2); sl.set(s); cv.redraw(); show(); } });
  function show() { const i = Math.round(s); out.innerHTML = `<b>${i + 1}. ${ST[i][0]}</b>${ST[i][2] ? ' (' + ST[i][2] + ')' : ''}. ${ST[i][1]}`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Jablonski diagram', col);
    const xS0 = w * 0.1, xS1 = w * 0.55, xT = w * 0.72, xe = w * 0.97, Y = (e) => h - 40 - e * ((h - 90) / 4.6);
    const lev = (x0, x1, e0, label, c) => { for (let v = 0; v < 4; v++) line(ctx, [[x0, Y(e0 + v * 0.14)], [x1, Y(e0 + v * 0.14)]], v === 0 ? c : col.line, v === 0 ? 2.4 : 1); text(ctx, label, x0, Y(e0) + 11, { color: c, size: 10.5, weight: 700 }); };
    lev(xS0, xS0 + w * 0.3, 0, 'S₀', col.ink); lev(xS1 - w * 0.05, xS1 + w * 0.12, 2.9, 'S₁', col.ink); lev(xS0, xS0 + w * 0.3, 4.1, 'S₂', col.ink); lev(xT - w * 0.02, xT + w * 0.22, 2.1, 'T₁', col.s[3]);
    text(ctx, 'singlets', xS0, h - 14, { color: col.muted, size: 10 }); text(ctx, 'triplet', xT, h - 14, { color: col.muted, size: 10 });
    // waypoints: [x, y (energy)]
    const wp = [[xS0 + 20, 0], [xS0 + 20, 0], [xS0 + 50, 4.1 + 0.42], [xS0 + 50, 4.1], [xS1 + 10, 2.9 + 0.0], [xS1 + 10, 0.14], [xT + 25, 2.1], [xT + 25, 0.0]];
    // stage positions: index 0..6 maps path progress; build electron position
    const seq = [[xS0 + 20, 0], [xS0 + 50, 4.52], [xS0 + 50, 4.1], [xS1 + 10, 2.9], [xS0 + 90, 0.14], [xT + 25, 2.1], [xS0 + 120, 0]];
    // seq[i] = position at the END of stage i; stage 0 start = seq[0]
    const k = Math.floor(s), f = ease(Math.min(1, s - k)), A = seq[k], B = seq[Math.min(6, k + 1)];
    const ex = k >= 6 ? seq[6][0] : A[0] + (B[0] - A[0]) * f, ey = k >= 6 ? seq[6][1] : A[1] + (B[1] - A[1]) * f;
    // photon arrows
    const wave = (x0, y0, x1, y1, c) => { const L = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0); ctx.save(); ctx.translate(x0, y0); ctx.rotate(a); ctx.beginPath(); for (let t = 0; t <= L; t += 2) { const yy = 5 * Math.sin(t / 5); t ? ctx.lineTo(t, yy) : ctx.moveTo(t, yy); } ctx.strokeStyle = c; ctx.lineWidth = 2.2; ctx.stroke(); ctx.restore(); };
    if (s > 0.2 && s < 1.9) { const fa = Math.min(1, (s - 0.2) / 0.8); wave(xS0 + 14, Y(0) - 4, xS0 + 14 + 0 * 1, Y(4.2 * fa), col.s[1]); text(ctx, 'photon in', xS0 + 20, Y(2), { color: col.s[1], size: 10, weight: 600 }); }
    if (s > 3.2 && s < 5.5) { wave(xS1 + 10, Y(2.9), xS0 + 90, Y(0.2), col.s[2]); text(ctx, 'fluorescence (longer λ)', xS0 + 100, Y(1.6), { color: col.s[2], size: 10, weight: 600 }); }
    if (s > 5.2) { wave(xT + 25, Y(2.1), xS0 + 120, Y(0.05), col.s[3]); text(ctx, 'phosphorescence', xT + 8, Y(1.2), { color: col.s[3], size: 10, weight: 600 }); }
    if (s > 2 && s < 3) text(ctx, 'heat / no light', xS0 + 70, Y(3.5), { color: col.muted, size: 10 });
    // electron
    ctx.beginPath(); ctx.arc(ex, Y(ey), 6, 0, 7); ctx.fillStyle = col.bad; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.bg; ctx.stroke();
    if (s >= 5 && s < 6.1) text(ctx, 'spin flips', ex + 10, Y(ey) - 10, { color: col.s[3], size: 10, weight: 700 });
    text(ctx, 'Energy ↑', 8, 34, { color: col.muted, size: 10 });
  };
  show();
  return { step(i) { tgt = Math.max(0, Math.min(6, i)); if (calm()) { s = tgt; sl.set(s); cv.redraw(); show(); } } };
}
