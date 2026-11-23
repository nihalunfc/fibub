// Class 11 Gravitation: how g changes with distance from the centre of a uniform Earth (radius R, g0 = 9.8 m/s^2). Above the surface g = g0 R^2/r^2 (inverse square);
// inside, g = g0 r/R (falls to zero at the centre, because only the mass closer to the centre than you pulls you). Slide the point through the Earth and out to space.
import { canvas, axes, line, text, title, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let r = 1;
  const g0 = 9.8, R = 6371;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Acceleration due to gravity against distance from the centre of the Earth, inside and outside' });
  const ctl = row(host);
  slider(ctl, { label: 'Distance from centre (R = 6371 km)', min: 0, max: 4, step: 0.05, value: 1, fmt: (v) => v.toFixed(2) + ' R', oninput: (v) => { r = v; cv.redraw(); } });
  const ro = readout(host);
  const gf = (x) => (x <= 1 ? g0 * x : g0 / (x * x));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'g inside rises with r, outside falls as 1/r²', col);
    const A = axes(ctx, w, h, col, { x: [0, 4], y: [0, 10], xt: [0, 1, 2, 3, 4], yt: [0, 2, 4, 6, 8, 10], xlabel: 'distance from centre r / R', ylabel: 'g (m/s²)', t: top + 70, l: 40 });
    const pin = [], pout = []; for (let k = 0; k <= 40; k++) { const x = k / 40; pin.push([A.X(x), A.Y(gf(x))]); } for (let k = 0; k <= 120; k++) { const x = 1 + 3 * k / 120; pout.push([A.X(x), A.Y(gf(x))]); }
    line(ctx, pin, col.s[2], 3); line(ctx, pout, col.s[0], 3);
    line(ctx, [[A.X(1), A.T], [A.X(1), A.B]], col.muted, 1, [4, 4]); text(ctx, 'surface', A.X(1) + 4, A.T + 10, { color: col.muted, size: 10 });
    text(ctx, 'inside: g ∝ r', A.X(0.3), A.Y(1.2), { color: col.s[2], size: 11, weight: 700 }); text(ctx, 'outside: g ∝ 1/r²', A.X(2.7), A.Y(3.6), { color: col.s[0], size: 11, weight: 700, align: 'center' });
    dot(ctx, A.X(r), A.Y(gf(r)), 6, col.ink, col.panel);
    const cx = w / 2, cy = top + 30, er = 24;
    ctx.beginPath(); ctx.arc(cx - 40, cy, er, 0, 6.3); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke();
    const sx = cx - 40 + Math.min(r, 2.6) * er; dot(ctx, sx, cy, 4.5, col.ink, col.panel);
    text(ctx, 'you', sx, cy - 11, { color: col.ink, size: 10, align: 'center', halo: col.panel });
    text(ctx, r < 1 ? 'inside the Earth' : r === 1 ? 'on the surface' : (r - 1) * R | 0 > 0 ? `${Math.round((r - 1) * R)} km above` : '', cx + 34, cy, { color: col.muted, size: 11, weight: 700 });
    ro.textContent = r < 1 ? `Inside, at ${Math.round(R * (1 - r))} km depth: g = g₀ r/R = ${gf(r).toFixed(2)} m/s². At the centre it is 0: you are pulled equally in every direction.` : `Outside, at ${Math.round((r - 1) * R)} km height: g = g₀ R²/r² = ${gf(r).toFixed(2)} m/s². At 1 R above the surface (r = 2R) it is a quarter of the surface value. Weightless in orbit is not zero g: it is free fall.`;
  };
  cv.redraw();
}
