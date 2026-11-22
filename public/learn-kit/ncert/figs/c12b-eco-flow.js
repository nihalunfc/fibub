// Class 12 Biology, Ecosystem (step player): the flow of energy. Of the sunlight reaching a plant less than half is photosynthetically active radiation (PAR);
// plants capture only about 2-10 % of PAR. What is left after plant respiration is net primary production. Each feeding step passes on about 10 % of the
// energy it receives. Energy flows one way (sun, producers, consumers, heat) while matter cycles.
// Figures here are the usual round values used to explain the idea.
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'The energy of sunlight narrowing down through plants and animals, with most lost as heat' });
  const TITLES = ['1. Sunlight arrives', '2. Only part is usable light', '3. Plants capture a small share', '4. Plants use some themselves', '5. 10 % passes to consumers', '6. Decomposers recycle the dead matter'];
  const VALS = [100, 50, 2.5, 1.5, 0.15, 0.05];
  const NOTE = ['Say 100 units of sunlight fall on a leaf.', 'Less than 50 % is photosynthetically active radiation (PAR): the rest is the wrong colour or is heat.', 'Plants take up only about 2 to 10 % of PAR. Here 5 % of 50 gives 2.5 units: gross primary production.', 'The plant burns some of it in its own respiration. Net primary production here is 1.5 units.', 'A herbivore gets about 10 % of that: 0.15 units. A carnivore gets 10 % of that again.', 'Dead plants and animals pass their energy to decomposers, which release it as heat. The energy never returns to the sun.'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 10, bh = 34, gap = 16, x0 = 24;
    const rows = [['Sunlight', 100, col.warn], ['PAR (usable light)', 50, col.s[3]], ['Captured by plants (GPP)', 2.5, col.s[2]], ['Net production (NPP)', 1.5, col.good], ['Herbivores', 0.15, col.s[0]], ['Decomposers', 1.5, col.s[4]]];
    rows.forEach(([n, v, c], i) => { if (i > st) return; const y = top + i * (bh + gap), ww = Math.max(6, (w - 2 * x0 - 40) * Math.pow(v / 100, 0.35)); ctx.fillStyle = c; ctx.globalAlpha = i === st ? 0.95 : 0.55; ctx.fillRect(x0, y, ww, bh); ctx.globalAlpha = 1; text(ctx, n, x0 + 6, y + 10, { color: col.ink, size: 11, weight: 700, halo: col.panel }); text(ctx, i === 5 ? 'dead matter from every level' : v + ' units', x0 + 6, y + 24, { color: col.ink, size: 10.5, halo: col.panel }); if (i > 0 && i === st) arrow(ctx, x0 + 12, y - gap + 2, x0 + 12, y - 2, col.ink, 2, 7); });
    NOTE[st].match(/.{1,52}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), 14, h - 52 + i * 14, { color: col.ink, size: 11 }));
    void VALS;
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 5); cv.redraw(); } };
}
