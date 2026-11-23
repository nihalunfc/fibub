// Class 8 Area: triangles on the same base between the same two parallel lines have the same area, 1/2 x base x height.
// Slide the top corner along the upper line: the shape and perimeter change, the area does not.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let ax = 3;
  const bs = 6, hh = 4;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 260, label: 'A triangle whose top corner slides along a line parallel to the base' });
  const ctl = row(host);
  slider(ctl, { label: 'Top corner position', min: -3, max: 9, step: 0.5, value: ax, fmt: (v) => v.toFixed(1), oninput: (v) => { ax = v; sync(); } });
  const out = readout(host);
  function sync() { const s1 = Math.hypot(ax, hh), s2 = Math.hypot(ax - bs, hh); out.innerHTML = `Base ${bs} m, height ${hh} m: area = ½ × ${bs} × ${hh} = <b>${(bs * hh) / 2} m²</b> every time. The other two sides are ${s1.toFixed(2)} m and ${s2.toFixed(2)} m, so the perimeter (${(bs + s1 + s2).toFixed(2)} m) changes but the area does not.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same base, same parallels, same area', col), sc = Math.min((w - 30) / 12, (h - top - 56) / hh), ox = (w - 12 * sc) / 2 + 3 * sc, by = h - 36, ty = by - hh * sc, X = (x) => ox + x * sc;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(10, ty); ctx.lineTo(w - 10, ty); ctx.moveTo(10, by); ctx.lineTo(w - 10, by); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(X(0), by); ctx.lineTo(X(bs), by); ctx.lineTo(X(ax), ty); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(X(ax), ty); ctx.lineTo(X(ax), by); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(X(ax), ty, 6, 0, 7); ctx.fill();
    text(ctx, 'h = 4', X(ax) + 5, (ty + by) / 2, { color: col.s[2], size: 11, weight: 700, halo: col.panel }); text(ctx, 'base 6', X(bs / 2), by + 15, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  sync();
}
