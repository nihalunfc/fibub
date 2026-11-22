// Class 12 Electric Charges and Fields: a dipole in a uniform field. Each charge feels a force qE, equal and opposite, so there is no net force
// but a torque tau = p E sin(theta) that turns p toward E. Potential energy U = -pE cos(theta). "Release" lets it swing (damped) to rest at theta = 0.
// The simulation uses theta'' = -(pE/I) sin(theta) with a little friction.
import { canvas, text, title, dot, arrow, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let th = 120 * Math.PI / 180, om = 0, run = false, sl;
  const pE = 6; // pE/I in 1/s^2
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'An electric dipole turning in a uniform electric field' });
  const ctl = row(host), ro = readout(host);
  sl = slider(ctl, { label: 'angle θ between p and E (°)', min: 0, max: 180, step: 1, value: 120, fmt: (v) => v.toFixed(0) + '°', oninput: (v) => { th = v * Math.PI / 180; om = 0; run = false; go(); } });
  button(ctl, 'Release', () => { om = 0; run = true; });
  button(ctl, 'Reset to 120°', () => { run = false; th = 120 * Math.PI / 180; om = 0; sl.set(120); go(); });
  loop(host, (dt) => { if (!run) return; for (let i = 0; i < 5; i++) { const d = dt / 5; om += (-pE * Math.sin(th) - 0.5 * om) * d; th += om * d; } sl.set(Math.min(180, Math.max(0, th * 180 / Math.PI))); go(); });
  const go = () => { const d = th * 180 / Math.PI; ro.textContent = `θ = ${d.toFixed(0)}°   torque τ = pE sin θ = ${Math.sin(th).toFixed(2)} pE   energy U = −pE cos θ = ${(-Math.cos(th)).toFixed(2)} pE`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Dipole in a uniform field: torque but no net force', col) + 4;
    const cx = w / 2, cy = (top + h) / 2 + 6, L = Math.min(w, h) * 0.26;
    for (let i = 0; i < 6; i++) { const y = top + 14 + i * (h - top - 30) / 5; arrow(ctx, 14, y, w - 14, y, col.line, 1.2, 6); }
    text(ctx, 'E', 20, top + 8, { color: col.muted, size: 12, weight: 700 });
    const px = Math.cos(th), py = -Math.sin(th); // p direction (from -q to +q)
    const P = [cx + px * L, cy + py * L], M = [cx - px * L, cy - py * L];
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...M); ctx.lineTo(...P); ctx.stroke();
    dot(ctx, ...P, 11, col.s[2]); dot(ctx, ...M, 11, col.s[0]); text(ctx, '+', P[0], P[1], { color: col.panel, size: 14, weight: 700, align: 'center' }); text(ctx, '−', M[0], M[1], { color: col.panel, size: 14, weight: 700, align: 'center' });
    arrow(ctx, P[0], P[1], P[0] + 40, P[1], col.s[3], 2.5); arrow(ctx, M[0], M[1], M[0] - 40, M[1], col.s[3], 2.5);
    text(ctx, 'qE', P[0] + 44, P[1] - 10, { color: col.s[3], size: 11, weight: 700 }); text(ctx, 'qE', M[0] - 44, M[1] - 10, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    arrow(ctx, cx, cy, cx + px * L * 0.6, cy + py * L * 0.6, col.s[7], 3.5); text(ctx, 'p', cx + px * L * 0.6 + 6, cy + py * L * 0.6 - 8, { color: col.s[7], size: 13, weight: 700 });
    dot(ctx, cx, cy, 3, col.ink);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, L * 0.3, 0, -th, true); ctx.stroke(); text(ctx, 'θ', cx + L * 0.36 * Math.cos(-th / 2), cy + L * 0.36 * Math.sin(-th / 2), { color: col.muted, size: 12 });
    const tq = Math.sin(th);
    if (Math.abs(tq) > 0.03) text(ctx, tq > 0 ? '↻ torque turns p toward E' : '', cx, h - 14, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    else text(ctx, th < 1 ? 'θ = 0: stable equilibrium (U smallest)' : 'θ = 180°: unstable equilibrium (U largest)', cx, h - 14, { color: col.s[3], size: 12, weight: 700, align: 'center' });
  };
  go();
}
