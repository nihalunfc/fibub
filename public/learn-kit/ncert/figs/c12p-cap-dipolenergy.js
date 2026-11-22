// Class 12 Electrostatic Potential and Capacitance: potential energy of a dipole in a uniform field, U = -pE cos(theta), and the torque tau = pE sin(theta).
// The graph has its minimum at theta = 0 (stable equilibrium) and its maximum at 180 deg (unstable). The work to turn a dipole from theta1 to theta2 is U(theta2) - U(theta1).
import { canvas, text, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let t1 = 0, t2 = 90;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Potential energy and torque of a dipole against its angle to the field' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'start angle θ₁ (°)', min: 0, max: 180, step: 5, value: t1, fmt: (v) => v.toFixed(0) + '°', oninput: (v) => { t1 = v; go(); } });
  slider(ctl, { label: 'end angle θ₂ (°)', min: 0, max: 180, step: 5, value: t2, fmt: (v) => v.toFixed(0) + '°', oninput: (v) => { t2 = v; go(); } });
  const U = (d) => -Math.cos(d * Math.PI / 180);
  const go = () => { ro.textContent = `Work to turn p from ${t1}° to ${t2}° = U₂ − U₁ = pE(cos θ₁ − cos θ₂) = ${(U(t2) - U(t1)).toFixed(2)} pE.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 180], y: [-1.1, 1.1], xt: [0, 45, 90, 135, 180], yt: [-1, 0, 1], fx: (v) => v + '°', fy: (v) => (v === 0 ? '0' : (v > 0 ? '+pE' : '−pE')), xlabel: 'angle θ between p and E', l: 50, t: 28 });
    const u = [], tq = []; for (let i = 0; i <= 90; i++) { u.push([A.X(i * 2), A.Y(U(i * 2))]); tq.push([A.X(i * 2), A.Y(Math.sin(i * 2 * Math.PI / 180))]); }
    line(ctx, u, col.s[0], 3); line(ctx, tq, col.s[1], 2, [5, 3]);
    text(ctx, 'U = −pE cos θ', A.X(100), A.Y(-0.85), { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, 'torque pE sin θ', A.X(35), A.Y(1.02) - 2, { color: col.s[1], size: 11.5, weight: 700 });
    dot(ctx, A.X(t1), A.Y(U(t1)), 6, col.s[2], col.panel); dot(ctx, A.X(t2), A.Y(U(t2)), 6, col.s[3], col.panel);
    text(ctx, '1', A.X(t1), A.Y(U(t1)) - 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, '2', A.X(t2), A.Y(U(t2)) - 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, 'stable', A.X(0) + 24, A.Y(-1) - 12, { color: col.muted, size: 10.5 }); text(ctx, 'unstable', A.X(180) - 8, A.Y(1) + 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  go();
}
