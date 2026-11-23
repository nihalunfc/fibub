// Class 11 Chemistry, Structure of Atom: Bohr's model. Energy of level n: E_n = -13.6 Z^2 / n^2 eV, radius r_n = 52.9 n^2 / Z pm.
// An electron dropping from n_i to n_f gives out a photon of energy E_i - E_f; wavelength = 1240 eV nm / energy.
// The figure shows the energy ladder, the orbits and a photon leaving after the jump (press Emit).
import { canvas, text, title, row, slider, choice, button, readout, loop, arrow, lerp, ease } from '../../kit.js';

export default function (host) {
  let Z = 1, ni = 3, nf = 2, T = 1, ph = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Bohr energy levels with an electron jumping down and emitting a photon' });
  const ctl = row(host), ro = readout(host), E = (n) => -13.6 * Z * Z / (n * n);
  choice(ctl, 'atom or ion', [[1, 'H'], [2, 'He⁺'], [3, 'Li²⁺']], Z, (v) => { Z = v; go(); });
  slider(ctl, { label: 'from level n₂', min: 2, max: 6, step: 1, value: ni, fmt: (v) => v.toFixed(0), oninput: (v) => { ni = v; if (nf >= ni) { nf = ni - 1; f2.set(nf); } go(); } });
  const f2 = slider(ctl, { label: 'to level n₁', min: 1, max: 5, step: 1, value: nf, fmt: (v) => v.toFixed(0), oninput: (v) => { nf = Math.min(v, ni - 1); if (nf !== v) f2.set(nf); go(); } });
  button(ctl, 'Emit photon', () => { T = 0; ph = 0; });
  const SER = ['Lyman (UV)', 'Balmer (visible)', 'Paschen (IR)', 'Brackett (IR)', 'Pfund (IR)'];
  const go = () => { const dE = E(ni) - E(nf), lam = 1239.84 / dE; ro.textContent = `n = ${ni} → ${nf}: ΔE = ${dE.toFixed(2)} eV, λ = 1240/ΔE = ${lam.toFixed(0)} nm, ${SER[nf - 1]} series. r(n=${ni}) = ${(52.9 * ni * ni / Z).toFixed(0)} pm, r(n=${nf}) = ${(52.9 * nf * nf / Z).toFixed(0)} pm.`; T = 0; ph = 0; cv.redraw(); };
  loop(host, (dt) => { T = Math.min(1, T + dt / 1.2); if (T >= 1) ph = Math.min(1.4, ph + dt / 1.8); orb += dt * 2.5; cv.redraw(); });
  let orb = 0;
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Bohr model, Z = ${Z}`, col) + 10, lw = w * 0.46, YY = (n) => t0 + 8 + (h - t0 - 30) * (1 / (n * n));
    for (let n = 1; n <= 6; n++) { const y = YY(n); ctx.strokeStyle = n === ni || n === nf ? col.s[n === ni ? 3 : 0] : col.line; ctx.lineWidth = n === ni || n === nf ? 2.5 : 1.5; ctx.beginPath(); ctx.moveTo(34, y); ctx.lineTo(lw, y); ctx.stroke(); if (n <= 4) { text(ctx, `n=${n}`, 4, y, { color: col.muted, size: 10 }); text(ctx, `${E(n).toFixed(1)}`, lw + 3, y, { color: col.muted, size: 9.5 }); } }
    const ya = YY(ni), yb = YY(nf), x = lw * 0.55, yy = lerp(ya, yb, ease(T)); arrow(ctx, x, ya, x, yb + 0, col.s[1], 2, 7); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(x, yy, 5, 0, 7); ctx.fill();
    if (T >= 1) { const px = x + 10 + ph * (lw - x - 4); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const xx = px - 30 + i; ctx.lineTo(Math.min(xx, lw + 2), (ya + yb) / 2 + 7 * Math.sin(i * 0.6)); } ctx.stroke(); }
    const cx = lw + (w - lw) * 0.52, cy = t0 + (h - t0) / 2, sc = 0;
    for (let n = 1; n <= 6; n++) { const r = (n / 6) * Math.min((w - lw) * 0.46, (h - t0) / 2 - 8); ctx.strokeStyle = n === ni || n === nf ? col.s[n === ni ? 3 : 0] : col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); }
    const cur = T >= 1 ? nf : ni, rr = (cur / 6) * Math.min((w - lw) * 0.46, (h - t0) / 2 - 8); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, 7); ctx.fill(); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(cx + rr * Math.cos(orb), cy + rr * Math.sin(orb), 4.5, 0, 7); ctx.fill();
    text(ctx, 'E (eV), levels spaced ∝ 1/n', 4, t0 + 2, { color: col.muted, size: 10 });
  };
  go();
}
