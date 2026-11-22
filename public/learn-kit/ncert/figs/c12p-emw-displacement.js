// Class 12 Electromagnetic Waves: displacement current in a charging and discharging parallel-plate capacitor.
// Conduction current I flows in the wires (solid dots) and no charge crosses the gap, but E = Q/(eps0 A) changes, and
// I_d = eps0 dPhi_E/dt = eps0 A dE/dt = dQ/dt = I: the same current "continues" through the gap as a changing electric field.
import { canvas, line, text, title, arrow, row, slider, readout, loop, choice } from '../../kit.js';

export default function (host) {
  let A = 100, I = 2, t = 0, mode = 'auto';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'Charging capacitor with conduction current in the wires and displacement current between the plates' });
  const ctl = row(host);
  slider(ctl, { label: 'Plate area A', min: 50, max: 400, step: 10, value: A, fmt: (v) => `${v} cm²`, oninput: (v) => { A = v; upd(); } });
  slider(ctl, { label: 'Charging current I', min: 1, max: 5, step: 0.5, value: I, fmt: (v) => `${v} mA`, oninput: (v) => { I = v; upd(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const dEdt = () => (I * 1e-3) / (8.854e-12 * A * 1e-4);
  function upd() { out.innerHTML = `Wire: I = ${I} mA. Gap: E must change at dE/dt = I/(ε₀A) = <b>${dEdt().toExponential(2).replace('e+', ' × 10<sup>') + '</sup>'} V/m per s</b>, so ε₀A·dE/dt = <b>${I} mA</b> = I<sub>d</sub>. Same number, so the loop of current is complete.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Current I in the wire = displacement current in the gap', col);
    const cy = top + (h - top - 40) / 2 + 6, cx = w / 2, gap = 34, ph = Math.min(64, (h - top - 80) / 2);
    const ph0 = (t % 6) / 6, q = ph0 < 0.5 ? ph0 * 2 : 2 - ph0 * 2; // charge fraction rises then falls
    const dir = ph0 < 0.5 ? 1 : -1;
    line(ctx, [[14, cy], [cx - gap / 2, cy]], col.ink, 3); line(ctx, [[cx + gap / 2, cy], [w - 14, cy]], col.ink, 3);
    line(ctx, [[cx - gap / 2, cy - ph], [cx - gap / 2, cy + ph]], col.ink, 5); line(ctx, [[cx + gap / 2, cy - ph], [cx + gap / 2, cy + ph]], col.ink, 5);
    for (let k = 0; k < 6; k++) {
      const u = ((t * 0.5 * dir + k / 6) % 1 + 1) % 1;
      ctx.fillStyle = col.s[7]; ctx.beginPath(); ctx.arc(16 + u * (cx - gap / 2 - 22), cy, 3.5, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(w - 16 - (1 - u) * (w / 2 - gap / 2 - 22) * 1, cy, 3.5, 0, 7); ctx.fill();
    }
    const n = Math.round(1 + q * 5);
    for (let k = 0; k < n; k++) { const y = cy - ph + 10 + (k * (2 * ph - 20)) / Math.max(1, n - 1 || 1) * (n > 1 ? 1 : 0.5) + (n === 1 ? ph - 10 : 0); text(ctx, '+', cx - gap / 2 - 9, y, { color: col.s[3], size: 13, weight: 700, align: 'center' }); text(ctx, '−', cx + gap / 2 + 9, y, { color: col.s[0], size: 13, weight: 700, align: 'center' }); }
    ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * q; for (let k = -3; k <= 3; k++) arrow(ctx, cx - gap / 2 + 3, cy + k * (ph / 3.6), cx + gap / 2 - 3, cy + k * (ph / 3.6), col.s[5], 1.5 + 1.5 * q, 6); ctx.restore();
    text(ctx, `E ∝ Q (now ${Math.round(q * 100)}%)`, cx, cy + ph + 16, { color: col.s[5], size: 11.5, weight: 700, align: 'center' });
    text(ctx, dir > 0 ? 'charging: E growing' : 'discharging: E falling', cx, cy - ph - 20, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'I (conduction)', 14, cy - 14, { color: col.s[7], size: 11, weight: 700 });
    text(ctx, 'I_d = ε₀ dΦ_E/dt', cx, cy + ph + 34, { color: col.s[4], size: 12, weight: 700, align: 'center' });
  };
  upd();
}
