// Class 11 Motion in a Plane: uniform circular motion. Speed v is constant but the velocity (tangent to the circle) keeps turning, so there is an acceleration a = v^2/r = w^2 r
// directed at the centre (centripetal). Period T = 2 pi r / v, angular speed w = v / r. Change the radius and the speed; at high angular speeds the animation is slowed down
// to stay readable. Turn on the ghost arrows to see that the velocity changes direction while its length stays the same.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let r = 4, v = 6, ph = 0, trail = true;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A body moving on a circle with its velocity and centripetal acceleration arrows' });
  const ctl = row(host), out = readout(host);
  const anim = loop(host, (d) => { const w = v / r; ph += Math.min(w, 3) * d; cv.redraw(); });
  slider(ctl, { label: 'Radius r (m)', min: 1, max: 10, step: 0.5, value: r, fmt: (x) => x.toFixed(1), oninput: (x) => { r = x; say(); } });
  slider(ctl, { label: 'Speed v (m/s)', min: 1, max: 20, step: 0.5, value: v, fmt: (x) => x.toFixed(1), oninput: (x) => { v = x; say(); } });
  choice(ctl, 'Ghost velocity arrows', [[true, 'Show'], [false, 'Hide']], true, (x) => { trail = x; cv.redraw(); });
  anim.button(ctl);
  function say() { const w = v / r; out.innerHTML = `ω = v/r = <b>${w.toFixed(2)} rad/s</b>, period T = 2πr/v = <b>${(2 * Math.PI * r / v).toFixed(2)} s</b>, frequency <b>${(v / (2 * Math.PI * r)).toFixed(2)} Hz</b>. Centripetal acceleration a = v²/r = ω²r = <b>${(v * v / r).toFixed(1)} m/s²</b> (${(v * v / r / 9.8).toFixed(1)} g), pointing to the centre.${w > 3 ? ' (animation slowed down)' : ''}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Uniform circular motion', col);
    const R = Math.min(w, h - 40) * 0.34, cx = w / 2, cy = h / 2 + 12;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.stroke();
    dot(ctx, cx, cy, 3.5, col.ink); const k = Math.min(R * 0.9, 9 * v) / Math.max(v, 1), ka = Math.min(R * 0.85, 40 * (v * v / r) / 20 + 18) / 1;
    const at = (a) => [cx + R * Math.cos(a), cy - R * Math.sin(a)];
    if (trail) for (let i = 1; i < 6; i++) { const a = ph - i * 0.9, [x, y] = at(a); ctx.globalAlpha = 0.35; arrow(ctx, x, y, x - Math.sin(a) * 9 * k, y - Math.cos(a) * 9 * k, col.s[1], 1.8, 6); ctx.globalAlpha = 1; dot(ctx, x, y, 2.5, col.muted); }
    const [x, y] = at(ph);
    line(ctx, [[cx, cy], [x, y]], col.line, 1, [3, 3]);
    arrow(ctx, x, y, x - Math.sin(ph) * 9 * k, y - Math.cos(ph) * 9 * k, col.s[1], 3, 9); arrow(ctx, x, y, x + (cx - x) * ka / R, y + (cy - y) * ka / R, col.s[3], 3, 9);
    dot(ctx, x, y, 8, col.s[0], col.ink);
    text(ctx, 'v (tangent)', x - Math.sin(ph) * 9 * k + (Math.sin(ph) > 0 ? -6 : 6), y - Math.cos(ph) * 9 * k - 8, { size: 11, weight: 700, color: col.s[1], align: Math.sin(ph) > 0 ? 'right' : 'left', halo: col.panel });
    text(ctx, 'a (to centre)', cx, cy + 22, { size: 11, weight: 700, color: col.s[3], align: 'center' });
  };
  say();
}
