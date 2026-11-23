// Class 11 Biology, Biological Classification: lichens are a mutualism between an alga (or cyanobacterium) and a fungus. The alga makes food by photosynthesis; the fungus gives water, minerals, a firm body and protection.
// Lichens take in sulphur dioxide from the air straight through their surface, and are very sensitive to it, so they are pollution indicators. The slider shows lichen cover on a tree as the air gets dirtier.
import { canvas, text, title, row, slider, choice, readout, arrow as arr } from '../../kit.js';
import { rr, ell, note } from '../c11b-lib.js';

export default function (host) {
  let so2 = 10, mode = 'both';
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 300, label: 'A lichen cross-section with alga and fungus, and lichen cover on a tree trunk against air pollution' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Partners', [['both', 'Alga + fungus'], ['alga', 'Alga alone'], ['fungus', 'Fungus alone']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'SO₂ in the air', min: 0, max: 100, step: 1, value: so2, fmt: (v) => v < 25 ? 'clean' : v < 60 ? 'moderate' : 'polluted', oninput: (v) => { so2 = v; go(); } });
  const cover = () => mode !== 'both' ? 0 : Math.max(0, 1 - so2 / 70);
  const go = () => { const c = cover(); ro.textContent = mode === 'alga' ? 'The alga alone dries out on a bare trunk and has no firm body to hold water or minerals.' : mode === 'fungus' ? 'The fungus alone has no way to make food and cannot live on bare bark.' : `Lichen cover is about ${Math.round(c * 100)} %. ${so2 < 25 ? 'Clean air: lichens thrive.' : so2 < 60 ? 'Some species vanish first.' : 'Heavily polluted air: lichens nearly disappear.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, 'Lichen: two partners, one body', col), lw = w - 40, x0 = 20;
    rr(ctx, x0, y0 + 8, lw, 24, 4, col.s[4], col.ink, 1.2); text(ctx, 'fungal layer (protection, water)', w / 2, y0 + 20, { color: col.ink, size: 10.5, align: 'center', weight: 600 });
    rr(ctx, x0, y0 + 36, lw, 46, 4, col.soft, col.ink, 1.2); for (let i = 0; i < 12 && mode !== 'fungus'; i++) ell(ctx, x0 + 16 + i * (lw - 32) / 11, y0 + 59 + (i % 2 ? 6 : -6), 7, 7, col.s[1], col.ink, 1, mode === 'fungus' ? 0.08 : 0.9);
    if (mode === 'fungus') text(ctx, 'no alga here', w / 2, y0 + 59, { color: col.muted, size: 11, align: 'center' });
    if (mode === 'alga') { rr(ctx, x0, y0 + 8, lw, 24, 4, col.panel, col.line, 1); text(ctx, 'no fungus: nothing to hold the alga', w / 2, y0 + 20, { color: col.muted, size: 10.5, align: 'center' }); }
    rr(ctx, x0, y0 + 86, lw, 18, 4, col.s[4], col.ink, 1.2); text(ctx, 'fungal threads fix it to the bark', w / 2, y0 + 95, { color: col.ink, size: 10, align: 'center' });
    if (mode === 'both') { arr(ctx, w * 0.3, y0 + 60, w * 0.3, y0 + 40, col.s[1], 2, 6); arr(ctx, w * 0.7, y0 + 38, w * 0.7, y0 + 56, col.s[0], 2, 6); text(ctx, 'food to fungus', w * 0.3 + 8, y0 + 70, { color: col.s[1], size: 9.5 }); text(ctx, 'water to alga', w * 0.7 + 8, y0 + 42, { color: col.s[0], size: 9.5 }); }
    const ty = y0 + 118, th = h - ty - 14, tx = w * 0.3, tw = w * 0.4;
    rr(ctx, tx, ty, tw, th, 4, col.muted, col.ink, 1.5); ctx.globalAlpha = 0.4; for (let i = 0; i < 6; i++) { ctx.fillStyle = col.ink; ctx.fillRect(tx + 6 + (i % 3) * tw / 3, ty + 8 + Math.floor(i / 3) * th / 2, 3, th / 3); } ctx.globalAlpha = 1;
    const c = cover(), n = Math.round(c * 14);
    for (let i = 0; i < n; i++) { const px = tx + 10 + ((i * 37) % 100) / 100 * (tw - 20), py = ty + 10 + ((i * 53) % 100) / 100 * (th - 24); ell(ctx, px, py, 8 + (i % 3) * 2, 6, col.s[1], col.ink, 1, 0.85); }
    text(ctx, `air: SO₂ ${so2 < 25 ? 'low' : so2 < 60 ? 'medium' : 'high'}`, 12, ty + th / 2, { color: col.muted, size: 10.5 });
    text(ctx, mode === 'both' ? `${Math.round(c * 100)} % lichen` : 'no lichen', w - 12, ty + th / 2, { color: col.s[1], size: 11, weight: 700, align: 'right' });
  };
  go();
}
