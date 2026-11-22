// Class 9 Area: with a fixed perimeter of 30 m, an isosceles triangle with base b has equal sides (30 - b)/2.
// Heron's formula gives its area; the bars show the area for every base. The largest area is the equilateral
// triangle (b = 10), just as the square was largest among rectangles.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { heron } from './c9-area-lib.js';

export default function (host) {
  let b = 4;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Isosceles triangles with a perimeter of 30 metres and bars showing their areas' });
  const ctl = row(host);
  slider(ctl, { label: 'Base', min: 1, max: 14, step: 1, value: b, fmt: (v) => v + ' m', oninput: (v) => { b = v; sync(); } });
  const out = readout(host);
  const ar = (x) => heron(x, (30 - x) / 2, (30 - x) / 2);
  function sync() { out.innerHTML = `Base ${b} m, equal sides ${(30 - b) / 2} m each (perimeter 30 m). Heron: s = 15, area = <b>${ar(b).toFixed(2)} m²</b>. The biggest area, ${ar(10).toFixed(2)} m², is when all sides are 10 m: the equilateral triangle.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fixed perimeter 30 m: largest area?', col), e = (30 - b) / 2, hh = Math.sqrt(Math.max(0, e * e - (b / 2) ** 2)), k = Math.min((w * 0.5) / 14, ((h - top) * 0.3) / 14.5), ox = w / 2 - (b * k) / 2, by = top + 12 + 14.5 * k;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + b * k, by); ctx.lineTo(w / 2, by - hh * k); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, b + ' m', w / 2, by + 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, e + ' m', w / 2 + (b * k) / 4 + 16, by - (hh * k) / 2, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    const gx0 = 20, gx1 = w - 14, gy0 = by + 38, gy1 = h - 40, mx = ar(10), bw = (gx1 - gx0) / 14;
    for (let i = 1; i <= 14; i++) { const a = ar(i), bh = (a / mx) * (gy1 - gy0), x = gx0 + (i - 1) * bw; ctx.fillStyle = i === b ? col.s[2] : col.s[0]; ctx.globalAlpha = i === b ? 1 : 0.45; ctx.fillRect(x + 1, gy1 - bh, bw - 2, bh); ctx.globalAlpha = 1; text(ctx, String(i), x + bw / 2, gy1 + 10, { color: col.muted, size: 10, align: 'center' }); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();
    text(ctx, 'Area for each base length (m)', w / 2, h - 10, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'equilateral', gx0 + 9.5 * bw, gy0 - 4, { color: col.s[3], size: 10, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
