// Class 11 Biology, Morphology of Flowering Plants: regions of a root tip. The root cap protects the tip; just behind it is the region of meristematic activity (cells divide quickly); then the region of elongation (cells lengthen,
// which pushes the root through the soil); then the region of maturation (cells differentiate; root hairs take up water and minerals). Step player (5 steps).
import { canvas, text, title } from '../../kit.js';
import { rr, ell, note } from '../c11b-lib.js';

const R = [['Root cap', 'A thimble of loose cells covers the tip. It protects the soft tip from rubbing against soil and makes slippery mucus.'], ['Region of meristematic activity', 'Small thin-walled cells divide again and again by mitosis here. They make new cells for the root cap and for the part behind.'], ['Region of elongation', 'The new cells grow longer, many times their length. This growth pushes the root tip deeper into the soil.'], ['Region of maturation', 'Cells specialise (differentiate) into xylem, phloem and other tissue. Root hairs, thin outgrowths of surface cells, absorb water and minerals.'], ['The whole tip', 'From the tip upwards: root cap, meristem (divide), elongation (grow), maturation with root hairs (absorb). The root grows only near its tip.']];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 330, label: 'Four regions of a root tip: root cap, meristematic, elongation and maturation' });
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, R[s][0], col), x0 = w * 0.32, rw = 56, top = y0 + 8, regs = [[top + 152, 22], [top + 120, 32], [top + 60, 60], [top, 60]];
    // regions from bottom (cap) up
    const lab = ['Root cap', 'Meristem (divide)', 'Elongation (grow)', 'Maturation (root hairs)'], cols = [col.s[4], col.s[3], col.s[1], col.s[0]];
    regs.forEach(([y, hh], i) => { const on = s === 4 || s === i; ctx.beginPath(); if (i === 0) { ctx.moveTo(x0, y); ctx.lineTo(x0 + rw, y); ctx.quadraticCurveTo(x0 + rw, y + hh + 6, x0 + rw / 2, y + hh + 6); ctx.quadraticCurveTo(x0, y + hh + 6, x0, y); } else ctx.rect(x0, y, rw, hh + 0.5); ctx.fillStyle = cols[i]; ctx.globalAlpha = on ? 0.7 : 0.15; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = on ? 2.2 : 1; ctx.stroke(); text(ctx, lab[i], x0 + rw + 16, y + hh / 2 + (i === 0 ? 3 : 0), { color: on ? col.ink : col.muted, size: 11, weight: on ? 700 : 400 }); });
    // cells
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const ex = s === 2 || s === 4 ? 1 : 0.7; rr(ctx, x0 + 3 + c * 13, top + 122 + r * 7.5, 11, 6.5, 1.5, null, col.ink, 0.8); }
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) rr(ctx, x0 + 3 + c * 13, top + 62 + r * 19, 11, 16, 2, null, col.ink, 0.8);
    // root hairs
    if (s === 3 || s === 4) for (let i = 0; i < 9; i++) for (const sg of [-1, 1]) { const y = top + 4 + i * 6.5; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(sg < 0 ? x0 : x0 + rw, y); ctx.lineTo((sg < 0 ? x0 : x0 + rw) + sg * (14 + (i % 3) * 4), y + 5); ctx.stroke(); }
    if (s === 1 || s === 4) for (let k = 0; k < 6; k++) ell(ctx, x0 + 8 + (k % 3) * 18, top + 125 + (k > 2 ? 12 : 0), 1.5, 1.5, col.ink, null, 0);
    if (s === 2 || s === 4) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 14, top + 62); ctx.lineTo(x0 - 14, top + 116); ctx.stroke(); text(ctx, 'lengthen', x0 - 18, top + 90, { color: col.s[1], size: 10, align: 'right' }); }
    note(ctx, R[s][1], 12, h - 74, w - 24, col, { size: 10.5 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
