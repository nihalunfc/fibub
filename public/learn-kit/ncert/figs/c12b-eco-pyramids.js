// Class 12 Biology, Ecosystem: pyramids of number, of biomass and of energy for three ecosystems (round illustrative numbers, not field data).
// Number and biomass pyramids can be inverted (one tree feeds thousands of insects; in the sea tiny phytoplankton have less standing biomass than the
// zooplankton and fish that eat them, because they reproduce so fast). The energy pyramid is always upright.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let eco = 'grass', kind = 'number';
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 280, label: 'A pyramid of number, biomass or energy for a grassland, a tree or the sea, showing which are upright and which are inverted' });
  const ctl = row(host), ro = readout(host);
  const D = {
    grass: { name: 'Grassland', lv: ['Grass', 'Grasshoppers', 'Frogs', 'Snakes'], number: [50000, 4000, 300, 10], biomass: [800, 100, 12, 1.5], energy: [10000, 1000, 100, 10], note: 'Grassland: all three pyramids are upright.' },
    tree: { name: 'Tree', lv: ['Tree', 'Insects', 'Small birds', 'Hawk'], number: [1, 20000, 300, 2], biomass: [1000, 60, 8, 1], energy: [10000, 1000, 100, 10], note: 'A single tree supports thousands of insects, so the pyramid of NUMBER is inverted in the middle (but its biomass is upright).' },
    sea: { name: 'Sea', lv: ['Phytoplankton', 'Zooplankton', 'Small fish', 'Large fish'], number: [1000000, 50000, 2000, 50], biomass: [4, 21, 11, 4], energy: [10000, 1000, 100, 10], note: 'In the sea, phytoplankton have a small STANDING biomass but make food fast, so the pyramid of BIOMASS is inverted.' },
  };
  choice(ctl, 'Ecosystem', [['grass', 'Grassland'], ['tree', 'Tree'], ['sea', 'Sea']], 'grass', (v) => { eco = v; go(); });
  choice(ctl, 'Pyramid of', [['number', 'Number'], ['biomass', 'Biomass'], ['energy', 'Energy']], 'number', (v) => { kind = v; go(); });
  const go = () => { const d = D[eco], v = d[kind], up = v[0] > v[1]; ro.textContent = `${d.name}, pyramid of ${kind}: ${up ? 'upright' : 'inverted'}. ${kind === 'energy' ? 'The energy pyramid is always upright because energy is lost at every step (about 90 %).' : d.note} (The numbers are round illustrative values.)`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = D[eco], v = d[kind], top = title(ctx, `${d.name}: pyramid of ${kind}`, col) + 8, bh = (h - top - 26) / 4, mx = Math.max(...v);
    v.forEach((x, i) => { const y = top + (3 - i) * bh, ww = 104 + (w - 164) * Math.pow(x / mx, 0.42), xx = w / 2 - ww / 2;
      ctx.fillStyle = col.s[[3, 0, 2, 4][i]]; ctx.globalAlpha = 0.85; ctx.fillRect(xx, y + 3, ww, bh - 6); ctx.globalAlpha = 1;
      text(ctx, d.lv[i], w / 2, y + bh / 2 - 7, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); text(ctx, x.toLocaleString('en-IN') + (kind === 'biomass' ? ' g/m²' : kind === 'energy' ? ' J' : ''), w / 2, y + bh / 2 + 8, { color: col.ink, size: 10.5, align: 'center', halo: col.panel }); });
    text(ctx, v[0] > v[1] ? 'upright' : 'inverted', w - 10, h - 10, { color: v[0] > v[1] ? col.good : col.bad, size: 11, weight: 800, align: 'right' });
  };
  go();
}
