// Class 11 Gravitation (step player): escape speed. At the surface: KE = 1/2 m v^2, PE = -G M m / R. To just reach infinity (r -> infinity, speed -> 0): KE = 0, PE = 0, total 0.
// Conservation of energy: 1/2 m v^2 - G M m / R = 0, so v_esc = sqrt(2 G M / R) = sqrt(2 g R) = 11.2 km/s = sqrt(2) times the orbital speed sqrt(g R) = 7.9 km/s.
import { canvas, line, text, title, arrow } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Energy bars at the surface and far away, built up in steps to find the escape speed' });
  const T = ['A rocket that must just reach infinity', 'Energy at the surface', 'Energy far away', 'Conservation of energy', 'The escape speed', 'Compare with orbiting'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[s], col), y0 = top + 96, half = 64, x1 = w * 0.25, x2 = w * 0.65, bw = 44;
    line(ctx, [[14, y0], [w - 14, y0]], col.muted, 1.5);
    text(ctx, 'E = 0', w - 16, y0 - 8, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'at the surface', x1, top + 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'very far away', x2, top + 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const ke = half * 0.8, pe = half * 0.8;
    if (s >= 1) { ctx.fillStyle = col.s[2]; ctx.fillRect(x1 - bw - 4, y0 - ke, bw, ke); ctx.fillStyle = col.s[0]; ctx.fillRect(x1 + 4, y0, bw, pe); text(ctx, 'KE', x1 - bw / 2 - 4, y0 - ke - 10, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'PE', x1 + bw / 2 + 4, y0 + pe + 12, { color: col.s[0], size: 11, weight: 700, align: 'center' }); }
    if (s >= 2) { ctx.fillStyle = col.s[2]; ctx.fillRect(x2 - bw / 2, y0 - 2, bw, 2); text(ctx, 'KE = 0, PE = 0', x2, y0 + 18, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (s === 3) { text(ctx, 'equal totals: 0 = 0', (x1 + x2) / 2, y0 + 92, { color: col.s[1], size: 12, weight: 700, align: 'center' }); }
    const L = [];
    if (s === 0) L.push(['Launch it with speed v from the surface (radius R).', col.ink], ['Find the smallest v that lets it get away for good.', col.muted]);
    if (s === 1) L.push(['KE = ½ m v²      PE = − G M m / R', col.ink], ['Total at the surface = ½ m v² − G M m / R', col.s[0]]);
    if (s === 2) L.push(['Just escaping: it arrives at ∞ with speed 0.', col.ink], ['KE = 0 and PE = −GMm/∞ = 0, so total = 0.', col.s[0]]);
    if (s === 3) L.push(['Energy is conserved, so total at surface = 0:', col.ink], ['½ m v² − G M m / R = 0', col.s[0], 1]);
    if (s === 4) L.push(['v² = 2 G M / R   so   v_esc = √(2GM/R)', col.s[0]], ['Using g = GM/R²:   v_esc = √(2 g R)', col.s[1]], ['= √(2 × 9.8 × 6.37×10⁶) = 11.2 km/s', col.ink]);
    if (s === 5) L.push(['Orbit just above the ground: m g = m v²/R,', col.ink], ['v_orbit = √(g R) = 7.9 km/s', col.s[2]], ['v_esc = √2 × v_orbit = 11.2 km/s (mass cancels)', col.s[0]]);
    L.forEach(([t, c], i) => text(ctx, t, 14, y0 + (s === 3 ? 120 : 112) + i * 26, { color: c, size: 13, weight: 700 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
