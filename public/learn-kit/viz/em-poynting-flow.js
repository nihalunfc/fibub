// Where the energy goes, shown by the Poynting vector S = E × B/μ₀. In a current-carrying wire, E (along the wire) and B
// (round it) make S point INTO the wire from the sides: the heat I²R is delivered through the surrounding field, not carried
// along inside the metal. In a charging capacitor S points in from the edges and fills the gap with field energy. Slide the
// current; arrows are the energy flow (pulses move in the direction of S).
import { canvas, text, row, slider, choice, readout, loop, arrow, line } from '../kit.js';

export default function (host) {
  let mode = 'wire', I = 3, Rl = 0.5, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 270, label: 'Energy flow into a current-carrying wire and a charging capacitor' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Case', [['wire', 'Wire carrying current'], ['cap', 'Charging capacitor']], mode, (v) => { mode = v; upd(); });
  slider(c2, { label: 'Current I', min: 0.5, max: 5, value: I, step: 0.5, fmt: (x) => x.toFixed(1) + ' A', oninput: (x) => { I = x; upd(); } });
  slider(c2, { label: 'Resistance per metre', min: 0.1, max: 1, value: Rl, step: 0.05, fmt: (x) => x.toFixed(2) + ' Ω/m', oninput: (x) => { Rl = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(c2);
  function upd() { const a = 0.001, E = I * Rl, B = 2e-7 * I / a, S = E * B / (4e-7 * Math.PI);
    out.innerHTML = mode === 'wire' ? `Wire of radius 1 mm: E = IR′ = ${E.toFixed(2)} V/m along the wire; B at the surface = μ₀I/2πa = ${(B * 1e3).toFixed(2)} mT. S = EB/μ₀ = <b>${S.toFixed(0)} W/m²</b> inward. Over the surface 2πa this is S·2πa = EI = <b>${(E * I).toFixed(2)} W per metre</b>, exactly I²R′: the energy that heats the wire.` : `Charging capacitor: between the plates E grows as the charge builds, and the changing E makes a B that circles the axis. E × B at the rim points <b>inward</b>, so the field energy ½ε₀E² fills the gap from the edges. The power through the rim is exactly P = VI = d(½CV²)/dt, the rate the stored energy grows. Slide I: more current, more energy flowing in.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cy = h / 2 + 6, ph = (t * 0.5) % 1;
    if (mode === 'wire') {
      ctx.fillStyle = col.soft; ctx.fillRect(14, cy - 14, w - 28, 28); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(14, cy - 14, w - 28, 28);
      arrow(ctx, 40, cy, 120, cy, col.s[5], 2.4, 9); text(ctx, 'I, and E along the wire', 40, cy + 26 - 12 + 0, { color: col.s[5], size: 11, weight: 700 });
      for (let x = 50; x < w - 40; x += 46) { text(ctx, '⊙', x, cy - 42, { color: col.s[0], size: 15, align: 'center' }); text(ctx, '⊗', x, cy + 52, { color: col.s[0], size: 15, align: 'center' }); }
      text(ctx, 'B out of page (above)', w - 12, cy - 66, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'B into page (below)', w - 12, cy + 80, { color: col.s[0], size: 10.5, weight: 700, align: 'right' });
      for (let x = 40; x < w - 40; x += 46) for (const sg of [-1, 1]) { const y0 = cy + sg * 62, f = (ph + x / 300) % 1, yy = y0 - sg * f * 44, len = 12; arrow(ctx, x, yy, x, yy - sg * len, col.s[2], 2.2 + I * 0.2, 7); }
      text(ctx, 'S = E × B/μ₀ points INTO the wire', 12, 16, { color: col.s[2], size: 12, weight: 700 });
    } else {
      const cx = w / 2, R = 62, g = 38; ctx.fillStyle = col.ink; ctx.fillRect(cx - g / 2 - 4, cy - R, 4, 2 * R); ctx.fillRect(cx + g / 2, cy - R, 4, 2 * R);
      line(ctx, [[10, cy], [cx - g / 2 - 4, cy]], col.ink, 2.2); line(ctx, [[cx + g / 2 + 4, cy], [w - 10, cy]], col.ink, 2.2);
      for (let k = 0; k < 6; k++) { const yy = cy - R + 10 + k * (2 * R - 20) / 5; arrow(ctx, cx - g / 2 + 2, yy, cx + g / 2 - 2, yy, col.s[5], 1.2 + 0.7 * ph, 5); }
      for (let j = 0; j < 5; j++) { const yy = cy - R + 14 + j * (2 * R - 28) / 4; for (const sg of [-1, 1]) { const f = (ph + j * 0.13) % 1; const x1 = cx + sg * (g / 2 + 4 + 70 - f * 70); arrow(ctx, x1, yy, x1 - sg * 10, yy, col.s[2], 2, 6); } }
      text(ctx, 'B circles the axis (⊙ / ⊗ at the rim)', 12, 16, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'Energy flows in from the sides (green)', 12, h - 10, { color: col.s[2], size: 11.5, weight: 700 });
    }
  };
  upd();
}
