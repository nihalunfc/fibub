// Class 12 Biology, Ecosystem (step player): the five processes of decomposition of dead plant matter (detritus).
// Fragmentation (detritivores such as earthworms break detritus into small pieces), leaching (water-soluble nutrients wash into the soil),
// catabolism (bacterial and fungal enzymes break the pieces into simpler substances), humification (a dark amorphous humus that decays very slowly) and
// mineralisation (humus is slowly broken down and inorganic nutrients are released).
import { canvas, text, title, line, dot, arrow, rng } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'A pile of leaf litter on soil passing through fragmentation, leaching, catabolism, humification and mineralisation' });
  const TITLES = ['1. Fragmentation', '2. Leaching', '3. Catabolism', '4. Humification', '5. Mineralisation'];
  const NOTE = ['Detritivores such as earthworms break detritus into small pieces. More surface means faster action by microbes.', 'Water dissolves soluble nutrients from the detritus and carries them down into the soil.', 'Bacteria and fungi release enzymes that break the pieces into simpler organic substances. This is where most of the work is done, and it needs oxygen and warmth.', 'The remaining material turns into humus, a dark, jelly-like store of nutrients that decays very slowly.', 'Humus is slowly broken down by some microbes, releasing inorganic nutrients such as nitrate and phosphate that plants can take up again.'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 8, gy = top + 54, r = rng(5);
    ctx.fillStyle = col.soft; ctx.fillRect(10, gy, w - 20, 74); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(10, gy, w - 20, 74); text(ctx, 'soil', 16, gy + 66, { color: col.muted, size: 10 });
    const n = st === 0 ? 4 : 14;
    for (let i = 0; i < n; i++) { const x = 40 + (i % 7) * ((w - 80) / 7) + r() * 10, y = gy - 8 - Math.floor(i / 7) * 10, sz = st === 0 ? 24 - i * 3 : st === 1 ? 8 : st === 2 ? 5 : 3; ctx.fillStyle = st >= 3 ? col.muted : col.good; ctx.globalAlpha = st >= 3 ? 0.7 : 0.85; ctx.fillRect(x, y - sz / 2, sz, Math.max(3, sz / 2.5)); ctx.globalAlpha = 1; }
    if (st === 0) { dot(ctx, w * 0.8, gy - 18, 6, col.bad); line(ctx, [[w * 0.8, gy - 12], [w * 0.8 - 10, gy - 4]], col.bad, 3); text(ctx, 'earthworm / termite', w * 0.8, gy - 34, { color: col.bad, size: 10.5, weight: 700, align: 'center' }); }
    if (st === 1) for (let i = 0; i < 7; i++) { const x = 40 + i * ((w - 80) / 7); arrow(ctx, x, gy - 2, x, gy + 40 + (i % 3) * 8, col.s[0], 1.8, 6); if (i === 0) text(ctx, 'dissolved nutrients seep down', w / 2, gy + 66, { color: col.s[0], size: 10.5, weight: 700, align: 'center', halo: col.soft }); }
    if (st === 2) { for (let i = 0; i < 12; i++) dot(ctx, 30 + r() * (w - 60), gy - 14 + r() * 10, 2.4, col.s[2]); text(ctx, 'bacteria and fungi make enzymes', w / 2, gy - 34, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
    if (st >= 3) { ctx.fillStyle = col.ink; ctx.globalAlpha = 0.5; ctx.fillRect(10, gy - 6, w - 20, 12); ctx.globalAlpha = 1; text(ctx, 'humus (dark, amorphous)', w / 2, gy - 18, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }
    if (st === 4) for (let i = 0; i < 6; i++) { const x = 40 + i * ((w - 80) / 6); dot(ctx, x, gy + 30 + (i % 2) * 14, 3.4, col.good); line(ctx, [[x, gy + 20], [x, gy + 4]], col.good, 1.5); if (i === 0) text(ctx, 'minerals taken up by roots', w / 2, gy + 66, { color: col.good, size: 10.5, weight: 700, align: 'center', halo: col.soft }); }
    NOTE[st].match(/.{1,50}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), 14, gy + 102 + i * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
