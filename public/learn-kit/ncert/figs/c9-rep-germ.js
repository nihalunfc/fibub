// Class 9 Reproduction: germination of a bean seed. The seed absorbs water (imbibition) and swells, the seed coat
// splits, the root (radicle) comes out first and grows down, then the shoot (plumule) arches up and the first leaves
// open. Until the leaves can make food the seedling lives on the food stored in the seed leaves (cotyledons).
// A seed needs water, air (oxygen) and a suitable temperature. Drag the days slider.
import { canvas, text, title, dot, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let d = 5;
  const cv = canvas(host, { aspect: 0.82, max: 420, min: 300, label: 'A bean seed germinating over ten days with root and shoot growing' });
  const ctl = row(host);
  slider(ctl, { label: 'Days after sowing', min: 0, max: 10, step: 0.5, value: d, fmt: (v) => `day ${v}`, oninput: (v) => { d = v; upd(); } });
  const out = readout(host);
  function upd() { out.textContent = d < 1 ? 'Day 0: a dry seed. Inside it is a tiny embryo and food in the two seed leaves (cotyledons).' : d < 3 ? 'The seed soaks up water and swells. The seed coat splits and the root comes out first.' : d < 6 ? 'The root grows down and branches. The shoot pushes up, bent like a hook so it does not break the tender tip.' : 'The shoot straightens and the first leaves open to catch sunlight. Now the plant can make its own food.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Germination of a bean', col);
    const gy = h * 0.4, cx = w / 2, s = Math.min(1.2, w / 360), sw = Math.min(1, d / 2);
    ctx.fillStyle = col.soft; ctx.fillRect(0, gy, w, h - gy); line(ctx, [[0, gy], [w, gy]], col.muted, 2); text(ctx, 'soil', 8, gy + 12, { color: col.muted, size: 10 });
    const sy = gy + 44 * s, sx = cx - 10 * s, size = (13 + 4 * sw) * s;
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(sx, sy, size, size * 0.65, 0.3, 0, 7); ctx.fill();
    if (d < 1) text(ctx, 'seed', sx, sy + 28 * s, { color: col.ink, size: 10.5, align: 'center' });
    if (d >= 1) { const r = Math.min(1, (d - 1) / 5); line(ctx, [[sx - 8 * s, sy + 6 * s], [sx - 14 * s * r, sy + 6 * s + 80 * r * s]], col.s[4], 3.5); if (r > 0.4) { line(ctx, [[sx - 14 * s * 0.5, sy + 40 * s], [sx - 40 * s * r, sy + 70 * s * r + 20]], col.s[4], 2); line(ctx, [[sx - 14 * s * 0.5, sy + 55 * s], [sx + 24 * s * r, sy + 80 * s * r + 20]], col.s[4], 2); } text(ctx, 'root', sx - 20 * s * r - 8, sy + 6 * s + 80 * r * s, { color: col.s[4], size: 10.5, weight: 700, align: 'right' }); }
    if (d >= 3) {
      const e = Math.min(1, (d - 3) / 4), arch = Math.max(0, 1 - Math.max(0, (d - 5)) / 2), H = e * 130 * s, bx = sx + 6 * s;
      ctx.strokeStyle = col.s[2]; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, sy - 6 * s);
      if (arch > 0.05) { ctx.bezierCurveTo(bx, sy - H * 0.9, bx + 28 * arch, sy - H, bx + 28 * arch, sy - H * 0.55); } else ctx.lineTo(bx, sy - H);
      ctx.stroke();
      if (d >= 6) { const lf = Math.min(1, (d - 6) / 3) * 26 * s; ctx.fillStyle = col.s[2]; [-1, 1].forEach((k) => { ctx.beginPath(); ctx.ellipse(bx + k * lf * 0.9, sy - H + 4, lf, lf * 0.5, k * -0.4, 0, 7); ctx.fill(); }); text(ctx, 'first leaves', bx + 36 * s, sy - H - 8, { color: col.s[2], size: 10.5, weight: 700 }); }
      else text(ctx, 'shoot', bx + 38 * s, sy - H * 0.6, { color: col.s[2], size: 10.5, weight: 700 });
    }
    const bar = (lab, x, v) => { ctx.fillStyle = col.soft; ctx.fillRect(x, h - 22, 100, 8); ctx.fillStyle = col.s[1]; ctx.fillRect(x, h - 22, 100 * v, 8); text(ctx, lab, x, h - 32, { color: col.ink, size: 10 }); };
    bar('water absorbed', 14, Math.min(1, d / 2)); bar('food used from seed leaves', Math.min(w - 120, 150), Math.min(1, d / 10));
  };
  upd();
}
