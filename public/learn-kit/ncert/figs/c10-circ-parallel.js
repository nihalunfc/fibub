// Class 10 Circles: tangents drawn at the two ends of a diameter are parallel. Each is perpendicular to the same line
// (the diameter), and two lines perpendicular to one line are parallel. Turn the diameter: the tangents turn with it and
// stay parallel, always exactly 2r apart.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let a = 30;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A circle with a rotating diameter and the two parallel tangents at its ends' });
  const ctl = row(host);
  const s = slider(ctl, { label: 'Turn the diameter', min: 0, max: 180, step: 1, value: a, fmt: (v) => v + '°', oninput: (v) => { a = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { a = (a + dt * 25) % 180; s.set(Math.round(a)); say(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  function say() { out.innerHTML = 'Both tangents make 90° with the diameter, so they are <b>parallel</b>. The gap between them is the diameter, <b>2r</b>, whichever way it points.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Tangents at the ends of a diameter', col);
    const R = Math.min(w * 0.19, (h - 70) * 0.24), cx = w / 2, cy = h / 2 + 10, t = (a * Math.PI) / 180, u = [Math.cos(t), -Math.sin(t)], v = [-u[1], u[0]], L = R * 1.0;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    const P = [cx + u[0] * R, cy + u[1] * R], Q = [cx - u[0] * R, cy - u[1] * R];
    line(ctx, [Q, P], col.s[0], 2.5);
    for (const [E, c] of [[P, col.s[1]], [Q, col.s[3]]]) { line(ctx, [[E[0] - v[0] * L, E[1] - v[1] * L], [E[0] + v[0] * L, E[1] + v[1] * L]], c, 3); dot(ctx, E[0], E[1], 5.5, c, col.panel); const m = 9; line(ctx, [[E[0] + (E === P ? -u[0] : u[0]) * m, E[1] + (E === P ? -u[1] : u[1]) * m], [E[0] + (E === P ? -u[0] : u[0]) * m + v[0] * m, E[1] + (E === P ? -u[1] : u[1]) * m + v[1] * m], [E[0] + v[0] * m, E[1] + v[1] * m]], col.ink, 1.3); }
    dot(ctx, cx, cy, 3.5, col.ink);
    text(ctx, 'A', P[0] + u[0] * 14, P[1] + u[1] * 14, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'B', Q[0] - u[0] * 14, Q[1] - u[1] * 14, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'AB = 2r', cx + 6 - u[1] * 14, cy + 14 + u[0] * 0, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
  };
  say();
}
