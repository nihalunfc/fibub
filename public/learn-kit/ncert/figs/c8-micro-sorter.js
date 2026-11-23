// Class 8 Science, Microscopic world: sorting microorganisms into groups. Each card shows a simple drawing and a clue;
// pick bacteria, virus, fungus, protozoan or alga. Groups: bacteria (single cell, no nucleus), viruses (not cells,
// need a host), fungi (yeast, mould), protozoa (single-celled, animal-like), algae (single or many cells, make food).
import { canvas, text, title, dot, line, row, button, readout } from '../../kit.js';

const G = ['Bacterium', 'Virus', 'Fungus', 'Protozoan', 'Alga'];
const C = [
  ['Lactobacillus', 0, 'Turns milk into curd. Tiny rod-shaped single cell.'],
  ['Amoeba', 3, 'A single cell that changes shape and eats by flowing round food.'],
  ['Yeast', 2, 'Makes bread rise. A round single cell that buds.'],
  ['Coronavirus', 1, 'Not even a cell. Has to enter a living cell to multiply.'],
  ['Spirogyra', 4, 'Green threads in ponds. Makes its own food by photosynthesis.'],
  ['Bread mould', 2, 'Fuzzy threads on stale bread. Grows from spores.'],
  ['Plasmodium', 3, 'A single-celled parasite that causes malaria in blood.'],
  ['Bacteriophage', 1, 'A virus that attacks bacteria. Looks like a tiny lunar lander.'],
];
export default function (host) {
  let i = 0, ans = -1, sc = 0, dn = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A drawing of a microorganism to sort into bacteria, virus, fungus, protozoan or alga' });
  const ctl = row(host);
  G.forEach((g, k) => button(ctl, g, () => { if (ans >= 0) return; ans = k; dn++; if (k === C[i][1]) sc++; cv.redraw(); }));
  button(ctl, 'Next', () => { i = (i + 1) % C.length; ans = -1; cv.redraw(); });
  const out = readout(host); out.textContent = 'Look at the shape and the clue, then choose a group. Tap Next for another microbe.';
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Microbe sorter', col);
    const cx = w / 2, cy = h * 0.42, k = C[i][1];
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = col.s[k]; ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    const nm = C[i][0];
    if (nm === 'Lactobacillus') { ctx.beginPath(); ctx.ellipse(0, 0, 38, 12, -0.3, 0, 7); ctx.fill(); ctx.stroke(); }
    else if (nm === 'Amoeba') { ctx.beginPath(); ctx.moveTo(-40, 0); ctx.bezierCurveTo(-45, -40, 0, -50, 25, -30); ctx.bezierCurveTo(55, -45, 60, 0, 35, 20); ctx.bezierCurveTo(30, 50, -20, 45, -30, 25); ctx.closePath(); ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); dot(ctx, 0, -5, 9, col.ink); }
    else if (nm === 'Yeast') { dot(ctx, -8, 0, 22, col.s[k], col.ink); dot(ctx, 22, -14, 11, col.s[k], col.ink); }
    else if (nm === 'Coronavirus') { dot(ctx, 0, 0, 22, col.s[k], col.ink); for (let a = 0; a < 12; a++) { const t = a * Math.PI / 6; line(ctx, [[Math.cos(t) * 22, Math.sin(t) * 22], [Math.cos(t) * 33, Math.sin(t) * 33]], col.ink, 2); dot(ctx, Math.cos(t) * 33, Math.sin(t) * 33, 3.5, col.ink); } }
    else if (nm === 'Spirogyra') { for (let j = 0; j < 6; j++) { ctx.fillStyle = col.s[k]; ctx.globalAlpha = 0.55; ctx.fillRect(-60 + j * 20, -12, 19, 24); ctx.globalAlpha = 1; ctx.strokeRect(-60 + j * 20, -12, 19, 24); line(ctx, [[-56 + j * 20, 6], [-46 + j * 20, -6], [-56 + j * 20, 2]], col.good, 2); } }
    else if (nm === 'Bread mould') { for (let j = 0; j < 7; j++) { const x = -40 + j * 13; line(ctx, [[x, 30], [x + (j % 2 ? 8 : -8), -4], [x + (j % 3) * 4, -26]], col.ink, 1.5); dot(ctx, x + (j % 3) * 4, -28, 5, col.s[k], col.ink); } }
    else if (nm === 'Plasmodium') { dot(ctx, 0, 0, 30, col.warn || '#c60', col.ink); dot(ctx, 0, 0, 14, col.panel, col.s[k]); dot(ctx, 7, -4, 5, col.s[k]); }
    else { ctx.fillStyle = col.s[k]; ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(18, -14); ctx.lineTo(18, 8); ctx.lineTo(-18, 8); ctx.lineTo(-18, -14); ctx.closePath(); ctx.fill(); ctx.stroke(); for (let j = 0; j < 4; j++) line(ctx, [[-12 + j * 8, 8], [-22 + j * 14, 40]], col.ink, 2); }
    ctx.restore();
    text(ctx, nm, cx, cy + 62, { color: col.ink, size: 14, weight: 700, align: 'center' });
    ctx.font = '400 11px system-ui'; const L = []; let cur = '';
    C[i][2].split(' ').forEach((wd) => { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > w - 30) { L.push(cur); cur = wd; } else cur = t; }); L.push(cur);
    L.forEach((l, j) => text(ctx, l, cx, cy + 84 + j * 15, { color: col.muted, size: 11, align: 'center' }));
    if (ans >= 0) text(ctx, ans === k ? `Correct: ${G[k]}` : `It is a ${G[k].toLowerCase()}`, cx, h - 30, { color: ans === k ? col.good : col.bad, size: 13, weight: 700, align: 'center' });
    text(ctx, `Score ${sc}/${dn}`, cx, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
}
