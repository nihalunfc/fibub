// Class 11 Biology, Morphology of Flowering Plants: aestivation, the way sepals or petals are arranged in the bud. Valvate: edges just touch (Calotropis). Twisted: each overlaps the next in one direction (China rose, cotton).
// Imbricate: edges overlap but not in a regular direction (cassia, gulmohur). Vexillary: one large standard petal covers two wings that cover two keel petals (pea, bean).
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { ell, note } from '../c11b-lib.js';

const A = { val: ['Valvate', 'Calotropis (aak), cucumber', 'The edges of neighbouring petals touch but do not overlap.'], tw: ['Twisted', 'China rose, cotton, lady\'s finger', 'Each petal overlaps its neighbour on one side and is overlapped on the other, like a pinwheel.'], imb: ['Imbricate', 'Cassia, gulmohur', 'Edges overlap, but not in a regular direction: one petal is fully outside and one is fully inside.'], vex: ['Vexillary', 'Pea, bean (Papilionaceous)', 'One big standard petal overlaps the two lateral wing petals, which overlap the two fused keel petals.'] };
export default function (host) {
  let k = 'tw';
  const cv = canvas(host, { aspect: 0.85, max: 420, min: 290, label: 'Cross-section of a flower bud showing the petal arrangement of the chosen aestivation' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Aestivation', Object.entries(A).map(([v, a]) => [v, a[0]]), k, (v) => { k = v; go(); });
  const go = () => { ro.textContent = `${A[k][0]}: ${A[k][2]} Examples: ${A[k][1]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, `${A[k][0]} aestivation (top view of the bud)`, col), cx = w / 2, cy = y0 + 100, R = Math.min(70, w / 4.2);
    const petal = (i, n, r0, over, c, long = 1) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n, wd = Math.PI / n * (over ? 1.3 : 1.0); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * long, a - wd, a + wd); ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.stroke(); };
    const C = [col.s[0], col.s[1], col.s[3], col.s[4], col.s[5]];
    if (k === 'val') for (let i = 0; i < 5; i++) petal(i, 5, 0, false, C[i]);
    if (k === 'tw') { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.ellipse(R * 0.52, 0, R * 0.52, R * 0.36, 0.42, 0, 7); ctx.restore(); ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(R * 0.55, 0, R * 0.55, R * 0.34, 0.5, 0, 7); ctx.fillStyle = C[i]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore(); } }
    if (k === 'imb') { const order = [1, 3, 4, 2, 0]; [0, 1, 2, 3, 4].forEach((i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5, ext = [0.34, 0.30, 0.30, 0.30, 0.42][i]; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(R * 0.55, 0, R * 0.55, R * ext, 0, 0, 7); ctx.fillStyle = C[i]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore(); }); text(ctx, 'one fully outside', cx + R + 8, cy - R * 0.9, { color: col.muted, size: 10 }); }
    if (k === 'vex') { const defs = [[0, -R * 0.2, R * 0.9, R * 0.8, 0, col.s[3], 'standard'], [-R * 0.55, R * 0.25, R * 0.45, R * 0.7, 0.35, col.s[1], 'wing'], [R * 0.55, R * 0.25, R * 0.45, R * 0.7, -0.35, col.s[1], 'wing'], [-R * 0.12, R * 0.5, R * 0.3, R * 0.5, 0.1, col.s[0], 'keel'], [R * 0.12, R * 0.5, R * 0.3, R * 0.5, -0.1, col.s[0], 'keel']]; [4, 3, 2, 1, 0].forEach((j) => { const [x, y, rx, ry, rot, c] = defs[j]; ctx.beginPath(); ctx.ellipse(cx + x, cy + y, rx, ry, rot, 0, 7); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.stroke(); }); text(ctx, 'standard (big, outside)', cx + R + 6, cy - R * 0.8, { color: col.s[3], size: 10, weight: 700 }); text(ctx, 'wings', cx - R - 6, cy + R * 0.3, { color: col.s[1], size: 10, weight: 700, align: 'right' }); text(ctx, 'keel (inside)', cx, cy + R + 8, { color: col.s[0], size: 10, weight: 700, align: 'center' }); }
    ell(ctx, cx, cy, 5, 5, col.ink, null, 0);
    note(ctx, 'Aestivation is the arrangement of petals (or sepals) in the bud; it helps to identify families.', 12, h - 40, w - 24, col, { size: 10.5, color: col.muted });
  };
  go();
}
