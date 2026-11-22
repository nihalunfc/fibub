// Class 9 Surface Area and Volume (step player): unroll a cone. The curved surface opens into a sector of radius l (the slant height)
// whose arc is the base circumference 2*pi*r. A sector is like a triangle with base = arc and height = l, so its area is
// 1/2 x 2*pi*r x l = pi*r*l. Adding the base circle gives the total surface area pi*r*l + pi*r^2.
import { canvas, text, title } from '../../kit.js';
import { poly, ell, seg, note } from './c9-vol-lib.js';

const N = ['A cone with base radius r, height h and slant height l (the distance from the tip down the side to the rim). A party hat, an ice-cream cone.', 'Cut along a slant line from the tip to the rim.', 'Open it out flat: a sector of a circle of radius l. Its curved edge is the old base rim, so its length is 2πr.', 'A thin sector is almost a triangle with base = arc 2πr and height l. So its area is ½ × 2πr × l = πrl.', 'Add the base circle πr²: total surface area = πrl + πr² = πr(l + r). And l = √(r² + h²) from the right triangle.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A cone cut open into a sector of a circle' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Surface of a cone', col), cx = w / 2, mid = top + (h - top - 66) / 2 + 8;
    const lab = (t, x, y, c, al = 'center') => text(ctx, t, x, y, { color: c || col.ink, size: 12, weight: 700, align: al, halo: col.panel });
    if (s <= 1) {
      const R = Math.min(w * 0.22, 80), H = Math.min(h * 0.36, 130), ry = R * 0.3, ty = mid - H / 2 - 4, by = ty + H;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.moveTo(cx, ty); ctx.lineTo(cx - R, by); ctx.ellipse(cx, by, R, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      seg(ctx, cx, ty, cx - R, by, col.s[0], 2.5); seg(ctx, cx, ty, cx + R, by, s === 1 ? col.s[4] : col.s[0], s === 1 ? 3.5 : 2.5, s === 1 ? [6, 4] : undefined);
      ell(ctx, cx, by, R, ry, null, col.s[0], 0, 2.5);
      seg(ctx, cx, ty, cx, by, col.ink, 1.3, [4, 4]); seg(ctx, cx, by, cx + R, by, col.ink, 1.3, [4, 4]);
      lab('h', cx - 8, (ty + by) / 2, null, 'right'); lab('r', cx + R / 2, by + 12); lab('l', cx + R / 2 + 12, (ty + by) / 2 - 4, col.s[3], 'left');
      if (s === 1) lab('cut ✂', cx + R + 6, (ty + by) / 2 + 14, col.s[4], 'left');
    } else {
      const l = Math.min(w * 0.29, 110), r = l * 0.6, th = (2 * Math.PI * r) / l, ox = cx, oy = mid - l * 0.45, a0 = Math.PI / 2 - th / 2 + 0.0;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.arc(ox, oy, l, a0, a0 + th); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.strokeStyle = col.s[2]; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(ox, oy, l, a0, a0 + th); ctx.stroke();
      lab('l', ox + l * 0.5 * Math.cos(a0) + 10, oy + l * 0.5 * Math.sin(a0), col.s[3], 'left');
      if (s >= 2) lab('arc = 2πr', ox, oy + l + 14, col.s[2]);
      if (s === 3) { const k = 6; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1; for (let i = 1; i < k * 4; i++) { const a = a0 + (th * i) / (k * 4); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + l * Math.cos(a), oy + l * Math.sin(a)); ctx.stroke(); } lab('area = ½ × 2πr × l = πrl', ox, oy - 14, col.s[3]); }
      if (s === 4) { lab('πrl', ox, oy + l * 0.45, null); const qy = oy + l * 0.85; ell(ctx, w - R2(w) - 6, qy, R2(w), R2(w), col.s[2], col.s[2], 0.35, 2.5); lab('πr²', w - R2(w) - 6, qy); }
    }
    note(ctx, N[s], w, h, col, text);
  };
  const R2 = (w) => Math.min(w * 0.085, 30);
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
