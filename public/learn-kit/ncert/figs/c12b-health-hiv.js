// Class 12 Human Health and Disease (step player): how HIV multiplies in a helper T cell. HIV is a retrovirus: its genetic material is two RNA strands; reverse transcriptase copies the RNA into DNA,
// which joins the host's DNA (provirus). The cell then makes new viral RNA and proteins, which assemble and bud out. The helper T cell is damaged, so immunity falls (AIDS).
import { canvas, text, title, arrow, line } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'Steps of HIV infecting a helper T cell: entry, reverse transcription, integration, making new viruses and budding' });
  const T = ['HIV meets a helper T cell', 'Entry: RNA gets inside', 'Reverse transcription: RNA to DNA', 'Integration: DNA joins the cell’s DNA', 'The cell makes viral parts', 'Assembly and budding'];
  const NOTE = ['The virus (two RNA strands in a protein coat with an envelope) attaches to the CD4 receptor on a helper T cell. The same happens in macrophages.', 'The envelope fuses with the cell membrane and the viral RNA and enzymes enter the cytoplasm.', 'The enzyme reverse transcriptase copies the viral RNA into DNA (RNA to DNA is the reverse of the usual flow).', 'The viral DNA enters the nucleus and joins the host DNA: a provirus. It can stay silent for years.', 'The cell reads the provirus: it makes viral RNA and viral proteins as if they were its own.', 'New viruses assemble and bud out of the cell, which is damaged. The released viruses infect more helper T cells; their number falls and immunity weakens.'];
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), cx = w / 2, cy = t0 + 130, R = Math.min(w * 0.34, 105);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.stroke(); text(ctx, 'helper T cell', cx, cy + R + 14, { color: col.muted, size: 10.5, align: 'center' });
    ctx.beginPath(); ctx.arc(cx + 18, cy + 14, R * 0.38, 0, 7); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, 'nucleus', cx + 18, cy + 14 - R * 0.38 - 8, { color: col.muted, size: 9.5, align: 'center' });
    for (let k = 0; k < 3; k++) { const a = -2.5 + k * 0.4; line(ctx, [[cx + (R + 4) * Math.cos(a), cy + (R + 4) * Math.sin(a)], [cx + (R + 11) * Math.cos(a), cy + (R + 11) * Math.sin(a)]], col.s[2], 3); }
    const virus = (x, y, r, a = 1) => { ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); line(ctx, [[x - r * 0.4, y - r * 0.2], [x + r * 0.4, y + r * 0.2]], col.bg, 2); line(ctx, [[x - r * 0.4, y + r * 0.3], [x + r * 0.4, y - r * 0.1]], col.bg, 2); ctx.globalAlpha = 1; };
    if (step === 0) { virus(cx - R - 24, cy - R * 0.55, 15); arrow(ctx, cx - R - 8, cy - R * 0.4, cx - R * 0.8, cy - R * 0.36, col.muted, 1.5, 6); text(ctx, 'HIV', cx - R - 24, cy - R * 0.55 - 22, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'CD4 receptor', cx - 4, cy - R - 20, { color: col.s[2], size: 10, align: 'center' }); }
    if (step === 1) { line(ctx, [[cx - R * 0.8, cy - R * 0.5], [cx - R * 0.35, cy - R * 0.3]], col.s[3], 3); text(ctx, 'viral RNA', cx - R * 0.5, cy - R * 0.5, { color: col.s[3], size: 10, weight: 700, align: 'center' }); virus(cx - R - 14, cy - R * 0.62, 12, 0.35); }
    if (step === 2) { line(ctx, [[cx - R * 0.7, cy - R * 0.1], [cx - R * 0.25, cy - R * 0.1]], col.s[3], 3); line(ctx, [[cx - R * 0.7, cy + 8], [cx - R * 0.25, cy + 8]], col.s[0], 3); text(ctx, 'RNA (red)', cx - R * 0.5, cy - R * 0.1 - 12, { color: col.s[3], size: 10, weight: 700, align: 'center' }); text(ctx, 'new DNA (blue)', cx - R * 0.5, cy + 22, { color: col.s[0], size: 10, weight: 700, align: 'center' }); text(ctx, 'reverse transcriptase', cx - R * 0.5, cy + 36, { color: col.muted, size: 10, align: 'center' }); }
    if (step >= 3) { line(ctx, [[cx - 10, cy + 6], [cx + 46, cy + 6]], col.ink, 2); line(ctx, [[cx + 8, cy + 6], [cx + 26, cy + 6]], col.s[0], 6); text(ctx, 'viral DNA in host DNA', cx + 18, cy + 28, { color: col.s[0], size: 9.5, weight: 700, align: 'center' }); }
    if (step >= 4) { for (let k = 0; k < 5; k++) { ctx.fillStyle = k % 2 ? col.s[3] : col.s[1]; ctx.fillRect(cx - R * 0.7 + k * 14, cy + R * 0.45, 9, 9); } text(ctx, 'viral RNA + proteins', cx - R * 0.3, cy + R * 0.45 + 22, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 5) { virus(cx + R + 14, cy - R * 0.4, 14); virus(cx + R + 22, cy + R * 0.1, 11); virus(cx + R + 8, cy + R * 0.55, 10); text(ctx, 'new HIV', cx + R + 18, cy - R * 0.4 - 22, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); }
    wrap(ctx, NOTE[step], 12, h - 66, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
