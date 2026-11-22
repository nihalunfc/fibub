// Class 9 Area: the same perimeter can enclose very different areas. With a fixed fence length P, a rectangle
// l x b with l + b = P/2 has area l(P/2 - l), which is largest when l = b (a square).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let P = 24, l = 2;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Rectangles with the same perimeter and bars showing their different areas' });
  const ctl = row(host);
  const sP = slider(ctl, { label: 'Fence length', min: 12, max: 40, step: 4, value: P, fmt: (v) => v + ' m', oninput: (v) => { P = v; l = Math.min(l, P / 2 - 1); sL.set(l); sync(); } });
  const sL = slider(ctl, { label: 'Length of plot', min: 1, max: 19, step: 1, value: l, fmt: (v) => v + ' m', oninput: (v) => { l = Math.min(v, P / 2 - 1); sync(); } });
  const out = readout(host);
  function sync() { const b = P / 2 - l; out.innerHTML = `Fence ${P} m: length ${l} m and breadth ${b} m, so area = ${l} × ${b} = <b>${l * b} m²</b>. The most you can get is ${(P / 4) ** 2} m² when it is a square of side ${P / 4} m. Same fence, very different land.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same fence, different land', col), half = P / 2, b = half - l, bw = w - 24, ph = (h - top) * 0.42, s = Math.min((bw * 0.8) / half, ph / half);
    const ox = (w - s * l) / 2, oy = top + 10;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(ox, oy, s * l, s * b); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.strokeRect(ox, oy, s * l, s * b);
    text(ctx, l + ' m', ox + (s * l) / 2, oy - 2, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel, base: 'bottom' });
    text(ctx, l * b + ' m²', ox + (s * l) / 2, oy + (s * b) / 2, { color: col.ink, size: 14, weight: 700, align: 'center' });
    // bars
    const n = half - 1, gx0 = 24, gx1 = w - 14, gy0 = oy + s * half + 40, gy1 = h - 40, mx = (P / 4) ** 2, bwid = (gx1 - gx0) / n;
    text(ctx, 'Area for each possible length (fence fixed)', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    for (let i = 1; i <= n; i++) {
      const a = i * (half - i), x = gx0 + (i - 1) * bwid, bh = (a / mx) * (gy1 - gy0);
      ctx.fillStyle = i === l ? col.s[2] : col.s[0]; ctx.globalAlpha = i === l ? 1 : 0.45; ctx.fillRect(x + 1, gy1 - bh, Math.max(2, bwid - 2), bh); ctx.globalAlpha = 1;
      if (n <= 12 || i % 2 === 1) text(ctx, String(i), x + bwid / 2, gy1 + 10, { color: col.muted, size: 10, align: 'center' });
    }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();
    text(ctx, 'tallest bar: the square', gx0 + (P / 4 - 0.5) * bwid + bwid / 2, gy0 - 6, { color: col.s[3], size: 10, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
