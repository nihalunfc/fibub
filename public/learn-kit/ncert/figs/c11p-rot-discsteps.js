// Class 11 Rotational Motion (step player): moment of inertia of a uniform disc about its axis by adding up thin rings. A ring of radius r and width dr has mass dm = (M / pi R^2) 2 pi r dr
// and I_ring = r^2 dm. Integrating dI = (2M/R^2) r^3 dr from 0 to R gives I = 1/2 M R^2. The right graph shows dI/dr = (2M/R^2) r^3, whose area is I.
import { canvas, axes, line, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A disc cut into thin rings, with the graph of each ring’s contribution to the moment of inertia' });
  const T = ['A disc as many thin rings', 'Mass of one ring', 'Moment of inertia of one ring', 'Add all the rings (integrate)', 'Result for the disc'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[s], col), cx = w * 0.27, cy = top + 78, R = Math.min(w * 0.22, 66);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.3); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke();
    for (let k = 1; k < 8; k++) { ctx.beginPath(); ctx.arc(cx, cy, R * k / 8, 0, 6.3); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); }
    if (s >= 1) { ctx.beginPath(); ctx.arc(cx, cy, R * 0.625, 0, 6.3); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 6; ctx.stroke(); line(ctx, [[cx, cy], [cx + R * 0.625, cy]], col.ink, 1.5); text(ctx, 'r', cx + R * 0.3, cy - 8, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'dr', cx + R * 0.7, cy + 16, { color: col.s[2], size: 11, weight: 700 }); }
    text(ctx, 'R', cx + R + 6, cy, { color: col.muted, size: 11 });
    const L = [];
    if (s === 1) L.push(['area of ring = 2πr dr', col.ink], ['dm = (M/πR²)(2πr dr) = (2M/R²) r dr', col.s[2]]);
    if (s === 2) L.push(['every bit of the ring is at distance r', col.ink], ['dI = r² dm = (2M/R²) r³ dr', col.s[2]]);
    if (s >= 3) L.push(['I = ∫₀ᴿ (2M/R²) r³ dr', col.ink], ['  = (2M/R²) × R⁴/4', col.ink]);
    if (s === 4) L.push(['I = ½ M R²', col.s[0]]);
    L.forEach(([t, c], i) => text(ctx, t, 14, top + 170 + i * 22, { color: c, size: 13, weight: 700 }));
    if (s >= 2) {
      const gx = w * 0.56, gw = w - gx - 14, gy = top + 16, gh = 130, X = (u) => gx + u * gw, Y = (v) => gy + gh - v * gh;
      line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.muted, 1.5);
      text(ctx, 'dI/dr ∝ r³', gx + 4, gy + 4, { color: col.ink, size: 10.5, weight: 700 }); text(ctx, 'r (in R)', gx + gw, gy + gh + 12, { color: col.muted, size: 10, align: 'right' });
      const pts = []; for (let k = 0; k <= 40; k++) { const u = k / 40; pts.push([X(u), Y(u * u * u)]); }
      if (s >= 3) { ctx.beginPath(); ctx.moveTo(X(0), Y(0)); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(X(1), Y(0)); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; }
      line(ctx, pts, col.s[0], 2.5);
      const u = 0.625; line(ctx, [[X(u), Y(0)], [X(u), Y(u ** 3)]], col.s[2], 5);
      if (s >= 3) text(ctx, 'area = I', X(0.55), Y(0.12), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
