// Class 11 Structural Organisation in Animals (step player): levels of organisation, using the stomach as an example. A cell makes a tissue, tissues make an organ, organs that
// work on one job make an organ system, and systems together make the organism. Cells (columnar epithelial cell) -> tissue (lining) -> organ (stomach) -> system (digestive) -> body.
import { canvas, text, title, rng } from '../../kit.js';
import { ellipse, footer, rrect } from '../c11b-ex-util.js';

const L = ['Cell', 'Tissue', 'Organ', 'Organ system', 'Organism'];
const NOTE = [
  'The unit of life. One column-shaped epithelial cell of the stomach lining makes mucus and acid.',
  'Many similar cells and the little matrix between them do one job together: a sheet of epithelium makes the stomach lining. Stomach muscle and nerve cells make other tissues.',
  'Several tissues form an organ: the stomach has epithelium (lining), smooth muscle (churning), connective tissue and nerve tissue.',
  'Organs that work together on one big job form a system: the digestive system (mouth, food pipe, stomach, liver, intestines).',
  'The systems work together and are controlled together: a whole living animal. Digestive, circulatory, nervous and the rest.',
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'Five levels of organisation from a cell to the whole organism, using the stomach as the example' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Level ${s + 1} of 5: ${L[s]}`, col), fy = footer(ctx, w, h, col, NOTE[s]);
    const bw = (w - 24) / 5;
    L.forEach((n, i) => { rrect(ctx, 12 + i * bw + 1, t0 + 4, bw - 2, 22, 5, i === s ? col.s[0] : col.soft, i === s ? null : col.line, 1); text(ctx, i === 0 ? 'Cell' : n.replace('Organ system', 'System').replace('Organism', 'Body'), 12 + i * bw + bw / 2, t0 + 15, { color: i === s ? col.panel : col.muted, size: 10.5, weight: 700, align: 'center', fit: false }); });
    const cx = w / 2, cy = (t0 + 36 + fy) / 2, R = Math.min(w / 2 - 20, (fy - t0 - 44) / 2);
    const stomach = (x, y, sc, f) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.beginPath(); ctx.moveTo(-30, -40); ctx.bezierCurveTo(-20, -50, 10, -30, 28, -10); ctx.bezierCurveTo(50, 10, 40, 50, 10, 48); ctx.bezierCurveTo(-25, 48, -40, 10, -34, -20); ctx.closePath(); ctx.fillStyle = f; ctx.fill(); ctx.lineWidth = 2 / sc; ctx.strokeStyle = col.s[4]; ctx.stroke(); ctx.restore(); };
    if (s === 0) { ctx.fillStyle = col.soft; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; rrect(ctx, cx - R * 0.3, cy - R * 0.75, R * 0.6, R * 1.5, 6, col.soft, col.s[2], 2.5); ellipse(ctx, cx, cy + R * 0.35, R * 0.17, R * 0.12, col.s[0]); text(ctx, 'nucleus', cx + R * 0.25, cy + R * 0.35, { color: col.ink, size: 10.5 }); for (let i = 0; i < 4; i++) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - R * 0.2 + i * R * 0.13, cy - R * 0.75); ctx.lineTo(cx - R * 0.2 + i * R * 0.13, cy - R * 0.8); ctx.stroke(); } ellipse(ctx, cx, cy - R * 0.4, R * 0.12, R * 0.08, col.s[3]); text(ctx, 'mucus droplet', cx + R * 0.2, cy - R * 0.4, { color: col.ink, size: 10.5 }); }
    else if (s === 1) { const n = 7, cw = Math.min(30, (w - 40) / n); for (let i = 0; i < n; i++) { const x = cx - n * cw / 2 + i * cw; rrect(ctx, x, cy - R * 0.4, cw - 2, R * 0.8, 4, col.soft, col.s[2], 2); ellipse(ctx, x + cw / 2, cy + R * 0.2, cw * 0.28, R * 0.08, col.s[0]); } ctx.fillStyle = col.s[4]; ctx.fillRect(cx - n * cw / 2, cy + R * 0.4, n * cw, 4); text(ctx, 'epithelium (lining of the stomach)', cx, cy - R * 0.55, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'basement membrane', cx, cy + R * 0.6, { color: col.muted, size: 10.5, align: 'center' }); }
    else if (s === 2) { stomach(cx, cy, R / 52, col.s[4] + '55'); text(ctx, 'stomach', cx - 4, cy - R * 0.05, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); [['epithelium', -0.62], ['muscle', 0.62]].forEach(([n, d]) => text(ctx, n, cx + d * R * 1.1, cy + (d < 0 ? -0.55 : 0.75) * R, { color: col.muted, size: 10.5, align: 'center' })); }
    else if (s === 3) { const items = [['mouth', -0.8, -0.7], ['food pipe', -0.8, -0.2], ['stomach', -0.2, 0.2], ['liver', 0.6, -0.1], ['intestine', 0.15, 0.7]]; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 4; ctx.beginPath(); items.forEach(([n, a, b], i) => { const x = cx + a * R, y = cy + b * R; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); items.forEach(([n, a, b]) => { const x = cx + a * R, y = cy + b * R; ellipse(ctx, x, y, 12, 12, col.s[4], col.panel, 2); text(ctx, n, x + (a < 0 ? 16 : a > 0.5 ? -16 : 16), y + (n === 'intestine' ? 20 : 0), { color: col.ink, size: 10.5, align: a < 0 || n === 'intestine' ? 'left' : 'right', halo: col.panel }); }); }
    else { const sy = [['digestive', col.s[4]], ['circulatory', col.s[3]], ['nervous', col.s[0]], ['respiratory', col.s[2]], ['excretory', col.s[1]], ['reproductive', col.s[5]]]; ellipse(ctx, cx, cy, R * 0.52, R * 0.85, col.soft, col.ink, 2); sy.forEach(([n, c], i) => { const a = (i / 6) * Math.PI * 2 - Math.PI / 2, x = cx + Math.cos(a) * R * 0.78, y = cy + Math.sin(a) * R * 0.88; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R * 0.35, cy + Math.sin(a) * R * 0.5); ctx.stroke(); ellipse(ctx, cx + Math.cos(a) * R * 0.35, cy + Math.sin(a) * R * 0.5, 7, 7, c, col.panel, 1.5); text(ctx, n, x, y, { color: col.ink, size: 10.5, weight: 700, align: Math.cos(a) > 0.2 ? 'left' : Math.cos(a) < -0.2 ? 'right' : 'center', halo: col.panel }); }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
