// Class 11 Biology, Animal Kingdom: body plans. Three switches: symmetry (none, radial, bilateral), body cavity (acoelomate: no cavity; pseudocoelomate: cavity not fully lined by mesoderm;
// coelomate: cavity fully lined by mesoderm) and segmentation (metamerism: body in repeated units). The readout names a real animal group that has the combination you build.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { ell, rr, note, poly } from '../c11b-lib.js';

const NAME = (sym, cav, seg) => {
  if (sym === 'asym') return 'Sponges (Porifera): no true symmetry, no real tissues';
  if (sym === 'radial') return cav === 'coelom' ? 'Adult starfish and sea urchins (Echinodermata): radial and coelomate' : 'Hydra, jellyfish and sea anemones (Cnidaria): radial, with only a gut cavity';
  if (cav === 'acoel') return 'Flatworms such as tapeworm and liver fluke (Platyhelminthes): bilateral, no body cavity';
  if (cav === 'pseudo') return 'Roundworms such as Ascaris (Aschelminthes): bilateral with a pseudocoelom';
  return seg ? 'Earthworm, leech, cockroach, prawn (Annelida, Arthropoda): bilateral, coelomate and segmented' : 'Snails and mussels (Mollusca): bilateral, coelomate, body not segmented';
};
export default function (host) {
  let sym = 'bi', cav = 'coelom', seg = false;
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 300, label: 'Cross-section of an animal body with switchable symmetry, body cavity and segmentation' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Symmetry', [['asym', 'None'], ['radial', 'Radial'], ['bi', 'Bilateral']], sym, (v) => { sym = v; go(); });
  choice(ctl, 'Body cavity', [['acoel', 'None (acoelomate)'], ['pseudo', 'Pseudocoelom'], ['coelom', 'True coelom']], cav, (v) => { cav = v; go(); });
  choice(ctl, 'Segmentation', [[false, 'Not segmented'], [true, 'Segmented']], seg, (v) => { seg = v; go(); });
  const go = () => { ro.textContent = NAME(sym, cav, seg); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, 'Build a body plan', col), cx = w / 2 - 36, cy = y0 + 92, rx = sym === 'bi' ? 72 : 62, ry = sym === 'bi' ? 54 : 62;
    // body outline by symmetry
    const body = (k) => { if (sym === 'asym') { ctx.beginPath(); ctx.moveTo(cx - rx * k, cy); ctx.bezierCurveTo(cx - rx * k, cy - ry * k * 1.2, cx + rx * k * 0.2, cy - ry * k * 1.3, cx + rx * k, cy - ry * k * 0.3); ctx.bezierCurveTo(cx + rx * k * 1.2, cy + ry * k, cx - rx * k * 0.4, cy + ry * k * 1.1, cx - rx * k, cy); } else { ctx.beginPath(); ctx.ellipse(cx, cy, rx * k, ry * k, 0, 0, 7); } };
    body(1); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2.5; ctx.strokeStyle = col.ink; ctx.stroke();
    text(ctx, 'ectoderm (outside)', cx, cy - ry - 10, { color: col.s[0], size: 10, weight: 700, align: 'center' });
    if (sym !== 'asym') {
      const inner = 0.78; body(inner); ctx.fillStyle = col.s[2]; ctx.globalAlpha = cav === 'acoel' ? 0.5 : 0.25; ctx.fill(); ctx.globalAlpha = 1;
      if (cav === 'acoel') { ctx.lineWidth = 1; ctx.strokeStyle = col.muted; ctx.stroke(); }
      if (cav === 'pseudo') { ctx.save(); body(inner); ctx.clip(); ctx.fillStyle = col.panel; ctx.fillRect(cx - rx, cy - ry, 2 * rx, 2 * ry); ctx.restore(); body(inner); ctx.lineWidth = 3; ctx.strokeStyle = col.s[2]; ctx.stroke(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + 0.3; ell(ctx, cx + Math.cos(a) * rx * 0.55, cy + Math.sin(a) * ry * 0.55, 5, 4, col.s[2], null, 0, 0.8); } }
      if (cav === 'coelom') { ctx.save(); body(inner); ctx.clip(); ctx.fillStyle = col.panel; ctx.fillRect(cx - rx, cy - ry, 2 * rx, 2 * ry); ctx.restore(); body(inner); ctx.lineWidth = 4; ctx.strokeStyle = col.s[2]; ctx.stroke(); body(0.5); ctx.lineWidth = 4; ctx.strokeStyle = col.s[2]; ctx.stroke(); }
      body(0.5); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; if (cav !== 'coelom') { ctx.lineWidth = 2; ctx.strokeStyle = col.s[3]; ctx.stroke(); }
      text(ctx, 'gut', cx, cy, { color: col.ink, size: 11, weight: 700, align: 'center' });
    } else { ell(ctx, cx, cy, 20, 20, col.s[3], col.ink, 1.5, 0.35); text(ctx, 'canals / pores', cx, cy + 4, { color: col.ink, size: 9.5, align: 'center' }); }
    // symmetry lines
    ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2;
    if (sym === 'bi') { ctx.beginPath(); ctx.moveTo(cx, cy - ry - 4); ctx.lineTo(cx, cy + ry + 4); ctx.stroke(); text(ctx, 'one cut gives two mirror halves', cx, cy + ry + 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' }); }
    if (sym === 'radial') { for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * (rx + 4), cy - Math.sin(a) * (ry + 4)); ctx.lineTo(cx + Math.cos(a) * (rx + 4), cy + Math.sin(a) * (ry + 4)); ctx.stroke(); } text(ctx, 'many cuts through the centre work', cx, cy + ry + 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' }); }
    if (sym === 'asym') text(ctx, 'no cut gives mirror halves', cx, cy + ry + 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    ctx.setLineDash([]);
    if (cav !== 'acoel' && sym !== 'asym') text(ctx, cav === 'coelom' ? 'coelom: lined by mesoderm all round' : 'pseudocoelom: cavity between gut and body wall', cx, cy + ry + 32, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
    // side view: segmentation
    const sx = w - 66, sy = y0 + 20;
    text(ctx, 'side view', sx, sy - 6, { color: col.muted, size: 10, weight: 700, align: 'center' });
    if (sym === 'bi') { for (let k = 0; k < 6; k++) { const yy = sy + 6 + k * 24; if (seg) { rr(ctx, sx - 18, yy, 36, 21, 8, col.s[4], col.ink, 1.5); } } if (!seg) rr(ctx, sx - 18, sy + 6, 36, 142, 16, col.s[4], col.ink, 1.5); text(ctx, 'head', sx, sy + 160, { color: col.muted, size: 10, align: 'center' }); text(ctx, seg ? 'repeated units' : 'one unit', sx, sy + 174, { color: seg ? col.s[3] : col.muted, size: 10, weight: 700, align: 'center' }); }
    else text(ctx, 'n/a', sx, sy + 60, { color: col.muted, size: 11, align: 'center' });
    const ly = y0 + 2 * 62 + 96; [['ectoderm', col.s[0]], ['mesoderm', col.s[2]], ['endoderm (gut)', col.s[3]]].forEach(([n, c], i) => { rr(ctx, 14 + i * ((w - 28) / 3), h - 36, 10, 10, 2, c, null); text(ctx, n, 28 + i * ((w - 28) / 3), h - 31, { color: col.ink, size: 10.5 }); });
  };
  go();
}
