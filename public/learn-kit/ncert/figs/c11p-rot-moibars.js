// Class 11 Rotational Motion: same mass, same radius, different moment of inertia. Every shape gets the same torque for the same time, so alpha = torque / I:
// the ring (I = M R^2) turns slowest, the solid sphere (2/5 M R^2) fastest of the round ones. A rod of length 2R is shown about its middle and about its end (I = M L^2/12 and M L^2/3).
import { canvas, line, text, title, row, slider, readout, loop } from '../../kit.js';

const ROWS = [
  ['rod (end)', 4 / 3], ['ring', 1], ['hollow sphere', 2 / 3], ['disc', 1 / 2], ['solid sphere', 2 / 5], ['rod (middle)', 1 / 3],
];

export default function (host) {
  let t = 0, tau = 4;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Six shapes of equal mass pushed by the same torque, with bars showing how fast each spins' });
  const ctl = row(host);
  slider(ctl, { label: 'Push (torque)', min: 1, max: 8, step: 0.5, value: 4, fmt: (v) => v + ' N m', oninput: (v) => { tau = v; } });
  const b2 = row(host); const lp = loop(host, (dt) => { t += dt; if (t > 5) t = 0; cv.redraw(); }); lp.button(b2);
  const ro = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same torque, same time: who spins fastest?', col), M = 1, R = 1;
    const rh = (h - top - 22) / ROWS.length, wmax = tau * 5 / (1 / 3 * M * R * R), x0 = 152, bw = w - x0 - 52;
    ROWS.forEach(([name, c], i) => {
      const y = top + 14 + i * rh + rh / 2, I = c * M * R * R, al = tau / I, om = al * t, th = 0.5 * al * t * t * 0.12;
      ctx.save(); ctx.translate(26, y); ctx.rotate(th);
      ctx.strokeStyle = col.s[i % 8]; ctx.fillStyle = col.s[i % 8]; ctx.lineWidth = 3;
      if (name.startsWith('rod')) { ctx.fillRect(name.includes('end') ? 0 : -9, -2.5, 18, 5); ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(0, 0, 2, 0, 6.3); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(0, 0, 9, 0, 6.3); if (name === 'ring' || name === 'hollow sphere') ctx.stroke(); else { ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1; } ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(9, 0); ctx.stroke(); }
      ctx.restore();
      text(ctx, name, 44, y - 6, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'I = ' + (c === 4 / 3 ? '4/3' : c === 1 ? '1' : c === 2 / 3 ? '2/3' : c === 1 / 2 ? '1/2' : c === 2 / 5 ? '2/5' : '1/3') + ' M R²', 44, y + 8, { color: col.muted, size: 10 });
      ctx.fillStyle = col.line; ctx.fillRect(x0, y - 6, bw, 12); ctx.fillStyle = col.s[i % 8]; ctx.fillRect(x0, y - 6, Math.min(bw, om / wmax * bw), 12);
      text(ctx, om.toFixed(1), w - 8, y, { color: col.ink, size: 11, weight: 700, align: 'right' });
    });
    text(ctx, 'ω (rad/s) after ' + t.toFixed(1) + ' s', x0, h - 8, { color: col.muted, size: 10.5 });
    ro.textContent = `Every shape has M = 1 kg and R = 1 m (the rod is 2 m long). α = torque ÷ I, so the smaller the I, the faster it spins up. Mass concentrated far from the axis (ring, rod end) resists turning most.`;
  };
  cv.redraw();
}
