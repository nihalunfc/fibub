// Spermatogenesis and oogenesis side by side. Pick one: each primary cell either becomes four equal sperm or, through
// uneven divisions, one large egg and polar bodies. Watch how many cells come out and how the cytoplasm is shared.
// Oogenesis starts before birth, pauses, and meiosis II finishes only if a sperm enters.
import { canvas, row, choice, readout, text, title } from '../kit.js';

export default function (host) {
  let which = 'sperm', stage = 4;
  const cv = canvas(host, { aspect: 1.2, max: 480, min: 380, label: 'Spermatogenesis giving four sperm and oogenesis giving one egg' });
  const c1 = row(host);
  choice(c1, 'Process', [['sperm', 'Spermatogenesis'], ['egg', 'Oogenesis']], which, (v) => { which = v; show(); });
  choice(c1, 'Show up to', [[1, 'Primary'], [2, 'Meiosis I'], [3, 'Meiosis II'], [4, 'Mature gametes']], stage, (v) => { stage = v; show(); });
  const out = readout(host);
  const show = () => { out.innerHTML = which === 'sperm' ? '<b>Spermatogenesis</b> (testis, from puberty, continuous): spermatogonium (2n) → primary spermatocyte (2n) → 2 secondary spermatocytes (n) → 4 spermatids (n) → 4 sperm after spermiogenesis. Each cell divides equally, so <b>one primary cell gives 4 sperm</b>.' : '<b>Oogenesis</b> (ovary): oogonium (2n) → primary oocyte (2n, begins meiosis I before birth, stops in prophase I) → secondary oocyte (n) + 1st polar body → at ovulation it stops in metaphase II → ovum (n) + 2nd polar body only if a sperm enters. Uneven division keeps nearly all cytoplasm in one cell: <b>one primary cell gives 1 egg</b> and polar bodies that degenerate.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const sp = which === 'sperm';
    title(ctx, sp ? 'Spermatogenesis: 1 cell makes 4 sperm' : 'Oogenesis: 1 cell makes 1 egg', col);
    const rows = [['Primary (2n)', h * 0.16], ['Meiosis I (n)', h * 0.37], ['Meiosis II (n)', h * 0.59], ['Mature (n)', h * 0.82]];
    const cell = (x, y, r, c, lab, al = 1) => { ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = c; ctx.globalAlpha = 0.3 * al; ctx.fill(); ctx.globalAlpha = al; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke(); if (lab) text(ctx, lab, x, y + r + 11, { color: col.ink, size: 9.5, align: 'center', fit: false }); ctx.globalAlpha = 1; };
    const cx = w * 0.56, line = (x1, y1, x2, y2) => { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
    rows.forEach(([lab, y], i) => { text(ctx, lab, 8, y, { color: i < stage ? col.ink : col.muted, size: 10.5, weight: 700, fit: false }); });
    const c = sp ? col.s[0] : col.s[3];
    if (stage >= 1) cell(cx, rows[0][1], 22, c, sp ? 'primary spermatocyte' : 'primary oocyte');
    if (stage >= 2) {
      line(cx, rows[0][1] + 22, cx - 60, rows[1][1] - 18); line(cx, rows[0][1] + 22, cx + 60, rows[1][1] - 18);
      if (sp) { cell(cx - 60, rows[1][1], 18, c, 'secondary'); cell(cx + 60, rows[1][1], 18, c, 'secondary'); }
      else { cell(cx - 40, rows[1][1], 22, c, 'secondary oocyte'); cell(cx + 50, rows[1][1], 8, col.muted, '1st PB'); }
    }
    if (stage >= 3) {
      if (sp) { [[-60, -88], [-60, -32], [60, 32], [60, 88]].forEach(([a, b], i) => { const px = cx + (i < 2 ? -60 : 60); line(px, rows[1][1] + 18, cx + b, rows[2][1] - 12); cell(cx + b, rows[2][1], 13, c, 'spermatid'); }); }
      else { line(cx - 40, rows[1][1] + 22, cx - 60, rows[2][1] - 16); line(cx - 40, rows[1][1] + 22, cx - 10, rows[2][1] - 6); cell(cx - 60, rows[2][1], 22, c, 'ootid (n)'); cell(cx - 10, rows[2][1], 7, col.muted, '2nd PB'); cell(cx + 50, rows[2][1], 8, col.muted, '', 0.5); cell(cx + 76, rows[2][1], 8, col.muted, '', 0.5); text(ctx, '(1st PB divides)', cx + 63, rows[2][1] + 22, { color: col.muted, size: 9, align: 'center', fit: true }); }
    }
    if (stage >= 4) {
      if (sp) [-88, -32, 32, 88].forEach((b) => { const x = cx + b; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, rows[3][1], 5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); ctx.beginPath(); ctx.moveTo(x, rows[3][1] + 5); ctx.quadraticCurveTo(x + 8, rows[3][1] + 20, x, rows[3][1] + 32); ctx.stroke(); });
      else { line(cx - 60, rows[2][1] + 22, cx - 60, rows[3][1] - 24); cell(cx - 60, rows[3][1], 26, c, 'ovum (1 egg)'); text(ctx, 'PB = polar body: degenerates', cx - 20, rows[3][1] + 30, { color: col.muted, size: 10, fit: true }); }
    }
    text(ctx, sp ? 'Sperm: 4 per primary cell, small, motile' : 'Egg: 1 per primary cell, large, rich in cytoplasm', w / 2, h - 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  show();
}
