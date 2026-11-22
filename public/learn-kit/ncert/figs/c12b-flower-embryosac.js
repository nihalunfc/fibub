// Class 12 Biology, Sexual Reproduction in Flowering Plants (step player): from ovule to the 7-celled, 8-nucleate embryo sac (Polygonum type).
// One megaspore mother cell (2n) divides by meiosis into 4 megaspores (n); in the usual type 3 degenerate and one survives. Three mitoses make
// 1, 2, 4 and finally 8 nuclei (4 at each end); walls form 3 + 3 cells and a large central cell with 2 polar nuclei: 7 cells, 8 nuclei.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Steps from an ovule to the seven-celled embryo sac' });
  const T = ['An ovule with its megaspore mother cell', 'Meiosis: four megaspores, three die', 'One megaspore: a 1-nucleate sac', 'Mitosis 1: 2 nuclei at opposite poles', 'Mitosis 2 and 3: 8 nuclei, 4 at each pole', 'Walls form: 7 cells, 8 nuclei'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 6, cx = w * 0.42, H = h - top - 20, cy = top + H / 2 + 4, S = H / 330;
    const lab = (s, x, y, al = 'left', c = col.ink, sz = 10.5, wt = 600) => text(ctx, s, x, y, { color: c, size: sz, weight: wt, align: al, halo: col.panel });
    const nuc = (x, y, c = col.s[3], r = 5) => dot(ctx, x, y, r, c, col.ink);
    // ovule: outer integuments, nucellus, micropyle at top, chalaza at bottom
    const ow = 88 * S, oh = 150 * S;
    ctx.beginPath(); ctx.ellipse(cx, cy, ow, oh, 0, 0, 7); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, ow - 12 * S, oh - 12 * S, 0, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.rect(cx - 10 * S, cy - oh - 2, 20 * S, 14 * S); ctx.fillStyle = col.panel; ctx.fill();
    lab('micropyle', cx + 14 * S, cy - oh + 6, 'left', col.muted, 10, 400); lab('chalaza', cx + 14 * S, cy + oh - 4, 'left', col.muted, 10, 400);
    lab('integuments (outer wall)', w - 8, cy - oh + 40 * S, 'right', col.muted, 10, 400); lab('nucellus (food tissue)', w - 8, cy - oh + 54 * S, 'right', col.muted, 10, 400);
    const e = (rx, ry, y, fill, st = col.ink) => { ctx.beginPath(); ctx.ellipse(cx, y, rx, ry, 0, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = st; ctx.stroke(); };
    if (step === 0) { nuc(cx, cy - 60 * S, col.s[1], 9); lab('megaspore mother cell (2n)', w - 8, cy + 20 * S, 'right', col.s[1], 10.5, 700); line(ctx, [[cx + 10, cy - 60 * S + 4], [w - 150, cy + 14 * S]], col.muted, 1); }
    if (step === 1) {
      [-96, -64, -32, 0].forEach((d, i) => { e(14 * S, 14 * S, cy + d * S, i === 3 ? col.s[0] : col.panel, i === 3 ? col.ink : col.muted); if (i < 3) lab('×', cx, cy + d * S, 'center', col.bad, 14, 700); });
      lab('3 megaspores degenerate', w - 8, cy - 70 * S, 'right', col.muted, 10.5, 400); lab('1 functional megaspore (n)', w - 8, cy + 14 * S, 'right', col.s[0], 10.5, 700);
      lab('4 megaspores (n) from 1 meiosis', cx, cy + oh + 14, 'center', col.muted, 10.5, 400);
    }
    if (step >= 2) {
      const sh = step === 2 ? 40 : 108;
      e(36 * S, sh * S, cy - 4 * S, col.panel);
      if (step === 2) nuc(cx, cy - 4 * S, col.s[0], 9);
      if (step === 3) { nuc(cx, cy - 4 * S - 28 * S, col.s[0], 8); nuc(cx, cy - 4 * S + 28 * S, col.s[0], 8); }
      if (step === 4) { [-1, 1].forEach((sg) => { nuc(cx - 12 * S, cy - 4 * S + sg * 80 * S, col.s[0]); nuc(cx + 12 * S, cy - 4 * S + sg * 80 * S, col.s[0]); nuc(cx - 12 * S, cy - 4 * S + sg * 60 * S, col.s[0]); nuc(cx + 12 * S, cy - 4 * S + sg * 60 * S, col.s[0]); }); lab('4 + 4 nuclei', w - 8, cy, 'right', col.s[0], 11, 700); }
      if (step === 5) {
        const y0 = cy - 4 * S, up = y0 - 82 * S, dn = y0 + 82 * S;
        nuc(cx, up - 4 * S, col.s[3], 7); nuc(cx - 15 * S, up + 12 * S, col.s[0], 6); nuc(cx + 15 * S, up + 12 * S, col.s[0], 6);
        [-18, 0, 18].forEach((dx) => nuc(cx + dx * S, dn + 6 * S, col.s[4], 6));
        nuc(cx - 6 * S, y0 - 6 * S, col.s[1], 7); nuc(cx + 6 * S, y0 + 8 * S, col.s[1], 7);
        line(ctx, [[cx - 36 * S, up + 28 * S], [cx + 36 * S, up + 28 * S]], col.ink, 1); line(ctx, [[cx - 36 * S, dn - 14 * S], [cx + 36 * S, dn - 14 * S]], col.ink, 1);
        lab('egg', cx - 52 * S, up - 4 * S, 'right', col.s[3], 10.5, 700); lab('2 synergids', cx - 52 * S, up + 14 * S, 'right', col.s[0], 10.5, 700); lab('egg apparatus', w - 8, up, 'right', col.muted, 10, 400);
        lab('central cell with', cx - 44 * S, y0 - 16 * S, 'right', col.muted, 10, 400); lab('2 polar nuclei', cx - 44 * S, y0 - 3 * S, 'right', col.s[1], 10.5, 700);
        lab('3 antipodals', cx - 44 * S, dn + 6 * S, 'right', col.s[4], 10.5, 700);
        lab('3 + 3 + 1 = 7 cells; 8 nuclei', w - 8, cy + oh + 14, 'right', col.ink, 11, 700);
      }
    }
    // counter column
    const N = [1, 1, 1, 2, 8, 8][step], C = [1, 4, 1, 1, 1, 7][step];
    if (step >= 2) { lab(`nuclei in the sac: ${N}`, 8, h - 8, 'left', col.muted, 10, 600); lab(`cells in the sac: ${C}`, 8, h - 22, 'left', col.muted, 10, 600); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
