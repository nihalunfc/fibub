// Class 12 Maths, Inverse trigonometric functions: tan^-1 x + tan^-1 y = tan^-1((x+y)/(1-xy)). The numbers 1+ix and 1+iy point at angles
// tan^-1 x and tan^-1 y; multiplying them adds the angles and gives (1-xy) + i(x+y). When xy > 1 the real part turns negative: the angle passes pi/2
// and the formula needs a correction of plus or minus pi.
import { canvas, text, title, row, slider, arrow, readout } from '../../kit.js';

const P = Math.PI;
export default function (host) {
  let x = 0.5, y = 0.6;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Two arrows at angles inverse tangent x and inverse tangent y, and the arrow of their product at the sum of the angles' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'angles add: arrows 1 + ix, 1 + iy and their product', col), ox = w * 0.5, oy = top + (h - top - 8) / 2, R = Math.min(w / 2 - 16, (h - top - 8) / 2 - 8);
    const z1 = [1, x], z2 = [1, y], z = [1 - x * y, x + y], big = Math.max(Math.hypot(...z1), Math.hypot(...z2), Math.hypot(...z)), s = R / big;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(10, oy); ctx.lineTo(w - 10, oy); ctx.moveTo(ox, top + 4); ctx.lineTo(ox, h - 4); ctx.stroke();
    const A = Math.atan(x), B = Math.atan(y), S = A + B;
    [[A, col.s[0], 0.3], [S, col.s[2], 0.5]].forEach(([th, c, r]) => { ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ox, oy, R * r, 0, -th, th > 0); ctx.stroke(); });
    arrow(ctx, ox, oy, ox + z1[0] * s, oy - z1[1] * s, col.s[0], 2.5, 8); arrow(ctx, ox, oy, ox + z2[0] * s, oy - z2[1] * s, col.s[1], 2.5, 8); arrow(ctx, ox, oy, ox + z[0] * s, oy - z[1] * s, col.s[2], 3.2, 9);
    text(ctx, 'tan⁻¹x', ox + z1[0] * s + 4, oy - z1[1] * s, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'tan⁻¹y', ox + z2[0] * s + 4, oy - z2[1] * s + 12, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'sum', ox + z[0] * s + 6, oy - z[1] * s - 8, { color: col.s[2], size: 11.5, weight: 800 });
    const raw = Math.atan((x + y) / (1 - x * y)), fix = x * y > 1 ? (x > 0 ? P : -P) : 0;
    out.innerHTML = `tan⁻¹x + tan⁻¹y = <b>${S.toFixed(4)}</b>. Formula tan⁻¹((x+y)/(1−xy)) = <b>${(Math.abs(1 - x * y) < 1e-9 ? P / 2 : raw).toFixed(4)}</b>${x * y > 1 ? `, short by ${x > 0 ? '+' : '−'}π: here xy = ${(x * y).toFixed(2)} &gt; 1, so add ${x > 0 ? 'π' : '−π'}` : '. Here xy &lt; 1, so the formula works as it stands'}.`;
  };
  const r = row(host);
  slider(r, { label: 'x', min: -3, max: 3, step: 0.05, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = v; cv.redraw(); } });
  slider(r, { label: 'y', min: -3, max: 3, step: 0.05, value: y, fmt: (v) => v.toFixed(2), oninput: (v) => { y = v; cv.redraw(); } });
  cv.redraw();
}
