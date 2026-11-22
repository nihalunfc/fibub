// Class 9 Cell (step player): how a cell makes and exports a protein (for example insulin or an enzyme). The nucleus
// holds the instruction (DNA), a copy goes out, ribosomes on the rough ER build the protein, a vesicle carries it to
// the Golgi apparatus, the Golgi packs it, and another vesicle fuses with the cell membrane and releases it.
import { canvas, text, title, dot, line, arrow, loop, ease } from '../../kit.js';

const CAP = ['The nucleus holds the instruction (a gene in the DNA) for one protein.', 'A copy of the instruction leaves the nucleus and reaches ribosomes on the rough ER.', 'The ribosomes join amino acids in the right order: the protein is made inside the ER.', 'A small bag (vesicle) carries the protein from the ER to the Golgi apparatus.', 'The Golgi packs and labels it, then pinches off a new vesicle.', 'The vesicle fuses with the cell membrane and the protein leaves the cell.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A protein being made at the ER, packed at the Golgi apparatus and released from the cell' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Nucleus: the instruction', 'Copy to the ribosomes', 'Protein made on the ER', 'Vesicle to the Golgi', 'Golgi packs it', 'Released outside'][step], col);
    const X = 10, Y = 40, W = w - 20, H = h * 0.6;
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(X, Y, W, H, 20); ctx.fill(); ctx.stroke();
    const P = { nuc: [X + W * 0.18, Y + H * 0.42], er: [X + W * 0.42, Y + H * 0.5], golgi: [X + W * 0.68, Y + H * 0.45], mem: [X + W - 4, Y + H * 0.45] };
    dot(ctx, ...P.nuc, W * 0.1, col.s[0]); dot(ctx, ...P.nuc, W * 0.035, col.panel); text(ctx, 'nucleus', P.nuc[0], P.nuc[1] + W * 0.14, { color: col.ink, size: 10, weight: 700, align: 'center' });
    for (let k = 0; k < 4; k++) { line(ctx, [[P.er[0] - 24, P.er[1] - 18 + k * 12], [P.er[0], P.er[1] - 12 + k * 12], [P.er[0] + 24, P.er[1] - 18 + k * 12]], col.s[1], 3); if (k % 2 === 0) dot(ctx, P.er[0] - 24, P.er[1] - 18 + k * 12 - 4, 2.4, col.ink); }
    text(ctx, 'rough ER', P.er[0], P.er[1] + 40, { color: col.ink, size: 10, weight: 700, align: 'center' });
    for (let k = 0; k < 3; k++) line(ctx, [[P.golgi[0] - 22, P.golgi[1] - 14 + k * 10], [P.golgi[0] + 22, P.golgi[1] - 14 + k * 10]], col.s[5], 6);
    text(ctx, 'Golgi', P.golgi[0], P.golgi[1] + 30, { color: col.ink, size: 10, weight: 700, align: 'center' });
    text(ctx, 'membrane', X + W - 6, Y + H - 8, { color: col.muted, size: 10, align: 'right' });
    const f = ease(Math.min(1, (t % 3) / 2));
    const mv = (a, b, c) => [a[0] + (b[0] - a[0]) * c, a[1] + (b[1] - a[1]) * c];
    if (step === 1) { const p = mv([P.nuc[0] + W * 0.1, P.nuc[1]], [P.er[0] - 26, P.er[1]], f); dot(ctx, ...p, 5, col.s[2]); text(ctx, 'copy of the gene', P.nuc[0], Y + 16, { color: col.s[2], size: 10.5, weight: 700 }); }
    if (step === 2) { for (let k = 0; k < 6; k++) dot(ctx, P.er[0] - 20 + k * 6 + (t % 3) * 2, P.er[1] - 20 - Math.sin(t * 3 + k) * 2, 3, col.s[3]); text(ctx, 'protein chain growing', P.er[0], Y + 16, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); }
    if (step === 3) { const p = mv(P.er, [P.golgi[0] - 28, P.golgi[1]], f); dot(ctx, ...p, 8, col.panel, col.s[3]); dot(ctx, ...p, 3, col.s[3]); }
    if (step === 4) { const p = mv([P.golgi[0], P.golgi[1] - 16], [P.golgi[0] + 28, P.golgi[1] - 30], f); dot(ctx, ...p, 8, col.panel, col.s[3]); dot(ctx, ...p, 3, col.s[3]); text(ctx, 'packed and labelled', P.golgi[0], Y + 16, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); }
    if (step === 5) { const p = mv([P.golgi[0] + 28, P.golgi[1] - 30], [P.mem[0] - 4, P.mem[1]], Math.min(1, f * 1.2)); if (f < 0.9) dot(ctx, ...p, 8, col.panel, col.s[3]); else for (let k = 0; k < 4; k++) dot(ctx, X + W + 2 + (t % 3) * 3 - 8 + k * 2, P.mem[1] - 12 + k * 8, 3, col.s[3]); text(ctx, 'outside the cell', X + W - 6, Y + H + 16, { color: col.muted, size: 10, align: 'right' }); }
    const words = CAP[step].split(' '); const L = []; let cur = ''; ctx.font = '11px system-ui'; words.forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, Y + H + 38 + i * 15, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
