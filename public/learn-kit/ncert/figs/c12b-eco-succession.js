// Class 12 Biology, Ecosystem (step player): ecological succession. A sere is the whole series of communities that replace one another.
// Hydrarch succession starts in water (phytoplankton, submerged, floating, reed-swamp, marsh-meadow, shrub, forest) as silt fills the pond;
// xerarch succession starts on bare rock (crustose lichens, foliose lichens, mosses, herbs, shrubs, forest). Each stage changes the habitat for the next.
// Species diversity and biomass rise to the stable climax community.
import { canvas, text, title, line, dot, row, choice, rng } from '../../kit.js';

export default function (host) {
  let st = 0, sere = 'water';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A landscape strip changing stage by stage from pioneers to forest in water or on bare rock' });
  const ctl = row(host);
  choice(ctl, 'Starts', [['water', 'In water (hydrarch)'], ['rock', 'On bare rock (xerarch)']], 'water', (v) => { sere = v; cv.redraw(); });
  const NAMES = { water: ['Phytoplankton (pioneers)', 'Submerged plants', 'Free-floating plants', 'Reed swamp', 'Marsh meadow', 'Shrubs', 'Climax forest'], rock: ['Bare rock', 'Crustose lichens (pioneers)', 'Foliose lichens', 'Mosses', 'Herbs and grasses', 'Shrubs', 'Climax forest'] };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${st + 1}. ${NAMES[sere][st]}`, col) + 8, gy = top + 92, r = rng(9);
    const water = sere === 'water' ? Math.max(0, 1 - st / 4) : 0;
    ctx.fillStyle = col.soft; ctx.fillRect(10, gy, w - 20, 40); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(10, gy, w - 20, 40); text(ctx, sere === 'water' ? 'silt and mud' : 'rock, then thin soil', 16, gy + 30, { color: col.muted, size: 10 });
    if (water > 0) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fillRect(10, gy - 70 * water, w - 20, 70 * water); ctx.globalAlpha = 1; }
    const grn = col.good;
    const tree = (x, y, s) => { line(ctx, [[x, y], [x, y - 26 * s]], col.ink, 3); dot(ctx, x, y - 34 * s, 15 * s, grn); };
    const plant = (x, y, hgt) => line(ctx, [[x, y], [x, y - hgt]], grn, 2);
    if (sere === 'water') {
      if (st >= 0 && st <= 2) for (let i = 0; i < 20; i++) dot(ctx, 20 + r() * (w - 40), gy - 62 * water + r() * 54 * water, 1.8, col.s[3]);
      if (st >= 1 && st <= 3) for (let i = 0; i < 10; i++) plant(24 + i * ((w - 48) / 9), gy, 30 * water + 10);
      if (st >= 2 && st <= 3) for (let i = 0; i < 5; i++) { ctx.fillStyle = grn; ctx.beginPath(); ctx.ellipse(40 + i * ((w - 80) / 4), gy - 70 * water, 12, 4, 0, 0, 7); ctx.fill(); }
      if (st === 3) for (let i = 0; i < 12; i++) plant(20 + (i < 6 ? i * 10 : w - 90 + (i - 6) * 10), gy, 40);
      if (st === 4) for (let i = 0; i < 26; i++) plant(20 + i * ((w - 40) / 25), gy, 14 + r() * 8);
      if (st === 5) { for (let i = 0; i < 14; i++) plant(20 + i * ((w - 40) / 13), gy, 14 + r() * 6); for (let i = 0; i < 5; i++) dot(ctx, 40 + i * ((w - 80) / 4), gy - 20, 11, grn); }
      if (st === 6) for (let i = 0; i < 5; i++) tree(36 + i * ((w - 72) / 4), gy, 1.3);
    } else {
      if (st >= 1) for (let i = 0; i < 8; i++) { ctx.fillStyle = col.warn; ctx.globalAlpha = 0.8; ctx.fillRect(24 + r() * (w - 60), gy - 4, 14, 4); ctx.globalAlpha = 1; }
      if (st >= 2) for (let i = 0; i < 8; i++) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.85; ctx.fillRect(24 + r() * (w - 60), gy - 8, 16, 7); ctx.globalAlpha = 1; }
      if (st >= 3) for (let i = 0; i < 12; i++) { ctx.fillStyle = grn; ctx.globalAlpha = 0.7; ctx.fillRect(20 + i * ((w - 40) / 11), gy - 8, 16, 8); ctx.globalAlpha = 1; }
      if (st >= 4) for (let i = 0; i < 24; i++) plant(20 + i * ((w - 40) / 23), gy, 10 + r() * 10);
      if (st >= 5) for (let i = 0; i < 5; i++) dot(ctx, 40 + i * ((w - 80) / 4), gy - 18, 11, grn);
      if (st >= 6) for (let i = 0; i < 4; i++) tree(46 + i * ((w - 92) / 3), gy, 1.5);
    }
    // biomass and diversity bars
    const by = gy + 66; text(ctx, 'species diversity and biomass', 14, by - 8, { color: col.muted, size: 10.5, weight: 700 });
    [['diversity', [10, 25, 40, 55, 75, 90, 100], col.s[0]], ['biomass', [2, 6, 14, 28, 50, 75, 100], col.s[2]]].forEach(([n, v, c], j) => { const y = by + j * 22; ctx.fillStyle = col.line; ctx.fillRect(14, y, w - 90, 12); ctx.fillStyle = c; ctx.fillRect(14, y, (w - 90) * v[st] / 100, 12); text(ctx, n, w - 70, y + 6, { color: col.ink, size: 10.5 }); });
    text(ctx, st === 6 ? 'Climax: stable, in balance with the climate' : 'Each stage changes the place for the next one', w / 2, h - 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 6); cv.redraw(); } };
}
