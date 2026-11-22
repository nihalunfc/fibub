// Class 12 Biology, Sexual Reproduction in Flowering Plants: structure of a dicot seed (bean/gram) and a monocot grain (maize).
// Dicot: seed coat (testa + tegmen), two fleshy cotyledons that store food, embryonal axis with plumule and radicle; usually no endosperm left (non-albuminous).
// Maize: fused fruit wall and seed coat, large endosperm with an aleurone layer, one shield-shaped cotyledon (scutellum), coleoptile and coleorhiza.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let mode = 'dicot';
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 310, label: 'Inside of a bean seed or a maize grain with the parts labelled' });
  const ctl = row(host), ro = readout(host);
  const INFO = { dicot: 'Bean, gram, pea: two cotyledons hold the stored food; the endosperm was used up while the seed grew (non-albuminous). The radicle becomes the root and the plumule the shoot.', monocot: 'Maize and wheat: the food is stored in the endosperm; the single cotyledon (scutellum) passes it to the embryo when the grain germinates. The outer layer is the fruit wall fused to the seed coat.' };
  choice(ctl, 'Seed type', [['dicot', 'Bean (dicot)'], ['monocot', 'Maize (monocot)']], 'dicot', (v) => { mode = v; go(); });
  const go = () => { ro.textContent = INFO[mode]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'dicot' ? 'A bean seed, cut open' : 'A maize grain, cut lengthways', col) + 6, cx = w * 0.46, cy = top + (h - top) / 2 - 4, u = Math.min(w / 400, (h - top) / 300);
    const E = (x, y, rx, ry, f, rot = 0) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, 7); ctx.fillStyle = f; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke(); };
    const lab = (s, tx, ty, lx, ly, al = 'left') => { ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(lx + (al === 'left' ? -3 : 3), ly); ctx.stroke(); ctx.restore(); text(ctx, s, lx, ly, { color: col.ink, size: 10.5, weight: 600, align: al, halo: col.panel }); };
    if (mode === 'dicot') {
      E(cx, cy, 96 * u, 70 * u, col.s[5]); E(cx, cy, 90 * u, 64 * u, col.s[2]);
      E(cx, cy - 16 * u, 82 * u, 28 * u, col.soft); E(cx, cy + 20 * u, 82 * u, 28 * u, col.soft);
      E(cx - 66 * u, cy + 2 * u, 7 * u, 10 * u, col.s[3]); ctx.beginPath(); ctx.moveTo(cx - 40 * u, cy + 2 * u); ctx.lineTo(cx + 46 * u, cy + 2 * u); ctx.lineWidth = 6 * u; ctx.strokeStyle = col.s[0]; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 46 * u, cy + 2 * u); ctx.lineTo(cx + 66 * u, cy - 10 * u); ctx.stroke();
      lab('seed coat (testa + tegmen)', cx + 70 * u, cy + 50 * u, w - 6, cy + 90 * u, 'right'); lab('cotyledons (2, food)', cx + 40 * u, cy - 20 * u, w - 6, cy - 80 * u, 'right');
      lab('plumule (future shoot)', cx + 66 * u, cy - 10 * u, w - 6, cy - 55 * u, 'right'); lab('radicle (future root)', cx - 34 * u, cy + 2 * u, 6, cy - 80 * u, 'left'); lab('hilum (scar)', cx - 70 * u, cy + 2 * u, 6, cy + 90 * u, 'left');
    } else {
      E(cx, cy, 90 * u, 100 * u, col.s[5]); E(cx, cy, 84 * u, 94 * u, col.s[2]); E(cx, cy, 78 * u, 88 * u, col.soft);
      E(cx - 40 * u, cy + 6 * u, 24 * u, 66 * u, col.s[0]); E(cx - 30 * u, cy + 6 * u, 9 * u, 52 * u, col.s[3]);
      E(cx - 38 * u, cy + 80 * u, 8 * u, 12 * u, col.s[4]);
      lab('pericarp + seed coat (fused)', cx + 80 * u, cy - 40 * u, w - 6, cy - 100 * u, 'right'); lab('aleurone layer', cx + 78 * u, cy + 10 * u, w - 6, cy - 80 * u, 'right');
      lab('endosperm (food)', cx + 40 * u, cy + 30 * u, w - 6, cy + 4 * u, 'right'); lab('scutellum (cotyledon)', cx - 56 * u, cy - 40 * u, 6, cy - 100 * u, 'left');
      lab('coleoptile + plumule', cx - 30 * u, cy - 36 * u, 6, cy - 80 * u + 0, 'left'); lab('radicle + coleorhiza', cx - 38 * u, cy + 84 * u, 6, cy + 106 * u, 'left');
    }
  };
  go();
}
