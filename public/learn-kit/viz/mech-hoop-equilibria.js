// A bead on a hoop that spins about its vertical diameter. Lagrangian: θ'' = sin θ (ω² cos θ − g/R). Below
// ω_c = √(g/R) the bottom is the only stable point; above it the bottom becomes unstable and two new stable points
// appear at cos θ₀ = g/(ω²R): a pitchfork bifurcation. The lower graph is the effective potential U(θ).
// Slide ω across ω_c, then press "Kick" to see the bead settle into a well.
import { canvas, text, row, slider, readout, loop, button, line, dot } from '../kit.js';
import { orbit, shapes } from './_3d.js';
import { G } from './_mech.js';

export default function (host) {
  const Rr = 0.5, g0 = G; // R = 0.5 m, ω_c = 4.43 rad/s
  let th = 0.3, om = 0, az = 0;
  const cv = canvas(host, { aspect: 1.05, max: 460, min: 340, label: 'A bead on a spinning hoop with a graph of its effective potential' });
  const cam = orbit(cv, { yaw: 0.5, pitch: 0.25 });
  const c1 = row(host);
  const sw = slider(c1, { label: 'Hoop spin ω', min: 0, max: 9, step: 0.1, value: 3, fmt: (v) => v.toFixed(1) + ' rad/s', oninput: () => show() });
  button(c1, 'Kick', () => { om += 3 * (Math.random() < 0.5 ? 1 : -1); th += 0.2; });
  const anim = loop(host, (dt) => {
    const w = sw.value, n = 8, h = dt / n;
    for (let i = 0; i < n; i++) { const a = Math.sin(th) * (w * w * Math.cos(th) - g0 / Rr) - 1.2 * om; om += a * h; th += om * h; }
    az += w * dt; cv.redraw();
  });
  anim.button(c1);
  const out = readout(host);
  const U = (t, w) => -g0 * Rr * Math.cos(t) - 0.5 * w * w * Rr * Rr * Math.sin(t) ** 2;
  function show() {
    const w = sw.value, wc = Math.sqrt(g0 / Rr);
    out.innerHTML = w <= wc ? `ω = ${w.toFixed(1)} < ω_c = ${wc.toFixed(2)} rad/s: one stable point, the bottom (θ = 0). With friction the bead always settles there.` : `ω = ${w.toFixed(1)} > ω_c = ${wc.toFixed(2)}: the bottom is now a hilltop in U; stable points at θ₀ = ±${((Math.acos(g0 / (w * w * Rr)) * 180) / Math.PI).toFixed(1)}°. The bead picks one side: symmetry is broken although the laws are symmetric.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const wv = sw.value, ys = h * 0.34, P = cam.proj(w, h, Math.min(w * 0.36, ys * 0.9), w / 2, ys);
    const circ = (a) => { const o = []; for (let i = 0; i <= 60; i++) { const t = (i / 60) * 6.2832; o.push([Math.sin(t) * Math.cos(a), -Math.cos(t), Math.sin(t) * Math.sin(a)]); } return o; };
    const proj = (arr) => arr.map((p) => { const q = P(p); return [q[0], q[1]]; });
    line(ctx, proj(circ(az)), col.muted, 3);
    line(ctx, [P([0, -1.15, 0]), P([0, 1.15, 0])].map((q) => [q[0], q[1]]), col.line, 2);
    const b = P([Math.sin(th) * Math.cos(az), -Math.cos(th), Math.sin(th) * Math.sin(az)]); dot(ctx, b[0], b[1], 8, col.s[1], col.panel);
    text(ctx, 'Drag to turn', 8, 14, { color: col.muted, size: 10 });
    const gx0 = 12, gx1 = w - 12, gy0 = h * 0.7, gy1 = h - 24, X = (t) => gx0 + ((t + 3.1416) / 6.2832) * (gx1 - gx0);
    const us = []; for (let t = -3.14; t <= 3.14; t += 0.05) us.push(U(t, wv));
    const mn = Math.min(...us), mx = Math.max(...us), Y = (u) => gy1 - ((u - mn) / (mx - mn || 1)) * (gy1 - gy0);
    const pts = []; for (let t = -3.14; t <= 3.14; t += 0.05) pts.push([X(t), Y(U(t, wv))]); line(ctx, pts, col.s[0], 2.5);
    const tt = ((th + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; dot(ctx, X(tt), Y(U(tt, wv)), 6, col.bad, col.panel);
    text(ctx, 'U(θ), θ from −180° to 180°', gx0, gy0 - 10, { color: col.muted, size: 10 });
    text(ctx, `θ = ${((tt * 180) / Math.PI).toFixed(0)}°`, gx1, gy0 - 10, { color: col.ink, size: 11, align: 'right' });
  };
  show();
}
