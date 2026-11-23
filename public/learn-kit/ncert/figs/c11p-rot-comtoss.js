// Class 11 Rotational Motion: the centre of mass of a spinning, thrown body follows a smooth parabola while every other point wiggles. Two masses joined by a light rod (m1 and m2)
// are thrown and spin at w. The centre of mass (at distance L m2/(m1+m2) from m1) moves as a projectile: x = u t, y = v t - 1/2 g t^2 whatever the spin.
import { canvas, line, text, title, dot, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let m1 = 1, m2 = 3, spin = 6, t = 0;
  const g = 9.8, ux = 3, uy = 6, T = 2 * uy / g, Lr = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A spinning dumbbell thrown through the air with the paths of both masses and of the centre of mass' });
  const ctl = row(host);
  slider(ctl, { label: 'Left mass m₁', min: 1, max: 6, step: 1, value: 1, fmt: (v) => v + ' kg', oninput: (v) => { m1 = v; } });
  slider(ctl, { label: 'Right mass m₂', min: 1, max: 6, step: 1, value: 3, fmt: (v) => v + ' kg', oninput: (v) => { m2 = v; } });
  slider(ctl, { label: 'Spin', min: 0, max: 12, step: 1, value: 6, fmt: (v) => v + ' rad/s', oninput: (v) => { spin = v; } });
  const b2 = row(host); const lp = loop(host, (dt) => { t += dt * 0.6; if (t > T + 0.6) t = 0; cv.redraw(); }); lp.button(b2);
  const ro = readout(host);
  const pos = (tt) => { const cx = ux * tt, cy = uy * tt - 0.5 * g * tt * tt, a = spin * tt, r1 = Lr * m2 / (m1 + m2), r2 = Lr * m1 / (m1 + m2); return { c: [cx, cy], p1: [cx - r1 * Math.cos(a), cy - r1 * Math.sin(a)], p2: [cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)] }; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Thrown and spinning: the centre of mass flies a parabola', col);
    const X = (x) => 24 + x / (ux * T + 1) * (w - 48), Y = (y) => h - 28 - y / (uy * uy / (2 * g) + 1) * (h - 28 - top - 14);
    line(ctx, [[10, Y(0)], [w - 10, Y(0)]], col.line, 2);
    const tt = Math.min(t, T), cpts = [], p1 = [], p2 = [];
    for (let k = 0; k <= 80; k++) { const q = pos(T * k / 80); cpts.push([X(q.c[0]), Y(q.c[1])]); }
    line(ctx, cpts, col.muted, 1.5, [5, 5]);
    for (let q = 0; q <= tt + 1e-9; q += 0.02) { const o = pos(q); p1.push([X(o.p1[0]), Y(o.p1[1])]); p2.push([X(o.p2[0]), Y(o.p2[1])]); }
    line(ctx, p1, col.s[0], 1.5); line(ctx, p2, col.s[2], 1.5);
    const o = pos(tt);
    line(ctx, [[X(o.p1[0]), Y(o.p1[1])], [X(o.p2[0]), Y(o.p2[1])]], col.ink, 2.5);
    dot(ctx, X(o.p1[0]), Y(o.p1[1]), 5 + m1, col.s[0], col.panel); dot(ctx, X(o.p2[0]), Y(o.p2[1]), 5 + m2, col.s[2], col.panel);
    const cx = X(o.c[0]), cy = Y(o.c[1]); line(ctx, [[cx - 7, cy], [cx + 7, cy]], col.ink, 3); line(ctx, [[cx, cy - 7], [cx, cy + 7]], col.ink, 3);
    text(ctx, 'centre of mass', X(ux * T / 2), Y(uy * uy / (2 * g)) - 16, { color: col.muted, size: 11, align: 'center' });
    ro.textContent = `The + marks the centre of mass, ${(Lr * m2 / (m1 + m2)).toFixed(2)} m from m₁ (closer to the heavier mass). Its path is the same parabola x = ut, y = vt − ½gt² however fast the rod spins or how heavy the ends are; only the ends trace wavy paths.`;
  };
  cv.redraw();
}
