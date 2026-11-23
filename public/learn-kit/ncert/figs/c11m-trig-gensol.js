// Class 11 Maths, Trigonometric Functions (step player): the general solution of sin θ = 1/2. The line y = 1/2 cuts the unit circle twice in the first
// turn (π/6 and 5π/6). Every extra full turn of 2π gives the same two points, so all solutions are π/6 + 2nπ and 5π/6 + 2nπ, or θ = nπ + (−1)ⁿ π/6.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'The unit circle cut by the horizontal line y equals one half, showing all solutions of sine theta equals one half' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Solve sin θ = 1/2 on the unit circle', col), R = Math.min(w * 0.3, 100), cx = w / 2, cy = top + 10 + R, a = Math.PI / 6;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx - R - 8, cy); ctx.lineTo(cx + R + 8, cy); ctx.moveTo(cx, cy - R - 8); ctx.lineTo(cx, cy + R + 8); ctx.stroke();
    if (s >= 1) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(cx - R - 8, cy - R / 2); ctx.lineTo(cx + R + 8, cy - R / 2); ctx.stroke(); text(ctx, 'y = 1/2', cx, cy - R / 2 - 8, { color: col.s[3], size: 11.5, weight: 800, align: 'center' }); }
    const pts = (ang, c, name, big) => { const x = cx + R * Math.cos(ang), y = cy - R * Math.sin(ang); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 5.5, 0, 7); ctx.fill(); text(ctx, name, x + (Math.cos(ang) > 0 ? 9 : -9), y - 9, { color: c, size: 12, weight: 800, align: Math.cos(ang) > 0 ? 'left' : 'right' }); };
    if (s >= 2) { pts(a, col.s[0], 'π/6'); pts(Math.PI - a, col.s[2], '5π/6'); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R * 0.3, 0, -a, true); ctx.stroke(); }
    if (s >= 3) { ctx.strokeStyle = col.s[4]; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy, R + 14, 0, -2 * Math.PI + 0.3, true); ctx.stroke(); ctx.setLineDash([]); text(ctx, '+ 2π: same points again', cx, cy + R + 22, { color: col.s[4], size: 11.5, weight: 700, align: 'center' }); }
    const y = cy + R + 44, say = (t, k, c = col.ink, z = 12.5) => text(ctx, t, 10, y + k * 21, { color: c, size: z, weight: 700 });
    const L = [
      ['sin θ is the height of the point on the unit circle.', 'We want every point whose height is 1/2.'],
      ['Draw the horizontal line y = 1/2.', 'Every crossing with the circle is a solution.'],
      ['It crosses twice: θ = π/6 (30°) and θ = π − π/6 = 5π/6 (150°).', 'These are the solutions in one turn, 0 to 2π.'],
      ['After a full turn (2π) we land on the same points again.', 'So add any whole number of turns, 2nπ.'],
      ['General solution: θ = π/6 + 2nπ  or  θ = 5π/6 + 2nπ,  n = 0, ±1, ±2, …', 'Check n = 1: 13π/6 = 390°, and sin 390° = 1/2.'],
      ['One formula for both: θ = nπ + (−1)ⁿ · π/6.', 'n = 0: π/6. n = 1: π − π/6 = 5π/6. n = 2: 2π + π/6. It works for every n.'],
    ];
    L[Math.min(s, 5)].forEach((t, k) => say(t, k, s >= 4 && k === 0 ? col.s[3] : col.ink, 12));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
