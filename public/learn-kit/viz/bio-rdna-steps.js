// Making recombinant DNA as a step player: cut the vector and the gene with the same restriction enzyme (EcoRI leaves
// sticky ends), join them with DNA ligase, put the plasmid into bacteria, select the ones that took it up, and grow them so they make the protein.
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NAMES = ['1. Cut the plasmid and the gene', '2. Sticky ends pair up', '3. Ligase seals: recombinant plasmid', '4. Transform the bacteria', '5. Select with antibiotic', '6. Grow and express'];
const TXT = ['The same restriction enzyme (EcoRI) cuts the plasmid at one site and the DNA with the gene on both sides, leaving matching sticky ends (GAATTC cut between G and A).', 'Complementary sticky ends base-pair by hydrogen bonds: the gene sits in the plasmid.', 'DNA ligase makes the phosphodiester bonds that seal the nicks. Result: a recombinant plasmid with the foreign gene.', 'Bacteria are made competent (CaCl₂ and heat shock) so some take the plasmid up.', 'Plasmid carries an antibiotic-resistance gene (ampR): only bacteria with a plasmid survive on ampicillin. (Insertional inactivation of lacZ gives white colonies for recombinants.)', 'Selected bacteria divide, copy the plasmid and make the protein: in a bioreactor this scales up to the product (e.g. insulin).'];

export default function (host) {
  return stepper(host, { aspect: 1.0, max: 430, min: 340, stages: 6, label: 'Cutting, joining and cloning a gene into bacteria' }, (ctx, w, h, col, st, k, t, pv) => {
    title(ctx, NAMES[st], col);
    const cx = w * 0.3, cy = 130, R = 46;
    // plasmid ring (gap if cut)
    const cut = st < 2, ang0 = -Math.PI / 2;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 6; ctx.lineCap = 'butt'; ctx.beginPath(); if (st === 0) ctx.arc(cx, cy, R, ang0 + 0.25, ang0 + Math.PI * 2 - 0.25); else if (st === 1) { const g = 0.25 + (1 - k) * 0; ctx.arc(cx, cy, R, ang0 + 0.25, ang0 + Math.PI * 2 - 0.25); } else ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    text(ctx, 'plasmid', cx, cy + R + 22, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    text(ctx, 'ampR', cx - R - 6, cy + 4, { color: col.muted, size: 10, align: 'right', fit: false }); text(ctx, 'ori', cx + R + 6, cy + 4, { color: col.muted, size: 10, fit: false });
    // scissors cue
    if (st === 0) { text(ctx, '✂ EcoRI', cx - 20, cy - R - 14, { color: col.bad, size: 11, weight: 700, fit: false }); }
    // gene fragment: moves in during stage 1
    const gx = st === 0 ? w * 0.72 : st === 1 ? mix(w * 0.72, cx, k) : cx, gy = st === 0 ? cy : st === 1 ? mix(cy, cy - R, k) : cy - R;
    if (st < 3) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(gx - 22, gy); ctx.lineTo(gx + 22, gy); ctx.stroke(); text(ctx, st === 2 ? 'gene (in plasmid)' : 'gene of interest', gx, gy - 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center', fit: true }); if (st < 2) { ctx.fillStyle = col.s[1]; ctx.fillRect(gx - 26, gy - 4, 4, 8); ctx.fillRect(gx + 22, gy - 4, 4, 8); } }
    if (st === 2) text(ctx, '+ ligase', cx + 10, cy - R - 18, { color: col.good, size: 11, weight: 700, fit: false });
    // bacteria in stages 3-5
    if (st >= 3) {
      const n = st === 3 ? 6 : st === 4 ? 6 : 12;
      for (let i = 0; i < n; i++) {
        const bx = w * 0.12 + (i % 6) * (w * 0.15), by = 230 + Math.floor(i / 6) * 40 + Math.sin(t * 2 + i) * 2, has = i % 2 === 0 || st === 5, dead = st >= 4 && !has;
        ctx.globalAlpha = dead ? 0.2 : 1; ctx.beginPath(); ctx.roundRect(bx - 16, by - 8, 32, 16, 8); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = dead ? col.bad : col.s[2]; ctx.lineWidth = 2; ctx.stroke();
        if (has) { ctx.beginPath(); ctx.arc(bx, by, 4, 0, 7); ctx.strokeStyle = col.s[0]; ctx.stroke(); } ctx.globalAlpha = 1;
      }
      text(ctx, st === 3 ? 'some cells take up a plasmid (ring inside)' : st === 4 ? 'on ampicillin: cells without plasmid die (faded)' : 'clones all carry the gene and make the protein', w / 2, 210, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    }
    wrap(ctx, TXT[st], w / 2, h - 66, w - 24, { color: col.ink, size: 10.5, lh: 13 });
  });
}
