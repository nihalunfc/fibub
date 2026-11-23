// Class 8 Geometric Themes: tessellation. A tiling works when the corners of the tiles around one point add up to exactly 360.
// Each interior angle of a regular n-sided shape is 180 - 360/n; the figure fits as many as it can around a point and shows the gap.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 6;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Regular shapes placed around a point, with any gap shown' });
  const ctl = row(host);
  slider(ctl, { label: 'Sides of the shape', min: 3, max: 10, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; sync(); } });
  const out = readout(host);
  const NM = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
  const ang = () => 180 - 360 / n;
  function sync() {
    const a = ang(), k = Math.floor(360 / a + 1e-9), gap = 360 - k * a;
    out.innerHTML = `A regular ${NM[n]} has corner angle 180 − 360 ÷ ${n} = <b>${+a.toFixed(2)}°</b>. Around a point, ${k} fit and use ${+(k * a).toFixed(1)}°. ` + (gap < 1e-6 ? `<b>Exactly 360°: no gap, so ${NM[n]}s tessellate.</b>` : `A gap of <b>${+gap.toFixed(1)}°</b> is left, too small for another one: ${NM[n]}s alone cannot tile the plane.`);
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fit them round one point', col), cx = w / 2, cy = (top + h) / 2 + 4, a = ang(), k = Math.floor(360 / a + 1e-9), gap = 360 - k * a;
    const side = Math.min(w, h - top) * (n <= 4 ? 0.3 : n <= 6 ? 0.25 : 0.2), rad = (d) => (d * Math.PI) / 180;
    for (let i = 0; i < k; i++) {
      const start = -90 + i * a; // direction of one side of this tile
      ctx.beginPath(); ctx.moveTo(cx, cy);
      let x = cx, y = cy, dir = start; // walk round the polygon: one corner at the centre
      for (let j = 0; j < n - 1; j++) { x += side * Math.cos(rad(dir)); y += side * Math.sin(rad(dir)); ctx.lineTo(x, y); dir += 360 / n; }
      ctx.closePath(); ctx.fillStyle = col.s[i % 2 ? 3 : 0]; ctx.globalAlpha = 0.4; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    }
    if (gap > 1e-6) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, side * 0.9, rad(-90 + k * a), rad(270), false); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; text(ctx, 'gap ' + +gap.toFixed(1) + '°', 10, h - 14, { color: col.s[2], size: 12, weight: 700 }); }
    else text(ctx, 'No gap: it tiles', 10, h - 14, { color: col.s[2], size: 12, weight: 700 });
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, 7); ctx.fill();
  };
  sync();
}
