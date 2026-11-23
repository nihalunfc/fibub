// Class 11 Gravitation (step player): Kepler's third law from Newton's law for a circular orbit. Gravity gives the centripetal force: G M m / r^2 = m v^2 / r, so v = sqrt(GM/r).
// Period T = 2 pi r / v, so T^2 = (4 pi^2 / GM) r^3: T^2 is proportional to r^3, with the same constant for everything orbiting the same body.
import { canvas, line, text, title, arrow, dot } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A planet in a circular orbit with gravity as the centripetal force, leading to T squared proportional to r cubed' });
  const T = ['A small mass m in a circular orbit', 'Gravity is the centripetal force', 'The orbital speed', 'The period', 'Square it: Kepler’s third law', 'Same constant for every orbiter'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[s], col), cx = w * 0.3, cy = top + 84, R = Math.min(70, w * 0.22);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.3); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, cx, cy, 11, col.s[3], col.panel); text(ctx, 'M', cx, cy, { color: col.panel, size: 11, weight: 700, align: 'center', fit: false });
    const px = cx + R * Math.cos(-0.7), py = cy + R * Math.sin(-0.7); dot(ctx, px, py, 6, col.s[0], col.panel); text(ctx, 'm', px + 8, py - 8, { color: col.s[0], size: 12, weight: 700 });
    line(ctx, [[cx, cy], [px, py]], col.muted, 1); text(ctx, 'r', (cx + px) / 2 - 4, (cy + py) / 2 + 10, { color: col.ink, size: 12, weight: 700 });
    if (s >= 1) arrow(ctx, px, py, px + (cx - px) * 0.5, py + (cy - py) * 0.5, col.s[2], 3);
    if (s >= 2) arrow(ctx, px, py, px + Math.sin(-0.7) * -34, py + Math.cos(-0.7) * -34 * -1, col.s[1], 2.5);
    const L = [];
    if (s === 1) L.push(['gravity: F = G M m / r²', col.s[2]], ['needed for a circle: F = m v² / r', col.ink], ['G M m / r² = m v² / r', col.ink]);
    if (s === 2) L.push(['G M m / r² = m v² / r   (m cancels)', col.ink], ['v² = G M / r', col.s[1]], ['v = √(G M / r)', col.s[1]]);
    if (s === 3) L.push(['one orbit = distance 2πr at speed v:', col.ink], ['T = 2πr / v = 2πr √(r / G M)', col.s[0]], ['T = 2π √(r³ / G M)', col.s[0]]);
    if (s >= 4) L.push(['T² = (4π² / G M) r³', col.s[0]], ['so T² ∝ r³', col.ink]);
    if (s === 5) L.push(['The constant 4π²/GM depends only on M,', col.muted], ['so all planets of the Sun share it.', col.muted]);
    L.forEach(([t, c], i) => text(ctx, t, 14, cy + R + 36 + i * 24, { color: c, size: 13, weight: 700 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
