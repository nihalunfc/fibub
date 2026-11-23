// Class 11 Mechanical Properties of Fluids: viscosity. (1) Plates: a fluid layer of thickness d between a fixed plate and a plate moved at v; layers slide at speeds between 0 and v, force F = eta A v / d (Newton's law).
// (2) Pipe: the layer at the wall sticks, the centre is fastest, the profile is a parabola v = vmax (1 - r^2/R^2). (3) Reynolds number Re = rho v D / eta decides if the flow stays in smooth layers (below about 1000-2000)
// or breaks into eddies (turbulence, above about 3000). Viscosity values (Pa s): water 0.001, oil 0.08, glycerine 1.4, honey ~10; pipe D = 2 cm.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'plates', v = 1, lg = -3, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'Layers of fluid sliding between plates, the velocity profile in a pipe, and laminar and turbulent flow' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Show', [['plates', 'sliding plates'], ['pipe', 'pipe profile'], ['re', 'laminar or turbulent']], mode, (m) => { mode = m; go(); });
  slider(ctl, { label: 'speed v (m/s)', min: 0.05, max: 5, step: 'any', value: v, log: true, fmt: (x) => x.toPrecision(2), oninput: (x) => { v = x; go(); } });
  slider(ctl, { label: 'viscosity η (Pa s, log scale)', min: 0.001, max: 10, value: Math.pow(10, lg), log: true, step: 'any', fmt: (x) => x.toPrecision(2), oninput: (x) => { lg = Math.log10(x); go(); } });
  const eta = () => Math.pow(10, lg), Re = () => 1000 * v * 0.02 / eta();
  const go = () => { ro.textContent = mode === 'plates' ? `F = ηAv/d: with A = 1 m², d = 1 cm the force is ${(eta() * 1 * v / 0.01).toPrecision(3)} N. Thicker fluid (larger η) needs more force.` : mode === 'pipe' ? `The wall layer stays still, the centre moves fastest. A thick fluid keeps the layers tied together.` : `Re = ρvD/η = ${Re().toPrecision(3)}: ${Re() < 2000 ? 'smooth layers (laminar)' : Re() < 4000 ? 'unsteady, in between' : 'eddies everywhere (turbulent)'}.`; cv.redraw(); };
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { plates: 'Layers slide: friction between them', pipe: 'Flow in a pipe: fastest in the middle', re: 'Smooth or turbulent flow?' }[mode], col) + 14, x0 = 20, x1 = w - 20;
    if (mode === 'plates') {
      const yt = top + 26, yb = h - 40, mv = Math.min(1, v / 5) * 0.85 + 0.1;
      ctx.fillStyle = col.line; ctx.fillRect(x0, yb, x1 - x0, 10); ctx.fillRect(x0 + (t * 30 * mv) % 14 - 14, yt - 12, x1 - x0, 12);
      arrow(ctx, x0 + 40, yt - 6, x0 + 40 + 20 + 50 * mv, yt - 6, col.s[1], 3, 8); text(ctx, 'F, plate speed v', x0 + 40, yt - 20, { color: col.s[1], size: 11, weight: 700 });
      for (let i = 0; i <= 6; i++) { const y = yt + (i / 6) * (yb - yt), f = 1 - i / 6, len = 8 + 70 * mv * f; line(ctx, [[x0 + 10, y], [x1 - 10, y]], col.line, 1, [2, 4]); if (f > 0) arrow(ctx, x0 + 24, y, x0 + 24 + len, y, col.s[0], 2, 6); const px = ((t * 80 * mv * f + i * 37) % (x1 - x0 - 20)) + x0 + 10; dot(ctx, px, y, 3, col.s[3]); }
      text(ctx, 'fixed plate: v = 0', x0 + 2, yb + 22, { color: col.muted, size: 10.5 }); text(ctx, 'd', x1 - 8, (yt + yb) / 2, { color: col.ink, size: 12, weight: 700 }); arrow(ctx, x1 - 18, yt + 2, x1 - 18, yb - 2, col.ink, 1.2, 5);
    } else if (mode === 'pipe') {
      const cy = top + (h - top) / 2 - 6, R = (h - top) * 0.34, wm = Math.min(1, v / 5) * 0.8 + 0.2;
      line(ctx, [[x0, cy - R], [x1, cy - R]], col.ink, 3); line(ctx, [[x0, cy + R], [x1, cy + R]], col.ink, 3);
      for (let i = -4; i <= 4; i++) { const r = (i / 4.5), len = (1 - r * r) * 110 * wm; const y = cy + r * R; if (len > 1) arrow(ctx, x0 + 30, y, x0 + 30 + len, y, col.s[0], 2, 5); }
      const pts = []; for (let i = -20; i <= 20; i++) { const r = i / 20; pts.push([x0 + 30 + (1 - r * r) * 110 * wm, cy + r * R]); } line(ctx, pts, col.s[3], 2.5, [5, 3]);
      text(ctx, 'wall: v = 0', x0 + 4, cy - R - 10, { color: col.muted, size: 10.5 }); text(ctx, 'centre: fastest', x1 - 4, cy, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    } else {
      const cy = top + (h - top) / 2 - 6, R = (h - top) * 0.34, r0 = Re(), turb = Math.min(1, Math.max(0, (r0 - 1500) / 3000)); line(ctx, [[x0, cy - R], [x1, cy - R]], col.ink, 3); line(ctx, [[x0, cy + R], [x1, cy + R]], col.ink, 3);
      for (let k = -4; k <= 4; k++) { const pts = [], base = cy + (k / 4.5) * R * 0.9; for (let x = x0; x <= x1; x += 5) { const xi = (x - x0) / (x1 - x0), amp = turb * R * 0.35 * Math.min(1, xi * 2.5), y = base + amp * (Math.sin(x * 0.09 + t * 5 * (0.5 + turb) + k * 1.7) + 0.6 * Math.sin(x * 0.21 - t * 7 + k * 2.9)) * 0.7; pts.push([x, Math.max(cy - R + 3, Math.min(cy + R - 3, y))]); } line(ctx, pts, col.s[k % 2 ? 0 : 2], 1.8); }
      text(ctx, turb < 0.05 ? 'laminar' : turb > 0.9 ? 'turbulent' : 'transition', x1 - 6, cy - R - 10, { color: col.ink, size: 12, weight: 700, align: 'right' });
    }
  };
  go();
}
