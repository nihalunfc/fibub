// Class 11 Laws of Motion: impulse and momentum. Impulse = area under the force-time graph = F_avg x dt = change of momentum = m (v - u). Catching a ball stops it whatever you do, so the area
// is fixed (m v); letting the hands go back lengthens the contact time and so lowers the force. Triangle-shaped force: peak force = 2 m v / dt.
import { canvas, text, title, axes, line, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let v = 30, dt = 0.02; const m = 0.16;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A force-time graph of a ball being caught with the area shaded' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Speed of the ball (m/s)', min: 10, max: 40, step: 1, value: v, fmt: (x) => x + '', oninput: (x) => { v = x; go(); } });
  const sl = slider(ctl, { label: 'Contact time (s)', min: 0.01, max: 0.2, value: dt, log: true, fmt: (x) => x.toFixed(3), oninput: (x) => { dt = x; go(); } });
  button(ctl, 'Stiff hands (0.01 s)', () => { dt = 0.01; sl.set(dt); go(); }); button(ctl, 'Hands pulled back (0.1 s)', () => { dt = 0.1; sl.set(dt); go(); });
  function go() { const J = m * v, avg = J / dt; out.innerHTML = `Ball of ${m} kg at ${v} m/s stopped: impulse = change of momentum = m v = <b>${J.toFixed(1)} N s</b> (the area, fixed). Average force = J/Δt = <b>${avg.toFixed(0)} N</b> (about ${(avg / (m * 9.8)).toFixed(0)} times the ball’s weight). Peak force of a triangular pulse = <b>${(2 * avg).toFixed(0)} N</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Impulse = area under the F–t graph', col);
    const Fmax = 2 * m * 40 / 0.01 * 1.0, A = axes(ctx, w, h, col, { x: [0, 0.2], y: [0, Fmax], xlabel: 'time (s)', ylabel: 'force on the ball (N)', l: 56, t: 30, xt: [0, 0.05, 0.1, 0.15, 0.2], yt: [0, 400, 800, 1200] }), J = m * v, pk = 2 * J / dt;
    ctx.save(); A.clip(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(0)); ctx.lineTo(A.X(dt / 2), A.Y(pk)); ctx.lineTo(A.X(dt), A.Y(0)); ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [[A.X(0), A.Y(0)], [A.X(dt / 2), A.Y(pk)], [A.X(dt), A.Y(0)]], col.s[0], 3); ctx.restore();
    ctx.textAlign = 'left'; text(ctx, `area = ${J.toFixed(1)} N s`, A.X(0.11), A.Y(Fmax * 0.5), { size: 12, weight: 700, color: col.s[0] });
    text(ctx, `peak ${pk.toFixed(0)} N`, A.X(dt / 2) + 8, Math.max(A.T + 12, A.Y(pk) + 2), { size: 11, weight: 700, color: col.s[3] });
  };
  go();
}
