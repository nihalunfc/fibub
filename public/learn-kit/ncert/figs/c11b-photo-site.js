// Class 11 Biology, Photosynthesis (step player): zoom from the leaf to the chloroplast and see where each stage happens.
// CO2 enters by stomata; the light reactions run on the thylakoid membranes (grana) and the Calvin cycle in the stroma.
import { canvas, text, title, arrow } from '../../kit.js';
import { note, rr, ell } from '../c11b-lib.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Zoom from a leaf cross-section to a mesophyll cell and a chloroplast, showing where light reactions and the Calvin cycle happen' });
  const T = ['The leaf: gas exchange and light', 'A mesophyll cell', 'The chloroplast', 'Two stages, two places'];
  const N = ['Light falls on the leaf. CO₂ enters through the stomata, water arrives in the xylem of the vein, and O₂ leaves. Most photosynthesis happens in the green mesophyll cells.',
    'Each mesophyll cell holds 20 to 100 chloroplasts, pushed against the wall by the big central vacuole so they catch the light.',
    'A chloroplast has a double membrane. Inside are flat sacs (thylakoids) stacked into grana, in a fluid called the stroma.',
    'Light reactions: on the thylakoid membranes, making ATP, NADPH and O₂. Calvin cycle: in the stroma, using that ATP and NADPH to turn CO₂ into sugar.'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[st], col), cx = w / 2, top = t0 + 8, ah = h - 84 - top, cy = top + ah / 2;
    if (st === 0) {
      const x0 = 24, x1 = w - 24, y0 = top + 22, hh = ah - 56, gx = cx - 60;
      rr(ctx, x0, y0, x1 - x0, 12, 3, col.soft, col.muted); text(ctx, 'upper epidermis', x0 + 6, y0 + 6, { color: col.muted, size: 9.5 });
      const pw = (x1 - x0 - 16) / 7;
      for (let i = 0; i < 7; i++) rr(ctx, x0 + 8 + i * pw, y0 + 16, pw - 4, hh * 0.3, 5, col.s[2], null);
      text(ctx, 'palisade mesophyll', cx, y0 + 16 + hh * 0.15, { color: col.bg, size: 10.5, weight: 700, align: 'center' });
      for (let i = 0; i < 5; i++) ell(ctx, x0 + 24 + i * ((x1 - x0 - 110) / 4), y0 + 24 + hh * 0.5, 17, 11, col.s[2], null, 1, 0.5);
      text(ctx, 'spongy mesophyll', cx - 20, y0 + 24 + hh * 0.5, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel });
      const yb = y0 + hh; rr(ctx, x0, yb, x1 - x0, 12, 3, col.soft, col.muted); ctx.fillStyle = col.panel; ctx.fillRect(gx - 12, yb - 1, 24, 14);
      ell(ctx, gx - 8, yb + 6, 5, 7, col.s[3], col.ink, 1); ell(ctx, gx + 8, yb + 6, 5, 7, col.s[3], col.ink, 1);
      text(ctx, 'stoma', gx, yb + 24, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
      arrow(ctx, gx - 22, yb + 30, gx - 22, yb + 12, col.ink, 2); text(ctx, 'CO₂ in', gx - 28, yb + 36, { color: col.ink, size: 10.5, align: 'right' });
      arrow(ctx, gx + 22, yb + 12, gx + 22, yb + 30, col.muted, 2); text(ctx, 'O₂ out', gx + 28, yb + 36, { color: col.muted, size: 10.5 });
      ell(ctx, x1 - 36, y0 + hh * 0.5, 9, 13, col.s[0], null, 1, 0.9); text(ctx, 'vein: water', x1 - 36, y0 + hh * 0.5 + 24, { color: col.s[0], size: 10, weight: 700, align: 'center' });
      for (let i = 0; i < 3; i++) arrow(ctx, 50 + i * 60, y0 - 14, 50 + i * 60, y0 + 2, col.s[3], 2); text(ctx, 'light', 36, y0 - 20, { color: col.s[3], size: 10.5, weight: 700 });
    } else if (st === 1) {
      rr(ctx, 30, top + 6, w - 60, ah - 12, 28, col.soft, col.muted, 2);
      ell(ctx, cx, cy, (w - 130) / 2, (ah - 56) / 2, col.panel, col.line, 1.5);
      text(ctx, 'vacuole', cx, cy, { color: col.muted, size: 11, align: 'center' });
      const sp = [[0.1, 0.5], [0.15, 0.2], [0.35, 0.08], [0.65, 0.08], [0.88, 0.2], [0.9, 0.55], [0.8, 0.88], [0.5, 0.93], [0.2, 0.86]];
      sp.forEach(([a, b], i) => ell(ctx, 30 + a * (w - 60), top + 6 + b * (ah - 12), 12, 7, col.s[2], col.ink, 1, 0.95));
      ell(ctx, cx + 30, cy + 38, 10, 10, col.s[4], null, 1, 0.8); text(ctx, 'nucleus', cx + 30, cy + 58, { color: col.muted, size: 10, align: 'center' });
      text(ctx, 'chloroplasts', 60, top + 28, { color: col.s[2], size: 11, weight: 700 });
    } else {
      ell(ctx, cx, cy, w * 0.4, ah * 0.4, col.soft, col.s[2], 3);
      ell(ctx, cx, cy, w * 0.37, ah * 0.36, null, col.s[2], 1);
      [[-0.2, -0.1], [0.12, -0.14], [-0.05, 0.12], [0.22, 0.1]].forEach(([a, b]) => { for (let k = 0; k < 4; k++) rr(ctx, cx + a * w - 22, cy + b * ah + k * 7 - 14, 44, 5, 2.5, st === 3 ? col.s[3] : col.s[2], col.ink, 1); });
      text(ctx, 'granum', cx - 0.2 * w, cy - 0.1 * ah - 26, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      text(ctx, 'thylakoid', cx - 0.05 * w, cy + 0.12 * ah + 24, { color: col.ink, size: 10, align: 'center' });
      if (st === 2) { text(ctx, 'stroma (fluid)', cx + 0.02 * w, cy + 0.3 * ah, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'double membrane', cx, cy - ah * 0.43, { color: col.muted, size: 10.5, align: 'center' }); }
      if (st === 3) { text(ctx, 'LIGHT REACTIONS', cx, cy - ah * 0.34, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, 'in the thylakoids', cx, cy - ah * 0.34 + 13, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, 'CALVIN CYCLE in the stroma', cx, cy + ah * 0.3, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); }
    }
    note(ctx, N[st], 10, h - 66, w - 20, col, { size: 11 });
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 3); cv.redraw(); } };
}
