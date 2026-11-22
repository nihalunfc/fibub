// Class 9 Area: a parallelogram on the base b with height h has area b x h, however far it leans. Sliding the top edge
// sideways (a shear) keeps the base and the height, so the area stays the same, but the slanting sides get longer
// and the perimeter grows.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let sh = 3;
  const b = 8, hh = 5;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A rectangle leaning over into a parallelogram with the same base and height' });
  const ctl = row(host);
  slider(ctl, { label: 'Lean', min: -6, max: 6, step: 0.5, value: sh, fmt: (v) => v.toFixed(1) + ' m', oninput: (v) => { sh = v; sync(); } });
  const out = readout(host);
  const side = () => Math.hypot(sh, hh);
  function sync() { out.innerHTML = `Base ${b} m, height ${hh} m: area = base × height = <b>${b * hh} m²</b>, whatever the lean. But the slanting side is ${side().toFixed(2)} m, so the perimeter is 2 × (${b} + ${side().toFixed(2)}) = <b>${(2 * (b + side())).toFixed(2)} m</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Lean the shape: area stays, edges grow', col), s = Math.min((w - 40) / (b + 6), (h - top - 50) / hh), ox = (w - s * (b + Math.abs(sh))) / 2 + (sh < 0 ? -sh * s : 0), by = h - 36, ty = by - s * hh;
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.strokeRect(ox, ty, s * b, s * hh); ctx.setLineDash([]);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + s * b, by); ctx.lineTo(ox + s * b + s * sh, ty); ctx.lineTo(ox + s * sh, ty); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ox + s * sh, ty); ctx.lineTo(ox + s * sh, by); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'h = ' + hh, ox + s * sh + 4, by - 10, { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'b = ' + b + ' m', ox + (s * b) / 2, by + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'area ' + b * hh + ' m²', ox + (s * b) / 2 + (s * sh) / 2, ty + s * hh * 0.35, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
