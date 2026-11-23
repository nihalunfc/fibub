// Class 12 Biology, Biodiversity and Conservation: the three levels of biodiversity. Genetic diversity: variation within one species (many varieties of rice or mango; Rauwolfia
// vinca plants from different regions differ in the amount of the drug reserpine). Species diversity: the number and variety of species in an area (richness). Ecological diversity:
// the variety of ecosystems, such as desert, rain forest, mangrove, coral reef and wetland.
import { canvas, text, title, dot, row, choice, readout, rng } from '../../kit.js';

export default function (host) {
  let lv = 'gen';
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Three levels of biodiversity: variants of one species, many species, many ecosystems' });
  const ctl = row(host), ro = readout(host);
  const INFO = { gen: 'Genetic diversity: the same species with different genes. A medicinal plant, Rauwolfia vomitoria, grows in different Indian regions, and the plants differ in how much of the drug reserpine they make. India has tens of thousands of traditional rice varieties.', sp: 'Species diversity: how many different species live in an area. The Western Ghats have a greater amphibian species diversity than the Eastern Ghats. A forest with 40 tree species is richer than a plantation of one.', eco: 'Ecological diversity: the variety of ecosystems in a region. India, with its deserts, rain forests, mangroves, coral reefs, alpine meadows and estuaries, has a much greater ecosystem diversity than Norway.' };
  choice(ctl, 'Level', [['gen', 'Genetic'], ['sp', 'Species'], ['eco', 'Ecological']], 'gen', (v) => { lv = v; go(); });
  const go = () => { ro.textContent = INFO[lv]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { gen: 'Within one species', sp: 'Between species', eco: 'Between ecosystems' }[lv], col) + 14, r = rng(7), cy = top + (h - top) * 0.45;
    if (lv === 'gen') { for (let i = 0; i < 12; i++) { const x = 40 + (i % 6) * ((w - 80) / 5), y = cy - 28 + Math.floor(i / 6) * 56; dot(ctx, x, y, 14, col.s[Math.floor(r() * 5)], col.ink); text(ctx, 'rice', x, y, { color: col.panel, size: 9, weight: 700, align: 'center' }); } text(ctx, 'one species, many gene variants', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' }); }
    if (lv === 'sp') { const names = ['tree', 'fern', 'frog', 'bird', 'beetle', 'moss', 'deer', 'orchid']; names.forEach((n, i) => { const x = 40 + (i % 4) * ((w - 80) / 3), y = cy - 28 + Math.floor(i / 4) * 56; ctx.fillStyle = col.s[i % 8]; ctx.beginPath(); ctx.rect(x - 22, y - 14, 44, 28); ctx.fill(); text(ctx, n, x, y, { color: col.panel, size: 10, weight: 700, align: 'center' }); }); text(ctx, 'many different species', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' }); }
    if (lv === 'eco') { ['desert', 'rain forest', 'mangrove', 'coral reef', 'alpine', 'wetland'].forEach((n, i) => { const x = 30 + (i % 3) * ((w - 60) / 3), y = cy - 36 + Math.floor(i / 3) * 62, ww = (w - 60) / 3 - 8; ctx.fillStyle = col.s[(i * 2 + 1) % 8]; ctx.globalAlpha = 0.7; ctx.fillRect(x, y, ww, 50); ctx.globalAlpha = 1; text(ctx, n, x + ww / 2, y + 25, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); }); text(ctx, 'many kinds of habitat', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' }); }
  };
  go();
}
