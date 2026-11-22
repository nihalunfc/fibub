// Class 10 Circles: the length of a tangent. If P is at distance d from the centre O and the radius is r, the tangent PT is
// perpendicular to OT, so triangle OTP is right-angled at T and PT = √(d² − r²) (Pythagoras). Slide r and d to see the triangle.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let r = 3, d = 5;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 270, label: 'A circle with a tangent from an outside point forming a right triangle with sides r, PT and d' });
  const ctl = row(host);
  slider(ctl, { label: 'Radius r', min: 1, max: 6, step: 0.5, value: r, fmt: (v) => v + ' cm', oninput: (v) => { r = v; say(); } });
  slider(ctl, { label: 'Distance OP = d', min: 2, max: 12, step: 0.5, value: d, fmt: (v) => v + ' cm', oninput: (v) => { d = v; say(); } });
  const out = readout(host);
  function say() { out.innerHTML = d <= r ? `d ≤ r: P is not outside the circle, so there is no tangent length. Make d bigger than r.` : `PT² = d² − r² = ${d}² − ${r}² = ${(d * d - r * r).toFixed(2)}, so PT = <b>${Math.sqrt(d * d - r * r).toFixed(2)} cm</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Tangent length = √(d² − r²)', col);
    const k = Math.min((w - 40) / 12.5, (h - 90) / (2 * 6.4)), cx = 20 + 6 * k, cy = h / 2 + 14, R = r * k, P = [cx + d * k, cy];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    dot(ctx, cx, cy, 3.5, col.ink); text(ctx, 'O', cx - 12, cy + 3, { color: col.ink, size: 12, weight: 700 });
    if (d <= r) { dot(ctx, P[0], P[1], 6, col.bad, col.panel); text(ctx, 'P', P[0] + 10, P[1] - 10, { color: col.ink, size: 13, weight: 700 }); return; }
    const a = Math.acos(r / d), T = [cx + Math.cos(-a) * R, cy + Math.sin(-a) * R];
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(T[0], T[1]); ctx.lineTo(P[0], P[1]); ctx.closePath(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [[cx, cy], T], col.s[0], 3); line(ctx, [T, P], col.s[1], 3.5); line(ctx, [[cx, cy], P], col.muted, 2, [5, 4]);
    const m = 10, u = [(cx - T[0]) / R, (cy - T[1]) / R], v = [(P[0] - T[0]) / Math.hypot(P[0] - T[0], P[1] - T[1]), (P[1] - T[1]) / Math.hypot(P[0] - T[0], P[1] - T[1])];
    line(ctx, [[T[0] + u[0] * m, T[1] + u[1] * m], [T[0] + (u[0] + v[0]) * m, T[1] + (u[1] + v[1]) * m], [T[0] + v[0] * m, T[1] + v[1] * m]], col.ink, 1.5);
    dot(ctx, T[0], T[1], 5, col.s[0], col.panel); dot(ctx, P[0], P[1], 6, col.s[3], col.panel);
    text(ctx, 'T', T[0] - 4, T[1] - 13, { color: col.ink, size: 13, weight: 700, halo: col.panel, align: 'center' }); text(ctx, 'P', P[0] + 11, P[1] + 4, { color: col.ink, size: 13, weight: 700 });
    text(ctx, 'r = ' + r, (cx + T[0]) / 2 - 20, (cy + T[1]) / 2 - 2, { color: col.s[0], size: 11, weight: 700, halo: col.panel, align: 'center' });
    text(ctx, 'PT = ' + Math.sqrt(d * d - r * r).toFixed(2), (T[0] + P[0]) / 2 + 4, (T[1] + P[1]) / 2 - 12, { color: col.s[1], size: 11.5, weight: 700, halo: col.panel, align: 'center' });
    text(ctx, 'd = ' + d, (cx + P[0]) / 2, cy + 16, { color: col.muted, size: 11, weight: 700, halo: col.panel, align: 'center' });
  };
  say();
}
