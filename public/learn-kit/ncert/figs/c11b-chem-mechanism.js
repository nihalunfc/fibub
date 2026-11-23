// Class 11 Biology, Chemical coordination (step player with a switch): how hormones act on a cell. Protein and peptide hormones (insulin, glucagon, adrenaline) cannot cross the membrane:
// they bind a receptor on the surface and a second messenger such as cAMP carries the message inside. Steroid and thyroid hormones (cortisol, oestrogen, T4) pass through the membrane,
// bind a receptor inside, and the complex switches genes on or off.
import { canvas, text, title, line, arrow, row, choice } from '../../kit.js';

export default function (host) {
  let step = 0, kind = 'pep';
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 290, label: 'A cell showing a peptide hormone acting through a surface receptor and second messenger, or a steroid hormone acting inside on the genes' });
  const ctl = row(host);
  choice(ctl, 'Hormone type', [['pep', 'Peptide (insulin)'], ['ster', 'Steroid (cortisol)']], kind, (v) => { kind = v; cv.redraw(); });
  const NOTE = { pep: ['Hormone arrives in the blood', 'Binds a receptor on the cell surface', 'Second messenger (cAMP) forms inside', 'Enzymes change: the cell responds'], ster: ['Hormone arrives in the blood', 'Slips through the membrane, meets its inside receptor', 'Hormone-receptor complex enters the nucleus', 'Genes switched on: new proteins made'] };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, NOTE[kind][step], col), cx = w / 2, my = t0 + 50, cy = my + 140, p = kind === 'pep';
    ctx.fillStyle = col.soft; ctx.fillRect(14, my, w - 28, h - my - 14); ctx.fillStyle = col.line; ctx.fillRect(14, my - 4, w - 28, 8);
    text(ctx, 'blood', 20, t0 + 16, { color: col.muted, size: 10, weight: 700 }); text(ctx, 'inside the target cell', 20, my + 14, { color: col.muted, size: 10, weight: 700 });
    ctx.beginPath(); ctx.arc(cx + 60, cy + 40, 34, 0, 7); ctx.fillStyle = col.bg; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'nucleus', cx + 60, cy + 6, { color: col.muted, size: 10, align: 'center' });
    // receptor
    if (p) { ctx.fillStyle = col.s[0]; ctx.fillRect(cx - 40, my - 12, 20, 20); text(ctx, 'receptor', cx - 30, my - 18, { color: col.s[0], size: 10, weight: 700, align: 'center' }); }
    else { ctx.beginPath(); ctx.arc(cx - 40, cy - 10, 11, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); text(ctx, 'receptor', cx - 40, cy + 12, { color: col.s[0], size: 10, weight: 700, align: 'center' }); }
    // hormone
    const hx = [cx - 30, cx - 30, cx - 30, cx - 30][step], hy = [t0 + 34, my - 20, my - 20, my - 20][step];
    if (p) { ctx.beginPath(); ctx.arc(hx, hy, 9, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); if (step === 0) arrow(ctx, hx, hy + 12, hx, hy + 26, col.s[3], 2, 6); }
    else { const y = step === 0 ? t0 + 34 : step === 1 ? cy - 10 : step === 2 ? cy + 40 : cy + 40, x = step <= 1 ? (step === 0 ? cx - 40 : cx - 52) : step === 2 ? cx + 30 : cx + 40; ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); if (step === 0) arrow(ctx, x, y + 12, x, y + 26, col.s[3], 2, 6); }
    if (p && step >= 2) { for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(cx - 30 + i * 22, cy - 20 + i * 14, 5, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); } text(ctx, 'cAMP', cx - 36, cy - 36, { color: col.s[2], size: 10.5, weight: 700 }); }
    if (p && step === 3) { arrow(ctx, cx - 10, cy + 40, cx + 24, cy + 52, col.s[2], 2.5, 8); text(ctx, 'enzymes act', cx - 40, cy + 70, { color: col.ink, size: 10.5, weight: 700 }); }
    if (!p && step === 3) { text(ctx, 'DNA → mRNA → protein', cx + 40, cy + 96, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
    text(ctx, p ? 'Hormone stays outside; a messenger works inside' : 'Hormone itself works inside, on the genes', w / 2, h - 24, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); cv.redraw(); } };
}
