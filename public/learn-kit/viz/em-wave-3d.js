// An electromagnetic wave in 3D (drag to turn). It travels to the right; E (orange) points one way across the path and B
// (blue) at right angles to both E and the direction of travel. They rise and fall together, and E/B = c. Choose linear
// polarisation (turn its plane with the slider) or circular, where E turns like a screw as it moves. Strength sets E₀;
// the readout gives B₀ and the intensity.
import { canvas, text, row, slider, choice, readout, loop, arrow } from '../kit.js';
import { orbit } from './_3d.js';

export default function (host) {
  let kind = 'lin', psi = 0, E0 = 100, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 280, label: 'Electric and magnetic field vectors of an electromagnetic wave in 3D' });
  const cam = orbit(cv, { yaw: 0.6, pitch: 0.4 });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Polarisation', [['lin', 'Linear'], ['r', 'Circular (right)'], ['l', 'Circular (left)']], kind, (v) => { kind = v; upd(); });
  slider(c2, { label: 'Plane of E', min: 0, max: 90, value: psi, step: 5, fmt: (x) => x + '° from vertical', oninput: (x) => { psi = x; kind = 'lin'; upd(); } });
  slider(c2, { label: 'E₀', min: 10, max: 300, value: E0, step: 10, fmt: (x) => x + ' V/m', oninput: (x) => { E0 = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t += dt * 2.4; cv.redraw(); }); anim.button(ctl);
  function upd() { const B0 = E0 / 3e8, I = 0.5 * 8.854e-12 * 3e8 * E0 * E0; out.innerHTML = `E₀ = ${E0} V/m → B₀ = E₀/c = <b>${(B0 * 1e6).toFixed(2)} µT</b>; intensity I = ½ε₀cE₀² = <b>${I.toFixed(1)} W/m²</b>. E, B and the direction of travel are mutually perpendicular (E × B points along the motion) and E and B are <b>in phase</b>: both zero together, both maximum together. ${kind === 'lin' ? 'Linear: E stays in one plane.' : 'Circular: the tip of E traces a helix, turning ' + (kind === 'r' ? 'clockwise' : 'anticlockwise') + ' as seen head-on.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const P = cam.proj(w, h, Math.min(w / 4.6, h / 2.4), w / 2, h / 2 + 8), k = 2.4, pr = psi * Math.PI / 180, n = 34;
    const a0 = P([-2.1, 0, 0]), a1 = P([2.2, 0, 0]); arrow(ctx, a0[0], a0[1], a1[0], a1[1], col.muted, 1.5, 7); text(ctx, 'travel', a1[0] - 8, a1[1] + 12, { color: col.muted, size: 10.5, align: 'right' });
    const items = [];
    for (let i = 0; i <= n; i++) { const x = -2 + 4 * i / n, ph = k * x - t; let e;
      if (kind === 'lin') e = [Math.cos(ph) * Math.cos(pr), Math.cos(ph) * Math.sin(pr)]; else { const s = kind === 'r' ? 1 : -1; e = [Math.cos(ph), s * Math.sin(ph)]; }
      items.push({ x, e, b: [-e[1], e[0]] }); }
    // E in (y, z); B = x̂ × E = (−Ez, Ey) in (y,z)
    const E = (it) => [0, it.e[0] * 0.95, it.e[1] * 0.95], Bv = (it) => [0, it.b[0] * 0.95, it.b[1] * 0.95];
    const draw = (fn, c, wd) => { const ps = items.map((it) => { const v = fn(it); return P([it.x, v[1], v[2]]); }); ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.beginPath(); ps.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      items.forEach((it, i) => { if (i % 2) return; const v = fn(it), p0 = P([it.x, 0, 0]), p1 = P([it.x, v[1], v[2]]); if (Math.hypot(v[1], v[2]) > 0.05) arrow(ctx, p0[0], p0[1], p1[0], p1[1], c, 1.5, 5); }); };
    draw(Bv, col.s[0], 1.4); draw(E, col.s[5], 1.4);
    text(ctx, 'E', 12, 18, { color: col.s[5], size: 13, weight: 700 }); text(ctx, 'B', 32, 18, { color: col.s[0], size: 13, weight: 700 }); text(ctx, 'Drag to turn', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' });
  };
  upd();
}
