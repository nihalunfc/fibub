// Class 10 Areas Related to Circles: a running track (a stadium shape) is a rectangle with a semicircle on each end.
// Two straights of length L and two semicircles of radius r (together one full circle) give
// perimeter = 2L + 2πr and area = 2rL + πr². Slide L and r, and press Play to run a lap.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let L = 40, r = 14, t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 240, label: 'A running track made of a rectangle with two semicircular ends and a runner going round it' });
  const ctl = row(host);
  slider(ctl, { label: 'Straight L', min: 20, max: 60, step: 10, value: L, fmt: (v) => v + ' m', oninput: (v) => { L = v; say(); } });
  slider(ctl, { label: 'End radius r', min: 7, max: 21, step: 7, value: r, fmt: (v) => v + ' m', oninput: (v) => { r = v; say(); } });
  const anim = loop(host, (dt) => { t = (t + dt * 0.12) % 1; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function say() { const P = 22 / 7; out.innerHTML = `Lap = 2L + 2πr = ${2 * L} + ${(2 * P * r).toFixed(1)} = <b>${(2 * L + 2 * P * r).toFixed(1)} m</b>. Area = 2rL + πr² = ${2 * r * L} + ${(P * r * r).toFixed(1)} = <b>${(2 * r * L + P * r * r).toFixed(1)} m²</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Track: rectangle + two semicircles', col);
    const k = Math.min((w - 30) / (L + 2 * r), (h - 70) / (2 * r)), cx = w / 2, cy = h / 2 + 14, R = r * k, X = (L * k) / 2;
    ctx.beginPath(); ctx.moveTo(cx - X, cy - R); ctx.lineTo(cx + X, cy - R); ctx.arc(cx + X, cy, R, -Math.PI / 2, Math.PI / 2); ctx.lineTo(cx - X, cy + R); ctx.arc(cx - X, cy, R, Math.PI / 2, 1.5 * Math.PI); ctx.closePath();
    ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(cx - X, cy - R, 2 * X, 2 * R); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(cx + X, cy, R, -Math.PI / 2, Math.PI / 2); ctx.lineTo(cx + X, cy - R); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.beginPath(); ctx.arc(cx - X, cy, R, Math.PI / 2, 1.5 * Math.PI); ctx.lineTo(cx - X, cy + R); ctx.fill(); ctx.globalAlpha = 1;
    const P = 22 / 7, per = 2 * L + 2 * P * r, d = t * per; let x, y;
    if (d < L) { x = cx - X + (d / L) * 2 * X; y = cy - R; } else if (d < L + P * r) { const a = -Math.PI / 2 + ((d - L) / (P * r)) * Math.PI; x = cx + X + Math.cos(a) * R; y = cy + Math.sin(a) * R; } else if (d < 2 * L + P * r) { x = cx + X - ((d - L - P * r) / L) * 2 * X; y = cy + R; } else { const a = Math.PI / 2 + ((d - 2 * L - P * r) / (P * r)) * Math.PI; x = cx - X + Math.cos(a) * R; y = cy + Math.sin(a) * R; }
    dot(ctx, x, y, 6, col.s[3], col.ink);
    text(ctx, 'L', cx, cy - R + 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'r', cx + X + R * 0.4, cy - 2, { color: col.ink, size: 12, weight: 700 });
    line(ctx, [[cx + X, cy], [cx + X + R * 0.9, cy]], col.ink, 1.5, [4, 3]);
  };
  say();
}
