// Class 11 Oscillations: energy in SHM. U = (1/2) k x^2 (parabola), K = (1/2) k (A^2 - x^2), total E = (1/2) k A^2 stays constant. The ball slides in the parabolic
// well: fast at the bottom (all kinetic), still at the ends (all potential). Bars show K and U now. Time-averages of each are E/2 (a handy fact for exams).
import { canvas, axes, line, dot, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let A = 1, ph = 0, k = 2;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'A ball oscillating in a parabolic potential energy well with kinetic and potential energy bars' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'amplitude A', min: 0.3, max: 1.2, step: 0.1, value: A, fmt: (v) => v.toFixed(1), oninput: (v) => { A = v; cv.redraw(); upd(); } });
  const anim = loop(host, (dt) => { ph += dt * 1.8; cv.redraw(); upd(); }); anim.button(ctl);
  const upd = () => { const x = A * Math.cos(ph), U = 0.5 * k * x * x, E = 0.5 * k * A * A; ro.innerHTML = `x = ${x.toFixed(2)}:  U = ${U.toFixed(2)} J,  K = ${(E - U).toFixed(2)} J,  total E = <b>${E.toFixed(2)} J</b> (always). Average K = average U = E/2.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Energy swaps, the total stays', col);
    const E = 0.5 * k * 1.2 * 1.2, a = axes(ctx, w, h, col, { x: [-1.3, 1.3], y: [0, E * 1.15], xt: [-1, 0, 1], yt: [], xlabel: 'position x', ylabel: 'energy', l: 30, r: 70, t: top + 8, b: 40 });
    const pts = Array.from({ length: 81 }, (_, i) => { const x = -1.3 + 2.6 * i / 80; return [a.X(x), a.Y(0.5 * k * x * x)]; });
    ctx.save(); a.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    const Et = 0.5 * k * A * A; line(ctx, [[a.L, a.Y(Et)], [a.R, a.Y(Et)]], col.s[3], 2, [6, 4]); text(ctx, 'E', a.R - 4, a.Y(Et) - 9, { color: col.s[3], size: 12, weight: 700, align: 'right' });
    const x = A * Math.cos(ph), U = 0.5 * k * x * x;
    line(ctx, [[a.X(x), a.B], [a.X(x), a.Y(U)]], col.s[1], 3); line(ctx, [[a.X(x), a.Y(U)], [a.X(x), a.Y(Et)]], col.s[2], 3);
    dot(ctx, a.X(x), a.Y(U), 7, col.s[0], col.ink);
    const bx = a.R + 14, bw = 18, sc = (a.B - a.T) / (E * 1.15);
    ctx.fillStyle = col.s[1]; ctx.fillRect(bx, a.B - U * sc, bw, U * sc); ctx.fillStyle = col.s[2]; ctx.fillRect(bx + bw + 6, a.B - (Et - U) * sc, bw, (Et - U) * sc);
    text(ctx, 'U', bx + bw / 2, a.B + 12, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, 'K', bx + bw * 1.5 + 6, a.B + 12, { color: col.s[2], size: 11, weight: 700, align: 'center' });
  };
  upd(); cv.redraw();
}
