// Class 11 Laws of Motion: a car on a flat circular road. The only horizontal force on the car is friction from the road, and it must supply the centripetal force m v^2 / r. Friction has a limit
// mu m g, so the greatest safe speed is v_max = sqrt(mu r g). Above it the friction cannot hold the car on the circle and it skids off along the tangent (Newton's first law).
import { canvas, text, title, line, dot, arrow, row, slider, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let r = 50, v = 14, mu = 0.6, ph = 0, skid = null, since = 0; const g = 9.8;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A car going round a flat circular road, skidding off when the speed is too high' });
  const ctl = row(host), out = readout(host);
  const vmax = () => Math.sqrt(mu * r * g);
  const reset = () => { ph = 0; skid = null; since = 0; };
  const anim = loop(host, (d) => { if (skid) { skid.s += v * d * 0.9; since += d; if (since > 2.5) reset(); } else { ph += (v / r) * d * Math.min(1, 2.5 / Math.max(v / r, 0.1)) * 1; if (v > vmax() + 0.05 && ph > 4.2) skid = { a: ph, s: 0 }; } cv.redraw(); });
  slider(ctl, { label: 'Speed v (m/s)', min: 5, max: 35, step: 1, value: v, fmt: (q) => q + ' m/s', oninput: (q) => { v = q; reset(); say(); } });
  slider(ctl, { label: 'Radius r (m)', min: 20, max: 100, step: 5, value: r, fmt: (q) => q + ' m', oninput: (q) => { r = q; reset(); say(); } });
  choice(ctl, 'Road', [[0.7, 'Dry'], [0.4, 'Wet'], [0.1, 'Icy']], 0.6 > 0.55 ? 0.7 : 0.7, (q) => { mu = q; reset(); say(); }); mu = 0.7;
  anim.button(ctl); button(ctl, 'Restart', () => { reset(); say(); });
  function say() { const need = v * v / r, have = mu * g; out.innerHTML = `Friction needed = m v²/r = m × <b>${need.toFixed(1)}</b> N per kg; friction available = μ m g = m × <b>${have.toFixed(1)}</b>. Greatest safe speed v<sub>max</sub> = √(μ r g) = <b>${vmax().toFixed(1)} m/s (${(vmax() * 3.6).toFixed(0)} km/h)</b>. ${v > vmax() ? 'The car is too fast: it skids off along the tangent.' : 'The car holds the curve.'} Mass does not matter.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Flat bend: friction is the centripetal force', col);
    const R = Math.min(w, h - 80) * 0.3, cx = w / 2, cy = h * 0.42 + 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.muted; ctx.lineWidth = 12; ctx.globalAlpha = 0.35; ctx.stroke(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
    let x, y; if (skid) { const bx = cx + R * Math.cos(skid.a), by = cy - R * Math.sin(skid.a), k = skid.s * 1.2; x = bx - Math.sin(skid.a) * k; y = by - Math.cos(skid.a) * k; line(ctx, [[bx, by], [x, y]], col.s[3], 2, [4, 3]); } else { x = cx + R * Math.cos(ph); y = cy - R * Math.sin(ph); }
    dot(ctx, x, y, 8, skid ? col.s[3] : col.s[0], col.ink);
    if (!skid) { const k = 0.8; arrow(ctx, x, y, x + (cx - x) * 0.45, y + (cy - y) * 0.45, col.s[3], 3, 8); arrow(ctx, x, y, x - Math.sin(ph) * 34, y - Math.cos(ph) * 34, col.s[1], 2.5, 7); }
    text(ctx, skid ? 'skidding: no centripetal force left' : 'friction to the centre', cx, cy, { size: 11, weight: 700, color: skid ? col.s[3] : col.s[3], align: 'center' });
    const need = v * v / r, have = mu * g, bw = w - 40, by = h - 46; ctx.fillStyle = col.line; ctx.fillRect(20, by, bw, 12); ctx.fillStyle = need > have ? col.s[3] : col.s[2]; ctx.fillRect(20, by, Math.min(bw, bw * need / (have * 1.5)), 12);
    line(ctx, [[20 + bw / 1.5, by - 4], [20 + bw / 1.5, by + 16]], col.ink, 2); text(ctx, 'limit μg', 20 + bw / 1.5, by - 12, { size: 10.5, weight: 700, align: 'center' }); text(ctx, 'v²/r needed', 20, by + 28, { size: 10.5, color: col.muted });
  };
  say();
}
