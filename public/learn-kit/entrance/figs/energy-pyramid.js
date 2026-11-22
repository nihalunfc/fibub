// Ecosystem: ecological pyramids. The energy pyramid follows the 10 per cent law (change the transfer efficiency and
// the producer energy); the number and biomass pyramids use typical example values and show the upright and
// inverted shapes NEET asks about. Bar widths are drawn on a log scale so that every level stays visible.
import { canvas, text, row, slider, choice, readout, fmt } from '../../kit.js';

const FIXED = {
  grass: { name: 'Numbers: grassland', unit: 'individuals', levels: [['Grass', 5842424], ['Grasshoppers, insects', 708624], ['Spiders, birds', 354904], ['Hawks', 3]], note: 'upright: many small producers support fewer and fewer consumers' },
  tree: { name: 'Numbers: one tree', unit: 'individuals', levels: [['One tree', 1], ['Insects', 3000], ['Small birds', 80], ['Hawk', 1]], note: 'inverted at the base: one large tree feeds many insects' },
  sea: { name: 'Biomass: sea', unit: 'g dry mass per m²', levels: [['Phytoplankton', 4], ['Zooplankton', 21], ['Fish', 25]], note: 'inverted: phytoplankton are few at any moment but multiply very fast, so a small standing crop feeds a larger fish biomass' },
};
export default function (host) {
  let kind = 'energy', eff = 10, E0 = 10000;
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'An ecological pyramid of energy, numbers or biomass' });
  const ctl = row(host);
  choice(ctl, 'Pyramid', [['energy', 'Energy'], ['grass', 'Numbers: grassland'], ['tree', 'Numbers: tree'], ['sea', 'Biomass: sea']], kind, (v) => { kind = v; cv.redraw(); show(); });
  const ctl2 = row(host);
  slider(ctl2, { label: 'Transfer efficiency', min: 5, max: 20, step: 1, value: eff, fmt: (v) => `${v}%`, oninput: (v) => { eff = v; cv.redraw(); show(); } });
  slider(ctl2, { label: 'Producer energy', min: 1000, max: 100000, step: 1000, value: E0, fmt: (v) => `${fmt(v)} J`, oninput: (v) => { E0 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const levels = () => (kind === 'energy'
    ? ['Producers', 'Herbivores', 'Carnivores', 'Top carnivores'].map((l, i) => [l, E0 * (eff / 100) ** i])
    : FIXED[kind].levels);
  const show = () => {
    const L = levels();
    out.innerHTML = kind === 'energy'
      ? `With ${eff}% passed on at each step: ${L.map(([l, v]) => `${l} ${fmt(v, 3)} J`).join(' → ')}. The rest is lost as heat in respiration at each level, so an energy pyramid is always upright.`
      : `<b>${FIXED[kind].name}</b>: ${L.map(([l, v]) => `${l} ${fmt(v, 4)}`).join(', ')} (${FIXED[kind].unit}); ${FIXED[kind].note}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const L = levels(), n = L.length, top = 30, bh = Math.min(46, (h - top - 12) / n);
    const vals = L.map(([, v]) => Math.log10(v + 1)), vmax = Math.max(...vals), maxW = w - 40;
    text(ctx, kind === 'energy' ? 'Energy pyramid' : FIXED[kind].name, 10, 16, { color: col.ink, size: 12.5, weight: 700 });
    L.forEach(([lab, v], i) => {
      const bw = Math.max(36, (vals[i] / vmax) * maxW), y = h - 12 - (i + 1) * bh, x = (w - bw) / 2;
      ctx.fillStyle = col.s[i % 8]; ctx.globalAlpha = 0.25; ctx.fillRect(x, y, bw, bh - 4); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.s[i % 8]; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, bh - 4);
      text(ctx, `${lab}: ${fmt(v, 3)}`, w / 2, y + (bh - 4) / 2, { color: col.ink, size: 11, align: 'center', weight: 600 });
    });
  };
  cv.redraw(); show();
}
