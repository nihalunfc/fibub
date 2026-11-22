// A gyroscope on a pivot: gravity pulls the far end down, giving a torque τ = m g r that is horizontal and at right
// angles to the spin angular momentum L. So L does not fall, it turns sideways: precession at Ω = τ/L = m g r/(Iω).
// Drag to turn the view. Slow the spin and the precession speeds up; double the spin and it halves.
import { canvas, text, row, slider, readout, loop, button, arrow, line } from '../kit.js';
import { orbit, shapes, wire } from './_3d.js';
import { G } from './_mech.js';

export default function (host) {
  let phi = 0, spin = 0;
  const cv = canvas(host, { aspect: 0.82, max: 400, min: 290, label: 'A spinning gyroscope disc on a horizontal axle, precessing about a vertical pivot' });
  const cam = orbit(cv, { yaw: 0.5, pitch: 0.4 });
  const c1 = row(host);
  const sw = slider(c1, { label: 'Spin ω', min: 10, max: 120, step: 5, value: 50, fmt: (v) => v + ' rad/s' });
  const sm = slider(c1, { label: 'Mass hung', min: 0.5, max: 2, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) + ' kg' });
  const M = 1, R = 0.1, r = 0.15, I = () => 0.5 * M * R * R;
  const Om = () => ((M * sm.value) * G * r) / (I() * sw.value); // rad/s (model: M of disc 1 kg, extra hung m)
  const anim = loop(host, (dt) => { phi -= Om() * dt * 0.35; spin += sw.value * dt * 0.08; cv.redraw(); show(); });
  anim.button(c1); button(c1, 'Reset', () => { phi = 0; });
  const out = readout(host);
  function show() {
    const L = I() * sw.value, tau = sm.value * G * r;
    out.innerHTML = `L = Iω = ${L.toFixed(3)} kg m²/s. Torque τ = mgr = ${tau.toFixed(2)} N m (horizontal, ⊥ L). Precession Ω = τ/L = <b>${Om().toFixed(2)} rad/s</b> (one turn in ${(6.283 / Om()).toFixed(1)} s; animation slowed). Pink arrow: L. Green arrow: torque. Each instant ΔL = τ Δt points along τ, so L turns without changing size.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const P = cam.proj(w, h, Math.min(w, h) * 0.5, w / 2, h * 0.55);
    const a = [Math.cos(phi), 0, Math.sin(phi)], b = [-Math.sin(phi), 0, Math.cos(phi)];
    const at = (p) => [p[0] * a[0] + p[2] * b[0], p[1], p[0] * a[2] + p[2] * b[2]];
    line(ctx, [P([0, -1, 0]), P([0, 0, 0])].map((q) => [q[0], q[1]]), col.muted, 5);
    line(ctx, [P([-0.3, -1, 0]), P([0.3, -1, 0])].map((q) => [q[0], q[1]]), col.muted, 5);
    // axle and disc (disc plane perpendicular to the axle: model axle along local z)
    line(ctx, [P(at([0, 0, -0.35])), P(at([0, 0, 1.15]))].map((q) => [q[0], q[1]]), col.ink, 4);
    const circ = []; for (let i = 0; i <= 48; i++) { const t = (i / 48) * 6.2832; circ.push(at([0.55 * Math.cos(t), 0.55 * Math.sin(t), 0.9])); }
    line(ctx, circ.map((p) => { const q = P(p); return [q[0], q[1]]; }), col.s[0], 3);
    for (let k = 0; k < 4; k++) { const t = spin + (k * Math.PI) / 2, q0 = P(at([0, 0, 0.9])), q1 = P(at([0.55 * Math.cos(t), 0.55 * Math.sin(t), 0.9])); line(ctx, [[q0[0], q0[1]], [q1[0], q1[1]]], col.s[0], 2); }
    const piv = P([0, 0, 0]), tipL = P(at([0, 0, 1.45])), ts = P(at([-0.9, 0, 0]));
    arrow(ctx, piv[0], piv[1], tipL[0], tipL[1], col.s[3], 3);
    const t0 = P([0, 0, 0]), tgt = P(at([0.8, 0, 0]));
    arrow(ctx, t0[0], t0[1], tgt[0], tgt[1], col.s[2], 3);
    const hang = P(at([0, 0, 1.15])); const hy = P(at([0, -0.35, 1.15]));
    line(ctx, [[hang[0], hang[1]], [hy[0], hy[1]]], col.ink, 1.5); ctx.fillStyle = col.s[1]; ctx.fillRect(hy[0] - 7, hy[1], 14, 14);
    text(ctx, 'L', tipL[0] + 8, tipL[1] - 4, { color: col.s[3], size: 13, weight: 700 }); text(ctx, 'τ', tgt[0] + 8, tgt[1], { color: col.s[2], size: 13, weight: 700 });
    text(ctx, 'Drag to turn', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' });
  };
  show();
}
