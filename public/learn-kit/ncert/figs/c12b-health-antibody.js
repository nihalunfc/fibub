// Class 12 Human Health and Disease: an antibody (immunoglobulin) has four polypeptide chains (two heavy, two light) in a Y shape, H2L2. The tips of the arms (variable regions) fit one antigen shape,
// like a key in a lock. Pick the antigen and the antibody: only a matching pair binds, which is why each antibody is specific to one antigen and why a vaccine must show the right antigen.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let ag = 0, ab = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A Y-shaped antibody with two binding sites and an antigen that either fits or does not' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Antigen', [[0, 'Triangle'], [1, 'Square'], [2, 'Circle']], ag, (v) => { ag = v; go(); });
  choice(ctl, 'Antibody tips', [[0, 'Triangle'], [1, 'Square'], [2, 'Circle']], ab, (v) => { ab = v; go(); });
  const go = () => { ro.textContent = ag === ab ? 'The shapes fit: the antibody binds two antigens (one at each tip). Bound antigens clump together and are easier for phagocytes to remove.' : 'No fit: this antibody cannot bind this antigen. Each antibody is specific. Having had measles gives no protection against mumps, because the antibodies differ.'; cv.redraw(); };
  const shape = (ctx, k, x, y, s, fill, stroke) => { ctx.beginPath(); if (k === 0) { ctx.moveTo(x, y - s); ctx.lineTo(x + s, y + s); ctx.lineTo(x - s, y + s); ctx.closePath(); } else if (k === 1) ctx.rect(x - s, y - s, 2 * s, 2 * s); else ctx.arc(x, y, s, 0, 7); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); } };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Antibody and antigen', col), cx = w / 2, by = h - 110, fit = ag === ab;
    ctx.lineCap = 'round';
    ctx.lineWidth = 8; ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(cx, by + 40); ctx.lineTo(cx, by); ctx.lineTo(cx - 62, by - 62); ctx.moveTo(cx, by); ctx.lineTo(cx + 62, by - 62); ctx.stroke();
    ctx.lineWidth = 4; ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(cx - 14, by + 34); ctx.lineTo(cx - 14, by + 6); ctx.lineTo(cx - 70, by - 52); ctx.moveTo(cx + 14, by + 34); ctx.lineTo(cx + 14, by + 6); ctx.lineTo(cx + 70, by - 52); ctx.stroke();
    text(ctx, 'heavy chains (2)', cx + 12, by + 44, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'light chains (2)', cx - 18, by - 16, { color: col.s[2], size: 10.5, weight: 700, align: 'right' });
    text(ctx, 'constant part (stem)', cx + 12, by + 62, { color: col.muted, size: 10.5 });
    const tips = [[cx - 68, by - 66], [cx + 68, by - 66]];
    tips.forEach(([x, y], i) => { shape(ctx, ab, x, y, 11, col.panel, col.ink); const ax = x + (i ? 8 : -8), ay = fit ? y - 28 : y - 58 - i * 14; shape(ctx, ag, ax, ay, 11, col.s[3], fit ? col.good : col.muted); });
    text(ctx, 'variable tips fit one antigen', cx, t0 + 12, { color: col.muted, size: 11, align: 'center' });
    text(ctx, fit ? 'BOUND' : 'NO FIT', cx, by + 90, { color: fit ? col.good : col.bad, size: 14, weight: 700, align: 'center' });
  };
  go();
}
