// Class 9 Cell: zoom from an onion to one cell to the parts inside. Four levels (whole onion, a peel of cells under
// a microscope, one cell, the parts inside a cell). The scale label shows the size at each level. The idea: living
// things are made of cells, and cells are made of organelles. Sizes are typical (an onion peel cell is about 0.2 mm).
import { canvas, text, title, dot, line, row, choice, loop, lerp, ease } from '../../kit.js';

const LV = [['Whole onion', 'about 5 cm across: you can hold it'], ['A thin peel', 'about 1 mm patch: a sheet of cells (microscope, 100×)'], ['One cell', 'about 0.2 mm long: just visible, 400× to see well'], ['Inside the cell', 'nucleus about 0.01 mm: organelles need 400× and more']];
export default function (host) {
  let lv = 0, z = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 300, label: 'Zoom from an onion to a peel of cells to one cell to the parts inside it' });
  const ctl = row(host);
  choice(ctl, 'Zoom level', LV.map((l, i) => [i, l[0]]), 0, (v) => { lv = v; });
  loop(host, (dt) => { z = lerp(z, lv, Math.min(1, dt * 4)); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, LV[lv][0], col);
    const cx = w / 2, cy = h * 0.47, R = Math.min(w, h) * 0.34;
    const a = (k) => Math.max(0, 1 - Math.abs(z - k) * 1.6);
    // level 0: onion with layers
    if (a(0) > 0) {
      ctx.save(); ctx.globalAlpha = a(0);
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(cx, cy + 6, R * (0.95 - k * 0.2), R * (0.8 - k * 0.17), 0, 0, 7); ctx.strokeStyle = col.s[3]; ctx.fillStyle = k % 2 ? col.soft : col.panel; ctx.lineWidth = 2; ctx.fill(); ctx.stroke(); }
      line(ctx, [[cx, cy - R * 0.8], [cx - 6, cy - R * 1.1], [cx + 2, cy - R * 1.25]], col.good, 3);
      for (let k = -3; k <= 3; k++) line(ctx, [[cx + k * 6, cy + R * 0.78], [cx + k * 8, cy + R * 0.98]], col.muted, 1);
      text(ctx, 'peel one layer…', cx, cy + R * 1.2, { color: col.muted, size: 11, align: 'center' });
      ctx.restore();
    }
    // level 1: brick of cells
    if (a(1) > 0) {
      ctx.save(); ctx.globalAlpha = a(1);
      const cw = R * 0.42, ch = R * 0.2;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.05, 0, 7); ctx.clip();
      ctx.fillStyle = col.panel; ctx.fillRect(0, 0, w, h);
      for (let j = -6; j < 7; j++) for (let i = -4; i < 5; i++) { const x = cx + (i + (j % 2 ? 0.5 : 0)) * cw, y = cy + j * ch; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.strokeRect(x - cw / 2, y - ch / 2, cw, ch); dot(ctx, x - cw * 0.12, y, 2.2, col.s[1]); }
      ctx.restore(); ctx.save(); ctx.globalAlpha = a(1); ctx.beginPath(); ctx.arc(cx, cy, R * 1.05, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      text(ctx, 'each brick is one cell', cx, cy + R * 1.25, { color: col.muted, size: 11, align: 'center' });
    }
    // level 2 and 3: a single cell
    const c2 = Math.max(a(2), a(3));
    if (c2 > 0) {
      ctx.save(); ctx.globalAlpha = c2;
      const cw = Math.min(w - 40, R * 2.5), ch = cw * 0.55, x0 = cx - cw / 2, y0 = cy - ch / 2;
      ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 4; ctx.fillRect(x0, y0, cw, ch); ctx.strokeRect(x0, y0, cw, ch);
      ctx.fillStyle = col.soft; ctx.fillRect(x0 + cw * 0.25, y0 + ch * 0.18, cw * 0.55, ch * 0.62);
      dot(ctx, x0 + cw * 0.14, y0 + ch * 0.4, R * 0.15, col.s[1]); dot(ctx, x0 + cw * 0.14, y0 + ch * 0.4, R * 0.05, col.ink);
      const L = (s, x, y, al) => text(ctx, s, x, y, { color: col.ink, size: 10.5, weight: 700, align: al || 'left', halo: col.panel });
      if (z > 2.3) {
        ctx.globalAlpha = Math.min(1, a(3) * 1.5);
        L('cell wall', x0 + cw * 0.02, y0 - 8); L('nucleus', x0 - 2, y0 + ch + 14); L('large vacuole', cx + cw * 0.12, cy, 'center'); L('cytoplasm', x0 + cw * 0.3, y0 + ch - 9);
        for (let k = 0; k < 5; k++) ctx.fillStyle = col.s[2], ctx.fillRect(x0 + cw * (0.28 + k * 0.12), y0 + ch * 0.86, 5, 3);
        L('mitochondria', x0 + cw * 0.97, y0 + ch + 14, 'right');
      }
      ctx.restore();
    }
    text(ctx, LV[lv][1], w / 2, h - 14, { color: col.ink, size: 11, align: 'center' });
  };
  cv.redraw();
}
