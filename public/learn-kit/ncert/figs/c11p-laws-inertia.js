// Class 11 Laws of Motion: Newton's first law (inertia) with a block on the floor of a bus. When the bus speeds up or brakes, a block on a smooth floor has no horizontal force on it, so
// it keeps its own velocity: in the ground frame it goes on at constant speed while the bus changes; in the bus it seems to slide backwards (start) or forwards (brake). With friction
// on a rough floor the floor pushes the block along with the bus. Switch the viewing frame to see the same event from the road and from inside.
import { canvas, text, title, line, dot, arrow, row, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let scene = 'start', rough = false, frame = 'ground', t = 0, hold = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'A bus with a block on its floor viewed from the road or from inside the bus' });
  const ctl = row(host), out = readout(host);
  const P = () => scene === 'start' ? { v0: 0, a: 2, T: 2.5 } : { v0: 6, a: -3, T: 2.4 };
  const xb = (q) => { const { v0, a } = P(); const tt = scene === 'brake' ? Math.min(q, 2) : q; return v0 * tt + 0.5 * a * tt * tt; };
  const loc = (q) => { if (rough) return 2; const { v0, a } = P(); const s = 2 + (scene === 'start' ? -0.5 * a * q * q : 0.5 * -a * Math.min(q, 2) ** 2 + (q > 2 ? 0 : 0)); return Math.max(0.5, Math.min(7.5, s)); };
  const anim = loop(host, (d) => { if (hold > 0) { hold -= d; if (hold <= 0) t = 0; } else { t += d; if (t >= P().T) { t = P().T; hold = 1.2; } } say(); });
  choice(ctl, 'Bus', [['start', 'Starts off'], ['brake', 'Brakes hard']], scene, (v) => { scene = v; t = 0; hold = 0; say(); });
  choice(ctl, 'Floor', [[false, 'Smooth'], [true, 'Rough']], false, (v) => { rough = v; t = 0; hold = 0; say(); });
  choice(ctl, 'View from', [['ground', 'The road'], ['bus', 'Inside the bus']], frame, (v) => { frame = v; say(); });
  anim.button(ctl);
  function say() {
    const m = rough ? 'Friction from the floor pushes the block along with the bus, so it moves with it.' : scene === 'start' ? 'No force acts on the block, so it keeps its velocity (zero) while the floor moves forward under it: it seems to slide backwards.' : 'No force acts on the block, so it keeps moving at 6 m/s while the bus slows: it slides forward.';
    out.innerHTML = `${m} <b>Inertia</b> is the body’s tendency to keep its state of rest or of uniform motion; an unbalanced force is needed to change it. ${frame === 'bus' ? 'In the bus the “backward push” is only the road’s view turned around: it is not a real force.' : 'From the road there is nothing mysterious: the block just keeps going.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, (scene === 'start' ? 'Bus starts' : 'Bus brakes') + ' (' + (frame === 'ground' ? 'as seen from the road' : 'as seen from inside') + ')', col);
    const gy = h * 0.72, S = (w - 20) / 17, cam = frame === 'ground' ? 0 : xb(t) - 3, X = (xw) => 10 + (xw + 1 - cam) * S;
    line(ctx, [[0, gy], [w, gy]], col.ink, 2);
    for (let k = -8; k <= 40; k++) { const x = X(k * 4); if (x > -5 && x < w + 5) { line(ctx, [[x, gy], [x, gy + 9]], col.muted, 1.5); } }
    const bx = xb(t), x0 = X(bx), bw = 8 * S, bh = 58;
    ctx.fillStyle = col.soft; ctx.fillRect(x0, gy - bh - 4, bw, bh); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.strokeRect(x0, gy - bh - 4, bw, bh);
    dot(ctx, x0 + 0.15 * bw, gy - 5, 5, col.ink); dot(ctx, x0 + 0.85 * bw, gy - 5, 5, col.ink);
    const l = loc(t), kx = x0 + l * S - 9; ctx.fillStyle = col.s[3]; ctx.fillRect(kx, gy - 22, 18, 18); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(kx, gy - 22, 18, 18);
    text(ctx, 'block', kx + 9, gy - 30, { size: 10.5, weight: 700, color: col.s[3], align: 'center' });
    const { a, v0 } = P(), va = v0 + a * (scene === 'brake' ? Math.min(t, 2) : t);
    arrow(ctx, x0 + bw + 6, gy - 30, x0 + bw + 6 + Math.sign(va || a) * Math.min(40, Math.abs(va) * 6 + 8), gy - 30, col.s[1], 3, 8);
    text(ctx, `bus ${va.toFixed(1)} m/s`, x0 + bw / 2, gy - bh - 14, { size: 11, weight: 700, color: col.s[0], align: 'center' });
    text(ctx, 'posts on the road (4 m apart)', 10, h - 8, { size: 10, color: col.muted });
  };
  say();
}
