// Class 9 Area (step player): why the area of a triangle is half base times height. A rectangle b x h is cut by a
// diagonal into two equal triangles; the apex can be anywhere on the top edge without changing the base or height.
import { canvas, text, title } from '../../kit.js';

const note = (ctx, str, w, h, col) => { const max = Math.max(24, Math.floor((w - 20) / 6.4)), ls = []; let cur = ''; str.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); ls.push(cur); ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600, align: 'center' })); };

const N = ['A rectangle with base b and height h has area b × h.', 'Cut along a diagonal: two triangles that match exactly. Each is half the rectangle.', 'So one triangle has area ½ × b × h.', 'Slide the top corner along the top edge: base and height are unchanged, and the area is still half the rectangle.', 'Even when the top corner is outside the base, the height is the straight-down distance, so area = ½ × b × h still.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Showing that a triangle is half a rectangle with the same base and height' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Area of a triangle = ½ × base × height', col), bw = Math.min(w - 90, 260), bh = Math.min(h - top - 100, 130), ox = (w - bw) / 2 - 10, by = top + 24 + bh;
    const apex = s <= 2 ? [0, 0] : s === 3 ? [bw * 0.7, 0] : [bw * 1.18, 0];
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.strokeRect(ox, by - bh, bw, bh); ctx.setLineDash([]);
    if (s === 1) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + bw, by); ctx.lineTo(ox + bw, by - bh); ctx.closePath(); ctx.fill(); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + bw, by - bh); ctx.lineTo(ox, by - bh); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
    if (s >= 2) { const ax = s === 2 ? ox : ox + apex[0], ay = by - bh; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + bw, by); ctx.lineTo(s === 2 ? ox + bw : ax, ay); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
      const hx = s === 2 ? ox + bw : ax; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(hx, ay); ctx.lineTo(hx, by); ctx.stroke();
      if (s === 4) { ctx.beginPath(); ctx.moveTo(ox + bw, by); ctx.lineTo(hx, by); ctx.stroke(); }
      ctx.setLineDash([]); text(ctx, 'h', hx + 6, by - bh / 2, { color: col.s[2], size: 12, weight: 700, halo: col.panel }); }
    if (s <= 1) { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + bw, by); ctx.stroke(); }
    if (s === 1) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + bw, by - bh); ctx.stroke(); }
    text(ctx, 'b', ox + bw / 2, by + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
