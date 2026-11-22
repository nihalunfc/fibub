// Class 9 Science, Chapter 4: uniform circular motion. A stone whirled on a string keeps a constant SPEED but its
// DIRECTION changes all the time, so its velocity changes and it is accelerating (toward the centre, a = v²/r). Cut the
// string and it flies off along the tangent in a straight line at the same speed.
import { canvas, text, title, line, dot, arrow, row, slider, button, choice, loop, readout } from '../../kit.js';

export default function (host) {
  let v = 4, r = 2, ang = 0, cut = null, arrows = 'both', off = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A stone moving in a circle with its velocity arrow along the tangent and acceleration arrow towards the centre' });
  const ctl = row(host);
  slider(ctl, { label: 'Speed', min: 1, max: 8, step: 0.5, value: v, fmt: (x) => `${x} m/s`, oninput: (x) => { v = x; } });
  slider(ctl, { label: 'Radius', min: 1, max: 3, step: 0.25, value: r, fmt: (x) => `${x} m`, oninput: (x) => { r = x; } });
  choice(ctl, 'Show', [['both', 'v and a'], ['v', 'velocity only'], ['none', 'none']], arrows, (x) => { arrows = x; });
  const anim = loop(host, (dt) => {
    if (cut) { cut.x += cut.vx * dt * 22; cut.y += cut.vy * dt * 22; off += dt; if (off > 2.2) { cut = null; off = 0; } } else ang += (v / r) * dt * 0.8;
    show(); cv.redraw();
  });
  anim.button(ctl); button(ctl, 'Cut the string', () => { if (cut) return; const x = Math.cos(ang) * r, y = Math.sin(ang) * r; cut = { x, y, vx: -Math.sin(ang) * v, vy: Math.cos(ang) * v }; off = 0; });
  const out = readout(host);
  const show = () => { out.innerHTML = cut ? 'String cut: no force pulls it inwards now, so it moves in a <b>straight line</b> along the tangent (Newton’s first law).' : `Speed <b>${v} m/s</b> never changes. Direction changes all the time, so velocity changes. Acceleration a = v²/r = <b>${(v * v / r).toFixed(1)} m/s²</b> towards the centre. One turn takes T = 2πr/v = <b>${(2 * Math.PI * r / v).toFixed(2)} s</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Whirling a stone on a string', col) + 4, cx = w / 2, cy = top + (h - top) / 2, k = Math.min(w, h - top) / 2 / 3.6;
    ctx.save(); ctx.strokeStyle = col.line; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, r * k, 0, 7); ctx.stroke(); ctx.restore();
    dot(ctx, cx, cy, 4, col.ink);
    const px = cut ? cx + cut.x * k : cx + Math.cos(ang) * r * k, py = cut ? cy - cut.y * k : cy - Math.sin(ang) * r * k;
    if (!cut) line(ctx, [[cx, cy], [px, py]], col.muted, 1.5);
    const tx = cut ? cut.vx : -Math.sin(ang), ty = cut ? cut.vy : Math.cos(ang), L = 6 * v + 8;
    if (arrows !== 'none') arrow(ctx, px, py, px + (tx / Math.hypot(tx, ty)) * L, py - (ty / Math.hypot(tx, ty)) * L, col.s[0], 2.5, 9);
    if (arrows === 'both' && !cut) { const La = 3.2 * v * v / r + 6, dx = (cx - px) / (r * k), dy = (cy - py) / (r * k); arrow(ctx, px, py, px + dx * La, py + dy * La, col.s[2], 2.5, 9); }
    dot(ctx, px, py, 8, col.s[1], col.panel);
    if (arrows !== 'none') { text(ctx, 'velocity (along the path)', 10, h - 34, { color: col.s[0], size: 11, weight: 700 }); if (arrows === 'both') text(ctx, 'acceleration (towards centre)', 10, h - 16, { color: col.s[2], size: 11, weight: 700 }); }
  };
  show(); cv.redraw();
}
