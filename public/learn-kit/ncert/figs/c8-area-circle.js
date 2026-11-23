// Class 8 Area: the area of a circle. Cut it into thin equal slices (sectors) and lay them side by side, points up and down.
// The shape becomes nearly a rectangle with height r and width half the circumference, pi r, so area = pi r x r = pi r squared.
import { canvas, text, title, row, slider, choice, readout, lerp, ease } from '../../kit.js';

export default function (host) {
  let n = 8, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A circle cut into slices that are rearranged into almost a rectangle' });
  const ctl = row(host);
  choice(ctl, 'Slices', [[4, '4'], [8, '8'], [16, '16'], [32, '32'], [64, '64']], n, (v) => { n = v; sync(); });
  slider(ctl, { label: 'Rearrange', min: 0, max: 1, step: 0.01, value: t, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { t = v; sync(); } });
  const out = readout(host);
  function sync() { out.innerHTML = t > 0.98 ? `${n} slices laid side by side: height ≈ <b>r</b>, width ≈ half the circumference = <b>π r</b>. The more slices, the closer it is to a rectangle. Area ≈ π r × r = <b>π r²</b>.` : 'Cut the circle into equal slices, then slide the “Rearrange” control to lay them in a row. Nothing is added or lost, so the area stays the same.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Circle → almost a rectangle', col), al = (2 * Math.PI) / n, r = Math.min((w - 30) / (Math.PI * (1 + 1 / n) + 0.1), (h - top - 60) / 2, 120), cx = w / 2, cy = (top + h) / 2 + 4, e = ease(t);
    const W = ((n + 1) * r * al) / 2, x0 = cx - W / 2 + (r * al) / 2;
    for (let i = 0; i < n; i++) {
      const up = i % 2 === 0, ax = lerp(cx, x0 + (i * r * al) / 2, e), ay = lerp(cy, cy + (up ? -r / 2 : r / 2), e), p0 = i * al, p1 = up ? Math.PI / 2 : -Math.PI / 2, k = Math.round((p0 - p1) / (2 * Math.PI)), ph = lerp(p0, p1 + 2 * Math.PI * k, e);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.arc(ax, ay, r, ph - al / 2, ph + al / 2); ctx.closePath(); ctx.fillStyle = col.s[up ? 0 : 3]; ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = n > 16 ? 0.6 : 1.5; ctx.stroke();
    }
    if (t > 0.98) { text(ctx, 'width ≈ π r', cx, cy + r / 2 + 22, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'r', x0 - (r * al) / 2 - 8, cy, { color: col.s[2], size: 12, weight: 700, align: 'right' }); }
    else if (t < 0.02) text(ctx, 'radius r', cx + r + 4 > w - 40 ? cx : cx + r / 2, cy - 6, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
