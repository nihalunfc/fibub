// Class 11 Biology, Morphology of Flowering Plants: seed structure. A dicot seed (bean, gram) has a seed coat (outer testa, inner tegmen), a hilum, a micropyle and an embryo of two cotyledons with the embryonal axis (plumule and radicle).
// A monocot seed (maize grain) has a fused seed coat and fruit wall, a large endoderm called endosperm with an aleurone layer, and one cotyledon called the scutellum, with the plumule in a coleoptile and the radicle in a coleorhiza.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { ell, rr, note, tag } from '../c11b-lib.js';

export default function (host) {
  let k = 'dic', open = true;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Structure of a dicot seed and a monocot grain with labelled parts' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Seed', [['dic', 'Dicot (bean)'], ['mon', 'Monocot (maize)']], k, (v) => { k = v; go(); });
  choice(ctl, 'View', [[false, 'Outside'], [true, 'Cut open']], open, (v) => { open = v; go(); });
  const go = () => { ro.textContent = k === 'dic' ? 'Dicot seed: two cotyledons store food; the embryonal axis has the plumule (future shoot) and radicle (future root). Seed coat = testa + tegmen; the hilum is the scar of attachment.' : 'Monocot grain: one cotyledon (scutellum) lies next to a large endosperm that stores food. The plumule has a sheath (coleoptile), the radicle a sheath (coleorhiza). Endosperm is surrounded by the aleurone layer.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, k === 'dic' ? 'Dicot seed (bean, gram)' : 'Monocot grain (maize)', col), cx = w / 2 - 20, cy = y0 + 112;
    if (k === 'dic') {
      ctx.beginPath(); ctx.ellipse(cx, cy, 96, 56, 0, 0, 7); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.strokeStyle = col.ink; ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, 90, 50, 0, 0, 7); ctx.lineWidth = 1; ctx.stroke();
      ell(ctx, cx - 90, cy + 2, 4, 9, col.ink, null, 0, 0.8); ell(ctx, cx - 74, cy - 40, 3, 3, col.panel, col.ink, 1);
      if (open) { ell(ctx, cx, cy - 12, 82, 20, col.s[0], col.ink, 1.5, 0.6); ell(ctx, cx, cy + 14, 82, 22, col.s[0], col.ink, 1.5, 0.5); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - 66, cy + 2); ctx.lineTo(cx - 40, cy + 2); ctx.stroke(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx - 66, cy + 2); ctx.lineTo(cx - 78, cy + 16); ctx.stroke(); tag(ctx, 'cotyledons (2)', cx + 30, cy - 12, cx + 40, cy - 86, col, 'left'); tag(ctx, 'plumule', cx - 42, cy + 2, cx - 46, cy + 80, col, 'left', col.s[1]); tag(ctx, 'radicle', cx - 76, cy + 12, cx - 90, cy + 80, col, 'right', col.s[3]); }
      tag(ctx, 'hilum', cx - 90, cy + 2, cx - 108, cy - 20, col, 'right'); tag(ctx, 'micropyle', cx - 74, cy - 40, cx - 86, cy - 76, col, 'right'); tag(ctx, 'seed coat', cx + 70, cy + 38, cx + 80, cy + 86, col, 'left');
    } else {
      ctx.beginPath(); ctx.moveTo(cx - 40, cy - 66); ctx.quadraticCurveTo(cx - 64, cy, cx - 24, cy + 66); ctx.lineTo(cx + 24, cy + 66); ctx.quadraticCurveTo(cx + 64, cy, cx + 40, cy - 66); ctx.closePath(); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
      tag(ctx, 'seed coat fused with fruit wall', cx + 48, cy - 30, cx + 62, cy - 84, col, 'left');
      if (open) { ctx.beginPath(); ctx.ellipse(cx, cy - 6, 40, 54, 0, 0, 7); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 4; ctx.stroke(); text(ctx, 'endosperm', cx + 10, cy - 28, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); ctx.beginPath(); ctx.ellipse(cx - 28, cy + 34, 14, 28, 0.5, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.65; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - 24, cy + 40); ctx.lineTo(cx - 12, cy + 20); ctx.stroke(); ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(cx - 30, cy + 56); ctx.lineTo(cx - 36, cy + 64); ctx.stroke(); tag(ctx, 'scutellum (1 cotyledon)', cx - 40, cy + 30, cx - 74, cy + 80, col, 'right'); tag(ctx, 'plumule in coleoptile', cx - 14, cy + 26, cx + 40, cy + 80, col, 'left', col.s[1]); tag(ctx, 'radicle in coleorhiza', cx - 34, cy + 62, cx + 30, cy + 98, col, 'left', col.s[3]); tag(ctx, 'aleurone layer', cx + 40, cy - 6, cx + 70, cy + 20, col, 'left', col.s[2]); }
    }
    note(ctx, k === 'dic' ? 'Dicot: two cotyledons, food usually stored in them (non-endospermic).' : 'Monocot: one cotyledon, food in the endosperm (endospermic).', 12, h - 40, w - 24, col, { size: 10.5, color: col.muted });
  };
  go();
}
