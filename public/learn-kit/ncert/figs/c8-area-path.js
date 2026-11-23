// Class 8 Area: area of a path round a garden = area of the bigger rectangle - area of the garden.
// A 10 m by 6 m garden with a path w metres wide all round: outer rectangle (10 + 2w) by (6 + 2w).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let wd = 1;
  const l = 10, b = 6;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 260, label: 'A garden with a path of adjustable width all round' });
  const ctl = row(host);
  slider(ctl, { label: 'Path width', min: 0, max: 3, step: 0.5, value: wd, fmt: (v) => v + ' m', oninput: (v) => { wd = v; sync(); } });
  const out = readout(host);
  function sync() { const o = (l + 2 * wd) * (b + 2 * wd); out.innerHTML = `Whole plot ${l + 2 * wd} × ${b + 2 * wd} = ${o} m². Garden ${l} × ${b} = ${l * b} m². Path = ${o} − ${l * b} = <b>${o - l * b} m²</b>. At ₹ 80 per m² the paving costs <b>₹ ${(o - l * b) * 80}</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Area of a path = outer − inner', col), sc = Math.min((w - 40) / (l + 6), (h - top - 40) / (b + 6)), cx = w / 2, cy = (top + h) / 2 + 6, ow = (l + 2 * wd) * sc, oh = (b + 2 * wd) * sc;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.5; ctx.fillRect(cx - ow / 2, cy - oh / 2, ow, oh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(cx - ow / 2, cy - oh / 2, ow, oh);
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.45; ctx.fillRect(cx - (l * sc) / 2, cy - (b * sc) / 2, l * sc, b * sc); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.strokeRect(cx - (l * sc) / 2, cy - (b * sc) / 2, l * sc, b * sc);
    text(ctx, 'garden ' + l + ' × ' + b, cx, cy, { color: col.ink, size: 12, weight: 700, align: 'center' });
    if (wd > 0) text(ctx, 'path ' + wd + ' m', cx, cy - oh / 2 + (wd * sc) / 2 + (wd * sc < 14 ? -8 : 0), { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
